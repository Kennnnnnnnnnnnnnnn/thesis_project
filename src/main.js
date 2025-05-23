import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import '@fortawesome/fontawesome-free/css/all.css';

const app = createApp(App)

app.use(store)
app.use(router)

// Initialize auth state
store.dispatch('auth/initializeAuth')

app.mount('#app')