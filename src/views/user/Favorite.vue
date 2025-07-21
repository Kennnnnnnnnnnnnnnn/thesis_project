<template>
  <div class="bg-white min-h-screen mt-14">
    <div class="max-w-6xl mx-auto p-6">
      <!-- <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">❤️ {{ $t('favorites.title') }}</h1> -->

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
        <p class="mt-2 text-gray-600">{{ $t('favorites.loading') }}</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="favorites.length === 0" class="text-center py-12">
        <div class="text-6xl mb-4">💔</div>
        <h2 class="text-xl font-semibold text-gray-800 mb-2">{{ $t('favorites.emptyTitle') }}</h2>
        <p class="text-gray-600 mb-6">{{ $t('favorites.emptyDescription') }}</p>
        <router-link to="/" class="bg-yellow-400 text-gray-800 px-6 py-3 rounded-lg font-bold hover:bg-orange-400 transition-colors">
          {{ $t('favorites.browseProducts') }}
        </router-link>
      </div>

      <!-- Favorites Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div
          v-for="fav in favorites"
          :key="fav._id"
          class="bg-white rounded-lg border border-gray-200 overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col h-full"
        >
          <!-- Product Image -->
          <div class="bg-gray-50 p-4 h-48 flex items-center justify-center">
            <img
              :src="fav.productId?.imageURL || require('@/assets/image.png')"
              :alt="fav.productId?.name || 'Product'"
              class="max-w-full max-h-40 object-contain"
            />
          </div>

          <!-- Product Info -->
          <div class="p-4 flex flex-col flex-grow">
            <!-- Rating -->
            <div class="text-yellow-400 text-base mb-2">
              ★★★★★
            </div>

            <!-- Product Name -->
            <h3 class="text-base font-bold mb-2 text-gray-800 line-clamp-2">
              {{ fav.productId?.name || $t('favorites.unknownProduct') }}
            </h3>


            <!-- Description -->
            <p class="text-sm text-gray-600 mb-3 flex-grow line-clamp-2">
              {{ fav.productId?.description || $t('favorites.premiumQuality') }}
            </p>


            <!-- Price -->
            <div class="text-center mb-4">
              <p v-if="fav.productId?.discount > 0" class="text-xs text-gray-500 line-through">
                ៛{{ formatPrice(fav.productId?.salePrice || 0) }}
              </p>
              <p class="text-xl font-bold text-gray-800">
                ៛{{ formatPrice(calculateFinalPrice(fav.productId)) }}
              </p>
              <span v-if="fav.productId?.discount > 0" class="text-sm text-red-600 font-bold">
                Save {{ fav.productId?.discount }}%
              </span>
            </div>

            <!-- Buttons -->
            <div class="flex gap-2">
              <button
                @click="addToCart(fav.productId)"
                class="bg-yellow-400 text-gray-800 border-none px-4 py-2 rounded cursor-pointer transition-all duration-300 font-bold text-sm flex-grow hover:bg-orange-400 hover:text-white"
              >
                {{ $t('favorites.addToCart') }}
              </button>


              <button
                @click="removeFavorite(fav._id)"
                class="bg-red-500 text-white border-none px-3 py-2 rounded cursor-pointer transition-all duration-300 font-bold text-sm hover:bg-red-600"
              >
                ❤
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import apiURL from '@/api/config';
import socket from '@/services/socket';
import { useStore } from '@/store/useStore';
import axios from 'axios';
import Swal from 'sweetalert2';
import { onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
const { t } = useI18n();
const router = useRouter();
// Reactive data
const favorites = ref([]);
const loading = ref(true);
const store = useStore();

// Methods
async function fetchFavorites() {
  try {
    loading.value = true;
    
    // Check if user is logged in
    if (!isAuthenticated()) {
      console.log('User not logged in, fetching favorites from localStorage');
      
      // Check if localStorage is available
      if (!isLocalStorageAvailable()) {
        console.error('localStorage is not available');
        favorites.value = [];
        loading.value = false;
        return;
      }
      
      // Get favorites from localStorage for guest users
      const localFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
      
      if (localFavorites.length > 0) {
        // Transform localStorage favorites to match the structure from the API
        favorites.value = localFavorites.map(item => ({
          _id: item.id, // Use the ID as both the favorite ID and productId
          productId: {
            _id: item.id,
            name: item.name,
            description: item.description || '',
            imageURL: item.image,
            salePrice: parseFloat(item.price) || 0,
            discount: item.discount || 0
          }
        }));
        console.log('Local favorites loaded:', favorites.value.length);
      } else {
        favorites.value = [];
        console.log('No local favorites found');
      }
      loading.value = false;
      return;
    }
    
    // Get the token for authenticated users
    const token = localStorage.getItem('token');
    
    // Log authentication state before making request
    console.log('Token present:', !!token);
    console.log('Auth header:', axios.defaults.headers.common['Authorization']?.substring(0, 20) + '...');
    
    // Make sure to use apiURL, not api, and explicitly pass the authorization header
    const response = await axios.get(`${apiURL}/api/getAllDocs/Favorite`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    favorites.value = response.data.data || [];
    console.log('Backend favorites loaded:', favorites.value.length);
  } catch (error) {
    console.error('❌ Failed to fetch favorites:', error);
    // Add more detailed logging
    if (error.response) {
      console.error('Error status:', error.response.status);
      console.error('Error data:', error.response.data);
    }
  } finally {
    loading.value = false;
  }
}

async function removeFavorite(favoriteId) {
  try {
    // Check if user is logged in
    if (!isAuthenticated()) {
      console.log('Guest user removing favorite from localStorage');
      
      // Get current favorites from localStorage
      let localFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
      
      // Find the favorite item to remove
      const favoriteToRemove = favorites.value.find(f => f._id === favoriteId);
      if (favoriteToRemove) {
        // Filter out the favorite from localStorage
        localFavorites = localFavorites.filter(item => item.id !== favoriteToRemove.productId._id);
        
        // Update localStorage
        localStorage.setItem('favorites', JSON.stringify(localFavorites));
        
        // Update UI
        favorites.value = favorites.value.filter(f => f._id !== favoriteId);
        
        Swal.fire({
          icon: 'success',
          title: t('alerts.removedFromFavorites'),
          timer: 1000,
          showConfirmButton: false
        });
        
        console.log('Local favorite removed');
      }
      return;
    }
    
    // For authenticated users, remove from backend
    const token = localStorage.getItem('token');
    await axios.delete(`${apiURL}/api/deleteDoc/Favorite/${favoriteId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    // Emit update for real-time
    socket.emit('dataUpdate', {
      action: 'delete',
      collection: 'Favorite',
      data: favoriteId
    });

    // Update UI
    favorites.value = favorites.value.filter(f => f._id !== favoriteId);
    
    Swal.fire({
      icon: 'success',
      title: t('alerts.removedFromFavorites'),
      timer: 1000,
      showConfirmButton: false
    });
    
    console.log('Backend favorite removed');
  } catch (err) {
    console.error('Failed to remove favorite:', err);
    Swal.fire({
      icon: 'error',
      title: t('alerts.failedToRemoveFavorite'),
      text: err.response?.data?.message || t('alerts.tryAgain'),
      timer: 2000,
      showConfirmButton: false
    });
  }
}

async function addToCart(product) {
  if (!product) return;
  
  try {
    // Check if user is logged in
    if (!isAuthenticated()) {
      console.log('Guest user adding to cart, using localStorage');
      
      // Get current cart from localStorage
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      
      // Check if product already exists in cart
      const existingItem = cart.find(item => item.productId === product._id);
      
      if (existingItem) {
        // Increment quantity if product already exists
        existingItem.quantity += 1;
      } else {
        // Add new product to cart
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
        });
      }
      
      // Save updated cart to localStorage
      localStorage.setItem('cart', JSON.stringify(cart));
      
      Swal.fire({
        icon: 'success',
        title: t('alerts.addedToCart'),
        timer: 1000,
        showConfirmButton: false
      });
      
      return;
    }
    
    // For authenticated users, add to backend cart
    const userId = store.getUserId || localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    
    if (!userId) {
      console.error('User ID not found in store or localStorage');
      return;
    }
    
    const response = await axios.post(`${apiURL}/api/insertDoc/Cart`, 
      {
        fields: {
          productId: product._id,
          quantity: 1,
          userId: userId,
          createdBy: userId
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (response.data.success) {
      Swal.fire({
        icon: 'success',
        title: t('alerts.addedToCart'),
        timer: 1000,
        showConfirmButton: false
      });
    }
  } catch (err) {
    console.error('Error adding to cart:', err);
    Swal.fire({
      icon: 'error',
      title: t('alerts.failedToAddToCart'),
      text: err.response?.data?.message || t('alerts.unknownError'),
      timer: 1500,
      showConfirmButton: false
    });
  }
}

// Helper functions
function formatPrice(price) {
  return (price || 0).toFixed(2);
}

function calculateFinalPrice(product) {
  if (!product) return 0;
  
  if (!product.discount || product.discount === 0) {
    return product.salePrice || 0;
  }
  
  const discountAmount = ((product.salePrice || 0) * product.discount) / 100;
  return (product.salePrice || 0) - discountAmount;
}

// Check if user is authenticated
function isAuthenticated() {
  try {
    const token = localStorage.getItem('token');
    const userId = store.getUserId || localStorage.getItem('userId');
    return !!token && !!userId; // User must have both token and userId
  } catch (error) {
    console.error('Error checking authentication status:', error);
    return false;
  }
}

// Check if localStorage is available
function isLocalStorageAvailable() {
  try {
    const testKey = '__test_key__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

// Lifecycle
onMounted(() => {
  console.log('Favorite component mounted');
  
  // Always fetch favorites (will use localStorage for guests)
  fetchFavorites();
  
  // Set up socket connection for authenticated users only
  if (isAuthenticated()) {
    console.log('Setting up socket connection for authenticated user');
    
    if (!socket.connected) {
      socket.connect();
    }

    socket.on('dataUpdate', (update) => {
      if (update.collection === 'Favorite') {
        console.log('🔄 Real-time Favorite update received:', update);
        fetchFavorites();
      }
    });

    socket.on('connect', () => console.log('Socket connected:', socket.id));
    socket.on('disconnect', () => console.log('Socket disconnected'));
    socket.on('error', (error) => console.error('Socket error:', error));
  }
});

// Function to add a product to favorites
async function addToFavorite(product) {
  if (!product) return;

  try {
    if (!isAuthenticated()) {
      // For guest users, save to localStorage
      console.log('Guest user adding favorite to localStorage');
      let localFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
      
      // Check if already favorited
      if (localFavorites.some(item => item.id === product._id)) {
        console.log('Product already in favorites');
        return;
      }
      
      // Add to localStorage
      localFavorites.push({
        id: product._id,
        name: product.name,
        price: calculateFinalPrice(product),
        image: product.imageURL,
        description: product.description,
        discount: product.discount
      });
      
      localStorage.setItem('favorites', JSON.stringify(localFavorites));
      
      // Refresh the favorites display
      fetchFavorites();
      
      Swal.fire({
        icon: 'success',
        title: t('alerts.addedToFavorites'),
        timer: 1000,
        showConfirmButton: false
      });
    } else {
      // For authenticated users, save to backend
      const token = localStorage.getItem('token');
      
      const response = await axios.post(`${apiURL}/api/insertDoc/Favorite`, {
        fields: {
          productId: product._id
        }
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Refresh the favorites display
      fetchFavorites();
      
      Swal.fire({
        icon: 'success',
        title: t('alerts.addedToFavorites'),
        timer: 1000,
        showConfirmButton: false
      });
    }
  } catch (err) {
    console.error('Error adding favorite:', err);
    Swal.fire({
      icon: 'error',
      title: t('alerts.failedToUpdateFavorite'),
      text: err.response?.data?.message || t('alerts.tryAgain'),
      timer: 2000,
      showConfirmButton: false
    });
  }
}

onUnmounted(() => {
  // Only clean up socket events if authenticated
  if (isAuthenticated()) {
    socket.off('dataUpdate');
    socket.off('connect');
    socket.off('disconnect');
    socket.off('error');
  }
});
</script>

<style scoped>
/* .line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
} */
</style>