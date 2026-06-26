//Wadah tagihan dan pembayaran mendatang

import Link from "next/link";
import { UpcomingBillRow } from "@/components/dashboard/upcoming-bill-row";
import type { UpcomingBill } from "@/lib/queries/dashboard";

export function UpcomingBillsCard({ bills }: { bills: UpcomingBill[] }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm shadow-slate-900/5">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900">
          Tagihan &amp; Pembayaran Mendatang
        </h2>
        <Link
          href="/dashboard/tagihan"
          className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
        >
          Lihat Semua
        </Link>
      </div>

      <div className="mt-2 flex flex-col divide-y divide-slate-100">
        {bills.map((bill) => (
          <UpcomingBillRow key={bill.id} bill={bill} />
        ))}
      </div>
    </div>
  );
}
