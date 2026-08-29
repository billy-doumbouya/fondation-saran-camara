import { createHmac, timingSafeEqual } from "crypto";

/**
 * Intégration GeniusPay V3 — paiement direct Mobile Money.
 *
 * Le guide fourni indique que les clés doivent rester côté serveur et être
 * transmises via X-API-Key/X-API-Secret.
 */

interface InitPaymentParams {
  reference: string;
  amount: number;
  currency: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

interface InitPaymentResult {
  payment: Record<string, unknown>;
  providerReference?: string;
}

const GENIUSPAY_API_BASE =
  process.env.GENIUSPAY_API_BASE_URL || "https://labpay.genius.ci/api/v1/merchant";

export async function initGeniusPayPayment(params: InitPaymentParams): Promise<InitPaymentResult> {
  const publicKey = process.env.GENIUSPAY_PUBLIC_KEY;
  const secretKey = process.env.GENIUSPAY_SECRET_KEY;
  if (!publicKey || !secretKey) {
    throw new Error(
      "GENIUSPAY_PUBLIC_KEY et GENIUSPAY_SECRET_KEY doivent être configurées dans .env.local."
    );
  }

  const res = await fetch(`${GENIUSPAY_API_BASE}/payments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": publicKey,
      "X-API-Secret": secretKey,
    },
    body: JSON.stringify({
      amount: params.amount,
      currency: params.currency,
      payment_method: process.env.GENIUSPAY_PAYMENT_METHOD || "pawapay",
      ...(process.env.GENIUSPAY_MMO_PROVIDER
        ? { mmo_provider: process.env.GENIUSPAY_MMO_PROVIDER }
        : {}),
      customer: {
        name: params.customerName,
        email: params.customerEmail,
        phone: params.customerPhone,
        country: process.env.GENIUSPAY_COUNTRY || "GN",
      },
      reference: params.reference,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`GeniusPay a refusé la demande de paiement (${res.status}): ${body}`);
  }

  const data = (await res.json()) as Record<string, unknown>;
  const payment = data.data && typeof data.data === "object" ? data.data : data;
  const paymentRecord = payment as Record<string, unknown>;
  if (!paymentRecord.id && !paymentRecord.reference) {
    throw new Error("Réponse GeniusPay inattendue : identifiant de paiement absent.");
  }

  return { payment: paymentRecord, providerReference: String(paymentRecord.id || "") || undefined };
}

/** Vérifie la signature HMAC-SHA256 du corps brut du webhook. */
export function isValidGeniusPaySignature(rawBody: string, signatureHeader: string | null): boolean {
  const secret = process.env.GENIUSPAY_WEBHOOK_SECRET;
  if (!secret || !signatureHeader) return false;
  const expected = Buffer.from(createHmac("sha256", secret).update(rawBody).digest("hex"), "utf8");
  const received = Buffer.from(signatureHeader, "utf8");
  return received.length === expected.length && timingSafeEqual(received, expected);
}
