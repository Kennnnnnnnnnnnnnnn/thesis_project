<template>
    <div class="stock-page">
      <div class="page-header">
        <div>
          <h1>Inventory Management</h1>
          <p class="subtitle">Total items: 1,245 | Low stock: 12</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-export">
            <i class="fas fa-file-export"></i> Export CSV
          </button>
          <button class="btn btn-primary">
            <i class="fas fa-plus"></i> Add Item
          </button>
        </div>
      </div>
      
      <div class="stock-controls">
        <div class="search-filter">
          <input type="text" placeholder="Search products..." class="search-input">
          <select class="filter-select">
            <option>All Categories</option>
            <option>Electronics</option>
            <option>Clothing</option>
          </select>
        </div>
        <div class="view-options">
          <button class="view-btn active"><i class="fas fa-table"></i></button>
          <button class="view-btn"><i class="fas fa-th-large"></i></button>
        </div>
      </div>
      
      <div class="stock-table-container">
        <table class="stock-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Product</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <!-- Stock items will be listed here -->
          </tbody>
        </table>
      </div>
      
      <div class="pagination-controls">
        <span>Showing 1-10 of 1,245 items</span>
        <div class="pagination-buttons">
          <button class="page-btn"><i class="fas fa-chevron-left"></i></button>
          <button class="page-btn active">1</button>
          <button class="page-btn">2</button>
          <button class="page-btn"><i class="fas fa-chevron-right"></i></button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'AdminStock',
    data() {
      return {
        inventory: [] // Will be populated with real data
      }
    }
  }
  </script>
  <style scoped>
.stock-page {
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

.subtitle {
  color: #b38b00; /* Medium yellow text */
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  font-size: 0.95rem;
}

.btn-export {
  background: #fff3cd; /* Light yellow */
  color: #856404; /* Dark yellow text */
  border: 1px solid #ffe680; /* Light yellow border */
}

.btn-export:hover {
  background: #ffe680; /* Medium yellow */
}

.btn-primary {
  background: #ffd700; /* Gold yellow */
  color: #5d4a00; /* Dark yellow text */
}

.btn-primary:hover {
  background: #e6c200; /* Darker gold yellow */
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(139, 117, 0, 0.1); /* Yellow tint shadow */
}

.stock-controls {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.search-filter {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.search-input {
  padding: 0.625rem 1rem;
  border: 1px solid #ffe680; /* Light yellow border */
  border-radius: 0.5rem;
  min-width: 250px;
  background-color: #fffae6; /* Light yellow background */
  color: #5d4a00; /* Dark yellow text */
  transition: border-color 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #ffd700; /* Gold yellow */
  box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.2); /* Gold yellow shadow */
}

.filter-select {
  padding: 0.625rem 1rem;
  border: 1px solid #ffe680; /* Light yellow border */
  border-radius: 0.5rem;
  background-color: #fffae6; /* Light yellow background */
  color: #5d4a00; /* Dark yellow text */
  cursor: pointer;
}

.view-options {
  display: flex;
  gap: 0.5rem;
}

.view-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #ffe680; /* Light yellow border */
  border-radius: 0.5rem;
  background: #fffae6; /* Light yellow background */
  cursor: pointer;
  color: #8a6d0b; /* Dark yellow text */
  transition: all 0.2s;
}

.view-btn:hover {
  background: #ffe680; /* Medium yellow */
}

.view-btn.active {
  background: #ffd700; /* Gold yellow */
  color: #5d4a00; /* Dark yellow text */
  border-color: #ffd700; /* Gold yellow */
}

.stock-table-container {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 2px 8px rgba(139, 117, 0, 0.1); /* Yellow tint shadow */
  overflow: hidden;
  border: 1px solid #ffe680; /* Light yellow border */
}

.stock-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

.stock-table th {
  background: #fffae6; /* Light yellow background */
  padding: 1rem 1.25rem;
  text-align: left;
  font-weight: 600;
  color: #8a6d0b; /* Dark yellow text */
  border-bottom: 2px solid #ffe680; /* Light yellow border */
}

.stock-table td {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #ffe680; /* Light yellow border */
  color: #5d4a00; /* Dark yellow text */
}

.stock-table tr:last-child td {
  border-bottom: none;
}

.stock-table tr:hover td {
  background-color: #fffae6; /* Light yellow background */
}

/* Status indicators */
.status-indicator {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.85rem;
  font-weight: 500;
}

.status-indicator:before {
  content: "";
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
}

.in-stock {
  background-color: #ecfccb;
  color: #3f6212;
}

.in-stock:before {
  background-color: #84cc16;
}

.low-stock {
  background-color: #fef3c7;
  color: #92400e;
}

.low-stock:before {
  background-color: #f59e0b;
}

.out-of-stock {
  background-color: #fee2e2;
  color: #991b1b;
}

.out-of-stock:before {
  background-color: #ef4444;
}

.pagination-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  color: #b38b00; /* Medium yellow text */
}

.pagination-buttons {
  display: flex;
  gap: 0.5rem;
}

.page-btn {
  padding: 0.5rem 0.75rem;
  border: 1px solid #ffe680; /* Light yellow border */
  border-radius: 0.5rem;
  background: #fffae6; /* Light yellow background */
  cursor: pointer;
  color: #8a6d0b; /* Dark yellow text */
  transition: all 0.2s;
}

.page-btn:hover {
  background: #ffe680; /* Medium yellow */
}

.page-btn.active {
  background: #ffd700; /* Gold yellow */
  color: #5d4a00; /* Dark yellow text */
  border-color: #ffd700; /* Gold yellow */
  font-weight: 600;
}

@media (max-width: 768px) {
  .stock-page {
    padding: 1.5rem;
  }
  
  .stock-controls {
    flex-direction: column;
  }
  
  .search-filter {
    width: 100%;
  }
  
  .search-input {
    min-width: 100%;
  }
  
  .view-options {
    align-self: flex-start;
  }
  
  .stock-table {
    display: block;
    overflow-x: auto;
  }
}

/* Animation for table row hover */
.stock-table tr td {
  transition: background-color 0.2s ease;
}

/* Loading state */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 249, 230, 0.8); /* Semi-transparent light yellow */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  border-radius: 0.75rem;
}

.loading-spinner {
  width: 2.5rem;
  height: 2.5rem;
  border: 3px solid #ffe680; /* Light yellow */
  border-top-color: #ffd700; /* Gold yellow */
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>