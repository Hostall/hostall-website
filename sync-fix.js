// Enhanced Supabase real-time sync code

// Function to set up enhanced real-time subscriptions
function setupEnhancedRealtime() {
  if (!supabase) return;
  
  console.log('Setting up enhanced real-time subscriptions...');
  
  // Track connection status
  let isConnected = false;
  let reconnectAttempts = 0;
  
  // Remove any existing subscriptions to prevent duplicates
  try {
    supabase.removeAllSubscriptions();
  } catch (error) {
    console.warn('Error removing subscriptions:', error);
  }
  
  // Function to load hostels with progress indicator
  async function loadHostelsWithIndicator() {
    // Show loading indicator
    const loadingEl = document.createElement('div');
    loadingEl.id = 'sync-indicator';
    loadingEl.innerHTML = `
      <div style="position: fixed; bottom: 20px; left: 20px; background: rgba(0,0,0,0.7); color: white; padding: 10px 15px; border-radius: 5px; z-index: 9999;">
        ⏳ Syncing data...
      </div>
    `;
    
    // Remove existing indicator if present
    const existingIndicator = document.getElementById('sync-indicator');
    if (existingIndicator) existingIndicator.remove();
    
    document.body.appendChild(loadingEl);
    
    try {
      // Clear cache first
      localStorage.removeItem('hostels_cache');
      
      // Load hostels
      if (typeof loadHostelsFromSupabase === 'function') {
        await loadHostelsFromSupabase();
        console.log('Hostels reloaded successfully');
      }
    } catch (error) {
      console.error('Error loading hostels:', error);
    } finally {
      // Remove loading indicator after 2 seconds
      setTimeout(() => {
        if (loadingEl && loadingEl.parentNode) {
          loadingEl.remove();
        }
      }, 2000);
    }
  }
  
  // Setup hostel changes subscription
  const hostelChannel = supabase.channel('hostels_changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'hostels'
    }, async (payload) => {
      console.log('Hostel change detected:', payload);
      // Reload hostels when changes are detected
      await loadHostelsWithIndicator();
    })
    .subscribe((status) => {
      console.log('Hostel subscription status:', status);
      isConnected = status === 'SUBSCRIBED';
      
      if (isConnected) {
        console.log('✅ Successfully connected to Supabase real-time');
        reconnectAttempts = 0;
      }
    });
  
  // Setup reconnection logic
  window.addEventListener('online', async () => {
    console.log('Network connection restored, reconnecting to Supabase...');
    await loadHostelsWithIndicator();
  });
  
  // Handle connection issues
  const connectionChecker = setInterval(() => {
    if (!isConnected && navigator.onLine && reconnectAttempts < 5) {
      console.log(`Reconnection attempt ${reconnectAttempts + 1}/5...`);
      reconnectAttempts++;
      
      // Try to resubscribe
      hostelChannel.subscribe();
      
      // Also reload data
      loadHostelsWithIndicator();
    }
  }, 30000); // Check every 30 seconds
  
  // Cleanup function
  return () => {
    clearInterval(connectionChecker);
    supabase.removeChannel(hostelChannel);
  };
}

// Function to manually reconnect Supabase
async function reconnectSupabase() {
  if (typeof supabase !== 'undefined') {
    try {
      // Show reconnecting indicator
      const indicatorEl = document.createElement('div');
      indicatorEl.innerHTML = `
        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
             background: rgba(0,0,0,0.8); color: white; padding: 20px; border-radius: 8px; z-index: 10000;
             display: flex; flex-direction: column; align-items: center; gap: 15px;">
          <div style="font-size: 24px;">🔄</div>
          <div>Reconnecting to database...</div>
        </div>
      `;
      document.body.appendChild(indicatorEl);
      
      // Remove existing subscriptions
      try {
        supabase.removeAllSubscriptions();
      } catch (err) {
        console.warn('Error removing subscriptions:', err);
      }
      
      // Re-setup the hostel subscription
      const channel = supabase
        .channel('hostels_changes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'hostels'
        }, (payload) => {
          console.log('Hostel change detected:', payload);
          // Reload hostels after change
          if (typeof loadHostelsFromSupabase === 'function') {
            loadHostelsFromSupabase();
          }
        })
        .subscribe((status) => {
          console.log('Hostel subscription status:', status);
        });
      
      // Clear caches
      localStorage.removeItem('hostels_cache');
      sessionStorage.removeItem('hostels_data');
      
      console.log('Supabase reconnection complete');
      
      // Force reload hostels
      if (typeof loadHostelsFromSupabase === 'function') {
        await loadHostelsFromSupabase();
      }
      
      // Remove indicator after successful reconnection
      setTimeout(() => {
        indicatorEl.remove();
        
        // Show success message
        const successEl = document.createElement('div');
        successEl.innerHTML = `
          <div style="position: fixed; bottom: 20px; right: 20px; background: rgba(16, 185, 129, 0.9); 
               color: white; padding: 10px 15px; border-radius: 5px; z-index: 9999;">
            ✅ Data synchronized successfully!
          </div>
        `;
        document.body.appendChild(successEl);
        
        // Remove success message after 3 seconds
        setTimeout(() => successEl.remove(), 3000);
      }, 1000);
      
    } catch (error) {
      console.error('Supabase reconnection failed:', error);
      
      // Show error message
      const errorEl = document.createElement('div');
      errorEl.innerHTML = `
        <div style="position: fixed; bottom: 20px; right: 20px; background: rgba(239, 68, 68, 0.9); 
             color: white; padding: 10px 15px; border-radius: 5px; z-index: 9999;">
          ❌ Sync failed. Please try again.
        </div>
      `;
      document.body.appendChild(errorEl);
      
      // Remove error message after 3 seconds
      setTimeout(() => errorEl.remove(), 3000);
    }
  }
}

// Function to force reload all data
function forceDataReload() {
  // Clear all caches
  localStorage.removeItem('hostels_cache');
  sessionStorage.removeItem('hostels_data');
  
  // Reload with refresh parameter
  window.location.href = window.location.pathname + '?refresh=true&t=' + Date.now();
}

// Create and add sync button to the page
function addSyncButton() {
  // Check if button already exists
  if (document.getElementById('sync-data-button')) return;
  
  const syncBtn = document.createElement('button');
  syncBtn.id = 'sync-data-button';
  syncBtn.innerHTML = '🔄 Sync Data';
  syncBtn.style.position = 'fixed';
  syncBtn.style.bottom = '20px';
  syncBtn.style.right = '20px';
  syncBtn.style.zIndex = '9999';
  syncBtn.style.background = '#8B5CF6';
  syncBtn.style.color = 'white';
  syncBtn.style.border = 'none';
  syncBtn.style.borderRadius = '50px';
  syncBtn.style.padding = '10px 15px';
  syncBtn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
  syncBtn.style.cursor = 'pointer';
  syncBtn.style.fontFamily = 'Inter, sans-serif';
  syncBtn.style.fontSize = '14px';
  syncBtn.style.fontWeight = '500';
  syncBtn.onclick = reconnectSupabase;
  
  document.body.appendChild(syncBtn);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Add sync button
  addSyncButton();
  
  // Set up enhanced real-time
  setupEnhancedRealtime();
  
  // Auto-reconnect on page load if refresh parameter is present
  if (window.location.search.includes('refresh=true')) {
    setTimeout(reconnectSupabase, 1000);
  }
});

// Function for manual sync from UI
function manualSyncData() {
  reconnectSupabase();
}