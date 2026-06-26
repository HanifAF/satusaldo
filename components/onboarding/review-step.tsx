import { ArrowRight } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AddedAccountRow } from "@/components/onboarding/added-account-row";
import { formatIDR } from "@/lib/queries/dashboard";
import type { OnboardingAccount } from "@/lib/schemas/onboarding";

interface ReviewStepProps {
  accounts: OnboardingAccount[];
  totalBalance: number;
  monthlyGoal: string;
  goalError?: string;
  onGoalChange: (value: string) => void;
  onFinish: () => void;
}

export function ReviewStep({
  accounts,
  totalBalance,
  monthlyGoal,
  goalError,
  onGoalChange,
  onFinish,
}: ReviewStepProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Review &amp; Set Goals</CardTitle>
        <CardDescription>
          Periksa kembali akun yang sudah ditambahkan.
        </CardDescription>
      </CardHeader>

      <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-5 text-white">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-50/80">
          Total Saldo Awal
        </p>
        <p className="mt-2 text-2xl font-semibold tracking-tight">
          {formatIDR(totalBalance)}
        </p>
      </div>

      <div className="mt-5">
        <p className="mb-2 text-sm font-medium text-slate-700">
          Akun Ditambahkan ({accounts.length})
        </p>

        {accounts.length === 0 ? (
          <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-400">
            Belum ada akun ditambahkan. Kamu bisa menambahkannya nanti dari
            dashboard.
          </p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {accounts.map((account) => (
              <AddedAccountRow key={account.id} account={account} />
            ))}
          </div>
        )}
      </div>

      <div className="mt-5">
        <p className="mb-2 text-sm font-medium text-slate-700">
          Target Tabungan Bulanan{" "}
          <span className="text-slate-400">(opsional)</span>
        </p>
        <Input
          type="number"
          inputMode="numeric"
          prefix="Rp"
          value={monthlyGoal}
          onChange={(e) => onGoalChange(e.target.value)}
          placeholder="0"
          error={goalError}
        />
      </div>

      <div className="mt-5 rounded-2xl bg-slate-50 p-4">
        <p className="mb-3 text-xs font-medium text-slate-500">
          Setelah ini, kamu bisa catat 3 jenis transaksi dengan cepat:
        </p>
        <div className="flex flex-col gap-2 text-sm text-slate-600">
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            Pemasukan
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
            Pengeluaran
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
            Transfer
          </span>
        </div>
      </div>

      <Button
        onClick={onFinish}
        variant="primary"
        size="lg"
        className="mt-7 w-full"
      >
        Selesai &amp; Masuk ke Dashboard
        <ArrowRight size={18} strokeWidth={2.5} />
      </Button>
    </Card>
  );
}
