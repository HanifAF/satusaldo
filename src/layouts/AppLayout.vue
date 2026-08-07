<template>
  <div class="min-h-screen bg-[#f8faf9] font-jakarta flex flex-col">
    <!-- Top Navigation Bar (Consistent with Landing Page style) -->
    <header class="fixed w-full top-0 z-50 bg-white/85 backdrop-blur-md border-b border-[#17c662]/10 shadow-sm transition-all">
      <div class="px-6 h-20 flex items-center justify-between max-w-7xl mx-auto">
        
        <!-- Left: Brand Logo -->
        <router-link to="/dashboard" class="flex items-center gap-2.5 group">
          <div class="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <span class="font-outfit font-bold text-white text-lg">S</span>
          </div>
          <span class="font-outfit font-extrabold text-2xl text-on-surface tracking-tight">SatuSaldo</span>
        </router-link>

        <!-- Center: Desktop Nav Links (Landing Page Menu Aesthetic) -->
        <nav class="hidden md:flex items-center gap-8">
          <router-link
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="relative py-2 group transition-colors"
          >
            <span
              class="text-sm font-medium transition-colors"
              :class="$route.path === item.to ? 'text-primary font-semibold' : 'text-on-surface/80 hover:text-primary'"
            >
              {{ item.label }}
            </span>
            <!-- Active indicator underline -->
            <div
              v-if="$route.path === item.to"
              class="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full transition-all"
            ></div>
          </router-link>
        </nav>

        <!-- Right: User Profile & Actions -->
        <div class="hidden md:flex items-center gap-4">
          <!-- User Profile Pill -->
          <div class="flex items-center gap-3 py-1.5 px-3 rounded-full bg-black/5 border border-black/5">
            <img
              v-if="authStore.userAvatar"
              :src="authStore.userAvatar"
              :alt="authStore.userName"
              class="w-7 h-7 rounded-full object-cover"
            />
            <div
              v-else
              class="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs"
            >
              {{ userInitial }}
            </div>
            <span class="font-jakarta font-medium text-xs text-on-surface max-w-[130px] truncate">
              {{ authStore.userName }}
            </span>
          </div>

          <!-- Logout Button -->
          <button
            @click="handleLogout"
            class="p-2 rounded-full text-on-surface/60 hover:text-error hover:bg-error/10 transition-colors"
            title="Keluar"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>

        <!-- Mobile Menu Toggle Button -->
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="md:hidden p-2 rounded-lg text-on-surface hover:bg-black/5"
        >
          <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Mobile Dropdown Menu -->
      <transition name="slide-down">
        <div v-if="mobileMenuOpen" class="md:hidden bg-white/95 backdrop-blur-md border-b border-black/5 px-6 py-4 space-y-2 shadow-lg">
          <router-link
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            @click="mobileMenuOpen = false"
            class="flex items-center justify-between py-2.5 px-3 rounded-lg transition-colors font-jakarta font-medium"
            :class="$route.path === item.to ? 'bg-primary/10 text-primary font-semibold' : 'text-on-surface hover:bg-black/5'"
          >
            <span class="text-sm">{{ item.label }}</span>
          </router-link>

          <div class="pt-3 mt-3 border-t border-black/5 flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                {{ userInitial }}
              </div>
              <div>
                <p class="font-semibold text-xs text-on-surface">{{ authStore.userName }}</p>
                <p class="text-[11px] text-on-surface-secondary truncate max-w-[180px]">{{ authStore.userEmail }}</p>
              </div>
            </div>
            <button @click="handleLogout" class="text-xs font-semibold text-error px-3 py-1.5 rounded-md hover:bg-error/10">
              Keluar
            </button>
          </div>
        </div>
      </transition>
    </header>

    <!-- Main Content Container (Full Width, Centered, Under Top Nav) -->
    <main class="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
      <router-view />
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
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/laporan',   label: 'Laporan' },
  { to: '/utang',     label: 'Utang & Piutang' },
  { to: '/tagihan',   label: 'Tagihan' },
]

const userInitial = computed(() => authStore.userName ? authStore.userName.charAt(0).toUpperCase() : 'U')

async function handleLogout() {
  await authStore.logout()
  router.push('/')
}
</script>

<style scoped>
.slide-down-enter-active, .slide-down-leave-active { 
  transition: all 0.25s ease; 
}
.slide-down-enter-from, .slide-down-leave-to { 
  opacity: 0; 
  transform: translateY(-8px); 
}
</style>
