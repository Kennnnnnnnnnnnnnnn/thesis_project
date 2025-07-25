<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
      <!-- Invoice Header -->
      <div class="p-8 text-center border-b border-gray-200">
        <div class="flex justify-center mb-4">
          <div class="h-16 w-16 bg-yellow-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            SN
          </div>
        </div>
        <h1 class="text-2xl font-bold text-gray-800">Your Store Name</h1>
        <p class="text-gray-600 mt-2">123 Business Street, Phnom Penh, Cambodia</p>
      </div>

      <!-- Invoice Title -->
      <div class="p-6 bg-gray-50">
        <h2 class="text-xl font-semibold text-gray-800">INVOICE</h2>
        <div class="flex justify-between mt-2">
          <p class="text-gray-600">#INV-2023-001</p>
          <p class="text-gray-600">November 15, 2023</p>
        </div>
      </div>

      <!-- Payment Confirmation -->
      <div class="p-6 border-b border-gray-200">
        <div class="bg-green-50 border-l-4 border-green-500 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-green-700">
                We've received your payment of $125.00. Thank you for your purchase!
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Invoice Details -->
      <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 class="text-lg font-medium text-gray-800 mb-2">Bill To</h3>
          <p class="text-gray-600">John Doe</p>
          <p class="text-gray-600">john.doe@example.com</p>
          <p class="text-gray-600">+855 12 345 678</p>
        </div>
        
        <div>
          <h3 class="text-lg font-medium text-gray-800 mb-2">Payment Details</h3>
          <div class="space-y-1">
            <p class="text-gray-600"><span class="font-medium">Account:</span> ABA Bank</p>
            <p class="text-gray-600"><span class="font-medium">Transaction ID:</span> TXN-987654321</p>
            <p class="text-gray-600"><span class="font-medium">Payment Method:</span> KHQR</p>
            <p class="text-gray-600"><span class="font-medium">Date Paid:</span> November 15, 2023</p>
          </div>
        </div>
      </div>

      <!-- Order Items -->
      <div class="p-6 border-t border-gray-200">
        <h3 class="text-lg font-medium text-gray-800 mb-4">Order Details</h3>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <img class="h-10 w-10 rounded" src="https://via.placeholder.com/40" alt="Product image">
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">Premium T-Shirt</div>
                      <div class="text-sm text-gray-500">Color: Black, Size: L</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$25.00</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$50.00</td>
              </tr>
              <tr>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <img class="h-10 w-10 rounded" src="https://via.placeholder.com/40" alt="Product image">
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">Wireless Headphones</div>
                      <div class="text-sm text-gray-500">Color: White</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$75.00</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$75.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Totals -->
      <div class="p-6 border-t border-gray-200">
        <div class="flex justify-end">
          <div class="w-full max-w-xs">
            <div class="flex justify-between py-2">
              <span class="text-gray-600">Subtotal:</span>
              <span class="font-medium">$125.00</span>
            </div>
            <div class="flex justify-between py-2">
              <span class="text-gray-600">Shipping:</span>
              <span class="font-medium">$0.00</span>
            </div>
            <div class="flex justify-between py-2">
              <span class="text-gray-600">Tax:</span>
              <span class="font-medium">$0.00</span>
            </div>
            <div class="flex justify-between py-2 border-t border-gray-200 mt-2 pt-2">
              <span class="text-lg font-bold text-gray-800">Total:</span>
              <span class="text-lg font-bold">$125.00</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-6 bg-gray-50 text-center">
        <p class="text-gray-600">Thank you for your business!</p>
        <p class="text-gray-500 text-sm mt-2">If you have any questions about this invoice, please contact</p>
        <p class="text-gray-500 text-sm">support@yourstore.com or +855 23 456 789</p>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="max-w-4xl mx-auto mt-6 flex justify-center space-x-4">
      <button @click="printInvoice" class="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
        Print Invoice
      </button>
      <button @click="downloadInvoice" class="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">
        Download PDF
      </button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    printInvoice() {
      window.print();
    },
    downloadInvoice() {
      // In a real app, this would generate a PDF
      alert('PDF download would be triggered here');
    }
  }
}
</script>

<style>
@media print {
  body * {
    visibility: hidden;
  }
  .max-w-4xl, .max-w-4xl * {
    visibility: visible;
  }
  .max-w-4xl {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    max-width: 100%;
    box-shadow: none;
  }
  .mt-6 {
    display: none;
  }
}
</style>