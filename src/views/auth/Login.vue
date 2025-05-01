<template>
  <div class="login-page">
    <div class="login-container">
      <h2>🔐 Login</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Email:</label>
          <input type="email" v-model="email" placeholder="Enter your email" required>
        </div>

        <div class="form-group">
          <label>Password:</label>
          <input type="password" v-model="password" placeholder="Enter your password" required>
        </div>

        <button type="submit" class="login-btn">Login</button>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </form>
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
      errorMessage: ''
    };
  },
  methods: {
    handleLogin() {
  const users = {
    'admin@example.com': { role: 'admin', password: 'admin123' },
    'super@example.com': { role: 'super', password: 'super123' },
    'user@example.com': { role: 'user', password: 'user123' }
  };

  const user = users[this.email];

  if (user && user.password === this.password) {
    localStorage.setItem('user', JSON.stringify({ email: this.email, role: user.role }));

    if (user.role === 'admin') {
      this.$router.push('/admin'); // Redirect to admin layout
    } else if (user.role === 'super') {
      this.$router.push('/super-dashboard'); // Future Super dashboard
    } else {
      this.$router.push('/home'); // Normal user home
    }
  } else {
    this.errorMessage = 'Invalid email or password!';
  }
}
  }
};
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.login-container {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 300px;
  text-align: center;
}

.form-group {
  margin-bottom: 15px;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.login-btn {
  width: 100%;
  background: #4b000f;
  color: white;
  border: none;
  padding: 10px;
  font-weight: bold;
  cursor: pointer;
  border-radius: 5px;
}

.login-btn:hover {
  background: #bf000a;
}

.error {
  color: red;
  margin-top: 10px;
}
</style>