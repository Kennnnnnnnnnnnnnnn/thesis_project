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
    background-color: #f8fafc;
    min-height: 100vh;
  }
  
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }
  
  .create-container {
    background: white;
    border-radius: 0.75rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    padding: 2rem;
    margin-bottom: 2rem;
  }
  
  .form-row {
    display: flex;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
  }
  
  .form-group {
    flex: 1;
  }
  
  .form-input, .form-textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    font-size: 1rem;
  }
  
  .form-textarea {
    min-height: 80px;
    resize: vertical;
  }
  
  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1.5rem;
  }
  
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
  }
  
  .btn-primary {
    background: #3b82f6;
    color: white;
  }
  
  .btn-secondary {
    background: #e2e8f0;
    color: #334155;
  }
  
  .btn-danger {
    background: #ef4444;
    color: white;
  }
  
  .product-table-container {
    background: white;
    border-radius: 0.75rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    overflow: hidden;
  }
  
  .product-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .product-table th {
    background: #f1f5f9;
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    color: #334155;
  }
  
  .product-table td {
    padding: 1rem;
    border-bottom: 1px solid #e2e8f0;
    vertical-align: middle;
  }
  
  .product-image-cell {
    width: 80px;
  }
  
  .product-thumbnail {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 0.25rem;
  }
  
  .no-image-thumbnail {
    width: 60px;
    height: 60px;
    background: #f1f5f9;
    border-radius: 0.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #cbd5e1;
  }
  
  .product-name {
    font-weight: 500;
    color: #1e293b;
  }
  
  .product-description {
    color: #64748b;
    font-size: 0.875rem;
  }
  
  .product-price {
    font-weight: 600;
    color: #3b82f6;
  }
  
  .product-discount {
    color: #94a3b8;
  }
  
  .product-actions {
    display: flex;
    gap: 0.5rem;
  }
  
  .action-btn {
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    font-size: 0.875rem;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    border: none;
  }
  
  .edit-btn {
    background: #e0f2fe;
    color: #0369a1;
  }
  
  .delete-btn {
    background: #fee2e2;
    color: #b91c1c;
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
    background: white;
    padding: 2rem;
    border-radius: 0.75rem;
    max-width: 500px;
    width: 90%;
  }
  
  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1.5rem;
  }
  
  @media (max-width: 768px) {
    .form-row {
      flex-direction: column;
      gap: 1rem;
    }
    
    .product-table {
      display: block;
      overflow-x: auto;
    }
  }
  </style>