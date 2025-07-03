<template>
  <div class="history-page min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-5xl mx-auto">
      <!-- Header Section -->
      <div class="text-center mb-10">
        <h1 class="text-3xl sm:text-4xl font-bold text-yellow-800">
          {{ $t('history.yourOrderHistory') }}
        </h1>
        <p class="mt-2 text-lg text-gray-600">
          {{ $t('history.reviewPastPurchases') }}
        </p>
        <div v-if="orders.length > 0" class="mt-6 bg-white shadow-sm rounded-lg p-4 flex justify-center items-center">
          <span class="text-yellow-700 font-medium">
            {{ orders.length }} {{ orders.length === 1 ? $t('history.order') : $t('history.orders') }}
          </span>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-16">
        <div class="w-12 h-12 border-4 border-t-yellow-500 border-gray-200 rounded-full animate-spin"></div>
        <p class="mt-4 text-gray-600">{{ $t('common.loading') }}...</p>
      </div>

      <!-- Order List -->
      <transition-group
        v-else
        name="list"
        tag="div"
        class="grid gap-6"
      >
        <div
          v-for="order in orders"
          :key="order._id"
          class="order-card bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:-translate-y-1 border border-yellow-200"
        >
          <!-- Order Header -->
          <div class="bg-white-50 p-5 border-b border-white-200">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div class="flex items-center">
                <i class="far fa-calendar-alt mr-2 text-yellow-600"></i>
                <h3 class="text-lg font-semibold text-gray-900">
                  {{ formatDate(order.createdAt) }}
                </h3>
              </div>
              <!-- <div class="text-gray-600">
                {{ $t('history.orderId') }}: #{{ order._id.substr(-8) }}
              </div> -->
              <div class="font-semibold text-yellow-700">
                {{ $t('history.total') }}: {{ formatPrice(order.totalCost) }} ៛
              </div>
              <div
                :class="getStatusClass(order.status)"
                class="text-sm font-medium px-3 py-1 rounded-full text-center"
              >
                {{ $t(`history.status.${order.status}`) }}
              </div>
            </div>
          </div>

          <!-- Order Items -->
          <div class="p-5 grid gap-4">
            <div
              v-for="(item, itemIndex) in order.items"
              :key="itemIndex"
              class="flex gap-4 p-4 bg-white-50 rounded-lg  transition-colors border border-white-200"
            >
              <div class="relative flex-shrink-0">
                <img
                  :src="item.image || require('@/assets/image.png')"
                  :alt="item.name"
                  class="w-20 h-20 object-cover rounded-lg border border-yellow-200"
                >
                <span
                  class="absolute -top-2 -right-2 bg-yellow-400 text-gray-900 text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full"
                >
                  {{ item.quantity || 1 }}
                </span>
              </div>
              <div class="flex-1">
                <h4 class="text-lg font-medium text-gray-900">{{ item.name || 'Product' }}</h4>
                <p class="text-yellow-700 font-semibold">{{ formatPrice(item.price) }} ៛</p>
                <!-- Uncomment if reorder functionality is needed -->
                <!-- <button
                  @click="reorderItem(item)"
                  class="mt-2 inline-flex items-center px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded-full hover:bg-yellow-700 transition-colors"
                >
                  <i class="fas fa-redo mr-2"></i> {{ $t('history.reorder') }}
                </button> -->
              </div>
            </div>
          </div>
        </div>
      </transition-group>

      <!-- Empty State -->
      <div v-if="!isLoading && orders.length === 0" class="text-center py-16 bg-white rounded-xl shadow-lg border border-yellow-200">
        <i class="fas fa-shopping-basket text-5xl text-yellow-600 mb-4"></i>
        <h3 class="text-xl font-semibold text-gray-900">{{ $t('history.noHistoryYet') }}</h3>
        <p class="text-gray-600 mt-2">{{ $t('history.completedOrdersAppear') }}</p>
        <button
          @click="navigateToShop"
          class="mt-6 inline-flex items-center px-6 py-3 bg-yellow-600 text-white font-semibold rounded-full hover:bg-yellow-700 transition-colors shadow-md hover:shadow-lg"
        >
          {{ $t('history.startShopping') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import apiURL from '@/api/config.js';
import axios from 'axios';
import Swal from 'sweetalert2';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const router = useRouter();
const { t } = useI18n();
const orders = ref([]);
const isLoading = ref(true);
const API = `${apiURL}/api`;

// Fetch orders from the database
const fetchOrders = async () => {
  try {
    isLoading.value = true;
    const token = localStorage.getItem('token');
    
    if (!token) {
      router.push('/login');
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
    Swal.fire({
      icon: 'error',
      title: t('alerts.error'),
      text: t('alerts.failedToLoadOrders')
    });
  } finally {
    isLoading.value = false;
  }
};

// Format date
const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
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
    cancelled: 'bg-red-100 text-red-800'
  };
  
  return statusMap[status] || 'bg-gray-100 text-gray-800';
};

// Reorder item (uncomment if needed)
const reorderItem = async (item) => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      router.push('/login');
      return;
    }
    
    const cartPayload = {
      fields: {
        productId: item.productId,
        quantity: item.quantity || 1
      }
    };
    
    await axios.post(`${API}/insertDoc/Cart`, cartPayload, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    Swal.fire({
      icon: 'success',
      title: t('history.itemAdded'),
      text: t('history.addedToCart', { item: item.name || 'Product' }),
      timer: 1500,
      showConfirmButton: false
    });
  } catch (error) {
    console.error('Failed to add item to cart:', error);
    Swal.fire({
      icon: 'error',
      title: t('alerts.error'),
      text: t('alerts.failedToAddToCart')
    });
  }
};

// Navigate to shop
const navigateToShop = () => {
  router.push('/');
};

// Fetch orders on mount
onMounted(() => {
  fetchOrders();
});
</script>

<style scoped>
/* List transition animations */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

@media (max-width: 640px) {
  .order-card .grid-cols-4 {
    grid-template-columns: 1fr;
  }
}
</style>