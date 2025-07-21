<template>
    <div v-if="show" class="fixed inset-0 flex items-start pt-24 justify-center bg-black/40 z-[1000]">
      <div class="bg-white w-80 rounded-2xl shadow-2xl p-6 animate-fade-in">
        <div class="flex flex-col items-center">
          <div class="text-3xl mb-2">🗑️</div>
          <h3 class="font-bold text-lg text-green-700 mb-2">Delete Confirmation</h3>
          <p class="text-gray-600 mb-6 text-center">{{ message || 'Heads up! Are you sure you want to delete this item?' }}</p>
          <div class="flex gap-3 w-full">
            <button @click="cancel"
              class="flex-1 py-2 rounded-full bg-gray-100 text-gray-700 shadow hover:bg-gray-200 border border-gray-200 transition">
              Cancel
            </button>
            <button @click="confirm"
              class="flex-1 py-2 rounded-full bg-green-500 text-white font-bold shadow-lg hover:bg-green-600 transition">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({ 
  show: Boolean,
  message: String
})
  const emit = defineEmits(['cancel', 'confirm'])
  const cancel = () => emit('cancel')
  const confirm = () => emit('confirm')
  </script>
  
  <style scoped>
  @keyframes fade-in {
    0% { opacity: 0; transform: scale(.96);}
    100% { opacity: 1; transform: scale(1);}
  }
  .animate-fade-in {
    animation: fade-in 0.3s ease;
  }
  </style>
  