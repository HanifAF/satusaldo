// Destinasi: lib/queries/accounts.ts (TIMPA isi yang lama, file ini sudah ada tapi kosong)
import { createClient } from "@/lib/supabase/server";

export async function getAccounts() {
  const supabase = await createClient();

  // Pakai view account_balances (dari schema SQL), BUKAN tabel accounts langsung —
  // supaya saldo selalu dihitung dari riwayat transaksi, sesuai PRD 9.2.
  const { data, error } = await supabase
    .from("account_balances")
    .select("*")
    .order("nama");

  if (error) {
    console.error("Gagal ambil data akun:", error.message);
    return [];
  }

  return data;
}
