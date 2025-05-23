<template>
  <div class="management-page">
    <section class="page-header">
      <h1>Purchase Reports</h1>
    </section>

    <div class="product-table-container">
      <table class="product-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Items</th>
            <th>Total Quantity</th>
            <th>Total Price</th>
            <th>Payment Method</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(report, index) in purchaseReports" :key="index">
            <td>{{ formatDate(report.date) }}</td>
            <td>
              <div v-for="(item, i) in report.items" :key="i" class="report-item">
                <span class="product-name">{{ item.name }}</span>
                <span class="product-description">({{ item.quantity }} × ${{ item.price.toFixed(2) }})</span>
              </div>
            </td>
            <td>{{ getTotalQuantity(report.items) }}</td>
            <td class="product-price">${{ getTotalPrice(report.items).toFixed(2) }}</td>
            <td>{{ report.paymentMethod || 'N/A' }}</td>
            <td>
              <span class="status-badge" :class="getStatusClass(report)">{{ getStatusText(report) }}</span>
            </td>
          </tr>
          <tr v-if="purchaseReports.length === 0">
            <td colspan="6" class="empty-reports">
              No purchase reports available. Complete a purchase to see reports.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PurchaseReports',
  data() {
    return {
      purchaseReports: []
    };
  },
  created() {
    this.loadReports();
    // Listen for new purchases from other components
    window.addEventListener('new-purchase', this.loadReports);
  },
  beforeUnmount() {  // Changed from beforeDestroy to beforeUnmount
    window.removeEventListener('new-purchase', this.loadReports);
  },
  methods: {
    loadReports() {
      const reports = JSON.parse(localStorage.getItem('orderHistory')) || [];
      this.purchaseReports = reports.reverse(); // Show most recent first
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
    getTotalQuantity(items) {
      return items.reduce((total, item) => total + (item.quantity || 1), 0);
    },
    getTotalPrice(items) {
      return items.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
    },
    getStatusText(report) {
      return report.paymentMethod === 'Cash' ? 'Pending' : 'Completed';
    },
    getStatusClass(report) {
      return report.paymentMethod === 'Cash' ? 'status-pending' : 'status-completed';
    }
  }
};
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
  border-bottom: 1px solid #ffe680;
}

.page-header h1 {
  color: #8a6d0b;
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;
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

.report-item {
  margin-bottom: 0.5rem;
}

.report-item:last-child {
  margin-bottom: 0;
}

.product-name {
  font-weight: 600;
  color: #5d4a00;
}

.product-description {
  color: #8a6d0b;
  font-size: 0.9rem;
  line-height: 1.4;
}

.product-price {
  font-weight: 700;
  color: #5d4a00;
}

.empty-reports {
  text-align: center;
  color: #8a6d0b;
  padding: 2rem;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 600;
}

.status-completed {
  background-color: #e6ffed;
  color: #22863a;
}

.status-pending {
  background-color: #fff5b1;
  color: #735c0f;
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
  
  .product-table {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }
}
</style>