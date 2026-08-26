import { Newspaper, Quote, Users2, Image as ImageIcon, GraduationCap, CalendarDays, Mail } from "lucide-react";
import { newsRepo, testimonialsRepo, teamRepo, galleryRepo, programsRepo, eventsRepo, contactRepo } from "@/lib/db/repo";

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
    { icon: Newspaper, label: "Actualités", value: newsCount, href: "/admin/news" },
    { icon: Quote, label: "Témoignages", value: testimonialsCount, href: "/admin/testimonials" },
    { icon: Users2, label: "Membres de l'équipe", value: teamCount, href: "/admin/team" },
    { icon: ImageIcon, label: "Photos en galerie", value: galleryCount, href: "/admin/gallery" },
    { icon: GraduationCap, label: "Programmes", value: programsCount, href: "/admin/programs" },
    { icon: CalendarDays, label: "Événements", value: eventsCount, href: "/admin/events" },
    { icon: Mail, label: "Messages reçus", value: messagesCount, href: "#" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-navy-900">Tableau de bord</h1>
      <p className="mt-1 text-navy-500">Vue d&apos;ensemble du contenu de la fondation.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <a
            key={s.label}
            href={s.href}
            className="rounded-2xl border border-navy-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
              <s.icon size={18} />
            </div>
            <p className="font-display mt-3 text-2xl font-bold text-navy-900">{s.value}</p>
            <p className="mt-1 text-sm text-navy-500">{s.label}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
