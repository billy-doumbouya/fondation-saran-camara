import type { Metadata } from "next";
import { Suspense } from "react";
import { Toaster } from "sonner";
import QueryProvider from "@/components/providers/QueryProvider";
import ProgressBarProvider from "@/components/providers/ProgressBarProvider";
import { BRAND } from "@/lib/site-data";
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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://fscpe.org"),
  title: {
    default: `${BRAND.fullName} (${BRAND.acronym})`,
    template: `%s | ${BRAND.acronym}`,
  },
  description:
    "La Fondation Saran Camara pour l'Éducation et la Protection des Enfants scolarise, protège et accompagne les enfants orphelins et vulnérables de Guinée.",
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
    title: `${BRAND.fullName} (${BRAND.acronym})`,
    description: BRAND.slogan,
    siteName: BRAND.acronym,
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND.fullName} (${BRAND.acronym})`,
    description: BRAND.slogan,
  },
  robots: { index: true, follow: true },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "NGO",
  name: BRAND.fullName,
  alternateName: BRAND.acronym,
  slogan: BRAND.slogan,
  email: BRAND.email,
  telephone: BRAND.phone,
  foundingDate: "2026",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Kissosso, Commune de Matoto",
    addressLocality: "Conakry",
    addressCountry: "GN",
  },
  founder: { "@type": "Person", name: BRAND.founderName },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
