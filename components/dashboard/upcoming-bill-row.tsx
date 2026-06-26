//Baris satuan Netflix/Kos statis

"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { formatIDR, type UpcomingBill } from "@/lib/queries/dashboard";

const STATUS_BADGE_STYLES: Record<UpcomingBill["status"], string> = {
  overdue: "bg-red-50 text-red-600",
  due_today: "bg-yellow-50 text-yellow-700",
  upcoming: "",
};

export function UpcomingBillRow({ bill }: { bill: UpcomingBill }) {
  const [isPaid, setIsPaid] = useState(false);

  return (
    <div className="flex items-center justify-between gap-3 py-3.5">
      <div className={isPaid ? "opacity-50" : ""}>
        <p className="text-sm font-medium text-slate-900">{bill.name}</p>
        <p className="text-xs text-slate-500">{bill.account}</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p
            className={`text-sm font-semibold text-slate-900 ${isPaid ? "opacity-50" : ""}`}
          >
            {formatIDR(bill.amount)}
          </p>

          {bill.status === "upcoming" ? (
            <p className="text-xs text-slate-400">{bill.dueLabel}</p>
          ) : (
            <span
              className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase
                          tracking-wide ${STATUS_BADGE_STYLES[bill.status]}`}
            >
              {bill.dueLabel}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsPaid(true)}
          disabled={isPaid}
          className="inline-flex shrink-0 items-center gap-1 rounded-full border border-slate-200
                     px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors
                     hover:border-emerald-300 hover:text-emerald-700
                     disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Check size={14} strokeWidth={2.5} />
          {isPaid ? "Lunas" : "Tandai lunas"}
        </button>
      </div>
    </div>
  );
}
