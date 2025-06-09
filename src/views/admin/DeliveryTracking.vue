<template>
  <div class="p-4 md:p-6 font-inter">
    <!-- Header Section -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-4 md:p-6 mb-6">
      <div class="flex items-center gap-3 md:gap-4">
        <div class="p-2 md:p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 md:h-6 md:w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="1" y="7" width="15" height="13" rx="2" />
            <path d="M16 16h2a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2h-2" />
            <circle cx="5.5" cy="18.5" r="2.5" />
            <circle cx="18.5" cy="18.5" r="2.5" />
          </svg>
        </div>
        <div>
          <h1 class="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Delivery Tracking</h1>
          <!-- <p class="text-xs md:text-sm text-gray-600 mt-0.5 font-medium">Real-time delivery monitoring and route management</p> -->
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Map Section -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden">
        <!-- Map Header -->
        <div class="px-4 md:px-6 py-4 md:py-5 border-b border-gray-100 bg-gray-50/50">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-base md:text-lg font-bold text-gray-900 tracking-tight">Live Map View</h3>
              <!-- <p class="text-xs md:text-sm text-gray-600 mt-1 font-medium">Click drivers to select origin, click map to set destination</p> -->
            </div>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span class="text-xs font-medium text-gray-600">Live</span>
            </div>
          </div>
        </div>

        <!-- Map Container -->
        <div class="relative">
          <GMapMap :center="mapCenter" :zoom="12" :options="mapOptions" 
            class="w-full h-[400px] md:h-[500px]"
            @click="handleMapClick">
            <!-- Driver Markers -->
            <GMapMarker v-for="marker in markers" :key="marker.id" 
              :position="{ lat: marker.lat, lng: marker.lng }"
              @click="selectOrigin(marker)" />
            <!-- Destination Marker -->
            <GMapMarker v-if="destination" :position="destination" :icon="{
              url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
              scaledSize: { width: 42, height: 42 }
            }" />
            <!-- Route Polyline -->
            <GMapDirectionsRenderer v-if="directions" :directions="directions" :options="routeOptions" />
            <!-- Info Windows for Drivers -->
            <GMapInfoWindow v-for="marker in markers" :key="'popup-' + marker.id"
              :position="{ lat: marker.lat, lng: marker.lng }" :opened="marker.show" @closeclick="marker.show = false">
              <div class="p-2">
                <div class="text-gray-900 font-bold mb-1">{{ marker.name }}</div>
                <div class="text-xs text-gray-600 mb-1">{{ marker.address }}</div>
                <div class="text-xs text-amber-600 font-medium">On site since {{ marker.since }}</div>
              </div>
            </GMapInfoWindow>
          </GMapMap>

          <!-- Map Controls Overlay -->
          <div class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-gray-200">
            <div class="flex flex-col gap-2">
              <div class="flex items-center gap-2 text-xs">
                <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span class="text-gray-700 font-medium">Drivers</span>
              </div>
              <div class="flex items-center gap-2 text-xs">
                <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                <span class="text-gray-700 font-medium">Destination</span>
              </div>
              <div class="flex items-center gap-2 text-xs">
                <div class="w-4 h-0.5 bg-blue-600"></div>
                <span class="text-gray-700 font-medium">Route</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Driver List Section -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden">
        <!-- Table Header -->
        <div class="px-4 md:px-6 py-4 md:py-5 border-b border-gray-100 bg-gray-50/50">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 class="text-base md:text-lg font-bold text-gray-900 tracking-tight">Active Drivers</h3>
              <p class="text-xs md:text-sm text-gray-600 mt-1 font-medium">{{ filteredDrivers.length }} drivers online</p>
            </div>
            
            <!-- Search Input -->
            <div class="relative">
              <input v-model="tableSearch" type="text" placeholder="Search drivers..."
                class="w-full md:w-64 px-3 md:px-4 py-2 md:py-2.5 pl-8 md:pl-10 border border-gray-200 rounded-xl text-xs md:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all" />
              <i class="fas fa-search absolute left-2 md:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs md:text-sm"></i>
            </div>
          </div>
        </div>

        <!-- Mobile Card View -->
        <div class="block md:hidden max-h-[500px] overflow-y-auto">
          <div class="divide-y divide-gray-100">
            <div v-for="driver in filteredDrivers" :key="driver.id" class="p-4 hover:bg-amber-50/50 transition-colors">
              <div class="flex items-start gap-3">
                <!-- Driver Avatar -->
                <div class="flex-shrink-0">
                  <div class="h-12 w-12 rounded-xl overflow-hidden border border-amber-200">
                    <img :src="driver.avatar" :alt="driver.name" class="h-full w-full object-cover" />
                  </div>
                </div>
                
                <!-- Driver Info -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <h3 class="text-sm font-bold text-gray-900 truncate">{{ driver.name }}</h3>
                      <p class="text-xs text-gray-500 mt-0.5">{{ driver.truck }}</p>
                      <div class="flex items-center gap-2 mt-2">
                        <span class="inline-flex items-center px-2 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700">
                          {{ driver.plate }}
                        </span>
                        <span class="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold"
                          :class="driver.status.includes('Driving') ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'">
                          <i :class="driver.status.includes('Driving') ? 'fas fa-truck-moving' : 'fas fa-circle'" class="text-xs"></i>
                          {{ driver.status }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Desktop Table View -->
        <div class="hidden md:block">
          <div class="overflow-x-auto max-h-[500px]">
            <table class="min-w-full divide-y divide-gray-100">
              <thead class="bg-gray-50/50 sticky top-0">
                <tr>
                  <th class="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Driver</th>
                  <th class="px-4 lg:px-6 py-3 lg:py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Plate</th>
                  <th class="px-4 lg:px-6 py-3 lg:py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Truck</th>
                  <th class="px-4 lg:px-6 py-3 lg:py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-100">
                <tr v-for="driver in filteredDrivers" :key="driver.id"
                  class="hover:bg-amber-50/50 transition-colors duration-200">
                  <!-- Driver Column -->
                  <td class="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                    <div class="flex items-center gap-3">
                      <div class="flex-shrink-0">
                        <div class="h-10 w-10 lg:h-12 lg:w-12 rounded-xl lg:rounded-2xl overflow-hidden border border-amber-200">
                          <img :src="driver.avatar" :alt="driver.name" class="h-full w-full object-cover" />
                        </div>
                      </div>
                      <div class="min-w-0">
                        <div class="text-sm font-bold text-gray-900 truncate">
                          {{ driver.name }}
                        </div>
                        <div class="text-xs text-gray-500 font-medium mt-0.5">
                          Driver ID: {{ driver.id }}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <!-- Plate Column -->
                  <td class="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-center">
                    <span class="inline-flex items-center px-2 lg:px-3 py-1 lg:py-1.5 rounded-lg lg:rounded-xl text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                      {{ driver.plate }}
                    </span>
                  </td>
                  
                  <!-- Truck Column -->
                  <td class="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-center">
                    <span class="text-sm text-gray-600 font-medium">{{ driver.truck }}</span>
                  </td>
                  
                  <!-- Status Column -->
                  <td class="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-center">
                    <span class="inline-flex items-center gap-1 lg:gap-2 px-2 lg:px-3 py-1 lg:py-1.5 rounded-lg lg:rounded-xl text-xs font-bold"
                      :class="driver.status.includes('Driving') ? 'bg-green-100 text-green-700 border-green-200' : 'bg-blue-100 text-blue-700 border-blue-200'">
                      <i :class="driver.status.includes('Driving') ? 'fas fa-truck-moving' : 'fas fa-circle'" class="text-xs"></i>
                      <span class="hidden lg:inline">{{ driver.status }}</span>
                    </span>
                  </td>
                </tr>
                
                <!-- Empty State -->
                <tr v-if="filteredDrivers.length === 0">
                  <td :colspan="4" class="px-4 lg:px-6 py-12 lg:py-20 text-center">
                    <div class="flex flex-col items-center gap-4">
                      <div class="p-4 lg:p-6 rounded-xl lg:rounded-2xl bg-amber-50 border border-amber-200">
                        <i class="fas fa-truck text-3xl lg:text-5xl text-amber-400"></i>
                      </div>
                      <div>
                        <h3 class="text-base lg:text-lg font-bold text-gray-900">No drivers found</h3>
                        <p class="text-xs lg:text-sm text-gray-600 mt-1 font-medium">Try adjusting your search criteria</p>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Statistics Cards -->
    <!-- <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-4 md:p-6">
        <div class="flex items-center gap-3">
          <div class="p-2 md:p-3 rounded-xl bg-green-100 text-green-600">
            <i class="fas fa-truck-moving text-lg md:text-xl"></i>
          </div>
          <div>
            <p class="text-xs md:text-sm text-gray-600 font-medium">Active Drivers</p>
            <p class="text-lg md:text-2xl font-bold text-gray-900">{{ drivers.filter(d => d.status.includes('Driving')).length }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-4 md:p-6">
        <div class="flex items-center gap-3">
          <div class="p-2 md:p-3 rounded-xl bg-blue-100 text-blue-600">
            <i class="fas fa-circle text-lg md:text-xl"></i>
          </div>
          <div>
            <p class="text-xs md:text-sm text-gray-600 font-medium">Online Drivers</p>
            <p class="text-lg md:text-2xl font-bold text-gray-900">{{ drivers.filter(d => d.status.includes('Online')).length }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-4 md:p-6">
        <div class="flex items-center gap-3">
          <div class="p-2 md:p-3 rounded-xl bg-amber-100 text-amber-600">
            <i class="fas fa-route text-lg md:text-xl"></i>
          </div>
          <div>
            <p class="text-xs md:text-sm text-gray-600 font-medium">Active Routes</p>
            <p class="text-lg md:text-2xl font-bold text-gray-900">{{ directions ? 1 : 0 }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-4 md:p-6">
        <div class="flex items-center gap-3">
          <div class="p-2 md:p-3 rounded-xl bg-purple-100 text-purple-600">
            <i class="fas fa-map-marker-alt text-lg md:text-xl"></i>
          </div>
          <div>
            <p class="text-xs md:text-sm text-gray-600 font-medium">Map Markers</p>
            <p class="text-lg md:text-2xl font-bold text-gray-900">{{ markers.length }}</p>
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const mapCenter = ref({ lat: 11.5564, lng: 104.9282 }); // Phnom Penh, Cambodia

// Driver markers
const markers = ref([
  {
    id: 1,
    lat: 11.5675, lng: 104.9057,
    name: "Sophea Chan",
    address: "Aeon Mall, Phnom Penh",
    since: "09:40",
    count: 1,
    show: false
  },
  {
    id: 2,
    lat: 11.5733, lng: 104.9202,
    name: "Rina Sok",
    address: "Wat Phnom, Phnom Penh",
    since: "10:00",
    count: 2,
    show: false
  },
  {
    id: 3,
    lat: 11.5449, lng: 104.8922,
    name: "Vannak Kim",
    address: "Russian Market, Phnom Penh",
    since: "08:55",
    count: 1,
    show: false
  },
]);

// Show popup and select origin when driver is clicked
const origin = ref(null);
function selectOrigin(marker) {
  markers.value.forEach(m => m.show = false);
  marker.show = true;
  origin.value = { lat: marker.lat, lng: marker.lng };
}

// Destination marker (click on map to set)
const destination = ref(null);
function handleMapClick(event) {
  destination.value = {
    lat: event.latLng.lat(),
    lng: event.latLng.lng(),
  };
}

// Directions API result
const directions = ref(null);

// Route polyline style - Updated to amber color
const routeOptions = {
  polylineOptions: {
    strokeColor: "#F59E0B", // amber-500
    strokeWeight: 5,
    strokeOpacity: 0.8
  }
};

// Fetch route from origin to destination
async function fetchRoute(origin, destination) {
  if (!window.google || !window.google.maps) return null;
  const directionsService = new window.google.maps.DirectionsService();

  return new Promise((resolve, reject) => {
    directionsService.route(
      {
        origin,
        destination,
        travelMode: window.google.maps.TravelMode.DRIVING
      },
      (result, status) => {
        if (status === "OK") {
          resolve(result);
        } else {
          reject(status);
        }
      }
    );
  });
}

// Watch for origin & destination, update route
watch([origin, destination], async ([o, d]) => {
  if (o && d) {
    try {
      directions.value = await fetchRoute(o, d);
    } catch (err) {
      directions.value = null;
      console.error("Directions error", err);
    }
  } else {
    directions.value = null;
  }
});

// Table search and driver list
const tableSearch = ref("");
const drivers = ref([
  { id: 1, name: "Smith", avatar: "https://randomuser.me/api/portraits/men/1.jpg", plate: "A555 WOW", truck: "TRUCK 03", status: "Driving" },
  { id: 2, name: "Johnson", avatar: "https://randomuser.me/api/portraits/men/2.jpg", plate: "A555 WOW", truck: "TRUCK 04", status: "Online since 12:15pm" },
  { id: 3, name: "Williams", avatar: "https://randomuser.me/api/portraits/men/3.jpg", plate: "A555 WOW", truck: "TRUCK 07", status: "Driving" },
  { id: 4, name: "John", avatar: "https://randomuser.me/api/portraits/men/4.jpg", plate: "A755 WOW", truck: "TRUCK 08", status: "Online since 10:40am" },
  { id: 5, name: "Brown", avatar: "https://randomuser.me/api/portraits/men/5.jpg", plate: "A555 WOW", truck: "TRUCK 09", status: "Driving" },
]);

const filteredDrivers = computed(() => {
  if (!tableSearch.value) return drivers.value;
  return drivers.value.filter(d =>
    d.name.toLowerCase().includes(tableSearch.value.toLowerCase()) ||
    d.plate.toLowerCase().includes(tableSearch.value.toLowerCase()) ||
    d.truck.toLowerCase().includes(tableSearch.value.toLowerCase())
  );
});

// Map style options (updated for better visibility)
const mapOptions = ref({
  styles: [
    {
      "featureType": "all",
      "elementType": "labels.icon",
      "stylers": [{ "visibility": "off" }]
    },
    {
      "featureType": "administrative",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#9ca3af" }]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [{ "color": "#f3f4f6" }]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [{ "color": "#ffffff" }]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [{ "color": "#e5e7eb" }]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [{ "color": "#ddd6fe" }]
    }
  ]
});
</script>

<style scoped>
/* Enhanced scrollbar styling */
.overflow-x-auto::-webkit-scrollbar,
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb,
.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 2px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover,
.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background-color: #9ca3af;
}

.overflow-x-auto::-webkit-scrollbar-track,
.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 2px;
}

/* Smooth scrolling */
.overflow-x-auto,
.overflow-y-auto {
  scroll-behavior: smooth;
}
</style>