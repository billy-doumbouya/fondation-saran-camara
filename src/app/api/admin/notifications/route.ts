import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { isAuthenticated } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  contactRepo,
  eventsRepo,
  newsRepo,
  programsRepo,
  testimonialsRepo,
  donationsRepo,
} from "@/lib/db/repo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  let databaseConnected = false;
  try {
    const authed = await isAuthenticated();
    if (!authed) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    await db.execute(sql`select 1`);
    databaseConnected = true;

    const [
      pendingMessages,
      allEvents,
      allNews,
      allPrograms,
      allTestimonials,
      allDonations,
    ] = await Promise.all([
      contactRepo.listUnread().catch(() => []),
      eventsRepo.listAll().catch(() => []),
      newsRepo.listAll().catch(() => []),
      programsRepo.listAll().catch(() => []),
      testimonialsRepo.listAll().catch(() => []),
      donationsRepo.listAll().catch(() => []),
    ]);

    const items = [];

    // 1. Messages de contact non lus
    if (pendingMessages.length > 0) {
      items.push({
        id: "messages",
        title: "Messages reçus",
        description: `${pendingMessages.length} nouveau${
          pendingMessages.length > 1 ? "x" : ""
        } message${pendingMessages.length > 1 ? "s" : ""} en attente de lecture`,
        accent: "primary" as const,
        href: "/admin/messages",
        count: pendingMessages.length,
      });
    }

    // 2. Dons récents ou en attente
    const pendingDonations = allDonations.filter((d) => d.status === "pending");
    const recentSuccessDonations = allDonations.filter(
      (d) =>
        d.status === "success" &&
        new Date(d.createdAt).getTime() > Date.now() - 7 * 86400000
    );

    if (pendingDonations.length > 0) {
      items.push({
        id: "donations-pending",
        title: "Dons en attente",
        description: `${pendingDonations.length} transaction${
          pendingDonations.length > 1 ? "s" : ""
        } de don en cours de confirmation`,
        accent: "gold" as const,
        href: "/admin/donations",
        count: pendingDonations.length,
      });
    } else if (recentSuccessDonations.length > 0) {
      items.push({
        id: "donations-success",
        title: "Dons confirmés (7 jours)",
        description: `${recentSuccessDonations.length} don${
          recentSuccessDonations.length > 1 ? "s" : ""
        } validé${recentSuccessDonations.length > 1 ? "s" : ""} récemment`,
        accent: "primary" as const,
        href: "/admin/donations",
        count: recentSuccessDonations.length,
      });
    }

    // 3. Événements à venir
    const now = new Date();
    const upcomingEvents = allEvents.filter(
      (event) => new Date(event.startAt) >= now
    );
    if (upcomingEvents.length > 0) {
      items.push({
        id: "events",
        title: "Événements à venir",
        description: `${upcomingEvents.length} rendez-vous planifié${
          upcomingEvents.length > 1 ? "s" : ""
        } dans l'agenda`,
        accent: "gold" as const,
        href: "/admin/events",
        count: upcomingEvents.length,
      });
    }

    // 4. Brouillons / Contenus non publiés
    const unpublishedNews = allNews.filter((n) => !n.published);
    const unpublishedPrograms = allPrograms.filter((p) => !p.published);
    const draftCount = unpublishedNews.length + unpublishedPrograms.length;

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
        href: unpublishedNews.length > 0 ? "/admin/news" : "/admin/programs",
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
