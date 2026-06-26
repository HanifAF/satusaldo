// Kapsul navigasi atas (Client Component)

"use client";
/**
 *navigasi menu yang ada di tengah atas
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Wallet } from "lucide-react";

const NAV_LINKS = [
  { label: "Cashflow", href: "/dashboard" },
  { label: "Transaksi", href: "/dashboard/transaksi" },
  { label: "Laporan", href: "/dashboard/laporan" },
  { label: "Dompet", href: "/dashboard/dompet" },
] as const;

export function FloatingNavbar() {
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <nav
        className="flex w-full max-w-3xxl item-center gap-1 rounded-full border border-white/60
      bg-white/90 px-2 py-2 shadow-lg shadow-emerald-900/5 backdrop-blur-md sm:gap-2 sm:px-3"
      >
        {/* Brand */}
        <Link
          href="/dashboard"
          className="flex shrink-0 item-center gap-2 rounded-full px-2 py-3"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white">
            <Wallet size={16} strokeWidth={2.5} />
          </span>
          <span className="hidden text-2xl font-bold text-slate-900 sm:inline">
            Satu Saldo
          </span>
        </Link>

        {/* Links */}
        <ul className="flex flex-1 items-center justify-center gap-1 overflow-x-auto">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;

            return (
              <li key={link.href} className="shrink-0">
                <Link
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-sm shadow-emerald-900/20"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Profile */}
        <button
          type="button"
          aria-label="Profil saya"
          className="flex h-11 w-11 shrink-0 items-center justify-center self-center rounded-full
                   bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200"
        >
          <User size={20} strokeWidth={2} />
        </button>
      </nav>
    </header>
  );
}
