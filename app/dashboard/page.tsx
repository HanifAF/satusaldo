// Server Component Utama (Halaman Cashflow). Bertugas sebagai dirigen yang mengambil data finansial dari database,
// lalu mendistribusikannya ke kartu-kartu visual.
// Kanvas utama penyusun grid UI

import { QuickActionCard } from "@/components/dashboard/quick-action-card";
import { NetWorthCard } from "@/components/dashboard/net-worth-card";
import { AccountList } from "@/components/dashboard/account-list";
import { TransactionTable } from "@/components/dashboard/transaction-table";
import { UpcomingBillsCard } from "@/components/dashboard/upcoming-bills-card";

import {
  getAccounts,
  getNetWorth,
  getRecentTransactions,
  getUpcomingBills,
} from "@/lib/queries/dashboard";

export default async function DashboardPage() {
  const [netWorth, accounts, transactions, bills] = await Promise.all([
    getNetWorth(),
    getAccounts(),
    getRecentTransactions(),
    getUpcomingBills(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold md:text-3xl text-emerald-700">
          Selamat Pagi, User
        </h1>
      </div>

      {/* Top section: Quick Action + Net Worth */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <QuickActionCard />
        </div>
        <div className="lg:col-span-2">
          <NetWorthCard total={netWorth.total} asOfLabel={netWorth.asOfLabel} />
        </div>
      </div>

      {/* Main section: Accounts (left) / Transactions + Bills (right) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <AccountList accounts={accounts} />
        </div>
        <div className="flex flex-col gap-6 lg:col-span-2">
          <TransactionTable transactions={transactions} />
          <UpcomingBillsCard bills={bills} />
        </div>
      </div>
    </div>
  );
}
