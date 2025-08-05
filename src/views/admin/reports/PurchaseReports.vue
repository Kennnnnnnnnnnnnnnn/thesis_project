<template>
  <div class="p-4 md:p-6">
    <!-- Header -->
    <div class="bg-white rounded-xl shadow-sm p-4 mb-6">

      <h1 class="text-xl font-bold text-gray-900">Purchase Reports</h1>



      <!-- Filters -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <!-- Start Date Picker -->
          <v-menu v-model="menuStart" :close-on-content-click="false" offset-y transition="scale-transition">
            <template #activator="{ props }">
              <div v-bind="props" class="relative w-full rounded-xl overflow-hidden">
                <input type="text" :value="formattedStartDate" readonly placeholder="Start Date"
                  class="w-full px-2 py-2 rounded-xl border border-gray-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-400" />
                <span class="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 pointer-events-none">
                  <i class="fas fa-calendar-alt"></i>
                </span>
              </div>
            </template>
            <v-date-picker v-model="startDate" @update:model-value="menuStart = false" :max="endDate"
              show-adjacent-months />
          </v-menu>

          <!-- End Date Picker -->
          <v-menu v-model="menuEnd" :close-on-content-click="false" offset-y transition="scale-transition">
            <template #activator="{ props }">
              <div v-bind="props" class="relative w-full rounded-xl overflow-hidden">
                <input type="text" :value="formattedEndDate" readonly placeholder="End Date"
                  class="w-full px-2 py-2 rounded-xl border border-gray-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-400" />
                <span class="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 pointer-events-none">
                  <i class="fas fa-calendar-alt"></i>
                </span>
              </div>
            </template>
            <v-date-picker v-model="endDate" @update:model-value="menuEnd = false" :min="startDate"
              show-adjacent-months />
          </v-menu>


          <!-- Supplier -->
          <!-- <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
          <select v-model="selectedSupplier" class="w-full px-3 py-2 border rounded-lg">
            <option v-for="supplier in suppliers" :key="supplier._id" :value="supplier._id">
              {{ supplier.name }}
            </option>
          </select>
        </div> -->

          <!-- Action Buttons -->

          <div class="flex gap-2 items-end mt-2">

            <button @click="handleRefresh"
              class="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 shadow-sm transition-all duration-150">
              <i class="fas fa-sync-alt"></i>
              <span class="hidden sm:inline">Refresh</span>
            </button>

            <button @click="handleSearch"
              class="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600  shadow-sm transition-all duration-150">
              <i class="fas fa-search"></i>
              <span class="hidden sm:inline">Search</span>
            </button>

            <button @click="exportToExcel"
              class="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 shadow-sm font-medium transition-all duration-150">
              <i class="fas fa-file-excel"></i>
              <span>Excel</span>
            </button>

            <button @click="printReport"
              class="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 shadow-sm font-medium transition-all duration-150">
              <i class="fas fa-print"></i>
              <span>Print</span>
            </button>
          </div>

        </div>
      </div>

    </div>



    <!-- Content Section -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden print-section">

      <!-- Print Title/Header -->
      <div class="flex flex-col items-center py-6 gap-2 print-title">
        <!-- <img src="@/assets/rice.png" alt="Logo" class="h-16 w-16 object-contain mb-2" style="margin: 0 auto;" /> -->
        <h1 class="text-2xl font-bold text-black-800 text-center">Taing EangHuot</h1>
        <h2 class="text-base font-semibold text-gray-700 text-center">បញ្ជីរបាយការណ៍ការទិញទំនិញរបស់ក្រុមហ៊ុន</h2>
        <div class="w-32 border-t-2 border-dashed border-gray-400 mx-auto my-2"></div>
      </div>
      <!-- Loading -->
      <div v-if="isLoading" class="p-8 text-center">
        <div class="animate-spin h-8 w-8 border-2 border-amber-500 border-t-transparent rounded-full mx-auto"></div>
        <p class="mt-2 text-gray-600">Loading purchases...</p>
      </div>


      <!-- ✅ Desktop Table -->
      <div class="hidden md:block overflow-x-auto" v-if="purchases.length > 0">
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
                      <img v-if="product.imageURL" :src="product.imageURL" class="w-full h-full object-cover rounded" />
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
                <span class="px-2 py-1 rounded text-xs font-medium"
                  :class="purchase.status ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'">
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

      <!-- ✅ Mobile Cards -->
      <div class="md:hidden divide-y" v-if="purchases.length > 0">
        <div v-for="purchase in purchases" :key="purchase._id" class="p-4">
          <div class="flex justify-between items-start mb-2">
            <span class="px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-700">
              #{{ purchase._id.slice(-6).toUpperCase() }}
            </span>
            <span class="px-2 py-1 rounded text-xs font-medium"
              :class="purchase.status ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'">
              {{ purchase.status ? 'Completed' : 'Pending' }}
            </span>
          </div>
          <div class="space-y-2 mt-2">
            <div v-for="product in purchase.products" :key="product.id" class="flex items-center gap-2">
              <div class="w-8 h-8 bg-gray-100 rounded flex-shrink-0">
                <img v-if="product.imageURL" :src="product.imageURL" class="w-full h-full object-cover rounded" />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <i class="fas fa-box text-gray-400"></i>
                </div>
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium">{{ product.name }}</p>
                <p class="text-xs text-gray-500">{{ product.quantity }} {{ product.unit }} × {{
                  formatCurrency(product.unitPrice) }}</p>
              </div>
              <p class="text-sm font-medium text-right">
                {{ formatCurrency(product.totalPrice) }}
              </p>
            </div>
          </div>
          <div class="mt-3 text-right text-sm text-gray-500">
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
import apiURL from '@/api/config';
import formatDate from '@/composables/formatDate';
import socket from '@/services/socket';
import axios from 'axios';
import dayjs from 'dayjs';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import * as XLSX from 'xlsx';


const startDate = ref(null)
const endDate = ref(null)
const menuStart = ref(false)
const menuEnd = ref(false)
const selectedSupplier = ref('')
const isLoading = ref(false)
const purchases = ref([])
const suppliers = ref([])

const formattedStartDate = computed(() =>
  startDate.value ? dayjs(startDate.value).format('YYYY-MM-DD') : ''
)

const formattedEndDate = computed(() =>
  endDate.value ? dayjs(endDate.value).format('YYYY-MM-DD') : ''
)

const printReport = () => {
  window.print();
};



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

const handleRefresh = () => {
  startDate.value = null
  endDate.value = null
  selectedSupplier.value = ''
  fetchPurchases()
}
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
@media print {
  body, html {
    background: white !important;
  }
  body > *:not(.print-section) {
    display: none !important;
  }
  .print-section {
    position: fixed !important;
    top: 0;
    left: 0;
    width: 100vw !important;
    height: 100vh !important;
    background: white !important;
    z-index: 9999 !important;
    box-shadow: none !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: visible !important;
  }
  .print-section > *:not(.print-title):not(.md\:block):not(.overflow-x-auto) {
    display: none !important;
  }
  .print-title {
    display: block !important;
    visibility: visible !important;
  }
  .md\:block, .overflow-x-auto {
    display: block !important;
    visibility: visible !important;
  }
  .print-section * {
    visibility: visible !important;
  }
}
</style>