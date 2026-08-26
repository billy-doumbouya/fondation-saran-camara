import type { Metadata } from "next";
import { GraduationCap, ShieldCheck, HandHeart, Users2 } from "lucide-react";
import AnimatedSection from "@/components/site/AnimatedSection";
import InstitutionalHero from "@/components/site/InstitutionalHero";

export const metadata: Metadata = { title: "Mission & Vision" };

const OBJECTIVES = [
  "Promouvoir l'accès à l'éducation pour les enfants vulnérables et les orphelins",
  "Sensibiliser les communautés aux droits fondamentaux de l'enfant",
  "Faciliter la scolarisation en prenant en charge frais d'inscription et de scolarité",
  "Fournir fournitures et kits scolaires aux enfants démunis",
  "Réduire le taux d'abandon scolaire lié aux difficultés financières",
  "Organiser des actions de solidarité pour les familles démunies",
  "Développer des partenariats stratégiques durables",
];

const PILLARS = [
  { icon: GraduationCap, title: "Éducation", text: "Scolarisation, appui matériel, suivi pédagogique." },
  { icon: ShieldCheck, title: "Protection de l'enfance", text: "Défense des droits, sensibilisation communautaire." },
  { icon: HandHeart, title: "Aide aux orphelins", text: "Accompagnement moral, matériel et social." },
  { icon: Users2, title: "Action sociale", text: "Soutien aux familles démunies et au développement local." },
];

const MISSION_HERO_BG =
  "https://images.unsplash.com/photo-1497486751825-1233686d5d80?q=80&w=1920&auto=format&fit=crop";

export default function MissionPage() {
  return (
    <>
      <InstitutionalHero
        image={MISSION_HERO_BG}
        imageAlt="Enfants réunis dans une salle de classe"
        eyebrow="Mission & vision"
        title="Offrir à chaque enfant les conditions d'un avenir digne"
        description="Promouvoir, accompagner et garantir l'accès à l'éducation, à la protection sociale et sanitaire, ainsi qu'à l'épanouissement global de chaque enfant vulnérable."
        badge={<span className="text-sm text-white/85">Agir aujourd&apos;hui, construire demain</span>}
      />
      <div className="bg-gradient-to-b from-white to-primary-50/30 py-14 sm:py-16">
        <div className="container-app">
          <div className="mb-7 border-b border-navy-100 pb-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-600">Notre vision en action</p>
            <h2 className="font-display mt-2 text-2xl font-bold text-navy-900 sm:text-3xl">Quatre engagements, une même ambition</h2>
          </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {PILLARS.map((p, i) => (
          <AnimatedSection key={p.title} delay={i * 0.08}>
            <div className="h-full rounded-2xl border border-navy-100 bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                <p.icon size={22} />
              </div>
              <h3 className="font-display mt-4 text-base font-semibold text-navy-900">{p.title}</h3>
              <p className="mt-2 text-sm text-navy-500">{p.text}</p>
            </div>
          </AnimatedSection>
        ))}
      </div>

      <AnimatedSection delay={0.2} className="mx-auto mt-16 max-w-3xl">
        <div className="border-b border-navy-100 pb-4">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-600">Notre feuille de route</p>
          <h2 className="font-display mt-2 text-2xl font-bold text-navy-900">Nos objectifs</h2>
        </div>
        <ul className="mt-6 space-y-3">
          {OBJECTIVES.map((o) => (
            <li key={o} className="flex gap-3 text-navy-600">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500" />
              {o}
            </li>
          ))}
        </ul>
      </AnimatedSection>
        </div>
      </div>
    </>
  );
}
