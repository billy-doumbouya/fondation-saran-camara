import { NextRequest, NextResponse } from "next/server";
import { donationsRepo } from "@/lib/db/repo";
import { donationSchema } from "@/lib/validations";
import { initGeniusPayPayment } from "@/lib/geniuspay";
import { generateReference } from "@/lib/utils";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await donationSchema.validate(body, { stripUnknown: true });

    const reference = generateReference();

    await donationsRepo.create({
      reference,
      donorName: data.donorName,
      donorEmail: data.donorEmail,
      donorPhone: data.donorPhone,
      amount: data.amount,
      currency: "GNF", // devise réelle du don, gardée en base
      provider: "geniuspay",
      status: "pending",
    });

    const { payment, providerReference } = await initGeniusPayPayment({
      reference,
      amount: data.amount,
      currency: "GNF",
      customerName: data.donorName,
      customerEmail: data.donorEmail,
      customerPhone: data.donorPhone,
    });

    await donationsRepo.updateStatus(reference, "pending", {
      payment,
      providerReference,
    });

    return NextResponse.json({
      success: true,
      reference,
      checkoutUrl: payment.checkoutUrl || payment.paymentUrl,
      payment,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Impossible d'initier le paiement.";
    const status = /GeniusPay|n[’']a pas répondu|timeout|indisponible/i.test(
      message,
    )
      ? 502
      : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
