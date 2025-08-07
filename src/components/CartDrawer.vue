<template>
  <div
    class="fixed top-0 right-0 w-[360px] h-full bg-white border-l border-gray-200 shadow-lg z-[999] flex flex-col p-5"
    v-if="visible">
    <div class="flex justify-between items-center mb-3 text-lg">
      <h3 class="font-medium">Your Basket</h3>
      <button @click="close" class="text-xl hover:text-red-500">✕</button>
    </div>

    <div v-if="cartItems.length === 0" class="text-center text-gray-500 mt-12">Your cart is empty</div>

    <div v-else class="flex-1 overflow-y-auto">
      <div v-for="item in cartItems" :key="item._id" class="flex items-center mb-4">
        <img :src="item.imageURL || defaultImg" class="w-[70px] h-[70px] object-cover mr-3 rounded bg-gray-100" />
        <div class="flex-1">
          <h4 class="m-0 text-sm font-semibold">{{ item.name }}</h4>
          <div class="text-xs text-gray-500 mb-1">Available stock: <span class="font-bold">{{ item.totalStock ?? 'N/A' }}</span></div>
          <div class="flex items-center gap-2.5 my-1">
            <button @click="handleQtyChange(item, item.quantity - 1)" :disabled="item.quantity <= 1"
              class="w-[22px] h-[22px] border border-gray-200 bg-gray-50 rounded cursor-pointer disabled:opacity-50">−</button>
            <input type="number" min="1" :max="item.totalStock" v-model.number="item.quantity" @change="handleQtyInput(item)" class="w-14 text-center border rounded px-1 py-0.5" />
            <button @click="handleQtyChange(item, item.quantity + 1)"
              class="w-[22px] h-[22px] border border-gray-200 bg-gray-50 rounded cursor-pointer">+</button>
          </div>
          <p class="text-orange-600 font-bold">៛{{ (discountedPrice(item) * item.quantity).toFixed(2) }}</p>
        </div>
        <button @click="removeItem(item)" class="bg-transparent border-0 text-xl cursor-pointer text-red-700">×</button>
      </div>
    </div>

    <div class="border-t border-gray-100 pt-3">
      <p class="mb-1">Subtotal: ៛{{ subtotal.toFixed(2) }}</p>
      <p class="font-bold mb-3">Total: ៛{{ subtotal.toFixed(2) }}</p>
      <button @click="proceedToCheckout"
        class="bg-green-600 text-white py-3 w-full border-0 rounded-md font-bold text-base cursor-pointer hover:bg-green-700 transition-colors">
        Proceed to Checkout
      </button>
    </div>
  </div>

  <v-dialog v-model="showQRModal" width="320" persistent>
    <v-card class="rounded-lg overflow-hidden">
      <div class="bg-red-600 text-white py-2 px-3 text-center font-semibold text-base">
        KHQR
      </div>

      <div class="p-4 bg-white">
        <h3 class="text-center text-gray-800 text-base font-semibold mb-1">Rice Shop</h3>

        <p class="text-center text-xl font-bold mb-3">{{ subtotal.toFixed(0) }} KHR</p>

        <div class="bg-white p-1.5 rounded-md shadow-sm border border-gray-200 mx-auto mb-3"
          style="width: 180px; height: 180px;">
          <img v-if="qrImageUrl" :src="qrImageUrl" alt="QR Code" class="w-full h-full" />
          <div v-else class="w-full h-full flex items-center justify-center">
            <span class="text-gray-400 text-sm">Loading QR code...</span>
          </div>
        </div>

        <p class="text-center text-gray-500 text-xs mb-3">Expires in 5 minutes</p>

        <div class="flex items-start justify-center mb-3">
          <input type="checkbox" id="payment-confirmation" v-model="paymentConfirmed" class="mr-2 mt-1" />
          <label for="payment-confirmation" class="text-sm text-gray-700 leading-snug">
            I confirm that I have scanned and paid
          </label>
        </div>

        <button
            @click="handleConfirmPayment"
            class="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-md font-semibold text-sm transition-colors mb-2 flex items-center justify-center"
            :disabled="!paymentConfirmed || isSubmitting"
            :class="{ 'opacity-50 cursor-not-allowed': !paymentConfirmed || isSubmitting }"
          >
            <span v-if="!isSubmitting">I'VE PAID</span>
            <svg v-else class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10"
                stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
          </button>


        <button @click="showQRModal = false"
          class="w-full bg-white text-gray-700 py-2 rounded-md font-normal text-sm border border-gray-300 hover:bg-gray-50 transition-colors">
          CANCEL
        </button>
      </div>
    </v-card>
  </v-dialog>

</template>

<script setup>
import apiURL from '@/api/config.js';
import { useTelegram } from '@/composables/useTelegram';
import { useStore } from '@/store/useStore';
import axios from 'axios';
import Swal from 'sweetalert2';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
const { sendToTelegram } = useTelegram();


const router = useRouter();
const store = useStore();
const userId = store.userId;
const API = `${apiURL}/api`;
const showQRModal = ref(false);
const qrImageUrl = ref('');
const qrTransaction = ref(null);
const billNumber = ref('#' + Math.floor(Math.random() * 10000).toString().padStart(4, '0'));
const paymentConfirmed = ref(false);
const isSubmitting = ref(false);

const props = defineProps(['visible', 'cartItems']);
const emit = defineEmits(['close', 'updateQty', 'removeItem']);

const delivery = ref('home');
const defaultImg = require('@/assets/image.png');

// Helper function to format price
const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US').format(Math.round(price));
};

const discountedPrice = (product) => {
  if (!product.discount || product.discount <= 0) return product.salePrice;
  return product.salePrice * (1 - product.discount / 100);
};

const subtotal = computed(() =>
  props.cartItems.reduce((sum, item) => sum + discountedPrice(item) * item.quantity, 0)
);

const close = () => emit('close');
// Custom quantity change handler with stock check
const changeQty = (item, qty) => emit('updateQty', item, qty);
const handleQtyChange = (item, newQty) => {
  if (newQty > (item.totalStock ?? Infinity)) {
    Swal.fire({
      icon: 'warning',
      title: 'Not enough stock',
      text: `You cannot purchase more than the available stock (${item.totalStock}).`,
      timer: 1500,
      showConfirmButton: false
    });
    return;
  }
  if (newQty < 1) newQty = 1;
  emit('updateQty', item, newQty);
};

const handleQtyInput = (item) => {
  if (item.quantity > (item.totalStock ?? Infinity)) {
    Swal.fire({
      icon: 'warning',
      title: 'Not enough stock',
      text: `You cannot purchase more than the available stock (${item.totalStock}).`,
      timer: 1500,
      showConfirmButton: false
    });
    item.quantity = item.totalStock;
    emit('updateQty', item, item.totalStock);
  } else if (item.quantity < 1) {
    item.quantity = 1;
    emit('updateQty', item, 1);
  } else {
    emit('updateQty', item, item.quantity);
  }
};
const removeItem = (item) => emit('removeItem', item);

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
            resolve(position);
          } else {
            reject(new Error('Failed to update location in database'));
          }
        } catch (err) {
          console.error('Error updating location:', err);
          reject(err);
        }
      },
      (error) => {
        console.warn('Geolocation error:', error);
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

const proceedToCheckout = async () => {
  try {
    const userId = store.userId;
    const token = localStorage.getItem('token');

    if (!userId || !token) {
      Swal.fire({
        icon: 'warning',
        title: 'Login Required',
        text: 'You need to register or login before checking out.',
        confirmButtonText: 'Go to Register',
        allowOutsideClick: false
      }).then(() => {
        window.location.href = '/register';
      });
      return;
    }

    // Try to get current location
    try {
      await getCurrentLocation();
    } catch (locationErr) {
      console.warn('Could not get location:', locationErr);
      // Continue with order process even if location update fails
    }

    const totalAmount = subtotal.value;

    billNumber.value = `BILL${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

    const payload = {
      amount: totalAmount,
      userId: userId,
      name: store.userName || 'Guest',
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

    console.log("Response received:", res.data);

    if (!res.data || !res.data.data) {
      console.error("Invalid response format:", res.data);
      alert("Invalid response from server");
      return;
    }

    const { data } = res.data;
    qrTransaction.value = data;

    if (data.qrCodeUrl) {
      qrImageUrl.value = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data.qrCodeUrl)}`;
      console.log("QR code URL:", data.qrCodeUrl);
    } else {
      console.error("No QR code URL in response:", data);
      alert("Failed to generate QR code");
      return;
    }

    showQRModal.value = true;

  } catch (err) {
    console.error('Failed to initiate payment:', err);

    if (err.response) {
      console.error('Error response:', err.response.status, err.response.data);

      if (err.response.status === 401) {
        alert("Your session has expired. Please login again.");
        return;
      }

      if (err.response.data && err.response.data.message) {
        alert(`Error: ${err.response.data.message}`);
        return;
      }
    }

    alert('Failed to initiate payment. Please try again.');
  }
};

const handleConfirmPayment = async () => {
  if (isSubmitting.value) return; // prevent double click
  isSubmitting.value = true;
  try {
    await confirmPayment();
  } catch (err) {
    console.error('Payment confirmation failed:', err);
  } finally {
    isSubmitting.value = false;
  }
};


const createOrders = async () => {
  const token = localStorage.getItem('token');
  const userId = store.userId;

  if (!token || !userId) {
    alert('Login required to complete order');
    return;
  }

  try {
    const orderItems = props.cartItems.map(item => ({
      productId: item._id,
      name: item.name, 
      quantity: item.quantity,
      price: discountedPrice(item),
      discount: item.discount || 0,
      image: item.imageURL || ''
    }));

    const totalCost = subtotal.value;

    const orderPayload = {
      fields: {
        userId: userId,
        items: orderItems,
        totalCost: totalCost,
        deliveryMethod: delivery.value,
        deliveryAddress: "",
        paymentMethod: "bakong",
        note: "Payment via QR code",
        createdBy: userId
      }
    };

    // Create the order
    const orderResponse = await axios.post(`${API}/insertDoc/Order`, orderPayload, {
      headers: { Authorization: `Bearer ${token}` }
    });

    // Update the transaction with the order ID if needed
    if (qrTransaction.value && qrTransaction.value._id && orderResponse.data && orderResponse.data.data && orderResponse.data.data._id) {
      try {
        await axios.patch(
          `${API}/transaction/update-status/${qrTransaction.value._id}`,
          {
            paymentStatus: 'paid',
            orderId: orderResponse.data.data._id,
            paidAt: new Date().toISOString()
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Transaction updated with order ID");
      } catch (updateErr) {
        console.error("Failed to update transaction with order ID:", updateErr);
      }
    }

    // Enhanced Telegram notification with detailed order information
    const allowedRoles = ['customer', 'admin', 'super admin'];
    const userRole = localStorage.getItem('userRole');
    
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
    
    // Create location text for Telegram
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

    // Send comprehensive Telegram notification
    if (allowedRoles.includes(userRole)) {
      await sendToTelegram(
        `🌟 New Order Notification 🌟\n\n` +
        `📦 Order Details\n` +
        `└─ 🆔 Order ID: ${orderResponse.data.data._id || 'N/A'}\n` +
        `└─ 💰 Amount: ៛${formatPrice(totalCost)}\n` +
        `└─ ⏰ Time: ${new Date().toLocaleString()}\n\n` +
        `👤 Customer Information\n` +
        `└─ 😊 Name: ${userDetails.name || 'Guest'}\n` +
        `└─ 📱 Phone: ${userDetails.displayPhoneNumber || userDetails.phoneNumber || 'N/A'}\n\n` +
        `📍 Location\n` +
        `└─ ${locationText}`
      );
    }



    // Update product stock quantities
    try {
      // Process each item to update product stock
      for (const item of props.cartItems) {
        // Get current product data
        const productResponse = await axios.get(`${API}/getAllDocs/Product?_id=${item._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (productResponse.data && productResponse.data.success && productResponse.data.data.length > 0) {
          const product = productResponse.data.data[0];
          
          // Calculate new stock amount
          const currentStock = parseInt(product.totalStock) || 0;
          const quantityToDeduct = parseInt(item.quantity) || 0;
          const newStockAmount = Math.max(0, currentStock - quantityToDeduct);
          
          console.log(`Stock update for ${product.name}: Current=${currentStock}, Deducting=${quantityToDeduct}, New=${newStockAmount}`);
          
          // Update the product with new stock amount and set status based on stock level
          await axios.patch(
            `${API}/updateDoc/Product/${item._id}`,
            {
              fields: {
                totalStock: newStockAmount,
                status: newStockAmount > 0, // Set status to false if stock is zero
                updatedAt: new Date().toISOString(),
                updatedBy: userId
              }
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          // Update corresponding Stock record if it exists
          try {
            const stockResponse = await axios.get(`${API}/getAllDocs/Stock`, {
              headers: { Authorization: `Bearer ${token}` },
              params: {
                dynamicConditions: JSON.stringify([
                  { field: 'productId', operator: '==', value: item._id }
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
                  updatedBy: userId
                }
              }, { headers: { Authorization: `Bearer ${token}` } });
            }
          } catch (stockErr) {
            console.error("Error updating stock record:", stockErr);
            // Continue with the order process even if stock update fails
          }
          
          console.log(`Updated stock for product ${product.name}: ${product.totalStock} → ${newStockAmount}`);
        }
      }
    } catch (stockErr) {
      console.error("Failed to update product stock:", stockErr);
      // Continue with order process even if stock update fails
    }

    showQRModal.value = false;
    emit('close');
    props.cartItems.forEach(item => emit('removeItem', item));
    
    Swal.fire({ 
      icon: 'success', 
      title: 'Order Submitted Successfully!',  
      timer: 1500, 
      showConfirmButton: false 
    });
    
  } catch (err) {
    console.error('Failed to submit order:', err);

    if (err.response) {
      console.error('Error response:', err.response.status, err.response.data);
    }

    alert('Order creation failed. Please contact support.');
  }
};

const confirmPayment = async () => {
  try {
    if (!qrTransaction.value || !qrTransaction.value._id) {
      alert('Invalid transaction. Please try again.');
      return;
    }

    const txId = qrTransaction.value._id;
    const token = localStorage.getItem('token');

    try {
      // First, try to simulate the QR code being scanned
      console.log("Updating transaction as scanned");
      await axios.post(`${API}/transaction/update-scanned`, {
        transactionId: txId,
        scannerInfo: {
          accountId: "user-" + store.userId,
          bankName: "BAKONG",
          deviceInfo: "Web Browser"
        }
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (scanErr) {
      console.error("Failed to update scanned status:", scanErr);
      // Continue anyway - this step is optional
    }

    // Then update the payment status to paid
    console.log("Updating payment status to paid");
    await axios.patch(`${API}/transaction/update-status/${txId}`,
      { paymentStatus: 'paid' },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Finally create the order
    await createOrders();

    showQRModal.value = false;
    Swal.fire({
      icon: 'success',
      title: 'Payment Confirmed',
      text: 'Your payment has been successfully confirmed.',
      timer: 1000,
      showConfirmButton: false,
      willClose: () => {
        router.push('/history');
      }

    });

  } catch (err) {
    console.error('Confirm failed:', err);

    // If we get a 401 error, the token might be expired
    if (err.response && err.response.status === 401) {
      alert('Your session has expired. Please log in again.');
      return;
    }

    // If we can't update the transaction status, try creating the order anyway
    try {
      await createOrders();
    } catch (orderErr) {
      console.error('Failed to create order:', orderErr);
      alert('Failed to confirm payment and create order');
    }
  }
};
</script>

<style scoped>
.drawer {
  position: fixed;
  top: 0;
  right: 0;
  width: 360px;
  height: 100%;
  background: white;
  border-left: 1px solid #ddd;
  box-shadow: -3px 0 8px rgba(0, 0, 0, 0.1);
  z-index: 999;
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 18px;
}

.items {
  flex: 1;
  overflow-y: auto;
}

.item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.item img {
  width: 70px;
  height: 70px;
  object-fit: cover;
  margin-right: 10px;
  border-radius: 4px;
  background: #f4f4f4;
}

.details {
  flex: 1;
}

.details h4 {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
}

.category {
  font-size: 12px;
  color: #888;
  margin-bottom: 4px;
}

.qty {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 4px 0;
}

.qty button {
  width: 22px;
  height: 22px;
  border: 1px solid #ddd;
  background: #f9f9f9;
  border-radius: 4px;
  cursor: pointer;
}

.price {
  color: #ff5722;
  font-weight: bold;
}

.remove {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #d32f2f;
}

.summary {
  border-top: 1px solid #eee;
  padding-top: 10px;
}

.delivery {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 14px;
}

.checkout {
  background: #00c853;
  color: white;
  padding: 12px;
  width: 100%;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  margin-top: 10px;
}

.empty {
  text-align: center;
  color: #999;
  margin-top: 50px;
}

.v-card {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15) !important;
}
</style>