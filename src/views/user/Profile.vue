<!-- <template>
  <div class="font-poppins min-h-screen bg-gray-100 py-5">
    <div class="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div class="bg-white px-8 py-8 text-center border-b border-gray-200">
        <h1 class="text-gray-800 text-2xl font-semibold mb-2">Profile Settings</h1>
        <p class="text-gray-500 text-base">Update your personal information</p>
      </div>

      <form @submit.prevent="updateProfile" class="px-8 py-8">
      
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
</template> -->
<template>
  <div class="font-inter min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto bg-white rounded-2xl overflow-hidden shadow-lg">
      <!-- Header with gradient background -->
      <div class="bg-gradient-to-r from-yellow-400 to-yellow-500 px-10 py-8 text-white">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold mb-1">Profile Settings</h1>
            <p class="text-yellow-100 font-medium">Manage your personal information</p>
          </div>
          <!-- <div class="w-16 h-16 rounded-full border-4 border-white/30 overflow-hidden shadow-lg">
            <img :src="form.profilePicture || defaultImage" alt="Profile" class="w-full h-full object-cover" />
          </div> -->
        </div>
      </div>

      <form @submit.prevent="updateProfile" class="px-10 py-8">
        <!-- Profile Picture Upload -->
        <div class="flex justify-center -mt-20 mb-8">
          <div class="relative group">
            <div class="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden">
              <img :src="form.profilePicture || defaultImage" alt="Profile" class="w-full h-full object-cover" />
            </div>
            <label for="profile-upload" class="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
              <div class="bg-white/90 text-yellow-600 p-2 rounded-full shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </label>
            <input id="profile-upload" type="file" @change="handleImageUpload" accept="image/*" class="hidden" />
          </div>
        </div>

        <div class="space-y-8">
          <!-- Personal Information Card -->
          <div class="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div class="flex items-center mb-6">
              <div class="w-1.5 h-8 bg-yellow-400 rounded-full mr-3"></div>
              <h3 class="text-xl font-semibold text-gray-800">Personal Information</h3>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-1">
                <label class="text-sm font-medium text-gray-700">Full Name</label>
                <div class="relative">
                  <input v-model="form.name" type="text" required class="w-full px-4 py-3 text-gray-700 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-yellow-300 focus:border-yellow-400 outline-none transition placeholder-gray-400 pl-12" placeholder="John Doe" />
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div class="space-y-1">
                <label class="text-sm font-medium text-gray-700">Email</label>
                <div class="relative">
                  <input v-model="form.email" type="email" class="w-full px-4 py-3 text-gray-700 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-yellow-300 focus:border-yellow-400 outline-none transition placeholder-gray-400 pl-12" placeholder="example@email.com" />
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div class="space-y-1">
                <label class="text-sm font-medium text-gray-700">Phone Number</label>
                <div class="relative">
                  <input v-model="form.phoneNumber" type="text" required class="w-full px-4 py-3 text-gray-700 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-yellow-300 focus:border-yellow-400 outline-none transition placeholder-gray-400 pl-12" placeholder="+1234567890" />
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div class="space-y-1">
                <label class="text-sm font-medium text-gray-700">Gender</label>
                <div class="relative">
                  <select v-model="form.gender" class="w-full px-4 py-3 text-gray-700 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-yellow-300 focus:border-yellow-400 outline-none transition appearance-none pr-10 pl-12">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Address Information Card -->
          <div class="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div class="flex items-center mb-6">
              <div class="w-1.5 h-8 bg-yellow-400 rounded-full mr-3"></div>
              <h3 class="text-xl font-semibold text-gray-800">Address Information</h3>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-1">
                <label class="text-sm font-medium text-gray-700">Country</label>
                <div class="relative">
                  <input v-model="form.country" type="text" placeholder="Enter country" class="w-full px-4 py-3 text-gray-700 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-yellow-300 focus:border-yellow-400 outline-none transition placeholder-gray-400 pl-12" />
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div class="space-y-1">
                <label class="text-sm font-medium text-gray-700">Province</label>
                <div class="relative">
                  <select v-model="selectedProvince" @change="onProvinceChange" class="w-full px-4 py-3 text-gray-700 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-yellow-300 focus:border-yellow-400 outline-none transition appearance-none pr-10 pl-12">
                    <option value="">Select Province</option>
                    <option v-for="province in provinces" :key="province" :value="province">{{ province }}</option>
                  </select>
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div class="space-y-1">
                <label class="text-sm font-medium text-gray-700">District</label>
                <div class="relative">
                  <select v-model="selectedDistrict" @change="onDistrictChange" :disabled="!selectedProvince" class="w-full px-4 py-3 text-gray-700 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-yellow-300 focus:border-yellow-400 outline-none transition appearance-none pr-10 pl-12 disabled:bg-gray-100 disabled:text-gray-400">
                    <option value="">Select District</option>
                    <option v-for="district in filteredDistricts" :key="district" :value="district">{{ district }}</option>
                  </select>
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div class="space-y-1">
                <label class="text-sm font-medium text-gray-700">Commune</label>
                <div class="relative">
                  <select v-model="form.commune" :disabled="!selectedDistrict" class="w-full px-4 py-3 text-gray-700 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-yellow-300 focus:border-yellow-400 outline-none transition appearance-none pr-10 pl-12 disabled:bg-gray-100 disabled:text-gray-400">
                    <option value="">Select Commune</option>
                    <option v-for="commune in filteredCommunes" :key="commune" :value="commune">{{ commune }}</option>
                  </select>
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div class="space-y-1">
                <label class="text-sm font-medium text-gray-700">Village</label>
                <div class="relative">
                  <input v-model="form.village" type="text" placeholder="Enter village" class="w-full px-4 py-3 text-gray-700 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-yellow-300 focus:border-yellow-400 outline-none transition placeholder-gray-400 pl-12" />
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div class="space-y-1">
                <label class="text-sm font-medium text-gray-700">Role</label>
                <div class="relative">
                  <input v-model="form.role" type="text" class="w-full px-4 py-3 text-gray-500 bg-gray-100 rounded-lg border border-gray-200 cursor-not-allowed pl-12" disabled />
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end gap-4 mt-10 pt-6 border-t border-gray-100">
          <button type="button" class="px-6 py-3 text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2">
            Cancel
          </button>
          <button type="submit" class="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-medium rounded-lg shadow-sm hover:from-yellow-500 hover:to-yellow-600 transition-all focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            Save Changes
          </button>
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
  role: 'customer'
});

// Location dropdown state
const locations = ref([]);
const provinces = ref([]);
const selectedProvince = ref('');
const filteredDistricts = ref([]);
const selectedDistrict = ref('');
const filteredCommunes = ref([]);

// Fetch user profile & restore data
const fetchProfile = async () => {
  const token = localStorage.getItem('token');
  try {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    if (!token || !userId) {
      Swal.fire({ icon: 'error', title: 'Authentication required' });
      return;
    }

    const res = await axios.get(`${apiURL}/api/getAllDocs/User`, {
      headers: { Authorization: token ? `Bearer ${token}` : '' },
      params: {
        dynamicConditions: JSON.stringify([
          { field: '_id', operator: '==', value: userId }
        ])
      }
    });
    
    if (res.data.success && res.data.data.length > 0) {
      const userData = res.data.data[0];
      // Only assign necessary fields for display and update
      const { name, email, phoneNumber, gender, profilePicture, country, province, district, commune, village, role } = userData;
      Object.assign(form.value, { 
        name, email, phoneNumber, gender, profilePicture, 
        country, province, district, commune, village, role
      });

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
    const userId = localStorage.getItem('userId');
    
    if (!token || !userId) {
      Swal.fire({ icon: 'error', title: 'Authentication required' });
      return;
    }

    // Only send necessary fields for update
    const { name, email, phoneNumber, gender, country, province, district, commune, village } = form.value;
    const updateData = { 
      fields: {
        name, email, phoneNumber, gender, country, province, district, commune, village
      }
    };
    
    await axios.patch(`${apiURL}/api/updateDoc/User/${userId}`, updateData, {
      headers: { Authorization: token ? `Bearer ${token}` : '' },
    });
    Swal.fire({ icon: 'success', title: 'Profile updated successfully' });
  } catch (err) {
    console.error(err);
    Swal.fire({ icon: 'error', title: 'Failed to update profile', text: err.response?.data?.message });
  }
};

// Profile picture upload - using dynamic route for user collection
const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  try {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    if (!token || !userId) {
      Swal.fire({ icon: 'error', title: 'Authentication required' });
      return;
    }

    // Convert file to base64 for storage in user document
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Image = event.target.result;
      
      try {
        // Update the user document with the base64 image data
        await axios.patch(`${apiURL}/api/updateDoc/User/${userId}`, 
          { fields: { profilePicture: base64Image } }, 
          { headers: { Authorization: token ? `Bearer ${token}` : '' } }
        );
        
        form.value.profilePicture = base64Image;
        Swal.fire({ icon: 'success', title: 'Profile picture updated' });
      } catch (err) {
        console.error(err);
        Swal.fire({ icon: 'error', title: 'Error updating profile picture' });
      }
    };
    
    reader.readAsDataURL(file);
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

// Load profile on mount
onMounted(async () => {
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
