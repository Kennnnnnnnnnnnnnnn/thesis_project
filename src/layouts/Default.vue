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
        <router-view></router-view>
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