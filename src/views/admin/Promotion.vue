<template>
  <div class="p-4 md:p-6 bg-gray-50">
    <!-- Header Section -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-4 sm:p-6 mb-6">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <!-- Title -->
        <div class="flex items-center gap-4">
          <div class="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2">
              <path d="M16 6l4 4-4 4M8 18l-4-4 4-4"></path>
            </svg>
          </div>
          <h1 class="text-xl font-bold text-gray-900 tracking-tight">Promotions</h1>
        </div>

        <!-- Controls -->
        <div class="flex flex-col sm:flex-row flex-wrap gap-3 items-start sm:items-center">
          <!-- Items per page -->
          <div class="relative w-full sm:w-auto">
            <button @click="toggleDropdownRow"
              class="flex w-full sm:w-auto items-center justify-between px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all">
              <span>{{ selectedItem }} </span>
              <i class="fas fa-chevron-down ml-2 text-xs transition-transform duration-200"
                :class="{ 'rotate-180': isOpen }"></i>
            </button>
            <div v-show="isOpen"
              class="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 shadow-xl rounded-xl py-2 z-50 backdrop-blur-sm">
              <div v-for="item in items" :key="item" @click="selectItem(item)"
                class="px-4 py-2.5 text-sm text-gray-700 cursor-pointer hover:bg-amber-50 transition-colors font-medium">
                {{ item }}
              </div>
            </div>
          </div>

          <!-- Search Input -->
          <div class="relative w-full sm:w-auto">
            <input v-model="searchQuery" type="text" placeholder="Search products"
              class="w-full sm:w-64 px-4 py-2.5 pl-10 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all" />
            <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
          </div>

          <!-- Promotion Type Filter -->
          <select v-model="promotionTypeFilter"
            class="w-full sm:w-auto px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 bg-white transition-all">
            <option value="all">All Types</option>
            <option value="discount">Discount</option>
            <option value="freeDelivery">Free Delivery</option>
            <option value="other">Other</option>
          </select>

          <!-- Add Promotion Button -->
          <button
            class="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg hover:from-amber-600 hover:to-orange-700 transition-all duration-200 transform hover:scale-[1.02] hover:shadow-xl"
            @click="openModal">
            <i class="fas fa-plus text-xs"></i>
            Add Promotion
          </button>
        </div>
      </div>
    </div>

    <!-- Table Card -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden">
      <div class="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100 bg-gray-50/50">
        <h3 class="text-lg font-bold text-gray-900 tracking-tight">Promotions</h3>
      </div>

      <!-- Table Container -->
      <div class="relative">
        <div v-if="isLoading" class="absolute inset-0 bg-opacity-70 flex items-center justify-center z-10">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-900"></div>
        </div>

        <div class="overflow-x-auto w-full">
          <table class="min-w-full divide-y divide-gray-100">
            <thead class="bg-gray-50/50">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">#</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Product</th>
                <th class="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Type</th>
                <th class="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Qty Limit</th>
                <th class="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                <th class="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">{{ $t('common.actions') }}</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-100">
              <tr v-for="(promotion, index) in filteredPromotions" :key="promotion._id"
                class="hover:bg-gray-50/50 transition-colors duration-150">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ index + 1 }}
                </td>

                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ getProductName(promotion.productId) }}</div>
                </td>

                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span class="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold"
                    :class="{
                      'bg-green-100 text-green-800 border border-green-200': promotion.promotionType === 'discount',
                      'bg-blue-100 text-blue-800 border border-blue-200': promotion.promotionType === 'freeDelivery',
                      'bg-amber-100 text-amber-800 border border-amber-200': promotion.promotionType === 'other'
                    }">
                    {{ promotion.promotionType }}
                  </span>
                </td>

                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <div class="text-sm text-gray-700 font-medium">
                    {{ promotion.promotionQtyLimit || 'No limit' }}
                  </div>
                </td>

                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold"
                    :class="promotion.isActive ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'">
                    <i :class="promotion.isActive ? 'fas fa-circle-check text-xs' : 'fas fa-circle-xmark text-xs'"></i>
                    {{ promotion.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </td>

                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <div class="flex items-center justify-center gap-2">
                    <button
                      class="p-2.5 rounded-xl hover:bg-amber-50 text-amber-600 transition-all duration-200 hover:scale-110 border border-transparent hover:border-amber-200"
                      @click="editPromotion(promotion)" title="Edit promotion">
                      <i class="fas fa-edit text-sm"></i>
                    </button>

                    <button
                      class="p-2.5 rounded-xl hover:bg-red-50 text-red-600 transition-all duration-200 hover:scale-110 border border-transparent hover:border-red-200"
                      @click="deletePromotion(promotion._id)" title="Delete promotion">
                      <i class="fas fa-trash text-sm"></i>
                    </button>
                  </div>
                </td>
              </tr>

              <!-- Empty State -->
              <tr v-if="filteredPromotions.length === 0 && !isLoading">
                <td colspan="6" class="px-6 py-20 text-center">
                  <div class="flex flex-col items-center gap-4">
                    <div class="p-6 rounded-2xl bg-amber-50 border border-amber-200">
                      <i class="fas fa-tags text-5xl text-amber-400"></i>
                    </div>
                    <h3 class="text-lg font-bold text-gray-900">No Promotions Found</h3>
                    <p class="text-sm text-gray-600 mt-1 font-medium">Create your first promotion to get started</p>
                    <button @click="openModal"
                      class="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-xl text-sm font-semibold hover:bg-amber-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
                      <i class="fas fa-plus text-xs"></i>
                      Add Promotion
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      <div class="px-4 sm:px-6 py-4 border-t border-gray-100 bg-gray-50/30">
        <Pagination :currentPage="currentPage" @onEmitDataFromPagination="handleListenToPagination"
          @onEmitIsLoading="handleListenIsLoading" @onEmitCurrentPageIsLastRecord="handleListenIsLastRecordOnPage"
          :limitedPerPage="pageSize" :searchQuery="searchText" />
      </div>
    </div>


    <!-- Create/Edit Modal -->
    <div v-if="showModal"
      class="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[1000] p-4">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-200">
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 class="text-xl font-bold text-gray-900 tracking-tight">
              {{ showEditModal ? 'Update Promotion' : 'Create New Promotion' }}
            </h2>
            <p class="text-sm text-gray-600 mt-1 font-medium">
              {{ showEditModal ? 'Modify existing promotion details' : 'Add a new promotion to your campaigns' }}
            </p>
          </div>
          <button class="p-2.5 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all"
            @click="closeModal">
            <i class="fas fa-times text-lg"></i>
          </button>
        </div>

        <!-- Modal Body -->
        <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
          <!-- Product and Promotion Type -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-3">
                Product <span class="text-red-500">*</span>
              </label>
              <select v-model="productId" required
                class="w-full px-4 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all font-medium">
                <option value="" disabled>Choose product</option>
                <option v-for="product in products" :key="product._id" :value="product._id">
                  {{ product.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 mb-3">
                Promotion Type <span class="text-red-500">*</span>
              </label>
              <select v-model="promotionType" required
                class="w-full px-4 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all font-medium">
                <option value="" disabled>Choose type</option>
                <option value="discount">Discount</option>
                <option value="freeDelivery">Free Delivery</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <!-- Start and End Date Pickers -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-3">
                Start Date <span class="text-red-500">*</span>
              </label>
              <DatePicker v-model="startDate" :min-date="new Date()"
                input-class="w-full px-4 py-3.5 border border-gray-200 rounded-2xl font-medium" :show-icon="true"
                dateFormat="dd/mm/yy" placeholder="Start date" />
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-3">
                End Date <span class="text-red-500">*</span>
              </label>
              <DatePicker v-model="endDate" :min-date="startDate || new Date()"
                input-class="w-full px-4 py-3.5 border border-gray-200 rounded-2xl font-medium" :show-icon="true"
                dateFormat="dd/mm/yy" placeholder="End date" />
            </div>
          </div>

          <!-- Promotion Quantity Limit and Unit -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-3">
                Quantity for Discount <span class="text-red-500">*</span>
              </label>
              <input v-model="promotionQtyLimit" type="number" min="0" step="1"
                class="flex px-4 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all font-medium"
                placeholder="Input qty" />
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-3">
                Quantity <span class="text-red-500">*</span>
              </label>
              <input v-model="promotionQtyStartFrom" type="number" min="0" step="1"
                class="flex px-4 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all font-medium"
                placeholder="Start from qty" />
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-3">
                Unit <span class="text-red-500">*</span>
              </label>
              <input v-model="promotionQtyUnit" type="text"
                class=" px-3 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all font-medium"
                placeholder="Unit (e.g. kg, pcs)" />
            </div>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-3">
              Description
            </label>
            <textarea v-model="description" rows="3"
              class="w-full px-4 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all resize-none font-medium"
              placeholder="Description (optional)"></textarea>
          </div>

          <!-- Status Toggle -->
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-3">
              Status
            </label>
            <div class="flex items-center space-x-3">
              <Switch v-model="enabled" class="relative inline-flex h-6 w-11 items-center rounded-full transition"
                :class="enabled ? 'bg-amber-500' : 'bg-gray-300'">
                <span class="sr-only">Toggle Status</span>
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
              {{ $t('common.reset') }}
            </button>
            <button type="submit" :disabled="isSubmitting"
              class="flex-1 px-6 py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-2xl hover:from-amber-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]">
              <span v-if="isSubmitting" class="flex items-center justify-center gap-2">
                <i class="fas fa-spinner fa-spin"></i>
                {{ showEditModal ? 'Updating Promotion...' : 'Creating Promotion...' }}
              </span>
              <span v-else>
                {{ showEditModal ? 'Update Promotion' : 'Create Promotion' }}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
   

    <!-- Confirmation Dialog -->
    <DeleteConfirmation :show="showConfirmDialog" @cancel="handleCancelConfirmation"
      @confirm="handleDeleteConfirmation" />
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
import Swal from 'sweetalert2';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import DatePicker from 'primevue/datepicker';



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
const promotionData = ref([]);
const products = ref([]);
const error = ref('');
const isSubmitting = ref(false);
const enabled = ref(true);
const showModal = ref(false);
const showEditModal = ref(false);
const isOpen = ref(false);
const promotionTypeFilter = ref('all');
const startDate = ref(null);
const endDate = ref(null);


// State for delete confirmation
const showConfirmDialog = ref(false);
const pendingPromotionId = ref(null);

// Form fields
const id = ref('');
const productId = ref('');
const promotionQtyLimit = ref('');
const promotionQtyStartFrom = ref('');
const promotionQtyUnit = ref('');
const promotionType = ref('');
const description = ref('');
const isActive = ref(true);

// New refs for image upload
const imagePreview = ref('');
const uploadStatus = ref(null);
const imageFile = ref(null);

// Router
const router = useRouter();

// Add fileInput ref in the script section
const fileInput = ref(null);

// Computed properties
const filteredPromotions = computed(() => {
  let filtered = promotionData.value;

  // Filter by promotion type
  if (promotionTypeFilter.value !== 'all') {
    filtered = filtered.filter(promotion => promotion.promotionType === promotionTypeFilter.value);
  }

  // Search filter would be handled by pagination component
  return filtered;
});

// Helper functions
const getProductName = (productId) => {
  const product = products.value.find(prod => prod._id === productId);
  return product ? product.name : 'Unknown Product';
};


const currencies = ref([]);
const selectedCurrencyId = ref('');

// Fetch all products for dropdown
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



// Generate custom ID function
const generateCustomId = async () => {
  try {
    const token = localStorage.getItem('token');

    // Get ALL promotions instead of just the most recent one
    const response = await axios.get(
      `${apiURL}/api/getAllDocs/Promotion`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    let highestNumber = 0;

    if (response.data?.data?.length > 0) {
      // Loop through all promotions to find the highest ID number
      response.data.data.forEach(promotion => {
        if (promotion.idCustom) {
          const matches = promotion.idCustom.match(/Promo-(\d+)$/);
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
    console.log(`Generated next ID: Promo-${nextNumber} (from highest existing ID: ${highestNumber})`);

    return `Promo-${nextNumber}`;
  } catch (error) {
    console.error("Error in generateCustomId:", error);
    // Fallback with timestamp-based ID to ensure uniqueness
    const timestamp = new Date().getTime();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `Promo-${timestamp % 100000}-${randomNum}`;
  }
};

// pagination
const handleListenToPagination = async (items) => {
  promotionData.value = items || [];
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
  if (!productId.value || !promotionType.value) {
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

    const requestBody = {
      fields: {
        productId: productId.value,
        promotionQtyLimit: promotionQtyLimit.value || '',
        promotionQtyStartFrom: promotionQtyStartFrom.value || 0,
        promotionQtyUnit: promotionQtyUnit.value || '',
        promotionType: promotionType.value,
        description: description.value || '',
        isActive: isActive.value,
        userId: userId,
        startDate: startDate.value,
        endDate: endDate.value,

      }
    };

    if (!showEditModal.value) {
      requestBody.fields.createdAt = timestamp;
      requestBody.fields.createdBy = userId;

      const response = await axios.post(
        `${apiURL}/api/insertDoc/Promotion`,
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
          collection: 'Promotion',
          data: response.data.data._id
        });

        isSubmitting.value = false;
        closeModal();
      } else {
        throw new Error(response.data.message || 'Failed to create promotion');
      }
    } else {
      if (!id.value) {
        error.value = 'Error: Missing promotion ID for update operation';
        return;
      }

      requestBody.fields.updatedAt = timestamp;
      requestBody.fields.updatedBy = userId;

      const response = await axios.patch(
        `${apiURL}/api/updateDoc/Promotion/${id.value}`,
        requestBody,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success || response.data.message === 'Promotion updated') {
        socket.emit('dataUpdate', {
          action: 'update',
          collection: 'Promotion',
          data: response.data.data ? response.data.data._id : id.value
        });

        isSubmitting.value = false;
        closeModal();
      } else {
        throw new Error(response.data.message || 'Failed to update promotion');
      }
    }
  } catch (err) {
    console.error('Error saving promotion:', err);
    error.value = err.response?.data?.message || err.message || 'Failed to save promotion';
  } finally {
    isSubmitting.value = false;
    isLoading.value = false;
  }
};

const editPromotion = (promotion) => {
  id.value = promotion._id;
  productId.value = promotion.productId;
  promotionQtyLimit.value = promotion.promotionQtyLimit || '';
  promotionQtyStartFrom.value = promotion.promotionQtyStartFrom || 0;
  promotionQtyUnit.value = promotion.promotionQtyUnit || '';
  promotionType.value = promotion.promotionType;
  description.value = promotion.description || '';
  isActive.value = promotion.isActive || false;
  enabled.value = promotion.isActive || false;
  startDate.value = promotion.startDate ? new Date(promotion.startDate) : null;
  endDate.value = promotion.endDate ? new Date(promotion.endDate) : null;


  showModal.value = true;
  showEditModal.value = true;
};

const deletePromotion = (promotionId) => {
  pendingPromotionId.value = promotionId;
  showConfirmDialog.value = true;
};

const handleDeleteConfirmation = async () => {
  showConfirmDialog.value = false;
  if (!pendingPromotionId.value) return;

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
      `${apiURL}/api/deleteDoc/Promotion/${pendingPromotionId.value}`,
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
        collection: 'Promotion',
        data: pendingPromotionId.value
      });
    } else {
      throw new Error(response.data.message || 'Failed to delete promotion');
    }
  } catch (err) {
    console.error('Error deleting promotion:', err);
    error.value = err.response?.data?.message || err.message || 'Failed to delete promotion';
  } finally {
    isLoading.value = false;
    pendingPromotionId.value = null;
  }
};

const handleCancelConfirmation = () => {
  showConfirmDialog.value = false;
  pendingPromotionId.value = null;
};

watch(enabled, (newValue) => {
  isActive.value = newValue;
});

const resetForm = () => {
  id.value = '';
  productId.value = '';
  promotionQtyLimit.value = '';
  promotionQtyStartFrom.value = '';
  promotionQtyUnit.value = '';
  promotionType.value = '';
  description.value = '';
  isActive.value = true;
  enabled.value = true;
  error.value = null;
  startDate.value = null;
  endDate.value = null;
};

// Fetch promotions
const fetchPromotions = async () => {
  try {
    isLoading.value = true;
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) {
      error.value = 'Authentication required. Please login again.';
      return;
    }

    const response = await axios.get(`${apiURL}/api/getAllDocs/Promotion`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.data && response.data.data) {
      promotionData.value = response.data.data;
    } else {
      promotionData.value = [];
    }

    error.value = '';
  } catch (err) {
    console.error('Error fetching promotions:', err);
    if (err.response?.status === 401) {
      error.value = 'Session expired. Please login again.';
      router.push('/login');
    } else {
      error.value = err.response?.data?.message || err.message || 'Failed to fetch promotions';
    }
    promotionData.value = [];
  } finally {
    isLoading.value = false;
  }
};

// Fetch products for dropdown
const fetchProductsForDropdown = async () => {
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

watch(promotionTypeFilter, (newValue) => {
  if (newValue !== 'all') {
    // Promotion type filtering is handled by computed property
  }
});

watch(enabled, (newValue) => {
  isActive.value = newValue;
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



onBeforeUnmount(() => {
  socket.off('dataUpdate');
  socket.off('promotionCreated');
  socket.off('promotionUpdated');
  socket.off('promotionDeleted');
});



onMounted(() => {
  if (!socket.connected) socket.connect();

  socket.on('connect', () => console.log('✅ Socket.IO connected:', socket.id));

  socket.on('dataUpdate', (update) => {
    if (update.collection === 'Promotion') {
      console.log('🔔 dataUpdate for Promotion received:', update);
      fetchPromotions();
    }
  });

  socket.on('promotionCreated', (promotion) => {
    console.log('🆕 Promotion created (real-time):', promotion);
    fetchPromotions();
  });

  socket.on('promotionUpdated', (promotion) => {
    console.log('🔄 Promotion updated (real-time):', promotion);
    fetchPromotions();
  });

  socket.on('promotionDeleted', (promotionId) => {
    console.log('🗑️ Promotion deleted (real-time):', promotionId);
    fetchPromotions();
  });

  fetchPromotions();
  fetchProductsForDropdown();
});

socket.on('promotionCreated', (promotion) => {
  fetchPromotions();
  Swal.fire({
    icon: 'success',
    title: 'Promotion Added!',
    text: `Promotion was created successfully.`,
    timer: 2500,
    showConfirmButton: false
  });
});

socket.on('promotionUpdated', (promotion) => {
  fetchPromotions();
  Swal.fire({
    icon: 'info',
    title: 'Promotion Updated!',
    text: `Promotion was updated successfully.`,
    timer: 2500,
    showConfirmButton: false
  });
});

socket.on('promotionDeleted', (promotionId) => {
  fetchPromotions();
  Swal.fire({
    icon: 'warning',
    title: 'Promotion Deleted!',
    text: `Promotion with ID ${promotionId} was deleted.`,
    timer: 2500,
    showConfirmButton: false
  });
});


</script>

<style lang="scss" scoped>
/* Enhanced scrollbar styling - Extra small jg dak pin na kor ban*/
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