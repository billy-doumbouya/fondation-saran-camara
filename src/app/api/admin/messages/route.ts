import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { contactRepo } from "@/lib/db/repo";

export const runtime = "nodejs";

export async function GET() {
  try {
    const authed = await isAuthenticated();
    if (!authed) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const messages = await contactRepo.listAll();
    return NextResponse.json(
      messages.map((message) => ({
        ...message,
        createdAt: message.createdAt?.toISOString?.() ?? null,
      }))
    );
  } catch (error) {
    console.error("Admin messages load failed", error);
    return NextResponse.json({ error: "Erreur lors du chargement des messages" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const authed = await isAuthenticated();
    if (!authed) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const id = Number(body?.id);
    if (!id || Number.isNaN(id)) {
      return NextResponse.json({ error: "Identifiant invalide" }, { status: 400 });
    }

    await contactRepo.markRead(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin message read failed", error);
    return NextResponse.json({ error: "Impossible de marquer le message comme lu" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const authed = await isAuthenticated();
    if (!authed) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    const id = Number(body?.id);
    if (!Number.isSafeInteger(id) || id <= 0) {
      return NextResponse.json({ error: "Identifiant invalide" }, { status: 400 });
    }

    const [deletedMessage] = await contactRepo.remove(id);
    if (!deletedMessage) {
      return NextResponse.json({ error: "Message introuvable" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin message delete failed", error);
    return NextResponse.json({ error: "Impossible de supprimer le message" }, { status: 500 });
  }
}
