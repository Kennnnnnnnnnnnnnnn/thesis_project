<template>
  <div class="qr-code-page">
    <h1>Scan the QR Code to Pay</h1>
    <div class="qr-container">
      <img src="https://via.placeholder.com/200x200.png?text=QR+Code" alt="QR Code">
      <p>Scan the code with your payment app.</p>
    </div>

    <div class="payment-confirmation">
      <p>Have you completed the payment?</p>
      <button @click="confirmPayment">I Have Paid</button>
      <button @click="cancelPayment">I Haven't Paid</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QrCodeView',
  methods: {
    confirmPayment() {
      this.$router.push('/payment-success'); // Navigate to success page
    },
    cancelPayment() {
      this.$router.push('/cart'); // Navigate back to cart
    }
  }
};
</script>

<style scoped>
.qr-code-page {
  text-align: center;
  padding: 20px;
}

.qr-container img {
  width: 200px;
  height: 200px;
}

.payment-confirmation {
  margin-top: 20px;
}

.payment-confirmation button {
  margin: 10px;
  padding: 12px 20px;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
}

.payment-confirmation button:first-child {
  background: #6a11cb;
  color: white;
}

.payment-confirmation button:last-child {
  background: #d9534f;
  color: white;
}
</style>