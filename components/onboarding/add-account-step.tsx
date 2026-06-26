import { ArrowRight, Banknote, Landmark, Wallet } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type {
  AccountFormDraft,
  AccountFormErrors,
} from "@/lib/schemas/onboarding";

interface AddAccountStepProps {
  currentStepIndex: number;
  draft: AccountFormDraft;
  errors: AccountFormErrors;
  onChangeField: <K extends keyof AccountFormDraft>(
    field: K,
    value: AccountFormDraft[K],
  ) => void;
  onNext: () => void;
}

export function AddAccountStep({
  currentStepIndex,
  draft,
  errors,
  onChangeField,
  onNext,
}: AddAccountStepProps) {
  // Konfigurasi dinamis untuk menyesuaikan Tampilan (UI) berdasarkan langkah saat ini
  const stepConfig = {
    1: {
      title: "Tambah Akun Bank",
      desc: "Masukkan nama dan saldo awal rekening bank milikmu.",
      icon: Landmark,
      color: "text-blue-600 bg-blue-50",
    },
    2: {
      title: "Tambah E-Wallet",
      desc: "Masukkan nama dan saldo awal e-wallet (GoPay, OVO, dll).",
      icon: Wallet,
      color: "text-green-600 bg-green-50",
    },
    3: {
      title: "Tambah Uang Tunai",
      desc: "Berapa jumlah uang tunai fisik yang kamu pegang saat ini?",
      icon: Banknote,
      color: "text-slate-600 bg-slate-200/70",
    },
  }[currentStepIndex as 1 | 2 | 3];

  const Icon = stepConfig.icon;

  return (
    <Card>
      <CardHeader>
        <div
          className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${stepConfig.color}`}
        >
          <Icon size={24} strokeWidth={2} />
        </div>
        <CardTitle>{stepConfig.title}</CardTitle>
        <CardDescription>{stepConfig.desc}</CardDescription>
      </CardHeader>

      <div className="flex flex-col gap-5">
        {/* LOGIKA PENTING: Hanya tampilkan input Nama Akun jika BUKAN Langkah 3 (Tunai) */}
        {currentStepIndex !== 3 && (
          <div>
            <p className="mb-2 text-sm font-medium text-slate-700">Nama Akun</p>
            <Input
              value={draft.name}
              onChange={(e) => onChangeField("name", e.target.value)}
              placeholder={
                currentStepIndex === 1
                  ? "Contoh: BCA Tabungan"
                  : "Contoh: GoPay Utama"
              }
              error={errors.name}
            />
          </div>
        )}

        <div>
          <p className="mb-2 text-sm font-medium text-slate-700">Saldo Awal</p>
          <Input
            type="number"
            inputMode="numeric"
            prefix="Rp"
            value={draft.balance}
            onChange={(e) => onChangeField("balance", e.target.value)}
            placeholder="0"
            className="text-lg font-semibold"
            error={errors.balance}
          />
        </div>
      </div>

      <div className="mt-7">
        <Button onClick={onNext} size="lg" className="w-full">
          Lanjut
          <ArrowRight size={18} strokeWidth={2.5} />
        </Button>
      </div>
    </Card>
  );
}
