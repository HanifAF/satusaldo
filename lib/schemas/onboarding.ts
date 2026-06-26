import { z } from "zod";

export const ACCOUNT_TYPES = ["bank", "ewallet", "cash"] as const;
export type AccountType = (typeof ACCOUNT_TYPES)[number];

export const accountFormSchema = z.object({
  type: z.enum(ACCOUNT_TYPES, {
    errorMap: () => ({ message: "Pilih jenis akun terlebih dahulu" }),
  }),
  name: z.string().trim().min(3, "Nama akun minimal 3 karakter"),
  balance: z
    .number({ invalid_type_error: "Saldo awal harus berupa angka" })
    .finite("Saldo awal harus berupa angka")
    .positive("Saldo awal harus lebih dari 0"),
});

export type AccountFormValues = z.infer<typeof accountFormSchema>;
export type AccountFormErrors = Partial<
  Record<keyof AccountFormValues, string>
>;

export interface OnboardingAccount extends AccountFormValues {
  id: string;
}

/**Data form yang masih berformat teks mentah */
export interface AccountFormDraft {
  type: AccountType | null;
  name: string;
  balance: string;
}

/**
 * Penanda fungsi validasi (cek error) data akun baru.
 */
export function validateAccountForm(
  draft: AccountFormDraft,
): AccountFormErrors {
  const result = accountFormSchema.safeParse({
    type: draft.type,
    name: draft.name,
    balance: draft.balance.trim() === "" ? NaN : Number(draft.balance),
  });

  if (result.success) return {};

  const errors: AccountFormErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof AccountFormValues | undefined;
    if (field && !errors[field]) {
      errors[field] = issue.message;
    }
  }
  return errors;
}

const monthlyGoalSchema = z
  .number({ invalid_type_error: "Target harus berupa angka" })
  .finite("Target harus berupa angka")
  .nonnegative("Target tidak boleh negatif");

/** Mengecek input target tabungan bulanan. */
export function validateMonthlyGoal(raw: string): string | undefined {
  if (raw.trim() === "") return undefined;
  const result = monthlyGoalSchema.safeParse(Number(raw));
  return result.success ? undefined : result.error.issues[0]?.message;
}
