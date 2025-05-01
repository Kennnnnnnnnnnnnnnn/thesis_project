<template>
    <select v-model="currentLanguage" @change="changeLanguage">
      <option value="en">English</option>
      <option value="kh">Khmer</option>
    </select>
  </template>
  
  <script>
  export default {
    data() {
      return {
        currentLanguage: 'en'
      }
    },
    methods: {
      changeLanguage() {
        this.$i18n.locale = this.currentLanguage
      }
    }
  }
  </script>