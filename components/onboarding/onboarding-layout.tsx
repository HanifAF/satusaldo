import type { ReactNode } from "react";

/**
 * Background gradasi yang dipakai di semua halaman onboarding
 */
export function OnboardingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 px-4 py-10">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
