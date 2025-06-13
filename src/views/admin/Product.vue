<template>
  <div class="p-4 md:p-6 bg-gray-50 font-inter">
    <!-- Header Section -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-6 mb-6">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <!-- Title -->
        <div class="flex items-center gap-4">
          <div class="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 11V7a4 4 0 0 0-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Product Management</h1>
            <!-- <p class="text-sm text-gray-600 mt-0.5 font-medium">Manage your product catalog and inventory</p> -->
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
            <input v-model="searchQuery" type="text" placeholder="Search products..."
              class="w-64 px-4 py-2.5 pl-10 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all" />
            <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
          </div>

          <!-- Category Filter -->
          <select v-model="categoryFilter" class="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 bg-white transition-all">
            <option value="all">All Categories</option>
            <option v-for="category in categories" :key="category._id" :value="category._id">
              {{ category.name }}
            </option>
          </select>

          <!-- Add Button -->
          <button
            class="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg hover:from-amber-600 hover:to-orange-700 transition-all duration-200 transform hover:scale-[1.02] hover:shadow-xl"
            @click="openModal">
            <i class="fas fa-plus text-xs"></i>
            Add Product
          </button>
        </div>
      </div>
    </div>

    <!-- Main Table Card -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden">
      <!-- Table Header -->
      <div class="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
        <h3 class="text-lg font-bold text-gray-900 tracking-tight">Product Catalog</h3>
        <p class="text-sm text-gray-600 mt-1 font-medium">{{ filteredProducts.length }} products total</p>
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
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Product</th>
                <th class="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Category</th>
                <th class="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Description</th>
                <th class="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Price</th>
                <th class="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Discount</th>
                <th class="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Stock</th>
                <th class="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                <th class="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-100">
              <tr v-for="(product, index) in filteredProducts" :key="product._id"
                class="hover:bg-amber-50/50 transition-colors duration-200">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  {{ index + 1 }}
                </td>
                
                <!-- Product Column -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-4">
                    <div class="flex-shrink-0">
                      <div v-if="product.imageURL" 
                        class="h-12 w-12 rounded-2xl bg-gray-100 overflow-hidden border border-gray-200">
                        <img :src="product.imageURL" :alt="product.name" 
                          class="h-full w-full object-cover" />
                      </div>
                      <div v-else 
                        class="h-12 w-12 rounded-2xl bg-gray-100 flex items-center justify-center border border-gray-200">
                        <i class="fas fa-image text-gray-400"></i>
                      </div>
                    </div>
                    <div>
                      <div class="text-sm font-bold text-gray-900">
                        {{ product.name }}
                      </div>
                      <div class="text-xs text-gray-500 font-medium mt-0.5">
                        ID: {{ product.idCustom || 'N/A' }}
                      </div>
                    </div>
                  </div>
                </td>
                
                <!-- Category Column -->
                <td class="px-6 py-4 whitespace-nowrap text-center font-khmer">
                  <span class="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                    {{ getCategoryName(product.categoryId) }}
                  </span>
                </td>
                
                <!-- Description Column -->
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <div class="max-w-32 text-sm text-gray-600 truncate">
                    {{ product.description || '-' }}
                  </div>
                </td>
                
                <!-- Price Column -->
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <div class="text-sm font-bold text-gray-900">
                    {{ formatPrice(product.salePrice) }}
                  </div>
                </td>
                
                <!-- Discount Column -->
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span v-if="product.discount > 0" 
                    class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">
                    {{ product.discount }}%
                  </span>
                  <span v-else class="text-gray-400 font-medium">-</span>
                </td>
                
                <!-- Stock Column -->
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <div class="text-sm font-bold text-gray-900">
                    {{ product.totalStock || 0 }}
                  </div>
                </td>
                
                <!-- Status Column -->
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold"
                    :class="product.status ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'">
                    <i :class="product.status ? 'fas fa-circle-check' : 'fas fa-circle-xmark'" class="text-xs"></i>
                    {{ product.status ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                
                <!-- Actions Column -->
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <div class="flex items-center justify-center gap-2">
                    <!-- Edit Button -->
                    <button 
                      class="p-2.5 rounded-xl hover:bg-amber-50 text-amber-600 transition-all duration-200 hover:scale-110 border border-transparent hover:border-amber-200" 
                      @click="editProduct(product)" 
                      title="Edit product">
                      <i class="fas fa-edit text-sm"></i>
                    </button>
                    
                    <!-- Delete Button -->
                    <button 
                      class="p-2.5 rounded-xl hover:bg-red-50 text-red-600 transition-all duration-200 hover:scale-110 border border-transparent hover:border-red-200" 
                      @click="deleteProduct(product._id)" 
                      title="Delete product">
                      <i class="fas fa-trash text-sm"></i>
                    </button>
                  </div>
                </td>
              </tr>
              
              <!-- Empty State -->
              <tr v-if="filteredProducts.length === 0 && !isLoading">
                <td colspan="9" class="px-6 py-20 text-center">
                  <div class="flex flex-col items-center gap-4">
                    <div class="p-6 rounded-2xl bg-amber-50 border border-amber-200">
                      <i class="fas fa-shopping-bag text-5xl text-amber-400"></i>
                    </div>
                    <div>
                      <h3 class="text-lg font-bold text-gray-900">No products found</h3>
                      <p class="text-sm text-gray-600 mt-1 font-medium">Add your first product to get started</p>
                    </div>
                    <button 
                      @click="openModal"
                      class="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-xl text-sm font-semibold hover:bg-amber-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
                      <i class="fas fa-plus text-xs"></i>
                      Add First Product
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
              {{ showEditModal ? 'Update Product' : 'Create New Product' }}
            </h2>
            <p class="text-sm text-gray-600 mt-1 font-medium">
              {{ showEditModal ? 'Modify existing product details' : 'Add a new product to your catalog' }}
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
          <!-- Product Name and Category -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-3">
                Product Name <span class="text-red-500">*</span>
              </label>
              <input v-model="name" type="text" required
                class="w-full px-4 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all font-medium"
                placeholder="Enter product name" />
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 mb-3">
                Category <span class="text-red-500">*</span>
              </label>
              <select v-model="categoryId" required
                class="w-full px-4 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all font-medium">
                <option value="" disabled>Select category</option>
                <option v-for="category in categories" :key="category._id" :value="category._id">
                  {{ category.name }}
                </option>
              </select>
            </div>
          </div>

          <!-- Price and Discount -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-3">
                Price <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">៛</span>
                <input v-model="salePrice" type="number" step="100" min="0" required
                  class="w-full pl-8 pr-4 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all font-medium"
                  placeholder="0" />
              </div>
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 mb-3">
                Discount %
              </label>
              <div class="relative">
                <input v-model="discount" type="number" min="0" max="100" step="1"
                  class="w-full pr-8 pl-4 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all font-medium"
                  placeholder="0" />
                <span class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">%</span>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-3">
              Description
            </label>
            <textarea v-model="description" rows="3"
              class="w-full px-4 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all resize-none font-medium"
              placeholder="Enter product description"></textarea>
          </div>

          <!-- Product Image -->
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-3">
              Product Image
            </label>
            <div
              class="border-2 border-dashed border-gray-200 rounded-2xl p-8 hover:bg-amber-50/30 hover:border-amber-300 transition-all cursor-pointer"
              @click="$refs.fileInput.click()">
              <div v-if="imagePreview" class="mb-4 flex justify-center">
                <img :src="imagePreview" class="max-h-48 rounded-2xl object-contain shadow-lg" alt="Product preview" />
              </div>
              <div class="flex flex-col items-center justify-center">
                <div class="bg-amber-100 rounded-full p-4 mb-3 border border-amber-200">
                  <i class="fas fa-cloud-upload-alt text-amber-600 text-2xl"></i>
                </div>
                <p class="text-sm text-gray-700 font-bold">Click to upload image</p>
                <p class="text-xs text-gray-500 mt-1 font-medium">PNG, JPG or JPEG (Max 2MB)</p>
                <input ref="fileInput" type="file" class="hidden" @change="handleImageUpload" accept="image/*" />
              </div>
              <p v-if="uploadStatus" class="mt-4 text-xs text-center font-semibold" :class="uploadStatus.color">
                {{ uploadStatus.message }}
              </p>
            </div>
          </div>

          <!-- Status Toggle -->
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-3">
              Status
            </label>
            <div class="flex items-center space-x-3">
              <Switch v-model="enabled" class="relative inline-flex h-6 w-11 items-center rounded-full transition"
                :class="enabled ? 'bg-amber-500' : 'bg-gray-300'">
                <span class="sr-only">Enable status</span>
                <span class="inline-block h-4 w-4 transform bg-white rounded-full transition shadow-sm"
                  :class="enabled ? 'translate-x-6' : 'translate-x-1'"></span>
              </Switch>
              <span class="text-sm text-gray-700 font-medium">{{ enabled ? 'Active' : 'Inactive' }}</span>
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
                {{ showEditModal ? 'Update Product' : 'Create Product' }}
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
import { computed, onMounted, ref, watch } from 'vue';
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
const productData = ref([]);
const categories = ref([]);
const error = ref('');
const isSubmitting = ref(false);
const enabled = ref(true);
const showModal = ref(false);
const showEditModal = ref(false);
const isOpen = ref(false);
const categoryFilter = ref('all');

// State for delete confirmation
const showConfirmDialog = ref(false);
const pendingProductId = ref(null);

// Form fields
const id = ref('');
const idCustom = ref('');
const name = ref('');
const description = ref('');
const categoryId = ref('');
const salePrice = ref('');
const discount = ref(0);
const totalStock = ref(0);
const imageURL = ref('');
const status = ref(true);

// New refs for image upload
const imagePreview = ref('');
const uploadStatus = ref(null);
const imageFile = ref(null);

// Router
const router = useRouter();

// Add fileInput ref in the script section
const fileInput = ref(null);

// Computed properties
const filteredProducts = computed(() => {
  let filtered = productData.value;

  // Filter by category
  if (categoryFilter.value !== 'all') {
    filtered = filtered.filter(product => product.categoryId === categoryFilter.value);
  }

  // Search filter would be handled by pagination component
  return filtered;
});

// Helper functions
const formatPrice = (price) => {
  return new Intl.NumberFormat('km-KH').format(price || 0) + '៛';
};

const getCategoryName = (categoryId) => {
  const category = categories.value.find(cat => cat._id === categoryId);
  return category ? category.name : 'Unknown';
};

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

// Generate custom ID function
// Generate custom ID function
const generateCustomId = async () => {
  try {
    const token = localStorage.getItem('token');
    
    // Get ALL products instead of just the most recent one
    const response = await axios.get(
      `${apiURL}/api/getAllDocs/Product`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    let highestNumber = 0;
    
    if (response.data?.data?.length > 0) {
      // Loop through all products to find the highest ID number
      response.data.data.forEach(product => {
        if (product.idCustom) {
          const matches = product.idCustom.match(/Pro-(\d+)$/);
          if (matches && matches[1]) {
            const currentNumber = parseInt(matches[1], 10);
            if (!isNaN(currentNumber) && currentNumber > highestNumber) {
              highestNumber = currentNumber;
            }
          }
        }
      });
    }
    
    // Increment the highest number by 1 and format with leading zeros
    const nextNumber = (highestNumber + 1).toString().padStart(6, '0');
    console.log(`Generated next ID: Pro-${nextNumber} (from highest existing ID: ${highestNumber})`);
    
    return `Pro-${nextNumber}`;
  } catch (error) {
    console.error("Error in generateCustomId:", error);
    // Fallback with timestamp-based ID to ensure uniqueness
    const timestamp = new Date().getTime();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `Pro-${timestamp % 100000}-${randomNum}`;
  }
};

// pagination
const handleListenToPagination = async (items) => {
  productData.value = items || [];
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
  if (!name.value || !categoryId.value || !salePrice.value) {
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

    if (imageFile.value) {
      uploadStatus.value = {
        message: 'Processing image...',
        color: 'text-blue-500'
      };

      if (!imagePreview.value.startsWith('data:image')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          imageURL.value = e.target.result;
        };
        reader.readAsDataURL(imageFile.value);
      } else {
        imageURL.value = imagePreview.value;
      }
    }

    let customId = idCustom.value;
    if (!customId) {
      customId = await generateCustomId();
    }

    const requestBody = {
      fields: {
        idCustom: customId,
        name: name.value,
        description: description.value || '',
        categoryId: categoryId.value,
        salePrice: parseFloat(salePrice.value),
        discount: parseFloat(discount.value) || 0,
        totalStock: parseInt(totalStock.value) || 0,
        status: status.value,
        imageURL: imageURL.value || '',
      }
    };

    if (!showEditModal.value) {
      requestBody.fields.createdAt = timestamp;
      requestBody.fields.createdBy = userId;

      const response = await axios.post(
        `${apiURL}/api/insertDoc/Product`,
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
          collection: 'Product',
          data: response.data.data._id
        });

        isSubmitting.value = false;
        closeModal();
      } else {
        throw new Error(response.data.message || 'Failed to create product');
      }
    } else {
      if (!id.value) {
        error.value = 'Error: Missing product ID for update operation';
        return;
      }

      requestBody.fields.updatedAt = timestamp;
      requestBody.fields.updatedBy = userId;

      const response = await axios.patch(
        `${apiURL}/api/updateDoc/Product/${id.value}`,
        requestBody,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success || response.data.message === 'Product updated') {
        socket.emit('dataUpdate', {
          action: 'update',
          collection: 'Product',
          data: response.data.data ? response.data.data._id : id.value
        });

        isSubmitting.value = false;
        closeModal();
      } else {
        throw new Error(response.data.message || 'Failed to update product');
      }
    }
  } catch (err) {
    console.error('Error saving product:', err);
    error.value = err.response?.data?.message || err.message || 'Failed to save product';
  } finally {
    isSubmitting.value = false;
    isLoading.value = false;
  }
};

const editProduct = (product) => {
  id.value = product._id;
  idCustom.value = product.idCustom;
  name.value = product.name;
  description.value = product.description || '';
  categoryId.value = product.categoryId;
  salePrice.value = product.salePrice;
  discount.value = product.discount || 0;
  totalStock.value = product.totalStock || 0;
  status.value = product.status;
  enabled.value = product.status;
  imageURL.value = product.imageURL || '';

  if (product.imageURL) {
    imagePreview.value = product.imageURL;
  }

  showModal.value = true;
  showEditModal.value = true;
};

const deleteProduct = (productId) => {
  pendingProductId.value = productId;
  showConfirmDialog.value = true;
};

const handleDeleteConfirmation = async () => {
  showConfirmDialog.value = false;
  if (!pendingProductId.value) return;

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
      `${apiURL}/api/deleteDoc/Product/${pendingProductId.value}`,
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
        collection: 'Product',
        data: pendingProductId.value
      });
    } else {
      throw new Error(response.data.message || 'Failed to delete product');
    }
  } catch (err) {
    console.error('Error deleting product:', err);
    error.value = err.response?.data?.message || err.message || 'Failed to delete product';
  } finally {
    isLoading.value = false;
    pendingProductId.value = null;
  }
};

const handleCancelConfirmation = () => {
  showConfirmDialog.value = false;
  pendingProductId.value = null;
};

watch(enabled, (newValue) => {
  status.value = newValue;
});

const resetForm = () => {
  id.value = '';
  idCustom.value = '';
  name.value = '';
  description.value = '';
  categoryId.value = '';
  salePrice.value = 0;
  discount.value = 0;
  totalStock.value = 0;
  imageURL.value = '';
  status.value = true;
  enabled.value = true;
  error.value = null;
  imagePreview.value = '';
  uploadStatus.value = null;
  imageFile.value = null;
};

// Fetch products
const fetchProducts = async () => {
  try {
    isLoading.value = true;
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) {
      error.value = 'Authentication required. Please login again.';
      return;
    }

    const response = await axios.get(`${apiURL}/api/getAllDocs/Product`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.data && response.data.data) {
      productData.value = response.data.data;
    } else {
      productData.value = [];
    }

    error.value = '';
  } catch (err) {
    console.error('Error fetching products:', err);
    if (err.response?.status === 401) {
      error.value = 'Session expired. Please login again.';
      router.push('/login');
    } else {
      error.value = err.response?.data?.message || err.message || 'Failed to fetch products';
    }
    productData.value = [];
  } finally {
    isLoading.value = false;
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

watch(categoryFilter, (newValue) => {
  if (newValue !== 'all') {
    // Category filtering is handled by computed property
  }
});

watch(selectedItem, (newValue) => {
  pageSize.value = newValue;
  limitedPerPage.value = newValue;
  currentPage.value = 1;
});

// Image upload handler
const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (!file.type.match('image.*')) {
    uploadStatus.value = {
      message: 'Please select an image file',
      color: 'text-red-500'
    };
    return;
  }

  if (file.size > 2 * 1024 * 1024) {
    uploadStatus.value = {
      message: 'Image size should be less than 2MB',
      color: 'text-red-500'
    };
    return;
  }

  imageFile.value = file;

  const reader = new FileReader();
  reader.onload = (e) => {
    imagePreview.value = e.target.result;
  };
  reader.readAsDataURL(file);

  uploadStatus.value = {
    message: 'Image ready to upload',
    color: 'text-green-500'
  };
};




// Add these socket listeners in your onMounted function:

onMounted(() => {
  if (socket && socket.disconnected) {
    socket.connect();
  }
  
  // Listen for socket updates
  socket.on('dataUpdate', (update) => {
    console.log('📡 Product.vue received socket update:', update);
    
    if (update.collection === 'Product') {
      // Handle different types of product updates
      if (update.action === 'batch-update' && update.data.restockId) {
        console.log('🔄 Batch product update from restock:', update.data.restockId);
        fetchProducts(); // Refresh all product data
      } else if (update.action === 'bulk-update' && update.data === 'refresh-all') {
        console.log('🔄 Bulk refresh of all product data');
        fetchProducts(); // Refresh all product data
      } else if (update.action === 'update' && update.data) {
        console.log('🔄 Individual product update for:', update.data);
        fetchProducts(); // Refresh all product data
      } else {
        // General product updates
        fetchProducts();
      }
    }
    
    // Also listen for Stock updates that might affect product display
    if (update.collection === 'Stock') {
      console.log('🔄 Stock update affecting product display');
      // Optionally refresh if stock data affects product display
    }
  });
  
  fetchProducts(); // Initial fetch
  fetchCategories(); // Fetch categories for dropdown
});


</script>

<style lang="scss" scoped>
/* Enhanced scrollbar styling - Extra small */
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