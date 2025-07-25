<!-- <template>
  <div class="min-h-screen bg-white py-8">

    <div class="max-w-6xl mx-auto p-7">
      <div class="text-start mb-8">
        <h1 class="text-2xl font-bold text-gray-800 mb-2 flex items-start justify-start">
          <span class="mr-3 text-xl">🛒</span>
          {{ $t('cart.title') }}
        </h1>
  
      </div>

 

      <div class="flex flex-col lg:flex-row gap-8">
      
        <div class="flex-1">
          <div class="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div class="flex items-center justify-between mb-6">
       
              <button
                v-if="cartItems.length > 0"
                @click="clearCart"
                class="px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200 flex items-center gap-2"
              >
                <i class="fa-solid fa-trash-can"></i>
                {{ $t('cart.clearAll') }}
              </button>
            </div>

            <div v-if="cartItems.length === 0" class="text-center py-16">
              <div class="text-8xl text-gray-200 mb-6">🛒</div>
              <h3 class="text-2xl font-semibold text-gray-700 mb-3">{{ $t('cart.empty') }}</h3>
              <p class="text-gray-500 mb-8 max-w-md mx-auto">{{ $t('cart.emptyDescription') }}</p>
              <router-link 
                to="/" 
                class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-bold rounded-xl hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <i class="fa-solid fa-shopping-bag mr-2"></i>
                {{ $t('cart.continueShopping') }}
              </router-link>
            </div>

            <div v-else class="space-y-6">
              <div 
                v-for="(item, index) in cartItems" 
                :key="item._id" 
                class="flex items-center gap-6 p-6 bg-white-50 rounded-xl hover:bg-white-100 transition-colors duration-200 border border-gray-200"
              >
                <div class="relative">
                  <img 
                    :src="getProductImage(item)" 
                    class="w-28 h-28 rounded-xl object-cover bg-white shadow-md" 
                    alt="Product"
                  />
                  <div class="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {{ item.quantity }}
                  </div>
                </div>

                <div class="flex-1 min-w-0">
                  <h3 class="font-bold text-xl text-gray-800 mb-2">{{ getProductName(item) }}</h3>
                  <p class="text-gray-600 text-sm mb-3 line-clamp-2">{{ getProductDescription(item) }}</p>
                  
                  <div class="flex items-center gap-3">
                    <span class="text-2xl font-bold text-gray-800">
                      <template v-if="getProductPrice(item) !== null">
                        {{ formatPrice(getProductPrice(item)) }} ៛
                      </template>
                      <template v-else>
                        <span class="text-red-500">Price not available</span>
                      </template>
                    </span>
                    <span v-if="getProductDiscount(item) > 0" class="text-lg text-gray-400 line-through">
                      {{ formatPrice(getProductOldPrice(item)) }} ៛
                    </span>
                    <span v-if="getProductDiscount(item) > 0" class="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-bold">
                      -{{ getProductDiscount(item) }}%
                    </span>
                  </div>
                </div>

                <div class="flex flex-col items-center gap-4">
                  <div class="flex items-center bg-white rounded-lg shadow-sm border border-gray-200">
                    <button 
                      @click="updateQuantity(item, item.quantity - 1)" 
                      :disabled="item.quantity <= 1" 
                      class="px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 rounded-l-lg"
                    >
                      <i class="fa-solid fa-minus text-sm"></i>
                    </button>
                    <span class="px-4 py-2 font-bold text-gray-800 min-w-[3rem] text-center">{{ item.quantity }}</span>
                    <button 
                      @click="updateQuantity(item, item.quantity + 1)" 
                      class="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors duration-200 rounded-r-lg"
                    >
                      <i class="fa-solid fa-plus text-sm"></i>
                    </button>
                  </div>

                  <button 
                    @click="removeItem(item._id)" 
                    class="p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200 group"
                    title="Remove item"
                  >
                    <i class="fa-solid fa-trash group-hover:scale-110 transition-transform duration-200"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

     
        <div class="w-full lg:w-96">
          <div class="bg-white rounded-xl shadow-xl p-8 border border-gray-100 sticky top-8">
            <h2 class="text-2xl font-bold text-gray-800 mb-2">{{ $t('cart.orderSummary') }}</h2>
            
            <div class="space-y-2 mb-2">
              <div class="flex justify-between items-center py-4">
                <span class="text-gray-600">{{ $t('cart.subtotal') }}</span>
                <span class="font-semibold text-gray-800">{{ formatPrice(subtotal) }} ៛</span>
              </div>
              <div class="flex justify-between items-center ">
                <span class="text-gray-600">{{ $t('cart.discount') }}</span>
                <span class="font-semibold text-green-600">-{{ formatPrice(discountTotal) }} ៛</span>
              </div>
            </div>

            <div class="border-t-2 border-gray-200 pt-6 mb-6">
              <div class="flex justify-between items-center">
                <span class="text-xl font-bold text-gray-800">{{ $t('cart.total') }}</span>
                <span class="text-3xl font-bold text-gray-900">{{ formatPrice(finalAmount) }} ៛</span>
              </div>
            </div>

            <button 
              @click="openQRModal" 
              :disabled="isProcessing || cartItems.length === 0" 
              class="w-full py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-bold rounded-xl mb-4 hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
            >
              <i class="fa-solid fa-credit-card"></i>
              {{ isProcessing ? $t('cart.processing') : $t('cart.proceedToCheckout') }}
            </button>

            

          </div>
        </div>
      </div>
    </div>

 
    <div v-if="isLoading" class="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
      <div class="flex flex-col items-center">
        <span class="text-gray-400 text-sm mt-2"></span>
      </div>
    </div>

    
    <div v-if="showQRModal" class="fixed inset-0 z-[100] flex items-center justify-center bg-gray-500 bg-opacity-50">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md p-0 relative mx-4">
     
        <div class="bg-red-600 rounded-t-xl px-6 py-4 flex items-center justify-center">
          <span class="text-white text-2xl font-bold tracking-wide">KHQR</span>
        </div>
        <button 
          @click="showQRModal = false" 
          class="absolute top-3 right-3 text-gray-200 hover:text-red-200 text-xl transition-colors duration-200 z-10"
        >
          <i class="fa-solid fa-times"></i>
        </button>
        <div class="px-8 py-6 flex flex-col items-center">
          <h3 class="text-xl font-semibold mb-2 mt-2">{{ $t('cart.shopName') }}</h3>
          <p class="text-3xl font-bold mb-4">{{ formatPrice(finalAmount) }} KHR</p>
          <div class="mb-4 bg-white border border-gray-200 rounded-lg flex items-center justify-center" style="width: 240px; height: 240px;">
            <img v-if="qrImageUrl" :src="qrImageUrl" alt="QR Code" class="w-full h-full rounded-lg" />
            <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
              <div class="text-center">
                <i class="fa-solid fa-qrcode text-4xl mb-2"></i>
                <p class="text-sm">{{ $t('cart.loadingQR') }}</p>
              </div>
            </div>
          </div>
          <p class="text-gray-500 text-base mb-4">{{ $t('cart.expiresIn') }}</p>
          <div class="flex items-center justify-center mb-4">
            <input 
              type="checkbox" 
              id="payment-confirmation" 
              v-model="paymentConfirmed" 
              class="mr-2 w-4 h-4 accent-green-500" 
            />
            <label for="payment-confirmation" class="text-base text-gray-700 select-none">
              {{ $t('cart.confirmPaymentText') }}
            </label>
          </div>
          <button 
            @click="confirmPayment" 
            :disabled="!paymentConfirmed" 
            class="w-full py-3 text-lg font-bold rounded mb-3 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 bg-green-400 hover:bg-green-500 text-white"
          >
            {{ $t('cart.iHavePaid') }}
          </button>
          <button 
            @click="showQRModal = false" 
            class="w-full py-3 text-lg font-bold rounded border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition"
          >
            {{  $t('common.cancel') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template> -->