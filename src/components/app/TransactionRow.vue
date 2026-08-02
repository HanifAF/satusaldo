<template>
  <div class="glass-card p-4 hover:shadow-[0_16px_48px_rgba(23,198,98,0.12)] transition-all duration-300">
    <div class="flex items-start gap-4">
      <div class="w-11 h-11 rounded-md flex items-center justify-center text-xl flex-shrink-0" :class="iconBg">
        {{ transaction.category?.icon || typeIcon }}
      </div>
      <div class="flex-1 min-w-0">
        <p class="font-jakarta font-semibold text-sm text-on-surface truncate">{{ transaction.category?.name || typeLabel }}</p>
        <p v-if="transaction.note" class="font-jakarta text-xs text-on-surface-secondary truncate mt-0.5">{{ transaction.note }}</p>
        <div class="flex items-center gap-2 mt-1">
          <span class="text-xs text-on-surface-secondary font-jakarta">{{ formatDate(transaction.date) }}</span>
          <span class="text-xs text-on-surface-secondary">·</span>
          <span class="text-xs font-jakarta" :class="walletColor">
            {{ walletStore.getWalletIcon(transaction.wallet?.type) }}
            {{ walletStore.getWalletLabel(transaction.wallet?.type) }}
          </span>
          <span v-if="transaction.type === 'transfer' && transaction.to_wallet" class="text-xs text-on-surface-secondary">
            → {{ walletStore.getWalletLabel(transaction.to_wallet?.type) }}
          </span>
        </div>
      </div>
      <div class="text-right flex-shrink-0">
        <p class="font-outfit font-bold text-sm currency" :class="amountColor">
          {{ amountPrefix }}{{ formatRupiah(transaction.amount) }}
        </p>
        <p v-if="transaction.admin_fee > 0" class="font-jakarta text-xs text-on-surface-secondary mt-0.5">
          + fee {{ formatRupiah(transaction.admin_fee) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useWalletStore } from '@/stores/wallet'
import { useFormatRupiah, useFormatDate } from '@/composables/useFormat'

const props = defineProps({ transaction: { type: Object, required: true } })

const walletStore = useWalletStore()
const { formatRupiah } = useFormatRupiah()
const { formatDate } = useFormatDate()

const typeIcon   = computed(() => ({ income: '💰', transfer: '🔄', expense: '💸' }[props.transaction.type] || '💸'))
const typeLabel  = computed(() => ({ income: 'Pemasukan', transfer: 'Transfer', expense: 'Pengeluaran' }[props.transaction.type] || 'Pengeluaran'))
const iconBg     = computed(() => ({ income: 'bg-primary/15', transfer: 'bg-blue-50', expense: 'bg-error/10' }[props.transaction.type]))
const amountColor= computed(() => ({ income: 'text-primary', transfer: 'text-blue-600', expense: 'text-error' }[props.transaction.type]))
const amountPrefix=computed(() => ({ income: '+', transfer: '', expense: '-' }[props.transaction.type]))
const walletColor = computed(() => ({ bank: 'text-blue-500', ewallet: 'text-purple-500', cash: 'text-amber-500' }[props.transaction.wallet?.type] || ''))
</script>
