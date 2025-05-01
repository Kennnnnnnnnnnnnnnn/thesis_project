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
    background-color: #f8fafc;
    min-height: 100vh;
  }
  
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }
  
  .subtitle {
    color: #64748b;
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
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
  }
  
  .btn-export {
    background: #e2e8f0;
    color: #1e293b;
  }
  
  .btn-primary {
    background: #3b82f6;
    color: white;
  }
  
  .btn:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
  
  .stock-controls {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1.5rem;
  }
  
  .search-filter {
    display: flex;
    gap: 1rem;
  }
  
  .search-input {
    padding: 0.625rem 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    min-width: 300px;
  }
  
  .filter-select {
    padding: 0.625rem 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    background-color: white;
  }
  
  .view-options {
    display: flex;
    gap: 0.5rem;
  }
  
  .view-btn {
    padding: 0.5rem 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    background: white;
    cursor: pointer;
  }
  
  .view-btn.active {
    background: #e2e8f0;
  }
  
  .stock-table-container {
    background: white;
    border-radius: 0.75rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    overflow: hidden;
  }
  
  .stock-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .stock-table th {
    background: #f1f5f9;
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    color: #334155;
  }
  
  .stock-table td {
    padding: 1rem;
    border-bottom: 1px solid #e2e8f0;
  }
  
  .pagination-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1.5rem;
    color: #64748b;
  }
  
  .pagination-buttons {
    display: flex;
    gap: 0.5rem;
  }
  
  .page-btn {
    padding: 0.5rem 0.75rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    background: white;
    cursor: pointer;
  }
  
  .page-btn.active {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
  }
  </style>