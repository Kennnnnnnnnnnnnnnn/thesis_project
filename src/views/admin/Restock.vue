<template>
  <div class="p-4 md:p-6 bg-gray-50 min-h-screen font-inter">
    <!-- Header Section -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-6 mb-6">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <!-- Title -->
        <div class="flex items-center gap-4">
          <div class="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 11V7a4 4 0 0 0-8 0v4M5 9h14l1 12H4L5 9z"></path>
              <path d="M7 7V5a2 2 0 0 1 4 0v2"></path>
            </svg>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Restock Management</h1>
            <!-- <p class="text-sm text-gray-600 mt-0.5 font-medium">Manage inventory restocking and purchase orders</p> -->
          </div>
        </div>
        
        <!-- Controls -->
        <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <!-- Items per page -->
          <div class="relative">
            <button @click="toggleDropdownRow"
              class="flex items-center justify-between min-w-[110px] px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all">
              <span>{{ selectedItem }} items</span>
              <i class="fas fa-chevron-down ml-2 text-xs transition-transform duration-200" :class="{ 'rotate-180': isOpen }"></i>
            </button>
            <div v-show="isOpen"
              class="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 shadow-xl rounded-xl py-2 z-50 backdrop-blur-sm">
              <div v-for="item in items" :key="item" @click="selectItem(item)"
                class="px-4 py-2.5 text-sm text-gray-700 cursor-pointer hover:bg-amber-50 transition-colors font-medium">
                {{ item }} items
              </div>
            </div>
          </div>

          <!-- Search Input -->
          <div class="relative">
            <input v-model="searchQuery" type="text" placeholder="Search restock orders..."
              class="w-64 px-4 py-2.5 pl-10 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all" />
            <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
          </div>

          <!-- Status Filter -->
          <select v-model="statusFilter" class="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 bg-white transition-all">
            <option value="all">All Status</option>
            <option value="true">Pending</option>
            <option value="false">Completed</option>
          </select>

          <!-- Add Button -->
          <button
            class="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg hover:from-amber-600 hover:to-orange-700 transition-all duration-200 transform hover:scale-[1.02] hover:shadow-xl"
            @click="openModal">
            <i class="fas fa-plus text-xs"></i>
            Create Restock
          </button>
        </div>
      </div>
    </div>

    <!-- Main Table Card -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden">
      <!-- Table Header -->
      <div class="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
        <h3 class="text-lg font-bold text-gray-900 tracking-tight">Restock Orders</h3>
        <p class="text-sm text-gray-600 mt-1 font-medium">{{ restockData.length }} orders total</p>
      </div>

      <!-- Table Container -->
      <div class="relative overflow-hidden">
        <!-- Loading Overlay -->
        <div v-if="isLoading" class="absolute inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center z-10">
          <div class="flex items-center gap-3">
            <div class="animate-spin rounded-full h-8 w-8 border-2 border-amber-600 border-t-transparent"></div>
            <span class="text-gray-700 font-medium">Loading...</span>
          </div>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-100">
            <thead class="bg-gray-50/50">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">#</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Supplier</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Products</th>
                <th class="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Total Amount</th>
                <th class="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                <th class="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Created At</th>
                <th class="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-100">
              <tr v-for="(restock, index) in restockData" :key="restock._id"
                class="hover:bg-amber-50/50 transition-colors duration-200">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  {{ index + 1 }}
                </td>
                
                <!-- Supplier Column -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-bold text-gray-900">
                    {{ getSupplierName(restock.supplierId) }}
                  </div>
                </td>
                
                <!-- Products Column -->
                <td class="px-6 py-4">
                  <div class="flex flex-col gap-1">
                    <div v-for="(product, idx) in restock.products" :key="idx" 
                      class="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
                      <div class="w-8 h-8 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                        <img v-if="getProductImage(product)" :src="getProductImage(product)" 
                          :alt="getProductName(product)" class="w-full h-full object-cover">
                        <i v-else class="fas fa-box text-gray-400 text-xs"></i>
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-900 truncate">
                          {{ getProductName(product) }}
                        </p>
                        <p class="text-xs text-gray-500">
                          Qty: {{ getProductQuantity(product) }} {{ debugProductUnit(product) }}
                        </p>
                      </div>
                    </div>
                  </div>
                </td>
                
                <!-- Total Amount Column -->
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <div class="text-sm font-bold text-gray-900">
                    {{ formatPrice(restock.totalAmount) }}
                  </div>
                </td>
                
                <!-- Status Column -->
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold"
                    :class="restock.status ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-green-100 text-green-700 border-green-200'">
                    <i :class="restock.status ? 'fas fa-clock' : 'fas fa-circle-check'" class="text-xs"></i>
                    {{ restock.status ? 'Pending' : 'Completed' }}
                  </span>
                </td>
                
                <!-- Created At Column -->
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <div class="text-sm text-gray-600">
                    {{ formatDate(restock.createdAt) }}
                  </div>
                </td>
                
                <!-- Actions Column -->
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <div class="flex items-center justify-center gap-2">
                    <!-- Edit Button -->
                    <button 
                      class="p-2.5 rounded-xl hover:bg-amber-50 text-amber-600 transition-all duration-200 hover:scale-110 border border-transparent hover:border-amber-200" 
                      @click="editRestock(restock)" 
                      title="Edit restock order">
                      <i class="fas fa-edit text-sm"></i>
                    </button>
                    
                    <!-- Complete Button (only for pending orders) -->
                    <button v-if="restock.status" 
                      class="p-2.5 rounded-xl hover:bg-green-50 text-green-600 transition-all duration-200 hover:scale-110 border border-transparent hover:border-green-200" 
                      @click="markAsComplete(restock._id)" 
                      title="Mark as completed">
                      <i class="fas fa-check text-sm"></i>
                    </button>
                    
                    <!-- Delete Button -->
                    <button 
                      class="p-2.5 rounded-xl hover:bg-red-50 text-red-600 transition-all duration-200 hover:scale-110 border border-transparent hover:border-red-200" 
                      @click="deleteRestock(restock._id)" 
                      title="Delete restock order">
                      <i class="fas fa-trash text-sm"></i>
                    </button>
                  </div>
                </td>
              </tr>
              
              <!-- Empty State -->
              <tr v-if="restockData.length === 0 && !isLoading">
                <td colspan="7" class="px-6 py-20 text-center">
                  <div class="flex flex-col items-center gap-4">
                    <div class="p-6 rounded-2xl bg-amber-50 border border-amber-200">
                      <i class="fas fa-shopping-cart text-5xl text-amber-400"></i>
                    </div>
                    <div>
                      <h3 class="text-lg font-bold text-gray-900">No restock orders found</h3>
                      <p class="text-sm text-gray-600 mt-1 font-medium">Create your first restock order to get started</p>
                    </div>
                    <button 
                      @click="openModal"
                      class="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-xl text-sm font-semibold hover:bg-amber-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
                      <i class="fas fa-plus text-xs"></i>
                      Create First Order
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-4 border-t border-gray-100 bg-gray-50/30">
        <Pagination 
          :currentPage="currentPage" 
          @onEmitDataFromPagination="handleListenToPagination"
          @onEmitIsLoading="handleListenIsLoading" 
          @onEmitCurrentPageIsLastRecord="handleListenIsLastRecordOnPage"
          :limitedPerPage="pageSize" 
          :searchQuery="searchText" 
        />
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[1000] p-4">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-200">
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 class="text-xl font-bold text-gray-900 tracking-tight">
              {{ showEditModal ? 'Update Restock Order' : 'Create Restock Order' }}
            </h2>
            <p class="text-sm text-gray-600 mt-1 font-medium">
              {{ showEditModal ? 'Modify existing restock order details' : 'Add a new restock order to manage inventory' }}
            </p>
          </div>
          <button 
            class="p-2.5 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all"
            @click="closeModal">
            <i class="fas fa-times text-lg"></i>
          </button>
        </div>
        
        <!-- Modal Body -->
        <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
          <!-- Supplier Selection -->
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-3">
              Supplier <span class="text-red-500">*</span>
            </label>
            <select v-model="supplierId" required
              class="w-full px-4 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all font-medium">
              <option value="" disabled>Select supplier</option>
              <option v-for="supplier in suppliers" :key="supplier._id" :value="supplier._id">
                {{ supplier.name }}
              </option>
            </select>
          </div>

          <!-- Product Selection -->
          <div class="space-y-4">
            <label class="block text-sm font-bold text-gray-700">
              Products <span class="text-red-500">*</span>
            </label>
            
            <div v-for="(product, index) in selectedProducts" :key="index" 
              class="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-200">
              <!-- Product Dropdown -->
              <div class="flex-1">
                <select v-model="product.id" required @change="updateProductDetails(index)"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all font-medium">
                  <option value="" disabled>Select product</option>
                  <option v-for="p in products" :key="p._id" :value="p._id">
                      {{ p.name }} - {{ formatPrice(p.salePrice) }} ({{ getProductUnitFromStock(p._id) }})
                  </option>
                </select>
              </div>
              
              <!-- Quantity Input with Unit Display -->
              <div class="w-40">
                <div class="relative">
                  <input v-model="product.quantity" type="number" min="1" required placeholder="Qty"
                    @input="calculateProductTotal(index)"
                    class="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all font-medium text-center" />
                  <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500 font-medium">
                    {{ getProductUnitFromStock(product.id) }}
                  </span>
                </div>
              </div>
              
              <!-- Unit Price -->
              <div class="w-32 text-center">
                <span class="text-sm font-medium text-gray-600">
                  {{ formatPrice(product.unitPrice || 0) }}
                </span>
              </div>
              
              <!-- Total Price -->
              <div class="w-32 text-center">
                <span class="text-sm font-bold text-amber-600">
                  {{ formatPrice(product.totalPrice || 0) }}
                </span>
              </div>
              
              <!-- Remove Button -->
              <button type="button" @click="removeProduct(index)"
                class="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-200">
                <i class="fas fa-times"></i>
              </button>
            </div>
            
            <!-- Add Product Button -->
            <button type="button" @click="addProduct"
              class="w-full py-3 border-2 border-dashed border-gray-300 rounded-2xl text-gray-500 hover:border-amber-500 hover:text-amber-500 hover:bg-amber-50/30 transition-all font-medium">
              <i class="fas fa-plus mr-2"></i> Add Product
            </button>
            
            <!-- Total Amount Display -->
            <div class="flex justify-between items-center p-4 bg-amber-50 rounded-2xl border border-amber-200">
              <span class="text-sm font-bold text-gray-700">Total Amount:</span>
              <span class="text-lg font-bold text-amber-600">{{ formatPrice(calculateTotalAmount()) }}</span>
            </div>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-3">Description</label>
            <textarea v-model="description" rows="3"
              class="w-full px-4 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all resize-none font-medium"
              placeholder="Enter restock description"></textarea>
          </div>

          <!-- Status Toggle -->
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-3">Status</label>
            <div class="flex items-center space-x-3">
              <Switch v-model="enabled" class="relative inline-flex h-6 w-11 items-center rounded-full transition"
                :class="enabled ? 'bg-amber-500' : 'bg-gray-300'">
                <span class="sr-only">Enable status</span>
                <span class="inline-block h-4 w-4 transform bg-white rounded-full transition shadow-sm"
                  :class="enabled ? 'translate-x-6' : 'translate-x-1'"></span>
              </Switch>
              <span class="text-sm text-gray-700 font-medium">{{ enabled ? 'Pending' : 'Completed' }}</span>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="bg-red-50 border border-red-200 rounded-2xl p-4">
            <div class="flex items-center gap-3">
              <i class="fas fa-exclamation-circle text-red-500"></i>
              <p class="text-red-700 text-sm font-semibold">{{ error }}</p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-4 pt-4">
            <button type="button" 
              class="flex-1 px-6 py-3.5 text-gray-700 bg-gray-100 rounded-2xl hover:bg-gray-200 font-semibold transition-all"
              @click="resetForm">
              Reset
            </button>
            <button type="submit" 
              :disabled="isSubmitting"
              class="flex-1 px-6 py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-2xl hover:from-amber-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]">
              <span v-if="isSubmitting" class="flex items-center justify-center gap-2">
                <i class="fas fa-spinner fa-spin"></i>
                {{ showEditModal ? 'Updating...' : 'Creating...' }}
              </span>
              <span v-else>
                {{ showEditModal ? 'Update Order' : 'Create Order' }}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Confirmation Dialog -->
    <DeleteConfirmation 
      :show="showConfirmDialog" 
      @cancel="handleCancelConfirmation" 
      @confirm="handleDeleteConfirmation" 
    />
  </div>
</template>

<script setup>
import apiURL from '@/api/config';
import DeleteConfirmation from '@/components/DeleteConfirmation.vue';
import Pagination from '@/components/Pagination.vue';
import { fetchTimestamp } from '@/composables/timestamp';
import socket from '@/services/socket';
import { Switch } from '@headlessui/vue';
import axios from 'axios';
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

// State
const items = ref([10, 25, 50, 100]);
const selectedItem = ref(10);
const isLoading = ref(false);
const currentPage = ref(1);
const pageSize = ref(10);
const currentPageIsLastRecord = ref(null);
const searchText = ref("");
const searchQuery = ref('');
const limitedPerPage = ref(1);
const restockData = ref([]);
const suppliers = ref([]);
const products = ref([]);
const error = ref('');
const isSubmitting = ref(false);
const enabled = ref(true);
const showModal = ref(false);
const showEditModal = ref(false);
const isOpen = ref(false);
const statusFilter = ref('all');

// Add stock data reference
const stockData = ref([]);

// State for delete confirmation
const showConfirmDialog = ref(false);
const pendingRestockId = ref(null);

// Form fields
const id = ref('');
const supplierId = ref('');
const selectedProducts = ref([{ id: '', quantity: 1, unitPrice: 0, totalPrice: 0 }]);
const description = ref('');
const status = ref(true);

// Router
const router = useRouter();

// Helper functions
const formatPrice = (price) => {
  return new Intl.NumberFormat('km-KH').format(price || 0) + '៛';
};

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

const getSupplierName = (supplierId) => {
  const supplier = suppliers.value.find(s => s._id === supplierId);
  return supplier ? supplier.name : 'Unknown';
};

// Product helper functions for displaying data from Map objects
const getProductName = (productMap) => {
  if (productMap instanceof Map) {
    return productMap.get('productName') || 'Unknown Product';
  }
  return productMap.productName || 'Unknown Product';
};

const getProductQuantity = (productMap) => {
  if (productMap instanceof Map) {
    return productMap.get('quantity') || 0;
  }
  return productMap.quantity || 0;
};

// ✅ UPDATED: Fix the getProductUnit function
const getProductUnit = (productMap) => {
  // First try to get from the stored product data
  if (productMap instanceof Map) {
    const storedUnit = productMap.get('unit');
    if (storedUnit && storedUnit !== 'units') {
      return storedUnit;
    }
    // Fallback: try to get from stock data using productId
    const productId = productMap.get('productId');
    if (productId) {
      return getProductUnitFromStock(productId);
    }
    return 'units';
  }
  
  // For object format
  if (productMap.unit && productMap.unit !== 'units') {
    return productMap.unit;
  }
  
  // Fallback: try to get from stock data using productId
  const productId = productMap.productId || productMap.id;
  if (productId) {
    return getProductUnitFromStock(productId);
  }
  
  return 'units';
};

const getProductImage = (productMap) => {
  if (productMap instanceof Map) {
    return productMap.get('imageURL') || '';
  }
  return productMap.imageURL || '';
};

// Make sure this function is working correctly
const getProductUnitFromStock = (productId) => {
  if (!productId) return 'units';
  const stockItem = stockData.value.find(stock => stock.productId === productId);
  return stockItem ? stockItem.unit : 'units';
};


// Product management in form
const addProduct = () => {
  selectedProducts.value.push({ id: '', quantity: 1, unitPrice: 0, totalPrice: 0 });
};

const removeProduct = (index) => {
  selectedProducts.value.splice(index, 1);
  if (selectedProducts.value.length === 0) {
    addProduct();
  }
};

const updateProductDetails = (index) => {
  const product = selectedProducts.value[index];
  const productData = products.value.find(p => p._id === product.id);
  if (productData) {
    product.unitPrice = productData.salePrice || 0;
    product.unit = getProductUnitFromStock(product.id); // ✅ Get actual unit
    calculateProductTotal(index);
  }
};

const calculateProductTotal = (index) => {
  const product = selectedProducts.value[index];
  product.totalPrice = (product.unitPrice || 0) * (product.quantity || 0);
};

const calculateTotalAmount = () => {
  return selectedProducts.value.reduce((total, product) => {
    return total + (product.totalPrice || 0);
  }, 0);
};

// Pagination handlers
const handleListenToPagination = async (items) => {
  restockData.value = items || [];
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

watch(searchQuery, (newValue) => {
  searchText.value = newValue;
  currentPage.value = 1;
}, { immediate: true });

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

// Modal Methods
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

const handleSubmit = async () => {
  if (!supplierId.value || selectedProducts.value.some(p => !p.id || !p.quantity)) {
    error.value = 'Required fields cannot be empty';
    return;
  }

  isSubmitting.value = true;
  error.value = null;

  try {
    isLoading.value = true;
    const timestamp = await fetchTimestamp();
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) {
      error.value = 'Authentication required. Please login again.';
      return;
    }

    // Prepare products data as Maps (as expected by the model)
    const productsData = [];
    const productIds = [];
    
    for (const product of selectedProducts.value) {
      const productInfo = products.value.find(p => p._id === product.id);
      if (productInfo) {
        // Create Map object as expected by the model
        const productMap = new Map();
        productMap.set('productId', product.id);
        productMap.set('productName', productInfo.name);
        productMap.set('quantity', parseInt(product.quantity));
        productMap.set('unitPrice', product.unitPrice || productInfo.salePrice || 0);
        productMap.set('totalPrice', product.totalPrice || 0);
        productMap.set('unit', getProductUnitFromStock(product.id)); 
        productMap.set('imageURL', productInfo.imageURL || '');
        
        // Convert Map to object for JSON serialization
        const productObj = {};
        for (let [key, value] of productMap) {
          productObj[key] = value;
        }
        
        productsData.push(productObj);
        productIds.push(product.id);
      }
    }

    const requestBody = {
      fields: {
        supplierId: supplierId.value,
        products: productsData,
        productIds: productIds,
        description: description.value || '',
        status: status.value,
        totalAmount: calculateTotalAmount()
      }
    };

    if (!showEditModal.value) {
      // Create new restock order
      requestBody.fields.createdAt = timestamp;
      requestBody.fields.createdBy = userId;

      const response = await axios.post(
        `${apiURL}/api/insertDoc/PurchaseProduct`,
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
          collection: 'PurchaseProduct',
          data: response.data.data._id
        });
        
        isSubmitting.value = false;
        closeModal();
      } else {
        throw new Error(response.data.message || 'Failed to create restock order');
      }
    } else {
      // Update existing restock order
      if (!id.value) {
        error.value = 'Error: Missing restock order ID for update operation';
        return;
      }

      requestBody.fields.updatedAt = timestamp;
      requestBody.fields.updatedBy = userId;

      const response = await axios.patch(
        `${apiURL}/api/updateDoc/PurchaseProduct/${id.value}`,
        requestBody,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success || response.data.message === 'PurchaseProduct updated') {
        socket.emit('dataUpdate', {
          action: 'update',
          collection: 'PurchaseProduct',
          data: response.data.data ? response.data.data._id : id.value
        });
        
        isSubmitting.value = false;
        closeModal();
      } else {
        throw new Error(response.data.message || 'Failed to update restock order');
      }
    }
  } catch (err) {
    console.error('Error saving restock order:', err);
    error.value = err.response?.data?.message || err.message || 'Failed to save restock order';
  } finally {
    isSubmitting.value = false;
    isLoading.value = false;
  }
};

const editRestock = (restock) => {
  id.value = restock._id;
  supplierId.value = restock.supplierId;
  
  // Convert products from Map objects back to form format
  selectedProducts.value = restock.products.map(product => {
    let productData;
    if (product instanceof Map) {
      productData = {
        id: product.get('productId') || '',
        quantity: product.get('quantity') || 1,
        unitPrice: product.get('unitPrice') || 0,
        totalPrice: product.get('totalPrice') || 0
      };
    } else {
      productData = {
        id: product.productId || product.id || '',
        quantity: product.quantity || 1,
        unitPrice: product.unitPrice || 0,
        totalPrice: product.totalPrice || 0
      };
    }
    return productData;
  });
  
  description.value = restock.description || '';
  status.value = restock.status;
  enabled.value = restock.status;
  
  showModal.value = true;
  showEditModal.value = true;
};

const deleteRestock = (restockId) => {
  pendingRestockId.value = restockId;
  showConfirmDialog.value = true;
};

const handleDeleteConfirmation = async () => {
  showConfirmDialog.value = false;
  if (!pendingRestockId.value) return;

  try {
    isLoading.value = true;
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) {
      error.value = 'Authentication required. Please login again.';
      router.push('/login');
      return;
    }

    const response = await axios.delete(
      `${apiURL}/api/deleteDoc/PurchaseProduct/${pendingRestockId.value}`,
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
        collection: 'PurchaseProduct',
        data: pendingRestockId.value
      });
    } else {
      throw new Error(response.data.message || 'Failed to delete restock order');
    }
  } catch (err) {
    console.error('Error deleting restock order:', err);
    error.value = err.response?.data?.message || err.message || 'Failed to delete restock order';
  } finally {
    isLoading.value = false;
    pendingRestockId.value = null;
  }
};

const handleCancelConfirmation = () => {
  showConfirmDialog.value = false;
  pendingRestockId.value = null;
};

const markAsComplete = async (restockId) => {
  try {
    isLoading.value = true;
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const timestamp = await fetchTimestamp();

    if (!token || !userId) {
      error.value = 'Authentication required. Please login again.';
      return;
    }

    const response = await axios.patch(
      `${apiURL}/api/updateDoc/PurchaseProduct/${restockId}`,
      {
        fields: {
          status: false, // false means completed
          updatedAt: timestamp,
          updatedBy: userId
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
      socket.emit('dataUpdate', {
        action: 'update',
        collection: 'PurchaseProduct',
        data: restockId
      });
    }
  } catch (err) {
    console.error('Error marking restock as complete:', err);
    error.value = err.response?.data?.message || err.message || 'Failed to update status';
  } finally {
    isLoading.value = false;
  }
};

watch(enabled, (newValue) => {
  status.value = newValue;
});

const resetForm = () => {
  id.value = '';
  supplierId.value = '';
  selectedProducts.value = [{ id: '', quantity: 1, unitPrice: 0, totalPrice: 0 }];
  description.value = '';
  status.value = true;
  enabled.value = true;
  error.value = null;
};

// Fetch functions
const fetchRestock = async () => {
  try {
    isLoading.value = true;
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) {
      error.value = 'Authentication required. Please login again.';
      return;
    }

    const response = await axios.get(`${apiURL}/api/getAllDocs/PurchaseProduct`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.data && response.data.data) {
      restockData.value = response.data.data;
    } else {
      restockData.value = [];
    }

    error.value = '';
  } catch (err) {
    console.error('Error fetching restock orders:', err);
    if (err.response?.status === 401) {
      error.value = 'Session expired. Please login again.';
      router.push('/login');
    } else {
      error.value = err.response?.data?.message || err.message || 'Failed to fetch restock orders';
    }
    restockData.value = [];
  } finally {
    isLoading.value = false;
  }
};

const fetchSuppliers = async () => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) return;
    
    const response = await axios.get(`${apiURL}/api/getAllDocs/Supplier`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.data && response.data.data) {
      suppliers.value = response.data.data;
    }
  } catch (err) {
    console.error('Error fetching suppliers:', err);
  }
};

const fetchProducts = async () => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) return;
    
    const response = await axios.get(`${apiURL}/api/getAllDocs/Product`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.data && response.data.data) {
      products.value = response.data.data;
    }
  } catch (err) {
    console.error('Error fetching products:', err);
  }
};

// Add function to fetch stock data
const fetchStock = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    const response = await axios.get(`${apiURL}/api/getAllDocs/Stock`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.data && response.data.data) {
      stockData.value = response.data.data;
    }
  } catch (err) {
    console.error('Error fetching stock data:', err);
  }
};

watch(selectedItem, (newValue) => {
  pageSize.value = newValue;
  limitedPerPage.value = newValue;
  currentPage.value = 1;
});

onMounted(() => {
  if (socket && socket.disconnected) {
    socket.connect();
  }
  
  // Listen for socket updates
  socket.on('dataUpdated', (update) => {
    if (update.collection === 'PurchaseProduct') {
      fetchRestock();
    }
    if (update.collection === 'Supplier') {
      fetchSuppliers();
    }
    if (update.collection === 'Product') {
      fetchProducts();
    }
    if (update.collection === 'Stock') {
      fetchStock(); // ✅ Add this line
    }
  });
  
  fetchRestock();
  fetchSuppliers();
  fetchProducts();
  fetchStock(); // ✅ Add this line
  
  // Handle pre-filled data from other pages
  const restockItem = localStorage.getItem('restockItem');
  if (restockItem) {
    try {
      const item = JSON.parse(restockItem);
      supplierId.value = item.supplierId;
      selectedProducts.value = [{
        id: item.productId,
        quantity: item.quantity,
        unitPrice: 0,
        totalPrice: 0
      }];
      
      localStorage.removeItem('restockItem');
      openModal();
    } catch (e) {
      console.error('Error parsing restock item:', e);
    }
  }
  
  const bulkItems = localStorage.getItem('bulkRestockItems');
  if (bulkItems) {
    try {
      const supplierGroups = JSON.parse(bulkItems);
      const supplierIds = Object.keys(supplierGroups);
      
      if (supplierIds.length > 0) {
        const firstSupplierId = supplierIds[0];
        supplierId.value = firstSupplierId;
        
        selectedProducts.value = supplierGroups[firstSupplierId].map(item => ({
          id: item.id,
          quantity: item.quantity,
          unitPrice: 0,
          totalPrice: 0
        }));
        
        localStorage.removeItem('bulkRestockItems');
        openModal();
      }
    } catch (e) {
      console.error('Error parsing bulk restock items:', e);
    }
  }
});

// Add this debug function temporarily
const debugProductUnit = (productMap) => {
  console.log('🔍 Debug Product Unit:', {
    productMap,
    storedUnit: productMap instanceof Map ? productMap.get('unit') : productMap.unit,
    productId: productMap instanceof Map ? productMap.get('productId') : productMap.productId,
    stockData: stockData.value,
    finalUnit: getProductUnit(productMap)
  });
  return getProductUnit(productMap);
};
</script>


<style scoped>


/* Custom scrollbar */
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

.overflow-x-auto::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 2px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background-color: #9ca3af;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 2px;
}

.overflow-x-auto::-webkit-scrollbar-corner {
  background: transparent;
}

/* Smooth scrolling */
.overflow-x-auto {
  scroll-behavior: smooth;
}
/* Router link active state styling (if applied in sidebar component) */
/* .router-link-active { ... } */

/* Fade and slide down effect for router view transitions */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  max-height: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  max-height: 500px;
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


</style>