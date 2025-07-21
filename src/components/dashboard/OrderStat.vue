<template>
  <div class="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-all duration-300 border border-gray-200">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="bg-blue-600 p-2 rounded-lg">
          <i class="fa-solid fa-cart-shopping text-white text-lg"></i>
        </div>
        <div>
          <div class="text-sm text-gray-600">Orders</div>
          <div class="text-2xl font-bold text-gray-900">{{ orders.length }}</div>
        </div>
      </div>
      <div class="text-sm text-blue-600">Filtered</div>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import axios from 'axios'
import apiURL from '@/api/config'

const props = defineProps({
  startDate: String,
  endDate: String
})

const orders = ref([])

watchEffect(async () => {
  if (!props.startDate || !props.endDate) return

  try {
    const token = localStorage.getItem('token')
    const dynamicConditions = JSON.stringify([
      { field: 'createdAt', operator: '&gte', value: props.startDate, type: 'Date' },
      { field: 'createdAt', operator: '&lte', value: props.endDate, type: 'Date' }
    ])

    const res = await axios.get(`${apiURL}/api/order/list`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { dynamicConditions }
    })

    if (res.data.success) {
      orders.value = res.data.data
    }
  } catch (err) {
    console.error('Failed to fetch order stats:', err)
    orders.value = []
  }
})
</script>
