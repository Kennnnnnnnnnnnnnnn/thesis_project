<template>
    <nav class="nav-menu" :class="{ 'mobile-menu-open': isMobileMenuOpen }">
        <div class="container">
            <!-- Mobile menu toggle button -->
            <button class="mobile-menu-toggle" @click="toggleMobileMenu" aria-label="Toggle navigation menu">
                <span class="hamburger-icon"></span>
            </button>

            <ul class="nav-list" :class="{ 'show': isMobileMenuOpen }">
                <li v-for="item in dynamicNavItems" :key="item.name">
                    <router-link :to="item.route" class="nav-link" @click="closeMobileMenu">
                    <span class="nav-icon" v-if="item.icon" :class="item.icon"></span>
                    <span class="nav-text">{{ $t(item.name) }}</span>
                    <span v-if="item.badge" class="nav-badge">{{ item.badge }}</span>
                    </router-link>
                </li>
            </ul>

        </div>
    </nav>
</template>
<script setup>
import { ref, computed, onMounted, watch } from 'vue';

const isMobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
    isMobileMenuOpen.value = false;
};

const cartCount = ref(JSON.parse(localStorage.getItem("cartCount")) || 0);

// Listen for cart updates dynamically
onMounted(() => {
    window.addEventListener("storage", () => {
        cartCount.value = JSON.parse(localStorage.getItem("cartCount")) || 0;
    });
});

// Watch for cart changes in localStorage
watch(() => localStorage.getItem("cart"), () => {
    cartCount.value = JSON.parse(localStorage.getItem("cartCount")) || 0;
});

const navItems = ref([
  { name: 'nav.home', route: '/home', icon: 'icon-home' },
  { name: 'nav.products', route: '/product', icon: 'icon-products' },
  { name: 'nav.favorites', route: '/favorite', icon: 'icon-heart' },
  { name: 'nav.cart', route: '/cart', icon: 'icon-cart' },
  { name: 'nav.profile', route: '/profile', icon: 'icon-user' },
  { name: 'nav.history', route: '/history', icon: 'icon-history' },
  { name: 'nav.contact', route: '/contact', icon: 'icon-envelope' }
]);


const dynamicNavItems = computed(() => {
    return navItems.value.map(item => {
        if (item.name === 'Cart') {
            return { ...item, badge: cartCount.value };
        }
        return item;
    });
});
</script>
<style scoped>
/* Base styles */
.nav-menu {
    position: fixed;
    width: 100%;
    top: 65px;
    left: 0;
    background-color: #ffffff;
    z-index: 100;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    position: relative;
}

.nav-list {
    display: flex;
    justify-content: center;
    list-style: none;
    padding: 0;
    margin: 0;
    transition: all 0.3s ease;
}

.nav-list li {
    position: relative;
}

.nav-link {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: #333;
    font-weight: 500;
    padding: 16px 20px;
    transition: all 0.3s ease;
    position: relative;
    box-shadow: inset 0 -3px 0 transparent;
}

/* Icon styles */
.nav-icon {
    margin-right: 8px;
    font-size: 18px;
    display: inline-block;
    width: 24px;
    height: 24px;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    opacity: 0.7;
    transition: opacity 0.2s ease;
}

/* Basic icons using CSS */
.icon-home {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'%3E%3C/path%3E%3Cpolyline points='9 22 9 12 15 12 15 22'%3E%3C/polyline%3E%3C/svg%3E");
}

.icon-products {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='2' y='3' width='20' height='14' rx='2' ry='2'%3E%3C/rect%3E%3Cline x1='8' y1='21' x2='16' y2='21'%3E%3C/line%3E%3Cline x1='12' y1='17' x2='12' y2='21'%3E%3C/line%3E%3C/svg%3E");
}

.icon-heart {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'%3E%3C/path%3E%3C/svg%3E");
}

.icon-cart {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='9' cy='21' r='1'%3E%3C/circle%3E%3Ccircle cx='20' cy='21' r='1'%3E%3C/circle%3E%3Cpath d='M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6'%3E%3C/path%3E%3C/svg%3E");
}

.icon-user {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'%3E%3C/path%3E%3Ccircle cx='12' cy='7' r='4'%3E%3C/circle%3E%3C/svg%3E");
}

.icon-history {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'%3E%3C/circle%3E%3Cpolyline points='12 6 12 12 16 14'%3E%3C/polyline%3E%3C/svg%3E");
}

.icon-envelope {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z'%3E%3C/path%3E%3Cpolyline points='22,6 12,13 2,6'%3E%3C/polyline%3E%3C/svg%3E");
}

/* Badge styles */
.nav-badge {
    position: absolute;
    top: 8px;
    right: 8px;
    background-color: #ff5252;
    color: white;
    font-size: 10px;
    font-weight: bold;
    padding: 2px 6px;
    border-radius: 10px;
    min-width: 18px;
    text-align: center;
}

/* Hover and active state */
.nav-link:hover {
    color: #FFD700;
    background-color: rgba(66, 184, 131, 0.05);
}

.nav-link:hover .nav-icon {
    opacity: 1;
}

/* Active state - using exact active */
.nav-link.router-link-exact-active {
    color: #FFD700;
    font-weight: 600;
    box-shadow: inset 0 -3px 0 #FFD700;
}

.nav-link.router-link-exact-active .nav-icon {
    opacity: 1;
}

/* Mobile menu toggle */
.mobile-menu-toggle {
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    padding: 15px;
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 110;
}

.hamburger-icon,
.hamburger-icon:before,
.hamburger-icon:after {
    width: 24px;
    height: 2px;
    background-color: #333;
    display: block;
    transition: all 0.3s ease;
    position: relative;
}

.hamburger-icon:before,
.hamburger-icon:after {
    content: "";
    position: absolute;
    left: 0;
}

.hamburger-icon:before {
    top: -8px;
}

.hamburger-icon:after {
    top: 8px;
}

/* Hamburger animation */
.mobile-menu-open .hamburger-icon {
    background-color: transparent;
}

.mobile-menu-open .hamburger-icon:before {
    transform: rotate(45deg);
    top: 0;
}

.mobile-menu-open .hamburger-icon:after {
    transform: rotate(-45deg);
    top: 0;
}

/* Responsive styles */
@media (max-width: 992px) {
    .nav-link {
        padding: 14px 16px;
    }

    .nav-text {
        font-size: 14px;
    }
}

@media (max-width: 768px) {
    .mobile-menu-toggle {
        display: block;
    }

    .container {
        padding: 10px 15px;
    }

    .nav-list {
        position: fixed;
        top: 60px;
        left: 0;
        right: 0;
        bottom: 0;
        flex-direction: column;
        background-color: white;
        padding: 20px;
        box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
        transform: translateY(-100%);
        opacity: 0;
        pointer-events: none;
        overflow-y: auto;
        max-height: calc(100vh - 60px);
    }

    .nav-list.show {
        transform: translateY(0);
        opacity: 1;
        pointer-events: auto;
    }

    .nav-list li {
        width: 100%;
        text-align: center;
        margin: 0;
    }

    .nav-link {
        padding: 16px;
        justify-content: center;
        border-bottom: 1px solid #f0f0f0;
    }

    .router-link-exact-active {
        box-shadow: none;
        background-color: rgba(66, 184, 131, 0.1);
    }

    /* Adjust badge position for mobile */
    .nav-badge {
        position: static;
        margin-left: 8px;
    }
}

/* Animation for mobile menu */
@keyframes slideDown {
    from {
        transform: translateY(-20px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.mobile-menu-open .nav-list.show li {
    animation: slideDown 0.3s ease forwards;
    opacity: 0;
}

/* Stagger animation for each menu item */
.mobile-menu-open .nav-list.show li:nth-child(1) {
    animation-delay: 0.05s;
}

.mobile-menu-open .nav-list.show li:nth-child(2) {
    animation-delay: 0.1s;
}

.mobile-menu-open .nav-list.show li:nth-child(3) {
    animation-delay: 0.15s;
}

.mobile-menu-open .nav-list.show li:nth-child(4) {
    animation-delay: 0.2s;
}

.mobile-menu-open .nav-list.show li:nth-child(5) {
    animation-delay: 0.25s;
}

.mobile-menu-open .nav-list.show li:nth-child(6) {
    animation-delay: 0.3s;
}

.mobile-menu-open .nav-list.show li:nth-child(7) {
    animation-delay: 0.35s;
}
</style>