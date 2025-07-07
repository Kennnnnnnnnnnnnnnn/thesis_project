<template>
  <div class="p-4 md:p-6 font-khmer">
    <!-- Header Section -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-4 md:p-6 mb-6">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 md:gap-6">
        <!-- Title -->
        <div class="flex items-center gap-3 md:gap-4">
          <div class="p-2 md:p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 md:h-6 md:w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="m22 21-3-3m0 0a5.5 5.5 0 1 0-7.78 0L22 21Z"></path>
            </svg>
          </div>
          <div>
            <h1 class="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
              {{ $t('user.headerTitle') }}
            </h1>
          </div>
        </div>
        
        <!-- Controls -->
        <div class="flex flex-col sm:flex-row gap-2 md:gap-3 items-stretch sm:items-center">
          <!-- Items per page -->
          <div class="relative">
            <button @click="toggleDropdownRow"
              class="flex items-center justify-between w-full sm:min-w-[110px] px-3 md:px-4 py-2 md:py-2.5 bg-white border border-gray-200 rounded-xl text-xs md:text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all">
                <span>{{ selectedItem }} {{ $t('user.items') }}</span>
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
            <input v-model="searchQuery" type="text" :placeholder="$t('user.searchPlaceholder')"
              class="w-full sm:w-48 md:w-64 px-3 md:px-4 py-2 md:py-2.5 pl-8 md:pl-10 border border-gray-200 rounded-xl text-xs md:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all" />
            <i class="fas fa-search absolute left-2 md:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs md:text-sm"></i>
          </div>

          <!-- Role Filter -->
          <div class="relative">
            <select class="w-full sm:w-40 px-3 md:px-4 py-2 md:py-2.5 border border-gray-200 rounded-xl text-xs md:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all bg-white">
              <option value="">{{ $t('user.allRoles') }}</option>
              <option v-for="role in roles" :key="role" :value="role">{{ role }}</option>
            </select>
          </div>

          <!-- Create Button -->
          <button @click="openModal"
            class="flex items-center gap-2 px-4 md:px-6 py-2 md:py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl text-xs md:text-sm font-semibold shadow-lg hover:from-amber-600 hover:to-orange-700 transition-all duration-200 hover:scale-105 min-w-[120px]">
            <i class="fas fa-plus text-xs"></i>
            <span>{{ $t('user.createUser') }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Main Table Card -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden">
      <!-- Table Header -->
      <div class="px-4 md:px-6 py-4 md:py-5 border-b border-gray-100 bg-gray-50/50">
        <h3 class="text-base md:text-lg font-bold text-gray-900 tracking-tight">
          {{ $t('user.directory') }}
        </h3>
        <p class="text-xs md:text-sm text-gray-600 mt-1 font-medium">
          {{ userData.length }} {{ $t('user.usersTotal') }}
        </p>
      </div>

      <!-- Table Container -->
      <div class="relative">
        <!-- Loading Overlay -->
      <div v-if="isLoading" class="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-50">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-900"></div>
      </div>

        <!-- Mobile Card View -->
        <div class="block md:hidden">
          <div class="divide-y divide-gray-100">
            <div v-for="(user, index) in userData" :key="user._id" class="p-4 hover:bg-amber-50/50 transition-colors">
              <div class="flex items-start gap-3">
                <!-- User Avatar -->
                <div class="flex-shrink-0">
                  <div class="h-12 w-12 rounded-xl overflow-hidden border border-amber-200">
                    <img :src="user.profilePicture || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name)"
                      :alt="user.name" class="h-full w-full object-cover" />
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
                          {{ user.role }}
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
                      <button class="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-all"
                        @click="editUser(user)" title="Edit User">
                        <i class="fas fa-edit text-sm"></i>
                      </button>
                      <button class="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-all"
                        @click="deleteUser(user._id)" title="Delete User">
                        <i class="fas fa-trash text-sm"></i>
                      </button>
                    </div>
                  </div>
                  
                  <!-- Additional Info -->
                  <div class="mt-3 pt-3 border-t border-gray-100">
                    <div class="flex items-center justify-between text-xs text-gray-500">
                      <span>{{ $t('user.columns.phone') }}: {{ user.phoneNumber || $t('common.notAvailable') }}</span>
                      <span class="capitalize">{{ user.gender || 'N/A' }}</span>
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
                <th class="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">{{ $t('user.columns.index') }}</th>
                <th class="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">{{ $t('user.columns.user') }}</th>
                <th class="px-4 lg:px-6 py-3 lg:py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">{{ $t('user.columns.gender') }}</th>
                <th class="px-4 lg:px-6 py-3 lg:py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">{{ $t('user.columns.phone') }}</th>
                <th class="px-4 lg:px-6 py-3 lg:py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider hidden lg:table-cell">{{ $t('user.columns.email') }}</th>
                <th class="px-4 lg:px-6 py-3 lg:py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">{{ $t('user.columns.role') }}</th>
                <th class="px-4 lg:px-6 py-3 lg:py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">{{ $t('user.columns.status') }}</th>
                <th class="px-4 lg:px-6 py-3 lg:py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">{{ $t('user.columns.actions') }}</th>
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
                      <div class="h-10 w-10 lg:h-12 lg:w-12 rounded-xl lg:rounded-2xl overflow-hidden border border-amber-200">
                        <img :src="user.profilePicture || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name)"
                          :alt="user.name" class="h-full w-full object-cover" />
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
                  <span class="text-sm text-gray-600 capitalize">{{ user.gender || '-' }}</span>
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
                    {{ user.role }}
                  </span>
                </td>
                
                <!-- Status Column -->
                <td class="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-center">
                  <span class="inline-flex items-center gap-1 lg:gap-2 px-2 lg:px-3 py-1 lg:py-1.5 rounded-lg lg:rounded-xl text-xs font-bold"
                    :class="user.status ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'">
                    <i :class="user.status ? 'fas fa-circle-check' : 'fas fa-circle-xmark'" class="text-xs"></i>
                    <span class="hidden lg:inline">{{ user.status ? $t('common.active') : $t('common.inactive') }}</span>
                  </span>
                </td>
                
                <!-- Actions Column -->
                <td class="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-center">
                  <div class="flex items-center justify-center gap-2">
                    <button class="p-2 lg:p-2.5 rounded-lg lg:rounded-xl hover:bg-blue-50 text-blue-600 transition-all duration-200 hover:scale-110 border border-transparent hover:border-blue-200"
                      @click="editUser(user)" title="Edit User">
                      <i class="fas fa-edit text-sm"></i>
                    </button>
                    <button class="p-2 lg:p-2.5 rounded-lg lg:rounded-xl hover:bg-red-50 text-red-600 transition-all duration-200 hover:scale-110 border border-transparent hover:border-red-200"
                      @click="deleteUser(user._id)" title="Delete User">
                      <i class="fas fa-trash text-sm"></i>
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
                      <h3 class="text-base lg:text-lg font-bold text-gray-900">{{ $t('user.noUsersFound') }}</h3>
                      <p class="text-xs lg:text-sm text-gray-600 mt-1 font-medium">{{ $t('user.noUsersDescription') }}</p>
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

    <!-- Create/Edit User Modal -->
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[1000]">
      <div class="font-inter w-full max-w-lg sm:w-[95%] sm:max-w-lg bg-white rounded-2xl shadow-xl p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
        <!-- Close Button -->
        <button @click="closeModal" class="absolute top-4 right-4 p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all">
          <i class="fas fa-times text-lg"></i>
        </button>
        
        <div class="text-center mb-6">
          <div class="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white mb-4">
            <i class="fas fa-user text-lg"></i>
          </div>
          <h2 class="text-xl font-bold text-gray-900">{{ showEditModal ? 'Update User' : 'Create New User' }}</h2>
          <p class="text-sm text-gray-600 mt-1">{{ showEditModal ? 'Modify user information' : 'Add a new user to the system' }}</p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Full Name -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              {{ $t('user.fullName') }} <span class="text-red-500">*</span>
            </label>
            <input v-model="name" type="text" required
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all"
              placeholder="Enter full name" />
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              {{ $t('user.email') }}
            </label>
            <input v-model="email" type="email"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all"
              placeholder="Enter email address" />
          </div>

          <!-- Phone Number -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              {{ $t('user.phoneNumber') }} <span class="text-red-500">*</span>
            </label>
            <input v-model="phoneNumber" type="text" required
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all"
              placeholder="Enter phone number" />
          </div>

          <!-- Gender -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              {{ $t('user.gender') }}
            </label>
            <select v-model="gender"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all">
              <option value="" disabled>{{ $t('user.selectGender') }}</option>
              <option v-for="option in genderOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>

          <!-- Role -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              {{ $t('user.role') }} <span class="text-red-500">*</span>
            </label>
            <select v-model="role" required
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all">
              <option value="" disabled>{{ $t('user.selectRole') }}</option>
              <option v-for="r in roles" :key="r.value" :value="r.value">{{ r.label }}</option>
            </select>
          </div>


          <!-- Password -->
          <div class="relative">
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              {{ $t('user.password') }} {{ !showEditModal ? '*' : '' }}
            </label>
            <div class="relative">
              <input :type="showPassword ? 'text' : 'password'" v-model="password" 
                :required="!showEditModal" minlength="6"
                class="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all"
                :placeholder="showEditModal ? $t('user.keepCurrentPassword') : $t('user.setPasswordPlaceholder')" />
              <button type="button" @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
          </div>


          <!-- Profile Image Upload -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              {{ $t('user.profileImage') }}
            </label>
            <div class="flex items-center gap-4">
              <input type="file" accept="image/*" @change="onFileChange"
                class="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all text-sm" />
              <div v-if="profilePicture" class="w-12 h-12 rounded-xl overflow-hidden border border-amber-200">
                <img :src="profilePicture" alt="Preview" class="w-full h-full object-cover" />
              </div>
            </div>
          </div>


          <!-- Status Toggle -->
          <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <label class="text-sm font-semibold text-gray-700">
                {{ $t('user.statusLabel') }}
              </label>
              <p class="text-xs text-gray-500 mt-1">
                {{ $t('user.statusDescription') }}
              </p>
            </div>
            <Switch v-model="enabled" 
              class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
              :class="enabled ? 'bg-green-500' : 'bg-gray-300'">
              <span class="sr-only">{{ $t('user.statusToggleAria') }}</span>
              <span class="inline-block h-4 w-4 transform bg-white rounded-full transition-transform"
                :class="enabled ? 'translate-x-6' : 'translate-x-1'"></span>
            </Switch>
          </div>


          <!-- Error message -->
          <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-xl">
            <p class="text-red-600 text-sm font-medium">{{ error }}</p>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3 pt-4">
            <button type="button" @click="resetForm"
              class="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all">
              {{ $t('common.clear') }}
            </button>
            <button type="submit" :disabled="isSubmitting"
              class="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-orange-700 transition-all disabled:opacity-50">
              {{ isSubmitting ? $t('common.saving') : (showEditModal ? $t('user.updateUser') : $t('user.createUser')) }}
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
import { useTelegram } from '@/composables/useTelegram';
import socket from '@/services/socket';
import { Switch } from '@headlessui/vue';
import axios from 'axios';
import { onMounted, ref, watch, onUnmounted } from 'vue';
const { sendToTelegram } = useTelegram();
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

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
const roles = ref([
  { value: 'superadmin', label: t('roles.superadmin') },
  { value: 'admin', label: t('roles.admin') },
  { value: 'delivery', label: t('roles.delivery') },
  { value: 'customer', label: t('roles.customer') }
]);
const gender = ref('');
const genderOptions = [
  { value: 'female', label: t('common.female') },
  { value: 'male', label: t('common.male') },
  { value: 'other', label: t('common.other') }
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
    error.value = $t('errors.requiredFields');
    return;
  }

  isSubmitting.value = true;
  error.value = '';

  try {
    isLoading.value = true;
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (!token || !userId) {
      error.value = $t('errors.authRequired');
      isSubmitting.value = false;
      isLoading.value = false;
      return;
    }

    const timestamp = await fetchTimestamp();

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
      // Creating new user: password required
      if (!password.value) {
        error.value = $t('errors.passwordRequired');
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
        resetForm();
        closeModal();
      } else {
        throw new Error(response.data.message || $t('errors.createFailed'));
      }
    } else {
      // Updating existing user
      if (!id.value) {
        error.value = $t('errors.missingUserId');
        isSubmitting.value = false;
        isLoading.value = false;
        return;
      }

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
        throw new Error(response.data.message || $t('errors.updateFailed'));
      }
    }
  } catch (err) {
    console.error('Error saving user:', err);
    error.value = err.response?.data?.message || err.message || $t('errors.saveFailed');
  } finally {
    isSubmitting.value = false;
    isLoading.value = false;
  }
};


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
    socket.connect();
  }

  // Listen for real-time updates on User collection
  socket.on('dataUpdate', (update) => {
    if (update.collection === 'User') {
      console.log('🔄 Real-time User update received:', update);
      fetchUsers();
    }
  });

  // Optional: reconnect events
  socket.on('connect', () => console.log(' Socket connected:', socket.id));
  socket.on('disconnect', () => console.log(' Socket disconnected'));
  socket.on('error', (error) => console.error(' Socket error:', error));

  fetchUsers();
});

onUnmounted(() => {
  socket.off('dataUpdate');
  socket.off('connect');
  socket.off('disconnect');
  socket.off('error');
});



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

