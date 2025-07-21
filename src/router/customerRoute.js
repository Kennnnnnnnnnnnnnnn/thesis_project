import DefaultLayout from '@/layouts/DefaultLayout.vue';
import LoginView from '@/views/auth/Login.vue';
import { createRouter, createWebHistory } from 'vue-router';


const routes = [
  { path: '/', redirect: '/home' },

  { 
    path: '/home',
    component: DefaultLayout,
    children: [
      { path: '', name: 'Home', component: () => import('@/views/user/Home.vue') },
      { path: '/register', name: 'Register', component: () => import('@/views/user/Register.vue')},
      { path: '/product', name: 'Product', component: () => import('@/views/user/Product.vue') },
      { path: '/favorite', name: 'Favorite', component: () => import('@/views/user/Favorite.vue') },
      { path: '/cart', name: 'Cart', component: () => import('@/views/user/Cart.vue') },
      { path: '/profile', name: 'Profile', component: () => import('@/views/user/Profile.vue') },
      { path: '/history', name: 'History', component: () => import('@/views/user/History.vue') },
      { path: '/contact', name: 'Contact', component: () => import('@/views/user/Contact.vue') },
      { path: '/payment',name: 'Payment',component: () => import('@/views/user/Payment.vue')},
      // { path: '/promotion', name: 'Promotion', component: () => import('@/views/user/Promotion.vue') },
      { path: '/tracking', name: 'Tracking', component: () => import('@/views/user/TrackingDelivery.vue') },
      

    ]
  },

  { path: '/user-login', name: 'Logout', component: () => import('@/views/auth/UserLoginForm.vue') },

  { path: '/login', name: 'Login', component: LoginView },
  { path: '/forgot-password', name: 'ForgotPassword', component: () => import('@/views/auth/ForgotPassword.vue') },
  {
    path: "/notFound",
    component: () => import("../views/NotFound.vue"),
    name: "notFound",
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/notFound",
  },

 
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;