<template>
  <div class="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-4">
    <div class="w-full max-w-sm bg-white p-8 rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">{{ t('forgotPassword') }}</h2>

      <!-- Step 1: Phone Number Entry -->
      <div v-if="currentStep === 1">
        <!-- Phone Number -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('phone') }}</label>
          <input
            type="tel"
            v-model="phone"
            placeholder="e.g., 012345678"
            class="w-full border rounded-md p-2 focus:outline-none focus:border-yellow-400"
          />
        </div>

        <button
          class="w-full bg-green-500 text-white font-bold py-2 rounded hover:bg-green-600 transition"
          @click="sendResetOtp"
          :disabled="loading"
        >
          <span v-if="loading">{{ t('sending') }}</span>
          <span v-else>{{ t('sendResetCode') }}</span>
        </button>
      </div>

      <!-- Step 2: OTP Verification and New Password -->
      <div v-if="currentStep === 2">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('enterOTP') }}</label>
          <input
            type="text"
            v-model="otp"
            placeholder="Enter OTP"
            class="w-full border rounded-md p-2 focus:outline-none focus:border-yellow-400"
          />
          <p class="text-sm text-gray-500 mt-1">{{ t('otpSent') }} {{ phone }}</p>
        </div>

        <!-- New Password -->
        <div class="mb-4 relative">
          <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('newPassword') }}</label>
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="newPassword"
            placeholder="********"
            class="w-full border rounded-md p-2 focus:outline-none focus:border-yellow-400"
          />
          <!-- Use Font Awesome for eye/eye-slash toggle -->
          <i 
            v-if="showPassword" 
            class="fa-solid fa-eye absolute right-3 top-8 text-gray-500 cursor-pointer"
            @click="showPassword = false"
          ></i>
          <i 
            v-else 
            class="fa-solid fa-eye-slash absolute right-3 top-8 text-gray-500 cursor-pointer"
            @click="showPassword = true"
          ></i>
        </div>

        <!-- Confirm New Password -->
        <div class="mb-6 relative">
          <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('confirmNewPassword') }}</label>
          <input
            :type="showConfirmPassword ? 'text' : 'password'"
            v-model="confirmPassword"
            placeholder="********"
            class="w-full border rounded-md p-2 focus:outline-none focus:border-yellow-400"
            :class="{'border-red-500': confirmPassword && newPassword !== confirmPassword,
             'border-green-500': confirmPassword && newPassword === confirmPassword && confirmPassword.length > 0}"
          />
          <i
            v-if="showConfirmPassword"
            class="fa-solid fa-eye absolute right-3 top-8 text-gray-500 cursor-pointer"
            @click="showConfirmPassword = false"
            tabindex="-1"
          ></i>
          <i
            v-else
            class="fa-solid fa-eye-slash absolute right-3 top-8 text-gray-500 cursor-pointer"
            @click="showConfirmPassword = true"
            tabindex="-1"
          ></i>
          
          <!-- Password match status message -->
          <div v-if="confirmPassword" class="mt-1 text-sm">
            <span 
              v-if="newPassword === confirmPassword && confirmPassword.length > 0" 
              class="text-green-600 flex items-center"
            >
              <i class="fa-solid fa-check mr-1"></i>
              {{ t('passwordsMatch') }}
            </span>
            <span 
              v-else-if="confirmPassword.length > 0" 
              class="text-red-600 flex items-center"
            >
              <i class="fa-solid fa-times mr-1"></i>
              {{ t('passwordsDoNotMatch') }}
            </span>
          </div>
        </div>

        <button
          class="w-full bg-green-500 text-white font-bold py-2 rounded hover:bg-green-600 transition mb-3"
          @click="resetPassword"
          :disabled="loading || newPassword !== confirmPassword"
        >
          <span v-if="loading">{{ t('resetting') }}</span>
          <span v-else>{{ t('resetPassword') }}</span>
        </button>

        <button
          class="w-full bg-gray-200 text-gray-700 font-bold py-2 rounded hover:bg-gray-300 transition"
          @click="resendOtp"
          :disabled="loading || resendDisabled"
        >
          <span v-if="resendDisabled">{{ t('resendIn') }} {{ resendTimer }}</span>
          <span v-else>{{ t('resendOTP') }}</span>
        </button>
      </div>

      <router-link to="/login" class="block mt-4 text-center text-sm text-gray-600 hover:underline">
        {{ t('backToLogin') }}
      </router-link>
    </div>
  </div>
</template>

<script setup>
import api from '@/api/config';
import axios from 'axios';
import Swal from 'sweetalert2';
import { onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const router = useRouter();
const { t } = useI18n();

const phone = ref('');
const otp = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const loading = ref(false);
const currentStep = ref(1);
const verificationId = ref('');
const resendDisabled = ref(false);
const resendTimer = ref(60);
let resendInterval = null;

// Function to start resend timer
function startResendTimer() {
  resendDisabled.value = true;
  resendTimer.value = 60;
  resendInterval = setInterval(() => {
    resendTimer.value--;
    if (resendTimer.value <= 0) {
      clearInterval(resendInterval);
      resendDisabled.value = false;
    }
  }, 1000);
}

// Clear interval when component is unmounted
onUnmounted(() => {
  if (resendInterval) clearInterval(resendInterval);
});

// Function to send OTP for password reset
async function sendResetOtp() {
  if (!phone.value) {
    Swal.fire({ icon: 'warning', title: t('enterPhone') });
    return;
  }
  
  if (!isValidCambodianPhone(phone.value)) {
    Swal.fire({ 
      icon: 'warning', 
      title: t('invalidPhoneFormat'),
      text: 'Please enter a valid Cambodian phone number (e.g., 012345678)'
    });
    return;
  }

  loading.value = true;

  try {
    // Format the phone number for Twilio (E.164 format)
    const formattedPhone = formatPhoneNumber(phone.value);
    
    console.log('Sending reset verification to:', formattedPhone);
    
    const response = await axios.post(`${api}/api/phone/forgot-password`, {
      phoneNumber: formattedPhone
    });

    console.log('Send reset OTP response:', response.data);

    if (response.data.success) {
      verificationId.value = response.data.verificationId;
      currentStep.value = 2; // Move to OTP input screen
      startResendTimer();
      Swal.fire({ 
        icon: 'success', 
        title: t('otpSentSuccess'),
        text: t('checkPhoneForCode'),
        timer: 3000,
        showConfirmButton: false
      });
    } else {
      Swal.fire({ icon: 'error', title: response.data.message });
    }
  } catch (err) {
    console.error('Error sending reset OTP:', err);
    
    let errorMessage = t('tryAgain');
    
    if (err.response?.status === 404) {
      errorMessage = 'No account found with this phone number.';
    } else if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    }
    
    Swal.fire({
      icon: 'error',
      title: t('otpSendFailed'),
      text: errorMessage
    });
  } finally {
    loading.value = false;
  }
}

// Function to verify OTP and reset password
async function resetPassword() {
  if (!otp.value) {
    Swal.fire({ icon: 'warning', title: t('enterOTP') });
    return;
  }
  
  if (!newPassword.value) {
    Swal.fire({ icon: 'warning', title: t('enterNewPassword') });
    return;
  }
  
  if (newPassword.value !== confirmPassword.value) {
    Swal.fire({ 
      icon: 'error', 
      title: t('passwordMismatch'),
      text: t('passwordsMustMatch')
    });
    return;
  }
  
  if (newPassword.value.length < 6) {
    Swal.fire({ 
      icon: 'warning', 
      title: t('passwordTooShort'),
      text: t('passwordMinLength')
    });
    return;
  }

  loading.value = true;

  try {
    const response = await axios.post(`${api}/api/phone/verify-reset-otp`, {
      verificationId: verificationId.value,
      otp: otp.value,
      newPassword: newPassword.value
    });

    console.log('Reset password response:', response.data);

    if (response.data.success && response.data.token) {
      // Store authentication data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Set axios default headers for all future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      
      // Show success message
      Swal.fire({
        icon: 'success',
        title: t('passwordResetSuccess'),
        text: t('passwordResetSuccessMessage'),
        timer: 2000,
        showConfirmButton: false
      }).then(() => {
        // Redirect to products page or dashboard
        router.push('/product');
      });
    } else {
      Swal.fire({ icon: 'error', title: response.data.message });
    }
  } catch (err) {
    console.error('Reset password error:', err);
    
    let errorMessage = t('verificationFailed');
    
    if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    }
    
    Swal.fire({
      icon: 'error',
      title: t('resetPasswordFailed'),
      text: errorMessage
    });
  } finally {
    loading.value = false;
  }
}

async function resendOtp() {
  await sendResetOtp();
}

// Helper function to format phone numbers for international use
function formatPhoneNumber(phoneNumber, countryCode = '855') {
  // Remove any non-digit characters
  let cleaned = phoneNumber.replace(/\D/g, '');
  
  // If the number starts with a leading 0, remove it
  if (cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1);
  }
  
  // If number already has country code (e.g. starts with 855), don't add it again
  if (cleaned.startsWith(countryCode)) {
    return '+' + cleaned;
  }
  
  // Otherwise, add the + and country code
  return '+' + countryCode + cleaned;
}

// Function to validate Cambodian phone numbers
function isValidCambodianPhone(phoneNumber) {
  // Strip all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Check if it's a valid Cambodian format
  // Typically 9-10 digits (possibly with 0 prefix) or 12-13 digits (with country code)
  if (cleaned.length === 9 || 
      (cleaned.length === 10 && cleaned.startsWith('0')) ||
      (cleaned.length === 12 && cleaned.startsWith('855')) ||
      (cleaned.length === 13 && cleaned.startsWith('8550'))) {
    return true;
  }
  
  return false;
}
</script>

<style scoped></style>
