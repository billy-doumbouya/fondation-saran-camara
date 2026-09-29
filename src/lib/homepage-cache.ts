import { revalidateTag, unstable_cache } from "next/cache";
import {
  newsRepo,
  partnersRepo,
  programsRepo,
  testimonialsRepo,
} from "@/lib/db/repo";

export const HOMEPAGE_CACHE_TAGS = {
  news: "homepage-news",
  programs: "homepage-programs",
  testimonials: "homepage-testimonials",
} as const;

export const getHomepageNews = unstable_cache(
  () => newsRepo.listFeatured(),
  ["homepage-news-v1"],
  { revalidate: 300, tags: [HOMEPAGE_CACHE_TAGS.news] }
);

export const getHomepagePrograms = unstable_cache(
  () => programsRepo.listFeatured(),
  ["homepage-programs-v1"],
  { revalidate: 300, tags: [HOMEPAGE_CACHE_TAGS.programs] }
);

export const getHomepageTestimonials = unstable_cache(
  () => testimonialsRepo.listFeatured(),
  ["homepage-testimonials-v1"],
  { revalidate: 300, tags: [HOMEPAGE_CACHE_TAGS.testimonials] }
);

export const getHomepagePartners = unstable_cache(
  () => partnersRepo.listAll(),
  ["homepage-partners-v1"],
  { revalidate: 3600 }
);

export function revalidateHomepageData(tag: (typeof HOMEPAGE_CACHE_TAGS)[keyof typeof HOMEPAGE_CACHE_TAGS]) {
  revalidateTag(tag, { expire: 0 });
}