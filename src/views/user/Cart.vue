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
import apiURL from '@/api/config.js';


const cart = ref([]);
const user = ref({});
const token = localStorage.getItem("token");
const API = `${apiURL}/api`;
const loading = ref(false);


const fetchCart = async () => {
  try {
    loading.value = true;

    const res = await axios.get(`${API}/getAllDocs/Cart?filter[userId]=${user.value._id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    // Enrich each cart item with product details
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
      quantity,
      updatedAt: new Date(),
      updatedBy: user.value.name
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
  const storedUserId = localStorage.getItem("userId");
if (storedUserId) {
  user.value = { _id: storedUserId, name: "Customer" };
  fetchCart();
} else {
  console.error("User ID not found in localStorage.");
}

});
</script>

<style scoped>
.cart-page {
  text-align: center;
  background-color: #f9f9f9;
  min-height: 100vh;
  padding-bottom: 40px;
  font-family: 'Segoe UI', system-ui, sans-serif;
}


.header {
  /* background: #FFD700; */
  color: #222;
  padding: 50px 0 30px;
  text-align: center;
  margin-bottom: 30px;
  position: relative;
  overflow: hidden;
}

.header::after {
  content: "";
  position: absolute;
  bottom: -15px;
  left: 0;
  right: 0;
  height: 30px;
  background: white;
  border-radius: 50% 50% 0 0 / 30px;
}

.header h1 {
  font-size: 2.8rem;
  margin-bottom: 8px;
  font-weight: 800;
  position: relative;
  z-index: 1;
}

.header p {
  font-size: 1.2rem;
  color: rgba(0,0,0,0.7);
  max-width: 600px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Minimalist Cart Items */
.cart-item {
  display: flex;
  align-items: center;
  background: white;
  border-radius: 8px;
  margin-bottom: 20px;
  padding: 20px;
  transition: all 0.2s ease;
  gap: 20px;
  border: 1px solid #e0e0e0;
  position: relative;
}

.cart-item:hover {
  border-color: #FFD700;
}

.cart-item::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: #FFD700;
}

.item-image {
  width: 120px;
  height: 120px;
  flex-shrink: 0;
  border-radius: 6px;
  overflow: hidden;
  background: #FFF9C4;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 215, 0, 0.3);
}

.item-image img {
  width: 80%;
  height: 80%;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.cart-item:hover .item-image img {
  transform: scale(1.1);
}

.item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.item-details {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.item-name {
  font-size: 1.3rem;
  font-weight: 700;
  color: #222;
  margin: 0;
  text-align: left;
}

.item-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.95rem;
  color: #666;
  justify-content: flex-start;
}

.item-price {
  font-weight: 800;
  color: #FF8C00;
  font-size: 1.4rem;
}

.item-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #FFF9C4;
  border-radius: 30px;
  padding: 6px 16px;
  border: 1px solid rgba(255, 215, 0, 0.3);
}

.qty-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: white;
  border-radius: 50%;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e0e0e0;
  transition: all 0.2s ease;
  color: #FF8C00;
}

.qty-btn:hover {
  background: #FFD700;
}

.quantity {
  min-width: 26px;
  text-align: center;
  font-weight: 700;
  font-size: 1rem;
}

.item-actions {
  display: flex;
  gap: 10px;
}

.customize-btn,
.remove-btn {
  padding: 8px 16px;
  font-size: 0.9rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
}

.customize-btn {
  background: #FFD700;
  color: #222;
  border: 1px solid #FFD700;
}

.customize-btn:hover {
  background: #FFC000;
}

.remove-btn {
  background-color: white;
  color: #d32f2f;
  border: 1px solid #d32f2f;
}

.remove-btn:hover {
  background-color: #ffebee;
}

/* Cart Summary */
.cart-summary {
  background: white;
  border-radius: 8px;
  padding: 25px;
  margin-top: 30px;
  border: 1px solid #e0e0e0;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.summary-total {
  font-size: 1.3rem;
  font-weight: 800;
  color: #FF8C00;
}

/* Cart Footer Buttons */
.cart-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
  flex-wrap: wrap;
  gap: 15px;
}

.clear-btn,
.checkout-btn {
  padding: 12px 30px;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.clear-btn {
  background-color: white;
  color: #d32f2f;
  border: 1px solid #d32f2f;
}

.clear-btn:hover {
  background-color: #d32f2f;
  color: white;
}

.checkout-btn {
  background: #FFD700;
  color: #222;
  border: 1px solid #FFD700;
}

.checkout-btn:hover {
  background: #FFA500;
  color: white;
}

/* Empty Cart State */
.empty-cart {
  text-align: center;
  margin-top: 50px;
  padding: 30px 0;
}

.empty-cart-icon {
  font-size: 80px;
  color: #FFD700;
  margin-bottom: 15px;
}

.empty-cart h2 {
  font-size: 1.6rem;
  color: #222;
  margin-bottom: 10px;
}

.empty-cart p {
  font-size: 1rem;
  color: #666;
  max-width: 500px;
  margin: 0 auto 20px;
}

.shop-btn {
  padding: 12px 30px;
  background: #FFD700;
  color: #222;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1rem;
  border: 1px solid #FFD700;
}

.shop-btn:hover {
  background: #FFC000;
}

/* Responsive Design */
@media (max-width: 768px) {
  .header {
    padding: 40px 0 25px;
  }
  
  .header h1 {
    font-size: 2.2rem;
  }
  
  .cart-item {
    flex-direction: column;
    padding: 15px;
    gap: 15px;
    text-align: center;
  }
  
  .item-image {
    width: 120px;
    height: 120px;
  }
  
  .item-name,
  .item-meta {
    text-align: center;
  }
  
  .item-controls {
    flex-direction: column;
  }
  
  .quantity-control {
    margin: 0 auto;
  }
  
  .item-actions {
    width: 100%;
    justify-content: center;
  }
  
  .cart-footer {
    flex-direction: column;
  }
  
  .clear-btn,
  .checkout-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .header h1 {
    font-size: 1.8rem;
  margin-bottom: 5px;
  }
  
  .header p {
    font-size: 1rem;
  }
  
  .item-image {
    width: 100px;
    height: 100px;
  }
  
  .item-name {
    font-size: 1.1rem;
  }
  
  .item-price {
    font-size: 1.1rem;
  }
  
  .customize-btn,
  .remove-btn {
    padding: 6px 12px;
    font-size: 0.85rem;
  }
}
</style>

<style scoped>
/* Vibrant Header - Original Design */

/* Responsive adjustments */
@media (max-width: 768px) {
  .header {
    padding: 40px 0 25px;
  }
  
  .header h1 {
    font-size: 2.2rem;
  }
}

@media (max-width: 480px) {
  .header h1 {
    font-size: 1.8rem;
  }
  
  .header p {
    font-size: 1rem;
  }
}
</style>
