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
      console.warn('⚠️ Supabase not available, showing sample data');
      showSampleHostels();
      return;
    }

    // Fetch hostels from Supabase  
    const { data: hostels, error } = await supabaseClient
      .from('hostels')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching hostels:', error);
      showSampleHostels();
      return;
    }

    if (!hostels || hostels.length === 0) {
      console.warn('⚠️ No hostels found in database');
      showSampleHostels();
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
    showSampleHostels();
  } finally {
    isLoading = false;
    hideLoadingState();
  }
}

// Show sample hostels when database is not available
function showSampleHostels() {
  const sampleHostels = [
    {
      id: 1,
      name: "Al-Noor Boys Hostel",
      gender: "Male",
      location: "150, Ali town, Lahore",
      phone: "+92-300-4909528",
      img: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=300&h=200&fit=crop",
      details: "Comfortable accommodation for male students with modern facilities."
    },
    {
      id: 2,
      name: "Al-Noor Girls Hostel",
      gender: "Female",
      location: "Ali Town & Sultan Town, Lahore",
      phone: "+92-300-4909528",
      img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop",
      details: "Safe and secure accommodation for female students."
    },
    {
      id: 3,
      name: "University View Hostel",
      gender: "Male",
      location: "Near Punjab University, Lahore",
      phone: "+92-301-1234567",
      img: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=300&h=200&fit=crop",
      details: "Modern hostel with excellent facilities near major universities."
    }
  ];
  
  console.log('📋 Showing sample hostels');
  hostelsData = sampleHostels;
  displayHostels(sampleHostels);
  
  // Show info message
  const infoDiv = document.createElement('div');
  infoDiv.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 20px;
    background: #3b82f6;
    color: white;
    padding: 12px 16px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 9999;
    font-family: Inter, sans-serif;
    font-size: 14px;
    max-width: 300px;
  `;
  
  infoDiv.innerHTML = `
    <div style="display: flex; align-items: center; gap: 8px;">
      <span>ℹ️</span>
      <span>Showing sample data. Database will connect automatically.</span>
    </div>
  `;
  
  document.body.appendChild(infoDiv);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (infoDiv.parentElement) {
      infoDiv.remove();
    }
  }, 5000);
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

    // Get hostel reviews
    const { data: reviews, error: reviewsError } = await client
      .from('hostel_reviews')
      .select('*')
      .eq('hostel_id', hostelId)
      .order('created_at', { ascending: false });
    // Create hostel details page content
    const detailsContent = createHostelDetailsContent(hostel, reviews || []);
    document.getElementById('hostel-details-content').innerHTML = detailsContent;
    
    // Initialize carousel and other interactive elements
    initializeHostelDetailsPage(hostel);
    
    // Show hostel details page
    showSection('hostel-details');
  } catch (error) {
    console.error('Error loading hostel details:', error);
    alert('Unable to load hostel details. Please try again.');
  }
}

// Create hostel details page content
function createHostelDetailsContent(hostel, reviews = []) {
  const facilities = hostel.facilities ? 
    (Array.isArray(hostel.facilities) ? hostel.facilities.join(', ') : hostel.facilities) : 
    'Not specified';

  // Prepare media gallery (images and videos)
  const mediaItems = [];
  
  // Add main image
  if (hostel.img) {
    mediaItems.push({ type: 'image', url: hostel.img, caption: 'Main View' });
  }
  
  // Add gallery images if available
  if (hostel.gallery_images && Array.isArray(hostel.gallery_images)) {
    hostel.gallery_images.forEach((img, index) => {
      mediaItems.push({ type: 'image', url: img, caption: `Gallery Image ${index + 1}` });
    });
  }
  
  // Add videos if available
  if (hostel.videos && Array.isArray(hostel.videos)) {
    hostel.videos.forEach((video, index) => {
      mediaItems.push({ type: 'video', url: video, caption: `Video Tour ${index + 1}` });
    });
  }
  
  // If no media, add placeholder
  if (mediaItems.length === 0) {
    mediaItems.push({ type: 'image', url: getPlaceholderImage(hostel), caption: 'Hostel Image' });
  }
  
  // Calculate average rating
  const avgRating = reviews.length > 0 ? 
    (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1) : 0;
  
  return `
    <div class="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
      <!-- Media Carousel -->
      <div class="relative">
        <div id="media-carousel" class="relative h-96 overflow-hidden">
          ${mediaItems.map((item, index) => `
            <div class="carousel-item ${index === 0 ? 'active' : ''}" data-index="${index}">
              ${item.type === 'image' ? 
                `<img src="${item.url}" alt="${item.caption}" class="w-full h-96 object-cover">` :
                `<video controls class="w-full h-96 object-cover">
                   <source src="${item.url}" type="video/mp4">
                   Your browser does not support the video tag.
                 </video>`
              }
              <div class="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded">
                ${item.caption}
              </div>
            </div>
          `).join('')}
        </div>
        
        <!-- Carousel Controls -->
        ${mediaItems.length > 1 ? `
          <button id="prev-btn" class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          <button id="next-btn" class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
          
          <!-- Carousel Indicators -->
          <div class="absolute bottom-4 right-4 flex space-x-2">
            ${mediaItems.map((_, index) => `
              <button class="carousel-indicator w-3 h-3 rounded-full ${index === 0 ? 'bg-white' : 'bg-white bg-opacity-50'}" data-index="${index}"></button>
            `).join('')}
          </div>
        ` : ''}
        
        <!-- Gender Badge -->
        <div class="absolute top-4 right-4">
          <span class="px-3 py-1 rounded-full text-sm font-medium text-white ${hostel.gender === 'Male' ? 'bg-blue-500' : hostel.gender === 'Female' ? 'bg-pink-500' : 'bg-gray-500'}">
            ${hostel.gender || 'Any'} Only
          </span>
        </div>
      </div>
      
      <div class="p-6">
        <!-- Header with Rating -->
        <div class="flex justify-between items-start mb-4">
          <h1 class="text-3xl font-bold text-gray-900">${hostel.name || 'Unnamed Hostel'}</h1>
          <div class="text-right">
            <div class="flex items-center">
              <div class="flex text-yellow-400">
                ${[1,2,3,4,5].map(star => `
                  <svg class="w-5 h-5 ${star <= avgRating ? 'fill-current' : 'text-gray-300'}" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                `).join('')}
              </div>
              <span class="ml-2 text-gray-600">${avgRating}/5 (${reviews.length} reviews)</span>
            </div>
          </div>
        </div>
        
        <!-- Hostel Information Grid -->
        <div class="grid md:grid-cols-2 gap-6 mb-6">
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
              ${hostel.rent ? `
                <div class="flex items-center">
                  <span class="w-6 h-6 mr-3">💰</span>
                  <span>PKR ${hostel.rent}/month</span>
                </div>
              ` : ''}
            </div>
          </div>
          
          <div>
            <h3 class="text-lg font-semibold mb-3">Facilities</h3>
            <p class="text-gray-600">${facilities}</p>
            ${hostel.other_facilities ? `
              <div class="mt-3">
                <h4 class="font-medium text-gray-700">Additional Facilities:</h4>
                <p class="text-gray-600">${hostel.other_facilities}</p>
              </div>
            ` : ''}
          </div>
        </div>
        
        <!-- Description -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold mb-3">Additional Information</h3>
          <p class="text-gray-600">${hostel.details || 'No additional details available'}</p>
        </div>
        
        <!-- Important Note -->
        <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-yellow-700">
                <strong>Note:</strong> This hostel information is based on in-person or phone-based data collection by the HOSTALL team. Facilities and prices may change. Please verify with the hostel before making any decisions.
              </p>
            </div>
          </div>
        </div>
        
        <!-- Map Section -->
        ${hostel.map ? `
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-3">Location Map</h3>
            <a href="${hostel.map}" target="_blank" class="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              <span class="mr-2">🗺️</span>
              View on Google Maps
            </a>
          </div>
        ` : ''}
        
        <!-- Action Buttons -->
        <div class="flex flex-wrap gap-4 mb-8">
          <button onclick="callHostel('${hostel.phone}')" class="flex-1 bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition-colors">
            📞 Call Now
          </button>
          <button onclick="openWhatsAppChat('${hostel.whatsapp || hostel.phone}')" class="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors">
            💬 WhatsApp
          </button>
        </div>
      </div>
    </div>
    
    <!-- Reviews Section -->
    <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-900">Reviews & Ratings</h2>
        <button onclick="openReviewModal(${hostel.id})" class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
          Write a Review
        </button>
      </div>
      
      ${reviews.length > 0 ? `
        <div class="space-y-4">
          ${reviews.slice(0, 5).map(review => `
            <div class="border-b border-gray-200 pb-4">
              <div class="flex justify-between items-start mb-2">
                <div>
                  <h4 class="font-semibold text-gray-900">${review.reviewer_name}</h4>
                  <div class="flex items-center">
                    <div class="flex text-yellow-400">
                      ${[1,2,3,4,5].map(star => `
                        <svg class="w-4 h-4 ${star <= review.rating ? 'fill-current' : 'text-gray-300'}" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      `).join('')}
                    </div>
                    <span class="ml-2 text-sm text-gray-600">${review.rating}/5</span>
                  </div>
                </div>
                <span class="text-sm text-gray-500">${new Date(review.created_at).toLocaleDateString()}</span>
              </div>
              <p class="text-gray-700">${review.review_text}</p>
            </div>
          `).join('')}
          
          ${reviews.length > 5 ? `
            <button onclick="loadMoreReviews(${hostel.id})" class="text-purple-600 hover:text-purple-700 font-medium">
              View all ${reviews.length} reviews
            </button>
          ` : ''}
        </div>
      ` : `
        <div class="text-center py-8 text-gray-500">
          <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
          </svg>
          <p class="text-lg font-medium mb-2">No reviews yet</p>
          <p>Be the first to review this hostel!</p>
        </div>
      `}
    </div>
  `;
}

// Initialize hostel details page interactive elements
function initializeHostelDetailsPage(hostel) {
  // Initialize carousel
  initializeCarousel();
  
  // Set up any other interactive elements
  console.log('Hostel details page initialized for:', hostel.name);
}

// Initialize media carousel
function initializeCarousel() {
  const carousel = document.getElementById('media-carousel');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const indicators = document.querySelectorAll('.carousel-indicator');
  const items = document.querySelectorAll('.carousel-item');
  
  if (!carousel || items.length <= 1) return;
  
  let currentIndex = 0;
  
  function showSlide(index) {
    // Hide all items
    items.forEach(item => item.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('bg-white'));
    indicators.forEach(indicator => indicator.classList.add('bg-white', 'bg-opacity-50'));
    
    // Show current item
    items[index].classList.add('active');
    if (indicators[index]) {
      indicators[index].classList.remove('bg-opacity-50');
      indicators[index].classList.add('bg-white');
    }
    
    currentIndex = index;
  }
  
  function nextSlide() {
    const nextIndex = (currentIndex + 1) % items.length;
    showSlide(nextIndex);
  }
  
  function prevSlide() {
    const prevIndex = (currentIndex - 1 + items.length) % items.length;
    showSlide(prevIndex);
  }
  
  // Event listeners
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => showSlide(index));
  });
  
  // Auto-play (optional)
  setInterval(nextSlide, 5000);
}

// Open review modal
function openReviewModal(hostelId) {
  const modal = document.createElement('div');
  modal.id = 'review-modal';
  modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center';
  
  modal.innerHTML = `
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
      <div class="flex items-center justify-between p-4 border-b">
        <h3 class="text-lg font-semibold">Write a Review</h3>
        <button onclick="closeReviewModal()" class="text-gray-400 hover:text-gray-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      <div class="p-6">
        <form id="review-form" onsubmit="submitReview(event, ${hostelId})">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
            <input type="text" id="reviewer-name" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            <div class="flex space-x-1" id="rating-stars">
              ${[1,2,3,4,5].map(star => `
                <button type="button" class="rating-star text-gray-300 hover:text-yellow-400 focus:text-yellow-400" data-rating="${star}">
                  <svg class="w-8 h-8 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                </button>
              `).join('')}
            </div>
            <input type="hidden" id="rating-value" required>
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
            <textarea id="review-text" rows="4" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500" placeholder="Share your experience with this hostel..."></textarea>
          </div>
          
          <div class="flex gap-3">
            <button type="button" onclick="closeReviewModal()" class="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors">
              Cancel
            </button>
            <button type="submit" class="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Initialize rating stars
  const ratingStars = document.querySelectorAll('.rating-star');
  const ratingValue = document.getElementById('rating-value');
  
  ratingStars.forEach(star => {
    star.addEventListener('click', function() {
      const rating = parseInt(this.dataset.rating);
      ratingValue.value = rating;
      
      ratingStars.forEach((s, index) => {
        if (index < rating) {
          s.classList.remove('text-gray-300');
          s.classList.add('text-yellow-400');
        } else {
          s.classList.remove('text-yellow-400');
          s.classList.add('text-gray-300');
        }
      });
    });
  });
}

// Close review modal
function closeReviewModal() {
  const modal = document.getElementById('review-modal');
  if (modal) {
    modal.remove();
  }
}

// Submit review
async function submitReview(event, hostelId) {
  event.preventDefault();
  
  const reviewerName = document.getElementById('reviewer-name').value;
  const rating = parseInt(document.getElementById('rating-value').value);
  const reviewText = document.getElementById('review-text').value;
  
  if (!rating) {
    alert('Please select a rating');
    return;
  }
  
  try {
    const client = window.getSupabaseClient();
    if (!client) {
      throw new Error('Database connection not available');
    }
    
    const { error } = await client
      .from('hostel_reviews')
      .insert({
        hostel_id: hostelId,
        reviewer_name: reviewerName,
        rating: rating,
        review_text: reviewText,
        created_at: new Date().toISOString()
      });
    
    if (error) {
      throw error;
    }
    
    alert('Review submitted successfully!');
    closeReviewModal();
    
    // Refresh the page to show new review
    openHostelDetailsPage(hostelId);
    
  } catch (error) {
    console.error('Error submitting review:', error);
    alert('Failed to submit review. Please try again.');
  }
}

// Load more reviews
async function loadMoreReviews(hostelId) {
  try {
    const client = window.getSupabaseClient();
    if (!client) return;
    
    const { data: reviews, error } = await client
      .from('hostel_reviews')
      .select('*')
      .eq('hostel_id', hostelId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error loading reviews:', error);
      return;
    }
    
    // Create modal to show all reviews
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center';
    
    modal.innerHTML = `
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
        <div class="flex items-center justify-between p-4 border-b">
          <h3 class="text-lg font-semibold">All Reviews (${reviews.length})</h3>
          <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div class="p-6 space-y-4">
          ${reviews.map(review => `
            <div class="border-b border-gray-200 pb-4">
              <div class="flex justify-between items-start mb-2">
                <div>
                  <h4 class="font-semibold text-gray-900">${review.reviewer_name}</h4>
                  <div class="flex items-center">
                    <div class="flex text-yellow-400">
                      ${[1,2,3,4,5].map(star => `
                        <svg class="w-4 h-4 ${star <= review.rating ? 'fill-current' : 'text-gray-300'}" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      `).join('')}
                    </div>
                    <span class="ml-2 text-sm text-gray-600">${review.rating}/5</span>
                  </div>
                </div>
                <span class="text-sm text-gray-500">${new Date(review.created_at).toLocaleDateString()}</span>
              </div>
              <p class="text-gray-700">${review.review_text}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
  } catch (error) {
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