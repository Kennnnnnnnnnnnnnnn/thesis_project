<template>
  <div class="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-all duration-300 border border-gray-200">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="bg-teal-600 p-2 rounded-lg">
          <i class="fa-solid fa-boxes-stacked text-white text-lg"></i>
        </div>
        <div>
          <div class="text-sm text-gray-600">Profit</div>
          <div class="text-2xl font-bold text-gray-900">{{ formatProfit }}</div>
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
const allOutcome = ref([])

// Fetch incomes
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

// Fetch outcomes
const fetchOutcome = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get(`${apiURL}/api/getAllDocs/PurchaseProduct`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
    if (response.data.success) {
      allOutcome.value = response.data.data
    } else {
      console.warn('⚠️ Failed to fetch outcome :', response.data.message)
    }
  } catch (err) {
    console.error('❌ Error fetching outcome:', err.message)
    allOutcome.value = []
  }
}

onMounted(() => {
  fetchIncome()
  fetchOutcome()
})

// Calculate total income
const getTotalIncome = () => {
  let total = 0
  allIncome.value.forEach(order => {
    if (order.totalCost) {
      total += parseFloat(order.totalCost) || 0
    }
  })
  return total
}

// Calculate total outcome
const getTotalOutcome = () => {
  let total = 0
  allOutcome.value.forEach(purchase => {
    if (purchase.products && Array.isArray(purchase.products)) {
      purchase.products.forEach(product => {
        if (product.totalPrice) {
          total += parseFloat(product.totalPrice) || 0
        }
      })
    }
  })
  return total
}

// Format profit with thousand separators and currency symbol
const formatProfit = computed(() => {
  const income = getTotalIncome()
  const outcome = getTotalOutcome()
  const profit = income - outcome
  // Add thousand separators
  const formatted = profit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  // Use ៛ as default symbol
  return `${formatted} ៛`
})
</script>
