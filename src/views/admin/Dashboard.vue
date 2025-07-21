<template>
  <div class="p-6 max-w-screen-xl mx-auto bg-gray-100 min-h-screen overflow-y-auto font-sans">
    <!-- Dashboard Header -->
    <div class="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Business Dashboard</h1>
      </div>
      <div class="flex items-center gap-4 mt-4 md:mt-0">
        <select v-model="filterPeriod" @change="fetchFilteredFinancials"
          class="bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          <option value="daily">Daily</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
        <!-- <button
          class="bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 transition flex items-center text-sm">
          <i class="fa-solid fa-download mr-2"></i>Export Report
        </button> -->
      </div>
    </div>

    <!-- Top Metrics Row -->
     
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Income Card -->
      <div
        class="bg-white rounded-xl shadow-md p-0 pt-5 pb-3 hover:shadow-lg transition-all duration-300 border border-gray-200 flex flex-col justify-between min-h-[120px] relative"
        style="overflow:visible;">
        <div class="flex items-center justify-between px-5">

          <div class="flex flex-col items-center">
            <div class="bg-green-500 rounded-lg w-12 h-12 flex items-center justify-center">
              <i class="fa-solid fa-wallet text-white text-2xl"></i>
            </div>
            <span class="mt-2 text-xs bg-gray-100 text-gray-700 rounded-full px-3 py-1">Monthly</span>
          </div>


          <div class="flex flex-col justify-center">
            <div class="text-sm text-gray-600 mb-1">Income</div>
            <div class="text-3xl font-bold text-gray-900">$12,500</div>

          </div>

        </div>

      </div>

      <!-- Outcome Card -->
      <div
        class="bg-white rounded-xl shadow-md p-0 pt-5 pb-3 hover:shadow-lg transition-all duration-300 border border-gray-200 flex flex-col justify-between min-h-[120px] relative"
        style="overflow:visible;">
        <div class="flex items-center justify-between px-5">



          <div class="flex flex-col items-center">
            <div class="bg-red-500 rounded-lg w-12 h-12 flex items-center justify-center">
              <i class="fa-solid fa-arrow-up-right-from-square text-white text-2xl"></i>
            </div>
            <span class="mt-2 text-xs bg-gray-100 text-red-600 rounded-full px-3 py-1">Monthly</span>
          </div>

          <div class="flex flex-col justify-center items-end">
            <div class="text-sm text-gray-600 mb-1">Outcome</div>
            <div class="text-3xl font-bold text-gray-900">$7,800</div>
          </div>
        </div>
      </div>

      <!-- Profits Card -->
      <div
        class="bg-white rounded-xl shadow-md p-0 pt-5 pb-3 hover:shadow-lg transition-all duration-300 border border-gray-200 flex flex-col justify-between min-h-[120px] relative"
        style="overflow:visible;">
        <div class="flex items-center justify-between px-5">

          <div class="flex flex-col items-center">
            <div class="bg-blue-600 rounded-lg w-12 h-12 flex items-center justify-center">
              <i class="fa-solid fa-coins text-white text-2xl"></i>
            </div>
            <span class="mt-2 text-xs bg-gray-100 text-blue-600 rounded-full px-3 py-1">Monthly</span>
          </div>

          <div class="flex flex-col justify-center items-end">
            <div class="text-sm text-gray-600 mb-1">Profits</div>
            <div class="text-3xl font-bold text-gray-900">$4,700</div>
          </div>
        </div>
      </div>

      <!-- Orders Card -->
      <div
        class="bg-white rounded-xl shadow-md p-0 pt-5 pb-3 hover:shadow-lg transition-all duration-300 border border-gray-200 flex flex-col justify-between min-h-[120px] relative"
        style="overflow:visible;">
        <div class="flex items-center justify-between px-5">
          <div class="flex flex-col items-center">
            <div class="bg-purple-600 rounded-lg w-12 h-12 flex items-center justify-center">
              <i class="fa-solid fa-shopping-cart text-white text-2xl"></i>
            </div>
            <span class="mt-2 text-xs bg-gray-100 text-purple-600 rounded-full px-3 py-1">Total</span>
          </div>
          <div class="flex flex-col justify-center items-end">
            <div class="text-sm text-gray-600 mb-1">Orders</div>
            <div class="text-3xl font-bold text-gray-900">320</div>
          </div>
        </div>
      </div>

      <!-- All Product Card  -->
      <div class="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-all duration-300 border border-gray-200">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="bg-teal-600 p-2 rounded-lg">
              <i class="fa-solid fa-boxes-stacked text-white text-lg"></i>
            </div>
            <div>
              <div class="text-sm text-gray-600">All Product</div>
              <div class="text-2xl font-bold text-gray-900">150</div>
            </div>
          </div>
          <div class="text-sm text-green-600">Total</div>
        </div>
      </div>

      <!-- Promotion Product  -->
      <div class="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-all duration-300 border border-gray-200">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="bg-yellow-600 p-2 rounded-lg">
              <i class="fa-solid fa-tags text-white text-lg"></i>
            </div>
            <div>
              <div class="text-sm text-gray-600">Product Promotion </div>
              <div class="text-2xl font-bold text-gray-900">12</div>
            </div>
          </div>
          <div class="text-sm text-yellow-600">Total</div>
        </div>
      </div>

      <!-- In stock -->
      <div class="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-all duration-300 border border-gray-200">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="bg-green-600 p-2 rounded-lg">
              <i class="fa-solid fa-box-open text-white text-lg"></i>
            </div>
            <div>
              <div class="text-sm text-gray-600">In Stock</div>
              <div class="text-2xl font-bold text-gray-900">120</div>
            </div>
          </div>
          <div class="text-sm text-green-600">Total</div>
        </div>
      </div>

      <!-- Out of Stock  -->
      <div class="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-all duration-300 border border-gray-200">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="bg-red-600 p-2 rounded-lg">
              <i class="fa-solid fa-boxes-packing text-white text-lg"></i>
            </div>
            <div>
              <div class="text-sm text-gray-600">Out of Stock</div>
              <div class="text-2xl font-bold text-gray-900">30</div>
            </div>
          </div>
          <div class="text-sm text-red-600">Total</div>
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
            <h3 class="text-xl font-semibold text-gray-900">Customer (20)</h3>
          </div>

          <!-- Deliveries Chart -->
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="bg-orange-600 p-2 rounded-lg">
                <i class="fa-solid fa-truck text-white text-lg"></i>
              </div>
              <h3 class="text-xl font-semibold text-gray-900">Delivery (3)</h3>
            </div>
          </div>

          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="bg-indigo-600 p-2 rounded-lg">
                <i class="fa-solid fa-people-carry-box text-white text-lg"></i>
              </div>
              <h3 class="text-xl font-semibold text-gray-900">Supplier (4)</h3>
            </div>
          </div>

        </div>
      </div>
    </div>


     <!-- Billing Stats -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-900">Billing Stats</h3>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        <!-- Pending Card -->
        <div class="flex items-center bg-white p-5 rounded-xl border border-yellow-200 shadow-sm hover:shadow-md transition group">
          <div class="flex-shrink-0 bg-yellow-400  rounded-full w-12 h-12 flex items-center justify-center mr-4">
            <i class="fa-solid fa-hourglass-half text-white text-2xl"></i>
          </div>
          <div>
            <div class="text-yellow-700 text-base font-semibold mb-1 flex items-center gap-2">
              Pending
              <span class="inline-block w-2 h-2 bg-yellow-400 rounded-full"></span>
            </div>
            <div class="text-3xl font-extrabold text-yellow-800">10</div>
          </div>
        </div>
        <!-- Confirmed Card -->
        <div class="flex items-center bg-white p-5 rounded-xl border border-green-200 shadow-sm hover:shadow-md transition group">
          <div class="flex-shrink-0 bg-green-500  rounded-full w-12 h-12 flex items-center justify-center mr-4">
            <i class="fa-solid fa-circle-check text-white text-2xl"></i>
          </div>
          <div>
            <div class="text-green-700 text-base font-semibold mb-1 flex items-center gap-2">
              Confirmed
              <span class="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
            </div>
            <div class="text-3xl font-extrabold text-green-800">50</div>
          </div>
        </div>
        <!-- Rejected Card -->
        <div class="flex items-center bg-white p-5 rounded-xl border border-red-200 shadow-sm hover:shadow-md transition group">
          <div class="flex-shrink-0 bg-red-500 rounded-full w-12 h-12 flex items-center justify-center mr-4">
            <i class="fa-solid fa-circle-xmark text-white text-2xl"></i>
          </div>
          <div>
            <div class="text-red-700 text-base font-semibold mb-1 flex items-center gap-2">
              Rejected
              <span class="inline-block w-2 h-2 bg-red-500 rounded-full"></span>
            </div>
            <div class="text-3xl font-extrabold text-red-800">{{ getBillingCount('rejected') }}</div>
          </div>
        </div>
      </div>





  </div>
</template>

<script>
import apiURL from '@/api/config';
import axios from 'axios';
import Chart from 'chart.js/auto';
import { computed, onMounted, ref } from 'vue';

export default {
  name: 'EnhancedAdminDashboard',
  setup() {
    const latestOrder = ref(null);
    const filterPeriod = ref('monthly');
    const financials = ref({ income: '$0', outcome: '$0', profits: '$0' });
    const allProducts = ref([]);
    const highStockProducts = ref([]);
    const customers = ref([]);
    const deliveries = ref([]);
    const promotionProducts = ref([]);
    const bills = ref([]);
    const deliveryStatuses = ref([]);
    const lowStockProducts = ref([]);
    const outOfStockProducts = ref([]);
    const orders = ref([]);
    const inventoryView = ref('low');
    const productSearch = ref('');
    const billingSearch = ref('');
    const currentPage = ref(1);
    const billingPage = ref(1);
    const itemsPerPage = 10;

    // Calendar state
    const today = new Date();
    const selectedDate = ref(new Date());
    const calendarMonth = ref(today.getMonth());
    const calendarYear = ref(today.getFullYear());
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const monthYearLabel = computed(() => {
      const d = new Date(calendarYear.value, calendarMonth.value, 1);
      return d.toLocaleString('default', { month: 'long', year: 'numeric' });
    });

    const calendarDays = computed(() => {
      const days = [];
      const firstDay = new Date(calendarYear.value, calendarMonth.value, 1);
      const startDay = firstDay.getDay();
      const numDays = daysInMonth(calendarYear.value, calendarMonth.value);
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
          hasEvent: false,
        });
      }

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
          hasEvent: checkEvent(d), // Mock function for events
        });
      }

      const total = days.length;
      for (let i = 1; total + i <= 42; i++) {
        days.push({
          day: i,
          isCurrentMonth: false,
          date: new Date(calendarYear.value, calendarMonth.value + 1, i),
          isToday: false,
          isSelected: false,
          hasEvent: false,
        });
      }
      return days;
    });

    // ...existing code...

    // API Functions
    const fetchLatestOrder = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${apiURL}/api/order/list`, {
          params: {
            sort: JSON.stringify({ createdAt: -1 }),
            limit: 1,
          },
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (response.data.success && response.data.data.length > 0) {
          latestOrder.value = response.data.data[0];
        }
      } catch (error) {
        console.error('Error fetching latest order:', error);
      }
    };

    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${apiURL}/api/order/list`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (response.data.success) {
          orders.value = response.data.data.map(order => ({
            invoice: order.invoice,
            customer: order.customerName,
            from: order.country,
            price: order.totalCost,
            status: order.status,
            statusClass: getStatusClass(order.status),
          }));
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        orders.value = [];
      }
    };

    const fetchFilteredFinancials = async () => {
      try {
        const now = new Date();
        let start, end;
        if (filterPeriod.value === 'daily') {
          start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
        } else if (filterPeriod.value === 'monthly') {
          start = new Date(now.getFullYear(), now.getMonth(), 1);
          end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        } else {
          start = new Date(now.getFullYear(), 0, 1);
          end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
        }
        const token = localStorage.getItem('token');
        const response = await axios.get(`${apiURL}/api/order/list`, {
          params: {
            dynamicConditions: JSON.stringify([
              { field: 'createdAt', operator: '>=', value: start, type: 'Date' },
              { field: 'createdAt', operator: '<=', value: end, type: 'Date' },
            ]),
          },
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (response.data.success) {
          const ordersData = response.data.data;
          const income = ordersData.reduce((sum, order) => sum + (order.totalCost || 0), 0);
          const outcome = ordersData.reduce((sum, order) => sum + (order.totalCost * 0.6 || 0), 0);
          const profits = income - outcome;
          financials.value = {
            income: `$${income.toLocaleString()}`,
            outcome: `$${outcome.toLocaleString()}`,
            profits: `$${profits.toLocaleString()}`,
          };
        }
      } catch (err) {
        console.error('Error fetching financials:', err);
        financials.value = { income: '$0', outcome: '$0', profits: '$0' };
      }
    };

    const fetchMonthlySales = async () => {
      try {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const start = new Date(year, month, 1);
        const end = new Date(year, month + 1, 0, 23, 59, 59, 999);
        const token = localStorage.getItem('token');
        const response = await axios.get(`${apiURL}/api/order/list`, {
          params: {
            dynamicConditions: JSON.stringify([
              { field: 'createdAt', operator: '>=', value: start, type: 'Date' },
              { field: 'createdAt', operator: '<=', value: end, type: 'Date' },
            ]),
          },
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (response.data.success) {
          const orders = response.data.data;
          const daysInMonth = new Date(year, month + 1, 0).getDate();
          const dailyTotals = Array(daysInMonth).fill(0);
          orders.forEach(order => {
            const d = new Date(order.createdAt);
            const day = d.getDate() - 1;
            dailyTotals[day] += order.totalCost || 0;
          });
          chartLabels.value = Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString());
          chartData.value = dailyTotals;
        }
      } catch (err) {
        console.error('Error fetching monthly sales:', err);
      }
    };

    const fetchLowStockProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${apiURL}/api/public/products`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (response.data.success) {
          lowStockProducts.value = response.data.data.filter(p => p.totalStock <= 10 && p.totalStock > 0);
          outOfStockProducts.value = response.data.data.filter(p => p.totalStock === 0);
          highStockProducts.value = response.data.data.filter(p => p.totalStock > 100);
          allProducts.value = response.data.data;
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        lowStockProducts.value = [];
        outOfStockProducts.value = [];
        highStockProducts.value = [];
        allProducts.value = [];
      }
    };

    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${apiURL}/api/customer/list`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (response.data.success) {
          customers.value = response.data.data.map(c => ({
            _id: c._id,
            name: c.name,
            email: c.email,
          }));
        }
      } catch (err) {
        console.error('Error fetching customers:', err);
        customers.value = [];
      }
    };

    const fetchDeliveries = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${apiURL}/api/delivery/list`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (response.data.success) {
          deliveries.value = response.data.data.map(d => ({
            _id: d._id,
            orderId: d.orderId,
            status: d.status,
            statusClass: getStatusClass(d.status),
          }));
          deliveryStatuses.value = response.data.data.map(d => ({
            _id: d._id,
            orderId: d.orderId,
            status: d.status,
            assignedTo: d.assignedTo,
            statusClass: getStatusClass(d.status),
          }));
        }
      } catch (err) {
        console.error('Error fetching deliveries:', err);
        deliveries.value = [];
        deliveryStatuses.value = [];
      }
    };

    const fetchPromotionProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${apiURL}/api/public/products`, {
          params: { isPromoted: true },
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (response.data.success) {
          promotionProducts.value = response.data.data.map(p => ({
            _id: p._id,
            name: p.name,
            discount: p.discount || 0,
            imageURL: p.imageURL || '',
          }));
        }
      } catch (err) {
        console.error('Error fetching promotion products:', err);
        promotionProducts.value = [];
      }
    };

    const fetchBills = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${apiURL}/api/billing/list`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (response.data.success) {
          bills.value = response.data.data.map(b => ({
            invoice: b.invoice,
            customer: b.customerName,
            price: b.totalPrice,
            product: b.productName,
            status: b.status,
            statusClass: getStatusClass(b.status),
          }));
        }
      } catch (err) {
        console.error('Error fetching bills:', err);
        bills.value = [];
      }
    };

    // Utility Functions
    const getStatusClass = status => {
      switch (status?.toLowerCase()) {
        case 'paying':
        case 'process':
        case 'on the way':
          return 'bg-yellow-100 text-yellow-700';
        case 'paid':
        case 'confirmed':
        case 'given product':
          return 'bg-green-100 text-green-700';
        case 'rejected':
          return 'bg-red-100 text-red-700';
        case 'pending':
        case 'assigned':
          return 'bg-blue-100 text-blue-700';
        case 'on hold':
          return 'bg-gray-100 text-gray-700';
        default:
          return 'bg-gray-100 text-gray-700';
      }
    };

    const getStockStatusClass = stock => {
      if (stock === 0) return 'text-red-600';
      if (stock <= 10) return 'text-yellow-600';
      if (stock > 100) return 'text-blue-600';
      return 'text-green-600';
    };

    const getProductStatusClass = stock => {
      if (stock === 0) return 'bg-red-100 text-red-700';
      if (stock <= 10) return 'bg-yellow-100 text-yellow-700';
      if (stock > 100) return 'bg-blue-100 text-blue-700';
      return 'bg-green-100 text-green-700';
    };

    const getProductStatus = stock => {
      if (stock === 0) return 'Out of Stock';
      if (stock <= 10) return 'Low Stock';
      if (stock > 100) return 'High Stock';
      return 'In Stock';
    };

    const getBillingCount = status => {
      return bills.value.filter(bill => bill.status?.toLowerCase() === status.toLowerCase()).length;
    };

    const getDeliveryCount = status => {
      return deliveryStatuses.value.filter(delivery => delivery.status?.toLowerCase() === status.toLowerCase()).length;
    };

    const filteredProducts = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return allProducts.value
        .filter(p => p.name?.toLowerCase().includes(productSearch.value.toLowerCase()))
        .slice(start, end);
    });

    const filteredBills = computed(() => {
      const start = (billingPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return bills.value
        .filter(b => b.invoice?.toLowerCase().includes(billingSearch.value.toLowerCase()) || b.customer?.toLowerCase().includes(billingSearch.value.toLowerCase()))
        .slice(start, end);
    });

    // Chart Data
    const chartLabels = ref([]);
    const chartData = ref([]);

    onMounted(() => {
      // Set static data for a bar chart to match the provided image
      const staticLabels = [
        '', '', '', '', '', '', '', '', '', '', '', '', ''
      ];
      const staticData = [2, 3, 3, 4, 5, 6, 8, 7, 5, 3, 2, 2, 2];
      const canvas = document.getElementById('lineChart');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: staticLabels,
          datasets: [{
            label: 'Sales',
            data: staticData,
            backgroundColor: '#7c3aed',
            borderRadius: 4,
            barPercentage: 0.7,
            categoryPercentage: 0.7,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#1f2937',
              titleColor: '#fff',
              bodyColor: '#fff',
              borderColor: '#374151',
              borderWidth: 1,
              cornerRadius: 8,
              padding: 12,
              callbacks: {
                label: context => `${context.parsed.y}`,
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: '#e5e7eb' },
              ticks: {
                color: '#6b7280',
                stepSize: 1,
                precision: 0,
              },
            },
            x: {
              grid: { color: '#e5e7eb' },
              ticks: { color: '#6b7280' },
            },
          },
        },
      });

      const doughnutCanvas = document.getElementById('doughnutChart');
      if (doughnutCanvas) {
        const dtx = doughnutCanvas.getContext('2d');
        new Chart(dtx, {
          type: 'doughnut',
          data: {
            labels: ['Facebook', 'YouTube', 'Direct'],
            datasets: [{
              data: [33, 55, 12],
              backgroundColor: ['#a78bfa', '#f472b6', '#facc15'],
              borderWidth: 0,
            }],
          },
          options: {
            cutout: '70%',
            plugins: {
              legend: { display: false },
            },
          },
        });
      }
    });

    return {
      latestOrder,
      filterPeriod,
      financials,
      orders,
      lowStockProducts,
      outOfStockProducts,
      highStockProducts,
      allProducts,
      customers,
      deliveries,
      promotionProducts,
      bills,
      deliveryStatuses,
      inventoryView,
      productSearch,
      billingSearch,
      currentPage,
      billingPage,
      itemsPerPage,
      filteredProducts,
      filteredBills,
      fetchFilteredFinancials,
      getStatusClass,
      getStockStatusClass,
      getProductStatusClass,
      getProductStatus,
      getBillingCount,
      getDeliveryCount,
    };
  },
};
</script>

<style scoped>
body {
  font-family: 'Inter', sans-serif;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 9999px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f3f4f6;
}

.shadow-md {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.transition-all {
  transition: all 0.3s ease;
}

.rounded-xl {
  border-radius: 0.75rem;
}

.rounded-lg {
  border-radius: 0.5rem;
}

.rounded-full {
  border-radius: 9999px;
}

.bg-gray-50 {
  background-color: #f9fafb;
}

.text-gray-900 {
  color: #111827;
}

.text-gray-600 {
  color: #4b5563;
}

.bg-blue-600 {
  background-color: #2563eb;
}

.bg-blue-700 {
  background-color: #1d4ed8;
}

.bg-green-600 {
  background-color: #16a34a;
}

.bg-red-600 {
  background-color: #dc2626;
}

.bg-yellow-600 {
  background-color: #d97706;
}

.bg-purple-600 {
  background-color: #7c3aed;
}

.bg-teal-600 {
  background-color: #0d9488;
}

.bg-orange-600 {
  background-color: #ea580c;
}

.border-gray-200 {
  border-color: #e5e7eb;
}
</style>