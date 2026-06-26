import { Banknote, Landmark, Wallet, type LucideIcon } from "lucide-react";
import { formatIDR } from "@/lib/queries/dashboard";
import type { AccountType, OnboardingAccount } from "@/lib/schemas/onboarding";

const TYPE_STYLES: Record<
  AccountType,
  { bg: string; text: string; icon: LucideIcon; label: string }
> = {
  bank: {
    bg: "bg-blue-50",
    text: "text-blue-600",
    icon: Landmark,
    label: "Bank",
  },
  ewallet: {
    bg: "bg-green-50",
    text: "text-green-600",
    icon: Wallet,
    label: "E-Wallet",
  },
  cash: {
    bg: "bg-slate-200/70",
    text: "text-slate-600",
    icon: Banknote,
    label: "Tunai",
  },
};

export function AddedAccountRow({ account }: { account: OnboardingAccount }) {
  const style = TYPE_STYLES[account.type];
  const Icon = style.icon;

  return (
    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3.5">
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${style.bg} ${style.text}`}
      >
        <Icon size={18} strokeWidth={2} />
      </span>
      <div className="flex-1">
        <p className="text-sm font-medium text-slate-900">{account.name}</p>
        <p className="text-xs text-slate-400">{style.label}</p>
      </div>
      <p className="text-sm font-semibold text-slate-900">
        {formatIDR(account.balance)}
      </p>
    </div>
  );
}
