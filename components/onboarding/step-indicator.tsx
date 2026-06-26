import { Progress } from "@/components/ui/progress";

// Menambahkan label untuk ketiga dompet dan review
const STEP_LABELS = [
  "Selamat Datang",
  "Dompet 1",
  "Dompet 2",
  "Dompet 3",
  "Review",
];

export function StepIndicator({ step }: { step: number }) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between text-xs font-medium text-slate-400">
        <span>
          Langkah {step} dari {STEP_LABELS.length - 1}
        </span>
        <span className="text-emerald-600">{STEP_LABELS[step]}</span>
      </div>
      <Progress
        value={(step / (STEP_LABELS.length - 1)) * 100}
        className="mt-2"
      />
    </div>
  );
}
