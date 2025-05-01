<template>
    <div class="app-layout">
      <UserHeader />
      <NavMenu />
      <main class="main-content">
        <router-view /> <!-- This shows the current page -->
      </main>
    </div>
  </template>
  
  <script>
  import UserHeader from '@/components/UserHeader.vue'
  import NavMenu from '@/components/NavMenu.vue'
  
  export default {
    components: { 
      UserHeader,
      NavMenu
    }
  }
  </script>
  
  <style>
  .app-layout {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  .main-content {
    flex: 1;
    padding: 20px;
  }
  </style>