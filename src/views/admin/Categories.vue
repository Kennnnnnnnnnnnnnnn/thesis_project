<template>
  <div class="p-5 font-sans bg-white rounded-md h-[100vh] overflow-y-auto mt-10">
    <p class="text-left font-semibold text-lg">Category Management</p>

    <div class="flex flex-col md:flex-row md:items-center md:space-x-4 mt-4 w-full ">
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
        <input v-model="searchQuery" type="text" placeholder="Search Category...."
          class="pl-3 pr-10 py-2 border border-gray-300 rounded-md outline-none w-full transition" />
        <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <i class="fa-solid fa-magnifying-glass"></i>
        </span>
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
    <div class="overflow-y-auto mt-5 relative bg-white rounded-lg shadow-sm border border-gray-100"  style="max-height: 60vh;">
      <!-- Loading Overlay -->
      <div v-if="isLoading" class="absolute inset-0 bg-opacity-70 flex items-center justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-900"></div>
      </div>

      <table class="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-2 font-semibold text-gray-500 text-left uppercase tracking-wide border-b border-gray-200">ID</th>
            <th class="px-4 py-2 font-semibold text-gray-500 text-center uppercase tracking-wide border-b border-gray-200">Name</th>
            <th class="px-4 py-2 font-semibold text-gray-500 text-center uppercase tracking-wide border-b border-gray-200">CreatedAt</th>
            <th class="px-4 py-2 font-semibold text-gray-500 text-center uppercase tracking-wide border-b border-gray-200">Description</th>
            <th class="px-4 py-2 font-semibold text-gray-500 text-center uppercase tracking-wide border-b border-gray-200">Status</th>
            <th class="px-4 py-2 font-semibold text-gray-500 text-center uppercase tracking-wide border-b border-gray-200">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in categoryData" :key="index"
            class="hover:bg-yellow-50 transition-colors duration-100 border-b border-gray-100 last:border-none">
            <td class="px-4 py-2 text-gray-800">{{ index + 1 }}</td>
            <td class="px-4 py-2 text-center text-gray-700">{{ item.name }}</td>
            <td class="px-4 py-2 text-center text-gray-600">{{ formatDate(item.createdAt) }}</td>
            <td class="px-4 py-2 text-center text-gray-600">{{ item.description }}</td>
            <td class="px-4 py-2 text-center">
              <i :class="getStatusClass(item.status)"></i>
            </td>
            <td class="px-4 py-2 flex justify-center gap-2">
              <button class="p-1 rounded hover:bg-orange-100 transition" @click="editCategory(item)" aria-label="Edit">
                <i class="fa-solid fa-pen-to-square text-orange-600 hover:text-orange-700"></i>
              </button>
              <button class="p-1 rounded hover:bg-red-100 transition" @click="deleteCategory(item._id)"
                aria-label="Delete">
                <i class="fa-solid fa-trash text-red-600 hover:text-red-700"></i>
              </button>
            </td>
          </tr>
          <tr v-if="categoryData.length === 0">
            <td colspan="6" class="px-4 py-8 text-center text-gray-400 italic">
              No Data Found!
            </td>
          </tr>
        </tbody>
      </table>
    </div>


    <!-- Pagination Component -->
    <Pagination :currentPage="currentPage" @onEmitDataFromPagination="handleListenToPagination"
      @onEmitIsLoading="handleListenIsLoading" @onEmitCurrentPageIsLastRecord="handleListenIsLastRecordOnPage"
      :limitedPerPage="pageSize" :searchQuery="searchText" />

    <!-- Create/Edit Category Modal -->
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]">
      <div class="font-khmer w-[40%] mt-20 p-6 bg-white shadow-md rounded-lg relative z-50 m-auto">
        <!-- Close Button -->
        <i class="fa-solid fa-circle-xmark cursor-pointer text-red-700 text-lg absolute top-3 right-3 
          hover:text-red-500 transform hover:scale-105 transition-all duration-300 ease-in-out"
          @click="closeModal"></i>

        <h2 class="text-lg font-semibold mb-4 text-gray-700 text-center mt-[-15px]">
          {{ showEditModal ? 'Update Category' : 'Create New Category' }}
        </h2>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Category Name -->
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">
              Name <span class="text-red-500">*</span>
            </label>
            <input v-model="name" type="text" required
              class="border border-gray-300 focus:border-green-500 focus:ring-green-100 rounded-md px-3 py-2 w-full outline-none transition"
              placeholder="Enter category name" />
            <!-- Error Message -->
            <p v-if="error" class="text-red-500 text-xs mt-1">{{ error }}</p>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Description</label>
            <textarea v-model="description" rows="2"
              class="border border-gray-300 focus:border-green-500 focus:ring-green-100 rounded-md px-3 py-2 w-full outline-none transition"
              placeholder="Enter description (optional)"></textarea>
          </div>

          <!-- Status Toggle -->
          <div class="flex items-center  gap-3">

            <Switch v-model="enabled" class="relative inline-flex h-6 w-11 items-center rounded-full transition"
              :class="enabled ? 'bg-green-500' : 'bg-gray-300'">
              <span class="sr-only">Enable status</span>
              <span class="inline-block h-4 w-4 transform bg-white rounded-full transition"
                :class="enabled ? 'translate-x-6' : 'translate-x-1'"></span>
            </Switch>
            <span class="text-gray-600 text-sm">Status</span>
          </div>

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

    <!-- Confirmation Delete Dialog -->
    <DeleteConfirmation :show="showConfirmDialog" @cancel="handleCancelConfirmation"
      @confirm="handleDeleteConfirmation" />

    <!-- Success and Error Messages - Make sure these are correctly bound and displayed -->
    <!-- <SuccessMessage v-if="showSuccessMessage" :message="successMessage" :visible="showSuccessMessage" /> -->
    <!-- <ErrorMessage v-if="showErrorMessage" :message="errorMessage" :visible="showErrorMessage" /> -->
  </div>
</template>

<script setup>
import apiURL from '@/api/config';
import DeleteConfirmation from '@/components/DeleteConfirmation.vue';
import getStatusClass from '@/components/GetStatus.vue';
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
const isLoading = ref(false)
const currentPage = ref(1);
const pageSize = ref(10);
const currentPageIsLastRecord = ref(null);
const searchText = ref("");
const searchQuery = ref('');
const limitedPerPage = ref(1);
const categoryData = ref([])
const error = ref('')
const isSubmitting = ref(false)
const enabled = ref(true)
const showModal = ref(false)
const showEditModal = ref(false)
const isOpen = ref(false);
const isExistingCategory = ref(false)

// State for delete confirmation
const showConfirmDialog = ref(false);
const pendingCategoryId = ref(null);

const id = ref('')
const name = ref('')
const description = ref('')
const status = ref(true)

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

// Get status class function
/*
const getStatusClass = (status) => {
  return status
    ? 'fas fa-check-circle text-green-500'
    : 'fas fa-times-circle text-red-500';
};
*/

const handleListenToPagination = async (items) => {
  categoryData.value = items || [];
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
  resetForm()
  showModal.value = true
  showEditModal.value = false
}
const closeModal = () => {
  console.log('closeModal called, setting showModal and showEditModal to false')
  // Ensure modal gets closed immediately
  showModal.value = false
  showEditModal.value = false
  console.log('After setting modal states to false')
  resetForm()
}



const handleSubmit = async () => {
  if (!name.value) {
    error.value = 'Category name is required'
    return
  }

  // Check if category name already exists
  const existingCategory = categoryData.value.find(cat => cat.name.toLowerCase() === name.value.toLowerCase());

  if (existingCategory) {
    if (!showEditModal.value || (showEditModal.value && existingCategory._id !== id.value)) {
      error.value = 'Category name already exists.';
      return; // Prevent submission
    }
  }

  isSubmitting.value = true
  error.value = null

  try {
    isLoading.value = true
    isExistingCategory.value = false
    const timestamp = await fetchTimestamp()
    const token = localStorage.getItem('token')
    const userId = localStorage.getItem('userId')

    if (!token || !userId) {
      error.value = 'Authentication required. Please login again.'
      return
    }

    const requestBody = {
      fields: {
        name: name.value,
        description: description.value,
        status: status.value,
        createdBy: userId,
        createdAt: timestamp,
        updatedAt: timestamp
      }
    }

    if (!showEditModal.value) {
      // Create new category
      const response = await axios.post(
        `${apiURL}/api/insertDoc/Category`,
        requestBody,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      if (response.data.success) {
        socket.emit('dataUpdate', {
          action: 'insert',
          collection: 'Category',
          data: response.data.data._id
        })

        resetForm();
        closeModal();
      } else {
        throw new Error(response.data.message || 'Failed to create category')
      }
    } else {
      // Update existing category
      if (!id.value) {
        error.value = 'Error: Missing category ID for update operation'
        return
      }

      requestBody.fields.updatedBy = userId
      requestBody.fields.updatedAt = timestamp

      const response = await axios.patch(
        `${apiURL}/api/updateDoc/Category/${id.value}`,
        requestBody,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )
      

      if (response.data.success || response.data.message === 'Category updated') {
        socket.emit('dataUpdate', {
          action: 'update',
          collection: 'Category',
          data: response.data.data ? response.data.data._id : id.value
        })
        isSubmitting.value = false
        closeModal()
      } else {
        console.log('Update success condition NOT met')
      }
    }
  } catch (err) {
    console.error('Error saving category:', err)
  } finally {
    isSubmitting.value = false
    isLoading.value = false;
  }
}

const editCategory = (category) => {
  id.value = category._id
  name.value = category.name
  description.value = category.description
  status.value = category.status
  enabled.value = category.status
  showModal.value = true
  showEditModal.value = true
}

const deleteCategory = (categoryId) => {
  pendingCategoryId.value = categoryId;
  showConfirmDialog.value = true;
};

const handleDeleteConfirmation = async () => {
  showConfirmDialog.value = false;
  if (!pendingCategoryId.value) return;

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
      `${apiURL}/api/deleteDoc/Category/${pendingCategoryId.value}`,
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
        collection: 'Category',
        data: pendingCategoryId.value
      });
    } else {
      throw new Error(response.data.message || 'Failed to delete category');
    }
  } catch (err) {
    console.error('Error deleting category:', err);
  } finally {
    isLoading.value = false;
    pendingCategoryId.value = null;
  }
};

const handleCancelConfirmation = () => {
  showConfirmDialog.value = false;
  pendingCategoryId.value = null;
};

watch(enabled, (newValue) => {
  status.value = newValue
})


const resetForm = () => {
  console.log('resetForm called')
  id.value = ''
  name.value = ''
  description.value = ''
  status.value = true
  enabled.value = true
  error.value = null
  showModal.value = false
  showEditModal.value = false
}

// Add this function to handle pagination data fetching
const fetchCategories = async () => {
  try {
    const token = localStorage.getItem('token')
    const userId = localStorage.getItem('userId')

    if (!token || !userId) {
      error.value = 'Authentication required. Please login again.'
      return
    }

    const response = await axios.get(`${apiURL}/api/getAllDocs/Category`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (response.data && response.data.data) {
      categoryData.value = response.data.data
    } else {
      categoryData.value = response.data
    }

    error.value = ''
  } catch (err) {
    console.error('Error fetching categories:', err)
    if (err.response?.status === 401) {
      error.value = 'Session expired. Please login again.'
      router.push('/login')
    } else {
      error.value = err.response?.data?.message || err.message || 'Failed to fetch categories'
    }
    categoryData.value = []
  }
}

// Call fetchCategories on component mount
onMounted(() => {
  if (socket && socket.disconnected) {
    socket.connect()

  }

})

watch(selectedItem, (newValue) => {
  pageSize.value = newValue;
  limitedPerPage.value = newValue;
  currentPage.value = 1;
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
