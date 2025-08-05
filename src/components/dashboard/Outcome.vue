<template>
  <div class="bg-white rounded-2xl shadow p-8 flex items-center justify-between border border-gray-100 min-h-[120px]">
    <div class="flex items-center gap-5">
      <div class="bg-red-100 p-4 rounded-xl flex items-center justify-center">
        <i class="fa-solid fa-money-bill-wave text-red-500 text-4xl"></i>
      </div>
      <div>
        <div class="text-sm font-medium text-gray-500 mb-1">Expense</div>
        <div class="text-4xl font-bold text-gray-900 flex items-end gap-1">
          {{ formatTotalOutcome }}៛
          <!-- <span class="text-xl font-bold text-red-600 mb-0.5">៛</span> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import apiURL from '@/api/config'
import axios from 'axios'
import { computed, onMounted, ref } from 'vue'

const allOutcome = ref([])

// Computed property to calculate total outcome with currency formatting
const formatTotalOutcome = computed(() => {
  if (!allOutcome.value || allOutcome.value.length === 0) {
    return '0'
  }

  let totalOutcome = 0
  let currencySymbol = ''
  let numberOfDecimalPlaces = 0

  // Calculate total outcome by summing all totalPrice from products
  allOutcome.value.forEach(purchase => {
    if (purchase.products && Array.isArray(purchase.products)) {
      purchase.products.forEach(product => {
        if (product.totalPrice) {
          totalOutcome += parseFloat(product.totalPrice) || 0
        }
        // Get currency symbol and decimal places from the first product that has them
        if (!currencySymbol) {
          // Try product.currency.symbol1.symbol (must be a string)
          if (
            product.currency &&
            product.currency.symbol1 &&
            typeof product.currency.symbol1.symbol === 'string'
          ) {
            currencySymbol = product.currency.symbol1.symbol
            numberOfDecimalPlaces = product.currency.numberOfDecimalPlaces || 0
          }
          // Try product.currency.symbol (must be a string)
          else if (
            product.currency &&
            typeof product.currency.symbol === 'string'
          ) {
            currencySymbol = product.currency.symbol
            numberOfDecimalPlaces = product.currency.numberOfDecimalPlaces || 0
          }
        }
      })
    }
  })

  // Format the number based on decimal places
  const formattedAmount = numberOfDecimalPlaces > 0 
    ? totalOutcome.toFixed(numberOfDecimalPlaces)
    : Math.round(totalOutcome).toString()

  // Add thousand separators
  const parts = formattedAmount.split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  const finalAmount = parts.join('.')

  return `${finalAmount} ${currencySymbol}`
})

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

onMounted(fetchOutcome)
</script>
