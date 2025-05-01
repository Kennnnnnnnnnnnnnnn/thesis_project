<template>
  <header class="admin-header">
    <!-- Logo/Brand -->
    <div class="brand" @click="$router.push('/admin')">
      <img src="@/assets/rice.png" alt="Admin Logo" class="logo">
      <h1 class="app-name">User Panel</h1>
    </div>

    <!-- Right Side Controls -->
    <div class="right-controls">
      <!-- Translate Button -->
      <button class="translate-btn" @click="toggleLanguage">
        <span>{{ currentLanguage }}</span>
      </button>

      <!-- Logout Button -->
      <button class="logout-btn" @click="logout">Logout</button>
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
  padding: 1rem 2rem;
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
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
  height: 36px;
  width: auto;
}

.app-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.right-controls {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.translate-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #64748b;
  font-weight: 500;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.translate-btn:hover {
  background: #f1f5f9;
  color: #42b983;
}

.logout-btn {
  background: #bf000a;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.logout-btn:hover {
  background: red;
  transform: translateY(-1px);
}
</style>