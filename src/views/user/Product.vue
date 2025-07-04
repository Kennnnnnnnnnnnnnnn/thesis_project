<template>
  <div class="product-page">
    <h1 class="title">🍚 {{ $t('products.title') }}</h1>

    <!-- 🔍 Search -->
    <div class="search-bar">
      <input v-model="searchQuery" type="text" :placeholder="$t('products.searchPlaceholder')" />
    </div>

    <!-- 🏷️ Category Tabs -->
    <div class="tabs">
      <button
        v-for="cat in categories"
        :key="cat.value"
        :class="{ active: activeCategory === cat.value }"
        @click="activeCategory = cat.value"
      >
        {{ $t(cat.label) }}
      </button>
    </div>

    <!-- 🛍️ Product Grid -->
    <div class="product-grid">
      <div class="card" v-for="product in filteredProducts" :key="product._id">
        <img :src="product.imageURL || defaultImage" class="product-img" />
        <div class="card-body">
          <h2 class="product-name">{{ product.name }}</h2>
          <p class="product-description">{{ product.description || $t('products.noDescription') }}</p>

          <p class="product-category">🗂️ {{ $t('products.category') }}: {{ product.categoryName || $t('common.na') }}</p>


          <div class="price-block">
            <span v-if="product.discount > 0" class="original-price">${{ product.salePrice.toFixed(2) }}</span>
            <span class="discounted-price">
              ៛{{ discountedPrice(product).toFixed(2) }}
            </span>
            <span v-if="product.discount > 0" class="discount-tag">{{ $t('common.save') }} {{ product.discount }}%</span>
          </div>

          <div class="actions">
            <button @click="toggleFavorite(product)">
              <span :class="{ favorited: product.isFavorite }" class="heart">❤</span>
            </button>
            <button class="add-cart" @click="addToCart(product)">{{ $t('products.addToCart') }}</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 🧺 Cart Drawer -->
    <CartDrawer
      :visible="showCartDrawer"
      :cartItems="cartItems"
      @close="showCartDrawer = false"
      @updateQty="updateQty"
      @removeItem="removeItem"
    />
  </div>
</template>

<script setup>
import apiURL from '@/api/config.js';
import CartDrawer from '@/components/CartDrawer.vue';
import { useStore } from '@/store/useStore';
import axios from 'axios';
import Swal from 'sweetalert2';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const showCartDrawer = ref(false);
const cartItems = ref([]);
const store = useStore();
const { t } = useI18n();
const defaultImage = require('@/assets/image.png');
const API = `${apiURL}/api`;

const products = ref([]);
const favorites = ref([]);
const searchQuery = ref('');
const activeCategory = ref('all');

const categories = ref([
  { label: 'products.categories.all', value: 'all' },
  { label: 'products.categories.bestSellers', value: 'best' },
  { label: 'products.categories.newArrivals', value: 'new' }
]);


// Check if user is properly authenticated
function checkAuthStatus() {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const storeToken = store.getToken;
  const storeUserId = store.getUserId;

  const hasToken = !!(token || storeToken);
  const hasUserId = !!(storeUserId || user);

  
  return hasToken && hasUserId;
}

const addToCart = async (product) => {
  const exists = cartItems.value.find(i => i._id === product._id);
  if (exists) exists.quantity += 1;
  else cartItems.value.push({ ...product, quantity: 1 });
  showCartDrawer.value = true;
};

const updateQty = (item, qty) => {
  if (qty < 1) return;
  item.quantity = qty;
};

const removeItem = (item) => {
  cartItems.value = cartItems.value.filter(i => i._id !== item._id);
};

const fetchProducts = async () => {
  try {
    const res = await axios.get(`${API}/public/products`);
    const now = new Date();

    products.value = res.data.data.map(p => {
      // Calculate if created in the last 3 days
      const createdAt = new Date(p.createdAt);
      const diffDays = (now - createdAt) / (1000 * 60 * 60 * 24);
      const isNew = diffDays <= 3;

      // Determine best seller based on backend flag or custom logic
      const isBestSeller = p.isBestSeller || (p.salesCount && p.salesCount >= 50); // example threshold

      return {
        ...p,
        isFavorite: false,
        isNew,
        isBestSeller,
      };
    });
    console.log('Products loaded:', products.value.length);
  } catch (err) {
    console.error('❌ Failed to load products:', err);
  }
};


const fetchFavorites = async () => {
  const isAuthenticated = checkAuthStatus();
  
  if (!isAuthenticated) {
    console.log('🔍 User not authenticated, skipping favorites fetch');
    return;
  }
  
  try {
    const res = await axios.get(`${API}/getAllDocs/Favorite`, {
      headers: { Authorization: `Bearer ${store.getToken}` }
    });
    
    favorites.value = res.data.data || [];
    
    // Mark products as favorite
    products.value.forEach(p => {
      p.isFavorite = favorites.value.some(fav => fav.productId?._id === p._id);
    });
  } catch (err) {
    console.error('❌ Failed to fetch favorites:', err);
  }
};

const toggleFavorite = async (product) => {
 
  // Check authentication status
  const isAuthenticated = checkAuthStatus();
  
  try {
    if (isAuthenticated) {
      // Authenticated: use backend
      if (product.isFavorite) {
        // Remove favorite
        const fav = favorites.value.find(f => f.productId?._id === product._id);
        
        if (fav) {
          await axios.delete(`${API}/deleteDoc/Favorite/${fav._id}`, {
            headers: { Authorization: `Bearer ${store.getToken}` }
          });
          
          favorites.value = favorites.value.filter(f => f._id !== fav._id);
          product.isFavorite = false;
          console.log('🔍 Favorite removed successfully');
          Swal.fire({ 
            icon: 'success', 
            title: t('alerts.removedFromFavorites'), 
            timer: 1000, 
            showConfirmButton: false 
          });
        }
      } else {
        // Add favorite
        console.log('🔍 Adding favorite to backend');
        const response = await axios.post(`${API}/insertDoc/Favorite`, {
          fields: { 
            productId: product._id
          }
        }, {
          headers: { 
            Authorization: `Bearer ${store.getToken}`,
            'Content-Type': 'application/json'
          }
        });
        
        favorites.value.push(response.data.data);
        product.isFavorite = true;
        Swal.fire({ 
          icon: 'success', 
          title: t('alerts.addedToFavorites'), 
          timer: 1000, 
          showConfirmButton: false 
        });
      }
    } else {
      // Not logged in: use localStorage
      let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
      const isFavorited = favorites.some(item => item.id === product._id);
      
      if (isFavorited) {
        favorites = favorites.filter(item => item.id !== product._id);
        product.isFavorite = false;
        Swal.fire({ 
          icon: 'success', 
          title: t('alerts.removedFromFavorites'), 
          timer: 1000, 
          showConfirmButton: false 
        });
      } else {
        favorites.push({
          id: product._id,
          name: product.name,
          price: discountedPrice(product),
          image: product.imageURL
        });
        product.isFavorite = true;
        console.log('🔍 Favorite added to localStorage');
        Swal.fire({ 
          icon: 'success', 
          title: t('alerts.addedToFavorites'), 
          timer: 1000, 
          showConfirmButton: false 
        });
      }
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }
  } catch (err) {
    console.error('❌ Error toggling favorite:', err);
    console.error('❌ Error response:', err.response?.data);
    Swal.fire({ 
      icon: 'error', 
      title: t('alerts.failedToUpdateFavorite'), 
      text: err.response?.data?.message || t('alerts.tryAgain'), 
      timer: 2000, 
      showConfirmButton: false 
    });
  }
};

const discountedPrice = (product) => {
  if (!product.discount) return product.salePrice;
  return product.salePrice * (1 - product.discount / 100);
};

const filteredProducts = computed(() => {
  let list = products.value.filter(p =>
    p.name?.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
  if (activeCategory.value === 'best') {
    list = list.filter(p => p.isBestSeller);
  } else if (activeCategory.value === 'new') {
    list = list.filter(p => p.isNew);
  }
  return list;
});

onMounted(async () => {
  await fetchProducts();
  await fetchFavorites();
});
</script>

<style scoped>
.product-page {
  padding: 20px;
  background: #fff;
}
.title {
  text-align: center;
  margin-bottom: 20px;
  font-size: 28px;
  font-weight: bold;
}
.search-bar {
  max-width: 500px;
  margin: 0 auto 20px;
}
.search-bar input {
  width: 100%;
  padding: 12px;
  border-radius: 20px;
  border: 1px solid #ccc;
}
.tabs {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}
.tabs button {
  padding: 8px 16px;
  border-radius: 20px;
  border: none;
  background: #eee;
  font-weight: normal;
  cursor: pointer;
}
.tabs button.active {
  background: #FFD700;
  font-weight: bold;
}
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
  max-width: 1200px;
  margin: auto;
}
.card {
  border: 1px solid #eee;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease;
}
.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}
.product-img {
  height: 160px;
  object-fit: contain;
  padding: 10px;
  background: #fafafa;
}
.card-body {
  padding: 12px;
  flex: 1;
}
.product-name {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 4px;
}
.product-description {
  font-size: 13px;
  color: #777;
  margin-bottom: 6px;
}
.product-category {
  font-size: 13px;
  color: #999;
  margin-bottom: 8px;
}
.price-block {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  margin-bottom: 10px;
}
.original-price {
  text-decoration: line-through;
  color: #aaa;
}
.discounted-price {
  color: #ff5722;
  font-weight: bold;
  font-size: 18px;
}
.discount-tag {
  background: #ffeb3b;
  padding: 2px 6px;
  border-radius: 6px;
  font-size: 12px;
  color: #333;
}
.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.heart {
  font-size: 20px;
  color: #ccc;
  transition: all 0.2s ease;
}
.heart.favorited {
  color: red;
  transform: scale(1.2);
}
.add-cart {
  background: #FFD700;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
}
.add-cart:hover {
  background: #ffc107;
}
</style>