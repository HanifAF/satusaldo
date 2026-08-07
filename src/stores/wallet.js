import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { MOCK_WALLETS } from '@/lib/mockData'

export const useWalletStore = defineStore('wallet', () => {
  const wallets = ref(JSON.parse(JSON.stringify(MOCK_WALLETS)))
  const loading = ref(false)
  const balanceHidden = ref(false)

  const totalBalance  = computed(() => wallets.value.reduce((s, w) => s + (w.balance || 0), 0))
  const bankWallet    = computed(() => wallets.value.find(w => w.type === 'bank'))
  const ewalletWallet = computed(() => wallets.value.find(w => w.type === 'ewallet'))
  const cashWallet    = computed(() => wallets.value.find(w => w.type === 'cash'))

  function toggleBalance() { balanceHidden.value = !balanceHidden.value }

  async function fetchWallets() {
    loading.value = true
    await new Promise(r => setTimeout(r, 300))
    wallets.value = JSON.parse(JSON.stringify(MOCK_WALLETS))
    loading.value = false
  }

  async function createInitialWallets(bankBalance, ewalletBalance, cashBalance) {
    wallets.value = [
      { id: 'wallet-bank', type: 'bank',    balance: bankBalance    },
      { id: 'wallet-ew',   type: 'ewallet', balance: ewalletBalance },
      { id: 'wallet-cash', type: 'cash',    balance: cashBalance    },
    ]
    return wallets.value
  }

  async function updateBalance(walletId, newBalance) {
    const w = wallets.value.find(w => w.id === walletId)
    if (w) w.balance = newBalance
  }

  function getWalletById(id)    { return wallets.value.find(w => w.id === id) }
  function getWalletLabel(type) { return { bank: 'Bank', ewallet: 'E-Wallet', cash: 'Tunai' }[type] || type }
  function getWalletIcon(type)  { return '' }
  function getWalletColor(type) {
    return {
      bank:    'from-blue-400 to-blue-600',
      ewallet: 'from-purple-400 to-purple-600',
      cash:    'from-amber-400 to-amber-600',
    }[type] || 'from-primary to-primary'
  }

  return {
    wallets, loading, balanceHidden, totalBalance, bankWallet, ewalletWallet, cashWallet,
    toggleBalance, fetchWallets, createInitialWallets, updateBalance,
    getWalletById, getWalletLabel, getWalletIcon, getWalletColor,
  }
})
