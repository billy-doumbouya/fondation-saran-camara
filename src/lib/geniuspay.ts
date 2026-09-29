import { createHmac, timingSafeEqual } from "crypto";

/**
 * Intégration GeniusPay — deux flux distincts :
 *
 * 1. MOBILE MONEY (pawapay, orange_money, mtn_money, moov_money, airtel_money)
 *    → Push de confirmation envoyé directement sur le téléphone du client.
 *    → PAS de redirection, PAS de checkout_url/payment_url à afficher.
 *    → Le frontend doit afficher "Confirmez sur votre téléphone" puis
 *      faire du polling sur GET /payments/{reference} (ou attendre le webhook).
 *
 * 2. CARTE / WAVE / CHECKOUT (card, wave, ou payment_method omis)
 *    → L'API retourne une payment_url / checkout_url.
 *    → Le frontend DOIT rediriger le client vers cette URL.
 *
 * ⚠️ La Guinée (GN) n'est pas dans la liste des 12 pays PawaPay supportés.
 * Le auto-routing par numéro de téléphone peut donc échouer pour un numéro
 * guinéen (+224) avec COUNTRY_NOT_SUPPORTED. Ce n'est pas un bug côté code —
 * c'est une limitation de couverture GeniusPay à faire lever avec leur support
 * si vos donateurs sont majoritairement en Guinée.
 */

const GENIUSPAY_API_BASE = (
  process.env.GENIUSPAY_API_BASE_URL || "https://pay.genius.ci/api/v1/merchant"
).replace(/\/+$/, "");

const SUPPORTED_CURRENCIES = new Set(["XOF", "EUR", "USD"]);

// Moyens de paiement qui déclenchent un push mobile (pas de redirection).
const PUSH_PAYMENT_METHODS = new Set([
  "pawapay",
  "orange_money",
  "mtn_money",
  "moov_money",
  "airtel_money",
]);

// Moyens de paiement qui renvoient une URL de redirection.
const REDIRECT_PAYMENT_METHODS = new Set(["card", "wave", "paystack"]);

export type GeniusPayFlow = "push" | "redirect";

export interface InitPaymentParams {
  reference: string;
  amount: number; // montant dans la devise d'origine (GNF)
  currency?: string; // devise d'origine ; convertie si non supportée par l'API
  paymentMethod: string; // "pawapay" | "orange_money" | "mtn_money" | "moov_money" | "airtel_money" | "card" | "wave" | "checkout"
  mmoProvider?: string; // ex: "ORANGE_CIV" — force un opérateur PawaPay précis
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  customerCountry?: string; // code ISO2, utilisé pour le routage PawaPay
  successUrl: string;
  errorUrl: string;
}

export interface InitPaymentResult {
  flow: GeniusPayFlow;
  reference: string;
  status: string;
  redirectUrl?: string; // présent uniquement si flow === "redirect"
  fallbackNotice?: string;
  raw: Record<string, unknown>;
}

function convertToSupportedCurrency(
  amount: number,
  currency: string | undefined,
): { amount: number; currency: string } {
  const upper = (currency || "XOF").toUpperCase();

  if (SUPPORTED_CURRENCIES.has(upper)) {
    return { amount, currency: upper };
  }

  if (upper === "GNF") {
    const rate = Number(process.env.GENIUSPAY_GNF_PER_USD || 8700);
    return { amount: Math.round((amount / rate) * 100) / 100, currency: "USD" };
  }

  throw new Error(
    `Devise "${currency}" non supportée et aucune conversion définie. Devises API : XOF, EUR, USD.`,
  );
}

function authHeaders(): Record<string, string> {
  const publicKey = process.env.GENIUSPAY_PUBLIC_KEY;
  const secretKey = process.env.GENIUSPAY_SECRET_KEY;
  if (!publicKey || !secretKey) {
    throw new Error(
      "GENIUSPAY_PUBLIC_KEY et GENIUSPAY_SECRET_KEY doivent être configurées.",
    );
  }
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-API-Key": publicKey,
    "X-API-Secret": secretKey,
  };
}

async function geniusPayFetch(
  path: string,
  init: RequestInit,
  timeoutMs = 20000,
) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${GENIUSPAY_API_BASE}${path}`, {
      ...init,
      signal: controller.signal,
    });
    const json = await res.json().catch(() => null);
    if (!res.ok || !json?.success) {
      const detail =
        json?.error?.message || json?.message || `code ${res.status}`;
      const code = json?.error?.code ? ` [${json.error.code}]` : "";
      throw new Error(`GeniusPay${code} (${res.status}): ${detail}`);
    }
    return json;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(
        "GeniusPay n'a pas répondu à temps. Réessayez dans quelques instants.",
      );
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

function normalizeCountryCode(country?: string): string | undefined {
  const value = (country || "").trim().toUpperCase();
  if (!value) return undefined;

  if (value.startsWith("+")) return value.slice(1).slice(0, 2);
  if (value.startsWith("00")) return value.slice(2, 4);
  return value.slice(0, 2);
}

function detectCountryFromPhone(phone: string): string | undefined {
  const normalized = (phone || "").replace(/\s+/g, "");
  if (/^(\+|00)?224/i.test(normalized)) return "GN";
  if (/^(\+|00)?221/i.test(normalized)) return "SN";
  if (/^(\+|00)?225/i.test(normalized)) return "CI";
  if (/^(\+|00)?223/i.test(normalized)) return "ML";
  if (/^(\+|00)?226/i.test(normalized)) return "BF";
  return undefined;
}

function shouldUseCheckoutFallback(method: string, country?: string): boolean {
  const directCountryAllowlist: Record<string, string[]> = {
    GN: ["wave", "card"],
    SN: ["wave", "orange_money", "card"],
    CI: ["wave", "orange_money", "mtn_money", "card"],
    ML: ["wave", "orange_money", "card"],
    BF: ["wave", "orange_money", "mtn_money", "card"],
  };

  const normalizedCountry = normalizeCountryCode(country) || "GN";
  const allowed = directCountryAllowlist[normalizedCountry] || [];

  return !allowed.includes(method);
}

export async function initGeniusPayPayment(
  params: InitPaymentParams,
): Promise<InitPaymentResult> {
  const { amount, currency } = convertToSupportedCurrency(
    params.amount,
    params.currency,
  );

  const method = params.paymentMethod;
  const country = normalizeCountryCode(params.customerCountry) || detectCountryFromPhone(params.customerPhone) || "GN";
  const isCheckout = method === "checkout"; // pas de payment_method => page de choix GeniusPay
  const isKnownMethod =
    PUSH_PAYMENT_METHODS.has(method) || REDIRECT_PAYMENT_METHODS.has(method);
  const shouldFallbackToCheckout =
    !isCheckout && isKnownMethod && shouldUseCheckoutFallback(method, country);
  const isPush = PUSH_PAYMENT_METHODS.has(method) && !shouldFallbackToCheckout;
  const _isRedirect = REDIRECT_PAYMENT_METHODS.has(method) && !shouldFallbackToCheckout;

  if (!isCheckout && !isKnownMethod) {
    throw new Error(`paymentMethod "${method}" inconnu.`);
  }

  const body: Record<string, unknown> = {
    amount,
    currency,
    description: `Don FSCPE — ${params.reference}`,
    customer: {
      name: params.customerName,
      email: params.customerEmail,
      phone: params.customerPhone,
      country,
    },
    success_url: params.successUrl,
    error_url: params.errorUrl,
    metadata: {
      source: "fscpe-site",
      internal_reference: params.reference,
    },
  };

  if (shouldFallbackToCheckout) {
    console.warn(
      `[GeniusPay] fallback checkout pour ${method} en ${country}: le paiement direct n'est pas supporté pour ce pays.`,
    );
  } else if (!isCheckout) {
    body.payment_method = method;
  }
  if (params.mmoProvider && !shouldFallbackToCheckout) {
    body.mmo_provider = params.mmoProvider;
  }

  const json = await geniusPayFetch("/payments", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  const data = json.data as Record<string, unknown>;

  // Log temporaire de diagnostic : à retirer une fois le routage confirmé.
  console.log("[GeniusPay] init payload envoyé:", JSON.stringify(body));
  console.log("[GeniusPay] réponse reçue:", JSON.stringify(data));

  if (!data.reference) {
    throw new Error(
      "Réponse GeniusPay inattendue : référence de paiement absente.",
    );
  }

  if (isPush) {
    // Pas d'URL à afficher : le client confirme directement sur son téléphone.
    return {
      flow: "push",
      reference: String(data.reference),
      status: String(data.status || "pending"),
      raw: data,
    };
  }

  // isRedirect ou isCheckout : une URL doit être présente.
  const redirectUrl =
    (data.checkout_url as string) || (data.payment_url as string) || undefined;
  if (!redirectUrl) {
    throw new Error(
      "GeniusPay n'a retourné aucune URL de paiement pour ce mode.",
    );
  }

  const fallbackNotice = shouldFallbackToCheckout
    ? `La méthode de paiement sélectionnée n'est pas disponible pour ${country}. Nous vous redirigeons vers le paiement compatible GeniusPay.`
    : undefined;

  return {
    flow: "redirect",
    reference: String(data.reference),
    status: String(data.status || "pending"),
    redirectUrl,
    fallbackNotice,
    raw: data,
  };
}

/** Récupère le statut actuel d'un paiement (pour le polling côté mobile money). */
export async function getGeniusPayPayment(reference: string): Promise<{
  reference: string;
  status: string;
  raw: Record<string, unknown>;
}> {
  const json = await geniusPayFetch(
    `/payments/${encodeURIComponent(reference)}`,
    {
      method: "GET",
      headers: authHeaders(),
    },
  );
  const data = json.data as Record<string, unknown>;
  return {
    reference: String(data.reference),
    status: String(data.status),
    raw: data,
  };
}

/**
 * Vérifie la signature HMAC-SHA256 du webhook.
 * Format officiel : HMAC-SHA256(timestamp + "." + json_payload, secret)
 */
export function isValidGeniusPaySignature(
  rawBody: string,
  signatureHeader: string | null,
  timestampHeader: string | null,
): boolean {
  const secret = process.env.GENIUSPAY_WEBHOOK_SECRET;
  if (!secret || !signatureHeader || !timestampHeader) return false;

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
