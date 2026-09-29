import type { MetadataRoute } from "next";
import { newsRepo, programsRepo } from "@/lib/db/repo";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://fscpe.org";

  const staticRoutes = [
    "",
    "/a-propos",
    "/mission",
    "/equipe",
    "/programmes",
    "/impact",
    "/actualites",
    "/temoignages",
    "/partenaires",
    "/galerie",
    "/agenda",
    "/don",
    "/contact",
    "/confidentialite",
    "/mentions-legales",
  ].map((path) => ({

    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const [news, programs] = await Promise.all([
    newsRepo.listPublished().catch(() => []),
    programsRepo.listPublished().catch(() => []),
  ]);

  const newsRoutes = news.map((n) => ({
    url: `${baseUrl}/actualites/${n.slug}`,
    lastModified: n.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  const programRoutes = programs.map((p) => ({
    url: `${baseUrl}/programmes/${p.slug}`,
    lastModified: p.createdAt,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...newsRoutes, ...programRoutes];
}
