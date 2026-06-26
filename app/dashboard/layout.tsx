//Server Component Induk. Berfungsi memuat kerangka dasar halaman dan membungkus komponen navigasi atas.
// Kerangka luar penampung navbar

import type { ReactNode } from "react";
import { FloatingNavbar } from "@/components/layout /floating-navbar";

export default function DashboardLayout({
  children,
}: {
  chlildren: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/70 via-slate-50 to-slate-50">
      <FloatingNavbar />
      <main className="mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
