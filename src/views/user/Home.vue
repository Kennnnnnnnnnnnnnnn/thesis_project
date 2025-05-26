<template>
  <div class="home">
    <!-- Search Section -->
    <section class="search-section">
      <div class="container">
        <input type="text" v-model="searchQuery" placeholder="Search products..." class="search-box">
      </div>
    </section>

    <!-- Image Carousel -->
    <section class="carousel-section">
      <div class="carousel-container">
        <div class="carousel-slide" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
          <div class="slide" v-for="(slide, index) in slides" :key="index">
            <img :src="slide.image" :alt="slide.alt">
          </div>
        </div>
        <button class="carousel-btn prev" @click="prevSlide">❮</button>
        <button class="carousel-btn next" @click="nextSlide">❯</button>
      </div>
    </section>

    <!-- New Products Section -->
    <section class="product-section">
      <div class="container">
        <div class="section-header">
          <h2>New Products</h2>
          <router-link to="/products" class="view-all">View All</router-link>
        </div>
        <div class="grid">
          <div class="product-card" v-for="product in newProducts" :key="product.id">
            <div class="product-image">
              <img :src="product.image || require('@/assets/image.png')" alt="Product Image">
            </div>
            <div class="product-info">
              <div class="rating">
                ★★★★★
              </div>
              <h3 class="product-name">{{ product.name }}</h3>
              <p class="product-description">Premium quality product</p>
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

    <!-- All Products Section -->
    <section class="product-section">
      <div class="container">
        <div class="section-header">
          <h2>All Products</h2>
          <router-link to="/products" class="view-all">View All</router-link>
        </div>
        <div class="grid">
          <div class="product-card" v-for="product in filteredProducts.slice(0, 8)" :key="product.id">
            <div class="product-image">
              <img :src="product.image || require('@/assets/image.png')" alt="Product Image">
            </div>
            <div class="product-info">
              <div class="rating">
                ★★★★★
              </div>
              <h3 class="product-name">{{ product.name }}</h3>
              <p class="product-description">Premium quality product</p>
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

    <!-- Footer -->
    <footer class="site-footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h3>About Us</h3>
            <p>Premium Store offers the finest selections at unbeatable prices.</p>
          </div>
          <div class="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><router-link to="/">Home</router-link></li>
              <li><router-link to="/products">Products</router-link></li>
              <li><router-link to="/about">About</router-link></li>
              <li><router-link to="/contact">Contact</router-link></li>
            </ul>
          </div>
          <div class="footer-section">
            <h3>Contact Us</h3>
            <p>Email: info@premiumstore.com</p>
            <p>Phone: (123) 456-7890</p>
          </div>
        </div>
        <div class="footer-bottom">
          <p>© 2023 Premium Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  data() {
    return {
      searchQuery: '',
      products: this.getProductsFromStorage(),
      currentSlide: 0,
      slides: [
        {
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          alt: 'Electronics Collection'
        },
        {
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          alt: 'Headphones Sale'
        },
        {
          image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          alt: 'Sneakers Promotion'
        }
      ],
      carouselInterval: null
    };
  },
  computed: {
    filteredProducts() {
      return this.products.filter(product => 
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    newProducts() {
      return this.products.filter(product => product.isNew).slice(0, 5);
    }
  },
  methods: {
    getProductsFromStorage() {
      let storedProducts = JSON.parse(localStorage.getItem("products")) || [
        { id: 1, name: 'Premium Smartphone', price: 799.99, isBestSeller: true, isNew: true },
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
    },
    nextSlide() {
      this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    },
    prevSlide() {
      this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    },
    startCarousel() {
      this.carouselInterval = setInterval(() => {
        this.nextSlide();
      }, 5000);
    }
  },
  mounted() {
    this.startCarousel();
  },
  beforeUnmount() {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }
  }
};
</script>

<style scoped>
/* General */
.home {
  text-align: center;
  background-color: #fff;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Search Section */
.search-section {
  padding: 30px 0;
  margin-top: 30px;
}

.search-box {
  width: 100%;
  max-width: 600px;
  padding: 12px 20px;
  border: 1px solid #FFD700;
  border-radius: 25px;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s;
  background-color: white;
  margin: 0 auto;
  display: block;
}

.search-box:focus {
  border-color: #FFA500;
}

/* Carousel Section */
.carousel-section {
  margin: 30px 0;
}

.carousel-container {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 8px;
  border: 1px solid #FFEC8B;
}

.carousel-slide {
  display: flex;
  transition: transform 0.5s ease;
}

.slide {
  min-width: 100%;
  box-sizing: border-box;
}

.slide img {
  width: 100%;
  height: 400px;
  object-fit: cover;
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(255, 255, 255, 0.9);
  color: #333;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  border-radius: 50%;
  font-size: 1rem;
  z-index: 10;
  transition: all 0.3s;
  border: 1px solid #FFEC8B;
}

.carousel-btn:hover {
  background-color: #FFD700;
}

.prev {
  left: 20px;
}

.next {
  right: 20px;
}

/* Product Sections */
.product-section {
  padding: 40px 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.section-header h2 {
  font-size: 1.8rem;
  color: #333;
  margin: 0;
}

.view-all {
  color: #FF8C00;
  font-weight: bold;
  text-decoration: none;
  transition: color 0.3s;
}

.view-all:hover {
  color: #FF4500;
  text-decoration: underline;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
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
@media (max-width: 992px) {
  .grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
  
  .slide img {
    height: 350px;
  }
}

@media (max-width: 768px) {
  .search-section {
    padding: 20px 0;
  }
  
  .carousel-section {
    margin: 20px 0;
  }
  
  .slide img {
    height: 300px;
  }
  
  .section-header h2 {
    font-size: 1.5rem;
  }
  
  .product-section {
    padding: 30px 0;
  }
}

@media (max-width: 576px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
  
  .slide img {
    height: 200px;
  }
  
  .footer-content {
    grid-template-columns: 1fr;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .view-all {
    align-self: flex-end;
  }
}

@media (max-width: 400px) {
  .grid {
    grid-template-columns: 1fr;
  }
  
  .search-box {
    padding: 10px 15px;
    font-size: 0.9rem;
  }
}
</style>