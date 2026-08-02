<template>
  <div class="min-h-screen mesh-bg flex items-center justify-center p-6">
    <div class="fixed -top-20 -left-20 w-80 h-80 rounded-full bg-secondary/30 blur-3xl pointer-events-none" />
    <div class="fixed -bottom-20 -right-20 w-80 h-80 rounded-full bg-primary/20 blur-3xl pointer-events-none" />

    <div class="w-full max-w-md animate-slide-up relative z-10">
      <div class="text-center mb-8">
        <div class="w-16 h-16 rounded-xl bg-primary flex items-center justify-center shadow-hero mx-auto mb-4 floating">
          <span class="font-outfit font-extrabold text-white text-3xl">S</span>
        </div>
        <h1 class="font-outfit font-extrabold text-3xl text-on-surface tracking-tight">SatuSaldo</h1>
        <p class="font-jakarta text-on-surface-secondary mt-2">Kelola semua dompetmu di satu tempat</p>
      </div>

      <div class="glass-card p-8">
        <h2 class="font-outfit font-semibold text-xl text-on-surface mb-2 text-center">Selamat Datang</h2>
        <p class="font-jakarta text-sm text-on-surface-secondary text-center mb-8">Masuk dengan akun Google kamu untuk melanjutkan</p>

        <button
          @click="handleGoogleLogin"
          :disabled="authStore.loading"
          class="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-full
                 bg-white border border-gray-200 shadow-sm font-jakarta font-semibold text-gray-700
                 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200
                 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          <svg v-if="!authStore.loading" class="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <svg v-else class="animate-spin h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          {{ authStore.loading ? 'Menghubungkan...' : 'Masuk dengan Google' }}
        </button>

        <p v-if="errorMsg" class="mt-4 text-sm text-error font-jakarta text-center">{{ errorMsg }}</p>

        <div class="my-6 flex items-center gap-3">
          <div class="flex-1 h-px bg-white/50" />
          <p class="font-jakarta text-xs text-on-surface-secondary">100% aman & terenkripsi</p>
          <div class="flex-1 h-px bg-white/50" />
        </div>

        <p class="font-jakarta text-xs text-on-surface-secondary text-center leading-relaxed">
          Dengan masuk, kamu menyetujui syarat penggunaan dan kebijakan privasi kami.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const errorMsg = ref('')

async function handleGoogleLogin() {
  errorMsg.value = ''
  try {
    await authStore.loginWithGoogle()
    router.push('/dashboard')
  } catch (err) {
    errorMsg.value = err.message || 'Gagal login. Coba lagi.'
  }
}
</script>
