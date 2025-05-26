<template>
  <div class="product-page">
    <section class="header">
      <div class="container">
        <h1>My Favorite Items</h1>
        <p>Here are the products you've saved.</p>
        <div class="search-container">
          <input type="text" v-model="searchQuery" placeholder="Search favorites..." class="search-box">
        </div>
      </div>
    </section>

    <section class="product-grid">
      <div class="container">
        <div v-if="filteredFavorites.length > 0" class="grid">
          <div class="product-card" v-for="product in filteredFavorites" :key="product.id">
            <div class="product-image">
              <img :src="product.imageUrl || require('@/assets/image.png')" alt="Product Image">
            </div>
            <div class="product-info">
              <div class="rating">
                ★★★★★
              </div>
              <h3 class="product-name">{{ product.name }}</h3>
              <p class="product-description">Premium quality product</p>
              <p class="product-price">${{ product.price.toFixed(2) }}</p>
              <div class="button-row">
                <button class="favorite-btn is-favorite" @click="removeFavorite(product)">
                  <span class="heart-icon"></span>
                </button>
                <button class="buy-btn" @click="addToCart(product)">Add to Cart</button>
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
  name: "FavoriteProducts",
  data() {
    return {
      searchQuery: "",
      favorites: JSON.parse(localStorage.getItem("favorites")) || []
    };
  },
  computed: {
    filteredFavorites() {
      return this.favorites.filter(product =>
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },
  methods: {
    removeFavorite(product) {
      this.favorites = this.favorites.filter(item => item.id !== product.id);
      localStorage.setItem("favorites", JSON.stringify(this.favorites));
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
/* Match the Product.vue design exactly */
.product-page {
  text-align: center;
  background-color: #fff;
  padding: 20px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.header {
  padding: 30px 0 20px;
  text-align: center;
  margin-bottom: 20px;
}

h1 {
  color: #333;
  margin-bottom: 10px;
}

.header p {
  color: #666;
  margin-bottom: 20px;
}

.search-container {
  max-width: 600px;
  margin: 0 auto;
}

.search-box {
  width: 100%;
  padding: 12px 20px;
  border: 1px solid #FFD700;
  border-radius: 25px;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s;
  background-color: white;
  box-sizing: border-box;
}

.search-box:focus {
  border-color: #FFA500;
}

/* Product Grid */
.product-grid {
  padding: 20px 0;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

.empty-message {
  padding: 40px 0;
  color: #666;
  font-size: 1.1rem;
}
/* New Product Card Design */
.product-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

/* Product Image */
.product-image {
  background-color: #f9f9f9;
  padding: 15px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-image img {
  max-width: 100%;
  max-height: 170px;
  object-fit: contain;
}

/* Product Info */
.product-info {
  padding: 15px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.rating {
  color: #FFD700;
  font-size: 1rem;
  margin-bottom: 8px;
}

.product-name {
  font-size: 1rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 8px;
  color: #333;
}

.product-description {
  font-size: 0.8rem;
  color: #666;
  text-align: center;
  margin-bottom: 12px;
  flex-grow: 1;
}

.product-price {
  font-size: 1.2rem;
  color: #333;
  margin: 15px 0;
  text-align: center;
  font-weight: bold;
}

/* Buttons */
.button-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.favorite-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  transition: all 0.3s;
}

.heart-icon::before {
  content: "❤";
  font-size: 20px;
  color: #ccc;
  transition: all 0.3s ease;
}

.favorite-btn:hover .heart-icon::before {
  color: #FFD700;
}

.favorite-btn.is-favorite .heart-icon::before {
  color: #b90909;
}

.buy-btn {
  background-color: #FFD700;
  color: #333;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
  font-size: 0.9rem;
  flex-grow: 1;
  margin-left: 10px;
}

.buy-btn:hover {
  background-color: #FFA500;
  color: white;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .header {
    padding: 20px 0 10px;
  }
  
  .search-container {
    padding: 0 15px;
  }
  
  .grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 15px;
  }
  
  .product-image {
    height: 150px;
    padding: 10px;
  }
  
  .product-name {
    font-size: 0.9rem;
  }
  
  .product-price {
    font-size: 1.1rem;
    margin: 10px 0;
  }
  
  .buy-btn {
    padding: 8px 15px;
    font-size: 0.8rem;
  }
  
  .heart-icon::before {
    font-size: 18px;
  }
}

@media (max-width: 480px) {
  .search-box {
    padding: 10px 15px;
    font-size: 0.9rem;
  }
  
  .grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
  
  .empty-message {
    font-size: 1rem;
    padding: 30px 0;
  }
}
</style>