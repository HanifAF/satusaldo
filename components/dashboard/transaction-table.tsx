//Wadah tabel riwayat

import { TransactionRow } from "@/components/dashboard/transaction-row";
import type { Transaction } from "@/lib/queries/dashboard";

export function TransactionTable({
  transactions,
}: {
  transactions: Transaction[];
}) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm shadow-slate-900/5">
      <h2 className="text-base font-semibold text-slate-900">
        Transaksi Terbaru
      </h2>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="text-xs font-medium uppercase tracking-wide text-slate-400">
              <th scope="col" className="py-2 pr-4 font-medium">
                Tanggal
              </th>
              <th scope="col" className="py-2 pr-4 font-medium">
                Deskripsi
              </th>
              <th scope="col" className="py-2 pr-4 font-medium">
                Akun
              </th>
              <th scope="col" className="py-2 pr-4 font-medium">
                Kategori
              </th>
              <th scope="col" className="py-2 pl-4 text-right font-medium">
                Jumlah
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transactions.map((transaction) => (
              <TransactionRow key={transaction.id} transaction={transaction} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
