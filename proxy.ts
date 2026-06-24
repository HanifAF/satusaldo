// Destinasi: proxy.ts (ROOT project, sejajar package.json)
// GANTI nama file middleware.ts → proxy.ts, lalu timpa isinya dengan ini, lalu hapus middleware.ts yang lama.
import { updateSession } from "./lib/supabase/proxy";
import { type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
