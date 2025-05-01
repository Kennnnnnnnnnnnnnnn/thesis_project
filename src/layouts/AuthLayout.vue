<template>
    <div class="auth-layout">
      <div class="auth-container">
        <router-view /> <!-- Renders Login.vue/Register.vue -->
      </div>
    </div>
  </template>
  
  <style>
  .auth-layout {
    display: grid;
    place-items: center;
    min-height: 100vh;
    background: #f5f5f5;
  }
  .auth-container {
    width: 100%;
    max-width: 400px;
    padding: 2rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }
  </style>