<template>
  <div class="product-page">
    <section class="header">
      <div class="container">
        <h1>Our Products</h1>
        <p>Explore our latest arrivals and best-selling items</p>
        <input type="text" v-model="searchQuery" placeholder="Search products..." class="search-box">
      </div>
    </section>

    <section class="product-grid">
      <div class="container">
        <div class="grid">
          <div class="product-card" v-for="product in filteredProducts" :key="product.id">
            <div class="product-image">
              <img :src="require('@/assets/image.png')" alt="Product Image">
            </div>
            <div class="product-info">
              <h3 class="product-name">{{ product.name }}</h3>
              <p class="product-price">${{ product.price.toFixed(2) }}</p>
              <div class="button-row">
                <button class="favorite-btn" @click="toggleFavorite(product)" 
                  :class="{ 'is-favorite': product.isFavorite }">
                  <span class="heart-icon"></span>
                </button>
                <button class="buy-btn" @click="addToCart(product)">Buy Now</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
export default {
  name: 'ProductView',
  data() {
    return {
      searchQuery: '',
      products: this.getProductsFromStorage(),
    };
  },
  computed: {
    filteredProducts() {
      return this.products.filter(product =>
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },
  methods: {
    getProductsFromStorage() {
      let storedProducts = JSON.parse(localStorage.getItem("products")) || [
        { id: 1, name: 'Smartphone', price: 699.99 },
        { id: 2, name: 'Laptop', price: 1299.99 },
        { id: 3, name: 'Wireless Headphones', price: 199.99 },
        { id: 4, name: 'Gaming Console', price: 499.99 }
      ];

      let storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];

      // Apply favorite state from storage
      storedProducts.forEach(product => {
        product.isFavorite = storedFavorites.some(fav => fav.id === product.id);
      });

      localStorage.setItem("products", JSON.stringify(storedProducts)); // Store updated products
      return storedProducts;
    },
    addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Increase quantity if item exists, otherwise add it
  let existingItem = cart.find(item => item.id === product.id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  localStorage.setItem("cartCount", cart.length); // Update count immediately

  window.dispatchEvent(new Event("storage")); // Notify other components
},
    toggleFavorite(product) {
      let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
      const isFavorited = favorites.some(item => item.id === product.id);

      if (isFavorited) {
        favorites = favorites.filter(item => item.id !== product.id);
        product.isFavorite = false;
      } else {
        favorites.push(product);
        product.isFavorite = true;
      }

      localStorage.setItem("favorites", JSON.stringify(favorites));
    }
  }
};
</script>
  <style scoped>
  /* General */
  .product-page {
    text-align: center;
    padding: 30px 0;
  }
  
  .header {
    background: linear-gradient(135deg, #42b883 0%, #2c3e50 100%);
    color: white;
    padding: 50px 0;
    text-align: center;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }
  
  .search-box {
    width: 100%;
    max-width: 400px;
    padding: 10px;
    margin-top: 15px;
    border: 1px solid #ccc;
    border-radius: 5px;
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
  
  /* Product Card */
  .product-card {
    background: white;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
    transition: transform 0.3s ease;
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
  
  /* Fix Button Misalignment */
  .product-name {
  font-size: 1.1rem;
  font-weight: bold;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  display: block;
  height: 30px; /* Fixed height for uniform alignment */
  position: relative; /* Ensures stable positioning */
}

/* Tooltip container */
.product-name:hover::after {
  content: attr(title); /* Shows full name */
  position: absolute;
  top: 110%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  white-space: nowrap;
  font-size: 0.9rem;
  z-index: 100;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}

/* Tooltip visibility */
.product-name:hover::after {
  opacity: 1;
}
  /* Buttons Stay Aligned */
  .button-row {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
  }
  
  /* Favorite Button */
  .favorite-btn {
    background: none;
    border: none;
    cursor: pointer;
  }
  
  .heart-icon::before {
    content: "❤";
    font-size: 20px;
    color: gray;
    transition: color 0.3s ease;
  }
  
  .favorite-btn.is-favorite .heart-icon::before {
    color: red;
  }
  
  /* Buy Button */
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
  
    .buy-btn {
      padding: 7px;
      font-size: 0.8rem;
    }
  
    .heart-icon::before {
      font-size: 18px;
    }
  }
  </style>