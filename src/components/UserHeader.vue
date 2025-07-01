<template>
  <header class="flex justify-between items-center px-8 py-4 bg-white shadow-md sticky top-0 z-50">
    <!-- Logo/Brand -->
    <div class="flex items-center gap-4 cursor-pointer" @click="navigateToAdmin">
      <img src="@/assets/rice.png" alt="Admin Logo" class="h-9 w-auto">
      <h1 class="text-xl font-semibold text-gray-800">{{ $t ('companyName') }}</h1>
    </div>

    <!-- Right Side Controls -->
    <div class="flex items-center gap-6">
      <!-- Translate Button -->
      <button 
        class="bg-transparent border-none px-3 py-2 rounded-md text-slate-500 font-medium cursor-pointer transition-all duration-200 hover:bg-slate-100 hover:text-green-600"
        @click="toggleLanguage"
      >
        <span>{{ currentLanguage }}</span>
      </button>


      <!-- Logout Button -->
      <button 
        class="bg-red-800 text-white border-none px-6 py-3 rounded-md font-semibold cursor-pointer transition-all duration-200 hover:bg-red-600 hover:-translate-y-0.5"
        @click="logout"
      >
        {{ $t('logout') }}
      </button>

    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from '@/store/useStore';
import { useI18n } from 'vue-i18n'; 

const router = useRouter();
const store = useStore();

const { locale } = useI18n();  

const currentLanguage = ref('EN');  

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

const logout = () => {
  store.clearAuth();
  router.push('/login');
};


</script>

<style scoped>
.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}

.brand {
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
}

.logo {
  height: 36px;
  width: auto;
}

.app-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.right-controls {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.translate-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #64748b;
  font-weight: 500;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.translate-btn:hover {
  background: #f1f5f9;
  color: #42b983;
}

.logout-btn {
  background: #bf000a;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.logout-btn:hover {
  background: red;
  transform: translateY(-1px);
}
</style>