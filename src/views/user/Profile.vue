<template>
  <div class="profile-page">
    <div class="profile-container">
      <div class="profile-header">
        <h1>Profile Settings</h1>
        <p>Update your personal information</p>
      </div>

      <form @submit.prevent="updateProfile" class="profile-form">
        <!-- Profile Picture -->
        <div class="profile-picture-section">
          <div class="profile-picture">
            <img :src="form.profilePicture || defaultImage" alt="Profile" />
            <div class="upload-overlay">
              <label for="profile-upload" class="upload-btn">Change Photo</label>
              <input id="profile-upload" type="file" @change="handleImageUpload" accept="image/*" />
            </div>
          </div>
        </div>

        <div class="form-sections">
          <!-- Personal Information -->
          <div class="form-section">
            <h3>Personal Information</h3>
            <div class="form-row">
              <div class="form-group">
                <label>Full Name</label>
                <input v-model="form.name" type="text" required />
              </div>
              <div class="form-group">
                <label>Email</label>
                <input v-model="form.email" type="email" />
              </div>
            </div>
            <div class="form-row">
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
            </div>
          </div>

          <!-- Address Information -->
          <div class="form-section">
            <h3>Address Information</h3>
            <div class="form-row">
              <div class="form-group">
                <label>Country</label>
                <input v-model="form.country" type="text" placeholder="Enter country" />
              </div>
              <div class="form-group">
                <label>Province</label>
                <select v-model="selectedProvince" @change="onProvinceChange">
                  <option value="">Select Province</option>
                  <option v-for="province in provinces" :key="province" :value="province">{{ province }}</option>
                </select>
              </div>
            </div>
            <div class="form-row">
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
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Village</label>
                <input v-model="form.village" type="text" placeholder="Enter village" />
              </div>
              <div class="form-group">
                <label>Role</label>
                <input v-model="form.role" type="text" class="readonly" disabled />
              </div>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-primary">Save Changes</button>
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


<style scoped>
.profile-page {
  font-family: 'Poppins', sans-serif;
  min-height: 100vh;
  background: #f8f9fa;
  padding: 20px;
}

.profile-container {
  max-width: 800px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.profile-header {
  background: #ffffff;
  padding: 30px;
  text-align: center;
  border-bottom: 1px solid #e9ecef;
}

.profile-header h1 {
  color: #333;
  font-size: 2rem;
  margin: 0 0 8px 0;
  font-weight: 600;
}

.profile-header p {
  color: #6c757d;
  margin: 0;
  font-size: 1rem;
}

.profile-form {
  padding: 30px;
}

.profile-picture-section {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
}

.profile-picture {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 3px solid #e9ecef;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.3s ease;
}

.profile-picture:hover {
  border-color: #007bff;
}

.profile-picture img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.profile-picture:hover .upload-overlay {
  opacity: 1;
}

.upload-btn {
  background-color: #007bff;
  color: #fff;
  padding: 6px 12px;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.8rem;
  cursor: pointer;
  border: none;
  transition: background-color 0.2s;
}

.upload-btn:hover {
  background-color: #0056b3;
}

.upload-btn input[type="file"] {
  display: none;
}

.form-sections {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.form-section {
  background: #ffffff;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 25px;
}

.form-section h3 {
  color: #333;
  font-size: 1.25rem;
  margin-bottom: 20px;
  font-weight: 600;
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 10px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.form-row:last-child {
  margin-bottom: 0;
}

@media (min-width: 640px) {
  .form-row {
    grid-template-columns: repeat(2, 1fr);
  }
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 500;
  color: #495057;
  margin-bottom: 6px;
  font-size: 0.9rem;
}

.form-group input,
.form-group select {
  border: 1px solid #ced4da;
  border-radius: 6px;
  padding: 10px 12px;
  font-size: 1rem;
  color: #495057;
  background-color: #ffffff;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.form-group input:disabled,
.form-group select:disabled {
  background-color: #f8f9fa;
  color: #6c757d;
  cursor: not-allowed;
}

.form-group .readonly {
  background-color: #f8f9fa;
  color: #6c757d;
  cursor: not-allowed;
}

.form-actions {
  text-align: center;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
}

.btn-primary {
  background-color: #007bff;
  color: #ffffff;
  border: none;
  padding: 12px 30px;
  border-radius: 6px;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
  min-width: 150px;
}

.btn-primary:hover {
  background-color: #0056b3;
  transform: translateY(-1px);
}

.btn-primary:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .profile-page {
    padding: 10px;
  }
  
  .profile-container {
    border-radius: 8px;
  }
  
  .profile-form {
    padding: 20px;
  }
  
  .form-section {
    padding: 20px;
  }
  
  .profile-header {
    padding: 20px;
  }
  
  .profile-header h1 {
    font-size: 1.5rem;
  }
}
</style>
