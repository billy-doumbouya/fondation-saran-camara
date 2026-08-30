import type { Metadata } from "next";
import { Suspense } from "react";
import { Toaster } from "sonner";
import QueryProvider from "@/components/providers/QueryProvider";
import ProgressBarProvider from "@/components/providers/ProgressBarProvider";
import { DEFAULT_BRAND } from "@/lib/site-data";
import { getSiteSettings } from "@/lib/site-settings";
// Polices auto-hébergées via @fontsource (aucune requête réseau vers Google
// Fonts au build ni en production — plus rapide, plus fiable, RGPD-friendly).
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource/poppins/800.css";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const brand = { ...DEFAULT_BRAND, ...settings };

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://fscpe.org"),
    title: {
      default: `${brand.fullName} (${brand.acronym})`,
      template: `%s | ${brand.acronym}`,
    },
    icons: {
      icon: "/icon.png",
      apple: "/icon.png",
    },
    description: brand.slogan,
    keywords: [
      "fondation Guinée",
      "éducation enfants Guinée",
      "orphelins Conakry",
      "ONG Guinée",
      "Saran Camara",
      "protection de l'enfance",
    ],
    openGraph: {
      type: "website",
      locale: "fr_GN",
      title: `${brand.fullName} (${brand.acronym})`,
      description: brand.slogan,
      siteName: brand.acronym,
    },
    twitter: {
      card: "summary_large_image",
      title: `${brand.fullName} (${brand.acronym})`,
      description: brand.slogan,
    },
    robots: { index: true, follow: true },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
  const brand = { ...DEFAULT_BRAND, ...settings };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: brand.fullName,
    alternateName: brand.acronym,
    slogan: brand.slogan,
    email: brand.email,
    telephone: brand.phone,
    foundingDate: "2026",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Kissosso, Commune de Matoto",
      addressLocality: "Conakry",
      addressCountry: "GN",
    },
    founder: { "@type": "Person", name: brand.founderName },
  };
  return (
    <html lang="fr">
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <Suspense fallback={null}>
          <ProgressBarProvider />
        </Suspense>
        <QueryProvider>
          {children}
          <Toaster richColors position="top-center" />
        </QueryProvider>
      </body>
    </html>
  );
}
