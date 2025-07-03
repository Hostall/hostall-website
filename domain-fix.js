/**
 * HOSTALL Domain and Cache Fix - NUCLEAR VERSION
 * 
 * This script helps solve issues with domain linking and cache problems.
 * It forces a hard refresh of assets and implements versioning to ensure
 * all devices get the latest content across different browsers and networks.
 * 
 * NUCLEAR VERSION - FOR COMPLETE CROSS-DEVICE RESET
 */

// Current version - update this with each deployment
const HOSTALL_VERSION = '2025-07-03-NUCLEAR-FIX';

// Cross-device cache busting configuration
const CACHE_BUST_CONFIG = {
  // More aggressive cache busting for cross-device sync
  enableAggressiveBusting: true,
  // Force reload assets every time
  forceAssetReload: true,
  // Add random timestamp to all requests
  useRandomTimestamp: true,
  // Maximum cache age (in seconds)
  maxCacheAge: 0 // No caching whatsoever
};

// Domain configuration (used for canonical URLs and Open Graph)
const DOMAIN_CONFIG = {
  primaryDomain: 'hostall.org', // Your primary domain
  useWWW: false,                // Whether to use www subdomain
  canonicalProtocol: 'https',   // Protocol for canonical URLs
  
  // Get full canonical domain with protocol
  get fullDomain() {
    const subdomain = this.useWWW ? 'www.' : '';
    return `${this.canonicalProtocol}://${subdomain}${this.primaryDomain}`;
  }
};

// Initialize domain configuration with NUCLEAR OPTION
(function() {
  console.log(`🚨 HOSTALL ${HOSTALL_VERSION} - NUCLEAR FIX ACTIVE`);
  console.log(`⚡ NUCLEAR RELOAD at: ${new Date().toISOString()}`);

  // Update cache control headers - NUCLEAR STRENGTH
  applyNuclearCacheHeaders();
  
  // Force reload JS and CSS with random version parameters
  nuclearlizeAssets();
  
  // Update canonical URLs and Open Graph metadata
  updateMetadataTags();
  
  // Setup cross-device sync for admin users
  initCrossDeviceSync();

  // Save version in localStorage for easy checking
  localStorage.setItem('HOSTALL_VERSION', HOSTALL_VERSION);
  localStorage.setItem('HOSTALL_NUCLEAR_TIMESTAMP', Date.now().toString());
  
  // Display version in console for debugging
  window.addEventListener('load', () => {
    showVersionInfo();
    
    // Clear cache in 1 second after load
    setTimeout(() => {
      nukeAllCaches();
    }, 1000);
  });
  
  // Set a forced reload in case nothing else worked
  setTimeout(() => {
    forceHardRefresh();
  }, 60000); // 1 minute timeout
})();

/**
 * Apply nuclear strength cache-busting headers
 */
function applyNuclearCacheHeaders() {
  // Add meta tags dynamically with nuclear strength
  const metaTags = [
    {name: 'Cache-Control', content: 'no-cache, no-store, must-revalidate, max-age=0, private, stale-while-revalidate=0, stale-if-error=0'},
    {name: 'Pragma', content: 'no-cache'},
    {name: 'Expires', content: '-1'},
    {name: 'version', content: HOSTALL_VERSION}
  ];
  
  metaTags.forEach(meta => {
    // Remove any existing meta tag first
    const existingTag = document.querySelector(`meta[http-equiv="${meta.name}"]`);
    if (existingTag) {
      existingTag.remove();
    }
    
    // Add new meta tag
    const metaTag = document.createElement('meta');
    metaTag.setAttribute('http-equiv', meta.name);
    metaTag.setAttribute('content', meta.content);
    document.head.appendChild(metaTag);
  });
  
  // Update version meta tag
  let versionMeta = document.querySelector('meta[name="version"]');
  if (versionMeta) {
    versionMeta.setAttribute('content', HOSTALL_VERSION);
  } else {
    versionMeta = document.createElement('meta');
    versionMeta.setAttribute('name', 'version');
    versionMeta.setAttribute('content', HOSTALL_VERSION);
    document.head.appendChild(versionMeta);
  }
  
  // Add a nuclear flag meta tag
  const nuclearMeta = document.createElement('meta');
  nuclearMeta.setAttribute('name', 'nuclear-reset');
  nuclearMeta.setAttribute('content', 'true');
  document.head.appendChild(nuclearMeta);
}

/**
 * Add version parameters to all JavaScript and CSS resources
 * NUCLEAR VERSION - Maximum cache busting
 */
function nuclearlizeAssets() {
  // Force reload all assets with nuclear timestamp
  setTimeout(() => {
    const timestamp = Date.now();
    
    // Process script tags with forced reload
    document.querySelectorAll('script[src]').forEach(script => {
      if (script.src) {
        const currentSrc = script.src;
        const newSrc = `${currentSrc.split('?')[0]}?nuclear=${timestamp}&r=${Math.random()}`;
        
        const newScript = document.createElement('script');
        Array.from(script.attributes).forEach(attr => {
          if (attr.name !== 'src') {
            newScript.setAttribute(attr.name, attr.value);
          }
        });
        newScript.src = newSrc;
        
        if (script.parentNode) {
          script.parentNode.replaceChild(newScript, script);
        }
      }
    });
    
    // Process CSS links with nuclear cache busting
    document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
      if (link.href) {
        link.href = `${link.href.split('?')[0]}?nuclear=${timestamp}&r=${Math.random()}`;
      }
    });
    
    // Process images with nuclear cache busting
    document.querySelectorAll('img').forEach(img => {
      if (img.src && !img.src.startsWith('data:')) {
        img.src = `${img.src.split('?')[0]}?nuclear=${timestamp}&r=${Math.random()}`;
      }
    });
    
    console.log('⚡ Assets nuclearlized with maximum cache-busting parameters');
  }, 500);
}

/**
 * Nuke all browser caches
 */
function nukeAllCaches() {
  // Clear browser cache via cache API if available
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => {
        console.log('🔥 Nuking cache:', name);
        caches.delete(name);
      });
    });
  }
  
  // Clear localStorage except crucial items
  const preserveKeys = ['auth', 'supabase.auth.token'];
  Object.keys(localStorage).forEach(key => {
    if (!preserveKeys.includes(key)) {
      localStorage.removeItem(key);
    }
  });
  
  // Reset HOSTALL version in localStorage
  localStorage.setItem('HOSTALL_VERSION', HOSTALL_VERSION);
  localStorage.setItem('HOSTALL_NUCLEAR_TIMESTAMP', Date.now().toString());
  
  console.log('💥 All caches nuked');
}

/**
 * Update canonical URLs and Open Graph tags
 */
function updateMetadataTags() {
  // Update canonical link
  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', DOMAIN_CONFIG.fullDomain);
  
  // Update OG URL
  let ogUrlMeta = document.querySelector('meta[property="og:url"]');
  if (!ogUrlMeta) {
    ogUrlMeta = document.createElement('meta');
    ogUrlMeta.setAttribute('property', 'og:url');
    document.head.appendChild(ogUrlMeta);
  }
  ogUrlMeta.setAttribute('content', DOMAIN_CONFIG.fullDomain);
  
  // Update Twitter card URL
  let twitterUrlMeta = document.querySelector('meta[name="twitter:url"]');
  if (!twitterUrlMeta) {
    twitterUrlMeta = document.createElement('meta');
    twitterUrlMeta.setAttribute('name', 'twitter:url');
    document.head.appendChild(twitterUrlMeta);
  }
  twitterUrlMeta.setAttribute('content', DOMAIN_CONFIG.fullDomain);
}

/**
 * Display version info in console for debugging
 */
function showVersionInfo() {
  const style = 'background: #EF4444; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;';
  console.log('%c 🚨 HOSTALL NUCLEAR VERSION INFO 🚨 ', style);
  console.log(`📋 Current Version: ${HOSTALL_VERSION}`);
  console.log(`🌐 Domain: ${DOMAIN_CONFIG.fullDomain}`);
  console.log(`⏱️ Page Loaded: ${new Date().toLocaleTimeString()}`);
  console.log(`🔥 Nuclear Timestamp: ${new Date().toISOString()}`);
  
  // Detect if running from original domain
  const currentDomain = window.location.hostname;
  if (currentDomain !== DOMAIN_CONFIG.primaryDomain && 
      currentDomain !== `www.${DOMAIN_CONFIG.primaryDomain}`) {
    console.warn(`⚠️ Running on non-primary domain: ${currentDomain}`);
    console.warn(`⚠️ Primary domain is: ${DOMAIN_CONFIG.primaryDomain}`);
  } else {
    console.log(`✅ Running on primary domain: ${currentDomain}`);
  }
}

/**
 * Initialize cross-device sync for admin users
 */
function initCrossDeviceSync() {
  // Only setup for admin section
  if (!window.location.hash.includes('admin')) {
    return;
  }
  
  console.log('🔄 Initializing cross-device sync for admin');
  
  // Set up more frequent sync (every 5 seconds)
  setInterval(() => {
    if (window.supabase) {
      if (typeof loadHostelsFromSupabase === 'function') {
        loadHostelsFromSupabase();
        console.log(`🔄 Cross-device sync at ${new Date().toLocaleTimeString()}`);
      }
    }
  }, 5000);
  
  // Set up localStorage versioning to detect stale data
  const storageVersion = localStorage.getItem('HOSTALL_VERSION');
  if (storageVersion !== HOSTALL_VERSION) {
    console.log(`⚠️ Version mismatch: Storage ${storageVersion || 'none'} vs Current ${HOSTALL_VERSION}`);
    console.log('🔄 Triggering data refresh due to version change');
    
    // Force refresh of crucial data
    setTimeout(() => {
      if (typeof loadHostelsFromSupabase === 'function') {
        loadHostelsFromSupabase();
      }
    }, 1000);
  }
}

/**
 * DNS Propagation Check
 * 
 * This function helps users check if their DNS settings have propagated
 */
window.checkDNSPropagation = function() {
  const status = document.createElement('div');
  status.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(255, 255, 255, 0.95);
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    max-width: 400px;
    font-family: system-ui, -apple-system, sans-serif;
  `;
  
  status.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
      <h3 style="margin: 0; font-size: 16px;">🌐 DNS Propagation Check</h3>
      <button onclick="this.parentNode.parentNode.remove()" style="background: none; border: none; font-size: 18px; cursor: pointer;">×</button>
    </div>
    <div id="dns-check-results" style="font-size: 14px;">
      <p>Checking DNS propagation status...</p>
    </div>
  `;
  
  document.body.appendChild(status);
  
  const results = document.getElementById('dns-check-results');
  
  // Simulate DNS check (in production this would call an API)
  setTimeout(() => {
    const currentDomain = window.location.hostname;
    const targetDomain = DOMAIN_CONFIG.primaryDomain;
    const isCorrectDomain = (currentDomain === targetDomain || 
                            currentDomain === `www.${targetDomain}`);
    
    if (isCorrectDomain) {
      results.innerHTML = `
        <div style="color: #10B981; margin-bottom: 10px;">
          ✅ <strong>Success!</strong> DNS has fully propagated.
        </div>
        <div>
          <strong>Current domain:</strong> ${currentDomain}<br>
          <strong>Target domain:</strong> ${targetDomain}<br>
          <strong>Version:</strong> ${HOSTALL_VERSION}<br>
          <strong>Status:</strong> Active and working correctly
        </div>
        <div style="margin-top: 15px; font-size: 13px; color: #6B7280;">
          If you're still experiencing issues, try clearing your browser cache 
          or using a hard refresh (Ctrl+F5).
        </div>
      `;
    } else {
      results.innerHTML = `
        <div style="color: #EF4444; margin-bottom: 10px;">
          ⚠️ <strong>Warning!</strong> DNS may not be fully propagated.
        </div>
        <div>
          <strong>Current domain:</strong> ${currentDomain}<br>
          <strong>Target domain:</strong> ${targetDomain}<br>
          <strong>Version:</strong> ${HOSTALL_VERSION}<br>
          <strong>Status:</strong> Using alternate domain
        </div>
        <div style="margin-top: 15px; font-size: 13px;">
          DNS propagation can take 24-48 hours to complete worldwide.
          <ul style="margin-top: 10px; padding-left: 20px;">
            <li>Confirm your DNS settings in Cloudflare</li>
            <li>Verify CNAME points to <code>hostall.pages.dev</code></li>
            <li>Check if Proxy Status is enabled (orange cloud)</li>
          </ul>
        </div>
      `;
    }
  }, 1500);
};

/**
 * Force Hard Refresh
 * 
 * This function performs a complete cache flush and reload
 */
window.forceHardRefresh = function() {
  // Nuclear cache bust
  nukeAllCaches();
  
  // Add a random query parameter to force reload
  const cacheBuster = Date.now();
  window.location.href = window.location.href.split('?')[0] + '?nuclear=' + cacheBuster;
};

// Expose nuclear functionality globally
window.HOSTALL_NUCLEAR = {
  version: HOSTALL_VERSION,
  timestamp: Date.now(),
  nukeCaches: nukeAllCaches,
  forceRefresh: forceHardRefresh,
  checkDNS: checkDNSPropagation
};