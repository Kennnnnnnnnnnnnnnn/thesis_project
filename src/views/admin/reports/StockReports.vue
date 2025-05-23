<template>
  <div class="report-page">
    <div class="page-header">
      <div>
        <h1>Stock Reports</h1>
        <p class="subtitle">Overview of Inventory Performance</p>
      </div>
      <div class="header-actions">
        <button class="btn btn-export">
          <i class="fas fa-file-export"></i> Export Report
        </button>
      </div>
    </div>

    <div class="report-filters">
      <div class="search-filter">
        <input type="text" placeholder="Search products..." class="search-input">
        <select class="filter-select">
          <option>All Status</option>
          <option>In Stock</option>
          <option>Low Stock</option>
          <option>Out of Stock</option>
        </select>
      </div>
    </div>

    <div class="report-table-container">
      <table class="report-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Product</th>
            <th>Category</th>
            <th>Stock</th>
            <th>Price</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <!-- Stock report items will be listed here -->
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StockReports',
  data() {
    return {
      reports: [] // Will be populated with stock report data
    };
  }
};
</script>

<style scoped>
.report-page {
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
  color: #8a6d0b;
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;
}

.subtitle {
  color: #b38b00;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.btn-export {
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffe680;
}

.btn-export:hover {
  background: #ffe680;
}

.report-filters {
  display: flex;
  margin-bottom: 1.5rem;
}

.search-input, .filter-select {
  padding: 0.625rem 1rem;
  border: 1px solid #ffe680;
  border-radius: 0.5rem;
  background-color: #fffae6;
  color: #5d4a00;
}

.report-table-container {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 2px 8px rgba(139, 117, 0, 0.1);
  overflow: hidden;
  border: 1px solid #ffe680;
}

.report-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

.report-table th, .report-table td {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #ffe680;
}

.report-table tr:last-child td {
  border-bottom: none;
}

.report-table tr:hover td {
  background-color: #fffae6;
}
</style>