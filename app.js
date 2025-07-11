// HOSTALL Main Application Controller
// Enhanced with comprehensive error handling and retry mechanisms

class App {
  constructor() {
    this.currentSection = 'home';
    this.isInitialized = false;
    this.initializationRetries = 0;
    this.maxRetries = 3;
    this.sampleHostels = [
      {
        id: 1,
        name: 'Al-Noor Boys Hostel',
        gender: 'Male',
        location: '150, Ali town, lahore',
        phone: '+92-300-4909528',
        whatsapp: '+92-300-4909528',
        rent: '12000',
        security_deposit: '15000',
        admission_fee: '2000',
        details: 'Modern hostel with all facilities including WiFi, AC, security, and study rooms. Located in a safe area with easy access to universities.',
        facilities: ['WiFi', 'AC', 'Security', 'Laundry', 'Study Room'],
        img: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&h=400&fit=crop',
        gallery: [
          'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&h=400&fit=crop',
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop',
          'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&h=400&fit=crop',
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop'
        ]
      },
      {
        id: 2,
        name: 'Al-Noor Girls Hostel',
        gender: 'Female',
        location: 'Ali Town & Sultan Town, Lahore',
        phone: '+92-300-4909528',
        whatsapp: '+92-300-4909528',
        rent: '11000',
        security_deposit: '12000',
        admission_fee: '1500',
        details: 'Safe and secure hostel for girls with 24/7 security, modern amenities, and a friendly environment. Close to major universities.',
        facilities: ['WiFi', 'Security', 'Laundry', 'Kitchen', 'Study Area'],
        img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop',
        gallery: [
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop',
          'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&h=400&fit=crop',
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop',
          'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&h=400&fit=crop'
        ]
      },
      {
        id: 3,
        name: 'Green Valley Hostel',
        gender: 'Male',
        location: 'Model Town, Lahore',
        phone: '+92-321-7654321',
        whatsapp: '+92-321-7654321',
        rent: '15000',
        security_deposit: '18000',
        admission_fee: '3000',
        details: 'Premium hostel with excellent facilities including gym, library, and recreational areas. Perfect for serious students.',
        facilities: ['WiFi', 'AC', 'Gym', 'Library', 'Parking', 'Meals'],
        img: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&h=400&fit=crop',
        gallery: [
          'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&h=400&fit=crop',
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop',
          'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&h=400&fit=crop',
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop'
        ]
      },
      {
        id: 4,
        name: 'Comfort Inn Girls Hostel',
        gender: 'Female',
        location: 'Gulberg, Lahore',
        phone: '+92-333-1234567',
        whatsapp: '+92-333-1234567',
        rent: '18000',
        security_deposit: '20000',
        admission_fee: '2500',
        details: 'Luxury hostel for girls with premium amenities, spacious rooms, and excellent dining facilities. Located in upscale area.',
        facilities: ['WiFi', 'AC', 'Security', 'Meals', 'Gym', 'Study Room', 'Parking'],
        img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop',
        gallery: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop',
          'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&h=400&fit=crop',
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop',
          'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&h=400&fit=crop'
        ]
      }
    ];
  }

  // Load initial data
  async loadInitialData() {
    try {
      // Load hostels immediately with sample data
      this.loadHostelsData();
      
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

  // Load hostels data
  async loadHostelsData() {
    try {
      console.log('🏠 Loading hostels...');
      
      // Try to load from Supabase first
      let hostels = [];
      const client = window.getSupabaseClient();
      
      if (client) {
        try {
          const { data, error } = await client
            .from('hostels')
            .select('*')
            .order('created_at', { ascending: false });
          
          if (!error && data && data.length > 0) {
            hostels = data;
            console.log(`✅ Loaded ${hostels.length} hostels from database`);
          }
        } catch (dbError) {
          console.warn('⚠️ Database not available, using sample data');
        }
      }
      
      // If no data from database, use sample data
      if (hostels.length === 0) {
        hostels = this.sampleHostels;
        console.log(`✅ Loaded ${hostels.length} sample hostels`);
      }
      
      // Update hostel manager
      if (window.hostelManager) {
        window.hostelManager.hostels = hostels;
        window.hostelManager.renderHostelCards();
      } else {
        // Store for later use
        window.hostelData = hostels;
      }
      
    } catch (error) {
      console.error('❌ Error loading hostels:', error);
      // Fallback to sample data
      if (window.hostelManager) {
        window.hostelManager.hostels = this.sampleHostels;
        window.hostelManager.renderHostelCards();
      }
    }
  }

  // Update dashboard statistics
  async updateDashboardStats() {
    try {