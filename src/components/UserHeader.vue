<template>
  <header class="flex justify-between items-center px-8 py-4 bg-white shadow-md sticky top-0 z-50">
    <!-- Logo/Brand -->
    <div class="flex items-center gap-4 cursor-pointer" @click="navigateToHome">
      <img src="@/assets/rice.png" alt="Logo" class="h-9 w-auto" />
      <h1 class="text-xl font-semibold text-gray-800">{{ $t('companyName') }}</h1>
    </div>

    <!-- Right Side Controls -->
    <div class="flex items-center gap-6">
      <!-- Language Button -->
      <button
        class="bg-transparent border-none px-3 py-2 rounded-md cursor-pointer transition-all duration-200 hover:bg-slate-100 hover:-translate-y-0.5"
        @click="toggleLanguage"
      >
        <img :src="currentFlag" alt="Lang" class="h-6 w-6 object-contain" />
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
        <router-link 
          to="/profile" 
          class="flex items-center gap-2 bg-slate-200 text-gray-800 border-none px-4 py-2 rounded-md font-semibold cursor-pointer transition-all duration-200 hover:bg-slate-300 hover:-translate-y-0.5"
        >
          <img :src="profileImage" alt="Profile" class="w-8 h-8 rounded-full object-cover" />
          <span>{{ profileName }}</span>
        </router-link>

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
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from '@/store/useStore';
import { useI18n } from 'vue-i18n';
import axios from 'axios';
import apiURL from '@/api/config';
import flagEN from '@/assets/flags/en.png';
import flagKH from '@/assets/flags/kh.png';
import flagZH from '@/assets/flags/zh.png';

const currentFlag = ref(flagEN);
const router = useRouter();
const store = useStore();
const { locale } = useI18n();

const profileName = ref('User');
const profileImage = ref(require('@/assets/default-profile.png'));

// Determine if user is authenticated
const isAuthenticated = computed(() => {
  const token = localStorage.getItem('token');
  return !!(token || store.isAuthenticated);
});

// Fetch profile info if authenticated
const fetchProfile = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return;
    const res = await axios.get(`${apiURL}/api/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.data.success) {
      profileName.value = res.data.data.name || 'User';
      profileImage.value = res.data.data.profilePicture || require('@/assets/default-profile.png');
    } else {
      console.error('Failed to fetch profile:', res.data.message);
    }
  } catch (err) {
    console.error('Error fetching profile:', err);
  }
};

// Toggle language & update flag
const toggleLanguage = () => {
  if (currentFlag.value === flagEN) {
    currentFlag.value = flagKH;
    locale.value = 'kh';
  } else if (currentFlag.value === flagKH) {
    currentFlag.value = flagZH;
    locale.value = 'zh';
  } else {
    currentFlag.value = flagEN;
    locale.value = 'en';
  }
};

const navigateToHome = () => {
  router.push('/home');
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  store.clearAuth();
  router.push('/home');
};

// Fetch profile on mount if authenticated
onMounted(() => {
  if (isAuthenticated.value) {
    fetchProfile();
  }
});
</script>

<style scoped>
/* Optional styling if needed */
</style>
