<template>
  <div class="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-all duration-300 border border-gray-200">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="bg-green-600 p-2 rounded-lg">
          <i class="fa-solid fa-box-open text-white text-lg"></i>
        </div>
        <div>
          <div class="text-sm text-gray-600">In Stock</div>
          <div class="text-2xl font-bold text-gray-900">{{ inStockCount }}</div>
        </div>
      </div>
      <div class="text-sm text-green-600">Total</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import apiURL from '@/api/config'

const inStockCount = ref(0)

const fetchInStock = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get(`${apiURL}/api/getAllDocs/Product`, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        dynamicConditions: JSON.stringify([
          { field: "totalStock", operator: "&gt", value: 0 }
        ])
      }
    })
    inStockCount.value = response.data.data.length


    if (response.data.success) {
      const products = response.data.data
      inStockCount.value = products.filter(p => p.totalStock > 0).length
    }
  } catch (err) {
    console.error('Error fetching in-stock products:', err)
    inStockCount.value = 0
  }
}

onMounted(fetchInStock)
</script>
