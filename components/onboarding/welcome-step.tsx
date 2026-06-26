import { ArrowRight, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

export function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="rounded-3xl border border-white/60 bg-white/70 p-8 text-center shadow-xl shadow-emerald-900/10 backdrop-blur-xl">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-900/20">
        <Wallet size={28} strokeWidth={2.2} />
      </span>

      <h1 className="mt-6 text-2xl font-semibold tracking-tight text-slate-900">
        Selamat Datang di SatuSaldo
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-slate-500">
        Kelola semua rekening, e-wallet, dan uang tunai Anda dalam satu
        dashboard yang presisi.
      </p>

      <Button onClick={onNext} size="lg" className="mt-8 w-full">
        Mulai Setup Akun
        <ArrowRight size={18} strokeWidth={2.5} />
      </Button>
    </div>
  );
}
