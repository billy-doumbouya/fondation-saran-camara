import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Database,
  Eye,
  UserCheck,
  Mail,
  FileText,
  Cookie,
  Scale,
} from "lucide-react";
import AnimatedSection from "@/components/site/AnimatedSection";
import InstitutionalHero from "@/components/site/InstitutionalHero";
import SectionHeading from "@/components/site/SectionHeading";
import { BRAND } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Politique de Confidentialité — Fondation Saran Camara (FSCPE)",
  description:
    "Comment la Fondation Saran Camara (FSCPE) collecte, utilise et protège vos données personnelles : dons, parrainage, newsletter et contact. Transparence et conformité au RGPD.",
};

const PRIVACY_HERO_BG =
  "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=1920&auto=format&fit=crop";

const COMMITMENTS = [
  {
    icon: Lock,
    title: "Confidentialité garantie",
    text: "Vos informations ne sont jamais vendues, louées ni partagées avec des tiers à des fins commerciales.",
  },
  {
    icon: Eye,
    title: "Transparence totale",
    text: "Chaque collecte de données est expliquée clairement : finalité, durée de conservation et destinataires.",
  },
  {
    icon: UserCheck,
    title: "Vos droits respectés",
    text: "Accès, rectification, suppression : vous gardez le contrôle de vos données à tout moment.",
  },
  {
    icon: ShieldCheck,
    title: "Sécurité renforcée",
    text: "Chiffrement des échanges, accès restreint et mesures techniques adaptées à la nature des données.",
  },
] as const;

const SECTIONS = [
  {
    id: "responsable",
    icon: Scale,
    title: "1. Responsable du traitement",
    body: [
      `La Fondation Saran Camara pour l'Éducation et la Protection des Enfants (FSCPE), ONG agréée en République de Guinée, dont le siège est situé à ${BRAND.address}, est responsable du traitement des données personnelles collectées via ce site.`,
      "Toute demande relative à vos données peut être adressée à notre équipe via les coordonnées indiquées en bas de page.",
    ],
  },
  {
    id: "donnees-collectees",
    icon: Database,
    title: "2. Données que nous collectons",
    body: [
      "Selon votre navigation et vos interactions, nous pouvons collecter :",
    ],
    list: [
      "Données d'identité et de contact : nom, prénom, adresse e-mail, numéro de téléphone (formulaire de contact, don, parrainage, newsletter) ;",
      "Données de don : montant, fréquence, informations de transaction — les coordonnées bancaires complètes ne sont jamais stockées sur nos serveurs ;",
      "Données de navigation : pages consultées, durée de visite, type d'appareil, via des cookies et outils de mesure d'audience ;",
      "Contenu de vos échanges : messages transmis via le formulaire de contact ou le chatbot.",
    ],
  },
  {
    id: "finalites",
    icon: FileText,
    title: "3. Finalités du traitement",
    body: [
      "Vos données sont utilisées exclusivement pour :",
    ],
    list: [
      "Répondre à vos demandes de contact, de partenariat ou de volontariat ;",
      "Traiter vos dons et gérer votre parrainage, y compris l'envoi de reçus et de justificatifs ;",
      "Vous transmettre, avec votre consentement, notre newsletter et nos appels à l'action ;",
      "Améliorer le fonctionnement, la sécurité et la qualité de notre site ;",
      "Respecter nos obligations légales, comptables et de redevabilité envers nos partenaires.",
    ],
  },
  {
    id: "base-legale",
    icon: Scale,
    title: "4. Bases légales du traitement",
    body: [
      "Les traitements reposent sur votre consentement (newsletter, cookies non essentiels), l'exécution d'un contrat ou d'une démarche d'adhésion (dons, parrainage), notre intérêt légitime à améliorer nos services, et nos obligations légales de conservation comptable.",
    ],
  },
  {
    id: "conservation",
    icon: Database,
    title: "5. Durée de conservation",
    body: [
      "Les données de contact sont conservées jusqu'à 3 ans après notre dernier échange. Les données liées aux dons sont conservées pendant la durée requise par les obligations comptables et fiscales en vigueur. Les données de navigation sont conservées au maximum 13 mois.",
    ],
  },
  {
    id: "destinataires",
    icon: Eye,
    title: "6. Destinataires et sous-traitants",
    body: [
      "Vos données ne sont accessibles qu'aux membres habilités de la FSCPE. Certains prestataires techniques (hébergement, paiement sécurisé, envoi d'e-mails, signature d'images) peuvent y accéder dans la stricte limite de leurs missions. Aucune donnée n'est cédée à des fins publicitaires.",
    ],
  },
  {
    id: "cookies",
    icon: Cookie,
    title: "7. Cookies et traceurs",
    body: [
      "Le site utilise des cookies strictement nécessaires à son fonctionnement (session, sécurité, préférences). Les cookies de mesure d'audience ne sont déposés qu'avec votre accord ; vous pouvez à tout moment configurer votre navigateur pour les refuser ou les supprimer.",
    ],
  },
  {
    id: "securite",
    icon: Lock,
    title: "8. Sécurité des données",
    body: [
      "Nous mettons en œuvre des mesures techniques et organisationnelles adaptées : chiffrement des communications (HTTPS), restriction des accès, journalisation et sauvegardes. En cas de violation de données susceptible d'engendrer un risque élevé, nous nous engageons à vous informer dans les meilleurs délais.",
    ],
  },
  {
    id: "droits",
    icon: UserCheck,
    title: "9. Vos droits",
    body: [
      "Conformément à la réglementation applicable en matière de protection des données (dont le RGPD pour les résidents de l'Union européenne), vous disposez des droits suivants :",
    ],
    list: [
      "Droit d'accès à vos données et d'obtention d'une copie ;",
      "Droit de rectification des données inexactes ou incomplètes ;",
      "Droit à l'effacement (« droit à l'oubli ») ;",
      "Droit d'opposition et de retrait du consentement à tout moment ;",
      "Droit à la portabilité de vos données ;",
      "Droit d'introduire une réclamation auprès d'une autorité de contrôle.",
    ],
  },
  {
    id: "contact-dpo",
    icon: Mail,
    title: "10. Exercer vos droits & nous contacter",
    body: [
      `Pour exercer vos droits ou poser toute question relative à vos données, écrivez-nous à ${BRAND.email} ou appelez-nous au ${BRAND.phone}. Nous nous engageons à répondre sous 30 jours maximum.`,
    ],
  },
] as const;

export default function ConfidentialitePage() {
  return (
    <>
      <InstitutionalHero
        image={PRIVACY_HERO_BG}
        imageAlt="Cadenas symbolisant la protection des données"
        eyebrow="Confidentialité & données personnelles"
        title="Vos données méritent la même protection que les enfants que nous accompagnons."
        description="La confiance de nos donateurs, parrains et partenaires est le socle de notre action. Cette politique explique, en toute transparence, comment nous collectons, utilisons et protégeons vos informations personnelles."
        badge="Conforme au RGPD"
      />

      {/* ——— Engagements clés ——— */}
      <section className="relative overflow-hidden py-20 sm:py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "linear-gradient(180deg, #ffffff 0%, var(--background) 50%, var(--color-primary-50) 100%)",
          }}
        />

        <div className="container-app relative">
          <AnimatedSection>
            <SectionHeading
              eyebrow="Nos engagements"
              title="Quatre principes qui guident notre gestion des données"
              description="La protection de vos informations personnelles est traitée avec le même sérieux que la protection de l'enfance."
            />
          </AnimatedSection>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {COMMITMENTS.map((c, i) => {
              const Icon = c.icon;
              return (
                <AnimatedSection key={c.title} delay={i * 0.06}>
                  <div className="group relative h-full overflow-hidden hairline bg-white rounded-lg p-6 transition-all duration-300 hover:hairline-strong hover:-translate-y-1">
                    <span
                      className="absolute inset-x-0 top-0 h-0.5 bg-gold-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      aria-hidden
                    />
                    <div className="flex h-11 w-11 items-center justify-center rounded-md bg-primary-50 text-primary-600 transition-colors duration-300 group-hover:bg-primary-600 group-hover:text-white">
                      <Icon size={20} strokeWidth={1.75} />
                    </div>
                    <h3 className="font-display mt-4 text-base font-semibold text-navy-900">
                      {c.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-navy-500">
                      {c.text}
                    </p>
                    <span className="mt-4 inline-block font-mono text-[0.625rem] uppercase tracking-widest text-navy-300">
                      0{i + 1} / 0{COMMITMENTS.length}
                    </span>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* ——— Corps de la politique ——— */}
      <section className="relative border-t border-navy-100 bg-white py-20 sm:py-24">
        <div className="container-app relative">
          <div className="mx-auto max-w-3xl">
            <AnimatedSection>
              <SectionHeading
                align="left"
                eyebrow="Politique de confidentialité"
                title="Tout ce que vous devez savoir"
                description="Dernière mise à jour : septembre 2026. Cette politique s'applique à l'ensemble du site fondationsarancamara.org et de ses services associés."
              />
            </AnimatedSection>

            <div className="mt-12 space-y-10">
              {SECTIONS.map((s, i) => {
                const Icon = s.icon;
                return (
                  <AnimatedSection key={s.id} delay={i * 0.04}>
                    <article
                      id={s.id}
                      className="relative overflow-hidden hairline rounded-lg bg-white p-6 sm:p-8"
                    >
                      <span
                        className="absolute inset-y-0 left-0 w-0.5 bg-linear-to-b from-primary-600 to-gold-500"
                        aria-hidden
                      />
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary-50 text-primary-600">
                          <Icon size={18} strokeWidth={1.75} />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-display text-lg font-semibold text-navy-900 sm:text-xl">
                            {s.title}
                          </h3>
                          {s.body.map((p, j) => (
                            <p
                              key={j}
                              className="mt-3 text-sm leading-relaxed text-navy-600 sm:text-[0.9375rem]"
                            >
                              {s.body[j]}
                            </p>
                          ))}
                          {"list" in s && s.list && (
                            <ul className="mt-3 space-y-2">
                              {s.list.map((item, j) => (
                                <li
                                  key={j}
                                  className="flex items-start gap-2.5 text-sm leading-relaxed text-navy-600"
                                >
                                  <span
                                    className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500"
                                    aria-hidden
                                  />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </article>
                  </AnimatedSection>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ——— Bandeau CTA : exercer ses droits ——— */}
      <section className="relative overflow-hidden bg-navy-950 py-16 text-white sm:py-20">
        <div
          aria-hidden
          className="absolute inset-0 opacity-90"
          style={{
            background:
              "linear-gradient(115deg, var(--color-primary-800) 0%, var(--color-navy-900) 60%, var(--color-navy-800) 100%)",
          }}
        />
        <div className="absolute inset-0 grid-overlay opacity-25" aria-hidden />
        <span
          className="absolute inset-x-0 top-0 h-px bg-gold-500/40"
          aria-hidden
        />

        <div className="container-app relative z-10">
          <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
            <div>
              <div className="flex items-center justify-center gap-2 sm:justify-start">
                <ShieldCheck size={18} className="text-gold-400" />
                <span className="font-mono text-xs uppercase tracking-widest text-gold-400">
                  Une question sur vos données ?
                </span>
              </div>
              <h4 className="font-display mt-2 text-2xl font-bold text-white">
                Notre équipe vous répond sous 30 jours.
              </h4>
              <p className="mt-1 text-sm text-navy-200">
                Accès, rectification, suppression : écrivez-nous, nous traitons
                chaque demande avec attention.
              </p>
            </div>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-xl bg-gold-500 px-6 py-3.5 font-display text-sm font-semibold text-navy-950 shadow-lg shadow-gold-500/20 transition-all duration-200 hover:bg-gold-400 hover:shadow-xl hover:shadow-gold-500/30"
            >
              <span>Nous contacter</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
