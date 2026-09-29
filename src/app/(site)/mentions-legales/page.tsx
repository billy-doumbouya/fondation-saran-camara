import type { Metadata } from "next";
import Link from "next/link";
import {
  Scale,
  Building2,
  ShieldCheck,
  Server,
  FileCheck2,
  CreditCard,
  HeartHandshake,
  AlertCircle,
  FileText,
  Mail,
  Users2,
  ExternalLink,
} from "lucide-react";
import AnimatedSection from "@/components/site/AnimatedSection";
import InstitutionalHero from "@/components/site/InstitutionalHero";
import SectionHeading from "@/components/site/SectionHeading";
import { BRAND } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Mentions Légales & Statuts — Fondation Saran Camara (FSCPE)",
  description:
    "Mentions légales officielles de la Fondation Saran Camara pour l'Éducation et la Protection des Enfants (FSCPE). Statut ONG en Guinée, gouvernance, hébergement, dons sécurisés et charte de protection de l'enfance.",
  openGraph: {
    title: "Mentions Légales — Fondation Saran Camara (FSCPE)",
    description:
      "Informations institutionnelles, statut d'ONG en République de Guinée, gouvernance et conformité légale de la FSCPE.",
    type: "website",
  },
};

const LEGAL_HERO_BG =
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1920&auto=format&fit=crop";

const COMMITMENTS = [
  {
    icon: Building2,
    title: "ONG reconnue en Guinée",
    text: "Organisation humanitaire officielle, enregistrée et agréée pour la protection et l'éducation de l'enfance.",
  },
  {
    icon: HeartHandshake,
    title: "But non lucratif & laïque",
    text: "Gestion strictement désintéressée : l'intégralité des ressources est dédiée au bien-être des enfants orphelins.",
  },
  {
    icon: ShieldCheck,
    title: "Sauvegarde de l'enfant",
    text: "Respect absolu de la dignité, de l'anonymat et de l'intégrité de chaque enfant conformément à la CIDE (ONU).",
  },
  {
    icon: FileCheck2,
    title: "Redevabilité & Transparence",
    text: "Traçabilité des dons, conventions partenariales formelles et bilans pédagogiques documentés.",
  },
] as const;

const SECTIONS = [
  {
    id: "editeur",
    icon: Building2,
    title: "1. Identification légale & Éditeur du site",
    body: [
      `Le présent site internet officiel accessible à l'adresse fscpe.org (et ses sous-domaines associés) est édité par la ${BRAND.fullName} (connue sous le sigle officiel ${BRAND.acronym}).`,
      "La Fondation Saran Camara est une Organisation Non Gouvernementale (ONG) de droit guinéen, à vocation humanitaire, sociale, éducative et d'intérêt général, régie par les lois et règlements applicables aux associations et ONG en République de Guinée.",
    ],
    list: [
      `Dénomination officielle : ${BRAND.fullName} (${BRAND.acronym}) ;`,
      `Siège social : ${BRAND.address} ;`,
      `Téléphone standard : ${BRAND.phone} / ${BRAND.phoneSecondary || "+224 628 53 22 14"} ;`,
      `Courriel institutionnel : ${BRAND.email} ;`,
      "Reconnaissance institutionnelle : ONG agréée auprès des autorités compétentes de la République de Guinée ;",
      "Statut : Organisation non gouvernementale à but non lucratif, apolitique et laïque.",
    ],
  },
  {
    id: "gouvernance",
    icon: Users2,
    title: "2. Direction de la publication & Gouvernance",
    body: [
      `La direction et la responsabilité éditoriale de la publication sont assurées par Mme ${BRAND.founderName}, en sa qualité de Présidente-Fondatrice de la ${BRAND.acronym}.`,
      "La gouvernance de la Fondation s'articule autour d'un Conseil d'Administration et d'un Bureau Exécutif collégial veillant au strict respect des orientations humanitaires, des statuts fondateurs et de l'éthique opérationnelle sur le terrain.",
    ],
  },
  {
    id: "hebergement",
    icon: Server,
    title: "3. Prestataires d'hébergement & Infrastructure technique",
    body: [
      "Le site et ses services numériques sont propulsés par une infrastructure cloud sécurisée de classe internationale assurant haute disponibilité, intégrité et chiffrement de bout en bout :",
    ],
    list: [
      "Hébergement Web & Edge : Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis (chiffrement TLS 1.3, protection anti-DDoS, infrastructure mondiale) ;",
      "Base de données sécurisée : Neon Inc., infrastructure serverless PostgreSQL hébergée en environnement certifié SOC 2 Type II et ISO 27001 (données chiffrées au repos AES-256) ;",
      "Gestion des contenus multimédias : Cloudinary Inc., 3400 Central Expressway, Santa Clara, CA 95054, États-Unis (distribution CDN haut débit et stockage sécurisé) ;",
      "Sécurité des échanges : Certificat SSL/TLS actif avec forçage automatique des protocoles HTTPS sur l'ensemble des pages.",
    ],
  },
  {
    id: "mission-statut",
    icon: Scale,
    title: "4. Objet social, désintéressement & Agrément humanitaire",
    body: [
      `Conformément à ses statuts constitutifs, la ${BRAND.acronym} a pour mission fondamentale d'assurer la scolarisation effective, le suivi éducatif, la protection juridique et sociale, ainsi que l'accompagnement digne des enfants orphelins et vulnérables en République de Guinée.`,
      "En vertu du principe de gestion désintéressée, les membres de la direction et du bureau exécutif exercent leurs responsabilités dans un esprit de dévouement humanitaire. La fondation ne poursuit aucun but lucratif et ne procède à aucune distribution de bénéfices : la totalité des dons, legs et subventions est affectée à la réalisation directe des programmes sur le terrain.",
    ],
  },
  {
    id: "dons-securite",
    icon: CreditCard,
    title: "5. Traçabilité des dons, transactions & Redevabilité",
    body: [
      "Les dons financiers effectués en ligne constituent le moteur de notre indépendance et de nos actions concrètes. La FSCPE applique un protocole rigoureux de transparence et de sécurité financière :",
    ],
    list: [
      "Passerelle bancaire agréée : Toutes les transactions sont opérées par l'intermédiaire de GeniusPay, opérateur de paiement sécurisé certifié PCI-DSS et agréé selon la réglementation financière en vigueur ;",
      "Modes de paiement certifiés : Mobile Money (Orange Money Guinée, MTN Mobile Money, Moov Money, Wave) et Cartes bancaires internationales (Visa, Mastercard) ;",
      "Aucune conservation de données bancaires : La FSCPE ne stocke ni ne traite aucun numéro de carte ou code secret bancaire sur ses propres serveurs ;",
      "Référence unique de transaction : Chaque don génère un identifiant cryptographique unique permettant d'attester l'origine et la réception des fonds ;",
      "Attestations et justificatifs : Tout donateur ou bailleur de fonds peut solliciter une attestation officielle de versement délivrée par la direction financière.",
    ],
  },
  {
    id: "protection-enfance",
    icon: ShieldCheck,
    title: "6. Politique de sauvegarde de l'enfant (Child Safeguarding)",
    body: [
      "En tant qu'organisation humanitaire dédiée à l'enfance, la FSCPE place la sauvegarde et la dignité des mineurs au sommet de ses impératifs moraux et juridiques :",
      "Conformément à la Convention Internationale des Droits de l'Enfant (CIDE) adoptée par l'ONU et aux lois guinéennes de protection de l'enfance :",
    ],
    list: [
      "Consentement préalable et éclairé : Toute photographie, vidéo ou témoignage d'enfant orphelin ou vulnérable diffusé sur le site a fait l'objet d'une autorisation formelle signée par son tuteur légal ou représentant certifié ;",
      "Préservation de la dignité : Aucune image dégradante, misérabiliste, sensationnaliste ou susceptible de porter atteinte à l'estime de soi ou à la réputation future de l'enfant n'est tolérée ;",
      "Anonymisation préventive : Les noms de famille des mineurs bénéficiaires sont systématiquement omis ou modifiés pour protéger leur intimité et leur sécurité immédiate ;",
      "Interdiction d'exploitation commerciale : Les photographies d'enfants accompagnés ne peuvent en aucun cas être réutilisées, revendues ou reproduites par des tiers.",
    ],
  },
  {
    id: "propriete-intellectuelle",
    icon: FileText,
    title: "7. Propriété intellectuelle & Droits réservés",
    body: [
      `L'ensemble des éléments graphiques, textuels, photographiques, sonores, vidéo, ainsi que l'architecture logicielle et l'identité visuelle (logos, typographies, icônes, éléments 3D) composant le site fscpe.org sont la propriété exclusive de la ${BRAND.fullName}, ou font l'objet d'une licence légale d'exploitation accordée par leurs auteurs respectifs.`,
      "Toute reproduction, représentation, modification, publication ou adaptation totale ou partielle des éléments du site, quel que soit le moyen ou le procédé utilisé, est formellement interdite sans autorisation écrite préalable et expresse de la direction de la FSCPE. Toute exploitation non autorisée sera poursuivie conformément aux dispositions du Code de la propriété intellectuelle.",
    ],
  },
  {
    id: "responsabilite",
    icon: AlertCircle,
    title: "8. Limites de responsabilité & Liens hypertextes",
    body: [
      "La FSCPE met tout en œuvre pour diffuser des informations fiables, vérifiées et actualisées concernant l'avancement de ses programmes de scolarisation et distributions humanitaires. Toutefois, la Fondation ne saurait être tenue responsable des éventuelles omissions, inexactitudes ou retards de mise à jour indépendants de sa volonté.",
      "Le site peut contenir des liens hypertextes orientant l'utilisateur vers des ressources ou partenaires externes (institutions publiques, partenaires techniques, ONG partenaires). La FSCPE n'exerçant aucun contrôle sur ces plateformes tierces, elle décline toute responsabilité quant à leurs contenus, politiques de confidentialité ou pratiques de sécurité.",
    ],
  },
  {
    id: "mediation-contact",
    icon: Mail,
    title: "9. Signalement éthique, réclamations & Contact officiel",
    body: [
      "Dans le cadre de notre engagement d'intégrité et de redevabilité citoyenne, un canal d'écoute direct est ouvert à tout bénévole, donateur, partenaire ou citoyen souhaitant formuler une observation, une réclamation ou un signalement éthique.",
      `Vous pouvez contacter notre secrétariat permanent par courriel à ${BRAND.email} ou par voie postale à l'adresse de notre siège social à Conakry. Chaque requête fait l'objet d'un accusé de réception et d'un examen impartial sous 48 heures ouvrées.`,
    ],
  },
  {
    id: "droit-applicable",
    icon: Scale,
    title: "10. Législation applicable & Juridiction compétente",
    body: [
      "Les présentes mentions légales, l'utilisation du site fscpe.org ainsi que tout acte ou don qui en découle sont exclusivement régis et interprétés conformément aux lois et textes en vigueur en République de Guinée.",
      "À défaut de résolution amiable et concertée de tout litige ou contestation relatif à l'interprétation ou à l'exécution des présentes, compétence exclusive et expresse est attribuée aux tribunaux compétents du ressort de la Cour d'Appel de Conakry.",
    ],
  },
] as const;

export default function MentionsLegalesPage() {
  return (
    <>
      <InstitutionalHero
        image={LEGAL_HERO_BG}
        imageAlt="Architecture institutionnelle symbolisant le droit, la transparence et la gouvernance"
        eyebrow="Cadre juridique & Transparence"
        title="La confiance et la rigueur légale au service des enfants de Guinée."
        description="Retrouvez l'ensemble des informations juridiques, statutaires et techniques régissant l'activité de la Fondation Saran Camara (FSCPE). Une gouvernance transparente et responsable, conforme aux normes internationales des ONG."
        badge="Agrément ONG · République de Guinée"
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
              eyebrow="Nos fondements"
              title="Quatre piliers institutionnels d'intégrité"
              description="La légitimité de notre engagement humanitaire repose sur la conformité légale, la probité financière et la sacralité de la protection de l'enfance."
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

      {/* ——— Corps des mentions légales ——— */}
      <section className="relative border-t border-navy-100 bg-white py-20 sm:py-24">
        <div className="container-app relative">
          <div className="mx-auto max-w-3xl">
            <AnimatedSection>
              <SectionHeading
                align="left"
                eyebrow="Statuts & Mentions officielles"
                title="Cadre juridique de la FSCPE"
                description="Dernière révision : septembre 2026. Ce document officiel fixe les conditions d'identification, de publication et d'engagement de la Fondation Saran Camara."
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
                              {p}
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

      {/* ——— Liens croisés : Confidentialité & Transparence ——— */}
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
                  Données personnelles & Respect de la vie privée
                </span>
              </div>
              <h4 className="font-display mt-2 text-2xl font-bold text-white">
                Consultez notre politique de confidentialité
              </h4>
              <p className="mt-1 text-sm text-navy-200">
                Découvrez en détail comment nous protégeons vos données de dons,
                newsletter et formulaires.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/confidentialite"
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-xl bg-gold-500 px-6 py-3.5 font-display text-sm font-semibold text-navy-950 shadow-lg shadow-gold-500/20 transition-all duration-200 hover:bg-gold-400 hover:shadow-xl hover:shadow-gold-500/30"
              >
                <span>Politique de confidentialité</span>
                <ExternalLink size={15} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 font-display text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20 hover:border-white/30"
              >
                <span>Nous contacter</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
