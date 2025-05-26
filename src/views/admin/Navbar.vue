<template>
    <div class="flex">
        <!-- Add overlay -->
        <div v-if="isSidebarOpen && windowWidth < 768" class="fixed inset-0 bg-black bg-opacity-50 z-20"
            @click="toggleSidebar"></div>

        <div :class="['flex-1 transition-all duration-300', isSidebarOpen ? 'md:ml-56' : 'ml-0']">
            <!-- Header -->
            <header class="bg-white shadow-sm">
                <div class="flex justify-between items-center px-4 py-2">
                    <!-- Left side -->
                    <div class="flex items-center space-x-4">
                        <button
                            class="p-2 hover:scale-[1.03] rounded-lg transition-colors"
                            @click="toggleSidebar">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <!-- <h1 class="text-xl font-semibold text-gray-800">Dashboard</h1> -->
                       
                    </div>

                    <!-- Right side -->
                    <div class="flex items-center space-x-4">
                        <!-- Notifications -->
                        <!-- <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button> -->

                        <!-- Translate Button -->
                        <button @click="toggleLanguage"
                            class="bg-gray-50 border border-gray-200 text-gray-600 font-medium py-2 px-4 rounded-md transition-all duration-200 flex items-center gap-2 hover:bg-yellow-50 hover:text-amber-900 hover:border-yellow-200">
                            <span>{{ currentLanguage }}</span>
                        </button>

                        <!-- Profile Dropdown -->
                        <div class="relative" ref="profileDropdown">
                            <button @click="toggleProfile"
                                class="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <div v-if="userData.profilePicture" class="w-8 h-8 rounded-full overflow-hidden">
                                    <img :src="userData.profilePicture" :alt="userData.name"
                                        class="w-full h-full object-cover" />
                                </div>
                                <div v-else
                                    class="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-medium">
                                    {{ userData.name }}
                                </div>
                                <div class="hidden md:block text-left">
                                    <div class="text-sm font-medium text-gray-700">{{ userData.name }}</div>
                                    <div class="text-xs text-gray-500">{{ userData.role }}</div>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg"
                                    class="h-5 w-5 text-gray-500 transition-transform duration-200"
                                    :class="{ 'rotate-180': isProfileOpen }" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd"
                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                        clip-rule="evenodd" />
                                </svg>
                            </button>


                            <!-- Dropdown Menu with transition -->
                            <Transition enter-active-class="transition ease-out duration-200"
                                enter-from-class="transform opacity-0 scale-95"
                                enter-to-class="transform opacity-100 scale-100"
                                leave-active-class="transition ease-in duration-75"
                                leave-from-class="transform opacity-100 scale-100"
                                leave-to-class="transform opacity-0 scale-95">
                                <div v-show="isProfileOpen"
                                    class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                                    <!-- <div class="px-4 py-3 border-b">
                                        <div class="text-sm font-medium text-gray-900">{{ userData.name }}</div>
                                        <div class="text-sm text-gray-500">{{ userData.email }}</div>
                                    </div> -->
<!-- 
                                    <router-link to="/profile"
                                        class="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                        @click="isProfileOpen = false">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500"
                                            viewBox="0 0 20 20" fill="currentColor">
                                            <path fill-rule="evenodd"
                                                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                                clip-rule="evenodd" />
                                        </svg>
                                        <span>My Profile</span>
                                    </router-link> -->

                                    <!-- <router-link to="/settings"
                                        class="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                        @click="isProfileOpen = false">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500"
                                            viewBox="0 0 20 20" fill="currentColor">
                                            <path fill-rule="evenodd"
                                                d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                                                clip-rule="evenodd" />
                                        </svg>
                                        <span>Settings</span>
                                    </router-link> -->


                                    <div class="border-t ">
                                        <button @click="logout"
                                            class="flex w-full items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                                                fill="currentColor">
                                                <path fill-rule="evenodd"
                                                    d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                                                    clip-rule="evenodd" />
                                            </svg>
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                </div>
                            </Transition>
                        </div>
                    </div>
                </div>
            </header>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios';
import apiURL from '@/api/config';
import { ref, onMounted, onUnmounted } from 'vue';
import { onClickOutside } from '@vueuse/core';
import { useRouter } from 'vue-router';
import { useStore } from '@/store/useStore'

const store = useStore()
const currentLanguage = ref('EN')
const windowWidth = ref(window.innerWidth || 1024);
const isProfileOpen = ref(false);
const profileDropdown = ref(null);
const router = useRouter();
const userData = ref({
    name: '',
    email: '',
    phoneNumber: '',
    role: '',
    profilePicture: '',
    status: true
});

const emit = defineEmits(['toggle']);

const props = defineProps({
    isSidebarOpen: {
        type: Boolean,
        required: true,
    },
});


const toggleLanguage = () => {
    currentLanguage.value = currentLanguage.value === 'EN' ? 'ES' : 'EN'
}

const logout = () => {
    store.clearAuth();
    localStorage.clear();
    localStorage.removeItem('auth');
    window.location.href = '/login';
};


const handleResize = () => {
    windowWidth.value = window.innerWidth;
};

const toggleSidebar = () => {
    emit('toggle');
};

const toggleProfile = () => {
    isProfileOpen.value = !isProfileOpen.value;
};

const fetchUserData = async () => {
    try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (!token || !userId) {
            router.push('/login');
            return;
        }

        const response = await axios.get(`${apiURL}/api/getAllDocs/User`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            params: {
                dynamicConditions: JSON.stringify([{
                    field: '_id',
                    operator: '==',
                    value: userId
                }])
            }
        });

        userData.value = response.data.data[0]

        
    } catch (err) {
        console.error('Error fetching user data:', err);
    }
};

onMounted(() => {
    const token = localStorage.getItem('token');
    if (!token) {
        router.push('/login');
        return;
    }
    window.addEventListener('resize', handleResize);
    handleResize();
    onClickOutside(profileDropdown, () => {
        isProfileOpen.value = false;
    });
    fetchUserData()
});

onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
.dropdown-backdrop {
    position: fixed;
    inset: 0;
    background: transparent;
    z-index: 40;
}
</style>
