<template>
    <header class="admin-header">
      <!-- Logo/Brand -->
      <div class="brand" @click="$router.push('/admin')">
        <img src="@/assets/rice.png" alt="Admin Logo" class="logo">
        <h1 class="app-name">Admin Panel</h1>
      </div>
  
      <!-- Right Side Controls -->
      <div class="right-controls">
        <!-- Translate Button -->
        <button class="translate-btn" @click="toggleLanguage">
          <span>{{ currentLanguage }}</span>
        </button>
  
        <!-- Logout Button -->
        <button class="logout-btn" @click="logout">
          <span class="btn-text">Logout</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </header>
  </template>
  
  <script>
  export default {
    name: 'AdminHeader',
    data() {
      return {
        currentLanguage: 'EN'
      };
    },
    methods: {
      toggleLanguage() {
        this.currentLanguage = this.currentLanguage === 'EN' ? 'ES' : 'EN';
      },
      logout() {
        localStorage.removeItem('user');
        this.$router.push('/login');
      }
    }
  };
  </script>
  
  <style scoped>
  .admin-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 2rem;
    background: #1e293b;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 100;
  }
  
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    cursor: pointer;
  }
  
  .logo {
    height: 32px;
    width: auto;
  }
  
  .app-name {
    font-size: 1.25rem;
    font-weight: 600;
    color: white;
    margin: 0;
  }
  
  .right-controls {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }
  
  .translate-btn {
    background: #334155;
    border: none;
    cursor: pointer;
    color: white;
    font-weight: 500;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .translate-btn:hover {
    background: #475569;
  }
  
  .logout-btn {
    background: #0ea5e9;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .logout-btn:hover {
    background: #38bdf8;
    transform: translateY(-1px);
  }
  
  .btn-icon {
    width: 1.25rem;
    height: 1.25rem;
  }
  
  .btn-text {
    display: inline-block;
  }
  </style>