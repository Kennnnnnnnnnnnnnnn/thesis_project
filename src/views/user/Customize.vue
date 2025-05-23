<template>
    <div v-if="show" class="modal-overlay">
      <div class="modal-content">
        <!-- Left Side: Product Image -->
        <div class="image-container">
          <img :src="require('@/assets/image.png')" alt="Product Image">
        </div>
  
        <!-- Right Side: Customization Options -->
        <div class="details-container">
          <h2>{{ product.name }}</h2>
          
          <!-- Weight Control -->
          <div class="form-group">
            <label>Weight (kg):</label>
            <div class="weight-control">
              <button @click="adjustWeight(-0.5)" :disabled="currentWeight <= 0.5">-</button>
              <input type="number" v-model.number="currentWeight" min="0.5" step="0.5">
              <button @click="adjustWeight(0.5)">+</button>
            </div>
          </div>
  
          <!-- Price Display -->
          <div class="price-display">
            <p><strong>Unit Price:</strong> ${{ basePrice.toFixed(2) }} per kg</p>
            <p class="total-price"><strong>Total Price:</strong> ${{ calculatedPrice.toFixed(2) }}</p>
          </div>
  
          <!-- Quantity Control -->
          <div class="form-group">
            <label>Quantity:</label>
            <div class="quantity-control">
              <button @click="adjustQuantity(-1)" :disabled="quantity <= 1">-</button>
              <input type="number" v-model.number="quantity" min="1">
              <button @click="adjustQuantity(1)">+</button>
            </div>
          </div>
  
          <!-- Action Buttons -->
          <div class="modal-actions">
            <button class="cancel-btn" @click="close">Cancel</button>
            <button class="confirm-btn" @click="confirmCustomization">Confirm</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'CustomizeView',
    props: {
      product: Object,
      show: Boolean
    },
    data() {
      return {
        quantity: this.product.quantity || 1,
        currentWeight: this.product.weight || 1,
        basePrice: this.product.basePrice || this.product.price / (this.product.weight || 1)
      };
    },
    computed: {
      calculatedPrice() {
        return this.basePrice * this.currentWeight;
      }
    },
    methods: {
      adjustWeight(change) {
        const newWeight = this.currentWeight + change;
        if (newWeight >= 0.5) {
          this.currentWeight = parseFloat(newWeight.toFixed(1));
        }
      },
      adjustQuantity(change) {
        const newQuantity = this.quantity + change;
        if (newQuantity >= 1) {
          this.quantity = newQuantity;
        }
      },
      confirmCustomization() {
        const customizedProduct = {
          ...this.product,
          weight: this.currentWeight,
          price: this.calculatedPrice,
          quantity: this.quantity,
          basePrice: this.basePrice
        };
        this.$emit('confirm', { 
          product: customizedProduct 
        });
      },
      close() {
        this.$emit('close');
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
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #fffae6;
  padding: 2rem;
  border-radius: 0.75rem;
  max-width: 700px;
  width: 90%;
  border: 1px solid #ffe680;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  display: flex;
  gap: 2rem;
}

.image-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff3cd;
  border-radius: 0.5rem;
  padding: 1rem;
  border: 1px solid #ffe680;
}

.image-container img {
  max-width: 100%;
  max-height: 250px;
  object-fit: contain;
}

.details-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

h3 {
  color: #8a6d0b;
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #b38b00;
  display: block;
}

.weight-control,
.quantity-control {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.weight-control input,
.quantity-control input {
  width: 80px;
  padding: 0.75rem 1rem;
  border: 1px solid #ffe680;
  border-radius: 0.5rem;
  font-size: 1rem;
  background-color: #fffae6;
  color: #5d4a00;
  text-align: center;
}

.weight-control input:focus,
.quantity-control input:focus {
  outline: none;
  border-color: #ffd700;
  box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.2);
}

.price-display {
  background: #fff3cd;
  padding: 1rem;
  border-radius: 0.5rem;
  margin: 1rem 0;
  border: 1px solid #ffe680;
}

.price-display p {
  color: #5d4a00;
  margin: 0.5rem 0;
}

.total-price {
  font-size: 1.1rem;
  color: #28a745;
  font-weight: 600;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: auto;
  padding-top: 1rem;
}

.weight-control button,
.quantity-control button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffe680;
}

.weight-control button:hover,
.quantity-control button:hover {
  background: #ffe680;
}

.weight-control button:disabled,
.quantity-control button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cancel-btn {
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffe680;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.cancel-btn:hover {
  background: #ffe680;
}

.confirm-btn {
  background: #ffd700;
  color: #5d4a00;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
}

.confirm-btn:hover {
  background: #e6c200;
}

@media (max-width: 768px) {
  .modal-content {
    flex-direction: column;
  }
  
  .image-container {
    margin-bottom: 1.5rem;
  }
  
  .modal-actions {
    justify-content: center;
  }
}
</style>