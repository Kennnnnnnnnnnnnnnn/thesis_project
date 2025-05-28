<template>
  <div class="management-page">
    <div class="page-header">
      <h1>Product Management</h1>
      <button @click="showCreateForm = !showCreateForm" class="btn btn-primary">
        <i class="fas fa-plus"></i> {{ showCreateForm ? 'Cancel' : 'Create Product' }}
      </button>
    </div>

    <!-- Create Product Form -->
    <div v-if="showCreateForm" class="create-container">
      <form @submit.prevent="createProduct" class="create-form">
        <div class="form-row">
          <div class="form-group">
            <label>Custom ID *</label>
            <input v-model="newProduct.idCustom" required class="form-input" />
          </div>

          <div class="form-group">
            <label>Category *</label>
            <select v-model="newProduct.categoryId" required class="form-input">
              <option disabled value="">Select a category</option>
              <option v-for="cat in categories" :key="cat._id" :value="cat._id">
                {{ cat.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Product Name *</label>
            <input v-model="newProduct.name" required class="form-input" />
          </div>

          <div class="form-group">
            <label>Sale Price *</label>
            <input v-model="newProduct.salePrice" type="number" min="0" step="0.01" required class="form-input" />
          </div>

          <div class="form-group">
            <label>Discount (%)</label>
            <input v-model="newProduct.discount" type="number" min="0" step="0.01" class="form-input" />
          </div>

          <div class="form-group">
            <label>Total Stock</label>
            <input v-model="newProduct.totalStock" type="number" min="0" step="1" class="form-input" />
          </div>

          <div class="form-group">
            <label>Status</label>
            <select v-model="newProduct.status" class="form-input">
              <option :value="true">Active</option>
              <option :value="false">Inactive</option>
            </select>
          </div>

          <div class="form-group">
            <label>Image URL</label>
            <input v-model="newProduct.imageURL" placeholder="https://..." class="form-input" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Description</label>
            <textarea v-model="newProduct.description" class="form-textarea" rows="2"></textarea>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" @click="resetForm" class="btn btn-secondary">Reset</button>
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
        <th>Custom ID</th>
        <th>Product Name</th>
        <th>Category</th>
        <th>Description</th>
        <th>Sale Price</th>
        <th>Discount</th>
        <th>Total Stock</th>
        <th>Status</th>
        <th>Created By</th>
        <th>Created At</th>
        <th>Updated By</th>
        <th>Updated At</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="product in products" :key="product._id">
        <!-- Image -->
        <td class="product-image-cell">
          <img v-if="product.imageURL" :src="product.imageURL" :alt="product.name" class="product-thumbnail" />
          <div v-else class="no-image-thumbnail"><i class="fas fa-image"></i></div>
        </td>

        <!-- All Fields -->
        <td>{{ product.idCustom }}</td>
        <td>{{ product.name }}</td>
        <td>{{ getCategoryName(product.categoryId) }}</td>
        <td>{{ truncateDescription(product.description) }}</td>
        <td>${{ Number(product.salePrice).toFixed(2) }}</td>
        <td>
          <span v-if="product.discount > 0">${{ Number(product.discount).toFixed(2) }}</span>
          <span v-else>-</span>
        </td>
        <td>{{ product.totalStock }}</td>
        <td>{{ product.status ? 'Active' : 'Inactive' }}</td>
        <td>{{ product.createdBy }}</td>
        <td>{{ formatDate(product.createdAt) }}</td>
        <td>{{ product.updatedBy || '-' }}</td>
        <td>{{ formatDate(product.updatedAt) }}</td>

        <!-- Actions -->
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
<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import apiURL from '@/api/config'

const showCreateForm = ref(false)
const editingProduct = ref(null)
const showDeleteModal = ref(false)
const productToDelete = ref(null)
const products = ref([])
const categories = ref([])

const newProduct = ref({
  idCustom: '',
  categoryId: '',
  name: '',
  description: '',
  salePrice: 0,
  discount: 0,
  totalStock: 0,
  status: true,
  imageURL: ''
})

const formatDate = (date) => date ? new Date(date).toLocaleString('en-GB') : '-'
const truncateDescription = (desc) => desc?.length > 50 ? desc.slice(0, 50) + '...' : (desc || '-')
const getCategoryName = (categoryId) => {
  const cat = categories.value.find(c => c._id === categoryId)
  return cat?.name || categoryId
}

const fetchCategories = async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await axios.get(`${apiURL}/api/getAllDocs/Category`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    categories.value = res.data.data || []
  } catch (err) {
    console.error('❌ Failed to fetch categories:', err)
  }
}

const loadProducts = async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await axios.get(`${apiURL}/api/getAllDocs/Product`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    products.value = res.data.data || []
  } catch (err) {
    console.error('❌ Failed to load products:', err)
  }
}

const createProduct = async () => {
  if (!newProduct.value.name || newProduct.value.salePrice <= 0) {
    alert('Product Name and Sale Price are required!')
    return
  }

  if (editingProduct.value) {
    await updateProduct()
    return
  }

  try {
    const token = localStorage.getItem('token')
    const userId = localStorage.getItem('userId')

    const payload = {
      fields: {
        idCustom: newProduct.value.idCustom,
        categoryId: newProduct.value.categoryId,
        name: newProduct.value.name,
        description: newProduct.value.description || '',
        salePrice: newProduct.value.salePrice,
        discount: newProduct.value.discount || 0,
        totalStock: newProduct.value.totalStock || 0,
        status: newProduct.value.status,
        imageURL: newProduct.value.imageURL || '',
        createdBy: userId,
        createdAt: new Date()
      }
    }

    const res = await axios.post(`${apiURL}/api/insertDoc/Product`, payload, {
      headers: { Authorization: `Bearer ${token}` }
    })

    if (res.data.success) {
      products.value.unshift(res.data.data)
      resetForm()
      showCreateForm.value = false
    } else {
      alert(res.data.message || 'Failed to create product')
    }
  } catch (err) {
    console.error('❌ Create error:', err)
    alert(err.response?.data?.message || 'Failed to create product')
  }
}

const updateProduct = async () => {
  try {
    const token = localStorage.getItem('token')
    const userId = localStorage.getItem('userId')

    const payload = {
      fields: {
        idCustom: newProduct.value.idCustom,
        categoryId: newProduct.value.categoryId,
        name: newProduct.value.name,
        description: newProduct.value.description || '',
        salePrice: newProduct.value.salePrice,
        discount: newProduct.value.discount || 0,
        totalStock: newProduct.value.totalStock || 0,
        status: newProduct.value.status,
        imageURL: newProduct.value.imageURL || '',
        updatedBy: userId,
        updatedAt: new Date()
      }
    }

    const res = await axios.patch(`${apiURL}/api/updateDoc/Product/${editingProduct.value._id}`, payload, {
      headers: { Authorization: `Bearer ${token}` }
    })

    if (res.data.success) {
      await loadProducts()              // ✅ Refresh table
      resetForm()                       // ✅ Clear form
      showCreateForm.value = false      // ✅ Hide form
      alert('✅ Product updated successfully!')
    } else {
      alert(res.data.message || 'Failed to update product')
    }
  } catch (err) {
    console.error('❌ Update error:', err)
    alert(err.response?.data?.message || 'Failed to update product')
  }
}


const editProduct = (product) => {
  editingProduct.value = { ...product }
  newProduct.value = { ...product }
  showCreateForm.value = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const resetForm = () => {
  newProduct.value = {
    idCustom: '',
    categoryId: '',
    name: '',
    description: '',
    salePrice: 0,
    discount: 0,
    totalStock: 0,
    status: true,
    imageURL: ''
  }
  editingProduct.value = null
}

const confirmDelete = (product) => {
  productToDelete.value = product
  showDeleteModal.value = true
}

const deleteProduct = async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await axios.delete(`${apiURL}/api/deleteDoc/Product/${productToDelete.value._id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    if (res.data.success) {
      products.value = products.value.filter(p => p._id !== productToDelete.value._id)
      showDeleteModal.value = false
      productToDelete.value = null
    } else {
      alert(res.data.message || 'Failed to delete product')
    }
  } catch (err) {
    console.error('❌ Delete error:', err)
    alert(err.response?.data?.message || 'Failed to delete product')
  }
}

onMounted(() => {
  fetchCategories()
  loadProducts()
})
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