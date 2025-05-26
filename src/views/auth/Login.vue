<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <h2>Welcome to our Website</h2>
        <p class="login-subtitle">Sign in to your account</p>
      </div>
      
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Email Address</label>
          <input 
            type="email" 
            v-model="email" 
            class="form-input"
            placeholder="your@email.com" 
            required
          >
        </div>

        <div class="form-group">
          <label>Password</label>
          <input 
            type="password" 
            v-model="password" 
            class="form-input"
            placeholder="••••••••" 
            required
          >
        </div>

        <button 
          type="submit" 
          class="login-btn"
          :class="{ loading: isLoading }"
          :disabled="isLoading"
        >
          <span v-if="!isLoading">Login</span>
          <span v-else>Authenticating...</span>
        </button>
        
        <p v-if="errorMessage" class="error-message">
          ⚠️ {{ errorMessage }}
        </p>
      </form>
      
      <div class="login-footer">
        <p>Don't have an account? <router-link to="/register" class="footer-link">Create account</router-link></p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginView',
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '',
      isLoading: false
    };
  },
  methods: {
    async handleLogin() {
      this.isLoading = true;
      this.errorMessage = '';
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const users = {
        'admin@example.com': { role: 'admin', password: 'admin123' },
        'super@example.com': { role: 'super', password: 'super123' },
        'user@example.com': { role: 'user', password: 'user123' }
      };

      const user = users[this.email];

      if (user && user.password === this.password) {
        localStorage.setItem('user', JSON.stringify({ 
          email: this.email, 
          role: user.role 
        }));

        if (user.role === 'admin') {
          this.$router.push('/admin');
        } else if (user.role === 'super') {
          this.$router.push('/super-dashboard');
        } else {
          this.$router.push('/home');
        }
      } else {
        this.errorMessage = 'Invalid credentials. Please try again.';
      }
      
      this.isLoading = false;
    }
  }
};
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #fffae6;
  padding: 2rem;
  background-image: radial-gradient(#ffe68033 1px, transparent 1px);
  background-size: 20px 20px;
}

.login-container {
  background: white;
  padding: 2.5rem;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(139, 117, 0, 0.15);
  width: 100%;
  max-width: 420px;
  border: 1px solid #ffe680;
  animation: fadeInUp 0.4s ease-out;
}

.login-header {
  margin-bottom: 2rem;
  text-align: center;
}

.login-header h2 {
  color: #8a6d0b;
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
}

.login-subtitle {
  color: #b38b00;
  margin: 0;
  font-size: 0.95rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #8a6d0b;
  font-size: 0.9rem;
}

.form-input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1px solid #ffe680;
  border-radius: 0.75rem;
  font-size: 0.95rem;
  background-color: #fffdf5;
  color: #5d4a00;
  transition: all 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #ffd700;
  box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.2);
  background-color: white;
}

.form-input::placeholder {
  color: #b38b00;
  opacity: 0.6;
}

.login-btn {
  width: 100%;
  background: #ffd700;
  color: #5d4a00;
  border: none;
  padding: 1rem;
  font-weight: 600;
  cursor: pointer;
  border-radius: 0.75rem;
  font-size: 1rem;
  transition: all 0.2s;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.login-btn:hover:not(:disabled) {
  background: #e6c200;
  transform: translateY(-1px);
}

.login-btn:active:not(:disabled) {
  transform: translateY(0);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-message {
  color: #dc3545;
  margin-top: 1.25rem;
  text-align: center;
  font-size: 0.9rem;
  padding: 0.75rem;
  background-color: #fee2e2;
  border-radius: 0.5rem;
  border-left: 3px solid #dc3545;
}

.login-footer {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.9rem;
  color: #8a6d0b;
}

.footer-link {
  color: #b38b00;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s;
}

.footer-link:hover {
  color: #8a6d0b;
  text-decoration: underline;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 480px) {
  .login-page {
    padding: 1.5rem;
  }
  
  .login-container {
    padding: 1.75rem;
  }
}
</style>