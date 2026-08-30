import { NextRequest, NextResponse } from "next/server";
import { donationsRepo } from "@/lib/db/repo";
import { isValidGeniusPaySignature } from "@/lib/geniuspay";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-webhook-signature");
  const timestamp = request.headers.get("x-webhook-timestamp");
  const eventHeader = request.headers.get("x-webhook-event");

  if (!process.env.GENIUSPAY_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "GENIUSPAY_WEBHOOK_SECRET non configuré dans l'environnement." },
      { status: 501 }
    );
  }

  if (!isValidGeniusPaySignature(rawBody, signature, timestamp)) {
    return NextResponse.json({ error: "Signature invalide ou expirée." }, { status: 401 });
  }

  try {
    const payload = JSON.parse(rawBody) as {
      event?: string;
      data?: {
        reference?: string;
        status?: string;
        metadata?: Record<string, unknown>;
      };
    };

    const eventType = (eventHeader || payload.event || "").toLowerCase();
    const reference =
      (payload.data?.metadata?.internal_reference as string | undefined) || payload.data?.reference;
    const status = (payload.data?.status || "").toLowerCase();

    if (!reference) {
      return NextResponse.json({ error: "Référence manquante." }, { status: 400 });
    }

    const normalizedStatus =
      eventType === "payment.success" || status === "completed"
        ? "success"
        : ["payment.failed", "payment.cancelled", "payment.expired"].includes(eventType) ||
          ["failed", "cancelled", "expired"].includes(status)
        ? "failed"
        : "pending";

    await donationsRepo.updateStatus(reference, normalizedStatus, payload);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("GeniusPay webhook error:", err);
    return NextResponse.json({ error: "Payload invalide." }, { status: 400 });
  }
}