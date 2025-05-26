<template>
  <div class="p-6 max-w-screen-xl mx-auto bg-white h-screen overflow-y-auto">
    <!-- Dashboard Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-amber-800 mb-1">Dashboard Overview</h1>
      <p class="text-amber-600 mb-6">Monitor your store's performance</p>
    </div>

    <!-- Metrics Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div class="bg-white rounded-xl p-6 shadow border border-yellow-200 flex items-center gap-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-amber-100">
        <div class="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 bg-green-50">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#16a34a" class="w-7 h-7">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <div class="flex-1">
          <h3 class="text-sm text-amber-600 mb-1 font-medium">Total Orders</h3>
          <div class="text-2xl font-bold text-amber-800 mb-1">{{ formatNumber(metrics.totalOrders) }}</div>
          <div class="flex items-center gap-1 text-xs" :class="metrics.ordersChange >= 0 ? 'text-green-600' : 'text-red-600'">
            <span v-if="metrics.ordersChange >= 0">↑</span>
            <span v-else>↓</span>
            {{ Math.abs(metrics.ordersChange) }}% from last period
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-6 shadow border border-yellow-200 flex items-center gap-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-amber-100">
        <div class="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 bg-blue-50">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#2563eb" class="w-7 h-7">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
        <div class="flex-1">
          <h3 class="text-sm text-amber-600 mb-1 font-medium">Total Users</h3>
          <div class="text-2xl font-bold text-amber-800 mb-1">{{ formatNumber(metrics.totalUsers) }}</div>
          <div class="flex items-center gap-1 text-xs" :class="metrics.usersChange >= 0 ? 'text-green-600' : 'text-red-600'">
            <span v-if="metrics.usersChange >= 0">↑</span>
            <span v-else>↓</span>
            {{ Math.abs(metrics.usersChange) }}% from last period
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-6 shadow border border-yellow-200 flex items-center gap-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-amber-100">
        <div class="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 bg-red-50">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#dc2626" class="w-7 h-7">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="flex-1">
          <h3 class="text-sm text-amber-600 mb-1 font-medium">Pending Orders</h3>
          <div class="text-2xl font-bold text-amber-800 mb-1">{{ formatNumber(metrics.pendingOrders) }}</div>
          <div class="flex items-center gap-1 text-xs" :class="metrics.pendingChange >= 0 ? 'text-green-600' : 'text-red-600'">
            <span v-if="metrics.pendingChange >= 0">↑</span>
            <span v-else>↓</span>
            {{ Math.abs(metrics.pendingChange) }}% from last period
          </div>
        </div>
      </div>
    </div>

    <!-- Chart Section -->
    <div class="bg-white rounded-xl p-6 shadow border border-yellow-200 mb-8">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-xl font-semibold text-amber-800">Sales Analytics</h3>
        <div class="flex items-center gap-3">
          <select 
            class="py-2 px-4 rounded-lg border border-yellow-200 bg-amber-50 text-amber-800 text-sm cursor-pointer" 
            v-model="selectedTimeRange" 
            @change="fetchChartData"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
          <button 
            class="p-2 rounded-lg border border-yellow-200 bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white transition-colors duration-200"
            @click="fetchChartData"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      <div class="h-[350px] w-full md:h-[350px]">
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
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #f9f9f6;
  border-radius: 20px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
}
/* Footer scroll animation */
@keyframes scroll {
  0% {
    left: -22%;
  }

  100% {
    left: 100%;
  }
}

</style>