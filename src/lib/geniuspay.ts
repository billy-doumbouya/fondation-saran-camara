import { createHmac } from "crypto";

/**
 * Intégration GeniusPay (geniuspay.ci) — PSP couvrant le Mobile Money
 * (Orange, MTN, Wave) et les cartes bancaires en Afrique de l'Ouest.
 *
 * ⚠️ IMPORTANT : au moment de la génération de ce projet, GeniusPay est en
 * liste d'attente publique (onboarding.geniuspay.ci) et règle en XOF, une
 * devise différente du GNF (franc guinéen) utilisé par la fondation.
 * Avant la mise en production :
 *   1. Confirmez auprès de GeniusPay que la collecte fonctionne pour un
 *      bénéficiaire basé en Guinée (hors zone CFA) et quelle devise
 *      afficher au donateur.
 *   2. Récupérez vos clés API réelles et le schéma exact des requêtes
 *      dans leur documentation officielle (elle peut différer légèrement
 *      de l'abstraction ci-dessous, écrite pour être facile à adapter).
 *   3. Renseignez GENIUSPAY_SECRET_KEY, GENIUSPAY_PUBLIC_KEY et
 *      GENIUSPAY_WEBHOOK_SECRET dans .env.local.
 */

interface InitPaymentParams {
  reference: string;
  amount: number;
  currency: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  callbackUrl: string;
  redirectUrl: string;
}

interface InitPaymentResult {
  redirectUrl: string;
  providerReference?: string;
}

const GENIUSPAY_API_BASE = process.env.GENIUSPAY_API_BASE_URL || "https://api.geniuspay.ci/v1";

export async function initGeniusPayPayment(params: InitPaymentParams): Promise<InitPaymentResult> {
  const secretKey = process.env.GENIUSPAY_SECRET_KEY;
  if (!secretKey) {
    throw new Error(
      "GENIUSPAY_SECRET_KEY n'est pas configuré. Ajoutez vos clés GeniusPay dans .env.local une fois votre accès validé."
    );
  }

  const res = await fetch(`${GENIUSPAY_API_BASE}/payments/initialize`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${secretKey}`,
    },
    body: JSON.stringify({
      reference: params.reference,
      amount: params.amount,
      currency: params.currency,
      customer: {
        name: params.customerName,
        email: params.customerEmail,
        phone: params.customerPhone,
      },
      callback_url: params.callbackUrl,
      redirect_url: params.redirectUrl,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`GeniusPay a refusé la demande de paiement (${res.status}): ${body}`);
  }

  const data = await res.json();
  const redirectUrl = data.redirect_url || data.checkout_url || data.data?.checkout_url;
  if (!redirectUrl) {
    throw new Error("Réponse GeniusPay inattendue : URL de paiement absente.");
  }

  return { redirectUrl, providerReference: data.id || data.data?.id };
}

/** Vérifie la signature du webhook GeniusPay (à ajuster selon leur doc officielle). */
export function isValidGeniusPaySignature(rawBody: string, signatureHeader: string | null): boolean {
  const secret = process.env.GENIUSPAY_WEBHOOK_SECRET;
  if (!secret || !signatureHeader) return false;
  // Placeholder HMAC comparison — remplacez par l'algorithme exact documenté
  // par GeniusPay (souvent HMAC-SHA256 du corps brut avec le webhook secret).
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  return expected === signatureHeader;
}
