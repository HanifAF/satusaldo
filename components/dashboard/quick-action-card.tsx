//Kotak putih kiri atas (+ Tambah Transaksi)

import { Plus } from "lucide-react";

export function QuickActionCard() {
  return (
    <div className="flex h-full flex-col justify-between gap-5 rounded-3xl bg-white p-6 shadow-sm shadow-slate-900/5">
      <div>
        <h2 className="text-base font-semibold text-slate-900">Aksi Cepat</h2>
        <p className="mt-1 text-sm leading-relaxed text-slate-500">
          Catat Pengeluaranmu Sekarang
        </p>
      </div>

      <button
        type="button"
        className="inline-flex items-center justify-center gap-1.5 self-start rounded-full
                   bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-teal-900/10
                   transition-colors hover:bg-teal-700"
      >
        <Plus size={16} strokeWidth={2.5} />
        Tambah Transaksi
      </button>
    </div>
  );
}
