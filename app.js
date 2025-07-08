// HOSTALL Main Application Logic
// Enhanced with real-time Supabase integration

console.log('📱 Loading HOSTALL App...');

// Global variables
let supabaseClient = null;
let hostelsData = [];
let isLoading = false;

// Initialize Supabase connection
async function initializeSupabaseConnection() {
  try {
    console.log('🔌 Initializing Supabase connection...');
    
    if (typeof window.supabase === 'undefined') {
      console.error('❌ Supabase library not loaded');
      return false;
    }

    const supabaseUrl = 'https://pjnqhdhlcgrrmfzscswv.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqbnFoZGhsY2dycm1menNjc3d2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5NTg3NDMsImV4cCI6MjA2NjUzNDc0M30.UVaJXabJDPMSHgDzUk3tOEv9sAFSjqSRNEYroypqyGs';

    supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);
    
    // Test connection
    const { data, error } = await supabaseClient.from('hostels').select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Supabase connection test failed:', error);
      return false;
    }
    
    console.log('✅ Supabase connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Supabase initialization error:', error);
    return false;
  }
}

// Load hostels from Supabase
async function loadHostelsFromSupabase() {
  if (isLoading) {
    console.log('⏳ Already loading hostels...');
    return;
  }
  
  isLoading = true;
  console.log('🏠 Loading hostels from Supabase...');
  
  try {
    // Show loading state
    showLoadingState();
    
    if (!supabaseClient) {
      const connected = await initializeSupabaseConnection();
      if (!connected) {
        throw new Error('Failed to connect to database');
      }
    }

    // Fetch hostels from Supabase
    const { data: hostels, error } = await supabaseClient
      .from('hostels')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching hostels:', error);
      throw error;
    }

    if (!hostels || hostels.length === 0) {
      console.warn('⚠️ No hostels found in database');
      showNoHostelsMessage();
      return;
    }

    console.log(`✅ Loaded ${hostels.length} hostels from database`);
    hostelsData = hostels;
    
    // Cache the data
    localStorage.setItem('hostels_data', JSON.stringify(hostels));
    localStorage.setItem('hostels_last_updated', Date.now().toString());
    
    // Display hostels
    displayHostels(hostels);
    
  } catch (error) {
    console.error('❌ Failed to load hostels:', error);
    showErrorMessage('Failed to load hostels. Please check your internet connection and try again.');
  } finally {
    isLoading = false;
    hideLoadingState();
  }
}

// Display hostels in the UI
function displayHostels(hostels) {
  const publicList = document.getElementById('public-list');
  const hostelsGrid = document.getElementById('hostels-grid');
  
  if (!publicList && !hostelsGrid) {
    console.error('❌ Hostel containers not found');
    return;
  }
  
  console.log(`🎨 Displaying ${hostels.length} hostels`);
  
  const hostelHTML = hostels.map(hostel => createHostelCard(hostel)).join('');
  
  if (publicList) {
    publicList.innerHTML = hostelHTML;
  }
  
  if (hostelsGrid) {
    hostelsGrid.innerHTML = hostelHTML;
  }
}

// Create individual hostel card HTML
function createHostelCard(hostel) {
  const genderClass = hostel.gender?.toLowerCase() || 'any';
  const imageUrl = hostel.img || getPlaceholderImage(hostel);
  
  return `
    <div class="hostel-card">
      <div class="hostel-image-container">
        <img src="${imageUrl}" 
             class="hostel-image" 
             alt="${hostel.name || 'Hostel'}"
             onerror="this.src='https://via.placeholder.com/300x200/6b7280/ffffff?text=Hostel+Image'">
        <div class="hostel-gender-badge ${genderClass}">${hostel.gender || 'Any'}</div>
      </div>
      <div class="hostel-content">
        <h3 class="hostel-name">${hostel.name || 'Unnamed Hostel'}</h3>
        <div class="hostel-location-only">
          📍 ${getShortLocation(hostel.location)}
        </div>
        <div class="hostel-contact" style="font-size: 0.9rem; color: #6b7280; margin: 0.5rem 0;">
          ${hostel.phone ? `📞 ${hostel.phone}` : ''}
        </div>
        <button class="view-details-btn" onclick="showHostelDetails(${JSON.stringify(hostel).replace(/"/g, '&quot;')})">
          View Details
        </button>
      </div>
    </div>
  `;
}

// Show hostel details popup
function showHostelDetails(hostel) {
  const facilities = hostel.facilities ? 
    (Array.isArray(hostel.facilities) ? hostel.facilities.join(', ') : hostel.facilities) : 
    'Not specified';

  const details = `
🏠 HOSTEL DETAILS

📍 Name: ${hostel.name || 'Not specified'}
👥 Gender: ${hostel.gender || 'Any'}
🏠 Location: ${hostel.location || 'Not specified'}
📞 Phone: ${hostel.phone || 'Not provided'}
📱 WhatsApp: ${hostel.whatsapp || hostel.phone || 'Not provided'}
🏢 Facilities: ${facilities}

Additional Information:
${hostel.details || 'No additional details'}

${hostel.map ? '🗺️ View on map: ' + hostel.map : '❌ Map not provided'}
  `;

  alert(details);
}

// Helper functions
function getPlaceholderImage(hostel) {
  const genderColor = hostel.gender === 'Female' ? 'ff69b4' : 
                     hostel.gender === 'Male' ? '4169e1' : '6b7280';
  return `https://via.placeholder.com/300x200/${genderColor}/ffffff?text=${encodeURIComponent(hostel.name || 'Hostel')}`;
}

function getShortLocation(location) {
  if (!location) return 'Location not specified';
  return location.split(',')[0] || location;
}

// UI State Management
function showLoadingState() {
  const loadingElement = document.getElementById('loading-hostels');
  if (loadingElement) {
    loadingElement.style.display = 'block';
  }
}

function hideLoadingState() {
  const loadingElement = document.getElementById('loading-hostels');
  if (loadingElement) {
    loadingElement.style.display = 'none';
  }
}

function showNoHostelsMessage() {
  const publicList = document.getElementById('public-list');
  const hostelsGrid = document.getElementById('hostels-grid');
  
  const message = `
    <div style="grid-column: 1/-1; text-align: center; padding: 2rem; background: #f9fafb; border-radius: 10px; margin: 1rem;">
      <h3 style="color: #dc2626; margin-bottom: 1rem;">⚠️ No Hostels Found</h3>
      <p style="color: #6b7280; margin-bottom: 1rem;">No hostels are currently available in the database.</p>
      <button onclick="loadHostelsFromSupabase()" style="background: #8B5CF6; color: white; border: none; padding: 0.5rem 1rem; border-radius: 5px; cursor: pointer;">
        🔄 Refresh
      </button>
    </div>
  `;
  
  if (publicList) publicList.innerHTML = message;
  if (hostelsGrid) hostelsGrid.innerHTML = message;
}

function showErrorMessage(message) {
  const publicList = document.getElementById('public-list');
  const hostelsGrid = document.getElementById('hostels-grid');
  
  const errorHTML = `
    <div style="grid-column: 1/-1; text-align: center; padding: 2rem; background: #fef2f2; border: 1px solid #fecaca; border-radius: 10px; margin: 1rem;">
      <h3 style="color: #dc2626; margin-bottom: 1rem;">❌ Error Loading Hostels</h3>
      <p style="color: #6b7280; margin-bottom: 1rem;">${message}</p>
      <button onclick="loadHostelsFromSupabase()" style="background: #dc2626; color: white; border: none; padding: 0.5rem 1rem; border-radius: 5px; cursor: pointer;">
        🔄 Try Again
      </button>
    </div>
  `;
  
  if (publicList) publicList.innerHTML = errorHTML;
  if (hostelsGrid) hostelsGrid.innerHTML = errorHTML;
}

// Navigation functions
function showSection(sectionName) {
  // Hide all sections
  document.querySelectorAll('.section').forEach(section => {
    section.classList.add('hidden');
  });

  // Show target section
  const targetSection = document.getElementById(sectionName);
  if (targetSection) {
    targetSection.classList.remove('hidden');
  }

  // Update navigation links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${sectionName}`) {
      link.classList.add('active');
    }
  });

  // Hide mobile menu
  const mobileMenu = document.querySelector('.mobile-menu');
  if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
    mobileMenu.classList.add('hidden');
  }

  // Load hostels if viewing hostels section
  if (sectionName === 'hostels' && hostelsData.length === 0) {
    loadHostelsFromSupabase();
  }
}

function toggleMobileMenu() {
  const mobileMenu = document.querySelector('.mobile-menu');
  if (mobileMenu) {
    mobileMenu.classList.toggle('hidden');
  }
}

function scrollToHostels() {
  const hostelsSection = document.getElementById('public-list');
  if (hostelsSection) {
    hostelsSection.scrollIntoView({ behavior: 'smooth' });
  }
}

function openWhatsApp() {
  const phoneNumber = '+923331536041';
  const message = 'Hi! I found your hostels on HOSTALL. I would like to know more about available rooms.';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
}

// Real-time subscription setup
function setupRealtimeSubscription() {
  if (!supabaseClient) {
    console.warn('⚠️ Supabase client not available for real-time subscription');
    return;
  }

  console.log('🔄 Setting up real-time subscription...');
  
  const channel = supabaseClient
    .channel('hostels_changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'hostels'
    }, (payload) => {
      console.log('🔄 Real-time update received:', payload);
      // Reload hostels when changes are detected
      loadHostelsFromSupabase();
    })
    .subscribe((status) => {
      console.log('📡 Real-time subscription status:', status);
    });
}

// Search and filter functionality
function setupSearchAndFilters() {
  const searchInput = document.getElementById('search-input');
  const genderFilter = document.getElementById('gender-filter');
  
  if (searchInput) {
    searchInput.addEventListener('input', filterHostels);
  }
  
  if (genderFilter) {
    genderFilter.addEventListener('change', filterHostels);
  }
}

function filterHostels() {
  const searchTerm = document.getElementById('search-input')?.value.toLowerCase() || '';
  const genderFilter = document.getElementById('gender-filter')?.value || 'all';
  
  if (hostelsData.length === 0) {
    return;
  }
  
  const filteredHostels = hostelsData.filter(hostel => {
    const matchesSearch = !searchTerm || 
      hostel.name?.toLowerCase().includes(searchTerm) ||
      hostel.location?.toLowerCase().includes(searchTerm) ||
      hostel.details?.toLowerCase().includes(searchTerm);
    
    const matchesGender = genderFilter === 'all' || hostel.gender === genderFilter;
    
    return matchesSearch && matchesGender;
  });
  
  displayHostels(filteredHostels);
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', async function() {
  console.log('🚀 HOSTALL App initializing...');
  
  // Setup search and filters
  setupSearchAndFilters();
  
  // Initialize Supabase and load data
  const connected = await initializeSupabaseConnection();
  if (connected) {
    await loadHostelsFromSupabase();
    setupRealtimeSubscription();
  } else {
    showErrorMessage('Unable to connect to the database. Please check your internet connection.');
  }
  
  console.log('✅ HOSTALL App initialized');
});

// Export functions for global access
window.showSection = showSection;
window.toggleMobileMenu = toggleMobileMenu;
window.scrollToHostels = scrollToHostels;
window.openWhatsApp = openWhatsApp;
window.showHostelDetails = showHostelDetails;
window.loadHostelsFromSupabase = loadHostelsFromSupabase;