<template>
  <div class="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-all duration-300 border border-gray-200">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="bg-yellow-600 p-2 rounded-lg">
          <i class="fa-solid fa-tags text-white text-lg"></i>
        </div>
        <div>
          <div class="text-sm text-gray-600">Product Promotion</div>
          <div class="text-2xl font-bold text-gray-900">{{ promotionProducts.length }}</div>
        </div>
      </div>
      <div class="text-sm text-yellow-600">Total</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import apiURL from '@/api/config'

const promotionProducts = ref([])

const fetchPromotions = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get(`${apiURL}/api/public/products`, {
      params: { isPromoted: true },
      headers: { Authorization: `Bearer ${token}` },
    })
    if (response.data.success) {
      promotionProducts.value = response.data.data
    }
  } catch (err) {
    console.error('Error fetching promotion products:', err)
    promotionProducts.value = []
  }
}

onMounted(fetchPromotions)
</script>
