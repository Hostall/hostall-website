// HOSTALL Main Application Controller
// Enhanced with comprehensive error handling and retry mechanisms

class App {
  constructor() {
    this.currentSection = 'home';
    this.isInitialized = false;
    this.initializationRetries = 0;
    this.maxRetries = 3;
  }

  // Initialize the application
  async init() {
    try {
      console.log('🚀 Initializing HOSTALL...');
      
      // Wait for DOM to be ready
      if (document.readyState === 'loading') {
        await new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve));
      }

      // Initialize Supabase with better error handling
      const supabaseReady = await this.initializeSupabaseWithRetry();
      if (!supabaseReady) {
        console.warn('⚠️ Supabase not available, continuing with limited functionality');
      }

      // Initialize managers
      await this.initializeManagers();

      // Setup navigation
      this.setupNavigation();

      // Setup event listeners
      this.setupEventListeners();

      // Load initial data
      await this.loadInitialData();

      this.isInitialized = true;
      console.log('✅ HOSTALL initialized successfully');
    } catch (error) {
      console.error('❌ App initialization failed:', error);
      // Don't show error popup for minor issues
      this.handleInitializationError(error);
    }
  }

  // Initialize Supabase with retry logic
  async initializeSupabaseWithRetry() {
    try {
      if (typeof window.initializeSupabase === 'function') {
        const result = window.initializeSupabase();
        if (result) {
          console.log('✅ Supabase initialized successfully');
          return true;
        }
      }
      
      // Wait a bit and try again
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (window.getSupabaseClient && window.getSupabaseClient()) {
        console.log('✅ Supabase client available');
        return true;
      }
      
      return false;
    } catch (error) {
      console.warn('⚠️ Supabase initialization issue:', error);
      return false;
    }
  }

  // Handle initialization errors gracefully
  handleInitializationError(error) {
    // Only show popup for critical errors
    if (error.message.includes('critical') || error.message.includes('fatal')) {
      this.showCriticalError(error);
    } else {
      // For minor errors, just log and continue
      console.warn('⚠️ Minor initialization issue:', error.message);
      this.showMinorErrorNotification();
    }
  }

  // Show minor error notification (not blocking popup)
  showMinorErrorNotification() {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #fbbf24;
      color: #92400e;
      padding: 12px 16px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 9999;
      font-family: Inter, sans-serif;
      font-size: 14px;
      max-width: 300px;
    `;
    
    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <span>⚠️</span>
        <span>Some features may be limited. Retrying connection...</span>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 5000);
  }

  // Show critical error (only for serious issues)
  showCriticalError(error) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'critical-error';
    errorDiv.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      color: white;
      font-family: Inter, sans-serif;
    `;
    
    errorDiv.innerHTML = `
      <div style="text-align: center; padding: 2rem; background: #1f2937; border-radius: 12px; max-width: 400px;">
        <div style="font-size: 3rem; margin-bottom: 1rem;">🔧</div>
        <h2 style="margin-bottom: 1rem; color: #f59e0b;">Service Temporarily Unavailable</h2>
        <p style="margin-bottom: 1.5rem; color: #d1d5db;">
          We're experiencing technical difficulties. Please try refreshing the page.
        </p>
        <button onclick="window.location.reload()" 
                style="background: #8b5cf6; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; cursor: pointer; font-weight: 500;">
          Refresh Page
        </button>
      </div>
    `;
    
    document.body.appendChild(errorDiv);
  }
  // Initialize all managers
  async initializeManagers() {
    try {
      // Wait for managers to be available
      const maxRetries = 10;
      let retries = 0;
      
      while ((!window.hostelManager || !window.adminManager) && retries < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 100));
        retries++;
        
        if (retries === Math.floor(maxRetries / 2)) {
          console.log('⏳ Still waiting for managers to load...');
        }
      }

      if (retries >= maxRetries) {
        console.warn('⚠️ Managers took longer than expected to load');
      }

      if (window.hostelManager) {
        try {
          await window.hostelManager.init();
        } catch (error) {
          console.error('❌ Hostel manager initialization failed:', error);
        }
        console.log('✅ Hostel manager initialized');
      }

      if (window.adminManager) {
        try {
          window.adminManager.init();
        } catch (error) {
          console.error('❌ Admin manager initialization failed:', error);
        }
        console.log('✅ Admin manager initialized');
      }
    } catch (error) {
      console.error('❌ Manager initialization failed:', error);
    }
  }

  // Setup navigation functionality
  setupNavigation() {
    // Show initial section
    window.showSection(this.currentSection);
  }

  // Setup event listeners
  setupEventListeners() {
    // Admin login form
    const loginForm = document.getElementById('admin-login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', this.handleAdminLogin.bind(this));
    }

    // Search and filter functionality
    const searchInput = document.getElementById('search-input');
    const genderFilter = document.getElementById('gender-filter');
    const locationFilter = document.getElementById('location-filter');
    const budgetFilter = document.getElementById('budget-filter');

    if (searchInput) {
      searchInput.addEventListener('input', this.handleSearch.bind(this));
    }

    if (genderFilter) {
      genderFilter.addEventListener('change', this.handleFilterChange.bind(this));
    }

    if (locationFilter) {
      locationFilter.addEventListener('change', this.handleFilterChange.bind(this));
    }

    if (budgetFilter) {
      budgetFilter.addEventListener('change', this.handleFilterChange.bind(this));
    }
    // WhatsApp chat
    window.openWhatsApp = () => {
      const phoneNumber = '+923001234567';
      const message = 'Hi! I found your hostels on HOSTALL. I would like to know more about available rooms.';
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    };
  }

  // Handle admin login
  async handleAdminLogin(event) {
    event.preventDefault();
    
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Show loading state
    submitButton.textContent = 'Logging in...';
    submitButton.disabled = true;
    
    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;

    if (!email || !password) {
      alert('Please enter both email and password');
      submitButton.textContent = originalText;
      submitButton.disabled = false;
      return;
    }

    try {
      let result;
      if (window.adminManager && typeof window.adminManager.login === 'function') {
        result = await window.adminManager.login(email, password);
      } else {
        throw new Error('Admin manager not available');
      }
      
      if (result.success) {
        // Hide login form and show dashboard
        document.getElementById('admin-login').classList.add('hidden');
        document.getElementById('admin-dashboard').classList.remove('hidden');
        
        // Update dashboard data
        this.updateDashboardStats();
        
        // Load admin messages
        if (typeof loadAdminMessages === 'function') {
          loadAdminMessages();
        }
      } else {
        alert('Login failed: ' + result.error);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed: ' + (error.message || 'Please try again.'));
    } finally {
      // Restore button state
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    }
  }

  // Handle search functionality
  handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    
    if (window.hostelManager) {
      // Filter hostels based on search term
      const filteredHostels = window.hostelManager.hostels.filter(hostel => {
        return hostel.name?.toLowerCase().includes(searchTerm) ||
               hostel.location?.toLowerCase().includes(searchTerm) ||
               hostel.details?.toLowerCase().includes(searchTerm);
      });
      
      // Update display with filtered results
      this.displayFilteredHostels(filteredHostels);
    }
  }

  // Handle filter changes
  handleFilterChange() {
    const genderFilter = document.getElementById('gender-filter').value;
    const locationFilter = document.getElementById('location-filter')?.value || 'all';
    const budgetFilter = document.getElementById('budget-filter')?.value || 'all';

    if (window.hostelManager) {
      // Update filters
      window.hostelManager.filters.gender = genderFilter;
      window.hostelManager.filters.location = locationFilter;
      window.hostelManager.filters.budget = budgetFilter;
      
      // Re-render hostels
      window.hostelManager.renderHostelCards();
    }
  }

  // Display filtered hostels
  displayFilteredHostels(hostels) {
    const hostelGrid = document.getElementById('public-list');
    if (!hostelGrid) return;

    if (hostels.length === 0) {
      hostelGrid.innerHTML = `
        <div class="col-span-full text-center py-12">
          <h3 class="text-xl font-semibold text-gray-700 mb-2">No hostels found</h3>
          <p class="text-gray-500">Try adjusting your search criteria</p>
        </div>
      `;
      return;
    }

    hostelGrid.innerHTML = '';
    hostels.forEach(hostel => {
      const card = window.hostelManager.createHostelCard(hostel);
      hostelGrid.appendChild(card);
    });
  }

  // Load initial data
  async loadInitialData() {
    try {
      // Hide loading indicator after a delay
      setTimeout(() => {
        const loadingIndicator = document.getElementById('loading-hostels');
        if (loadingIndicator) {
          loadingIndicator.style.display = 'none';
        }
      }, 3000);
    } catch (error) {
      console.error('❌ Failed to load initial data:', error);
    }
  }

  // Update dashboard statistics
  async updateDashboardStats() {
    try {
      if (window.hostelManager && window.hostelManager.hostels) {
        const totalHostels = window.hostelManager.hostels.length;
        const activeListings = window.hostelManager.hostels.filter(h => h.status !== 'inactive').length;
        
        // Update dashboard display
        const dashboardElements = document.querySelectorAll('#admin-dashboard h3');
        if (dashboardElements.length >= 2) {
          dashboardElements[0].textContent = totalHostels;
          dashboardElements[1].textContent = activeListings;
        }
      }
    } catch (error) {
      console.error('❌ Failed to update dashboard stats:', error);
    }
  }
}

// Initialize app when DOM is ready
const app = new App();

// Start initialization
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => app.init());
} else {
  app.init();
}

// Export for global access
window.app = app;