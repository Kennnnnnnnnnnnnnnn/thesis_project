<template>
  <div :class="[
    'h-screen bg-white-200 text-[#4b5563] fixed top-0 bottom-0 transition-all duration-300 flex flex-col shadow-xl z-50 font-sans',
    isOpen ? 'w-56 left-0' : '-left-56 w-56'
  ]">
    <!-- Toggle Handle -->
    <!-- <div class="absolute -right-6 top-12 w-6 h-12 bg-yellow-500 rounded-r-md shadow cursor-pointer flex items-center justify-center"
        @click="toggleSidebar">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </div> -->

    <div class="flex flex-col items-center justify-center w-full p-2 sm:p-3 md:p-4  border-b-4  border-gray-200 mb-4">
      <img src="@/assets/rice.png" alt="Logo" class="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 mb-2" />
      <span class="text-lg sm:text-xl md:text-2xl font-bold text-yellow-600 text-center">
        Taing Eanghuot
      </span>
    </div>

    <div class="h-full overflow-y-auto px-5">
      <!-- Logo -->



      <!-- DASHBOARDS -->
      <div >
        <h2 class="text-[#ca8a04] text-xs font-semibold  tracking-wider mb-2 uppercase">Dashboard</h2>
        <nav class="space-y-2">
          <!-- supplier -->
          <router-link to="/admin/dashboard" :class="[
            'nav-link',
            route.path === '/admin/dashboard' ? 'bg-yellow-500 text-white' : ''
          ]">
            <LayoutDashboardIcon class="h-4 w-4 " />
            <span class="text-sm ">Dashboard</span>
          </router-link>


          <!-- Order -->
          <router-link to="/admin/orders" :class="[
            'nav-link',
            route.path === '/admin/orders' ? 'bg-yellow-500 text-white' : ''
          ]">
            <ShoppingCart class="h-4 w-4 " />
            <span class="text-sm">Order</span>
          </router-link>


        </nav>
      </div>

      <!-- Inventory (No Dropdown) -->
      <div class="mt-5">
        <h2 class="text-[#ca8a04] text-xs font-semibold tracking-wider uppercase">Inventory</h2>
        <nav class="space-y-2 pl-0 mt-2">
          <router-link to="/admin/create" :class="[
            'nav-link',
            route.path === '/admin/create' ? 'bg-yellow-500 text-white' : ''
          ]">
            <FileTextIcon class="h-4 w-4" />
            <span class="text-sm">Product</span>
          </router-link>
          <router-link to="/admin/stock" :class="[
            'nav-link',
            route.path === '/admin/stock' ? 'bg-yellow-500 text-white' : ''
          ]">
            <PackageIcon class="h-4 w-4" />
            <span class="text-sm">InStock</span>
          </router-link>
          <router-link to="/admin/restock" :class="[
            'nav-link',
            route.path === '/admin/restock' ? 'bg-yellow-500 text-white' : ''
          ]">
            <Layers class="h-4 w-4" />
            <span class="text-sm">Purchase</span>
          </router-link>
          <router-link to="/admin/supplier" :class="[
            'nav-link',
            route.path === '/admin/supplier' ? 'bg-yellow-500 text-white' : ''
          ]">
            <BaggageClaim class="h-4 w-4" />
            <span class="text-sm">Supplier</span>
          </router-link>
          <router-link to="/admin/categories" :class="[
            'nav-link',
            route.path === '/admin/categories' ? 'bg-yellow-500 text-white' : ''
          ]">
            <ChartBarStacked class="h-4 w-4" />
            <span class="text-sm">Category</span>
          </router-link>
        </nav>
      </div>

      <!-- USER MANAGEMENT (Dropdown) -->
      <div class="mt-5">
        <button
          @click="isUserManagementOpen = !isUserManagementOpen"
          class="flex items-center w-full text-left text-[#ca8a04] text-sm font-semibold tracking-wider focus:outline-none transition"
        >
          <span class="flex-1 uppercase">User Management</span>
          <svg
            :class="['w-4 h-4 ml-2 transition-transform', isUserManagementOpen ? 'rotate-90' : '']"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <transition name="fade">
          <nav v-show="isUserManagementOpen" class="space-y-2 pl-4 mt-2">
            <router-link to="/admin/delivery" :class="[
              'nav-link',
              route.path === '/admin/delivery' ? 'bg-yellow-500 text-white' : ''
            ]">
              <MapPinned class="h-4 w-4" />
              <span class="text-sm">Tracking</span>
            </router-link>
            <router-link to="/admin/users" :class="[
              'nav-link',
              route.path === '/admin/users' ? 'bg-yellow-500 text-white' : ''
            ]">
              <UserRoundPlus class="h-4 w-4" />
              <span class="text-sm">Create User</span>
            </router-link>
            <router-link to="/admin/permission" :class="[
              'nav-link',
              route.path === '/admin/permission' ? 'bg-yellow-500 text-white' : ''
            ]">
              <FileKey2 class="h-4 w-4" />
              <span class="text-sm">Set Permission</span>
            </router-link>
          </nav>
        </transition>
      </div>

      <!-- REPORT (Dropdown) -->
      <div class="mt-5 mb-5">
        <button
          @click="isReportOpen = !isReportOpen"
          class="flex items-center w-full text-left text-[#ca8a04] text-sm font-semibold tracking-wider focus:outline-none transition"
        >
          <span class="flex-1 uppercase">Report</span>
          <svg
            :class="['w-4 h-4 ml-2 transition-transform', isReportOpen ? 'rotate-90' : '']"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <transition name="fade">
          <nav v-show="isReportOpen" class="space-y-2 pl-4 mt-2">
            <router-link to="/admin/reports/orders" :class="[
              'nav-link',
              route.path === '/admin/reports/orders' ? 'bg-yellow-500 text-white' : ''
            ]">
              <Book class="h-4 w-4" />
              <span class="text-sm">Order Reports</span>
            </router-link>
            <router-link to="/admin/reports/stock" :class="[
              'nav-link',
              route.path === '/admin/reports/stock' ? 'bg-yellow-500 text-white' : ''
            ]">
              <Book class="h-4 w-4" />
              <span class="text-sm">Stock Reports</span>
            </router-link>
            <router-link to="/admin/reports/purchase" :class="[
              'nav-link',
              route.path === '/admin/reports/purchase' ? 'bg-yellow-500 text-white' : ''
            ]">
              <Book class="h-4 w-4" />
              <span class="text-sm">Purchase Reports</span>
            </router-link>
          </nav>
        </transition>
      </div>



    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { defineProps, defineEmits } from 'vue';
import { useRoute } from 'vue-router';
import {
  LayoutDashboardIcon,
  PackageIcon,
  FileTextIcon,
  TagsIcon,
  UserRoundPlus,
  Layers,
  BaggageClaim,
  ChartBarStacked,
  MapPinned,
  FileKey2,
  ShoppingCart,
  Book

} from 'lucide-vue-next';


const route = useRoute();

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['toggle']);

const toggleSidebar = () => {
  emit('toggle');
};

const isReportOpen = ref(false);
const isUserManagementOpen = ref(false);
</script>

<style scoped>
.nav-link {
  @apply flex items-center space-x-2 p-2 rounded-lg transition-colors duration-200 hover:bg-yellow-500 hover:text-white;
}

aside {
  transition: all 0.3s ease-in-out;
}

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

/* Router link active state styling (if applied in sidebar component) */
/* .router-link-active { ... } */

/* Fade and slide down effect for router view transitions */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  max-height: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  max-height: 500px;
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


</style>