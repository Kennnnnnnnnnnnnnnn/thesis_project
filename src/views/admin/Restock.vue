<template>
  <div class="management-page">
    <div class="page-header">
      <h1>Restock Management</h1>
      <button @click="showRestockForm = !showRestockForm" class="btn btn-primary">
        <i class="fas fa-plus"></i> {{ showRestockForm ? 'Cancel' : 'Request Restock' }}
      </button>
    </div>

    <!-- Restock Request Form (conditionally shown) -->
    <div v-if="showRestockForm" class="create-container">
      <form @submit.prevent="submitRestockRequest" class="create-form">
        <div class="form-row">
          <div class="form-group">
            <label>Product *</label>
            <select v-model="newRestock.productId" required class="form-input">
              <option value="">Select a product</option>
              <option v-for="product in products" :key="product.id" :value="product.id">
                {{ product.name }} (Current: {{ getProductStock(product.id) }})
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Quantity *</label>
            <input type="number" v-model="newRestock.quantity" min="1" required class="form-input">
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Priority</label>
            <select v-model="newRestock.priority" class="form-input">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <div class="form-group">
            <label>Expected Delivery Date</label>
            <input type="date" v-model="newRestock.expectedDate" class="form-input">
          </div>
        </div>

        <div class="form-group">
          <label>Notes</label>
          <textarea v-model="newRestock.notes" class="form-textarea" rows="2" placeholder="Additional information..."></textarea>
        </div>

        <div class="form-actions">
          <button type="button" @click="resetRestockForm" class="btn btn-secondary">
            Reset
          </button>
          <button type="submit" class="btn btn-primary">
            Submit Request
          </button>
        </div>
      </form>
    </div>

    <!-- Restock Requests Table -->
    <div class="product-table-container">
      <table class="product-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Current Stock</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Request Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="request in restockRequests" :key="request.id">
            <td class="product-name">
              {{ getProductName(request.productId) }}
              <div v-if="getProductImage(request.productId)" class="product-thumbnail-container">
                <img :src="getProductImage(request.productId)" :alt="getProductName(request.productId)" class="product-thumbnail">
              </div>
            </td>
            <td class="product-price">{{ request.quantity }}</td>
            <td class="product-price">{{ getProductStock(request.productId) }}</td>
            <td>
              <span :class="'priority-badge priority-' + request.priority">
                {{ formatPriority(request.priority) }}
              </span>
            </td>
            <td>
              <span :class="'status-badge status-' + request.status">
                {{ formatStatus(request.status) }}
              </span>
            </td>
            <td>{{ formatDate(request.createdAt) }}</td>
            <td class="product-actions">
              <button @click="editRestockRequest(request)" class="action-btn edit-btn">
                <i class="fas fa-edit"></i> Edit
              </button>
              <button @click="confirmDeleteRequest(request)" class="action-btn delete-btn">
                <i class="fas fa-trash"></i> Delete
              </button>
              <button v-if="request.status === 'pending'" @click="markAsReceived(request)" class="action-btn receive-btn">
                <i class="fas fa-check"></i> Received
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="modal-content">
        <h3>Confirm Deletion</h3>
        <p>Are you sure you want to delete the restock request for "{{ requestToDelete ? getProductName(requestToDelete.productId) : '' }}"?</p>
        <div class="modal-actions">
          <button @click="showDeleteModal = false" class="btn btn-secondary">Cancel</button>
          <button @click="deleteRestockRequest" class="btn btn-danger">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RestockManagement',
  data() {
    return {
      showRestockForm: false,
      editingRequest: null,
      newRestock: {
        id: '',
        productId: '',
        quantity: 1,
        priority: 'medium',
        expectedDate: '',
        notes: '',
        status: 'pending',
        createdAt: new Date().toISOString()
      },
      restockRequests: [],
      products: [],
      showDeleteModal: false,
      requestToDelete: null
    }
  },
  created() {
    this.loadRestockRequests();
    this.loadProducts();
  },
  methods: {
    loadRestockRequests() {
      const savedRequests = localStorage.getItem('restockRequests');
      this.restockRequests = savedRequests ? JSON.parse(savedRequests) : [];
    },
    
    loadProducts() {
      const savedProducts = localStorage.getItem('products');
      this.products = savedProducts ? JSON.parse(savedProducts) : [];
    },
    
    submitRestockRequest() {
      if (this.editingRequest) {
        // Update existing request
        const index = this.restockRequests.findIndex(r => r.id === this.editingRequest.id);
        if (index !== -1) {
          this.restockRequests[index] = { ...this.newRestock };
        }
      } else {
        // Create new request
        this.newRestock.id = Date.now().toString();
        this.newRestock.createdAt = new Date().toISOString();
        this.restockRequests.unshift({ ...this.newRestock });
      }
      
      this.saveRestockRequests();
      this.resetRestockForm();
      this.showRestockForm = false;
    },
    
    editRestockRequest(request) {
      this.editingRequest = request;
      this.newRestock = { ...request };
      this.showRestockForm = true;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    
    markAsReceived(request) {
      request.status = 'received';
      this.saveRestockRequests();
      
      // Update product stock (optional)
      const product = this.products.find(p => p.id === request.productId);
      if (product) {
        if (!product.stock) product.stock = 0;
        product.stock += parseInt(request.quantity);
        this.saveProducts();
      }
    },
    
    confirmDeleteRequest(request) {
      this.requestToDelete = request;
      this.showDeleteModal = true;
    },
    
    deleteRestockRequest() {
      this.restockRequests = this.restockRequests.filter(r => r.id !== this.requestToDelete.id);
      this.saveRestockRequests();
      this.showDeleteModal = false;
    },
    
    saveRestockRequests() {
      localStorage.setItem('restockRequests', JSON.stringify(this.restockRequests));
    },
    
    saveProducts() {
      localStorage.setItem('products', JSON.stringify(this.products));
    },
    
    resetRestockForm() {
      this.newRestock = {
        id: '',
        productId: '',
        quantity: 1,
        priority: 'medium',
        expectedDate: '',
        notes: '',
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      this.editingRequest = null;
    },
    
    getProductName(productId) {
      const product = this.products.find(p => p.id === productId);
      return product ? product.name : 'Unknown Product';
    },
    
    getProductImage(productId) {
      const product = this.products.find(p => p.id === productId);
      return product ? product.imageUrl : '';
    },
    
    getProductStock(productId) {
      const product = this.products.find(p => p.id === productId);
      return product ? (product.stock || 0) : 0;
    },
    
    formatPriority(priority) {
      return priority.charAt(0).toUpperCase() + priority.slice(1);
    },
    
    formatStatus(status) {
      return status.charAt(0).toUpperCase() + status.slice(1);
    },
    
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString();
    }
  }
}
</script>
<!-- 
<script>
import axios from 'axios';

export default {
  name: 'RestockManagement',
  data() {
    return {
      showRestockForm: false,
      editingRequest: null,
      newRestock: {
        productId: '',
        quantity: 1,
        priority: 'medium',
        expectedDate: '',
        notes: '',
        status: 'pending'
      },
      restockRequests: [],
      products: [],
      showDeleteModal: false,
      requestToDelete: null
    }
  },
  created() {
    this.loadRestockRequests();
    this.loadProducts();
  },
  methods: {
    async loadRestockRequests() {
      try {
        const res = await axios.get('/api/restocks');
        this.restockRequests = res.data || [];
      } catch (err) {
        console.error('Error loading restock requests:', err);
      }
    },

    async loadProducts() {
      try {
        const res = await axios.get('/api/products');
        this.products = res.data || [];
      } catch (err) {
        console.error('Error loading products:', err);
      }
    },

    async submitRestockRequest() {
      try {
        if (this.editingRequest) {
          // Update existing request
          await axios.patch(`/api/restocks/${this.newRestock._id}`, this.newRestock);
        } else {
          await axios.post('/api/restocks', this.newRestock);
        }

        this.resetRestockForm();
        this.showRestockForm = false;
        this.loadRestockRequests();
      } catch (err) {
        console.error('Submit failed:', err);
      }
    },

    editRestockRequest(request) {
      this.editingRequest = request;
      this.newRestock = { ...request };
      this.showRestockForm = true;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    async markAsReceived(request) {
      try {
        await axios.patch(`/api/restocks/${request._id}`, { status: 'received' });
        this.loadRestockRequests();
      } catch (err) {
        console.error('Failed to mark as received:', err);
      }
    },

    confirmDeleteRequest(request) {
      this.requestToDelete = request;
      this.showDeleteModal = true;
    },

    async deleteRestockRequest() {
      try {
        await axios.delete(`/api/restocks/${this.requestToDelete._id}`);
        this.loadRestockRequests();
        this.showDeleteModal = false;
      } catch (err) {
        console.error('Failed to delete:', err);
      }
    },

    resetRestockForm() {
      this.newRestock = {
        productId: '',
        quantity: 1,
        priority: 'medium',
        expectedDate: '',
        notes: '',
        status: 'pending'
      };
      this.editingRequest = null;
    },

    getProductName(productId) {
      const product = this.products.find(p => p._id === productId || p.id === productId);
      return product ? product.name : 'Unknown';
    },

    getProductImage(productId) {
      const product = this.products.find(p => p._id === productId || p.id === productId);
      return product ? product.imageUrl : '';
    },

    getProductStock(productId) {
      const product = this.products.find(p => p._id === productId || p.id === productId);
      return product ? (product.stock || 0) : 0;
    },

    formatPriority(priority) {
      return priority.charAt(0).toUpperCase() + priority.slice(1);
    },

    formatStatus(status) {
      return status.charAt(0).toUpperCase() + status.slice(1);
    },

    formatDate(dateString) {
      if (!dateString) return '';
      return new Date(dateString).toLocaleDateString();
    }
  }
}
</script> -->


<style scoped>
/* Reuse all the styles from Products.vue */
.management-page {
  padding: 2rem;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #ffe680;
}

.page-header h1 {
  color: #8a6d0b;
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;
}

.create-container {
  background: #fffae6;
  border-radius: 0.75rem;
  box-shadow: 0 2px 8px rgba(139, 117, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid #ffe680;
}

.create-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 0;
}

.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #b38b00;
}

.form-input, .form-textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #ffe680;
  border-radius: 0.5rem;
  font-size: 1rem;
  background-color: #fffae6;
  color: #5d4a00;
  transition: border-color 0.2s;
}

.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: #ffd700;
  box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.2);
}

.form-textarea {
  min-height: 100px;
  resize: vertical;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 0.5rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  font-size: 0.95rem;
}

.btn i {
  font-size: 0.9rem;
}

.btn-primary {
  background: #ffd700;
  color: #5d4a00;
}

.btn-primary:hover {
  background: #e6c200;
}

.btn-secondary {
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffe680;
}

.btn-secondary:hover {
  background: #ffe680;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-danger:hover {
  background: #c82333;
}

.product-table-container {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 2px 8px rgba(139, 117, 0, 0.1);
  overflow: hidden;
  border: 1px solid #ffe680;
}

.product-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

.product-table th {
  background: #fffae6;
  padding: 1rem 1.25rem;
  text-align: left;
  font-weight: 600;
  color: #8a6d0b;
  border-bottom: 2px solid #ffe680;
}

.product-table td {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #ffe680;
  vertical-align: middle;
}

.product-table tr:last-child td {
  border-bottom: none;
}

.product-table tr:hover td {
  background-color: #fffae6;
}

.product-thumbnail-container {
  margin-top: 0.5rem;
}

.product-thumbnail {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 0.5rem;
  border: 1px solid #ffe680;
}

.product-name {
  font-weight: 600;
  color: #5d4a00;
}

.product-price {
  font-weight: 700;
  color: #5d4a00;
}

.product-actions {
  display: flex;
  gap: 0.75rem;
}

.action-btn {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.85rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  border: none;
  font-weight: 500;
  transition: all 0.2s;
}

.action-btn i {
  font-size: 0.8rem;
}

.edit-btn {
  background: #fff3cd;
  color: #856404;
}

.edit-btn:hover {
  background: #ffe680;
}

.delete-btn {
  background: #fee2e2;
  color: #b91c1c;
}

.delete-btn:hover {
  background: #fecaca;
}

.receive-btn {
  background: #e6ffe6;
  color: #2e7d32;
}

.receive-btn:hover {
  background: #ccffcc;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #fffae6;
  padding: 2rem;
  border-radius: 0.75rem;
  max-width: 500px;
  width: 90%;
  border: 1px solid #ffe680;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.modal-content h3 {
  color: #8a6d0b;
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
}

.modal-content p {
  color: #5d4a00;
  margin-bottom: 2rem;
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

/* Priority and Status badges */
.priority-badge, .status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: capitalize;
}

.priority-low {
  background: #e6f7ff;
  color: #1890ff;
}

.priority-medium {
  background: #fff7e6;
  color: #fa8c16;
}

.priority-high {
  background: #fff2e8;
  color: #fa541c;
}

.priority-urgent {
  background: #fff1f0;
  color: #f5222d;
}

.status-pending {
  background: #fffbe6;
  color: #faad14;
}

.status-processing {
  background: #e6f7ff;
  color: #1890ff;
}

.status-received {
  background: #f6ffed;
  color: #52c41a;
}

.status-cancelled {
  background: #fff2f0;
  color: #ff4d4f;
}

@media (max-width: 768px) {
  .management-page {
    padding: 1.5rem;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .form-row {
    flex-direction: column;
    gap: 1rem;
  }
  
  .product-table {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }
  
  .product-actions {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .action-btn {
    width: 100%;
    justify-content: center;
  }
}

.create-container {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.btn.loading {
  position: relative;
  pointer-events: none;
}

.btn.loading:after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 16px;
  height: 16px;
  margin: -8px 0 0 -8px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>