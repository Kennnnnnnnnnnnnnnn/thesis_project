import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@fortawesome/fontawesome-free/css/all.css';
import './assets/tailwind.css'
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import VueGoogleMaps from '@fawmi/vue-google-maps'
globalThis.__VUE_PROD_HYDRATION_MISMATCH_DETAILS__ = false;  

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(router)
app.use(pinia)

app.use(VueGoogleMaps, {
    load: {
      key: 'AIzaSyDApUy7BfllnejZYnnUWEK3OOPR4gcj1tU', // ← your API key here!
    },
  })

app.mount('#app')

