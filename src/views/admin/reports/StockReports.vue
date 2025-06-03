<script setup>
import { ref } from 'vue'

const startDate = ref('')
const endDate = ref('')
const isLoading = ref(false)
const printSection = ref(null)

const handleRefresh = () => {
  // Add your refresh logic here
  console.log('Refreshing data...')
}

const handleSearch = () => {
  // Add your search logic here
  console.log('Searching with dates:', startDate.value, endDate.value)
}

const printTable = () => {
  window.print()
}
</script>

<template>
    <div>
        <!-- Desktop View -->
        <div class="">
            <div class="bg-white shadow-md rounded-lg p-4 mb-4">
                <!-- Search and Filters -->
                <div class="mb-4">
                    <h2 class="text-lg font-semibold mb-4 ">Order Report</h2>

                    <div class="flex flex-wrap gap-4 mt-4 items-end">
                        <!-- Date Filters -->
                        <div>
                            <div class="flex gap-2 items-center">
                                <div class="flex flex-col">
                                    <label class="text-xs text-gray-600 mb-1">Start Date</label>
                                    <input 
                                        v-model="startDate" 
                                        type="date" 
                                        class="w-40 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div class="flex flex-col">
                                    <label class="text-xs text-gray-600 mb-1">End Date</label>
                                    <input 
                                        v-model="endDate" 
                                        type="date" 
                                        class="w-40 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <button @click="handleRefresh" class="py-2 px-3 bg-green-600 text-white rounded-md hover:bg-green-800 transition-colors mt-5">
                                    <i class="fa-solid fa-arrows-rotate"></i>
                                </button>
                                <button @click="handleSearch" class="py-2 px-3 bg-green-600 text-white rounded-md hover:bg-green-800 transition-colors mt-5">
                                    <i class="fa-solid fa-magnifying-glass"></i>
                                </button>
                            </div>
                        </div>
                        
                        <!-- Export Button -->
                        <div class="ml-auto my-auto" @click="printTable">
                            <button class="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                                <i class="fa-regular fa-file-pdf"></i>
                                <span class="text-sm">Export PDF</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="overflow-x-auto relative bg-white p-3 print-this" ref="printSection">
                <!-- Loading indicator -->
                <div v-if="isLoading" class="flex justify-center my-4">
                    <div class="animate-spin rounded-full h-6 w-6 border-b-2"></div>
                </div>
                
                <!-- Report Header -->
                <div class="text-center mb-8">
                    <img src="src/assets/rice.png" alt="Logo" class="w-28 mx-auto mb-4 drop-shadow-md" />
                    <h3 class="text-2xl font-semibold text-blue-900 tracking-wide">Order Report</h3>
                    <p class="text-gray-600 text-sm mt-2" v-if="startDate && endDate">
                        Period: {{ new Date(startDate).toLocaleDateString() }} - {{ new Date(endDate).toLocaleDateString() }}
                    </p>
                    <hr class="m-auto w-1/4 border-2  rounded-full mt-4" />
                </div>

                <!-- Orders Table -->
                <table class="w-full text-sm border border-gray-200 shadow-sm rounded-lg overflow-hidden">
                    <thead class="bg-gray-400 text-white text-center text-xs font-medium">
                        <tr>
                            <th class="border border-gray-300 p-3">No.</th>
                            <th class="border border-gray-300 p-3">Order ID</th>
                            <th class="border border-gray-300 p-3">Customer</th>
                            <th class="border border-gray-300 p-3">Total Amount</th>
                            <th class="border border-gray-300 p-3">Status</th>
                            <th class="border border-gray-300 p-3">Order Date</th>
                            <th class="border border-gray-300 p-3">Delivery Date</th>
                        </tr>
                    </thead>
                    <tbody class="text-center">
                        <!-- Sample data row - replace with your actual data -->
                        <tr class="odd:bg-white even:bg-blue-50 hover:bg-blue-100 transition-all duration-200">
                            <td class="border px-3 py-2">1</td>
                            <td class="border px-3 py-2">#ORD001</td>
                            <td class="border px-3 py-2">John Doe</td>
                            <td class="border px-3 py-2">$150.00</td>
                            <td class="border px-3 py-2">
                                <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Completed</span>
                            </td>
                            <td class="border px-3 py-2">2025-05-15</td>
                            <td class="border px-3 py-2">2025-05-20</td>
                        </tr>
                        <!-- Add more rows as needed or use v-for for dynamic data -->
                    </tbody>
                    <!-- No data state -->
                    <!-- <tbody v-if="!orders.length">
                        <tr class="text-center bg-white text-black">
                            <td colspan="7" class="border border-gray-300 p-4">
                                No orders found for the selected period
                            </td>
                        </tr>
                    </tbody> -->
                </table>
                
               
            </div>
        </div>
    </div>
</template>

<style>
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