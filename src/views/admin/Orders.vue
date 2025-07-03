<template>
  <div class="p-5 font-sans bg-white rounded-md h-[100vh] overflow-y-auto mt-10 font-khmer">
    <p class="text-left font-semibold text-lg">{{ $t('order.title') }}</p>


    <div class="flex flex-col md:flex-row md:items-center md:space-x-4 mt-4 w-full">
      <!-- Dropdown (Items per page) -->
      <div class="w-full md:w-auto mb-2 md:mb-0">
        <div class="relative">
          <button @click="toggleDropdownRow"
            class="flex items-center justify-between w-full min-w-[90px] px-3 py-2 bg-gray-100 rounded-lg border border-gray-200">
            <span class="text-sm font-medium">{{ selectedItem }}</span>
            <i class="fas fa-chevron-down transition-transform duration-200" :class="{ 'rotate-180': isOpen }"></i>
          </button>
          <div v-show="isOpen"
            class="absolute left-0 mt-2 w-full bg-white border border-gray-200 shadow-lg rounded-lg p-1 z-50">
            <div 
              class="px-3 py-1 cursor-pointer hover:bg-gray-100 rounded">
              {{ }}
            </div>
          </div>
        </div>
      </div>

      <!-- Search Input -->
      <div class="relative w-full md:w-64 lg:w-72 xl:w-80">
        <input 
          v-model="searchQuery" 
          type="text"  
          :placeholder="$t('order.searchPlaceholder')"
          class="pl-3 pr-10 py-2 border border-gray-300 rounded-md outline-none w-full transition" 
        />
        <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <i class="fa-solid fa-magnifying-glass"></i>
        </span>
      </div>


      <!-- Status Filter -->
      <div class="relative w-full sm:w-40">
        <select v-model="statusFilter" class="pl-3 pr-8 py-2 border border-gray-300 rounded-md outline-none w-full transition">
          <option value="all">{{ $t('order.allOrders') }}</option>
          <option value="processing">{{ $t('order.processing') }}</option>
          <option value="shipped">{{ $t('order.shipped') }}</option>
          <option value="intransit">{{ $t('order.inTransit') }}</option>
          <option value="outfordelivery">{{ $t('order.outForDelivery') }}</option>
          <option value="delivered">{{ $t('order.delivered') }}</option>
          <option value="cancelled">{{ $t('order.cancelled') }}</option>
          <option value="paid">{{ $t('order.paid') }}</option>
          <option value="pending">{{ $t('order.pending') }}</option>
        </select>
      </div>

      <!-- Date Range Filter -->
      <div class="flex items-center space-x-2 w-full md:w-auto">
        <input type="date" v-model="startDate" 
          class="pl-3 pr-8 py-2 border border-gray-300 rounded-md outline-none transition text-sm w-full md:w-auto" />
        <span class="text-gray-500">{{ $t('order.dateRangeTo') }}</span>
        <input type="date" v-model="endDate" 
          class="pl-3 pr-8 py-2 border border-gray-300 rounded-md outline-none transition text-sm w-full md:w-auto" />
      </div>

      <!-- Refresh Button -->
      <!-- <div class="md:ml-auto w-full md:w-auto flex md:block">
        <button 
          class="bg-gradient-to-br from-blue-400 to-blue-600 text-white px-4 py-2 rounded-md text-xs font-semibold shadow hover:from-blue-500 hover:to-blue-700 transition"
          style="min-width: 100px;">
          <i class="fas fa-sync-alt mr-1"></i> Refresh
        </button>
      </div> -->
    </div>

    <!-- Table -->
    <div class="overflow-y-auto mt-5 relative bg-white rounded-lg shadow-sm border border-gray-100" style="max-height: 60vh;">
      <!-- Loading Overlay -->
      <div v-if="isLoading" class="absolute inset-0 bg-opacity-70 flex items-center justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-900"></div>
      </div>

      <table class="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-2 font-semibold text-gray-500 text-left uppercase tracking-wide border-b border-gray-200">No</th>
            <th class="px-4 py-2 font-semibold text-gray-500 text-left uppercase tracking-wide border-b border-gray-200">{{ $t('order.customer') }}</th>
            <th class="px-4 py-2 font-semibold text-gray-500 text-center uppercase tracking-wide border-b border-gray-200">{{ $t('order.date') }}</th>
            <th class="px-4 py-2 font-semibold text-gray-500 text-center uppercase tracking-wide border-b border-gray-200">{{ $t('order.items') }}</th>
            <th class="px-4 py-2 font-semibold text-gray-500 text-center uppercase tracking-wide border-b border-gray-200">{{ $t('order.total') }}</th>
            <th class="px-4 py-2 font-semibold text-gray-500 text-center uppercase tracking-wide border-b border-gray-200">{{ $t('order.status') }}</th>
            <th class="px-4 py-2 font-semibold text-gray-500 text-center uppercase tracking-wide border-b border-gray-200">{{ $t('order.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for = "(item, index) in orderData" :key="index"
            class="hover:bg-yellow-50 transition-colors duration-100 border-b border-gray-100 last:border-none">
            <td class="px-4 py-2 font-medium text-gray-800">{{ index + 1}}</td>
            <td class="px-4 py-2 text-gray-700">{{ item.userId && item.userId.name ? item.userId.name : 'Guest' }}</td>
            <td class="px-4 py-2 text-center text-gray-600">{{ formatDate(item.createdAt) }}</td>
            <td class="px-4 py-2 text-center text-gray-600">{{ item.items.length }}</td>
            <td class="px-4 py-2 text-center font-medium text-gray-700">{{ item.totalCost ? '៛' + item.totalCost.toFixed(2) : '៛0.00' }}</td>
            <td class="px-4 py-2 text-center">
              <span class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold"
                :class="getStatusClass(item.status)">
                {{ $t(`order.${item.status.toLowerCase()}`) || item.status }}
              </span>
            </td>
            <td class="px-4 py-2 flex justify-center gap-2">
              <button class="p-1 rounded hover:bg-blue-100 transition" @click="viewOrder(item._id)" aria-label="View">
                <i class="fa-solid fa-eye text-blue-600 hover:text-blue-700"></i>
              </button>
              <button v-if="item.status !== 'Delivered' && item.status !== 'Cancelled'"
                class="p-1 rounded hover:bg-green-100 transition" @click="editOrder(item._id)" aria-label="Edit">
                <i class="fa-solid fa-pen-to-square text-green-600 hover:text-green-700"></i>
              </button>
            </td>
          </tr>
          <tr v-if="filteredOrders.length === 0 && !isLoading">
            <td colspan="7" class="px-4 py-8 text-center text-gray-400 italic">
              {{ $t('order.noOrdersFound') }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination Component -->
    <Pagination :currentPage="currentPage" @onEmitDataFromPagination="handleListenToPagination"
      @onEmitIsLoading="handleListenIsLoading" @onEmitCurrentPageIsLastRecord="handleListenIsLastRecordOnPage"
      :limitedPerPage="pageSize" :searchQuery="searchText" />

    <!-- Order Detail Modal -->
    <div v-if="selectedOrder" class="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[1000]">
      <div class="font-sans w-[95%] md:w-[80%] max-w-4xl mt-20 p-6 bg-white shadow-md rounded-lg relative z-50 m-auto overflow-y-auto max-h-[80vh]">
        <!-- Close Button -->
        <i class="fa-solid fa-circle-xmark cursor-pointer text-red-700 text-lg absolute top-3 right-3 
          hover:text-red-500 transform hover:scale-105 transition-all duration-300 ease-in-out"
          @click="selectedOrder = null"></i>

        <h2 class="text-lg font-semibold mb-4 text-gray-700 text-center mt-[-15px]">
          {{ $t('order.orderDetails') }} #{{ selectedOrder.orderNumber || selectedOrder._id }}
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div class="space-y-2">
            <div class="flex items-center">
              <span class="text-sm font-medium text-gray-500 w-24">{{ $t('order.customer') }}:</span>
              <span class="text-sm text-gray-700">{{ selectedOrder.userId?.name || 'Guest' }}</span>
            </div>
            <div class="flex items-center">
              <span class="text-sm font-medium text-gray-500 w-24">{{ $t('order.date') }}:</span>
              <span class="text-sm text-gray-700">{{ formatDate(selectedOrder.createdAt) }}</span>
            </div>
            <!-- <div v-if="selectedOrder.trackingNumber" class="flex items-center">
              <span class="text-sm font-medium text-gray-500 w-24">{{ $t('order.tracking') }}:</span>
              <span class="text-sm text-gray-700">{{ selectedOrder.trackingNumber }}</span>
            </div> -->
            <!-- <div class="flex ">
              <span class="text-sm font-medium text-gray-500 w-24">{{ $t('order.paymentMethod') }}:</span>
              <span class="text-sm text-gray-700 pl-2">{{ selectedOrder.paymentMethod || '-' }}</span>
            </div> -->
          </div>

          <div class="space-y-2">
            <!-- <div class="flex items-center">
              <span class="text-sm font-medium text-gray-500 w-24">{{ $t('order.status') }}:</span>
              <select v-model="selectedOrder.status" 
                class="border border-gray-300 focus:border-green-500 focus:ring-green-100 rounded-md px-3 py-1 text-sm outline-none transition">
                <option v-for="status in statusOptions" :key="status" :value="status">
                  {{ $t(`order.${status.toLowerCase()}`) }}
                </option>
              </select>
            </div> -->
            <div class="flex items-center">
              <span class="text-sm font-medium text-gray-500 w-24">{{ $t('order.status') }}:</span>
              <span class="text-sm text-gray-700" :class="selectedOrder.paymentStatus === 'paid' ? 'text-green-600 font-medium' : 'text-red-600 font-medium'">
                {{ selectedOrder.paymentStatus ? $t(`order.${selectedOrder.paymentStatus.toLowerCase()}`) : '-' }}
              </span>
            </div>
            <div v-if="selectedOrder.deliveryAddress" class="flex items-start">
              <span class="text-sm font-medium text-gray-500 w-24">{{ $t('order.shippingAddress') }}:</span>
              <span class="text-sm text-gray-700">{{ selectedOrder.deliveryAddress }}</span>
            </div>
          </div>
        </div>

        <div class="border-t border-gray-200 pt-4">
          <h3 class="font-medium text-gray-700 mb-3">{{ $t('order.orderItems') }}</h3>
          <div class="space-y-3">
            <div v-for="item in selectedOrder.items" :key="item.id || item.productId" 
              class="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition">
              <div class="w-16 h-16 bg-gray-100 rounded overflow-hidden flex items-center justify-center mr-4">
                <img :src="item.image || ''" alt="" class="w-full h-full object-cover" v-if="item.image">
                <i v-else class="fas fa-box text-gray-400"></i>
              </div>
              <div class="flex-1">
                <h4 class="font-medium text-gray-800">{{ item.name }}</h4>
                <p class="text-sm text-gray-500">{{ item.productId?.name }}</p>
              </div>
              <div class="font-medium text-gray-700">
                {{ item.quantity }} x ៛{{ item.price.toFixed(2) }}
              </div>
            </div>
          </div>
        </div>

        <div class=" mt-6 pt-4">
          <!-- <div class="flex justify-between items-center">
            <span class="text-sm text-gray-500">{{ $t('order.subtotal') }}:</span>
            <span class="text-sm text-gray-700">៛{{ selectedOrder.subtotal?.toFixed(2) || '0.00' }}</span>
          </div>
          <div class="flex justify-between items-center mt-2">
            <span class="text-sm text-gray-500">{{ $t('order.shipping') }}:</span>
            <span class="text-sm text-gray-700">៛{{ selectedOrder.shippingCost?.toFixed(2) || '0.00' }}</span>
          </div> -->
          <div class="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
            <span class="font-medium text-gray-700">{{ $t('order.total') }}:</span>
            <span class="font-medium text-gray-900">៛{{ selectedOrder.totalCost?.toFixed(2) || '0.00' }}</span>
          </div>
        </div>

        <div class="flex justify-end mt-6 space-x-3">
          <button @click="selectedOrder = null"
            class="px-5 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition">
            {{ $t('order.close') }}
          </button>
          <button @click="updateOrder"
            class="px-5 py-2 rounded-full text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition">
            {{ $t('order.updateOrder') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import apiURL from '@/api/config';
import Pagination from '@/components/Pagination.vue';
import axios from 'axios';
import { onMounted, ref, watch } from 'vue';
import { useStore } from '@/store/useStore'
import formatDate from '@/composables/formatDate'
// State
const orders = ref([]);
const filteredOrders = ref([]);
const selectedOrder = ref(null);
const statusFilter = ref('all');
const startDate = ref('');
const endDate = ref('');
const isLoading = ref(false);
const searchQuery = ref('');
const searchText = ref('');
const currentPage = ref(1);
const pageSize = ref(10);
const currentPageIsLastRecord = ref(null);
const limitedPerPage = ref(10);
const items = ref([1, 10, 50, 100]);
const selectedItem = ref(10);
const isOpen = ref(false);
const userData = ref([]);
const store = useStore();
const orderData = ref([]);




const getUserData = async () => {
  try {
    isLoading.value = true;
    const params = {
      dynamicConditions: JSON.stringify([
        {
          field: "_id",
          operator: "==",
          value: store.getUserId
        }
      ])
    }
    const response = await axios.get(`${apiURL}/api/getAllDocs/User`, {
      params,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    console.log("User data:", response.data.data);
    userData.value = response.data.data;

  
  } catch (error) {
    console.log("Error fetching user data:", error);
    
  }
}



// Fetch orders from the backend
const fetchOrders = async () => {
  try {
    isLoading.value = true;
    const params = {
      collectionName: 'Order',
      populate: JSON.stringify(['userId']),
      // pageSize: 100 // Adjust this number based on your needs
    }
    const response = await axios.get(`${apiURL}/api/getPagination`, {
      params,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });

    console.log("Order data:", response.data.data);
    orderData.value = response.data.data;
   
  } catch (error) {
    console.error('Error fetching orders:', error);
    orders.value = [];
  } finally {
    isLoading.value = false;
  }
};


// Dropdown handlers
const toggleDropdownRow = () => {
  isOpen.value = !isOpen.value;
};

const selectItem = (item) => {
  selectedItem.value = item;
  limitedPerPage.value = item;
  pageSize.value = item;
  isOpen.value = false;
};

// Pagination handlers
const handleListenToPagination = async (items) => {
  filteredOrders.value = items || [];
};

const handleListenIsLoading = (status) => {
  isLoading.value = status;
};

const handleListenIsLastRecordOnPage = (page) => {
  currentPageIsLastRecord.value = page;
  if (currentPage.value > 1) {
    currentPage.value -= 1;
  }
};

// Get status class for styling
const getStatusClass = (status) => {
  if (!status) return 'bg-gray-100 text-gray-800';
  
  const statusLower = status.toLowerCase();
  switch (statusLower) {
    case 'processing':
      return 'bg-blue-100 text-blue-800';
    case 'shipped':
      return 'bg-purple-100 text-purple-800';
    case 'in transit':
      return 'bg-indigo-100 text-indigo-800';
    case 'out for delivery':
      return 'bg-amber-100 text-amber-800';
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
    case 'canceled':
      return 'bg-red-100 text-red-800';
    case 'paid':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// View order details
const viewOrder = (orderId) => {
  selectedOrder.value = orderData.value.find(order => order._id === orderId);
};

// Edit order details
const editOrder = (orderId) => {
  selectedOrder.value = orderData.value.find(order => order._id === orderId);
};

// Fetch orders on component mount
onMounted(() => {
  fetchOrders();
  getUserData();
});
</script>

<style scoped>
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #f9f9f6;
  border-radius: 20px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Footer scroll animation */
@keyframes scroll {
  0% {
    left: -22%;
  }

  100% {
    left: 100%;
  }
}

.animate-scroll {
  position: absolute;
  animation: scroll 20s linear infinite;
}
</style>


