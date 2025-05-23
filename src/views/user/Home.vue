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
          <a href="#" class="view-all">View All</a>
        </div>
        <div class="grid">
          <div class="product-card" v-for="product in filteredProducts.slice(0, 5)" :key="product.id">
            <div class="product-image">
              <img :src="product.image || require('@/assets/image.png')" alt="Product Image">
            </div>
            <div class="product-info">
              <h3 class="product-name" :title="product.name">{{ product.name }}</h3>
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

    <!-- All Products Section -->
    <section class="product-section">
      <div class="container">
        <div class="section-header">
          <h2>All Products</h2>
          <a href="#" class="view-all">View All</a>
        </div>
        <div class="grid">
          <div class="product-card" v-for="product in filteredProducts" :key="product.id">
            <div class="product-image">
              <img :src="product.image || require('@/assets/image.png')" alt="Product Image">
            </div>
            <div class="product-info">
              <h3 class="product-name" :title="product.name">{{ product.name }}</h3>
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
              <li><a href="#">Home</a></li>
              <li><a href="#">Products</a></li>
              <li><a href="#">About</a></li>
              <li><a href="#">Contact</a></li>
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
    }
  },
  methods: {
    getProductsFromStorage() {
      let storedProducts = JSON.parse(localStorage.getItem("products")) || [
        { id: 1, name: 'Smartphone', price: 699.99, image: null },
        { id: 2, name: 'Laptop', price: 1299.99, image: null },
        { id: 3, name: 'Wireless Headphones', price: 199.99, image: null },
        { id: 4, name: 'Gaming Console', price: 499.99, image: null },
        { id: 5, name: 'ai kem', price: 499.99, image: null },
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
  beforeUnmount() {  // Changed from beforeDestroy to beforeUnmount
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
  padding: 15px 25px;
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

/* Carousel Section */
.carousel-section {
  margin: 30px 0;
}

.carousel-container {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
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
  background-color: rgba(255, 255, 255, 0.7);
  color: #333;
  border: none;
  padding: 15px;
  cursor: pointer;
  border-radius: 50%;
  font-size: 1.2rem;
  z-index: 10;
  transition: all 0.3s;
}

.carousel-btn:hover {
  background-color: rgba(255, 215, 0, 0.9);
}

.prev {
  left: 20px;
}

.next {
  right: 20px;
}

/* Product Sections */
.product-section {
  padding: 60px 0;
}

.product-section:nth-child(odd) {
  background-color: #f8f9fa;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.section-header h2 {
  font-size: 2.2rem;
  color: #333;
  position: relative;
  display: inline-block;
}

.section-header h2::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 0;
  width: 80px;
  height: 4px;
  background-color: #FFD700;
  border-radius: 2px;
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

.product-name:hover::after {
  content: attr(title);
  position: absolute;
  top: 110%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 215, 0, 0.95);
  color: #333;
  padding: 10px 20px;
  border-radius: 30px;
  white-space: nowrap;
  font-size: 1rem;
  z-index: 100;
  box-shadow: 0 5px 15px rgba(255, 215, 0, 0.3);
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}

.product-name:hover::after {
  opacity: 1;
}

.product-price {
  font-size: 1.4rem;
  color: #FF8C00;
  margin: 20px 0;
  text-align: center;
  font-weight: bold;
}

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

/* Footer */
.site-footer {
  background-color: #333;
  color: white;
  padding: 60px 0 20px;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  margin-bottom: 40px;
}

.footer-section h3 {
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #FFD700;
}

.footer-section p {
  margin-bottom: 15px;
  line-height: 1.6;
}

.footer-section ul {
  list-style: none;
  padding: 0;
}

.footer-section ul li {
  margin-bottom: 10px;
}

.footer-section ul li a {
  color: white;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-section ul li a:hover {
  color: #FFD700;
}

.footer-bottom {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #555;
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
  
  .footer-content {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .slide img {
    height: 350px;
  }
}

@media (max-width: 768px) {
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
  
  .slide img {
    height: 300px;
  }
  
  .footer-content {
    grid-template-columns: 1fr;
  }
  
  /* Search bar adjustments for mobile */
  .search-box {
    padding: 12px 20px;
    font-size: 1rem;
    max-width: 90%;
    margin: 0 auto;
  }
  
  .search-section {
    padding: 20px 0;
    margin-top: 20px;
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
  
  .slide img {
    height: 200px;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .view-all {
    margin-top: 10px;
  }
  
  /* Further adjustments for very small screens */
  .search-box {
    padding: 10px 15px;
    font-size: 0.9rem;
    border-width: 1.5px;
  }
  
  .search-section {
    padding: 15px 0;
  }
}
</style>