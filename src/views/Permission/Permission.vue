<template>
  <div class="p-5 font-sans bg-white rounded-md mt-10">
    <!-- Header -->
    <p class="text-left font-semibold text-lg">Permission User</p>

    <!-- Controls: Dropdown + Search -->
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
        <input v-model="searchQuery" type="text" placeholder="Search..."
          class="pl-3 pr-10 py-2 border border-gray-300 rounded-md outline-none w-full transition" />
        <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <i class="fa-solid fa-magnifying-glass"></i>
        </span>
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
            <th class="px-4 py-2 font-semibold text-gray-500 text-center uppercase tracking-wide">Username</th>
            <th class="px-4 py-2 font-semibold text-gray-500 text-center uppercase tracking-wide">Gender</th>
            <th class="px-4 py-2 font-semibold text-gray-500 text-center uppercase tracking-wide">Phone</th>
            <th class="px-4 py-2 font-semibold text-gray-500 text-center uppercase tracking-wide">Email</th>
            <th class="px-4 py-2 font-semibold text-gray-500 text-center uppercase tracking-wide">Role</th>
            <th class="px-4 py-2 font-semibold text-gray-500 text-center uppercase tracking-wide">Status</th>
            <th class="px-4 py-2 font-semibold text-gray-500 text-center uppercase tracking-wide">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in userData" :key="user._id"
            class="hover:bg-blue-50 transition-colors duration-100 border-b border-gray-100 last:border-none">
            <td class="px-4 py-2 text-gray-800">{{ index + 1 }}</td>
            <td class="px-4 py-2 text-center text-gray-700">{{ user.name }}</td>
            <td class="px-4 py-2 text-center text-gray-600">{{ user.gender }}</td>
            <td class="px-4 py-2 text-center text-gray-600">{{ user.phoneNumber }}</td>
            <td class="px-4 py-2 text-center text-gray-600">{{ user.email || 'N/A' }}</td>
            <td class="px-4 py-2 text-center text-gray-600">{{ user.role || 'No Role' }}</td>
            <td class="px-4 py-2 text-center">
              <i v-if="user.status" class="fa-regular fa-circle-check text-green-600"></i>
              <i v-else class="fa-regular fa-circle-xmark text-red-600"></i>
            </td>
            <td class="px-4 py-2 flex justify-center">
              <button class="p-1 rounded hover:bg-orange-100 transition" @click="openPermissionModal(user)"
                title="Permission">
                <i class="fa-solid fa-key text-orange-500 animate-bounce"></i>
              </button>
            </td>
          </tr>
          <tr v-if="userData.length === 0 && !isLoading">
            <td colspan="8" class="px-4 py-8 text-center text-gray-400 italic">
              No users found
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination Component -->
    <Pagination :currentPage="currentPage" @onEmitDataFromPagination="handleListenToPagination"
      @onEmitIsLoading="handleListenIsLoading" @onEmitCurrentPageIsLastRecord="handleListenIsLastRecordOnPage"
      :limitedPerPage="pageSize" :searchQuery="searchText" />
    <PermissionUser v-if="show" @close="show = false" :selectedUser="selectedUser" />
  </div>
</template>


<script setup>
import { ref, watch, onMounted } from 'vue';
import axios from 'axios';
import apiURL from '@/api/config';
import Pagination from '@/components/Pagination.vue';
import PermissionUser from '@/components/PermissionUser.vue';
import { useStore } from '@/store/useStore';

const store = useStore();


const items = ref([1, 10, 50, 100, 500, 1000]);
const selectedItem = ref(10);
const isLoading = ref(false)
const currentPage = ref(1);
const pageSize = ref(10);
const currentPageIsLastRecord = ref(null);
const limitedPerPage = ref(1);
const searchText = ref("");
const searchQuery = ref('');
const error = ref('')
const userData = ref([]);
const show = ref(false);
const selectedUser = ref(null);
const isOpen = ref(false);



watch(searchQuery, (newValue) => {
  searchText.value = newValue;
  currentPage.value = 1;
}, { immediate: true });



const toggleDropdownRow = () => {
  isOpen.value = !isOpen.value;
};



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
    fetchUserData()
  }
};


const selectItem = (item) => {
  selectedItem.value = item;
  pageSize.value = item;
  limitedPerPage.value = item;
  currentPage.value = 1;
  isOpen.value = false;
};



const openPermissionModal = (user) => {
  selectedUser.value = user;
  show.value = true;
};



const fetchUserData = async () => {
  try {
    const token = localStorage.getItem('token')
    const userId = localStorage.getItem('userId')

    if (!token || !userId) {
      error.value = 'Authentication required. Please login again.'
      return
    }

    const response = await axios.get(`${apiURL}/api/getAllDocs/User`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (response.data && response.data.data) {
      userData.value = response.data.data
    } else {
      userData.value = response.data
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
    userData.value = []
  }
}

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

