<!-- <template>
  <div class="p-4 md:p-6 bg-gray-50 font-khmer">
   
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-6 mb-6">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
  
        <div class="flex items-center gap-4">
          <div class="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2">
              <path d="M16 6l4 4-4 4M8 18l-4-4 4-4"></path>
            </svg>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Promotions</h1>
          </div>
        </div>

     
        <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
         
          <div class="relative">
            <button @click="toggleDropdownRow"
              class="flex items-center justify-between min-w-[110px] px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all">
              <span>{{ selectedItem }} </span>
              <i class="fas fa-chevron-down ml-2 text-xs transition-transform duration-200"
                :class="{ 'rotate-180': isOpen }"></i>
            </button>
            <div v-show="isOpen"
              class="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 shadow-xl rounded-xl py-2 z-50 backdrop-blur-sm">
              <div v-for="item in items" :key="item" @click="selectItem(item)"
                class="px-4 py-2.5 text-sm text-gray-700 cursor-pointer hover:bg-amber-50 transition-colors font-medium">
                {{ item }}
              </div>
            </div>
          </div>

       
          <div class="relative">
            <input v-model="searchQuery" type="text" placeholder="Search products"
              class="w-64 px-4 py-2.5 pl-10 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all" />
            <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
          </div>

     
          <select v-model="promotionTypeFilter"
            class="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 bg-white transition-all">
            <option value="all">All Types</option>
            <option value="discount">Discount</option>
            <option value="freeDelivery">Free Delivery</option>
            <option value="other">Other</option>
          </select>

          <button
            class="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg hover:from-amber-600 hover:to-orange-700 transition-all duration-200 transform hover:scale-[1.02] hover:shadow-xl"
            @click="openModal">
            <i class="fas fa-plus text-xs"></i>
            Add Promotion
          </button>
        </div>

      </div>
    </div>

  
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden">
      <div class="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
        <h3 class="text-lg font-bold text-gray-900 tracking-tight">Promotions</h3>

      </div>

   
      <div class="relative overflow-hidden">
       
        <div v-if="isLoading" class="absolute inset-0 bg-opacity-70 flex items-center justify-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-900"></div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-100">
            <thead class="bg-gray-50/50">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">#</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Product</th>
                <th class="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Type</th>
                <th class="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Qty Limit
                </th>
                <th class="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                <th class="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">{{
                  $t('common.actions') }}</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-100">
              <tr v-for="(promotion, index) in filteredPromotions" :key="promotion._id"
                class="hover:bg-gray-50/50 transition-colors duration-150">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ index + 1 }}
                </td>

       
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ getProductName(promotion.productId) }}</div>
                </td>

              
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span class="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold" :class="{
                    'bg-green-100 text-green-800 border border-green-200': promotion.promotionType === 'discount',
                    'bg-blue-100 text-blue-800 border border-blue-200': promotion.promotionType === 'freeDelivery',
                    'bg-amber-100 text-amber-800 border border-amber-200': promotion.promotionType === 'other'
                  }">
                    {{ promotion.promotionType }}
                  </span>
                </td>

          
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <div class="text-sm text-gray-700 font-medium">
                    {{ promotion.promotionQtyLimit || 'No limit' }}
                  </div>
                </td>

        
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold"
                    :class="promotion.isActive ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'">
                    <i :class="promotion.isActive ? 'fas fa-circle-check text-xs' : 'fas fa-circle-xmark text-xs'"></i>
                    {{ promotion.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </td>

            
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <div class="flex items-center justify-center gap-2">
                   
                    <button
                      class="p-2.5 rounded-xl hover:bg-amber-50 text-amber-600 transition-all duration-200 hover:scale-110 border border-transparent hover:border-amber-200"
                      @click="editPromotion(promotion)" title="Edit promotion">
                      <i class="fas fa-edit text-sm"></i>
                    </button>

                 
                    <button
                      class="p-2.5 rounded-xl hover:bg-red-50 text-red-600 transition-all duration-200 hover:scale-110 border border-transparent hover:border-red-200"
                      @click="deletePromotion(promotion._id)" title="Delete promotion">
                      <i class="fas fa-trash text-sm"></i>
                    </button>
                  </div>
                </td>
              </tr>

            
              <tr v-if="filteredPromotions.length === 0 && !isLoading">
                <td colspan="9" class="px-6 py-20 text-center">
                  <div class="flex flex-col items-center gap-4">
                    <div class="p-6 rounded-2xl bg-amber-50 border border-amber-200">
                      <i class="fas fa-tags text-5xl text-amber-400"></i>
                    </div>
                    <div>
                      <h3 class="text-lg font-bold text-gray-900">No Promotions Found</h3>
                      <p class="text-sm text-gray-600 mt-1 font-medium">Create your first promotion to get started</p>
                    </div>
                    <button @click="openModal"
                      class="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-xl text-sm font-semibold hover:bg-amber-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
                      <i class="fas fa-plus text-xs"></i>
                      Add Promotion
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

  
      <div class="px-6 py-4 border-t border-gray-100 bg-gray-50/30">
        <Pagination :currentPage="currentPage" @onEmitDataFromPagination="handleListenToPagination"
          @onEmitIsLoading="handleListenIsLoading" @onEmitCurrentPageIsLastRecord="handleListenIsLastRecordOnPage"
          :limitedPerPage="pageSize" :searchQuery="searchText" />
      </div>
    </div>

 
    <div v-if="showModal"
      class="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[1000] p-4">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-200">
   
        <div class="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 class="text-xl font-bold text-gray-900 tracking-tight">
              {{ showEditModal ? 'Update Promotion' : 'Create New Promotion' }}
            </h2>
            <p class="text-sm text-gray-600 mt-1 font-medium">
              {{ showEditModal ? 'Modify existing promotion details' : 'Add a new promotion to your campaigns' }}
            </p>
          </div>
          <button class="p-2.5 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all"
            @click="closeModal">
            <i class="fas fa-times text-lg"></i>
          </button>
        </div>


        <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
       
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-3">
                Product <span class="text-red-500">*</span>
              </label>
              <select v-model="productId" required
                class="w-full px-4 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all font-medium">
                <option value="" disabled>Choose product</option>
                <option v-for="product in products" :key="product._id" :value="product._id">
                  {{ product.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 mb-3">
                Promotion Type <span class="text-red-500">*</span>
              </label>
              <select v-model="promotionType" required
                class="w-full px-4 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all font-medium">
                <option value="" disabled>Choose type</option>
                <option value="discount">Discount</option>
                <option value="freeDelivery">Free Delivery</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

       
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-3">
                Start Date <span class="text-red-500">*</span>
              </label>
              <DatePicker v-model="startDate" :min-date="new Date()"
                input-class="w-full px-4 py-3.5 border border-gray-200 rounded-2xl font-medium" :show-icon="true"
                dateFormat="dd/mm/yy" placeholder="Start date" />
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-3">
                End Date <span class="text-red-500">*</span>
              </label>
              <DatePicker v-model="endDate" :min-date="startDate || new Date()"
                input-class="w-full px-4 py-3.5 border border-gray-200 rounded-2xl font-medium" :show-icon="true"
                dateFormat="dd/mm/yy" placeholder="End date" />
            </div>
          </div>

      
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-3">
                Quantity for Discount <span class="text-red-500">*</span>
              </label>
              <input v-model="promotionQtyLimit" type="number" min="0" step="1"
                class="flex px-4 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all font-medium"
                placeholder="Input qty" />
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-3">
                Quantity <span class="text-red-500">*</span>
              </label>
              <input v-model="promotionQtyStartFrom" type="number" min="0" step="1"
                class="flex px-4 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all font-medium"
                placeholder="Start from qty" />
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-3">
                Unit <span class="text-red-500">*</span>
              </label>
              <input v-model="promotionQtyUnit" type="text"
                class=" px-3 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all font-medium"
                placeholder="Unit (e.g. kg, pcs)" />
            </div>
          </div>

 
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-3">
              Description
            </label>
            <textarea v-model="description" rows="3"
              class="w-full px-4 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all resize-none font-medium"
              placeholder="Description (optional)"></textarea>
          </div>

       
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-3">
              Status
            </label>
            <div class="flex items-center space-x-3">
              <Switch v-model="enabled" class="relative inline-flex h-6 w-11 items-center rounded-full transition"
                :class="enabled ? 'bg-amber-500' : 'bg-gray-300'">
                <span class="sr-only">Toggle Status</span>
                <span class="inline-block h-4 w-4 transform bg-white rounded-full transition shadow-sm"
                  :class="enabled ? 'translate-x-6' : 'translate-x-1'"></span>
              </Switch>
              <span class="text-sm text-gray-700 font-medium">{{ enabled ? 'Active' : 'Inactive' }}</span>
            </div>
          </div>

       
          <div v-if="error" class="bg-red-50 border border-red-200 rounded-2xl p-4">
            <div class="flex items-center gap-3">
              <i class="fas fa-exclamation-circle text-red-500"></i>
              <p class="text-red-700 text-sm font-semibold">{{ error }}</p>
            </div>
          </div>

      
          <div class="flex gap-4 pt-4">
            <button type="button"
              class="flex-1 px-6 py-3.5 text-gray-700 bg-gray-100 rounded-2xl hover:bg-gray-200 font-semibold transition-all"
              @click="resetForm">
              {{ $t('common.reset') }}
            </button>
            <button type="submit" :disabled="isSubmitting"
              class="flex-1 px-6 py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-2xl hover:from-amber-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]">
              <span v-if="isSubmitting" class="flex items-center justify-center gap-2">
                <i class="fas fa-spinner fa-spin"></i>
                {{ showEditModal ? 'Updating Promotion...' : 'Creating Promotion...' }}
              </span>
              <span v-else>
                {{ showEditModal ? 'Update Promotion' : 'Create Promotion' }}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>


  <DeleteConfirmation :show="showConfirmDialog" @cancel="handleCancelConfirmation"
    @confirm="handleDeleteConfirmation" />
</template> -->