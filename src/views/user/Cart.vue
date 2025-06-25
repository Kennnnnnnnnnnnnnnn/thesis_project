<template>
  <v-container>
    <h2 class="text-h5 font-weight-bold mb-4">🛒 Your Cart</h2>

    <v-alert v-if="cartItems.length === 0" type="info" border="start" color="blue">
      No items in cart yet.
    </v-alert>

    <v-row v-else>
      <v-col
        v-for="item in cartItems"
        :key="item._id"
        cols="12"
        md="6"
        lg="4"
      >
        <v-card>
          <v-img
            :src="item.productId?.image || defaultImage"
            height="200px"
            cover
          ></v-img>

          <v-card-title class="text-wrap">
            {{ item.productId?.name || 'No name' }}
          </v-card-title>

          <v-card-subtitle>
            Quantity: {{ item.quantity }}
          </v-card-subtitle>

          <v-card-subtitle>
            Price: {{ item.productId?.salePrice || 0 }} ៛
          </v-card-subtitle>

          <v-card-subtitle>
            Discount: {{ item.productId?.discount || 0 }}%
          </v-card-subtitle>

          <v-card-actions>
            <v-btn color="red" @click="removeItem(item._id)" block>
              Remove
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-divider class="my-4"></v-divider>

    <div v-if="cartItems.length > 0" class="text-end">
      <div class="mb-2">
        <strong>Subtotal:</strong> {{ subtotal }} ៛
      </div>
      <div class="mb-2">
        <strong>Discount:</strong> <span class="text-red">-{{ discountTotal }} ៛</span>
      </div>
      <div class="mb-2">
        <strong>To Pay:</strong> <span class="text-green text-h6">{{ finalAmount }} ៛</span>
      </div>

      <v-btn :to="`/payment?price=${finalAmount}`" color="primary">
        Pay Now
      </v-btn>
    </div>
  </v-container>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue';
import Swal from 'sweetalert2';
import apiURL from '@/api/config.js';

const token = localStorage.getItem('token');
const cartItems = ref([]);
const defaultImage = require('@/assets/image.png');

// Fetch cart items
const fetchCart = async () => {
  try {
    const res = await apiURL.get('/getAllDocs/Cart', {
      headers: { Authorization: `Bearer ${token}` },
    });
    cartItems.value = res.data.data;
  } catch (err) {
    console.error('❌ Failed to fetch cart:', err);
  }
};

// Remove item from cart
const removeItem = async (id) => {
  try {
    await apiURL.delete(`/deleteDoc/Cart/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    Swal.fire({
      icon: 'success',
      title: 'Removed from cart',
      timer: 1000,
      showConfirmButton: false,
    });
    fetchCart();
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Failed to remove item',
      timer: 1500,
      showConfirmButton: false,
    });
  }
};

// Cart calculations
const subtotal = computed(() =>
  cartItems.value.reduce((sum, item) => {
    const price = item.productId?.salePrice || 0;
    return sum + price * item.quantity;
  }, 0)
);

const discountTotal = computed(() =>
  cartItems.value.reduce((sum, item) => {
    const price = item.productId?.salePrice || 0;
    const discount = item.productId?.discount || 0;
    return sum + (price * item.quantity * discount) / 100;
  }, 0)
);

const finalAmount = computed(() =>
  Math.round(subtotal.value - discountTotal.value)
);

onMounted(() => {
  fetchCart();
});
</script>


<style scoped>
.text-red {
  color: red;
}
.text-green {
  color: green;
}
</style>
