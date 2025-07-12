<template>
  <header class="flex justify-between items-center px-4 sm:px-8 py-3 sm:py-4 bg-white shadow-md sticky top-0 z-50">
    <!-- Logo/Brand -->
    <div class="flex items-center gap-2 sm:gap-4 cursor-pointer" @click="navigateToHome">
      <img src="@/assets/rice.png" alt="Logo" class="h-7 sm:h-9 w-auto" />
      <h1 class="text-lg sm:text-xl font-semibold text-gray-800">{{ $t('companyName') }}</h1>
    </div>

    <!-- Right Side Controls -->
    <div class="flex items-center gap-2 sm:gap-4 md:gap-6">
      <!-- Language Button - Always visible -->
      <button
        class="bg-transparent border-none p-1 sm:px-3 sm:py-2 rounded-md cursor-pointer transition-all duration-200 hover:bg-slate-100 hover:-translate-y-0.5"
        @click="toggleLanguage"
      >
        <img :src="currentFlag" alt="Lang" class="h-5 sm:h-6 w-5 sm:w-6 object-contain" />
      </button>

      <!-- Auth Buttons - Always visible -->
      <template v-if="!isAuthenticated">
        <router-link 
          to="/register" 
          class="bg-yellow-500 text-white border-none px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base rounded-md font-semibold cursor-pointer transition-all duration-200 hover:bg-yellow-600"
        >
          {{ $t('common.register') }}
        </router-link>
        <router-link 
          to="/login" 
          class="bg-green-500 text-white border-none px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base rounded-md font-semibold cursor-pointer transition-all duration-200 hover:bg-green-600"
        >
          {{ $t('common.login') }}
        </router-link>
      </template>

      <template v-else>
        <router-link 
          to="/profile" 
          class="flex items-center gap-1 sm:gap-2 bg-slate-200 text-gray-800 border-none px-2 sm:px-4 py-1 sm:py-2 rounded-md font-semibold cursor-pointer transition-all duration-200 hover:bg-slate-300 hover:-translate-y-0.5"
        >
          <img :src="profileImage" alt="Profile" class="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover" />
          <span class="hidden sm:inline">{{ profileName }}</span>
        </router-link>

        <button 
          class="bg-red-800 text-white border-none px-3 sm:px-6 py-1.5 sm:py-3 text-sm sm:text-base rounded-md font-semibold cursor-pointer transition-all duration-200 hover:bg-red-600 hover:-translate-y-0.5"
          @click="logout"
        >
          {{ $t('common.logout') }}
        </button>
      </template>

      <!-- Mobile Menu Button (visible only on small screens) -->
      <button 
        @click="toggleMobileMenu"
        class="md:hidden p-2 ml-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300"
      >
        <svg
          class="w-6 h-6 text-gray-800"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          ></path>
        </svg>
      </button>
    </div>

    <!-- Mobile Menu Dropdown (optional - add if you need extra menu items) -->
    <div 
      v-if="showMobileMenu"
      class="md:hidden absolute top-16 right-0 w-48 bg-white shadow-lg py-2 px-4 z-40 border border-gray-100 rounded-md"
    >
      <!-- Add your additional mobile menu items here -->
      <router-link to="/about" class="block py-2 hover:bg-gray-100">About</router-link>
      <router-link to="/contact" class="block py-2 hover:bg-gray-100">Contact</router-link>
    </div>
  </header>
</template>



<script setup>
import apiURL from '@/api/config';
import flagEN from '@/assets/flags/en.png';
import flagKH from '@/assets/flags/kh.png';
import flagZH from '@/assets/flags/zh.png';
import { useStore } from '@/store/useStore';
import axios from 'axios';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

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
    const userId = localStorage.getItem('userId');
    
    if (!token || !userId) return;
    
    const res = await axios.get(`${apiURL}/api/getAllDocs/User`, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        dynamicConditions: JSON.stringify([
          { field: '_id', operator: '==', value: userId }
        ])
      }
    });
    
    if (res.data.success && res.data.data.length > 0) {
      const userData = res.data.data[0];
      profileName.value = userData.name || 'User';
      profileImage.value = userData.profilePicture || require('@/assets/default-profile.png');
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
  localStorage.clear();
  store.clearAuth();
  router.push('/login');
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
