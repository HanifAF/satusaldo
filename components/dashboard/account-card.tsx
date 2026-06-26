// Baris satuan Dompet

import { Banknote, Landmark, Smartphone, type LucideIcon } from "lucide-react";
import {
  formatIDR,
  type Account,
  type AccountProvider,
} from "@/lib/queries/dashboard";

const PROVIDER_STYLES: Record<
  AccountProvider,
  { bg: string; text: string; icon: LucideIcon }
> = {
  BCA: { bg: "bg-blue-50", text: "text-blue-600", icon: Banknote },
  Gopay: { bg: "bg-green-50", text: "text-green-600", icon: Smartphone },
  Mandiri: { bg: "bg-yellow-50", text: "text-cyan-600", icon: Landmark },
  Tunai: { bg: "bg-slate-200/70", text: "text-amber-600", icon: Banknote },
};

export function AccountCard({ account }: { account: Account }) {
  const style = PROVIDER_STYLES[account.provider];
  const Icon = style.icon;

  return (
    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3.5 transition-colors hover:bg-slate-100">
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${style.bg} ${style.text}`}
      >
        <Icon size={18} strokeWidth={2} />
      </span>
      <div className="flex-1">
        <p className="text-sm font-medium text-slate-900">{account.name}</p>
        <p className="text-base font-semibold text-slate-900">
          {formatIDR(account.balance)}
        </p>
      </div>
    </div>
  );
}
