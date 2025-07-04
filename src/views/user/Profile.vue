<template>
  <div class="profile-page">

    <!-- Form -->
    <div class="profile-container">
      <form @submit.prevent="updateProfile" class="profile-form">
        <!-- Profile Picture -->
        <div class="profile-picture">
          <img :src="form.profilePicture || defaultImage" alt="Profile" />
          <input type="file" @change="handleImageUpload" />
        </div>

        <div class="form-group">
          <label>Name</label>
          <input v-model="form.name" type="text" required />
        </div>

        <div class="form-group">
          <label>Email</label>
          <input v-model="form.email" type="email" />
        </div>

        <div class="form-group">
          <label>Phone Number</label>
          <input v-model="form.phoneNumber" type="text" required />
        </div>

        <div class="form-group">
          <label>Gender</label>
          <select v-model="form.gender">
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div class="form-group">
          <label>Country</label>
          <input v-model="form.country" type="text" placeholder="Country" />
        </div>

        <div class="form-group">
          <label>Province</label>
          <select v-model="selectedProvince" @change="onProvinceChange">
            <option value="">Select Province</option>
            <option v-for="province in provinces" :key="province" :value="province">{{ province }}</option>
          </select>
        </div>

        <div class="form-group">
          <label>District</label>
          <select v-model="selectedDistrict" @change="onDistrictChange" :disabled="!selectedProvince">
            <option value="">Select District</option>
            <option v-for="district in filteredDistricts" :key="district" :value="district">{{ district }}</option>
          </select>
        </div>

        <div class="form-group">
          <label>Commune</label>
          <select v-model="form.commune" :disabled="!selectedDistrict">
            <option value="">Select Commune</option>
            <option v-for="commune in filteredCommunes" :key="commune" :value="commune">{{ commune }}</option>
          </select>
        </div>

        <div class="form-group">
          <label>Village</label>
          <input v-model="form.village" type="text" placeholder="Village" />
        </div>


        <div class="form-group">
          <label>Role</label>
          <input v-model="form.role" type="text" class="readonly" disabled />
        </div>

        <div class="form-group button-group">
          <button type="submit">Update Profile</button>
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


<style scoped>
.profile-page {
  font-family: 'Poppins', sans-serif;
  min-height: 100vh;
  background: linear-gradient(to bottom right, #fffbea, #ffffff, #fffbea);
  display: flex;
  flex-direction: column;
}

.profile-header {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  padding: 16px 32px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  text-align: center;
}

.profile-header h1 {
  color: #b7791f;
  font-size: 2rem;
  margin: 0;
}

.profile-container {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  margin-bottom: 60px;
}

.profile-form {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 16px;
  max-width: 1200px;
  width: 100%;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  border: 1px solid #fcd34d;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
}

@media (min-width: 640px) {
  .profile-form {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .profile-form {
    grid-template-columns: repeat(4, 1fr);
  }
}

.profile-picture {
  grid-column: span 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profile-picture img {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  border: 4px solid #fcd34d;
  object-fit: cover;
  margin-bottom: 8px;
}

.profile-picture input[type="file"] {
  font-size: 0.9rem;
  color: #92400e;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 600;
  color: #92400e;
  margin-bottom: 4px;
}

.form-group input,
.form-group select {
  border: 1px solid #fcd34d;
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 1rem;
  color: #78350f;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #fbbf24;
  outline: none;
  box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.3);
}

.form-group .readonly {
  background-color: #fef3c7;
  cursor: not-allowed;
}

.status-group {
  flex-direction: row;
  align-items: center;
  gap: 8px;
}

.button-group {
  grid-column: span 1;
}

@media (min-width: 640px) {
  .button-group {
    grid-column: span 2;
  }
}

@media (min-width: 1024px) {
  .button-group {
    grid-column: span 4;
  }
}

.button-group button {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 9999px;
  background-color: #facc15;
  color: #fff;
  font-weight: 600;
  font-size: 1rem;
  transition: transform 0.2s, background-color 0.2s;
}

.button-group button:hover {
  background-color: #fbbf24;
  transform: scale(1.03);
}
</style>
