<template>
  <v-app class="font-sans">
    <router-view />
  </v-app>
</template>


<style>
/* Global styles */
#app {
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
}

body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  font-family: 'Kantumruy Pro', sans-serif; /* ✅ Add this line */
}

/* Animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
