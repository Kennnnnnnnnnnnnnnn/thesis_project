<template>
  <div class="bg-gray-50 font-poppins">
    <div class="max-w-4xl mx-auto p-6">
      <!-- Header -->
      <div class="text-center mb-8">
        <!-- <h1 class="text-3xl font-bold text-gray-800 mb-2">{{ $t('history.yourOrderHistory') }}</h1>
        <p class="text-gray-600 mb-4">{{ $t('history.reviewPastPurchases') }}</p> -->
        <!-- <div v-if="orders.length > 0" class="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
          {{ orders.length }} {{ orders.length === 1 ? $t('history.order') : $t('history.orders') }}
        </div> -->
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-gray-600">{{ $t('common.loading') }}...</p>
      </div>

      <!-- Orders List -->
      <div v-else-if="orders.length > 0" class="space-y-4">
        <div v-for="order in orders" :key="order._id"
          class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <!-- Order Header -->
          <div class="p-4 border-b border-gray-100">
            <div class="flex justify-between items-start">
              <div class="space-y-1">
                <div class="flex items-center text-gray-700">
                  <i class="far fa-calendar-alt mr-2 text-gray-500"></i>
                  <span class="text-sm">{{ formatDate(order.createdAt) }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <div class="text-lg font-semibold text-gray-800">
                    {{ $t('history.total') }}: {{ formatPrice(order.totalCost) }} ៛
                  </div>
                </div>

              </div>
              <div class="flex justify-between gap-3 items-end space-y-2">
                <span class="text-sm text-red-500 cursor-pointer hover:text-red-600 transition-colors" 
                      @click="downloadInvoice(order)"
                      title="Download Invoice">
                  <i class="fa-solid fa-download"></i>
                </span>

                <span :class="`px-2 py-1 rounded text-xs font-medium ${getStatusClass(order.status)}`">
                  {{ $t(order.status) }}
                </span>
              </div>
            </div>
          </div>


          <!-- Order Items -->
          <div class="p-4">
            <div class="space-y-3">
              <div v-for="(item, index) in order.items" :key="index"
                class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div class="relative">
                  <img :src="item.image || require('@/assets/image.png')" :alt="item.name"
                    class="w-16 h-16 object-cover rounded-lg" />
                  <span
                    class="absolute -top-1 -right-1 bg-yellow-500 text-white w-5 h-5 text-xs font-bold flex items-center justify-center rounded-full">
                    {{ item.quantity || 1 }}
                  </span>
                </div>
                <div class="flex-1">
                  <h4 class="font-medium text-gray-800 mb-1">{{ item.name || 'Product' }}</h4>
                  <p class="text-gray-600 font-medium">{{ formatPrice(item.price) }} ៛</p>
                </div>
              </div>
            </div>
          </div>
          <!-- Confirm Received Button (show only if status is delivering) -->
          <div v-if="normalizeStatus(order.status) === 'delivering'" class="flex  p-4">
            <button class="mt-4 px-4 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition"
              :disabled="isLoading" @click="confirmReceipt(order)">
              <i class="fas fa-check-circle mr-1"></i> Received
            </button>
          </div>

        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center item-center py-12">
        <i class="fas fa-shopping-basket text-4xl text-gray-400 mb-4"></i>
        <h3 class="text-xl font-semibold text-gray-800 mb-2">{{ $t('history.noHistoryYet') }}</h3>
        <p class="text-gray-600 mb-6">{{ $t('history.completedOrdersAppear') }}</p>
        <button @click="navigateToShop"
          class="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors">
          {{ $t('history.startShopping') }}
        </button>
      </div>
    </div>
  </div>
</template>


<script setup>
import apiURL from '@/api/config.js';
import socket from '@/services/socket.js';
import axios from 'axios';
import { onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const router = useRouter();
const { t } = useI18n();
const orders = ref([]);
const isLoading = ref(true);
const API = `${apiURL}/api`;



// Fetch orders
const fetchOrders = async () => {
  try {
    isLoading.value = true;
    const token = localStorage.getItem('token');
    if (!token) {
      // Guest user: don't redirect, just skip fetching
      isLoading.value = false;
      return;
    }

    const response = await axios.get(`${API}/getAllDocs/Order`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.data && response.data.success) {
      orders.value = response.data.data.sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
      );
    }
  } catch (error) {
    console.error('Failed to fetch orders:', error);
  } finally {
    isLoading.value = false;
  }
};

// Download invoice function - Direct PDF download
const downloadInvoice = async (order) => {
  try {

    
    // Create a hidden CustomerInvoice component for PDF generation
    await generatePDFDirectly(order);
    
  } catch (error) {
    console.error('Error downloading invoice:', error);
    alert('Failed to download invoice. Please try again.');
  }
}

// Generate PDF directly without modal
const generatePDFDirectly = async (order) => {
  try {
    // Create a temporary container for the invoice
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '-9999px';
    tempContainer.style.width = '800px';
    tempContainer.style.background = 'white';
    tempContainer.style.padding = '24px';
    
    // Generate invoice HTML
    const invoiceHTML = generateInvoiceHTML(order);
    tempContainer.innerHTML = invoiceHTML;
    
    // Add to DOM temporarily
    document.body.appendChild(tempContainer);
    
    // Import html2canvas and jsPDF dynamically
    const html2canvas = (await import('html2canvas')).default;
    const jsPDF = (await import('jspdf')).default;
    
    // Generate canvas
    const canvas = await html2canvas(tempContainer, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      width: 800,
      height: tempContainer.scrollHeight
    });
    
    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth - 20;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Add image to PDF
    if (imgHeight <= pageHeight - 20) {
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
    } else {
      let remainingHeight = imgHeight;
      let currentY = 0;
      
      while (remainingHeight > 0) {
        const sliceHeight = Math.min(pageHeight - 20, remainingHeight);
        
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
        );
        
        remainingHeight -= sliceHeight;
        currentY += sliceHeight;
        
        if (remainingHeight > 0) {
          pdf.addPage();
        }
      }
    }
    
    // Download PDF
    const fileName = `invoice-${order._id}-${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
    
    // Clean up
    document.body.removeChild(tempContainer);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Failed to generate PDF. Please try again.');
  }
}

// Generate invoice HTML template
const generateInvoiceHTML = (order) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US').format(Math.round(amount || 0)) + ' ៛';
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };
  
  const customerName = order.userId?.name || 'Customer';
  const customerEmail = order.userId?.email || 'customer@example.com';
  
  let itemsHTML = '';
  if (order.items && order.items.length > 0) {
    itemsHTML = order.items.map(item => `
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 16px; text-align: left;">
          <div style="font-weight: 500; color: #111827; font-size: 14px;">${item.name || 'Product'}</div>
          <div style="color: #6b7280; font-size: 14px;">Order item from ${new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
        </td>
        <td style="padding: 16px; text-align: center; font-size: 14px; color: #111827;">${item.quantity || 1}</td>
        <td style="padding: 16px; text-align: right; font-size: 14px; color: #111827;">${formatCurrency(item.price || 0)}</td>
        <td style="padding: 16px; text-align: right; font-size: 14px; color: #111827;">${formatCurrency((item.quantity || 1) * (item.price || 0))}</td>
      </tr>
    `).join('');
  } else {
    itemsHTML = `
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 16px; text-align: left;">
          <div style="font-weight: 500; color: #111827; font-size: 14px;">Order Product</div>
          <div style="color: #6b7280; font-size: 14px;">Order from ${new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
        </td>
        <td style="padding: 16px; text-align: center; font-size: 14px; color: #111827;">1</td>
        <td style="padding: 16px; text-align: right; font-size: 14px; color: #111827;">${formatCurrency(order.totalCost || 0)}</td>
        <td style="padding: 16px; text-align: right; font-size: 14px; color: #111827;">${formatCurrency(order.totalCost || 0)}</td>
      </tr>
    `;
  }
  
  return `
    <div style="max-width: 800px; margin: 0 auto; padding: 24px; background: white; font-family: system-ui, -apple-system, sans-serif;">
      <!-- Header Message -->
      <div style="margin-bottom: 32px;">
        <h1 style="font-size: 20px; font-weight: 500; color: #111827; margin-bottom: 8px; margin-top: 0;">
          Your invoice from the previous order.
        </h1>
        
      </div>

      <!-- Invoice Details Grid -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px;">
        <div>
          <div style="margin-bottom: 16px;">
            <dt style="font-size: 14px; font-weight: 500; color: #111827; margin-bottom: 4px;">Date</dt>
            <dd style="font-size: 14px; color: #6b7280; margin: 0;">${formatDate(order.createdAt)}</dd>
          </div>
          
          <div>
            <dt style="font-size: 14px; font-weight: 500; color: #111827; margin-bottom: 4px;">Account billed</dt>
            <dd style="font-size: 14px; color: #6b7280; margin: 0;">${customerName} (${customerEmail})</dd>
          </div>
        </div>
        
        <div>
          <div style="margin-bottom: 16px;">
            <dt style="font-size: 14px; font-weight: 500; color: #111827; margin-bottom: 4px;">Order ID</dt>
            <dd style="font-size: 14px; color: #6b7280; font-family: monospace; margin: 0;">${order._id}</dd>
          </div>
          
          <div>
            <dt style="font-size: 14px; font-weight: 500; color: #111827; margin-bottom: 4px;">Payment Method</dt>
            <dd style="font-size: 14px; color: #6b7280; margin: 0;">${order.paymentMethod || 'Cash'}</dd>
          </div>
        </div>
      </div>

      <!-- Items Table -->
      <div style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; margin-bottom: 32px;">
        <table style="width: 100%; border-collapse: collapse;">
          <thead style="background-color: #f9fafb;">
            <tr>
              <th style="padding: 12px 16px; text-align: left; font-size: 14px; font-weight: 500; color: #111827;">Description</th>
              <th style="padding: 12px 16px; text-align: center; font-size: 14px; font-weight: 500; color: #111827;">Quantity</th>
              <th style="padding: 12px 16px; text-align: right; font-size: 14px; font-weight: 500; color: #111827;">Price</th>
              <th style="padding: 12px 16px; text-align: right; font-size: 14px; font-weight: 500; color: #111827;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
          <tfoot style="background-color: #f9fafb;">
            <tr>
              <td colspan="3" style="padding: 12px 16px; text-align: right; font-size: 14px; font-weight: 500; color: #111827;">Total</td>
              <td style="padding: 12px 16px; text-align: right; font-size: 14px; font-weight: 500; color: #111827;">
                ${formatCurrency(order.totalCost || 0)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- Company Information -->
      <div style="border-top: 1px solid #e5e7eb; padding-top: 24px;">
        <div style="font-size: 14px; color: #6b7280; line-height: 1.4;">
          <div style="font-weight: 500; color: #111827;">Taing EangHuot</div>
          <div>123 Business Street</div>
          <div>Phnom Penh, Cambodia</div>
          <div>Cambodia</div>
        </div>
      </div>

    </div>
  `;
}

const closeInvoiceModal = () => {
  // This function is no longer needed but kept for compatibility
}

// Format date
const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

// Format price
const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US').format(Math.round(price || 0));
};

// Status classes
const getStatusClass = (status) => {
  const statusMap = {
    paid: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    delivered: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    delivering: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800'
  };
  return statusMap[status] || 'bg-gray-100 text-gray-800';
};

// Confirm receipt function
const confirmReceipt = async (order) => {
  console.log('🔍 Confirm receipt clicked for order:', order._id);

  // Only allow confirmation for orders that are delivering
  if (order.status !== 'delivering') {
    console.log('❌ Order status is not delivering:', order.status);
    return;
  }

  try {
    isLoading.value = true;
    console.log('📤 Sending update request...');

    const updateData = {
      fields: {
        status: 'got_product',
        confirmedAt: new Date(),
        updatedAt: new Date()
      }
    };

    const response = await axios.patch(
      `${API}/updateDoc/Order/${order._id}`,
      updateData,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }
    );


    console.log('📥 Response received:', response.data);

    if (response.data.success) {
      console.log('✅ Update successful, updating local data...');

      // Update the local order data
      const orderIndex = orders.value.findIndex(o => o._id === order._id);
      if (orderIndex !== -1) {
        orders.value[orderIndex] = {
          ...orders.value[orderIndex],
          status: 'completed',
          updatedAt: new Date()
        };
      }

      console.log('🎬 Showing animation modal...');
      // Show animation modal
      showAnimationModal.value = true;
      console.log('🎭 Modal state:', showAnimationModal.value);
    }
  } catch (error) {
    console.error('❌ Error confirming receipt:', error);
  } finally {
    isLoading.value = false;
  }
};

const normalizeStatus = (status) => (status || '').toString().toLowerCase().trim();

const confirmGotProduct = async (order) => {
  console.log('📦 Customer clicked Get Product for order:', order._id);

  // Confirm the action
  const confirm = window.confirm('Are you sure you received your product?');
  if (!confirm) return;

  try {
    isLoading.value = true;
    console.log('📤 Updating order status to received');

    const updateData = {
      fields: {
        status: 'received',
        updatedAt: new Date()
      }
    };

    const response = await axios.patch(
      `${API}/updateDoc/Order/${order._id}`,
      updateData,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }
    );

    if (response.data.success) {
      console.log('✅ Order status updated to received');

      // Update local data
      const orderIndex = orders.value.findIndex(o => o._id === order._id);
      if (orderIndex !== -1) {
        orders.value[orderIndex] = {
          ...orders.value[orderIndex],
          status: 'received',
          updatedAt: new Date()
        };
      }

      // Optionally show success message
      alert('Thank you! Your product has been marked as received.');
    }
  } catch (error) {
    console.error('❌ Error updating to received:', error);
    alert('Something went wrong. Please try again.');
  } finally {
    isLoading.value = false;
  }
};


// Animation event handlers
const onAnimationComplete = () => {
  console.log('✅ Animation completed');
  // Close modal after animation completes
  setTimeout(() => {
    console.log('🔒 Closing modal after animation');
    closeAnimationModal();
  }, 2000);
};

const onAnimationError = (error) => {
  console.error('❌ Animation error:', error);
  closeAnimationModal();
};

const onAnimationReady = (lottie) => {
  console.log('✅ Animation ready:', lottie);
};

// Close animation modal
const closeAnimationModal = () => {
  console.log('🚪 Closing animation modal');
  showAnimationModal.value = false;
};

// Navigate to shop
const navigateToShop = () => {
  router.push('/');
};

// Real-time order update listener
const handleDataUpdate = (payload) => {
  console.log('🔔 Socket event received:', payload);

  if (payload && payload.collection === 'Order') {
    switch (payload.action) {
      case 'update':
        console.log('📦 Order updated, refetching orders...');
        fetchOrders();
        break;
      case 'insert':
        console.log('🆕 New order created, refetching orders...');
        fetchOrders();
        break;
      case 'delete':
        console.log('🗑️ Order deleted, refetching orders...');
        fetchOrders();
        break;
      default:
        console.log('❓ Unknown action:', payload.action);
    }
  }
};

// Socket connection status monitoring
const handleSocketConnect = () => {
  console.log('✅ Socket connected');
};

const handleSocketDisconnect = () => {
  console.log('❌ Socket disconnected');
};

const handleSocketError = (error) => {
  console.error('🚨 Socket error:', error);
};

// Fetch orders on mount
onMounted(() => {
  fetchOrders();

  // Socket event listeners
  socket.on('dataUpdate', handleDataUpdate);
  socket.on('connect', handleSocketConnect);
  socket.on('disconnect', handleSocketDisconnect);
  socket.on('error', handleSocketError);
});

onUnmounted(() => {
  // Clean up all socket listeners
  socket.off('dataUpdate', handleDataUpdate);
  socket.off('connect', handleSocketConnect);
  socket.off('disconnect', handleSocketDisconnect);
  socket.off('error', handleSocketError);
});
</script>

<script>
export default {
  components: {
    // CustomerInvoice component no longer needed for direct PDF download
  }
}
</script>

<style scoped>
/* No custom styles needed - using Tailwind CSS */
</style>
