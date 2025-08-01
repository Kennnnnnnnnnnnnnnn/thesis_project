<template>
  <div class="mt-6 bg-white py-4 md:py-8">
    <!-- Header -->
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-start mb-6 md:mb-8">
        <h1 class="text-xl md:text-2xl font-bold text-gray-800 mb-2 flex items-start justify-start">
          <span class="mr-2 md:mr-3 text-lg md:text-xl"></span>
          {{ $t('cart.title') }}
        </h1>
      </div>

      <div class="flex flex-col lg:flex-row gap-4 md:gap-6 lg:gap-8">
        <!-- Cart Items -->
        <div class="flex-1">
          <div class="bg-white rounded-xl md:rounded-2xl shadow-md md:shadow-xl p-4 md:p-6 lg:p-8 border border-gray-100">
            <div class="flex items-center justify-between mb-4 md:mb-6">
              <button
                v-if="cartItems.length > 0"
                @click="clearCart"
                class="px-3 py-1 md:px-4 md:py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200 flex items-center gap-2 text-sm md:text-base"
              >
                <i class="fa-solid fa-trash-can text-xs md:text-sm"></i>
                {{ $t('cart.clearAll') }}
              </button>
            </div>

            <div v-if="cartItems.length === 0" class="text-center py-8 md:py-16">
              <div class="text-6xl md:text-8xl text-gray-200 mb-4 md:mb-6">🛒</div>
              <h3 class="text-xl md:text-2xl font-semibold text-gray-700 mb-2 md:mb-3">{{ $t('cart.empty') }}</h3>
              <p class="text-gray-500 mb-6 md:mb-8 max-w-md mx-auto text-sm md:text-base">{{ $t('cart.emptyDescription') }}</p>
              <router-link 
                to="/" 
                class="inline-flex items-center px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-bold rounded-lg md:rounded-xl hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 shadow-md hover:shadow-lg md:shadow-lg md:hover:shadow-xl transform hover:-translate-y-0.5 text-sm md:text-base"
              >
                <i class="fa-solid fa-shopping-bag mr-2"></i>
                {{ $t('cart.continueShopping') }}
              </router-link>
            </div>

            <div v-else class="space-y-4 md:space-y-6">
              <div 
                v-for="(item, index) in cartItems" 
                :key="item._id" 
                class="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6 p-4 md:p-6 bg-white-50 rounded-lg md:rounded-xl hover:bg-white-100 transition-colors duration-200 border border-gray-200"
              >
                <div class="relative w-full sm:w-auto">
                  <img 
                    :src="getProductImage(item)" 
                    class="w-full sm:w-24 md:w-28 h-24 md:h-28 rounded-lg md:rounded-xl object-cover bg-white shadow-sm md:shadow-md" 
                    alt="Product"
                  />
                  <div class="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {{ item.quantity }}
                  </div>
                </div>

                <div class="flex-1 min-w-0 w-full sm:w-auto">
                  <h3 class="font-bold text-lg md:text-xl text-gray-800 mb-1 md:mb-2">{{ getProductName(item) }}</h3>
                  <p class="text-gray-600 text-xs md:text-sm mb-2 md:mb-3 line-clamp-2">{{ getProductDescription(item) }}</p>
                  
                  <div class="flex flex-wrap items-center gap-2 md:gap-3">
                    <span class="text-lg md:text-xl lg:text-2xl font-bold text-gray-800">
                      <template v-if="getProductPrice(item) !== null">
                        {{ formatPrice(getProductPrice(item)) }} ៛
                      </template>
                      <template v-else>
                        <span class="text-red-500 text-sm md:text-base">Price not available</span>
                      </template>
                    </span>
                    <span v-if="getProductDiscount(item) > 0" class="text-sm md:text-base text-gray-400 line-through">
                      {{ formatPrice(getProductOldPrice(item)) }} ៛
                    </span>
                    <span v-if="getProductDiscount(item) > 0" class="bg-red-100 text-red-600 px-2 py-0.5 md:py-1 rounded-full text-xs font-bold">
                      -{{ getProductDiscount(item) }}%
                    </span>
                  </div>
                </div>

                <div class="flex flex-row sm:flex-col items-center gap-3 md:gap-4 w-full sm:w-auto justify-between sm:justify-start">
                  <div class="flex items-center bg-white rounded-lg shadow-xs md:shadow-sm border border-gray-200">
                    <button 
                      type="button" @click="updateQuantity(item, item.quantity - 1)" 
                      :disabled="item.quantity <= 1" 
                      class="px-2 md:px-3 py-1 md:py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 rounded-l-lg"
                    >
                      <i class="fa-solid fa-minus text-xs md:text-sm"></i>
                    </button>
                    <span class="px-2 md:px-3 py-1 md:py-2 font-bold text-gray-800 min-w-[2rem] md:min-w-[3rem] text-center text-sm md:text-base">{{ item.quantity }}</span>
                    <button 
                      type="button" @click="updateQuantity(item, item.quantity + 1)" 
                      class="px-2 md:px-3 py-1 md:py-2 text-gray-600 hover:bg-gray-100 transition-colors duration-200 rounded-r-lg"
                    >
                      <i class="fa-solid fa-plus text-xs md:text-sm"></i>
                    </button>
                  </div>

                  <button 
                    type="button" @click="removeItem(item._id)" 
                    class="p-2 md:p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200 group text-sm md:text-base"
                    title="Remove item"
                  >
                    <i class="fa-solid fa-trash group-hover:scale-110 transition-transform duration-200"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="w-full lg:w-96">
          <div class="bg-white rounded-xl shadow-md md:shadow-xl p-4 md:p-6 lg:p-8 border border-gray-100 sticky top-4 md:top-8">
            <h2 class="text-xl md:text-2xl font-bold text-gray-800 mb-2">{{ $t('cart.orderSummary') }}</h2>
            
            <div class="space-y-1 md:space-y-2 mb-1 md:mb-2">
              <div class="flex justify-between items-center py-2 md:py-4">
                <span class="text-gray-600 text-sm md:text-base">{{ $t('cart.subtotal') }}</span>
                <span class="font-semibold text-gray-800 text-sm md:text-base">{{ formatPrice(subtotal) }} ៛</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600 text-sm md:text-base">{{ $t('cart.discount') }}</span>
                <span class="font-semibold text-green-600 text-sm md:text-base">-{{ formatPrice(discountTotal) }} ៛</span>
              </div>
            </div>

            <div class="border-t-2 border-gray-200 pt-4 md:pt-6 mb-4 md:mb-6">
              <div class="flex justify-between items-center">
                <span class="text-lg md:text-xl font-bold text-gray-800">{{ $t('cart.total') }}</span>
                <span class="text-2xl md:text-3xl font-bold text-gray-900">{{ formatPrice(finalAmount) }} ៛</span>
              </div>
            </div>

            <button 
              @click="openQRModal" 
              :disabled="isProcessing || cartItems.length === 0" 
              class="w-full py-3 md:py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-bold rounded-lg md:rounded-xl mb-3 md:mb-4 hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 shadow-md hover:shadow-lg md:shadow-lg md:hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 text-sm md:text-base"
            >
              <i class="fa-solid fa-credit-card"></i>
              {{ isProcessing ? $t('cart.processing') : $t('cart.proceedToCheckout') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading Overlay -->
    <div v-if="isLoading" class="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
      <div class="flex flex-col items-center">
        <span class="text-gray-400 text-sm mt-2"></span>
      </div>
    </div>

    <!-- QR Code Modal -->
    <div v-if="showQRModal" class="fixed inset-0 z-[100] flex items-center justify-center bg-gray-500 bg-opacity-50">
      <div class="bg-white rounded-xl md:rounded-xl shadow-xl w-full max-w-sm md:max-w-md p-0 relative mx-2 md:mx-4">
        <!-- Red Header -->
        <div class="bg-red-600 rounded-t-xl px-4 md:px-6 py-3 md:py-4 flex items-center justify-center">
          <span class="text-white text-xl md:text-2xl font-bold tracking-wide">KHQR</span>
        </div>
        <button 
          @click="showQRModal = false" 
          class="absolute top-2 md:top-3 right-2 md:right-3 text-gray-200 hover:text-red-200 text-lg md:text-xl transition-colors duration-200 z-10"
        >
          <i class="fa-solid fa-times"></i>
        </button>
        <div class="px-4 md:px-6 py-4 md:py-6 flex flex-col items-center">
          <h3 class="text-lg md:text-xl font-semibold mb-1 md:mb-2 mt-1 md:mt-2">{{ $t('cart.shopName') }}</h3>
          <p class="text-2xl md:text-3xl font-bold mb-3 md:mb-4">{{ formatPrice(finalAmount) }} KHR</p>
          <div class="mb-3 md:mb-4 bg-white border border-gray-200 rounded-lg flex items-center justify-center" style="width: 200px; height: 200px; min-width: 240px; min-height: 240px;">
            <img v-if="qrImageUrl" :src="qrImageUrl" alt="QR Code" class="w-full h-full rounded-lg" />
            <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
              <div class="text-center">
                <i class="fa-solid fa-qrcode text-3xl md:text-4xl mb-1 md:mb-2"></i>
                <p class="text-xs md:text-sm">{{ $t('cart.loadingQR') }}</p>
              </div>
            </div>
          </div>
          <p class="text-gray-500 text-sm md:text-base mb-3 md:mb-4">{{ $t('cart.expiresIn') }}</p>
          <div class="flex items-center justify-center mb-3 md:mb-4">
            <input 
              type="checkbox" 
              id="payment-confirmation" 
              v-model="paymentConfirmed" 
              class="mr-2 w-4 h-4 accent-green-500" 
            />
            <label for="payment-confirmation" class="text-sm md:text-base text-gray-700 select-none">
              {{ $t('cart.confirmPaymentText') }}
            </label>
          </div>
          <button 
            @click="confirmPayment" 
            :disabled="!paymentConfirmed" 
            class="w-full py-2 md:py-3 text-base md:text-lg font-bold rounded mb-2 md:mb-3 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 bg-green-400 hover:bg-green-500 text-white"
          >
            {{ $t('cart.iHavePaid') }}
          </button>
          <button 
            @click="showQRModal = false" 
            class="w-full py-2 md:py-3 text-base md:text-lg font-bold rounded border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition"
          >
            {{  $t('common.cancel') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import apiURL from '@/api/config.js';
import { useTelegram } from '@/composables/useTelegram';
import socket from '@/services/socket';
import { useStore } from '@/store/useStore';
import axios from 'axios';
import Swal from 'sweetalert2';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';



const { sendToTelegram } = useTelegram();
const store = useStore();

const router = useRouter();
const token = localStorage.getItem('token');
const cartItems = ref([]);
const defaultImage = require('@/assets/image.png');
const products = ref({});
const isLoading = ref(false);
const isProcessing = ref(false);
const API = `${apiURL}/api`;
const showQRModal = ref(false);
const qrImageUrl = ref('');
const qrTransaction = ref(null);
const billNumber = ref('#' + Math.floor(Math.random() * 10000).toString().padStart(4, '0'));
const paymentConfirmed = ref(false);
const { t } = useI18n();

function requireLogin(t) {
  Swal.fire({
    icon: 'error',
    title: t('alerts.loginRequired'),
    text: t('alerts.pleaseLoginToContinue'),
    confirmButtonText: 'OK',
    allowOutsideClick: false
  }).then(() => {
    router.push('/user-login');
  });
}


// Fetch cart items
const fetchCart = async () => {
  try {
    isLoading.value = true;
    if (!token) {
      // If no token, get cart from localStorage
      const localCart = JSON.parse(localStorage.getItem('cart')) || [];
      cartItems.value = localCart;
      return;
    }

    // First, fetch cart items
    const cartRes = await axios.get(`${API}/getAllDocs/Cart`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    if (cartRes.data && cartRes.data.success) {
      cartItems.value = cartRes.data.data;
      
      // Extract product IDs from cart items
      const productIds = cartItems.value.map(item => item.productId);
      
      // Fetch product details for all products in cart
      if (productIds.length > 0) {
        const productRes = await axios.get(`${API}/getAllDocs/Product`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (productRes.data && productRes.data.success) {
          // Create a map of product data for easy access
          const productMap = {};
          productRes.data.data.forEach(product => {
            productMap[product._id] = product;
          });
          products.value = productMap;
        }
      }
    }
  } catch (err) {
    console.error('❌ Failed to fetch cart:', err);
  } finally {
    isLoading.value = false;
  }
};

// Helper functions to get product data
const getProductImage = (item) => {
  if (!token) {
    return item.productData?.imageURL || defaultImage;
  }
  const product = products.value[item.productId];
  return product?.imageURL || defaultImage;
};

const getProductName = (item) => {
  if (!token) {
    return item.productData?.name || t('common.product');
  }
  const product = products.value[item.productId];
  return product?.name || t('common.product');
};

const getProductPrice = (item) => {
  // Try to get price from productData (guest cart)
  if (!token) {
    if (item.productData && typeof item.productData.salePrice === 'number' && item.productData.salePrice > 0) {
      return item.productData.salePrice;
    }
    // Fallback: try to get from products map if available
    const product = products.value[item.productId];
    if (product && typeof product.salePrice === 'number' && product.salePrice > 0) {
      return product.salePrice;
    }
    // If still missing, return null to indicate missing price
    return null;
  }
  // Logged-in user: get from products map
  const product = products.value[item.productId];
  if (product && typeof product.salePrice === 'number' && product.salePrice > 0) {
    return product.salePrice;
  }
  // Fallback: try to get from productData if available
  if (item.productData && typeof item.productData.salePrice === 'number' && item.productData.salePrice > 0) {
    return item.productData.salePrice;
  }
  // If still missing, return null
  return null;
};

const getProductDiscount = (item) => {
  if (!token) {
    return item.productData?.discount || 0;
  }
  const product = products.value[item.productId];
  return product?.discount || 0;
};

const getProductDescription = (item) => {
  if (!token) {
    return item.productData?.description || t('products.noDescription');
  }
  const product = products.value[item.productId];
  return product?.description || t('products.noDescription');
};



const getProductOldPrice = (item) => {
  if (!token) {
    return item.productData?.oldPrice || '';
  }
  const product = products.value[item.productId];
  return product?.oldPrice || '';
};

// Calculate item total with discount
const getItemTotal = (item) => {
  const price = getProductPrice(item);
  const discount = getProductDiscount(item);
  const discountedPrice = price - (price * discount / 100);
  return discountedPrice * item.quantity;
};

// Format price
const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US').format(Math.round(price));
};

// Get total number of items
const getTotalItems = () => {
  return cartItems.value.reduce((total, item) => total + item.quantity, 0);
};

// Update quantity
const updateQuantity = async (item, newQuantity) => {
  if (newQuantity < 1) return;
  
  try {
    if (!token) {
      // Update in localStorage
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      const existingItem = cart.find(cartItem => cartItem._id === item._id);
      if (existingItem) {
        existingItem.quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        item.quantity = newQuantity;
      }
    } else {
      // Update in database
      await axios.patch(`${API}/updateDoc/Cart/${item._id}`, 
        {
          fields: {
            quantity: newQuantity
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      item.quantity = newQuantity;
    }
  } catch (err) {
    console.error('Error updating quantity:', err);

  }
};

// Remove item from cart
const removeItem = async (id) => {
  try {
    if (!token) {
      // Remove from localStorage
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      cart = cart.filter(item => item._id !== id);
      localStorage.setItem('cart', JSON.stringify(cart));
      cartItems.value = cart;
    } else {
      // Remove from database
      await axios.delete(`${API}/deleteDoc/Cart/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchCart();
    }

    Swal.fire({
      icon: 'success',
      title: t('alerts.removedFromCart'),
      timer: 1000,
      showConfirmButton: false,
    });

  } catch (err) {
    // ...existing code...

  }
};

const clearCart = async () => {
  const result = await Swal.fire({
    title: t('alerts.clearCartTitle'),
    text: t('alerts.clearCartText'),
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: t('alerts.confirmClear'),
    cancelButtonText: t('common.cancel')
  });

  if (result.isConfirmed) {
    try {
      if (!token) {
        localStorage.removeItem('cart');
        cartItems.value = [];
      } else {
        for (const item of cartItems.value) {
          await axios.delete(`${API}/deleteDoc/Cart/${item._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        }
        cartItems.value = [];
      }

      Swal.fire({
        icon: 'success',
        title: t('alerts.cartCleared'),
        timer: 1000,
        showConfirmButton: false,
      });
    } catch (err) {
      // ...existing code...
    }
  }
};


// Proceed to checkout
// Function to get user's current location
const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const token = localStorage.getItem('token');
          const userId = localStorage.getItem('userId');

          // Update user location in database
          const updateResponse = await axios.patch(
            `${API}/updateDoc/User/${userId}`,
            {
              fields: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                updatedAt: new Date().toISOString()
              }
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (updateResponse.data?.success) {
            console.log('Location updated successfully:', {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
            // Show success toast
            Swal.fire({
              toast: true,
              position: 'top-end',
              icon: 'success',
              title: 'Location updated successfully',
              showConfirmButton: false,
              timer: 2000
            });
            resolve(position);
          } else {
            // Show backend error message if available
            const backendMsg = updateResponse.data?.message || 'Failed to update location in database';
            Swal.fire({
              toast: true,
              position: 'top-end',
              icon: 'warning',
              title: backendMsg,
              showConfirmButton: false,
              timer: 3000
            });
            reject(new Error(backendMsg));
          }
        } catch (err) {
          console.error('Error updating location:', err);
          // Show error toast with backend error message if available
          const backendMsg = err?.response?.data?.message || err.message || 'Could not update location';
          // ...existing code...
          reject(err);
        }
      },
      (error) => {
        console.warn('Geolocation error:', error);
        // Show user-friendly error message
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'warning',
          title: 'Please enable location access for better service',
          showConfirmButton: false,
          timer: 2000
        });
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  });
};

const openQRModal = async () => {
  isProcessing.value = true;
  paymentConfirmed.value = false;
  qrImageUrl.value = '';
  qrTransaction.value = null;
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      requireLogin(t);
      isProcessing.value = false;
      return;
    }

    // Try to get current location
    try {
      await getCurrentLocation();
    } catch (locationErr) {
      console.warn('Could not get location:', locationErr);
      // Continue with order process even if location update fails
    }
    billNumber.value = `BILL${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    const payload = {
      amount: finalAmount.value,
      name: 'Customer',
      password: '123456',
      currentLocation: 'Phnom Penh',
      currency: 'KHR',
      storeLabel: 'Rice Shop',
      terminalLabel: 'Online',
      billNumber: billNumber.value,
      phoneNumber: '85512345678'
    };
    const res = await axios.post(`${API}/transaction/generate-qr`, payload, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.data || !res.data.data) {
      Swal.fire({ 
        icon: 'error', 
        title: t('alerts.error'), 
        text: t('alerts.invalidServerResponse') 
      });
      isProcessing.value = false;
      return;
    }
    const { data } = res.data;
    qrTransaction.value = data;
    if (data.qrCodeUrl) {
      qrImageUrl.value = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data.qrCodeUrl)}`;
    } else {
      Swal.fire({ 
        icon: 'error', 
        title: t('alerts.error'), 
        text: t('alerts.qrGenerationFailed') 
      });
      isProcessing.value = false;
      return;
    }
    showQRModal.value = true;
  } catch (err) {
    // ...existing code...
  } finally {
    isProcessing.value = false;
  }
};


const createOrders = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    requireLogin(t);
    isProcessing.value = false;
    return;
  }

  try {
    // Prepare order items
    const orderItems = cartItems.value.map(item => ({
      productId: item.productId || item._id,
      quantity: item.quantity,
      price: getProductPrice(item),
      discount: getProductDiscount(item) || 0
    }));
    const orderPayload = {
      fields: {
        userId: store.getUserId,
        items: orderItems,
        totalCost: finalAmount.value,
        deliveryMethod: 'home',
        deliveryAddress: '',
        paymentMethod: 'bakong',
        note: 'Payment via QR code',
        createdBy: 'customer'
      }
    };
    // Create the order
    const orderResponse = await axios.post(`${API}/insertDoc/Order`, orderPayload, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const allowedRoles = ['customer', 'admin', 'super admin'];
    const userRole = localStorage.getItem('userRole');
    const userId = localStorage.getItem('userId');

    // Fetch user details from User collection
    let userDetails = {};
    try {
      const userResponse = await axios.get(`${API}/getAllDocs/User`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          dynamicConditions: JSON.stringify([
            { field: '_id', operator: '==', value: userId }
          ])
        }
      });

      if (userResponse.data?.success && userResponse.data?.data?.length > 0) {
        userDetails = userResponse.data.data[0];
        console.log('User details retrieved:', userDetails);
      } else {
        console.warn('No user details found for ID:', userId);
      }
    } catch (err) {
      console.error('Failed to fetch user details from database:', err);
    }

    // Format address components
    const formatLocation = (details) => {
      const addressParts = [
        details.village && `Village: ${details.village}`,
        details.commune && `Commune: ${details.commune}`,
        details.district && `District: ${details.district}`,
        details.province && `Province: ${details.province}`,
        details.country && `Country: ${details.country}`
      ].filter(Boolean);
      
      return addressParts.length > 0 ? addressParts.join('\n') : null;
    };

    // Prepare location details
    const latitude = userDetails.latitude;
    const longitude = userDetails.longitude;
    const addressFormatted = formatLocation(userDetails);
    
    // Create location text for Telegram with HTML formatting
    let locationText = '';
    if (latitude && longitude) {
      const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
      locationText = mapUrl;
      if (addressFormatted) {
        locationText += '\n\n' + addressFormatted;
      }
    } else if (addressFormatted) {
      locationText = addressFormatted;
    } else {
      locationText = '📍 Location not available';
    }

    if (allowedRoles.includes(userRole)) {
      await sendToTelegram(
        `🌟 New Order Notification 🌟\n\n` +
        `📦 Order Details\n` +
        `└─ 🆔 Order ID: ${orderResponse.data.data._id || 'N/A'}\n` +
        `└─ 💰 Amount: ៛${formatPrice(finalAmount.value)}\n` +
        `└─ ⏰ Time: ${new Date().toLocaleString()}\n\n` +
        `👤 Customer Information\n` +
        `└─ 😊 Name: ${userDetails.name || 'Guest'}\n` +
        `└─ 📱 Phone: ${userDetails.displayPhoneNumber || userDetails.phoneNumber || 'N/A'}\n\n` +
        `📍 Location\n` +
        `└─ ${locationText}`
      );
    }

    // Update product stock quantities
    try {        // Process each item to update product stock
      for (const item of cartItems.value) {
        const productId = item.productId || item._id;
        
        // Get current product data
        const productResponse = await axios.get(`${API}/getAllDocs/Product?_id=${productId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (productResponse.data && productResponse.data.success && productResponse.data.data.length > 0) {
          const product = productResponse.data.data[0];
          
          // Calculate new stock amount - ensure it's properly calculated for the last item
          const currentStock = parseInt(product.totalStock) || 0;
          const quantityToDeduct = parseInt(item.quantity) || 0;
          const newStockAmount = Math.max(0, currentStock - quantityToDeduct);
          
          console.log(`Stock update for ${product.name}: Current=${currentStock}, Deducting=${quantityToDeduct}, New=${newStockAmount}`);
          
          // Update the product with new stock amount and set status based on stock level
          const updateResponse = await axios.patch(
            `${API}/updateDoc/Product/${productId}`,
            {
              fields: {
                totalStock: newStockAmount,
                status: newStockAmount > 0, // Set status to false if stock is zero
                updatedAt: new Date().toISOString(),
                updatedBy: localStorage.getItem('userId') || 'customer'
              }
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          
          // Emit socket event for real-time update
          socket.emit('dataUpdate', {
            action: 'update',
            collection: 'Product',
            data: productId
          });

          // Update corresponding Stock record if it exists
          try {
            const stockResponse = await axios.get(`${API}/getAllDocs/Stock`, {
              headers: { Authorization: `Bearer ${token}` },
              params: {
                dynamicConditions: JSON.stringify([
                  { field: 'productId', operator: '==', value: productId }
                ])
              }
            });

            if (stockResponse.data && stockResponse.data.data && stockResponse.data.data.length > 0) {
              const stockRecord = stockResponse.data.data[0];
              await axios.patch(`${API}/updateDoc/Stock/${stockRecord._id}`, {
                fields: {
                  quantity: newStockAmount,
                  isOutOfStock: newStockAmount <= 0,
                  updatedAt: new Date().toISOString(),
                  updatedBy: localStorage.getItem('userId') || 'customer'
                }
              }, { headers: { Authorization: `Bearer ${token}` } });

              // Emit stock update event
              socket.emit('dataUpdate', {
                action: 'update',
                collection: 'Stock',
                data: stockRecord._id
              });
            }
          } catch (stockErr) {
            console.error("Error updating stock record:", stockErr);
            // Continue with the order process even if stock update fails
          }
          
          console.log(`Updated stock for product ${product.name}: ${product.totalStock} → ${newStockAmount}`);
        }
      }
      
      // Emit socket event for the new order
      if (orderResponse.data && orderResponse.data.data && orderResponse.data.data._id) {
        socket.emit('dataUpdate', {
          action: 'insert',
          collection: 'Order',
          data: orderResponse.data.data._id
        });
      }
      
    } catch (stockErr) {
      console.error("Failed to update product stock:", stockErr);
      // Continue with order process even if stock update fails
    }
    
    // Clear all items from cart after successful order
    try {
      if (!token) {
        // Clear local storage cart
        localStorage.removeItem('cart');
        cartItems.value = [];
      } else {
        // Delete each cart item from database
        const deletePromises = cartItems.value.map(item => 
          axios.delete(`${API}/deleteDoc/Cart/${item._id}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        );
        
        await Promise.all(deletePromises);
        cartItems.value = []; // Clear cart items in UI
        
        // Emit socket event for cart update
        socket.emit('dataUpdate', {
          action: 'delete',
          collection: 'Cart',
          data: 'all'
        });
      }
    } catch (clearErr) {
      console.error("Failed to clear cart after order:", clearErr);
      // Don't interrupt the flow if clearing cart fails
    }
    
    Swal.fire({ icon: 'success', title: t('alerts.orderSubmitted'),  timer: 1500, showConfirmButton: false });
    showQRModal.value = false;
    // No need to fetch cart again since we've already cleared it
  } catch (err) {
  // ...existing code...
  }
};

const confirmPayment = async () => {
  try {
    if (!qrTransaction.value || !qrTransaction.value._id) {
      Swal.fire({ 
        icon: 'error', 
        title: t('alerts.invalidTransaction'), 
        text: t('alerts.tryAgain') 
      });
      return;
    }
    const txId = qrTransaction.value._id;
    const token = localStorage.getItem('token');
    // Mark as scanned (optional)
    try {
      await axios.post(`${API}/transaction/update-scanned`, {
        transactionId: txId,
        scannerInfo: { accountId: t('scanner.customer'), bankName: t('scanner.bankBakong'), deviceInfo: t('scanner.webBrowser') }
      }, { headers: { Authorization: `Bearer ${token}` } });
    } catch (scanErr) { /* ignore */ }
    // Mark as paid
    await axios.patch(`${API}/transaction/update-status/${txId}`, { paymentStatus: 'paid' }, { headers: { Authorization: `Bearer ${token}` } });
    // Create the order
    await createOrders();
  } catch (err) {
    // ...existing code...
  }
};

// Cart calculations
const subtotal = computed(() =>
  cartItems.value.reduce((sum, item) => {
    const price = getProductPrice(item);
    return sum + price * item.quantity;
  }, 0)
);

const discountTotal = computed(() =>
  cartItems.value.reduce((sum, item) => {
    const price = getProductPrice(item);
    const discount = getProductDiscount(item);
    return sum + (price * item.quantity * discount) / 100;
  }, 0)
);

const finalAmount = computed(() =>
  Math.round(subtotal.value - discountTotal.value)
);

onMounted(() => {
  fetchCart();
  
  if (!socket.connected) {
    socket.connect();
  }
  
  socket.on('dataUpdate', (update) => {
    if (update.collection === 'Product' || update.collection === 'Cart') {
      console.log('🔄 Real-time cart/product update received:', update);
      fetchCart();
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'info',
        title: 'Cart updated in real-time',
        showConfirmButton: false,
        timer: 1500
      });
    }
  });

  socket.on('connect', () => console.log(' Socket connected:', socket.id));
  socket.on('disconnect', () => console.log(' Socket disconnected'));
  socket.on('error', (error) => console.error(' Socket error:', error));
});

onUnmounted(() => {
  socket.off('dataUpdate');
  socket.off('connect');
  socket.off('disconnect');
  socket.off('error');
});

</script>


