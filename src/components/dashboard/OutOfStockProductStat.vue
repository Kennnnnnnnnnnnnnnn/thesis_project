<template>
  <div class="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-all duration-300 border border-gray-200">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="bg-red-600 p-2 rounded-lg">
          <i class="fa-solid fa-boxes-packing text-white text-lg"></i>
        </div>
        <div>
          <div class="text-sm text-gray-600">Out of Stock</div>
          <div class="text-2xl font-bold text-gray-900">{{ outOfStockCount }}</div>
        </div>
      </div>
      <div class="text-sm text-red-600">Total</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import apiURL from '@/api/config'

const outOfStockCount = ref(0)

const fetchOutOfStock = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get(`${apiURL}/api/public/products`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (response.data.success) {
      const products = response.data.data
      outOfStockCount.value = products.filter(p => p.totalStock === 0).length
    }
  } catch (err) {
    console.error('Error fetching out-of-stock products:', err)
    outOfStockCount.value = 0
  }
}

onMounted(fetchOutOfStock)
</script>
