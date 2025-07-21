<template>
  <div class="product-page px-5 py-6 bg-white">
    <h1 class="text-center p-8 text-2xl font-bold">{{ $t('products.title') }}</h1>

    <!-- 🔍 Search -->
    <div class="max-w-xl mx-auto mb-5">
      <input v-model="searchQuery" type="text" :placeholder="$t('products.searchPlaceholder')"
        class="w-full py-3 px-5 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-300" />
    </div>

    <!-- 🏷️ Category Tabs -->
    <div class="flex justify-center gap-2 mb-5">
      <button
        v-for="cat in categories"
        :key="cat.value"
        :class="[ 'px-4 py-2 rounded-full', activeCategory === cat.value ? 'bg-yellow-400 font-bold' : 'bg-gray-100 font-normal', 'transition-colors duration-200' ]"
        @click="activeCategory = cat.value"
      >
        {{ $t(cat.label) }}
      </button>
    </div>

    <!-- 🛍️ Product Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
      <div class="border border-gray-100 rounded-md overflow-hidden flex flex-col transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg bg-white" v-for="product in filteredProducts" :key="product._id">
        <img :src="product.imageURL || defaultImage" class="h-40 object-contain p-3 bg-gray-50" />
        <div class="p-4 flex-1 flex flex-col">
          <!-- Star Rating -->
          <div class="flex items-center justify-center mb-2">
            <span v-for="i in 5" :key="i" class="text-xl"
              :class="{ 'text-yellow-400': i <= (product.avgRating || 0), 'text-gray-300': i > (product.avgRating || 0) }">
              ★
            </span>
            <span v-if="product.ratingCount" class="ml-2 text-xs text-gray-500">({{ product.ratingCount }})</span>
          </div>
          <h2 class="text-base font-bold mb-1">{{ product.name }}</h2>
          <p class="text-xs text-gray-500 mb-1">{{ product.description || $t('products.noDescription') }}</p>
          <p class="text-xs text-gray-400 mb-2">🗂️ {{ $t('products.category') }}: {{ product.categoryName || $t('common.na') }}</p>

          <div class="flex items-center gap-2 text-sm mb-2">
            <span v-if="product.discount > 0" class="line-through text-gray-400">${{ product.salePrice.toFixed(2) }}</span>
            <span class="text-orange-600 font-bold text-lg">៛{{ discountedPrice(product).toFixed(2) }}</span>
            <span v-if="product.discount > 0" class="bg-yellow-200 px-2 py-0.5 rounded text-xs text-gray-700">{{ $t('common.save') }} {{ product.discount }}%</span>
          </div>

          <div class="flex justify-between items-center mt-auto">
            <button @click="toggleFavorite(product)">
              <span :class="[ 'text-2xl transition-all', product.isFavorite ? 'text-red-500 scale-110' : 'text-gray-300' ]">❤</span>
            </button>
            <button class="bg-yellow-400 hover:bg-yellow-300 border-none px-3 py-1.5 rounded font-bold text-sm" @click="addToCart(product)">{{ $t('products.addToCart') }}</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 🧺 Cart Drawer -->
    <CartDrawer
      :visible="showCartDrawer"
      :cartItems="cartItems"
      @close="showCartDrawer = false"
      @updateQty="updateQty"
      @removeItem="removeItem"
    />
  </div>
</template>

<script setup>
import apiURL from '@/api/config.js';
import CartDrawer from '@/components/CartDrawer.vue';
import socket from '@/services/socket';
import { useStore } from '@/store/useStore';
import axios from 'axios';
import Swal from 'sweetalert2';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';


const showCartDrawer = ref(false);
const cartItems = ref([]);
const store = useStore();
const { t } = useI18n();
const defaultImage = require('@/assets/image.png');
const API = `${apiURL}/api`;

const products = ref([]);
const favorites = ref([]);

// Helper function to redirect to registration page
const redirectToRegister = () => {
  window.location.href = '/register';
};

// Helper function to redirect to login page
const redirectToLogin = () => {
  window.location.href = '/login';
};
const searchQuery = ref('');
const activeCategory = ref('all');

const categories = ref([
  { label: 'products.categories.all', value: 'all' },
  { label: 'products.categories.bestSellers', value: 'best' },
  { label: 'products.categories.newArrivals', value: 'new' }
]);


// Check if user is properly authenticated
function checkAuthStatus() {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const storeToken = store.getToken;
  const storeUserId = store.getUserId;

  const hasToken = !!(token || storeToken);
  const hasUserId = !!(storeUserId || user);

  
  return hasToken && hasUserId;
}

const addToCart = async (product) => {
  // Check authentication status before adding to cart
  const isAuthenticated = checkAuthStatus();
  
  if (!isAuthenticated) {
    // Show registration/login prompt if user is not logged in
    Swal.fire({
      icon: 'info',
      title: t('alerts.authenticationRequired'),
      text: t('alerts.loginToAddCart'),
      showCancelButton: true,
      confirmButtonText: t('common.register'),
      cancelButtonText: t('common.login'),
      showCloseButton: true
    }).then((result) => {
      if (result.isConfirmed) {
        redirectToRegister();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        redirectToLogin();
      }
    });
    return;
  }
  
  // If user is authenticated, proceed with adding to cart
  const exists = cartItems.value.find(i => i._id === product._id);
  if (exists) exists.quantity += 1;
  else cartItems.value.push({ ...product, quantity: 1 });
  showCartDrawer.value = true;
};

const updateQty = (item, qty) => {
  if (qty < 1) return;
  item.quantity = qty;
};

const removeItem = (item) => {
  cartItems.value = cartItems.value.filter(i => i._id !== item._id);
};

const fetchProducts = async () => {
  try {
    const res = await axios.get(`${API}/public/products`);
    const now = new Date();

    products.value = res.data.data.map(p => {
      // Calculate if created in the last 3 days
      const createdAt = new Date(p.createdAt);
      const diffDays = (now - createdAt) / (1000 * 60 * 60 * 24);
      const isNew = diffDays <= 3;

      // Determine best seller based on backend flag or custom logic
      const isBestSeller = p.isBestSeller || (p.salesCount && p.salesCount >= 50); // example threshold

      return {
        ...p,
        isFavorite: false,
        isNew,
        isBestSeller,
      };
    });
    console.log('Products loaded:', products.value.length);
  } catch (err) {
    console.error('❌ Failed to load products:', err);
  }
};


const fetchFavorites = async () => {
  const isAuthenticated = checkAuthStatus();
  
  if (!isAuthenticated) {
    console.log('🔍 User not authenticated, skipping favorites fetch');
    return;
  }
  
  try {
    const res = await axios.get(`${API}/getAllDocs/Favorite`, {
      headers: { Authorization: `Bearer ${store.getToken}` }
    });
    
    favorites.value = res.data.data || [];
    
    // Mark products as favorite
    products.value.forEach(p => {
      p.isFavorite = favorites.value.some(fav => fav.productId?._id === p._id);
    });
  } catch (err) {
    console.error('❌ Failed to fetch favorites:', err);
  }
};

const toggleFavorite = async (product) => {
  // Check authentication status
  const isAuthenticated = checkAuthStatus();
  
  // If not authenticated, prompt user to register/login instead of using localStorage
  if (!isAuthenticated) {
    Swal.fire({
      icon: 'info',
      title: t('alerts.authenticationRequired'),
      text: t('alerts.loginToSaveFavorites'),
      showCancelButton: true,
      confirmButtonText: t('common.register'),
      cancelButtonText: t('common.login'),
      showCloseButton: true
    }).then((result) => {
      if (result.isConfirmed) {
        redirectToRegister();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        redirectToLogin();
      }
    });
    return;
  }
  
  try {
    // User is authenticated, proceed with backend operations
    if (product.isFavorite) {
      // Remove favorite
      const fav = favorites.value.find(f => f.productId?._id === product._id);
      
      if (fav) {
        await axios.delete(`${API}/deleteDoc/Favorite/${fav._id}`, {
          headers: { Authorization: `Bearer ${store.getToken}` }
        });
        
        favorites.value = favorites.value.filter(f => f._id !== fav._id);
        product.isFavorite = false;
        console.log('🔍 Favorite removed successfully');
        Swal.fire({ 
          icon: 'success', 
          title: t('alerts.removedFromFavorites'), 
          timer: 1000, 
          showConfirmButton: false 
        });
      }
    } else {
      // Add favorite
      console.log('🔍 Adding favorite to backend');
      const response = await axios.post(`${API}/insertDoc/Favorite`, {
        fields: { 
          productId: product._id
        }
      }, {
        headers: { 
          Authorization: `Bearer ${store.getToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      favorites.value.push(response.data.data);
      product.isFavorite = true;
      Swal.fire({ 
        icon: 'success', 
        title: t('alerts.addedToFavorites'), 
        timer: 1000, 
        showConfirmButton: false 
      });
    }
  } catch (err) {
    console.error('❌ Error toggling favorite:', err);
    console.error('❌ Error response:', err.response?.data);
    Swal.fire({ 
      icon: 'error', 
      title: t('alerts.failedToUpdateFavorite'), 
      text: err.response?.data?.message || t('alerts.tryAgain'), 
      timer: 2000, 
      showConfirmButton: false 
    });
  }
};

const discountedPrice = (product) => {
  if (!product.discount) return product.salePrice;
  return product.salePrice * (1 - product.discount / 100);
};

const filteredProducts = computed(() => {
  let list = products.value.filter(p =>
    p.name?.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
  if (activeCategory.value === 'best') {
    list = list.filter(p => p.isBestSeller);
  } else if (activeCategory.value === 'new') {
    list = list.filter(p => p.isNew);
  }
  return list;
});

onMounted(async () => {
  console.log('Product component mounted');
  try {
    // Always fetch products
    await fetchProducts();
    
    // Check authentication status for features requiring auth
    const isAuthenticated = checkAuthStatus();
    if (isAuthenticated) {
      console.log('User is authenticated, fetching favorites');
      await fetchFavorites();
      
      // Setup socket connections for authenticated users
      setupSocketListeners();
    } else {
      console.log('User is not authenticated, skipping auth-required features');
    }
  } catch (error) {
    console.error('Error during component initialization:', error);
  }
});

// Separate function to set up socket listeners
const setupSocketListeners = () => {
  // 📡 Real-time product events
  socket.on('productCreated', (product) => {
    console.log('🆕 Real-time productCreated:', product);
    fetchProducts();
  });
  socket.on('productUpdated', (product) => {
    console.log('🔄 Real-time productUpdated:', product);
    fetchProducts();
  });
  socket.on('productDeleted', (productId) => {
    console.log('🗑️ Real-time productDeleted:', productId);
    fetchProducts();
  });
};

onUnmounted(() => {
  // Clean up socket listeners only if they were set up
  if (checkAuthStatus()) {
    console.log('Cleaning up socket listeners');
    socket.off('productCreated');
    socket.off('productUpdated');
    socket.off('productDeleted');
  }
});

</script>