<template>

  <router-link to="/admin/create">
    <div class="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-all duration-300 border border-gray-200">
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
  </router-link>
  
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import apiURL from '@/api/config'

const allProducts = ref([])

const fetchProducts = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get(`${apiURL}/api/getAllDocs/Product`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })

    if (response.data.success) {
      allProducts.value = response.data.data
    } else {
      console.warn('⚠️ Failed to fetch products:', response.data.message)
    }
  } catch (err) {
    console.error('❌ Error fetching products:', err.message)
    allProducts.value = []
  }
}

onMounted(fetchProducts)
</script>
