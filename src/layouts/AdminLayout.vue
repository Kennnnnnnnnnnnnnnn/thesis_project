<template>
  <div class="admin-layout">
    <!-- Top Header -->
    <AdminHeader />

    <!-- Sidebar + Main Content -->
    <div class="admin-body">
      <!-- Sidebar -->
      <AdminSidebar />

      <!-- Main Content Area -->
      <main class="main-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>

import AdminHeader from '@/views/admin/AdminHeader.vue';
import AdminSidebar from '@/views/admin/AdminSidebar.vue';


export default {
  name: 'AdminLayout',
  components: {
    AdminHeader,
    AdminSidebar,
  }
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.admin-body {
  display: flex;
  flex: 1;
}

.main-content {
  flex: 1;
  padding: 2rem;
  background-color: #f8fafc;
  overflow-y: auto;
}
</style>
