<template>
  <div class="history-page">
    <div class="header-section">
      <h1 class="page-title">Your Order History</h1>
      <p class="page-subtitle">Review your past purchases and order details</p>
      
      <div class="action-bar" v-if="orderHistory.length > 0">
        <button class="btn-clear" @click="confirmClearAll">
          <i class="fas fa-trash-alt"></i> Clear All History
        </button>
        <div class="order-count">
          <i class="fas fa-history"></i> {{ orderHistory.length }} {{ orderHistory.length === 1 ? 'Order' : 'Orders' }}
        </div>
      </div>
    </div>

    <transition-group name="list" tag="div" class="order-list">
      <div v-for="(order, index) in orderHistory" :key="order.date" class="order-card">
        <div class="order-header">
          <div class="order-meta">
            <h3 class="order-date">
              <i class="far fa-calendar-alt"></i> {{ formatDate(order.date) }}
            </h3>
            <div class="order-total">
              Total: ${{ calculateOrderTotal(order.items).toFixed(2) }}
            </div>
          </div>
          <button class="btn-remove-order" @click="removeOrder(index)">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="order-items">
          <div v-for="(item, itemIndex) in order.items" :key="itemIndex" class="item-card">
            <div class="item-image-container">
              <img :src="getItemImage(item)" :alt="item.name" class="item-image">
              <span class="item-quantity-badge">{{ item.quantity || 1 }}</span>
            </div>
            <div class="item-details">
              <h4 class="item-name">{{ item.name }}</h4>
              <p class="item-price">${{ item.price.toFixed(2) }}</p>
              <div class="item-actions">
                <button class="btn-reorder" @click="reorderItem(item)">
                  <i class="fas fa-redo"></i> Reorder
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition-group>

    <div v-if="orderHistory.length === 0" class="empty-state">
      <div class="empty-icon">
        <i class="fas fa-shopping-basket"></i>
      </div>
      <h3>No Order History Yet</h3>
      <p>Your completed orders will appear here</p>
      <button class="btn-shop" @click="navigateToShop">Start Shopping</button>
    </div>

    <!-- Clear All Confirmation Modal -->
    <div v-if="showClearConfirm" class="modal-overlay">
      <div class="modal-content">
        <h3>Clear All Order History?</h3>
        <p>This action cannot be undone. All your order history will be permanently deleted.</p>
        <div class="modal-actions">
          <button class="btn-cancel" @click="showClearConfirm = false">Cancel</button>
          <button class="btn-confirm" @click="clearAllHistory">Clear All</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HistoryView',
  data() {
    return {
      orderHistory: JSON.parse(localStorage.getItem('orderHistory')) || [],
      showClearConfirm: false
    };
  },
  methods: {
// Update getItemImage method to match:
getItemImage(item) {
  if (!item?.image) {
    return require('@/assets/image.png');
  }
  
  try {
    return require(`@/assets/${item.image}`);
  } catch {
    return require('@/assets/image.png');
  }
},
    formatDate(dateString) {
      const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      return new Date(dateString).toLocaleDateString('en-US', options);
    },
    calculateOrderTotal(items) {
      return items.reduce((total, item) => {
        return total + (item.price * (item.quantity || 1));
      }, 0);
    },
    removeOrder(index) {
      this.orderHistory.splice(index, 1);
      this.saveHistory();
    },
    confirmClearAll() {
      this.showClearConfirm = true;
    },
    clearAllHistory() {
      this.orderHistory = [];
      localStorage.removeItem('orderHistory');
      this.showClearConfirm = false;
    },
    saveHistory() {
      localStorage.setItem('orderHistory', JSON.stringify(this.orderHistory));
    },
    reorderItem(item) {
      // Implement reorder functionality
      alert(`Added ${item.name} to your cart!`);
    },
    navigateToShop() {
      // Implement navigation to shop
      this.$router.push('/shop');
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

.history-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Poppins', sans-serif;
  color: #333;
}

.header-section {
  text-align: center;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  font-size: 1.1rem;
  color: #7f8c8d;
  margin-bottom: 2rem;
}

.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 10px;
}

.btn-clear {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-clear:hover {
  background: #c0392b;
  transform: translateY(-2px);
}

.order-count {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #7f8c8d;
  font-weight: 500;
}

.order-list {
  display: grid;
  gap: 1.5rem;
}

.order-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.order-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem;
  background: #f8f9fa;
  border-bottom: 1px solid #eee;
}

.order-meta {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.order-date {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 500;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.order-total {
  font-size: 1rem;
  font-weight: 600;
  color: #27ae60;
}

.btn-remove-order {
  background: none;
  border: none;
  color: #e74c3c;
  font-size: 1.2rem;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.btn-remove-order:hover {
  transform: scale(1.2);
}

.order-items {
  padding: 1rem;
  display: grid;
  gap: 1rem;
}

.item-card {
  display: flex;
  gap: 1.2rem;
  padding: 1rem;
  border-radius: 8px;
  background: #f8f9fa;
  transition: background 0.3s ease;
}

.item-card:hover {
  background: #e9ecef;
}

.item-image-container {
  position: relative;
  flex-shrink: 0;
}

.item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #eee;
}

.item-quantity-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #3498db;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 600;
}

.item-details {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.item-name {
  margin: 0;
  font-weight: 500;
  color: #2c3e50;
}

.item-price {
  margin: 0.3rem 0;
  font-weight: 600;
  color: #27ae60;
}

.item-actions {
  display: flex;
  gap: 0.8rem;
}

.btn-reorder {
  background: #3498db;
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.btn-reorder:hover {
  background: #2980b9;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.empty-icon {
  font-size: 3rem;
  color: #bdc3c7;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #7f8c8d;
  margin-bottom: 1.5rem;
}

.btn-shop {
  background: #3498db;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
}

.btn-shop:hover {
  background: #2980b9;
  transform: translateY(-2px);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  max-width: 400px;
  width: 90%;
  text-align: center;
}

.modal-content h3 {
  margin-top: 0;
  color: #2c3e50;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1.5rem;
}

.btn-cancel, .btn-confirm {
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancel {
  background: #f8f9fa;
  border: 1px solid #ddd;
  color: #333;
}

.btn-cancel:hover {
  background: #e9ecef;
}

.btn-confirm {
  background: #e74c3c;
  border: none;
  color: white;
}

.btn-confirm:hover {
  background: #c0392b;
}

/* Animations */
.list-enter-active, .list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from, .list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

@media (max-width: 768px) {
  .history-page {
    padding: 1rem;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .order-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.8rem;
  }
  
  .item-card {
    flex-direction: column;
  }
  
  .item-image {
    width: 100%;
    height: auto;
    aspect-ratio: 1/1;
  }
}
</style>