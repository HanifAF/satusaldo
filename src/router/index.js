import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  // Halaman Utama / Landing Page (Aktif)
  { 
    path: '/', 
    name: 'Landing', 
    component: () => import('@/pages/LandingPage.vue') 
  },

  // Dashboard & App Views (Aktif)
  {
    path: '/dashboard',
    component: () => import('@/layouts/AppLayout.vue'),
    children: [
      { path: '',          name: 'Dashboard', component: () => import('@/pages/DashboardPage.vue') },
      { path: '/laporan',  name: 'Laporan',   component: () => import('@/pages/LaporanPage.vue') },
      { path: '/utang',    name: 'Utang',     component: () => import('@/pages/UtangPage.vue') },
      { path: '/tagihan',  name: 'Tagihan',   component: () => import('@/pages/TagihanPage.vue') },
    ]
  },
  { path: '/login',    name: 'Login',    component: () => import('@/pages/LoginPage.vue') },
  { path: '/daftar',   name: 'Daftar',   component: () => import('@/pages/LoginPage.vue') },
  { path: '/register', name: 'Register', component: () => import('@/pages/LoginPage.vue') },
  { path: '/setup',    name: 'Setup',    component: () => import('@/pages/SetupPage.vue') },

  // Semua path lainnya dialihkan ke Landing Page
  { 
    path: '/:pathMatch(.*)*', 
    redirect: '/' 
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() { 
    return { top: 0 } 
  }
})

export default router
