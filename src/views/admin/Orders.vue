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
            <h1 class="text-2xl font-bold text-gray-900 tracking-tight">{{ $t('order.title') }}</h1>
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
          <div class="flex items-center space-x-2">
            <input type="date" v-model="startDate" 
              class="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all" />
            <span class="text-gray-500 text-sm font-medium">{{ $t('order.dateRangeTo') }}</span>
            <input type="date" v-model="endDate" 
              class="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all" />
          </div>
        </div>
      </div>
    </div>

    <!-- Main Table Card -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden">
      <!-- Table Header -->
     

      <!-- Table Container -->
      <div class="relative overflow-hidden">
        <!-- Loading Overlay -->
        <div v-if="isLoading" class="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-100">
            <thead class="bg-gray-50/50">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">#</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">{{ $t('order.customer') }}</th>
                <th class="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">{{ $t('order.date') }}</th>
                <th class="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">{{ $t('order.items') }}</th>
                <th class="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">{{ $t('order.total') }}</th>
                <th class="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">{{ $t('order.status') }}</th>
                <th class="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">{{ $t('order.actions') }}</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-100">
              <tr v-for="(item, index) in orderData" :key="index"
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
                        {{ item.userId && item.userId.name ? item.userId.name : 'Guest' }}
                      </div>
                      
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-600 font-medium">
                  {{ formatDate(item.createdAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span class="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                    {{ item.items.length }} {{ $t('order.items') }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <div class="text-sm font-bold text-gray-900">
                    {{ item.totalCost ? '៛' + item.totalCost.toFixed(2) : '៛0.00' }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold"
                    :class="getStatusClass(item.status)">
                    <i :class="getStatusIcon(item.status)" class="text-xs"></i>
                    {{ $t(item.status.toLowerCase()) || item.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <div class="flex items-center justify-center gap-2">
                    <button class="p-2.5 rounded-xl hover:bg-amber-50 text-amber-600 transition-all duration-200 hover:scale-110 border border-transparent hover:border-amber-200"
                      @click="viewOrder(item._id)" title="View order details">
                      <i class="fas fa-eye text-sm"></i>
                    </button>
                    <button v-if="item.status !== 'Delivered' && item.status !== 'Cancelled'"
                      class="p-2.5 rounded-xl hover:bg-green-50 text-green-600 transition-all duration-200 hover:scale-110 border border-transparent hover:border-green-200"
                      @click="editOrder(item._id)" title="Edit order">
                      <i class="fas fa-edit text-sm"></i>
                    </button>
                  </div>
                </td>
              </tr>

              <!-- Empty State -->
              <tr v-if="orderData.length === 0 && !isLoading">
                <td colspan="7" class="px-6 py-20 text-center">
                  <div class="flex flex-col items-center gap-4">
                    <div class="p-6 rounded-2xl bg-amber-50 border border-amber-200">
                      <i class="fas fa-shopping-cart text-5xl text-amber-400"></i>
                    </div>
                    <div>
                      <h3 class="text-lg font-bold text-gray-900">{{ $t('order.emptyTitle') }}</h3>
                      <p class="text-sm text-gray-600 mt-1 font-medium">{{ $t('order.emptyDescription') }}</p>
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

    <!-- Order Detail Modal -->
    <div v-if="selectedOrder" class="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[1000] p-4">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-200">
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 class="text-xl font-bold text-gray-900 tracking-tight">
              {{ $t('order.orderDetails') }} #{{ selectedOrder.orderNumber || selectedOrder._id }}
            </h2>
            <p class="text-sm text-gray-600 mt-1 font-medium">{{ $t('order.orderProgressDetails') }}</p>
          </div>
          <button class="p-2.5 rounded-xl hover:bg-amber-50 text-amber-400 hover:text-amber-600 transition-all" @click="selectedOrder = null">
            <i class="fas fa-times text-lg"></i>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-6 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <div class="flex items-center">
                <span class="text-sm font-bold text-gray-500 w-32">{{ $t('order.customer') }}:</span>
                <span class="text-sm text-gray-700 font-medium">{{ selectedOrder.userId?.name || 'Guest' }}</span>
              </div>
              <div class="flex items-center">
                <span class="text-sm font-bold text-gray-500 w-32">{{ $t('order.date') }}:</span>
                <span class="text-sm text-gray-700 font-medium">{{ formatDate(selectedOrder.createdAt) }}</span>
              </div>
              <div class="flex items-start">
                <span class="text-sm font-bold text-gray-500 w-32">{{ $t('order.address') }}:</span>
                <span class="text-sm text-gray-700 font-medium">{{ customerAddress }}</span>
              </div>
            </div>

            <div class="space-y-4">
              <div class="flex items-center">
                <span class="text-sm font-bold text-gray-500 w-32">{{ $t('order.status') }}:</span>
                <span class="text-sm font-medium" :class="getStatusClass(selectedOrder.status)">
                  {{ selectedOrder.status ? $t(selectedOrder.status.toLowerCase()) : '-' }}
                </span>
              </div>
              <div class="flex items-center" v-if="selectedOrder.confirmedAt">
                <span class="text-sm font-bold text-gray-500 w-32">{{ $t('order.confirmedAt') }}:</span>
                <span class="text-sm text-gray-700 font-medium">{{ formatDate(selectedOrder.confirmedAt) }}</span>
              </div>
              <div class="flex items-center" v-if="selectedOrder.deliveringAt">
                <span class="text-sm font-bold text-gray-500 w-32">{{ $t('order.deliveringAt') }}:</span>
                <span class="text-sm text-gray-700 font-medium">{{ formatDate(selectedOrder.deliveringAt) }}</span>
              </div>
              <div class="flex items-center" v-if="selectedOrder.gotProductAt">
                <span class="text-sm font-bold text-gray-500 w-32">{{ $t('order.gotProductAt') }}:</span>
                <span class="text-sm text-gray-700 font-medium">{{ formatDate(selectedOrder.gotProductAt) }}</span>
              </div>
            </div>
          </div>

          <div class="border-t border-gray-200 pt-6">
            <h3 class="font-bold text-gray-700 mb-4">{{ $t('order.orderItems') }}</h3>
            <div class="space-y-4">
              <div v-for="item in selectedOrder.items" :key="item._id" class="flex items-center p-4 border border-gray-100 rounded-2xl hover:bg-gray-50 transition">
                <div class="w-16 h-16 bg-gray-100 rounded-2xl overflow-hidden flex items-center justify-center mr-4 border border-gray-200">
                  <img :src="item.image || ''" alt="" class="w-full h-full object-cover" v-if="item.image">
                  <i v-else class="fas fa-box text-gray-400"></i>
                </div>
                <div class="flex-1">
                  <h4 class="font-bold text-gray-800">{{ item.name }}</h4>
                </div>
                <div class="font-bold text-gray-700">
                  {{ item.quantity }} x ៛{{ item.price.toFixed(2) }}
                </div>
              </div>
            </div>
          </div>

          <div class="border-t border-gray-200 pt-6 flex justify-between items-center">
            <span class="font-bold text-gray-700">{{ $t('order.total') }}:</span>
            <span class="font-bold text-gray-900 text-lg">៛{{ selectedOrder.totalCost?.toFixed(2) || '0.00' }}</span>
          </div>

          <div class="flex justify-end pt-4">
            <button @click="selectedOrder = null" class="px-6 py-3 rounded-2xl text-sm font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all">
              {{ $t('order.close') }}
            </button>
          </div>
        </div>
      </div>
    </div>


    <!-- Order Edit Dialog -->
    <div v-if="isEditing" class="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[1000] p-4">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-2xl border border-gray-200">
        <!-- Dialog Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 class="text-xl font-bold text-gray-900 tracking-tight">{{ $t('order.updateOrder') }} #{{ editOrderData.orderNumber || editOrderData._id }}</h2>
          <button class="p-2.5 rounded-xl hover:bg-amber-50 text-amber-400 hover:text-amber-600 transition-all" @click="closeEditDialog">
            <i class="fas fa-times text-lg"></i>
          </button>
        </div>

        <!-- Dialog Body -->
        <div class="p-6 space-y-6">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-sm font-bold text-gray-500">{{ $t('order.customer') }}:</span>
              <span class="text-sm text-gray-700 font-medium">{{ editOrderData.userId?.name || 'Guest' }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm font-bold text-gray-500">{{ $t('order.total') }}:</span>
              <span class="text-sm text-gray-700 font-medium">៛{{ editOrderData.totalCost?.toFixed(2) }}</span>
            </div>
          </div>

          <div class="border-t border-gray-200 pt-6">
            <h3 class="font-bold text-gray-700 mb-4">{{ $t('order.status') }}</h3>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button @click="updateOrderStatus('delivering')" :disabled="isLoading"
                class="px-4 py-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                <i class="fas fa-check-circle mr-2"></i> Confirm
              </button>
              <button @click="updateOrderStatus('pending')" :disabled="isLoading"
                class="px-4 py-3 rounded-xl bg-yellow-500 text-white font-bold hover:bg-yellow-600 transition disabled:opacity-50 disabled:cursor-not-allowed">
                <i class="fas fa-hourglass-half mr-2"></i> Pending
              </button>
              <button @click="updateOrderStatus('rejected')" :disabled="isLoading"
                class="px-4 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                <i class="fas fa-times-circle mr-2"></i> Reject
              </button>
            </div>
          </div>
        </div>

        <!-- Dialog Footer -->
        <div class="flex justify-end gap-3 p-6 border-t border-gray-100">
          <button @click="closeEditDialog" class="px-6 py-3 rounded-2xl text-sm font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all">
            {{ $t('order.close') }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import apiURL from '@/api/config';
import Pagination from '@/components/Pagination.vue';
import formatDate from '@/composables/formatDate';
import socket from '@/services/socket.js';
import { useStore } from '@/store/useStore';
import axios from 'axios';
import Swal from 'sweetalert2';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

// Initialize i18n
const { t } = useI18n();

// State
const orders = ref([]);
const filteredOrders = ref([]);
const selectedOrder = ref(null);
const statusFilter = ref('all');
const startDate = ref('');
const endDate = ref('');
const isLoading = ref(false);
const searchQuery = ref('');
const searchText = ref('');
const currentPage = ref(1);
const pageSize = ref(10);
const currentPageIsLastRecord = ref(null);
const limitedPerPage = ref(10);
const items = ref([1, 10, 50, 100]);
const selectedItem = ref(10);
const isOpen = ref(false);
const userData = ref([]);
const store = useStore();
const orderData = ref([]);
const isEditing = ref(false);
const editOrderData = ref(null);
const customerAddress = ref('');



const getUserData = async () => {
  try {
    isLoading.value = true;
    const params = {
      dynamicConditions: JSON.stringify([
        {
          field: "_id",
          operator: "==",
          value: store.getUserId
        }
      ])
    }
    const response = await axios.get(`${apiURL}/api/getAllDocs/User`, {
      params,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    console.log("User data:", response.data.data);
    userData.value = response.data.data;

  
  } catch (error) {
    console.log("Error fetching user data:", error);
    
  }
}



// Fetch orders from the backend
const fetchOrders = async () => {
  try {
    isLoading.value = true;
    const params = {
      collectionName: 'Order',
      populate: JSON.stringify(['userId']),
      // pageSize: 100 // Adjust this number based on your needs
    }
    const response = await axios.get(`${apiURL}/api/getPagination`, {
      params,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });

    console.log("Order data:", response.data.data);
    orderData.value = response.data.data;
   
  } catch (error) {
    console.error('Error fetching orders:', error);
    orders.value = [];
  } finally {
    isLoading.value = false;
  }
};


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
  filteredOrders.value = items || [];
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

// Get status class for styling
const getStatusClass = (status) => {
  if (!status) return 'bg-gray-100 text-gray-800';
  
  const statusLower = status.toLowerCase();
  switch (statusLower) {
    case 'processing':
      return 'bg-blue-100 text-blue-800';
    case 'shipped':
      return 'bg-purple-100 text-purple-800';
    case 'in transit':
      return 'bg-indigo-100 text-indigo-800';
    case 'out for delivery':
      return 'bg-amber-100 text-amber-800';
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
    case 'canceled':
      return 'bg-red-100 text-red-800';
    case 'paid':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Get status icon for the header
const getStatusIcon = (status) => {
  if (!status) return 'fa-question-circle';
  
  const statusLower = status.toLowerCase();
  switch (statusLower) {
    case 'processing':
      return 'fa-spinner';
    case 'shipped':
      return 'fa-truck';
    case 'in transit':
      return 'fa-plane';
    case 'out for delivery':
      return 'fa-shipping-fast';
    case 'delivered':
      return 'fa-check-circle';
    case 'cancelled':
    case 'canceled':
      return 'fa-times-circle';
    case 'paid':
      return 'fa-dollar-sign';
    case 'pending':
      return 'fa-clock';
    default:
      return 'fa-info-circle';
  }
};

// View order details
const viewOrder = (orderId) => {
  selectedOrder.value = orderData.value.find(order => order._id === orderId);
};

// Edit order details
const editOrder = (orderId) => {
  const order = orderData.value.find(order => order._id === orderId);
  if (order) {
    editOrderData.value = { ...order };  
    isEditing.value = true;
  }
};

const closeEditDialog = () => {
  isEditing.value = false;
  editOrderData.value = null;
};

const updateOrderStatus = async (newStatus) => {
  if (!editOrderData.value) return;

  const confirmResult = await Swal.fire({
    icon: 'question',
    title: `Confirm ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`,
    text: `Are you sure you want to set this order status to "${newStatus}"?`,
    showCancelButton: true,
    confirmButtonText: 'Yes, Update',
    cancelButtonText: t('common.cancel'),
    confirmButtonColor: '#f59e0b',
    cancelButtonColor: '#6b7280'
  });

  if (!confirmResult.isConfirmed) return;

  try {
    isLoading.value = true;

    const updateData = {
      fields: {
        status: newStatus,
        updatedBy: userData.value[0]?.name || 'Admin',
        updatedAt: new Date()
      }
    };

    const response = await axios.patch(
      `${apiURL}/api/updateDoc/Order/${editOrderData.value._id}`,
      updateData,
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    );

    if (response.data.success) {
      Swal.fire({
        icon: 'success',
        title: 'Order Updated',
        text: `Order status set to "${newStatus}"`,
        timer: 2000,
        showConfirmButton: false
      });
      closeEditDialog();
      fetchOrders();
    }
  } catch (error) {
    console.error('Error updating order:', error);
    Swal.fire({
      icon: 'error',
      title: 'Update Failed',
      text: error.response?.data?.message || 'Failed to update order status.'
    });
  } finally {
    isLoading.value = false;
  }
};



// Update order status to delivering
const updateOrder = async () => {
  if (!selectedOrder.value) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No order selected'
    });
    return;
  }

  // Show confirmation dialog
  const result = await Swal.fire({
    icon: 'question',
    title: 'Confirm ' + t('order.updateOrder'),
    text: 'Are you sure you want to update this order status to delivering?',
    showCancelButton: true,
    confirmButtonText: 'Yes, Update',
    cancelButtonText: t('common.cancel'),
    confirmButtonColor: '#f59e0b',
    cancelButtonColor: '#6b7280'
  });

  if (!result.isConfirmed) {
    return;
  }

  try {
    isLoading.value = true;
    
    const updateData = {
      fields: {
        status: 'delivering',
        updatedBy: userData.value[0]?.name || 'Admin',
        updatedAt: new Date()
      }
    };

    const response = await axios.patch(
      `${apiURL}/api/updateDoc/Order/${selectedOrder.value._id}`,
      updateData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );

    if (response.data.success) {
      // Update the local order data
      const orderIndex = orderData.value.findIndex(order => order._id === selectedOrder.value._id);
      if (orderIndex !== -1) {
        orderData.value[orderIndex] = {
          ...orderData.value[orderIndex],
          status: 'delivering',
          updatedBy: userData.value[0]?.name || 'Admin',
          updatedAt: new Date()
        };
      }

      // Update the selected order in the modal
      selectedOrder.value = {
        ...selectedOrder.value,
        status: 'delivering',
        updatedBy: userData.value[0]?.name || 'Admin',
        updatedAt: new Date()
      };

      // Show success notification
      Swal.fire({
        icon: 'success',
        title: t('order.updateOrder') + ' Successfully',
        text: 'Order status has been updated to delivering',
        timer: 2000,
        showConfirmButton: false
      });
      
      // Close the modal after a short delay
      setTimeout(() => {
        selectedOrder.value = null;
      }, 2000);
    }
  } catch (error) {
    console.error('Error updating order:', error);
    
    // Show error notification
    Swal.fire({
      icon: 'error',
      title: 'Update Failed',
      text: error.response?.data?.message || 'Failed to update order. Please try again.'
    });
  } finally {
    isLoading.value = false;
  }
};

// Real-time order update listener
const handleDataUpdate = (payload) => {
  console.log('🔔 Socket event received:', payload);
  
  if (payload && payload.collection === 'Order') {
    switch (payload.action) {
      case 'update':
        console.log('📦 Order updated, refetching orders...');
        fetchOrders();
        break;
      case 'insert':
        console.log('🆕 New order created, refetching orders...');
        fetchOrders();
        break;
      case 'delete':
        console.log('🗑️ Order deleted, refetching orders...');
        fetchOrders();
        break;
      default:
        console.log('❓ Unknown action:', payload.action);
    }
  }
};

watch(selectedOrder, async (newOrder) => {
  if (!newOrder || !newOrder.userId) {
    customerAddress.value = '';
    return;
  }

  try {
    // Correctly get the user ID from the order, not from the logged-in store
    const userId = newOrder.userId._id || newOrder.userId; // 🟢 THIS IS KEY

    const response = await axios.get(`${apiURL}/api/getDocById/User/${userId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    const user = response.data?.data;
    if (user) {
      customerAddress.value = [
        user.village,
        user.commune,
        user.district,
        user.province,
        user.country
      ].filter(Boolean).join(', ');
    } else {
      customerAddress.value = 'Address not found';
    }
  } catch (error) {
    console.error('Error fetching customer address:', error);
    customerAddress.value = 'Failed to load address';
  }
});


// Socket connection status monitoring
const handleSocketConnect = () => {
  console.log('✅ Socket connected');
};

const handleSocketDisconnect = () => {
  console.log('❌ Socket disconnected');
};

const handleSocketError = (error) => {
  console.error('🚨 Socket error:', error);
};

// Fetch orders on component mount
onMounted(() => {
  fetchOrders();
  getUserData();
  
  socket.on('dataUpdate', handleDataUpdate);
  socket.on('connect', handleSocketConnect);
  socket.on('disconnect', handleSocketDisconnect);
  socket.on('error', handleSocketError);

  socket.on('orderCreated', (order) => {
    console.log('🆕 Order created (real-time):', order);
    fetchOrders();
    Swal.fire({
      icon: 'info',
      title: t('order.newOrder'),
      text: `${t('order.orderNumber')} #${order._id}`,
      timer: 3000,
      showConfirmButton: false
    });
  });

  socket.on('orderUpdated', (order) => {
    console.log('🔄 Order updated (real-time):', order);
    fetchOrders();
    Swal.fire({
      icon: 'info',
      title: t('order.updated'),
      text: `${t('order.orderNumber')} #${order._id}`,
      timer: 3000,
      showConfirmButton: false
    });
  });

  socket.on('orderDeleted', (orderId) => {
    console.log('🗑️ Order deleted (real-time):', orderId);
    fetchOrders();
    Swal.fire({
      icon: 'warning',
      title: t('order.deleted'),
      text: `${t('order.orderNumber')} #${orderId}`,
      timer: 3000,
      showConfirmButton: false
    });
  });
});

onUnmounted(() => {
  socket.off('dataUpdate', handleDataUpdate);
  socket.off('connect', handleSocketConnect);
  socket.off('disconnect', handleSocketDisconnect);
  socket.off('error', handleSocketError);

  socket.off('orderCreated');
  socket.off('orderUpdated');
  socket.off('orderDeleted');
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


