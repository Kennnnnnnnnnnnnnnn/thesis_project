<template>
  <div class="flex flex-col justify-center items-center p-2 mt-20">
    <div class="w-full max-w-sm bg-white p-8 rounded-lg shadow-lg">
      <h2 class="text-xl font-bold text-center text-gray-800 mb-6">Register Form</h2>

      <!-- Step 1: Phone Number Entry -->
      <div v-if="currentStep === 1">
        <!-- Phone Number -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('phone') }}</label>
          <input
            type="tel"
            v-model="phone"
            placeholder="012345678"
            class="w-full border rounded-md p-2 focus:outline-none focus:border-yellow-400"
          />
        </div>

        <!-- Password -->
        <div class="mb-4 relative">
          <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('password') }}</label>
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
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

        <!-- Confirm Password -->
        <div class="mb-6 relative">
          <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('confirmPassword') }}</label>
          <input
            :type="showConfirmPassword ? 'text' : 'password'"
            v-model="confirmPassword"
            placeholder="********"
            class="w-full border rounded-md p-2 focus:outline-none focus:border-yellow-400"
            :class="{'border-red-500': confirmPassword && password !== confirmPassword,
             'border-green-500': confirmPassword && password === confirmPassword && confirmPassword.length > 0}"
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
              v-if="password === confirmPassword && confirmPassword.length > 0" 
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

        

        <div class="flex justify-center mt-4">
          <button
            class="w-20 bg-green-500 text-white font-bold py-2 rounded hover:bg-green-600 transition"
            @click="sendOtp"
            :disabled="loading"
          >
            <span v-if="loading">{{ t('sending') }}</span>
            <span v-else>{{ t('Verify') }}</span>
          </button>
        </div>

      </div>

      <!-- Step 2: OTP Verification -->
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

        <button
          class="w-full bg-green-500 text-white font-bold py-2 rounded hover:bg-green-600 transition mb-3"
          @click="verifyOtp"
          :disabled="loading"
        >
          <span v-if="loading">{{ t('verifying') }}</span>
          <span v-else>{{ t('verify') }}</span> <!-- Changed from 'Send' to 'verify' -->
        </button>

        <button
          class="w-full bg-gray-200 text-gray-700 font-bold py-2 rounded hover:bg-gray-300 transition"
          @click="resendOtp"
          :disabled="loading || resendDisabled"
        >
          <span v-if="resendDisabled">{{ t('resendIn') }} {{ resendTimer }}s</span>
          <span v-else>{{ t('resendOTP') }}</span>
        </button>
      </div>

      <router-link to="/user-login" class="block text-blue-400 mt-4 text-center text-sm text-gray-600 hover:underline">
        {{ t('Already Have Account? Login Now!') }}
      </router-link>
    </div>
  </div>
</template>

<script setup>
import api from '@/api/config';
import { useStore } from '@/store/useStore';
import axios from 'axios';
import Swal from 'sweetalert2';
import { onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const router = useRouter();
const { t } = useI18n();
const store = useStore();

const phone = ref('');
const password = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const otp = ref('');
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
  
  // Clear any existing interval
  if (resendInterval) {
    clearInterval(resendInterval);
  }
  
  resendInterval = setInterval(() => {
    resendTimer.value--;
    if (resendTimer.value <= 0) {
      clearInterval(resendInterval);
      resendDisabled.value = false;
      resendInterval = null;
    }
  }, 1000);
}

// Clear interval when component is unmounted
onUnmounted(() => {
  if (resendInterval) {
    clearInterval(resendInterval);
    resendInterval = null;
  }
});

// Complete sendOtp function with enhanced validation
async function sendOtp() {
  if (!phone.value) {
    Swal.fire({ icon: 'warning', title: t('enterPhone') });
    return;
  }
  
  if (!password.value) {
    Swal.fire({ icon: 'warning', title: t('enterPassword') });
    return;
  }
  
  if (!confirmPassword.value) {
    Swal.fire({ icon: 'warning', title: t('confirmYourPassword') });
    return;
  }
  
  if (password.value !== confirmPassword.value) {
    Swal.fire({ 
      icon: 'error', 
      title: t('passwordMismatch'),
      text: t('passwordsMustMatch')
    });
    return;
  }
  
  if (password.value.length < 6) {
    Swal.fire({ 
      icon: 'warning', 
      title: t('passwordTooShort'),
      text: t('passwordMinLength')
    });
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
    
    console.log('Sending verification to:', formattedPhone);
    
    const response = await axios.post(`${api}/api/customer-auth/send-otp`, {
      phoneNumber: formattedPhone,
      purpose: 'registration'
    });

    console.log('OTP Send Response:', response.data);

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
    console.error('Error sending OTP:', err);
    console.error('Error details:', err.response?.data);
    
    let errorMessage = t('tryAgain');
    
    if (err.response?.data?.twilioError === 60200) {
      errorMessage = 'Invalid phone number format. Please check your number and try again.';
    } else if (err.response?.data?.twilioError) {
      errorMessage = `Error code: ${err.response.data.twilioError}. ${err.response?.data?.message || ''}`;
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

// Separate function for resending OTP without validation
async function sendOtpRequest() {
  loading.value = true;

  try {
    // Format the phone number for Twilio (E.164 format)
    const formattedPhone = formatPhoneNumber(phone.value);
    
    
    const response = await axios.post(`${api}/api/customer-auth/send-otp`, {
      phoneNumber: formattedPhone,
      purpose: 'registration'
    });

    console.log('OTP Resend Response:', response.data);

    if (response.data.success) {
      verificationId.value = response.data.verificationId;
      startResendTimer();
      
      // Clear the OTP field for new attempt
      otp.value = '';
      
      Swal.fire({ 
        icon: 'success', 
        title: 'OTP Resent!',
        text: 'A new verification code has been sent to your phone.',
        timer: 2000,
        showConfirmButton: false
      });
    } else {
      Swal.fire({ icon: 'error', title: response.data.message });
    }
  } catch (err) {
    console.error('Error resending OTP:', err);
    
    let errorMessage = 'Failed to resend OTP. Please try again.';
    
    if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    }
    
    Swal.fire({
      icon: 'error',
      title: 'Resend Failed',
      text: errorMessage
    });
  } finally {
    loading.value = false;
  }
}

// Function to get user's geolocation
async function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        resolve(coords);
      },
      (error) => {
        console.error('Geolocation error:', error);
        reject(error);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
}

// Complete verifyOtp function with proper success handling and geolocation
async function verifyOtp() {
  if (!otp.value) {
    Swal.fire({ icon: 'warning', title: t('enterOTP') });
    return;
  }

  loading.value = true;

  try {
    // Use the same formatting as when sending the OTP
    const formattedPhone = formatPhoneNumber(phone.value);
    
    // Get user's geolocation
    let locationData = { latitude: null, longitude: null };
    try {
      const result = await Swal.fire({
        title: 'Location Access',
        text: 'Please allow access to your location for better service',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Allow',
        cancelButtonText: 'Skip'
      });

      if (result.isConfirmed) {
        try {
          locationData = await getUserLocation();
          console.log('User location obtained:', locationData);
        } catch (locError) {
          console.error('Failed to get location:', locError);
          // Show error message but continue with registration
          Swal.fire({
            icon: 'warning',
            title: 'Location Access Failed',
            text: 'Could not get your location, but registration will continue',
            timer: 2000
          });
        }
      }
    } catch (locationError) {
      console.error('Location dialog error:', locationError);
    }
    
    // Verify OTP and register in one step
    const response = await axios.post(`${api}/api/customer-auth/verify-otp`, {
      verificationId: verificationId.value,
      otp: otp.value,
      phoneNumber: formattedPhone,
      password: password.value,
      // Include location data in registration
      latitude: locationData.latitude,
      longitude: locationData.longitude
    });

    console.log('Verification and registration response:', response.data);

    if (response.data.success && response.data.token) {
      // Store authentication data for automatic login
      localStorage.setItem('token', response.data.token);
      
      // Make sure user object contains permissions before storing
      const userToStore = {
        ...response.data.user,
        permissions: response.data.user.permissions || [],
        latitude: locationData.latitude,
        longitude: locationData.longitude
      };
      localStorage.setItem('user', JSON.stringify(userToStore));
      
      // IMPORTANT: Set axios default headers for all future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      
      // Store user information in Pinia store
      try {
        // Extract user data from response
        const userId = response.data.user._id;
        const userPermissions = response.data.user.permissions || [];
        const userRole = response.data.user.role || 'customer';
        
        // Store in Pinia store
        store.setUserId(userId);
        store.setUserRole(userRole);
        store.setUserPermissions(userPermissions);
        store.setToken(response.data.token);
        
        // Also store in localStorage for persistence
        localStorage.setItem('userId', userId);
        localStorage.setItem('userRole', userRole);
        localStorage.setItem('userPermissions', JSON.stringify(userPermissions));
        
        // If we have location data, update the user profile with it
        if (locationData.latitude && locationData.longitude) {
          try {
            // Use the dynamic route endpoint to update User collection
            await axios.patch(`${api}/api/updateDoc/User/${userId}`, {
              fields: {
                latitude: locationData.latitude,
                longitude: locationData.longitude
              }
            }, {
              headers: {
                'Authorization': `Bearer ${response.data.token}`
              }
            });
            console.log('Location data updated in user profile');
          } catch (updateError) {
            console.error('Failed to update location data:', updateError);
          }
        }
      } catch (error) {
        console.error('Error storing user data:', error);
      }
      
      // Show success message
      Swal.fire({
        icon: 'success',
        title: t('registerSuccess'),
        text: 'You are now logged in!',
        timer: 2000,
        showConfirmButton: false
      }).then(() => {
        // Double check that token is properly stored before redirecting
        const storedToken = localStorage.getItem('token');
        console.log('Token stored in localStorage before redirect:', 
          storedToken ? storedToken.substring(0, 15) + '...' : 'No token found');
        
        // Verify Axios headers are set
        console.log('Authorization header in Axios:', 
          axios.defaults.headers.common['Authorization'] ? 'Set' : 'Not set');
        
        // Redirect to product page (already logged in)
        router.push('/user-login');
      });
    } else {
      Swal.fire({ icon: 'error', title: response.data.message || 'Registration failed' });
    }
  } catch (err) {
    console.error('Registration error:', err);
    let errorMessage = t('invalidOtp');
    
    if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    if (err.response?.data?.code === 20404) {
      errorMessage = 'Verification code has expired. Please request a new code.';
    }
    
    // Check if the phone number is already registered
    if (err.response?.status === 400 && err.response?.data?.message?.includes('already registered')) {
      errorMessage = 'This phone number is already registered. Please log in instead.';
      // Optionally redirect to login page after a delay
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    }
    
    Swal.fire({
      icon: 'error',
      title: t('registrationFailed'),
      text: errorMessage
    });
  } finally {
    loading.value = false;
  }
}

// Fixed resend OTP function
async function resendOtp() {
  if (resendDisabled.value || loading.value) {
    return;
  }

  console.log('Resending OTP...');
  
  // Use the separate function that doesn't change steps or validate passwords
  await sendOtpRequest();
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

// Original submitRegister function is replaced by the sendOtp and verifyOtp flow
</script>

<style scoped></style>