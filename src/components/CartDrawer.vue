<template>
  <div class="drawer" v-if="visible">
    <div class="header">
      <h3>Your Basket</h3>
      <button @click="close">✕</button>
    </div>

    <div v-if="cartItems.length === 0" class="empty">Your cart is empty</div>

    <div v-else class="items">
      <div v-for="item in cartItems" :key="item._id" class="item">
        <img :src="item.imageURL || defaultImg" />
        <div class="details">
          <h4>{{ item.name }}</h4>
          <p class="category">No category</p>
          <p class="qty">
            <button @click="changeQty(item, item.quantity - 1)" :disabled="item.quantity <= 1">−</button>
            {{ item.quantity }}
            <button @click="changeQty(item, item.quantity + 1)">+</button>
          </p>
          <p class="price">£{{ (discountedPrice(item) * item.quantity).toFixed(2) }}</p>
        </div>
        <button class="remove" @click="removeItem(item)">×</button>
      </div>
    </div>

    <div class="summary">
      <div class="delivery">
        <label><input type="radio" value="home" v-model="delivery" /> Home Delivery</label>
        <label><input type="radio" value="collect" v-model="delivery" /> Click & Collect</label>
      </div>
      <p>Subtotal: £{{ subtotal.toFixed(2) }}</p>
      <p><strong>Total: £{{ subtotal.toFixed(2) }}</strong></p>
      <button class="checkout" @click="proceedToCheckout">Proceed to Checkout</button>
    </div>
  </div>

  <v-dialog v-model="showQRModal" width="400">
    <v-card class="pa-4" style="text-align: center">
      <h3 class="mb-2">Scan to Pay (Bakong)</h3>
      <img :src="qrImageUrl" alt="QR Code" style="width: 100%" />
      <p class="mt-2">Expires in 5 minutes</p>
      <v-btn color="green" class="mt-4" @click="confirmPayment">I've Paid</v-btn>
      <v-btn text @click="showQRModal = false">Cancel</v-btn>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed } from 'vue';
import axios from 'axios';
import apiURL from '@/api/config.js';

const API = `${apiURL}/api`;
const showQRModal = ref(false);
const qrImageUrl = ref('');
const qrTransaction = ref(null);

const props = defineProps(['visible', 'cartItems']);
const emit = defineEmits(['close', 'updateQty', 'removeItem']);

const delivery = ref('home');
const defaultImg = require('@/assets/image.png');

const discountedPrice = (product) => {
  if (!product.discount || product.discount <= 0) return product.salePrice;
  return product.salePrice * (1 - product.discount / 100);
};


const subtotal = computed(() =>
  props.cartItems.reduce((sum, item) => sum + discountedPrice(item) * item.quantity, 0)
);

const close = () => emit('close');
const changeQty = (item, qty) => emit('updateQty', item, qty);
const removeItem = (item) => emit('removeItem', item);

const proceedToCheckout = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    const totalAmount = subtotal.value;
    const payload = {
      amount: totalAmount,
      name: user?.name || 'Guest',
      password: user?.password || '123456',
      currentLocation: 'Phnom Penh',
      currency: 'KHR'
    };

    const res = await axios.post(`${API}/transaction/generate-qr`, payload, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const { data } = res.data;
    qrTransaction.value = data; 
    qrImageUrl.value = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data.qrCodeUrl)}`;
    showQRModal.value = true;

  } catch (err) {
    console.error(' Failed to initiate payment:', err);
    alert('Failed to initiate payment. Please try again.');
  }
};

const confirmPayment = async () => {
  try {
    const txId = qrTransaction.value._id;
    const res = await axios.get(`${API}/transaction/${txId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });

    if (res.data.paymentStatus === 'paid') {
      alert(' Payment confirmed!');
      await createOrders();
    } else {
      alert(' Payment still pending. Please wait...');
    }
  } catch (err) {
    console.error(' Confirm failed:', err);
    alert('Failed to confirm payment');
  }
};

const createOrders = async () => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  try {
    for (const item of props.cartItems) {
      const payload = {
        fields: {
          productId: item._id,
          userId: user._id,
          quantity: item.quantity,
          discountId: null,
          totalCost: discountedPrice(item) * item.quantity,
          status: 'paid',
          createdBy: user._id
        }
      };

      await axios.post(`${API}/insertDoc/Order`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }

    alert(' Orders submitted successfully!');
    showQRModal.value = false;
  } catch (err) {
    console.error(' Failed to submit orders:', err);
    alert('Order creation failed. Please contact support.');
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
</style>
