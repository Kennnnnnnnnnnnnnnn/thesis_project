<template>
    <div class="user-dropdown">
      <img 
        :src="user.avatar" 
        class="user-avatar"
        @click="toggleDropdown"
      >
      <div v-if="isOpen" class="dropdown-menu">
        <p class="user-name">{{ user.name }}</p>
        <button @click="logout">
          <i class="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: ['user'],
    data() {
      return {
        isOpen: false
      }
    },
    methods: {
      toggleDropdown() {
        this.isOpen = !this.isOpen
      },
      logout() {
        this.$store.dispatch('auth/logout')
        this.$router.push('/login')
      }
    }
  }
  </script>
  
  <style scoped>
  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid #eee;
  }
  
  .dropdown-menu {
    position: absolute;
    right: 2rem;
    top: 70px;
    background: white;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    padding: 1rem;
    border-radius: 8px;
    min-width: 200px;
  }
  
  .user-name {
    margin: 0 0 1rem 0;
    font-weight: 600;
  }
  </style>