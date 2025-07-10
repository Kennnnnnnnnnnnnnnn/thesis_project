<template>
  <div class="bg-white text-center">
    <!-- Search Section -->
    <section class="py-8 mt-8">
      <div class="max-w-6xl mx-auto px-5">
        <input type="text" v-model="searchQuery" :placeholder="$t('home.searchPlaceholder')"
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
          <h2 class="text-3xl font-bold text-gray-800">{{ $t('home.newProductsTitle') }}</h2>
          <router-link to="/product"
            class="text-orange-600 font-bold hover:text-red-500 hover:underline transition-colors duration-300">
            {{ $t('common.viewAll') }}
          </router-link>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          <div v-for="product in newProducts.slice(0, 4)" :key="product.id"
            class="bg-white rounded-lg border border-gray-200 overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col h-full">
            <!-- Product Image -->
            <div class="bg-gray-50 p-4 h-48 flex items-center justify-center">
              <img :src="product.imageURL || require('@/assets/image.png')" alt="Product Image"
                class="max-w-full max-h-40 object-contain">
            </div>

            <!-- Product Info in New Products Section -->
            <div class="p-4 flex flex-col flex-grow">
              <!-- Rating (average) -->
              <div class="flex items-center justify-center mb-2">
                <span v-for="i in 5" :key="i" class="text-xl"
                  :class="{ 'text-yellow-400': i <= (product.avgRating || 0), 'text-gray-300': i > (product.avgRating || 0) }">
                  ★
                </span>
                <span v-if="product.ratingCount" class="ml-2 text-xs text-gray-500">({{ product.ratingCount }})</span>
              </div>
              <button @click="openRatingModal(product)"
                class="text-xs text-blue-500 underline hover:text-blue-700 mb-2">{{ $t('home.rateProduct') }}</button>

              <!-- Product Name -->
              <h3 class="text-base font-bold text-center mb-2 text-gray-800">
                {{ product.name }}
              </h3>

              <!-- Description -->
              <p class="text-sm text-gray-600 text-center mb-3 flex-grow">
                {{ product.description || $t('home.premiumProduct') }}
              </p>

              <!-- Price -->
              <div class="text-center my-4">
                <p v-if="product.discount > 0" class="text-xs text-gray-500 line-through">
                  {{ formatPrice(product.salePrice) }}{{ product.currency?.symbol?.symbol1.symbol || '' }}
                </p>
                <p class="text-xl font-bold text-gray-800">
                 {{ formatPrice(calculateFinalPrice(product)) }} {{ product.currency?.symbol?.symbol1.symbol || '' }}
                </p>
                <span v-if="product.discount > 0" class="text-sm text-red-600 font-bold">
                  {{ $t('common.save') }} {{ product.discount }}%
                </span>
              </div>

              <!-- Buttons -->
              <div class="flex justify-between items-center mt-2">
                <button @click="toggleFavorite(product)">
                  <span :class="{ favorited: product.isFavorite }" class="heart">❤</span>
                </button>

                <button @click="addToCart(product)"
                  class="bg-yellow-400 text-gray-800 border-none px-4 py-2 rounded cursor-pointer transition-all duration-300 font-bold text-sm flex-grow ml-2 hover:bg-orange-400 hover:text-white">
                  {{ $t('common.addToCart') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Best Sellers Section -->
    <!-- <section class="py-10"> -->
    <!-- <div class="max-w-6xl mx-auto px-5">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-3xl font-bold text-gray-800">{{ $t('home.bestSellersTitle') }}</h2>
          <router-link to="/product"
            class="text-orange-600 font-bold hover:text-red-500 hover:underline transition-colors duration-300">
            {{ $t('common.viewAll') }}
          </router-link>
        </div> -->

    <!-- <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          <div v-for="product in bestSellers" :key="product._id"
            class="bg-white rounded-lg border border-gray-200 overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col h-full"> -->
    <!-- Product Image -->
    <!-- <div class="bg-gray-50 p-4 h-48 flex items-center justify-center">
              <img :src="product.imageURL || require('@/assets/image.png')" alt="Product Image"
                class="max-w-full max-h-40 object-contain">
            </div> -->

    <!-- Product Info -->
    <!-- <div class="p-4 flex flex-col flex-grow">
              <div class="flex items-center justify-center mb-2">
                <span v-for="i in 5" :key="i" class="text-xl"
                  :class="{'text-yellow-400': i <= (product.avgRating || 0), 'text-gray-300': i > (product.avgRating || 0)}">
                  ★
                </span>
                <span class="ml-2 text-sm text-gray-500">({{ product.ratingCount || 0 }})</span>
              </div>

              <h3 class="text-base font-bold text-center mb-2 text-gray-800">
                {{ product.name }}
              </h3>

              <p class="text-sm text-gray-600 text-center mb-3 flex-grow">
                {{ product.description || $t('home.premiumProduct') }}
              </p>

              <div class="text-center my-4">
                <p v-if="product.discount > 0" class="text-xs text-gray-500 line-through">
                  ៛{{ formatPrice(product.salePrice) }}
                </p>
                <p class="text-xl font-bold text-gray-800">
                  ៛{{ formatPrice(calculateFinalPrice(product)) }}
                </p>
                <span v-if="product.discount > 0" class="text-sm text-red-600 font-bold">
                  {{ $t('common.save') }} {{ product.discount }}%
                </span>
              </div>

              <div class="flex justify-between items-center mt-2">
                <button @click="toggleFavorite(product)">
                  <span :class="{ favorited: product.isFavorite }" class="heart">❤</span>
                </button>
                <button @click="addToCart(product)"
                  class="bg-yellow-400 text-gray-800 border-none px-4 py-2 rounded cursor-pointer transition-all duration-300 font-bold text-sm flex-grow ml-2 hover:bg-orange-400 hover:text-white">
                  {{ $t('common.addToCart') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section> -->


    <!-- All Products Section -->
    <section class="py-10">
      <div class="max-w-6xl mx-auto px-5">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-3xl font-bold text-gray-800">{{ $t('home.allProductsTitle') }}</h2>
          <router-link to="/product"
            class="text-orange-600 font-bold hover:text-red-500 hover:underline transition-colors duration-300">
            {{ $t('common.viewAll') }}
          </router-link>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          <!-- Loading/Error States (similar to above) -->

          <div v-for="product in filteredProducts.slice(0, 4)" :key="product._id"
            class="bg-white rounded-lg border border-gray-200 overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col h-full">
            <!-- Product Image -->
            <div class="bg-gray-50 p-4 h-48 flex items-center justify-center">
              <img :src="product.imageURL || require('@/assets/image.png')" alt="Product Image"
                class="max-w-full max-h-40 object-contain">
            </div>

            <!-- Product Info -->
            <div class="p-4 flex flex-col flex-grow">
              <!-- Rating -->
              <div class="flex items-center justify-center mb-2">
                <span v-for="i in 5" :key="i" class="text-xl"
                  :class="{ 'text-yellow-400': i <= (product.avgRating || 0), 'text-gray-300': i > (product.avgRating || 0) }">
                  ★
                </span>
                <span v-if="product.ratingCount" class="ml-2 text-xs text-gray-500">({{ product.ratingCount }})</span>
              </div>
              <button @click="openRatingModal(product)"
                class="text-xs text-blue-500 underline hover:text-blue-700 mb-2">{{ $t('home.rateProduct') }}</button>

              <!-- Product Name -->
              <h3 class="text-base font-bold text-center mb-2 text-gray-800">
                {{ product.name }}
              </h3>

              <!-- Description -->
              <p class="text-sm text-gray-600 text-center mb-3 flex-grow">
                {{ product.description || $t('home.premiumProduct') }}
              </p>

              <!-- Price -->
              <div class="text-center my-4">
                <p v-if="product.discount > 0" class="text-xs text-gray-500 line-through">
                  {{ formatPrice(product.salePrice) }}
                </p>
                <p class="text-xl font-bold text-gray-800">
                  {{ formatPrice(calculateFinalPrice(product)) }} {{ product.currency?.symbol?.symbol1.symbol || '' }}
                </p>
                <span v-if="product.discount > 0" class="text-sm text-red-600 font-bold">
                  {{ $t('common.save') }} {{ product.discount }}%
                </span>
              </div>

              <!-- Buttons -->
              <div class="flex justify-between items-center mt-2">
                <button @click="toggleFavorite(product)">
                  <span :class="{ favorited: product.isFavorite }" class="heart">❤</span>
                </button>

                <button @click="addToCart(product)"
                  class="bg-yellow-400 text-gray-800 border-none px-4 py-2 rounded cursor-pointer transition-all duration-300 font-bold text-sm flex-grow ml-2 hover:bg-orange-400 hover:text-white">
                  {{ $t('common.addToCart') }}
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
          <p class="text-sm italic">{{ $t('footer.slogan') }}</p>
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
            <h3 class="font-bold mb-1">{{ $t('footer.factoryAddress') }}</h3>
            <h3 class="font-bold mb-1">{{ $t('footer.officeAddress') }}</h3>
            <h3 class="font-bold mb-1">{{ $t('footer.emailUs') }}</h3>
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
            <h3 class="font-bold mb-1">{{ $t('footer.officeAddress') }}</h3>
            <p class="text-sm">{{ $t('footer.officeAddressDetail') }}</p>
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
            <h3 class="font-bold mb-1">{{ $t('footer.emailUs') }}</h3>
            <p class="text-sm">Info@tehrice.com</p>
          </div>
        </div>
      </div>
    </footer>

    <!-- Cart Drawer -->
    <div v-if="showCartDrawer"
      class="fixed top-0 right-0 w-[360px] h-full bg-white border-l border-gray-200 shadow-lg z-[999] flex flex-col p-5">
      <div class="flex justify-between items-center mb-3 text-lg">
        <h3 class="font-medium">{{ $t('cart.title') }}</h3>
        <button @click="showCartDrawer = false" class="text-xl hover:text-red-500">✕</button>
      </div>

      <div v-if="cartItems.length === 0" class="text-center text-gray-500 mt-12">{{ $t('cart.empty') }}</div>

      <div v-else class="flex-1 overflow-y-auto">
        <div v-for="item in cartItems" :key="item._id" class="flex items-center mb-4">
          <img :src="item.productData?.imageURL || defaultImage"
            class="w-[70px] h-[70px] object-cover mr-3 rounded bg-gray-100" />
          <div class="flex-1">
            <h4 class="m-0 text-sm font-semibold">{{ item.productData?.name || 'Product' }}</h4>
            <div class="flex items-center gap-2.5 my-1">
              <button @click="updateCartQuantity(item, item.quantity - 1)" :disabled="item.quantity <= 1"
                class="w-[22px] h-[22px] border border-gray-200 bg-gray-50 rounded cursor-pointer disabled:opacity-50">−</button>
              <span>{{ item.quantity }}</span>
              <button @click="updateCartQuantity(item, item.quantity + 1)"
                class="w-[22px] h-[22px] border border-gray-200 bg-gray-50 rounded cursor-pointer">+</button>
            </div>
            <p class="text-orange-600 font-bold">{{ calculateItemPrice(item) }}</p>
          </div>
          <button @click="removeFromCart(item._id)"
            class="bg-transparent border-0 text-xl cursor-pointer text-red-700">×</button>
        </div>
      </div>

      <div v-if="cartItems.length > 0" class="mt-4 pt-4 border-t border-gray-200">
        <div class="flex justify-between mb-2">
          <span>{{ $t('cart.subtotal') }}:</span>
          <span class="font-bold">៛{{ calculateCartTotal() }}</span>
        </div>
        <router-link to="/cart"
          class="block w-full bg-yellow-400 text-center py-2 rounded font-bold hover:bg-orange-400 transition-colors">
          {{ $t('cart.viewCart') }}
        </router-link>
      </div>
    </div>

    <!-- Cart Button -->
    <button @click="showCartDrawer = true"
      class="fixed bottom-8 right-8 bg-yellow-400 text-gray-800 rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-orange-400 transition-colors z-50">
      <span class="text-2xl">🛒</span>
      <span v-if="cartItems.length > 0"
        class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
        {{ cartItems.length }}
      </span>
    </button>

    <!-- Rating Modal -->
    <transition name="fade">
      <div v-if="showRatingModal"
        class="fixed inset-0 bg-gray-500 bg-opacity-40 flex items-center justify-center z-[999]">
        <div class="bg-white rounded-lg p-6 w-full max-w-xs shadow-lg">
          <h3 class="text-lg font-bold mb-4">{{ $t('home.rateFor') }} {{ selectedProduct?.name }}</h3>
          <div class="flex justify-center mb-4">
            <span v-for="i in 5" :key="i" @click="setRating(i)" class="text-3xl cursor-pointer"
              :class="{ 'text-yellow-400': i <= rating, 'text-gray-300': i > rating }">
              ★
            </span>
          </div>
          <textarea v-model="review" class="w-full border rounded p-2 mb-4" rows="2"
            :placeholder="$t('home.reviewPlaceholder')"></textarea>
          <div class="flex justify-end gap-2">
            <button @click="showRatingModal = false" class="px-3 py-1 rounded bg-gray-200">{{ $t('common.cancel')
              }}</button>
            <button @click="submitRating" class="px-3 py-1 rounded bg-yellow-400 text-white font-bold">{{
              $t('common.submit') }}</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import apiURL from '@/api/config';
import cover1 from '@/assets/cover1.png';
import cover2 from '@/assets/cover2.png';
import cover4 from '@/assets/cover4.png';
import socket from '@/services/socket'; // Import the socket service
import { useStore } from '@/store/useStore';
import axios from 'axios';
import Swal from 'sweetalert2';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

// Reactive data
const searchQuery = ref('')
const currentSlide = ref(0)
const carouselInterval = ref(null)
const footerRef = ref(null)
const isVisible = ref(false)
const isLoading = ref(false)
const error = ref(null)
const showCartDrawer = ref(false)
const cartItems = ref([])
const defaultImage = require('@/assets/image.png')
const store = useStore()
const showRatingModal = ref(false);
const selectedProduct = ref(null);
const rating = ref(0);
const review = ref('');
const { t } = useI18n();

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
    const response = await axios.get(`${apiURL}/api/public/products`, {
      params: {
        sortField: 'createdAt',
        sortOrder: 'desc',
      }
    })

    console.log('API response:', response.data)

    if (response.data && response.data.success && response.data.data) {
      products.value = response.data.data
      console.log('Products loaded:', products.value.length)
      await applyFavorites()
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

// Fetch cart items from database
async function fetchCartItems() {
  const token = localStorage.getItem('token')
  if (!token) {
    // If no token, try to get cart from localStorage
    const localCart = JSON.parse(localStorage.getItem('cart')) || []
    cartItems.value = localCart
    return
  }

  try {
    // First, fetch cart items
    const cartRes = await axios.get(`${apiURL}/api/getAllDocs/Cart`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : ''
      }
    })


    if (cartRes.data && cartRes.data.success) {
      cartItems.value = cartRes.data.data

      // Extract product IDs from cart items
      const productIds = cartItems.value.map(item => item.productId)

      // Fetch product details for all products in cart
      if (productIds.length > 0) {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${apiURL}/api/getAllDocs/Favorite`, {
          headers: { Authorization: token ? `Bearer ${token}` : '' }
        });

        if (res.data && res.data.success) {
          const productMap = {};
          res.data.data.forEach(product => {
            productMap[product._id] = product;
          });

          cartItems.value.forEach(item => {
            item.productData = productMap[item.productId] || null;
          });
        }
      }

    }
  } catch (err) {
    console.error('Error fetching cart items:', err)
  }
}

// Get favorites from localStorage and mark products
async function applyFavorites() {
  const isAuthenticated = checkAuthStatus();

  if (isAuthenticated) {
    console.log('🔍 Authenticated user detected, fetching favorites from backend...');
    const token = localStorage.getItem('token');

    try {
      const res = await axios.get(`${apiURL}/api/getAllDocs/Favorite`, {
        headers: { Authorization: token ? `Bearer ${token}` : '' }
      });

      if (res.data && res.data.success) {
        const favoriteIds = res.data.data.map(fav => fav.productId?._id);

        products.value.forEach(product => {
          product.isFavorite = favoriteIds.includes(product._id);
        });

        console.log('✅ Applied favorites from backend:', favoriteIds);
      } else {
        console.warn('⚠️ Favorite fetch succeeded but no data found:', res.data);
        products.value.forEach(product => {
          product.isFavorite = false;
        });
      }
    } catch (err) {
      console.error('❌ Error fetching favorites from backend:', err);
      products.value.forEach(product => {
        product.isFavorite = false;
      });
    }
  } else {
    console.log('🔍 Guest user detected, applying favorites from localStorage...');
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const favoriteIds = storedFavorites.map(fav => fav.id);

    products.value.forEach(product => {
      product.isFavorite = favoriteIds.includes(product._id);
    });

    console.log('✅ Applied favorites from localStorage:', favoriteIds);
  }
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

// Calculate price for cart item
function calculateItemPrice(item) {
  const product = item.productData
  if (!product) return '0.00'

  let price = product.salePrice || 0
  if (product.discount && product.discount > 0) {
    const discountAmount = (price * product.discount) / 100
    price = price - discountAmount
  }

  return (price * item.quantity).toFixed(2)
}

// Calculate total cart price
function calculateCartTotal() {
  return cartItems.value.reduce((total, item) => {
    const product = item.productData
    if (!product) return total

    let price = product.salePrice || 0
    if (product.discount && product.discount > 0) {
      const discountAmount = (price * product.discount) / 100
      price = price - discountAmount
    }

    return total + (price * item.quantity)
  }, 0).toFixed(2)
}

// Computed properties
const filteredProducts = computed(() => {
  return products.value.filter(product =>
    product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});


// For "new products" we'll show the most recently added products
const newProducts = computed(() => {
  const now = new Date();
  return products.value
    .filter(product => {
      const createdAt = new Date(product.createdAt);
      const diffDays = (now - createdAt) / (1000 * 60 * 60 * 24);
      return diffDays <= 3;
    })
    .filter(product => product.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
});


// Methods
async function addToCart(product) {
  // Check if user is logged in
  const token = localStorage.getItem("token")
  const finalPrice = calculateFinalPrice(product)

  // If user is logged in, add to cart in database
  if (token) {
    try {
      const response = await axios.post(`${apiURL}/api/insertDoc/Cart`,
        {
          fields: {
            productId: product._id,
            quantity: 1,
            userId: store.getUserId,
            createdBy: store.getUserId,

          }
        },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json'
          }
        }
      )

      if (response.data.success) {
        // Swal.fire({
        //   icon: 'success',
        //   title: t('alerts.addedToCart'),
        //   timer: 1000,
        //   showConfirmButton: false
        // })
        // Refresh cart items
        await fetchCartItems()
        // Show cart drawer
        showCartDrawer.value = true
      }
    } catch (err) {
      console.error('Error adding to cart:', err)
      Swal.fire({
        icon: 'error',
        title: t('alerts.selectRating'),
        text: err.response?.data?.message || t('alerts.unknownError'),
        timer: 1500,
        showConfirmButton: false
      })
    }
  } else {
    // If not logged in, store in localStorage (fallback)
    let cart = JSON.parse(localStorage.getItem("cart")) || []
    let existingItem = cart.find(item => item.productId === product._id)

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.push({
        productId: product._id,
        quantity: 1,
        productData: {
          _id: product._id,
          name: product.name,
          salePrice: product.salePrice,
          discount: product.discount,
          imageURL: product.imageURL
        }
      })
    }

    localStorage.setItem("cart", JSON.stringify(cart))

    // Update local cart items
    cartItems.value = cart

    Swal.fire({
      icon: 'success',
      title: t('alerts.addedToCart'),
      timer: 1000,
      showConfirmButton: false
    })

    // Show cart drawer
    showCartDrawer.value = true
  }
}

// Update cart item quantity
async function updateCartQuantity(item, newQuantity) {
  if (newQuantity < 1) return

  const token = localStorage.getItem("token")

  if (token) {
    try {
      await axios.patch(`${apiURL}/api/updateDoc/Cart/${item._id}`,
        {
          fields: {
            quantity: newQuantity
          }
        },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json'
          }
        }
      )

      // Update local state
      item.quantity = newQuantity
    } catch (err) {
      console.error('Error updating cart quantity:', err)
      Swal.fire({
        icon: 'error',
        title: t('alerts.updateQuantityFailed'),
        timer: 1500,
        showConfirmButton: false
      })
    }
  } else {
    // If not logged in, update in localStorage
    let cart = JSON.parse(localStorage.getItem("cart")) || []
    const existingItem = cart.find(cartItem => cartItem._id === item._id)

    if (existingItem) {
      existingItem.quantity = newQuantity
      localStorage.setItem("cart", JSON.stringify(cart))

      // Update local state
      item.quantity = newQuantity
    }
  }
}

// Remove item from cart
async function removeFromCart(itemId) {
  const token = localStorage.getItem("token")

  if (token) {
    try {
      await axios.delete(`${apiURL}/api/deleteDoc/Cart/${itemId}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : ''
        }
      })

      // Remove from local state
      cartItems.value = cartItems.value.filter(item => item._id !== itemId)

      // Swal.fire({
      //   icon: 'success',
      //   title: t('alerts.removedFromCart'),
      //   timer: 1000,
      //   showConfirmButton: false
      // })
    } catch (err) {
      console.error('Error removing from cart:', err)
      Swal.fire({
        icon: 'error',
        title: t('alerts.failedToRemoveItem'),
        timer: 1500,
        showConfirmButton: false
      })
    }
  } else {
    // If not logged in, remove from localStorage
    let cart = JSON.parse(localStorage.getItem("cart")) || []
    cart = cart.filter(item => item._id !== itemId)
    localStorage.setItem("cart", JSON.stringify(cart))

    // Update local state
    cartItems.value = cart
  }
}

// Check if user is properly authenticated
function checkAuthStatus() {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const storeToken = store.getToken;
  const storeAuth = store.isAuthenticated;
  const storeUserId = store.getUserId;
  const storeUserRole = store.getUserRole;



  // User is authenticated if they have a token AND a userId (either from store or localStorage)
  const hasToken = !!(token || storeToken);
  const hasUserId = !!(storeUserId || user);



  return hasToken && hasUserId;
}

async function toggleFavorite(product) {

  const token = localStorage.getItem("token");
  // Check authentication status
  const isAuthenticated = checkAuthStatus();

  try {
    if (isAuthenticated) {
      // Authenticated: use backend
      if (product.isFavorite) {
        // Remove favorite
        const res = await axios.get(`${apiURL}/api/getAllDocs/Favorite`, {
          headers: { Authorization: token ? `Bearer ${token}` : '' }
        });

        const fav = res.data.data.find(f => f.productId?._id === product._id);

        if (fav) {
          await axios.delete(`${apiURL}/api/deleteDoc/Favorite/${fav._id}`, {
            headers: { Authorization: `Bearer ${store.getToken}` }
          });

          product.isFavorite = false;
          Swal.fire({
            icon: 'success',
            title: t('alerts.removedFromFavorites'),
            timer: 1000,
            showConfirmButton: false
          });
        }
      } else {
        // Add favorite
        const response = await axios.post(`${apiURL}/api/insertDoc/Favorite`, {
          fields: {
            productId: product._id
          }
        }, {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json'
          }
        });

        product.isFavorite = true;
        Swal.fire({
          icon: 'success',
          title: t('alerts.addedToFavorites'),
          timer: 1000,
          showConfirmButton: false
        });
      }
    } else {
      // Not logged in: use localStorage
      let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
      const isFavorited = favorites.some(item => item.id === product._id);

      if (isFavorited) {
        favorites = favorites.filter(item => item.id !== product._id);
        product.isFavorite = false;
        Swal.fire({
          icon: 'success',
          title: t('alerts.removedFromFavorites'),
          timer: 1000,
          showConfirmButton: false
        });
      } else {
        favorites.push({
          id: product._id,
          name: product.name,
          price: calculateFinalPrice(product),
          image: product.imageURL
        });
        product.isFavorite = true;
        console.log('🔍 Favorite added to localStorage');
        Swal.fire({
          icon: 'success',
          title: t('alerts.addedToFavorites'),
          timer: 1000,
          showConfirmButton: false
        });
      }
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }
  } catch (err) {
    console.error('❌ Error toggling favorite:', err);
    console.error('❌ Error response:', err.response?.data);
    Swal.fire({
      icon: 'error',
      title: t('alerts.failedToUpdateFavorite'),
      text: err.response?.data?.message || t('alerts.pleaseTryAgain'),
      timer: 2000,
      showConfirmButton: false
    });
  }
}

const bestSellers = computed(() => {
  return products.value
    .filter(product => product.isBestSeller || (product.salesCount && product.salesCount >= 50))
    .filter(product => product.name.toLowerCase().includes(searchQuery.value.toLowerCase()));
});


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

    if (update.collection === 'Cart') {
      console.log('Cart collection updated, refreshing cart...')
      await fetchCartItems() // Refresh cart when there's an update
    }
  })
}

function openRatingModal(product) {
  selectedProduct.value = product;
  rating.value = 0;
  review.value = '';
  showRatingModal.value = true;
}

function setRating(val) {
  rating.value = val;
}

async function submitRating() {
  if (!rating.value) {
    Swal.fire({ icon: 'warning', title: t('alerts.pleaseSelectRating') });
    return;
  }
  try {
    const token = localStorage.getItem('token');
    const userId = store.getUserId || localStorage.getItem('userId');
    console.log('Submitting rating:', {
      productId: selectedProduct.value._id,
      RTCTrackEvent: rating.value,
      review: review.value,
      userId,
      createdBy: userId,
    });
    await axios.post(`${apiURL}/api/insertDoc/Rate`, {
      fields: {
        productId: selectedProduct.value._id,
        RTCTrackEvent: rating.value,
        review: review.value,
        userId,
        createdBy: userId,
      }
    }, {
      headers: { Authorization: token ? `Bearer ${token}` : '' }
    });
    Swal.fire({ icon: 'success', title: t('alerts.thankYouForRating') });
    showRatingModal.value = false;
    // Optionally: refresh product ratings here
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: t('alerts.failedToSubmitRating'),
      text: err.response?.data?.message || t('alerts.tryAgain')
    });
  }
}




// Lifecycle hooks
onMounted(() => {
  fetchProducts()
  fetchCartItems()
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

<style scoped>
/* Add any custom styles here */
.heart {
  font-size: 20px;
  color: #ccc;
  transition: all 0.2s ease;
}

.heart.favorited {
  color: red;
  transform: scale(1.2);
}
</style>