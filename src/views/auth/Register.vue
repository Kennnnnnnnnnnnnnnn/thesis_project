<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-header">
        <h2>✨ Create Account</h2>
        <p class="register-subtitle">Join our platform today</p>
      </div>
      
      <form @submit.prevent="handleRegister">
        <div class="form-row">
          <div class="form-group">
            <label>First Name</label>
            <input 
              type="text" 
              v-model="firstName" 
              class="form-input"
              placeholder="John" 
              required
            >
          </div>
          <div class="form-group">
            <label>Last Name</label>
            <input 
              type="text" 
              v-model="lastName" 
              class="form-input"
              placeholder="Doe" 
              required
            >
          </div>
        </div>

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

        <div class="form-row">
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
          <div class="form-group">
            <label>Confirm Password</label>
            <input 
              type="password" 
              v-model="confirmPassword" 
              class="form-input"
              placeholder="••••••••" 
              required
            >
          </div>
        </div>

        <div class="form-group">
          <label class="checkbox-container">
            <input type="checkbox" v-model="termsAccepted" required>
            <span class="checkmark"></span>
            I agree to the <a href="#" class="terms-link">Terms of Service</a> and <a href="#" class="terms-link">Privacy Policy</a>
          </label>
        </div>

        <button 
          type="submit" 
          class="register-btn"
          :class="{ loading: isLoading }"
          :disabled="isLoading"
        >
          <span v-if="!isLoading">Create Account</span>
          <span v-else>Creating account...</span>
        </button>
        
        <p v-if="errorMessage" class="error-message">
          ⚠️ {{ errorMessage }}
        </p>
      </form>
      
      <div class="register-footer">
        <p>Already have an account? <router-link to="/login" class="footer-link">Sign in</router-link></p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RegisterView',
  data() {
    return {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      termsAccepted: false,
      errorMessage: '',
      isLoading: false
    };
  },
  methods: {
    async handleRegister() {
      this.isLoading = true;
      this.errorMessage = '';
      
      // Validate passwords match
      if (this.password !== this.confirmPassword) {
        this.errorMessage = 'Passwords do not match';
        this.isLoading = false;
        return;
      }

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      try {
        // In a real app, you would call your API here
        const newUser = {
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          role: 'user' // Default role
        };
        
        // Save to localStorage (in real app, this would be a proper auth flow)
        localStorage.setItem('user', JSON.stringify(newUser));
        
        // Redirect to home/dashboard
        this.$router.push('/home');
      } catch (error) {
        this.errorMessage = 'Registration failed. Please try again.';
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped>
.register-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #fffae6;
  padding: 2rem;
  background-image: radial-gradient(#ffe68033 1px, transparent 1px);
  background-size: 20px 20px;
}

.register-container {
  background: white;
  padding: 2.5rem;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(139, 117, 0, 0.15);
  width: 100%;
  max-width: 480px;
  border: 1px solid #ffe680;
  animation: fadeInUp 0.4s ease-out;
}

.register-header {
  margin-bottom: 2rem;
  text-align: center;
}

.register-header h2 {
  color: #8a6d0b;
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
}

.register-subtitle {
  color: #b38b00;
  margin: 0;
  font-size: 0.95rem;
}

.form-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-row .form-group {
  flex: 1;
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

.checkbox-container {
  display: flex;
  align-items: center;
  position: relative;
  padding-left: 28px;
  cursor: pointer;
  color: #8a6d0b;
  font-size: 0.9rem;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 20px;
  width: 20px;
  background-color: #fffdf5;
  border: 1px solid #ffe680;
  border-radius: 4px;
}

.checkbox-container:hover input ~ .checkmark {
  background-color: #fffae6;
}

.checkbox-container input:checked ~ .checkmark {
  background-color: #ffd700;
  border-color: #ffd700;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.checkbox-container input:checked ~ .checkmark:after {
  display: block;
}

.checkbox-container .checkmark:after {
  left: 7px;
  top: 3px;
  width: 5px;
  height: 10px;
  border: solid #5d4a00;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.terms-link {
  color: #b38b00;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s;
}

.terms-link:hover {
  color: #8a6d0b;
  text-decoration: underline;
}

.register-btn {
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

.register-btn:hover:not(:disabled) {
  background: #e6c200;
  transform: translateY(-1px);
}

.register-btn:active:not(:disabled) {
  transform: translateY(0);
}

.register-btn:disabled {
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

.register-footer {
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
  .register-page {
    padding: 1.5rem;
  }
  
  .register-container {
    padding: 1.75rem;
  }
  
  .form-row {
    flex-direction: column;
    gap: 0;
  }
}
</style>