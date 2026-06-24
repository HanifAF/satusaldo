// Destinasi: lib/actions/create-account.ts — FILE BARU, belum ada di project kamu.
// Cara buat: klik kanan folder "actions" di Explorer → New File → ketik nama "create-account.ts"
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createAccount(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const nama = formData.get("nama") as string;
  const tipe = formData.get("tipe") as string;
  const saldoAwal = Number(formData.get("saldo_awal"));

  const { data: account, error } = await supabase
    .from("accounts")
    .insert({ user_id: user.id, nama, tipe })
    .select()
    .single();

  if (error || !account) {
    console.error("Gagal membuat akun:", error?.message);
    return;
  }

  // Saldo awal dicatat sebagai transaksi tipe 'adjustment' (PRD 5.4 & 9.2) —
  // BUKAN field statis — supaya saldo akun selalu bisa dihitung ulang dari riwayat transaksi.
  if (saldoAwal !== 0) {
    await supabase.from("transactions").insert({
      user_id: user.id,
      tipe: "adjustment",
      account_id: account.id,
      nominal: saldoAwal,
      catatan: "Saldo awal",
    });
  }

  revalidatePath("/dashboard");
}
