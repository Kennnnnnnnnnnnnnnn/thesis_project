<!-- <template>
  <div class="min-h-screen bg-gray-50 font-poppins">
    <div class="max-w-4xl mx-auto p-6">
      <div class="text-center mb-8">
      </div>
      <div v-if="isLoading" class="text-center py-12">
        <div class="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-gray-600">{{ $t('common.loading') }}...</p>
      </div>

      <div v-else-if="orders.length > 0" class="space-y-4">
        <div
          v-for="order in orders"
          :key="order._id"
          class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
        >
          <div class="p-4 border-b border-gray-100">
            <div class="flex justify-between items-start">
              <div class="space-y-1">
                <div class="flex items-center text-gray-700">
                  <i class="far fa-calendar-alt mr-2 text-gray-500"></i>
                  <span class="text-sm">{{ formatDate(order.createdAt) }}</span>
                </div>
                <div class="text-lg font-semibold text-gray-800">
                  {{ $t('history.total') }}: {{ formatPrice(order.totalCost) }} ៛
                </div>
              </div>
              <div class="flex flex-col items-end space-y-2">
                <span :class="`px-2 py-1 rounded text-xs font-medium ${getStatusClass(order.status)}`">
                  {{ $t(order.status) }}
                </span>
              </div>
            </div>
          </div>
          <div class="p-4">
            <div class="space-y-3">
              <div
                v-for="(item, index) in order.items"
                :key="index"
                class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
              >
                <div class="relative">
                  <img
                    :src="item.image || require('@/assets/image.png')"
                    :alt="item.name"
                    class="w-16 h-16 object-cover rounded-lg"
                  />
                  <span class="absolute -top-1 -right-1 bg-yellow-500 text-white w-5 h-5 text-xs font-bold flex items-center justify-center rounded-full">
                    {{ item.quantity || 1 }}
                  </span>
                </div>
                <div class="flex-1">
                  <h4 class="font-medium text-gray-800 mb-1">{{ item.name || 'Product' }}</h4>
                  <p class="text-gray-600 font-medium">{{ formatPrice(item.price) }} ៛</p>
                </div>
              </div>
            </div>
          </div>
       
          <div v-if="normalizeStatus(order.status) === 'delivering'" class="flex justify-center p-4">
            <button 
              class="mt-4 px-4 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition"
              :disabled="isLoading"
              @click="confirmReceipt(order)"
            >
              <i class="fas fa-check-circle mr-1"></i> Confirm Received
            </button>
          </div>

        </div>
      </div>

     
      <div v-else class="text-center item-center py-12">
        <i class="fas fa-shopping-basket text-4xl text-gray-400 mb-4"></i>
        <h3 class="text-xl font-semibold text-gray-800 mb-2">{{ $t('history.noHistoryYet') }}</h3>
        <p class="text-gray-600 mb-6">{{ $t('history.completedOrdersAppear') }}</p>
        <button @click="navigateToShop" class="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors">
          {{ $t('history.startShopping') }}
        </button>
      </div>
    </div>
  </div>
</template> -->
