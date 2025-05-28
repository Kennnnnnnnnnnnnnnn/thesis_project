<template>
  <div class="p-5 font-sans bg-white rounded-md">
    <!-- Header, Create Button, Search and Filter -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5 pb-4 border-b border-yellow-200">
      <div class="flex items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-yellow-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
        <p class="text-left font-semibold text-lg">Supplier Management</p>
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
        <div class="relative w-full sm:w-64">
          <input v-model="searchQuery" type="text" placeholder="Search supplier..."
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
            <option value="false">Inactive</option>
          </select>
        </div>

        <button
          class="bg-gradient-to-br from-green-400 to-green-600 text-white px-4 py-2 rounded-md text-xs font-semibold shadow hover:from-green-500 hover:to-green-700 transition min-w-[100px]"
          @click="openModal">
          + Create Supplier
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-y-auto mt-3 relative bg-white rounded-lg shadow-sm border border-gray-100"  style="max-height: 60vh;">
      <!-- Loading Overlay -->
      <div v-if="isLoading" class="absolute inset-0 bg-opacity-70 flex items-center justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-900"></div>
      </div>

      <table class="min-w-full text-sm">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-2 font-semibold text-gray-500 text-left uppercase tracking-wide">No</th>
            <th class="px-4 py-2 font-semibold text-gray-500 text-left uppercase tracking-wide">Name</th>
            <th class="px-4 py-2 font-semibold text-gray-500 text-center uppercase tracking-wide">Address</th>
            <th class="px-4 py-2 font-semibold text-gray-500 text-center uppercase tracking-wide">Contact</th>
            <th class="px-4 py-2 font-semibold text-gray-500 text-center uppercase tracking-wide">Description</th>
            <th class="px-4 py-2 font-semibold text-gray-500 text-center uppercase tracking-wide">Status</th>
            <th class="px-4 py-2 font-semibold text-gray-500 text-center uppercase tracking-wide">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(supplier, index) in supplierData" :key="supplier._id"
            class="hover:bg-yellow-50 transition-colors duration-100 border-b border-gray-100 last:border-none">
            <td class="px-4 py-2 text-gray-800">{{ index + 1 }}</td>
            <td class="px-4 py-2 text-center align-middle">
              <div class="flex items-center gap-2 w-full">
                <span class="text-gray-800 whitespace-nowrap">{{ supplier.name }}</span>
              </div>
            </td>
            <td class="px-4 py-2 text-center text-gray-600">{{ supplier.address }}</td>
            <td class="px-4 py-2 text-center text-gray-600">{{ supplier.contact }}</td>
            <td class="px-4 py-2 text-center text-gray-600">{{ supplier.description || 'N/A' }}</td>
            <td class="px-4 py-2 text-center">
              <span class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold"
                :class="supplier.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
                <i :class="supplier.status ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-xmark'"></i>
                {{ supplier.status ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td class="px-4 py-2 flex justify-center gap-2">
              <button class="p-1 rounded hover:bg-blue-100 transition" @click="editSupplier(supplier)">
                <i class="fa-solid fa-pen-to-square text-blue-600"></i>
              </button>
              <button class="p-1 rounded hover:bg-red-100 transition" @click="confirmDeleteModal(supplier)">
                <i class="fa-solid fa-trash text-red-600"></i>
              </button>
              <!-- <button class="p-1 rounded hover:bg-red-100 transition" @click="deleteSupplier(supplier._id)">
                <i class="fa-solid fa-trash text-red-600"></i>
              </button> -->
            </td>
          </tr>
          <tr v-if="supplierData.length === 0 && !isLoading">
            <td colspan="7" class="px-4 py-8 text-center text-gray-400 italic">
              No suppliers found
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Pagination 
      :currentPage="currentPage" 
      @onEmitDataFromPagination="handleListenToPagination"
      @onEmitIsLoading="handleListenIsLoading" 
      @onEmitCurrentPageIsLastRecord="handleListenIsLastRecordOnPage"
      :limitedPerPage="pageSize" 
      :searchQuery="searchText" 
      :isLoading="isLoading"
    />

    <!-- Create/Edit Supplier Modal -->
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]">
      <div class="font-sans w-full max-w-lg sm:w-[95%] sm:max-w-lg bg-white rounded-lg shadow-md p-4 sm:p-8 relative">
        <!-- Close Button -->
        <i class="fa-solid fa-circle-xmark cursor-pointer text-red-700 text-lg absolute top-4 right-4
          hover:text-red-500 transform hover:scale-110 transition-all duration-300 ease-in-out"
          @click="closeModal"></i>
        <h2 class="text-lg font-semibold mb-5 text-gray-700 text-center mt-[-12px]">
          {{ showEditModal ? 'Update Supplier' : 'Create New Supplier' }}
        </h2>
        <form @submit.prevent="handleSubmit" class="space-y-4 flex flex-col">
          <!-- Name -->
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">
              Supplier Name <span class="text-red-500">*</span>
            </label>
            <input v-model="name" type="text" required
              class="border border-gray-300 focus:border-yellow-500 focus:ring-yellow-100 rounded-md px-3 py-2 w-full outline-none transition"
              placeholder="Enter supplier name" />
          </div>

          <!-- Address -->
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">
              Address <span class="text-red-500">*</span>
            </label>
            <input v-model="address" type="text" required
              class="border border-gray-300 focus:border-yellow-500 focus:ring-yellow-100 rounded-md px-3 py-2 w-full outline-none transition"
              placeholder="Enter address" />
          </div>

          <!-- Contact -->
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">
              Contact Number <span class="text-red-500">*</span>
            </label>
            <input v-model="contact" type="number" required
              class="border border-gray-300 focus:border-yellow-500 focus:ring-yellow-100 rounded-md px-3 py-2 w-full outline-none transition"
              placeholder="Enter contact number" />
          </div>

          <!-- Description -->
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">
              Description
            </label>
            <textarea v-model="description"
              class="border border-gray-300 focus:border-yellow-500 focus:ring-yellow-100 rounded-md px-3 py-2 w-full outline-none transition"
              rows="3" placeholder="Enter description"></textarea>
          </div>

          <!-- Status Toggle -->
          <div class="flex items-center gap-3">
            <Switch v-model="enabled" class="relative inline-flex h-6 w-11 items-center rounded-full transition">
              <span class="sr-only">Enable status</span>
              <span class="inline-block h-4 w-4 transform bg-white rounded-full transition"
                :class="enabled ? 'translate-x-6' : 'translate-x-1'"></span>
            </Switch>
            <span class="text-gray-600 text-sm">Active</span>
          </div>

          <!-- Error message -->
          <p v-if="error" class="text-red-500 text-xs">{{ error }}</p>

          <!-- Action Buttons -->
          <div class="flex justify-end gap-3 mt-6">
            <button type="button" class="px-5 py-2 rounded-full text-base font-normal bg-gray-100 text-gray-700 shadow-sm
             hover:bg-gray-200 focus:ring-2 focus:ring-gray-300 transition" @click="resetForm">
              Clear
            </button>
            <button type="submit" class="px-5 py-2 rounded-full text-base font-normal bg-green-500 text-white shadow-sm
             hover:bg-green-600 focus:ring-2 focus:ring-green-300 transition">
              {{ showEditModal ? 'Update Supplier' : 'Create Supplier' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <DeleteConfirm
  :show="showDeleteConfirm"
  @cancel="cancelDelete"
  @confirm="confirmDelete"
/>

</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { Switch } from '@headlessui/vue'
import axios from 'axios';
import apiURL from '@/api/config';
import { fetchTimestamp } from '@/composables/timestamp'
import socket from '@/services/socket'
import Pagination from '@/components/Pagination.vue';
import DeleteConfirm from '@/components/DeleteConfirmation.vue'


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
const items = ref([1, 10, 50, 100, 500, 1000]);
const selectedItem = ref(10);
const currentPage = ref(1);
const pageSize = ref(10);
const currentPageIsLastRecord = ref(null);
const searchText = ref("");
const searchQuery = ref('');
const limitedPerPage = ref(1);
const isOpen = ref(false);
const statusFilter = ref('all');
const showDeleteConfirm = ref(false);
const supplierToDelete = ref(null)

const emitFilter = () => {
  isFilter.value = true;
}
watch(statusFilter, (value) => {
  if (value === 'all') {
    searchText.value = '';
  }

  currentPage.value = 1;
  emitFilter();
})

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

// confirmDelete
const confirmDeleteModal = (supplier) => {
  supplierToDelete.value = supplier
  showDeleteConfirm.value = true
}

const cancelDelete = () => {
  showDeleteConfirm.value = false
  supplierToDelete.value = null
}

const confirmDelete = async () => {
  if (!supplierToDelete.value) return

  await deleteSupplier(supplierToDelete.value._id)
  showDeleteConfirm.value = false
  supplierToDelete.value = null
}



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
    socket.connect()
  }
  fetchSuppliers();
})
</script>

<style scoped>
.supplier-container {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.v-data-table {
  margin-top: 20px;
}

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

</style>

