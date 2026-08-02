<template>
  <div class="min-h-screen mesh-bg flex items-center justify-center p-6">
    <div class="w-full max-w-lg animate-slide-up">
      <div class="text-center mb-10">
        <div class="w-14 h-14 rounded-xl bg-primary flex items-center justify-center shadow-hero mx-auto mb-4">
          <span class="font-outfit font-extrabold text-white text-2xl">S</span>
        </div>
        <h1 class="font-outfit font-extrabold text-3xl text-on-surface tracking-tight mb-2">Satu langkah lagi! 🎉</h1>
        <p class="font-jakarta text-on-surface-secondary">Masukkan saldo awal untuk masing-masing dompet kamu saat ini.</p>
      </div>

      <div class="glass-card p-8">
        <form @submit.prevent="handleSetup" class="space-y-6">
          <!-- Bank -->
          <div class="space-y-3">
            <div class="flex items-center gap-3 pb-3 border-b border-white/30">
              <span class="text-2xl">🏦</span>
              <div>
                <h3 class="font-outfit font-semibold text-base text-on-surface">Dompet Bank</h3>
                <p class="font-jakarta text-xs text-on-surface-secondary">BCA, Mandiri, BRI, dll.</p>
              </div>
            </div>
            <BaseInput v-model="form.bank" label="Saldo Bank saat ini" type="text" placeholder="0" prefix="Rp" :error="errors.bank" @input="(e) => form.bank = formatInput(e.target.value)" />
          </div>
          <!-- E-Wallet -->
          <div class="space-y-3">
            <div class="flex items-center gap-3 pb-3 border-b border-white/30">
              <span class="text-2xl">📱</span>
              <div>
                <h3 class="font-outfit font-semibold text-base text-on-surface">Dompet E-Wallet</h3>
                <p class="font-jakarta text-xs text-on-surface-secondary">GoPay, OVO, ShopeePay, Dana, dll.</p>
              </div>
            </div>
            <BaseInput v-model="form.ewallet" label="Saldo E-Wallet saat ini" type="text" placeholder="0" prefix="Rp" :error="errors.ewallet" @input="(e) => form.ewallet = formatInput(e.target.value)" />
          </div>
          <!-- Cash -->
          <div class="space-y-3">
            <div class="flex items-center gap-3 pb-3 border-b border-white/30">
              <span class="text-2xl">💵</span>
              <div>
                <h3 class="font-outfit font-semibold text-base text-on-surface">Dompet Tunai</h3>
                <p class="font-jakarta text-xs text-on-surface-secondary">Uang fisik di dompet / saku</p>
              </div>
            </div>
            <BaseInput v-model="form.cash" label="Saldo Tunai saat ini" type="text" placeholder="0" prefix="Rp" :error="errors.cash" @input="(e) => form.cash = formatInput(e.target.value)" />
          </div>
          <!-- Total preview -->
          <div class="hero-card p-4 rounded-md">
            <div class="flex justify-between items-center">
              <span class="font-jakarta font-medium text-sm text-on-surface/70">Total Saldo Awal</span>
              <span class="font-outfit font-extrabold text-xl text-on-surface currency">{{ formatRupiah(totalAmount) }}</span>
            </div>
          </div>
          <p v-if="submitError" class="text-sm text-error font-jakarta">{{ submitError }}</p>
          <BaseButton type="submit" variant="primary" class="w-full" :loading="loading">Mulai Kelola Keuanganku →</BaseButton>
        </form>
      </div>
      <p class="text-center mt-4 font-jakarta text-xs text-on-surface-secondary">Kamu bisa mengubah saldo kapan saja melalui pengaturan.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useWalletStore } from '@/stores/wallet'
import { useFormatRupiah } from '@/composables/useFormat'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const router = useRouter()
const walletStore = useWalletStore()
const { formatRupiah, parseRupiah } = useFormatRupiah()

const loading = ref(false)
const submitError = ref('')
const errors = ref({})
const form = ref({ bank: '', ewallet: '', cash: '' })

const totalAmount = computed(() =>
  (parseRupiah(form.value.bank) || 0) + (parseRupiah(form.value.ewallet) || 0) + (parseRupiah(form.value.cash) || 0)
)

function formatInput(val) {
  const num = parseRupiah(val)
  return num ? num.toLocaleString('id-ID') : ''
}

async function handleSetup() {
  errors.value = {}
  submitError.value = ''
  const bank = parseRupiah(form.value.bank) || 0
  const ewallet = parseRupiah(form.value.ewallet) || 0
  const cash = parseRupiah(form.value.cash) || 0
  if (bank + ewallet + cash === 0) { submitError.value = 'Masukkan minimal satu saldo yang tidak nol.'; return }
  loading.value = true
  try {
    await walletStore.createInitialWallets(bank, ewallet, cash)
    router.push('/dashboard')
  } catch (err) {
    submitError.value = err.message || 'Gagal menyimpan.'
  } finally {
    loading.value = false
  }
}
</script>
