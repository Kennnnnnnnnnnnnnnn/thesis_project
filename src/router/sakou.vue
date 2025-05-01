// import { createRouter, createWebHistory } from 'vue-router'
// import DefaultLayout from '@/layouts/DefaultLayout.vue'

// const routes = [
//   {
//     path: '/',
//     redirect: '/home' // Redirect root path to Home
//   },
//   {
//     path: '/home',
//     component: DefaultLayout,
//     children: [
//       { path: '', name: 'Home', component: () => import('@/views/user/Home.vue') }, // Default child route
//       { path: '/product', name: 'Product', component: () => import('@/views/user/Product.vue') },
//       { path: '/favorite', name: 'Favorite', component: () => import('@/views/user/Favorite.vue') },
//       { path: '/cart', name: 'Cart', component: () => import('@/views/user/Cart.vue') },
//       { path: '/profile', name: 'Profile', component: () => import('@/views/user/Profile.vue') },
//       { path: '/history', name: 'History', component: () => import('@/views/user/History.vue') },
//       { path: '/contact', name: 'Contact', component: () => import('@/views/user/Contact.vue') }
//     ]
//   }
// ]

// const router = createRouter({
//   history: createWebHistory(),
//   routes
// })

// export default router