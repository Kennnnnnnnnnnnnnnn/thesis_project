<template>
  <div class="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-all duration-300 border border-gray-200">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="bg-green-600 p-2 rounded-lg">
          <i class="fa-solid fa-money-bill-trend-up text-white text-lg"></i>
        </div>
        <div>
          <div class="text-sm text-gray-600">Income</div>
          <div class="text-2xl font-bold text-gray-900">{{ formatTotalIncome }}៛</div>
        </div>
      </div>
      <div class="text-sm text-green-600">Total</div>
    </div>
  </div>
</template>

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
