<template>
  <aside class="sidebar">
    <nav class="nav">
      <!-- Dashboard Section -->
      <div class="nav-section">
        <span class="nav-section-title">Dashboard</span>
        <router-link to="/admin" class="nav-item" active-class="active" exact>
          <svg xmlns="http://www.w3.org/2000/svg" class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span class="nav-text">Dashboard</span>
        </router-link>
        
        <router-link to="/admin/orders" class="nav-item" active-class="active">
          <svg xmlns="http://www.w3.org/2000/svg" class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span class="nav-text">Orders</span>
        </router-link>
        
        <router-link to="/admin/create" class="nav-item" active-class="active">
          <svg xmlns="http://www.w3.org/2000/svg" class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <span class="nav-text">Product</span>
        </router-link>
      </div>
      
      <!-- Inventory Section -->
      <div class="nav-section">
        <span class="nav-section-title">Inventory</span>
        <router-link to="/admin/stock" class="nav-item" active-class="active">
          <svg xmlns="http://www.w3.org/2000/svg" class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <span class="nav-text">Stock</span>
        </router-link>
        
        <router-link to="/admin/restock" class="nav-item" active-class="active">
          <svg xmlns="http://www.w3.org/2000/svg" class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span class="nav-text">Restock</span>
        </router-link>
        
        <router-link to="/admin/categories" class="nav-item" active-class="active">
          <svg xmlns="http://www.w3.org/2000/svg" class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span class="nav-text">Categories</span>
        </router-link>
      </div>
      
      <!-- User Management Section -->
      <div class="nav-section">
        <span class="nav-section-title">User Management</span>
        <router-link to="/admin/users" class="nav-item" active-class="active">
          <svg xmlns="http://www.w3.org/2000/svg" class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span class="nav-text">Create User</span>
        </router-link>
      </div>
      
      <!-- Reports Section -->
      <div class="nav-section">
        <span class="nav-section-title">Reports</span>
        <router-link to="/admin/reports/orders" class="nav-item" active-class="active">
          <svg xmlns="http://www.w3.org/2000/svg" class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span class="nav-text">Order Reports</span>
        </router-link>
        
        <router-link to="/admin/reports/stock" class="nav-item" active-class="active">
          <svg xmlns="http://www.w3.org/2000/svg" class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span class="nav-text">Stock Reports</span>
        </router-link>
        
        <router-link to="/admin/reports/purchase" class="nav-item" active-class="active">
          <svg xmlns="http://www.w3.org/2000/svg" class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span class="nav-text">Purchase Reports</span>
        </router-link>
      </div>
    </nav>
  </aside>
</template>

<script>
export default {
  name: 'AdminSidebar'
}
</script>
<style scoped>
.sidebar {
  width: 240px;
  background-color: #f8f8f8; /* Soft white background */
  color: #333333; /* Dark gray text */
  height: 100vh;
  padding-top: 1rem;
  position: sticky;
  top: 0;
  border-right: 1px solid #e5e7eb; /* subtle border */
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1rem;
}

.nav-section {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.nav-section-title {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #ca8a04; /* Slightly deeper yellow/gold */
  padding: 0.5rem 1rem;
  margin-bottom: 0.25rem;
}
.nav-item {
  color: #4b5563; /* Medium gray text */
  text-decoration: none;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.nav-item:not(.active):hover {
  background-color: #fef08a; /* Light yellow hover */
  color: #713f12; /* Dark brown text on hover */
}

.active {
  background-color: #facc15; /* Vibrant yellow for active */
  color: #000000; /* Black text for active */
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}
.nav-icon {
  width: 1.25rem;
  height: 1.25rem;
  stroke: currentColor;
}

.nav-text {
  font-size: 0.95rem;
}
</style>