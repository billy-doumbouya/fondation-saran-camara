import { createHmac, timingSafeEqual } from "crypto";

/**
 * Intégration GeniusPay — Page de checkout (mode recommandé).
 *
 * ⚠️ La Guinée (GN) n'est pas dans la liste des pays supportés par GeniusPay
 * pour le routage Mobile Money (PawaPay), et le GNF n'est pas une devise
 * acceptée par l'API (seules XOF, XAF, CDF, USD, KES, RWF, SLE, UGX, ZMW le
 * sont). On convertit donc le montant en USD et on n'envoie PAS de
 * customer.country="GN" (qui déclencherait une tentative de routage PawaPay
 * vers un pays non supporté). En laissant payment_method vide, GeniusPay
 * génère une checkout_url où le client voit les moyens disponibles pour lui
 * (typiquement carte bancaire pour un client basé en Guinée).
 */

interface InitPaymentParams {
  reference: string;
  amount: number; // montant dans la devise d'origine (GNF)
  currency: string; // devise d'origine, ex: "GNF" — jamais envoyée telle quelle à l'API
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

interface InitPaymentResult {
  payment: Record<string, unknown>;
  providerReference?: string;
}

const DEFAULT_GENIUSPAY_API_BASE = "https://geniuspay.ci/api/v1/merchant";

// Devises réellement acceptées par l'API GeniusPay (cf. doc officielle).
const SUPPORTED_CURRENCIES = new Set([
  "XOF",
  "XAF",
  "CDF",
  "USD",
  "KES",
  "RWF",
  "SLE",
  "UGX",
  "ZMW",
]);

function resolveGeniusPayApiBaseUrl(): string {
  const rawBase = (
    process.env.GENIUSPAY_API_BASE_URL || DEFAULT_GENIUSPAY_API_BASE
  ).trim();
  const normalized = rawBase.replace(/\/+$/, "");

  if (/api\.geniuspay\.ci\/v1$/i.test(normalized)) {
    return `${normalized}/merchant`;
  }

  if (!/\/api\/v1\/merchant$/i.test(normalized)) {
    return DEFAULT_GENIUSPAY_API_BASE;
  }

  return normalized;
}

const GENIUSPAY_API_BASE = resolveGeniusPayApiBaseUrl();

/**
 * Convertit un montant GNF en une devise supportée par GeniusPay (USD par défaut).
 * Le taux doit être maintenu à jour via GENIUSPAY_GNF_PER_USD (variable d'env).
 */
function convertToSupportedCurrency(
  amount: number,
  currency: string | undefined | null,
): {
  amount: number;
  currency: string;
  originalAmount: number;
  originalCurrency: string;
} {
  if (!currency || typeof currency !== "string") {
    throw new Error(
      `Devise manquante ou invalide reçue par initGeniusPayPayment (valeur: ${JSON.stringify(
        currency,
      )}). Vérifiez que la route d'init passe bien un champ "currency" (ex: "GNF").`,
    );
  }

  const upper = currency.toUpperCase();

  if (SUPPORTED_CURRENCIES.has(upper)) {
    return {
      amount,
      currency: upper,
      originalAmount: amount,
      originalCurrency: upper,
    };
  }

  if (upper === "GNF") {
    const rate = Number(process.env.GENIUSPAY_GNF_PER_USD || 8700);
    const amountUsd = Math.round((amount / rate) * 100) / 100;
    return {
      amount: amountUsd,
      currency: "USD",
      originalAmount: amount,
      originalCurrency: "GNF",
    };
  }

  throw new Error(
    `Devise "${currency}" non supportée par GeniusPay et aucune conversion définie. Devises acceptées : ${Array.from(
      SUPPORTED_CURRENCIES,
    ).join(", ")}.`,
  );
}

export async function initGeniusPayPayment(
  params: InitPaymentParams,
): Promise<InitPaymentResult> {
  const publicKey = process.env.GENIUSPAY_PUBLIC_KEY;
  const secretKey = process.env.GENIUSPAY_SECRET_KEY;
  if (!publicKey || !secretKey) {
    throw new Error(
      "GENIUSPAY_PUBLIC_KEY et GENIUSPAY_SECRET_KEY doivent être configurées dans .env.local.",
    );
  }

  const { amount, currency, originalAmount, originalCurrency } =
    convertToSupportedCurrency(params.amount, params.currency);

  const paymentMethod =
    process.env.GENIUSPAY_PAYMENT_METHOD?.trim() || undefined;
  const mmoProvider = process.env.GENIUSPAY_MMO_PROVIDER?.trim() || undefined;
  // GN n'est pas un pays supporté par le routage PawaPay : on ne l'envoie
  // jamais tel quel, seulement si un jour un pays supporté est configuré.
  const configuredCountry = process.env.GENIUSPAY_COUNTRY?.trim();
  const country =
    configuredCountry && configuredCountry.toUpperCase() !== "GN"
      ? configuredCountry
      : undefined;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.fscpe.org";
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

  try {
    const res = await fetch(`${GENIUSPAY_API_BASE}/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-API-Key": publicKey,
        "X-API-Secret": secretKey,
      },
      body: JSON.stringify({
        amount,
        currency,
        description: `Don FSCPE — ${params.reference}`,
        ...(paymentMethod ? { payment_method: paymentMethod } : {}),
        ...(mmoProvider ? { mmo_provider: mmoProvider } : {}),
        customer: {
          name: params.customerName,
          email: params.customerEmail,
          phone: params.customerPhone,
          ...(country ? { country } : {}),
        },
        success_url: `${siteUrl}/don/merci?status=success&ref=${encodeURIComponent(params.reference)}`,
        error_url: `${siteUrl}/don?status=error&ref=${encodeURIComponent(params.reference)}`,
        metadata: {
          source: "fscpe-site",
          internal_reference: params.reference,
          original_amount: originalAmount,
          original_currency: originalCurrency,
        },
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      const detail = body ? ` — ${body.slice(0, 500)}` : "";
      throw new Error(
        `GeniusPay a refusé la demande de paiement (${res.status}) depuis ${GENIUSPAY_API_BASE}${detail}.`,
      );
    }

    const data = (await res.json()) as Record<string, unknown>;
    const payment =
      data.data && typeof data.data === "object" ? data.data : data;
    const paymentRecord = payment as Record<string, unknown>;

    if (!paymentRecord.reference) {
      throw new Error(
        "Réponse GeniusPay inattendue : référence de paiement absente.",
      );
    }

    return {
      payment: paymentRecord,
      providerReference: String(paymentRecord.reference),
    };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(
        "Le service GeniusPay n'a pas répondu à temps. Réessayez dans quelques instants.",
      );
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Vérifie la signature HMAC-SHA256 du webhook.
 * Format officiel GeniusPay : HMAC-SHA256(timestamp + "." + json_payload, secret)
 * Headers attendus : X-Webhook-Signature, X-Webhook-Timestamp.
 */
export function isValidGeniusPaySignature(
  rawBody: string,
  signatureHeader: string | null,
  timestampHeader: string | null,
): boolean {
  const secret = process.env.GENIUSPAY_WEBHOOK_SECRET;
  if (!secret || !signatureHeader || !timestampHeader) return false;

  // Protection anti-rejeu : rejette si le timestamp date de plus de 5 minutes.
  const now = Math.floor(Date.now() / 1000);
  const ts = Number(timestampHeader);
  if (!Number.isFinite(ts) || Math.abs(now - ts) > 300) return false;

  const dataToSign = `${timestampHeader}.${rawBody}`;
  const expected = Buffer.from(
    createHmac("sha256", secret).update(dataToSign).digest("hex"),
    "utf8",
  );
  const received = Buffer.from(signatureHeader, "utf8");

  return (
    received.length === expected.length && timingSafeEqual(received, expected)
  );
}
