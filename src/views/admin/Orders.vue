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

.header h2 {
  color: #8a6d0b; /* Dark yellow text */
}

.order-filters {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  padding: 15px;
  background: #fffae6; /* Light yellow background */
  border-radius: 5px;
  border: 1px solid #ffe680; /* Light yellow border */
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-group label {
  font-weight: 500;
  color: #b38b00; /* Medium yellow text */
}

select, input {
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #ffe680; /* Light yellow border */
  background-color: #fffae6; /* Light yellow background */
  color: #8a6d0b; /* Dark yellow text */
}

table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
}

th, td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #ffe680; /* Light yellow border */
}

th {
  background-color: #fffae6; /* Light yellow background */
  font-weight: 600;
  color: #8a6d0b; /* Dark yellow text */
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 500;
}

.processing {
  background-color: #fff3cd; /* Yellow processing status */
  color: #856404;
}

.shipped {
  background-color: #ffe680; /* Yellow shipped status */
  color: #5d4a00;
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
  border: none;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-view {
  background-color: #ffe680; /* Yellow view button */
  color: #5d4a00;
}

.btn-view:hover {
  background-color: #ffd700; /* Gold yellow on hover */
}

.btn-edit {
  background-color: #fff3cd; /* Light yellow edit button */
  color: #856404;
}

.btn-edit:hover {
  background-color: #ffe680; /* Medium yellow on hover */
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
  background: #fffae6; /* Light yellow background */
  padding: 25px;
  border-radius: 8px;
  width: 80%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  border: 1px solid #ffe680; /* Light yellow border */
}

.modal-content h3 {
  color: #8a6d0b; /* Dark yellow text */
}

.btn-close {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #b38b00; /* Medium yellow text */
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
  color: #b38b00; /* Medium yellow text */
}

.detail-value {
  color: #8a6d0b; /* Dark yellow text */
}

.order-items {
  margin: 20px 0;
}

.item-row {
  display: flex;
  padding: 10px 0;
  border-bottom: 1px solid #ffe680; /* Light yellow border */
  align-items: center;
}

.item-image {
  width: 60px;
  margin-right: 15px;
}

.item-image img {
  width: 100%;
  height: auto;
  border-radius: 4px;
}

.item-info {
  flex-grow: 1;
  color: #8a6d0b; /* Dark yellow text */
}

.item-total {
  width: 100px;
  text-align: right;
  font-weight: 500;
  color: #8a6d0b; /* Dark yellow text */
}

.order-summary {
  margin-top: 20px;
  border-top: 1px solid #ffe680; /* Light yellow border */
  padding-top: 20px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  color: #8a6d0b; /* Dark yellow text */
}

.summary-row.total {
  font-weight: bold;
  font-size: 1.1rem;
  color: #5d4a00; /* Darker yellow for total */
}

.empty-state {
  text-align: center;
  padding: 50px;
  color: #b38b00; /* Medium yellow text */
  background-color: #fffae6; /* Light yellow background */
  border-radius: 8px;
  border: 1px dashed #ffe680; /* Light yellow dashed border */
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 15px;
  color: #ffe680; /* Light yellow icon */
}

.action-buttons {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.btn-primary {
  background-color: #ffd700; /* Gold yellow */
  color: #5d4a00;
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover {
  background-color: #e6c200; /* Darker gold yellow */
}
</style>