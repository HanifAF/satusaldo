//Banner hijau besar Rp42.000.000

import { formatIDR } from "@/lib/queries/dashboard";

interface NetWorthCardProps {
  total: number;
  asOfLabel: string;
}

export function NetWorthCard({ total, asOfLabel }: NetWorthCardProps) {
  return (
    <div
      className="relative flex h-full min-h-[180px] flex-col justify-between overflow-hidden rounded-3xl
                 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 p-6 text-white
                 shadow-lg shadow-emerald-900/20 sm:p-7"
    >
      {/* Soft decorative glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-12 h-44 w-44 rounded-full bg-white/10 blur-2xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-14 left-12 h-36 w-36 rounded-full bg-white/10 blur-2xl"
      />

      <p className="relative text-xs font-semibold uppercase tracking-[0.18em] text-emerald-50/80">
        Total Net Worth
      </p>

      <p className="relative mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
        {formatIDR(total)}
      </p>

      <p className="relative mt-4 text-sm text-emerald-50/80">{asOfLabel}</p>
    </div>
  );
}
