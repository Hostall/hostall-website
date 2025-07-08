// HOSTALL Configuration
// Enhanced configuration with error handling
const CONFIG = {
  supabase: {
    url: 'https://pjnqhdhlcgrrmfzscswv.supabase.co',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqbnFoZGhsY2dycm1menNjc3d2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5NTg3NDMsImV4cCI6MjA2NjUzNDc0M30.UVaJXabJDPMSHgDzUk3tOEv9sAFSjqSRNEYroypqyGs'
  },
  app: {
    name: 'HOSTALL',
    version: '2.0',
    debug: true,
    retryAttempts: 3,
    retryDelay: 2000
  }
};

// Initialize Supabase when config is loaded
let supabaseClient = null;
let initializationAttempts = 0;

function initializeSupabase() {
  const maxAttempts = CONFIG.app.retryAttempts;
  
  if (initializationAttempts >= maxAttempts) {
    console.error('❌ Max Supabase initialization attempts reached');
    return false;
  }
  
  initializationAttempts++;
  
  if (typeof window.supabase !== 'undefined' && CONFIG.supabase.url && CONFIG.supabase.key) {
    try {
      supabaseClient = window.supabase.createClient(CONFIG.supabase.url, CONFIG.supabase.key);
      console.log(`✅ Supabase initialized successfully (attempt ${initializationAttempts})`);
      initializationAttempts = 0; // Reset on success
      return true;
    } catch (error) {
      console.error(`❌ Supabase initialization failed (attempt ${initializationAttempts}):`, error);
      
      // Retry after delay if not max attempts
      if (initializationAttempts < maxAttempts) {
        setTimeout(() => {
          console.log(`⏳ Retrying Supabase initialization in ${CONFIG.app.retryDelay}ms...`);
          initializeSupabase();
        }, CONFIG.app.retryDelay);
      }
      return false;
    }
  } else {
    console.warn(`⚠️ Supabase dependencies not ready (attempt ${initializationAttempts})`);
    
    // Retry after delay if not max attempts
    if (initializationAttempts < maxAttempts) {
      setTimeout(() => {
        initializeSupabase();
      }, CONFIG.app.retryDelay);
    }
  }
  return false;
}

// Enhanced getter with validation
window.getSupabaseClient = () => {
  if (!supabaseClient) {
    console.warn('⚠️ Supabase client not initialized, attempting initialization...');
    initializeSupabase();
  }
  return supabaseClient;
};
// Export for use in other modules
window.CONFIG = CONFIG;
window.initializeSupabase = initializeSupabase;