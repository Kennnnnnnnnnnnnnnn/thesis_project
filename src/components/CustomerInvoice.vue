<template>
  <div class="max-w-2xl mx-auto p-6 bg-white">
    <!-- Header Message -->
    <div class="mb-8">
      <h1 class="text-xl font-medium text-gray-900 mb-2">
        We received payment for your {{ companyName }} subscription. Thanks for your business!
      </h1>
      <p class="text-gray-600">
        Questions? Visit 
        <a :href="supportUrl" class="text-blue-600 hover:underline">{{ supportUrl }}</a>
      </p>
    </div>

    <!-- Invoice Details Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div class="space-y-4">
        <div>
          <dt class="text-sm font-medium text-gray-900">Date</dt>
          <dd class="text-sm text-gray-600">{{ formattedDate }}</dd>
        </div>
        
        <div>
          <dt class="text-sm font-medium text-gray-900">Account billed</dt>
          <dd class="text-sm text-gray-600">{{ customerName }} ({{ customerEmail }})</dd>
        </div>
      </div>
      
      <div class="space-y-4">
        <div>
          <dt class="text-sm font-medium text-gray-900">Transaction ID</dt>
          <dd class="text-sm text-gray-600 font-mono">{{ transactionId }}</dd>
        </div>
        
        <div>
          <dt class="text-sm font-medium text-gray-900">Charged to</dt>
          <dd class="text-sm text-gray-600">{{ paymentMethod }}</dd>
        </div>
      </div>
    </div>

    <!-- Items Table -->
    <div class="border border-gray-200 rounded-lg overflow-hidden mb-8">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left text-sm font-medium text-gray-900">Description</th>
            <th class="px-4 py-3 text-right text-sm font-medium text-gray-900">Amount</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="item in invoiceItems" :key="item.id" class="bg-white">
            <td class="px-4 py-4">
              <div class="text-sm font-medium text-gray-900">{{ item.name }}</div>
              <div class="text-sm text-gray-600">{{ item.period }}</div>
            </td>
            <td class="px-4 py-4 text-right text-sm text-gray-900">
              {{ formatCurrency(item.amount) }}
            </td>
          </tr>
        </tbody>
        <tfoot class="bg-gray-50">
          <tr>
            <td class="px-4 py-3 text-right text-sm font-medium text-gray-900">Total</td>
            <td class="px-4 py-3 text-right text-sm font-medium text-gray-900">
              {{ formatCurrency(totalAmount) }}*
            </td>
          </tr>
        </tfoot>
      </table>
    </div>

    <!-- Company Information -->
    <div class="border-t border-gray-200 pt-6">
      <div class="text-sm text-gray-600 space-y-1">
        <div class="font-medium text-gray-900">{{ companyInfo.name }}</div>
        <div>{{ companyInfo.address.street }}</div>
        <div>{{ companyInfo.address.city }}, {{ companyInfo.address.state }} {{ companyInfo.address.zip }}</div>
        <div>{{ companyInfo.address.country }}</div>
        <div class="pt-2">
          <a :href="supportUrl" class="text-blue-600 hover:underline">{{ supportUrl }}</a>
        </div>
      </div>
    </div>

    <!-- Footer Note -->
    <div class="mt-6 text-xs text-gray-500">
      * VAT/GST paid directly by {{ companyName }}, where applicable
    </div>

    <!-- Print Button -->
    <div class="mt-8 flex justify-end">
      <button 
        @click="printInvoice"
        class="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors"
      >
        Print Invoice
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Props (you can pass these from parent component)
const props = defineProps({
  customerName: {
    type: String,
    default: 'John Doe'
  },
  customerEmail: {
    type: String,
    default: 'john.doe@example.com'
  },
  transactionId: {
    type: String,
    default: 'ch_3RmenLJFr6CCHwIi0VjGjibC'
  },
  paymentMethod: {
    type: String,
    default: 'Visa (4*** **** **** 7322)'
  },
  date: {
    type: Date,
    default: () => new Date()
  }
})

// Company information
const companyName = ref('Your Company')
const supportUrl = ref('https://support.yourcompany.com/contact')

const companyInfo = ref({
  name: 'Your Company, Inc.',
  address: {
    street: '123 Business Street',
    city: 'San Francisco',
    state: 'CA',
    zip: '94107',
    country: 'United States'
  }
})

// Invoice items
const invoiceItems = ref([
  {
    id: 1,
    name: 'Premium Subscription - Monthly',
    period: 'Jul 12, 2025 - Aug 11, 2025',
    amount: 29.99
  },
  {
    id: 2,
    name: 'Additional Features Pack',
    period: 'Jul 12, 2025 - Aug 11, 2025',
    amount: 9.99
  }
])

// Computed properties
const formattedDate = computed(() => {
  return props.date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  })
})

const totalAmount = computed(() => {
  return invoiceItems.value.reduce((sum, item) => sum + item.amount, 0)
})

// Methods
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

const printInvoice = () => {
  window.print()
}

// Functions to update invoice data (for dynamic use)
const updateCustomerInfo = (name, email) => {
  // You can call this from parent component to update customer info
  console.log('Customer info updated:', { name, email })
}

const addInvoiceItem = (item) => {
  invoiceItems.value.push({
    id: Date.now(),
    ...item
  })
}

const removeInvoiceItem = (itemId) => {
  const index = invoiceItems.value.findIndex(item => item.id === itemId)
  if (index > -1) {
    invoiceItems.value.splice(index, 1)
  }
}

// Expose methods for parent component use
defineExpose({
  updateCustomerInfo,
  addInvoiceItem,
  removeInvoiceItem,
  printInvoice
})
</script>

<style scoped>
@media print {
  .max-w-2xl {
    max-width: none;
  }
  
  button {
    display: none;
  }
  
  body {
    print-color-adjust: exact;
  }
}

/* Custom scrollbar for better aesthetics */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>