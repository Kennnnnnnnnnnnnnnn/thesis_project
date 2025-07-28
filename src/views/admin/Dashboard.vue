<template>
  <div class="p-2 max-w-screen-xl mx-auto bg-gray-100 min-h-screen overflow-y-auto font-sans">
    <!-- Header -->
    <div class="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Business Dashboard</h1>
      </div>
      <div class="flex items-center gap-4 mt-4 md:mt-0">
        <select
          v-model="filterPeriod"
          @change="handlePeriodChange"
          class="bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="daily">Daily</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>
    </div>

    <!-- Stat Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <OrderStats :startDate="startDate" :endDate="endDate" />
      <AllProductStat />
      <PromotionProductStat />
      <InStockProductStat />
      <OutOfStockProductStat />
      
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import dayjs from 'dayjs'

// Components
import OrderStats from '@/components/dashboard/OrderStat.vue'
import AllProductStat from '@/components/dashboard/AllProductStat.vue'
import PromotionProductStat from '@/components/dashboard/PromotionProductStat.vue'
import InStockProductStat from '@/components/dashboard/InStockProductStat.vue'
import OutOfStockProductStat from '@/components/dashboard/OutOfStockProductStat.vue'

// State
const filterPeriod = ref('monthly')

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
</script>
