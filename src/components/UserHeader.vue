<template>
  <header class="flex justify-between items-center px-8 py-4 bg-white shadow-md sticky top-0 z-50">
    <!-- Logo/Brand -->
    <div class="flex items-center gap-4 cursor-pointer" @click="navigateToHome">
      <img src="@/assets/rice.png" alt="Logo" class="h-9 w-auto">
      <h1 class="text-xl font-semibold text-gray-800">{{ $t('companyName') }}</h1>
    </div>

    <!-- Right Side Controls -->
    <div class="flex items-center gap-6">
      <!-- Language Button -->
      <button
        class="bg-transparent border-none px-3 py-2 rounded-md text-slate-500 font-medium cursor-pointer transition-all duration-200 hover:bg-slate-100 hover:text-green-600"
        @click="toggleLanguage"
      >
        <span>{{ currentLanguage }}</span>
      </button>

      <!-- Auth Buttons -->
      <template v-if="!isAuthenticated">
        <router-link 
          to="/register" 
          class="bg-yellow-500 text-white border-none px-4 py-2 rounded-md font-semibold cursor-pointer transition-all duration-200 hover:bg-yellow-600"
        >
          {{ $t('common.register') }}
        </router-link>
        <router-link 
          to="/login" 
          class="bg-green-500 text-white border-none px-4 py-2 rounded-md font-semibold cursor-pointer transition-all duration-200 hover:bg-green-600"
        >
          {{ $t('common.login') }}
        </router-link>
      </template>

      <template v-else>
        <button 
          class="bg-red-800 text-white border-none px-6 py-3 rounded-md font-semibold cursor-pointer transition-all duration-200 hover:bg-red-600 hover:-translate-y-0.5"
          @click="logout"
        >
          {{ $t('common.logout') }}
        </button>
      </template>
    </div>
  </header>
</template>


<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from '@/store/useStore';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const store = useStore();
const { locale, t } = useI18n();

const currentLanguage = ref('EN');

// Determine if user is authenticated
const isAuthenticated = computed(() => {
  const token = localStorage.getItem('token');
  return !!(token || store.isAuthenticated);
});

const toggleLanguage = () => {
  if (currentLanguage.value === 'EN') {
    currentLanguage.value = 'KH';
    locale.value = 'kh';
  } else if (currentLanguage.value === 'KH') {
    currentLanguage.value = 'ZH';
    locale.value = 'zh';
  } else {
    currentLanguage.value = 'EN';
    locale.value = 'en';
  }
};

const navigateToHome = () => {
  router.push('/home');
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  store.clearAuth(); // optional: use your store's clear method
  router.push('/login');
};
</script>
