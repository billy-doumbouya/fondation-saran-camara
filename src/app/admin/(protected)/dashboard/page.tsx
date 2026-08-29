import { newsRepo, testimonialsRepo, teamRepo, galleryRepo, programsRepo, eventsRepo, contactRepo } from "@/lib/db/repo";
import DashboardCharts from "@/components/admin/DashboardCharts";
import DashboardOverview from "@/components/admin/DashboardOverview";

export const dynamic = "force-dynamic";
export const metadata = { title: "Tableau de bord" };

async function safeCount(promise: Promise<unknown[]>) {
  try {
    return (await promise).length;
  } catch {
    return 0;
  }
}

export default async function AdminDashboardPage() {
  const [newsCount, testimonialsCount, teamCount, galleryCount, programsCount, eventsCount, messagesCount] =
    await Promise.all([
      safeCount(newsRepo.listAll()),
      safeCount(testimonialsRepo.listAll()),
      safeCount(teamRepo.listAll()),
      safeCount(galleryRepo.listAll()),
      safeCount(programsRepo.listAll()),
      safeCount(eventsRepo.listAll()),
      safeCount(contactRepo.listAll()),
    ]);

  const stats = [
    { icon: "newspaper", label: "Actualités", value: newsCount, href: "/admin/news" },
    { icon: "quote", label: "Témoignages", value: testimonialsCount, href: "/admin/testimonials" },
    { icon: "users", label: "Membres de l'équipe", value: teamCount, href: "/admin/team" },
    { icon: "image", label: "Photos en galerie", value: galleryCount, href: "/admin/gallery" },
    { icon: "graduation", label: "Programmes", value: programsCount, href: "/admin/programs" },
    { icon: "calendar", label: "Événements", value: eventsCount, href: "/admin/events" },
    { icon: "mail", label: "Messages reçus", value: messagesCount, href: "#" },
  ];

  const chartData = [
    { label: "Actualités", value: newsCount, color: "#227a3f" },
    { label: "Programmes", value: programsCount, color: "#d4a017" },
    { label: "Événements", value: eventsCount, color: "#325086" },
    { label: "Équipe", value: teamCount, color: "#4bb56d" },
    { label: "Galerie", value: galleryCount, color: "#e3b32c" },
    { label: "Avis", value: testimonialsCount, color: "#7690bd" },
  ];

  const contentTotal = stats.reduce((sum, stat) => sum + stat.value, 0);
  const quickActions = [
    { label: "Publier une actualité", href: "/admin/news", icon: "newspaper" },
    { label: "Ajouter un événement", href: "/admin/events", icon: "calendar" },
    { label: "Gérer les programmes", href: "/admin/programs", icon: "graduation" },
  ];

  return (
    <>
      <DashboardOverview stats={stats} quickActions={quickActions} contentTotal={contentTotal} />
      <DashboardCharts data={chartData} />
    </>
  );
}
