import { NextResponse, type NextRequest } from "next/server";
import { settingsRepo } from "@/lib/db/repo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

// ——— Rate limit simple (in-memory, par IP) ———
// Pour prod à fort trafic : migrer vers Upstash Redis ou KV.
const RATE_LIMIT = {
  windowMs: 60_000, // 1 min
  max: 5,           // 5 requêtes / IP / minute
};
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimit(ip: string): { ok: boolean; retryAfter?: number } {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || entry.resetAt < now) {
    hits.set(ip, { count: 1, resetAt: now + RATE_LIMIT.windowMs });
    return { ok: true };
  }
  entry.count += 1;
  if (entry.count > RATE_LIMIT.max) {
    return { ok: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }
  return { ok: true };
}

function getClientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}

export async function POST(req: NextRequest) {
  // ——— Rate limit ———
  const ip = getClientIp(req);
  const rl = rateLimit(ip);
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "Trop de requêtes. Réessayez dans quelques secondes." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter ?? 30) } },
    );
  }

  // ——— Parse + validate ———
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Payload JSON invalide." },
      { status: 400 },
    );
  }

  const email =
    typeof body === "object" && body !== null && "email" in body
      ? String((body as { email: unknown }).email).trim().toLowerCase()
      : "";

  if (!email || !EMAIL_RE.test(email) || email.length > 200) {
    return NextResponse.json(
      { ok: false, error: "Adresse e-mail invalide." },
      { status: 422 },
    );
  }

  // ——— Persist (idempotent) ———
  const key = `newsletter:${email}`;
  try {
    const already = await settingsRepo.has(key);
    if (already) {
      return NextResponse.json(
        {
          ok: true,
          alreadySubscribed: true,
          message: "Vous êtes déjà inscrit·e à notre newsletter.",
        },
        { status: 200 },
      );
    }

    await settingsRepo.set(
      key,
      JSON.stringify({
        email,
        subscribedAt: new Date().toISOString(),
        ip,
        source: "footer",
      }),
    );

    return NextResponse.json(
      {
        ok: true,
        alreadySubscribed: false,
        message: "Merci ! Votre inscription a bien été enregistrée.",
      },
      { status: 201 },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[newsletter] DB error:", err);

    if (/updated_at|does not exist|column .* does not exist/i.test(message)) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "La base de données est incomplète. Merci d’appliquer les migrations du site avant de réessayer.",
        },
        { status: 503 },
      );
    }

    return NextResponse.json(
      { ok: false, error: "Erreur serveur. Réessayez plus tard." },
      { status: 500 },
    );
  }
}

// ——— Method not allowed for GET, etc. ———
export async function GET() {
  return NextResponse.json(
    { ok: false, error: "Méthode non autorisée. Utilisez POST." },
    { status: 405, headers: { Allow: "POST" } },
  );
}
