// Supabase Configuration
const SUPABASE_CONFIG = {
  url: 'https://pjnqhdhlcgrrmfzscswv.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqbnFoZGhsY2dycm1menNjc3d2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU0MDIzNDQsImV4cCI6MjA1MDk3ODM0NH0.7-RuwfLOueTXdxPVFr3mIEOAJjAHw1C0VjQyy9DZ1D0'
};

// Initialize Supabase client
let supabase;
try {
  if (typeof window !== 'undefined' && window.supabase) {
    supabase = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
  }
} catch (error) {
  console.error('Failed to initialize Supabase:', error);
}

// Enhanced Security Configuration
const SECURITY_CONFIG = {
  // Enhanced input validation patterns
  EMAIL_PATTERN: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PHONE_PATTERN: /^\+92[0-9]{10}$/, // Pakistani phone format
  NAME_PATTERN: /^[a-zA-Z\s]{2,50}$/,
  PASSWORD_PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  URL_PATTERN: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
  
  // Content sanitization
  ALLOWED_HTML_TAGS: ['br', 'p', 'strong', 'em'],
  MAX_MESSAGE_LENGTH: 1000,
  MAX_NAME_LENGTH: 50,
  MAX_DETAILS_LENGTH: 5000,
  
  // Rate limiting (with server-side validation)
  MAX_REQUESTS_PER_MINUTE: 10,
  MAX_LOGIN_ATTEMPTS: 5,
  LOGIN_LOCKOUT_TIME: 15 * 60 * 1000, // 15 minutes in milliseconds
  requestCount: 0,
  loginAttempts: 0,
  lastLoginAttemptTime: 0,
  lastRequestTime: Date.now(),
  
  // Session security
  SESSION_TIMEOUT: 2 * 60 * 60 * 1000, // 2 hours in milliseconds
  
  // Content security
  ENABLE_CSP: true,
  CSP_POLICY: "default-src 'self'; script-src 'self' https://cdn.jsdelivr.net https://unpkg.com https://www.googletagmanager.com https://www.google-analytics.com https://pagead2.googlesyndication.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://pjnqhdhlcgrrmfzscswv.supabase.co wss://pjnqhdhlcgrrmfzscswv.supabase.co https://www.google-analytics.com; frame-src 'self' https://www.google.com;",
  
  // Data protection
  SENSITIVE_FIELDS: ['password', 'password_hash', 'credit_card', 'phone', 'whatsapp'],
  
  // API Security
  API_KEY_PREFIX: 'team-hostall-', // Used to verify API key format
  
  // Two-Factor Authentication
  TOTP_WINDOW: 1, // Allow 1 time step before/after current time
  TOTP_STEP: 30, // 30-second time step
  BACKUP_CODES_COUNT: 10, // Number of backup recovery codes
};

// Global variable to track subscription status
window.realtimeStatus = {
  hostelSubscription: null,
  isConnected: false,
  lastUpdate: null
};

// Real-time subscription for hostels
function setupHostelRealtimeSubscription() {
  if (!supabase) {
    console.warn('Supabase not available for real-time subscription');
    return;
  }

  console.log('🔄 Setting up real-time subscription for hostels...');
  
  try {
    const hostelSubscription = supabase
      .channel('hostels_realtime')
      .on('postgres_changes', {
        event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
        schema: 'public',
        table: 'hostels'
      }, (payload) => {
        console.log('🔄 Real-time hostel change detected:', payload);
        
        // Update real-time status
        window.realtimeStatus.lastUpdate = new Date().toISOString();
        window.realtimeStatus.isConnected = true;
        
        // Handle different types of changes
        switch (payload.eventType) {
          case 'INSERT':
            console.log('✅ New hostel added:', payload.new);
            // Show notification to user
            showNotification('✅ New hostel added!', 'success');
            break;
          case 'UPDATE':
            console.log('📝 Hostel updated:', payload.new);
            showNotification('📝 Hostel updated!', 'info');
            break;
          case 'DELETE':
            console.log('🗑️ Hostel deleted:', payload.old);
            showNotification('🗑️ Hostel deleted!', 'info');
            break;
        }
        
        // Immediately refresh the hostel display
        setTimeout(() => {
          loadHostelsFromSupabase();
        }, 500); // Small delay to ensure database is consistent
      })
      .subscribe((status) => {
        console.log('📡 Subscription status changed:', status);
        
        if (status === 'SUBSCRIBED') {
          console.log('✅ Real-time subscription for hostels is ACTIVE');
          window.realtimeStatus.isConnected = true;
          showNotification('📡 Real-time sync is active!', 'success');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Real-time subscription error');
          window.realtimeStatus.isConnected = false;
          setupPollingFallback();
        } else if (status === 'TIMED_OUT') {
          console.warn('⚠️ Real-time subscription timed out');
          window.realtimeStatus.isConnected = false;
          setupPollingFallback();
        } else if (status === 'CLOSED') {
          console.warn('⚠️ Real-time subscription closed');
          window.realtimeStatus.isConnected = false;
          // Try to reconnect after 5 seconds
          setTimeout(() => {
            console.log('🔄 Attempting to reconnect...');
            setupHostelRealtimeSubscription();
          }, 5000);
        }
      });
      
    // Store subscription globally for cleanup and status tracking
    window.realtimeStatus.hostelSubscription = hostelSubscription;
    window.hostelSubscription = hostelSubscription; // Backward compatibility
    
  } catch (error) {
    console.error('❌ Error setting up real-time subscription:', error);
    window.realtimeStatus.isConnected = false;
    // Fallback to polling if real-time fails
    setupPollingFallback();
  }
}

// Function to show notifications to users
function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    z-index: 10000;
    max-width: 300px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    transition: all 0.3s ease;
    opacity: 0;
    transform: translateX(100%);
  `;
  
  // Set background color based on type
  switch(type) {
    case 'success':
      notification.style.background = '#10B981';
      break;
    case 'error':
      notification.style.background = '#EF4444';
      break;
    case 'warning':
      notification.style.background = '#F59E0B';
      break;
    default:
      notification.style.background = '#3B82F6';
  }
  
  notification.textContent = message;
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Auto remove after 4 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 4000);
}

// Fallback polling mechanism
function setupPollingFallback() {
  console.log('🔄 Setting up polling fallback (every 5 seconds)...');
  showNotification('📡 Using backup sync mode', 'warning');
  
  // Clear any existing polling interval
  if (window.pollingInterval) {
    clearInterval(window.pollingInterval);
  }
  
  window.pollingInterval = setInterval(() => {
    console.log('🔄 Polling for hostel updates...');
    loadHostelsFromSupabase();
  }, 5000); // Check every 5 seconds for better responsiveness
}

// Initialize real-time subscription when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Wait a bit for Supabase to initialize
  setTimeout(() => {
    setupHostelRealtimeSubscription();
  }, 2000);
});

// Also setup on window load as backup
window.addEventListener('load', () => {
  setTimeout(() => {
    if (!window.realtimeStatus.hostelSubscription) {
      console.log('🔄 Backup attempt to setup real-time subscription...');
      setupHostelRealtimeSubscription();
    }
  }, 3000);
});

// Enhanced function to show real-time status
function showRealtimeStatus() {
  console.log('📡 Real-time Status:', {
    connected: window.realtimeStatus.isConnected,
    lastUpdate: window.realtimeStatus.lastUpdate,
    subscription: !!window.realtimeStatus.hostelSubscription
  });
}

// Enhanced secure input validation and sanitization
function validateAndSanitizeInput(input, type) {
  if (!input || typeof input !== 'string') return null;
  
  // Advanced XSS prevention
  input = input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/data:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/expression\s*\(/gi, '')
    .replace(/eval\s*\(/gi, '')
    .replace(/url\s*\(/gi, 'url(')
    .replace(/<iframe/gi, '&lt;iframe')
    .replace(/<embed/gi, '&lt;embed');
  
  // Trim and limit length
  input = input.trim();
  
  switch (type) {
    case 'email':
      if (!SECURITY_CONFIG.EMAIL_PATTERN.test(input)) return null;
      return input.toLowerCase();
      
    case 'phone':
      // Format for Pakistani phone numbers +92XXXXXXXXXX
      let cleanPhone = input.replace(/\s+|-/g, ''); // Remove spaces and dashes
      if (!SECURITY_CONFIG.PHONE_PATTERN.test(cleanPhone)) return null;
      return cleanPhone;
      
    case 'name':
      if (!SECURITY_CONFIG.NAME_PATTERN.test(input)) return null;
      return input.substring(0, SECURITY_CONFIG.MAX_NAME_LENGTH);
      
    case 'password':
      // Don't sanitize passwords, just validate strength
      if (!SECURITY_CONFIG.PASSWORD_PATTERN.test(input)) return null;
      return input;
      
    case 'message':
      // Only allow specific HTML tags
      let sanitizedMessage = input;
      const disallowedTags = /<(?!br>|\/br>|p>|\/p>|strong>|\/strong>|em>|\/em>)[^>]+>/gi;
      sanitizedMessage = sanitizedMessage.replace(disallowedTags, '');
      return sanitizedMessage.substring(0, SECURITY_CONFIG.MAX_MESSAGE_LENGTH);
      
    case 'url':
      if (!SECURITY_CONFIG.URL_PATTERN.test(input)) return null;
      // Ensure URL is http or https
      if (!/^https?:\/\//i.test(input)) {
        input = 'https://' + input;
      }
      return input;
      
    case 'details':
      // Sanitize HTML in details field
      let sanitizedDetails = input;
      const detailsDisallowedTags = /<(?!br>|\/br>|p>|\/p>|strong>|\/strong>|em>|\/em>)[^>]+>/gi;
      sanitizedDetails = sanitizedDetails.replace(detailsDisallowedTags, '');
      return sanitizedDetails.substring(0, SECURITY_CONFIG.MAX_DETAILS_LENGTH);
      
    default:
      // For any other input, strip all HTML and limit length
      return input.replace(/<[^>]*>/g, '').substring(0, 500);
  }
}

// Function to load hostels from Supabase
async function loadHostelsFromSupabase() {
  try {
    // Check if we're offline first
    if (!navigator.onLine) {
      console.log('Currently offline, using cached data');
      const cachedData = localStorage.getItem('hostels_cache');
      if (cachedData) {
        console.log('Using cached hostel data');
        displayHostels(JSON.parse(cachedData));
      } else {
        // Final fallback to legacy localStorage
        loadHostelsFromLocalStorage();
      }
      return;
    }
    
    // Fetch hostels from Supabase with retry logic
    const maxRetries = 3;
    let retryCount = 0;
    let hostels = null;
    let error = null;
    
    while (retryCount < maxRetries) {
      const result = await supabase
        .from('hostels')
        .select('*')
        .order('created_at', { ascending: false });
      
      error = result.error;
      
      if (!error) {
        hostels = result.data;
        break;
      }
      
      retryCount++;
      console.log(`Retry attempt ${retryCount} to fetch hostels...`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
    }
    
    if (error) {
      console.error('Error fetching hostels after retries:', error.message);
      // Fallback to localStorage if Supabase fails
      const cachedData = localStorage.getItem('hostels_cache');
      if (cachedData) {
        console.log('Using cached hostel data');
        displayHostels(JSON.parse(cachedData));
      } else {
        // Final fallback to legacy localStorage
        loadHostelsFromLocalStorage();
      }
      return;
    }
    
    if (hostels && hostels.length > 0) {
      console.log(`Loaded ${hostels.length} hostels from Supabase`);
      
      // Cache the data for offline use
      localStorage.setItem('hostels_cache', JSON.stringify(hostels));
      localStorage.setItem('hostels_last_sync', Date.now().toString());
      
      // Display hostels
      displayHostels(hostels);
    } else {
      console.log('No hostels found in Supabase');
      displayHostels([]);
    }
  } catch (error) {
    console.error('Error loading hostels from Supabase:', error);
    
    // Fallback to cached data or localStorage
    const cachedData = localStorage.getItem('hostels_cache');
    if (cachedData) {
      console.log('Using cached hostel data');
      displayHostels(JSON.parse(cachedData));
    } else {
      loadHostelsFromLocalStorage();
    }
  }
}

// Function to display hostels in the UI
function displayHostels(hostels) {
  const publicList = document.getElementById('public-list');
  const adminList = document.getElementById('admin-list');
  
  // Display for public (home page)
  if (publicList) {
    if (!hostels || hostels.length === 0) {
      publicList.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: #666;">
          <h3>No hostels available at the moment</h3>
          <p>Please check back later for new listings.</p>
        </div>
      `;
    } else {
      publicList.innerHTML = hostels.map(hostel => `
        <div class="hostel-card">
          <div class="hostel-image">
            ${hostel.img ? 
              `<img src="${hostel.img}" alt="${hostel.name}" onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">` : 
              `<div class="placeholder-image">📷 No Image</div>`
            }
          </div>
          <div class="hostel-info">
            <h3>${hostel.name}</h3>
            <div class="hostel-details">
              <div class="detail-item">
                <span class="detail-label">Gender:</span>
                <span class="detail-value ${hostel.gender.toLowerCase()}">${hostel.gender}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Location:</span>
                <span class="detail-value">${hostel.location || 'Not specified'}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Details:</span>
                <span class="detail-value">${hostel.details || 'No details provided'}</span>
              </div>
            </div>
            <div class="hostel-actions">
              ${hostel.phone ? `<a href="tel:${hostel.phone}" class="btn-contact">📞 Call</a>` : ''}
              ${hostel.whatsapp ? `<a href="https://wa.me/${hostel.whatsapp.replace(/[^0-9]/g, '')}" class="btn-whatsapp" target="_blank">💬 WhatsApp</a>` : ''}
              ${hostel.map ? `<a href="${hostel.map}" class="btn-map" target="_blank">📍 View Map</a>` : ''}
            </div>
          </div>
        </div>
      `).join('');
    }
  }
  
  // Display for admin
  if (adminList) {
    if (!hostels || hostels.length === 0) {
      adminList.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 2rem; color: #666;">
            No hostels found. Click "Add New Hostel" to create your first listing.
          </td>
        </tr>
      `;
    } else {
      adminList.innerHTML = hostels.map(hostel => `
        <tr>
          <td>${hostel.name}</td>
          <td><span class="badge badge-${hostel.gender.toLowerCase()}">${hostel.gender}</span></td>
          <td>${hostel.location || 'Not specified'}</td>
          <td>${hostel.phone || 'Not provided'}</td>
          <td>
            <button onclick="editHostel(${hostel.id})" class="btn-edit">✏️ Edit</button>
            <button onclick="deleteHostelFromSupabase(${hostel.id})" class="btn-delete">🗑️ Delete</button>
          </td>
        </tr>
      `).join('');
    }
  }
}

// Save hostel to Supabase
async function saveHostelToSupabase() {
  const name = validateAndSanitizeInput(document.getElementById('hostel-name')?.value, 'name');
  const gender = document.getElementById('hostel-gender')?.value;
  const location = validateAndSanitizeInput(document.getElementById('hostel-location')?.value, 'details');
  const details = validateAndSanitizeInput(document.getElementById('hostel-details')?.value, 'details');
  const map = validateAndSanitizeInput(document.getElementById('hostel-map')?.value, 'url');
  const phone = validateAndSanitizeInput(document.getElementById('hostel-phone')?.value, 'phone');
  const whatsapp = validateAndSanitizeInput(document.getElementById('hostel-whatsapp')?.value, 'phone');
  const imgInput = document.getElementById('hostel-img');
  
  if (!name || !gender) {
    alert('Please fill in at least the hostel name and gender');
    return false;
  }
  
  const editingId = document.getElementById('editing-hostel-id')?.value;
  
  try {
    let hostelData = {
      name: name,
      gender: gender,
      location: location,
      details: details,
      map: map,
      phone: phone,
      whatsapp: whatsapp,
      updated_at: new Date().toISOString()
    };
    
    // Handle image upload
    if (imgInput?.files[0]) {
      const file = imgInput.files[0];
      const reader = new FileReader();
      
      await new Promise((resolve, reject) => {
        reader.onload = function(e) {
          hostelData.img = e.target.result;
          resolve();
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }
    
    let result;
    if (editingId) {
      // Update existing hostel
      result = await supabase
        .from('hostels')
        .update(hostelData)
        .eq('id', editingId)
        .select();
    } else {
      // Insert new hostel
      result = await supabase
        .from('hostels')
        .insert([hostelData])
        .select();
    }
    
    if (result.error) {
      console.error('Error saving hostel:', result.error);
      alert('Error saving hostel: ' + result.error.message);
      return false;
    }
    
    console.log('Hostel saved successfully:', result.data);
    
    // Clear form
    document.getElementById('hostel-form')?.reset();
    document.getElementById('editing-hostel-id').value = '';
    
    // Refresh the hostel display
    loadHostelsFromSupabase();
    
    alert(editingId ? 'Hostel updated successfully!' : 'Hostel added successfully!');
    return true;
    
  } catch (error) {
    console.error('Error saving hostel:', error);
    alert('Error saving hostel. Please try again.');
    return false;
  }
}

// Delete hostel from Supabase
async function deleteHostelFromSupabase(id) {
  if (!confirm('Are you sure you want to delete this hostel?')) {
    return false;
  }
  
  try {
    const { error } = await supabase
      .from('hostels')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting hostel:', error);
      alert('Error deleting hostel: ' + error.message);
      return false;
    }
    
    console.log('Hostel deleted successfully');
    
    // Refresh the hostel display
    loadHostelsFromSupabase();
    
    alert('Hostel deleted successfully!');
    return true;
    
  } catch (error) {
    console.error('Error deleting hostel:', error);
    alert('Error deleting hostel. Please try again.');
    return false;
  }
}

// Fallback function for localStorage (legacy support)
function loadHostelsFromLocalStorage() {
  console.log('Loading hostels from localStorage (fallback)');
  const hostels = JSON.parse(localStorage.getItem('hostels') || '[]');
  displayHostels(hostels);
}

// Expose functions globally for use in HTML
window.loadHostelsFromSupabase = loadHostelsFromSupabase;
window.saveHostelToSupabase = saveHostelToSupabase;
window.deleteHostelFromSupabase = deleteHostelFromSupabase;
window.setupHostelRealtimeSubscription = setupHostelRealtimeSubscription;
window.showRealtimeStatus = showRealtimeStatus;