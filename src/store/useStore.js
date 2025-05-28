import { defineStore } from 'pinia';

export const useStore = defineStore('useStore', {
  state: () => ({
    userId: null,
    serverDate: null,
    userRole: null,
    userPermissions: [],
    isAuthenticated: false,
    token: null
  }),
  actions: {
    setServerDate(date) {
      this.serverDate = date;
    },

    setUserId(id) {
      this.userId = id;
    },

    setUserRole(role) {
      this.userRole = role;
    },

    setUserPermissions(permissions) {
      this.userPermissions = permissions;
    },

    setToken(token) {
      this.token = token;
      // Set isAuthenticated based on token presence
      this.$patch({
        isAuthenticated: !!token
      });
    },

    clearUserId() {
      this.userId = null;
    },

    clearUserRole() {
      this.userRole = null;
    },

    clearServerDate() {
      this.serverDate = null;
    },

    clearUserPermissions() {
      this.userPermissions = [];
    },

    clearToken() {
      this.token = null;
      this.$patch({
        isAuthenticated: false
      });
    },

    // Clear all auth data
    clearAuth() {
      this.$patch({
        userId: null,
        userRole: null,
        userPermissions: [],
        token: null,
        isAuthenticated: false
      });
    },

    // Check if user has specific permission
    hasPermission(permission) {
      return this.userPermissions.includes(permission);
    },

    // Check if user has any of the given permissions
    hasAnyPermission(permissions) {
      return permissions.some(permission => this.userPermissions.includes(permission));
    },

    // Check if user has all of the given permissions
    hasAllPermissions(permissions) {
      return permissions.every(permission => this.userPermissions.includes(permission));
    }
  },
  getters: {
    getUserId: (state) => state.userId,
    getUserRole: (state) => state.userRole,
    getServerDate: (state) => state.serverDate,
    getUserPermissions: (state) => state.userPermissions,
    getToken: (state) => state.token,
    isUserAuthenticated: (state) => state.isAuthenticated,
    
    // Helper getters for common permission checks
    isAdmin: (state) => state.userRole === 'admin',
    isSuperAdmin: (state) => state.userRole === 'superadmin',
    isDelivery: (state) => state.userRole === 'delivery',
    isCustomer: (state) => state.userRole === 'customer'
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'auth',
        storage: localStorage,
        paths: ['userId', 'userRole', 'userPermissions', 'token', 'isAuthenticated']
      }
    ]
  }
});