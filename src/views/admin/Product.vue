<template>
  <div class="p-5 font-sans bg-white rounded-md h-[100vh] overflow-y-auto mt-10">
    <p class="text-left font-semibold text-lg">Product Management</p>

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
        <input v-model="searchQuery" type="text" placeholder="Search Product..."
          class="pl-3 pr-10 py-2 border border-gray-300 rounded-md outline-none w-full transition" />
        <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <i class="fa-solid fa-magnifying-glass"></i>
        </span>
      </div>

      <!-- Category Filter -->
      <div class="relative w-full sm:w-40">
        <select v-model="categoryFilter"
          class="pl-3 pr-8 py-2 border border-gray-300 rounded-md outline-none w-full transition">
          <option value="all">All Categories</option>
          <option v-for="category in categories" :key="category._id" :value="category._id">
            {{ category.name }}
          </option>
        </select>
      </div>

      <!-- Add New Button -->
      <div class="md:ml-auto w-full md:w-auto flex md:block">
        <button @click="openModal"
          class="bg-gradient-to-br from-green-400 to-green-700 text-white px-4 py-2 rounded-md text-xs font-semibold shadow hover:from-green-500 hover:to-green-600 transition"
          style="min-width: 100px;">
          + Create
        </button>
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
              Image</th>
            <th
              class="px-4 py-2 font-semibold text-gray-500 text-left uppercase tracking-wide border-b border-gray-200">
              Product</th>
            <th
              class="px-4 py-2 font-semibold text-gray-500 text-center uppercase tracking-wide border-b border-gray-200">
              Category</th>

            <th
              class="px-4 py-2 font-semibold text-gray-500 text-center uppercase tracking-wide border-b border-gray-200">
              Description</th>


            <th
              class="px-4 py-2 font-semibold text-gray-500 text-center uppercase tracking-wide border-b border-gray-200">
              Price</th>
            <th
              class="px-4 py-2 font-semibold text-gray-500 text-center uppercase tracking-wide border-b border-gray-200">
              Discount</th>
            <th
              class="px-4 py-2 font-semibold text-gray-500 text-center uppercase tracking-wide border-b border-gray-200">
              Stock</th>
            <th
              class="px-4 py-2 font-semibold text-gray-500 text-center uppercase tracking-wide border-b border-gray-200">
              Status</th>
            <th
              class="px-4 py-2 font-semibold text-gray-500 text-center uppercase tracking-wide border-b border-gray-200">
              Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(product, index) in productData" :key="index"
            class="hover:bg-yellow-50 transition-colors duration-100 border-b border-gray-100 last:border-none">
            <td class="px-4 py-2 text-gray-800">{{ index + 1 }}</td>


            <td class="px-4 py-2">
              <div class="w-12 h-12 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                <img v-if="product.imageURL" :src="product.imageURL" :alt="product.name"
                  class="w-full h-full object-cover">
                <i v-else class="fas fa-image text-gray-400"></i>
              </div>
            </td>



            <td class="px-4 py-2 text-gray-700">
      
                <p class="font-medium">{{ product.name }}</p>
           
            </td>

            
            <td class="px-4 py-2 text-center text-gray-600">
              {{ getCategoryName(product.categoryId) }}
            </td>



            <td class="px-4 py-2 text-center">
              <p class="font-medium">{{ product.description || '-' }} </p>
            </td>


            <td class="px-4 py-2 text-center text-gray-700 font-medium">{{ product.salePrice }} riel</td>


            <td class="px-4 py-2 text-center">
              <span v-if="product.discount > 0" class="text-red-600">{{ product.discount }}%</span>
              <span v-else>-</span>
            </td>



            <td class="px-4 py-2 text-center text-gray-600">{{ product.totalStock || 0 }}</td>


            <td class="px-4 py-2 text-center">
              <i :class="getStatusClass(product.status)"></i>
            </td>



            <td class="px-4 py-2 flex justify-center gap-2">
              <button class="p-1 rounded hover:bg-blue-100 transition" @click="editProduct(product)" aria-label="Edit">
                <i class="fa-solid fa-pen-to-square text-blue-600 hover:text-blue-700"></i>
              </button>
              <button class="p-1 rounded hover:bg-red-100 transition" @click="deleteProduct(product._id)"
                aria-label="Delete">
                <i class="fa-solid fa-trash text-red-600 hover:text-red-700"></i>
              </button>
            </td>
          </tr>
          <tr v-if="productData.length === 0 && !isLoading">
            <td colspan="9" class="px-4 py-8 text-center text-gray-400 italic">
              No products found
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination Component -->
    <Pagination :currentPage="currentPage" @onEmitDataFromPagination="handleListenToPagination"
      @onEmitIsLoading="handleListenIsLoading" @onEmitCurrentPageIsLastRecord="handleListenIsLastRecordOnPage"
      :limitedPerPage="pageSize" :searchQuery="searchText" />

    <!-- Create/Edit Product Modal -->
    <div v-if="showModal"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000] overflow-y-auto">
      <div
        class="font-sans w-[95%] md:w-[70%] lg:w-[60%] max-w-3xl mt-10 p-6 bg-white shadow-md rounded-lg relative z-50 m-auto">
        <!-- Close Button -->
        <button class="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors" @click="closeModal">
          <i class="fa-solid fa-xmark text-xl"></i>
        </button>

        <h2 class="text-xl font-semibold mb-6 text-gray-700 text-center">
          {{ showEditModal ? 'Update Product' : 'Create New Product' }}
        </h2>

        <form @submit.prevent="handleSubmit" class="space-y-5">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <!-- Product Name -->
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1.5">
                Product Name <span class="text-red-500">*</span>
              </label>
              <input v-model="name" type="text" required
                class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-500 transition-all"
                placeholder="Enter product name" />
            </div>

            <!-- Category -->
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1.5">
                Category <span class="text-red-500">*</span>
              </label>
              <select v-model="categoryId" required
                class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-500 transition-all appearance-none bg-white"
                :style="{
                  backgroundImage: 'url(\'data:image/svg+xml;charset=US-ASCII,%3Csvg width=%2220%22 height=%2220%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath d=%22M7 7l3-3 3 3m0 6l-3 3-3-3%22 stroke=%22%239CA3AF%22 stroke-width=%221.5%22 fill=%22none%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22/%3E%3C/svg%3E\')',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.75rem center',
                  paddingRight: '2.5rem'
                }">
                <option value="" disabled>Select category</option>
                <option v-for="category in categories" :key="category._id" :value="category._id">
                  {{ category.name }}
                </option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <!-- Price -->
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1.5">
                Price <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">៛</span>
                <input v-model="salePrice" type="number" step="100" min="0" required
                  class="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-500 transition-all"
                  placeholder="0" />
              </div>
            </div>

            <!-- Discount -->
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1.5">
                Discount %
              </label>
              <div class="relative">
                <input v-model="discount" type="number" min="0" max="100" step="1"
                  class="w-full pr-8 pl-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-500 transition-all"
                  placeholder="0" />
                <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
              </div>
            </div>
          </div>


          <!-- Stock Quantity
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1.5">
                Stock Quantity
              </label>
              <input v-model="totalStock" type="number" min="0" step="1"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-500 transition-all"
                placeholder="0" />
            </div> -->


          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1.5">
              Description
            </label>
            <textarea v-model="description" rows="3"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-500 transition-all resize-none"
              placeholder="Enter product description"></textarea>
          </div>

          <!-- Product Image -->
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1.5">
              Product Image
            </label>
            <div
              class="border border-dashed border-gray-300 rounded-md p-6 hover:bg-gray-50 transition-all cursor-pointer"
              @click="$refs.fileInput.click()">
              <div v-if="imagePreview" class="mb-4 flex justify-center">
                <img :src="imagePreview" class="max-h-40 rounded-md object-contain" alt="Product preview" />
              </div>
              <div class="flex flex-col items-center justify-center">
                <div class="bg-green-50 rounded-full p-3 mb-2">
                  <i class="fa-solid fa-cloud-arrow-up text-green-500 text-xl"></i>
                </div>
                <p class="text-sm text-gray-600 font-medium">Click to upload image</p>
                <p class="text-xs text-gray-400 mt-1">PNG, JPG or JPEG (Max 2MB)</p>
                <input ref="fileInput" type="file" class="hidden" @change="handleImageUpload" accept="image/*" />
              </div>
              <p v-if="uploadStatus" class="mt-3 text-xs text-center" :class="uploadStatus.color">
                {{ uploadStatus.message }}
              </p>
            </div>
          </div>



          <!-- Status Toggle -->
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1.5">
              Status
            </label>
            <div class="flex items-center space-x-3 mt-1.5">
              <Switch v-model="enabled" class="relative inline-flex h-6 w-11 items-center rounded-full transition"
                :class="enabled ? 'bg-green-500' : 'bg-gray-300'">
                <span class="sr-only">Enable status</span>
                <span class="inline-block h-4 w-4 transform bg-white rounded-full transition shadow-sm"
                  :class="enabled ? 'translate-x-6' : 'translate-x-1'"></span>
              </Switch>
              <span class="text-sm text-gray-600">{{ enabled ? 'Active' : 'Inactive' }}</span>
            </div>
          </div>

          <!-- Error message -->
          <p v-if="error" class="text-red-500 text-sm mt-1 bg-red-50 p-2 rounded-md">{{ error }}</p>

          <!-- Action Buttons -->
          <div class="flex justify-end gap-4 mt-6 pt-4 border-t border-gray-100">
            <button type="button" @click="resetForm"
              class="px-6 py-2.5 rounded-md text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
              Clear
            </button>
            <button type="submit"
              class="px-6 py-2.5 rounded-md text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-colors">
              {{ showEditModal ? 'Update' : 'Submit' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Confirmation Delete Dialog -->
    <DeleteConfirmation :show="showConfirmDialog" @cancel="handleCancelConfirmation"
      @confirm="handleDeleteConfirmation" />
  </div>
</template>

<script setup>
import apiURL from '@/api/config';
import DeleteConfirmation from '@/components/DeleteConfirmation.vue';
import getStatusClass from '@/components/GetStatus.vue';
import Pagination from '@/components/Pagination.vue';
import { getNextNumberId } from "@/composables/getNextId";
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


// generate custom ID function

const generateCustomId = async () => {
  try {
    const token = localStorage.getItem('token');

    const param = {
      sortField: "createdAt",
      sortOrder: "desc",
      limit: 1
    };

    // Remove 'loan/' from the API path
    const response = await axios.get(
      `${apiURL}/api/getAllDocs/Product`,
      {
        params: param,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    let lastId = response.data?.data?.[0]?.idCustom || null;
    let lastNumber = null;

    if (lastId) {
      const matches = lastId.match(/(\d+)$/);
      if (matches) lastNumber = matches[1];
    }

    const nextNumber = getNextNumberId(lastNumber);
    return `Pro-${nextNumber}`;
  } catch (error) {
    console.error("Error in generateCustomId:", error);
    // Fallback: Generate a unique ID based on timestamp
    const timestamp = new Date().getTime();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `Pro-${timestamp % 100000}-${randomNum}`;
  }
};


// Get category name by ID
const getCategoryName = (categoryId) => {
  const category = categories.value.find(cat => cat._id === categoryId);
  return category ? category.name : 'Unknown';
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
    currentPage.value -= 1; // Move to previous page
  }
};

watch(searchQuery, (newValue) => {
  searchText.value = newValue;
  // Reset to page 1 when searching
  currentPage.value = 1;
}, { immediate: true }); // Add immediate option to trigger on component mount

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

    // Use base64 approach for image upload like in Users.vue
    if (imageFile.value) {
      uploadStatus.value = {
        message: 'Processing image...',
        color: 'text-blue-500'
      };

      // Convert image to base64 if it's not already
      if (!imagePreview.value.startsWith('data:image')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          imageURL.value = e.target.result; // Store the base64 data directly
        };
        reader.readAsDataURL(imageFile.value);
      } else {
        // Image is already converted to base64 in handleImageUpload
        imageURL.value = imagePreview.value;
      }
    }

    // Generate custom ID if needed
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
        imageURL: imageURL.value || '', // This now contains base64 image data
      }
    };

    if (!showEditModal.value) {
      // Create new product
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
      // Update existing product
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

  // Set image preview if product has an image URL
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
  // If we want to filter products by category
  // This would typically trigger a search or filter on the existing data
  if (newValue !== 'all') {
    // Implement category filtering
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

  // Validate file type
  if (!file.type.match('image.*')) {
    uploadStatus.value = {
      message: 'Please select an image file',
      color: 'text-red-500'
    };
    return;
  }

  // Size validation (limit to 2MB)
  if (file.size > 2 * 1024 * 1024) {
    uploadStatus.value = {
      message: 'Image size should be less than 2MB',
      color: 'text-red-500'
    };
    return;
  }

  imageFile.value = file;

  // Create a preview
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

onMounted(() => {
  if (socket && socket.disconnected) {
    socket.connect();
  }

  // Listen for socket updates
  socket.on('dataUpdated', (update) => {
    if (update.collection === 'Product') {
      fetchProducts();
    }
    if (update.collection === 'Category') {
      fetchCategories();
    }
  });

  fetchProducts();
  fetchCategories();
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