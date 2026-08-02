<template>
  <div class="min-h-screen mesh-bg flex">
    <!-- Sidebar -->
    <aside class="w-64 flex-shrink-0 hidden lg:flex flex-col py-8 px-4 border-r border-white/50">
      <div class="flex items-center gap-3 px-4 mb-10">
        <div class="w-9 h-9 rounded-md bg-primary flex items-center justify-center shadow-btn">
          <span class="font-outfit font-bold text-white text-lg">S</span>
        </div>
        <span class="font-outfit font-bold text-xl text-on-surface tracking-tight">SatuSaldo</span>
      </div>
      <nav class="flex-1 space-y-1">
        <router-link v-for="item in navItems" :key="item.to" :to="item.to" class="nav-item" :class="{ active: $route.path === item.to }">
          <span class="text-xl">{{ item.icon }}</span>
          <span>{{ item.label }}</span>
        </router-link>
      </nav>
      <div class="glass-card p-4 mt-6">
        <div class="flex items-center gap-3">
          <img v-if="authStore.userAvatar" :src="authStore.userAvatar" :alt="authStore.userName" class="w-9 h-9 rounded-full object-cover" />
          <div v-else class="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
            <span class="font-outfit font-bold text-primary text-sm">{{ userInitial }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-jakarta font-semibold text-sm text-on-surface truncate">{{ authStore.userName }}</p>
            <p class="font-jakarta text-xs text-on-surface-secondary truncate">{{ authStore.userEmail }}</p>
          </div>
        </div>
        <button @click="handleLogout" class="w-full mt-3 text-xs font-jakarta font-medium text-on-surface-secondary hover:text-error transition-colors flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Keluar
        </button>
      </div>
    </aside>

    <!-- Main content -->
    <main class="flex-1 overflow-y-auto">
      <!-- Mobile header -->
      <header class="lg:hidden flex items-center justify-between px-4 py-4 border-b border-white/50 bg-white/20 backdrop-blur-glass">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded bg-primary flex items-center justify-center">
            <span class="font-outfit font-bold text-white">S</span>
          </div>
          <span class="font-outfit font-bold text-lg text-on-surface">SatuSaldo</span>
        </div>
        <button @click="mobileMenuOpen = !mobileMenuOpen" class="p-2 rounded-md hover:bg-white/30">
          <svg class="w-5 h-5 text-on-surface" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </header>
      <transition name="slide-down">
        <div v-if="mobileMenuOpen" class="lg:hidden glass-card m-4 p-4 space-y-1">
          <router-link v-for="item in navItems" :key="item.to" :to="item.to" class="nav-item" :class="{ active: $route.path === item.to }" @click="mobileMenuOpen = false">
            <span class="text-xl">{{ item.icon }}</span><span>{{ item.label }}</span>
          </router-link>
          <button @click="handleLogout" class="nav-item text-error w-full text-left">
            <span class="text-xl">🚪</span><span>Keluar</span>
          </button>
        </div>
      </transition>
      <div class="p-6 lg:p-8"><router-view /></div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const mobileMenuOpen = ref(false)

const navItems = [
  { to: '/dashboard', icon: '🏠', label: 'Dashboard' },
  { to: '/laporan',   icon: '📊', label: 'Laporan' },
  { to: '/utang',     icon: '🤝', label: 'Utang & Piutang' },
  { to: '/tagihan',   icon: '📅', label: 'Tagihan' },
]

const userInitial = computed(() => authStore.userName.charAt(0).toUpperCase())

async function handleLogout() {
  await authStore.logout()
  router.push('/')
}
</script>

<style scoped>
.slide-down-enter-active, .slide-down-leave-active { transition: all 0.25s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
