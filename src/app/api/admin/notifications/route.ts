import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { adminNotificationsRepo, contactRepo } from "@/lib/db/repo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  let databaseConnected = false;
  try {
    const authed = await isAuthenticated();
    if (!authed) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const counts = await adminNotificationsRepo.getCounts().catch((error) => {
      console.warn("Neon notifications query failed", error);
      return null;
    });
    databaseConnected = counts !== null;
    const {
      pendingMessages,
      pendingDonations,
      recentSuccessDonations,
      upcomingEvents,
      unpublishedNews,
      unpublishedPrograms,
    } = counts ?? {
      pendingMessages: 0,
      pendingDonations: 0,
      recentSuccessDonations: 0,
      upcomingEvents: 0,
      unpublishedNews: 0,
      unpublishedPrograms: 0,
    };

    const items = [];

    // 1. Messages de contact non lus
    if (pendingMessages > 0) {
      items.push({
        id: "messages",
        title: "Messages reçus",
        description: `${pendingMessages} nouveau${
          pendingMessages > 1 ? "x" : ""
        } message${pendingMessages > 1 ? "s" : ""} en attente de lecture`,
        accent: "primary" as const,
        href: "/admin/messages",
        count: pendingMessages,
      });
    }

    // 2. Dons récents ou en attente
    if (pendingDonations > 0) {
      items.push({
        id: "donations-pending",
        title: "Dons en attente",
        description: `${pendingDonations} transaction${
          pendingDonations > 1 ? "s" : ""
        } de don en cours de confirmation`,
        accent: "gold" as const,
        href: "/admin/donations",
        count: pendingDonations,
      });
    } else if (recentSuccessDonations > 0) {
      items.push({
        id: "donations-success",
        title: "Dons confirmés (7 jours)",
        description: `${recentSuccessDonations} don${
          recentSuccessDonations > 1 ? "s" : ""
        } validé${recentSuccessDonations > 1 ? "s" : ""} récemment`,
        accent: "primary" as const,
        href: "/admin/donations",
        count: recentSuccessDonations,
      });
    }

    // 3. Événements à venir
    if (upcomingEvents > 0) {
      items.push({
        id: "events",
        title: "Événements à venir",
        description: `${upcomingEvents} rendez-vous planifié${
          upcomingEvents > 1 ? "s" : ""
        } dans l'agenda`,
        accent: "gold" as const,
        href: "/admin/events",
        count: upcomingEvents,
      });
    }

    // 4. Brouillons / Contenus non publiés
    const draftCount = unpublishedNews + unpublishedPrograms;

    if (draftCount > 0) {
      items.push({
        id: "drafts",
        title: "Contenus en brouillon",
        description: `${draftCount} article${
          draftCount > 1 ? "s" : ""
        } ou programme${draftCount > 1 ? "s" : ""} non encore publié${
          draftCount > 1 ? "s" : ""
        }`,
        accent: "navy" as const,
        href: unpublishedNews > 0 ? "/admin/news" : "/admin/programs",
        count: draftCount,
      });
    }

    const totalCount = items.reduce((sum, item) => sum + (item.count || 1), 0);

    return NextResponse.json({
      items,
      count: items.length,
      totalCount,
      databaseConnected,
    });
  } catch (error) {
    console.error("Admin notifications load failed", error);
    return NextResponse.json(
      { error: "Erreur lors du chargement des notifications", databaseConnected },
      { status: 500 }
    );
  }
}

export async function PATCH() {
  try {
    const authed = await isAuthenticated();
    if (!authed) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const updatedMessages = await contactRepo.markAllRead();
    return NextResponse.json({ success: true, updatedCount: updatedMessages.length });
  } catch (error) {
    console.error("Admin notifications mark-read failed", error);
    return NextResponse.json(
      { error: "Impossible de marquer les messages comme lus" },
      { status: 500 }
    );
  }
}
