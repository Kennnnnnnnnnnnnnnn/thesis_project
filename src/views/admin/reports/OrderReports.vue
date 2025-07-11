<template>
  <div class="p-4 md:p-6 font-khmer">
    <!-- Header Section -->
    <div class="bg-white rounded-xl shadow-sm p-4 mb-6 flex justify-between items-center">
      <h1 class="text-xl font-bold text-gray-900">Order Reports</h1>
      <button @click="exportToExcel" class="px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600">
        <i class="fas fa-file-excel mr-2"></i>Export Excel
      </button>
    </div>

    <!-- Filters Section -->
    <div class="bg-white rounded-xl shadow-sm p-4 mb-6">
      <div class="flex flex-wrap gap-4 items-end">
        <div class="flex-1">
          <label for="icondisplay" class="font-bold block mb-2">Start Date </label>
          <DatePicker v-model="startDate" showIcon fluid iconDisplay="input" inputId="icondisplay" />
        </div>
        <div class="flex-1 ">
          <label for="icondisplay" class="font-bold block mb-2"> End Date </label>
          <DatePicker v-model="endDate" showIcon fluid iconDisplay="input" inputId="icondisplay" />
        </div>
        <div class="flex gap-2">
          <button @click="handleRefresh" class="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">
            <i class="fas fa-sync-alt"></i>
          </button>
          <button @click="handleSearch" class="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600">
            Search
          </button>
        </div>
      </div>
    </div>



    <!-- Table Section -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden print-this" ref="printSection">
      <!-- Loading Overlay -->
      <div v-if="isLoading" class="absolute inset-0 bg-opacity-70 flex items-center justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-900"></div>
      </div>

      <div class="text-center mb-8">
        <!-- <img src="@/assets/logo-ambel.png" alt="Logo" class="w-28 mx-auto mb-4 drop-shadow-md" /> -->

        <h3 class="text-2xl font-semibold tracking-wide text-black-600">Order Report</h3>

        <p class="text-gray-600 text-sm mt-1 mb-3">
          A summary of your recent orders, order statuses, and fulfillment activities.
        </p>

        <hr class="m-auto w-1/4 border border-slate rounded-full" />
      </div>
     


      <!-- Desktop Table -->
      <div v-if="orders.length > 0" class="hidden md:block overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-100 text-sm">
            <tr>
              <th class="text-left p-4">#</th>
              <th class="text-left p-4">Items</th>
              <th class="text-center p-4">Total</th>
              <th class="text-center p-4">Payment</th>
              <th class="text-center p-4">Status</th>
              <th class="text-center p-4">Date</th>
            </tr>
          </thead>
          <tbody class="divide-y">
            <tr v-for="(order, index) in orders" :key="order._id" class="hover:bg-gray-50">
              <td class="p-4">{{ index + 1 }}</td>
              <td class="p-4">
                <div v-for="item in order.items" :key="item._id" class="flex items-center gap-2 mb-1 last:mb-0">
                  <div class="w-8 h-8 bg-gray-100 rounded flex-shrink-0">
                    <img v-if="item.image" :src="item.image" :alt="item.name"
                      class="w-full h-full object-cover rounded">
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
              <td class="p-4 text-center">
                <span :class="[
                  'px-2 py-1 rounded text-xs font-medium',
                  order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' :
                    'bg-yellow-100 text-yellow-700'
                ]">
                  {{ order.paymentStatus }}
                </span>
              </td>
              <td class="p-4 text-center">
                <span :class="[
                  'px-2 py-1 rounded text-xs font-medium',
                  order.status === 'completed' ? 'bg-green-100 text-green-700' :
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
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
      <div v-else-if="orders.length > 0" class="md:hidden divide-y">
        <div v-for="order in orders" :key="order._id" class="p-4">
          <div class="flex justify-between items-start mb-3">
            <span class="text-lg font-medium">៛{{ order.totalCost?.toFixed(2) || '0.00' }}</span>
            <div class="flex flex-col items-end gap-1">
              <span :class="[
                'px-2 py-1 rounded text-xs font-medium',
                order.status === 'completed' ? 'bg-green-100 text-green-700' :
                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
              ]">{{ order.status }}</span>
              <span :class="[
                'px-2 py-1 rounded text-xs font-medium',
                order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' :
                  'bg-yellow-100 text-yellow-700'
              ]">{{ order.paymentStatus }}</span>
            </div>
          </div>
          <div class="space-y-2">
            <div v-for="item in order.items" :key="item._id" class="flex items-center gap-2">
              <div class="w-10 h-10 bg-gray-100 rounded flex-shrink-0">
                <img v-if="item.image" :src="item.image" :alt="item.name" class="w-full h-full object-cover rounded">
                <div v-else class="w-full h-full flex items-center justify-center">
                  <i class="fas fa-box text-gray-400"></i>
                </div>
              </div>
              <div>
                <p class="font-medium">{{ item.name }}</p>
                <p class="text-sm text-gray-500">៛{{ item.price }} × {{ item.quantity }}</p>
              </div>
            </div>
          </div>
          <div class="mt-3 flex justify-between items-center text-sm text-gray-500">
            <span>{{ formatDate(order.createdAt) }}</span>
            <span>{{ order.paymentMethod }}</span>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="p-8 text-center">
        <i class="fas fa-inbox text-4xl text-gray-400 mb-2"></i>
        <p class="text-gray-600">No orders found</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import apiURL from '@/api/config'
import axios from 'axios'
import { ref } from 'vue'
import * as XLSX from 'xlsx'
import formatDate from '@/composables/formatDate';
import socket from '@/services/socket';
import { onMounted, onUnmounted } from 'vue';

import DatePicker from 'primevue/datepicker';

const icondisplay = ref();

const startDate = ref('')
const endDate = ref('')
const isLoading = ref(false)
const printSection = ref(null)
const orders = ref([])

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
        populate: JSON.stringify(['userId']),
        dynamicConditions: JSON.stringify(dynamicConditions)
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

const handleRefresh = () => {
  fetchOrders(startDate.value, endDate.value)
}

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

/* Remove print styles since we're not using them anymore */
@media print {
  /* Remove this entire block */
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