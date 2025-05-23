<template>
  <div class="admin-order-reports">
    <div class="header">
      <h1>Order Analytics</h1>
      <div class="report-controls">
        <div class="date-range-picker">
          <label>Date Range:</label>
          <input type="date" v-model="reportStartDate" @change="generateReport">
          <span>to</span>
          <input type="date" v-model="reportEndDate" @change="generateReport">
        </div>
        <button class="btn-export" @click="exportReport">
          <i class="fas fa-file-export"></i> Export
        </button>
      </div>
    </div>

    <div class="summary-cards">
      <div class="summary-card">
        <div class="card-value">{{ summary.totalOrders }}</div>
        <div class="card-label">Total Orders</div>
      </div>
      <div class="summary-card">
        <div class="card-value">${{ summary.totalRevenue.toFixed(2) }}</div>
        <div class="card-label">Total Revenue</div>
      </div>
      <div class="summary-card">
        <div class="card-value">${{ summary.averageOrderValue.toFixed(2) }}</div>
        <div class="card-label">Avg. Order Value</div>
      </div>
      <div class="summary-card">
        <div class="card-value">{{ summary.fulfillmentRate }}%</div>
        <div class="card-label">Fulfillment Rate</div>
      </div>
    </div>

    <div class="charts-section">
      <div class="chart-container">
        <h3>Orders Over Time</h3>
        <line-chart :chart-data="ordersOverTimeData" :options="chartOptions"></line-chart>
      </div>
      <div class="chart-container">
        <h3>Revenue by Status</h3>
        <bar-chart :chart-data="statusRevenueData" :options="chartOptions"></bar-chart>
      </div>
    </div>

    <div class="status-distribution">
      <h3>Order Status Distribution</h3>
      <div class="status-bars">
        <div v-for="(count, status) in statusDistribution" :key="status" class="status-bar">
          <div class="status-label">{{ status }}</div>
          <div class="status-track">
            <div 
              class="status-progress" 
              :style="{ width: (count / summary.totalOrders * 100) + '%' }"
              :class="status.toLowerCase()"
            ></div>
          </div>
          <div class="status-count">{{ count }} ({{ Math.round(count / summary.totalOrders * 100) }}%)</div>
        </div>
      </div>
    </div>

    <div class="top-products" v-if="topProducts.length > 0">
      <h3>Top Selling Products</h3>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Units Sold</th>
            <th>Total Revenue</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in topProducts" :key="product.name">
            <td>{{ product.name }}</td>
            <td>{{ product.quantity }}</td>
            <td>${{ product.revenue.toFixed(2) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { LineChart, BarChart } from 'vue-chart-3';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export default {
  name: 'AdminOrderReports',
  components: { LineChart, BarChart },
  data() {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(endDate.getMonth() - 1);

    return {
      reportStartDate: startDate.toISOString().split('T')[0],
      reportEndDate: endDate.toISOString().split('T')[0],
      summary: {
        totalOrders: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
        fulfillmentRate: 0
      },
      statusDistribution: {},
      topProducts: [],
      ordersOverTimeData: {
        labels: [],
        datasets: [{
          label: 'Orders',
          data: [],
          backgroundColor: '#FFD700',
          borderColor: '#B38B00'
        }]
      },
      statusRevenueData: {
        labels: [],
        datasets: [{
          label: 'Revenue',
          data: [],
          backgroundColor: '#FFE680'
        }]
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        }
      }
    };
  },
  created() {
    this.generateReport();
  },
  methods: {
    generateReport() {
      try {
        const activeOrders = JSON.parse(localStorage.getItem('activeOrders') || '[]');
        const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
        const allOrders = [...activeOrders, ...orderHistory];

        const startDate = new Date(this.reportStartDate);
        const endDate = new Date(this.reportEndDate);

        const filteredOrders = allOrders.filter(order => {
          const orderDate = new Date(order.date || new Date());
          return orderDate >= startDate && orderDate <= endDate;
        });

        this.summary.totalOrders = filteredOrders.length;
        this.summary.totalRevenue = filteredOrders.reduce((sum, order) => {
          return sum + this.calculateOrderTotal(order.items);
        }, 0);
        this.summary.averageOrderValue = this.summary.totalOrders > 0
          ? this.summary.totalRevenue / this.summary.totalOrders
          : 0;
        this.summary.fulfillmentRate = this.summary.totalOrders > 0
          ? Math.round((filteredOrders.filter(o => o.status === 'Delivered').length / this.summary.totalOrders) * 100)
          : 0;

        this.statusDistribution = filteredOrders.reduce((acc, order) => {
          const status = order.status || 'Processing';
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});

        const productMap = {};
        filteredOrders.forEach(order => {
          order.items.forEach(item => {
            const productName = item.name || 'Unknown Product';
            if (!productMap[productName]) {
              productMap[productName] = {
                name: productName,
                quantity: 0,
                revenue: 0
              };
            }
            productMap[productName].quantity += item.quantity || 1;
            productMap[productName].revenue += (item.price || 0) * (item.quantity || 1);
          });
        });
        this.topProducts = Object.values(productMap)
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 5);

        const days = {};
        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
          const dateStr = currentDate.toISOString().split('T')[0];
          days[dateStr] = { orders: 0, revenue: 0 };
          currentDate.setDate(currentDate.getDate() + 1);
        }

        filteredOrders.forEach(order => {
          const dateStr = new Date(order.date).toISOString().split('T')[0];
          if (days[dateStr]) {
            days[dateStr].orders++;
            days[dateStr].revenue += this.calculateOrderTotal(order.items);
          }
        });

        this.ordersOverTimeData.labels = Object.keys(days);
        this.ordersOverTimeData.datasets[0].data = Object.values(days).map(d => d.orders);

        this.statusRevenueData.labels = Object.keys(this.statusDistribution);
        this.statusRevenueData.datasets[0].data = Object.keys(this.statusDistribution).map(status => {
          return filteredOrders
            .filter(o => o.status === status)
            .reduce((sum, order) => sum + this.calculateOrderTotal(order.items), 0);
        });

      } catch (error) {
        console.error('Error generating report:', error);
      }
    },

    calculateOrderTotal(items) {
      return items.reduce((total, item) => {
        return total + ((item.price || 0) * (item.quantity || 1));
      }, 0);
    },

    exportReport() {
      const dataStr = JSON.stringify({
        summary: this.summary,
        statusDistribution: this.statusDistribution,
        topProducts: this.topProducts
      }, null, 2);

      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `order-report_${this.reportStartDate}_to_${this.reportEndDate}.json`;
      link.click();
    }
  }
};
</script>

<style scoped>
.admin-order-reports {
  padding: 20px;
  color: #5d4a00;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.report-controls {
  display: flex;
  gap: 15px;
  align-items: center;
}
.date-range-picker {
  display: flex;
  align-items: center;
  gap: 10px;
}
input[type="date"] {
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ffe680;
  background-color: #fffae6;
}
.btn-export {
  padding: 8px 15px;
  background-color: #ffd700;
  border: none;
  border-radius: 4px;
  color: #5d4a00;
  font-weight: 500;
  cursor: pointer;
}
.btn-export:hover {
  background-color: #e6c200;
}
.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 25px;
}
.summary-card {
  background-color: #fffae6;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
  border: 1px solid #ffe680;
}
.card-value {
  font-size: 24px;
  font-weight: bold;
}
.card-label {
  font-size: 14px;
}
.charts-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 30px;
}
.chart-container {
  background-color: #fffae6; /* Light yellow background */
  border: 1px solid #ffe680;
  border-radius: 8px;
  padding: 20px;
  min-height: 300px; /* 👈 Ensures background wraps around the canvas */
  box-shadow: 0 0 8px rgba(255, 215, 0, 0.3);
}

.status-distribution {
  margin-bottom: 30px;
}
.status-bars {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.status-bar {
  display: flex;
  align-items: center;
  gap: 10px;
}
.status-track {
  flex: 1;
  height: 12px;
  background-color: #eee1aa;
  border-radius: 6px;
  overflow: hidden;
}
.status-progress {
  height: 100%;
  border-radius: 6px;
}
.status-progress.delivered {
  background-color: #76c893;
}
.status-progress.processing {
  background-color: #f4d35e;
}
.status-progress.cancelled {
  background-color: #f25c54;
}
.status-count {
  font-size: 12px;
}
.top-products table {
  width: 100%;
  border-collapse: collapse;
  background-color: #fffdee;
}
.top-products th, .top-products td {
  padding: 10px;
  border: 1px solid #ffe680;
  text-align: left;
}
</style>
