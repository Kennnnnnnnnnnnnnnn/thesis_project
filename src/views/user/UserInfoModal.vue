<template>
    <div v-if="show" class="modal-overlay">
      <div class="modal-content">
        <div class="form-container">
          <!-- Step 1: Basic Info -->
          <div v-if="step === 1">
            <h2>Confirm Your Information</h2>
            <form @submit.prevent="handleStepOneConfirm">
              <!-- Email, Phone, Address, City -->
              <div class="form-group">
                <label>Email:</label>
                <input type="email" v-model="localUser.email" required>
              </div>
  
              <div class="form-group">
                <label>Phone Number:</label>
                <input type="tel" v-model="localUser.phone" required>
              </div>
  
              <div class="form-group">
                <label>Address:</label>
                <input type="text" v-model="localUser.address" required>
                <div class="address-inputs">
                  <input type="text" v-model="localUser.city" placeholder="City" required>
                </div>
              </div>
  
              <!-- Payment Buttons -->
              <div class="form-group">
                <label>Payment Method:</label>
                <div class="payment-options">
                  <button type="button"
                          :class="{ selected: localUser.paymentMethod === 'Cash' }"
                          @click="setPaymentMethod('Cash')">Cash</button>
                  <button type="button"
                          :class="{ selected: localUser.paymentMethod === 'QR Code' }"
                          @click="setPaymentMethod('QR Code')">QR Code</button>
                </div>
              </div>
  
              <!-- Step 1 Actions -->
              <div class="modal-actions">
                <button type="button" class="cancel-btn" @click="closeModal">Cancel</button>
                <button type="submit" class="confirm-btn">Confirm</button>
              </div>
            </form>
          </div>
  
          <!-- Step 2: QR Payment Confirmation -->
          <div v-else-if="step === 2">
            <h2>QR Code Payment</h2>
            <div class="qr-container">
              <p>Scan the QR code to pay</p>
              <img src="https://via.placeholder.com/200x200.png?text=QR+Code" alt="QR Code">
              <p>Select your status:</p>
              <div class="qr-options">
                <button :class="{ selected: paidStatus === 'paid' }" @click="paidStatus = 'paid'">I have paid</button>
                <button :class="{ selected: paidStatus === 'unpaid' }" @click="paidStatus = 'unpaid'">I haven't paid yet</button>
              </div>
            </div>
            <div class="modal-actions">
              <button type="button" class="cancel-btn" @click="step = 1">Back</button>
              <button type="button" class="confirm-btn" :disabled="!paidStatus" @click="handleQRPaymentConfirm">Confirm</button>
            </div>
          </div>
  
          <!-- Step 3: Success -->
          <div v-else-if="step === 3" class="success-container">
            <h2>✅ Successful!</h2>
            <p>Thank you. Your info has been submitted.</p>
            <div class="modal-actions">
              <button class="confirm-btn" @click="emitSuccess">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'UserInfoModal',
    props: {
      show: Boolean,
      user: {
        type: Object,
        required: true,
        default: () => ({
          email: '',
          phone: '',
          address: '',
          city: '',
          paymentMethod: ''
        })
      }
    },
    data() {
      return {
        step: 1,
        paidStatus: '',
        localUser: JSON.parse(JSON.stringify(this.user)) || {
          email: '',
          phone: '',
          address: '',
          city: '',
          paymentMethod: ''
        }
      };
    },
    watch: {
      user: {
        handler(newVal) {
          this.localUser = JSON.parse(JSON.stringify(newVal));
        },
        deep: true,
        immediate: true
      }
    },
    methods: {
      setPaymentMethod(method) {
        this.localUser.paymentMethod = method;
      },
      handleStepOneConfirm() {
        if (!this.localUser.email || !this.localUser.phone || !this.localUser.address || !this.localUser.city || !this.localUser.paymentMethod) {
          alert('Please fill in all required fields');
          return;
        }
  
        if (this.localUser.paymentMethod === 'QR Code') {
          this.step = 2;
        } else if (this.localUser.paymentMethod === 'Cash') {
          this.step = 3;
        }
      },
      handleQRPaymentConfirm() {
        if (this.paidStatus === 'paid') {
          this.step = 3;
        } else {
          alert('Please complete your payment first');
        }
      },
      closeModal() {
        this.resetForm();
        this.$emit('close');
      },
      emitSuccess() {
  this.$emit('success', {
    ...this.localUser,
    date: new Date().toISOString()
  });

  // Retrieve current cart items before clearing
  const clearedCart = JSON.parse(localStorage.getItem('cart')) || [];
  const orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];

  // Add cleared items as a new entry in order history
  orderHistory.push({
    date: new Date().toISOString(),
    items: clearedCart
  });

  // Store updated order history in localStorage
  localStorage.setItem('orderHistory', JSON.stringify(orderHistory));

  // Clear the cart
  localStorage.removeItem('cart');
  localStorage.setItem('cartCount', 0);
  window.dispatchEvent(new Event("storage"));

  this.resetForm();
  this.$emit('close');
},
      resetForm() {
        this.step = 1;
        this.paidStatus = '';
        this.localUser = JSON.parse(JSON.stringify(this.user)) || {
          email: '',
          phone: '',
          address: '',
          city: '',
          paymentMethod: ''
        };
      }
    }
  };
  </script>
  <style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #fffae6;
  padding: 2rem;
  border-radius: 0.75rem;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid #ffe680;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.form-container {
  display: flex;
  flex-direction: column;
}

h2 {
  margin-top: 0;
  text-align: center;
  color: #8a6d0b;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #b38b00;
}

.form-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #ffe680;
  border-radius: 0.5rem;
  box-sizing: border-box;
  /* background-color: #fffae6; */
  color: #5d4a00;
}

.form-group input:focus {
  outline: none;
  border-color: #ffd700;
  box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.2);
}

.address-inputs {
  margin-top: 0.5rem;
}

.payment-options {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
}

.payment-options button,
.qr-options button {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ffe680;
  background-color: #fff3cd;
  border-radius: 0.5rem;
  cursor: pointer;
  color: #856404;
  font-weight: 500;
  transition: all 0.2s;
}

.payment-options button.selected,
.qr-options button.selected {
  background-color: #ffd700;
  color: #5d4a00;
  border-color: #ffd700;
}

.qr-container {
  text-align: center;
  margin: 1.5rem 0;
  padding: 1.5rem;
  background-color: #fff3cd;
  border-radius: 0.5rem;
  border: 1px solid #ffe680;
}

.qr-container img {
  margin: 1rem 0;
  max-width: 200px;
}

.qr-options {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
  gap: 0.75rem;
}

.modal-actions button {
  flex: 1;
  padding: 0.75rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.cancel-btn {
  background-color: #fff3cd;
  color: #856404;
  border: 1px solid #ffe680;
}

.cancel-btn:hover {
  background-color: #ffe680;
}

.confirm-btn {
  background-color: #ffd700;
  color: #5d4a00;
  border: none;
}

.confirm-btn:hover {
  background-color: #e6c200;
}

.confirm-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
  color: #666;
}

.success-container {
  text-align: center;
  padding: 1.5rem;
}

.success-container h2 {
  color: #28a745;
}

@media (max-width: 768px) {
  .modal-content {
    padding: 1.5rem;
  }
  
  .payment-options,
  .qr-options,
  .modal-actions {
    flex-direction: column;
  }
  
  .payment-options button,
  .qr-options button,
  .modal-actions button {
    width: 100%;
  }
}
</style>