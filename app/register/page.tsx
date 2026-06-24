import { signUp } from "@/lib/actions/auth";
import Link from "next/link";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-emerald-50 via-white to-white px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-2">
          <div className="flex h-9 w-9 rotate-45 items-center justify-center rounded-md bg-emerald-600" />
          <h1 className="text-xl font-semibold text-emerald-700">SatuSaldo</h1>
          <p className="text-sm text-gray-500">Satu tampilan, semua dompetmu</p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm shadow-emerald-900/5">
          {params.error && (
            <p className="mb-4 rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700">
              {params.error}
            </p>
          )}

          <form action={signUp} className="space-y-4">
            <div>
              <label
                htmlFor="nama"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Nama
              </label>
              <input
                id="nama"
                name="nama"
                type="text"
                required
                placeholder="Nama kamu"
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="nama@email.com"
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                placeholder="Minimal 6 karakter"
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
            >
              Daftar
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="font-medium text-emerald-700 hover:underline"
          >
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
}
