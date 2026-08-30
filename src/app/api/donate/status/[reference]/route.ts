import { NextRequest, NextResponse } from "next/server";
import { donationsRepo } from "@/lib/db/repo";
import { getGeniusPayPayment } from "@/lib/geniuspay";

export const runtime = "nodejs";

/**
 * GET /api/donate/status/[reference]
 * Utilisé par le frontend pour poller le statut d'un paiement mobile money
 * (mode push) tant que le webhook n'a pas encore mis à jour la base.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ reference: string }> }
) {
  const { reference } = await params;

  if (!reference) {
    return NextResponse.json({ error: "Référence manquante." }, { status: 400 });
  }

  try {
    // 1. On vérifie d'abord notre propre base (mise à jour par le webhook,
    //    source de vérité la plus fiable et la plus rapide).
    const donation = await donationsRepo.findByReference(reference);
    if (donation && donation.status !== "pending") {
      return NextResponse.json({ reference, status: donation.status });
    }

    // 2. Si toujours "pending" en base, on interroge GeniusPay directement
    //    en secours (le webhook peut avoir du retard ou avoir échoué).
    const remote = await getGeniusPayPayment(reference);
    const normalized =
      remote.status === "completed"
        ? "success"
        : ["failed", "cancelled", "expired"].includes(remote.status)
        ? "failed"
        : "pending";

    if (normalized !== "pending" && donation?.status === "pending") {
      await donationsRepo.updateStatus(reference, normalized, { providerData: remote.raw });
    }

    return NextResponse.json({ reference, status: normalized });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Impossible de récupérer le statut.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}