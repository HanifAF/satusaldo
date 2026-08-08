<template>
  <div class="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors flex items-center justify-between gap-3 sm:gap-4">
    <!-- Left: Circle Icon & Category Info -->
    <div class="flex items-center gap-3.5 min-w-0 flex-1">
      <!-- Circular Pastel Category Icon -->
      <div
        class="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center flex-shrink-0"
        :class="categoryStyle.bg"
      >
        <component :is="categoryStyle.iconComponent" class="w-4 h-4 sm:w-5 sm:h-5" />
      </div>

      <!-- Text Details -->
      <div class="min-w-0 flex-1">
        <!-- Title & Type Badge -->
        <div class="flex items-center gap-2 flex-wrap">
          <h4 class="font-jakarta font-bold text-xs sm:text-sm text-gray-900 truncate">
            {{ displayTitle }}
          </h4>

          <!-- Type Badge -->
          <span
            class="text-[10px] sm:text-[11px] font-jakarta font-medium px-2 py-0.5 rounded-md flex-shrink-0"
            :class="typeBadgeStyle"
          >
            {{ typeLabel }}
          </span>
        </div>

        <!-- Subtitle: Note & Time in a single spacious line -->
        <p class="font-jakarta text-xs text-gray-500 font-normal truncate mt-1 flex items-center gap-1.5 flex-wrap">
          <span v-if="transaction.note" class="truncate text-gray-600">{{ transaction.note }}</span>
          <span v-if="transaction.note && (transaction.time || showDate)" class="text-gray-300 flex-shrink-0">•</span>
          <span v-if="transaction.time || showDate" class="text-gray-400 flex-shrink-0 text-[11px]">
            {{ transaction.time || formatDate(transaction.date) }}
          </span>
        </p>
      </div>
    </div>

    <!-- Middle: Wallet Badge(s) -->
    <div class="hidden md:flex items-center justify-center flex-shrink-0 px-2">
      <!-- Single Wallet -->
      <div
        v-if="transaction.type !== 'transfer'"
        class="inline-flex items-center gap-1.5 text-xs font-jakarta font-medium px-2.5 py-1 rounded-full border"
        :class="getWalletBadgeStyle(transaction.wallet?.type || transaction.wallet_type)"
      >
        <component :is="walletIcon(transaction.wallet?.type || transaction.wallet_type)" class="w-3.5 h-3.5 opacity-80" />
        <span>{{ sourceWalletName }}</span>
      </div>

      <!-- Transfer From -> To Wallet -->
      <div
        v-else
        class="inline-flex items-center gap-1.5 text-xs font-jakarta font-medium"
      >
        <div
          class="inline-flex items-center gap-1.5 text-xs font-jakarta font-medium px-2.5 py-1 rounded-full border"
          :class="getWalletBadgeStyle(transaction.wallet?.type || transaction.wallet_type)"
        >
          <component :is="walletIcon(transaction.wallet?.type || transaction.wallet_type)" class="w-3.5 h-3.5 opacity-80" />
          <span>{{ sourceWalletName }}</span>
        </div>
        <span class="text-gray-400 text-xs px-0.5">→</span>
        <div
          class="inline-flex items-center gap-1.5 text-xs font-jakarta font-medium px-2.5 py-1 rounded-full border"
          :class="getWalletBadgeStyle(transaction.to_wallet?.type || transaction.to_wallet_type)"
        >
          <component :is="walletIcon(transaction.to_wallet?.type || transaction.to_wallet_type)" class="w-3.5 h-3.5 opacity-80" />
          <span>{{ targetWalletName }}</span>
        </div>
      </div>
    </div>

    <!-- Right: Nominal Amount & Fee -->
    <div class="text-right flex-shrink-0 pl-2">
      <!-- Mobile Wallet Badge fallback -->
      <div class="md:hidden mb-1 flex justify-end">
        <span class="inline-flex items-center text-[10px] px-2 py-0.5 rounded-full border" :class="getWalletBadgeStyle(transaction.wallet?.type || transaction.wallet_type)">
          {{ sourceWalletName }}
        </span>
      </div>

      <p
        class="font-jakarta font-bold text-xs sm:text-sm md:text-base tracking-tight whitespace-nowrap"
        :class="amountColor"
      >
        {{ amountPrefix }}{{ formatRupiah(transaction.amount) }}
      </p>

      <!-- Fee (always rendered for transfer transactions) -->
      <p
        v-if="transaction.type === 'transfer'"
        class="font-jakarta text-[11px] text-gray-400 font-normal mt-0.5 whitespace-nowrap"
      >
        Fee : {{ (transaction.admin_fee || 0) > 0 ? formatRupiah(transaction.admin_fee) : '0' }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed, h } from 'vue'
import { useWalletStore } from '@/stores/wallet'
import { useFormatRupiah, useFormatDate } from '@/composables/useFormat'

const props = defineProps({
  transaction: { type: Object, required: true },
  showDate: { type: Boolean, default: false },
})

const walletStore = useWalletStore()
const { formatRupiah } = useFormatRupiah()
const { formatDate } = useFormatDate()

// 1. Title
const displayTitle = computed(() => {
  if (props.transaction.type === 'transfer') {
    return 'Transfer Saldo'
  }
  return props.transaction.category?.name || (props.transaction.type === 'income' ? 'Pemasukan' : 'Pengeluaran')
})

// 2. Source & Target Wallet Labels
const sourceWalletName = computed(() => {
  const type = props.transaction.wallet?.type || props.transaction.wallet_type
  return walletStore.getWalletLabel(type) || 'Dompet'
})

const targetWalletName = computed(() => {
  const type = props.transaction.to_wallet?.type || props.transaction.to_wallet_type
  return walletStore.getWalletLabel(type) || ''
})

function getWalletBadgeStyle(type) {
  // Neutral / monochrome palette for payment sources to avoid competing with category colors
  if (type === 'bank') return 'bg-slate-100/90 text-slate-700 border-slate-200/90'
  if (type === 'ewallet') return 'bg-gray-100/90 text-gray-700 border-gray-200/90'
  if (type === 'cash') return 'bg-zinc-100/90 text-zinc-700 border-zinc-200/90'
  return 'bg-gray-100 text-gray-600 border-gray-200'
}

function walletIcon(type) {
  if (type === 'bank') {
    return () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }, [
      h('path', { d: 'M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3' }),
    ])
  }
  if (type === 'ewallet') {
    return () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }, [
      h('rect', { x: '2', y: '5', width: '20', height: '14', rx: '2' }),
      h('line', { x1: '2', y1: '10', x2: '22', y2: '10' }),
    ])
  }
  return () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }, [
    h('rect', { x: '2', y: '6', width: '20', height: '12', rx: '2' }),
    h('circle', { cx: '12', cy: '12', r: '2' }),
  ])
}

// 3. Type Label & Type Badge Styles
const typeLabel = computed(() => {
  if (props.transaction.type === 'income') return 'Pemasukan'
  if (props.transaction.type === 'transfer') return 'Transfer'
  return 'Pengeluaran'
})

const typeBadgeStyle = computed(() => {
  if (props.transaction.type === 'income') {
    return 'bg-emerald-50 text-emerald-600'
  }
  if (props.transaction.type === 'transfer') {
    return 'bg-blue-50 text-blue-600'
  }
  return 'bg-rose-50 text-rose-600'
})

// 4. Amount Styling
const amountColor = computed(() => {
  if (props.transaction.type === 'income') return 'text-emerald-600'
  if (props.transaction.type === 'transfer') return 'text-blue-600'
  return 'text-rose-600'
})

const amountPrefix = computed(() => {
  if (props.transaction.type === 'income') return '+'
  if (props.transaction.type === 'transfer') return ''
  return '-'
})

// 5. Category Icons
const categoryStyle = computed(() => {
  const type = props.transaction.type
  const catName = (props.transaction.category?.name || '').toLowerCase()
  const note = (props.transaction.note || '').toLowerCase()

  if (type === 'transfer' || note.includes('transfer') || note.includes('top up') || note.includes('tarik tunai')) {
    return {
      bg: 'bg-blue-50 text-blue-500',
      iconComponent: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2.2', strokeLinecap: 'round', strokeLinejoin: 'round' }, [
        h('polyline', { points: '17 1 21 5 17 9' }),
        h('path', { d: 'M3 5h18' }),
        h('polyline', { points: '7 23 3 19 7 15' }),
        h('path', { d: 'M21 19H3' }),
      ]),
    }
  }

  // Makanan & Minuman (Blue)
  if (catName.includes('makan') || catName.includes('minum') || note.includes('makan') || note.includes('boba') || note.includes('kopi')) {
    return {
      bg: 'bg-blue-50 text-blue-500',
      iconComponent: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }, [
        h('path', { d: 'M18 2v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2' }),
        h('path', { d: 'M15 11v11' }),
        h('path', { d: 'M6 2v10a3 3 0 0 0 6 0V2' }),
        h('path', { d: 'M9 12v10' }),
      ]),
    }
  }

  // Gaji
  if (catName.includes('gaji') || note.includes('gaji') || note.includes('salary')) {
    return {
      bg: 'bg-emerald-50 text-emerald-600',
      iconComponent: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }, [
        h('rect', { x: '2', y: '6', width: '20', height: '12', rx: '2' }),
        h('circle', { cx: '12', cy: '12', r: '2' }),
        h('path', { d: 'M6 12h.01M18 12h.01' }),
      ]),
    }
  }

  // Transport (Cyan / Teal - distinct from Belanja amber)
  if (catName.includes('transport') || note.includes('goride') || note.includes('gocar') || note.includes('parkir') || note.includes('bensin') || note.includes('kantor')) {
    return {
      bg: 'bg-cyan-50 text-cyan-600',
      iconComponent: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }, [
        h('rect', { x: '4', y: '3', width: '16', height: '16', rx: '2' }),
        h('path', { d: 'M4 11h16M12 3v8' }),
        h('path', { d: 'm8 19-2 3M18 22l-2-3' }),
        h('circle', { cx: '8', cy: '15', r: '1' }),
        h('circle', { cx: '16', cy: '15', r: '1' }),
      ]),
    }
  }

  // Hiburan
  if (catName.includes('hiburan') || note.includes('netflix') || note.includes('spotify') || note.includes('game') || note.includes('bioskop')) {
    return {
      bg: 'bg-purple-50 text-purple-500',
      iconComponent: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }, [
        h('polygon', { points: '6 3 20 12 6 21 6 3' }),
      ]),
    }
  }

  // Tagihan
  if (catName.includes('tagihan') || note.includes('kos') || note.includes('listrik') || note.includes('wifi') || note.includes('pulsa')) {
    return {
      bg: 'bg-amber-50 text-amber-600',
      iconComponent: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }, [
        h('path', { d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' }),
        h('polyline', { points: '14 2 14 8 20 8' }),
        h('line', { x1: '16', y1: '13', x2: '8', y2: '13' }),
        h('line', { x1: '16', y1: '17', x2: '8', y2: '17' }),
      ]),
    }
  }

  // Belanja
  if (catName.includes('belanja') || note.includes('shopee') || note.includes('tokopedia') || note.includes('mingguan')) {
    return {
      bg: 'bg-pink-50 text-pink-500',
      iconComponent: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }, [
        h('path', { d: 'M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z' }),
        h('line', { x1: '3', y1: '6', x2: '21', y2: '6' }),
        h('path', { d: 'M16 10a4 4 0 0 1-8 0' }),
      ]),
    }
  }

  // Kesehatan
  if (catName.includes('sehat') || note.includes('obat') || note.includes('dokter') || note.includes('vitamin')) {
    return {
      bg: 'bg-red-50 text-red-500',
      iconComponent: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }, [
        h('path', { d: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z' }),
      ]),
    }
  }

  // Pendidikan
  if (catName.includes('didik') || note.includes('buku') || note.includes('kursus') || note.includes('spp')) {
    return {
      bg: 'bg-teal-50 text-teal-600',
      iconComponent: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }, [
        h('path', { d: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20' }),
        h('path', { d: 'M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z' }),
      ]),
    }
  }

  // Freelance
  if (catName.includes('freelance') || note.includes('proyek') || note.includes('client')) {
    return {
      bg: 'bg-violet-50 text-violet-600',
      iconComponent: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }, [
        h('rect', { x: '2', y: '7', width: '20', height: '14', rx: '2', ry: '2' }),
        h('path', { d: 'M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16' }),
      ]),
    }
  }

  // Bonus
  if (catName.includes('bonus') || note.includes('bonus') || note.includes('thr')) {
    return {
      bg: 'bg-yellow-50 text-yellow-600',
      iconComponent: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }, [
        h('polygon', { points: '12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2' }),
      ]),
    }
  }

  // Default Fallback
  if (type === 'income') {
    return {
      bg: 'bg-emerald-50 text-emerald-600',
      iconComponent: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }, [
        h('path', { d: 'M19 14l-7 7m0 0l-7-7m7 7V3' }),
      ]),
    }
  }

  return {
    bg: 'bg-rose-50 text-rose-500',
    iconComponent: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }, [
      h('path', { d: 'M5 10l7-7m0 0l7 7m-7-7v18' }),
    ]),
  }
})
</script>
