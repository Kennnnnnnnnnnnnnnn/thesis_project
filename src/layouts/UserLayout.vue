<template>
    <div class="app-layout">
      <UserHeader />
      <main class="main-content">
        <router-view /> <!-- This renders your user views -->
      </main>
    </div>
  </template>
  
  <script>
  import UserHeader from '@/components/UserHeader.vue'
  
  export default {
    components: { UserHeader }
  }
  </script>
  
  <style scoped>
  .app-layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  .main-content {
    flex: 1;
    padding: 20px;
  }
  </style>