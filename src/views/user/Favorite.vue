<template>
  <div class="product-page">
    <section class="header">
      <div class="container">
        <h1>My Favorite Items</h1>
        <p>Here are the products you’ve saved.</p>
        <input type="text" v-model="searchQuery" placeholder="Search favorites..." class="search-box">
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
              <h3 class="product-name">{{ product.name }}</h3>
              <p class="product-price">${{ product.price.toFixed(2) }}</p>
              <div class="button-row">
                <button class="favorite-btn is-favorite" @click="removeFavorite(product)">
                  <span class="heart-icon"></span>
                </button>
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
/* Match the Product.vue design */
.product-page {
  text-align: center;
  background-color: #fff;
  padding: 30px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.header {

  color: #333;
  padding: 50px 0;
  text-align: center;
  margin-bottom: 40px;
}

.search-box {
  width: 100%;
  max-width: 600px;
  padding: 12px 25px;
  margin-top: 15px;
  border: 2px solid #FFD700;
  border-radius: 30px;
  font-size: 1.1rem;
  outline: none;
  transition: all 0.3s;
  background-color: white;
}

.search-box:focus {
  border-color: #FFA500;
  box-shadow: 0 0 0 4px rgba(255, 215, 0, 0.4);
}

/* Product Grid */
.product-grid {
  padding: 40px 0;
}

.grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 25px;
}

/* Product Card */
.product-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(255, 215, 0, 0.15);
  transition: all 0.3s ease;
  border: 1px solid #FFEC8B;
}

.product-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(255, 215, 0, 0.25);
}

/* Product Image */
.product-image {
  background-color: #FFF9C4;
  padding: 20px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-image img {
  max-width: 100%;
  max-height: 160px;
  border-radius: 10px;
  transition: transform 0.5s ease;
  object-fit: contain;
}

.product-card:hover .product-image img {
  transform: scale(1.1);
}

/* Product Info */
.product-info {
  padding: 25px;
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
  color: #333;
  margin-bottom: 15px;
}

.product-price {
  font-size: 1.4rem;
  color: #FF8C00;
  margin: 20px 0;
  text-align: center;
  font-weight: bold;
}

/* Buttons */
.button-row {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  align-items: center;
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
  font-size: 28px;
  color: #FFD700;
  transition: all 0.3s ease;
}

.favorite-btn:hover .heart-icon::before {
  transform: scale(1.2);
}

.favorite-btn.is-favorite .heart-icon::before {
  color: #b90909;
  text-shadow: 0 0 12px rgba(255, 0, 4, 0.6);
}

.buy-btn {
  background-color: #FFD700;
  color: #333;
  border: none;
  padding: 12px 25px;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
  font-size: 1rem;
  box-shadow: 0 4px 10px rgba(255, 215, 0, 0.3);
}

.buy-btn:hover {
  background-color: #FFA500;
  color: white;
  transform: translateY(-3px);
  box-shadow: 0 8px 15px rgba(255, 165, 0, 0.4);
}

/* Responsive Adjustments */
@media (max-width: 1200px) {
  .grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 992px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
    .search-box {
    margin: 15px auto; /* This will center the search box */
    width: 90%; /* Give it some breathing room on mobile */
  }
  .grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  .product-name {
    font-size: 1rem;
  }

  .buy-btn {
    padding: 10px 20px;
    font-size: 0.9rem;
  }

  .heart-icon::before {
    font-size: 24px;
  }
}

@media (max-width: 480px) {
  .grid {
    grid-template-columns: 1fr;
  }
  
  .product-card {
    border-radius: 12px;
  }
  
  .product-info {
    padding: 15px;
  }
    .search-box {
    width: 95%; /* Even more breathing room on very small screens */
    padding: 10px 20px; /* Slightly smaller padding */
  }
}
</style>