<template>
  <div class="bg-white min-h-screen mt-14">
    <div class="max-w-6xl mx-auto px-5">
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
import { useStore } from '@/store/useStore';
import axios from 'axios';
import Swal from 'sweetalert2';
import { onMounted, ref , onUnmounted} from 'vue';
import { useI18n } from 'vue-i18n';
import socket from '@/services/socket';
const { t } = useI18n();
// Reactive data
const favorites = ref([]);
const loading = ref(true);
const store = useStore();

// Methods
async function fetchFavorites() {
  const token = store.getToken;
  const userId = store.getUserId;
  
  if (!token || !userId) {
    console.warn('Not authenticated');
    loading.value = false;
    return;
  }

  try {
    console.log('Fetching favorites for user:', userId);
    const res = await axios.get(`${apiURL}/api/getAllDocs/Favorite`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('Favorites response:', res.data);
    favorites.value = res.data.data || [];
    console.log('Favorites loaded:', favorites.value.length);
  } catch (err) {
    console.error('Failed to load favorites:', err);
    Swal.fire({
      icon: 'error',
      title: t('alerts.failedToLoadFavorites'),
      text: err.response?.data?.message || t('alerts.tryAgain'),
      timer: 2000,
      showConfirmButton: false
    });
  } finally {
    loading.value = false;
  }
}

async function removeFavorite(favoriteId) {
  try {
    await axios.delete(`${apiURL}/api/deleteDoc/Favorite/${favoriteId}`, {
  headers: { Authorization: `Bearer ${store.getToken}` }
});

  // Emit update for real-time
  socket.emit('dataUpdate', {
    action: 'delete',
    collection: 'Favorite',
    data: favoriteId
  });

    
    favorites.value = favorites.value.filter(f => f._id !== favoriteId);
    
    Swal.fire({
      icon: 'success',
      title: t('alerts.removedFromFavorites'),
      timer: 1000,
      showConfirmButton: false
    });
    
    console.log('Favorite removed');
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
    const response = await axios.post(`${apiURL}/api/insertDoc/Cart`, 
      {
        fields: {
          productId: product._id,
          quantity: 1,
          userId: store.getUserId,
          createdBy: store.getUserId
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${store.getToken}`,
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

// Lifecycle
onMounted(() => {
  fetchFavorites();

  if (!socket.connected) {
    socket.connect();
  }

  socket.on('dataUpdate', (update) => {
    if (update.collection === 'Favorite') {
      console.log('🔄 Real-time Favorite update received:', update);
      fetchFavorites();
    }
  });

  socket.on('connect', () => console.log(' Socket connected:', socket.id));
  socket.on('disconnect', () => console.log(' Socket disconnected'));
  socket.on('error', (error) => console.error(' Socket error:', error));
});

onUnmounted(() => {
  socket.off('dataUpdate');
  socket.off('connect');
  socket.off('disconnect');
  socket.off('error');
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