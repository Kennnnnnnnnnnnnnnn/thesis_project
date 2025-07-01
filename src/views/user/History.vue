<template>
  <div class="history-page">
    <div class="header-section">
      <h1 class="page-title">{{ $t('history.yourOrderHistory') }}</h1>
      <p class="page-subtitle">{{ $t('history.reviewPastPurchases') }}</p>
      
      <div class="action-bar" v-if="orderHistory.length > 0">
        <button class="btn-clear" @click="confirmClearAll">
          <i class="fas fa-trash-alt"></i> {{ $t('history.clearAllHistory') }}
        </button>
        <div class="order-count">
          {{ orderHistory.length }} {{ orderHistory.length === 1 ? $t('history.order') : $t('history.orders') }}
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
              {{ $t('history.total') }}: ${{ calculateOrderTotal(order.items).toFixed(2) }}
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
                  <i class="fas fa-redo"></i> {{ $t('history.reorder') }}
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
      <h3>{{ $t('history.noHistoryYet') }}</h3>
      <p>{{ $t('history.completedOrdersAppear') }}</p>
      <button class="btn-shop" @click="navigateToShop">{{ $t('history.startShopping') }}</button>
    </div>

    <!-- Clear All Confirmation Modal -->
    <div v-if="showClearConfirm" class="modal-overlay">
      <div class="modal-content">
        <h3>{{ $t('history.clearAllConfirmTitle') }}</h3>
        <p>{{ $t('history.clearAllConfirmText') }}</p>
        <div class="modal-actions">
          <button class="btn-cancel" @click="showClearConfirm = false">{{ $t('common.cancel') }}</button>
          <button class="btn-confirm" @click="clearAllHistory">{{ $t('history.clearAll') }}</button>
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
      this.$swal({
        icon: 'success',
        title: this.$t('history.itemAdded'),
        text: this.$t('history.addedToCart', { item: item.name }),
        timer: 1500,
        showConfirmButton: false
      });
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
  background-color: #fff;
}

.header-section {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #FFEC8B;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 2rem;
}

.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #FFF9E6;
  border-radius: 10px;
  border: 1px solid #FFEC8B;
}

.btn-clear {
  background: #FFD700;
  color: #333;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.btn-clear:hover {
  background: #FFA500;
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.order-count {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-weight: 500;
}

.order-list {
  display: grid;
  gap: 1.5rem;
}

.order-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  border: 1px solid #FFEC8B;
  transition: transform 0.3s ease;
}

.order-card:hover {
  transform: translateY(-5px);
  border-color: #FFD700;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem;
  background: #FFF9E6;
  border-bottom: 1px solid #FFEC8B;
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
  color: #333;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.order-total {
  font-size: 1rem;
  font-weight: 600;
  color: #FF8C00;
}

.btn-remove-order {
  background: none;
  border: none;
  color: #e74c3c;
  font-size: 1.2rem;
  cursor: pointer;
  transition: transform 0.2s ease;
  padding: 0.5rem;
  border-radius: 50%;
}

.btn-remove-order:hover {
  transform: scale(1.2);
  background: rgba(231, 76, 60, 0.1);
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
  border-radius: 10px;
  background: #FFFDF5;
  transition: all 0.3s ease;
  border: 1px solid #FFEC8B;
}

.item-card:hover {
  background: #FFF9E6;
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
  border: 1px solid #FFEC8B;
  background-color: #FFF9C4;
}

.item-quantity-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #FFD700;
  color: #333;
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
  color: #333;
}

.item-price {
  margin: 0.3rem 0;
  font-weight: 600;
  color: #FF8C00;
}

.item-actions {
  display: flex;
  gap: 0.8rem;
}

.btn-reorder {
  background: #FFD700;
  color: #333;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 25px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-weight: 500;
}

.btn-reorder:hover {
  background: #FFA500;
  color: #fff;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  background: white;
  border-radius: 15px;
  border: 1px solid #FFEC8B;
}

.empty-icon {
  font-size: 3rem;
  color: #FFD700;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #666;
  margin-bottom: 1.5rem;
}

.btn-shop {
  background: #FFD700;
  color: #333;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.btn-shop:hover {
  background: #FFA500;
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
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
  border-radius: 15px;
  max-width: 400px;
  width: 90%;
  text-align: center;
  border: 1px solid #FFEC8B;
}

.modal-content h3 {
  margin-top: 0;
  color: #333;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1.5rem;
}

.btn-cancel, .btn-confirm {
  padding: 0.6rem 1.2rem;
  border-radius: 25px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancel {
  background: #f8f9fa;
  border: 1px solid #FFEC8B;
  color: #333;
}

.btn-cancel:hover {
  background: #e9ecef;
}

.btn-confirm {
  background: #FFD700;
  border: none;
  color: #333;
  font-weight: 600;
}

.btn-confirm:hover {
  background: #FFA500;
  color: #fff;
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
  
  .action-bar {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}
</style>