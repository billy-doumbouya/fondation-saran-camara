import { NextResponse } from "next/server";
import { donationsRepo } from "@/lib/db/repo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return NextResponse.json({ error: "CRON_SECRET non configuré." }, { status: 503 });
  }

  if (request.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  try {
    const expired = await donationsRepo.expireStalePending();
    return NextResponse.json({ expiredCount: expired.length });
  } catch (error) {
    console.error("Pending donation expiration failed:", error);
    return NextResponse.json({ error: "Expiration des dons impossible." }, { status: 500 });
  }
}