<template>
  <div class="min-h-screen bg-white py-8">
    <!-- Header -->
    <div class="max-w-6xl mx-auto px-2 mt-2">
      <div class="text-start mb-8">
        <h1 class="text-2xl font-bold text-gray-800 mb-2 flex items-start justify-start">
          <span class="mr-3 text-xl">🛒</span>
          {{ $t('cart.title') }}
        </h1>
        <!-- <p class="text-gray-600 text-lg text-start">
          {{ cartItems.length }} {{ $t('cart.items', { count: cartItems.length }) }}
        </p> -->
      </div>

      <!-- Stepper -->
      <!-- <div class="flex justify-center mb-10">
        <div class="flex items-center space-x-8">
          <div class="flex items-center">
            <div class="w-10 h-10 bg-yellow-500 text-white rounded-full flex items-center justify-center font-bold text-lg">1</div>
            <span class="ml-3 text-lg font-semibold text-yellow-600">Cart</span>
          </div>
          <div class="w-16 h-0.5 bg-gray-300"></div>
          <div class="flex items-center">
            <div class="w-10 h-10 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center font-bold text-lg">2</div>
            <span class="ml-3 text-lg font-medium text-gray-400">Checkout</span>
          </div>
          <div class="w-16 h-0.5 bg-gray-300"></div>
          <div class="flex items-center">
            <div class="w-10 h-10 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center font-bold text-lg">3</div>
            <span class="ml-3 text-lg font-medium text-gray-400">Payment</span>
          </div>
        </div>
      </div> -->

      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Cart Items -->
        <div class="flex-1">
          <div class="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-bold text-gray-800">{{ $t('cart.itemsTitle') }}</h2>
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
                    <span class="text-2xl font-bold text-gray-800">{{ formatPrice(getProductPrice(item)) }} ៛</span>
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

        <!-- Order Summary -->
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

            
            <!-- <div class="bg-gray-50 rounded-xl p-4">
              <div class="mb-2 font-semibold">Have a Coupon?</div>
              <div class="flex">
                <input 
                  class="flex-1 border border-gray-300 rounded-l-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent" 
                  placeholder="Coupon Code" 
                />
                <button class="bg-yellow-500 text-white px-6 py-3 rounded-r-lg font-bold hover:bg-yellow-600 transition-colors duration-200">
                  Apply
                </button>
              </div>
            </div> -->
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
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md p-0 relative mx-4">
        <!-- Red Header -->
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
</template>

<script setup>
import apiURL from '@/api/config.js';
import socket from '@/services/socket';
import axios from 'axios';
import Swal from 'sweetalert2';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

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
    Swal.fire({
      icon: 'error',
      title: t('alerts.failedToLoadCart'),
      text: t('alerts.tryAgain'),
      timer: 3000,
      showConfirmButton: false,
    });
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
  if (!token) {
    return item.productData?.salePrice || 0;
  }
  const product = products.value[item.productId];
  return product?.salePrice || 0;
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
    Swal.fire({
      icon: 'error',
      title: t('alerts.failedToUpdateQuantity'),
      timer: 1500,
      showConfirmButton: false,
    });

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
    Swal.fire({
      icon: 'error',
      title: t('alerts.failedToRemoveItem'),
      timer: 1500,
      showConfirmButton: false,
    });

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
      Swal.fire({
        icon: 'error',
        title: t('alerts.failedToClearCart'),
        timer: 1500,
        showConfirmButton: false,
      });
    }
  }
};


// Proceed to checkout
const openQRModal = async () => {
  isProcessing.value = true;
  paymentConfirmed.value = false;
  qrImageUrl.value = '';
  qrTransaction.value = null;
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire({ 
        icon: 'error', 
        title: t('alerts.loginRequired'), 
        text: t('alerts.pleaseLoginToContinue') 
      });
      isProcessing.value = false;
      return;
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
    Swal.fire({ 
      icon: 'error', 
      title: t('alerts.paymentInitiationFailed'), 
      text: err?.response?.data?.message || t('alerts.tryAgain') 
    });
  } finally {
    isProcessing.value = false;
  }
};


const createOrders = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    Swal.fire({ 
      icon: 'error', 
      title: t('alerts.loginRequired'), 
      text: t('alerts.pleaseLoginToContinue') 
    });
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
        items: orderItems,
        totalCost: finalAmount.value,
        deliveryMethod: 'home',
        deliveryAddress: '',
        paymentMethod: 'bakong',
        paymentStatus: 'paid',
        status: 'paid',
        note: 'Payment via QR code',
        createdBy: 'customer'
      }
    };
    // Create the order
    const orderResponse = await axios.post(`${API}/insertDoc/Order`, orderPayload, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    // Update product stock quantities
    try {
      // Process each item to update product stock
      for (const item of cartItems.value) {
        const productId = item.productId || item._id;
        
        // Get current product data
        const productResponse = await axios.get(`${API}/getAllDocs/Product?_id=${productId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (productResponse.data && productResponse.data.success && productResponse.data.data.length > 0) {
          const product = productResponse.data.data[0];
          
          // Calculate new stock amount
          const newStockAmount = Math.max(0, (product.totalStock || 0) - item.quantity);
          
          // Update the product with new stock amount
          const updateResponse = await axios.patch(
            `${API}/updateDoc/Product/${productId}`,
            {
              fields: {
                totalStock: newStockAmount,
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
  Swal.fire({ 
      icon: 'error', 
      title: t('alerts.orderCreationFailed'), 
      text: err?.response?.data?.message || t('alerts.contactSupport') 
    });
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
    Swal.fire({ 
      icon: 'error', 
      title: t('alerts.confirmFailed'), 
      text: err?.response?.data?.message || t('alerts.tryAgain') 
    });
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
  
  // Connect to socket if not already connected
  if (!socket.connected) {
    socket.connect();
  }
  
  // Listen for socket events
  socket.on('dataUpdate', (update) => {
    if (update.collection === 'Product') {
      // Refresh cart to get updated product data
      fetchCart();
    }
  });
});

// Clean up socket listeners when component is unmounted
onUnmounted(() => {
  socket.off('dataUpdate');
});
</script>

<style scoped>
/* All handled by Tailwind */
</style>
