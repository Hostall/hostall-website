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
    retryAttempts: 2,
    retryDelay: 10000
  }
};

// Initialize Supabase when config is loaded
let supabaseClient = null;
let initializationAttempts = 0;

function initializeSupabase() {
  const maxAttempts = CONFIG.app.retryAttempts;
  
  if (typeof window.supabase !== 'undefined' && CONFIG.supabase.url && CONFIG.supabase.key) {
    try {
      supabaseClient = window.supabase.createClient(CONFIG.supabase.url, CONFIG.supabase.key);
      console.log('✅ Supabase initialized successfully');
      return true;
    } catch (error) {
      console.warn('⚠️ Supabase initialization failed:', error);
      return false;
    }
  } else {
    console.warn('⚠️ Supabase dependencies not ready');
    return false;
  }
}

// Enhanced getter with validation
window.getSupabaseClient = () => {
  if (!supabaseClient) {
    console.warn('⚠️ Supabase client not available');
  }
  return supabaseClient;
};
// Export for use in other modules
window.CONFIG = CONFIG;
window.initializeSupabase = initializeSupabase;
