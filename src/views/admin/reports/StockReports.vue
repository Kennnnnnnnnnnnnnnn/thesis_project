<template>
  <div class="p-4 md:p-6">
    <!-- Header Section -->
    <div class="bg-white rounded-xl shadow-sm p-4 mb-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row j items-start sm:items-center gap-4 mb-4">
        <h1 class="text-xl font-bold text-gray-900">Stock Reports</h1>


      </div>

      <!-- Filters -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Category Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select v-model="selectedCategory" class="w-full px-3 py-2 border rounded-lg">
            <option value="">All Categories</option>
            <option v-for="category in categories" :key="category._id" :value="category._id">
              {{ category.name }}
            </option>
          </select>
        </div>


        <!-- product -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Product</label>
          <select v-model="selectedProduct" class="w-full px-3 py-2 border rounded-lg">
            <option value="">All Products</option>
            <option v-for="product in products" :key="product._id" :value="product._id">
              {{ product.name }}
            </option>
          </select>
        </div>

        <!-- Stock Level Filter -->
        <!-- <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Stock Level</label>
          <select v-model="stockLevel" class="w-full px-3 py-2 border rounded-lg">
            <option value="">All Levels</option>
            <option value="low">Low Stock (&lt; 10)</option>
            <option value="medium">Medium Stock (10–50)</option>
            <option value="high">High Stock (&gt; 50)</option>
          </select>
        </div> -->

        <!-- Action & Export/Print Buttons Redesigned -->
        <div class="flex gap-2 items-end mt-2">
          <button @click="handleRefresh"
            class="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 shadow-sm transition-all duration-150">
            <i class="fas fa-sync-alt"></i>
            <span class="hidden sm:inline">Refresh</span>
          </button>
          <button @click="handleSearch"
            class="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow-sm font-medium transition-all duration-150">
            <i class="fas fa-search"></i>
            <span>Search</span>
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

    <!-- Table Section -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden print-section">

      <div class="flex flex-col items-center py-6 gap-2 print-title">
        <!-- <img src="@/assets/rice.png" alt="Logo" class="h-16 w-16 object-contain mb-2" style="margin: 0 auto;" /> -->
        <h1 class="text-2xl font-bold text-black-800 text-center ">Taing EangHuot</h1>
        <h2 class="text-base font-semibold text-gray-700 text-center">បញ្ជីរបាយការណ៍ស្តុកទំនិញ</h2>
        <div class="w-32 border-t-2 border-dashed border-gray-400 mx-auto my-2"></div>
      </div>
      <div class="print-table">
        <div v-if="isLoading" class="p-8 text-center">
          <div class="animate-spin h-8 w-8 border-2 border-amber-500 border-t-transparent rounded-full mx-auto"></div>
          <p class="mt-2 text-gray-600">Loading stocks...</p>
        </div>
        <div class="hidden md:block overflow-x-auto">
          <template v-if="stocks.length > 0">
            <table class="w-full">
              <thead class="bg-gray-50 text-sm">
                <tr>
                  <th class="text-left p-4">#</th>
                  <th class="text-left p-4">Product</th>
                  <th class="text-left p-4">Category</th>
                  <th class="text-center p-4">Current Stock</th>
                  <th class="text-center p-4">Last Purchase</th>
                  <th class="text-center p-4">Min/Max</th>
                  <th class="text-center p-4">Status</th>
                  <th class="text-center p-4">Last Updated</th>
                </tr>
              </thead>
              <tbody class="divide-y">
                <tr v-for="(stock, index) in stocks" :key="stock._id" class="hover:bg-gray-50">
                  <td class="p-4">{{ index + 1 }}</td>
                  <td class="p-4">
                    <div class="flex items-center gap-2">
                      <div class="w-8 h-8 bg-gray-100 rounded flex-shrink-0">
                        <img v-if="stock.imageURL" :src="stock.imageURL" :alt="stock.name"
                          class="w-full h-full object-cover rounded" />
                        <div v-else class="w-full h-full flex items-center justify-center">
                          <i class="fas fa-box text-gray-400"></i>
                        </div>
                      </div>
                      <div>
                        <p class="text-sm font-medium">{{ stock.name }}</p>
                        <!-- <p class="text-xs text-gray-500">{{ stock.description || 'No description' }}</p> -->
                      </div>
                    </div>
                  </td>
                  <td class="p-4">
                    <p class="text-sm">
                      {{
                        (stock.categoryId && typeof stock.categoryId === 'object' && stock.categoryId.name)
                          ? stock.categoryId.name
                          : (stock.productId && stock.productId.categoryId && typeof stock.productId.categoryId === 'object'
                            && stock.productId.categoryId.name)
                            ? stock.productId.categoryId.name
                            : 'No Category'
                      }}
                    </p>
                  </td>
                  <td class="p-4 text-center">
                    <p class="font-medium" :class="[
                      stock.quantity < stock.minThreshold ? 'text-red-600' : 'text-gray-900'
                    ]">{{ stock.quantity }} {{ stock.purchaseProducts?.unit || 'kg' }}</p>
                  </td>
                  <td class="p-4 text-center">
                    <div v-if="stock.lastPurchase" class="text-sm">
                      <p class="font-medium">{{ stock.lastPurchase.quantity }} {{ stock.lastPurchase.unit }}</p>
                      <p class="text-xs text-gray-500">{{ formatCurrency(stock.lastPurchase.unitPrice) }}/unit</p>
                    </div>
                    <p v-else class="text-sm text-gray-500">-</p>
                  </td>
                  <td class="p-4 text-center">
                    <p class="text-sm">{{ stock.minThreshold }}/{{ stock.maxCapacity }}</p>
                  </td>
                  <td class="p-4 text-center">
                    <span :class="[
                      'px-2 py-1 rounded text-xs font-medium',
                      stock.isOutOfStock ? 'bg-red-100 text-red-700' :
                        stock.quantity < stock.minThreshold ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                    ]">
                      {{ stock.isOutOfStock ? 'Out of Stock' :
                        stock.quantity < stock.minThreshold ? 'Low Stock' : 'In Stock' }} </span>
                  </td>
                  <td class="p-4 text-center">
                    <p class="text-sm">{{ formatDate(stock.updatedAt || stock.createdAt) }}</p>
                    <p class="text-xs text-gray-500">{{ stock.updatedBy?.name || stock.createdBy?.name || '-' }}</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </template>
          <template v-else-if="!isLoading">
            <div class="w-full text-center p-8 text-gray-500 text-lg">No Data Found</div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>

// Print function: use window.print to print only the table

import apiURL from '@/api/config';
import formatDate from '@/composables/formatDate';
import socket from '@/services/socket';
import axios from 'axios';
import { onMounted, onUnmounted, ref } from 'vue';
import * as XLSX from 'xlsx';


const selectedCategory = ref('')
const stockLevel = ref('')
const isLoading = ref(false)
const stocks = ref([])
const categories = ref([])
const products = ref([])
const selectedProduct = ref('')


const printReport = () => {
  window.print();
};

const fetchCategories = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('Authentication token not found')
    }

    const response = await axios.get(`${apiURL}/api/getAllDocs/Category`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (response.data.success) {
      categories.value = response.data.data
    }
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
}


const fetchProduct = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('Authentication token not found')
    }

    const response = await axios.get(`${apiURL}/api/getAllDocs/Product`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (response.data.success) {
      products.value = response.data.data
    }
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
}


const fetchStocks = async () => {
  try {
    isLoading.value = true

    let dynamicConditions = []
    if (selectedCategory.value) {
      dynamicConditions.push({
        field: 'categoryId',
        operator: '=',
        value: selectedCategory.value
      })
    }

    if (selectedProduct.value) {
      dynamicConditions.push({
        field: 'productId',
        operator: '=',
        value: selectedProduct.value
      })
    }

    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('Authentication token not found')
    }

    const response = await axios.get(`${apiURL}/api/getAllDocs/Stock`, {
      params: {
        populate: JSON.stringify(['productId', 'categoryId', 'purchaseProducts', 'createdBy']),
        dynamicConditions: JSON.stringify(dynamicConditions),
        page: 1,
        limit: 100
      },
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (response.data.success) {
      stocks.value = response.data.data.map(stock => {
        // Try to get the populated category object, or look up by ID from categories
        let categoryObj = null;
        if (stock.categoryId && typeof stock.categoryId === 'object' && stock.categoryId.name) {
          categoryObj = stock.categoryId;
        } else if (stock.productId && stock.productId.categoryId && typeof stock.productId.categoryId === 'object' && stock.productId.categoryId.name) {
          categoryObj = stock.productId.categoryId;
        } else if (stock.categoryId && typeof stock.categoryId === 'string' && categories.value.length > 0) {
          categoryObj = categories.value.find(cat => cat._id === stock.categoryId) || null;
        }
        return {
          ...stock,
          name: stock.name || stock.productId?.name,
          description: stock.description || stock.productId?.description,
          lastPurchase: stock.purchaseProducts ? {
            quantity: stock.purchaseProducts.quantity,
            unitPrice: stock.purchaseProducts.unitPrice,
            unit: stock.purchaseProducts.unit
          } : null,
          categoryId: categoryObj
        };
      });
    }
  } catch (error) {
    console.error('Error fetching stocks:', error)
  } finally {
    isLoading.value = false
  }
}

const handleRefresh = () => {
  selectedCategory.value = ''
  selectedProduct.value = ''
  fetchStocks()
}

const handleSearch = () => {
  fetchStocks()
}



const formatCurrency = (amount) => {
  return new Intl.NumberFormat('km-KH', {
    style: 'decimal',
    maximumFractionDigits: 0
  }).format(amount) + '៛'
}

const exportToExcel = () => {
  const excelData = stocks.value.map((stock, index) => ({
    'No.': index + 1,
    'Product Name': stock.name,
    'Description': stock.description || '-',
    'Current Stock': stock.quantity,
    'Unit': stock.purchaseProducts?.unit || '-',
    'Min Threshold': stock.minThreshold,
    'Max Capacity': stock.maxCapacity,
    'Status': stock.isOutOfStock ? 'Out of Stock' :
      stock.quantity < stock.minThreshold ? 'Low Stock' :
        'In Stock',
    'Last Purchase Quantity': stock.lastPurchase?.quantity || '-',
    'Last Purchase Price': stock.lastPurchase?.unitPrice ? `${formatCurrency(stock.lastPurchase.unitPrice)}` : '-',
    'Last Restocked': stock.lastRestockedAt ? formatDate(stock.lastRestockedAt) : '-',
    'Last Sold': stock.lastSoldAt ? formatDate(stock.lastSoldAt) : '-',
    'Created At': formatDate(stock.createdAt),
    'Created By': stock.createdBy?.name || stock.createdBy || '-',
    'Updated At': stock.updatedAt ? formatDate(stock.updatedAt) : '-'
  }))

  const ws = XLSX.utils.json_to_sheet(excelData)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Stocks')
  XLSX.writeFile(wb, `stock_report_${new Date().toISOString().split('T')[0]}.xlsx`)
}

onMounted(() => {
  fetchCategories()
  fetchStocks()
  fetchProduct()

  // Connect socket if needed
  if (socket && socket.disconnected) {
    socket.connect();
  }

  // Listen for real-time updates to stocks
  socket.on('dataUpdate', (update) => {
    if (update.collection === 'Stock') {
      console.log('🔄 Real-time Stock update received:', update);
      fetchStocks();
    }
  });

  // Debug connection events (optional)
  socket.on('connect', () => console.log('✅ Socket connected:', socket.id));
  socket.on('disconnect', () => console.log('❌ Socket disconnected'));
  socket.on('error', (error) => console.error('🚨 Socket error:', error));
})

onUnmounted(() => {
  socket.off('dataUpdate');
  socket.off('connect');
  socket.off('disconnect');
  socket.off('error');
})

</script>

<style scoped>
@media print {

  body,
  html {
    background: white !important;
  }

  body>*:not(.print-section) {
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

  /* Show both print-title and print-table in print */
  .print-section>*:not(.print-title):not(.print-table) {
    display: none !important;
  }

  .print-title {
    display: block !important;
    visibility: visible !important;
  }
  .print-table {
    display: block !important;
  }
  .print-table * {
    visibility: visible !important;
  }
}

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