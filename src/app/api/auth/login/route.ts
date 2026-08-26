import { NextRequest, NextResponse } from "next/server";
import { verifyAdminPassword, setSessionCookie } from "@/lib/auth";
import { loginSchema } from "@/lib/validations";

export const runtime = "nodejs";

// Basic in-memory rate limiting per server instance (best-effort; use a
// durable store like Upstash Redis for multi-instance production deploys).
const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 10 * 60 * 1000;

function getClientKey(request: NextRequest): string {
  return request.headers.get("x-forwarded-for") ?? "unknown";
}

export async function POST(request: NextRequest) {
  const key = getClientKey(request);
  const now = Date.now();
  const entry = attempts.get(key);
  if (entry && entry.resetAt > now && entry.count >= MAX_ATTEMPTS) {
    return NextResponse.json(
      { error: "Trop de tentatives. Réessayez dans quelques minutes." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { password } = await loginSchema.validate(body);
    const valid = await verifyAdminPassword(password);

    if (!valid) {
      attempts.set(key, {
        count: (entry?.resetAt ?? 0) > now ? entry!.count + 1 : 1,
        resetAt: now + WINDOW_MS,
      });
      return NextResponse.json({ error: "Mot de passe incorrect." }, { status: 401 });
    }

    attempts.delete(key);
    await setSessionCookie();
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Requête invalide.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
