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
          <p class="email">{{ user.email || 'No email provided' }}</p>
        </div>
      </div>
    </section>

    <!-- Profile Content Section -->
    <section class="profile-content">
      <div class="container">
        <div class="profile-card">
          <h2 class="section-title">Personal Information</h2>
          
          <form @submit.prevent="saveProfile">
            <div class="form-grid">
              <div class="form-group">
                <label>First Name</label>
                <input type="text" v-model="user.firstName" required>
              </div>
              
              <div class="form-group">
                <label>Last Name</label>
                <input type="text" v-model="user.lastName" required>
              </div>
              
              <div class="form-group">
                <label>Email</label>
                <input type="email" v-model="user.email" required>
              </div>
              
              <div class="form-group">
                <label>Phone Number</label>
                <input type="tel" v-model="user.phone">
              </div>
              
              <div class="form-group full-width">
                <label>Address</label>
                <input type="text" v-model="user.address">
              </div>
              
              <div class="form-group">
                <label>City</label>
                <input type="text" v-model="user.city">
              </div>
              
              <div class="form-group">
                <label>Postal Code</label>
                <input type="text" v-model="user.postalCode">
              </div>
            </div>
            
            <div class="form-actions">
              <button type="button" class="cancel-btn" @click="resetForm">Cancel</button>
              <button type="submit" class="save-btn">Save Changes</button>
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
  background-color: #f8f9fa;
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
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  color: white;
  padding: 80px 0 60px;
  margin-bottom: 40px;
  position: relative;
  overflow: hidden;
}

.profile-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==');
}

.header-content {
  text-align: center;
  position: relative;
  z-index: 1;
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
  background: linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  font-size: 48px;
  font-weight: bold;
  color: white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.edit-avatar-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #fff;
  border: none;
  color: #2575fc;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.edit-avatar-btn:hover {
  transform: scale(1.1);
}

.profile-header h1 {
  font-size: 2.2rem;
  margin-bottom: 8px;
  font-weight: 600;
}

.profile-header .email {
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 0;
}

/* Profile Content */
.profile-content {
  padding-top: 20px;
}

.profile-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  padding: 40px;
  margin-top: -60px;
  position: relative;
  z-index: 2;
}

.section-title {
  font-size: 1.5rem;
  margin-bottom: 30px;
  color: #2c3e50;
  position: relative;
  padding-bottom: 10px;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50px;
  height: 3px;
  background: linear-gradient(to right, #6a11cb, #2575fc);
  border-radius: 3px;
}

/* Form Styles */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 25px;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #495057;
  font-size: 0.95rem;
}

.form-group input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: #f8f9fa;
}

.form-group input:focus {
  border-color: #2575fc;
  box-shadow: 0 0 0 3px rgba(37, 117, 252, 0.1);
  outline: none;
  background-color: white;
}

.form-group.full-width {
  grid-column: span 2;
}

/* Form Actions */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.cancel-btn,
.save-btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn {
  background: #f8f9fa;
  color: #6c757d;
  border: 1px solid #dee2e6;
}

.cancel-btn:hover {
  background: #e9ecef;
}

.save-btn {
  background: linear-gradient(to right, #6a11cb, #2575fc);
  color: white;
  border: none;
  box-shadow: 0 4px 15px rgba(106, 17, 203, 0.2);
}

.save-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(106, 17, 203, 0.25);
}

/* Responsive Design */
@media (max-width: 768px) {
  .profile-header {
    padding: 60px 0 40px;
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
    padding: 30px 20px;
    margin-top: -40px;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .form-group.full-width {
    grid-column: span 1;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .cancel-btn,
  .save-btn {
    width: 100%;
  }
}

/* Font Awesome icons */
.fas {
  font-size: 0.9em;
}
</style>