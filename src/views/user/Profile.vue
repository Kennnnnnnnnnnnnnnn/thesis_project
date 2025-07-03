<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="px-8 py-6 bg-white shadow flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-800">My Profile</h1>
    </div>

    <!-- Form -->
    <div class="flex-grow flex flex-col justify-center items-center p-6">
      <form @submit.prevent="updateProfile" class="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-8 rounded shadow">

        <!-- Profile Picture -->
        <div class="flex flex-col items-center md:col-span-2">
          <img :src="form.profilePicture || defaultImage" alt="Profile" class="w-32 h-32 rounded-full object-cover mb-4" />
          <input type="file" @change="handleImageUpload" class="text-sm text-gray-600" />
        </div>

        <div>
          <label class="block text-gray-700 mb-1">Name</label>
          <input v-model="form.name" type="text" class="w-full border rounded p-2" required />
        </div>

        <div>
          <label class="block text-gray-700 mb-1">Email</label>
          <input v-model="form.email" type="email" class="w-full border rounded p-2" />
        </div>

        <div>
          <label class="block text-gray-700 mb-1">Phone Number</label>
          <input v-model="form.phoneNumber" type="text" class="w-full border rounded p-2" required />
        </div>

        <div>
          <label class="block text-gray-700 mb-1">Gender</label>
          <select v-model="form.gender" class="w-full border rounded p-2">
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div class="md:col-span-2">
          <label class="block text-gray-700 mb-1">Country</label>
          <input v-model="form.country" type="text" class="w-full border rounded p-2" placeholder="Country" />
        </div>

        <!-- Province Dropdown -->
        <div>
          <label class="block text-gray-700 mb-1">Province</label>
          <select v-model="selectedProvince" class="w-full border rounded p-2" @change="onProvinceChange">
            <option value="">Select Province</option>
            <option v-for="province in provinces" :key="province" :value="province">{{ province }}</option>
          </select>
        </div>

        <!-- District Dropdown -->
        <div>
          <label class="block text-gray-700 mb-1">District</label>
          <select v-model="selectedDistrict" class="w-full border rounded p-2" @change="onDistrictChange" :disabled="!selectedProvince">
            <option value="">Select District</option>
            <option v-for="district in filteredDistricts" :key="district" :value="district">{{ district }}</option>
          </select>
        </div>

        <!-- Commune Dropdown -->
        <div>
          <label class="block text-gray-700 mb-1">Commune</label>
          <select v-model="form.commune" class="w-full border rounded p-2" :disabled="!selectedDistrict">
            <option value="">Select Commune</option>
            <option v-for="commune in filteredCommunes" :key="commune" :value="commune">{{ commune }}</option>
          </select>
        </div>

        <!-- Village -->
        <div>
          <label class="block text-gray-700 mb-1">Village</label>
          <input v-model="form.village" type="text" class="w-full border rounded p-2" placeholder="Village" />
        </div>

        <div class="flex items-center gap-2">
          <label class="text-gray-700">Status</label>
          <input type="checkbox" v-model="form.status" />
        </div>

        <div>
          <label class="block text-gray-700 mb-1">Role</label>
          <input v-model="form.role" type="text" class="w-full border rounded p-2 bg-gray-100" disabled />
        </div>

        <div class="md:col-span-2">
          <button type="submit" class="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition">
            Update Profile
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import apiURL from '@/api/config';
import Swal from 'sweetalert2';

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

// Fetch profile
const fetchProfile = async () => {
  try {
    const token = localStorage.getItem('token');
    const res = await axios.get(`${apiURL}/api/profile`, {
      headers: { Authorization: token ? `Bearer ${token}` : '' },
    });
    if (res.data.success) {
      Object.assign(form.value, res.data.data);
      selectedProvince.value = form.value.province || '';
      selectedDistrict.value = form.value.district || '';
      if (selectedProvince.value) onProvinceChange();
      if (selectedDistrict.value) onDistrictChange();
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

// Handle profile image upload
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

// Fetch locations
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

// Dropdown handlers
const onProvinceChange = () => {
  form.value.province = selectedProvince.value;
  selectedDistrict.value = '';
  form.value.district = '';
  form.value.commune = '';
  const districts = locations.value.filter(l => l.provinceNameKh === selectedProvince.value).map(l => l.districtNameKh);
  filteredDistricts.value = [...new Set(districts)].sort();
  filteredCommunes.value = [];
};

const onDistrictChange = () => {
  form.value.district = selectedDistrict.value;
  form.value.commune = '';
  const communes = locations.value.filter(l => l.provinceNameKh === selectedProvince.value && l.districtNameKh === selectedDistrict.value).map(l => l.communeNameKh);
  filteredCommunes.value = [...new Set(communes)].sort();
};

onMounted(() => {
  fetchProfile();
  fetchLocations();
});
</script>

<style scoped>
/* optional custom styling */
</style>
