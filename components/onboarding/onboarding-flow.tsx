"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingLayout } from "@/components/onboarding/onboarding-layout";
import { StepIndicator } from "@/components/onboarding/step-indicator";
import { WelcomeStep } from "@/components/onboarding/welcome-step";
import { AddAccountStep } from "@/components/onboarding/add-account-step";
import { ReviewStep } from "@/components/onboarding/review-step";
import {
  validateAccountForm,
  validateMonthlyGoal,
  type AccountFormDraft,
  type AccountFormErrors,
  type AccountType,
  type OnboardingAccount,
} from "@/lib/schemas/onboarding";

const EMPTY_DRAFT: AccountFormDraft = { type: null, name: "", balance: "" };

export function OnboardingFlow() {
  const router = useRouter();

  const [step, setStep] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [accounts, setAccounts] = useState<OnboardingAccount[]>([]);
  const [draft, setDraft] = useState<AccountFormDraft>(EMPTY_DRAFT);
  const [errors, setErrors] = useState<AccountFormErrors>({});
  const [monthlyGoal, setMonthlyGoal] = useState("");
  const [goalError, setGoalError] = useState<string | undefined>();

  function updateDraft<K extends keyof AccountFormDraft>(
    field: K,
    value: AccountFormDraft[K],
  ) {
    setDraft((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof AccountFormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function commitDraftIfFilled(): boolean {
    const hasAnyInput =
      Boolean(draft.type) ||
      draft.name.trim() !== "" ||
      draft.balance.trim() !== "";
    if (!hasAnyInput) return true;

    const fieldErrors = validateAccountForm(draft);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return false;
    }

    setAccounts((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        type: draft.type as AccountType,
        name: draft.name.trim(),
        balance: Number(draft.balance),
      },
    ]);

    setErrors({});
    return true;
  }

  function handleNext() {
    if (!commitDraftIfFilled()) return;

    // LOGIKA PENYUNTIKAN DATA OTOMATIS BERDASARKAN LANGKAH
    if (step === 1) {
      // Paksa sistem memilih ewallet
      setDraft({ type: "ewallet", name: "", balance: "" });
      setStep(2);
    } else if (step === 2) {
      // Paksa sistem memilih Tunai, dan otomatis tuliskan namanya "Tunai"
      setDraft({ type: "cash", name: "Tunai", balance: "" });
      setStep(3);
    } else if (step === 3) {
      // Selesai pengisian, menuju halaman Review
      setStep(4);
    }
  }

  function handleGoalChange(value: string) {
    setMonthlyGoal(value);
    setGoalError(validateMonthlyGoal(value));
  }

  function handleFinish() {
    if (goalError) return;
    router.push("/dashboard");
  }

  const totalBalance = accounts.reduce(
    (sum, account) => sum + account.balance,
    0,
  );

  return (
    <OnboardingLayout>
      {step > 0 && <StepIndicator step={step} />}

      {step === 0 && (
        <WelcomeStep
          onNext={() => {
            // paksa sistem memilih Bank
            setDraft({ type: "bank", name: "", balance: "" });
            setStep(1);
          }}
        />
      )}

      {(step === 1 || step === 2 || step === 3) && (
        <AddAccountStep
          currentStepIndex={step}
          draft={draft}
          errors={errors}
          onChangeField={updateDraft}
          onNext={handleNext}
        />
      )}

      {step === 4 && (
        <ReviewStep
          accounts={accounts}
          totalBalance={totalBalance}
          monthlyGoal={monthlyGoal}
          goalError={goalError}
          onGoalChange={handleGoalChange}
          onFinish={handleFinish}
        />
      )}
    </OnboardingLayout>
  );
}
