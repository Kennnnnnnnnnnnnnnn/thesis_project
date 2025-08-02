<template>
  <div class="max-w-2xl mx-auto p-6 bg-white flex items-center justify-center bg-black/60 backdrop-blur-sm z-[1000] " ref="invoiceContent">
    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-12">
      <div class="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p class="text-gray-600">Loading invoice data...</p>
    </div>

    <!-- Invoice Content -->
    <div v-else>
      <!-- Header Message -->
      <div class="mb-8">
        <h1 class="text-xl font-medium text-gray-900 mb-2">
          Your invoice from the previous order.
        </h1>
    
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
            <dt class="text-sm font-medium text-gray-900">Order ID</dt>
            <dd class="text-sm text-gray-600 font-mono">{{ orderId || transactionId }}</dd>
          </div>
          
          <div>
            <dt class="text-sm font-medium text-gray-900">Payment Method</dt>
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
              <th class="px-4 py-3 text-center text-sm font-medium text-gray-900">Quantity</th>
              <th class="px-4 py-3 text-right text-sm font-medium text-gray-900">Price</th>
              <th class="px-4 py-3 text-right text-sm font-medium text-gray-900">Amount</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="item in invoiceItems" :key="item.id" class="bg-white">
              <td class="px-4 py-4">
                <div class="text-sm font-medium text-gray-900">{{ item.name }}</div>
                <div class="text-sm text-gray-600">{{ item.description || 'Product' }}</div>
              </td>
              <td class="px-4 py-4 text-center text-sm text-gray-900">
                {{ item.quantity }}
              </td>
              <td class="px-4 py-4 text-right text-sm text-gray-900">
                {{ formatCurrency(item.price) }}
              </td>
              <td class="px-4 py-4 text-right text-sm text-gray-900">
                {{ formatCurrency(item.amount) }}
              </td>
            </tr>
          </tbody>
          <tfoot class="bg-gray-50">
            <tr>
              <td colspan="3" class="px-4 py-3 text-right text-sm font-medium text-gray-900">Total</td>
              <td class="px-4 py-3 text-right text-sm font-medium text-gray-900">
                {{ formatCurrency(totalAmount) }}
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

      <!-- Action Buttons -->
      <div ref="actionButtons" class="mt-8 flex justify-end gap-3 print:hidden no-pdf invisible">
        <button 
          @click="downloadPDF"
          :disabled="isGeneratingPDF"
          class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <i v-if="!isGeneratingPDF" class="fa-solid fa-download"></i>
          <i v-else class="fa-solid fa-spinner fa-spin"></i>
          {{ isGeneratingPDF ? 'Generating PDF...' : 'Download PDF' }}
        </button>
        <button 
          @click="printInvoice"
          class="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors"
        >
          <i class="fa-solid fa-print mr-2"></i>
          Print Invoice
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import apiURL from '@/api/config'
import axios from 'axios'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { computed, nextTick, onMounted, ref } from 'vue'

// Props (you can pass these from parent component)
const props = defineProps({
  orderId: {
    type: String,
    default: null
  },
  customerName: {
    type: String,
    default: ''
  },
  customerEmail: {
    type: String,
    default: ''
  },
  transactionId: {
    type: String,
    default: ''
  },
  paymentMethod: {
    type: String,
    default: 'Cash'
  },
  date: {
    type: Date,
    default: () => new Date()
  }
})

// Reactive data
const invoiceContent = ref(null)
const actionButtons = ref(null)
const isGeneratingPDF = ref(false)
const isLoading = ref(false)
const orderData = ref(null)

// Company information
const companyName = ref('Fresh Ecommerce')
const supportUrl = ref('https://support.freshecommerce.com/contact')

const companyInfo = ref({
  name: 'Fresh Ecommerce, Inc.',
  address: {
    street: '123 Business Street',
    city: 'Phnom Penh',
    state: 'Cambodia',
    zip: '12000',
    country: 'Cambodia'
  }
})

// Invoice items - will be populated from order data
const invoiceItems = ref([])

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

const customerName = computed(() => {
  return props.customerName || orderData.value?.userId?.name || 'Customer'
})

const customerEmail = computed(() => {
  return props.customerEmail || orderData.value?.userId?.email || 'customer@example.com'
})

// Methods
const formatCurrency = (amount) => {
  // Format for Cambodian Riel
  return new Intl.NumberFormat('en-US').format(Math.round(amount || 0)) + ' ៛'
}

const printInvoice = () => {
  window.print()
}

// Fetch order data
const fetchOrderData = async () => {
  if (!props.orderId) {
    console.log('No order ID provided, using default invoice items')
    // Use default items if no order ID
    invoiceItems.value = [
      {
        id: 1,
        name: 'Order Item',
        description: 'Product from your order',
        quantity: 1,
        price: 29.99,
        amount: 29.99
      }
    ]
    isLoading.value = false
    return
  }

  try {
    isLoading.value = true
    const token = localStorage.getItem('token')
    
    if (!token) {
      throw new Error('No authentication token found')
    }

    console.log('Fetching order data for ID:', props.orderId)

    // Fetch order details
    const response = await axios.get(`${apiURL}/api/getAllDocs/Order`, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        dynamicConditions: JSON.stringify([
          { field: '_id', operator: '==', value: props.orderId }
        ])
      }
    })

    console.log('Order API response:', response.data)

    if (response.data.success && response.data.data.length > 0) {
      orderData.value = response.data.data[0]
      console.log('Order data:', orderData.value)
      
      // Transform order items to invoice items
      if (orderData.value.items && orderData.value.items.length > 0) {
        invoiceItems.value = orderData.value.items.map(item => ({
          id: item.productId || item._id || Math.random(),
          name: item.name || 'Product',
          description: `Order item from ${formatDate(orderData.value.createdAt)}`,
          quantity: item.quantity || 1,
          price: item.price || 0,
          amount: (item.quantity || 1) * (item.price || 0)
        }))
      } else {
        // Fallback if no items found
        invoiceItems.value = [
          {
            id: 1,
            name: 'Order Product',
            description: `Order from ${formatDate(orderData.value.createdAt)}`,
            quantity: 1,
            price: orderData.value.totalCost || 0,
            amount: orderData.value.totalCost || 0
          }
        ]
      }
    } else {
      throw new Error('Order not found')
    }
  } catch (error) {
    console.error('Error fetching order data:', error)
    // Fallback to default items
    invoiceItems.value = [
      {
        id: 1,
        name: 'Order Item',
        description: 'Product from your order',
        quantity: 1,
        price: 2000,
        amount: 2000
      }
    ]
  } finally {
    isLoading.value = false
  }
}

// PDF Download functionality
const downloadPDF = async () => {
  if (isGeneratingPDF.value) return
  
  try {
    isGeneratingPDF.value = true
    
    // Hide action buttons during PDF generation
    if (actionButtons.value) {
      actionButtons.value.classList.add('hidden')
    }
    
    // Wait for next tick to ensure DOM is updated
    await nextTick()
    
    // Create canvas from the invoice content
    const canvas = await html2canvas(invoiceContent.value, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      ignoreElements: (element) => {
        // Ignore elements with class 'no-pdf' or 'print:hidden'
        return element.classList.contains('no-pdf') || 
               element.classList.contains('print:hidden') ||
               element.closest('.no-pdf') ||
               element.closest('.print\\:hidden')
      }
    })
    
    const imgData = canvas.toDataURL('image/png')
    
    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })
    
    // Calculate dimensions
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const imgWidth = pageWidth - 20 // 10mm margin on each side
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    
    // Add image to PDF
    if (imgHeight <= pageHeight - 20) {
      // Single page
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight)
    } else {
      // Multiple pages
      let remainingHeight = imgHeight
      let currentY = 0
      
      while (remainingHeight > 0) {
        const sliceHeight = Math.min(pageHeight - 20, remainingHeight)
        
        pdf.addImage(
          imgData, 
          'PNG', 
          10, 
          10, 
          imgWidth, 
          sliceHeight,
          undefined,
          'FAST',
          0,
          currentY * (canvas.height / imgHeight)
        )
        
        remainingHeight -= sliceHeight
        currentY += sliceHeight
        
        if (remainingHeight > 0) {
          pdf.addPage()
        }
      }
    }
    
    // Generate filename
    const fileName = `invoice-${props.orderId || 'order'}-${new Date().toISOString().split('T')[0]}.pdf`
    
    // Download PDF
    pdf.save(fileName)
    
  } catch (error) {
    console.error('Error generating PDF:', error)
    alert('Failed to generate PDF. Please try again.')
  } finally {
    // Show action buttons again
    if (actionButtons.value) {
      actionButtons.value.classList.remove('hidden')
    }
    isGeneratingPDF.value = false
  }
}

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return ''
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('en-US', options)
}

// Functions to update invoice data (for dynamic use)
const updateCustomerInfo = (name, email) => {
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

// Load order data on mount
onMounted(() => {
  fetchOrderData()
})

// Expose methods for parent component use
defineExpose({
  updateCustomerInfo,
  addInvoiceItem,
  removeInvoiceItem,
  printInvoice,
  downloadPDF,
  fetchOrderData
})
</script>

<style>
@media print {
  .max-w-2xl {
    max-width: none;
  }
  
  .print\:hidden {
    display: none !important;
  }
  
  .no-pdf {
    display: none !important;
  }
  
  body {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }
  
  * {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }
}
</style>