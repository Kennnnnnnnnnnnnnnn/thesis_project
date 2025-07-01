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

// 🌐 Vue I18n
import { createI18n } from 'vue-i18n';
import en from './locales/en.json';
import kh from './locales/kh.json';
import zh from './locales/zh.json';

//  Create instances
const app = createApp(App);
const pinia = createPinia();

pinia.use(piniaPluginPersistedstate);

//  Create Vuetify instance
const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
});

//  Create Vue I18n instance
const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    kh,
    zh
  },
});

// 🔗 Use plugins
app.component('KhqrGenerator', KhqrGenerator);
app.use(pinia);
app.use(router);
app.use(vuetify);
app.use(i18n);
app.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyDApUy7BfllnejZYnnUWEK3OOPR4gcj1tU',
  },
});

app.mount('#app');
