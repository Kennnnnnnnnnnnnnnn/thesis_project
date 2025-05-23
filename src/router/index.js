import { createRouter, createWebHistory } from 'vue-router';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import LoginView from '@/views/auth/Login.vue';
import AdminLayout from '@/layouts/AdminLayout.vue';

const routes = [
  { path: '/', redirect: '/home' },

  { 
    path: '/home',
    component: DefaultLayout,
    children: [
      { path: '', name: 'Home', component: () => import('@/views/user/Home.vue') },
      { path: '/product', name: 'Product', component: () => import('@/views/user/Product.vue') },
      { path: '/favorite', name: 'Favorite', component: () => import('@/views/user/Favorite.vue') },
      { path: '/cart', name: 'Cart', component: () => import('@/views/user/Cart.vue') },
      { path: '/profile', name: 'Profile', component: () => import('@/views/user/Profile.vue') },
      { path: '/history', name: 'History', component: () => import('@/views/user/History.vue') },
      { path: '/contact', name: 'Contact', component: () => import('@/views/user/Contact.vue') }
    ]
  },

  { path: '/login', name: 'Login', component: LoginView },

  {
    path: '/admin',
    component: AdminLayout,
    children: [
      {
        path: '',
        name: 'AdminDashboard',
        component: () => import('@/views/admin/Dashboard.vue')
      },
      {
        path: 'users',
        name: 'AdminUsers',
        component: () => import('@/views/admin/Users.vue')
      },
      {
        path: 'orders',
        name: 'AdminOrders',
        component: () => import('@/views/admin/Orders.vue')
      },
      {
        path: 'stock',
        name: 'AdminStock',
        component: () => import('@/views/admin/Stock.vue')
      },
      {
        path: 'create',
        name: 'AdminCreate',
        component: () => import('@/views/admin/Product.vue')
      },
      // New Inventory Routes
      {
        path: 'restock',
        name: 'AdminRestock',
        component: () => import('@/views/admin/Restock.vue')
      },
      {
        path: 'categories',
        name: 'AdminCategories',
        component: () => import('@/views/admin/Categories.vue')
      },
      // New Reports Routes
      {
        path: 'reports/orders',
        name: 'AdminOrderReports',
        component: () => import('@/views/admin/reports/OrderReports.vue')
      },
      {
        path: 'reports/stock',
        name: 'AdminStockReports',
        component: () => import('@/views/admin/reports/StockReports.vue')
      },
      {
        path: 'reports/purchase',
        name: 'AdminPurchaseReports',
        component: () => import('@/views/admin/reports/PurchaseReports.vue')
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;