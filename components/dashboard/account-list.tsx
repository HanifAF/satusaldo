// Wadah 4 dompet

import { AccountCard } from "@/components/dashboard/account-card";
import { Account } from "@/lib/queries/dashboard";

export function AccountList({ accounts }: { accounts: Account[] }) {
  return (
    <div className="flex h-full flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm shadow-slate-900/5">
      <h2 className="text-base font-semibold text-slate-900">Akun Saya</h2>

      <div className="flex flex-col gap-3">
        {accounts.map((account) => (
          <AccountCard key={account.id} account={account} />
        ))}
      </div>
    </div>
  );
}
