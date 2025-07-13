<template>
  <div class="p-6 max-w-screen-xl mx-auto bg-white min-h-screen overflow-y-auto">
    <!-- Dashboard Header -->
    <div class="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-800 mb-1">Dashboard</h1>
      </div>
      <!-- <button class="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-2 rounded-lg shadow font-semibold transition">Last Month Summary</button> -->
    </div>

    <!-- Top Metrics Row -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <div class="bg-white rounded-2xl shadow-xl p-6 flex flex-col gap-3 border border-gray-100">
        <div class="flex items-center gap-3 mb-2">
          <span class="bg-pink-100 p-3 rounded-xl flex items-center justify-center"><i class="fa-solid fa-wallet text-pink-500 text-2xl"></i></span>
          <span class="text-gray-500 text-sm font-semibold">Income</span>
        </div>
        <div class="text-4xl font-extrabold text-gray-900 tracking-tight">$300</div>
        <div class="text-xs text-gray-400 font-medium">Current Month</div>
      </div>
      <div class="bg-white rounded-2xl shadow-xl p-6 flex flex-col gap-3 border border-gray-100">
        <div class="flex items-center gap-3 mb-2">
          <span class="bg-purple-100 p-3 rounded-xl flex items-center justify-center"><i class="fa-solid fa-piggy-bank text-purple-500 text-2xl"></i></span>
          <span class="text-gray-500 text-sm font-semibold">OutCome</span>
        </div>
        <div class="text-4xl font-extrabold text-gray-900 tracking-tight">$200</div>
      </div>
      <div class="bg-white rounded-2xl shadow-xl p-6 flex flex-col gap-3 border border-gray-100">
        <div class="flex items-center gap-3 mb-2">
          <span class="bg-blue-100 p-3 rounded-xl flex items-center justify-center"><i class="fa-solid fa-gift text-blue-500 text-2xl"></i></span>
          <span class="text-gray-500 text-sm font-semibold">Saving</span>
        </div>
        <div class="text-4xl font-extrabold text-gray-900 tracking-tight">$100</div>
      </div>
      <div class="bg-white rounded-2xl shadow-xl p-6 flex flex-col gap-3 border border-gray-100">
        <div class="flex items-center gap-3 mb-2">
          <span class="bg-yellow-100 p-3 rounded-xl flex items-center justify-center"><i class="fa-solid fa-chart-line text-yellow-500 text-2xl"></i></span>
          <span class="text-gray-500 text-sm font-semibold">Current Order</span>
        </div>
        <div class="text-4xl font-extrabold text-gray-900 tracking-tight">100</div>
      </div>
    </div>

    <!-- Graphs Row -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <!-- Line Chart -->
      <div class="relative col-span-2 flex flex-col gap-4 p-0">
        <div class="absolute inset-0 z-0 rounded-3xl  border-1 bg-white"></div>
        <div class="relative z-10 flex items-center justify-between px-10 pt-8 pb-2">
          <div class="flex items-center gap-4">
            <span class="bg-gradient-to-tr  p-4 rounded-3xl shadow-2xl flex items-center justify-center border-2">
              <i class="fa-solid fa-chart-line text-yellow-500 text-3xl drop-shadow"></i>
            </span>
            <span class="font-extrabold text-3xl text-gray-800 tracking-tight drop-shadow-sm">Sales Analytics</span>
          </div>
        
        </div>
        <div class="relative z-10 px-10 pb-8" style="width:100%;height:240px;">
          <div class="absolute inset-0 rounded-2xl  pointer-events-none"></div>
          <canvas id="lineChart" style="width:100%;height:100%;position:relative;z-index:1;"></canvas>
        </div>
      </div>
     

    <!-- Out of Stock & Best Seller Row -->
    <div class="flex flex-col md:flex-row gap-6 justify-between mb-8">
      <!-- Custom Calendar Card -->
      <div class="flex-1 bg-white rounded-2xl shadow-xl p-6 border border-gray-100 min-w-[260px] flex flex-col items-center justify-center">
        <div class="w-full max-w-xs">
          <div class="flex items-center justify-between mb-2">
            <button @click="prevMonth" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition"><i class="fa-solid fa-chevron-left"></i></button>
            <div class="font-bold text-lg text-gray-800">{{ monthYearLabel }}</div>
            <button @click="nextMonth" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition"><i class="fa-solid fa-chevron-right"></i></button>
          </div>
          <div class="grid grid-cols-7 text-xs text-gray-400 mb-1">
            <div v-for="d in weekDays" :key="d" class="text-center py-1">{{ d }}</div>
          </div>
          <div class="grid grid-cols-7 gap-1">
            <div v-for="(date, idx) in calendarDays" :key="idx"
              class="h-8 flex items-center justify-center rounded-full cursor-pointer transition"
              :class="[
                date.isCurrentMonth ? 'text-gray-800' : 'text-gray-300',
                date.isToday ? 'bg-yellow-100 text-yellow-600 font-bold' : '',
                date.isSelected ? 'bg-yellow-400 text-white font-bold shadow' : 'hover:bg-gray-100'
              ]"
              @click="selectDate(date)"
            >
              {{ date.day }}
            </div>
          </div>
        </div>
      </div>

      
    </div>
    </div>

  </div>
</template>


<script>
// NOTE: You need to install Chart.js and chart.js-adapter-date-fns for this to work:
// npm install chart.js chart.js-adapter-date-fns

import apiURL from '@/api/config';
import axios from 'axios';
import Chart from 'chart.js/auto';
import { computed, onMounted, ref } from 'vue';

export default {
  name: 'AdminDashboard',
  setup() {
    const latestOrder = ref(null);
    // --- Custom Calendar State ---
    const today = new Date();
    const selectedDate = ref(new Date());
    const calendarMonth = ref(today.getMonth());
    const calendarYear = ref(today.getFullYear());

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const monthYearLabel = computed(() => {
      const d = new Date(calendarYear.value, calendarMonth.value, 1);
      return d.toLocaleString('default', { month: 'long', year: 'numeric' });
    });

    function daysInMonth(year, month) {
      return new Date(year, month + 1, 0).getDate();
    }

    const calendarDays = computed(() => {
      const days = [];
      const firstDay = new Date(calendarYear.value, calendarMonth.value, 1);
      const startDay = firstDay.getDay();
      const numDays = daysInMonth(calendarYear.value, calendarMonth.value);
      // Previous month's trailing days
      const prevMonth = calendarMonth.value === 0 ? 11 : calendarMonth.value - 1;
      const prevYear = calendarMonth.value === 0 ? calendarYear.value - 1 : calendarYear.value;
      const prevMonthDays = daysInMonth(prevYear, prevMonth);
      for (let i = startDay - 1; i >= 0; i--) {
        days.push({
          day: prevMonthDays - i,
          isCurrentMonth: false,
          date: new Date(prevYear, prevMonth, prevMonthDays - i),
          isToday: false,
          isSelected: false,
        });
      }
      // Current month days
      for (let i = 1; i <= numDays; i++) {
        const d = new Date(calendarYear.value, calendarMonth.value, i);
        days.push({
          day: i,
          isCurrentMonth: true,
          date: d,
          isToday:
            d.getFullYear() === today.getFullYear() &&
            d.getMonth() === today.getMonth() &&
            d.getDate() === today.getDate(),
          isSelected:
            d.getFullYear() === selectedDate.value.getFullYear() &&
            d.getMonth() === selectedDate.value.getMonth() &&
            d.getDate() === selectedDate.value.getDate(),
        });
      }
      // Next month's leading days
      const total = days.length;
      for (let i = 1; total + i <= 42; i++) {
        days.push({
          day: i,
          isCurrentMonth: false,
          date: new Date(calendarYear.value, calendarMonth.value + 1, i),
          isToday: false,
          isSelected: false,
        });
      }
      return days;
    });

    function prevMonth() {
      if (calendarMonth.value === 0) {
        calendarMonth.value = 11;
        calendarYear.value--;
      } else {
        calendarMonth.value--;
      }
    }
    function nextMonth() {
      if (calendarMonth.value === 11) {
        calendarMonth.value = 0;
        calendarYear.value++;
      } else {
        calendarMonth.value++;
      }
    }
    function selectDate(dateObj) {
      if (!dateObj.isCurrentMonth) return;
      selectedDate.value = new Date(dateObj.date);
    }

    const fetchLatestOrder = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${apiURL}/api/order/list`, {
          params: {
            sort: JSON.stringify({ createdAt: -1 }),
            limit: 1
          },
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.data.success && response.data.data.length > 0) {
          latestOrder.value = response.data.data[0];
        }
      } catch (error) {
        console.error('Error fetching latest order:', error);
      }
    };


    // --- Chart Data State ---
    const chartLabels = ref([]);
    const chartData = ref([]);

    // --- Fetch Orders for Current Month and Prepare Chart Data ---
    const fetchMonthlySales = async () => {
      try {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        // Start: 1st day of month, End: last day of month
        const start = new Date(year, month, 1);
        const end = new Date(year, month + 1, 0, 23, 59, 59, 999);

        const token = localStorage.getItem('token');
        const response = await axios.get(`${apiURL}/api/order/list`, {
          params: {
            dynamicConditions: JSON.stringify([
              { field: 'createdAt', operator: '&gte', value: start, type: 'Date' },
              { field: 'createdAt', operator: '&lte', value: end, type: 'Date' }
            ])
          },
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.data.success) {
          // Group by day
          const orders = response.data.data;
          const daysInMonth = new Date(year, month + 1, 0).getDate();
          const dailyTotals = Array(daysInMonth).fill(0);
          orders.forEach(order => {
            const d = new Date(order.createdAt);
            const day = d.getDate() - 1; // 0-based index
            dailyTotals[day] += order.totalCost || 0;
          });
          chartLabels.value = Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString());
          chartData.value = dailyTotals;
        }
      } catch (err) {
        console.error('Error fetching monthly sales:', err);
      }
    };

    onMounted(() => {
      fetchLatestOrder();
      fetchMonthlySales().then(() => {
        const canvas = document.getElementById('lineChart');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        // Responsive gradient
        const rect = canvas.getBoundingClientRect();
        const gradient = ctx.createLinearGradient(0, 0, 0, rect.height || 220);
        gradient.addColorStop(0, 'rgba(251,191,36,0.25)');
        gradient.addColorStop(1, 'rgba(251,191,36,0.02)');

        // Set y-axis max to 20% above the highest value in the last 7 days (or all days if less than 7)
        const allValues = chartData.value.filter(v => typeof v === 'number' && v > 0);
        let maxY = 100;
        let recentValues = allValues;
        if (allValues.length > 7) {
          recentValues = allValues.slice(-7);
        }
        if (recentValues.length > 0) {
          const highest = Math.max(...recentValues);
          maxY = highest * 1.2;
        }
        if (maxY < 100) maxY = 100;

        // Outlier marker plugin
        const outlierPlugin = {
          id: 'outlierMarker',
          afterDatasetsDraw(chart) {
            const { ctx, data } = chart;
            const dataset = chart.getDatasetMeta(0);
            if (!dataset || !dataset.data) return;
            // Mark outliers (above maxY)
            data.datasets[0].data.forEach((v, i) => {
              if (v > maxY && dataset.data[i]) {
                const pt = dataset.data[i];
                ctx.save();
                ctx.beginPath();
                ctx.arc(pt.x, pt.y, 8, 0, 2 * Math.PI);
                ctx.fillStyle = '#ef4444';
                ctx.shadowColor = '#ef4444';
                ctx.shadowBlur = 8;
                ctx.fill();
                ctx.shadowBlur = 0;
                ctx.font = 'bold 12px sans-serif';
                ctx.fillStyle = '#fff';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('!', pt.x, pt.y);
                ctx.restore();
              }
            });
          }
        };

        new Chart(ctx, {
          type: 'line',
          data: {
            labels: chartLabels.value,
            datasets: [
              {
                label: 'Sales',
                data: chartData.value,
                borderColor: '#fbbf24',
                backgroundColor: gradient,
                tension: 0.4,
                fill: true,
                pointRadius: 5,
                pointBackgroundColor: '#fbbf24',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                borderWidth: 3,
                pointHoverRadius: 7,
                shadowOffsetX: 0,
                shadowOffsetY: 4,
                shadowBlur: 10,
                shadowColor: 'rgba(251,191,36,0.25)',
              }
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    let value = context.parsed.y || 0;
                    return value.toLocaleString();
                  }
                },
                backgroundColor: '#fbbf24',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: '#fff',
                borderWidth: 1,
                padding: 12
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                max: maxY,
                grid: { color: '#f3f4f6' },
                ticks: {
                  color: '#b45309',
                  callback: function(value) { return value; }
                }
              },
              x: {
                grid: { color: '#f3f4f6' },
                ticks: { color: '#b45309' }
              },
            },
            elements: {
              line: {
                borderJoinStyle: 'round',
                borderCapStyle: 'round',
              },
              point: {
                radius: 5,
                hoverRadius: 7,
                borderWidth: 2,
                backgroundColor: '#fbbf24',
                borderColor: '#fff',
              }
            },
          },
          plugins: [outlierPlugin],
        });
      });
    });

    // Orders table data
    const orders = ref([
      { invoice: '12326', customer: 'Charby Dues', from: 'Brazil', price: 219, status: 'Process', statusClass: 'bg-pink-100 text-pink-600 px-2 py-1 rounded' },
      { invoice: '12336', customer: 'Marko', from: 'Italy', price: 2462, status: 'Open', statusClass: 'bg-green-100 text-green-600 px-2 py-1 rounded' },
      { invoice: '12346', customer: 'Deniyel Onak', from: 'Russia', price: 981, status: 'On Hold', statusClass: 'bg-blue-100 text-blue-600 px-2 py-1 rounded' },
      { invoice: '12356', customer: 'Beligit Bastana', from: 'Korea', price: 369, status: 'Process', statusClass: 'bg-pink-100 text-pink-600 px-2 py-1 rounded' },
      { invoice: '12366', customer: 'Gensti Onuska', from: 'Japan', price: 1240, status: 'Open', statusClass: 'bg-green-100 text-green-600 px-2 py-1 rounded' },
    ]);

    // Doughnut Chart (remains static for now)
    onMounted(() => {
      const doughnutCanvas = document.getElementById('doughnutChart');
      if (doughnutCanvas) {
        const dtx = doughnutCanvas.getContext('2d');
        new Chart(dtx, {
          type: 'doughnut',
          data: {
            labels: ['Facebook', 'Youtube', 'Direct'],
            datasets: [
              {
                data: [33, 55, 12],
                backgroundColor: ['#a78bfa', '#f472b6', '#fde68a'],
                borderWidth: 0,
              },
            ],
          },
          options: {
            cutout: '75%',
            plugins: {
              legend: { display: false },
            },
          },
        });
      }
    });

    // --- Product Stock Reminder Logic ---
    const lowStockProducts = ref([]);
    const outOfStockProducts = ref([]);
    // Placeholder best sellers (replace with real logic if needed)
    const bestSellers = ref([
      { _id: '1', name: 'Rice 1', sold: 120, imageURL: '' },
      { _id: '2', name: 'Sugar', sold: 90, imageURL: '' },
      { _id: '3', name: 'Salt', sold: 80, imageURL: '' },
    ]);

    const fetchLowStockProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        // Fetch all products (or use pagination if needed)
        const response = await axios.get(`${apiURL}/api/public/products`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.data.success) {
          // Consider low stock if <= 10, out of stock if 0
          lowStockProducts.value = response.data.data.filter(p => p.totalStock <= 10);
          outOfStockProducts.value = response.data.data.filter(p => p.totalStock === 0);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };

    onMounted(() => {
      fetchLowStockProducts();
    });

    return {
      latestOrder,
      orders,
      lowStockProducts,
      outOfStockProducts,
      bestSellers,
      // Calendar
      selectedDate,
      calendarMonth,
      calendarYear,
      weekDays,
      monthYearLabel,
      calendarDays,
      prevMonth,
      nextMonth,
      selectDate,
    };
  },
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
.shadow-xl {
  box-shadow: 0 10px 32px 0 rgba(60,72,100,.12);
}
.shadow-card {
  box-shadow: 0 4px 24px 0 rgba(60,72,100,.07);
}
.rounded-2xl {
  border-radius: 1.25rem;
}
.rounded-3xl {
  border-radius: 1.5rem;
}
.bg-gradient-to-tr {
  background-image: linear-gradient(45deg, var(--tw-gradient-stops));
}
.shadow-2xl {
  box-shadow: 0 12px 48px 0 rgba(251,191,36,0.10), 0 2px 8px 0 rgba(244,114,182,0.08);
}
</style>