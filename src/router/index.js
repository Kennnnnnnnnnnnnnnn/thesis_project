import DefaultLayout from '@/layouts/DefaultLayout.vue';
import LoginView from '@/views/auth/Login.vue';
import CustomerLoginForm from '@/views/auth/UserLoginForm.vue'
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

  { path: '/user-login', name: 'UserLogin', component: CustomerLoginForm},

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

  {
    path: '/admin',
    component: () => import('@/layouts/Default.vue'),
    redirect: "/admin/dashboard",
    children: [
      {
        path: 'dashboard',
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

      {
        path: 'supplier',
        name: 'AdminSupplier',
        component: () => import('@/views/admin/Supplier.vue')
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
      },

      //permission
      {
        name: "permission",
        path: "/admin/permission",
        component: () => import("../views/Permission/Permission.vue"),
      },

      //permission
      {
        name: "delivery",
        path: "/admin/delivery",
        component: () => import("../views/admin/DeliveryTracking.vue"),
      },

      // symbol
      {
        name: "symbol",
        path: "/admin/symbol",
        component: () => import("../views/admin/Symbol.vue"),
      },

      //currency
      {
        name: "currency",
        path: "/admin/currency",
        component: () => import("../views/admin/Currency.vue"),
      },

      //customer feedback
      {
        name: "feedback",
        path: "/admin/feedback",
        component: () => import("../views/admin/CustomerFeedback.vue"),
      },

      //promotion
      {
        name: "promotion",
        path: "/admin/promotion",
        component: () => import("../views/admin/Promotion.vue"),
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;