import type { Metadata } from "next";
import { GraduationCap, Users2, HandHeart, MapPin } from "lucide-react";
import AnimatedSection from "@/components/site/AnimatedSection";
import InstitutionalHero from "@/components/site/InstitutionalHero";
import { programsRepo } from "@/lib/db/repo";

export const metadata: Metadata = { title: "Notre Impact" };
export const dynamic = "force-dynamic";

const IMPACT_HERO_BG =
  "https://images.unsplash.com/photo-1497486751825-1233686d5d80?q=80&w=1920&auto=format&fit=crop";

export default async function ImpactPage() {
  const programs = await programsRepo.listPublished().catch(() => []);
  const totalBeneficiaries = programs.reduce((sum, p) => sum + (p.beneficiariesCount ?? 0), 0);

  const stats = [
    { icon: Users2, value: totalBeneficiaries || "100+", label: "Enfants bénéficiaires" },
    { icon: GraduationCap, value: programs.length || "—", label: "Programmes actifs" },
    { icon: HandHeart, value: "4", label: "Piliers d'intervention" },
    { icon: MapPin, value: "Conakry", label: "Zone d'intervention actuelle" },
  ];

  return (
    <>
      <InstitutionalHero
        image={IMPACT_HERO_BG}
        imageAlt="Élèves réunis dans une salle de classe"
        eyebrow="Impact"
        title="Des résultats concrets pour les enfants"
        description="Chaque chiffre représente une vie transformée grâce au soutien de nos donateurs et partenaires."
        badge={<span className="text-sm text-white/85">Mesurer pour mieux agir</span>}
      />
      <div className="bg-gradient-to-b from-white to-primary-50/30 py-14 sm:py-16">
        <div className="container-app">
          <div className="mb-7 border-b border-navy-100 pb-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-600">Nos repères</p>
            <h2 className="font-display mt-2 text-2xl font-bold text-navy-900 sm:text-3xl">L&apos;impact en quelques chiffres</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <AnimatedSection key={s.label} delay={i * 0.08}>
            <div className={`h-full rounded-2xl border border-navy-100 bg-white p-6 shadow-sm ${i === 0 ? "lg:col-span-2 lg:bg-navy-900 lg:text-white" : ""}`}>
              <s.icon className={i === 0 ? "text-primary-400" : "text-primary-500"} size={28} />
              <p className={`font-display mt-5 text-4xl font-bold ${i === 0 ? "text-white sm:text-5xl" : "text-navy-900"}`}>{s.value}</p>
              <p className={`mt-1 text-sm ${i === 0 ? "text-white/70" : "text-navy-500"}`}>{s.label}</p>
            </div>
          </AnimatedSection>
        ))}
          </div>
          <AnimatedSection delay={0.2} className="mx-auto mt-14 max-w-3xl rounded-2xl border border-primary-100 bg-primary-50/60 p-7 text-navy-600 sm:p-9">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-700">Notre exigence de transparence</p>
            <p className="mt-4 leading-7">
          Le processus de sélection des bénéficiaires privilégie les orphelins complets, puis les orphelins de
          père ou de mère, et enfin les enfants en situation d&apos;abandon familial ou de décrochage scolaire
          imminent lié à l&apos;extrême pauvreté. Aucun fonds n&apos;est versé en espèces aux familles : la fondation
          paie directement les établissements scolaires partenaires, contre reçu officiel.
            </p>
          </AnimatedSection>
        </div>
      </div>
    </>
  );
}
