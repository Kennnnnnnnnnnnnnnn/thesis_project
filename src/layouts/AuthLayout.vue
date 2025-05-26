<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100 font-sans">
    <div class="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
      <router-view /> <!-- Renders Login.vue/Register.vue -->
    </div>
  </div>
</template>

<style scoped>
/* Scoped styles for AuthLayout */
</style>