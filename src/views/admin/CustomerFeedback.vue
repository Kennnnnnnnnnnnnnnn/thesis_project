<template>
  <div class="p-4 md:p-6 bg-gray-50 font-khmer">
    <!-- Header Section -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-6 mb-6">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <!-- Title -->
        <div class="flex items-center gap-4">
          <div class="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Customer FeedBack</h1>
          </div>
        </div>

        <!-- Controls -->
        <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <!-- Items per page -->
          <div class="relative">
            <button @click="toggleDropdownRow"
              class="flex items-center justify-between min-w-[110px] px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-amber-50 hover:border-amber-300 transition-all">
              <span>{{ selectedItem }} {{ $t('items') }}</span>
              <i class="fas fa-chevron-down ml-2 text-xs transition-transform duration-200"
                :class="{ 'rotate-180': isOpen }"></i>
            </button>
            <div v-show="isOpen"
              class="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 shadow-xl rounded-xl py-2 z-50 backdrop-blur-sm">
              <div v-for="item in items" :key="item" @click="selectItem(item)"
                class="px-4 py-2.5 text-sm text-gray-700 cursor-pointer hover:bg-amber-50 transition-colors font-medium">
                {{ item }} {{ $t('items') }}
              </div>
            </div>
          </div>

          <!-- Search Input -->
          <div class="relative">
            <input v-model="searchQuery" type="text" :placeholder="$t('order.searchPlaceholder')"
              class="w-64 px-4 py-2.5 pl-10 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all" />
            <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
          </div>

          <!-- Status Filter -->
          <!-- <select v-model="statusFilter"
            class="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 bg-white transition-all">
            <option value="all">{{ $t('order.allOrders') }}</option>
            <option value="processing">{{ $t('order.processing') }}</option>
            <option value="shipped">{{ $t('order.shipped') }}</option>
            <option value="intransit">{{ $t('order.inTransit') }}</option>
            <option value="outfordelivery">{{ $t('order.outForDelivery') }}</option>
            <option value="delivered">{{ $t('order.delivered') }}</option>
            <option value="cancelled">{{ $t('order.cancelled') }}</option>
            <option value="paid">{{ $t('order.paid') }}</option>
            <option value="pending">{{ $t('order.pending') }}</option>
          </select> -->

          <!-- Date Range Filter -->
          <!-- <div class="flex items-center space-x-2">
            <input type="date" v-model="startDate" 
              class="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all" />
            <span class="text-gray-500 text-sm font-medium">{{ $t('order.dateRangeTo') }}</span>
            <input type="date" v-model="endDate" 
              class="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all" />
          </div> -->
        </div>
      </div>
    </div>

    <!-- Main Table Card -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden">
      <!-- Table Header -->
     

      <!-- Table Container -->
      <div class="relative overflow-hidden">
        <!-- Loading Overlay -->
        <div v-if="isLoadingFeedbacks" class="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-100">
            <thead class="bg-gray-50/50">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">#</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Name</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Email</th>
                <th class="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Phone Number</th>
                <th class="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Feedback</th>
                <th class="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">CreatedAt</th>

              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-100">
              <tr v-for="(item, index) in feedbacks" :key="index"
                class="hover:bg-amber-50/50 transition-colors duration-200">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  {{ index + 1 }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0">
                      <div class="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center border border-amber-200">
                        <i class="fas fa-user text-amber-600 text-sm"></i>
                      </div>
                    </div>
                    <div class="ml-3">
                      <div class="text-sm font-bold text-gray-900">
                        {{ item.name }}
                      </div>
                      
                    </div>
                  </div>
                </td>

                <td class="px-6 py-4 whitespace-nowrap ">
                  <div class="text-sm font-bold text-gray-900">
                    {{ item.email || '-' }}
                  </div>
                </td>

               
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <div class="text-sm font-bold text-gray-900">
                    {{ item.phoneNumber }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <div class="text-sm font-bold text-gray-900">
                    {{ item.feedback }}
                  </div>
                </td>

                <td class="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-600 font-medium">
                  {{ formatDate(item.createdAt) }}
                </td>
               
              </tr>

              <!-- Empty State -->
              <tr v-if="feedbacks.length === 0 && !isLoadingFeedbacks">
                <td colspan="7" class="px-6 py-20 text-center">
                  <div class="flex flex-col items-center gap-4">
                    <div class="p-6 rounded-2xl bg-amber-50 border border-amber-200">
                      <i class="fas fa-shopping-cart text-5xl text-amber-400"></i>
                    </div>
                    <div>
                      <p>No Data found</p>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-4 border-t border-gray-100 bg-gray-50/30">
        <Pagination :currentPage="currentPage" @onEmitDataFromPagination="handleListenToPagination"
          @onEmitIsLoading="handleListenIsLoading" @onEmitCurrentPageIsLastRecord="handleListenIsLastRecordOnPage"
          :limitedPerPage="pageSize" :searchQuery="searchText" />
      </div>
    </div>

  </div>
</template>

<script setup>
import apiURL from '@/api/config';
import Pagination from '@/components/Pagination.vue';
import formatDate from '@/composables/formatDate';
import { useStore } from '@/store/useStore';
import axios from 'axios';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

// Initialize i18n
const { t } = useI18n();

// State
const feedbacks = ref([]);
const isLoadingFeedbacks = ref(false);
const searchQuery = ref('');
const searchText = ref('');
const currentPage = ref(1);
const pageSize = ref(10);
const currentPageIsLastRecord = ref(null);
const limitedPerPage = ref(10);
const items = ref([1, 10, 50, 100]);
const selectedItem = ref(10);
const isOpen = ref(false);
const isLoading = ref(false);




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

// Pagination handlers
const handleListenToPagination = async (items) => {
  feedbacks.value = items || []; // This line is no longer needed
};

const handleListenIsLoading = (status) => {
  isLoading.value = status; // This line is no longer needed
};

const handleListenIsLastRecordOnPage = (page) => {
  currentPageIsLastRecord.value = page;
  if (currentPage.value > 1) {
    currentPage.value -= 1;
  }
};




const fetchFeedbacks = async () => {
  isLoadingFeedbacks.value = true;
  try {
    const headers = {};
    const token = localStorage.getItem('token');
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await axios.get(`${apiURL}/api/getAllDocs/CustomerFeedback`, { headers });
    feedbacks.value = res.data.data || [];
  } catch (err) {
    feedbacks.value = [];
    console.error('Failed to fetch feedbacks:', err);
  } finally {
    isLoadingFeedbacks.value = false;
  }
};






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


