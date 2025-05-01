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
}

.contact-page h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 10px;
}

.subtitle {
  text-align: center;
  color: #7f8c8d;
  margin-bottom: 40px;
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
  background: #f8f9fa;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.contact-info h2 {
  color: #2c3e50;
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.info-item i {
  margin-right: 15px;
  color: #3498db;
  width: 20px;
  text-align: center;
}

/* Social Media Styles */
.social-media {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.social-media h3 {
  color: #2c3e50;
  margin-bottom: 15px;
}

.social-icons {
  display: flex;
  gap: 15px;
}

.social-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  transition: transform 0.3s;
  text-decoration: none;
}

.social-icon:hover {
  transform: scale(1.1);
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
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.contact-form h2 {
  color: #2c3e50;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #2c3e50;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.form-group textarea {
  min-height: 120px;
  resize: vertical;
}

.error {
  border-color: #e74c3c !important;
}

.error-message {
  color: #e74c3c;
  font-size: 14px;
  margin-top: 5px;
  display: block;
}

button {
  background: #3498db;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s;
}

button:hover {
  background: #2980b9;
}

button:disabled {
  background: #95a5a6;
  cursor: not-allowed;
}

.success-message {
  margin-top: 20px;
  padding: 10px;
  background: #2ecc71;
  color: white;
  border-radius: 4px;
  text-align: center;
}

@media (max-width: 768px) {
  .contact-container {
    flex-direction: column;
  }
}
</style>