import { NextRequest, NextResponse } from "next/server";
import { donationsRepo } from "@/lib/db/repo";
import { isValidGeniusPaySignature } from "@/lib/geniuspay";

export const runtime = "nodejs";

/**
 * Webhook GeniusPay : met à jour le statut du don.
 * ⚠️ Adaptez le nom du header de signature et le format du payload une fois
 * la documentation officielle de production consultée.
 */
export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-geniuspay-signature");

  if (!isValidGeniusPaySignature(rawBody, signature)) {
    return NextResponse.json({ error: "Signature invalide." }, { status: 401 });
  }

  try {
    const payload = JSON.parse(rawBody) as {
      type?: string;
      reference?: string;
      status?: string;
      data?: { reference?: string; status?: string; id?: string };
    };
    const payment = payload.data || payload;
    const reference = payment.reference;
    const status = payment.status || "unknown";

    if (!reference) {
      return NextResponse.json({ error: "Référence manquante." }, { status: 400 });
    }

    const normalizedStatus = ["payment.success", "success", "completed", "paid"].includes(
      (payload.type || status).toLowerCase()
    )
      ? "success"
      : ["payment.failed", "failed", "cancelled", "declined"].includes(
          (payload.type || status).toLowerCase()
        )
      ? "failed"
      : "pending";

    await donationsRepo.updateStatus(reference, normalizedStatus, payload);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("GeniusPay webhook error:", err);
    return NextResponse.json({ error: "Payload invalide." }, { status: 400 });
  }
}
