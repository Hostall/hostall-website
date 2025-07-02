// Direct Data Synchronization Solution
// This script bypasses real-time features and directly loads data from Supabase

// Configuration (using existing values from your site)
const SUPABASE_CONFIG = {
  url: 'https://pjnqhdhlcgrrmfzscswv.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqbnFoZGhsY2dycm1menNjc3d2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU0MDIzNDQsImV4cCI6MjA1MDk3ODM0NH0.7-RuwfLOueTXdxPVFr3mIEOAJjAHw1C0VjQyy9DZ1D0'
};

// Global variables
let directSupabase = null;
let syncInterval = null;
let lastSyncTimestamp = null;

// Initialize direct Supabase client
function initializeDirectClient() {
  try {
    // Create a fresh Supabase client directly
    directSupabase = supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
    console.log('Direct Supabase client initialized');
    return true;
  } catch (error) {
    console.error('Failed to initialize direct Supabase client:', error);
    return false;
  }
}

// Load all hostels directly from Supabase
async function loadAllHostelsDirectly() {
  try {
    if (!directSupabase) {
      if (!initializeDirectClient()) {
        throw new Error('Direct Supabase client unavailable');
      }
    }
    
    // Show loading indicator
    showSyncIndicator('loading');
    
    // Fetch all hostels from Supabase
    const { data: hostels, error } = await directSupabase
      .from('hostels')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    console.log(`Loaded ${hostels.length} hostels directly from Supabase`);
    
    // Save to localStorage as cache with timestamp
    localStorage.setItem('hostels_data', JSON.stringify(hostels));
    lastSyncTimestamp = Date.now();
    localStorage.setItem('last_sync_timestamp', lastSyncTimestamp);
    
    // Try to display hostels using existing functions
    if (typeof displayHostels === 'function') {
      // Use the main display function
      displayHostels(hostels);
      console.log('Displayed hostels using displayHostels function');
      
      // Show success indicator
      showSyncIndicator('success');
      return hostels;
    } else if (typeof displayAllHostels === 'function') {
      // Pass the data to the original display function
      displayAllHostels(hostels);
      console.log('Displayed hostels using existing function');
      
      // Show success indicator
      showSyncIndicator('success');
      return hostels;
    } else if (typeof refreshHostelsList === 'function') {
      // Try alternative display function
      refreshHostelsList(hostels);
      console.log('Displayed hostels using refresh function');
      
      // Show success indicator
      showSyncIndicator('success');
      return hostels;
    } else {
      // Manual display fallback - display directly to both possible containers
      displayHostelsManually(hostels);
      console.log('Displayed hostels using manual fallback');
      
      // Show success indicator
      showSyncIndicator('success');
      return hostels;
    }
  } catch (error) {
    console.error('Error loading hostels directly:', error);
    showSyncIndicator('error');
    
    // Try to load from localStorage as fallback
    const cachedData = localStorage.getItem('hostels_data');
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    return [];
  }
}

// Save hostel directly to Supabase
async function saveHostelDirectly(hostelData) {
  try {
    if (!directSupabase) {
      if (!initializeDirectClient()) {
        throw new Error('Direct Supabase client unavailable');
      }
    }
    
    // Show loading indicator
    showSyncIndicator('loading');
    
    let result;
    
    // Check if we're updating or creating
    if (hostelData.id) {
      // Update existing hostel
      const { data, error } = await directSupabase
        .from('hostels')
        .update(hostelData)
        .eq('id', hostelData.id)
        .select();
        
      if (error) throw error;
      result = data;
      
    } else {
      // Create new hostel
      const { data, error } = await directSupabase
        .from('hostels')
        .insert(hostelData)
        .select();
        
      if (error) throw error;
      result = data;
    }
    
    // After successful save, reload all hostels
    await loadAllHostelsDirectly();
    
    // Show success indicator
    showSyncIndicator('success');
    
    // Return the result
    return result;
  } catch (error) {
    console.error('Error saving hostel directly:', error);
    showSyncIndicator('error');
    throw error;
  }
}

// Delete hostel directly from Supabase
async function deleteHostelDirectly(hostelId) {
  try {
    if (!directSupabase) {
      if (!initializeDirectClient()) {
        throw new Error('Direct Supabase client unavailable');
      }
    }
    
    // Show loading indicator
    showSyncIndicator('loading');
    
    // Delete the hostel
    const { error } = await directSupabase
      .from('hostels')
      .delete()
      .eq('id', hostelId);
      
    if (error) throw error;
    
    // After successful delete, reload all hostels
    await loadAllHostelsDirectly();
    
    // Show success indicator
    showSyncIndicator('success');
    
    return true;
  } catch (error) {
    console.error('Error deleting hostel directly:', error);
    showSyncIndicator('error');
    throw error;
  }
}

// Setup periodic sync
function setupPeriodicSync(intervalMs = 30000) {
  // Clear any existing interval
  if (syncInterval) {
    clearInterval(syncInterval);
  }
  
  // Set up new interval
  syncInterval = setInterval(async () => {
    console.log('Running periodic sync...');
    await loadAllHostelsDirectly();
  }, intervalMs);
  
  console.log(`Periodic sync set up with ${intervalMs}ms interval`);
}

// Show sync indicator with different states
function showSyncIndicator(state) {
  // Remove existing indicator
  const existingIndicator = document.getElementById('direct-sync-indicator');
  if (existingIndicator) {
    existingIndicator.remove();
  }
  
  // Create new indicator
  const indicator = document.createElement('div');
  indicator.id = 'direct-sync-indicator';
  
  // Set base styles
  indicator.style.position = 'fixed';
  indicator.style.bottom = '20px';
  indicator.style.left = '20px';
  indicator.style.padding = '10px 15px';
  indicator.style.borderRadius = '5px';
  indicator.style.zIndex = '9999';
  indicator.style.transition = 'all 0.3s ease';
  
  // Set state-specific styles and content
  switch (state) {
    case 'loading':
      indicator.style.background = 'rgba(59, 130, 246, 0.9)';
      indicator.style.color = 'white';
      indicator.innerHTML = '⏳ Synchronizing data...';
      break;
    case 'success':
      indicator.style.background = 'rgba(16, 185, 129, 0.9)';
      indicator.style.color = 'white';
      indicator.innerHTML = '✅ Data synchronized!';
      setTimeout(() => {
        indicator.remove();
      }, 3000);
      break;
    case 'error':
      indicator.style.background = 'rgba(239, 68, 68, 0.9)';
      indicator.style.color = 'white';
      indicator.innerHTML = '❌ Sync failed!';
      setTimeout(() => {
        indicator.remove();
      }, 5000);
      break;
    case 'warning':
      indicator.style.background = 'rgba(245, 158, 11, 0.9)';
      indicator.style.color = 'white';
      indicator.innerHTML = '⚠️ Synced with warnings';
      setTimeout(() => {
        indicator.remove();
      }, 4000);
      break;
  }
  
  // Add to document
  document.body.appendChild(indicator);
}

// Create and add sync button to page (only in admin dashboard)
function addDirectSyncButton() {
  // Never add button to home page - only when specifically in admin mode
  // Check multiple conditions to ensure we're truly in admin
  const currentHash = window.location.hash;
  const currentPage = window.location.pathname;
  
  // Admin indicators
  const hasAdminInURL = currentHash.includes('admin') || currentPage.includes('admin');
  const hasAdminPanel = document.querySelector('.admin-panel') || 
                       document.querySelector('#admin-panel') ||
                       document.querySelector('[data-section="admin"]');
  const hasAdminLogin = document.getElementById('admin-login');
  const hasAdminSections = document.querySelector('.admin-section');
  
  // Check if user is logged in as admin
  const isLoggedInAdmin = localStorage.getItem('admin_token') || 
                         sessionStorage.getItem('admin_logged_in') ||
                         localStorage.getItem('isAdminLoggedIn');
  
  // Only add if we're definitely in admin context
  const isDefinitelyAdmin = (hasAdminInURL || hasAdminPanel || hasAdminLogin || hasAdminSections) && isLoggedInAdmin;
  
  if (!isDefinitelyAdmin) {
    console.log('❌ Not in admin context, skipping sync button');
    
    // Remove button if it exists and we're not in admin
    const existingBtn = document.getElementById('direct-sync-button');
    if (existingBtn) {
      existingBtn.remove();
      console.log('🗑️ Removed sync button from non-admin page');
    }
    return;
  }
  
  // Check if button already exists
  if (document.getElementById('direct-sync-button')) return;
  
  // Create button
  const syncBtn = document.createElement('button');
  syncBtn.id = 'direct-sync-button';
  syncBtn.innerHTML = '🔄 Admin Sync';
  
  // Style the button
  syncBtn.style.position = 'fixed';
  syncBtn.style.bottom = '20px';
  syncBtn.style.right = '20px';
  syncBtn.style.backgroundColor = '#EF4444'; // Red for admin
  syncBtn.style.color = 'white';
  syncBtn.style.border = 'none';
  syncBtn.style.borderRadius = '50px';
  syncBtn.style.padding = '10px 15px';
  syncBtn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
  syncBtn.style.cursor = 'pointer';
  syncBtn.style.fontFamily = 'Inter, sans-serif';
  syncBtn.style.fontSize = '14px';
  syncBtn.style.fontWeight = '500';
  syncBtn.style.zIndex = '9999';
  
  // Add click event
  syncBtn.onclick = loadAllHostelsDirectly;
  
  // Add to document
  document.body.appendChild(syncBtn);
  console.log('✅ Direct sync button added to admin area');
}

// Override existing functions to use direct approach
function overrideExistingFunctions() {
  // Override loadHostelsFromSupabase if it exists
  if (typeof loadHostelsFromSupabase === 'function') {
    console.log('Overriding loadHostelsFromSupabase function');
    window.originalLoadHostels = loadHostelsFromSupabase;
    window.loadHostelsFromSupabase = loadAllHostelsDirectly;
  }
  
  // Override saveHostelToSupabase if it exists
  if (typeof saveHostelToSupabase === 'function') {
    console.log('Overriding saveHostelToSupabase function');
    window.originalSaveHostel = saveHostelToSupabase;
    window.saveHostelToSupabase = saveHostelDirectly;
  }
  
  // Override saveHostel if it exists
  if (typeof saveHostel === 'function') {
    console.log('Overriding saveHostel function');
    window.originalSaveHostel = saveHostel;
    window.saveHostel = saveHostelDirectly;
  }
  
  // Override deleteHostel if it exists
  if (typeof deleteHostel === 'function') {
    console.log('Overriding deleteHostel function');
    window.originalDeleteHostel = deleteHostel;
    window.deleteHostel = deleteHostelDirectly;
  }
  
  console.log('Function overrides complete');
}

// Create a modal to show sync details
function showSyncDetailsModal() {
  // Create modal
  const modal = document.createElement('div');
  modal.className = 'sync-details-modal';
  modal.style.position = 'fixed';
  modal.style.top = '0';
  modal.style.left = '0';
  modal.style.right = '0';
  modal.style.bottom = '0';
  modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  modal.style.display = 'flex';
  modal.style.justifyContent = 'center';
  modal.style.alignItems = 'center';
  modal.style.zIndex = '10000';
  
  // Get cached data
  const hostelsData = localStorage.getItem('hostels_data');
  const lastSync = localStorage.getItem('last_sync_timestamp');
  const hostels = hostelsData ? JSON.parse(hostelsData) : [];
  
  // Modal content
  modal.innerHTML = `
    <div style="background: white; padding: 20px; border-radius: 8px; max-width: 500px; width: 90%;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
        <h3 style="margin: 0; font-size: 18px;">🔄 Sync Status</h3>
        <button id="close-sync-modal" style="background: none; border: none; font-size: 20px; cursor: pointer;">×</button>
      </div>
      
      <div style="margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <span>Last synchronized:</span>
          <span>${lastSync ? new Date(parseInt(lastSync)).toLocaleString() : 'Never'}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <span>Hostels in cache:</span>
          <span>${hostels.length}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <span>Connection status:</span>
          <span style="color: ${directSupabase ? '#10B981' : '#EF4444'}">
            ${directSupabase ? '✅ Connected' : '❌ Disconnected'}
          </span>
        </div>
      </div>
      
      <div style="display: flex; gap: 10px;">
        <button id="force-sync-button" style="flex: 1; padding: 10px; background: #10B981; color: white; border: none; border-radius: 5px; cursor: pointer;">
          Force Sync Now
        </button>
        <button id="clear-cache-button" style="flex: 1; padding: 10px; background: #EF4444; color: white; border: none; border-radius: 5px; cursor: pointer;">
          Clear Cache
        </button>
      </div>
    </div>
  `;
  
  // Add to body
  document.body.appendChild(modal);
  
  // Event listeners
  document.getElementById('close-sync-modal').addEventListener('click', () => {
    modal.remove();
  });
  
  document.getElementById('force-sync-button').addEventListener('click', async () => {
    try {
      await loadAllHostelsDirectly();
      modal.remove();
    } catch (error) {
      console.error('Force sync failed:', error);
    }
  });
  
  document.getElementById('clear-cache-button').addEventListener('click', () => {
    localStorage.removeItem('hostels_data');
    localStorage.removeItem('last_sync_timestamp');
    modal.remove();
    alert('Cache cleared. Click "Direct Sync" to reload data.');
  });
}

// Force load hostels immediately for home page
function forceLoadHostelsForHomePage() {
  // Check if we're on a page that should show hostels
  const publicList = document.getElementById('public-list');
  const hostelGrid = document.querySelector('.hostel-grid');
  
  if (publicList || hostelGrid) {
    console.log('Home page detected, loading hostels immediately...');
    loadAllHostelsDirectly();
  }
}

// Initialize everything
function initializeDirectSync() {
  console.log('Initializing direct Supabase sync...');
  
  // Initialize Supabase client
  initializeDirectClient();
  
  // Override existing functions to work better
  overrideExistingFunctions();
  
  // For home page, just load data without sync button
  const isHomePage = document.getElementById('public-list') || 
                    (!window.location.hash.includes('admin') && 
                     document.querySelector('.hostel-grid'));
  
  if (isHomePage) {
    console.log('🏠 Home page detected - loading hostels without sync button');
    
    // Force immediate load for home page
    forceLoadHostelsForHomePage();
    
    // Set up less frequent auto-refresh for home page (every 2 minutes)
    setupPeriodicSync(120000);
    
    // Additional loads to ensure data appears
    setTimeout(() => loadAllHostelsDirectly(), 1000);
    setTimeout(() => loadAllHostelsDirectly(), 3000);
    setTimeout(() => loadAllHostelsDirectly(), 5000);
    
  } else {
    // Admin area - add sync button and more frequent updates
    console.log('🔧 Admin area detected');
    
    // Add sync button for admin
    setTimeout(() => addDirectSyncButton(), 1000);
    
    // More frequent sync for admin (every 30 seconds)
    setupPeriodicSync(30000);
    
    // Add right-click action to show details modal if button exists
    setTimeout(() => {
      const syncBtn = document.getElementById('direct-sync-button');
      if (syncBtn) {
        syncBtn.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          showSyncDetailsModal();
        });
      }
    }, 1500);
  }
  
  console.log('Direct sync initialization complete');
}

// Start when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeDirectSync);

// Manual sync function for direct calls
window.manualDirectSync = loadAllHostelsDirectly;

// Manual display function for fallback
function displayHostelsManually(hostels) {
  // Try both possible container elements
  const containers = [
    document.querySelector('.hostel-grid'),
    document.querySelector('#public-list'),
    document.querySelector('#hostelGrid')
  ];
  
  containers.forEach(container => {
    if (container) {
      container.innerHTML = '';
      
      if (hostels.length === 0) {
        container.innerHTML = '<div style="text-align: center; grid-column: 1/-1; padding: 2rem;"><h3>No hostels found</h3><p>There are no hostels available at the moment. Please check back later.</p></div>';
        return;
      }
      
      // Create hostel cards
      hostels.forEach((hostel, index) => {
        const hostelCard = document.createElement('div');
        hostelCard.className = 'hostel-card';
        
        // Handle image with better fallback
        let imageUrl = hostel.img || hostel.image;
        if (!imageUrl || imageUrl === 'null' || imageUrl === null) {
          // Use a hostel-themed placeholder
          const genderColor = hostel.gender === 'Female' ? 'ff69b4' : hostel.gender === 'Male' ? '4169e1' : '6b7280';
          imageUrl = `https://via.placeholder.com/300x200/${genderColor}/ffffff?text=${encodeURIComponent(hostel.name || 'Hostel')}`;
        }
        
        // Get first part of location for cleaner display
        const locationDisplay = (hostel.location || hostel.address || 'Location not specified')
          .split(',')[0].trim();
        
        hostelCard.innerHTML = `
          <div class="hostel-image-container">
            <img src="${imageUrl}" class="hostel-image" alt="${hostel.name}" 
                 onerror="this.src='https://via.placeholder.com/300x200/6b7280/ffffff?text=Hostel+Image'">
            <div class="hostel-gender-badge ${hostel.gender ? hostel.gender.toLowerCase() : ''}">
              ${hostel.gender || 'Any'}
            </div>
          </div>
          <div class="hostel-content">
            <h3 class="hostel-name">${hostel.name || 'Unnamed Hostel'}</h3>
            <div class="hostel-location-only">
              📍 ${locationDisplay}
            </div>
            <div class="hostel-contact" style="font-size: 0.9rem; color: #6b7280; margin: 0.5rem 0;">
              ${hostel.phone ? `📞 ${hostel.phone}` : ''}
            </div>
            <button class="view-details-btn" data-hostel-index="${index}">View Details</button>
          </div>
        `;
        container.appendChild(hostelCard);
      });
      
      // Add click event listeners to view details buttons
      const detailButtons = container.querySelectorAll('.view-details-btn');
      detailButtons.forEach(button => {
        button.addEventListener('click', function() {
          const hostelIndex = this.getAttribute('data-hostel-index');
          showHostelDetailsManually(hostels[hostelIndex]);
        });
      });
      
      console.log(`Manually displayed ${hostels.length} hostels in container:`, container);
    }
  });
  
  // Update results count if element exists
  const resultsCount = document.getElementById('results-count');
  if (resultsCount) {
    resultsCount.textContent = `${hostels.length} hostels found`;
  }
}

// Manual hostel details display
function showHostelDetailsManually(hostel) {
  const facilities = hostel.facilities ? 
    (Array.isArray(hostel.facilities) ? hostel.facilities.join(', ') : hostel.facilities) : 
    'Not specified';
  
  const roomPrices = hostel.room_prices ? 
    (Array.isArray(hostel.room_prices) ? 
      hostel.room_prices.map(price => `${price.type}: ${price.price} ${price.currency || 'PKR'} ${price.per ? 'per ' + price.per : ''}`).join('\n') : 
      hostel.room_prices) : 
    'Not specified';
  
  const details = `
HOSTEL DETAILS

Name: ${hostel.name}
Gender: ${hostel.gender}
Location: ${hostel.location || 'Not specified'}
Phone: ${hostel.phone || 'Not provided'}
WhatsApp: ${hostel.whatsapp || 'Not provided'}
Facilities: ${facilities}

Room Pricing:
${roomPrices}

Additional Details:
${hostel.details || 'No additional details'}

${hostel.map ? 'View on map: ' + hostel.map : 'Map not provided'}
  `;
  
  alert(details);
}

// Export functions for external use
window.directSync = {
  loadHostels: loadAllHostelsDirectly,
  saveHostel: saveHostelDirectly,
  deleteHostel: deleteHostelDirectly,
  showDetails: showSyncDetailsModal,
  displayManually: displayHostelsManually
};