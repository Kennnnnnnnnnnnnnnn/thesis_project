<template>
  <div class="bg-white rounded-2xl shadow p-8 flex items-center justify-between border border-gray-100 min-h-[120px]">
    <div class="flex items-center gap-5">
      <div class="bg-green-100 p-4 rounded-xl flex items-center justify-center">
        <i class="fa-solid fa-money-bill-trend-up text-green-500 text-4xl"></i>
      </div>
      <div>
        <div class="text-sm font-medium text-gray-500 mb-1">Revenue</div>
        <div class="text-4xl font-bold text-gray-900 flex items-end gap-1">
          {{ formatTotalIncome }}៛
          <!-- <span class="text-xl font-bold text-green-600 mb-0.5">៛</span> -->
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>


</style>

<script setup>
import apiURL from '@/api/config'
import axios from 'axios'
import { computed, onMounted, ref } from 'vue'

const allIncome = ref([])

// Computed property to calculate total income with formatting
const formatTotalIncome = computed(() => {
  if (!allIncome.value || allIncome.value.length === 0) {
    return '0'
  }
  let totalIncome = 0
  allIncome.value.forEach(order => {
    if (order.totalCost) {
      totalIncome += parseFloat(order.totalCost) || 0
    }
  })
  // Add thousand separators
  return totalIncome.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
})

const fetchIncome = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get(`${apiURL}/api/getAllDocs/Order`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })

    if (response.data.success) {
      allIncome.value = response.data.data
    } else {
      console.warn('⚠️ Failed to fetch income :', response.data.message)
    }
  } catch (err) {
    console.error('❌ Error fetching income:', err.message)
    allIncome.value = []
  }
}

onMounted(fetchIncome)
</script>
