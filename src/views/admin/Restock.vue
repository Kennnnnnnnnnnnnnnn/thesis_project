<template>
  <div class="p-5 font-sans bg-white rounded-md h-[100vh] overflow-y-auto mt-10">
    <p class="text-left font-semibold text-lg">Restock Management</p>

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
        <input v-model="searchQuery" type="text" placeholder="Search Restock..."
          class="pl-3 pr-10 py-2 border border-gray-300 rounded-md outline-none w-full transition" />
        <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <i class="fa-solid fa-magnifying-glass"></i>
        </span>
      </div>

      <!-- Status Filter -->
      <div class="relative w-full sm:w-40">
        <select v-model="statusFilter" class="pl-3 pr-8 py-2 border border-gray-300 rounded-md outline-none w-full transition">
          <option value="all">All Status</option>
          <option value="true">Active</option>
          <option value="false">Completed</option>
        </select>
      </div>

      <!-- Add New Button -->
      <div class="md:ml-auto w-full md:w-auto flex md:block">
        <button @click="openModal"
          class="bg-gradient-to-br from-green-400 to-green-700 text-white px-4 py-2 rounded-md text-xs font-semibold shadow hover:from-green-500 hover:to-green-600 transition"
          style="min-width: 100px;">
          + Create Restock
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
            <th class="px-4 py-2 font-semibold text-gray-500 text-left uppercase tracking-wide border-b border-gray-200">No</th>
            <th class="px-4 py-2 font-semibold text-gray-500 text-left uppercase tracking-wide border-b border-gray-200">Supplier</th>
            <th class="px-4 py-2 font-semibold text-gray-500 text-left uppercase tracking-wide border-b border-gray-200">Products</th>
            <th class="px-4 py-2 font-semibold text-gray-500 text-center uppercase tracking-wide border-b border-gray-200">Description</th>
            <th class="px-4 py-2 font-semibold text-gray-500 text-center uppercase tracking-wide border-b border-gray-200">Status</th>
            <th class="px-4 py-2 font-semibold text-gray-500 text-center uppercase tracking-wide border-b border-gray-200">Created At</th>
            <th class="px-4 py-2 font-semibold text-gray-500 text-center uppercase tracking-wide border-b border-gray-200">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(restock, index) in restockData" :key="index"
            class="hover:bg-yellow-50 transition-colors duration-100 border-b border-gray-100 last:border-none">
            <td class="px-4 py-2 text-gray-800">{{ index + 1 }}</td>
            <td class="px-4 py-2 text-gray-700">
              {{ getSupplierName(restock.supplierId) }}
            </td>
            <td class="px-4 py-2">
              <div class="flex flex-col gap-1">
                <div v-for="product in restock.products" :key="product.id" 
                  class="flex items-center gap-2 bg-gray-50 p-1 rounded">
                  <div class="w-8 h-8 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                    <img v-if="product.imageURL" :src="product.imageURL" :alt="product.name" 
                      class="w-full h-full object-cover">
                    <i v-else class="fas fa-box text-gray-400"></i>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate">{{ product.name }}</p>
                    <p class="text-xs text-gray-500">Qty: {{ product.quantity }}</p>
                  </div>
                </div>
              </div>
            </td>
            <td class="px-4 py-2 text-center text-gray-600">{{ restock.description || 'N/A' }}</td>
            <td class="px-4 py-2 text-center">
              <span class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold"
                :class="restock.status ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'">
                <i :class="restock.status ? 'fa-solid fa-circle-check' : 'fa-solid fa-clock'"></i>
                {{ restock.status ? 'Active' : 'Completed' }}
              </span>
            </td>
            <td class="px-4 py-2 text-center text-gray-600">{{ formatDate(restock.createdAt) }}</td>
            <td class="px-4 py-2 flex justify-center gap-2">
              <button class="p-1 rounded hover:bg-blue-100 transition" @click="editRestock(restock)" aria-label="Edit">
                <i class="fa-solid fa-pen-to-square text-blue-600 hover:text-blue-700"></i>
              </button>
              <button class="p-1 rounded hover:bg-red-100 transition" @click="deleteRestock(restock._id)"
                aria-label="Delete">
                <i class="fa-solid fa-trash text-red-600 hover:text-red-700"></i>
              </button>
              <button v-if="restock.status" class="p-1 rounded hover:bg-green-100 transition" 
                @click="markAsComplete(restock._id)" aria-label="Complete">
                <i class="fa-solid fa-check text-green-600 hover:text-green-700"></i>
              </button>
            </td>
          </tr>
          <tr v-if="restockData.length === 0 && !isLoading">
            <td colspan="7" class="px-4 py-8 text-center text-gray-400 italic">
              No restock orders found
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination Component -->
    <Pagination :currentPage="currentPage" @onEmitDataFromPagination="handleListenToPagination"
      @onEmitIsLoading="handleListenIsLoading" @onEmitCurrentPageIsLastRecord="handleListenIsLastRecordOnPage"
      :limitedPerPage="pageSize" :searchQuery="searchText" />

    <!-- Create/Edit Restock Modal -->
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]">
      <div class="font-sans w-[95%] md:w-[70%] lg:w-[60%] max-w-3xl mt-20 p-6 bg-white shadow-md rounded-lg relative z-50 m-auto">
        <!-- Close Button -->
        <i class="fa-solid fa-circle-xmark cursor-pointer text-red-700 text-lg absolute top-3 right-3 
          hover:text-red-500 transform hover:scale-105 transition-all duration-300 ease-in-out"
          @click="closeModal"></i>

        <h2 class="text-lg font-semibold mb-4 text-gray-700 text-center mt-[-15px]">
          {{ showEditModal ? 'Update Restock Order' : 'Create Restock Order' }}
        </h2>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Supplier Selection -->
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">
              Supplier <span class="text-red-500">*</span>
            </label>
            <select v-model="supplierId" required
              class="border border-gray-300 focus:border-green-500 focus:ring-green-100 rounded-md px-3 py-2 w-full outline-none transition">
              <option value="" disabled>Select supplier</option>
              <option v-for="supplier in suppliers" :key="supplier._id" :value="supplier._id">
                {{ supplier.name }}
              </option>
            </select>
          </div>

          <!-- Product Selection -->
          <div class="space-y-2">
            <label class="block text-xs font-medium text-gray-600">
              Products <span class="text-red-500">*</span>
            </label>
            <div v-for="(product, index) in selectedProducts" :key="index" 
              class="flex items-center gap-3 p-2 bg-gray-50 rounded">
              <select v-model="product.id" required
                class="flex-1 border border-gray-300 focus:border-green-500 focus:ring-green-100 rounded-md px-3 py-2 outline-none transition">
                <option value="" disabled>Select product</option>
                <option v-for="p in products" :key="p._id" :value="p._id">
                  {{ p.name }}
                </option>
              </select>
              <input v-model="product.quantity" type="number" min="1" required placeholder="Qty"
                class="w-24 border border-gray-300 focus:border-green-500 focus:ring-green-100 rounded-md px-3 py-2 outline-none transition" />
              <button type="button" @click="removeProduct(index)"
                class="p-2 text-red-500 hover:bg-red-50 rounded-full transition">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <button type="button" @click="addProduct"
              class="w-full py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-500 hover:border-green-500 hover:text-green-500 transition">
              <i class="fas fa-plus mr-2"></i> Add Product
            </button>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Description</label>
            <textarea v-model="description" rows="3"
              class="border border-gray-300 focus:border-green-500 focus:ring-green-100 rounded-md px-3 py-2 w-full outline-none transition"
              placeholder="Enter restock description"></textarea>
          </div>

          <!-- Status Toggle -->
          <div class="flex items-center gap-3">
            <Switch v-model="enabled" class="relative inline-flex h-6 w-11 items-center rounded-full transition"
              :class="enabled ? 'bg-green-500' : 'bg-gray-300'">
              <span class="sr-only">Enable status</span>
              <span class="inline-block h-4 w-4 transform bg-white rounded-full transition"
                :class="enabled ? 'translate-x-6' : 'translate-x-1'"></span>
            </Switch>
            <span class="text-gray-600 text-sm">Status</span>
          </div>

          <!-- Error message -->
          <p v-if="error" class="text-red-500 text-xs mt-1">{{ error }}</p>

          <!-- Action Buttons -->
          <div class="flex justify-end gap-3 mt-4">
            <button type="button" @click="resetForm" class="px-5 py-2 rounded-full text-base font-normal bg-gray-100 text-gray-700 shadow-sm
           hover:bg-gray-200 focus:ring-2 focus:ring-gray-300 transition">
              Clear
            </button>
            <button type="submit" class="px-5 py-2 rounded-full text-base font-normal bg-green-600 text-white shadow-sm
           hover:bg-green-700 focus:ring-2 focus:ring-green-300 transition">
              {{ showEditModal ? 'Update' : 'Submit' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <DeleteConfirmation :show="showConfirmDialog" @cancel="handleCancelConfirmation"
      @confirm="handleDeleteConfirmation" />

    <!-- Total Amount Display -->
    <!-- <div class="mt-4 p-3 bg-gray-50 rounded-lg">
      <div class="flex justify-between items-center">
        <span class="text-sm font-medium text-gray-600">Total Amount:</span>
        <span class="text-lg font-bold text-green-600">${{ calculateTotalAmount().toFixed(2) }}</span>
      </div>
    </div> -->
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
const items = ref([1, 10, 50, 100, 500, 1000]);
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

// State for delete confirmation
const showConfirmDialog = ref(false);
const pendingRestockId = ref(null);

// Form fields
const id = ref('');
const supplierId = ref('');
const selectedProducts = ref([{ id: '', quantity: 1 }]);
const description = ref('');
const status = ref(true);

// Router
const router = useRouter();

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

const getSupplierName = (supplierId) => {
  const supplier = suppliers.value.find(s => s._id === supplierId);
  return supplier ? supplier.name : 'Unknown';
};

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

// Product management in form
const addProduct = () => {
  selectedProducts.value.push({ id: '', quantity: 1 });
};

const removeProduct = (index) => {
  selectedProducts.value.splice(index, 1);
  if (selectedProducts.value.length === 0) {
    addProduct();
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

    // Calculate total amount
    let totalAmount = 0;
    for (const product of selectedProducts.value) {
      const productData = products.value.find(p => p._id === product.id);
      if (productData) {
        const price = productData.price || 0;
        const quantity = parseInt(product.quantity);
        totalAmount += price * quantity;
      }
    }

    const requestBody = {
      fields: {
        supplierId: supplierId.value,
        products: selectedProducts.value.map(p => ({
          id: p.id,
          quantity: parseInt(p.quantity)
        })),
        productIds: selectedProducts.value.map(p => p.id),
        description: description.value || '',
        status: status.value,
        totalAmount: totalAmount
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
  selectedProducts.value = restock.products.map(p => ({
    id: p.id,
    quantity: p.quantity
  }));
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
          status: false,
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
      
      // Update stock for restock
      await updateStockForRestock(restockId);
    }
  } catch (err) {
    console.error('Error marking restock as complete:', err);
    error.value = err.response?.data?.message || err.message || 'Failed to update status';
  } finally {
    isLoading.value = false;
  }
};

const updateStockForRestock = async (restockId) => {
  // Get the restock order details
  const restockOrder = restockData.value.find(order => order._id === restockId);
  if (!restockOrder) return;
  
  // Update stock quantities for each product in the order
  for (const product of restockOrder.products) {
    try {
      // Get current stock status
      const stockResponse = await axios.get(
        `${apiURL}/api/getDocsByField/Stock/productId/${product.id}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      if (stockResponse.data?.data?.[0]) {
        const stock = stockResponse.data.data[0];
        
        // Calculate new quantity
        const newQuantity = stock.quantity + product.quantity;
        
        // Update stock record
        await axios.patch(
          `${apiURL}/api/updateDoc/Stock/${stock._id}`,
          {
            fields: {
              quantity: newQuantity,
              isOutOfStock: newQuantity <= 0,
              lastRestockedAt: new Date().toISOString(),
              updatedBy: userId,
              updatedAt: timestamp
            }
          },
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
      }
    } catch (err) {
      console.error(`Error updating stock for product ${product.id}:`, err);
    }
  }
};

watch(enabled, (newValue) => {
  status.value = newValue;
});

const resetForm = () => {
  id.value = '';
  supplierId.value = '';
  selectedProducts.value = [{ id: '', quantity: 1 }];
  description.value = '';
  status.value = true;
  enabled.value = true;
  error.value = null;
};

// Fetch restock orders
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

// Fetch suppliers for dropdown
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

// Fetch products for dropdown
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
  });
  
  fetchRestock();
  fetchSuppliers();
  fetchProducts();
  
  // Check for single restock item from Stock page
  const restockItem = localStorage.getItem('restockItem');
  if (restockItem) {
    try {
      const item = JSON.parse(restockItem);
      // Pre-fill the form with the item
      supplierId.value = item.supplierId;
      selectedProducts.value = [{
        id: item.productId,
        quantity: item.quantity
      }];
      
      // Clear the localStorage
      localStorage.removeItem('restockItem');
      
      // Open the modal
      openModal();
    } catch (e) {
      console.error('Error parsing restock item:', e);
    }
  }
  
  // Check for bulk restock items from Stock page
  const bulkItems = localStorage.getItem('bulkRestockItems');
  if (bulkItems) {
    try {
      const supplierGroups = JSON.parse(bulkItems);
      const supplierIds = Object.keys(supplierGroups);
      
      if (supplierIds.length > 0) {
        // Use the first supplier and its items
        const firstSupplierId = supplierIds[0];
        supplierId.value = firstSupplierId;
        
        // Map the items to the format expected by the form
        selectedProducts.value = supplierGroups[firstSupplierId].map(item => ({
          id: item.id,
          quantity: item.quantity
        }));
        
        // Clear the localStorage
        localStorage.removeItem('bulkRestockItems');
        
        // Open the modal
        openModal();
      }
    } catch (e) {
      console.error('Error parsing bulk restock items:', e);
    }
  }
});

// Add a reactive ref for the total if you want to use it elsewhere
const totalAmount = ref(0);

// Add this watch to update totalAmount when products change
watch(selectedProducts, () => {
  totalAmount.value = calculateTotalAmount();
}, { deep: true });

// Add this function to your script setup section
const calculateTotalAmount = () => {
  let total = 0;
  for (const product of selectedProducts.value) {
    const productData = products.value.find(p => p._id === product.id);
    if (productData && product.id) {
      const price = productData.price || 0;
      const quantity = parseInt(product.quantity || 0);
      total += price * quantity;
    }
  }
  return total;
};
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