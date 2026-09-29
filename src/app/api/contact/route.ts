import { NextResponse, type NextRequest } from "next/server";
import { contactMessagesRepo } from "@/lib/db/repo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const RATE = { windowMs: 60_000, max: 3 };
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimit(ip: string): { ok: boolean; retryAfter?: number } {
  const now = Date.now();
  const e = hits.get(ip);
  if (!e || e.resetAt < now) {
    hits.set(ip, { count: 1, resetAt: now + RATE.windowMs });
    return { ok: true };
  }
  e.count += 1;
  if (e.count > RATE.max) {
    return { ok: false, retryAfter: Math.ceil((e.resetAt - now) / 1000) };
  }
  return { ok: true };
}

function getIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return req.headers.get("x-real-ip")?.trim() ?? "unknown";
}

export async function POST(req: NextRequest) {
  const ip = getIp(req);
  const rl = rateLimit(ip);
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "Trop de messages envoyés. Réessayez dans quelques minutes." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter ?? 30) } },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Payload invalide." }, { status: 400 });
  }

  const b = (body ?? {}) as Record<string, unknown>;

  // ——— Honeypot ———
  if (typeof b.website === "string" && b.website.trim() !== "") {
    // Silently accept to not flag the bot
    return NextResponse.json({ ok: true, message: "Message envoyé." }, { status: 200 });
  }

  const name = typeof b.name === "string" ? b.name.trim() : "";
  const email = typeof b.email === "string" ? b.email.trim().toLowerCase() : "";
  const phone = typeof b.phone === "string" ? b.phone.trim() : "";
  const subject = typeof b.subject === "string" ? b.subject.trim() : "";
  const message = typeof b.message === "string" ? b.message.trim() : "";
  const consent = b.consent === true;

  if (!name || name.length < 2 || name.length > 150) {
    return NextResponse.json({ ok: false, error: "Nom invalide." }, { status: 422 });
  }
  if (!email || !EMAIL_RE.test(email) || email.length > 200) {
    return NextResponse.json({ ok: false, error: "E-mail invalide." }, { status: 422 });
  }
  if (phone && phone.length > 50) {
    return NextResponse.json({ ok: false, error: "Téléphone invalide." }, { status: 422 });
  }
  if (!subject || subject.length < 2 || subject.length > 250) {
    return NextResponse.json({ ok: false, error: "Objet invalide." }, { status: 422 });
  }
  if (!message || message.length < 10 || message.length > 5000) {
    return NextResponse.json({ ok: false, error: "Message invalide." }, { status: 422 });
  }
  if (!consent) {
    return NextResponse.json(
      { ok: false, error: "Vous devez accepter le traitement de vos données." },
      { status: 422 },
    );
  }

  try {
    await contactMessagesRepo.create({
      name,
      email,
      phone: phone || null,
      subject,
      message,
      ip,
    });
    return NextResponse.json(
      { ok: true, message: "Message envoyé ! Nous vous répondrons sous 24-48h." },
      { status: 201 },
    );
  } catch (err) {
    console.error("[contact] DB error:", err);
    return NextResponse.json(
      { ok: false, error: "Erreur serveur. Réessayez plus tard." },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { ok: false, error: "Méthode non autorisée. Utilisez POST." },
    { status: 405, headers: { Allow: "POST" } },
  );
}
