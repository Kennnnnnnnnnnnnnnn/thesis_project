<template>
  <div class="admin-orders">
    <div class="header">
      <h1>Order Management</h1>
      <div class="actions">
        <button class="btn-refresh" @click="fetchOrders">
          <i class="fas fa-sync-alt"></i> Refresh
        </button>
      </div>
    </div>

    <div class="order-filters">
      <div class="filter-group">
        <label>Status:</label>
        <select v-model="statusFilter" @change="filterOrders">
          <option value="all">All Orders</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      <div class="filter-group">
        <label>Date Range:</label>
        <input type="date" v-model="startDate" @change="filterOrders">
        <span>to</span>
        <input type="date" v-model="endDate" @change="filterOrders">
      </div>
    </div>

    <div class="order-list">
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Date</th>
            <th>Items</th>
            <th>Total</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
  <tr v-for="order in filteredOrders" :key="order.id">
    <td>#{{ order.id }}</td>
    <td>{{ order.customerName || 'Guest' }}</td>
    <td>{{ formatDate(order.date) }}</td>
    <td>{{ order.items.length }}</td>
    <td>${{ calculateOrderTotal(order.items).toFixed(2) }}</td>
    <td>
      <span class="status-badge" :class="order.status.toLowerCase()">
        {{ order.status }}
      </span>
    </td>
    <td>
      <button class="btn-view" @click="viewOrder(order.id)">
        <i class="fas fa-eye"></i>
      </button>
      <button 
        class="btn-edit" 
        @click="editOrder(order.id)"
        v-if="order.status !== 'Delivered' && order.status !== 'Cancelled'"
      >
        <i class="fas fa-edit"></i>
      </button>
    </td>
  </tr>
</tbody>
      </table>
    </div>

    <div v-if="filteredOrders.length === 0" class="empty-state">
      <i class="fas fa-box-open"></i>
      <p>No orders found matching your criteria</p>
    </div>

    <!-- Order Detail Modal -->
    <div v-if="selectedOrder" class="modal-overlay">
      <div class="modal-content">
        <button class="btn-close" @click="selectedOrder = null">
          <i class="fas fa-times"></i>
        </button>
        <h2>Order Details #{{ selectedOrder.id }}</h2>
        
        <div class="order-details">
          <div class="detail-row">
            <span class="detail-label">Customer:</span>
            <span class="detail-value">{{ selectedOrder.customerName || 'Guest' }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Date:</span>
            <span class="detail-value">{{ formatDate(selectedOrder.date) }}</span>
          </div>
          <div class="detail-row">
  <span class="detail-label">Status:</span>
  <span class="detail-value">
    <select v-model="selectedOrder.status" @change="updateOrderStatus(selectedOrder)">
      <option v-for="status in statusOptions" :key="status" :value="status">
        {{ status }}
      </option>
    </select>
  </span>
</div>
          <div v-if="selectedOrder.trackingNumber" class="detail-row">
            <span class="detail-label">Tracking #:</span>
            <span class="detail-value">{{ selectedOrder.trackingNumber }}</span>
          </div>
        </div>

        <div v-for="item in selectedOrder.items" :key="item.id || item.name" class="item-row">
  <div class="item-image">
    <img :src="getItemImage(item)" :alt="item.name">
  </div>
  <div class="item-info">
    <h4>{{ item.name }}</h4>
    <p>${{ item.price.toFixed(2) }} × {{ item.quantity || 1 }}</p>
  </div>
  <div class="item-total">
    ${{ (item.price * (item.quantity || 1)).toFixed(2) }}
  </div>
</div>

        <div class="order-summary">
          <div class="summary-row">
            <span>Subtotal:</span>
            <span>${{ calculateOrderTotal(selectedOrder.items).toFixed(2) }}</span>
          </div>
          <div class="summary-row">
            <span>Shipping:</span>
            <span>$0.00</span> <!-- Adjust if you have shipping costs -->
          </div>
          <div class="summary-row total">
            <span>Total:</span>
            <span>${{ calculateOrderTotal(selectedOrder.items).toFixed(2) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminOrders',
  data() {
    return {
      orders: [],
      filteredOrders: [],
      selectedOrder: null,
      statusFilter: 'all',
      startDate: '',
      endDate: '',
      statusOptions: [
        'Processing',
        'Shipped',
        'In Transit',
        'Out for Delivery',
        'Delivered',
        'Cancelled'
      ]
    };
  },
  created() {
  this.fetchOrders();
},
methods: {
  fetchOrders() {
    try {
      // Safely parse with fallback to empty array if null/undefined
      const activeOrders = JSON.parse(localStorage.getItem('activeOrders') || '[]');
      const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
      
      // Validate and normalize all orders
      this.orders = [...activeOrders, ...orderHistory].map((order, index) => {
        // Ensure items array exists and has minimum required fields
        const validatedItems = (order.items || []).map(item => ({
          id: item.id || Math.random().toString(36).substr(2, 9),
          name: item.name || 'Unknown Product',
          price: Number(item.price) || 0,
          quantity: Number(item.quantity) || 1,
          image: item.image || null,
          ...item
        }));
        
        return {
          id: order.id || index + 1,
          date: order.date || new Date().toISOString(),
          customerName: order.customerName || 'Guest',
          status: order.status || 'Processing',
          items: validatedItems,
          trackingNumber: order.trackingNumber || null,
          ...order
        };
      });
      
      this.filterOrders();
    } catch (error) {
      console.error('Error loading orders:', error);
      this.orders = [];
      this.filteredOrders = [];
    }
  },
  
    filterOrders() {
    try {
      this.filteredOrders = this.orders.filter(order => {
        // Safely handle status filtering
        const orderStatus = (order.status || 'processing').toLowerCase();
        const filterStatus = this.statusFilter.toLowerCase();
        
        if (this.statusFilter !== 'all' && orderStatus !== filterStatus) {
          return false;
        }
        
        // Safely handle date filtering
        if (this.startDate || this.endDate) {
          const orderDate = new Date(order.date || new Date()).getTime();
          const start = this.startDate ? new Date(this.startDate).getTime() : 0;
          const end = this.endDate ? new Date(this.endDate).getTime() : Date.now();
          
          return orderDate >= start && orderDate <= end;
        }
        
        return true;
      });
    } catch (error) {
      console.error('Error filtering orders:', error);
      this.filteredOrders = [];
    }
  },
    formatDate(dateString) {
      const options = { 
        year: 'numeric', 
        month: 'short', 
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
    viewOrder(orderId) {
      this.selectedOrder = this.orders.find(order => order.id === orderId);
    },
    editOrder(orderId) {
      // In a real app, this would open an edit form
      this.viewOrder(orderId);
    },
    updateOrderStatus(order) {
      // Update the order in localStorage
      if (order.status === 'Delivered') {
        // Move to history if delivered
        const activeOrders = JSON.parse(localStorage.getItem('activeOrders')) || [];
        const updatedActive = activeOrders.filter(o => o.date !== order.date);
        localStorage.setItem('activeOrders', JSON.stringify(updatedActive));
        
        const history = JSON.parse(localStorage.getItem('orderHistory')) || [];
        history.unshift(order);
        localStorage.setItem('orderHistory', JSON.stringify(history));
      } else {
        // Update in active orders
        const activeOrders = JSON.parse(localStorage.getItem('activeOrders')) || [];
        const index = activeOrders.findIndex(o => o.date === order.date);
        if (index !== -1) {
          activeOrders[index] = order;
          localStorage.setItem('activeOrders', JSON.stringify(activeOrders));
        }
      }
      
      this.fetchOrders(); // Refresh the list
    },
    getItemImage(item) {
      if (!item?.image) {
        return require('@/assets/image.png');
      }
      try {
        return require(`@/assets/${item.image}`);
      } catch {
        return require('@/assets/image.png');
      }
    }
  }
};
</script>

<style scoped>
.admin-orders {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.order-filters {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  padding: 15px;
  background: #f5f5f5;
  border-radius: 5px;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-group label {
  font-weight: 500;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f5f5f5;
  font-weight: 600;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.85rem;
}

.processing {
  background-color: #fff3cd;
  color: #856404;
}

.shipped {
  background-color: #cce5ff;
  color: #004085;
}

.delivered {
  background-color: #d4edda;
  color: #155724;
}

.cancelled {
  background-color: #f8d7da;
  color: #721c24;
}

.btn-view, .btn-edit {
  padding: 5px 10px;
  border-radius: 4px;
  margin-right: 5px;
  cursor: pointer;
}

.btn-view {
  background-color: #e2e3e5;
  color: #383d41;
}

.btn-edit {
  background-color: #d1ecf1;
  color: #0c5460;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 25px;
  border-radius: 8px;
  width: 80%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.btn-close {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
}

.order-details {
  margin: 20px 0;
}

.detail-row {
  display: flex;
  margin-bottom: 10px;
}

.detail-label {
  font-weight: 500;
  width: 120px;
}

.order-items {
  margin: 20px 0;
}

.item-row {
  display: flex;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  align-items: center;
}

.item-image {
  width: 60px;
  margin-right: 15px;
}

.item-image img {
  width: 100%;
  height: auto;
}

.item-info {
  flex-grow: 1;
}

.item-total {
  width: 100px;
  text-align: right;
  font-weight: 500;
}

.order-summary {
  margin-top: 20px;
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.summary-row.total {
  font-weight: bold;
  font-size: 1.1rem;
}

.empty-state {
  text-align: center;
  padding: 50px;
  color: #666;
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 15px;
  color: #ccc;
}
</style>