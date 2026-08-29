import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { contactRepo, eventsRepo, newsRepo, programsRepo, testimonialsRepo } from "@/lib/db/repo";

export const runtime = "nodejs";

export async function GET() {
  try {
    const authed = await isAuthenticated();
    if (!authed) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const [pendingMessages, upcomingEvents, unpublishedNews, unpublishedPrograms, unpublishedTestimonials] = await Promise.all([
      contactRepo.listAll(),
      eventsRepo.listAll(),
      newsRepo.listAll(),
      programsRepo.listAll(),
      testimonialsRepo.listAll(),
    ]);

    const items = [
      pendingMessages.length > 0
        ? {
            title: "Messages reçus",
            description: `${pendingMessages.length} message${pendingMessages.length > 1 ? "s" : ""} en attente de lecture`,
            accent: "primary" as const,
          }
        : null,
      upcomingEvents.filter((event) => new Date(event.startAt) >= new Date()).length > 0
        ? {
            title: "Événements à venir",
            description: `${upcomingEvents.filter((event) => new Date(event.startAt) >= new Date()).length} rendez-vous programmé${upcomingEvents.filter((event) => new Date(event.startAt) >= new Date()).length > 1 ? "s" : ""}`,
            accent: "gold" as const,
          }
        : null,
      unpublishedNews.length > 0 || unpublishedPrograms.length > 0 || unpublishedTestimonials.length > 0
        ? {
            title: "Contenus à relire",
            description: `${[unpublishedNews, unpublishedPrograms, unpublishedTestimonials].filter((list) => list.length > 0).reduce((sum, list) => sum + list.length, 0)} élément${[unpublishedNews, unpublishedPrograms, unpublishedTestimonials].filter((list) => list.length > 0).reduce((sum, list) => sum + list.length, 0) > 1 ? "s" : ""} nécessitent une vérification`,
            accent: "navy" as const,
          }
        : null,
    ].filter(Boolean) as Array<{ title: string; description: string; accent: "primary" | "gold" | "navy" }>;

    return NextResponse.json({ items, count: items.length });
  } catch (error) {
    console.error("Admin notifications load failed", error);
    return NextResponse.json({ error: "Erreur lors du chargement des notifications" }, { status: 500 });
  }
}
