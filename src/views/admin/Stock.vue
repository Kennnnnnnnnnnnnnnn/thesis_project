<template>
  <div class="p-4 md:p-6 bg-gray-50 min-h-screen font-khmer overflow-y-auto">
    <!-- Header Section -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-6 mb-6">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <!-- Title -->
        <div class="flex items-center gap-4">
          <div class="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2">
              <path d="M20 3v16a2 2 0 01-2 2H6a2 2 0 01-2-2V3"></path>
              <path d="M8 21V7"></path>
              <path d="M16 21V7"></path>
              <path d="M12 7V3"></path>
              <path d="M2 7h20"></path>
            </svg>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Inventory Management</h1>
          </div>
        </div>

        <!-- Controls -->
        <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <!-- Items per page -->
          <div class="relative">
            <button @click="toggleDropdownRow"
              class="flex items-center justify-between min-w-[110px] px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all">
              <span>{{ selectedItem }} items</span>
              <i class="fas fa-chevron-down ml-2 text-xs transition-transform duration-200"
                :class="{ 'rotate-180': isOpen }"></i>
            </button>
            <div v-show="isOpen"
              class="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 shadow-xl rounded-xl py-2 z-50 backdrop-blur-sm">
              <div v-for="item in items" :key="item" @click="selectItem(item)"
                class="px-4 py-2.5 text-sm text-gray-700 cursor-pointer hover:bg-amber-50 transition-colors font-medium">
                {{ item }} items
              </div>
            </div>
          </div>

          <!-- Filters -->
          <select v-model="categoryFilter"
            class="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 bg-white transition-all">
            <option value="all">All Categories</option>
          </select>

          <!-- Enhanced Filters -->
          <select v-model="stockStatusFilter"
            class="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 bg-white transition-all">
            <option value="all">All Status</option>
            <option value="in-stock">In Stock</option>
            <option value="low-stock">Low Stock</option>
            <option value="critical-stock">Very Low Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>

          <!-- Add Button -->
          <!-- <button
            class="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg hover:from-amber-600 hover:to-orange-700 transition-all duration-200 transform hover:scale-[1.02] hover:shadow-xl"
            @click="openModal">
            <i class="fas fa-plus text-xs"></i>
            Add Item
          </button> -->
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <!-- <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6"> -->
    <!-- Total Products -->
    <!-- <div
        class="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Total Products</p>
            <p class="text-3xl font-bold text-gray-900 tracking-tight">0</p>
          </div>
          <div class="p-4 rounded-2xl bg-amber-50 border border-amber-100">
            <i class="fas fa-box text-amber-600 text-xl"></i>
          </div>
        </div>
      </div> -->

    <!-- In Stock -->
    <!-- <div
        class="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">In Stock</p>
            <p class="text-3xl font-bold text-green-600 tracking-tight">0</p>
          </div>
          <div class="p-4 rounded-2xl bg-green-50 border border-green-100">
            <i class="fas fa-circle-check text-green-600 text-xl"></i>
          </div>
        </div>
      </div> -->

    <!-- Low Stock (includes critical) -->
    <!-- <div
        class="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Low Stock</p>
            <p class="text-3xl font-bold text-orange-600 tracking-tight">0</p>
          </div>
          <div class="p-4 rounded-2xl bg-orange-50 border border-orange-100">
            <i class="fas fa-triangle-exclamation text-orange-600 text-xl"></i>
          </div>
        </div>
      </div> -->

    <!-- Out of Stock -->
    <!-- <div
        class="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Out of Stock</p>
            <p class="text-3xl font-bold text-red-600 tracking-tight">0</p>
          </div>
          <div class="p-4 rounded-2xl bg-red-50 border border-red-100">
            <i class="fas fa-circle-xmark text-red-600 text-xl"></i>
          </div>
        </div>
      </div> -->
    <!-- </div> -->

    <!-- Main Table Card -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden">
      <!-- Table Header -->
      <div class="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
        <h3 class="text-lg font-bold text-gray-900 tracking-tight">Inventory Items</h3>
        <p class="text-sm text-gray-600 mt-1 font-medium">{{ stockData.length }} items total</p>
      </div>

      <!-- Table Container -->
      <div class="relative overflow-hidden">
        <!-- Loading Overlay -->
        <div v-if="isLoading" class="absolute inset-0 bg-opacity-70 flex items-center justify-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-900"></div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-100">
            <thead class="bg-gray-50/50">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">#</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Product</th>
                <th class="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Created At</th>
                <th class="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Category</th>
                <!-- <th class="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Stock Level</th> -->
                <th class="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Description
                </th>
                <!-- <th class="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Unit</th> -->
                <th class="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                <th class="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-100">
              <tr v-for="(stock, index) in stockData" :key="stock._id" class="hover:bg-amber-50/50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{{ index + 1 }}</td>

                <!-- Product Column -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-4">
                    <div class="flex-shrink-0">
                      <div class="h-12 w-12 rounded-2xl bg-gray-100 overflow-hidden border border-gray-200">
                        <img v-if="stock.imageURL" :src="stock.imageURL" class="h-full w-full object-cover" />
                        <div v-else class="h-full w-full flex items-center justify-center text-gray-400">
                          <i class="fas fa-box text-xl"></i>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div class="text-sm font-medium text-gray-900">{{ stock.productName }}</div>

                    </div>
                  </div>
                </td>

                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span class="inline-flex items-center px-2.5 py-1 rounded-full text-sm">
                    {{ formatDate(stock.createdAt) || '-' }}
                  </span>

                </td>

                <!-- Category Column -->
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span v-if="stock.categoryId" class="inline-flex items-center px-2.5 py-1 rounded-full text-sm">
                    {{categories.find(c => c._id === stock.categoryId)?.name || 'Unknown'}}
                  </span>
                  <span v-else>-</span>
                </td>

                <!-- Stock Level Column -->
                <!-- <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span class="text-lg font-bold text-gray-900">{{ stock.quantity || 0 }}</span>
                  <div class="text-xs text-gray-500 mt-0.5">Min: {{ stock.minThreshold || 5 }}</div>
                </td> -->

                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span class="inline-flex items-center px-2.5 py-1 rounded-full text-sm">
                    {{ stock.description || '-' }}
                  </span>

                </td>

                <!-- Unit Column -->
                <!-- <td class="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-600">
                  {{ stock.purchaseProducts?.unit || '-' }}
                </td> -->



                <!-- Status Column -->
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold"
                    :class="getStockStatusClass(stock.quantity, stock.minThreshold || 5)">
                    <i :class="`fas ${getStockStatusIcon(stock.quantity, stock.minThreshold || 5)}`"
                      class="text-xs"></i>
                    {{ getStockStatusText(stock.quantity, stock.minThreshold || 5) }}
                  </span>
                </td>

                <!-- Actions Column -->
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <div class="flex items-center justify-center gap-2">
                    <!-- Update Button -->
                    <!-- <button
                      class="p-2.5 rounded-xl hover:bg-amber-50 text-amber-600 transition-all duration-200 hover:scale-110 border border-transparent hover:border-amber-200"
                      title="Edit stock">
                      <i class="fas fa-edit text-sm"></i>
                    </button> -->




                    <!-- button view -->
                    <button @click="viewStockDetails(stock._id)"
                      class="p-1.5 rounded-lg hover:bg-orange-100 text-orange-600 transition-all ">
                      <i class="fa-solid fa-eye"></i>
                    </button>



                    <!-- Delete Button -->
                    <!-- <button @click="pendingStockId = stock._id; showConfirmDialog = true;"
                      class="p-2.5 rounded-xl hover:bg-red-50 text-red-600 transition-all duration-200 hover:scale-110 border border-transparent hover:border-red-200"
                      title="Delete stock">
                      <i class="fas fa-trash text-sm"></i>
                    </button> -->
                  </div>
                </td>
              </tr>
              <tr v-if="stockData.length === 0 && !isLoading">
                <td colspan="7" class="px-6 py-20 text-center">
                  <div class="flex flex-col items-center gap-4">
                    <div class="p-6 rounded-2xl bg-amber-50 border border-amber-200">
                      <i class="fas fa-boxes text-5xl text-amber-400"></i>
                    </div>
                    <div>
                      <h3 class="text-lg font-bold text-gray-900">No stock items found</h3>
                      <p class="text-sm text-gray-600 mt-1 font-medium">Stock items will appear here when available</p>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-4 border-t border-gray-100 bg-gray-50/30">
        <Pagination :currentPage="currentPage" @onEmitDataFromPagination="handleListenToPagination"
          @onEmitIsLoading="handleListenIsLoading" @onEmitCurrentPageIsLastRecord="handleListenIsLastRecordOnPage"
          :limitedPerPage="pageSize" :searchQuery="searchText" />
      </div>
    </div>


    <StockDetailModal :show="showStockDetail" :stockId="selectedStockId" @close="closeStockDetail" />
    <!-- Confirmation Dialog -->
    <DeleteConfirmation :show="showConfirmDialog" @cancel="handleCancelConfirmation"
      @confirm="handleDeleteConfirmation" />
  </div>
</template>

<script setup>
import apiURL from '@/api/config';
import DeleteConfirmation from '@/components/DeleteConfirmation.vue';
import Pagination from '@/components/Pagination.vue';
import StockDetailModal from '@/components/StockDetail.vue';
import socket from '@/services/socket';
import axios from 'axios';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import formatDate from '@/composables/formatDate';


const isLoading = ref(false);
const error = ref('');
const stockData = ref([]);
// Reference data
const products = ref([]);
const categories = ref([]);

// UI controls
const items = ref([10, 25, 50, 100]);
const selectedItem = ref(10);
const currentPage = ref(1);
const pageSize = ref(10);
const currentPageIsLastRecord = ref(null);
const searchText = ref("");
const searchQuery = ref('');
const categoryFilter = ref('all');
const stockStatusFilter = ref('all');
const isOpen = ref(false);

// Confirmation dialog
const showConfirmDialog = ref(false);
const pendingStockId = ref(null);


const showStockDetail = ref(false);
const selectedStockId = ref(null);

const viewStockDetails = (stockId) => {
  selectedStockId.value = stockId;
  showStockDetail.value = true;
};

const closeStockDetail = () => {
  showStockDetail.value = false;
};

// Format price for display
const formatPrice = (price) => {
  return new Intl.NumberFormat('km-KH').format(price || 0) + '៛';
};

// Toggle dropdown
const toggleDropdownRow = () => {
  isOpen.value = !isOpen.value;
};

// Select item from dropdown
const selectItem = (item) => {
  selectedItem.value = item;
  pageSize.value = item;
  isOpen.value = false;
  fetchStockData();
};

// Pagination event handlers
const handleListenToPagination = async (items) => {
  stockData.value = items || [];
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

// Get status class based on stock level
const getStockStatusClass = (stock, minThreshold) => {
  if (stock <= 0) {
    return 'bg-red-100 text-red-700 border-red-200';
  } else {
    return 'bg-green-100 text-green-700 border-green-200';
  }
};

// Get status text based on stock level
const getStockStatusText = (stock, minThreshold) => {
  if (stock <= 0) {
    return 'Out of Stock';
  } else {
    return 'In Stock';
  }
};

// Get status icon based on stock level
const getStockStatusIcon = (stock, minThreshold) => {
  if (stock <= 0) {
    return 'fa-circle-xmark';
  } else {
    return 'fa-circle-check';
  }
};

// Fetch stock data from the API
const fetchStockData = async () => {
  try {
    isLoading.value = true;
    const token = localStorage.getItem('token');

    if (!token) {
      error.value = 'Authentication required. Please login again.';
      return;
    }

    // Build query parameters for filtering
    const params = {};
    if (categoryFilter.value !== 'all') {
      params.dynamicConditions = JSON.stringify([
        {
          field: 'categoryId',
          operator: '==',
          value: categoryFilter.value
        }
      ]);
    }

    // Fetch stock data
    const response = await axios.get(`${apiURL}/api/getAllDocs/Stock`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      params
    });

    if (response.data && response.data.data) {
      stockData.value = response.data.data;

      // Fetch product details for each stock item
      await fetchProductDetails();
    } else {
      stockData.value = [];
    }

    error.value = '';
  } catch (err) {
    console.error('Error fetching stock data:', err);
    error.value = err.response?.data?.message || err.message || 'Failed to fetch stock data';
    stockData.value = [];
  } finally {
    isLoading.value = false;
  }
};

// Fetch product details for stock items
const fetchProductDetails = async () => {
  try {
    const token = localStorage.getItem('token');

    if (!token || stockData.value.length === 0) return;

    // Get all product IDs from stock data
    const productIds = stockData.value.map(item => item.productId);

    // Fetch product data for these IDs
    const response = await axios.get(`${apiURL}/api/getAllDocs/Product`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.data && response.data.data) {
      products.value = response.data.data;

      // Enrich stock data with product details
      stockData.value = stockData.value.map(stock => {
        const product = products.value.find(p => p._id === stock.productId) || {};
        return {
          ...stock,
          productName: product.name || 'Unknown Product',
          categoryId: product.categoryId || '',
          imageURL: product.imageURL || '',
          unit: product.unit || stock.unit || 'pcs'
        };
      });

      // Filter stock data based on stock status if needed
      applyStockStatusFilter();
    }

    // Fetch categories
    await fetchCategories();

  } catch (err) {
    console.error('Error fetching product details:', err);
  }
};

// Fetch categories for dropdown
const fetchCategories = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return;

    const response = await axios.get(`${apiURL}/api/getAllDocs/Category`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.data && response.data.data) {
      categories.value = response.data.data;
    }
  } catch (err) {
    console.error('Error fetching categories:', err);
  }
};

// Apply stock status filter
const applyStockStatusFilter = () => {
  if (stockStatusFilter.value === 'all') return;

  stockData.value = stockData.value.filter(stock => {
    const qty = stock.quantity || 0;
    const threshold = stock.minThreshold || 5;

    switch (stockStatusFilter.value) {
      case 'out-of-stock':
        return qty <= 0;
      case 'critical-stock':
        return qty > 0 && qty <= threshold * 0.5;
      case 'low-stock':
        return qty > threshold * 0.5 && qty <= threshold;
      case 'in-stock':
        return qty > threshold;
      default:
        return true;
    }
  });
};

// Handle confirmation dialog
const handleCancelConfirmation = () => {
  showConfirmDialog.value = false;
  pendingStockId.value = null;
};

const handleDeleteConfirmation = async () => {
  if (!pendingStockId.value) return;

  try {
    isLoading.value = true;
    const token = localStorage.getItem('token');

    const response = await axios.delete(
      `${apiURL}/api/deleteDoc/Stock/${pendingStockId.value}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.success) {
      socket.emit('dataUpdate', {
        action: 'delete',
        collection: 'Stock',
        data: pendingStockId.value
      });

      // Refresh stock data
      fetchStockData();
    }
  } catch (err) {
    console.error('Error deleting stock item:', err);
    error.value = err.response?.data?.message || err.message || 'Failed to delete stock item';
  } finally {
    isLoading.value = false;
    showConfirmDialog.value = false;
    pendingStockId.value = null;
  }
};

// Watch for filter changes
watch([categoryFilter, stockStatusFilter], () => {
  fetchStockData();
});

watch(searchQuery, (newValue) => {
  searchText.value = newValue;
  currentPage.value = 1;
}, { immediate: true });

// Initialize
onMounted(() => {
  // Ensure socket is connected
  if (socket && socket.disconnected) {
    socket.connect();
  }

  //  Listen for real-time updates
  socket.on('dataUpdate', (update) => {
    if (update.collection === 'Stock' || update.collection === 'Product') {
      console.log(' Real-time update received:', update);
      fetchStockData();
    }
  });

  //  Optional: reconnect events
  socket.on('connect', () => console.log(' Socket connected:', socket.id));
  socket.on('disconnect', () => console.log(' Socket disconnected'));
  socket.on('error', (error) => console.error(' Socket error:', error));

  fetchStockData();
});

onUnmounted(() => {
  socket.off('dataUpdate');
  socket.off('connect');
  socket.off('disconnect');
  socket.off('error');
});

</script>

<style scoped>
/* Custom scrollbar for webkit browsers */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f8fafc;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
  border: 2px solid #f8fafc;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Smooth transitions for all interactive elements */
* {
  transition-property: color, background-color, border-color, transform, box-shadow, opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Enhanced focus states */
button:focus,
select:focus,
input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
}

/* Better table row hover effect */
tbody tr:hover {
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

/* Improved modal backdrop */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}
</style>