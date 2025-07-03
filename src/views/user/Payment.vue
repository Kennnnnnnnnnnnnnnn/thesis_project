<script setup>
import { ref } from 'vue'
import api from '@/api/config' 

const amount = 600
const name = 'Ant'
const phoneNumber = '123456'
const currency = 'KHR'
const accountId = 'dalin_ven@aclb'
const storeLabel = 'Ecommerce'
const terminalLabel = 'Web Payment'
const billNumber = 'BILL9469'

const generateQR = () => {
  navigator.geolocation.getCurrentPosition(
    position => {
      const currentLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }

      api.post('/generate-qr', {
        amount,
        name,
        phoneNumber,
        currentLocation,
        currency,
        accountId,
        storeLabel,
        terminalLabel,
        billNumber
      }).then(res => {
        console.log('✅ QR Code generated:', res.data)
      }).catch(err => {
        console.error('❌ Failed to generate QR:', err)
      })
    },
    error => {
      console.error('❌ Location access failed:', error)
    }
  )
}
</script>

<template>
  <v-btn color="primary" @click="generateQR">
    Generate QR
  </v-btn>
</template>
