<template>
  <!-- Header -->
  <header class="flex justify-between items-center px-4 sm:px-8 py-3 sm:py-4 bg-white shadow-md sticky top-0 z-50">
    <!-- Logo -->
    <div class="flex items-center gap-2 sm:gap-4 cursor-pointer" @click="navigateToHome">
      <img src="@/assets/rice.png" alt="Logo" class="h-7 sm:h-9 w-auto" />
      <h1 class="text-lg sm:text-xl font-semibold text-gray-800">{{ $t('companyName') }}</h1>
    </div>

    <!-- Location Display -->
    <div v-if="locationName" class="flex items-center gap-2">
      <div @click="openInMaps"
           class="flex items-center px-2 sm:px-3 py-1 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200 transition-colors duration-200"
           title="Click to view in Google Maps">
        <svg class="w-4 h-4 text-gray-600 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span class="text-xs sm:text-sm font-medium text-gray-700 truncate max-w-[100px] sm:max-w-none">
          {{ formattedLocation }}
        </span>
      </div>
    </div>

    <!-- Right Controls -->
    <div class="flex items-center gap-2 sm:gap-4 md:gap-6">
      <!-- Language -->
      <button @click="toggleLanguage" class="p-2 rounded-md hover:bg-gray-100 transition">
        <img :src="currentFlag" alt="Lang" class="h-7 w-7 object-contain" />
      </button>

      <!-- Auth desktop -->
      <template v-if="!isAuthenticated">
        <div class="hidden md:flex items-center gap-3">
          <router-link to="/register" class="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">
            {{ $t('common.register') }}
          </router-link>
          <router-link to="/user-login" class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
            {{ $t('common.login') }}
          </router-link>
        </div>
      </template>

      <template v-else>
        <div class="hidden md:flex items-center gap-3">
          <router-link to="/profile"
                       class="flex items-center gap-2 px-3 rounded bg-slate-100 text-gray-800 hover:bg-slate-200">
            <img :src="profileImage" alt="Profile" class="w-8 h-8 rounded-full object-cover" />
            <span>{{ profileName }}</span>
          </router-link>
          <button @click="logout" class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
            {{ $t('common.logout') }}
          </button>
        </div>
      </template>

      <!-- Hamburger -->
      <button v-if="isMobile" @click="toggleMobileMenu"
              class="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-300">
        <svg class="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
  </header>

  <!-- Mobile Menu Overlay -->
  <div v-if="isMobileMenuOpen" class="fixed inset-0 z-[999]">
    <!-- Backdrop -->
    <div @click="closeMobileMenu" class="absolute inset-0 bg-black opacity-25"></div>

    <!-- Sidebar -->
    <div class="absolute top-0 right-0 h-full w-2/3 sm:w-1/2 bg-white shadow-lg z-[1000] flex flex-col" @click.stop>
      <!-- Close -->
      <button @click="closeMobileMenu" class="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 transition">
        <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Profile (Mobile) -->
      <div class="flex flex-col items-center mt-20 mb-8">
        <img :src="profileImage" alt="Profile" class="w-20 h-20 rounded-full object-cover border-4 border-yellow-400" />
        <p class="mt-3 text-lg font-semibold text-gray-800">{{ profileName }}</p>
      </div>

      <!-- Navigation -->
      <ul class="px-6 space-y-6 flex-1 overflow-y-auto">
        <li v-for="item in dynamicNavItems" :key="item.name">
          <router-link @click="closeMobileMenu" :to="item.route"
                       class="flex items-center justify-between text-gray-700 font-medium text-base hover:text-yellow-500">
            <span class="flex items-center gap-3">
              <svg v-if="item.icon" class="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <use :href="`#${item.icon}`" />
              </svg>
              {{ $t(item.name) }}
            </span>
            <span v-if="item.badge" class="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
              {{ item.badge }}
            </span>
          </router-link>
        </li>

        <!-- Auth Links -->
        <li>
          <template v-if="isAuthenticated">
            <button @click="logout"
                    class="flex items-center gap-3 w-full text-left text-red-600 font-medium text-base hover:text-red-700">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {{ $t('common.logout') }}
            </button>
          </template>

          <template v-else>
            <router-link to="/register"
                         class="flex items-center gap-3 text-yellow-600 font-medium text-base hover:text-yellow-700">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              {{ $t('common.register') }}
            </router-link>
            <router-link to="/user-login"
                         class="flex items-center gap-3 text-green-600 font-medium text-base hover:text-green-700 mt-4">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M12 5l7 7-7 7" />
              </svg>
              {{ $t('common.login') }}
            </router-link>
          </template>
        </li>
      </ul>
    </div>
  </div>

  <!-- Global SVG symbols (keep as-is) -->
  <svg style="display: none;">
    <symbol id="icon-home" viewBox="0 0 24 24">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </symbol>
    <symbol id="icon-products" viewBox="0 0 24 24">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </symbol>
    <symbol id="icon-heart" viewBox="0 0 24 24">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l7.78-7.78a5.5 5.5 0 000-7.78z" />
    </symbol>
    <symbol id="icon-cart" viewBox="0 0 24 24">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
    </symbol>
    <symbol id="icon-user" viewBox="0 0 24 24">
      <circle cx="12" cy="7" r="4" />
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    </symbol>
    <symbol id="icon-history" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </symbol>
    <symbol id="icon-envelope" viewBox="0 0 24 24">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </symbol>
  </svg>
</template>

<script setup>
import apiURL from '@/api/config'
import flagEN from '@/assets/flags/en.png'
import flagKH from '@/assets/flags/kh.png'
import flagZH from '@/assets/flags/zh.png'
import { useStore } from '@/store/useStore'
import axios from 'axios'
import { computed, onUnmounted ,onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const router = useRouter()
const store = useStore()
const { locale } = useI18n()

const currentFlag = ref(flagEN)
const profileName = ref('')
const profileImage = ref(require('@/assets/default-profile.png'))
const userLocation = ref({ latitude: null, longitude: null })
const locationName = ref('')
const formattedLocation = computed(() => {
  return locationName.value || ''
})

const isMobileMenuOpen = ref(false)
const isMobile = ref(false)


const toggleMobileMenu = () => {
  isMobileMenuOpen.value = true
}
const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const isAuthenticated = computed(() => {
  const token = localStorage.getItem('token')
  return !!(token || store.isAuthenticated)
})

const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })
      },
      (error) => {
        reject(error)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
  })
}

const fetchProfile = async () => {
  try {
    // Always get current device location for display
    const location = await getUserLocation();
    userLocation.value = location;
    try {
      locationName.value = await getLocationNameFromCoordinates(location.latitude, location.longitude);
    } catch (error) {
      console.error('Error getting location name:', error);
      locationName.value = 'Cambodia';
    }

    // Optionally update user profile in backend if authenticated
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (token && userId) {
      try {
        const res = await axios.get(`${apiURL}/api/getAllDocs/User`, {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            dynamicConditions: JSON.stringify([{ field: '_id', operator: '==', value: userId }])
          }
        });
        if (res.data.success && res.data.data.length > 0) {
          const user = res.data.data[0];
          profileName.value = user.name || 'User';
          profileImage.value = user.profilePicture || require('@/assets/default-profile.png');
          // Optionally update backend with new location
          await axios({
            method: 'patch',
            url: `${apiURL}/api/updateDoc/User/${userId}`,
            data: {
              fields: {
                latitude: location.latitude,
                longitude: location.longitude,
                isLocationUpdate: true
              }
            },
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
        }
      } catch (err) {
        console.error('Profile fetch error:', err);
      }
    }
  } catch (err) {
    console.error('Failed to get device location:', err);
    locationName.value = 'Cambodia';
  }
}

// Separate function for getting location name to handle CORS properly
const getLocationNameFromCoordinates = async (latitude, longitude) => {
  try {
    const response = await axios.get(`${apiURL}/api/geocode`, {
      params: { latitude, longitude }
    });
    // Prefer commune > district > city > country
    const { commune, district, city, country } = response.data;
    return commune || district || city || country || 'Cambodia';
  } catch (error) {
    console.error('Error getting location name:', error);
    return 'Cambodia';
  }
}

const openInMaps = () => {
  if (userLocation.value.latitude && userLocation.value.longitude) {
    // Create Google Maps URL with the location
    const mapsUrl = `https://www.google.com/maps?q=${userLocation.value.latitude},${userLocation.value.longitude}`
    // Open in a new tab
    window.open(mapsUrl, '_blank')
  }
}

const toggleLanguage = () => {
  if (currentFlag.value === flagEN) {
    currentFlag.value = flagKH
    locale.value = 'kh'
  } else if (currentFlag.value === flagKH) {
    currentFlag.value = flagZH
    locale.value = 'zh'
  } else {
    currentFlag.value = flagEN
    locale.value = 'en'
  }
}

const navigateToHome = () => router.push('/home')
const logout = () => {
  localStorage.clear()
  store.clearAuth()
  router.push('/user-login')
}

// Setup nav items
const cartCount = ref(JSON.parse(localStorage.getItem("cartCount")) || 0)
const navItems = ref([
  { name: 'nav.home', route: '/home', icon: 'icon-home' },
  { name: 'nav.products', route: '/product', icon: 'icon-products' },
  { name: 'nav.favorites', route: '/favorite', icon: 'icon-heart' },
  { name: 'nav.cart', route: '/cart', icon: 'icon-cart', badge: cartCount.value },
  { name: 'nav.profile', route: '/profile', icon: 'icon-user' },
  { name: 'nav.history', route: '/history', icon: 'icon-history' },
  { name: 'nav.contact', route: '/contact', icon: 'icon-envelope' }
])
const dynamicNavItems = computed(() => {
  return navItems.value.map(item => {
    if (item.name === 'nav.cart') {
      return { ...item, badge: cartCount.value }
    }
    return item
  })
})

// Handle resize for mobile detection
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
}
// Optional: Escape to close
const onEscapeKey = (e) => {
  if (e.key === 'Escape') closeMobileMenu()
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  window.addEventListener('keydown', onEscapeKey)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
  window.removeEventListener('keydown', onEscapeKey)
})

</script>