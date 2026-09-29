import {
  newsRepo,
  testimonialsRepo,
  teamRepo,
  galleryRepo,
  programsRepo,
  eventsRepo,
  contactRepo,
  newsletterRepo,
  donationsRepo,
} from "@/lib/db/repo";
import DashboardCharts from "@/components/admin/DashboardCharts";
import DashboardOverview, {
  type DashboardStat,
} from "@/components/admin/DashboardOverview";

export const dynamic = "force-dynamic";
export const metadata = { title: "Tableau de bord — Console FSCPE" };

async function safeCount(promise: Promise<unknown[]>) {
  try {
    return (await promise).length;
  } catch {
    return 0;
  }
}

export default async function AdminDashboardPage() {
  const [
    newsCount,
    testimonialsCount,
    teamCount,
    galleryCount,
    programsCount,
    eventsCount,
    messagesCount,
    newsletterCount,
    allDonations,
  ] = await Promise.all([
    safeCount(newsRepo.listAll()),
    safeCount(testimonialsRepo.listAll()),
    safeCount(teamRepo.listAll()),
    safeCount(galleryRepo.listAll()),
    safeCount(programsRepo.listAll()),
    safeCount(eventsRepo.listAll()),
    safeCount(contactRepo.listAll()),
    safeCount(newsletterRepo.listAll()),
    donationsRepo.listAll().catch(() => []),
  ]);

  const resolvedCounts = {
    newsCount: Number.isFinite(newsCount) ? newsCount : 0,
    testimonialsCount: Number.isFinite(testimonialsCount) ? testimonialsCount : 0,
    teamCount: Number.isFinite(teamCount) ? teamCount : 0,
    galleryCount: Number.isFinite(galleryCount) ? galleryCount : 0,
    programsCount: Number.isFinite(programsCount) ? programsCount : 0,
    eventsCount: Number.isFinite(eventsCount) ? eventsCount : 0,
    messagesCount: Number.isFinite(messagesCount) ? messagesCount : 0,
    newsletterCount: Number.isFinite(newsletterCount) ? newsletterCount : 0,
  };

  const donationsTotalGNF = allDonations
    .filter((d) => d.status === "success")
    .reduce((sum, d) => sum + d.amount, 0);

  const stats: DashboardStat[] = [
    {
      icon: "newspaper",
      label: "Actualités & Blog",
      value: resolvedCounts.newsCount,
      href: "/admin/news",
      accent: "primary",
      description: "Articles publiés ou brouillons",
    },
    {
      icon: "calendar",
      label: "Agenda & Événements",
      value: resolvedCounts.eventsCount,
      href: "/admin/events",
      accent: "navy",
      description: "Cérémonies et distributions",
    },
    {
      icon: "graduation",
      label: "Programmes ODD",
      value: resolvedCounts.programsCount,
      href: "/admin/programs",
      accent: "gold",
      description: "Piliers humanitaires actifs",
    },
    {
      icon: "image",
      label: "Photos en galerie",
      value: resolvedCounts.galleryCount,
      href: "/admin/gallery",
      accent: "sky",
      description: "Albums et reportages de terrain",
    },
    {
      icon: "quote",
      label: "Témoignages vérifiés",
      value: resolvedCounts.testimonialsCount,
      href: "/admin/testimonials",
      accent: "primary",
      description: "Retours des partenaires & parrains",
    },
    {
      icon: "users",
      label: "Équipe & Conseil",
      value: resolvedCounts.teamCount,
      href: "/admin/team",
      accent: "navy",
      description: "Direction et gouvernance FSCPE",
    },
    {
      icon: "mail",
      label: "Messages reçus",
      value: resolvedCounts.messagesCount,
      href: "/admin/messages",
      accent: "rose",
      description: "Demandes via le formulaire public",
    },
    {
      icon: "send",
      label: "Abonnés Newsletter",
      value: resolvedCounts.newsletterCount,
      href: "/admin/newsletter",
      accent: "gold",
      description: "Liste de diffusion engagée",
    },
  ];

  const chartData = [
    { label: "Actualités", value: resolvedCounts.newsCount, color: "#1b7a42" },
    { label: "Programmes", value: resolvedCounts.programsCount, color: "#d4a017" },
    { label: "Événements", value: resolvedCounts.eventsCount, color: "#1e3a8a" },
    { label: "Galerie", value: resolvedCounts.galleryCount, color: "#0284c7" },
    { label: "Équipe", value: resolvedCounts.teamCount, color: "#059669" },
    { label: "Témoignages", value: resolvedCounts.testimonialsCount, color: "#9333ea" },
  ];

  const contentTotal = stats.reduce((sum, stat) => sum + stat.value, 0);

  const quickActions = [
    { label: "Publier une actualité", href: "/admin/news", icon: "newspaper" },
    { label: "Ajouter un événement", href: "/admin/events", icon: "calendar" },
    { label: "Gérer les programmes", href: "/admin/programs", icon: "graduation" },
  ];

  return (
    <div className="space-y-8">
      <DashboardOverview
        stats={stats}
        quickActions={quickActions}
        contentTotal={contentTotal}
        donationsTotalGNF={donationsTotalGNF}
        donationsCount={allDonations.length}
      />
      <DashboardCharts data={chartData} />
    </div>
  );
}
