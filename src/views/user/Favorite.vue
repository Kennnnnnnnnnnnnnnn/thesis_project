<template>
  <div style="padding: 20px; background: #fff">
    <h1 style="text-align: center; margin-bottom: 20px">❤️ Your Favorites</h1>

    <div v-if="favorites.length === 0" style="text-align: center; color: #888">
      You haven’t added any favorites yet.
    </div>

    <div
      v-else
      style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px; max-width: 1200px; margin: auto"
    >
      <div
        v-for="fav in favorites"
        :key="fav._id"
        style="border: 1px solid #eee; border-radius: 8px; overflow: hidden; display: flex; flex-direction: column"
      >
        <img
          :src="fav.productId?.image || require('@/assets/image.png')"
          alt="Product"
          style="height: 160px; object-fit: contain; padding: 10px"
        />
        <div style="padding: 12px; flex: 1">
          <div style="font-size: 14px; color: #999">★★★★★</div>
          <h3 style="font-size: 16px; font-weight: bold; margin: 5px 0">
            {{ fav.productId?.name || 'Unknown Product' }}
          </h3>
          <p style="font-size: 14px; color: #333; margin-bottom: 8px">
            {{ typeof fav.productId?.price === 'number' ? '$' + fav.productId.price.toFixed(2) : 'Price N/A' }}
          </p>
          <button
            @click="removeFavorite(fav._id)"
            style="background: red; color: white; padding: 6px 12px; border: none; border-radius: 4px; font-weight: bold; cursor: pointer"
          >
            Remove ❤
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'FavoriteView',
  data() {
    const token = localStorage.getItem('token');
    let user = null;

    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) user = JSON.parse(storedUser);
    } catch (e) {
      console.warn('⚠️ Invalid user data:', e);
    }

    return {
      token,
      user,
      favorites: []
    };
  },
  methods: {
    async fetchFavorites() {
      if (!this.token || !this.user) {
        console.warn('⛔ Not authenticated');
        return;
      }
      try {
        const res = await axios.get('http://localhost:4000/api/getAllDocs/Favorite', {
          headers: { Authorization: `Bearer ${this.token}` }
        });
        this.favorites = res.data.data;
        console.log('✅ Favorites loaded:', this.favorites.length);
      } catch (err) {
        console.error('❌ Failed to load favorites:', err);
      }
    },
    async removeFavorite(favoriteId) {
      try {
        await axios.delete(`http://localhost:4000/api/deleteDoc/Favorite/${favoriteId}`, {
          headers: { Authorization: `Bearer ${this.token}` }
        });
        this.favorites = this.favorites.filter(f => f._id !== favoriteId);
        console.log('🗑️ Favorite removed');
      } catch (err) {
        console.error('❌ Failed to remove favorite:', err);
      }
    }
  },
  async mounted() {
    await this.fetchFavorites();
  }
};
</script>

<style scoped>
</style>
