<template>
  <div class="p-2 max-w-screen-xl mx-auto bg-gray-100 min-h-screen overflow-y-auto font-sans">
    <!-- Header -->
    <div class="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Business Dashboard</h1>
      </div>
      <!-- <div class="flex items-center gap-4 mt-4 md:mt-0">
        <select v-model="filterPeriod" @change="handlePeriodChange"
          class="bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          <option value="daily">Daily</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div> -->
    </div>

    <!-- Stat Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <OrderStats :startDate="startDate" :endDate="endDate" />
      <AllProductStat />
      <InStockProductStat />
      <OutOfStockProductStat />
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
      <InCome />
      <OutCome />
    </div>
    <!-- Order Stats -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold text-gray-900">Order Stats</h3>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

      <!-- Pending Card -->
      <div
        class="flex items-center bg-white p-5 rounded-xl border border-yellow-200 shadow-sm hover:shadow-md transition group">
        <div class="flex-shrink-0 bg-yellow-400  rounded-full w-12 h-12 flex items-center justify-center mr-4">
          <i class="fa-solid fa-hourglass-half text-white text-2xl"></i>
        </div>
        <div>
          <div class="text-yellow-700 text-base font-semibold mb-1 flex items-center gap-2">
            Pending
            <span class="inline-block w-2 h-2 bg-yellow-400 rounded-full"></span>
          </div>
          <div class="text-3xl font-extrabold text-yellow-800">{{ billingStats.pending }}</div>
        </div>
      </div>
      <!-- Confirmed Card -->
      <div
        class="flex items-center bg-white p-5 rounded-xl border border-green-200 shadow-sm hover:shadow-md transition group">
        <div class="flex-shrink-0 bg-orange-500  rounded-full w-12 h-12 flex items-center justify-center mr-4">
          <i class="fa-solid fa-circle-check text-white text-2xl"></i>
        </div>
        <div>
          <div class="text-orange-700 text-base font-semibold mb-1 flex items-center gap-2">
            Confirmed
            <span class="inline-block w-2 h-2 bg-orange-500 rounded-full"></span>
          </div>
          <div class="text-3xl font-extrabold text-orange-800">{{ billingStats.delivering }}</div>
        </div>
      </div>
      <!-- Rejected Card -->
      <div
        class="flex items-center bg-white p-5 rounded-xl border border-red-200 shadow-sm hover:shadow-md transition group">
        <div class="flex-shrink-0 bg-red-500 rounded-full w-12 h-12 flex items-center justify-center mr-4">
          <i class="fa-solid fa-circle-xmark text-white text-2xl"></i>
        </div>
        <div>
          <div class="text-red-700 text-base font-semibold mb-1 flex items-center gap-2">
            Rejected
            <span class="inline-block w-2 h-2 bg-red-500 rounded-full"></span>
          </div>
          <div class="text-3xl font-extrabold text-red-800">{{ billingStats.rejected }}</div>
        </div>
      </div>

      <!-- Receiving Card -->
      <div
        class="flex items-center bg-white p-5 rounded-xl border border-green-200 shadow-sm hover:shadow-md transition group">
        <div class="flex-shrink-0 bg-green-500  rounded-full w-12 h-12 flex items-center justify-center mr-4">
          <i class="fa-solid fa-circle-check text-white text-2xl"></i>
        </div>
        <div>
          <div class="text-green-700 text-base font-semibold mb-1 flex items-center gap-2">
            Received
            <span class="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
          </div>
          <div class="text-3xl font-extrabold text-green-800">{{ billingStats.got_product }}</div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold text-gray-900">Sale</h3>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div class="lg:col-span-2 bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3">
                  <div class="bg-blue-600 p-2 rounded-lg">
                    <i class="fa-solid fa-chart-line text-white text-lg"></i>
                  </div>
                  <h3 class="text-xl font-semibold text-gray-900">Sales Analytics</h3>
                </div>
                <div class="flex items-center gap-2">
                  <select 
                    v-model="chartPeriod" 
                    @change="handleChartPeriodChange"
                    class="bg-white border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>
              <div style="width:100%;height:300px;">
                <canvas id="lineChart" style="width:100%;height:100%;"></canvas>
              </div>
            </div>
      <div class="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <!-- <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <div class="bg-purple-600 p-2 rounded-lg">
              <i class="fa-solid fa-chart-pie text-white text-lg"></i>
            </div>
            <h3 class="text-xl font-semibold text-gray-900">Traffic Sources</h3>
          </div>
        </div> -->

        <div style="width:100%;height:300px;">

          <!-- Customers Chart -->
          <div class="flex items-center gap-3 mb-4">
            <div class="bg-teal-600 p-2 rounded-lg">
              <i class="fa-solid fa-users text-white text-lg"></i>
            </div>
            <h3 class="text-xl font-semibold text-gray-900">Customer ({{ customerData.length || 0 }})</h3>
          </div>

          <!-- Deliveries Chart -->
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="bg-orange-600 p-2 rounded-lg">
                <i class="fa-solid fa-truck text-white text-lg"></i>
              </div>
              <h3 class="text-xl font-semibold text-gray-900">Delivery ({{ delivery.length || 0 }})</h3>
            </div>
          </div>

          <!-- Suppliers Chart -->
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="bg-indigo-600 p-2 rounded-lg">
                <i class="fa-solid fa-people-carry-box text-white text-lg"></i>
              </div>
              <h3 class="text-xl font-semibold text-gray-900">Supplier ({{ suppliers.length || 0 }})</h3>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import apiURL from '@/api/config';
import axios from 'axios';
import Chart from 'chart.js/auto';
import dayjs from 'dayjs';
import { computed, onMounted, ref } from 'vue';

// Components
import AllProductStat from '@/components/dashboard/AllProductStat.vue';
import InCome from '@/components/dashboard/Income.vue';
import InStockProductStat from '@/components/dashboard/InStockProductStat.vue';
import OrderStats from '@/components/dashboard/OrderStat.vue';
import OutCome from '@/components/dashboard/Outcome.vue';
import OutOfStockProductStat from '@/components/dashboard/OutOfStockProductStat.vue';
// import Profit from '@/components/dashboard/Profit.vue'

// State
const filterPeriod = ref('monthly')
const chartPeriod = ref('monthly')
const chartLabels = ref([])
const chartData = ref([])
let salesChart = null
const suppliers = ref([])
const delivery = ref([])
const customerData = ref([])
const billingStats = ref({
  pending: 0,
  delivering: 0,
  rejected: 0,
  got_product: 0,
})

// Computed start/end based on filterPeriod
const startDate = computed(() => {
  const now = dayjs()
  return filterPeriod.value === 'daily'
    ? now.startOf('day').toISOString()
    : filterPeriod.value === 'monthly'
      ? now.startOf('month').toISOString()
      : now.startOf('year').toISOString()
})

const endDate = computed(() => {
  const now = dayjs()
  return filterPeriod.value === 'daily'
    ? now.endOf('day').toISOString()
    : filterPeriod.value === 'monthly'
      ? now.endOf('month').toISOString()
      : now.endOf('year').toISOString()
})

const handlePeriodChange = () => {
  console.log(`Filter changed to: ${filterPeriod.value}`)
}

const handleChartPeriodChange = () => {
  if (chartPeriod.value === 'monthly') {
    fetchMonthlySales()
  } else {
    fetchYearlySales()
  }
}



// fetch suppliers
const fetchSuppliers = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get(`${apiURL}/api/getAllDocs/Supplier`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })

    if (response.data.success) {
      suppliers.value = response.data.data
    } else {
      console.warn('⚠️ Failed to fetch suppliers:', response.data.message)
    }
  } catch (err) {
    console.error('❌ Error fetching suppliers:', err.message)
  }
}

// fetch delivery
const fetchDelivery = async () => {
  try {
    const token = localStorage.getItem('token')
    const params = {
      dynamicConditions: JSON.stringify([
        { field: 'role', operator: '==', value: 'delivery'}
      ])
    }
    const response = await axios.get(`${apiURL}/api/getAllDocs/User`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: params
    })

    if (response.data.success) {
      delivery.value = response.data.data
    } else {
      console.warn('⚠️ Failed to fetch delivery:', response.data.message)
    }
  } catch (err) {
    console.error('❌ Error fetching delivery:', err.message)
  }
}

// fetch customer 
const fetchCustomerData = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get(`${apiURL}/api/getAllDocs/User`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        dynamicConditions: JSON.stringify([
          { field: 'role', operator: '==', value: 'customer' }
        ])
      }
    })

    if (response.data.success) {
      customerData.value = response.data.data
    } else {
      console.warn('⚠️ Failed to fetch customers:', response.data.message)
    }
  } catch (err) {
    console.error('❌ Error fetching customers:', err.message)
  }
}

// billing stats
const fetchBillingStats = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get(`${apiURL}/api/getAllDocs/Order`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })

    if (response.data.success) {
      const orders = response.data.data
      billingStats.value.pending = orders.filter(order => order.status === 'pending').length
      billingStats.value.rejected = orders.filter(order => order.status === 'rejected').length
      billingStats.value.delivering = orders.filter(order => order.status === 'delivering').length
      billingStats.value.got_product = orders.filter(order => order.status === 'got_product').length
    } else {
      console.warn('⚠️ Failed to fetch billing stats:', response.data.message)
    }
  } catch (err) {
    console.error('❌ Error fetching billing stats:', err.message)
  }
}

const fetchMonthlySales = async () => {
  try {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0, 23, 59, 59, 999);
    const token = localStorage.getItem('token');
    
    // Fetch all orders and filter on frontend
    const response = await axios.get(`${apiURL}/api/getAllDocs/Order`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    
    if (response.data.success) {
      const allOrders = response.data.data;
      
      // Filter orders for current month
      const orders = allOrders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= start && orderDate <= end;
      });
      
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const dailyTotals = Array(daysInMonth).fill(0);
      
      orders.forEach(order => {
        const d = new Date(order.createdAt);
        const day = d.getDate() - 1;
        if (day >= 0 && day < daysInMonth) {
          dailyTotals[day] += order.totalCost || 0;
        }
      });
      
      chartLabels.value = Array.from({ length: daysInMonth }, (_, i) => `Day ${i + 1}`);
      chartData.value = dailyTotals;
      renderChart();
    }
  } catch (err) {
    console.error('Error fetching monthly sales:', err);
  }
};

const fetchYearlySales = async () => {
  try {
    const now = new Date();
    const year = now.getFullYear();
    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31, 23, 59, 59, 999);
    const token = localStorage.getItem('token');
    
    // Fetch all orders and filter on frontend
    const response = await axios.get(`${apiURL}/api/getAllDocs/Order`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    
    if (response.data.success) {
      const allOrders = response.data.data;
      
      // Filter orders for current year
      const orders = allOrders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= start && orderDate <= end;
      });
      
      const monthlyTotals = Array(12).fill(0);
      
      orders.forEach(order => {
        const d = new Date(order.createdAt);
        const month = d.getMonth();
        if (month >= 0 && month < 12) {
          monthlyTotals[month] += order.totalCost || 0;
        }
      });
      
      chartLabels.value = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      chartData.value = monthlyTotals;
      renderChart();
    }
  } catch (err) {
    console.error('Error fetching yearly sales:', err);
  }
};

const renderChart = () => {
  const canvas = document.getElementById('lineChart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  // Destroy existing chart
  if (salesChart) {
    salesChart.destroy();
  }
  
  salesChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: chartLabels.value,
      datasets: [{
        label: `Sales (${chartPeriod.value === 'monthly' ? 'Daily' : 'Monthly'})`,
        data: chartData.value,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top'
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: function(context) {
              return `Sales: ${context.parsed.y.toLocaleString()} ៛`;
            }
          }
        }
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: chartPeriod.value === 'monthly' ? 'Days' : 'Months'
          }
        },
        y: {
          display: true,
          title: {
            display: true,
            text: 'Sales Amount (៛)'
          },
          ticks: {
            callback: function(value) {
              return value.toLocaleString() + ' ៛';
            }
          }
        }
      },
      interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false
      }
    }
  });
};



onMounted(() => {
  fetchSuppliers();
  fetchDelivery();
  fetchCustomerData();
  fetchBillingStats();
  fetchMonthlySales(); // Initialize chart with monthly data
});
</script>
