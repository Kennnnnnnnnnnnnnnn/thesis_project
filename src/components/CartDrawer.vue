<template>
  <div class="cart-drawer">
    <h2 class="cart-title">🛒 Your Cart</h2>

    <div v-if="cart.length === 0" class="empty-cart">
      <p>No items yet.</p>
    </div>

    <div v-else class="cart-items">
      <div class="cart-item" v-for="item in cart" :key="item._id">
        <img :src="item.product?.imageURL || defaultImage" class="item-img" />
        <div class="item-details">
          <h3>{{ item.product?.name }}</h3>
          <p>Qty: {{ item.quantity }}</p>
          <p class="item-price">${{ discountedPrice(item.product).toFixed(2) }}</p>
        </div>
      </div>

      <div class="cart-summary">
        <p>Total to Pay:</p>
        <h2 class="total-price">${{ totalPrice.toFixed(2) }}</h2>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import axios from 'axios';
import apiURL from '@/api/config';

const props = defineProps({
  modelValue: Boolean
});

const defaultImage = require('@/assets/image.png');
const cart = ref([]);
const token = localStorage.getItem('token');
const API = `${apiURL}/api`;

const fetchCart = async () => {
  try {
    const res = await axios.get(`${API}/getAllDocs/Cart`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    cart.value = res.data.data;
  } catch (err) {
    console.error('❌ Failed to fetch cart:', err);
  }
};

const discountedPrice = (product) => {
  if (!product?.discount) return product?.salePrice || 0;
  return product.salePrice * (1 - product.discount / 100);
};

const totalPrice = computed(() => {
  return cart.value.reduce((sum, item) => {
    return sum + discountedPrice(item.product) * item.quantity;
  }, 0);
});

watch(() => props.modelValue, (val) => {
  if (val) fetchCart();
});

onMounted(() => {
  window.addEventListener('refresh-cart', fetchCart);
});
</script>

<style scoped>
.cart-drawer {
  padding: 16px;
  display: flex;
  flex-direction: column;
  height: 100%;
}
.cart-title {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 16px;
}
.empty-cart {
  text-align: center;
  color: #777;
  margin-top: 40px;
}
.cart-items {
  flex: 1;
  overflow-y: auto;
}
.cart-item {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #eee;
  padding: 10px 0;
}
.item-img {
  width: 60px;
  height: 60px;
  object-fit: contain;
  background: #f9f9f9;
  border-radius: 6px;
  margin-right: 12px;
}
.item-details {
  flex: 1;
}
.item-details h3 {
  font-size: 14px;
  margin-bottom: 4px;
}
.item-details p {
  font-size: 13px;
  color: #666;
}
.item-price {
  font-weight: bold;
  color: #ff5722;
}
.cart-summary {
  border-top: 1px solid #ddd;
  padding-top: 16px;
  text-align: center;
  font-size: 18px;
}
.total-price {
  font-size: 24px;
  color: #2196f3;
  font-weight: bold;
  margin-top: 6px;
}
</style>