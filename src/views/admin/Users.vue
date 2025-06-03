<template>
  <div class="p-5 font-sans bg-white rounded-md">
    <!-- Header, Create Button, Search and Filter -->
    <div
      class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5 pb-4 border-b border-yellow-200 mt-10">
      <p class="text-left font-semibold text-lg">User Management</p>
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
          <input v-model="searchQuery" type="text" placeholder="Search name..."
            class="pl-3 pr-10 py-2 border border-gray-300 rounded-md outline-none w-full transition" />
          <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <i class="fa-solid fa-magnifying-glass"></i>
          </span>
        </div>
        <!-- Role Dropdown -->
        <div class="relative w-full sm:w-40">
          <select class="pl-3 pr-8 py-2 border border-gray-300 rounded-md outline-none w-full transition">
            <option value="">All Roles</option>
            <option>
              {{ }}
            </option>
          </select>
        </div>


        <button
          class="bg-gradient-to-br from-green-400 to-green-600 text-white px-4 py-2 rounded-md text-xs font-semibold shadow hover:from-green-500 hover:to-green-700 transition min-w-[100px]"
          @click="openModal">
          + Create User
        </button>
      </div>
    </div>




    <!-- Table -->
    <div class="overflow-y-auto mt-3 relative bg-white rounded-lg shadow-sm border border-gray-100 " style="max-height: 60vh;">
      <!-- Loading Overlay -->
      <div v-if="isLoading" class="absolute inset-0 bg-opacity-70 flex items-center justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-900"></div>
      </div>


      <table class="min-w-full text-sm">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-2 font-semibold text-gray-500 text-left uppercase tracking-wide">No</th>
            <th class="px-4 py-2 font-semibold text-gray-500 text-left uppercase tracking-wide">Name</th>
            <th class="px-4 py-2 font-semibold text-gray-500 text-center uppercase tracking-wide">Gender</th>
            <th class="px-4 py-2 font-semibold text-gray-500 text-center uppercase tracking-wide">PhoneNumber</th>
            <th class="px-4 py-2 font-semibold text-gray-500 text-center uppercase tracking-wide">Email</th>
            <th class="px-4 py-2 font-semibold text-gray-500 text-center uppercase tracking-wide">Role</th>
            <th class="px-4 py-2 font-semibold text-gray-500 text-center uppercase tracking-wide">Status</th>
            <th class="px-4 py-2 font-semibold text-gray-500 text-center uppercase tracking-wide">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in userData" :key="user._id"
            class="hover:bg-yellow-50 transition-colors duration-100 border-b border-gray-100 last:border-none">
            <td class="px-4 py-2 text-gray-800">{{ index + 1 }}</td>
            <td class="px-4 py-2 text-center align-middle">
              <div class="flex items-center gap-2 w-full">
                <img :src="user.profilePicture || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name)"
                  class="w-8 h-8 rounded-full border border-yellow-200 object-cover" :alt="user.name" />
                <span class="text-gray-800 whitespace-nowrap">{{ user.name }}</span>
              </div>
            </td>
            <td class="px-4 py-2 text-center text-gray-600 capitalize">{{ user.gender }}</td>
            <td class="px-4 py-2 text-center text-gray-600">{{ user.phoneNumber }}</td>
            <td class="px-4 py-2 text-center text-gray-600">{{ user.email || 'N/A' }}</td>
            <td class="px-4 py-2 text-center">
              <span class="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                {{ user.role }}
              </span>
            </td>
            <td class="px-4 py-2 text-center">
              <span class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold"
                :class="user.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
                <i :class="user.status ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-xmark'"></i>
                {{ user.status ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td class="px-4 py-2 flex justify-center gap-2">
              <button class="p-1 rounded hover:bg-blue-100 transition" @click="editUser(user)">
                <i class="fa-solid fa-pen-to-square text-blue-600"></i>
              </button>
              <button class="p-1 rounded hover:bg-red-100 transition" @click="deleteUser(user._id)">
                <i class="fa-solid fa-trash text-red-600"></i>
              </button>
            </td>
          </tr>
          <tr v-if="userData.length === 0 && !isLoading">
            <td colspan="6" class="px-4 py-8 text-center text-gray-400 italic">
              No users found
            </td>
          </tr>
        </tbody>
      </table>

    </div>
    <Pagination :currentPage="currentPage" @onEmitDataFromPagination="handleListenToPagination"
      @onEmitIsLoading="handleListenIsLoading" @onEmitCurrentPageIsLastRecord="handleListenIsLastRecordOnPage"
      :limitedPerPage="pageSize" :searchQuery="searchText" />

    <!-- Create User Modal (unchanged) -->
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]">
      <div class="font-sans w-full max-w-lg sm:w-[95%] sm:max-w-lg bg-white rounded-lg shadow-md p-4 sm:p-8 relative">
        <!-- Close Button -->
        <i class="fa-solid fa-circle-xmark cursor-pointer text-red-700 text-lg absolute top-4 right-4
          hover:text-red-500 transform hover:scale-110 transition-all duration-300 ease-in-out"
          @click="closeModal"></i>
        <h2 class="text-lg font-semibold mb-5 text-gray-700 text-center mt-[-12px]"> {{ showEditModal ? 'Update User' :
          'Create New User' }}</h2>
        <form @submit.prevent="handleSubmit" class="space-y-4 flex flex-col">
          <!-- Full Name -->
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">
              Full Name <span class="text-red-500">*</span>
            </label>
            <input v-model="name" type="text" required
              class="border border-gray-300 focus:border-yellow-500 focus:ring-yellow-100 rounded-md px-3 py-2 w-full outline-none transition"
              placeholder="Enter full name" />
          </div>
          <!-- Email -->
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">
              Email
            </label>
            <input v-model="email" type="email"
              class="border border-gray-300 focus:border-yellow-500 focus:ring-yellow-100 rounded-md px-3 py-2 w-full outline-none transition"
              placeholder="Enter email address" />
          </div>

          <!-- Phone Number -->
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">
              Phone Number<span class="text-red-500">*</span>
            </label>
            <input v-model="phoneNumber" type="text" required
              class="border border-gray-300 focus:border-yellow-500 focus:ring-yellow-100 rounded-md px-3 py-2 w-full outline-none transition"
              placeholder="Enter your number" />
          </div>
          <!-- Gender -->
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">
              Gender
            </label>
            <select v-model="gender"
              class="border border-gray-300 focus:border-yellow-500 focus:ring-yellow-100 rounded-md px-3 py-2 w-full outline-none transition">
              <option value="" class="text-gray-600" disabled>Select Gender</option>
              <option v-for="option in genderOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>
          <!-- Role -->
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">
              Role <span class="text-red-500">*</span>
            </label>
            <select v-model="role" required
              class="border border-gray-300 focus:border-yellow-500 focus:ring-yellow-100 rounded-md px-3 py-2 w-full outline-none transition">
              <option value="" disabled>Select role</option>
              <option v-for="r in roles" :key="r" :value="r">{{ r }}</option>
            </select>
          </div>
          <!-- Password -->
          <div class="relative">
            <label class="block text-xs font-medium text-gray-600 mb-1">
              Password
            </label>
            <input :type="showPassword ? 'text' : 'password'" v-model="password" minlength="6"
              class="border border-gray-300 focus:border-yellow-500 focus:ring-yellow-100 rounded-md px-3 py-2 w-full outline-none transition pr-10"
              placeholder="Set a password (min 6 chars)" />
            <span
              class="absolute right-3 top-9 transform -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-700"
              @click="showPassword = !showPassword">
              <i :class="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
            </span>
          </div>

          <!-- Profile Image Upload -->
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">
              Profile Image
            </label>
            <div class="flex items-center gap-3">
              <input type="file" accept="image/*" class="block text-sm" @change="onFileChange" />
              <img v-if="profilePicture" :src="profilePicture"
                class="w-10 h-10 rounded-full border border-yellow-200 object-cover" alt="Preview" />
            </div>
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
          <p v-if="error" class="text-red-500 text-xs">{{ error }}</p>
          <!-- Action Buttons -->
          <div class="flex justify-end gap-3 mt-6">
            <button type="button" class="px-5 py-2 rounded-full text-base font-normal bg-gray-100 text-gray-700 shadow-sm
             hover:bg-gray-200 focus:ring-2 focus:ring-gray-300 transition" @click="resetForm">
              Clear
            </button>
            <button type="submit" class="px-5 py-2 rounded-full text-base font-normal bg-green-500 text-white shadow-sm
             hover:bg-green-600 focus:ring-2 focus:ring-green-300 transition">
              {{ showEditModal ? 'Update User' : 'Create User' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import axios from 'axios';
import apiURL from '@/api/config';
import { fetchTimestamp } from '@/composables/timestamp'
import socket from '@/services/socket'
import Pagination from '@/components/Pagination.vue';
import { Switch } from '@headlessui/vue';
import { useRouter } from 'vue-router';
import DeleteConfirmation from '@/components/DeleteConfirmation.vue';
import getStatusClass from '@/components/GetStatus.vue';


const showModal = ref(false);
const showEditModal = ref(false);
const isLoading = ref(false);
const isSubmitting = ref(false);
const error = ref('');
const userData = ref([]);
const id = ref('');
const name = ref('');
const email = ref('');
const password = ref('');
const role = ref('');
const status = ref(true);
const enabled = ref(true);
const profilePicture = ref('');
const items = ref([1, 10, 50, 100, 500, 1000]);
const selectedItem = ref(10);
const currentPage = ref(1);
const pageSize = ref(10);
const currentPageIsLastRecord = ref(null);
const searchText = ref("");
const searchQuery = ref('');
const limitedPerPage = ref(1);
const isOpen = ref(false);
const roles = ref(['superadmin', 'admin', 'delivery', 'customer']);
const gender = ref('');
const genderOptions = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
  { value: 'other', label: 'Other' }
];
const phoneNumber = ref('')
const showPassword = ref(false);



const handleListenToPagination = async (items) => {
  userData.value = items || [];
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
  showModal.value = false;
  showEditModal.value = false;
  resetForm();
};

const resetForm = () => {
  id.value = '';
  name.value = '';
  email.value = null;
  password.value = '';
  role.value = '';
  status.value = true;
  enabled.value = true;
  profilePicture.value = '';
  gender.value = 'other';
  error.value = '';
  phoneNumber.value = '';
  showModal.value = false
  showEditModal.value = false
};

const handleSubmit = async () => {
  if (!name.value || !role.value || !phoneNumber.value || (!showEditModal.value && !password.value)) {
    error.value = 'All fields are required';
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
        email: email.value || null,
        role: role.value,
        gender: gender.value || 'other',
        phoneNumber: phoneNumber.value,
        status: status.value,
        profilePicture: profilePicture.value,
      }
    };

    if (!showEditModal.value) {
      // Create new user - password is required
      if (!password.value) {
        error.value = 'Password is required for new users';
        isSubmitting.value = false;
        isLoading.value = false;
        return;
      }
      requestBody.fields.password = password.value;
      requestBody.fields.createdAt = timestamp;
      requestBody.fields.createdBy = userId;

      const response = await axios.post(
        `${apiURL}/api/insertDoc/User`,
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
          collection: 'User',
          data: response.data.data._id
        });
        // Close modal immediately after successful creation
        resetForm();
        closeModal();
      } else {
        throw new Error(response.data.message || 'Failed to create user');
      }
    } else {
      // Update existing user
      if (!id.value) {
        error.value = 'Error: Missing user ID for update operation';
        isSubmitting.value = false;
        isLoading.value = false;
        return;
      }

      // Only include password in update if it's provided
      if (password.value) {
        requestBody.fields.password = password.value;
      }

      requestBody.fields.updatedAt = timestamp;
      requestBody.fields.updatedBy = userId;

      const response = await axios.patch(
        `${apiURL}/api/updateDoc/User/${id.value}`,
        requestBody,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success || response.data.message === 'User updated') {
        socket.emit('dataUpdate', {
          action: 'update',
          collection: 'User',
          data: response.data.data ? response.data.data._id : id.value
        });
        closeModal();
      } else {
        throw new Error(response.data.message || 'Failed to update user');
      }
    }
  } catch (err) {
    console.error('Error saving user:', err);
    error.value = err.response?.data?.message || err.message || 'Failed to save user';
  } finally {
    isSubmitting.value = false;
    isLoading.value = false;
  }
}

const editUser = (user) => {
  id.value = user._id;
  name.value = user.name;
  email.value = user.email || null;
  role.value = user.role;
  status.value = user.status;
  enabled.value = user.status;
  password.value = '';
  profilePicture.value = user.profilePicture || '';
  gender.value = user.gender || 'other';
  showModal.value = true;
  showEditModal.value = true;
  phoneNumber.value = user.phoneNumber;
};

const deleteUser = async (userId) => {
  try {
    isLoading.value = true;
    const token = localStorage.getItem('token');
    if (!token) {
      error.value = 'Authentication required. Please login again.';
      return;
    }
    const response = await axios.delete(
      `${apiURL}/api/deleteDoc/User/${userId}`,
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
        collection: 'User',
        data: response.data.data._id
      });
    } else {
      throw new Error(response.data.message || 'Failed to delete category');
    }


  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'Failed to delete user';
  } finally {
    isLoading.value = false;
  }
};

const fetchUsers = async () => {
  try {
    isLoading.value = true;
    const token = localStorage.getItem('token');
    if (!token) {
      error.value = 'Authentication required. Please login again.';
      return;
    }
    const response = await axios.get(`${apiURL}/api/getAllDocs/User`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    userData.value = response.data.data || [];
    error.value = '';
  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'Failed to fetch users';
    userData.value = [];
  } finally {
    isLoading.value = false;
  }
};

const onFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      profilePicture.value = event.target.result;
    };
    reader.readAsDataURL(file);
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


watch(showModal, (val) => {
  console.log('showModal changed:', val);
});

onMounted(() => {
  if (socket && socket.disconnected) {
    socket.connect()
  }
})


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




</style>

