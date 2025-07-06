<template>
  <div class="app-layout">
    <UserHeader />
    <NavMenu />
    <main class="main-content overflow-y-auto">
      <router-view /> <!-- This shows the current page -->
    </main>
  </div>
</template>

<script>
import NavMenu from '@/components/NavMenu.vue';
import UserHeader from '@/components/UserHeader.vue';

export default {
  components: {
    UserHeader,
    NavMenu
  }
}
</script>

<style>
.app-layout {
  height: 100vh;
  /* Use viewport height instead of min-height */
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.main-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  min-height: 0;
  /* Allow flex item to shrink */
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