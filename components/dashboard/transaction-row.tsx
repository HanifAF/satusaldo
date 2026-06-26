// Baris teks merah/hijau transaksi

import { formatSignedIDR, type Transaction } from "@/lib/queries/dashboard";

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(dateString));
}

export function TransactionRow({ transaction }: { transaction: Transaction }) {
  const isIncome = transaction.amount > 0;

  return (
    <tr>
      <td className="whitespace-nowrap py-3 pr-4 text-sm text-slate-500">
        {formatDate(transaction.date)}
      </td>
      <td className="py-3 pr-4 text-sm font-medium text-slate-900">
        {transaction.description}
      </td>
      <td className="py-3 pr-4 text-sm text-slate-500">
        {transaction.account}
      </td>
      <td className="py-3 pr-4">
        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
          {transaction.category}
        </span>
      </td>
      <td
        className={`whitespace-nowrap py-3 pl-4 text-right text-sm font-semibold ${
          isIncome ? "text-emerald-600" : "text-red-500"
        }`}
      >
        {formatSignedIDR(transaction.amount)}
      </td>
    </tr>
  );
}
