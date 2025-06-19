<template>
  <div class="cart-page">
    <section class="header">
      <div class="container">
        <h1>Shopping Cart</h1>
        <p>Your selected items, ready for checkout</p>
      </div>
    </section>

    <div v-if="loading" class="loading">Loading your cart...</div>

    <section class="cart-list">
      <div class="container">
        <div v-if="cart.length > 0">
          <div class="cart-item" v-for="(item, index) in cart" :key="item._id">
            <div class="item-image">
              <img :src="getProductImage(item)" :alt="item.productName">
            </div>
            <div class="item-content">
              <div class="item-details">
                <h3 class="item-name">{{ item.productName }}</h3>
                <div class="item-meta">
                  <span class="item-price">${{ (item.price * item.quantity).toFixed(2) }}</span>
                </div>
              </div>
              <div class="item-controls">
                <div class="quantity-control">
                  <button class="qty-btn" @click="updateQuantity(item, item.quantity - 1)" :disabled="item.quantity <= 1">−</button>
                  <span class="quantity">{{ item.quantity }}</span>
                  <button class="qty-btn" @click="updateQuantity(item, item.quantity + 1)">+</button>
                </div>
                <div class="item-actions">
                  <button class="remove-btn" @click="removeFromCart(item._id)">
                    <i class="fas fa-trash"></i> Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="cart-footer">
            <button class="clear-btn" @click="clearCart">Clear Cart</button>
            <button class="checkout-btn" @click="checkout">Checkout</button>
          </div>
        </div>
        <div v-else class="empty-cart">
          <img :src="require('@/assets/image.png')" alt="Empty Cart">
          <p>Your cart is empty. Start shopping now!</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import apiURL from '../../api/config.js';

const cart = ref([]);
const token = localStorage.getItem("token");
const API = `${apiURL}/api`;
const loading = ref(false);

const fetchCart = async () => {
  try {
    loading.value = true;
    const res = await axios.get(`${API}/getAllDocs/Cart`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const enrichedItems = await Promise.all(
      res.data.data.map(async (item) => {
        const product = await fetchProduct(item.productId);
        return {
          ...item,
          productName: product?.name || 'Unknown Product',
          price: product?.salePrice || 0,
          imageURL: product?.imageURL
        };
      })
    );

    cart.value = enrichedItems;
  } catch (err) {
    alert("⚠️ Failed to fetch cart. Please try again.");
    console.error("Error fetching cart:", err);
  } finally {
    loading.value = false;
  }
};

const fetchProduct = async (productId) => {
  try {
    const res = await axios.get(`${API}/getAllDocs/Product?filter[_id]=${productId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data.data[0];
  } catch (err) {
    console.error("❌ fetchProduct error:", err);
    return null;
  }
};


const getProductImage = (item) => {
  return item.imageURL || require('@/assets/image.png');
};

const updateQuantity = async (item, quantity) => {
  if (quantity < 1) return;
  try {
    await axios.patch(`${API}/updateDoc/Cart/${item._id}`, {
      fields: { quantity, updatedAt: new Date() }
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchCart();
  } catch (err) {
    console.error('Failed to update quantity:', err);
  }
};

const removeFromCart = async (id) => {
  try {
    await axios.delete(`${API}/deleteDoc/Cart/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchCart();
  } catch (err) {
    console.error('Failed to remove item:', err);
  }
};

const clearCart = async () => {
  const promises = cart.value.map(item => axios.delete(`${API}/deleteDoc/Cart/${item._id}`, {
    headers: { Authorization: `Bearer ${token}` }
  }));
  await Promise.all(promises);
  fetchCart();
};

const checkout = () => {
  alert("Checkout not implemented yet!");
};

onMounted(() => {
  fetchCart();
});
</script>

<style scoped>
/* include your existing scoped style here */
</style>
