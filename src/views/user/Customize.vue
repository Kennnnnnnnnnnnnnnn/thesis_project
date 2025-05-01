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
  /* Modal Styles */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal-content {
    background: white;
    width: 80%;
    max-width: 700px;
    border-radius: 10px;
    display: flex;
    overflow: hidden;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
  
  .image-container {
    flex: 1;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f9f9f9;
  }
  
  .image-container img {
    max-width: 100%;
    max-height: 300px;
    object-fit: contain;
  }
  
  .details-container {
    flex: 1;
    padding: 25px;
    display: flex;
    flex-direction: column;
  }
  
  h2 {
    margin-top: 0;
    margin-bottom: 20px;
    color: #333;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #555;
  }
  
  .weight-control,
  .quantity-control {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .weight-control input,
  .quantity-control input {
    width: 80px;
    padding: 8px;
    text-align: center;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .weight-control button,
  .quantity-control button {
    width: 35px;
    height: 35px;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f0f0f0;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .weight-control button:hover,
  .quantity-control button:hover {
    background: #e0e0e0;
  }
  
  .weight-control button:disabled,
  .quantity-control button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .price-display {
    background: #f8f9fa;
    padding: 15px;
    border-radius: 5px;
    margin: 15px 0;
  }
  
  .total-price {
    font-size: 1.1em;
    color: #28a745;
    margin-top: 5px;
  }
  
  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: auto;
    padding-top: 20px;
  }
  
  .cancel-btn {
    background: #f8f9fa;
    color: #dc3545;
    border: 1px solid #dc3545;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .cancel-btn:hover {
    background: #dc3545;
    color: white;
  }
  
  .confirm-btn {
    background: #28a745;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .confirm-btn:hover {
    background: #218838;
  }
  
  @media (max-width: 768px) {
    .modal-content {
      flex-direction: column;
      width: 90%;
    }
    
    .image-container {
      padding: 15px;
    }
    
    .details-container {
      padding: 20px;
    }
  }
  </style>