import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import '@fortawesome/fontawesome-free/css/all.css';
import './assets/tailwind.css';

import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

// 🗺️ Google Maps
import VueGoogleMaps from '@fawmi/vue-google-maps';

// ✅ Vuetify
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

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
app.use(pinia);
app.use(router);
app.use(vuetify);
app.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyDApUy7BfllnejZYnnUWEK3OOPR4gcj1tU',
  },
});

app.mount('#app');
