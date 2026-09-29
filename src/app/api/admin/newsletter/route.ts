import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { settingsRepo } from "@/lib/db/repo";

export const runtime = "nodejs";

export async function GET() {
  try {
    const authed = await isAuthenticated();
    if (!authed) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const subscribers = await settingsRepo.listNewsletterSubscribers();

    return NextResponse.json(
      subscribers.map((subscriber) => ({
        ...subscriber,
        subscribedAt: subscriber.subscribedAt ?? null,
        updatedAt: subscriber.updatedAt?.toISOString?.() ?? null,
      })),
    );
  } catch (error) {
    console.error("Admin newsletter load failed", error);
    return NextResponse.json(
      { error: "Erreur lors du chargement des abonnés" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const authed = await isAuthenticated();
    if (!authed) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    const key = typeof body?.key === "string" ? body.key.trim() : "";

    if (!key || !key.startsWith("newsletter:")) {
      return NextResponse.json({ error: "Clé invalide" }, { status: 400 });
    }

    await settingsRepo.remove(key);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin newsletter delete failed", error);
    return NextResponse.json(
      { error: "Impossible de supprimer l’abonné" },
      { status: 500 },
    );
  }
}
