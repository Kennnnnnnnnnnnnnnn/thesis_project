<template>
  <div class="bg-white text-center">
    <!-- Search Section -->
    <section class="py-8 mt-8">
      <div class="max-w-6xl mx-auto px-5">
        <input type="text" v-model="searchQuery" placeholder="Search products..."
          class="w-full max-w-2xl px-5 py-3 border border-yellow-400 rounded-3xl text-base outline-none transition-all duration-300 bg-white mx-auto block focus:border-orange-400">
      </div>
    </section>

    <!-- Image Carousel -->
    <section class="my-8">
      <div class="relative overflow-hidden rounded-lg border border-yellow-200">
        <div class="flex transition-transform duration-500 ease-in-out"
          :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
          <div v-for="(slide, index) in slides" :key="index" class="min-w-full">
            <img :src="slide.image" :alt="slide.alt" class="w-full h-80 md:h-80 lg:h-96 ">
          </div>
        </div>

        <!-- Navigation Buttons -->
        <button @click="prevSlide"
          class="absolute top-1/2 left-5 transform -translate-y-1/2 bg-white/90 text-gray-800 border border-yellow-200 rounded-full p-3 hover:bg-yellow-400 transition-all duration-300 z-10">
          ❮
        </button>
        <button @click="nextSlide"
          class="absolute top-1/2 right-5 transform -translate-y-1/2 bg-white/90 text-gray-800 border border-yellow-200 rounded-full p-3 hover:bg-yellow-400 transition-all duration-300 z-10">
          ❯
        </button>
      </div>
    </section>

    <!-- New Products Section -->
    <section class="py-10">
      <div class="max-w-6xl mx-auto px-5">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-3xl font-bold text-gray-800">New Products</h2>
          <router-link to="/product"
            class="text-orange-600 font-bold hover:text-red-500 hover:underline transition-colors duration-300">
            View All
          </router-link>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          <div v-for="product in newProducts" :key="product.id"
            class="bg-white rounded-lg border border-gray-200 overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col h-full">
            <!-- Product Image -->
            <div class="bg-gray-50 p-4 h-48 flex items-center justify-center">
              <img :src="product.imageURL || require('@/assets/image.png')" alt="Product Image"
                class="max-w-full max-h-40 object-contain">
            </div>

            <!-- Product Info in New Products Section -->
            <div class="p-4 flex flex-col flex-grow">
              <!-- Rating -->
              <div class="text-yellow-400 text-base mb-2">
                ★★★★★
              </div>

              <!-- Product Name -->
              <h3 class="text-base font-bold text-center mb-2 text-gray-800">
                {{ product.name }}
              </h3>

              <!-- Description -->
              <p class="text-sm text-gray-600 text-center mb-3 flex-grow">
                {{ product.description || 'Premium quality product' }}
              </p>

              <!-- Price -->
              <div class="text-center my-4">
                <p v-if="product.discount > 0" class="text-xs text-gray-500 line-through">
                  ៛{{ formatPrice(product.salePrice) }}
                </p>
                <p class="text-xl font-bold text-gray-800">
                  ៛{{ formatPrice(calculateFinalPrice(product)) }}
                </p>
                <span v-if="product.discount > 0" class="text-sm text-red-600 font-bold">
                  Save {{ product.discount }}%
                </span>
              </div>

              <!-- Buttons -->
              <div class="flex justify-between items-center mt-2">
                <button @click="toggleFavorite(product)" :class="[
                  'bg-transparent border-none cursor-pointer p-2 transition-all duration-300',
                  product.isFavorite ? 'text-red-600' : 'text-gray-400 hover:text-yellow-400'
                ]">
                  <span class="text-xl">❤</span>
                </button>

                <button @click="addToCart(product)"
                  class="bg-yellow-400 text-gray-800 border-none px-4 py-2 rounded cursor-pointer transition-all duration-300 font-bold text-sm flex-grow ml-2 hover:bg-orange-400 hover:text-white">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- All Products Section -->
    <section class="py-10">
      <div class="max-w-6xl mx-auto px-5">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-3xl font-bold text-gray-800">All Products</h2>
          <router-link to="/product"
            class="text-orange-600 font-bold hover:text-red-500 hover:underline transition-colors duration-300">
            View All
          </router-link>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          <!-- Loading/Error States (similar to above) -->
          
          <div v-for="product in filteredProducts.slice(0, 8)" :key="product._id"
            class="bg-white rounded-lg border border-gray-200 overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col h-full">
            <!-- Product Image -->
            <div class="bg-gray-50 p-4 h-48 flex items-center justify-center">
              <img :src="product.imageURL || require('@/assets/image.png')" alt="Product Image"
                class="max-w-full max-h-40 object-contain">
            </div>

            <!-- Product Info -->
            <div class="p-4 flex flex-col flex-grow">
              <!-- Rating -->
              <div class="text-yellow-400 text-base mb-2">
                ★★★★★
              </div>

              <!-- Product Name -->
              <h3 class="text-base font-bold text-center mb-2 text-gray-800">
                {{ product.name }}
              </h3>

              <!-- Description -->
              <p class="text-sm text-gray-600 text-center mb-3 flex-grow">
                {{ product.description || 'Premium quality product' }}
              </p>

              <!-- Price -->
              <div class="text-center my-4">
                <p v-if="product.discount > 0" class="text-xs text-gray-500 line-through">
                  ៛{{ formatPrice(product.salePrice) }}
                </p>
                <p class="text-xl font-bold text-gray-800">
                  ៛{{ formatPrice(calculateFinalPrice(product)) }}
                </p>
                <span v-if="product.discount > 0" class="text-sm text-red-600 font-bold">
                  Save {{ product.discount }}%
                </span>
              </div>

              <!-- Buttons -->
              <div class="flex justify-between items-center mt-2">
                <button @click="toggleFavorite(product)" :class="[
                  'bg-transparent border-none cursor-pointer p-2 transition-all duration-300',
                  product.isFavorite ? 'text-red-600' : 'text-gray-400 hover:text-yellow-400'
                ]">
                  <span class="text-xl">❤</span>
                </button>

                <button @click="addToCart(product)"
                  class="bg-yellow-400 text-gray-800 border-none px-4 py-2 rounded cursor-pointer transition-all duration-300 font-bold text-sm flex-grow ml-2 hover:bg-orange-400 hover:text-white">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer ref="footerRef" :class="[
      'bg-gray-900 text-white py-10 transition-all duration-700',
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
    ]">
      <div class="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-6">
        <!-- Company Logo and Slogan -->
        <div class="flex flex-col items-center md:items-start">
          <img src="@/assets/logo-removebg.png" alt="Taing Eang Huot Rice Mill" class="w-32 mb-4" />
          <p class="text-sm italic">Better Rice, Better Life!</p>
        </div>

        <!-- Factory Address -->
        <div class="flex items-start gap-4">
          <div class="bg-yellow-400 text-black rounded-full p-2 flex-shrink-0">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
              stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
          </div>
          <div>
            <h3 class="font-bold mb-1">Factory address</h3>
            <p class="text-sm">No.01, Street 1510, Andong Jenh Village, Ouchar District, Battambang City, Battambang
              Province, Cambodia.</p>
          </div>
        </div>

        <!-- Office Address -->
        <div class="flex items-start gap-4">
          <div class="bg-yellow-400 text-black rounded-full p-2 flex-shrink-0">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
              stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
          </div>
          <div>
            <h3 class="font-bold mb-1">Office address</h3>
            <p class="text-sm">No.1 Borey Honglay, Street Lu5, Stung Mean Chey 3, Mean Chey, Phnom Penh, Cambodia.</p>
          </div>
        </div>

        <!-- Email -->
        <div class="flex items-start gap-4">
          <div class="bg-yellow-400 text-black rounded-full p-2 flex-shrink-0">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
              stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 4h16v16H4z" stroke="none" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
          <div>
            <h3 class="font-bold mb-1">Email Us</h3>
            <p class="text-sm">Info@tehrice.com</p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import api from '@/api/config'
import cover1 from '@/assets/cover1.png'
import cover2 from '@/assets/cover2.png'
import cover4 from '@/assets/cover4.png'
import socket from '@/services/socket'  // Import the socket service
import axios from 'axios'
import { computed, onMounted, onUnmounted, ref } from 'vue'

// Reactive data
const searchQuery = ref('')
const currentSlide = ref(0)
const carouselInterval = ref(null)
const footerRef = ref(null)
const isVisible = ref(false)
const isLoading = ref(false)
const error = ref(null)

// Slides data
const slides = ref([
  {
    image: cover1,
    alt: 'cover1'
  },
  {
    image: cover2,
    alt: 'cover2'
  },
  {
    image: cover4,
    alt: 'cover4'
  }
])

// Products data
const products = ref([])

// Fetch products from API
async function fetchProducts() {
  try {
    isLoading.value = true
    error.value = null
    console.log('Fetching products from public API...')
    
    // Use the public endpoint that doesn't require authentication
    const response = await api.get('/public/products', {
      params: {
        sortField: 'createdAt',
        sortOrder: 'desc',
        limit: 20 // Or any number you prefer, or remove for all products
      }
    })
    
    console.log('API response:', response.data)
    
    if (response.data && response.data.success && response.data.data) {
      products.value = response.data.data
      console.log('Products loaded:', products.value.length)
      applyFavorites()
    } else {
      console.warn('No product data in response')
      products.value = []
    }
  } catch (err) {
    console.error('Error fetching products:', err)
    error.value = 'Failed to load products: ' + (err.message || 'Unknown error')
  } finally {
    isLoading.value = false
  }
}

// Get favorites from localStorage and mark products
function applyFavorites() {
  const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || []
  
  products.value.forEach(product => {
    product.isFavorite = storedFavorites.some(fav => fav.id === product._id)
  })
}

// Calculate final price after discount
function calculateFinalPrice(product) {
  if (!product.discount || product.discount === 0) {
    return product.salePrice
  }
  
  const discountAmount = (product.salePrice * product.discount) / 100
  return product.salePrice - discountAmount
}

// Format price for display
function formatPrice(price) {
  return price.toFixed(2)
}

// Computed properties
const filteredProducts = computed(() => {
  return products.value.filter(product =>
    product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// For "new products" we'll show the most recently added products
const newProducts = computed(() => {
  // Sort by createdAt date in descending order (newest first)
  return [...products.value]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
})

// Methods
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || []
  let existingItem = cart.find(item => item.id === product._id)
  
  const finalPrice = calculateFinalPrice(product)
  
  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({ 
      id: product._id,
      name: product.name,
      price: finalPrice,
      originalPrice: product.salePrice,
      discount: product.discount,
      image: product.imageURL,
      quantity: 1
    })
  }
  
  localStorage.setItem("cart", JSON.stringify(cart))
  localStorage.setItem("cartCount", cart.length)
  window.dispatchEvent(new Event("storage"))
}

function toggleFavorite(product) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || []
  const isFavorited = favorites.some(item => item.id === product._id)
  
  if (isFavorited) {
    favorites = favorites.filter(item => item.id !== product._id)
    product.isFavorite = false
  } else {
    favorites.push({
      id: product._id,
      name: product.name,
      price: calculateFinalPrice(product),
      image: product.imageURL
    })
    product.isFavorite = true
  }
  
  localStorage.setItem("favorites", JSON.stringify(favorites))
}

function nextSlide() {
  currentSlide.value = (currentSlide.value + 1) % slides.value.length
}

function prevSlide() {
  currentSlide.value = (currentSlide.value - 1 + slides.value.length) % slides.value.length
}

function startCarousel() {
  carouselInterval.value = setInterval(() => {
    nextSlide()
  }, 5000)
}

function setupIntersectionObserver() {
  if (!footerRef.value) return
  
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isVisible.value = true
        }
      })
    },
    { threshold: 0.1 }
  )
  
  observer.observe(footerRef.value)
}

// Setup socket connection for real-time updates
function setupSocketConnection() {
  // Connect to socket if disconnected
  if (socket && socket.disconnected) {
    socket.connect()
  }

  // Listen for product updates
  socket.on('dataUpdate', async (update) => {
    console.log('Socket update received:', update)
    
    if (update.collection === 'Product') {
      console.log('Product collection updated, refreshing products...')
      await fetchProducts() // Refresh products when there's an update
    }
  })
}

// Lifecycle hooks
onMounted(() => {
  fetchProducts()
  startCarousel()
  setupIntersectionObserver()
  setupSocketConnection() // Setup socket connection
})

onUnmounted(() => {
  if (carouselInterval.value) {
    clearInterval(carouselInterval.value)
  }
  
  // Clean up socket listeners to prevent memory leaks
  if (socket) {
    socket.off('dataUpdated')
  }
})
</script>