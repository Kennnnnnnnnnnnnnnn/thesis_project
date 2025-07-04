<template>
  <div class="profile-page">
    <div class="profile-container">
      <div class="profile-form">
        <!-- Header Section -->
        <div class="header-section">
          <h1>{{ $t('history.yourOrderHistory') }}</h1>
          <p>{{ $t('history.reviewPastPurchases') }}</p>
          <div v-if="orders.length > 0" class="orders-summary">
            <span>
              {{ orders.length }} {{ orders.length === 1 ? $t('history.order') : $t('history.orders') }}
            </span>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>{{ $t('common.loading') }}...</p>
        </div>

        <!-- Order List -->
        <transition-group v-else name="list" tag="div" class="orders-list">
          <div
            v-for="order in orders"
            :key="order._id"
            class="order-card"
          >
            <!-- Order Header -->
            <div class="order-header">
              <div class="order-header-item">
                <i class="far fa-calendar-alt"></i>
                <h3>{{ formatDate(order.createdAt) }}</h3>
              </div>
              <div class="order-header-item order-total">
                {{ $t('history.total') }}: {{ formatPrice(order.totalCost) }} ៛
              </div>
              <div
                :class="`${getStatusClass(order.status)} status-animated order-status`"
              >
                {{ $t(`history.status.${order.status}`) }}
              </div>
            </div>

            <!-- Order Items -->
            <div class="order-items">
              <div
                v-for="(item, index) in order.items"
                :key="index"
                class="order-item"
              >
                <div class="order-item-image">
                  <img
                    :src="item.image || require('@/assets/image.png')"
                    :alt="item.name"
                  />
                  <span class="order-item-quantity">{{ item.quantity || 1 }}</span>
                </div>
                <div class="order-item-info">
                  <h4>{{ item.name || 'Product' }}</h4>
                  <p>{{ formatPrice(item.price) }} ៛</p>
                </div>
              </div>
            </div>
          </div>
        </transition-group>

        <!-- Empty State -->
        <div v-if="!isLoading && orders.length === 0" class="empty-state">
          <i class="fas fa-shopping-basket empty-icon"></i>
          <h3>{{ $t('history.noHistoryYet') }}</h3>
          <p>{{ $t('history.completedOrdersAppear') }}</p>
          <button @click="navigateToShop">{{ $t('history.startShopping') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import apiURL from '@/api/config.js';
import axios from 'axios';
import Swal from 'sweetalert2';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const router = useRouter();
const { t } = useI18n();
const orders = ref([]);
const isLoading = ref(true);
const API = `${apiURL}/api`;

// Fetch orders
const fetchOrders = async () => {
  try {
    isLoading.value = true;
    const token = localStorage.getItem('token');
    if (!token) {
      // Guest user: don't redirect, just skip fetching
      isLoading.value = false;
      return;
    }

    const response = await axios.get(`${API}/getAllDocs/Order`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.data && response.data.success) {
      orders.value = response.data.data.sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
      );
    }
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    Swal.fire({
      icon: 'error',
      title: t('alerts.error'),
      text: t('alerts.failedToLoadOrders')
    });
  } finally {
    isLoading.value = false;
  }
};


// Format date
const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

// Format price
const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US').format(Math.round(price || 0));
};

// Status classes
const getStatusClass = (status) => {
  const statusMap = {
    paid: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    delivered: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800'
  };
  return statusMap[status] || 'bg-gray-100 text-gray-800';
};

// Navigate to shop
const navigateToShop = () => {
  router.push('/');
};

// Fetch orders on mount
onMounted(() => {
  fetchOrders();
});
</script>

<style scoped>
/* Gradient background */
.profile-page {
  font-family: 'Poppins', sans-serif;
  min-height: 100vh;
  background: linear-gradient(to bottom right, #fffbea, #ffffff, #fffbea);
  display: flex;
  flex-direction: column;
}

/* Reuse Profile page layout */
.profile-container {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
}
.profile-form {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  max-width: 1200px;
  width: 100%;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  border: 1px solid #fcd34d;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
}

/* Responsive grid */
@media (min-width: 640px) {
  .profile-form {
    grid-template-columns: 1fr;
  }
}
@media (min-width: 1024px) {
  .profile-form {
    grid-template-columns: 1fr;
  }
}

/* Header styling */
.header-section {
  text-align: center;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  border: 1px solid #fcd34d;
  border-radius: 20px;
  padding: 24px;
}
.header-section h1 {
  color: #b7791f;
  font-size: 2rem;
  margin: 0;
}
.header-section p {
  color: #78350f;
  margin-top: 8px;
  font-size: 1.1rem;
}
.orders-summary {
  margin-top: 12px;
  background-color: #fef3c7;
  padding: 8px 16px;
  border-radius: 12px;
  display: inline-block;
  font-weight: 600;
  color: #92400e;
}

/* Loading */
.loading-state {
  text-align: center;
  padding: 48px 0;
}
.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #fcd34d;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Orders list & cards */
.orders-list {
  display: grid;
  gap: 24px;
}
.order-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(4px);
  border: 1px solid #fcd34d;
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
}
.order-card:hover {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}
.order-header {
  display: grid;
  gap: 16px;
  padding: 16px;
  border-bottom: 1px solid #fcd34d;
}
.order-header-item {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #92400e;
}
.order-header-item i {
  margin-right: 8px;
  color: #b7791f;
}
.order-total {
  color: #92400e;
}
.order-status {
  text-align: center;
  border-radius: 12px;
  padding: 8px;
  font-weight: 600;
}

/* Order items */
.order-items {
  display: grid;
  gap: 12px;
  padding: 16px;
}
.order-item {
  display: flex;
  align-items: center;
  gap: 16px;
  background: rgba(254, 243, 199, 0.3);
  border: 1px solid #fcd34d;
  border-radius: 12px;
  padding: 12px;
  transition: background-color 0.3s;
}
.order-item:hover {
  background-color: #fef3c7;
}
.order-item-image {
  position: relative;
}
.order-item-image img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 12px;
  border: 1px solid #fcd34d;
}
.order-item-quantity {
  position: absolute;
  top: -6px;
  right: -6px;
  background-color: #facc15;
  color: #78350f;
  width: 24px;
  height: 24px;
  font-size: 0.8rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
}
.order-item-info h4 {
  margin: 0;
  font-size: 1rem;
  color: #78350f;
}
.order-item-info p {
  color: #92400e;
  font-weight: 600;
  margin-top: 4px;
}

/* Empty state */
.empty-state {
  text-align: center;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(4px);
  border: 1px solid #fcd34d;
  border-radius: 20px;
  padding: 48px 24px;
}
.empty-icon {
  font-size: 4rem;
  color: #facc15;
  margin-bottom: 16px;
}
.empty-state h3 {
  color: #78350f;
  font-size: 1.5rem;
}
.empty-state p {
  color: #92400e;
  margin: 8px 0 16px;
}
.empty-state button {
  padding: 12px 24px;
  background-color: #facc15;
  color: #fff;
  border: none;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 1rem;
  transition: transform 0.2s, background-color 0.2s;
}
.empty-state button:hover {
  background-color: #fbbf24;
  transform: scale(1.03);
}

/* List enter animation */
.list-enter-active, .list-leave-active { transition: all 0.5s ease; }
.list-enter-from, .list-leave-to { opacity: 0; transform: translateY(20px); }

/* Status badge animation */
.status-animated::after {
  content: '';
  display: inline-block;
  width: 8px;
  height: 8px;
  margin-left: 6px;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
  vertical-align: middle;
}
@keyframes pulse {
  0% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 0.1; transform: scale(1.6); }
  100% { opacity: 0.6; transform: scale(1); }
}
</style>
