/**
 * akses data untuk dashboard SatuSaldo
 * fungsi-fungsi ini mengikuti bentuk query pada supabase yang sebenarnya
 * (lihat komentar diatas setiap fungsi) tetapi saat ini mengembalikan data tiruan/mock data
 * sehingga dashboard langsung ditampilkan tanpa menunggu koneksi ke supabase
 *
 * untik menghubungkan ke backend, cukup ganti return mock data dengan query supabase yang sesuai
 * tidak diperlukan perubahan pada "page.tsx" atau komponen visual lainnya.
 */

//import { createClient } from "@supabase/supabase/server";

// -----------------------------------------
// Types
// -----------------------------------------

export type AccountProvider = "BCA" | "Gopay" | "Mandiri" | "Tunai";

export interface Account {
  id: string;
  name: string;
  provider: AccountProvider;
  balance: number;
}

export interface Transaction {
  id: string;
  account: string;
  date: string;
  description: string;
  amount: number;
  category: string;
}

export type BillStatus = "overdue" | "due_today" | "upcoming";

export interface UpcomingBill {
  id: string;
  name: string;
  amount: number;
  account: string;
  status: BillStatus;

  /** label yang telah diformat sebelumnya, mis "terlambat 1 Hari" atau "3 Hari lagi" */
  dueLabel: string;
}

export interface NetWorth {
  total: number;
  asOfLabel: string;
}

/** Format angka sebagai Rupiah  tanpa tanda titik. misal 42000000 -> "Rp 42.000.000" */

export function formatIDR(amount: number): string {
  return `Rp ${Math.abs(Math.round(amount)).toLocaleString("id-ID")}`;
}

/** Format angka sebagai Rupiah  tanpa tanda titik. misal 45000 -> "Rp 45.000" */

export function formatSignedIDR(amount: number): string {
  const sign = amount < 0 ? "-" : "+";
  return `${sign} ${formatIDR(amount)}`;
}

/** Mengambil data net worth (total aset) pengguna
 * supabase pattern:
 * const supabase = createClient();
 * const {data} = await supabase
 *  .from("accounts")
 *  .select("balance")
 *  .eq("user_id", userId)
 *  const total = data?.reduce((sum, a) => sum + a.balance, 0) ?? 0;
 */

export async function getNetWorth(): Promise<NetWorth> {
  // mock data
  return {
    total: 42_000_000,
    asOfLabel: "per 1 Juni 2026 - Semua Dompet",
  };
}

/** Mengambil semua akun (bank,dompet ewallet dan tunai) milik pengguna
 * supabase pattern:
 * const supabase = createClient();
 * const {data} = await supabase
 *  .from("accounts")
 *  .select("id,name,provider,balance")
 *  .eq("user_id", userId)
 *  .order("created_at",{ ascending: true });
 */

export async function getAccounts(): Promise<Account[]> {
  // mock data
  return [
    { id: "acc-bca", name: " BCA", provider: "BCA", balance: 20_000_000 },
    { id: "acc-gopay", name: "Gopay", provider: "Gopay", balance: 15_000_000 },
    {
      id: "acc-mandiri",
      name: "Mandiri",
      provider: "Mandiri",
      balance: 5_000_000,
    },
    { id: "acc-tunai", name: "Tunai", provider: "Tunai", balance: 2_000_000 },
  ];
}

/** Mengambil riwayat transaksi terbaru milik pengguna
 * supabase pattern:
 * const supabase = createClient();
 * const {data} = await supabase
 *  .from("transactions")
 *  .select("id,date,description,account:account(name),category,amount")
 *  .eq("user_id", userId)
 *  .order("date",{ ascending: false });
 * .limit(10);
 */

export async function getRecentTransactions(): Promise<Transaction[]> {
  // mock data
  return [
    {
      id: "txn-1",
      account: "BCA",
      date: "2026-06-01",
      description: "Gaji Bulanan",
      amount: 12_000_000,
      category: "Pendapatan",
    },
    {
      id: "txn-2",
      account: "Gopay",
      date: "2026-06-02",
      description: "Kopi Susu Cosan",
      amount: -25_000,
      category: "Makan & Minum",
    },
    {
      id: "txn-3",
      account: "Mandiri",
      date: "2026-06-03",
      description: "Belanja Bulanan",
      amount: -1_500_000,
      category: "Belanja",
    },
    {
      id: "txn-4",
      account: "Tunai",
      date: "2026-06-04",
      description: "Parkir",
      amount: -50_000,
      category: "Transportasi",
    },
  ];
}

/** Mengambil data tagihan yang akan datang milik pengguna
 * supabase pattern:
 * const supabase = createClient();
 * const {data} = await supabase
 *  .from("bills")
 *  .select("id,name,amount,account:account(name),status,due_date,status")
 *  .eq("user_id", userId)
 *  .order("due_date",{ ascending: true });
 */

export async function getUpcomingBills(): Promise<UpcomingBill[]> {
  // mock data
  return [
    {
      id: "bill-1",
      name: "Netflix",
      amount: 50_000,
      account: "BCA",
      status: "due_today",
      dueLabel: "Hari ini",
    },
    {
      id: "bill-2",
      name: "Internet Indihome",
      amount: 300_000,
      account: "Gopay",
      status: "upcoming",
      dueLabel: "3 Hari lagi",
    },
    {
      id: "bill-3",
      name: "Kost Bulanan",
      amount: 150_000,
      account: "Mandiri",
      status: "overdue",
      dueLabel: "Terlambat 1 Hari",
    },
  ];
}
