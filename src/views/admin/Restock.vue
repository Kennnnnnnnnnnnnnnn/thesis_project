<template>
  <div class="p-4 md:p-6 bg-gray-50 min-h-screen font-khmer">
    <!-- Header Section -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-6 mb-6">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <!-- Title -->
        <div class="flex items-center gap-4">
          <div class="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2">
              <path d="M16 11V7a4 4 0 0 0-8 0v4M5 9h14l1 12H4L5 9z"></path>
              <path d="M7 7V5a2 2 0 0 1 4 0v2"></path>
            </svg>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Restock Management</h1>
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

          <!-- Search Input -->
          <div class="relative">
            <input v-model="searchQuery" type="text" placeholder="Search restock orders..."
              class="w-64 px-4 py-2.5 pl-10 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all" />
            <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
          </div>

          <!-- Status Filter -->
          <select v-model="statusFilter"
            class="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 bg-white transition-all">
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

    <!-- Table -->
    <div class="overflow-y-auto mt-5 relative bg-white rounded-lg shadow-sm border border-gray-100"
      style="max-height: 60vh;">
        <!-- Loading Overlay -->
        <div v-if="isLoading" class="absolute inset-0 bg-opacity-70 flex items-center justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-900"></div>
      </div>

      <table class="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-4 py-2 font-semibold text-gray-500 text-left uppercase tracking-wide border-b border-gray-200">
              No</th>
            <th
              class="px-4 py-2 font-semibold text-gray-500 text-left uppercase tracking-wide border-b border-gray-200">
              Supplier</th>
            <th class="px-4 py-2 font-semibold  text-gray-500 uppercase tracking-wide border-b border-gray-200">
              Contact</th>
            <th
              class="px-4 py-2 font-semibold text-center text-gray-500 uppercase tracking-wide border-b border-gray-200">
              Products</th>
            <th
              class="px-4 py-2 font-semibold text-gray-500 text-center uppercase tracking-wide border-b border-gray-200">
              Description</th>
            <!-- <th
              class="px-4 py-2 font-semibold text-gray-500 text-center uppercase tracking-wide border-b border-gray-200">
              Status</th> -->
            <th
              class="px-4 py-2 font-semibold text-gray-500 text-center uppercase tracking-wide border-b border-gray-200">
              Created At</th>
            <th
              class="px-4 py-2 font-semibold text-gray-500 text-center uppercase tracking-wide border-b border-gray-200">
              Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(purchase, index) in restockData" :key="purchase._id"
            class="hover:bg-amber-50/50 transition-colors">
            <td class="px-4 py-3 border-b border-gray-200">{{ index + 1 }}</td>
            <td class="px-4 py-3 border-b border-gray-200">
              {{ getSupplierName(purchase.supplierId) }}
            </td>
            <td class="px-4 py-3 border-b border-gray-200 text-center">
              {{ getSupplierContact(purchase.supplierId) }}
            </td>
            <td class="px-4 py-3 border-b border-gray-200 text-center ">

              {{purchase.products?.map(item => item.name).join(', ') || '-'}}

            </td>
            <td class="px-4 py-3 border-b border-gray-200 text-center">
              <span class="truncate max-w-xs inline-block">{{ purchase.description || '-' }}</span>
            </td>
            <!-- <td class="px-4 py-3 border-b border-gray-200 text-center">
              <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                :class="purchase.status ? 'bg-blue-100 text-blue-800 border border-blue-200' : 'bg-green-100 text-green-800 border border-green-200'">
                <i :class="purchase.status ? 'fas fa-clock' : 'fas fa-check'" class="mr-1 text-xs"></i>
                {{ purchase.status ? 'Pending' : 'Completed' }}
              </span>
            </td> -->
            <td class="px-4 py-3 border-b border-gray-200 text-center">
              {{ formatDate(purchase.createdAt) }}
            </td>
            <td class="px-4 py-3 border-b border-gray-200 text-center">
              <div class="flex items-center justify-center space-x-2">
                <!-- <button @click="editRestock(purchase)"
                  class="p-1.5 rounded-lg hover:bg-amber-100 text-amber-600 transition-all">
                  <i class="fas fa-edit"></i>
                </button> -->
                <!-- <button v-if="purchase.status"
                  @click="markAsComplete(purchase._id)"
                  class="p-1.5 rounded-lg hover:bg-green-100 text-green-600 transition-all">
                  <i class="fas fa-check"></i>
                </button> -->

                <!-- button view -->
                <button @click="viewPurchaseDetails(purchase._id)"
                  class="p-1.5 rounded-lg hover:bg-orange-100 text-orange-600 transition-all ">
                  <i class="fa-solid fa-eye"></i>
                </button>

                <!-- button delete -->
                <button @click="deleteRestock(purchase._id)"
                  class="p-1.5 rounded-lg hover:bg-red-100 text-red-600 transition-all">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="restockData.length === 0 && !isLoading">
            <td colspan="7" class="px-4 py-8 text-center text-gray-400 italic">
              No restock orders found
            </td>
          </tr>
        </tbody>
      </table>

      <div class="px-6 py-4 border-t border-gray-100 bg-gray-50/30">
        <Pagination :currentPage="currentPage" @onEmitDataFromPagination="handleListenToPagination"
          @onEmitIsLoading="handleListenIsLoading" @onEmitCurrentPageIsLastRecord="handleListenIsLastRecordOnPage"
          :limitedPerPage="pageSize" :searchQuery="searchText" />
      </div>

    </div>



    <!-- Create/Edit Modal -->
    <div v-if="showModal"
      class="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[1000] p-4">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center p-4 border-b">
          <div>
            <h2 class="text-xl font-semibold text-gray-800">{{ showEditModal ? 'Edit' : 'Create' }} Purchase Form</h2>
            <p class="text-sm text-gray-500">Add products to restock inventory</p>
          </div>
          <button @click="closeModal" class="text-red-600 hover:text-red-700">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>

        <div class="flex flex-col md:flex-row">
          <!-- Left side form -->
          <div class="w-full md:w-1/2 p-5 md:border-r">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Supplier <span
                  class="text-red-500">*</span></label>
              <div class="relative">
                <select v-model="selectedSupplierId"
                  class="w-full border border-gray-300 rounded-md p-2.5 pr-8 appearance-none focus:ring focus:ring-amber-500/30 focus:border-amber-400">
                  <option value="" disabled>Select Supplier</option>
                  <option v-for="supplier in suppliers" :key="supplier._id" :value="supplier._id">
                    {{ supplier.name }}
                  </option>
                </select>
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <i class="fas fa-chevron-down text-gray-400"></i>
                </div>
              </div>
              <p v-if="error && !selectedSupplierId" class="text-red-500 text-xs mt-1">Please select a supplier</p>
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Product Name <span
                  class="text-red-500">*</span></label>
              <div class="relative">
                <select v-model="selectedProductId"
                  class="w-full border border-gray-300 rounded-md p-2.5 pr-8 appearance-none focus:ring focus:ring-amber-500/30 focus:border-amber-400">
                  <option value="" disabled>Select product</option>
                  <option v-for="product in products" :key="product._id" :value="product._id">
                    {{ product.name }}
                  </option>
                </select>
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <i class="fas fa-chevron-down text-gray-400"></i>
                </div>
              </div>
            </div>


            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Unit <span
                  class="text-red-500">*</span></label>
              <input v-model="unit" type="text"
                class="w-full border border-gray-300 rounded-md p-2.5 text-left focus:ring focus:ring-amber-500/30 focus:border-amber-400"
                placeholder="e.g kg" />
            </div>

            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Quantity <span
                    class="text-red-500">*</span></label>
                <input v-model.number="quantity" type="number" min="1"
                  class="w-full border border-gray-300 rounded-md p-2.5 text-left focus:ring focus:ring-amber-500/30 focus:border-amber-400"
                  placeholder="0" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Price <span
                    class="text-red-500">*</span></label>
                <input v-model.number="price" type="number" min="0" step="0.01"
                  class="w-full border border-gray-300 rounded-md p-2.5 text-left focus:ring focus:ring-amber-500/30 focus:border-amber-400"
                  placeholder="0" />
              </div>
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Note</label>
              <textarea v-model="itemDescription" rows="3"
                class="w-full border border-gray-300 rounded-md p-2.5 focus:ring focus:ring-amber-500/30 focus:border-amber-400"
                placeholder="Note..."></textarea>
            </div>

            <div class="flex justify-end space-x-3">
              <button type="button" @click="clearForm"
                class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition">
                Clear
              </button>
              <button type="button" @click="addToCart"
                class="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-md transition">
                Add to Cart
              </button>
            </div>
          </div>

          <!-- Right side cart -->
          <div class="w-full md:w-1/2 p-5">
            <div class="overflow-x-auto">
              <table class="min-w-full bg-white border border-gray-300 text-sm">
                <thead class="bg-gray-100">
                  <tr>
                    <th class="border border-gray-300 p-2">ID</th>
                    <th class="border border-gray-300 p-2">Name</th>
                    <th class="border border-gray-300 p-2">Quantity</th>
                    <th class="border border-gray-300 p-2">Price</th>
                    <th class="border border-gray-300 p-2">Total</th>
                    <th class="border border-gray-300 p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in cartItems" :key="item.id" class="hover:bg-gray-50">
                    <td class="border border-gray-300 p-2 text-center">{{ index + 1 }}</td>
                    <td class="border border-gray-300 p-2">{{ item.name }}</td>
                    <td class="border border-gray-300 p-2 text-center">{{ item.quantity }} {{ item.unit }}</td>
                    <td class="border border-gray-300 p-2 text-right">
                      {{ formatPrice(item.unitPrice) }}
                    </td>
                    <td class="border border-gray-300 p-2 text-right">
                      {{ formatPrice(item.totalPrice) }}
                    </td>
                    <td class="border border-gray-300 p-2 text-center">
                      <button @click="removeFromCart(item.id)" class="text-red-500 hover:text-red-700">
                        <i class="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                  <tr v-if="cartItems.length === 0">
                    <td colspan="6" class="border border-gray-300 p-4 text-center text-gray-500">
                      No items in cart
                    </td>
                  </tr>
                  <!-- <tr v-if="cartItems.length > 0" class="bg-gray-50">
                    <td colspan="4" class="border border-gray-300 p-2 text-right font-bold">Total:</td>
                    <td class="border border-gray-300 p-2 text-right font-bold">{{ formatPrice(calculateCartTotal()) }}
                    </td>
                    <td class="border border-gray-300 p-2"></td>
                  </tr> -->
                </tbody>
              </table>
            </div>

            <div v-if="cartItems.length > 0" class="mt-4 px-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Purchase Notes</label>
              <textarea v-model="description" rows="2"
                class="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-amber-500/30 focus:border-amber-400"
                placeholder="Add notes about this purchase..."></textarea>
            </div>

            <div v-if="error" class="mt-3 text-red-500 text-sm">
              {{ error }}
            </div>

            <div class="mt-5 flex justify-end">
              <button @click="handleSubmit" :disabled="cartItems.length === 0 || isSubmitting"
                class="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-md flex items-center transition disabled:opacity-50 disabled:cursor-not-allowed">
                <span v-if="isSubmitting">
                  <i class="fas fa-spinner fa-spin mr-2"></i> Processing...
                </span>
                <span v-else>
                  Purchase <i class="fas fa-cart-shopping ml-2"></i>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <PurchaseDetailModal :show="showPurchaseDetail" :purchaseId="selectedPurchaseId" @close="closePurchaseDetail" />

    <!-- Confirmation Dialog -->
    <DeleteConfirmation :show="showConfirmDialog" @cancel="handleCancelConfirmation"
      @confirm="handleDeleteConfirmation" />
  </div>
</template>

<script setup>
import apiURL from '@/api/config';
import DeleteConfirmation from '@/components/DeleteConfirmation.vue';
import Pagination from '@/components/Pagination.vue';
import PurchaseDetailModal from '@/components/PurchaseFormDetail.vue';
import { fetchTimestamp } from '@/composables/timestamp';
import socket from '@/services/socket';
import axios from 'axios';
import { onMounted, ref, watch, onUnmounted } from 'vue';
import formatDate from '@/composables/formatDate';

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

// Additional state refs for form and cart
const id = ref('');
const description = ref('');
const selectedSupplierId = ref('');  // Was using supplierId
const selectedProductId = ref('');
const quantity = ref(1);  // Set default to 1
const price = ref(0);
const unit = ref('');
const itemDescription = ref('');
const cartItems = ref([]);
const status = ref('');


const showPurchaseDetail = ref(false);
const selectedPurchaseId = ref(null);

// Add the functions for the purchase detail modal
const viewPurchaseDetails = (purchaseId) => {
  selectedPurchaseId.value = purchaseId;
  showPurchaseDetail.value = true;
};

const closePurchaseDetail = () => {
  showPurchaseDetail.value = false;
};

// Cart functionality
// const handleProductSelect = () => {
//   if (!selectedProductId.value) return;

//   const product = products.value.find(p => p._id === selectedProductId.value);
//   if (product) {
//     price.value = product.purchasePrice || 0;
//     unit.value = product.unit || '';
//   }
// };

const addToCart = () => {
  if (!selectedSupplierId.value) {
    error.value = 'Please select a supplier';
    return;
  }

  if (!selectedProductId.value) {
    error.value = 'Please select a product';
    return;
  }

  if (quantity.value <= 0) {
    error.value = 'Quantity must be greater than 0';
    return;
  }

  if (price.value <= 0) {
    error.value = 'Price must be greater than 0';
    return;
  }

  const product = products.value.find(p => p._id === selectedProductId.value);
  if (!product) {
    error.value = 'Selected product not found';
    return;
  }

  const totalPrice = quantity.value * price.value;

  cartItems.value.push({
    id: product._id,
    name: product.name,
    quantity: quantity.value,
    unitPrice: price.value,
    totalPrice: totalPrice,
    unit: unit.value || product.unit || '',
    note: itemDescription.value || '',
    imageURL: product.imageURL || null
  });

  // Reset form fields for next item
  selectedProductId.value = '';
  quantity.value = 1;
  price.value = 0;
  unit.value = '';
  itemDescription.value = '';
  error.value = '';
};

const removeFromCart = (itemId) => {
  cartItems.value = cartItems.value.filter(item => item.id !== itemId);
};

const calculateCartTotal = () => {
  return cartItems.value.reduce((sum, item) => sum + item.totalPrice, 0);
};

// Replace resetForm function
const clearForm = () => {
  selectedProductId.value = '';
  selectedSupplierId.value = '';
  quantity.value = 1;
  price.value = 0;
  unit.value = '';
  itemDescription.value = '';
  description.value = '';
  cartItems.value = [];
  error.value = '';
};

// Update the resetForm function
const resetForm = () => {
  id.value = '';
  description.value = '';
  selectedSupplierId.value = '';
  selectedProductId.value = '';
  quantity.value = 1;
  price.value = 0;
  unit.value = '';
  itemDescription.value = '';
  cartItems.value = [];
  error.value = '';
  enabled.value = true;
  status.value = true;
};

// Format helpers
const formatPrice = (price) => {
  return new Intl.NumberFormat('km-KH').format(price || 0) + '៛';
};

// Supplier and product methods
const getSupplierName = (supplierId) => {
  const supplier = suppliers.value.find(s => s._id === supplierId);
  return supplier ? supplier.name : 'Unknown';
};

const getProductUnitFromStock = (productId) => {
  const product = products.value.find(p => p._id === productId);
  return product?.unit || 'pcs';
};

// Modal methods
const openModal = () => {
  resetForm();
  showModal.value = true;
  showEditModal.value = false;
};

const closeModal = () => {
  showModal.value = false;
  resetForm();
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

// CRUD operations
const fetchRestockOrders = async () => {
  try {
    isLoading.value = true;
    const token = localStorage.getItem('token');
    if (!token) {
      error.value = 'Authentication required. Please login again.';
      return;
    }

    const params = {};
    if (statusFilter.value !== 'all') {
      params.status = statusFilter.value === 'true';
    }

    const response = await axios.get(`${apiURL}/api/getAllDocs/PurchaseProduct`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      params
    });

    restockData.value = response.data.data || [];
  } catch (err) {
    console.error('Error fetching restock orders:', err);
    error.value = err.response?.data?.message || err.message || 'Failed to fetch restock orders';
  } finally {
    isLoading.value = false;
  }
};

const getSupplierContact = (supplierId) => {
  const supplier = suppliers.value.find(s => s._id === supplierId);
  return supplier ? (supplier.contact || '-') : '-';
};

const fetchSuppliers = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${apiURL}/api/getAllDocs/Supplier`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    suppliers.value = response.data.data || [];
  } catch (err) {
    console.error('Error fetching suppliers:', err);
  }
};

const fetchProducts = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${apiURL}/api/getAllDocs/Product`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    products.value = response.data.data || [];
  } catch (err) {
    console.error('Error fetching products:', err);
  }
};

const fetchStockData = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${apiURL}/api/getAllDocs/Stock`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    stockData.value = response.data.data || [];
  } catch (err) {
    console.error('Error fetching stock data:', err);
  }
};



const handleSubmit = async () => {
  if (!selectedSupplierId.value) {
    error.value = 'Please select a supplier';
    return;
  }

  if (cartItems.value.length === 0) {
    error.value = 'Please add at least one product to cart';
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
    const productIds = cartItems.value.map(item => item.id);

    const requestBody = {
      fields: {
        supplierId: selectedSupplierId.value,
        products: cartItems.value,
        productIds: productIds,
        description: description.value || '',
        status: status.value,
        createdAt: timestamp,
        createdBy: userId
      }
    };

    // Create purchase record
    const purchaseResponse = await axios.post(
      `${apiURL}/api/insertDoc/PurchaseProduct`,
      requestBody,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!purchaseResponse.data.success) {
      throw new Error(purchaseResponse.data.message || 'Failed to create purchase record');
    }

    const purchaseId = purchaseResponse.data.data._id;

    // Create a purchase products map for storing in stock
    let purchaseProductsMap = {};
    cartItems.value.forEach(item => {
      purchaseProductsMap = {
        purchaseId: purchaseId,
        productId: item.id,
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        unit: item.unit,

      };
    });

    // Update each product's stock and purchase price
    for (const item of cartItems.value) {
      const product = products.value.find(p => p._id === item.id);
      if (!product) continue;

      const newTotalStock = (product.totalStock || 0) + item.quantity;

      // Update product data
      await axios.patch(
        `${apiURL}/api/updateDoc/Product/${item.id}`,
        {
          fields: {
            totalStock: newTotalStock,
            purchasePrice: item.unitPrice,
            unit: item.unit,
            status: newTotalStock > 0, // Set status to true if stock > 0
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

      // First get the latest product data (to ensure we have the most up-to-date image URL)
      const updatedProductResponse = await axios.get(
        `${apiURL}/api/getAllDocs/Product`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          params: {
            dynamicConditions: JSON.stringify([
              {
                field: '_id',
                operator: '==',
                value: item.id
              }
            ])
          }
        }
      );

      // Extract the first (and should be only) product from the response
      const updatedProduct = updatedProductResponse.data.data[0];

      // Check if stock exists for this product
      const stockResponse = await axios.get(
        `${apiURL}/api/getAllDocs/Stock`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          params: {
            dynamicConditions: JSON.stringify([
              {
                field: 'productId',
                operator: '==',
                value: item.id
              }
            ])
          }
        }
      );

      const stockExists = stockResponse.data.data && stockResponse.data.data.length > 0;
      const isOutOfStock = newTotalStock <= 0;

      if (stockExists) {
        // Update existing stock record
        const existingStock = stockResponse.data.data[0];

        await axios.patch(
          `${apiURL}/api/updateDoc/Stock/${existingStock._id}`,
          {
            fields: {
              quantity: newTotalStock,
              purchaseProducts: purchaseProductsMap,
              name: updatedProduct.name || existingStock.name,
              imageURL: updatedProduct.imageURL || existingStock.imageURL || null,
              isOutOfStock: isOutOfStock,
              lastRestockedAt: timestamp,
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

        // Emit socket event for stock update
        socket.emit('dataUpdate', {
          action: 'update',
          collection: 'Stock',
          data: existingStock._id
        });
      } else {
        // Create new stock record
        // First, ensure we have the categoryId
        if (!updatedProduct.categoryId) {
          console.error('Product missing categoryId:', updatedProduct);
          continue;
        }

        // Ensure we have all needed product data
        const stockData = {
          fields:
          {
            productId: item.id,
            categoryId: updatedProduct.categoryId,
            purchaseProducts: purchaseProductsMap,
            imageURL: updatedProduct.imageURL || null,
            name: updatedProduct.name || item.name,
            description: updatedProduct.description || item.note || '',
            quantity: newTotalStock,
            unit: item.unit || updatedProduct.unit || 'pcs',
            isOutOfStock: isOutOfStock,
            minThreshold: updatedProduct.minThreshold || 5,
            maxCapacity: updatedProduct.maxCapacity || 100,
            lastRestockedAt: timestamp,
            createdAt: timestamp,
            createdBy: userId
          }
        };

        const newStockResponse = await axios.post(
          `${apiURL}/api/insertDoc/Stock`,
          stockData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        // Emit socket event for new stock
        if (newStockResponse.data.success) {
          socket.emit('dataUpdate', {
            action: 'insert',
            collection: 'Stock',
            data: newStockResponse.data.data._id
          });
        }
      }
    }

    // Emit socket events for real-time updates
    socket.emit('dataUpdate', {
      action: 'insert',
      collection: 'PurchaseProduct',
      data: purchaseResponse.data.data._id
    });

    // Also emit update events for all products
    cartItems.value.forEach(item => {
      socket.emit('dataUpdate', {
        action: 'update',
        collection: 'Product',
        data: item.id
      });
    });

    clearForm();
    closeModal();
  } catch (err) {
    console.error('Error processing purchase:', err);
    error.value = err.response?.data?.message || err.message || 'Failed to process purchase';
  } finally {
    isSubmitting.value = false;
    isLoading.value = false;
  }
};



const editRestock = (restock) => {
  id.value = restock._id;
  selectedSupplierId.value = restock.supplierId;
  description.value = restock.description || '';
  status.value = restock.status;
  enabled.value = restock.status;

  // Load products into cart items
  cartItems.value = restock.products.map(product => ({
    id: product.id,
    name: product.name,
    quantity: product.quantity,
    unitPrice: product.unitPrice,
    totalPrice: product.totalPrice,
    unit: product.unit || '',
    imageURL: product.imageURL || null
  }));

  showModal.value = true;
  showEditModal.value = true;
};

const deleteRestock = (restockId) => {
  pendingRestockId.value = restockId;
  showConfirmDialog.value = true;
};

const handleCancelConfirmation = () => {
  showConfirmDialog.value = false;
  pendingRestockId.value = null;
};

const handleDeleteConfirmation = async () => {
  if (!pendingRestockId.value) return;

  try {
    isLoading.value = true;
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) {
      error.value = 'Authentication required. Please login again.';
      return;
    }

    // First get the purchase details to know which products to update
    const purchaseDetails = await axios.get(
      `${apiURL}/api/getAllDocs/PurchaseProduct`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        params: {
          dynamicConditions: JSON.stringify([
            {
              field: '_id',
              operator: '==',
              value: pendingRestockId.value
            }
          ])
        }
      }
    );

    if (!purchaseDetails.data.data || purchaseDetails.data.data.length === 0) {
      throw new Error('Purchase record not found');
    }

    const purchaseData = purchaseDetails.data.data[0];
    const timestamp = await fetchTimestamp();

    // Create a deletion log record to track this action
    await axios.post(
      `${apiURL}/api/insertDoc/DeletePurchaseLog`,
      {
        fields: {
          purchaseProducts: purchaseData,
          deletedBy: userId,
          deletedAt: timestamp
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Revert stock changes for each product in the purchase
    for (const item of purchaseData.products) {
      // Get current product data
      const productResponse = await axios.get(
        `${apiURL}/api/getAllDocs/Product`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          params: {
            dynamicConditions: JSON.stringify([
              {
                field: '_id',
                operator: '==',
                value: item.id
              }
            ])
          }
        }
      );

      if (productResponse.data.data && productResponse.data.data.length > 0) {
        const product = productResponse.data.data[0];
        // Calculate new stock by subtracting the purchase quantity
        const newTotalStock = Math.max(0, (product.totalStock || 0) - item.quantity);

        // Update product data
        await axios.patch(
          `${apiURL}/api/updateDoc/Product/${item.id}`,
          {
            fields: {
              totalStock: newTotalStock,
              status: newTotalStock > 0, // Set status to false if stock = 0
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

        // Update stock record if it exists
        const stockResponse = await axios.get(
          `${apiURL}/api/getAllDocs/Stock`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            params: {
              dynamicConditions: JSON.stringify([
                {
                  field: 'productId',
                  operator: '==',
                  value: item.id
                }
              ])
            }
          }
        );

        if (stockResponse.data.data && stockResponse.data.data.length > 0) {
          const stockRecord = stockResponse.data.data[0];
          const isOutOfStock = newTotalStock <= 0;

          await axios.patch(
            `${apiURL}/api/updateDoc/Stock/${stockRecord._id}`,
            {
              fields: {
                quantity: newTotalStock,
                isOutOfStock: isOutOfStock,
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

          // Emit socket event for stock update
          socket.emit('dataUpdate', {
            action: 'update',
            collection: 'Stock',
            data: stockRecord._id
          });
        }

        // Emit socket event for product update
        socket.emit('dataUpdate', {
          action: 'update',
          collection: 'Product',
          data: item.id
        });
      }
    }

    // Delete the purchase record after updating product stocks and creating log
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

      // Refresh the restock orders list
      fetchRestockOrders();
      // Also refresh products since their stock has changed
      fetchProducts();
    } else {
      throw new Error(response.data.message || 'Failed to delete restock order');
    }
  } catch (err) {
    console.error('Error deleting restock order:', err);
    error.value = err.response?.data?.message || err.message || 'Failed to delete restock order';
  } finally {
    isLoading.value = false;
    showConfirmDialog.value = false;
    pendingRestockId.value = null;
  }
};

// Watch for changes
watch(enabled, (newValue) => {
  status.value = newValue;
});

watch(selectedItem, (newValue) => {
  pageSize.value = newValue;
  limitedPerPage.value = newValue;
  currentPage.value = 1;
});



watch(searchQuery, (newValue) => {
  searchText.value = newValue;
  currentPage.value = 1;
}, { immediate: true });

// Initialize
onMounted(() => {
  if (socket && socket.disconnected) {
    socket.connect();
  }

  // Fetch initial data
  fetchRestockOrders();
  fetchSuppliers();
  fetchProducts();
  fetchStockData();

  // Real-time updates for restock management
  socket.on('dataUpdate', (update) => {
    if (update.collection === 'PurchaseProduct') {
      console.log('🔄 Real-time PurchaseProduct update:', update);
      fetchRestockOrders();
    }
    if (update.collection === 'Product') {
      console.log('🔄 Real-time Product update:', update);
      fetchProducts();
      fetchStockData();
    }
    if (update.collection === 'Stock') {
      console.log('🔄 Real-time Stock update:', update);
      fetchStockData();
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