<template>
  <div class="profile-page">
    <!-- Profile Header Section -->
    <section class="profile-header">
      <div class="container">
        <div class="header-content">
          <div class="avatar-container">
            <div class="avatar">
              <span>{{ userInitials }}</span>
            </div>
            <button class="edit-avatar-btn">
              <i class="fas fa-camera"></i>
            </button>
          </div>
          <h1>{{ fullName }}</h1>
          <p class="email">{{ user.email || $t('profile.noEmail') }}</p>
        </div>
      </div>
    </section>

    <!-- Profile Content Section -->
    <section class="profile-content">
      <div class="container">
        <div class="profile-card">
          <h2 class="section-title">{{ $t('profile.personalInfo') }}</h2>
          
          <form @submit.prevent="saveProfile">
            <div class="form-grid">
              <div class="form-group">
                <label>{{ $t('profile.firstName') }}</label>
                <input type="text" v-model="user.firstName" required>
              </div>
              
              <div class="form-group">
                <label>{{ $t('profile.lastName') }}</label>
                <input type="text" v-model="user.lastName" required>
              </div>
              
              <div class="form-group">
                <label>{{ $t('profile.email') }}</label> 
                <input type="email" v-model="user.email" required>
              </div>
              
              <div class="form-group">
                <label>{{ $t('profile.phone') }}</label>
                <input type="tel" v-model="user.phone">
              </div>
              
              <div class="form-group full-width">
                <label>{{ $t('profile.address') }}</label>
                <input type="text" v-model="user.address">
              </div>
              
              <div class="form-group">
                <label>{{ $t('profile.city') }}</label>
                <input type="text" v-model="user.city">
              </div>
              
              <div class="form-group">
                <label>{{ $t('profile.postalCode') }}</label>
                <input type="text" v-model="user.postalCode">
              </div>
            </div>
            
            <div class="form-actions">
              <button type="button" class="cancel-btn" @click="resetForm">{{ $t('common.cancel') }}</button>
              <button type="submit" class="save-btn">{{ $t('profile.saveChanges') }}</button>
            </div>
          </form>
        </div>
      </div>
    </section>

    <!-- Confirmation Modal -->
    <UserInfoModal 
      v-if="showConfirmationModal"
      :show="showConfirmationModal"
      :user="clonedUser" 
      @close="showConfirmationModal = false"
      @confirm="handleConfirmation"
    />
  </div>
</template>

<script>
import UserInfoModal from '@/views/user/UserInfoModal.vue';

// Default user structure
const DEFAULT_USER = {
  firstName: 'Guest',
  lastName: 'User',
  email: '',
  phone: '',
  address: '',
  city: '',
  postalCode: '',
  country: ''
};

export default {
  name: 'ProfileView',
  components: {
    UserInfoModal
  },
  data() {
    return {
      showConfirmationModal: false,
      user: { ...DEFAULT_USER },
      originalUser: { ...DEFAULT_USER }
    };
  },
  computed: {
    // Safe initials calculation
    userInitials() {
      const firstChar = this.user.firstName?.charAt(0) || 'G';
      const lastChar = this.user.lastName?.charAt(0) || 'U';
      return `${firstChar}${lastChar}`.toUpperCase();
    },
    // Safe full name display
    fullName() {
      return `${this.user.firstName || ''} ${this.user.lastName || ''}`.trim() || 'Guest User';
    },
    // Deep clone for modal
    clonedUser() {
      return JSON.parse(JSON.stringify(this.user));
    }
  },
  created() {
    this.loadUserData();
  },
  methods: {
    loadUserData() {
      try {
        const savedUser = JSON.parse(localStorage.getItem("user"));
        if (savedUser) {
          this.user = { ...DEFAULT_USER, ...savedUser };
          this.originalUser = JSON.parse(JSON.stringify(this.user));
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
      }
    },
    saveProfile() {
      if (!this.user.firstName || !this.user.lastName) {
        alert("First and last name are required!");
        return;
      }
      this.showConfirmationModal = true;
    },
    handleConfirmation(confirmedUser) {
      this.user = { ...confirmedUser };
      localStorage.setItem("user", JSON.stringify(this.user));
      this.originalUser = JSON.parse(JSON.stringify(this.user));
      this.showConfirmationModal = false;
    },
    resetForm() {
      this.user = JSON.parse(JSON.stringify(this.originalUser));
    }
  }
};
</script>
<style scoped>
.profile-page {
  background-color: #fff;
  min-height: 100vh;
  padding-bottom: 60px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Header Styles */
.profile-header {
  background: #fff;
  color: #333;
  padding: 60px 0 40px;
  margin-bottom: 20px;
  position: relative;
  border-bottom: 1px solid #FFEC8B;
}

.header-content {
  text-align: center;
  position: relative;
}

.avatar-container {
  position: relative;
  display: inline-block;
  margin-bottom: 20px;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(45deg, #FFEC8B 0%, #FFD700 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  font-size: 48px;
  font-weight: bold;
  color: #333;
  border: 3px solid #FFD700;
}

.edit-avatar-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #FFD700;
  border: none;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.edit-avatar-btn:hover {
  transform: scale(1.1);
  background: #FFA500;
}

.profile-header h1 {
  font-size: 2.2rem;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
}

.profile-header .email {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 0;
}

/* Profile Content */
.profile-content {
  padding-top: 20px;
}

.profile-card {
  background: white;
  border-radius: 15px;
  padding: 30px;
  margin: 0 auto;
  max-width: 800px;
  border: 1px solid #FFEC8B;
}

.section-title {
  font-size: 1.5rem;
  margin-bottom: 30px;
  color: #333;
  position: relative;
  padding-bottom: 10px;
  text-align: center;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 3px;
  background: #FFD700;
  border-radius: 3px;
}

/* Form Styles */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
  font-size: 0.95rem;
}

.form-group input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #FFEC8B;
  border-radius: 25px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: #fff;
}

.form-group input:focus {
  border-color: #FFA500;
  outline: none;
}

.form-group.full-width {
  grid-column: span 2;
}

/* Form Actions */
.form-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #FFEC8B;
}

.cancel-btn,
.save-btn {
  padding: 12px 24px;
  border-radius: 25px;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn {
  background: #f5f5f5;
  color: #666;
  border: 1px solid #ddd;
}

.cancel-btn:hover {
  background: #e9e9e9;
}

.save-btn {
  background: #FFD700;
  color: #333;
  border: none;
  font-weight: bold;
}

.save-btn:hover {
  background: #FFA500;
  color: #fff;
}

/* Responsive Design */
@media (max-width: 768px) {
  .profile-header {
    padding: 40px 0 30px;
  }
  
  .avatar {
    width: 100px;
    height: 100px;
    font-size: 36px;
  }
  
  .profile-header h1 {
    font-size: 1.8rem;
  }
  
  .profile-card {
    padding: 25px 20px;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .form-group.full-width {
    grid-column: span 1;
  margin-bottom: 15px;
  }
  
  .form-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .cancel-btn,
  .save-btn {
    width: 100%;
    max-width: 200px;
  }
}

@media (max-width: 480px) {
  .profile-header {
    padding: 30px 0 20px;
  }
  
  .avatar {
    width: 80px;
    height: 80px;
    font-size: 28px;
  }
  
  .edit-avatar-btn {
    width: 30px;
    height: 30px;
  }
  
  .profile-header h1 {
    font-size: 1.5rem;
  }
  
  .section-title {
    font-size: 1.3rem;
  }
}
</style>