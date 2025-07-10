<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="max-w-4xl w-full bg-white rounded-lg shadow-md flex flex-col md:flex-row">
      <!-- Contact Information Section -->
      <div class="p-6 md:w-1/2 bg-gray-100">
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">Get in Touch</h2>
        <p class="text-gray-600 mb-6">We're here to help with any questions or support you need. Reach out to us!</p>
        <div class="space-y-4">
          <div class="flex items-start">
            <i class="fas fa-map-marker-alt text-gray-500 mr-3 mt-1"></i>
            <div>
              <p class="font-medium text-gray-700">Our Location</p>
              <p class="text-gray-600">99 S.T. Jomblo Park, Pekanbaru, 28292, Indonesia</p>
            </div>
          </div>
          <div class="flex items-start">
            <i class="fas fa-phone text-gray-500 mr-3 mt-1"></i>
            <div>
              <p class="font-medium text-gray-700">Phone Number</p>
              <p class="text-gray-600">+62 (81) 414 257 9980</p>
            </div>
          </div>
          <div class="flex items-start">
            <i class="fas fa-envelope text-gray-500 mr-3 mt-1"></i>
            <div>
              <p class="font-medium text-gray-700">Email Address</p>
              <p class="text-gray-600">info@yourdomain.com</p>
            </div>
          </div>
        </div>
      </div>
      <!-- Contact Form Section -->
      <div class="p-6 md:w-1/2 bg-white">
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">Send Us a Feedback</h2>
        <form @submit.prevent="submitForm" class="space-y-4">
          <div>
            <input
              v-model="form.name"
              type="text"
              placeholder="Your Name"
              required
              class="w-full p-3 border border-gray-300 rounded-md text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              v-model="form.email"
              type="email"
              placeholder="Your Email"
              class="w-full p-3 border border-gray-300 rounded-md text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              v-model="form.phone"
              type="tel"
              placeholder="Your Phone"
              required
              class="w-full p-3 border border-gray-300 rounded-md text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <textarea
              v-model="form.message"
              placeholder="Your Message"
              required
              class="w-full p-3 border border-gray-300 rounded-md text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 h-28 resize-none"
            ></textarea>
          </div>
          <button
            type="submit"
            class="w-full bg-yellow-600 text-white font-medium py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? 'Sending...' : 'Send Message' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import apiURL from '@/api/config';
import axios from 'axios';
import { reactive, ref } from 'vue';

const form = reactive({
  name: '',
  email: '',
  phone: '',
  message: '',
});
const isSubmitting = ref(false);

const submitForm = async () => {
  isSubmitting.value = true;
  try {
    const payload = {
      fields: {
        name: form.name,
        email: form.email,
        phoneNumber: form.phone,
        feedback: form.message,
        createdBy: form.email || form.name,
      },
    };
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
</script>

<style scoped>
/* No additional styles needed; Tailwind CSS handles everything */
</style>