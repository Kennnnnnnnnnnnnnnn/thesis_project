<template>
  <div class="profile-page">
    <div class="profile-container contact-container">
      <div class="profile-form contact-form">
        <h2 class="contact-title">
          {{ $t('contact.ourInfo') }}
          <span class="title-underline"></span>
        </h2>
        <div class="contact-details">
          <div class="contact-item">
            <i class="fas fa-map-marker-alt"></i>
            <p>{{ $t('contact.address') }}</p>
          </div>
          <div class="contact-item">
            <i class="fas fa-phone"></i>
            <p>{{ $t('contact.phone') }}</p>
          </div>
          <div class="contact-item">
            <i class="fas fa-envelope"></i>
            <p>{{ $t('contact.email') }}</p>
          </div>
          <div class="contact-item">
            <i class="fas fa-clock"></i>
            <p>{{ $t('contact.hours') }}</p>
          </div>
        </div>
        <div class="social-media">
          <h3>{{ $t('contact.connect') }}</h3>
          <div class="social-icons">
            <a href="https://facebook.com/yourpage" target="_blank" class="social-icon fa-facebook-f"></a>
            <a href="https://instagram.com/yourprofile" target="_blank" class="social-icon fa-instagram"></a>
            <a href="https://t.me/yourchannel" target="_blank" class="social-icon fa-telegram-plane"></a>
            <a href="https://wa.me/15551234567" target="_blank" class="social-icon fa-whatsapp"></a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContactView'
};
</script>

<style scoped>
.profile-page {
  font-family: 'Poppins', sans-serif;
  min-height: 100vh;
  background: linear-gradient(to bottom right, #fffbea, #ffffff, #fffbea);
  display: flex;
  flex-direction: column;
}
.profile-container.contact-container {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  margin-bottom: 60px;
}
.profile-form.contact-form {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  max-width: 800px;
  width: 100%;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  border: 1px solid #fcd34d;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
}

.contact-title {
  font-size: 2rem;
  font-weight: 700;
  color: #b7791f;
  margin-bottom: 16px;
  position: relative;
}
.title-underline {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 56px;
  height: 4px;
  background-color: #facc15;
  border-radius: 9999px;
}

.contact-details {
  display: grid;
  gap: 12px;
  margin-top: 16px;
}
.contact-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 500;
  color: #92400e;
}
.contact-item i {
  font-size: 1.2rem;
  color: #b7791f;
}

.social-media {
  margin-top: 24px;
  border-top: 1px solid #fcd34d;
  padding-top: 16px;
}
.social-media h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #92400e;
  margin-bottom: 12px;
}
.social-icons {
  display: flex;
  gap: 16px;
}
.social-icon {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 3px 8px rgba(0,0,0,0.1);
}
.social-icon:hover {
  transform: scale(1.1) translateY(-2px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.15);
}
.fa-facebook-f { background: linear-gradient(135deg, #3b5998, #8b9dc3); }
.fa-instagram { background: linear-gradient(135deg, #e1306c, #f77737); }
.fa-telegram-plane { background: linear-gradient(135deg, #0088cc, #00cfff); }
.fa-whatsapp { background: linear-gradient(135deg, #25D366, #128C7E); }
</style>
