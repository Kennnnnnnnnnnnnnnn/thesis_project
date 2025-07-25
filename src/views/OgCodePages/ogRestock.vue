<!-- <template>
  <div class="p-4 md:p-6 bg-gray-50 min-h-screen font-khmer">
   
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-6 mb-6">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
       
        <div class="flex items-center gap-4">
          <div class="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2">
              <path d="M16 11V7a4 4 0 0 0-8 0v4M5 9h14l1 12H4L5 9z"></path>
              <path d="M7 7V5a2 2 0 0 1 4 0v2"></path>
            </svg>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Restock Management</h1>
          </div>
        </div>

     
        <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          
          <div class="relative">
            <button @click="toggleDropdownRow"
              class="flex items-center justify-between min-w-[110px] px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all">
              <span>{{ selectedItem }} items</span>
              <i class="fas fa-chevron-down ml-2 text-xs transition-transform duration-200"
                :class="{ 'rotate-180': isOpen }"></i>
            </button>
            <div v-show="isOpen"
              class="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 shadow-xl rounded-xl py-2 z-50 backdrop-blur-sm">
              <div v-for="item in items" :key="item" @click="selectItem(item)"
                class="px-4 py-2.5 text-sm text-gray-700 cursor-pointer hover:bg-amber-50 transition-colors font-medium">
                {{ item }} items
              </div>
            </div>
          </div>

    
          <div class="relative">
            <input v-model="searchQuery" type="text" placeholder="Search restock orders..."
              class="w-64 px-4 py-2.5 pl-10 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all" />
            <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
          </div>

      
          <select v-model="statusFilter"
            class="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 bg-white transition-all">
            <option value="all">All Status</option>
            <option value="true">Pending</option>
            <option value="false">Completed</option>
          </select>

    
          <button
            class="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg hover:from-amber-600 hover:to-orange-700 transition-all duration-200 transform hover:scale-[1.02] hover:shadow-xl"
            @click="openModal">
            <i class="fas fa-plus text-xs"></i>
            Purchase
          </button>
        </div>
      </div>
    </div>

 
    <div class="overflow-y-auto mt-5 relative bg-white rounded-lg shadow-sm border border-gray-100"
      style="max-height: 60vh;">
  
      <div v-if="isLoading" class="absolute inset-0 bg-opacity-70 flex items-center justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-900"></div>
      </div>

      <table class="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-4 py-2 font-semibold text-gray-500 text-left uppercase tracking-wide border-b border-gray-200">
              No</th>
            <th
              class="px-4 py-2 font-semibold text-gray-500 text-left uppercase tracking-wide border-b border-gray-200">
              Supplier</th>
            <th class="px-4 py-2 font-semibold  text-gray-500 uppercase tracking-wide border-b border-gray-200">
              Contact</th>
            <th
              class="px-4 py-2 font-semibold text-center text-gray-500 uppercase tracking-wide border-b border-gray-200">
              Products</th>
            <th
              class="px-4 py-2 font-semibold text-gray-500 text-center uppercase tracking-wide border-b border-gray-200">
              Description</th>
  
            <th
              class="px-4 py-2 font-semibold text-gray-500 text-center uppercase tracking-wide border-b border-gray-200">
              Created At</th>
            <th
              class="px-4 py-2 font-semibold text-gray-500 text-center uppercase tracking-wide border-b border-gray-200">
              Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(purchase, index) in restockData" :key="purchase._id"
            class="hover:bg-amber-50/50 transition-colors">
            <td class="px-4 py-3 border-b border-gray-200">{{ index + 1 }}</td>
            <td class="px-4 py-3 border-b border-gray-200">
              {{ getSupplierName(purchase.supplierId) }}
            </td>
            <td class="px-4 py-3 border-b border-gray-200 text-center">
              {{ getSupplierContact(purchase.supplierId) }}
            </td>
            <td class="px-4 py-3 border-b border-gray-200 text-center ">

              {{purchase.products?.map(item => item.name).join(', ') || '-'}}

            </td>
            <td class="px-4 py-3 border-b border-gray-200 text-center">
              <span class="truncate max-w-xs inline-block">{{ purchase.description || '-' }}</span>
            </td>
  
            <td class="px-4 py-3 border-b border-gray-200 text-center">
              {{ formatDate(purchase.createdAt) }}
            </td>
            <td class="px-4 py-3 border-b border-gray-200 text-center">
              <div class="flex items-center justify-center space-x-2">

                <button @click="viewPurchaseDetails(purchase._id)"
                  class="p-1.5 rounded-lg hover:bg-orange-100 text-orange-600 transition-all ">
                  <i class="fa-solid fa-eye"></i>
                </button>

                <button @click="deleteRestock(purchase._id)"
                  class="p-1.5 rounded-lg hover:bg-red-100 text-red-600 transition-all">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="restockData.length === 0 && !isLoading">
            <td colspan="7" class="px-4 py-8 text-center text-gray-400 italic">
              No restock orders found
            </td>
          </tr>
        </tbody>
      </table>

      <div class="px-6 py-4 border-t border-gray-100 bg-gray-50/30">
        <Pagination :currentPage="currentPage" @onEmitDataFromPagination="handleListenToPagination"
          @onEmitIsLoading="handleListenIsLoading" @onEmitCurrentPageIsLastRecord="handleListenIsLastRecordOnPage"
          :limitedPerPage="pageSize" :searchQuery="searchText" />
      </div>

    </div>



    <div v-if="showModal"
      class="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[1000] p-4">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center p-4 border-b">
          <div>
            <h2 class="text-xl font-semibold text-gray-800">{{ showEditModal ? 'Edit' : 'Create' }} Purchase Form</h2>
            <p class="text-sm text-gray-500">Add products to restock inventory</p>
          </div>
          <button @click="closeModal" class="text-red-600 hover:text-red-700">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>

        <div class="flex flex-col md:flex-row">
      
          <div class="w-full md:w-1/2 p-5 md:border-r">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Supplier <span
                  class="text-red-500">*</span></label>
              <div class="relative">
                <select v-model="selectedSupplierId"
                  class="w-full border border-gray-300 rounded-md p-2.5 pr-8 appearance-none focus:ring focus:ring-amber-500/30 focus:border-amber-400">
                  <option value="" disabled>Select Supplier</option>
                  <option v-for="supplier in suppliers" :key="supplier._id" :value="supplier._id">
                    {{ supplier.name }}
                  </option>
                </select>
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <i class="fas fa-chevron-down text-gray-400"></i>
                </div>
              </div>
              <p v-if="error && !selectedSupplierId" class="text-red-500 text-xs mt-1">Please select a supplier</p>
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Product Name <span
                  class="text-red-500">*</span></label>
              <div class="relative">
                <select v-model="selectedProductId"
                  class="w-full border border-gray-300 rounded-md p-2.5 pr-8 appearance-none focus:ring focus:ring-amber-500/30 focus:border-amber-400">
                  <option value="" disabled>Select product</option>
                  <option v-for="product in products" :key="product._id" :value="product._id">
                    {{ product.name }}
                  </option>
                </select>
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <i class="fas fa-chevron-down text-gray-400"></i>
                </div>
              </div>
            </div>

         
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Currency <span
                  class="text-red-500">*</span></label>
              <div class="relative">
                <select v-model="selectedCurrencyId"
                  class="w-full border border-gray-300 rounded-md p-2.5 pr-8 appearance-none focus:ring focus:ring-amber-500/30 focus:border-amber-400">
                  <option value="" disabled>Select Currency</option>
                  <option v-for="currency in currencies" :key="currency._id" :value="currency._id">
                    {{ currency.name }} ({{ currency.symbol.symbol1.symbol }})
                  </option>
                </select>
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <i class="fas fa-chevron-down text-gray-400"></i>
                </div>
              </div>
              <p v-if="error && !selectedCurrencyId" class="text-red-500 text-xs mt-1">Please select a currency</p>
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Unit <span
                  class="text-red-500">*</span></label>
              <input v-model="unit" type="text"
                class="w-full border border-gray-300 rounded-md p-2.5 text-left focus:ring focus:ring-amber-500/30 focus:border-amber-400"
                placeholder="e.g kg" />
            </div>

            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Quantity <span
                    class="text-red-500">*</span></label>
                <input v-model.number="quantity" type="number" 
                  class="w-full border border-gray-300 rounded-md p-2.5 text-left focus:ring focus:ring-amber-500/30 focus:border-amber-400"
                  placeholder="0" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Price <span
                    class="text-red-500">*</span></label>
                <input v-model.number="price" type="number"  step="0.01"
                  class="w-full border border-gray-300 rounded-md p-2.5 text-left focus:ring focus:ring-amber-500/30 focus:border-amber-400"
                  placeholder="0" />
              </div>
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Note</label>
              <textarea v-model="itemDescription" rows="3"
                class="w-full border border-gray-300 rounded-md p-2.5 focus:ring focus:ring-amber-500/30 focus:border-amber-400"
                placeholder="Note..."></textarea>
            </div>

            <div class="flex justify-end space-x-3">
              <button type="button" @click="clearForm"
                class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition">
                Clear
              </button>
              <button type="button" @click="addToCart"
                class="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-md transition">
                Add to Cart
              </button>
            </div>
          </div>

          <div class="w-full md:w-1/2 p-5">
            <div class="overflow-x-auto">
              <table class="min-w-full bg-white border border-gray-300 text-sm">
                <thead class="bg-gray-100">
                  <tr>
                    <th class="border border-gray-300 p-2">ID</th>
                    <th class="border border-gray-300 p-2">Name</th>
                    <th class="border border-gray-300 p-2">Quantity</th>
                    <th class="border border-gray-300 p-2">Price</th>
                    <th class="border border-gray-300 p-2">Total</th>
                    <th class="border border-gray-300 p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in cartItems" :key="item.id" class="hover:bg-gray-50">
                    <td class="border border-gray-300 p-2 text-center">{{ index + 1 }}</td>
                    <td class="border border-gray-300 p-2">{{ item.name }}</td>
                    <td class="border border-gray-300 p-2 text-center">{{ item.quantity }} {{ item.unit }}</td>
                    <td class="border border-gray-300 p-2 text-right">
                      {{ formatPrice(item.unitPrice) }}
                    </td>
                    <td class="border border-gray-300 p-2 text-right">
                      {{ formatPrice(item.totalPrice) }}
                    </td>
                    <td class="border border-gray-300 p-2 text-center">
                      <button @click="removeFromCart(item.id)" class="text-red-500 hover:text-red-700">
                        <i class="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                  <tr v-if="cartItems.length === 0">
                    <td colspan="6" class="border border-gray-300 p-4 text-center text-gray-500">
                      No items in cart
                    </td>
                  </tr>
     
                </tbody>
              </table>
            </div>

            <div v-if="cartItems.length > 0" class="mt-4 px-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Purchase Notes</label>
              <textarea v-model="description" rows="2"
                class="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-amber-500/30 focus:border-amber-400"
                placeholder="Add notes about this purchase..."></textarea>
            </div>

            <div v-if="error" class="mt-3 text-red-500 text-sm">
              {{ error }}
            </div>

            <div class="mt-5 flex justify-end">
              <button @click="handleSubmit" :disabled="cartItems.length === 0 || isSubmitting"
                class="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-md flex items-center transition disabled:opacity-50 disabled:cursor-not-allowed">
                <span v-if="isSubmitting">
                  <i class="fas fa-spinner fa-spin mr-2"></i> Processing...
                </span>
                <span v-else>
                  <i class="fas fa-check mr-2"></i> Submit Purchase
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showPurchaseDetail"
      class="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[1000] p-4">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-y-auto">
        <div class="flex justify-between items-center p-4 border-b">
          <div>
            <h2 class="text-xl font-semibold text-gray-800">Purchase Details</h2>
          </div>
          <div class="flex items-center gap-3">
        
            <button @click="closePurchaseDetail" class="text-red-600 hover:text-red-700">
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>

        <div class="p-4">
        
          <div class="mb-4">
            <h3 class="text-lg font-semibold text-gray-800 mb-2">Purchase Info</h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <span class="text-sm font-medium text-gray-700">Supplier:</span>
                <p class="text-sm text-gray-900">{{getSupplierName(restockData.find(p => p._id ===
                  selectedPurchaseId)?.supplierId)}}</p>
              </div>
              <div>
                <span class="text-sm font-medium text-gray-700">Status:</span>
                <p class="text-sm text-gray-900">
                  <span v-if="restockData.find(p => p._id === selectedPurchaseId).status"
                    class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <i class="fas fa-check mr-1"></i> Completed
                  </span>
                  <span v-else
                    class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <i class="fas fa-times mr-1"></i> Pending
                  </span>
                </p>
              </div>
              <div>
                <span class="text-sm font-medium text-gray-700">Created At:</span>
                <p class="text-sm text-gray-900">
                  {{formatDate(restockData.find(p => p._id === selectedPurchaseId).createdAt)}}
                </p>
              </div>
              <div>
                <span class="text-sm font-medium text-gray-700">Total Items:</span>
                <p class="text-sm text-gray-900">
                  {{restockData.find(p => p._id === selectedPurchaseId).products.length}}
                </p>
              </div>
            </div>
          </div>

      
          <div class="mb-4">
            <h3 class="text-lg font-semibold text-gray-800 mb-2">Products</h3>
            <div class="overflow-x-auto">
              <table class="min-w-full bg-white border border-gray-300 text-sm">
                <thead class="bg-gray-100">
                  <tr>
                    <th class="border border-gray-300 p-2">ID</th>
                    <th class="border border-gray-300 p-2">Name</th>
                    <th class="border border-gray-300 p-2">Quantity</th>
                    <th class="border border-gray-300 p-2">Price</th>
                    <th class="border border-gray-300 p-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in restockData.find(p => p._id === selectedPurchaseId).products"
                    :key="item.id" class="hover:bg-gray-50">
                    <td class="border border-gray-300 p-2 text-center">{{ index + 1 }}</td>
                    <td class="border border-gray-300 p-2">{{ item.name }}</td>
                    <td class="border border-gray-300 p-2 text-center">{{ item.quantity }} {{ item.unit }}</td>
                    <td class="border border-gray-300 p-2 text-right">
                      {{ formatPrice(item.unitPrice) }}
                    </td>
                    <td class="border border-gray-300 p-2 text-right">
                      {{ formatPrice(item.totalPrice) }}
                    </td>
                  </tr>
                  <tr v-if="restockData.find(p => p._id === selectedPurchaseId).products.length === 0">
                    <td colspan="5" class="border border-gray-300 p-4 text-center text-gray-500">
                      No products found
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>


          <div class="mb-4">
            <h3 class="text-lg font-semibold text-gray-800 mb-2">Notes</h3>
            <p class="text-sm text-gray-900">
              {{restockData.find(p => p._id === selectedPurchaseId).description || '-'}}
            </p>
          </div>
        </div>
      </div>
    </div>


    <DeleteConfirmation :show="showConfirmDialog" @confirm="handleDeleteConfirmation" @cancel="handleCancelConfirmation"
      message="Are you sure you want to delete this restock order? This action cannot be undone." />
  </div>
</template> -->
