<template>
  <div class=" bg-[#F4F7FB] p-8 max-w-screen-xl mx-auto bg-white h-screen overflow-y-auto mt-10 	">
    <h1 class="flex items-center text-2xl font-bold mb-6 gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-yellow-500 " fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <rect x="1" y="7" width="15" height="13" rx="2" />
        <path d="M16 16h2a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2h-2" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
      <span class="text-[#222] tracking-wide">Tracking View</span>
    </h1>


    <div class="flex flex-col lg:flex-row gap-8">
      <!-- Map Section -->
      <div class="bg-white rounded-2xl shadow-lg p-6 relative flex-1 min-h-[400px]">
        <GMapMap :center="mapCenter" :zoom="12" :options="mapOptions" class="w-full h-[340px] lg:h-[400px] rounded-xl"
          @click="handleMapClick">
          <!-- Driver Markers (click to select as origin) -->
          <GMapMarker v-for="marker in markers" :key="marker.id" :position="{ lat: marker.lat, lng: marker.lng }"
            @click="selectOrigin(marker)" />
          <!-- Destination Marker (click on map to set) -->
          <GMapMarker v-if="destination" :position="destination" :icon="{
            url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
            scaledSize: { width: 42, height: 42 }
          }" />
          <!-- Route Polyline -->
          <GMapDirectionsRenderer v-if="directions" :directions="directions" :options="routeOptions" />
          <!-- Info Windows for Drivers -->
          <GMapInfoWindow v-for="marker in markers" :key="'popup-' + marker.id"
            :position="{ lat: marker.lat, lng: marker.lng }" :opened="marker.show" @closeclick="marker.show = false">
            <div class="text-gray-800 font-bold mb-1">{{ marker.name }}</div>
            <div class="text-xs text-gray-500 mb-1">{{ marker.address }}</div>
            <div class="text-xs">On site since {{ marker.since }}</div>
          </GMapInfoWindow>
        </GMapMap>
      </div>
      <!-- Table Section -->
      <div class="bg-white rounded-2xl shadow-lg p-6 flex-1 min-h-[400px]">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-bold text-gray-800">Driver List</h2>
          <input v-model="tableSearch" type="text" placeholder="Search drivers..."
            class="px-3 py-2 border rounded bg-gray-50 w-64" />
        </div>
        <div class="overflow-x-auto max-h-[340px] lg:max-h-[400px]">
          <table class="min-w-full text-sm">
            <thead>
              <tr class="border-b">
                <th class="py-2 px-3 text-left font-semibold text-gray-600">Driver Name</th>
                <th class="py-2 px-3 text-left font-semibold text-gray-600">Registration Plate</th>
                <th class="py-2 px-3 text-left font-semibold text-gray-600">Truck Number</th>
                <th class="py-2 px-3 text-left font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="driver in filteredDrivers" :key="driver.id" class="border-b hover:bg-gray-50">
                <td class="py-2 px-3 flex items-center gap-2">
                  <img :src="driver.avatar" class="w-7 h-7 rounded-full" />
                  <span class="font-medium">{{ driver.name }}</span>
                </td>
                <td class="py-2 px-3">{{ driver.plate }}</td>
                <td class="py-2 px-3">{{ driver.truck }}</td>
                <td class="py-2 px-3">
                  <span :class="[
                    'px-3 py-1 rounded-full text-xs font-semibold',
                    driver.status.includes('Driving')
                      ? 'bg-green-100 text-green-600'
                      : 'bg-blue-100 text-blue-600'
                  ]">
                    {{ driver.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-if="filteredDrivers.length === 0" class="text-center text-gray-400 py-6">No drivers found.</div>
        </div>
      </div>
    </div>
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

// Route polyline style
const routeOptions = {
  polylineOptions: {
    strokeColor: "#2979FF", // blue line
    strokeWeight: 5
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
  console.log('Origin:', o, 'Destination:', d); // Debug log
  if (o && d) {
    try {
      directions.value = await fetchRoute(o, d);
      console.log('Directions:', directions.value); // Debug log
    } catch (err) {
      directions.value = null;
      console.error("Directions error", err);
    }
  } else {
    directions.value = null;
  }
});


// Table search and driver list (unchanged)
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

// Map style options (minimal/clean)
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
      "stylers": [{ "color": "#bdbdbd" }]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [{ "color": "#f5f5f5" }]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#bdbdbd" }]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [{ "color": "#ffffff" }]
    },
    {
      "featureType": "road.arterial",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#757575" }]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [{ "color": "#dadada" }]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#616161" }]
    },
    {
      "featureType": "transit",
      "elementType": "geometry",
      "stylers": [{ "color": "#e5e5e5" }]
    },
    {
      "featureType": "transit",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#bdbdbd" }]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [{ "color": "#c9c9c9" }]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#9e9e9e" }]
    }
  ]
});
</script>


<style scoped>
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
</style>
