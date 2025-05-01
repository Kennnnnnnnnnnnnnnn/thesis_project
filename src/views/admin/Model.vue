<template>
    <transition name="modal">
      <div v-if="show" class="modal-mask" @click.self="$emit('close')">
        <div class="modal-wrapper">
          <div class="modal-container" :style="{ maxWidth: width + 'px' }">
            <div class="modal-header">
              <slot name="header">
                <h3>{{ title }}</h3>
              </slot>
              <button class="modal-close" @click="$emit('close')">
                &times;
              </button>
            </div>
  
            <div class="modal-body">
              <slot></slot>
            </div>
  
            <div class="modal-footer" v-if="$slots.footer">
              <slot name="footer"></slot>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </template>
  
  <script>
  export default {
    name: 'AdminModal',
    props: {
      show: {
        type: Boolean,
        required: true
      },
      title: {
        type: String,
        default: ''
      },
      width: {
        type: Number,
        default: 500
      }
    },
    emits: ['close']
  }
  </script>
  
  <style scoped>
  .modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    transition: opacity 0.3s ease;
  }
  
  .modal-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 20px;
  }
  
  .modal-container {
    width: 100%;
    margin: 0 auto;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    transition: all 0.3s ease;
    max-height: 90vh;
    overflow-y: auto;
  }
  
  .modal-header {
    position: relative;
    padding: 20px;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .modal-header h3 {
    margin: 0;
    font-size: 1.25rem;
  }
  
  .modal-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0 0 0 15px;
  }
  
  .modal-body {
    padding: 20px;
  }
  
  .modal-footer {
    padding: 15px 20px;
    border-top: 1px solid #eee;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
  
  /* Transition effects */
  .modal-enter-from,
  .modal-leave-to {
    opacity: 0;
  }
  
  .modal-enter-from .modal-container,
  .modal-leave-to .modal-container {
    transform: scale(0.95);
  }
  </style>