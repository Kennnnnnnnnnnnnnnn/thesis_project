<template>
  <div class="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-4">
    <div class="w-full max-w-sm bg-white p-8 rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">{{ t('register.title') }}</h2>

      <!-- Phone Number -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('register.phone') }}</label>
        <input
          type="tel"
          v-model="phone"
          placeholder="e.g., 012345678"
          class="w-full border rounded-md p-2 focus:outline-none focus:border-yellow-400"
        />
      </div>

      <!-- Password -->
      <div class="mb-4 relative">
        <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('register.password') }}</label>
        <input
          :type="showPassword ? 'text' : 'password'"
          v-model="password"
          placeholder="********"
          class="w-full border rounded-md p-2 focus:outline-none focus:border-yellow-400"
        />
        <button
          type="button"
          class="absolute right-3 top-8 text-gray-500 focus:outline-none"
          @click="showPassword = !showPassword"
        >
          <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2"
            viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10S6.477 0 12 0s10 4.477 10 10a10.05 10.05 0 01-1.875 5.825M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2"
            viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10S6.477 0 12 0s10 4.477 10 10a10.05 10.05 0 01-1.875 5.825M15 12a3 3 0 11-6 0 3 3 0 016 0zM3 3l18 18" />
          </svg>
        </button>
      </div>

      <!-- Confirm Password -->
      <div class="mb-6 relative">
        <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('register.confirmPassword') }}</label>
        <input
          :type="showConfirmPassword ? 'text' : 'password'"
          v-model="confirmPassword"
          placeholder="********"
          class="w-full border rounded-md p-2 focus:outline-none focus:border-yellow-400"
        />
        <button
          type="button"
          class="absolute right-3 top-8 text-gray-500 focus:outline-none"
          @click="showConfirmPassword = !showConfirmPassword"
        >
          <svg v-if="showConfirmPassword" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2"
            viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10S6.477 0 12 0s10 4.477 10 10a10.05 10.05 0 01-1.875 5.825M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2"
            viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10S6.477 0 12 0s10 4.477 10 10a10.05 10.05 0 01-1.875 5.825M15 12a3 3 0 11-6 0 3 3 0 016 0zM3 3l18 18" />
          </svg>
        </button>
      </div>

      <button
        class="w-full bg-green-500 text-white font-bold py-2 rounded hover:bg-green-600 transition"
        @click="submitRegister"
      >
        {{ t('register.registerBtn') }}
      </button>

      <router-link to="/login" class="block mt-4 text-center text-sm text-gray-600 hover:underline">
        {{ t('register.alreadyHaveAccount') }}
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import Swal from 'sweetalert2';
import axios from 'axios';
import api from '@/api/config';

const router = useRouter();
const { t } = useI18n();

const phone = ref('');
const password = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);

async function submitRegister() {
  if (!phone.value || !password.value || !confirmPassword.value) {
    Swal.fire({ icon: 'warning', title: t('register.fillAllFields') });
    return;
  }
  if (password.value !== confirmPassword.value) {
    Swal.fire({ icon: 'warning', title: t('register.passwordMismatch') });
    return;
  }

  try {
    const token = localStorage.getItem('token');

    const response = await axios.post(`${api}/api/auth/register`, {
      phoneNumber: phone.value,
      password: password.value
    }, {
      headers: {
        Authorization: token ? `Bearer ${token}` : ''
      }
    });

    if (response.data.success) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      Swal.fire({
        icon: 'success',
        title: t('register.registerSuccess'),
        timer: 1000,
        showConfirmButton: false
      }).then(() => {
        router.push('/home').then(() => {
          window.location.reload();
        });
      });
    } else {
      Swal.fire({ icon: 'error', title: t('register.registerFailed'), text: response.data.message });
    }

  } catch (err) {
    console.error('Register error:', err);
    Swal.fire({
      icon: 'error',
      title: t('register.registerFailed'),
      text: err.response?.data?.message || t('register.tryAgain')
    });
  }
}

</script>

<style scoped></style>
