<template>
  <div>
    <Navbar :isSidebarOpen="isSidebarOpen" @toggle="toggleSidebar" />
    <Sidebar :isOpen="isSidebarOpen" @toggle="toggleSidebar" />
    <div :class="['transition-all duration-300 overflow-y-auto', isSidebarOpen ? 'md:ml-64' : 'ml-0']">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import Navbar from '@/views/admin/Navbar.vue';
import Sidebar from '@/views/admin/Sidebar.vue';

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
/* Add your styles here if needed */
/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #f9f9f6;
  border-radius: 20px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
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