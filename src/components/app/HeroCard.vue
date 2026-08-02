<template>
  <div class="hero-card p-6 relative overflow-hidden">
    <div class="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/15 pointer-events-none" />
    <div class="absolute -bottom-6 -left-6 w-28 h-28 rounded-full bg-white/10 pointer-events-none" />

    <div class="flex items-center justify-between mb-3 relative z-10">
      <p class="font-jakarta text-sm font-medium text-on-surface/70">Total Saldo</p>
      <button @click="walletStore.toggleBalance()" class="p-1.5 rounded-full hover:bg-white/20 transition-colors">
        <svg v-if="!walletStore.balanceHidden" class="w-5 h-5 text-on-surface/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <svg v-else class="w-5 h-5 text-on-surface/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        </svg>
      </button>
    </div>

    <div class="relative z-10 mb-4">
      <span class="font-outfit font-extrabold text-4xl text-on-surface currency tracking-tight" :class="{ 'balance-hidden': walletStore.balanceHidden }">
        {{ walletStore.balanceHidden ? '••••••' : formatRupiah(walletStore.totalBalance) }}
      </span>
    </div>

    <div class="relative z-10 grid grid-cols-3 gap-3">
      <div v-for="wallet in wallets" :key="wallet.type" class="bg-white/20 rounded-md p-3">
        <div class="text-lg mb-1">{{ walletStore.getWalletIcon(wallet.type) }}</div>
        <p class="font-jakarta text-xs text-on-surface/60 mb-0.5">{{ walletStore.getWalletLabel(wallet.type) }}</p>
        <p class="font-outfit font-bold text-sm text-on-surface currency" :class="{ 'balance-hidden': walletStore.balanceHidden }">
          {{ walletStore.balanceHidden ? '•••' : formatCompact(wallet.balance) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useWalletStore } from '@/stores/wallet'
import { useFormatRupiah } from '@/composables/useFormat'

const walletStore = useWalletStore()
const { formatRupiah } = useFormatRupiah()

function formatCompact(amount) {
  if (amount >= 1_000_000) return `Rp ${(amount / 1_000_000).toFixed(1)}jt`
  if (amount >= 1_000) return `Rp ${(amount / 1_000).toFixed(0)}rb`
  return `Rp ${amount}`
}

const wallets = computed(() =>
  [walletStore.bankWallet, walletStore.ewalletWallet, walletStore.cashWallet].filter(Boolean)
)
</script>
