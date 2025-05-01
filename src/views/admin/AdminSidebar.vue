<template>
  <aside class="sidebar">
    <nav class="nav">
      <router-link to="/admin" class="nav-item" active-class="active" exact>
        <svg xmlns="http://www.w3.org/2000/svg" class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <span class="nav-text">Dashboard</span>
      </router-link>
      
      <router-link to="/admin/users" class="nav-item" active-class="active">
        <svg xmlns="http://www.w3.org/2000/svg" class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span class="nav-text">Users</span>
      </router-link>
      
      <router-link to="/admin/orders" class="nav-item" active-class="active">
        <svg xmlns="http://www.w3.org/2000/svg" class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <span class="nav-text">Orders</span>
      </router-link>
      
      <router-link to="/admin/stock" class="nav-item" active-class="active">
        <svg xmlns="http://www.w3.org/2000/svg" class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
        <span class="nav-text">Stock</span>
      </router-link>
      
      <router-link to="/admin/create" class="nav-item" active-class="active">
        <svg xmlns="http://www.w3.org/2000/svg" class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <span class="nav-text">Create</span>
      </router-link>
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
    background-color: #1e293b;
    color: white;
    height: 100vh;
    padding-top: 1rem;
    position: sticky;
    top: 0;
  }
  
  .nav {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem;
  }
  
  .nav-item {
    color: #e2e8f0;
    text-decoration: none;
    padding: 0.75rem 1rem;
    border-radius: 6px;
    font-weight: 500;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  
  .nav-item:hover {
    background-color: #334155;
    color: white;
  }
  
  .active {
    background-color: #0ea5e9;
    color: white;
  }
  
  .nav-icon {
    width: 1.25rem;
    height: 1.25rem;
  }
  
  .nav-text {
    font-size: 0.95rem;
  }
  </style>