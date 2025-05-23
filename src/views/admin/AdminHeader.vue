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
  background: #ffffff; /* White background to match sidebar */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05); /* Lighter shadow */
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid #e5e7eb; /* Light gray border */
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
  color: #ca8a04; /* Deep gold/yellow to match sidebar titles */
  margin: 0;
}

.right-controls {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.translate-btn {
  background: #f8f8f8; /* Light gray matching sidebar bg */
  border: 1px solid #e5e7eb; /* Subtle border */
  cursor: pointer;
  color: #4b5563; /* Medium gray text */
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.translate-btn:hover {
  background: #fef08a; /* Light yellow hover like sidebar */
  color: #713f12; /* Dark brown text on hover */
  border-color: #fde047;
}

.logout-btn {
  background: #facc15; /* Yellow background */
  color: #000000; /* Black text */
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logout-btn:hover {
  background: #fde047; /* Brighter yellow */
  transform: translateY(-1px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Subtle shadow */
}

.btn-icon {
  width: 1.25rem;
  height: 1.25rem;
  stroke: currentColor;
}

.btn-text {
  display: inline-block;
}
</style>