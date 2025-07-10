<template>
  <div class="font-poppins min-h-screen bg-gray-100 py-5">
    <div class="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div class="bg-white px-8 py-8 text-center border-b border-gray-200">
        <h1 class="text-gray-800 text-2xl font-semibold mb-2">Profile Settings</h1>
        <p class="text-gray-500 text-base">Update your personal information</p>
      </div>

      <form @submit.prevent="updateProfile" class="px-8 py-8">
        <!-- Profile Picture -->
        <div class="flex justify-center items-center mb-8">
          <div class="relative w-32 h-32 rounded-full border-4 border-gray-200 overflow-hidden group cursor-pointer transition-colors duration-300 hover:border-blue-500">
            <img :src="form.profilePicture || defaultImage" alt="Profile" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-black bg-opacity-60 rounded-full flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <label for="profile-upload" class="bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-medium cursor-pointer hover:bg-blue-700 transition-colors">Change Photo</label>
              <input id="profile-upload" type="file" @change="handleImageUpload" accept="image/*" class="hidden" />
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-8">
          <!-- Personal Information -->
          <div class="bg-white border border-gray-200 rounded-lg p-6">
            <h3 class="text-gray-800 text-lg font-semibold mb-5 border-b-2 border-gray-100 pb-2">Personal Information</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              <div class="flex flex-col">
                <label class="font-medium text-gray-700 mb-1">Full Name</label>
                <input v-model="form.name" type="text" required class="border border-gray-300 rounded-md px-3 py-2 text-base text-gray-700 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition" />
              </div>
              <div class="flex flex-col">
                <label class="font-medium text-gray-700 mb-1">Email</label>
                <input v-model="form.email" type="email" class="border border-gray-300 rounded-md px-3 py-2 text-base text-gray-700 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition" />
              </div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div class="flex flex-col">
                <label class="font-medium text-gray-700 mb-1">Phone Number</label>
                <input v-model="form.phoneNumber" type="text" required class="border border-gray-300 rounded-md px-3 py-2 text-base text-gray-700 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition" />
              </div>
              <div class="flex flex-col">
                <label class="font-medium text-gray-700 mb-1">Gender</label>
                <select v-model="form.gender" class="border border-gray-300 rounded-md px-3 py-2 text-base text-gray-700 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Address Information -->
          <div class="bg-white border border-gray-200 rounded-lg p-6">
            <h3 class="text-gray-800 text-lg font-semibold mb-5 border-b-2 border-gray-100 pb-2">Address Information</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              <div class="flex flex-col">
                <label class="font-medium text-gray-700 mb-1">Country</label>
                <input v-model="form.country" type="text" placeholder="Enter country" class="border border-gray-300 rounded-md px-3 py-2 text-base text-gray-700 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition" />
              </div>
              <div class="flex flex-col">
                <label class="font-medium text-gray-700 mb-1">Province</label>
                <select v-model="selectedProvince" @change="onProvinceChange" class="border border-gray-300 rounded-md px-3 py-2 text-base text-gray-700 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition">
                  <option value="">Select Province</option>
                  <option v-for="province in provinces" :key="province" :value="province">{{ province }}</option>
                </select>
              </div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              <div class="flex flex-col">
                <label class="font-medium text-gray-700 mb-1">District</label>
                <select v-model="selectedDistrict" @change="onDistrictChange" :disabled="!selectedProvince" class="border border-gray-300 rounded-md px-3 py-2 text-base text-gray-700 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition disabled:bg-gray-100 disabled:text-gray-400">
                  <option value="">Select District</option>
                  <option v-for="district in filteredDistricts" :key="district" :value="district">{{ district }}</option>
                </select>
              </div>
              <div class="flex flex-col">
                <label class="font-medium text-gray-700 mb-1">Commune</label>
                <select v-model="form.commune" :disabled="!selectedDistrict" class="border border-gray-300 rounded-md px-3 py-2 text-base text-gray-700 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition disabled:bg-gray-100 disabled:text-gray-400">
                  <option value="">Select Commune</option>
                  <option v-for="commune in filteredCommunes" :key="commune" :value="commune">{{ commune }}</option>
                </select>
              </div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div class="flex flex-col">
                <label class="font-medium text-gray-700 mb-1">Village</label>
                <input v-model="form.village" type="text" placeholder="Enter village" class="border border-gray-300 rounded-md px-3 py-2 text-base text-gray-700 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition" />
              </div>
              <div class="flex flex-col">
                <label class="font-medium text-gray-700 mb-1">Role</label>
                <input v-model="form.role" type="text" class="border border-gray-300 rounded-md px-3 py-2 text-base text-gray-400 bg-gray-100 cursor-not-allowed" disabled />
              </div>
            </div>
          </div>
        </div>

        <div class="text-center mt-8 pt-6 border-t border-gray-200">
          <button type="submit" class="bg-blue-600 text-white px-8 py-3 rounded-md font-medium text-lg shadow hover:bg-blue-700 transition-colors min-w-[150px]">Save Changes</button>
        </div>
      </form>
    </div>
  </div>
</template>
<script setup>
import apiURL from '@/api/config';
import axios from 'axios';
import Swal from 'sweetalert2';
import { onMounted, ref } from 'vue';

const defaultImage = require('@/assets/default-profile.png');

const form = ref({
  name: '',
  email: '',
  phoneNumber: '',
  gender: 'other',
  profilePicture: '',
  country: '',
  province: '',
  district: '',
  commune: '',
  village: '',
  status: true,
  role: 'customer',
});

// Location dropdown state
const locations = ref([]);
const provinces = ref([]);
const selectedProvince = ref('');
const filteredDistricts = ref([]);
const selectedDistrict = ref('');
const filteredCommunes = ref([]);

// Fetch all locations first
const fetchLocations = async () => {
  try {
    const token = localStorage.getItem('token');
    const res = await axios.get(`${apiURL}/api/locations`, {
      headers: { Authorization: token ? `Bearer ${token}` : '' },
    });
    locations.value = res.data.data;
    provinces.value = [...new Set(locations.value.map(l => l.provinceNameKh))].sort();
  } catch (err) {
    console.error(err);
    Swal.fire({ icon: 'error', title: 'Failed to load locations' });
  }
};

// Fetch user profile & restore data
const fetchProfile = async () => {
  const token = localStorage.getItem('token');
  try {
    const token = localStorage.getItem('token');
    const res = await axios.get(`${apiURL}/api/profile`, {
      headers: { Authorization: token ? `Bearer ${token}` : '' },
    });
    if (res.data.success) {
      Object.assign(form.value, res.data.data);

      // Restore selected province/district
      selectedProvince.value = form.value.province || '';
      selectedDistrict.value = form.value.district || '';

      // 1) Restore filteredDistricts directly
      if (selectedProvince.value) {
        const districts = locations.value
          .filter(l => l.provinceNameKh === selectedProvince.value)
          .map(l => l.districtNameKh);
        filteredDistricts.value = [...new Set(districts)].sort();
      }

      // 2) Restore filteredCommunes directly
      if (selectedProvince.value && selectedDistrict.value) {
        const communes = locations.value
          .filter(l => l.provinceNameKh === selectedProvince.value &&
                       l.districtNameKh === selectedDistrict.value)
          .map(l => l.communeNameKh);
        filteredCommunes.value = [...new Set(communes)].sort();
      }
    } else {
      Swal.fire({ icon: 'error', title: 'Failed to fetch profile' });
    }
  } catch (err) {
    console.error(err);
    Swal.fire({ icon: 'error', title: 'Error fetching profile' });
  }
};


// Update profile
const updateProfile = async () => {
  try {
    const token = localStorage.getItem('token');
    await axios.patch(`${apiURL}/api/profile`, form.value, {
      headers: { Authorization: token ? `Bearer ${token}` : '' },
    });
    Swal.fire({ icon: 'success', title: 'Profile updated successfully' });
  } catch (err) {
    console.error(err);
    Swal.fire({ icon: 'error', title: 'Failed to update profile', text: err.response?.data?.message });
  }
};

// Profile picture upload
const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const formData = new FormData();
  formData.append('file', file);
  try {
    const token = localStorage.getItem('token');
    const res = await axios.post(`${apiURL}/api/profile/upload-picture`, formData, {
      headers: { 'Content-Type': 'multipart/form-data', Authorization: token ? `Bearer ${token}` : '' },
    });
    if (res.data.success) {
      form.value.profilePicture = res.data.url;
      Swal.fire({ icon: 'success', title: 'Profile picture updated' });
    } else {
      Swal.fire({ icon: 'error', title: 'Failed to upload image' });
    }
  } catch (err) {
    console.error(err);
    Swal.fire({ icon: 'error', title: 'Error uploading image' });
  }
};

// Dropdown handlers
const onProvinceChange = () => {
  form.value.province = selectedProvince.value;
  selectedDistrict.value = '';
  form.value.district = '';
  form.value.commune = '';

  const districts = locations.value
    .filter(l => l.provinceNameKh === selectedProvince.value)
    .map(l => l.districtNameKh);
  filteredDistricts.value = [...new Set(districts)].sort();
  filteredCommunes.value = [];
};

const onDistrictChange = () => {
  form.value.district = selectedDistrict.value;
  form.value.commune = '';

  const communes = locations.value
    .filter(l => l.provinceNameKh === selectedProvince.value && l.districtNameKh === selectedDistrict.value)
    .map(l => l.communeNameKh);
  filteredCommunes.value = [...new Set(communes)].sort();
};

// Ensure locations load BEFORE restoring profile
onMounted(async () => {
  await fetchLocations();

  const token = localStorage.getItem('token');
  if (token) {
    // Authenticated: fetch profile
    await fetchProfile();
  } else {
    // Guest: prompt registration
    console.log('🔍 Guest user detected: prompting to register');
    const result = await Swal.fire({
      icon: 'info',
      title: 'You are browsing as a guest',
      text: 'To manage your profile, please register or login.',
      showCancelButton: true,
      confirmButtonText: 'Register Now',
      cancelButtonText: 'Maybe Later',
    });

    if (result.isConfirmed) {
      window.location.href = '/register'; // redirect to register page
    }
  }
});

</script>
