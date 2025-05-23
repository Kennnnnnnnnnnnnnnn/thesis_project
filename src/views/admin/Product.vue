<template>
    <div class="management-page">
      <div class="page-header">
        <h1>Product Management</h1>
        <button @click="showCreateForm = !showCreateForm" class="btn btn-primary">
          <i class="fas fa-plus"></i> {{ showCreateForm ? 'Cancel' : 'Create Product' }}
        </button>
      </div>
  
      <!-- Create Product Form (conditionally shown) -->
      <div v-if="showCreateForm" class="create-container">
        <form @submit.prevent="createProduct" class="create-form">
          <div class="form-row">
            <div class="form-group">
              <label>Product Name *</label>
              <input type="text" v-model="newProduct.name" required class="form-input">
            </div>
            <div class="form-group">
              <label>Price ($) *</label>
              <input type="number" v-model="newProduct.price" min="0" step="0.01" required class="form-input">
            </div>
            <div class="form-group">
              <label>Discount Price ($)</label>
              <input type="number" v-model="newProduct.discountPrice" min="0" step="0.01" class="form-input">
            </div>
          </div>
  
          <div class="form-row">
            <div class="form-group">
              <label>Description</label>
              <textarea v-model="newProduct.description" class="form-textarea" rows="2"></textarea>
            </div>
            <div class="form-group">
              <label>Image URL</label>
              <input type="text" v-model="newProduct.imageUrl" placeholder="Paste image URL" class="form-input">
            </div>
          </div>
  
          <div class="form-actions">
            <button type="button" @click="resetForm" class="btn btn-secondary">
              Reset
            </button>
            <button type="submit" class="btn btn-primary">
              {{ editingProduct ? 'Update' : 'Create' }} Product
            </button>
          </div>
        </form>
      </div>
  
      <!-- Product List Table -->
      <div class="product-table-container">
        <table class="product-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Product Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Discount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in products" :key="product.id">
              <td class="product-image-cell">
                <img v-if="product.imageUrl" :src="product.imageUrl" :alt="product.name" class="product-thumbnail">
                <div v-else class="no-image-thumbnail">
                  <i class="fas fa-image"></i>
                </div>
              </td>
              <td class="product-name">{{ product.name }}</td>
              <td class="product-description">{{ truncateDescription(product.description) }}</td>
              <td class="product-price">${{ product.price.toFixed(2) }}</td>
              <td class="product-discount">
                <span v-if="product.discountPrice > 0">${{ product.discountPrice.toFixed(2) }}</span>
                <span v-else>-</span>
              </td>
              <td class="product-actions">
                <button @click="editProduct(product)" class="action-btn edit-btn">
                  <i class="fas fa-edit"></i> Edit
                </button>
                <button @click="confirmDelete(product)" class="action-btn delete-btn">
                  <i class="fas fa-trash"></i> Delete
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
          <p>Are you sure you want to delete "{{ productToDelete?.name }}"?</p>
          <div class="modal-actions">
            <button @click="showDeleteModal = false" class="btn btn-secondary">Cancel</button>
            <button @click="deleteProduct" class="btn btn-danger">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'AdminProducts',
    data() {
      return {
        showCreateForm: false,
        editingProduct: null,
        newProduct: {
          id: '',
          name: '',
          description: '',
          price: 0,
          discountPrice: 0,
          imageUrl: ''
        },
        products: [],
        showDeleteModal: false,
        productToDelete: null
      }
    },
    created() {
      this.loadProducts();
    },
    methods: {
      loadProducts() {
        const savedProducts = localStorage.getItem('products');
        this.products = savedProducts ? JSON.parse(savedProducts) : [];
      },
      
      createProduct() {
        if (this.editingProduct) {
          // Update existing product
          const index = this.products.findIndex(p => p.id === this.editingProduct.id);
          if (index !== -1) {
            this.products[index] = { ...this.newProduct };
          }
        } else {
          // Create new product
          this.newProduct.id = Date.now().toString();
          this.products.unshift({ ...this.newProduct });
        }
        
        this.saveProducts();
        this.resetForm();
        this.showCreateForm = false;
      },
      
      editProduct(product) {
        this.editingProduct = product;
        this.newProduct = { ...product };
        this.showCreateForm = true;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      
      confirmDelete(product) {
        this.productToDelete = product;
        this.showDeleteModal = true;
      },
      
      deleteProduct() {
        this.products = this.products.filter(p => p.id !== this.productToDelete.id);
        this.saveProducts();
        this.showDeleteModal = false;
      },
      
      saveProducts() {
        localStorage.setItem('products', JSON.stringify(this.products));
      },
      
      resetForm() {
        this.newProduct = {
          id: '',
          name: '',
          description: '',
          price: 0,
          discountPrice: 0,
          imageUrl: ''
        };
        this.editingProduct = null;
      },
      
      truncateDescription(desc) {
        if (!desc) return '-';
        return desc.length > 50 ? desc.substring(0, 50) + '...' : desc;
      }
    }
  }
  </script>
 <style scoped>
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
  border-bottom: 1px solid #ffe680; /* Light yellow border */
}

.page-header h1 {
  color: #8a6d0b; /* Dark yellow text */
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;
}

.create-container {
  background: #fffae6; /* Light yellow background */
  border-radius: 0.75rem;
  box-shadow: 0 2px 8px rgba(139, 117, 0, 0.1); /* Yellow tint shadow */
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid #ffe680; /* Light yellow border */
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
  color: #b38b00; /* Medium yellow text */
}

.form-input, .form-textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #ffe680; /* Light yellow border */
  border-radius: 0.5rem;
  font-size: 1rem;
  background-color: #fffae6; /* Light yellow background */
  color: #5d4a00; /* Dark yellow text */
  transition: border-color 0.2s;
}

.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: #ffd700; /* Gold yellow */
  box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.2); /* Gold yellow shadow */
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
  background: #ffd700; /* Gold yellow */
  color: #5d4a00; /* Dark yellow text */
}

.btn-primary:hover {
  background: #e6c200; /* Darker gold yellow */
}

.btn-secondary {
  background: #fff3cd; /* Light yellow */
  color: #856404; /* Dark yellow text */
  border: 1px solid #ffe680; /* Light yellow border */
}

.btn-secondary:hover {
  background: #ffe680; /* Medium yellow */
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
  box-shadow: 0 2px 8px rgba(139, 117, 0, 0.1); /* Yellow tint shadow */
  overflow: hidden;
  border: 1px solid #ffe680; /* Light yellow border */
}

.product-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

.product-table th {
  background: #fffae6; /* Light yellow background */
  padding: 1rem 1.25rem;
  text-align: left;
  font-weight: 600;
  color: #8a6d0b; /* Dark yellow text */
  border-bottom: 2px solid #ffe680; /* Light yellow border */
}

.product-table td {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #ffe680; /* Light yellow border */
  vertical-align: middle;
}

.product-table tr:last-child td {
  border-bottom: none;
}

.product-table tr:hover td {
  background-color: #fffae6; /* Light yellow background */
}

.product-image-cell {
  width: 80px;
}

.product-thumbnail {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 0.5rem;
  border: 1px solid #ffe680; /* Light yellow border */
}

.no-image-thumbnail {
  width: 60px;
  height: 60px;
  background: #fffae6; /* Light yellow background */
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffe680; /* Light yellow icon */
  border: 1px dashed #ffe680; /* Light yellow border */
}

.product-name {
  font-weight: 600;
  color: #5d4a00; /* Dark yellow text */
}

.product-description {
  color: #8a6d0b; /* Dark yellow text */
  font-size: 0.9rem;
  line-height: 1.4;
}

.product-price {
  font-weight: 700;
  color: #5d4a00; /* Dark yellow text */
}

.product-discount {
  color: #b38b00; /* Medium yellow text */
  font-weight: 500;
}

.product-discount span {
  color: #dc3545; /* Red for discount */
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
  background: #fff3cd; /* Light yellow */
  color: #856404; /* Dark yellow text */
}

.edit-btn:hover {
  background: #ffe680; /* Medium yellow */
}

.delete-btn {
  background: #fee2e2;
  color: #b91c1c;
}

.delete-btn:hover {
  background: #fecaca;
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
  background: #fffae6; /* Light yellow background */
  padding: 2rem;
  border-radius: 0.75rem;
  max-width: 500px;
  width: 90%;
  border: 1px solid #ffe680; /* Light yellow border */
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.modal-content h3 {
  color: #8a6d0b; /* Dark yellow text */
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
}

.modal-content p {
  color: #5d4a00; /* Dark yellow text */
  margin-bottom: 2rem;
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
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

/* Animation for form appearance */
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

/* Loading state for buttons */
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