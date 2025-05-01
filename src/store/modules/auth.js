export default {
    state: () => ({
      user: {  // Pre-fill with test data
        id: 1,
        name: "Test User",
        email: "test@example.com",
        role: "user" // Change to "admin" for admin testing
      },
      token: "demo-fixed-token-123" // Fixed token
    }),
  
    mutations: {
      // Keep existing mutations
    },
  
    actions: {
      login({ commit }) {
        // Immediately return test data
        commit('SET_USER', {
          id: 1,
          name: "Test User",
          email: "test@example.com",
          role: "user" 
        })
        commit('SET_TOKEN', "demo-fixed-token-123")
        return Promise.resolve()
      },
      logout({ commit }) {
        commit('SET_USER', null)
        commit('SET_TOKEN', null)
      }
    },
  
    getters: {
      isAuthenticated: () => true, // Always true for testing
      currentUser: state => state.user,
      isAdmin: state => state.user?.role === 'admin'
    }
  }