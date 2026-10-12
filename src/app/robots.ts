import type { MetadataRoute } from "next";
import { OFFICIAL_SITE_URL } from "@/lib/site-data";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] },
    ],
    sitemap: `${OFFICIAL_SITE_URL}/sitemap.xml`,
  };
}
