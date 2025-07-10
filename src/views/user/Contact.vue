<template>
  <div class="min-h-screen bg-gradient-to-br from-white-50 to-white flex items-center justify-center p-6">
    <div class="max-w-5xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col lg:flex-row">
      <!-- Contact Information Section -->
      <div class="p-8 lg:w-1/2 bg-purple-900 text-white">
        <h2 class="text-3xl font-bold mb-6">Contact Us</h2>
        <p class="text-base mb-8">We’re here to assist with your shopping experience. Reach out for order inquiries or product support.</p>
        <div class="space-y-6">
          <div class="flex items-center">
            <i class="fas fa-map-marker-alt text-purple-200 mr-4"></i>
            <div>
              <p class="font-semibold text-lg">Our Location</p>
              <p class="text-base">99 S.T. Jomblo Park, Pekanbaru, 28292, Indonesia</p>
            </div>
          </div>
          <div class="flex items-center">
            <i class="fas fa-phone text-purple-200 mr-4"></i>
            <div>
              <p class="font-semibold text-lg">Phone Number</p>
              <p class="text-base">+62(81) 414 257 9980</p>
            </div>
          </div>
          <div class="flex items-center">
            <i class="fas fa-envelope text-purple-200 mr-4"></i>
            <div>
              <p class="font-semibold text-lg">Email Address</p>
              <p class="text-base">info@yourdoman.com</p>
            </div>
          </div>
        </div>
      </div>
      <!-- Contact Form Section -->
      <div class="p-8 lg:w-1/2 bg-white relative">
        <div class="absolute top-0 right-0 w-20 h-20 bg-purple-100 rounded-bl-full"></div>
        <h2 class="text-3xl font-bold text-gray-900 mb-6">Customer Feedback</h2>
        <form @submit.prevent="submitForm" class="space-y-5">
          <div>
            <input
              v-model="form.name"
              type="text"
              placeholder="Your Name"
              required
              class="w-full p-4 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 text-gray-700 placeholder-gray-400"
            />
          </div>
          <div>
            <input
              v-model="form.email"
              type="email"
              placeholder="Your Email"
 
              class="w-full p-4 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 text-gray-700 placeholder-gray-400"
            />
          </div>
          <div>
            <input
              v-model="form.phone"
              type="tel"
              placeholder="Your Phone"
              required
              class="w-full p-4 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 text-gray-700 placeholder-gray-400"
            />
          </div>
          <div>
            <textarea
              v-model="form.message"
              placeholder="Your Message"
              required
              class="w-full p-4 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 text-gray-700 placeholder-gray-400 h-32 resize-none"
            ></textarea>
          </div>
          <button
            type="submit"
            class="w-full bg-purple-700 text-white font-semibold py-3 rounded-xl hover:bg-purple-800 transition-colors duration-200"
            :disabled="isSubmitting.value"
          >
            {{ isSubmitting.value ? 'Sending...' : 'Send Message' }}
          </button>
        </form>
        <div class="absolute bottom-0 right-0 w-4 h-24 bg-purple-900 opacity-10 transform rotate-45"></div>
      </div>
    </div>
  </div>
</template>

<script>
import apiURL from '@/api/config';
import axios from 'axios';
import { reactive, ref } from 'vue';

export default {
  name: 'ContactView',
  setup() {
    const form = reactive({
      name: '',
      email: '',
      phone: '',
      message: ''
    });
    const isSubmitting = ref(false);

    const submitForm = async () => {
      
      isSubmitting.value = true;
      try {
        // Map form fields to backend fields
        const payload = {
          fields: {
            name: form.name,
            email: form.email,
            phoneNumber: form.phone,
            feedback: form.message,
            createdBy: form.email || form.name // fallback if not logged in
          }
        };
        // Prepare headers
        const headers = { 'Content-Type': 'application/json' };
        const token = localStorage.getItem('token');
        if (token) headers['Authorization'] = `Bearer ${token}`;
        
        const response = await axios.post(`${apiURL}/api/insertDoc/CustomerFeedback`, payload, { headers });
        if (response.data && response.data.success) {
          alert('Message sent successfully!');
          form.name = '';
          form.email = '';
          form.phone = '';
          form.message = '';
        } else {
          alert(response.data.message || 'An error occurred. Please try again.');
        }
      } catch (error) {
        alert(error.response?.data?.message || 'An error occurred. Please try again.');
      } finally {
        isSubmitting.value = false;
      }
    };

    return { form, isSubmitting, submitForm };
  }
};
</script>

<style>
/* Custom Tailwind colors */
.bg-purple-100 { background-color: #e0e7ff; }
</style>