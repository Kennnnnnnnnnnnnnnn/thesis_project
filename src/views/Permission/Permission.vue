<template>
  <div class="p-4 md:p-6 font-inter">
    <!-- Header Section -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-4 md:p-6 mb-6">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 md:gap-6">
        <!-- Title -->
        <div class="flex items-center gap-3 md:gap-4">
          <div class="p-2 md:p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 md:h-6 md:w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 11V7a4 4 0 0 0-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
          </div>
          <div>
            <h1 class="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Permission Management</h1>
            <!-- <p class="text-xs md:text-sm text-gray-600 mt-0.5 font-medium">Manage user permissions and access control</p> -->
          </div>
        </div>
        
        <!-- Controls -->
        <div class="flex flex-col sm:flex-row gap-2 md:gap-3 items-stretch sm:items-center">
          <!-- Items per page -->
          <div class="relative">
            <button @click="toggleDropdownRow"
              class="flex items-center justify-between w-full sm:min-w-[110px] px-3 md:px-4 py-2 md:py-2.5 bg-white border border-gray-200 rounded-xl text-xs md:text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all">
              <span>{{ selectedItem }} items</span>
              <i class="fas fa-chevron-down ml-2 text-xs transition-transform duration-200" :class="{ 'rotate-180': isOpen }"></i>
            </button>
            <div v-show="isOpen"
              class="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 shadow-xl rounded-xl py-2 z-50 backdrop-blur-sm">
              <div v-for="item in items" :key="item" @click="selectItem(item)"
                class="px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-sm text-gray-700 cursor-pointer hover:bg-amber-50 transition-colors font-medium">
                {{ item }} items
              </div>
            </div>
          </div>

          <!-- Search Input -->
          <div class="relative">
            <input v-model="searchQuery" type="text" placeholder="Search users..."
              class="w-full sm:w-48 md:w-64 px-3 md:px-4 py-2 md:py-2.5 pl-8 md:pl-10 border border-gray-200 rounded-xl text-xs md:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all" />
            <i class="fas fa-search absolute left-2 md:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs md:text-sm"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Table Card -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden">
      <!-- Table Header -->
      <div class="px-4 md:px-6 py-4 md:py-5 border-b border-gray-100 bg-gray-50/50">
        <h3 class="text-base md:text-lg font-bold text-gray-900 tracking-tight">User Permissions</h3>
        <p class="text-xs md:text-sm text-gray-600 mt-1 font-medium">{{ userData.length }} users total</p>
      </div>

      <!-- Table Container -->
      <div class="relative">
        <!-- Loading Overlay -->
        <div v-if="isLoading" class="absolute inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center z-10">
          <div class="flex items-center gap-3">
            <div class="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-2 border-amber-600 border-t-transparent"></div>
            <span class="text-gray-700 font-medium text-sm md:text-base">Loading...</span>
          </div>
        </div>
        
        <!-- Mobile Card View -->
        <div class="block md:hidden">
          <div class="divide-y divide-gray-100">
            <div v-for="(user, index) in userData" :key="user._id" 
              class="p-4 hover:bg-amber-50/50 transition-colors">
              <div class="flex items-start gap-3">
                <!-- User Avatar/Icon -->
                <div class="flex-shrink-0">
                  <div class="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center border border-amber-200">
                    <i class="fas fa-user text-amber-600"></i>
                  </div>
                </div>
                
                <!-- User Info -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <h3 class="text-sm font-bold text-gray-900 truncate">{{ user.name }}</h3>
                      <p class="text-xs text-gray-500 mt-0.5">{{ user.email || 'No email' }}</p>
                      <div class="flex items-center gap-2 mt-2">
                        <span class="inline-flex items-center px-2 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700">
                          {{ user.role || 'No Role' }}
                        </span>
                        <span class="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold"
                          :class="user.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
                          <i :class="user.status ? 'fas fa-circle-check' : 'fas fa-circle-xmark'" class="text-xs"></i>
                          {{ user.status ? 'Active' : 'Inactive' }}
                        </span>
                      </div>
                    </div>
                    
                    <!-- Actions -->
                    <div class="flex items-center gap-1 ml-2">
                      <button 
                        class="p-2 rounded-lg hover:bg-amber-50 text-amber-600 transition-all" 
                        @click="openPermissionModal(user)"
                        title="Manage Permissions">
                        <i class="fas fa-key text-sm"></i>
                      </button>
                    </div>
                  </div>
                  
                  <!-- Additional Info -->
                  <div class="mt-3 pt-3 border-t border-gray-100">
                    <div class="flex items-center justify-between text-xs text-gray-500">
                      <span>Phone: {{ user.phoneNumber || 'N/A' }}</span>
                      <span>{{ user.gender || 'N/A' }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Desktop Table View -->
        <div class="hidden md:block overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-100">
            <thead class="bg-gray-50/50 sticky top-0">
              <tr>
                <th class="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">#</th>
                <th class="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">User</th>
                <th class="px-4 lg:px-6 py-3 lg:py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Gender</th>
                <th class="px-4 lg:px-6 py-3 lg:py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Phone</th>
                <th class="px-4 lg:px-6 py-3 lg:py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider hidden lg:table-cell">Email</th>
                <th class="px-4 lg:px-6 py-3 lg:py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Role</th>
                <th class="px-4 lg:px-6 py-3 lg:py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                <th class="px-4 lg:px-6 py-3 lg:py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-100">
              <tr v-for="(user, index) in userData" :key="user._id"
                class="hover:bg-amber-50/50 transition-colors duration-200">
                <td class="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  {{ index + 1 }}
                </td>
                
                <!-- User Column -->
                <td class="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                  <div class="flex items-center gap-3">
                    <div class="flex-shrink-0">
                      <div class="h-10 w-10 lg:h-12 lg:w-12 rounded-xl lg:rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center border border-amber-200">
                        <i class="fas fa-user text-amber-600 text-sm"></i>
                      </div>
                    </div>
                    <div class="min-w-0">
                      <div class="text-sm font-bold text-gray-900 truncate max-w-32 lg:max-w-none">
                        {{ user.name }}
                      </div>
                      <!-- <div class="text-xs text-gray-500 font-medium mt-0.5">
                        ID: {{ user._id.slice(-6) }}
                      </div> -->
                    </div>
                  </div>
                </td>
                
                <!-- Gender Column -->
                <td class="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-center">
                  <span class="text-sm text-gray-600">{{ user.gender || '-' }}</span>
                </td>
                
                <!-- Phone Column -->
                <td class="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-center">
                  <span class="text-sm text-gray-600">{{ user.phoneNumber || '-' }}</span>
                </td>
                
                <!-- Email Column (Hidden on smaller screens) -->
                <td class="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-center hidden lg:table-cell">
                  <div class="max-w-32 text-sm text-gray-600 truncate">
                    {{ user.email || 'N/A' }}
                  </div>
                </td>
                
                <!-- Role Column -->
                <td class="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-center">
                  <span class="inline-flex items-center px-2 lg:px-3 py-1 lg:py-1.5 rounded-lg lg:rounded-xl text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                    {{ user.role || 'No Role' }}
                  </span>
                </td>
                
                <!-- Status Column -->
                <td class="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-center">
                  <span class="inline-flex items-center gap-1 lg:gap-2 px-2 lg:px-3 py-1 lg:py-1.5 rounded-lg lg:rounded-xl text-xs font-bold"
                    :class="user.status ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'">
                    <i :class="user.status ? 'fas fa-circle-check' : 'fas fa-circle-xmark'" class="text-xs"></i>
                    <span class="hidden lg:inline">{{ user.status ? 'Active' : 'Inactive' }}</span>
                  </span>
                </td>
                
                <!-- Actions Column -->
                <td class="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-center">
                  <div class="flex items-center justify-center">
                    <button 
                      class="p-2 lg:p-2.5 rounded-lg lg:rounded-xl hover:bg-amber-50 text-amber-600 transition-all duration-200 hover:scale-110 border border-transparent hover:border-amber-200" 
                      @click="openPermissionModal(user)"
                      title="Manage Permissions">
                      <i class="fas fa-key text-sm"></i>
                    </button>
                  </div>
                </td>
              </tr>
              
              <!-- Empty State -->
              <tr v-if="userData.length === 0 && !isLoading">
                <td :colspan="8" class="px-4 lg:px-6 py-12 lg:py-20 text-center">
                  <div class="flex flex-col items-center gap-4">
                    <div class="p-4 lg:p-6 rounded-xl lg:rounded-2xl bg-amber-50 border border-amber-200">
                      <i class="fas fa-users text-3xl lg:text-5xl text-amber-400"></i>
                    </div>
                    <div>
                      <h3 class="text-base lg:text-lg font-bold text-gray-900">No users found</h3>
                      <p class="text-xs lg:text-sm text-gray-600 mt-1 font-medium">Users will appear here when available</p>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      <div class="px-4 md:px-6 py-3 md:py-4 border-t border-gray-100 bg-gray-50/30">
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

    <!-- Permission Modal -->
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

const items = ref([10, 25, 50, 100]);
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
    currentPage.value -= 1;
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
    console.error('Error fetching users:', err)
    if (err.response?.status === 401) {
      error.value = 'Session expired. Please login again.'
      router.push('/login')
    } else {
      error.value = err.response?.data?.message || err.message || 'Failed to fetch users'
    }
    userData.value = []
  }
}
</script>

<style scoped>
/* Enhanced scrollbar styling */
.overflow-x-auto::-webkit-scrollbar {
  width: 4px;
  height: 4px;
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
</style>