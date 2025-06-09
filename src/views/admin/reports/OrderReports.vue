<template>
  <div class="p-4 md:p-6 font-inter">
    <!-- Header Section -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-4 md:p-6 mb-6">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 md:gap-6">
        <!-- Title -->
        <div class="flex items-center gap-3 md:gap-4">
          <div class="p-2 md:p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 md:h-6 md:w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14,2 14,8 20,8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10,9 9,9 8,9"></polyline>
            </svg>
          </div>
          <div>
            <h1 class="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Order Reports</h1>
            <p class="text-xs md:text-sm text-gray-600 mt-0.5 font-medium">Generate and export order analytics</p>
          </div>
        </div>

        <!-- Export Button -->
        <div class="flex items-center gap-3">
          <button @click="printTable"
            class="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl text-xs md:text-sm font-semibold shadow-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 hover:scale-105">
            <i class="fas fa-file-pdf text-xs"></i>
            <span>Export Excel</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Filters Section -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-4 md:p-6 mb-6">
      <div class="flex flex-col lg:flex-row lg:items-end gap-4 md:gap-6">
        <!-- Date Filters -->
        <div class="flex flex-col sm:flex-row gap-4 flex-1">
          <div class="flex-1">
            <label class="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
            <input v-model="startDate" type="date"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all" />
          </div>
          <div class="flex-1">
            <label class="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
            <input v-model="endDate" type="date"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all" />
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-2 lg:gap-3">
          <button @click="handleRefresh"
            class="flex items-center justify-center p-3 lg:p-3.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 hover:text-gray-800 transition-all duration-200 hover:scale-105 border border-gray-200">
            <i class="fas fa-sync-alt text-sm"></i>
          </button>
          <button @click="handleSearch"
            class="flex items-center gap-2 px-4 lg:px-6 py-3 lg:py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl text-sm font-semibold shadow-lg hover:from-amber-600 hover:to-orange-700 transition-all duration-200 hover:scale-105">
            <i class="fas fa-search text-xs"></i>
            <span class="hidden sm:inline">Search</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Report Section -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden print-this" ref="printSection">
      <!-- Loading Overlay -->
      <div v-if="isLoading" class="absolute inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center z-10">
        <div class="flex items-center gap-3">
          <div class="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-2 border-amber-600 border-t-transparent"></div>
          <span class="text-gray-700 font-medium text-sm md:text-base">Generating report...</span>
        </div>
      </div>

      <!-- Report Header -->
      <div class="text-center p-6 md:p-8 border-b border-gray-100">
        <div class="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white mb-4 shadow-lg">
          <i class="fas fa-chart-line text-2xl md:text-3xl"></i>
        </div>
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-2">Order Report</h2>
        <p class="text-sm md:text-base text-gray-600 font-medium" v-if="startDate && endDate">
          Report Period: {{ formatDate(startDate) }} - {{ formatDate(endDate) }}
        </p>
        <p class="text-sm md:text-base text-gray-500" v-else>
          Select date range to generate report
        </p>
      </div>

      <!-- Table Container -->
      <div class="relative overflow-x-auto">
        <!-- Desktop Table View -->
        <div class="hidden md:block">
          <table class="min-w-full divide-y divide-gray-100">
            <thead class="bg-gray-50/50">
              <tr>
                <th class="px-4 lg:px-6 py-4 lg:py-5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">#</th>
                <th class="px-4 lg:px-6 py-4 lg:py-5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Order ID</th>
                <th class="px-4 lg:px-6 py-4 lg:py-5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Customer</th>
                <th class="px-4 lg:px-6 py-4 lg:py-5 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Amount</th>
                <th class="px-4 lg:px-6 py-4 lg:py-5 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                <th class="px-4 lg:px-6 py-4 lg:py-5 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Order Date</th>
                <th class="px-4 lg:px-6 py-4 lg:py-5 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Delivery Date</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-100">
              <!-- Sample Data Row -->
              <tr class="hover:bg-amber-50/50 transition-colors duration-200">
                <td class="px-4 lg:px-6 py-4 lg:py-5 whitespace-nowrap text-sm font-semibold text-gray-900">1</td>
                <td class="px-4 lg:px-6 py-4 lg:py-5 whitespace-nowrap">
                  <span class="inline-flex items-center px-2 lg:px-3 py-1 lg:py-1.5 rounded-lg lg:rounded-xl text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                    #ORD001
                  </span>
                </td>
                <td class="px-4 lg:px-6 py-4 lg:py-5 whitespace-nowrap">
                  <div class="flex items-center gap-3">
                    <div class="flex-shrink-0">
                      <div class="h-8 w-8 lg:h-10 lg:w-10 rounded-lg lg:rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center border border-amber-200">
                        <i class="fas fa-user text-amber-600 text-xs"></i>
                      </div>
                    </div>
                    <div class="text-sm font-bold text-gray-900">John Doe</div>
                  </div>
                </td>
                <td class="px-4 lg:px-6 py-4 lg:py-5 whitespace-nowrap text-center">
                  <span class="text-lg font-bold text-green-600">$150.00</span>
                </td>
                <td class="px-4 lg:px-6 py-4 lg:py-5 whitespace-nowrap text-center">
                  <span class="inline-flex items-center gap-1 lg:gap-2 px-2 lg:px-3 py-1 lg:py-1.5 rounded-lg lg:rounded-xl text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                    <i class="fas fa-check-circle text-xs"></i>
                    <span class="hidden lg:inline">Completed</span>
                  </span>
                </td>
                <td class="px-4 lg:px-6 py-4 lg:py-5 whitespace-nowrap text-center text-sm text-gray-600">2025-05-15</td>
                <td class="px-4 lg:px-6 py-4 lg:py-5 whitespace-nowrap text-center text-sm text-gray-600">2025-05-20</td>
              </tr>

              <!-- More sample rows -->
              <tr class="hover:bg-amber-50/50 transition-colors duration-200">
                <td class="px-4 lg:px-6 py-4 lg:py-5 whitespace-nowrap text-sm font-semibold text-gray-900">2</td>
                <td class="px-4 lg:px-6 py-4 lg:py-5 whitespace-nowrap">
                  <span class="inline-flex items-center px-2 lg:px-3 py-1 lg:py-1.5 rounded-lg lg:rounded-xl text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                    #ORD002
                  </span>
                </td>
                <td class="px-4 lg:px-6 py-4 lg:py-5 whitespace-nowrap">
                  <div class="flex items-center gap-3">
                    <div class="flex-shrink-0">
                      <div class="h-8 w-8 lg:h-10 lg:w-10 rounded-lg lg:rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center border border-amber-200">
                        <i class="fas fa-user text-amber-600 text-xs"></i>
                      </div>
                    </div>
                    <div class="text-sm font-bold text-gray-900">Jane Smith</div>
                  </div>
                </td>
                <td class="px-4 lg:px-6 py-4 lg:py-5 whitespace-nowrap text-center">
                  <span class="text-lg font-bold text-green-600">$220.50</span>
                </td>
                <td class="px-4 lg:px-6 py-4 lg:py-5 whitespace-nowrap text-center">
                  <span class="inline-flex items-center gap-1 lg:gap-2 px-2 lg:px-3 py-1 lg:py-1.5 rounded-lg lg:rounded-xl text-xs font-bold bg-yellow-100 text-yellow-700 border border-yellow-200">
                    <i class="fas fa-clock text-xs"></i>
                    <span class="hidden lg:inline">Pending</span>
                  </span>
                </td>
                <td class="px-4 lg:px-6 py-4 lg:py-5 whitespace-nowrap text-center text-sm text-gray-600">2025-06-01</td>
                <td class="px-4 lg:px-6 py-4 lg:py-5 whitespace-nowrap text-center text-sm text-gray-600">2025-06-05</td>
              </tr>

              <!-- Empty State -->
              <!-- <tr>
                <td :colspan="7" class="px-4 lg:px-6 py-12 lg:py-20 text-center">
                  <div class="flex flex-col items-center gap-4">
                    <div class="p-4 lg:p-6 rounded-xl lg:rounded-2xl bg-amber-50 border border-amber-200">
                      <i class="fas fa-chart-line text-3xl lg:text-5xl text-amber-400"></i>
                    </div>
                    <div>
                      <h3 class="text-base lg:text-lg font-bold text-gray-900">No orders found</h3>
                      <p class="text-xs lg:text-sm text-gray-600 mt-1 font-medium">No orders found for the selected period</p>
                    </div>
                  </div>
                </td>
              </tr> -->
            </tbody>
          </table>
        </div>

        <!-- Mobile Card View -->
        <div class="block md:hidden">
          <div class="divide-y divide-gray-100">
            <div class="p-4 hover:bg-amber-50/50 transition-colors">
              <div class="flex items-start justify-between mb-3">
                <div class="flex items-center gap-3">
                  <div class="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center border border-amber-200">
                    <i class="fas fa-user text-amber-600 text-sm"></i>
                  </div>
                  <div>
                    <h3 class="text-sm font-bold text-gray-900">John Doe</h3>
                    <p class="text-xs text-gray-500">#ORD001</p>
                  </div>
                </div>
                <span class="text-lg font-bold text-green-600">$150.00</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold bg-green-100 text-green-700">
                  <i class="fas fa-check-circle text-xs"></i>
                  Completed
                </span>
                <div class="text-right">
                  <p class="text-xs text-gray-500">Ordered: 2025-05-15</p>
                  <p class="text-xs text-gray-500">Delivered: 2025-05-20</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Report Summary -->
      <div class="px-4 md:px-6 py-4 md:py-6 border-t border-gray-100 bg-gray-50/30">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="text-center">
            <p class="text-xs md:text-sm text-gray-600 font-medium">Total Orders</p>
            <p class="text-lg md:text-2xl font-bold text-gray-900">2</p>
          </div>
          <div class="text-center">
            <p class="text-xs md:text-sm text-gray-600 font-medium">Total Revenue</p>
            <p class="text-lg md:text-2xl font-bold text-green-600">$370.50</p>
          </div>
          <div class="text-center">
            <p class="text-xs md:text-sm text-gray-600 font-medium">Completed</p>
            <p class="text-lg md:text-2xl font-bold text-green-600">1</p>
          </div>
          <div class="text-center">
            <p class="text-xs md:text-sm text-gray-600 font-medium">Pending</p>
            <p class="text-lg md:text-2xl font-bold text-yellow-600">1</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const startDate = ref('')
const endDate = ref('')
const isLoading = ref(false)
const printSection = ref(null)

const handleRefresh = () => {
  isLoading.value = true
  // Simulate API call
  setTimeout(() => {
    isLoading.value = false
    console.log('Data refreshed')
  }, 1000)
}

const handleSearch = () => {
  if (!startDate.value || !endDate.value) {
    alert('Please select both start and end dates')
    return
  }
  isLoading.value = true
  // Simulate API call
  setTimeout(() => {
    isLoading.value = false
    console.log('Searching with dates:', startDate.value, endDate.value)
  }, 1500)
}

const printTable = () => {
  window.print()
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
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

/* Smooth scrolling */
.overflow-x-auto {
  scroll-behavior: smooth;
}

/* Print Styles */
@media print {
  body * {
    visibility: hidden;
  }

  .print-this,
  .print-this * {
    visibility: visible;
    color: black !important;
  }

  .print-this {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }
  
  /* Hide buttons and interactive elements when printing */
  button {
    display: none !important;
  }
  
  /* Ensure proper styling for print */
  .bg-gradient-to-br,
  .bg-gradient-to-r {
    background: #f59e0b !important;
    -webkit-print-color-adjust: exact;
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