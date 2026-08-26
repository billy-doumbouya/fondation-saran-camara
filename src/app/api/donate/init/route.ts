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
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin;

    await donationsRepo.create({
      reference,
      donorName: data.donorName,
      donorEmail: data.donorEmail,
      donorPhone: data.donorPhone,
      amount: data.amount,
      currency: "GNF",
      provider: "geniuspay",
      status: "pending",
    });

    const { redirectUrl } = await initGeniusPayPayment({
      reference,
      amount: data.amount,
      currency: "GNF",
      customerName: data.donorName,
      customerEmail: data.donorEmail,
      customerPhone: data.donorPhone,
      callbackUrl: `${siteUrl}/api/donate/webhook`,
      redirectUrl: `${siteUrl}/don/merci?ref=${reference}`,
    });

    return NextResponse.json({ redirectUrl, reference });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Impossible d'initier le paiement.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
