// HOSTALL Main Application Logic
// Enhanced with real-time Supabase integration

console.log('📱 Loading HOSTALL App...');

// Global variables
let hostelsData = [];
let isLoading = false;

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
    
    const supabaseClient = window.getSupabaseClient();
    if (!supabaseClient) {
      const connected = window.initializeSupabase();
      if (!connected) {
        throw new Error('Failed to connect to database');
      }
    }

    // Fetch hostels from Supabase  
    const { data: hostels, error } = await window.getSupabaseClient()
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
        <button class="view-details-btn" onclick="openHostelDetailsPage(${hostel.id})">
          View Details
        </button>
      </div>
    </div>
  `;
}

// Open hostel details page
async function openHostelDetailsPage(hostelId) {
  try {
    // Get hostel details from Supabase
    const client = window.getSupabaseClient();
    if (!client) {
      throw new Error('Database connection not available');
    }

    const { data: hostel, error } = await client
      .from('hostels')
      .select('*')
      .eq('id', hostelId)
      .single();

    if (error || !hostel) {
      throw new Error('Hostel not found');
    }

    // Create hostel details page content
    const detailsContent = createHostelDetailsContent(hostel);
    document.getElementById('hostel-details-content').innerHTML = detailsContent;
    
    // Show hostel details page
    showSection('hostel-details');
  } catch (error) {
    console.error('Error loading hostel details:', error);
    alert('Unable to load hostel details. Please try again.');
  }
}

// Create hostel details page content
function createHostelDetailsContent(hostel) {
  const facilities = hostel.facilities ? 
    (Array.isArray(hostel.facilities) ? hostel.facilities.join(', ') : hostel.facilities) : 
    'Not specified';

  const imageUrl = hostel.img || getPlaceholderImage(hostel);
  
  return `
    <div class="bg-white rounded-lg shadow-lg overflow-hidden">
      <div class="relative">
        <img src="${imageUrl}" alt="${hostel.name}" class="w-full h-64 object-cover">
        <div class="absolute top-4 right-4">
          <span class="px-3 py-1 rounded-full text-sm font-medium text-white ${hostel.gender === 'Male' ? 'bg-blue-500' : hostel.gender === 'Female' ? 'bg-pink-500' : 'bg-gray-500'}">
            ${hostel.gender || 'Any'} Only
          </span>
        </div>
      </div>
      
      <div class="p-6">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">${hostel.name || 'Unnamed Hostel'}</h1>
        
        <div class="grid md:grid-cols-2 gap-6">
          <div>
            <h3 class="text-lg font-semibold mb-3">Basic Information</h3>
            <div class="space-y-2">
              <div class="flex items-center">
                <span class="w-6 h-6 mr-3">📍</span>
                <span>${hostel.location || 'Location not specified'}</span>
              </div>
              <div class="flex items-center">
                <span class="w-6 h-6 mr-3">📞</span>
                <span>${hostel.phone || 'Phone not provided'}</span>
              </div>
              <div class="flex items-center">
                <span class="w-6 h-6 mr-3">📱</span>
                <span>${hostel.whatsapp || hostel.phone || 'WhatsApp not provided'}</span>
              </div>
              <div class="flex items-center">
                <span class="w-6 h-6 mr-3">👥</span>
                <span>${hostel.gender || 'Any'} Gender</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 class="text-lg font-semibold mb-3">Facilities</h3>
            <p class="text-gray-600">${facilities}</p>
          </div>
        </div>
        
        <div class="mt-6">
          <h3 class="text-lg font-semibold mb-3">Additional Information</h3>
          <p class="text-gray-600">${hostel.details || 'No additional details available'}</p>
        </div>
        
        ${hostel.map ? `
          <div class="mt-6">
            <h3 class="text-lg font-semibold mb-3">Location Map</h3>
            <a href="${hostel.map}" target="_blank" class="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              <span class="mr-2">🗺️</span>
              View on Google Maps
            </a>
          </div>
        ` : ''}
        
        <div class="mt-8 flex flex-wrap gap-4">
          <button onclick="callHostel('${hostel.phone}')" class="flex-1 bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition-colors">
            📞 Call Now
          </button>
          <button onclick="openWhatsAppChat('${hostel.whatsapp || hostel.phone}')" class="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors">
            💬 WhatsApp
          </button>
        </div>
      </div>
    </div>
  `;
}

// Call hostel function
function callHostel(phoneNumber) {
  if (phoneNumber && phoneNumber !== 'Phone not provided') {
    window.location.href = `tel:${phoneNumber}`;
  } else {
    alert('Phone number not available');
  }
}

// Open WhatsApp chat
function openWhatsAppChat(phoneNumber) {
  if (phoneNumber && phoneNumber !== 'WhatsApp not provided') {
    const message = 'Hi! I found your hostel on HOSTALL and I\'m interested in learning more about accommodation options.';
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^\d]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  } else {
    alert('WhatsApp number not available');
  }
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
  const supabaseClient = window.getSupabaseClient();
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
  
  // Initialize Supabase first
  window.initializeSupabase();
  
  // Setup search and filters
  setupSearchAndFilters();
  
  // Load data
  await loadHostelsFromSupabase();
  setupRealtimeSubscription();
  
  console.log('✅ HOSTALL App initialized');
});

// Export functions for global access
window.showSection = showSection;
window.toggleMobileMenu = toggleMobileMenu;
window.scrollToHostels = scrollToHostels;
window.openWhatsApp = openWhatsAppDirect;
window.openWhatsAppDirect = openWhatsAppDirect;
window.openChatModal = openChatModal;
window.closeChatModal = closeChatModal;
window.submitChatMessage = submitChatMessage;
window.showHostelDetails = showHostelDetails;
window.loadHostelsFromSupabase = loadHostelsFromSupabase;
window.toggleFAQ = toggleFAQ;
window.showAdminTab = showAdminTab;
window.showAddHostelForm = showAddHostelForm;
window.replyViaWhatsApp = replyViaWhatsApp;
window.replyViaEmail = replyViaEmail;
window.markAsResolved = markAsResolved;

// FAQ functionality
function toggleFAQ(element) {
  const answer = element.nextElementSibling;
  const icon = element.querySelector('i');
  
  answer.classList.toggle('hidden');
  icon.classList.toggle('rotate-180');
}

// Admin tab functionality
function showAdminTab(tabName) {
  // Hide all tab contents
  document.querySelectorAll('.admin-tab-content').forEach(content => {
    content.classList.add('hidden');
  });
  
  // Remove active class from all tabs
  document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.classList.remove('active');
    tab.classList.add('border-transparent', 'text-gray-500');
    tab.classList.remove('border-purple-500', 'text-purple-600');
  });
  
  // Show selected tab content
  document.getElementById(`admin-${tabName}-tab`).classList.remove('hidden');
  
  // Add active class to selected tab
  event.target.classList.add('active', 'border-purple-500', 'text-purple-600');
  event.target.classList.remove('border-transparent', 'text-gray-500');
}

// Chat modal functionality
function openChatModal() {
  document.getElementById('chat-modal').classList.remove('hidden');
}

function closeChatModal() {
  document.getElementById('chat-modal').classList.add('hidden');
  document.getElementById('chat-form').reset();
}

// Submit chat message
async function submitChatMessage(event) {
  event.preventDefault();
  
  const name = document.getElementById('chat-name').value;
  const contact = document.getElementById('chat-contact').value;
  const message = document.getElementById('chat-message').value;
  
  try {
    // Save message to Supabase
    const client = window.getSupabaseClient();
    if (client) {
      await client.from('messages').insert({
        name: name,
        contact: contact,
        message: message,
        status: 'unread',
        assigned_to: null,
        created_at: new Date().toISOString()
      });
    }
    
    alert('Message sent successfully! We will contact you soon.');
    closeChatModal();
  } catch (error) {
    console.error('Error sending message:', error);
    alert('Failed to send message. Please try WhatsApp instead.');
  }
}

// Direct WhatsApp function
function openWhatsAppDirect() {
  const phoneNumber = '+923331536041';
  const message = 'Hi! I found your hostels on HOSTALL. I would like to know more about available rooms.';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
}

// Load messages for admin
async function loadAdminMessages() {
  try {
    const client = window.getSupabaseClient();
    if (!client) return;

    const { data: messages, error } = await client
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading messages:', error);
      return;
    }

    const messagesList = document.getElementById('admin-messages-list');
    if (!messagesList) return;

    if (!messages || messages.length === 0) {
      messagesList.innerHTML = '<p class="text-gray-500">No messages yet.</p>';
      return;
    }

    messagesList.innerHTML = messages.map(message => `
      <div class="message-item ${message.status === 'unread' ? 'border-blue-200 bg-blue-50' : ''}">
        <div class="message-header">
          <div>
            <h4 class="font-semibold">${message.name}</h4>
            <p class="text-sm text-gray-500">${message.contact}</p>
          </div>
          <div class="text-right">
            <span class="text-xs text-gray-400">${new Date(message.created_at).toLocaleString()}</span>
            <div class="mt-1">
              <span class="px-2 py-1 text-xs rounded-full ${message.status === 'unread' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}">
                ${message.status}
              </span>
            </div>
          </div>
        </div>
        <p class="text-gray-700 mb-3">${message.message}</p>
        <div class="message-actions">
          <button onclick="replyViaWhatsApp('${message.contact}')" class="action-btn whatsapp-btn">
            Reply via WhatsApp
          </button>
          <button onclick="replyViaEmail('${message.contact}')" class="action-btn email-btn">
            Reply via Email
          </button>
          <button onclick="assignMessage(${message.id})" class="action-btn assign-btn">
            Assign to Me
          </button>
          <button onclick="markMessageResolved(${message.id}, this)" class="action-btn resolve-btn">
            Mark Resolved
          </button>
        </div>
      </div>
    `).join('');

    // Update message count
    const unreadCount = messages.filter(m => m.status === 'unread').length;
    const newMessagesElement = document.getElementById('new-messages');
    if (newMessagesElement) {
      newMessagesElement.textContent = unreadCount;
    }
  } catch (error) {
    console.error('Error loading admin messages:', error);
  }
}

// Assign message to admin
async function assignMessage(messageId) {
  try {
    const client = window.getSupabaseClient();
    const currentUser = window.adminManager?.currentUser;
    
    if (!client || !currentUser) return;

    await client
      .from('messages')
      .update({ 
        assigned_to: currentUser.email,
        status: 'assigned'
      })
      .eq('id', messageId);

    loadAdminMessages();
  } catch (error) {
    console.error('Error assigning message:', error);
  }
}

// Mark message as resolved
async function markMessageResolved(messageId, button) {
  try {
    const client = window.getSupabaseClient();
    if (!client) return;

    await client
      .from('messages')
      .update({ status: 'resolved' })
      .eq('id', messageId);

    button.textContent = 'Resolved';
    button.disabled = true;
    button.classList.add('cursor-not-allowed');
    
    loadAdminMessages();
  } catch (error) {
    console.error('Error marking message as resolved:', error);
  }
}

// Privacy Policy and Terms functions
function openPrivacyPolicy() {
  document.getElementById('privacy-policy-modal').classList.remove('hidden');
  // Load privacy policy content from admin settings
  loadPrivacyPolicyContent();
}

function closePrivacyPolicy() {
  document.getElementById('privacy-policy-modal').classList.add('hidden');
}

function openTermsOfService() {
  document.getElementById('terms-modal').classList.remove('hidden');
  // Load terms content from admin settings
  loadTermsContent();
}

function closeTermsOfService() {
  document.getElementById('terms-modal').classList.add('hidden');
}

async function loadPrivacyPolicyContent() {
  try {
    const client = window.getSupabaseClient();
    if (!client) return;

    const { data, error } = await client
      .from('site_settings')
      .select('privacy_policy')
      .single();

    const content = document.getElementById('privacy-policy-content');
    if (data && data.privacy_policy) {
      content.innerHTML = data.privacy_policy;
    } else {
      content.innerHTML = '<p>Privacy policy content will be updated soon.</p>';
    }
  } catch (error) {
    console.error('Error loading privacy policy:', error);
  }
}

async function loadTermsContent() {
  try {
    const client = window.getSupabaseClient();
    if (!client) return;

    const { data, error } = await client
      .from('site_settings')
      .select('terms_of_service')
      .single();

    const content = document.getElementById('terms-content');
    if (data && data.terms_of_service) {
      content.innerHTML = data.terms_of_service;
    } else {
      content.innerHTML = '<p>Terms of service content will be updated soon.</p>';
    }
  } catch (error) {
    console.error('Error loading terms of service:', error);
  }
}

// Admin functions
function showAddHostelForm() {
  alert('Add hostel form will be implemented here');
}

function replyViaWhatsApp(phone) {
  const message = 'Hi! Thank you for your inquiry about our hostels. How can we help you?';
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
}

function replyViaEmail(email) {
  const subject = 'Reply from HOSTALL - Hostel Inquiry';
  const body = 'Hi!\n\nThank you for your inquiry about our hostels. We would be happy to help you find the perfect accommodation.\n\nBest regards,\nHOSTALL Team';
  const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.open(mailtoUrl, '_blank');
}