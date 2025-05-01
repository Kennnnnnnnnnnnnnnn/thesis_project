<template>
  <div class="cart-page">
    <section class="header">
      <div class="container">
        <h1>Shopping Cart</h1>
        <p>Your selected items, ready for checkout</p>
      </div>
    </section>

    <section class="cart-list">
      <div class="container">
        <div v-if="cart.length > 0">
          <div class="cart-item" v-for="(product, index) in cart" :key="product.id + '-' + index">
            <div class="item-image">
              <img :src="getProductImage(product)" :alt="product.name + ' image'">
            </div>
            <div class="item-content">
              <div class="item-details">
                <h3 class="item-name">{{ product.name }}</h3>
                <div class="item-meta">
                  <span class="item-price">${{ product.price.toFixed(2) }}</span>
                  <span class="item-divider">•</span>
                  <span class="item-weight">{{ product.weight }} kg</span>
                </div>
              </div>
              <div class="item-controls">
                <div class="quantity-control">
                  <button class="qty-btn" @click="decreaseQuantity(index)" :disabled="product.quantity <= 1">−</button>
                  <span class="quantity">{{ product.quantity || 1 }}</span>
                  <button class="qty-btn" @click="increaseQuantity(index)">+</button>
                </div>
                <div class="item-actions">
                  <button class="customize-btn" @click="openCustomizeModal(product)">
                    <i class="fas fa-cog"></i> Customize
                  </button>
                  <button class="remove-btn" @click="removeFromCart(index)">
                    <i class="fas fa-trash"></i> Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="cart-footer">
            <button class="clear-btn" @click="clearCart">Clear Cart</button>
            <button class="checkout-btn" @click="startCheckout">Checkout</button>
          </div>
        </div>
        <div v-else class="empty-cart">
          <img src="https://via.placeholder.com/200x150?text=Empty+Cart" alt="Empty Cart">
          <p>Your cart is empty. Start shopping now!</p>
        </div>
      </div>
    </section>

    <!-- User Info Confirmation Modal -->
    <UserInfoModal 
      v-if="showUserInfoModal"
      :show="showUserInfoModal"
      :user="user"
      @close="showUserInfoModal = false"
      @confirm="handleUserConfirmation"
    />

    <!-- Customize Modal -->
    <CustomizeView 
      v-if="showCustomizeModal"
      :product="selectedProduct"
      :show="showCustomizeModal"
      @close="closeCustomizeModal"
      @confirm="handleCustomization"
    />
  </div>
</template>

<script>
import UserInfoModal from '@/views/user/UserInfoModal.vue';
import CustomizeView from './Customize.vue';

export default {
  name: 'CartView',
  components: {
    UserInfoModal,
    CustomizeView
  },
  data() {
    return {
      cart: this.getCartWithQuantities(),
      showUserInfoModal: false,
      showCustomizeModal: false,
      selectedProduct: null,
      user: JSON.parse(localStorage.getItem("user")) || {}
    };
  },
  methods: {
    getProductImage(product) {
      if (!product?.image) {
        return require('@/assets/image.png'); // Fallback image
      }
      
      try {
        return require(`@/assets/${product.image}`);
      } catch {
        return require('@/assets/image.png'); // Fallback if image missing
      }
    },
    getCartWithQuantities() {
      const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
      const itemCounts = {};
      
      cartItems.forEach(item => {
        itemCounts[item.id] = (itemCounts[item.id] || 0) + 1;
      });
      
      const uniqueItems = [];
      const seenIds = new Set();
      
      cartItems.forEach(item => {
        if (!seenIds.has(item.id)) {
          seenIds.add(item.id);
          uniqueItems.push({
            ...item,
            quantity: itemCounts[item.id],
            weight: item.weight || 1
          });
        }
      });
      
      return uniqueItems;
    },
    startCheckout() {
      this.user = JSON.parse(localStorage.getItem("user")) || {};
      this.showUserInfoModal = true;
    },
    handleUserConfirmation(updatedUser) {
      this.user = updatedUser;
      localStorage.setItem("user", JSON.stringify(updatedUser));
      this.showUserInfoModal = false;
      this.showPaymentMethodModal = true;
    },
    increaseQuantity(index) {
      this.cart[index].quantity = (this.cart[index].quantity || 1) + 1;
      this.updateLocalStorage();
    },
    decreaseQuantity(index) {
      if (this.cart[index].quantity > 1) {
        this.cart[index].quantity -= 1;
        this.updateLocalStorage();
      }
    },
    openCustomizeModal(product) {
      this.selectedProduct = {...product};
      this.showCustomizeModal = true;
    },
    closeCustomizeModal() {
      this.showCustomizeModal = false;
    },
    handleCustomization(customizedItem) {
      const index = this.cart.findIndex(item => item.id === customizedItem.product.id);
      if (index !== -1) {
        this.cart[index] = customizedItem.product;
        this.updateLocalStorage();
      }
      this.closeCustomizeModal();
    },
    updateLocalStorage() {
      let fullCart = [];
      this.cart.forEach(item => {
        for (let i = 0; i < item.quantity; i++) {
          fullCart.push({ ...item, quantity: undefined });
        }
      });

      localStorage.setItem('cart', JSON.stringify(fullCart));
      localStorage.setItem('cartCount', fullCart.length);
      window.dispatchEvent(new Event("storage"));
    },
    removeFromCart(index) {
      const allItems = JSON.parse(localStorage.getItem('cart')) || [];
      const productId = this.cart[index].id;
      const itemIndex = allItems.map(item => item.id).lastIndexOf(productId);

      if (itemIndex > -1) {
        allItems.splice(itemIndex, 1);
      }

      localStorage.setItem('cart', JSON.stringify(allItems));
      localStorage.setItem('cartCount', allItems.length);
      this.cart = this.getCartWithQuantities();
      window.dispatchEvent(new Event("storage"));
    },
    clearCart() {
      localStorage.removeItem('cart');
      localStorage.setItem('cartCount', 0);
      this.cart = [];
      window.dispatchEvent(new Event("storage"));
    },
    completePayment() {
      this.clearCart();
      alert("Payment successful! Your cart has been reset.");
    }
  }
};
</script>






<style scoped>
.cart-page {
  background-color: #f8f9fa;
  min-height: 100vh;
  padding-bottom: 40px;
}

/* Header Section */
.header {
  background: linear-gradient(135deg, #007bff 0%, #2c3e50 100%);
  color: white;
  padding: 60px 0;
  text-align: center;
  margin-bottom: 40px;
}

.header h1 {
  font-size: 2.5rem;
  margin-bottom: 8px;
}

.header p {
  font-size: 1.1rem;
  opacity: 0.9;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Cart Item Styles */
.cart-item {
  display: flex;
  align-items: center;
  background: white;
  border-radius: 12px;
  margin-bottom: 20px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  gap: 25px;
}

.cart-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.item-image {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
  background: #f1f3f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-image img {
  width: 80%;
  height: 80%;
  object-fit: contain;
  mix-blend-mode: multiply;
}

.item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.item-details {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.item-name {
  font-size: 1.2rem;
  font-weight: 600;
  color: #212529;
  margin: 0;
}

.item-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.95rem;
  color: #495057;
}

.item-price {
  font-weight: 700;
  color: #28a745;
}

.item-divider {
  opacity: 0.4;
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
  gap: 8px;
  background: #f1f3f5;
  border-radius: 8px;
  padding: 6px 10px;
}

.qty-btn {
  width: 30px;
  height: 30px;
  border: none;
  background: white;
  border-radius: 6px;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: all 0.2s ease;
}

.qty-btn:hover {
  background: #e9ecef;
  transform: scale(1.05);
}

.qty-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.quantity {
  min-width: 24px;
  text-align: center;
  font-weight: 600;
  font-size: 1rem;
}

.item-actions {
  display: flex;
  gap: 10px;
}

.customize-btn,
.remove-btn {
  padding: 8px 14px;
  font-size: 0.9rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.customize-btn {
  background-color: rgba(0, 123, 255, 0.1);
  color: #007bff;
}

.customize-btn:hover {
  background-color: rgba(0, 123, 255, 0.2);
}

.remove-btn {
  background-color: rgba(220, 53, 69, 0.1);
  color: #dc3545;
}

.remove-btn:hover {
  background-color: rgba(220, 53, 69, 0.2);
}

/* Cart Footer */
.cart-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 40px;
  flex-wrap: wrap;
  gap: 15px;
}

.clear-btn,
.checkout-btn {
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 500;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clear-btn {
  background-color: #f8f9fa;
  color: #dc3545;
  border: 1px solid #dc3545;
}

.clear-btn:hover {
  background-color: #dc3545;
  color: white;
}

.checkout-btn {
  background-color: #28a745;
  color: white;
  box-shadow: 0 2px 8px rgba(40, 167, 69, 0.3);
}

.checkout-btn:hover {
  background-color: #218838;
  transform: translateY(-2px);
}

/* Empty Cart */
.empty-cart {
  text-align: center;
  margin-top: 60px;
  padding: 40px 0;
}

.empty-cart img {
  margin-bottom: 20px;
  opacity: 0.7;
  max-width: 200px;
}

.empty-cart p {
  font-size: 1.2rem;
  color: #6c757d;
}

/* Responsive Design */
@media (max-width: 768px) {
  .header {
    padding: 40px 0;
  }
  
  .cart-item {
    flex-direction: column;
    padding: 20px;
    gap: 20px;
    text-align: center;
  }
  
  .item-image {
    width: 120px;
    height: 120px;
  }
  
  .item-content {
    width: 100%;
  }
  
  .item-controls {
    flex-direction: column;
    gap: 15px;
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

/* Font Awesome icons (if not using the library) */
.fas {
  font-size: 0.9em;
}
</style>