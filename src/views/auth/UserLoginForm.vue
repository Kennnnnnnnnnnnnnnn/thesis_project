<template>
  <div
    class="flex justify-center items-center min-h-screen bg-yellow-50 p-8 bg-[radial-gradient(#ffe68033_1px,transparent_1px)] bg-[length:20px_20px]">
    <SplashScreen :isSplashVisible="isSplashVisible" />
    <div class="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md border border-yellow-200 animate-fadeInUp">
      <div class="mb-8 text-center">
        <h2 class="text-yellow-800 text-2xl font-bold mb-2"> Welcome To Our Website </h2>
      </div>

      <form @submit.prevent="handleLogin">
        <div class="mb-5">
          <label class="block font-medium mb-2 text-yellow-800 text-sm">Phone Number</label>
          <input type="text" v-model="displayPhoneNumber"
            class="w-full py-3 px-4 border border-yellow-200 rounded-xl text-base bg-yellow-50 text-yellow-900 transition-all focus:outline-none focus:border-yellow-400 focus:bg-white placeholder-yellow-700 placeholder-opacity-60"
            placeholder="phone number" required>
        </div>

        <div class="mb-5">
          <label class="block font-medium mb-2 text-yellow-800 text-sm">Password</label>
          <input type="password" v-model="password"
            class="w-full py-3 px-4 border border-yellow-200 rounded-xl text-base bg-yellow-50 text-yellow-900 transition-all focus:outline-none focus:border-yellow-400 focus:bg-white placeholder-yellow-700 placeholder-opacity-60"
            placeholder="password" required>
          <div class="flex justify-end mt-2">
            <router-link to="/forgot-password" class="text-xs text-yellow-700 hover:text-yellow-800 hover:underline">
              Forgot Password?
            </router-link>
          </div>
        </div>

        <button type="submit"
          class="w-full bg-yellow-400 text-yellow-900 border-none py-4 font-semibold cursor-pointer rounded-xl text-base transition-all mt-2 flex items-center justify-center gap-2 hover:bg-yellow-300 active:translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
          :class="{ 'pointer-events-none': isLoading }" :disabled="isLoading">
          <span v-if="!isLoading">Login</span>
        </button>

        <p v-if="errorMessage"
          class="text-red-600 mt-5 text-center text-sm py-3 bg-red-100 rounded-lg border-l-4 border-red-600">
          ⚠️ {{ errorMessage }}
        </p>
      </form>




      <div class="mt-6 text-center text-sm text-yellow-800">
        <p>Don't have an account? <router-link to="/register"
            class="text-yellow-700 font-medium hover:text-yellow-800 underline transition">Register</router-link></p>

      </div>


    </div>
  </div>
</template>

<script setup>
import apiURL from '@/api/config';
import { decodeJwt } from '@/composables/jwt';
import { useStore } from '@/store/useStore';
import { getDeviceDetails } from '@/utils/getDeviceDetails';
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import SplashScreen from '@/components/SplashScreen.vue';

const isSplashVisible = ref(false);


// Refs and stores
const store = useStore();
const router = useRouter();

const displayPhoneNumber = ref('');
const password = ref('');
const isErrorLogin = ref(false);
const isPermissionLogin = ref(false);
const showSuccessMessage = ref(false);
const errorMessage = ref('');
const isLoading = ref(false);

// Login handler
const handleLogin = async () => {
  try {
    console.log('Sending login request with:', {
      displayPhoneNumber: displayPhoneNumber.value,
      passwordLength: password.value.length
    });

    const response = await axios.post(`${apiURL}/api/customer-auth/login`, {
      displayPhoneNumber: displayPhoneNumber.value,
      password: password.value
    });

    if (!response.data.token) {
      throw new Error('No token received from server');
    }

    const tokenLogin = response.data.token;
    const decodedToken = await decodeJwt(tokenLogin);

    // Get user details using the token
    let userDoc;
    if (decodedToken.role === 'customer') {
      // For customers, use the decoded token data directly
      userDoc = {
        _id: decodedToken._id,
        role: decodedToken.role,
        status: true // Assuming active by default for customers
      };
    } else {
      // For other roles, fetch user details
      try {
        const userResponse = await axios.get(
          `${apiURL}/api/getAllDocs/User`,
          {
            headers: {
              'Authorization': `Bearer ${tokenLogin}`,
              'Content-Type': 'application/json'
            },
            params: {
              dynamicConditions: JSON.stringify([{
                field: 'displayPhoneNumber',
                operator: '==',
                value: displayPhoneNumber.value,
              }]),
            }
          }
        );
        userDoc = userResponse.data.data[0];
      } catch (error) {
        // If we can't fetch user details, use token data
        userDoc = {
          _id: decodedToken._id,
          role: decodedToken.role,
          status: true
        };
      }
    }

    if (!userDoc) {
      throw new Error('User not found');
    }

    if (userDoc.status === false) {
      isPermissionLogin.value = true;
      errorMessage.value = 'Your account is inactive. Please contact support.';
      return;
    }

    // Store user information
    const userId = decodedToken._id || userDoc._id;
    const userRole = decodedToken.role || userDoc.role;

    // Set permissions based on role
    let userPermissions = [];
    if (userRole === 'customer') {
      // Customers only need basic access permissions
      userPermissions = [
        'read_product',
        'read_category',
        'create_customerorder',
        'read_customerorder',
        'update_customerorder',
        'create_order',
        'read_order',
        'read_transaction',
        'create_transaction',
        'update_transaction',
        'update_product',
        'read_user',           // Permission to read user data
        'update_user',         // Permission to update user data
        'read_stock',          // Permission to read stock data
        'update_stock'         // Permission to update stock
      ];
    } else if (userRole === 'superadmin') {
      // Superadmin gets all permissions
      userPermissions = [
        // Delivery Permissions
        'create_delivery', 'read_delivery', 'update_delivery', 'delete_delivery',
        // Category Permissions
        'create_category', 'read_category', 'update_category', 'delete_category',
        // Product Permissions
        'create_product', 'read_product', 'update_product', 'delete_product',
        // Discount Permissions
        'create_discount', 'read_discount', 'update_discount', 'delete_discount',
        // Supplier Permissions
        'create_supplier', 'read_supplier', 'update_supplier', 'delete_supplier',
        // Stock Permissions
        'create_stock', 'read_stock', 'update_stock', 'delete_stock',
        // Order Permissions
        'create_order', 'read_order', 'update_order', 'delete_order',
        // Customer Order Permissions
        'create_customerOrder', 'read_customerOrder', 'update_customerOrder', 'delete_customerOrder',
        // Transaction Permissions
        'create_transaction', 'read_transaction', 'update_transaction', 'delete_transaction',
        // User Permissions
        'create_user', 'read_user', 'update_user', 'delete_user',
        // Role Permissions
        'create_role', 'read_role', 'update_role', 'delete_role'
      ];
    } else if (userRole === 'admin') {
      // Admin gets all permissions except role management
      userPermissions = [
        // Delivery Permissions
        'create_delivery', 'read_delivery', 'update_delivery', 'delete_delivery',
        // Category Permissions
        'create_category', 'read_category', 'update_category', 'delete_category',
        // Product Permissions
        'create_product', 'read_product', 'update_product', 'delete_product',
        // Discount Permissions
        'create_discount', 'read_discount', 'update_discount', 'delete_discount',
        // Supplier Permissions
        'create_supplier', 'read_supplier', 'update_supplier', 'delete_supplier',
        // Stock Permissions
        'create_stock', 'read_stock', 'update_stock', 'delete_stock',
        // Order Permissions
        'create_order', 'read_order', 'update_order', 'delete_order',
        // Customer Order Permissions
        'create_customerOrder', 'read_customerOrder', 'update_customerOrder', 'delete_customerOrder',
        // Transaction Permissions
        'create_transaction', 'read_transaction', 'update_transaction', 'delete_transaction',
        // User Permissions
        'create_user', 'read_user', 'update_user', 'delete_user'
      ];
    } else if (userRole === 'delivery') {
      // Delivery gets only relevant permissions
      userPermissions = [
        'read_order',
        'update_order',
        'read_customerOrder',
        'update_customerOrder',
        'read_product',
        'read_category'
      ];
    } else {
      // For any other role, use their actual permissions
      userPermissions = userDoc.permissions || [];
    }

    // Update store
    store.setUserId(userId);
    store.setUserRole(userRole);
    store.setUserPermissions(userPermissions);

    // Store in localStorage
    localStorage.setItem('token', tokenLogin);
    localStorage.setItem('userId', userId);
    localStorage.setItem('userRole', userRole);
    localStorage.setItem('userPermissions', JSON.stringify(userPermissions));

    // Set token in store
    store.setToken(tokenLogin);

    // Create user login log
    try {
      // Gather additional information for the log
      const currentDate = new Date();
      const deviceDetails = getDeviceDetails();
      const deviceUUID = deviceDetails.deviceId || 'unknown-device';
      // const locationInfo = await fetchUserLocation();

      const logData = {
        fields: {
          userId: userId,
          deviceLog: {
            deviceInfo: deviceDetails,
            deviceId: deviceUUID,
            browser: deviceDetails.browser,
            os: deviceDetails.os,
            ip: deviceDetails.ip || 'unknown',
            loginTime: currentDate.toISOString(),
            userRole: userRole,
          },
          createdAt: currentDate
        }
      };

      // Send the log data to the server
      await axios.post(
        `${apiURL}/api/insertDoc/UserLog`,
        logData,
        {
          headers: {
            'Authorization': `Bearer ${tokenLogin}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("User login activity logged successfully");
    } catch (logError) {
      // Just log the error but don't interrupt the login flow
      console.error("Failed to log user activity:", logError);
    }

    showSuccessMessage.value = true;
    setTimeout(() => {
      // Role-based routing
      if (["superadmin", "admin", "delivery"].includes(userRole)) {
        isSplashVisible.value = false;
        router.push("/admin/");
      } else if (userRole === "customer") {
        isSplashVisible.value = false;
        router.push("/home");
      } else {
        isSplashVisible.value = false;
        router.push("/");
      }
    }, 2000);
    isSplashVisible.value = true;
  } catch (err) {
    console.error('Login error details:', err.response?.data);
    isLoading.value = false;
    isErrorLogin.value = true;
    errorMessage.value = err.response?.data?.message || err.message || 'Login failed. Please try again.';
    displayPhoneNumber.value = "";
    password.value = "";
  } finally {
    isLoading.value = false;
  }
};


</script>

<style>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 480px) {
  .login-page {
    padding: 1.5rem;
  }

  .login-container {
    padding: 1.75rem;
  }
}
</style>