  <template>
    <header class="flex justify-between items-center px-4 sm:px-8 py-3 sm:py-4 bg-white shadow-md sticky top-0 z-50">
      <!-- Logo -->
      <div class="flex items-center gap-2 sm:gap-4 cursor-pointer" @click="navigateToHome">
        <img src="@/assets/rice.png" alt="Logo" class="h-7 sm:h-9 w-auto" />
        <h1 class="text-lg sm:text-xl font-semibold text-gray-800">{{ $t('companyName') }}</h1>
      </div>

      <!-- Right Controls -->
      <div class="flex items-center gap-2 sm:gap-4 md:gap-6">
        <!-- Language Switcher -->
        <button @click="toggleLanguage" class="p-2 rounded-md hover:bg-gray-100 transition">
          <img :src="currentFlag" alt="Lang" class="h-6 w-6 object-contain" />
        </button>

        <!-- Auth -->
        <template v-if="!isAuthenticated">
          <router-link to="/register" class="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">{{ $t('common.register') }}</router-link>
          <router-link to="/login" class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">{{ $t('common.login') }}</router-link>
        </template>

        <template v-else>
          <router-link to="/profile" class="hidden sm:flex items-center gap-2 px-3 py-1 rounded bg-slate-200 text-gray-800 hover:bg-slate-300">
            <img :src="profileImage" alt="Profile" class="w-8 h-8 rounded-full object-cover" />
            <span>{{ profileName }}</span>
          </router-link>
          <button @click="logout" class="hidden sm:block bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">{{ $t('common.logout') }}</button>
        </template>

        <!-- Hamburger Icon for Mobile Only -->
        <button v-if="isMobile" @click="toggleMobileMenu" class="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-300">
          <svg class="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
      </div>
    </header>

  <!-- Mobile Sidebar Navigation -->
  <div
    v-if="isMobileMenuOpen"
    class="fixed top-0 right-0 h-full w-1/2 bg-white shadow-lg z-[1000] transition-transform duration-300 ease-in-out flex flex-col"
  >
    <!-- Close Button -->
    <button
      @click="closeMobileMenu"
      class="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 transition"
      aria-label="Close sidebar"
    >
      <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <!-- Profile Section -->
    <div class="flex flex-col items-center mt-20 mb-8">
      <img :src="profileImage" alt="Profile" class="w-20 h-20 rounded-full object-cover border-4 border-yellow-400" />
      <p class="mt-3 text-lg font-semibold text-gray-800">{{ profileName }}</p>
    </div>

    <!-- Navigation List -->
    <ul class="px-6 space-y-6 flex-1 overflow-y-auto">
      <li v-for="item in dynamicNavItems" :key="item.name">
        <router-link
          @click="closeMobileMenu"
          :to="item.route"
          class="flex items-center justify-between text-gray-700 font-medium text-base hover:text-yellow-500"
        >
          <!-- Left side: icon + label -->
          <span class="flex items-center gap-3">
            <svg v-if="item.icon" class="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <use :href="`#${item.icon}`" />
            </svg>
            {{ $t(item.name) }}
          </span>

          <!-- Right side: badge if available -->
          <span
            v-if="item.badge"
            class="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full"
          >{{ item.badge }}</span>
        </router-link>
      </li>
    </ul>
  </div>

  <!-- Include SVG definitions somewhere globally or inline -->
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
  import { computed, onMounted, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'

  const router = useRouter()
  const store = useStore()
  const { locale } = useI18n()

  const currentFlag = ref(flagEN)
  const profileName = ref('User')
  const profileImage = ref(require('@/assets/default-profile.png'))

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

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token')
      const userId = localStorage.getItem('userId')
      if (!token || !userId) return

      const res = await axios.get(`${apiURL}/api/getAllDocs/User`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          dynamicConditions: JSON.stringify([{ field: '_id', operator: '==', value: userId }])
        }
      })

      if (res.data.success && res.data.data.length > 0) {
        const user = res.data.data[0]
        profileName.value = user.name || 'User'
        profileImage.value = user.profilePicture || require('@/assets/default-profile.png')
      }
    } catch (err) {
      console.error(err)
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
    router.push('/login')
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
  onMounted(() => {
    checkMobile()
    window.addEventListener('resize', checkMobile)
    if (isAuthenticated.value) fetchProfile()
  })
  </script>