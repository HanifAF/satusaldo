import type { LucideIcon } from "lucide-react";
import type { AccountType } from "@/lib/schemas/onboarding";

interface AccountTypeOptionProps {
  type: AccountType;
  label: string;
  icon: LucideIcon;
  isSelected: boolean;
  onSelect: (type: AccountType) => void;
}

export function AccountTypeOption({
  type,
  label,
  icon: Icon,
  isSelected,
  onSelect,
}: AccountTypeOptionProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(type)}
      aria-pressed={isSelected}
      className={`flex flex-1 flex-col items-center gap-2 rounded-2xl border-2 px-3 py-4 text-sm font-medium
                  transition-colors ${
                    isSelected
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200"
                  }`}
    >
      <Icon size={20} strokeWidth={2} />
      {label}
    </button>
  );
}
