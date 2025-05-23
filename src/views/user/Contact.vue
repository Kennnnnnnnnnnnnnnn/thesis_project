<template>
  <div class="contact-page">
    <h1>Contact Us</h1>
    <p class="subtitle">Get in touch with our support team</p>
    
    <div class="contact-container">
      <div class="contact-info">
        <h2>Our Information</h2>
        <div class="info-item">
          <i class="fas fa-map-marker-alt"></i>
          <p>123 Main Street, City, Country</p>
        </div>
        <div class="info-item">
          <i class="fas fa-phone"></i>
          <p>+1 (555) 123-4567</p>
        </div>
        <div class="info-item">
          <i class="fas fa-envelope"></i>
          <p>support@example.com</p>
        </div>
        <div class="info-item">
          <i class="fas fa-clock"></i>
          <p>Monday - Friday: 9:00 AM - 5:00 PM</p>
        </div>
        
        <!-- Social Media Section -->
        <div class="social-media">
          <h3>Connect With Us</h3>
          <div class="social-icons">
            <a href="https://facebook.com/yourpage" target="_blank" class="social-icon">
              <i class="fab fa-facebook-f"></i>
            </a>
            <a href="https://instagram.com/yourprofile" target="_blank" class="social-icon">
              <i class="fab fa-instagram"></i>
            </a>
            <a href="https://t.me/yourchannel" target="_blank" class="social-icon">
              <i class="fab fa-telegram-plane"></i>
            </a>
            <a href="https://wa.me/15551234567" target="_blank" class="social-icon">
              <i class="fab fa-whatsapp"></i>
            </a>
          </div>
        </div>
      </div>
      
      <form @submit.prevent="submitForm" class="contact-form">
        <h2>Send Us a Message</h2>
        <div class="form-group">
          <label for="name">Name</label>
          <input 
            type="text" 
            id="name" 
            v-model="form.name" 
            @blur="validateField('name')"
            :class="{ 'error': errors.name }"
          >
          <span class="error-message" v-if="errors.name">{{ errors.name }}</span>
        </div>
        
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            type="email" 
            id="email" 
            v-model="form.email" 
            @blur="validateField('email')"
            :class="{ 'error': errors.email }"
          >
          <span class="error-message" v-if="errors.email">{{ errors.email }}</span>
        </div>
        
        <div class="form-group">
          <label for="subject">Subject</label>
          <input 
            type="text" 
            id="subject" 
            v-model="form.subject" 
            @blur="validateField('subject')"
            :class="{ 'error': errors.subject }"
          >
          <span class="error-message" v-if="errors.subject">{{ errors.subject }}</span>
        </div>
        
        <div class="form-group">
          <label for="message">Message</label>
          <textarea 
            id="message" 
            v-model="form.message" 
            @blur="validateField('message')"
            :class="{ 'error': errors.message }"
          ></textarea>
          <span class="error-message" v-if="errors.message">{{ errors.message }}</span>
        </div>
        
        <button type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Sending...' : 'Send Message' }}
        </button>
        
        <div class="success-message" v-if="isSuccess">
          Thank you! Your message has been sent successfully.
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContactView',
  data() {
    return {
      form: {
        name: '',
        email: '',
        subject: '',
        message: ''
      },
      errors: {
        name: '',
        email: '',
        subject: '',
        message: ''
      },
      isSubmitting: false,
      isSuccess: false
    }
  },
  methods: {
    validateField(field) {
      switch(field) {
        case 'name': {
          this.errors.name = this.form.name.trim() ? '' : 'Name is required';
          break;
        }
        case 'email': {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          this.errors.email = this.form.email.trim() 
            ? emailRegex.test(this.form.email) ? '' : 'Please enter a valid email'
            : 'Email is required';
          break;
        }
        case 'subject': {
          this.errors.subject = this.form.subject.trim() ? '' : 'Subject is required';
          break;
        }
        case 'message': {
          this.errors.message = this.form.message.trim() ? '' : 'Message is required';
          break;
        }
      }
    },
    validateForm() {
      this.validateField('name');
      this.validateField('email');
      this.validateField('subject');
      this.validateField('message');
      
      return !Object.values(this.errors).some(error => error);
    },
    async submitForm() {
      if (!this.validateForm()) return;
      
      this.isSubmitting = true;
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        this.isSuccess = true;
        this.resetForm();
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          this.isSuccess = false;
        }, 5000);
      } catch (error) {
        console.error('Error submitting form:', error);
      } finally {
        this.isSubmitting = false;
      }
    },
    resetForm() {
      this.form = {
        name: '',
        email: '',
        subject: '',
        message: ''
      };
    }
  }
}
</script>
<style scoped>
.contact-page {
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #fff;
  font-family: 'Poppins', sans-serif;
}

.contact-page h1 {
  text-align: center;
  color: #333;
  margin-bottom: 10px;
  font-size: 2.5rem;
  font-weight: 600;
}

.subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 40px;
  font-size: 1.1rem;
}

.contact-container {
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
}

.contact-info, .contact-form {
  flex: 1;
  min-width: 300px;
}

.contact-info {
  background: #FFF9E6;
  padding: 30px;
  border-radius: 15px;
  border: 1px solid #FFEC8B;
}

.contact-info h2 {
  color: #333;
  margin-bottom: 20px;
  font-weight: 600;
  position: relative;
  padding-bottom: 10px;
}

.contact-info h2::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50px;
  height: 3px;
  background: #FFD700;
  border-radius: 3px;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.info-item i {
  margin-right: 15px;
  color: #FF8C00;
  width: 20px;
  text-align: center;
  font-size: 1.2rem;
}

/* Social Media Styles */
.social-media {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #FFEC8B;
}

.social-media h3 {
  color: #333;
  margin-bottom: 15px;
  font-weight: 500;
}

.social-icons {
  display: flex;
  gap: 15px;
}

.social-icon {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  transition: all 0.3s;
  text-decoration: none;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.social-icon:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 10px rgba(0,0,0,0.15);
}

.social-icon i {
  margin: 0;
}

.fa-facebook-f { background: #3b5998; }
.fa-instagram { background: #e4405f; }
.fa-telegram-plane { background: #0088cc; }
.fa-whatsapp { background: #25D366; }

.contact-form {
  background: white;
  padding: 30px;
  border-radius: 15px;
  border: 1px solid #FFEC8B;
}

.contact-form h2 {
  color: #333;
  margin-bottom: 20px;
  font-weight: 600;
  position: relative;
  padding-bottom: 10px;
}

.contact-form h2::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50px;
  height: 3px;
  background: #FFD700;
  border-radius: 3px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #FFEC8B;
  border-radius: 25px;
  font-size: 1rem;
  background-color: #FFFDF5;
  transition: all 0.3s;
}

.form-group textarea {
  min-height: 120px;
  resize: vertical;
  border-radius: 15px;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #FFA500;
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1);
  background-color: white;
}

.error {
  border-color: #e74c3c !important;
}

.error-message {
  color: #e74c3c;
  font-size: 0.85rem;
  margin-top: 5px;
  display: block;
}

button {
  background: #FFD700;
  color: #333;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  width: 100%;
}

button:hover {
  background: #FFA500;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

button:disabled {
  background: #ccc;
  color: #666;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.success-message {
  margin-top: 20px;
  padding: 15px;
  background: #27ae60;
  color: white;
  border-radius: 8px;
  text-align: center;
  font-weight: 500;
}

@media (max-width: 768px) {
  .contact-container {
    flex-direction: column;
    gap: 25px;
  }
  
  .contact-page h1 {
    font-size: 2rem;
  }
  
  .contact-info, .contact-form {
    padding: 25px 20px;
  }
}
</style>