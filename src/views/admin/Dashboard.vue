<template>
  <div class="p-6 max-w-screen-xl mx-auto bg-white h-screen overflow-y-auto">
    <!-- Dashboard Header -->
    <!-- <div class="mb-6">
      <h1 class="text-2xl font-bold text-amber-800 mb-1">{{ $t('dashboard.title') }}</h1>
      <p class="text-amber-600 mb-6">{{ $t('dashboard.subtitle') }}</p>
    </div> -->

    <!-- Metrics Grid (Redesigned as Cards) -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Total Orders Card -->
      <div class="bg-white shadow-xl rounded-2xl transition-all duration-300 p-6">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-amber-600 text-sm font-semibold mb-2">{{ $t('dashboard.totalOrders') }}</h3>
            <p class="text-4xl font-extrabold text-amber-600">{{ formatNumber(metrics.totalOrders) }}</p>
          </div>
          <div class="bg-amber-100 p-3 rounded-full">
            <i class="fa-solid fa-shopping-bag text-amber-600 text-2xl"></i>
          </div>
        </div>
      </div>

      <!-- Total Users Card -->
      <div class="bg-white shadow-xl rounded-2xl transition-all duration-300 p-6">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-blue-900 text-sm font-semibold mb-2">{{ $t('dashboard.totalUsers') }}</h3>
            <p class="text-4xl font-extrabold text-blue-900">{{ formatNumber(metrics.totalUsers) }}</p>
          </div>
          <div class="bg-blue-100 p-3 rounded-full">
            <i class="fa-solid fa-users text-blue-900 text-2xl"></i>
          </div>
        </div>
      </div>

      <!-- Pending Orders Card -->
      <div class="bg-white shadow-xl rounded-2xl transition-all duration-300 p-6">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-rose-600 text-sm font-semibold mb-2">{{ $t('dashboard.pendingOrders') }}</h3>
            <p class="text-4xl font-extrabold text-rose-600">{{ formatNumber(metrics.pendingOrders) }}</p>
          </div>
          <div class="bg-red-100 p-3 rounded-full">
            <i class="fa-solid fa-clock text-rose-600 text-2xl"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

export default {
  name: 'AdminDashboard',
  setup() {
    const { t, locale } = useI18n();

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

    return {
      t,
      locale,
      metrics,
      formatNumber
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

.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scroll {
  0% {
    left: -22%;
  }

  100% {
    left: 100%;
  }
}
</style>