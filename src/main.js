import '@fortawesome/fontawesome-free/css/all.css';
import { KhqrGenerator } from 'phorsz-vue-khqr-generator';
import 'phorsz-vue-khqr-generator/src/components/KhqrGenerator.css';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { createApp } from 'vue';
import App from './App.vue';
import './assets/tailwind.css';
import router from './router';

// 🗺️ Google Maps
import VueGoogleMaps from '@fawmi/vue-google-maps';

// ✅ Vuetify
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import 'vuetify/styles';
import './registerServiceWorker';

// 🔧 Create instances
const app = createApp(App);
const pinia = createPinia();

pinia.use(piniaPluginPersistedstate);

// 🔌 Create Vuetify instance
const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
});

// 🔗 Use plugins
app.component('KhqrGenerator', KhqrGenerator);
app.use(pinia);
app.use(router);
app.use(vuetify);
app.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyDApUy7BfllnejZYnnUWEK3OOPR4gcj1tU',
  },
});

app.mount('#app');
