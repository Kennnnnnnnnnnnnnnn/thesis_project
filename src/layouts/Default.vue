<template>
  <div class="h-screen flex flex-col overflow-hidden bg-gray-50">
    <!-- Fixed Navbar at top -->
    <Navbar :isSidebarOpen="isSidebarOpen" @toggle="toggleSidebar" class="flex-shrink-0" />
    
    <!-- Main content area with sidebar -->
    <div class="flex-1 flex overflow-hidden ">
      <!-- Sidebar -->
      <Sidebar :isOpen="isSidebarOpen" @toggle="toggleSidebar" class="flex-shrink-0" />
      
      <!-- Main scrollable content -->
      <div :class="['flex-1 overflow-y-auto transition-all duration-300 bg-gray-50', isSidebarOpen ? 'md:ml-56' : 'ml-0']">
        <transition name="fade" mode="out-in">
          <div class="p-2 sm:p-4 md:p-6 rounded-lg mx-auto w-full" :key="$route.fullPath">
            <router-view></router-view>
          </div>
        </transition>

      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '@/views/admin/Navbar.vue';
import Sidebar from '@/views/admin/Sidebar.vue';
import { onMounted, onUnmounted, ref } from 'vue';

export default {
  components: {
    Navbar,
    Sidebar,
  },
  setup() {
    const isSidebarOpen = ref(window.innerWidth >= 768);
    const windowWidth = ref(window.innerWidth || 1024);

    const handleResize = () => {
      windowWidth.value = window.innerWidth;
      isSidebarOpen.value = windowWidth.value >= 768;
    };

    const toggleSidebar = () => {
      isSidebarOpen.value = !isSidebarOpen.value;
    };

    onMounted(() => {
      window.addEventListener('resize', handleResize);
      handleResize();
    });

    onUnmounted(() => {
      window.removeEventListener('resize', handleResize);
    });

    return {
      isSidebarOpen,
      toggleSidebar,
    };
  },
};
</script>

<style lang="scss" scoped>
/* Fade and slide down effect */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

/* Starting state for the entering element (initially off-screen down) */
.fade-enter,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* Final state for the entering element (normal position) */
.fade-enter-to {
  opacity: 1;
  transform: translateY(0);
}

/* For the leaving state (it will move downwards while fading out) */
.fade-leave {
  opacity: 1;
  transform: translateY(0);
}

/* Enhanced scrollbar styling */
.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background-color: #9ca3af;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 4px;
}

/* Smooth scrolling */
.overflow-y-auto {
  scroll-behavior: smooth;
}

/* Footer scroll animation */
@keyframes scroll {
  0% {
    left: -22%;
  }

  100% {
    left: 100%;
  }
}

.animate-scroll {
  position: absolute;
  animation: scroll 20s linear infinite;
}
</style>