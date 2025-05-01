<template>
  <div class="favorite-page">
    <section class="header">
      <div class="container">
        <h1>My Favorite Items</h1>
        <p>Here are the products you’ve saved.</p>
      </div>
    </section>

    <section class="product-grid">
      <div class="container">
        <div v-if="favorites.length > 0" class="grid">
          <div class="product-card" v-for="product in favorites" :key="product.id">
            <div class="product-image">
              <img :src="product.imageUrl || require('@/assets/image.png')" alt="Product Image">
            </div>
            <div class="product-info">
              <h3 class="product-name">{{ product.name }}</h3>
              <p class="product-price">${{ product.price.toFixed(2) }}</p>
              <div class="button-row">
                <button class="remove-btn" @click="removeFavorite(product)">Remove</button>
                <button class="buy-btn" @click="addToCart(product)">Buy Now</button>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="empty-message">
          <p>You haven't favorited any products yet. Browse and add some!</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'FavoriteView',
  data() {
    return {
      favorites: JSON.parse(localStorage.getItem('favorites')) || []
    };
  },
  watch: {
    favorites: {
      handler(newFavorites) {
        localStorage.setItem('favorites', JSON.stringify(newFavorites));
      },
      deep: true
    }
  },
  methods: {
    removeFavorite(product) {
      this.favorites = this.favorites.filter(item => item.id !== product.id);
    },
    addToCart(product) {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      let existingItem = cart.find(item => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("storage"));
    }
  }
};
</script>

<style scoped>
/* Header */
.header {
  background: linear-gradient(135deg, #ff6b6b 0%, #2c3e50 100%);
  color: white;
  padding: 50px 0;
  text-align: center;
}

/* Product Grid */
.product-grid {
  padding: 40px 0;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

/* Empty State */
.empty-message {
  text-align: center;
  font-size: 1.1rem;
  color: #666;
  margin-top: 30px;
}

/* Product Card */
.product-card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

/* Product Image */
.product-image img {
  width: 100%;
  height: auto;
  border-radius: 5px;
}

/* Product Info */
.product-info {
  padding: 20px;
}

.product-name {
  font-size: 1.1rem;
  font-weight: bold;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  display: block;
  height: 30px;
  position: relative;
}

.product-price {
  font-size: 1rem;
  color: #2c3e50;
  font-weight: bold;
}

/* Button Row */
.button-row {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}

.remove-btn {
  background-color: #ff6b6b;
  color: white;
  border: none;
  padding: 8px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.remove-btn:hover {
  background-color: darkred;
}

.buy-btn {
  background-color: #42b883;
  color: white;
  border: none;
  padding: 8px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.buy-btn:hover {
  background-color: #369a6e;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }

  .product-name {
    font-size: 1rem;
  }

  .product-price {
    font-size: 0.9rem;
  }

  .buy-btn, .remove-btn {
    padding: 7px;
    font-size: 0.8rem;
  }
}
</style>