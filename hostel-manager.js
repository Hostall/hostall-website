// HOSTALL Hostel Management Functions
// This file contains all hostel-related functionality

class HostelManager {
  constructor() {
    this.hostels = [];
    this.filters = {
      gender: 'all',
      location: 'all',
      budget: 'all',
      facilities: []
    };
  }

  // Initialize the hostel manager
  async init() {
    await this.loadHostels();
    this.setupEventListeners();
    this.renderHostelCards();
  }

  // Load hostels from Supabase
  async loadHostels() {
    try {
      const client = window.getSupabaseClient();
      if (!client) {
        console.error('❌ Supabase client not available');
        return;
      }

      const { data: hostels, error } = await client
        .from('hostels')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error loading hostels:', error);
        return;
      }

      this.hostels = hostels || [];
      console.log(`✅ Loaded ${this.hostels.length} hostels from database`);
    } catch (error) {
      console.error('❌ Exception loading hostels:', error);
    }
  }

  // Render hostel cards
  renderHostelCards() {
    const hostelGrid = document.getElementById('public-list');
    if (!hostelGrid) return;

    const filteredHostels = this.getFilteredHostels();

    if (filteredHostels.length === 0) {
      hostelGrid.innerHTML = this.getNoHostelsMessage();
      return;
    }

    hostelGrid.innerHTML = '';
    console.log('🏗️ Rendering hostel cards for:', filteredHostels.map(h => h.name));

    filteredHostels.forEach(hostel => {
      const card = this.createHostelCard(hostel);
      hostelGrid.appendChild(card);
    });

    console.log('✅ Rendered', filteredHostels.length, 'hostel cards');
  }

  // Create individual hostel card
  createHostelCard(hostel) {
    const card = document.createElement('div');
    card.className = 'hostel-card';

    const genderClass = hostel.gender?.toLowerCase() || 'any';
    const imageUrl = hostel.img || this.getPlaceholderImage(hostel);

    card.innerHTML = `
      <div class="hostel-image-container">
        <img src="${imageUrl}" 
             class="hostel-image" 
             alt="${hostel.name}"
             onerror="this.src='https://via.placeholder.com/300x200/6b7280/ffffff?text=Hostel+Image'">
        <div class="hostel-gender-badge ${genderClass}">${hostel.gender || 'Any'}</div>
      </div>
      <div class="hostel-content">
        <h3 class="hostel-name">${hostel.name || 'Unnamed Hostel'}</h3>
        <div class="hostel-location-only">
          📍 ${this.getShortLocation(hostel.location)}
        </div>
        <div class="hostel-contact" style="font-size: 0.9rem; color: #6b7280; margin: 0.5rem 0;">
          ${hostel.phone ? `📞 ${hostel.phone}` : ''}
        </div>
        <button class="view-details-btn" onclick="window.hostelManager.showHostelDetails(${JSON.stringify(hostel).replace(/"/g, '&quot;')})">
          View Details
        </button>
      </div>
    `;

    return card;
  }

  // Show hostel details popup
  showHostelDetails(hostel) {
    // Create and show hostel details modal
    this.createHostelDetailsModal(hostel);
  }

  // Create hostel details modal
  createHostelDetailsModal(hostel) {
    // Remove any existing modal
    const existingModal = document.getElementById('hostel-details-modal');
    if (existingModal) {
      existingModal.remove();
    }

    // Create modal
    const modal = document.createElement('div');
    modal.id = 'hostel-details-modal';
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
    
    // Get facilities list
    const facilities = Array.isArray(hostel.facilities) ? hostel.facilities : 
                      (hostel.facilities ? hostel.facilities.split(',') : []);
    
    modal.innerHTML = `
      <div class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b">
          <h2 class="text-2xl font-bold text-gray-900">${hostel.name}</h2>
          <button onclick="this.closest('#hostel-details-modal').remove()" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <!-- Content -->
        <div class="p-6">
          <div class="grid lg:grid-cols-2 gap-8">
            <!-- Left Column - Image and Basic Info -->
            <div>
              <div class="mb-6">
                <img src="${hostel.img || 'https://via.placeholder.com/400x300/6b7280/ffffff?text=' + encodeURIComponent(hostel.name)}" 
                     alt="${hostel.name}" 
                     class="w-full h-64 object-cover rounded-lg"
                     onerror="this.src='https://via.placeholder.com/400x300/6b7280/ffffff?text=Hostel+Image'">
              </div>
              
              <div class="space-y-4">
                <div class="flex items-center gap-2">
                  <span class="px-3 py-1 rounded-full text-sm font-medium ${hostel.gender === 'Male' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'}">
                    ${hostel.gender} Only
                  </span>
                </div>
    // Get facilities list
    const facilities = Array.isArray(hostel.facilities) ? hostel.facilities : 
                      (hostel.facilities ? hostel.facilities.split(',') : []);
    
    // Get gallery images
    const galleryImages = this.getHostelGallery(hostel);
    
                
                <div class="flex items-start gap-3">
                  <i class="hgi-stroke hgi-location-01 text-gray-500 mt-1"></i>
                  <div>
                    <p class="font-medium text-gray-900">Location</p>
                    <p class="text-gray-600">${hostel.location}</p>
                  </div>
                </div>
                
                ${hostel.rent ? `
        <!-- Hostel Header -->
        <div class="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
                  <div>
            <!-- Left Column - Image Gallery -->
                    <p class="text-gray-600">Rs. ${hostel.rent}</p>
              <div class="relative">
                <div id="image-carousel" class="relative h-80 rounded-lg overflow-hidden">
                  ${galleryImages.map((img, index) => `
                    <div class="carousel-slide ${index === 0 ? 'active' : ''} absolute inset-0 transition-opacity duration-500">
                      <img src="${img.url}" 
                           alt="${img.alt}" 
                           class="w-full h-full object-cover"
                           onerror="this.src='https://via.placeholder.com/600x400/6b7280/ffffff?text=Hostel+Image'">
                    </div>
                  `).join('')}
                </div>
                
                <!-- Carousel Navigation -->
                ${galleryImages.length > 1 ? `
                <button onclick="window.hostelManager.previousImage()" class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                  </svg>
                </button>
                <button onclick="window.hostelManager.nextImage()" class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
                
                <!-- Image Indicators -->
                <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  ${galleryImages.map((_, index) => `
                    <button onclick="window.hostelManager.goToImage(${index})" 
                            class="carousel-indicator w-3 h-3 rounded-full bg-white bg-opacity-50 hover:bg-opacity-100 ${index === 0 ? 'active' : ''}"></button>
                  `).join('')}
                </div>
                ` : ''}
              </div>
            </div>
            
            <!-- Right Column - Details and Contact -->
            <div>
              <!-- Contact Information -->
              <div class="mb-6">
                <h3 class="text-lg font-semibold mb-4">Contact Information</h3>
                <div class="space-y-3">
                  ${hostel.phone ? `
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <i class="hgi-stroke hgi-call text-green-600"></i>
                    </div>
                    <div>
                      <p class="text-sm text-gray-600">Phone</p>
                      <p class="font-medium">${hostel.phone}</p>
                    </div>
                  </div>
                  ` : ''}
                  
                  ${hostel.whatsapp ? `
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <i class="hgi-stroke hgi-whatsapp text-green-600"></i>
                    </div>
                    <div>
                      <p class="text-sm text-gray-600">WhatsApp</p>
                      <p class="font-medium">${hostel.whatsapp}</p>
                    </div>
                  </div>
                  ` : ''}
                </div>
              </div>
              
              <!-- Facilities -->
              ${facilities.length > 0 ? `
              <div class="mb-6">
                <h3 class="text-lg font-semibold mb-4">Facilities</h3>
                <div class="flex flex-wrap gap-2">
                  ${facilities.map(facility => `
                    <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      ${facility.trim()}
                    </span>
                  `).join('')}
                </div>
              </div>
              ` : ''}
              
              <!-- Description -->
              ${hostel.details ? `
              <div class="mb-6">
                <h3 class="text-lg font-semibold mb-4">Description</h3>
                <p class="text-gray-600 leading-relaxed">${hostel.details}</p>
              </div>
              ` : ''}
              
              <!-- Pricing Section -->
              <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <h3 class="text-lg font-semibold text-green-800 mb-2">💰 Pricing</h3>
                <div class="space-y-2">
                  ${hostel.rent ? `
                  <div class="flex justify-between items-center">
                    <span class="text-green-700">Monthly Rent:</span>
                    <span class="font-bold text-green-800">Rs. ${hostel.rent}</span>
                  </div>
                  ` : ''}
                  ${hostel.security_deposit ? `
                  <div class="flex justify-between items-center">
                    <span class="text-green-700">Security Deposit:</span>
                    <span class="font-semibold text-green-800">Rs. ${hostel.security_deposit}</span>
                  </div>
                  ` : ''}
                  ${hostel.admission_fee ? `
                  <div class="flex justify-between items-center">
                    <span class="text-green-700">Admission Fee:</span>
                    <span class="font-semibold text-green-800">Rs. ${hostel.admission_fee}</span>
                  </div>
                  ` : ''}
                  ${!hostel.rent && !hostel.security_deposit && !hostel.admission_fee ? `
                  <div class="text-center text-green-700">
                    <p>Contact for pricing details</p>
                  </div>
                  ` : ''}
                </div>
              </div>
              
              <!-- Action Buttons -->
              <div class="space-y-3">
                ${hostel.phone ? `
                <button onclick="window.open('tel:${hostel.phone}', '_self')" 
                        class="w-full flex items-center justify-center gap-3 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <i class="hgi-stroke hgi-call"></i>
                  <span>Call Now</span>
                </button>
                ` : ''}
                
                ${hostel.whatsapp ? `
                <button onclick="window.open('https://wa.me/${hostel.whatsapp.replace(/[^0-9]/g, '')}?text=Hi, I found your hostel on HOSTALL and I\\'m interested in learning more.', '_blank')" 
                        class="w-full flex items-center justify-center gap-3 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <i class="hgi-stroke hgi-whatsapp"></i>
                  <span>WhatsApp Chat</span>
                </button>
                ` : ''}
                
                ${hostel.location ? `
                <button onclick="window.open('https://www.google.com/maps/search/${encodeURIComponent(hostel.location)}', '_blank')" 
                        class="w-full flex items-center justify-center gap-3 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  <i class="hgi-stroke hgi-location-01"></i>
                  <span>View on Map</span>
                </button>
                ` : ''}
              </div>
            </div>
          </div>
        </div>
        
        <!-- Facilities Section -->
        ${facilities.length > 0 ? `
        <div class="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">🏢 Facilities & Amenities</h2>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            ${facilities.map(facility => `
              <div class="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <i class="hgi-stroke hgi-tick text-blue-600"></i>
                <span class="text-gray-700 capitalize">${facility.trim()}</span>
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}
        
        <!-- Description Section -->
        ${hostel.details ? `
        <div class="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">📋 About This Hostel</h2>
          <div class="prose prose-gray max-w-none">
            <p class="text-gray-700 leading-relaxed">${hostel.details}</p>
          </div>
        </div>
        ` : ''}
        
        <!-- Reviews Section -->
        <div class="bg-white rounded-xl shadow-lg p-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">⭐ Reviews & Ratings</h2>
          <div class="text-center py-8 text-gray-500">
            <i class="hgi-stroke hgi-star text-4xl mb-4"></i>
            <p class="text-lg">Reviews coming soon...</p>
            <p class="text-sm">Be the first to review this hostel!</p>
          </div>
        </div>
      </div>
    `;
    
    // Add click outside to close
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
    
    // Add to page
    document.body.appendChild(modal);
  }

  // Get enhanced details format
  getEnhancedDetails(hostel, facilities) {
    let roomPricing = '';
    if (hostel.room_prices && Array.isArray(hostel.room_prices)) {
      roomPricing = '\n\n💰 Room Pricing:\n' + hostel.room_prices.map(price => {
        if (price.type && price.price) {
          return `• ${price.type}: ${price.price} ${price.currency || 'PKR'}${price.per ? ' per ' + price.per : ''}`;
        }
        return '';
      }).filter(item => item).join('\n');
    }

    return `
🏠 HOSTEL DETAILS (Enhanced Information Available)

📍 Name: ${hostel.name || 'Not specified'}
👥 Gender: ${hostel.gender || 'Any'}
🏠 Location: ${hostel.location || 'Not specified'}
📞 Phone: ${hostel.phone || 'Not provided'}
📱 WhatsApp: ${hostel.whatsapp || hostel.phone || 'Not provided'}
📧 Email: ${hostel.email || 'Not provided'}
🌐 Website: ${hostel.website || 'Not provided'}

💵 PRICING & FEES:
• Monthly Rent: ${hostel.rent || hostel.monthly_rent || 'Contact for pricing'}
• Security Deposit: ${hostel.security_deposit || 'Contact for details'}
• Admission Fee: ${hostel.admission_fee || 'Contact for details'}
• Utilities: ${hostel.utilities_included ? 'Included' : (hostel.utilities_cost || 'Ask hostel')}${roomPricing}

🏢 FACILITIES & AMENITIES:
• Basic Facilities: ${facilities}
• Additional Facilities: ${hostel.other_facilities || 'None mentioned'}
• Room Type: ${hostel.room_type || 'Standard rooms'}
• Meals: ${hostel.meals_included ? 'Included' : (hostel.meal_plan || 'Not included')}

👤 CONTACT PERSON:
• Contact Person: ${hostel.contact_person || 'Hostel Manager'}
• Office Hours: ${hostel.office_hours || '9 AM - 6 PM'}
• Emergency Contact: ${hostel.emergency_contact || hostel.phone || 'Same as main number'}

📋 RULES & POLICIES:
• Check-in Time: ${hostel.checkin_time || '12:00 PM onwards'}
• Check-out Time: ${hostel.checkout_time || '11:00 AM'}
• Visitor Policy: ${hostel.visitor_policy || 'Check with management'}
• Curfew: ${hostel.curfew || 'Ask hostel for details'}
• Age Limit: ${hostel.age_limit || '18-30 years'}

🚗 TRANSPORTATION:
• Nearby Universities: ${hostel.nearby_universities || 'Contact for details'}
• Public Transport: ${hostel.transport_access || 'Available'}
• Parking: ${hostel.parking || 'Check availability'}

ℹ️ ADDITIONAL INFORMATION:
${hostel.details || 'No additional details provided'}

📍 LOCATION & MAP:
${hostel.map ? '🗺️ View on Google Maps: ' + hostel.map : '❌ Map not provided - Ask for address details'}

---
📝 Note: Please contact the hostel directly to confirm all details, pricing, and availability before making any decisions.
    `;
  }

  // Get simple details format
  getSimpleDetails(hostel, facilities) {
    return \`HOSTEL DETAILS

📍 Name: ${hostel.name || 'Not specified'}
👥 Gender: ${hostel.gender || 'Any'}
🏠 Location: ${hostel.location || 'Not specified'}
📞 Phone: ${hostel.phone || 'Not provided'}
📱 WhatsApp: ${hostel.whatsapp || hostel.phone || 'Not provided'}
🏢 Facilities: ${facilities}

Additional Information:
${hostel.details || 'No additional details'}

${hostel.map ? '🗺️ View on map: ' + hostel.map : '❌ Map not provided'}`;
  }

  // Get hostel gallery images
  getHostelGallery(hostel) {
    const images = [];
    
    // Add main image if available
    if (hostel.img) {
      images.push({
        url: hostel.img,
        alt: \`${hostel.name} - Main View`,
        title: 'Main View'
      });
    }
    
    // Add additional gallery images if available
    if (hostel.gallery && Array.isArray(hostel.gallery)) {
      hostel.gallery.forEach((img, index) => {
        images.push({
          url: img.url || img,
          alt: \`${hostel.name} - Image ${index + 2}`,
          title: img.title || \`View ${index + 2}`
        });
      });
    }
    
    // If no images, add placeholder
    if (images.length === 0) {
      images.push({
        url: this.getPlaceholderImage(hostel),
        alt: \`${hostel.name} - Placeholder`,
        title: 'Hostel Image'
      });
    }
    
    return images;
  }

  // Image carousel navigation
  currentImageIndex = 0;
  
  nextImage() {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.carousel-indicator');
    
    if (slides.length === 0) return;
    
    slides[this.currentImageIndex].classList.remove('active');
    indicators[this.currentImageIndex].classList.remove('active');
    
    this.currentImageIndex = (this.currentImageIndex + 1) % slides.length;
    
    slides[this.currentImageIndex].classList.add('active');
    indicators[this.currentImageIndex].classList.add('active');
  }
  
  previousImage() {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.carousel-indicator');
    
    if (slides.length === 0) return;
    
    slides[this.currentImageIndex].classList.remove('active');
    indicators[this.currentImageIndex].classList.remove('active');
    
    this.currentImageIndex = this.currentImageIndex === 0 ? slides.length - 1 : this.currentImageIndex - 1;
    
    slides[this.currentImageIndex].classList.add('active');
    indicators[this.currentImageIndex].classList.add('active');
  }
  
  goToImage(index) {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.carousel-indicator');
    
    if (slides.length === 0 || index >= slides.length) return;
    
    slides[this.currentImageIndex].classList.remove('active');
    indicators[this.currentImageIndex].classList.remove('active');
    
    this.currentImageIndex = index;
    
    slides[this.currentImageIndex].classList.add('active');
    indicators[this.currentImageIndex].classList.add('active');
  }

  // Helper functions
  getPlaceholderImage(hostel) {
    const genderColor = hostel.gender === 'Female' ? 'ff69b4' : 
                       hostel.gender === 'Male' ? '4169e1' : '6b7280';
    return \`https://via.placeholder.com/300x200/${genderColor}/ffffff?text=${encodeURIComponent(hostel.name || 'Hostel')}`;
  }

  getShortLocation(location) {
    if (!location) return 'Location not specified';
    return location.split(',')[0] || location;
  }

  getFilteredHostels() {
    return this.hostels.filter(hostel => {
      // Gender filter
      if (this.filters.gender !== 'all' && hostel.gender !== this.filters.gender) {
        return false;
      }
      
      // Location filter (implement as needed)
      if (this.filters.location !== 'all' && !hostel.location?.toLowerCase().includes(this.filters.location.toLowerCase())) {
        return false;
      }
      
      // Budget filter
      if (this.filters.budget !== 'all') {
        const rent = parseInt(hostel.rent) || 0;
        switch (this.filters.budget) {
          case '5000-10000':
            if (rent < 5000 || rent > 10000) return false;
            break;
          case '10000-15000':
            if (rent < 10000 || rent > 15000) return false;
            break;
          case '15000-20000':
            if (rent < 15000 || rent > 20000) return false;
            break;
          case '20000+':
            if (rent < 20000) return false;
            break;
        }
      }
      
      // Facilities filter (implement as needed)
      if (this.filters.facilities.length > 0) {
        const hostelFacilities = Array.isArray(hostel.facilities) ? hostel.facilities : [];
        const hasRequiredFacilities = this.filters.facilities.every(facility => 
          hostelFacilities.includes(facility)
        );
        if (!hasRequiredFacilities) return false;
      }
      
      return true;
    });
  }

  getNoHostelsMessage() {
    return `
      <div style="grid-column: 1/-1; text-align: center; padding: 2rem; background: #f9fafb; border-radius: 10px; margin: 1rem;">
        <h3 style="color: #dc2626; margin-bottom: 1rem;">⚠️ No Hostels Found</h3>
        <p style="color: #6b7280; margin-bottom: 1rem;">We're having trouble loading hostel data right now.</p>
        <button onclick="location.reload()" style="background: #8B5CF6; color: white; border: none; padding: 0.5rem 1rem; border-radius: 5px; cursor: pointer;">
          🔄 Refresh Page
        </button>
        <p style="font-size: 0.8rem; color: #9ca3af; margin-top: 1rem;">
          If this problem persists, please contact support.
        </p>
      </div>
    `;
  }

  setupEventListeners() {
    // Add event listeners for filters, search, etc.
    // Implementation can be added as needed
  }
}

// Global hostel manager instance
window.hostelManager = new HostelManager();

// Global functions for backward compatibility
window.showHostelDetails = (hostel) => window.hostelManager.showHostelDetails(hostel);
