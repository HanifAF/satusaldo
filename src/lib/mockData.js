/**
 * MOCK DATA — Dummy database untuk preview UI
 * Semua data ini akan diganti dengan Supabase setelah UI selesai
 */

export const MOCK_USER = {
  id: 'mock-user-001',
  email: 'hanifahlulfikri@gmail.com',
  user_metadata: {
    full_name: 'Hanifah Lulfikri',
    avatar_url: null,
  }
}

export const MOCK_WALLETS = [
  { id: 'wallet-bank', user_id: 'mock-user-001', type: 'bank',    balance: 8_500_000 },
  { id: 'wallet-ew',   user_id: 'mock-user-001', type: 'ewallet', balance: 2_250_000 },
  { id: 'wallet-cash', user_id: 'mock-user-001', type: 'cash',    balance: 750_000   },
]

export const MOCK_CATEGORIES = [
  // Expense
  { id: 'cat-01', user_id: null, name: 'Makanan & Minuman', icon: '', type: 'expense' },
  { id: 'cat-02', user_id: null, name: 'Transport',         icon: '', type: 'expense' },
  { id: 'cat-03', user_id: null, name: 'Belanja',           icon: '', type: 'expense' },
  { id: 'cat-04', user_id: null, name: 'Kesehatan',         icon: '', type: 'expense' },
  { id: 'cat-05', user_id: null, name: 'Hiburan',           icon: '', type: 'expense' },
  { id: 'cat-06', user_id: null, name: 'Tagihan',           icon: '', type: 'expense' },
  { id: 'cat-07', user_id: null, name: 'Pendidikan',        icon: '', type: 'expense' },
  { id: 'cat-08', user_id: null, name: 'Biaya Admin',       icon: '', type: 'expense' },
  { id: 'cat-09', user_id: null, name: 'Lainnya',           icon: '', type: 'expense' },
  // Income
  { id: 'cat-10', user_id: null, name: 'Gaji',              icon: '', type: 'income' },
  { id: 'cat-11', user_id: null, name: 'Freelance',         icon: '', type: 'income' },
  { id: 'cat-12', user_id: null, name: 'Bonus',             icon: '', type: 'income' },
  { id: 'cat-13', user_id: null, name: 'Transfer Masuk',    icon: '', type: 'income' },
  { id: 'cat-14', user_id: null, name: 'Lainnya',           icon: '', type: 'income' },
]

export const MOCK_TRANSACTIONS = [
  {
    id: 'tx-01', user_id: 'mock-user-001', wallet_id: 'wallet-ew', to_wallet_id: null,
    type: 'expense', amount: 54_000, admin_fee: 0,
    category: { id: 'cat-01', name: 'Makanan & Minuman', icon: '' },
    note: 'Makan siang bersama tim', date: '2026-08-07', time: '20:14 WIB',
    wallet: { id: 'wallet-ew', type: 'ewallet' },
  },
  {
    id: 'tx-02', user_id: 'mock-user-001', wallet_id: 'wallet-bank', to_wallet_id: null,
    type: 'income', amount: 8_500_000, admin_fee: 0,
    category: { id: 'cat-10', name: 'Gaji', icon: '' },
    note: 'Gaji bulan Agustus', date: '2026-08-07', time: '09:00 WIB',
    wallet: { id: 'wallet-bank', type: 'bank' },
  },
  {
    id: 'tx-03', user_id: 'mock-user-001', wallet_id: 'wallet-cash', to_wallet_id: null,
    type: 'expense', amount: 25_000, admin_fee: 0,
    category: { id: 'cat-02', name: 'Transport', icon: '' },
    note: 'Perjalanan ke kantor', date: '2026-08-07', time: '08:15 WIB',
    wallet: { id: 'wallet-cash', type: 'cash' },
  },
  {
    id: 'tx-04', user_id: 'mock-user-001', wallet_id: 'wallet-ew', to_wallet_id: null,
    type: 'expense', amount: 156_000, admin_fee: 0,
    category: { id: 'cat-03', name: 'Belanja', icon: '' },
    note: 'Belanja kebutuhan mingguan', date: '2026-08-07', time: '16:30 WIB',
    wallet: { id: 'wallet-ew', type: 'ewallet' },
  },
  {
    id: 'tx-05', user_id: 'mock-user-001', wallet_id: 'wallet-bank', to_wallet_id: 'wallet-cash',
    type: 'transfer', amount: 300_000, admin_fee: 0,
    category: null, note: 'Tarik tunai ATM', date: '2026-08-06', time: '14:20 WIB',
    wallet: { id: 'wallet-bank', type: 'bank' },
    to_wallet: { id: 'wallet-cash', type: 'cash' },
  },
  {
    id: 'tx-05b', user_id: 'mock-user-001', wallet_id: 'wallet-bank', to_wallet_id: 'wallet-ew',
    type: 'transfer', amount: 200_000, admin_fee: 1_000,
    category: null, note: 'Top up E-Wallet', date: '2026-08-06', time: '11:15 WIB',
    wallet: { id: 'wallet-bank', type: 'bank' },
    to_wallet: { id: 'wallet-ew', type: 'ewallet' },
  },
  {
    id: 'tx-06', user_id: 'mock-user-001', wallet_id: 'wallet-ew', to_wallet_id: null,
    type: 'expense', amount: 54_000, admin_fee: 0,
    category: { id: 'cat-05', name: 'Hiburan', icon: '' },
    note: 'Netflix bulan Agustus', date: '2026-08-06', time: '19:00 WIB',
    wallet: { id: 'wallet-ew', type: 'ewallet' },
  },
  {
    id: 'tx-07', user_id: 'mock-user-001', wallet_id: 'wallet-bank', to_wallet_id: null,
    type: 'expense', amount: 1_200_000, admin_fee: 0,
    category: { id: 'cat-06', name: 'Tagihan', icon: '' },
    note: 'Bayar kos bulan Agustus', date: '2026-08-05', time: '10:00 WIB',
    wallet: { id: 'wallet-bank', type: 'bank' },
  },
  {
    id: 'tx-08', user_id: 'mock-user-001', wallet_id: 'wallet-cash', to_wallet_id: null,
    type: 'expense', amount: 15_000, admin_fee: 0,
    category: { id: 'cat-02', name: 'Transport', icon: '' },
    note: 'Parkir motor', date: '2026-08-05', time: '12:30 WIB',
    wallet: { id: 'wallet-cash', type: 'cash' },
  },
]

export const MOCK_BILLS = [
  { id: 'bill-01', user_id: 'mock-user-001', name: 'Kos Bulanan',   amount: 1_200_000, due_day: 1,  wallet_id: 'wallet-bank', is_active: true,  wallet: { id: 'wallet-bank', type: 'bank' } },
  { id: 'bill-02', user_id: 'mock-user-001', name: 'Netflix',       amount: 54_000,    due_day: 3,  wallet_id: 'wallet-ew',   is_active: true,  wallet: { id: 'wallet-ew',   type: 'ewallet' } },
  { id: 'bill-03', user_id: 'mock-user-001', name: 'Kuota Internet', amount: 120_000,  due_day: 5,  wallet_id: 'wallet-ew',   is_active: true,  wallet: { id: 'wallet-ew',   type: 'ewallet' } },
  { id: 'bill-04', user_id: 'mock-user-001', name: 'Spotify',       amount: 54_990,    due_day: 15, wallet_id: 'wallet-ew',   is_active: true,  wallet: { id: 'wallet-ew',   type: 'ewallet' } },
  { id: 'bill-05', user_id: 'mock-user-001', name: 'Listrik PLN',   amount: 350_000,   due_day: 20, wallet_id: 'wallet-bank', is_active: false, wallet: { id: 'wallet-bank', type: 'bank' } },
]

export const MOCK_DEBTS = [
  {
    id: 'debt-01', user_id: 'mock-user-001', wallet_id: 'wallet-bank',
    direction: 'owe', person_name: 'Budi Santoso',
    original_amount: 500_000, remaining_amount: 500_000,
    note: 'Pinjam buat bayar listrik', due_date: '2025-08-15', is_settled: false,
    wallet: { id: 'wallet-bank', type: 'bank' },
  },
  {
    id: 'debt-02', user_id: 'mock-user-001', wallet_id: 'wallet-bank',
    direction: 'lend', person_name: 'Rina Dewi',
    original_amount: 750_000, remaining_amount: 250_000,
    note: 'Pinjam buat beli buku', due_date: '2025-08-01', is_settled: false,
    wallet: { id: 'wallet-bank', type: 'bank' },
  },
  {
    id: 'debt-03', user_id: 'mock-user-001', wallet_id: 'wallet-cash',
    direction: 'lend', person_name: 'Tono Wijaya',
    original_amount: 200_000, remaining_amount: 0,
    note: 'Jajan bareng', due_date: null, is_settled: true,
    wallet: { id: 'wallet-cash', type: 'cash' },
  },
]
