<template>
  <div class="p-4 md:p-6 bg-gray-50 min-h-screen font-inter overflow-y-auto ">
    <!-- Header Section -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-6 mb-6">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <!-- Title -->
        <div class="flex items-center gap-4">
          <div class="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 3v16a2 2 0 01-2 2H6a2 2 0 01-2-2V3"></path>
              <path d="M8 21V7"></path>
              <path d="M16 21V7"></path>
              <path d="M12 7V3"></path>
              <path d="M2 7h20"></path>
            </svg>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Inventory Management</h1>
            <!-- <p class="text-sm text-gray-600 mt-0.5 font-medium">Manage your stock levels and inventory</p> -->
          </div>
        </div>
        
        <!-- Controls -->
        <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <!-- Items per page -->
          <div class="relative">
            <button @click="toggleDropdownRow"
              class="flex items-center justify-between min-w-[110px] px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all">
              <span>{{ selectedItem }} items</span>
              <i class="fas fa-chevron-down ml-2 text-xs transition-transform duration-200" :class="{ 'rotate-180': isOpen }"></i>
            </button>
            <div v-show="isOpen"
              class="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 shadow-xl rounded-xl py-2 z-50 backdrop-blur-sm">
              <div v-for="item in items" :key="item" @click="selectItem(item)"
                class="px-4 py-2.5 text-sm text-gray-700 cursor-pointer hover:bg-amber-50 transition-colors font-medium">
                {{ item }} items
              </div>
            </div>
          </div>

          <!-- Filters -->
          <select v-model="categoryFilter" class="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 bg-white transition-all">
            <option value="all">All Categories</option>
            <option v-for="category in categories" :key="category._id" :value="category._id">
              {{ category.name }}
            </option>
          </select>

          <!-- Enhanced Filters -->
          <select v-model="stockStatusFilter" class="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 bg-white transition-all">
            <option value="all">All Status</option>
            <option value="in-stock">In Stock</option>
            <option value="low-stock">Low Stock</option>
            <option value="critical-stock">Very Low Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>

          <!-- Add Button -->
          <button
            class="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg hover:from-amber-600 hover:to-orange-700 transition-all duration-200 transform hover:scale-[1.02] hover:shadow-xl"
            @click="openModal">
            <i class="fas fa-plus text-xs"></i>
            Add Item
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <!-- Total Products -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Total Products</p>
            <p class="text-3xl font-bold text-gray-900 tracking-tight">{{ totalItems }}</p>
          </div>
          <div class="p-4 rounded-2xl bg-amber-50 border border-amber-100">
            <i class="fas fa-box text-amber-600 text-xl"></i>
          </div>
        </div>
      </div>
      
      <!-- In Stock -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">In Stock</p>
            <p class="text-3xl font-bold text-green-600 tracking-tight">{{ inStockItems }}</p>
          </div>
          <div class="p-4 rounded-2xl bg-green-50 border border-green-100">
            <i class="fas fa-circle-check text-green-600 text-xl"></i>
          </div>
        </div>
      </div>
      
      <!-- Low Stock (includes critical) -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Low Stock</p>
            <p class="text-3xl font-bold text-orange-600 tracking-tight">{{ lowStockItems }}</p>
          </div>
          <div class="p-4 rounded-2xl bg-orange-50 border border-orange-100">
            <i class="fas fa-triangle-exclamation text-orange-600 text-xl"></i>
          </div>
        </div>
      </div>
      
      <!-- Out of Stock -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Out of Stock</p>
            <p class="text-3xl font-bold text-red-600 tracking-tight">{{ outOfStockItems }}</p>
          </div>
          <div class="p-4 rounded-2xl bg-red-50 border border-red-100">
            <i class="fas fa-circle-xmark text-red-600 text-xl"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Table Card -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden">
      <!-- Table Header -->
      <div class="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
        <h3 class="text-lg font-bold text-gray-900 tracking-tight">Inventory Items</h3>
        <p class="text-sm text-gray-600 mt-1 font-medium">{{ filteredStockData.length }} items total</p>
      </div>

      <!-- Table Container -->
      <div class="relative overflow-hidden">
        <!-- Loading Overlay -->
        <div v-if="isLoading" class="absolute inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center z-10">
          <div class="flex items-center gap-3">
            <div class="animate-spin rounded-full h-8 w-8 border-2 border-amber-600 border-t-transparent"></div>
            <span class="text-gray-700 font-medium">Loading...</span>
          </div>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-100">
            <thead class="bg-gray-50/50">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">#</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Product</th>
                <th class="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Category</th>
                <th class="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Stock Level</th>
                <th class="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Unit</th>
                <!-- <th class="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Thresholds</th> -->
                <th class="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                <th class="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-100">
              <tr v-for="(stock, index) in filteredStockData" :key="stock._id"
                class="hover:bg-amber-50/50 transition-colors duration-200">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  {{ index + 1 }}
                </td>
                
                <!-- Product Column -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-4">
                    <div class="flex-shrink-0">
                      <div v-if="getProductImage(stock.productId)" 
                        class="h-12 w-12 rounded-2xl bg-gray-100 overflow-hidden border border-gray-200">
                        <img :src="getProductImage(stock.productId)" alt="Product" 
                          class="h-full w-full object-cover" />
                      </div>
                      <div v-else 
                        class="h-12 w-12 rounded-2xl bg-gray-100 flex items-center justify-center border border-gray-200">
                        <i class="fas fa-box text-gray-400"></i>
                      </div>
                    </div>
                    <div>
                      <div class="text-sm font-bold text-gray-900">
                        {{ getProductName(stock.productId) }}
                      </div>
                      <div class="text-xs text-gray-500 font-medium mt-0.5">
                        ID: {{ getProductIdCustom(stock.productId) }}
                      </div>
                    </div>
                  </div>
                </td>
                
                <!-- Category Column -->
                <td class="px-6 py-4 whitespace-nowrap text-center font-khmer">
                  <span class="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                    {{ getCategoryName(stock.categoryId) }}
                  </span>
                </td>
                
                <!-- Stock Level Column -->
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <div class="flex flex-col items-center gap-2.5">
                    <span class="text-lg font-bold text-gray-900">{{ stock.quantity }}</span>
                    <div class="w-16 bg-gray-200 rounded-full h-2.5">
                      <div class="h-2.5 rounded-full transition-all duration-300"
                        :class="getStockBarColor(stock)"
                        :style="{ width: getStockPercentage(stock) + '%' }"></div>
                    </div>
                    <span class="text-xs text-gray-500 font-medium">
                      {{ Math.round(getStockPercentage(stock)) }}%
                    </span>
                  </div>
                </td>
                
                <!-- Unit Column -->
                <td class="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-700 font-medium">
                  {{ stock.unit }}
                </td>
                
                <!-- Thresholds Column -->
                <!-- <td class="px-6 py-4 whitespace-nowrap text-center">
                  <div class="text-xs space-y-1.5">
                    <div class="flex items-center justify-center gap-1.5">
                      <span class="text-gray-500 font-medium">Min:</span>
                      <span class="font-bold text-orange-600">{{ stock.minThreshold }}</span>
                    </div>
                    <div class="flex items-center justify-center gap-1.5">
                      <span class="text-gray-500 font-medium">Max:</span>
                      <span class="font-bold text-amber-600">{{ stock.maxCapacity }}</span>
                    </div>
                  </div>
                </td> -->
                
                <!-- Status Column -->
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold"
                    :class="getStockStatusClass(stock)">
                    <i :class="getStockStatusIcon(stock)" class="text-xs"></i>
                    {{ getStockStatusText(stock) }}
                  </span>
                  <!-- Optional: Add stock level indicator -->
                  <div class="text-xs text-gray-500 mt-1 font-medium">
                    {{ getStockLevel(stock) }}
                  </div>
                </td>
                
                <!-- Actions Column -->
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <div class="flex items-center justify-center gap-2">
                    <!-- Edit Button -->
                    <button 
                      class="p-2.5 rounded-xl hover:bg-amber-50 text-amber-600 transition-all duration-200 hover:scale-110 border border-transparent hover:border-amber-200" 
                      @click="editStock(stock)" 
                      title="Edit stock details">
                      <i class="fas fa-edit text-sm"></i>
                    </button>
                    
                    <!-- History Button -->
                    <!-- <button 
                      class="p-2.5 rounded-xl hover:bg-orange-50 text-orange-600 transition-all duration-200 hover:scale-110 border border-transparent hover:border-orange-200" 
                      @click="viewStockHistory(stock._id)" 
                      title="View stock history">
                      <i class="fas fa-clock-rotate-left text-sm"></i>
                    </button> -->
                    
                    <!-- Delete Button -->
                    <button 
                      class="p-2.5 rounded-xl hover:bg-red-50 text-red-600 transition-all duration-200 hover:scale-110 border border-transparent hover:border-red-200" 
                      @click="deleteStock(stock._id)" 
                      title="Delete stock record">
                      <i class="fas fa-trash text-sm"></i>
                    </button>
                  </div>
                </td>
              </tr>
              
              <!-- Empty State -->
              <tr v-if="filteredStockData.length === 0 && !isLoading">
                <td colspan="8" class="px-6 py-20 text-center">
                  <div class="flex flex-col items-center gap-4">
                    <div class="p-6 rounded-2xl bg-amber-50 border border-amber-200">
                      <i class="fas fa-box-open text-5xl text-amber-400"></i>
                    </div>
                    <div>
                      <h3 class="text-lg font-bold text-gray-900">No inventory items found</h3>
                      <p class="text-sm text-gray-600 mt-1 font-medium">Add your first inventory item to get started</p>
                    </div>
                    <button 
                      @click="openModal"
                      class="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-xl text-sm font-semibold hover:bg-amber-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
                      <i class="fas fa-plus text-xs"></i>
                      Add First Item
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-4 border-t border-gray-100 bg-gray-50/30">
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

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[1000] p-4">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200">
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 class="text-xl font-bold text-gray-900 tracking-tight">
              {{ showEditModal ? 'Update Inventory' : 'Add New Inventory Item' }}
            </h2>
            <p class="text-sm text-gray-600 mt-1 font-medium">
              {{ showEditModal ? 'Modify existing inventory details' : 'Add a new product to your inventory' }}
            </p>
          </div>
          <button 
            class="p-2.5 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all"
            @click="closeModal">
            <i class="fas fa-times text-lg"></i>
          </button>
        </div>
        
        <!-- Modal Body -->
        <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
          <!-- Product and Category Selection -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-3">
                Product <span class="text-red-500">*</span>
              </label>
              <select v-model="productId" required
                class="w-full px-4 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all font-medium">
                <option value="" disabled>Select a product</option>
                <option v-for="product in products" :key="product._id" :value="product._id">
                  {{ product.name }} ({{ product.idCustom }})
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 mb-3">
                Category <span class="text-red-500">*</span>
              </label>
              <select v-model="categoryId" required
                class="w-full px-4 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all font-medium">
                <option value="" disabled>Select a category</option>
                <option v-for="category in categories" :key="category._id" :value="category._id">
                  {{ category.name }}
                </option>
              </select>
            </div>
          </div>

          <!-- Quantity and Unit -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-3">
                Initial Quantity <span class="text-red-500">*</span>
              </label>
              <input v-model.number="quantity" type="number" min="0" required
                class="w-full px-4 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all font-medium"
                placeholder="Enter quantity" />
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 mb-3">
                Unit <span class="text-red-500">*</span>
              </label>
              <input v-model="unit" type="text" required
                class="w-full px-4 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all font-medium"
                placeholder="e.g., kg, pcs, liters" />
            </div>
          </div>

          <!-- Thresholds -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-3">
                Low Stock Alert <span class="text-red-500">*</span>
              </label>
              <input v-model.number="minThreshold" type="number" min="0" required
                class="w-full px-4 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all font-medium"
                placeholder="Minimum threshold" />
              <p class="text-xs text-gray-500 mt-2 font-medium">Alert when stock falls below this level</p>
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 mb-3">
                Max Capacity <span class="text-red-500">*</span>
              </label>
              <input v-model.number="maxCapacity" type="number" min="0" required
                class="w-full px-4 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all font-medium"
                placeholder="Maximum capacity" />
              <p class="text-xs text-gray-500 mt-2 font-medium">Maximum storage capacity</p>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="bg-red-50 border border-red-200 rounded-2xl p-4">
            <div class="flex items-center gap-3">
              <i class="fas fa-exclamation-circle text-red-500"></i>
              <p class="text-red-700 text-sm font-semibold">{{ error }}</p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-4 pt-4">
            <button type="button" 
              class="flex-1 px-6 py-3.5 text-gray-700 bg-gray-100 rounded-2xl hover:bg-gray-200 font-semibold transition-all"
              @click="resetForm">
              Reset
            </button>
            <button type="submit" 
              :disabled="isSubmitting"
              class="flex-1 px-6 py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-2xl hover:from-amber-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]">
              <span v-if="isSubmitting" class="flex items-center justify-center gap-2">
                <i class="fas fa-spinner fa-spin"></i>
                {{ showEditModal ? 'Updating...' : 'Adding...' }}
              </span>
              <span v-else>
                {{ showEditModal ? 'Update Stock' : 'Add Stock' }}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Confirmation Dialog -->
    <DeleteConfirmation 
      :show="showConfirmDialog" 
      @cancel="handleCancelConfirmation" 
      @confirm="handleDeleteConfirmation" 
    />
  </div>
</template>

<script setup>
import apiURL from '@/api/config';
import DeleteConfirmation from '@/components/DeleteConfirmation.vue';
import Pagination from '@/components/Pagination.vue';
import { fetchTimestamp } from '@/composables/timestamp';
import socket from '@/services/socket';
import axios from 'axios';
import { computed, onMounted, ref, watch } from 'vue';

// Reactive variables
const showModal = ref(false);
const showEditModal = ref(false);
const isLoading = ref(false);
const isSubmitting = ref(false);
const error = ref('');
const stockData = ref([]);
const currentId = ref('');
const productId = ref('');
const categoryId = ref('');
const quantity = ref(0);
const unit = ref('');
const minThreshold = ref(5);
const maxCapacity = ref(100);

// Reference data
const products = ref([]);
const categories = ref([]);

// UI controls
const items = ref([10, 25, 50, 100]);
const selectedItem = ref(10);
const currentPage = ref(1);
const pageSize = ref(10);
const currentPageIsLastRecord = ref(null);
const searchText = ref("");
const searchQuery = ref('');
const categoryFilter = ref('all');
const stockStatusFilter = ref('all');
const isOpen = ref(false);

// Confirmation dialog
const showConfirmDialog = ref(false);
const pendingStockId = ref(null);

// 🎯 Enhanced Stock Status Logic (Frontend Only)
const getStockStatus = (stock) => {
  // Validate input
  if (!stock || typeof stock.quantity !== 'number' || typeof stock.minThreshold !== 'number') {
    return {
      text: 'Unknown',
      class: 'bg-gray-100 text-gray-700 border-gray-200',
      icon: 'fas fa-question-circle',
      barColor: 'bg-gray-400',
      priority: 0
    };
  }

  const { quantity, minThreshold } = stock;

  // Out of Stock - Priority check for zero or negative quantities
  if (quantity <= 0) {
    return {
      text: 'Out of Stock',
      class: 'bg-red-100 text-red-700 border-red-200',
      icon: 'fas fa-circle-xmark',
      barColor: 'bg-red-500',
      priority: 3 // Highest priority for sorting
    };
  }

  // Critical Stock - Very low (less than half of minimum threshold)
  if (quantity <= Math.floor(minThreshold / 2) && minThreshold > 0) {
    return {
      text: 'Critical Stock',
      class: 'bg-red-100 text-red-700 border-red-200',
      icon: 'fas fa-triangle-exclamation',
      barColor: 'bg-red-500',
      priority: 2
    };
  }

  // Low Stock - At or below minimum threshold
  if (quantity <= minThreshold) {
    return {
      text: 'Low Stock',
      class: 'bg-orange-100 text-orange-700 border-orange-200',
      icon: 'fas fa-triangle-exclamation',
      barColor: 'bg-orange-500',
      priority: 1
    };
  }

  // In Stock - Above minimum threshold
  return {
    text: 'In Stock',
    class: 'bg-green-100 text-green-700 border-green-200',
    icon: 'fas fa-circle-check',
    barColor: 'bg-green-500',
    priority: 0 // Lowest priority
  };
};

// Individual status helper functions using the main logic
const getStockStatusText = (stock) => getStockStatus(stock).text;
const getStockStatusClass = (stock) => getStockStatus(stock).class;
const getStockStatusIcon = (stock) => getStockStatus(stock).icon;
const getStockBarColor = (stock) => getStockStatus(stock).barColor;

// Enhanced percentage calculation
const getStockPercentage = (stock) => {
  if (!stock || !stock.maxCapacity || stock.maxCapacity <= 0) return 0;
  return Math.min((stock.quantity / stock.maxCapacity) * 100, 100);
};

// Stock level indicator for additional context
const getStockLevel = (stock) => {
  const percentage = getStockPercentage(stock);
  if (percentage <= 0) return 'Empty';
  if (percentage <= 25) return 'Very Low';
  if (percentage <= 50) return 'Low';
  if (percentage <= 75) return 'Medium';
  return 'High';
};

// Enhanced computed properties using frontend logic
const totalItems = computed(() => stockData.value.length);

const lowStockItems = computed(() => 
  stockData.value.filter(item => {
    const status = getStockStatus(item);
    return status.text === 'Low Stock' || status.text === 'Critical Stock';
  }).length
);

const outOfStockItems = computed(() => 
  stockData.value.filter(item => 
    getStockStatus(item).text === 'Out of Stock'
  ).length
);

const criticalStockItems = computed(() => 
  stockData.value.filter(item => 
    getStockStatus(item).text === 'Critical Stock'
  ).length
);

const inStockItems = computed(() => 
  stockData.value.filter(item => 
    getStockStatus(item).text === 'In Stock'
  ).length
);

// Enhanced filtering with frontend status logic
const filteredStockData = computed(() => {
  let filtered = stockData.value;

  // Filter by category
  if (categoryFilter.value !== 'all') {
    filtered = filtered.filter(item => item.categoryId === categoryFilter.value);
  }

  // Filter by stock status using frontend logic
  if (stockStatusFilter.value !== 'all') {
    switch (stockStatusFilter.value) {
      case 'in-stock':
        filtered = filtered.filter(item => 
          getStockStatus(item).text === 'In Stock'
        );
        break;
      case 'low-stock':
        filtered = filtered.filter(item => {
          const status = getStockStatus(item).text;
          return status === 'Low Stock' || status === 'Critical Stock';
        });
        break;
      case 'out-of-stock':
        filtered = filtered.filter(item => 
          getStockStatus(item).text === 'Out of Stock'
        );
        break;
      case 'critical-stock':
        filtered = filtered.filter(item => 
          getStockStatus(item).text === 'Critical Stock'
        );
        break;
    }
  }

  return filtered;
});

// Sort by stock priority (optional - you can use this instead of filteredStockData)
const sortedStockData = computed(() => {
  return [...filteredStockData.value].sort((a, b) => {
    const priorityA = getStockStatus(a).priority;
    const priorityB = getStockStatus(b).priority;
    return priorityB - priorityA; // Higher priority (more urgent) first
  });
});

// Helper functions for product and category data
const getProductData = (productId) => {
  return products.value.find(p => p._id === productId) || null;
};

const getProductName = (productId) => {
  const product = getProductData(productId);
  return product ? product.name : 'Unknown Product';
};

const getProductIdCustom = (productId) => {
  const product = getProductData(productId);
  return product ? product.idCustom : 'N/A';
};

const getProductImage = (productId) => {
  const product = getProductData(productId);
  return product ? product.imageURL : null;
};

const getCategoryName = (categoryId) => {
  const category = categories.value.find(c => c._id === categoryId);
  return category ? category.name : 'Unknown Category';
};

// Event handlers
const handleListenToPagination = async (items) => {
  stockData.value = items || [];
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

// Watch for search changes
watch(searchQuery, (newValue) => {
  searchText.value = newValue;
  currentPage.value = 1;
}, { immediate: true });

// Dropdown handlers
const toggleDropdownRow = () => {
  isOpen.value = !isOpen.value;
};

const selectItem = (item) => {
  selectedItem.value = item;
  pageSize.value = item;
  isOpen.value = false;
};

// Modal handlers
const openModal = () => {
  resetForm();
  showModal.value = true;
  showEditModal.value = false;
};

const closeModal = () => {
  showModal.value = false;
  showEditModal.value = false;
  resetForm();
};

const resetForm = () => {
  currentId.value = '';
  productId.value = '';
  categoryId.value = '';
  quantity.value = 0;
  unit.value = '';
  minThreshold.value = 5;
  maxCapacity.value = 100;
  error.value = '';
};

// Submit form handler (removed isOutOfStock from backend call)
const handleSubmit = async () => {
  if (!productId.value || !categoryId.value || !unit.value || 
      quantity.value === null || minThreshold.value === null || maxCapacity.value === null) {
    error.value = 'Required fields cannot be empty';
    return;
  }

  if (minThreshold.value > maxCapacity.value) {
    error.value = 'Min threshold cannot be greater than max capacity';
    return;
  }

  isSubmitting.value = true;
  error.value = '';

  try {
    isLoading.value = true;
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    if (!token || !userId) {
      error.value = 'Authentication required. Please login again.';
      isSubmitting.value = false;
      isLoading.value = false;
      return;
    }

    const timestamp = await fetchTimestamp();

    const requestBody = {
      fields: {
        productId: productId.value,
        categoryId: categoryId.value,
        unit: unit.value,
        quantity: parseInt(quantity.value),
        minThreshold: parseInt(minThreshold.value),
        maxCapacity: parseInt(maxCapacity.value)
        // Removed isOutOfStock - let frontend handle status logic
      }
    };

    if (!showEditModal.value) {
      // Creating a new stock entry
      requestBody.fields.createdAt = timestamp;
      requestBody.fields.createdBy = userId;
      requestBody.fields.lastRestockedAt = timestamp;

      const response = await axios.post(
        `${apiURL}/api/insertDoc/Stock`,
        requestBody,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

      if (response.data.success) {
        socket.emit('dataUpdate', {
          action: 'insert',
          collection: 'Stock',
          data: response.data.data._id
        });
        resetForm();
        closeModal();
        fetchStockData();
      } else {
        throw new Error(response.data.message || 'Failed to create inventory item');
      }
    } else {
      // Updating existing stock entry
      if (!currentId.value) {
        error.value = 'Error: Missing stock ID for update operation';
        isSubmitting.value = false;
        isLoading.value = false;
        return;
      }

      requestBody.fields.updatedAt = timestamp;
      requestBody.fields.updatedBy = userId;
      
      // Update lastRestockedAt if quantity increased
      const existingStock = stockData.value.find(item => item._id === currentId.value);
      if (existingStock && parseInt(quantity.value) > existingStock.quantity) {
        requestBody.fields.lastRestockedAt = timestamp;
      }

      const response = await axios.patch(
        `${apiURL}/api/updateDoc/Stock/${currentId.value}`,
        requestBody,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

      if (response.data.success || response.data.message === 'Stock updated') {
        socket.emit('dataUpdate', {
          action: 'update',
          collection: 'Stock',
          data: response.data.data ? response.data.data._id : currentId.value
        });
        closeModal();
        fetchStockData();
      } else {
        throw new Error(response.data.message || 'Failed to update inventory item');
      }
    }
  } catch (err) {
    console.error('Error saving inventory item:', err);
    error.value = err.response?.data?.message || err.message || 'Failed to save inventory item';
  } finally {
    isSubmitting.value = false;
    isLoading.value = false;
  }
};

// Edit stock handler
const editStock = (stock) => {
  currentId.value = stock._id;
  productId.value = stock.productId;
  categoryId.value = stock.categoryId;
  quantity.value = stock.quantity;
  unit.value = stock.unit;
  minThreshold.value = stock.minThreshold;
  maxCapacity.value = stock.maxCapacity;
  showModal.value = true;
  showEditModal.value = true;
};

// View stock history handler
// const viewStockHistory = (stockId) => {
//   console.log('View history for stock:', stockId);
//   // TODO: Implement view history functionality
// };

// Delete stock handler
const deleteStock = (stockId) => {
  pendingStockId.value = stockId;
  showConfirmDialog.value = true;
};

const handleDeleteConfirmation = async () => {
  showConfirmDialog.value = false;
  if (!pendingStockId.value) return;

  try {
    isLoading.value = true;
    const token = localStorage.getItem('token');
    if (!token) {
      error.value = 'Authentication required. Please login again.';
      return;
    }
    
    const response = await axios.delete(
      `${apiURL}/api/deleteDoc/Stock/${pendingStockId.value}`,
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
        collection: 'Stock',
        data: response.data.data._id
      });
      fetchStockData();
      closeModal();
    } else {
      throw new Error(response.data.message || 'Failed to delete stock item');
    }
  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'Failed to delete stock item';
  } finally {
    isLoading.value = false;
    pendingStockId.value = null;
  }
};

const handleCancelConfirmation = () => {
  showConfirmDialog.value = false;
  pendingStockId.value = null;
};

// Fetch stock data
const fetchStockData = async () => {
  try {
    isLoading.value = true;
    const token = localStorage.getItem('token');
    if (!token) {
      error.value = 'Authentication required. Please login again.';
      return;
    }
    
    // First fetch all necessary data
    await fetchRelatedData();
    
    const response = await axios.get(`${apiURL}/api/getAllDocs/Stock`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    stockData.value = response.data.data || [];
    
  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'Failed to fetch inventory data';
    stockData.value = [];
  } finally {
    isLoading.value = false;
  }
};

// Fetch related data for dropdowns and product information
const fetchRelatedData = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    // Fetch products first (needed for stock data display)
    const productsResponse = await axios.get(`${apiURL}/api/getAllDocs/Product`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    products.value = productsResponse.data.data || [];
    
    // Fetch categories
    const categoriesResponse = await axios.get(`${apiURL}/api/getAllDocs/Category`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    categories.value = categoriesResponse.data.data || [];
    
  } catch (err) {
    console.error('Error fetching related data:', err);
  }
};

// Initialize
onMounted(() => {
  if (socket && socket.disconnected) {
    socket.connect();
  }
  
  // Listen for socket updates
  socket.on('dataUpdated', (update) => {
    if (update.collection === 'Stock') {
      fetchStockData();
    }
  });
  
  fetchStockData();
});
</script>

<style scoped>


/* Custom scrollbar for webkit browsers */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f8fafc;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
  border: 2px solid #f8fafc;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Smooth transitions for all interactive elements */
* {
  transition-property: color, background-color, border-color, transform, box-shadow, opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Enhanced focus states */
button:focus,
select:focus,
input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
}

/* Better table row hover effect */
tbody tr:hover {
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

/* Improved modal backdrop */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}
</style>