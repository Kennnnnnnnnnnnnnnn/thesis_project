<template>
  <div class="p-2 sm:p-4 md:p-6 bg-gray-50 min-h-screen">
    <!-- Header Section - Stacked on mobile -->
    <div class="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-100/50 p-4 sm:p-6 mb-4 sm:mb-6">
      <div class="flex flex-col gap-4 sm:gap-6">
        <!-- Title - Always full width -->
        <div class="flex items-center gap-3 sm:gap-4">
          <div class="p-2 sm:p-3 rounded-xl md:rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div>
            <h1 class="text-xl sm:text-xl font-bold text-gray-900 tracking-tight">Supplier Management</h1>
          </div>
        </div>
        
        <!-- Controls - Stacked on mobile -->
        <div class="flex flex-col gap-3">
          <!-- Search + Filters Row -->
          <div class="flex flex-col sm:flex-row gap-3">
            <!-- Search Input - Full width on mobile -->
            <div class="relative flex-1">
              <input v-model="searchQuery" type="text" placeholder="Search suppliers..."
                class="w-full px-4 py-2.5 pl-10 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all" />
              <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
            </div>
            
            <!-- Items per page - On its own row on mobile -->
            <div class="relative">
              <button @click="toggleDropdownRow"
                class="flex items-center justify-between w-full sm:w-auto min-w-[110px] px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all">
                <span>{{ selectedItem }} items</span>
                <i class="fas fa-chevron-down ml-2 text-xs transition-transform duration-200" :class="{ 'rotate-180': isOpen }"></i>
              </button>
              <div v-show="isOpen"
                class="absolute top-full left-0 mt-2 w-full sm:w-auto bg-white border border-gray-200 shadow-xl rounded-xl py-2 z-50 backdrop-blur-sm">
                <div v-for="item in items" :key="item" @click="selectItem(item)"
                  class="px-4 py-2.5 text-sm text-gray-700 cursor-pointer hover:bg-amber-50 transition-colors font-medium">
                  {{ item }} items
                </div>
              </div>
            </div>
          </div>

          <!-- Status + Add Button Row - Stacked on mobile -->
          <div class="flex flex-col xs:flex-row gap-3">
            <div class="flex gap-3">
              <!-- Status Filter - Full width on mobile -->
              <select v-model="statusFilter" class="w-full xs:w-auto px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 bg-white transition-all">
                <option value="all">All Status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>

              <!-- Add Button - Full width on mobile -->
              <button
                class="w-[100px] xs:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 sm:px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg hover:from-amber-600 hover:to-orange-700 transition-all duration-200 transform hover:scale-[1.02] hover:shadow-xl"
                @click="openModal">
                <i class="fas fa-plus text-xs"></i>
                <span class="hidden xs:inline">Create Supplier</span>
                <span class="xs:hidden">Add</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Table Card -->
    <div class="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden">
      <!-- Table Header - Simplified on mobile -->
      <div class="px-4 sm:px-6 py-4 border-b border-gray-100 bg-gray-50/50">
        <h3 class="text-base sm:text-lg font-bold text-gray-900 tracking-tight">Suppliers</h3>
        <p class="text-xs sm:text-sm text-gray-600 mt-1 font-medium">{{ supplierData.length }} suppliers total</p>
      </div>

      <!-- Table Container -->
      <div class="relative overflow-hidden">
        <!-- Loading Overlay -->
        <div v-if="isLoading" class="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-900"></div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-100">
            <thead class="bg-gray-50/50">
              <tr>
                <th class="px-4 sm:px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">#</th>
                <th class="px-4 sm:px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Supplier</th>
                <th class="px-4 sm:px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider hidden sm:table-cell">Created</th>
                <th class="px-4 sm:px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider hidden md:table-cell">Address</th>
                <th class="px-4 sm:px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider hidden lg:table-cell">Contact</th>
                <th class="px-4 sm:px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider hidden xl:table-cell">Description</th>
                <th class="px-4 sm:px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                <th class="px-4 sm:px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-100">
              <tr v-for="(supplier, index) in supplierData" :key="supplier._id"
                class="hover:bg-amber-50/50 transition-colors duration-200">
                <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  {{ index + 1 }}
                </td>
                
                <!-- Supplier Name Column - Always visible -->
                <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-3 sm:gap-4">
                    <div class="flex-shrink-0">
                      <div class="h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-amber-50 flex items-center justify-center border border-amber-200">
                        <i class="fas fa-building text-amber-600 text-sm"></i>
                      </div>
                    </div>
                    <div class="min-w-0">
                      <div class="text-sm font-bold text-gray-900 truncate max-w-[120px] sm:max-w-none">
                        {{ supplier.name }}
                      </div>
                      <!-- Mobile-only info -->
                      <div class="text-xs text-gray-500 sm:hidden mt-1">
                        <div>
                          {{ formatDate(supplier.createdAt) }}
                        </div>
                        <div class="truncate max-w-[120px]" v-if="supplier.contact">{{ supplier.contact }}</div>
                      </div>
                    </div>
                  </div>
                </td>

                <!-- Created At - Hidden on mobile -->
                <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900 font-medium hidden sm:table-cell">
                  {{ formatDate(supplier.createdAt) }}
                </td>
                
                <!-- Address - Hidden on medium screens -->
                <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-center hidden md:table-cell">
                  <div class="text-sm text-gray-900 font-medium truncate max-w-[160px] mx-auto">
                    {{ supplier.address }}
                  </div>
                </td>
                
                <!-- Contact - Hidden on large screens -->
                <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-center hidden lg:table-cell">
                  <div class="text-sm text-gray-900 font-medium">
                    {{ supplier.contact }}
                  </div>
                </td>
                
                <!-- Description - Hidden on extra large screens -->
                <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-center hidden xl:table-cell">
                  <div class="text-sm text-gray-600 max-w-xs truncate mx-auto">
                    {{ supplier.description || 'N/A' }}
                  </div>
                </td>
                
                <!-- Status Column - Always visible -->
                <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-center">
                  <span class="inline-flex items-center gap-1 sm:gap-2 px-2 py-1 sm:px-3 sm:py-1.5 rounded-xl text-xs font-bold"
                    :class="supplier.status ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'">
                    <i :class="supplier.status ? 'fas fa-circle-check' : 'fas fa-circle-xmark'" class="text-xs"></i>
                    <span class="hidden xs:inline">{{ supplier.status ? 'Active' : 'Inactive' }}</span>
                    <span class="xs:hidden">{{ supplier.status ? 'On' : 'Off' }}</span>
                  </span>
                </td>
                
                <!-- Actions Column - Always visible -->
                <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-center">
                  <div class="flex items-center justify-center gap-1 sm:gap-2">
                    <!-- Edit Button -->
                    <button 
                      class="p-1.5 sm:p-2.5 rounded-xl hover:bg-amber-50 text-amber-600 transition-all duration-200 hover:scale-110 border border-transparent hover:border-amber-200" 
                      @click="editSupplier(supplier)" 
                      :title="showEditModal ? 'Edit supplier' : ''">
                      <i class="fas fa-edit text-xs sm:text-sm"></i>
                    </button>
                    
                    <!-- Delete Button -->
                    <button 
                      class="p-1.5 sm:p-2.5 rounded-xl hover:bg-red-50 text-red-600 transition-all duration-200 hover:scale-110 border border-transparent hover:border-red-200" 
                      @click="deleteSupplier(supplier._id)" 
                      :title="showEditModal ? 'Delete supplier' : ''">
                      <i class="fas fa-trash text-xs sm:text-sm"></i>
                    </button>
                  </div>
                </td>
              </tr>
              
              <!-- Empty State -->
              <tr v-if="supplierData.length === 0 && !isLoading">
                <td colspan="8" class="px-4 sm:px-6 py-12 sm:py-20 text-center">
                  <div class="flex flex-col items-center gap-3 sm:gap-4">
                    <div class="p-4 sm:p-6 rounded-xl md:rounded-2xl bg-amber-50 border border-amber-200">
                      <i class="fas fa-building text-3xl sm:text-5xl text-amber-400"></i>
                    </div>
                    <div>
                      <h3 class="text-base sm:text-lg font-bold text-gray-900">No suppliers found</h3>
                      <p class="text-xs sm:text-sm text-gray-600 mt-1 font-medium">Add your first supplier to get started</p>
                    </div>
                    <button 
                      @click="openModal"
                      class="inline-flex items-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 bg-amber-500 text-white rounded-xl text-sm font-semibold hover:bg-amber-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
                      <i class="fas fa-plus text-xs"></i>
                      Add First Supplier
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      <div class="px-4 sm:px-6 py-3 border-t border-gray-100 bg-gray-50/30">
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

    <!-- Create/Edit Modal - Responsive sizing -->
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[1000] p-2 sm:p-4">
      <div class="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200">
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100">
          <div>
            <h2 class="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
              {{ showEditModal ? 'Update Supplier' : 'Create Supplier' }}
            </h2>
            <p class="text-xs sm:text-sm text-gray-600 mt-1 font-medium">
              {{ showEditModal ? 'Modify supplier details' : 'Add a new supplier' }}
            </p>
          </div>
          <button 
            class="p-1.5 sm:p-2.5 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all"
            @click="closeModal">
            <i class="fas fa-times text-base sm:text-lg"></i>
          </button>
        </div>
        
        <!-- Modal Body -->
        <form @submit.prevent="handleSubmit" class="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <!-- Supplier Name -->
          <div>
            <label class="block text-xs sm:text-sm font-bold text-gray-700 mb-2 sm:mb-3">
              Supplier Name <span class="text-red-500">*</span>
            </label>
            <input v-model="name" type="text" required
              class="w-full px-4 py-3 border border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all font-medium text-sm sm:text-base"
              placeholder="Supplier name" />
          </div>

          <!-- Address -->
          <div>
            <label class="block text-xs sm:text-sm font-bold text-gray-700 mb-2 sm:mb-3">
              Address <span class="text-red-500">*</span>
            </label>
            <input v-model="address" type="text" required
              class="w-full px-4 py-3 border border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all font-medium text-sm sm:text-base"
              placeholder="Supplier address" />
          </div>

          <!-- Contact -->
          <div>
            <label class="block text-xs sm:text-sm font-bold text-gray-700 mb-2 sm:mb-3">
              Contact <span class="text-red-500">*</span>
            </label>
            <input v-model="contact" type="text" required
              class="w-full px-4 py-3 border border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all font-medium text-sm sm:text-base"
              placeholder="Contact number" />
          </div>

          <!-- Description -->
          <div>
            <label class="block text-xs sm:text-sm font-bold text-gray-700 mb-2 sm:mb-3">Description</label>
            <textarea v-model="description" rows="3"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all resize-none font-medium text-sm sm:text-base"
              placeholder="Supplier description"></textarea>
          </div>

          <!-- Status Toggle -->
          <div>
            <label class="block text-xs sm:text-sm font-bold text-gray-700 mb-2 sm:mb-3">Status</label>
            <div class="flex items-center space-x-3">
              <Switch v-model="enabled" class="relative inline-flex h-6 w-11 items-center rounded-full transition"
                :class="enabled ? 'bg-amber-500' : 'bg-gray-300'">
                <span class="sr-only">Enable status</span>
                <span class="inline-block h-4 w-4 transform bg-white rounded-full transition shadow-sm"
                  :class="enabled ? 'translate-x-6' : 'translate-x-1'"></span>
              </Switch>
              <span class="text-xs sm:text-sm text-gray-700 font-medium">{{ enabled ? 'Active' : 'Inactive' }}</span>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="bg-red-50 border border-red-200 rounded-xl p-3 sm:p-4">
            <div class="flex items-center gap-2 sm:gap-3">
              <i class="fas fa-exclamation-circle text-red-500 text-sm"></i>
              <p class="text-red-700 text-xs sm:text-sm font-semibold">{{ error }}</p>
            </div>
          </div>

          <!-- Action Buttons - Stacked on mobile -->
          <div class="flex flex-col sm:flex-row gap-3 pt-4">
            <button type="button" 
              class="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 font-semibold text-sm sm:text-base transition-all"
              @click="resetForm">
              Clear
            </button>
            <button type="submit" 
              :disabled="isSubmitting"
              class="flex-1 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl hover:from-amber-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm sm:text-base transition-all shadow-lg hover:shadow-xl">
              <span v-if="isSubmitting" class="flex items-center justify-center gap-2">
                <i class="fas fa-spinner fa-spin"></i>
                {{ showEditModal ? 'Updating...' : 'Creating...' }}
              </span>
              <span v-else>
                {{ showEditModal ? 'Update' : 'Create' }}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import apiURL from '@/api/config';
import Pagination from '@/components/Pagination.vue';
import { fetchTimestamp } from '@/composables/timestamp';
import socket from '@/services/socket';
import { Switch } from '@headlessui/vue';
import axios from 'axios';
import { onMounted, ref, watch, onUnmounted } from 'vue';
import formatDate from '@/composables/formatDate';

const showModal = ref(false);
const showEditModal = ref(false);
const isLoading = ref(false);
const isSubmitting = ref(false);
const error = ref('');
const supplierData = ref([]);
const id = ref('');
const name = ref('');
const address = ref('');
const contact = ref('');
const description = ref('');
const status = ref(true);
const enabled = ref(true);
const items = ref([10, 25, 50, 100]);
const selectedItem = ref(10);
const currentPage = ref(1);
const pageSize = ref(10);
const currentPageIsLastRecord = ref(null);
const searchText = ref("");
const searchQuery = ref('');
const limitedPerPage = ref(1);
const isOpen = ref(false);
const statusFilter = ref('all');

const handleListenToPagination = async (items) => {
  supplierData.value = items || [];
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
  resetForm()
  showModal.value = true
  showEditModal.value = false
}

const closeModal = () => {
  showModal.value = false;
  showEditModal.value = false;
  resetForm();
};

const resetForm = () => {
  id.value = '';
  name.value = '';
  address.value = '';
  contact.value = '';
  description.value = '';
  status.value = true;
  enabled.value = true;
  error.value = '';
  showModal.value = false;
  showEditModal.value = false;
};

const handleSubmit = async () => {
  if (!name.value || !address.value || !contact.value) {
    error.value = 'Required fields cannot be empty';
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

    const timestamp = await fetchTimestamp()

    const requestBody = {
      fields: {
        name: name.value,
        address: address.value,
        contact: contact.value,
        description: description.value || '',
        status: status.value,
      }
    };

    if (!showEditModal.value) {
      requestBody.fields.createdAt = timestamp;
      requestBody.fields.createdBy = userId;

      const response = await axios.post(
        `${apiURL}/api/insertDoc/Supplier`,
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
          collection: 'Supplier',
          data: response.data.data._id
        });
        resetForm();
        closeModal();
      } else {
        throw new Error(response.data.message || 'Failed to create supplier');
      }
    } else {
      if (!id.value) {
        error.value = 'Error: Missing supplier ID for update operation';
        isSubmitting.value = false;
        isLoading.value = false;
        return;
      }

      requestBody.fields.updatedAt = timestamp;
      requestBody.fields.updatedBy = userId;

      const response = await axios.patch(
        `${apiURL}/api/updateDoc/Supplier/${id.value}`,
        requestBody,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success || response.data.message === 'Supplier updated') {
        socket.emit('dataUpdate', {
          action: 'update',
          collection: 'Supplier',
          data: response.data.data ? response.data.data._id : id.value
        });
        closeModal();
      } else {
        throw new Error(response.data.message || 'Failed to update supplier');
      }
    }
  } catch (err) {
    console.error('Error saving supplier:', err);
    error.value = err.response?.data?.message || err.message || 'Failed to save supplier';
  } finally {
    isSubmitting.value = false;
    isLoading.value = false;
  }
}

const editSupplier = (supplier) => {
  id.value = supplier._id;
  name.value = supplier.name;
  address.value = supplier.address;
  contact.value = supplier.contact;
  description.value = supplier.description || '';
  status.value = supplier.status;
  enabled.value = supplier.status;
  showModal.value = true;
  showEditModal.value = true;
};

const deleteSupplier = async (supplierId) => {
  try {
    isLoading.value = true;
    const token = localStorage.getItem('token');
    if (!token) {
      error.value = 'Authentication required. Please login again.';
      return;
    }
    const response = await axios.delete(
      `${apiURL}/api/deleteDoc/Supplier/${supplierId}`,
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
        collection: 'Supplier',
        data: response.data.data._id
      });
    } else {
      throw new Error(response.data.message || 'Failed to delete supplier');
    }
  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'Failed to delete supplier';
  } finally {
    isLoading.value = false;
  }
};

const fetchSuppliers = async () => {
  try {
    isLoading.value = true;
    const token = localStorage.getItem('token');
    if (!token) {
      error.value = 'Authentication required. Please login again.';
      return;
    }
    const response = await axios.get(`${apiURL}/api/getAllDocs/Supplier`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    supplierData.value = response.data.data || [];
    error.value = '';
  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'Failed to fetch suppliers';
    supplierData.value = [];
  } finally {
    isLoading.value = false;
  }
};

watch(enabled, (newValue) => {
  status.value = newValue;
});

watch(selectedItem, (newValue) => {
  pageSize.value = newValue;
  limitedPerPage.value = newValue;
  currentPage.value = 1;
});

onMounted(() => {
  if (socket && socket.disconnected) {
    socket.connect();
  }

  // Fetch suppliers initially
  fetchSuppliers();

  // Listen for supplier updates in real-time
  socket.on('dataUpdate', (update) => {
    if (update.collection === 'Supplier') {
      console.log('🔄 Real-time Supplier update:', update);
      fetchSuppliers();
    }
  });

  // Optional: reconnect events
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