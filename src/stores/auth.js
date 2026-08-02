import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { MOCK_USER } from '@/lib/mockData'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(MOCK_USER)
  const initialized = ref(true)
  const hasWallets = ref(true)
  const loading = ref(false)

  const isLoggedIn = computed(() => !!user.value)
  const userEmail  = computed(() => user.value?.email || '')
  const userName   = computed(() => user.value?.user_metadata?.full_name || userEmail.value.split('@')[0] || '')
  const userAvatar = computed(() => user.value?.user_metadata?.avatar_url || '')

  async function initialize() { initialized.value = true }

  async function loginWithGoogle() {
    loading.value = true
    await new Promise(r => setTimeout(r, 800))
    user.value = MOCK_USER
    hasWallets.value = true
    loading.value = false
  }

  async function logout() {
    loading.value = true
    await new Promise(r => setTimeout(r, 400))
    user.value = null
    hasWallets.value = false
    loading.value = false
  }

  return { user, initialized, hasWallets, loading, isLoggedIn, userEmail, userName, userAvatar, initialize, loginWithGoogle, logout }
})
