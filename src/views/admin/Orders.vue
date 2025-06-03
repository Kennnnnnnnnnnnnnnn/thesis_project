<template>
  <div class="p-5 font-sans bg-white rounded-md h-[100vh] overflow-y-auto mt-10">
    <p class="text-left font-semibold text-lg">Order Management</p>

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
            <div v-for="item in items" :key="item" @click="selectItem(item)"
              class="px-3 py-1 cursor-pointer hover:bg-gray-100 rounded">
              {{ item }}
            </div>
          </div>
        </div>
      </div>

      <!-- Search Input -->
      <div class="relative w-full md:w-64 lg:w-72 xl:w-80">
        <input v-model="searchQuery" type="text" placeholder="Search Orders..."
          class="pl-3 pr-10 py-2 border border-gray-300 rounded-md outline-none w-full transition" />
        <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <i class="fa-solid fa-magnifying-glass"></i>
        </span>
      </div>

      <!-- Status Filter -->
      <div class="relative w-full sm:w-40">
        <select v-model="statusFilter" class="pl-3 pr-8 py-2 border border-gray-300 rounded-md outline-none w-full transition">
          <option value="all">All Orders</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="intransit">In Transit</option>
          <option value="outfordelivery">Out for Delivery</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <!-- Date Range Filter -->
      <div class="flex items-center space-x-2 w-full md:w-auto">
        <input type="date" v-model="startDate" @change="filterOrders"
          class="pl-3 pr-8 py-2 border border-gray-300 rounded-md outline-none transition text-sm w-full md:w-auto" />
        <span class="text-gray-500">to</span>
        <input type="date" v-model="endDate" @change="filterOrders"
          class="pl-3 pr-8 py-2 border border-gray-300 rounded-md outline-none transition text-sm w-full md:w-auto" />
      </div>

      <!-- Refresh Button -->
      <div class="md:ml-auto w-full md:w-auto flex md:block">
        <button @click="fetchOrders"
          class="bg-gradient-to-br from-blue-400 to-blue-600 text-white px-4 py-2 rounded-md text-xs font-semibold shadow hover:from-blue-500 hover:to-blue-700 transition"
          style="min-width: 100px;">
          <i class="fas fa-sync-alt mr-1"></i> Refresh
        </button>
      </div>
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
            <th class="px-4 py-2 font-semibold text-gray-500 text-left uppercase tracking-wide border-b border-gray-200">Order ID</th>
            <th class="px-4 py-2 font-semibold text-gray-500 text-left uppercase tracking-wide border-b border-gray-200">Customer</th>
            <th class="px-4 py-2 font-semibold text-gray-500 text-center uppercase tracking-wide border-b border-gray-200">Date</th>
            <th class="px-4 py-2 font-semibold text-gray-500 text-center uppercase tracking-wide border-b border-gray-200">Items</th>
            <th class="px-4 py-2 font-semibold text-gray-500 text-center uppercase tracking-wide border-b border-gray-200">Total</th>
            <th class="px-4 py-2 font-semibold text-gray-500 text-center uppercase tracking-wide border-b border-gray-200">Status</th>
            <th class="px-4 py-2 font-semibold text-gray-500 text-center uppercase tracking-wide border-b border-gray-200">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in filteredOrders" :key="order.id"
            class="hover:bg-yellow-50 transition-colors duration-100 border-b border-gray-100 last:border-none">
            <td class="px-4 py-2 font-medium text-gray-800">#{{ order.id }}</td>
            <td class="px-4 py-2 text-gray-700">{{ order.customerName || 'Guest' }}</td>
            <td class="px-4 py-2 text-center text-gray-600">{{ formatDate(order.date) }}</td>
            <td class="px-4 py-2 text-center text-gray-600">{{ order.items.length }}</td>
            <td class="px-4 py-2 text-center font-medium text-gray-700">${{ calculateOrderTotal(order.items).toFixed(2) }}</td>
            <td class="px-4 py-2 text-center">
              <span class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold"
                :class="getStatusClass(order.status)">
                {{ order.status }}
              </span>
            </td>
            <td class="px-4 py-2 flex justify-center gap-2">
              <button class="p-1 rounded hover:bg-blue-100 transition" @click="viewOrder(order.id)" aria-label="View">
                <i class="fa-solid fa-eye text-blue-600 hover:text-blue-700"></i>
              </button>
              <button v-if="order.status !== 'Delivered' && order.status !== 'Cancelled'"
                class="p-1 rounded hover:bg-green-100 transition" @click="editOrder(order.id)" aria-label="Edit">
                <i class="fa-solid fa-pen-to-square text-green-600 hover:text-green-700"></i>
              </button>
            </td>
          </tr>
          <tr v-if="filteredOrders.length === 0 && !isLoading">
            <td colspan="7" class="px-4 py-8 text-center text-gray-400 italic">
              No orders found matching your criteria
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
    <div v-if="selectedOrder" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]">
      <div class="font-sans w-[95%] md:w-[80%] max-w-4xl mt-20 p-6 bg-white shadow-md rounded-lg relative z-50 m-auto overflow-y-auto max-h-[80vh]">
        <!-- Close Button -->
        <i class="fa-solid fa-circle-xmark cursor-pointer text-red-700 text-lg absolute top-3 right-3 
          hover:text-red-500 transform hover:scale-105 transition-all duration-300 ease-in-out"
          @click="selectedOrder = null"></i>

        <h2 class="text-lg font-semibold mb-4 text-gray-700 text-center mt-[-15px]">
          Order Details #{{ selectedOrder.id }}
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div class="space-y-2">
            <div class="flex items-center">
              <span class="text-sm font-medium text-gray-500 w-24">Customer:</span>
              <span class="text-sm text-gray-700">{{ selectedOrder.customerName || 'Guest' }}</span>
            </div>
            <div class="flex items-center">
              <span class="text-sm font-medium text-gray-500 w-24">Date:</span>
              <span class="text-sm text-gray-700">{{ formatDate(selectedOrder.date) }}</span>
            </div>
            <div v-if="selectedOrder.trackingNumber" class="flex items-center">
              <span class="text-sm font-medium text-gray-500 w-24">Tracking #:</span>
              <span class="text-sm text-gray-700">{{ selectedOrder.trackingNumber }}</span>
            </div>
          </div>
          <div class="space-y-2">
            <div class="flex items-center">
              <span class="text-sm font-medium text-gray-500 w-24">Status:</span>
              <select v-model="selectedOrder.status" @change="updateOrderStatus(selectedOrder)"
                class="border border-gray-300 focus:border-green-500 focus:ring-green-100 rounded-md px-3 py-1 text-sm outline-none transition">
                <option v-for="status in statusOptions" :key="status" :value="status">
                  {{ status }}
                </option>
              </select>
            </div>
            <div v-if="selectedOrder.shippingAddress" class="flex items-start">
              <span class="text-sm font-medium text-gray-500 w-24">Shipping:</span>
              <span class="text-sm text-gray-700">{{ formatAddress(selectedOrder.shippingAddress) }}</span>
            </div>
          </div>
        </div>

        <div class="border-t border-gray-200 pt-4">
          <h3 class="font-medium text-gray-700 mb-3">Order Items</h3>
          <div class="space-y-3">
            <div v-for="item in selectedOrder.items" :key="item.id || item.name" 
              class="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition">
              <div class="w-16 h-16 bg-gray-100 rounded overflow-hidden flex items-center justify-center mr-4">
                <img v-if="getItemImage(item)" :src="getItemImage(item)" :alt="item.name" class="w-full h-full object-cover">
                <i v-else class="fas fa-box text-gray-400"></i>
              </div>
              <div class="flex-1">
                <h4 class="font-medium text-gray-800">{{ item.name }}</h4>
                <p class="text-sm text-gray-500">${{ item.price.toFixed(2) }} × {{ item.quantity || 1 }}</p>
              </div>
              <div class="font-medium text-gray-700">
                ${{ (item.price * (item.quantity || 1)).toFixed(2) }}
              </div>
            </div>
          </div>
        </div>

        <div class="border-t border-gray-200 mt-6 pt-4">
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-500">Subtotal:</span>
            <span class="text-sm text-gray-700">${{ calculateOrderTotal(selectedOrder.items).toFixed(2) }}</span>
          </div>
          <div class="flex justify-between items-center mt-2">
            <span class="text-sm text-gray-500">Shipping:</span>
            <span class="text-sm text-gray-700">$0.00</span>
          </div>
          <div class="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
            <span class="font-medium text-gray-700">Total:</span>
            <span class="font-medium text-gray-900">${{ calculateOrderTotal(selectedOrder.items).toFixed(2) }}</span>
          </div>
        </div>

        <div class="flex justify-end mt-6 space-x-3">
          <button @click="selectedOrder = null" 
            class="px-5 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition">
            Close
          </button>
          <button v-if="selectedOrder.status !== 'Delivered' && selectedOrder.status !== 'Cancelled'" 
            class="px-5 py-2 rounded-full text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition">
            Update Order
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Pagination from '@/components/Pagination.vue';
import { onMounted, ref, watch } from 'vue';

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

const statusOptions = [
  'Processing',
  'Shipped',
  'In Transit',
  'Out for Delivery',
  'Delivered',
  'Cancelled'
];

// Format date function
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Format address function
const formatAddress = (address) => {
  if (!address) return 'N/A';
  return `${address.street || ''}, ${address.city || ''}, ${address.state || ''} ${address.zip || ''}`;
};

// Calculate order total
const calculateOrderTotal = (items) => {
  return items.reduce((total, item) => {
    return total + (item.price * (item.quantity || 1));
  }, 0);
};

// Get status class based on status
const getStatusClass = (status) => {
  const statusLower = status.toLowerCase();
  if (statusLower === 'processing') return 'bg-blue-100 text-blue-700';
  if (statusLower === 'shipped') return 'bg-indigo-100 text-indigo-700';
  if (statusLower === 'in transit') return 'bg-purple-100 text-purple-700';
  if (statusLower === 'out for delivery') return 'bg-yellow-100 text-yellow-700';
  if (statusLower === 'delivered') return 'bg-green-100 text-green-700';
  if (statusLower === 'cancelled') return 'bg-red-100 text-red-700';
  return 'bg-gray-100 text-gray-700';
};

// Get item image
const getItemImage = (item) => {
  if (!item?.image) {
    return null;
  }
  try {
    return require(`@/assets/${item.image}`);
  } catch {
    return null;
  }
};

// Fetch orders from localStorage
const fetchOrders = () => {
  isLoading.value = true;
  try {
    // Safely parse with fallback to empty array if null/undefined
    const activeOrders = JSON.parse(localStorage.getItem('activeOrders') || '[]');
    const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
    
    // Validate and normalize all orders
    orders.value = [...activeOrders, ...orderHistory].map((order, index) => {
      // Ensure items array exists and has minimum required fields
      const validatedItems = (order.items || []).map(item => ({
        id: item.id || Math.random().toString(36).substr(2, 9),
        name: item.name || 'Unknown Product',
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 1,
        image: item.image || null,
        ...item
      }));
      
      return {
        id: order.id || index + 1,
        date: order.date || new Date().toISOString(),
        customerName: order.customerName || 'Guest',
        status: order.status || 'Processing',
        items: validatedItems,
        trackingNumber: order.trackingNumber || null,
        ...order
      };
    });
    
    filterOrders();
  } catch (error) {
    console.error('Error loading orders:', error);
    orders.value = [];
    filteredOrders.value = [];
  } finally {
    isLoading.value = false;
  }
};

// Filter orders based on status and date range
const filterOrders = () => {
  try {
    filteredOrders.value = orders.value.filter(order => {
      // Safely handle status filtering
      const orderStatus = (order.status || 'processing').toLowerCase();
      const filterStatus = statusFilter.value.toLowerCase();
      
      if (statusFilter.value !== 'all' && orderStatus !== filterStatus) {
        return false;
      }
      
      // Safely handle date filtering
      if (startDate.value || endDate.value) {
        const orderDate = new Date(order.date || new Date()).getTime();
        const start = startDate.value ? new Date(startDate.value).getTime() : 0;
        const end = endDate.value ? new Date(endDate.value).getTime() : Date.now();
        
        return orderDate >= start && orderDate <= end;
      }
      
      return true;
    });
  } catch (error) {
    console.error('Error filtering orders:', error);
    filteredOrders.value = [];
  }
};

// View order details
const viewOrder = (orderId) => {
  selectedOrder.value = orders.value.find(order => order.id === orderId);
};

// Edit order
const editOrder = (orderId) => {
  viewOrder(orderId);
};

// Update order status
const updateOrderStatus = (order) => {
  // Update the order in localStorage
  if (order.status === 'Delivered') {
    // Move to history if delivered
    const activeOrders = JSON.parse(localStorage.getItem('activeOrders')) || [];
    const updatedActive = activeOrders.filter(o => o.date !== order.date);
    localStorage.setItem('activeOrders', JSON.stringify(updatedActive));
    
    const history = JSON.parse(localStorage.getItem('orderHistory')) || [];
    history.unshift(order);
    localStorage.setItem('orderHistory', JSON.stringify(history));
  } else {
    // Update in active orders
    const activeOrders = JSON.parse(localStorage.getItem('activeOrders')) || [];
    const index = activeOrders.findIndex(o => o.date === order.date);
    if (index !== -1) {
      activeOrders[index] = order;
      localStorage.setItem('activeOrders', JSON.stringify(activeOrders));
    }
  }
  
  fetchOrders(); // Refresh the list
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

// Watch for filter changes
watch(statusFilter, () => {
  filterOrders();
});

watch([startDate, endDate], () => {
  filterOrders();
});

watch(searchQuery, (newValue) => {
  searchText.value = newValue;
  currentPage.value = 1;
}, { immediate: true });

// Initialize
onMounted(() => {
  fetchOrders();
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


