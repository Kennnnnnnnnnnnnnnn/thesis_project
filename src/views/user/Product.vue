<template>
  <div class="product-page">
    <!-- Header and search sections remain the same -->
    <section class="header">
      <div class="container">
        <h1>Our Products</h1>
        <div class="search-container">
          <input type="text" v-model="searchQuery" placeholder="Search products..." class="search-box">
        </div>
        <div class="category-tabs">
          <button 
            v-for="category in categories" 
            :key="category.value"
            @click="activeCategory = category.value"
            :class="{ 'active': activeCategory === category.value }"
          >
            {{ category.label }}
          </button>
        </div>
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
              <div class="rating">
                ★★★★★
              </div>
              <h3 class="product-name">{{ product.name }}</h3>
              <p class="product-description">High-quality product with premium features</p>
              <p class="product-price">${{ product.price.toFixed(2) }}</p>
              <div class="button-row">
                <button class="favorite-btn" @click="toggleFavorite(product)" 
                  :class="{ 'is-favorite': product.isFavorite }">
                  <span class="heart-icon"></span>
                </button>
                <button class="buy-btn" @click="addToCart(product)">Add to Cart</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
// Script section remains the same
export default {
  name: 'ProductView',
  data() {
    return {
      searchQuery: '',
      activeCategory: 'all',
      categories: [
        { label: 'All', value: 'all' },
        { label: 'Best Selling', value: 'best' },
        { label: 'New Arrivals', value: 'new' }
      ],
      products: this.getProductsFromStorage(),
    };
  },
  computed: {
    filteredProducts() {
      let filtered = this.products.filter(product =>
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );

      if (this.activeCategory === 'best') {
        filtered = filtered.filter(product => product.isBestSeller);
      } else if (this.activeCategory === 'new') {
        filtered = filtered.filter(product => product.isNew);
      }

      return filtered;
    }
  },
  methods: {
    getProductsFromStorage() {
      let storedProducts = JSON.parse(localStorage.getItem("products")) || [
        { id: 1, name: 'Premium Smartphone', price: 799.99, isBestSeller: true, isNew: false },
        { id: 2, name: 'Ultra HD Laptop', price: 1499.99, isBestSeller: true, isNew: true },
        { id: 3, name: 'Noise Cancelling Headphones', price: 249.99, isBestSeller: false, isNew: true },
        { id: 4, name: 'Pro Gaming Console', price: 599.99, isBestSeller: true, isNew: false },
        { id: 5, name: 'Smart Fitness Watch', price: 299.99, isBestSeller: true, isNew: false },
        { id: 6, name: 'Wireless Earbuds Pro', price: 179.99, isBestSeller: false, isNew: true },
        { id: 7, name: '4K Smart TV', price: 899.99, isBestSeller: true, isNew: false },
        { id: 8, name: 'Foldable Tablet', price: 1299.99, isBestSeller: false, isNew: true }
      ];

      let storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];

      storedProducts.forEach(product => {
        product.isFavorite = storedFavorites.some(fav => fav.id === product.id);
      });

      localStorage.setItem("products", JSON.stringify(storedProducts));
      return storedProducts;
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
      localStorage.setItem("cartCount", cart.length);
      window.dispatchEvent(new Event("storage"));
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
/* General styles remain the same */
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
  margin-bottom: 20px;
}

/* Search */
.search-container {
  max-width: 600px;
  margin: 0 auto 20px;
  position: relative;
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

/* Category Tabs */
.category-tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
}

.category-tabs button {
  padding: 8px 16px;
  background: #f5f5f5;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.9rem;
}

.category-tabs button:hover {
  background: #FFEC8B;
}

.category-tabs button.active {
  background: #FFD700;
  color: #333;
  font-weight: bold;
}

/* Product Grid */
.product-grid {
  padding: 20px 0;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 25px;
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
  
  .category-tabs {
    padding: 0 10px;
  }
  
  .grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 15px;
  }
  
  .product-image {
    height: 160px;
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
    padding: 8px 12px;
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
  
  .category-tabs button {
    padding: 6px 12px;
    font-size: 0.8rem;
  }
  
  .grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
  
  .product-image {
    height: 140px;
  }
  
  .product-description {
    display: none; /* Hide description on small screens */
  }
}
</style>