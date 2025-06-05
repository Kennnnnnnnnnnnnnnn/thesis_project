<template>
  <div class="p-5 font-sans bg-white rounded-md">
    <!-- Header, Create Button, Search and Filter -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5 pb-4 border-b border-yellow-200 mt-10">
      <div class="flex items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-yellow-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 3v16a2 2 0 01-2 2H6a2 2 0 01-2-2V3"></path>
          <path d="M8 21V7"></path>
          <path d="M16 21V7"></path>
          <path d="M12 7V3"></path>
          <path d="M2 7h20"></path>
        </svg>
        <div>
          <p class="text-left font-semibold text-lg">Inventory Management</p>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row gap-3 items-center w-full sm:w-auto">
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

        <!-- Search -->
        <!-- <div class="relative w-full sm:w-64">
          <input v-model="searchQuery" type="text" placeholder="Search products..."
            class="pl-3 pr-10 py-2 border border-gray-300 rounded-md outline-none w-full transition" />
          <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <i class="fa-solid fa-magnifying-glass"></i>
          </span>
        </div> -->

        <!-- Category Filter -->
        <div class="relative w-full sm:w-40">
          <select v-model="categoryFilter" class="pl-3 pr-8 py-2 border border-gray-300 rounded-md outline-none w-full transition">
            <option value="all">All Categories</option>
            <option v-for="category in categories" :key="category._id" :value="category._id">
              {{ category.name }}
            </option>
          </select>
        </div>

        <!-- Stock Status Filter -->
        <div class="relative w-full sm:w-40">
          <select v-model="stockStatusFilter" class="pl-3 pr-8 py-2 border border-gray-300 rounded-md outline-none w-full transition">
            <option value="all">All Status</option>
            <option value="in-stock">In Stock</option>
            <option value="low-stock">Low Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>
        </div>

        <button
          class="bg-gradient-to-br from-green-400 to-green-600 text-white px-4 py-2 rounded-md text-xs font-semibold shadow hover:from-green-500 hover:to-green-700 transition min-w-[100px]"
          @click="openModal">
          + Add Inventory
        </button>
      </div>
    </div>

    <!-- Stats Overview -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
      <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Total Products</p>
            <p class="text-xl font-bold">{{ totalItems }}</p>
          </div>
          <div class="p-3 rounded-full bg-blue-100">
            <i class="fas fa-box text-blue-600"></i>
          </div>
        </div>
      </div>
      <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Low Stock Items</p>
            <p class="text-xl font-bold">{{ lowStockItems }}</p>
          </div>
          <div class="p-3 rounded-full bg-yellow-100">
            <i class="fas fa-triangle-exclamation text-yellow-600"></i>
          </div>
        </div>
      </div>
      <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Out of Stock Items</p>
            <p class="text-xl font-bold">{{ outOfStockItems }}</p>
          </div>
          <div class="p-3 rounded-full bg-red-100">
            <i class="fas fa-circle-xmark text-red-600"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Restock All button -->
    <div class="flex justify-end mb-3" v-if="lowStockItems > 0 || outOfStockItems > 0">
      <button 
        @click="restockAllLowItems" 
        class="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-md border border-green-200 text-sm hover:bg-green-100 transition"
      >
        <i class="fa-solid fa-cart-shopping"></i>
        Restock All Low Items
      </button>
    </div>

    <!-- Table -->
    <div class="overflow-y-auto mt-3 relative bg-white rounded-lg shadow-sm border border-gray-100" style="max-height: 60vh;">
      <!-- Loading Overlay -->
      <div v-if="isLoading" class="absolute inset-0 bg-opacity-70 flex items-center justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-900"></div>
      </div>
      
      <table class="min-w-full text-sm">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-2 font-semibold text-gray-500 text-left uppercase tracking-wide">No</th>
            <th class="px-4 py-2 font-semibold text-gray-500 text-left uppercase tracking-wide">Product</th>
            <th class="px-4 py-2 font-semibold text-gray-500 text-center uppercase tracking-wide">Category</th>
            <th class="px-4 py-2 font-semibold text-gray-500 text-center uppercase tracking-wide">Supplier</th>
            <th class="px-4 py-2 font-semibold text-gray-500 text-center uppercase tracking-wide">Quantity</th>
            <th class="px-4 py-2 font-semibold text-gray-500 text-center uppercase tracking-wide">Unit</th>
            <th class="px-4 py-2 font-semibold text-gray-500 text-center uppercase tracking-wide">Status</th>
            <th class="px-4 py-2 font-semibold text-gray-500 text-center uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody>
          <tr v-for="(stock, index) in stockData" :key="stock._id"
            class="hover:bg-yellow-50 transition-colors duration-100 border-b border-gray-100 last:border-none">
            <td class="px-4 py-2 text-gray-800">{{ index + 1 }}</td>
            <td class="px-4 py-2 align-middle">
              <div class="flex items-center gap-2 w-full">
                <div v-if="stock.product && stock.product.image" class="w-10 h-10 rounded-md bg-gray-200 overflow-hidden">
                  <img :src="stock.product.image" alt="Product" class="w-full h-full object-cover" />
                </div>
                <div v-else class="w-10 h-10 rounded-md bg-gray-200 flex items-center justify-center text-gray-400">
                  <i class="fas fa-box"></i>
                </div>
                <span class="text-gray-800 whitespace-nowrap">{{ stock.product ? stock.product.name : 'Unknown Product' }}</span>
              </div>
            </td>
            <td class="px-4 py-2 text-center text-gray-600">{{ stock.category ? stock.category.name : 'Unknown Category' }}</td>
            <td class="px-4 py-2 text-center text-gray-600">{{ stock.supplier ? stock.supplier.name : 'Unknown Supplier' }}</td>
            <td class="px-4 py-2 text-center text-gray-600">{{ stock.quantity }}</td>
            <td class="px-4 py-2 text-center text-gray-600">{{ stock.unit }}</td>
            <td class="px-4 py-2 text-center">
              <span class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold"
                :class="getStockStatusClass(stock)">
                <i :class="getStockStatusIcon(stock)"></i>
                {{ getStockStatusText(stock) }}
              </span>
            </td>
            <td class="px-4 py-2 flex justify-center gap-2">
              <button class="p-1 rounded hover:bg-blue-100 transition" @click="editStock(stock)" title="Edit">
                <i class="fa-solid fa-pen-to-square text-blue-600"></i>
              </button>
              
              <!-- Add this restock button for low/out of stock items -->
              <button 
                v-if="stock.quantity <= stock.minThreshold" 
                class="p-1 rounded hover:bg-green-100 transition" 
                @click="restockItem(stock)"
                title="Create restock order">
                <i class="fa-solid fa-cart-plus text-green-600"></i>
              </button>
              
              <button class="p-1 rounded hover:bg-yellow-100 transition" @click="viewStockHistory(stock._id)" title="History">
                <i class="fa-solid fa-clock-rotate-left text-yellow-600"></i>
              </button>
              
              <button class="p-1 rounded hover:bg-red-100 transition" @click="deleteStock(stock._id)" title="Delete">
                <i class="fa-solid fa-trash text-red-600"></i>
              </button>
            </td>
          </tr>
          <tr v-if="stockData.length === 0 && !isLoading">
            <td colspan="8" class="px-4 py-8 text-center text-gray-400 italic">
              No inventory items found
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      
    <Pagination :currentPage="currentPage" @onEmitDataFromPagination="handleListenToPagination"
      @onEmitIsLoading="handleListenIsLoading" @onEmitCurrentPageIsLastRecord="handleListenIsLastRecordOnPage"
      :limitedPerPage="pageSize" :searchQuery="searchText" />

    <!-- Create/Edit Stock Modal -->
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]">
      <div class="font-sans w-full max-w-lg sm:w-[95%] sm:max-w-lg bg-white rounded-lg shadow-md p-4 sm:p-8 relative">
        <!-- Close Button -->
        <i class="fa-solid fa-circle-xmark cursor-pointer text-red-700 text-lg absolute top-4 right-4
          hover:text-red-500 transform hover:scale-110 transition-all duration-300 ease-in-out"
          @click="closeModal"></i>
        <h2 class="text-lg font-semibold mb-5 text-gray-700 text-center mt-[-12px]">
          {{ showEditModal ? 'Update Inventory' : 'Add Inventory Item' }}
        </h2>
        <form @submit.prevent="handleSubmit" class="space-y-4 flex flex-col">
          <!-- Product Selection -->
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">
              Product <span class="text-red-500">*</span>
            </label>
            <select v-model="productId" required
              class="border border-gray-300 focus:border-yellow-500 focus:ring-yellow-100 rounded-md px-3 py-2 w-full outline-none transition">
              <option value="" disabled>Select product</option>
              <option v-for="product in products" :key="product._id" :value="product._id">
                {{ product.name }}
              </option>
            </select>
          </div>

          <!-- Category Selection -->
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">
              Category <span class="text-red-500">*</span>
            </label>
            <select v-model="categoryId" required
              class="border border-gray-300 focus:border-yellow-500 focus:ring-yellow-100 rounded-md px-3 py-2 w-full outline-none transition">
              <option value="" disabled>Select category</option>
              <option v-for="category in categories" :key="category._id" :value="category._id">
                {{ category.name }}
              </option>
            </select>
          </div>

          <!-- Supplier Selection -->
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">
              Supplier <span class="text-red-500">*</span>
            </label>
            <select v-model="supplierId" required
              class="border border-gray-300 focus:border-yellow-500 focus:ring-yellow-100 rounded-md px-3 py-2 w-full outline-none transition">
              <option value="" disabled>Select supplier</option>
              <option v-for="supplier in suppliers" :key="supplier._id" :value="supplier._id">
                {{ supplier.name }}
              </option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <!-- Quantity -->
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">
                Quantity <span class="text-red-500">*</span>
              </label>
              <input v-model="quantity" type="number" min="0" required
                class="border border-gray-300 focus:border-yellow-500 focus:ring-yellow-100 rounded-md px-3 py-2 w-full outline-none transition"
                placeholder="Enter quantity" />
            </div>

            <!-- Unit -->
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">
                Unit <span class="text-red-500">*</span>
              </label>
              <input v-model="unit" type="text" required
                class="border border-gray-300 focus:border-yellow-500 focus:ring-yellow-100 rounded-md px-3 py-2 w-full outline-none transition"
                placeholder="e.g. pcs, kg, liters" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <!-- Min Threshold -->
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">
                Min Threshold <span class="text-red-500">*</span>
              </label>
              <input v-model="minThreshold" type="number" min="0" required
                class="border border-gray-300 focus:border-yellow-500 focus:ring-yellow-100 rounded-md px-3 py-2 w-full outline-none transition"
                placeholder="Low stock level" />
            </div>

            <!-- Max Capacity -->
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">
                Max Capacity <span class="text-red-500">*</span>
              </label>
              <input v-model="maxCapacity" type="number" min="0" required
                class="border border-gray-300 focus:border-yellow-500 focus:ring-yellow-100 rounded-md px-3 py-2 w-full outline-none transition"
                placeholder="Max storage capacity" />
            </div>
          </div>

          <!-- Error message -->
          <p v-if="error" class="text-red-500 text-xs">{{ error }}</p>

          <!-- Action Buttons -->
          <div class="flex justify-end gap-3 mt-6">
            <button type="button" class="px-5 py-2 rounded-full text-base font-normal bg-gray-100 text-gray-700 shadow-sm
             hover:bg-gray-200 focus:ring-2 focus:ring-gray-300 transition" @click="resetForm">
              Clear
            </button>
            <button type="submit" class="px-5 py-2 rounded-full text-base font-normal bg-yellow-500 text-white shadow-sm
             hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-300 transition">
              {{ showEditModal ? 'Update Inventory' : 'Add Inventory' }}
            </button>
        </div>
        </form>
      </div>
    </div>

    <!-- Confirmation Dialog -->
    <DeleteConfirmation :show="showConfirmDialog" @cancel="handleCancelConfirmation" @confirm="handleDeleteConfirmation" />
    </div>
  </template>
  
<script setup>
import apiURL from '@/api/config';
import DeleteConfirmation from '@/components/DeleteConfirmation.vue';
import Pagination from '@/components/Pagination.vue';
import { fetchTimestamp } from '@/composables/timestamp';
import socket from '@/services/socket';
import axios from 'axios';
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const showModal = ref(false);
const showEditModal = ref(false);
const isLoading = ref(false);
const isSubmitting = ref(false);
const error = ref('');
const stockData = ref([]);
const currentId = ref('');
const productId = ref('');
const categoryId = ref('');
const supplierId = ref('');
const quantity = ref(0);
const unit = ref('');
const minThreshold = ref(5);
const maxCapacity = ref(100);
const isOutOfStock = ref(false);

// References
const products = ref([]);
const categories = ref([]);
const suppliers = ref([]);

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

// Stats
const totalItems = ref(0);
const lowStockItems = ref(0);
const outOfStockItems = ref(0);

// Confirmation dialog
const showConfirmDialog = ref(false);
const pendingStockId = ref(null);

// Pagination handlers
const handleListenToPagination = async (items) => {
  stockData.value = items || [];
};

const handleListenIsLoading = (status) => {
  isLoading.value = status;
};

const handleListenIsLastRecordOnPage = (page) => {
  currentPageIsLastRecord.value = page;
  if (currentPage.value > 1) {
    currentPage.value -= 1; // Move to previous page
  }
};

// Watch for search changes
watch(searchQuery, (newValue) => {
  searchText.value = newValue;
  currentPage.value = 1; // Reset to page 1 when searching
}, { immediate: true });

// Dropdown handlers
const toggleDropdownRow = () => {
  isOpen.value = !isOpen.value;
};

const selectItem = (item) => {
  selectedItem.value = item;
  pageSize.value = item;
  isOpen.value = false;
};

// Modal handlers
const openModal = () => {
  resetForm();
  showModal.value = true;
  showEditModal.value = false;
};

const closeModal = () => {
  showModal.value = false;
  showEditModal.value = false;
  resetForm();
};

const resetForm = () => {
  currentId.value = '';
  productId.value = '';
  categoryId.value = '';
  supplierId.value = '';
  quantity.value = 0;
  unit.value = '';
  minThreshold.value = 5;
  maxCapacity.value = 100;
  error.value = '';
};

// Submit form handler
const handleSubmit = async () => {
  if (!productId.value || !categoryId.value || !supplierId.value || !unit.value || 
      quantity.value === null || minThreshold.value === null || maxCapacity.value === null) {
    error.value = 'Required fields cannot be empty';
    return;
  }

  if (minThreshold.value > maxCapacity.value) {
    error.value = 'Min threshold cannot be greater than max capacity';
    return;
  }

  isSubmitting.value = true;
  error.value = '';

  try {
    isLoading.value = true;
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    if (!token || !userId) {
      error.value = 'Authentication required. Please login again.';
      isSubmitting.value = false;
      isLoading.value = false;
      return;
    }

    const timestamp = await fetchTimestamp();

    const requestBody = {
      fields: {
        productId: productId.value,
        categoryId: categoryId.value,
        supplierId: supplierId.value,
        unit: unit.value,
        quantity: parseInt(quantity.value),
        minThreshold: parseInt(minThreshold.value),
        maxCapacity: parseInt(maxCapacity.value),
        isOutOfStock: parseInt(quantity.value) <= 0
      }
    };

    if (!showEditModal.value) {
      // Creating a new stock entry
      requestBody.fields.createdAt = timestamp;
      requestBody.fields.createdBy = userId;
      requestBody.fields.lastRestockedAt = timestamp;

      const response = await axios.post(
        `${apiURL}/api/insertDoc/Stock`,
        requestBody,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        socket.emit('dataUpdate', {
          action: 'insert',
          collection: 'Stock',
          data: response.data.data._id
        });
        resetForm();
        closeModal();
        fetchStockData();
      } else {
        throw new Error(response.data.message || 'Failed to create inventory item');
      }
    } else {
      // Updating existing stock entry
      if (!currentId.value) {
        error.value = 'Error: Missing stock ID for update operation';
        isSubmitting.value = false;
        isLoading.value = false;
        return;
      }

      requestBody.fields.updatedAt = timestamp;
      requestBody.fields.updatedBy = userId;
      
      // Update lastRestockedAt if quantity increased
      const existingStock = stockData.value.find(item => item._id === currentId.value);
      if (existingStock && parseInt(quantity.value) > existingStock.quantity) {
        requestBody.fields.lastRestockedAt = timestamp;
      }

      const response = await axios.patch(
        `${apiURL}/api/updateDoc/Stock/${currentId.value}`,
        requestBody,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success || response.data.message === 'Stock updated') {
        socket.emit('dataUpdate', {
          action: 'update',
          collection: 'Stock',
          data: response.data.data ? response.data.data._id : currentId.value
        });
        closeModal();
        fetchStockData();
      } else {
        throw new Error(response.data.message || 'Failed to update inventory item');
      }
    }
  } catch (err) {
    console.error('Error saving inventory item:', err);
    error.value = err.response?.data?.message || err.message || 'Failed to save inventory item';
  } finally {
    isSubmitting.value = false;
    isLoading.value = false;
  }
};

// Edit stock handler
const editStock = (stock) => {
  currentId.value = stock._id;
  productId.value = stock.productId;
  categoryId.value = stock.categoryId;
  supplierId.value = stock.supplierId;
  quantity.value = stock.quantity;
  unit.value = stock.unit;
  minThreshold.value = stock.minThreshold;
  maxCapacity.value = stock.maxCapacity;
  showModal.value = true;
  showEditModal.value = true;
};

// View stock history handler (placeholder)
const viewStockHistory = (stockId) => {
  console.log('View history for stock:', stockId);
  // Implement view history functionality
};

// Delete stock handler
const deleteStock = (stockId) => {
  pendingStockId.value = stockId;
  showConfirmDialog.value = true;
};

const handleDeleteConfirmation = async () => {
  showConfirmDialog.value = false;
  if (!pendingStockId.value) return;

  try {
    isLoading.value = true;
    const token = localStorage.getItem('token');
    if (!token) {
      error.value = 'Authentication required. Please login again.';
      return;
    }
    
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
        data: response.data.data._id
      });
      fetchStockData();
      closeModal(); // Close the modal if it's open
    } else {
      throw new Error(response.data.message || 'Failed to delete stock item');
    }
  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'Failed to delete stock item';
  } finally {
    isLoading.value = false;
    pendingStockId.value = null;
  }
};

const handleCancelConfirmation = () => {
  showConfirmDialog.value = false;
  pendingStockId.value = null;
};

// Fetch stock data
const fetchStockData = async () => {
  try {
    isLoading.value = true;
    const token = localStorage.getItem('token');
    if (!token) {
      error.value = 'Authentication required. Please login again.';
      return;
    }

    // Fetch stock list
    const stockResponse = await axios.get(`${apiURL}/api/getAllDocs/Stock`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const stocks = stockResponse.data.data || [];

    // Fetch product/category/supplier maps
    const [productsRes, categoriesRes, suppliersRes] = await Promise.all([
      axios.get(`${apiURL}/api/getAllDocs/Product`, { headers: { Authorization: `Bearer ${token}` } }),
      axios.get(`${apiURL}/api/getAllDocs/Category`, { headers: { Authorization: `Bearer ${token}` } }),
      axios.get(`${apiURL}/api/getAllDocs/Supplier`, { headers: { Authorization: `Bearer ${token}` } }),
    ]);

    const productMap = {};
    productsRes.data.data.forEach(p => { productMap[p._id] = p });

    const categoryMap = {};
    categoriesRes.data.data.forEach(c => { categoryMap[c._id] = c });

    const supplierMap = {};
    suppliersRes.data.data.forEach(s => { supplierMap[s._id] = s });

    // Merge manually
    const enriched = stocks.map(stock => ({
      ...stock,
      product: productMap[stock.productId] || null,
      category: categoryMap[stock.categoryId] || null,
      supplier: supplierMap[stock.supplierId] || null
    }));

    stockData.value = enriched;

    // Update counters
    totalItems.value = enriched.length;
    lowStockItems.value = enriched.filter(item => item.quantity <= item.minThreshold && item.quantity > 0).length;
    outOfStockItems.value = enriched.filter(item => item.quantity <= 0 || item.isOutOfStock).length;

  } catch (err) {
    console.error('Error fetching data:', err);
    error.value = err.message || 'Failed to fetch stock data';
  } finally {
    isLoading.value = false;
  }
};


// Fetch related data for dropdowns
const fetchRelatedData = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return;

    const [productsRes, categoriesRes, suppliersRes] = await Promise.all([
      axios.get(`${apiURL}/api/getAllDocs/Product`, {
        headers: { Authorization: `Bearer ${token}` }
      }),
      axios.get(`${apiURL}/api/getAllDocs/Category`, {
        headers: { Authorization: `Bearer ${token}` }
      }),
      axios.get(`${apiURL}/api/getAllDocs/Supplier`, {
        headers: { Authorization: `Bearer ${token}` }
      })
    ]);

    products.value = productsRes.data.data || [];
    categories.value = categoriesRes.data.data || [];
    suppliers.value = suppliersRes.data.data || [];

  } catch (err) {
    console.error("❌ Failed to fetch dropdown data:", err);
  }
};


// Utility functions for stock status display
const getStockStatusText = (stock) => {
  if (stock.isOutOfStock || stock.quantity <= 0) return 'Out of Stock';
  if (stock.quantity <= stock.minThreshold) return 'Low Stock';
  return 'In Stock';
};

const getStockStatusClass = (stock) => {
  if (stock.isOutOfStock || stock.quantity <= 0) return 'bg-red-100 text-red-700';
  if (stock.quantity <= stock.minThreshold) return 'bg-yellow-100 text-yellow-700';
  return 'bg-green-100 text-green-700';
};

const getStockStatusIcon = (stock) => {
  if (stock.isOutOfStock || stock.quantity <= 0) return 'fa-solid fa-circle-xmark';
  if (stock.quantity <= stock.minThreshold) return 'fa-solid fa-triangle-exclamation';
  return 'fa-solid fa-circle-check';
};

// Filter handlers
watch([categoryFilter, stockStatusFilter], () => {
  fetchStockData();
}, { immediate: false });

// Add these functions to handle restocking

// Function to restock a single item
const restockItem = (stock) => {
  // Get product and supplier details
  const productData = products.value.find(p => p._id === stock.productId);
  const supplierData = suppliers.value.find(s => s._id === stock.supplierId);
  
  // Calculate suggested quantity (double the min threshold minus current quantity)
  const suggestedQty = Math.max(stock.minThreshold * 2 - stock.quantity, 1);
  
  // Store the selected item in localStorage
  localStorage.setItem('restockItem', JSON.stringify({
    productId: stock.productId,
    productName: productData?.name || 'Unknown Product',
    supplierId: stock.supplierId,
    supplierName: supplierData?.name || 'Unknown Supplier',
    quantity: suggestedQty
  }));
  
  // Navigate to restock page
  router.push('/admin/restock');
};

// Function to restock all low stock items
const restockAllLowItems = () => {
  // Get all items that need restocking
  const itemsToRestock = stockData.value.filter(item => 
    item.quantity <= item.minThreshold
  );
  
  if (itemsToRestock.length === 0) return;
  
  // Prepare items for restock, grouped by supplier
  const itemsBySupplier = {};
  
  itemsToRestock.forEach(stock => {
    const productData = products.value.find(p => p._id === stock.productId);
    if (!productData) return;
    
    const supplierId = stock.supplierId;
    if (!itemsBySupplier[supplierId]) {
      itemsBySupplier[supplierId] = [];
    }
    
    // Calculate suggested quantity
    const suggestedQty = Math.max(stock.minThreshold * 2 - stock.quantity, 1);
    
    itemsBySupplier[supplierId].push({
      id: stock.productId,
      name: productData.name,
      quantity: suggestedQty
    });
  });
  
  // Store the items in localStorage
  localStorage.setItem('bulkRestockItems', JSON.stringify(itemsBySupplier));
  
  // Navigate to restock page
  router.push('/admin/restock');
};

// Initialize
onMounted(() => {
  if (socket && socket.disconnected) {
    socket.connect();
  }
  
  // Listen for socket updates
  socket.on('dataUpdated', (update) => {
    if (update.collection === 'Stock') {
      fetchStockData();
    }
  });
  
  fetchStockData();
  fetchRelatedData();
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
</style>