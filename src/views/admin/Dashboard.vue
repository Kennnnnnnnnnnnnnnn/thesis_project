<template>
  <div class="dashboard">
    <!-- Dashboard Header -->
    <div class="dashboard-header">
      <h1>Dashboard Overview</h1>
      <p class="subtitle">Monitor your store's performance</p>
    </div>

    <!-- Metrics Grid -->
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-icon" style="background-color: #f0fdf4;">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#16a34a">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <div class="metric-info">
          <h3>Total Orders</h3>
          <div class="value">{{ formatNumber(metrics.totalOrders) }}</div>
          <div class="change" :class="metrics.ordersChange >= 0 ? 'positive' : 'negative'">
            <span v-if="metrics.ordersChange >= 0">↑</span>
            <span v-else>↓</span>
            {{ Math.abs(metrics.ordersChange) }}% from last period
          </div>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-icon" style="background-color: #eff6ff;">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#2563eb">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
        <div class="metric-info">
          <h3>Total Users</h3>
          <div class="value">{{ formatNumber(metrics.totalUsers) }}</div>
          <div class="change" :class="metrics.usersChange >= 0 ? 'positive' : 'negative'">
            <span v-if="metrics.usersChange >= 0">↑</span>
            <span v-else>↓</span>
            {{ Math.abs(metrics.usersChange) }}% from last period
          </div>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-icon" style="background-color: #fef2f2;">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#dc2626">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="metric-info">
          <h3>Pending Orders</h3>
          <div class="value">{{ formatNumber(metrics.pendingOrders) }}</div>
          <div class="change" :class="metrics.pendingChange >= 0 ? 'positive' : 'negative'">
            <span v-if="metrics.pendingChange >= 0">↑</span>
            <span v-else>↓</span>
            {{ Math.abs(metrics.pendingChange) }}% from last period
          </div>
        </div>
      </div>
    </div>

    <!-- Chart Section -->
    <div class="chart-card">
      <div class="chart-header">
        <h3>Sales Analytics</h3>
        <div class="chart-controls">
          <select class="time-select" v-model="selectedTimeRange" @change="fetchChartData">
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
          <button class="refresh-btn" @click="fetchChartData">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      <div class="chart-wrapper">
        <canvas ref="chartCanvas"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import Chart from 'chart.js/auto';

export default {
  name: 'AdminDashboard',
  setup() {
    const chartCanvas = ref(null);
    const selectedTimeRange = ref('30');
    let chartInstance = null;

    // Sample metrics data
    const metrics = ref({
      totalOrders: 1245,
      ordersChange: 12.5,
      totalUsers: 843,
      usersChange: 8.2,
      pendingOrders: 56,
      pendingChange: -3.2
    });

// Format numbers with commas
const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Chart data and configuration
const chartData = {
  labels: [],
  datasets: [
    {
      label: 'Completed Orders',
      data: [],
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      borderColor: 'rgba(16, 185, 129, 1)',
      borderWidth: 2,
      tension: 0.3,
      fill: true
    },
    {
      label: 'Pending Orders',
      data: [],
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      borderColor: 'rgba(239, 68, 68, 1)',
      borderWidth: 2,
      tension: 0.3,
      fill: true
    }
  ]
};

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          mode: 'index',
          intersect: false,
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            drawBorder: false
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    };

    // Initialize chart
    const initChart = () => {
      if (chartCanvas.value) {
        if (chartInstance) {
          chartInstance.destroy();
        }
        
        const ctx = chartCanvas.value.getContext('2d');
        chartInstance = new Chart(ctx, {
          type: 'line',
          data: chartData,
          options: chartOptions
        });
      }
    };

    // Generate random data for demo
    const generateChartData = () => {
      const days = parseInt(selectedTimeRange.value);
      const labels = [];
      const completedData = [];
      const pendingData = [];
      
      for (let i = 0; i < days; i++) {
        labels.push(`Day ${i + 1}`);
        completedData.push(Math.floor(Math.random() * 100) + 20);
        pendingData.push(Math.floor(Math.random() * 30) + 5);
      }
      
      chartData.labels = labels;
      chartData.datasets[0].data = completedData;
      chartData.datasets[1].data = pendingData;
    };

    // Fetch data (simulated)
    const fetchChartData = () => {
      generateChartData();
      if (chartInstance) {
        chartInstance.update();
      }
      
      // Simulate metrics update
      metrics.value = {
        totalOrders: Math.floor(Math.random() * 2000) + 1000,
        ordersChange: (Math.random() * 20 - 5),
        totalUsers: Math.floor(Math.random() * 1500) + 500,
        usersChange: (Math.random() * 15 - 2),
        pendingOrders: Math.floor(Math.random() * 100) + 20,
        pendingChange: (Math.random() * 10 - 5)
      };
    };

    onMounted(() => {
      generateChartData();
      initChart();
      // Simulate loading real data
      setTimeout(fetchChartData, 1000);
    });

    onBeforeUnmount(() => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    });

    return {
      chartCanvas,
      selectedTimeRange,
      metrics,
      formatNumber,
      fetchChartData
    };
  }
};
</script>
<style scoped>
.dashboard {
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;

}

.dashboard-header h1 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #8a6d0b; /* Dark yellow text */
  margin-bottom: 0.25rem;
}

.subtitle {
  color: #b38b00; /* Medium yellow text */
  margin-bottom: 1.5rem;
}

/* Metrics Grid */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.metric-card {
  background: #fffae6; /* Light yellow card background */
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(139, 117, 0, 0.1); /* Yellow tint shadow */
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid #ffe680; /* Light yellow border */
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(139, 117, 0, 0.15); /* Stronger yellow shadow */
}

.metric-icon {
  width: 56px;
  height: 56px;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background-color: #ffd700; /* Gold yellow background */
}

.metric-icon svg {
  width: 28px;
  height: 28px;
  color: white;
}

.metric-info {
  flex: 1;
}

.metric-info h3 {
  font-size: 0.875rem;
  color: #b38b00; /* Medium yellow text */
  margin-bottom: 0.25rem;
  font-weight: 500;
}

.metric-info .value {
  font-size: 1.75rem;
  font-weight: 700;
  color: #8a6d0b; /* Dark yellow text */
  margin-bottom: 0.25rem;
}

.metric-info .change {
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.metric-info .positive {
  color: #689f38; /* Green with yellow undertone */
}

.metric-info .negative {
  color: #d32f2f; /* Red with yellow undertone */
}

/* Chart Card */
.chart-card {
  background: #fffae6; /* Light yellow card background */
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(139, 117, 0, 0.1); /* Yellow tint shadow */
  margin-bottom: 2rem;
  border: 1px solid #ffe680; /* Light yellow border */
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.chart-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #8a6d0b; /* Dark yellow text */
}

.chart-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.time-select {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid #ffe680; /* Light yellow border */
  background-color: #fffae6; /* Light yellow background */
  color: #8a6d0b; /* Dark yellow text */
  font-size: 0.875rem;
  cursor: pointer;
}

.refresh-btn {
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid #ffe680; /* Light yellow border */
  background-color: #fffae6; /* Light yellow background */
  color: #b38b00; /* Medium yellow text */
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.refresh-btn:hover {
  background-color: #ffd700; /* Gold yellow on hover */
  color: white;
}

.refresh-btn svg {
  width: 1.25rem;
  height: 1.25rem;
}

.chart-wrapper {
  height: 350px;
  width: 100%;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .dashboard {
    padding: 1rem;
  }
  
  .metrics-grid {
    grid-template-columns: 1fr;
  }
  
  .chart-wrapper {
    height: 250px;
  }
}
</style>