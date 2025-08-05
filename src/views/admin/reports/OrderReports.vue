<template>
  <div class="p-2">
    <!-- Header Section -->
    <div class="bg-white rounded-xl shadow-sm p-4 mb-6">
      <!-- Title -->
      <div class="flex justify-between items-center flex-wrap gap-4 mb-4 md:mb-6">
        <h1 class="text-xl font-bold text-gray-900">Order Reports</h1>
      </div>

      <!-- Filter Section -->
      <div class="flex flex-col md:flex-row md:items-end gap-3 md:gap-4">
        <!-- START DATE -->
        <v-menu v-model="menuStart" :close-on-content-click="false" offset-y transition="scale-transition">
          <template #activator="{ props }">
            <div v-bind="props" class="relative w-full md:w-auto min-w-[130px]">
              <input type="text" :value="formattedStartDate" readonly placeholder="Start Date"
                class="w-full px-4 py-2 rounded-xl border border-gray-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-400 shadow-sm pr-10" />
              <span class="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 pointer-events-none">
                <i class="fas fa-calendar-alt"></i>
              </span>
            </div>
          </template>
          <v-date-picker v-model="startDate" @update:model-value="menuStart = false" :max="endDate"
            show-adjacent-months />
        </v-menu>

        <!-- END DATE -->
        <v-menu v-model="menuEnd" :close-on-content-click="false" offset-y transition="scale-transition">
          <template #activator="{ props }">
            <div v-bind="props" class="relative w-full md:w-auto min-w-[130px]">
              <input type="text" :value="formattedEndDate" readonly placeholder="End Date"
                class="w-full px-4 py-2 rounded-xl border border-gray-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-400 shadow-sm pr-10" />
              <span class="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 pointer-events-none">
                <i class="fas fa-calendar-alt"></i>
              </span>
            </div>
          </template>
          <v-date-picker v-model="endDate" @update:model-value="menuEnd = false" :min="startDate"
            show-adjacent-months />
        </v-menu>

        <!-- Search Button -->
        <!-- <button @click="clearFilters"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 w-full md:w-auto">
          Clear
        </button> -->

        <button @click="clearFilters"
          class="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 shadow-sm transition-all duration-150">
          <i class="fas fa-sync-alt"></i>
          <span class="hidden sm:inline">Refresh</span>
        </button>

        <!-- Export Excel Button -->
        <button @click="exportToExcel"
          class="px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 w-full md:w-auto">
          <i class="fas fa-file-excel mr-2"></i>Export Excel
        </button>

        <!-- Print Button -->
        <button @click="printReport"
          class="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm hover:bg-amber-600 w-full md:w-auto">
          <i class="fas fa-print mr-2"></i>Print
        </button>
      </div>
    </div>


    <!-- Table Section -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden relative print-section" ref="printSection">
      <!-- Logo and Print Title/Header -->
      <div class="flex flex-col items-center py-6 gap-2 print-title">
        <!-- <img src="@/assets/rice.png" alt="Logo" class="w-16 h-16 object-contain" style="margin: 0 auto;" /> -->
        <h1 class="text-2xl font-bold text-black-800 text-center">Taing EangHuot</h1>
        <h2 class="text-base font-semibold text-gray-700 text-center">បញ្ជីរបាយការណ៍ការកម្មង់របស់អតិថិជន</h2>
        <div class="w-32 border-t-2 border-dashed border-gray-400 mx-auto my-2"></div>
      </div>


      <!-- Loading Spinner -->
      <div v-if="isLoading" class="absolute inset-0 bg-opacity-70 flex items-center justify-center z-10">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-900"></div>
      </div>

      <!-- Desktop Table -->
      <div class="hidden md:block overflow-x-auto" v-if="orders.length > 0">
        <table class="w-full">
          <thead class="bg-gray-100 text-sm">
            <tr>
              <th class="text-left p-4">#</th>
              <th class="text-left p-4">Costumer</th>
              <th class="text-left p-4">Items</th>
              <th class="text-center p-4">Total</th>
              <!-- <th class="text-center p-4">Payment</th> -->
              <th class="text-center p-4">Status</th>
              <th class="text-center p-4">Date</th>
            </tr>
          </thead>
          <tbody class="divide-y">
            <tr v-for="(order, index) in orders" :key="order._id" class="hover:bg-gray-50">
              <td class="p-4">{{ index + 1 }}</td>
              <td class="p-4">
                {{
                  getUserName(order.userId) || 'Customer'
                }}
              </td>
              <td class="p-4">
                <div v-for="item in order.items" :key="item._id" class="flex items-center gap-2 mb-1 last:mb-0">
                  <div class="w-8 h-8 bg-gray-100 rounded flex-shrink-0">
                    <img v-if="item.image" :src="item.image" :alt="item.name"
                      class="w-full h-full object-cover rounded" />
                    <div v-else class="w-full h-full flex items-center justify-center">
                      <i class="fas fa-box text-gray-400"></i>
                    </div>
                  </div>
                  <div>
                    <p class="text-sm font-medium">{{ item.name }}</p>
                    <p class="text-xs text-gray-500">៛{{ item.price }} × {{ item.quantity }}</p>
                  </div>
                </div>
              </td>
              <td class="p-4 text-center font-medium">៛{{ order.totalCost?.toFixed(2) || '0.00' }}</td>
              <!-- <td class="p-4 text-center">
                <span :class="[
                  'px-2 py-1 rounded text-xs font-medium',
                  order.paymentStatus === 'paid'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                ]">
                  {{ order.paymentStatus }}
                </span>
              </td> -->
              <td class="p-4 text-center">
                <span :class="[
                  'px-2 py-1 rounded text-xs font-medium',
                  order.status === 'got_product'
                    ? 'bg-green-100 text-green-700'
                    : order.status === 'delivering'
                      ? 'bg-blue-100 text-blue-700'
                      : order.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                ]">
                  {{ order.status }}
                </span>
              </td>
              <td class="p-4 text-center">
                <span class="text-sm">{{ formatDate(order.createdAt) }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Cards -->
      <div class="md:hidden" v-if="orders.length > 0">
        <div v-for="order in orders" :key="order._id" class="p-4 border-b">
          <div class="flex justify-between items-start mb-2">
            <span class="text-lg font-semibold text-gray-800">៛{{ order.totalCost?.toFixed(2) || '0.00' }}</span>
            <div class="flex flex-col items-end gap-1">
              <span :class="[
                'px-2 py-1 rounded text-xs font-medium',
                order.status === 'completed'
                  ? 'bg-green-100 text-green-700'
                  : order.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
              ]">{{ order.status }}</span>
              <span :class="[
                'px-2 py-1 rounded text-xs font-medium',
                order.paymentStatus === 'paid'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
              ]">{{ order.paymentStatus }}</span>
            </div>
          </div>

          <div class="space-y-2 text-sm">
            <div v-for="item in order.items" :key="item._id" class="flex items-center gap-2">
              <div class="w-10 h-10 bg-gray-100 rounded flex-shrink-0">
                <img v-if="item.image" :src="item.image" :alt="item.name" class="w-full h-full object-cover rounded" />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <i class="fas fa-box text-gray-400"></i>
                </div>
              </div>
              <div>
                <p class="font-medium text-gray-800">{{ item.name }}</p>
                <p class="text-gray-500">៛{{ item.price }} × {{ item.quantity }}</p>
              </div>
            </div>
          </div>

          <div class="mt-2 flex justify-between text-sm text-gray-500">
            <span>{{ formatDate(order.createdAt) }}</span>
            <span>{{ order.paymentMethod }}</span>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="orders.length === 0" class="p-8 text-center">
        <i class="fas fa-inbox text-4xl text-gray-400 mb-2"></i>
        <p class="text-gray-600">No orders found</p>
      </div>
    </div>
  </div>
</template>


<script setup>
import apiURL from '@/api/config';
import formatDate from '@/composables/formatDate';
import socket from '@/services/socket';
import axios from 'axios';
import dayjs from 'dayjs';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import * as XLSX from 'xlsx';

// Print function: use window.print to print only the table
const printReport = () => {
  window.print();
};

const icondisplay = ref();
const startDate = ref(null)
const endDate = ref(null)
const menuStart = ref(false)
const menuEnd = ref(false)
const isLoading = ref(false)
const printSection = ref(null)
const orders = ref([])
const userData = ref([])



const getUserName = (userId) => {
  const user = userData.value.find(user => user._id === userId);
  return user ? user.name : '';
};


const getUserData = async () => {
  try {
    isLoading.value = true;

    const response = await axios.get(`${apiURL}/api/getAllDocs/User`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });

    userData.value = response.data.data;


  } catch (error) {
    console.log("Error fetching user data:", error);

  }
}

const fetchOrders = async (start = null, end = null) => {
  try {
    isLoading.value = true

    let dynamicConditions = []
    if (start && end) {
      dynamicConditions = [
        {
          field: 'createdAt',
          operator: '&gte',
          value: start,
          type: 'Date'
        },
        {
          field: 'createdAt',
          operator: '&lte',
          value: end,
          type: 'Date'
        }
      ]
    }

    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('Authentication token not found')
    }

    const response = await axios.get(`${apiURL}/api/order/list`, {
      params: {
        dynamicConditions: JSON.stringify(dynamicConditions),
        sortField: 'createdAt',
        sortOrder: 'desc'
      },
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })



    if (response.data.success) {
      orders.value = response.data.data
    } else {
      console.error('Failed to fetch orders:', response.data.message)
    }
  } catch (error) {
    console.error('Error fetching orders:', error)
  } finally {
    isLoading.value = false
  }
}

const formattedStartDate = computed(() =>
  startDate.value ? dayjs(startDate.value).format('YYYY-MM-DD') : ''
)

const formattedEndDate = computed(() =>
  endDate.value ? dayjs(endDate.value).format('YYYY-MM-DD') : ''
)

const clearFilters = () => {
  startDate.value = null
  endDate.value = null
  fetchOrders()
}

watch([startDate, endDate], ([newStart, newEnd]) => {
  if (newStart && newEnd) {
    fetchOrders(newStart, newEnd);
  }
});


const handleSearch = () => {
  if (!startDate.value || !endDate.value) {
    alert('Please select both start and end dates')
    return
  }
  fetchOrders(startDate.value, endDate.value)
}

const exportToExcel = () => {
  // Prepare data for Excel
  const excelData = orders.value.map((order, index) => {
    const itemsList = order.items.map(item => `${item.name} (${item.quantity}x៛${item.price})`).join(', ')
    return {
      'No.': index + 1,
      'Items': itemsList,
      'Total Cost': `៛${order.totalCost?.toFixed(2) || '0.00'}`,
      'Payment Status': order.paymentStatus,
      'Payment Method': order.paymentMethod,
      'Order Status': order.status,
      'Date': formatDate(order.createdAt)
    }
  })

  // Create worksheet
  const ws = XLSX.utils.json_to_sheet(excelData)

  // Create workbook
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Orders')

  // Generate file name with date range
  let fileName = 'orders'
  if (startDate.value && endDate.value) {
    fileName += `_${startDate.value}_to_${endDate.value}`
  }
  fileName += '.xlsx'

  // Save file
  XLSX.writeFile(wb, fileName)
}


onMounted(() => {
  getUserData();
  if (socket && socket.disconnected) {
    socket.connect();
  }

  socket.on('dataUpdate', (update) => {
    if (update.collection === 'Order') {
      console.log('🔄 Real-time Order update received:', update);
      fetchOrders(startDate.value, endDate.value);
    }
  });

  // Optional: debug connection events
  socket.on('connect', () => console.log('✅ Socket connected:', socket.id));
  socket.on('disconnect', () => console.log('❌ Socket disconnected'));
  socket.on('error', (error) => console.error('🚨 Socket error:', error));
});

onUnmounted(() => {
  socket.off('dataUpdate');
  socket.off('connect');
  socket.off('disconnect');
  socket.off('error');
});

// Fetch orders on component mount
fetchOrders()
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

/* Smooth scrolling */
.overflow-x-auto {
  scroll-behavior: smooth;
}


@media print {
  body * {
    visibility: hidden !important;
  }

  .print-section,
  .print-section * {
    visibility: visible !important;
  }

  .print-section {
    position: absolute !important;
    left: 0;
    top: 0;
    width: 100vw !important;
    background: white !important;
    box-shadow: none !important;
    z-index: 9999 !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  /* Hide header/filter section and any other non-table UI */
  .print-section~* {
    display: none !important;
  }

  /* Page break after every 20th row in the table */
  .print-section table tbody tr:nth-child(20n) {
    page-break-after: always;
    break-after: page;
  }
}

/* Custom date input styling */
input[type="date"] {
  position: relative;
}

input[type="date"]::-webkit-calendar-picker-indicator {
  position: absolute;
  right: 8px;
  color: #6b7280;
  cursor: pointer;
}
</style>