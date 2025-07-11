<template>
  <div class="p-4 md:p-6 font-khmer">
    <!-- Header Section -->
    <div class="bg-white rounded-xl shadow-sm p-4 mb-6 flex justify-between items-center">
      <h1 class="text-xl font-bold text-gray-900">Purchase Reports</h1>
      <button @click="exportToExcel" class="px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600">
        <i class="fas fa-file-excel mr-2"></i>Export Excel
      </button>
    </div>

    <!-- Filters Section -->
    <div class="bg-white rounded-xl shadow-sm p-4 mb-6">
      <div class="flex flex-wrap gap-4 items-end">
        <div class="flex-1 min-w-[200px]">
          <label class="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input v-model="startDate" type="date" class="w-full px-3 py-2 border rounded-lg" />
        </div>
        <div class="flex-1 min-w-[200px]">
          <label class="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <input v-model="endDate" type="date" class="w-full px-3 py-2 border rounded-lg" />
        </div>
        <div class="flex-1 min-w-[200px]">
          <label class="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
          <select v-model="selectedSupplier" class="w-full px-3 py-2 border rounded-lg">
            <option value="">All Suppliers</option>
            <option v-for="supplier in suppliers" :key="supplier._id" :value="supplier._id">
              {{ supplier.name }}
            </option>
          </select>
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
    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
      <!-- Loading State -->
      <div v-if="isLoading" class="p-8 text-center">
        <div class="animate-spin h-8 w-8 border-2 border-amber-500 border-t-transparent rounded-full mx-auto"></div>
        <p class="mt-2 text-gray-600">Loading purchases...</p>
      </div>

      <div class="text-center mb-8">
        <!-- <img src="@/assets/logo-ambel.png" alt="Logo" class="w-28 mx-auto mb-4 drop-shadow-md" /> -->

        <h3 class="text-2xl font-semibold tracking-wide text-black-600">Purchase Report</h3>

        <p class="text-gray-600 text-sm mt-1 mb-3">
          A summary of your purchase transactions, supplier details, and received items.
        </p>

        <hr class="m-auto w-1/4 border border-slate rounded-full" />
      </div>

      <!-- Desktop Table -->
      <div v-if="purchases.length > 0" class="hidden md:block overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 text-sm">
            <tr>
              <th class="text-left p-4">#</th>
              <th class="text-left p-4">Purchase ID</th>
              <th class="text-left p-4">Products</th>
              <th class="text-center p-4">Total Items</th>
              <th class="text-center p-4">Total Cost</th>
              <th class="text-center p-4">Status</th>
              <th class="text-center p-4">Date</th>
            </tr>
          </thead>
          <tbody class="divide-y">
            <tr v-for="(purchase, index) in purchases" :key="purchase._id" class="hover:bg-gray-50">
              <td class="p-4">{{ index + 1 }}</td>
              <td class="p-4">
                <span class="px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-700">
                  #{{ purchase._id.slice(-6).toUpperCase() }}
                </span>
              </td>
              <td class="p-4">
                <div class="flex flex-col gap-1">
                  <div v-for="product in purchase.products" :key="product.id" class="flex items-center gap-2">
                    <div class="w-8 h-8 bg-gray-100 rounded flex-shrink-0">
                      <img v-if="product.imageURL" :src="product.imageURL" :alt="product.name"
                        class="w-full h-full object-cover rounded">
                      <div v-else class="w-full h-full flex items-center justify-center">
                        <i class="fas fa-box text-gray-400"></i>
                      </div>
                    </div>
                    <div>
                      <p class="text-sm font-medium">{{ product.name }}</p>
                      <p class="text-xs text-gray-500">{{ product.quantity }} {{ product.unit }} × {{
                        formatCurrency(product.unitPrice) }}</p>
                    </div>
                  </div>
                </div>
              </td>
              <td class="p-4 text-center">
                {{purchase.products.reduce((sum, p) => sum + p.quantity, 0)}}
              </td>
              <td class="p-4 text-center font-medium">
                {{formatCurrency(purchase.products.reduce((sum, p) => sum + p.totalPrice, 0))}}
              </td>
              <td class="p-4 text-center">
                <span class="px-2 py-1 rounded text-xs font-medium" :class="{
                  'bg-green-100 text-green-700': purchase.status,
                  'bg-yellow-100 text-yellow-700': !purchase.status
                }">
                  {{ purchase.status ? 'Completed' : 'Pending' }}
                </span>
              </td>
              <td class="p-4 text-center text-sm text-gray-500">
                {{ formatDate(purchase.createdAt) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Cards -->
      <div v-else-if="purchases.length > 0" class="md:hidden divide-y">
        <div v-for="purchase in purchases" :key="purchase._id" class="p-4">
          <div class="flex justify-between items-start mb-3">
            <span class="px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-700">
              #{{ purchase._id.slice(-6).toUpperCase() }}
            </span>
            <span class="px-2 py-1 rounded text-xs font-medium" :class="{
              'bg-green-100 text-green-700': purchase.status,
              'bg-yellow-100 text-yellow-700': !purchase.status
            }">
              {{ purchase.status ? 'Completed' : 'Pending' }}
            </span>
          </div>
          <div class="space-y-2">
            <div v-for="product in purchase.products" :key="product.id" class="flex items-center gap-2">
              <div class="w-8 h-8 bg-gray-100 rounded flex-shrink-0">
                <img v-if="product.imageURL" :src="product.imageURL" :alt="product.name"
                  class="w-full h-full object-cover rounded">
                <div v-else class="w-full h-full flex items-center justify-center">
                  <i class="fas fa-box text-gray-400"></i>
                </div>
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium">{{ product.name }}</p>
                <p class="text-xs text-gray-500">{{ product.quantity }} {{ product.unit }} × {{
                  formatCurrency(product.unitPrice) }}</p>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium">{{ formatCurrency(product.totalPrice) }}</p>
              </div>
            </div>
          </div>
          <div class="mt-3 flex justify-between items-center text-sm ">
            {{ formatDate(purchase.createdAt) }}
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="p-8 text-center">
        <i class="fas fa-shopping-cart text-4xl text-gray-400 mb-2"></i>
        <p class="text-gray-600">No purchases found</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import apiURL from '@/api/config'
import axios from 'axios'
import { ref, onMounted, onUnmounted } from 'vue'
import * as XLSX from 'xlsx'
import formatDate from '@/composables/formatDate';
import socket from '@/services/socket';

const startDate = ref('')
const endDate = ref('')
const selectedSupplier = ref('')
const isLoading = ref(false)
const purchases = ref([])
const suppliers = ref([])

const fetchSuppliers = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('Authentication token not found')

    const response = await axios.get(`${apiURL}/api/getAllDocs/Supplier`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })

    if (response.data.success) {
      suppliers.value = response.data.data
    }
  } catch (error) {
    console.error('Error fetching suppliers:', error)
  }
}

const fetchPurchases = async () => {
  try {
    isLoading.value = true

    let dynamicConditions = []
    if (selectedSupplier.value) {
      dynamicConditions.push({
        field: 'supplierId',
        operator: '=',
        value: selectedSupplier.value
      })
    }

    if (startDate.value && endDate.value) {
      dynamicConditions.push({
        field: 'createdAt',
        operator: '>=',
        value: new Date(startDate.value).toISOString()
      }, {
        field: 'createdAt',
        operator: '<=',
        value: new Date(endDate.value).toISOString()
      })
    }

    const token = localStorage.getItem('token')
    if (!token) throw new Error('Authentication token not found')

    const response = await axios.get(`${apiURL}/api/getAllDocs/PurchaseProduct`, {
      params: {
        populate: JSON.stringify(['products', 'supplierId', 'createdBy']),
        dynamicConditions: JSON.stringify(dynamicConditions),
        page: 1,
        limit: 100
      },
      headers: { 'Authorization': `Bearer ${token}` }
    })

    if (response.data.success) {
      purchases.value = response.data.data
    }
  } catch (error) {
    console.error('Error fetching purchases:', error)
  } finally {
    isLoading.value = false
  }
}

const handleRefresh = () => fetchPurchases()
const handleSearch = () => fetchPurchases()

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('km-KH', {
    style: 'decimal',
    maximumFractionDigits: 0
  }).format(amount) + '៛'
}

const exportToExcel = () => {
  const excelData = purchases.value.flatMap((purchase, index) =>
    purchase.products.map(product => ({
      'No.': index + 1,
      'Purchase ID': '#' + purchase._id.slice(-6).toUpperCase(),
      'Product Name': product.name,
      'Quantity': product.quantity,
      'Unit': product.unit,
      'Unit Price': formatCurrency(product.unitPrice),
      'Total Price': formatCurrency(product.totalPrice),
      'Status': purchase.status ? 'Completed' : 'Pending',
      'Supplier': purchase.supplierId?.name || '-',
      'Purchase Date': formatDate(purchase.createdAt),
      'Created By': purchase.createdBy?.name || purchase.createdBy || '-',
      'Updated At': purchase.updatedAt ? formatDate(purchase.updatedAt) : '-'
    }))
  )

  const ws = XLSX.utils.json_to_sheet(excelData)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Purchases')
  XLSX.writeFile(wb, `purchase_report_${new Date().toISOString().split('T')[0]}.xlsx`)
}

onMounted(() => {
  fetchSuppliers()
  fetchPurchases()

  if (socket && socket.disconnected) {
    socket.connect()
  }

  socket.on('dataUpdate', (update) => {
    if (update.collection === 'PurchaseProduct') {
      console.log('🔄 Real-time Purchase update received:', update)
      fetchPurchases()
    }
  })

  socket.on('connect', () => console.log('✅ Socket connected:', socket.id))
  socket.on('disconnect', () => console.log('❌ Socket disconnected'))
  socket.on('error', (error) => console.error('🚨 Socket error:', error))
})

onUnmounted(() => {
  socket.off('dataUpdate')
  socket.off('connect')
  socket.off('disconnect')
  socket.off('error')
})
</script>


<style scoped>
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

.overflow-x-auto {
  scroll-behavior: smooth;
}
</style>