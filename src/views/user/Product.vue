<template>
  <div style="padding: 20px; background: #fff">
    <h1 style="text-align: center; margin-bottom: 20px">Our Products</h1>

    <!-- Search -->
    <div style="max-width: 500px; margin: 0 auto 20px; display: flex; gap: 10px">
      <input
        v-model="searchQuery"
        placeholder="Search product..."
        style="flex: 1; padding: 10px 15px; border-radius: 20px; border: 1px solid #ccc"
      />
    </div>

    <!-- Category Tabs -->
    <div style="display: flex; justify-content: center; gap: 10px; margin-bottom: 20px">
      <button
        v-for="cat in categories"
        :key="cat.value"
        @click="activeCategory = cat.value"
        :style="{
          padding: '8px 16px',
          borderRadius: '20px',
          border: 'none',
          background: activeCategory === cat.value ? '#FFD700' : '#eee',
          fontWeight: activeCategory === cat.value ? 'bold' : 'normal'
        }"
      >
        {{ cat.label }}
      </button>
    </div>

    <!-- Product Grid -->
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px; max-width: 1200px; margin: auto">
      <div
        v-for="product in filteredProducts"
        :key="product._id"
        style="border: 1px solid #eee; border-radius: 8px; overflow: hidden; display: flex; flex-direction: column"
      >
        <img :src="product.image || require('@/assets/image.png')" alt="Product" style="height: 160px; object-fit: contain; padding: 10px" />
        <div style="padding: 12px; flex: 1">
          <div style="font-size: 14px; color: #999">★★★★★</div>
          <h3 style="font-size: 16px; font-weight: bold; margin: 5px 0">{{ product.name }}</h3>
          <p style="font-size: 14px; color: #333; margin-bottom: 8px">
            {{ typeof product.price === 'number' ? '$' + product.price.toFixed(2) : 'Price N/A' }}
          </p>
          <div style="display: flex; justify-content: space-between; align-items: center">
            <button @click="toggleFavorite(product)" style="background: none; border: none; cursor: pointer">
              <span :class="{ favorited: product.isFavorite }" class="heart-icon">❤</span>
            </button>
            <button
              @click="addToCart(product)"
              style="background: #FFD700; padding: 6px 12px; border: none; border-radius: 4px; font-weight: bold; cursor: pointer"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ProductView',
  data() {
    const token = localStorage.getItem('token');

    // Attempt to load full user object
    let user = null;
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      try {
        user = JSON.parse(storedUser);
      } catch (e) {
        console.warn('⚠️ Failed to parse stored user:', e.message);
      }
    } else {
      const userId = localStorage.getItem('userId');
      const role = localStorage.getItem('userRole');
      const permissions = localStorage.getItem('userPermissions');

      if (userId && role) {
        user = {
          _id: userId,
          role,
          permissions: permissions ? JSON.parse(permissions) : []
        };
        localStorage.setItem('user', JSON.stringify(user));
        console.log('🧠 Reconstructed and saved user from keys');
      }
    }

    console.log('📦 Loaded token:', token);
    console.log('👤 Final user:', user);

    return {
      token,
      user,
      searchQuery: '',
      activeCategory: 'all',
      categories: [
        { label: 'All', value: 'all' },
        { label: 'Best Selling', value: 'best' },
        { label: 'New Arrivals', value: 'new' }
      ],
      products: [],
      favorites: []
    };
  },
  computed: {
    filteredProducts() {
      let filtered = this.products.filter(p =>
        p.name?.toLowerCase().includes(this.searchQuery.toLowerCase())
      );

      if (this.activeCategory === 'best') {
        filtered = filtered.filter(p => p.isBestSeller);
      } else if (this.activeCategory === 'new') {
        filtered = filtered.filter(p => p.isNew);
      }

      filtered.forEach(p => {
        p.isFavorite = this.favorites.some(fav => fav.productId?._id === p._id);
      });

      return filtered;
    }
  },
  methods: {
    async fetchProducts() {
      try {
        console.log('📡 Fetching public products...');
        const res = await axios.get('http://localhost:4000/api/public/products');
        this.products = res.data.data.map(p => ({
          ...p,
          isBestSeller: p.isBestSeller || false,
          isNew: p.isNew || false,
          isFavorite: false
        }));
      } catch (err) {
        console.error('❌ Failed to fetch products:', err);
      }
    },
    async fetchFavorites() {
      if (!this.token || !this.user) {
        console.warn('⛔ Skipping fetchFavorites: Not logged in');
        return;
      }
      try {
        const res = await axios.get('http://localhost:4000/api/getAllDocs/Favorite', {
          headers: { Authorization: `Bearer ${this.token}` }
        });
        this.favorites = res.data.data;
        console.log('❤️ Favorites loaded:', this.favorites.length);
      } catch (err) {
        console.error('❌ Failed to fetch favorites:', err);
      }
    },
    async toggleFavorite(product) {
      if (!this.token || !this.user) {
        alert('Please log in first.');
        return;
      }

      const existing = this.favorites.find(fav => fav.productId?._id === product._id);

      try {
        if (existing) {
          await axios.delete(`http://localhost:4000/api/deleteDoc/Favorite/${existing._id}`, {
            headers: { Authorization: `Bearer ${this.token}` }
          });
          this.favorites = this.favorites.filter(fav => fav._id !== existing._id);
          product.isFavorite = false;
        } else {
          const res = await axios.post(
            'http://localhost:4000/api/insertDoc/Favorite',
            { fields: { productId: product._id } },
            { headers: { Authorization: `Bearer ${this.token}` } }
          );
          this.favorites.push(res.data.data);
          product.isFavorite = true;
        }
      } catch (err) {
        console.error('❌ Favorite toggle failed:', err);
      }
    },
    async addToCart(product) {
      if (!this.token || !this.user) {
        alert('Please log in first.');
        return;
      }

      try {
        const res = await axios.post(
          'http://localhost:4000/api/insertDoc/Cart',
          {
            fields: {
              productId: product._id,
              quantity: 1 // initial quantity
            }
          },
          {
            headers: {
              Authorization: `Bearer ${this.token}`
            }
          }
        );
        console.log('🛒 Added to cart:', res.data);
        alert(`🛒 "${product.name}" added to your cart!`);
      } catch (err) {
        console.error('❌ Failed to add to cart:', err);
        alert('⚠️ Failed to add to cart');
      }
    }

  },
  async mounted() {
    await this.fetchProducts();
    await this.fetchFavorites();
  }
};
</script>

<style scoped>
.heart-icon {
  font-size: 24px;
  color: #ccc;
  transition: all 0.2s ease;
  user-select: none;
}
.heart-icon.favorited {
  color: red;
  transform: scale(1.3);
}
.heart-icon:hover {
  cursor: pointer;
  transform: scale(1.15);
}
</style>
