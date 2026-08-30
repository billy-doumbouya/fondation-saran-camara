import { NextRequest, NextResponse } from "next/server";
import { donationsRepo } from "@/lib/db/repo";
import { donationSchema } from "@/lib/validations";
import { initGeniusPayPayment } from "@/lib/geniuspay";
import { generateReference } from "@/lib/utils";

export const runtime = "nodejs";

const PUSH_METHODS = new Set(["pawapay", "orange_money", "mtn_money", "moov_money", "airtel_money"]);
const REDIRECT_METHODS = new Set(["card", "wave", "paystack", "checkout"]);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await donationSchema.validate(body, { stripUnknown: true });

    // paymentMethod attendu du frontend, ex: "pawapay" | "orange_money" | "card" | "wave" | "checkout"
    const paymentMethod = (data.paymentMethod || "checkout") as string;

    if (!PUSH_METHODS.has(paymentMethod) && !REDIRECT_METHODS.has(paymentMethod)) {
      return NextResponse.json({ error: `Moyen de paiement "${paymentMethod}" invalide.` }, { status: 400 });
    }

    const reference = generateReference();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.fscpe.org";
    const detectedCountry = data.customerCountry || (() => {
      const phone = (data.donorPhone || "").replace(/\s+/g, "");
      if (/^(\+|00)?224/i.test(phone)) return "GN";
      if (/^(\+|00)?221/i.test(phone)) return "SN";
      if (/^(\+|00)?225/i.test(phone)) return "CI";
      if (/^(\+|00)?223/i.test(phone)) return "ML";
      if (/^(\+|00)?226/i.test(phone)) return "BF";
      return "GN";
    })();

    await donationsRepo.create({
      reference,
      donorName: data.donorName,
      donorEmail: data.donorEmail,
      donorPhone: data.donorPhone,
      amount: data.amount,
      currency: "GNF",
      provider: "geniuspay",
      paymentMethod,
      status: "pending",
    });

    const result = await initGeniusPayPayment({
      reference,
      amount: data.amount,
      currency: "GNF",
      paymentMethod,
      mmoProvider: data.mmoProvider, // optionnel, ex: "ORANGE_CIV"
      customerName: data.donorName,
      customerEmail: data.donorEmail,
      customerPhone: data.donorPhone,
      customerCountry: detectedCountry,
      successUrl: `${siteUrl}/don/merci?status=success&ref=${encodeURIComponent(reference)}`,
      errorUrl: `${siteUrl}/don?status=error&ref=${encodeURIComponent(reference)}`,
    });

    await donationsRepo.updateStatus(reference, "pending", { providerData: result.raw });

    if (result.flow === "push") {
      // Mobile money : le client confirme sur son téléphone. Pas d'URL à renvoyer.
      return NextResponse.json({
        success: true,
        flow: "push",
        reference,
        message: "Confirmez le paiement sur votre téléphone.",
      });
    }

    // Carte / Wave / checkout : le frontend doit rediriger vers redirectUrl.
    return NextResponse.json({
      success: true,
      flow: "redirect",
      reference,
      redirectUrl: result.redirectUrl,
      message: result.fallbackNotice || "Redirection vers le paiement sécurisé...",
      warning: result.fallbackNotice,
    });
  } catch (err) {
    const rawMessage = err instanceof Error ? err.message : "Impossible d'initier le paiement.";
    const message = /paymentMethod\s+".*"\s+inconnu/i.test(rawMessage)
      ? "Le mode de paiement sélectionné n'est pas disponible pour votre pays. Merci de choisir une autre option."
      : rawMessage;
    const status = /GeniusPay|n[’']a pas répondu|timeout|indisponible/i.test(rawMessage) ? 502 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}