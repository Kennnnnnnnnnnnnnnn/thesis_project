<template>
  <div class="min-h-screen bg-gray-50 font-poppins">
    <div class="max-w-4xl mx-auto p-6">
      <!-- Header -->
      <div class="text-center mb-8">
        <!-- <h1 class="text-3xl font-bold text-gray-800 mb-2">{{ $t('history.yourOrderHistory') }}</h1>
        <p class="text-gray-600 mb-4">{{ $t('history.reviewPastPurchases') }}</p> -->
        <!-- <div v-if="orders.length > 0" class="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
          {{ orders.length }} {{ orders.length === 1 ? $t('history.order') : $t('history.orders') }}
        </div> -->
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-gray-600">{{ $t('common.loading') }}...</p>
      </div>

      <!-- Orders List -->
      <div v-else-if="orders.length > 0" class="space-y-4">
        <div
          v-for="order in orders"
          :key="order._id"
          class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
        >
          <!-- Order Header -->
          <div class="p-4 border-b border-gray-100">
            <div class="flex justify-between items-start">
              <div class="space-y-1">
                <div class="flex items-center text-gray-700">
                  <i class="far fa-calendar-alt mr-2 text-gray-500"></i>
                  <span class="text-sm">{{ formatDate(order.createdAt) }}</span>
                </div>
                <div class="text-lg font-semibold text-gray-800">
                  {{ $t('history.total') }}: {{ formatPrice(order.totalCost) }} ៛
                </div>
              </div>
              <div class="flex flex-col items-end space-y-2">
                <span :class="`px-2 py-1 rounded text-xs font-medium ${getStatusClass(order.status)}`">
                  {{ $t(order.status) }}
                </span>
                <button 
                  v-if="order.status === 'delivering'"
                  @click="confirmReceipt(order)"
                  :disabled="isLoading"
                  class="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <i class="fas fa-check-circle text-xs"></i>
                  {{ isLoading ? 'Confirming...' : 'Confirm' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Pending Animation -->
          <!-- <div v-if="order.status === 'pending'" class="flex justify-center p-4">
            <DotLottieVue
              style="height: 120px; width: 120px"
              autoplay
              loop
              src="https://lottie.host/b3e4008f-9dbd-4b76-b13e-e1cdb52f6190/3JhAvD9aX1.json"
              @complete="onAnimationComplete"
              @error="onAnimationError"
              @ready="onAnimationReady"
            />
          </div> -->

          <!-- Animation when status is confirm -->
          <!-- <div v-if="order.status === 'confirmed'" class="flex justify-center p-4">
            <DotLottieVue
              style="height: 120px; width: 120px"
              autoplay
              loop
              src="https://assets10.lottiefiles.com/packages/lf20_w51pcehl.json"
         
              @complete="onAnimationComplete"
              @error="onAnimationError"
              @ready="onAnimationReady"
            />
          </div> -->

          <!-- Order Items -->
          <div class="p-4">
            <div class="space-y-3">
              <div
                v-for="(item, index) in order.items"
                :key="index"
                class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
              >
                <div class="relative">
                  <img
                    :src="item.image || require('@/assets/image.png')"
                    :alt="item.name"
                    class="w-16 h-16 object-cover rounded-lg"
                  />
                  <span class="absolute -top-1 -right-1 bg-yellow-500 text-white w-5 h-5 text-xs font-bold flex items-center justify-center rounded-full">
                    {{ item.quantity || 1 }}
                  </span>
                </div>
                <div class="flex-1">
                  <h4 class="font-medium text-gray-800 mb-1">{{ item.name || 'Product' }}</h4>
                  <p class="text-gray-600 font-medium">{{ formatPrice(item.price) }} ៛</p>
                </div>
              </div>
            </div>
          </div>
          <!-- Get Product Button -->
          <div v-if="normalizeStatus(order.status) === 'confirmed'" class="flex justify-center p-4">
            <button 
              class="mt-4 px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition"
              :disabled="isLoading"
              @click="confirmGotProduct(order)"
            >
              <i class="fas fa-box-open mr-1"></i> Get Product
            </button>
          </div>

        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center item-center py-12">
        <i class="fas fa-shopping-basket text-4xl text-gray-400 mb-4"></i>
        <h3 class="text-xl font-semibold text-gray-800 mb-2">{{ $t('history.noHistoryYet') }}</h3>
        <p class="text-gray-600 mb-6">{{ $t('history.completedOrdersAppear') }}</p>
        <button @click="navigateToShop" class="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors">
          {{ $t('history.startShopping') }}
        </button>
      </div>
    </div>
  </div>
</template>


<script setup>
import apiURL from '@/api/config.js';
import socket from '@/services/socket.js';
import axios from 'axios';
import { onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'

const router = useRouter();
const { t } = useI18n();
const orders = ref([]);
const isLoading = ref(true);
const showAnimationModal = ref(false);
const API = `${apiURL}/api`;



// Fetch orders
const fetchOrders = async () => {
  try {
    isLoading.value = true;
    const token = localStorage.getItem('token');
    if (!token) {
      // Guest user: don't redirect, just skip fetching
      isLoading.value = false;
      return;
    }

    const response = await axios.get(`${API}/getAllDocs/Order`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.data && response.data.success) {
      orders.value = response.data.data.sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
      );
    }
  } catch (error) {
    console.error('Failed to fetch orders:', error);
  } finally {
    isLoading.value = false;
  }
};

// Format date
const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

// Format price
const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US').format(Math.round(price || 0));
};

// Status classes
const getStatusClass = (status) => {
  const statusMap = {
    paid: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    delivered: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    delivering: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800'
  };
  return statusMap[status] || 'bg-gray-100 text-gray-800';
};

// Confirm receipt function
const confirmReceipt = async (order) => {
  console.log('🔍 Confirm receipt clicked for order:', order._id);
  
  // Only allow confirmation for orders that are delivering
  if (order.status !== 'delivering') {
    console.log('❌ Order status is not delivering:', order.status);
    return;
  }

  try {
    isLoading.value = true;
    console.log('📤 Sending update request...');
    
    const updateData = {
      fields: {
        status: 'completed',
        updatedAt: new Date()
      }
    };

    const response = await axios.patch(
      `${API}/updateDoc/Order/${order._id}`,
      updateData,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }
    );

    console.log('📥 Response received:', response.data);

    if (response.data.success) {
      console.log('✅ Update successful, updating local data...');
      
      // Update the local order data
      const orderIndex = orders.value.findIndex(o => o._id === order._id);
      if (orderIndex !== -1) {
        orders.value[orderIndex] = {
          ...orders.value[orderIndex],
          status: 'completed',
          updatedAt: new Date()
        };
      }

      console.log('🎬 Showing animation modal...');
      // Show animation modal
      showAnimationModal.value = true;
      console.log('🎭 Modal state:', showAnimationModal.value);
    }
  } catch (error) {
    console.error('❌ Error confirming receipt:', error);
  } finally {
    isLoading.value = false;
  }
};

const normalizeStatus = (status) => (status || '').toString().toLowerCase().trim();

const confirmGotProduct = async (order) => {
  console.log('📦 Customer clicked Get Product for order:', order._id);

  // Confirm the action
  const confirm = window.confirm('Are you sure you received your product?');
  if (!confirm) return;

  try {
    isLoading.value = true;
    console.log('📤 Updating order status to got_product...');

    const updateData = {
      fields: {
        status: 'got_product',
        updatedAt: new Date()
      }
    };

    const response = await axios.patch(
      `${API}/updateDoc/Order/${order._id}`,
      updateData,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }
    );

    if (response.data.success) {
      console.log('✅ Order status updated to got_product');

      // Update local data
      const orderIndex = orders.value.findIndex(o => o._id === order._id);
      if (orderIndex !== -1) {
        orders.value[orderIndex] = {
          ...orders.value[orderIndex],
          status: 'got_product',
          updatedAt: new Date()
        };
      }

      // Optionally show success message
      alert('Thank you! Your product has been marked as received.');
    }
  } catch (error) {
    console.error('❌ Error updating to got_product:', error);
    alert('Something went wrong. Please try again.');
  } finally {
    isLoading.value = false;
  }
};


// Animation event handlers
const onAnimationComplete = () => {
  console.log('✅ Animation completed');
  // Close modal after animation completes
  setTimeout(() => {
    console.log('🔒 Closing modal after animation');
    closeAnimationModal();
  }, 2000);
};

const onAnimationError = (error) => {
  console.error('❌ Animation error:', error);
  closeAnimationModal();
};

const onAnimationReady = (lottie) => {
  console.log('✅ Animation ready:', lottie);
};

// Close animation modal
const closeAnimationModal = () => {
  console.log('🚪 Closing animation modal');
  showAnimationModal.value = false;
};

// Navigate to shop
const navigateToShop = () => {
  router.push('/');
};

// Real-time order update listener
const handleDataUpdate = (payload) => {
  console.log('🔔 Socket event received:', payload);
  
  if (payload && payload.collection === 'Order') {
    switch (payload.action) {
      case 'update':
        console.log('📦 Order updated, refetching orders...');
        fetchOrders();
        break;
      case 'insert':
        console.log('🆕 New order created, refetching orders...');
        fetchOrders();
        break;
      case 'delete':
        console.log('🗑️ Order deleted, refetching orders...');
        fetchOrders();
        break;
      default:
        console.log('❓ Unknown action:', payload.action);
    }
  }
};

// Socket connection status monitoring
const handleSocketConnect = () => {
  console.log('✅ Socket connected');
};

const handleSocketDisconnect = () => {
  console.log('❌ Socket disconnected');
};

const handleSocketError = (error) => {
  console.error('🚨 Socket error:', error);
};

// Fetch orders on mount
onMounted(() => {
  fetchOrders();
  
  // Socket event listeners
  socket.on('dataUpdate', handleDataUpdate);
  socket.on('connect', handleSocketConnect);
  socket.on('disconnect', handleSocketDisconnect);
  socket.on('error', handleSocketError);
});

onUnmounted(() => {
  // Clean up all socket listeners
  socket.off('dataUpdate', handleDataUpdate);
  socket.off('connect', handleSocketConnect);
  socket.off('disconnect', handleSocketDisconnect);
  socket.off('error', handleSocketError);
});
</script>

<style scoped>
/* No custom styles needed - using Tailwind CSS */
</style>
