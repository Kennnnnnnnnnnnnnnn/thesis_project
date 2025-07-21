<template>
  <div class="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-all duration-300 border border-gray-200">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="bg-teal-600 p-2 rounded-lg">
          <i class="fa-solid fa-boxes-stacked text-white text-lg"></i>
        </div>
        <div>
          <div class="text-sm text-gray-600">All Product</div>
          <div class="text-2xl font-bold text-gray-900">{{ allProducts.length }}</div>
        </div>
      </div>
      <div class="text-sm text-green-600">Total</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import apiURL from '@/api/config'
import axios from 'axios'

const allProducts = ref([])

const fetchProducts = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get(`${apiURL}/api/public/products`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (response.data.success) {
      allProducts.value = response.data.data
    }
  } catch (err) {
    console.error('Error fetching products:', err)
    allProducts.value = []
  }
}

onMounted(fetchProducts)
</script>
