
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Copy,
  Check,
  MessageCircle,
  ExternalLink,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Search,
  HeartHandshake,
  Building2,
  Users,
  FileText,
  ArrowRight,
  PhoneCall,
  X,
  HelpCircle,
  CheckCircle2,
} from "lucide-react";
import Image from "next/image";
import { BRAND } from "@/lib/site-data";

export function ContactInteractiveCards() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string, label: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      toast.success(`${label} copié dans le presse-papier !`);
      setTimeout(() => setCopiedKey(null), 2500);
    }
  };

  const whatsappPhone = BRAND.phone.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
    "Bonjour la Fondation Saran Camara, je vous contacte au sujet d'une démarche / partenariat."
  )}`;

  return (
    <div className="flex flex-col gap-6">
      {/* Carte d'accueil & Localisation Conakry */}
      <div className="relative overflow-hidden rounded-3xl border border-navy-900/10 bg-white p-7 shadow-xl shadow-navy-900/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Bureau ouvert aujourd&apos;hui
            </span>
          </div>

          <span className="rounded-full bg-navy-50 px-3 py-1 font-mono text-[0.6875rem] text-navy-600">
            Conakry (GMT)
          </span>
        </div>

        <h3 className="font-display mt-4 text-xl font-bold tracking-tight text-navy-900">
          Siège Opérationnel & Direction
        </h3>
        <p className="mt-1 text-xs text-navy-500">
          Venez nous rencontrer ou écrivez-nous directement pour vos projets.
        </p>

        {/* Canaux de contact rapides */}
        <div className="mt-6 space-y-3">
          {/* Adresse */}
          <div className="group relative flex items-start justify-between rounded-2xl border border-navy-100 bg-navy-50/40 p-4 transition-all hover:border-gold-300 hover:bg-white hover:shadow-md">
            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
                <MapPin size={18} />
              </div>
              <div>
                <span className="font-mono text-[0.625rem] uppercase tracking-wider text-navy-400">
                  Adresse principale
                </span>
                <p className="text-sm font-semibold text-navy-900">
                  {BRAND.address}
                </p>
                <p className="text-xs text-navy-500">
                  Ratoma · Conakry, République de Guinée
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleCopy(BRAND.address, "addr", "Adresse")}
              className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg border border-navy-200 bg-white text-navy-600 transition-colors hover:border-gold-500 hover:text-gold-700"
              title="Copier l'adresse"
            >
              {copiedKey === "addr" ? (
                <Check size={14} className="text-emerald-600" />
              ) : (
                <Copy size={14} />
              )}
            </button>
          </div>

          {/* Téléphone Hotline */}
          <div className="group relative flex items-start justify-between rounded-2xl border border-navy-100 bg-navy-50/40 p-4 transition-all hover:border-gold-300 hover:bg-white hover:shadow-md">
            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-100 text-gold-700">
                <Phone size={18} />
              </div>
              <div>
                <span className="font-mono text-[0.625rem] uppercase tracking-wider text-navy-400">
                  Téléphone direct & Permanence
                </span>
                <a
                  href={`tel:${BRAND.phone.replace(/\s/g, "")}`}
                  className="block text-sm font-bold text-navy-900 transition-colors hover:text-primary-700"
                >
                  {BRAND.phone}
                </a>
                <p className="text-xs text-navy-500">
                  Appel direct ou assistance par SMS
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleCopy(BRAND.phone, "phone", "Numéro de téléphone")}
              className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg border border-navy-200 bg-white text-navy-600 transition-colors hover:border-gold-500 hover:text-gold-700"
              title="Copier le numéro"
            >
              {copiedKey === "phone" ? (
                <Check size={14} className="text-emerald-600" />
              ) : (
                <Copy size={14} />
              )}
            </button>
          </div>

          {/* E-mail officiel */}
          <div className="group relative flex items-start justify-between rounded-2xl border border-navy-100 bg-navy-50/40 p-4 transition-all hover:border-gold-300 hover:bg-white hover:shadow-md">
            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <Mail size={18} />
              </div>
              <div className="min-w-0">
                <span className="font-mono text-[0.625rem] uppercase tracking-wider text-navy-400">
                  Courriel officiel
                </span>
                <a
                  href={`mailto:${BRAND.email}`}
                  className="block truncate text-sm font-bold text-navy-900 transition-colors hover:text-primary-700"
                >
                  {BRAND.email}
                </a>
                <p className="text-xs text-navy-500">
                  Partenariats, dons et demandes officielles
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleCopy(BRAND.email, "email", "Adresse e-mail")}
              className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg border border-navy-200 bg-white text-navy-600 transition-colors hover:border-gold-500 hover:text-gold-700"
              title="Copier l'adresse e-mail"
            >
              {copiedKey === "email" ? (
                <Check size={14} className="text-emerald-600" />
              ) : (
                <Copy size={14} />
              )}
            </button>
          </div>

          {/* Horaires */}
          <div className="flex items-center gap-3.5 rounded-2xl border border-navy-100/70 bg-white px-4 py-3 text-xs text-navy-600">
            <Clock size={16} className="text-primary-600 shrink-0" />
            <span className="font-medium">
              Horaires d&apos;accueil : Du Lundi au Vendredi, 08h00 – 17h00 GMT
            </span>
          </div>
        </div>

        {/* Action Direct WhatsApp */}
        <div className="mt-5">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-700/20 transition-all duration-300 hover:from-emerald-700 hover:to-teal-800 hover:shadow-xl hover:shadow-emerald-700/30"
          >
            <MessageCircle size={18} />
            <span>Discuter instantanément sur WhatsApp</span>
            <ExternalLink
              size={14}
              className="opacity-70 transition-transform group-hover:translate-x-0.5"
            />
          </a>
        </div>
      </div>

      {/* Carte "Mot Personnel de Mme Saran Camara" */}
      <div className="relative overflow-hidden rounded-3xl border border-gold-500/30 bg-gradient-to-br from-navy-900 via-navy-900 to-primary-900 p-6 text-white shadow-2xl">
        {/* Glow ornemental */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-gold-400/15 blur-2xl"
        />

        <div className="relative flex items-center gap-4">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full ring-2 ring-gold-400/60 shadow-lg">
            <Image
              src="/saran camara.png"
              alt="Mme Saran Camara"
              fill
              sizes="64px"
              className="object-cover object-top"
            />
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-gold-400">
              <Sparkles size={13} />
              <span className="font-mono text-[0.625rem] uppercase tracking-widest">
                Parole de Fondatrice
              </span>
            </div>
            <p className="font-display text-base font-bold text-white">
              Mme Saran Camara
            </p>
            <p className="text-xs text-navy-300">
              Présidente & Fondatrice de la FSCPE
            </p>
          </div>
        </div>

        <blockquote className="mt-4 border-l-2 border-gold-500/60 pl-3.5 text-xs font-light leading-relaxed text-navy-100">
          &ldquo;Chaque message reçu est une graine d&apos;espoir pour un enfant
          orphelin ou vulnérable. Nous nous engageons à vous écouter et à vous
          répondre personnellement avec dévouement.&rdquo;
        </blockquote>
      </div>

      {/* Reassurance de transparence */}
      <div className="rounded-2xl border border-navy-100 bg-white/70 p-4 backdrop-blur-sm">
        <div className="flex items-center gap-3 text-xs text-navy-700">
          <ShieldCheck size={18} className="text-primary-600 shrink-0" />
          <p className="leading-relaxed">
            <strong className="font-semibold text-navy-900">
              ONG agréée en République de Guinée :
            </strong>{" "}
            Tous nos partenariats font l&apos;objet de conventions formelles et
            de rapports de redevabilité réguliers.
          </p>
        </div>
      </div>
    </div>
  );
}

export interface FaqItem {
  id: string;
  category: "dons" | "gouvernance" | "partenariats" | "visites";
  categoryLabel: string;
  question: string;
  answer: string;
  bullets?: string[];
  actionLink?: {
    href: string;
    label: string;
    isExternal?: boolean;
  };
  tags: string[];
}

const FAQ_CATEGORIES = [
  { id: "all", label: "Toutes les questions", icon: HelpCircle },
  { id: "dons", label: "Dons & Parrainage", icon: HeartHandshake },
  { id: "gouvernance", label: "Transparence & Statuts", icon: ShieldCheck },
  { id: "partenariats", label: "Bénévolat & RSE", icon: Building2 },
  { id: "visites", label: "Visites & Urgences", icon: MapPin },
] as const;

type FaqCategoryKey = (typeof FAQ_CATEGORIES)[number]["id"];

const FAQ_ITEMS: FaqItem[] = [
  {
    id: "faq-paiements",
    category: "dons",
    categoryLabel: "Dons & Parrainage",
    question: "Quels sont les moyens de paiement acceptés pour faire un don à la FSCPE ?",
    answer:
      "Pour permettre à chacun de contribuer simplement, que ce soit en Guinée ou depuis l'étranger (diaspora), nous acceptons plusieurs canaux de paiement ultra-sécurisés avec délivrance immédiate de reçu :",
    bullets: [
      "Mobile Money guinéen : Orange Money Guinée & MTN Mobile Money (via notre passerelle GeniusPay intégrée)",
      "Cartes bancaires internationales : Visa, Mastercard et cartes affiliées",
      "Virement bancaire direct sur le compte officiel de la Fondation à Conakry",
      "Possibilité de don ponctuel ou d'engagement mensuel sans engagement de durée",
    ],
    actionLink: {
      href: "/don",
      label: "Faire un don en ligne sécurisé",
      isExternal: false,
    },
    tags: [
      "paiement",
      "orange money",
      "mtn",
      "carte bancaire",
      "geniuspay",
      "virement",
      "don en ligne",
      "diaspora",
    ],
  },
  {
    id: "faq-parrainage",
    category: "dons",
    categoryLabel: "Dons & Parrainage",
    question: "Comment fonctionne le parrainage individuel d'un enfant orphelin ?",
    answer:
      "Le parrainage individuel assure une couverture globale et pérenne des besoins vitaux d'un enfant orphelin ou vulnérable tout au long de son parcours scolaire. Votre engagement permet d'assurer :",
    bullets: [
      "La prise en charge intégrale de la scolarité (frais de scolarité, fournitures, livres et uniformes)",
      "Le suivi médical préventif (bilans de santé, soins d'urgence et vaccination)",
      "L'envoi semestriel d'un livret pédagogique individuel et des bulletins scolaires",
      "Le respect scrupuleux de la dignité et de la protection de l'identité de l'enfant",
    ],
    actionLink: {
      href: "mailto:contact@fondationsarancamara.org?subject=Demande%20de%20dossier%20de%20parrainage%20d%27un%20enfant",
      label: "Demander un dossier de parrainage",
      isExternal: true,
    },
    tags: [
      "parrainage",
      "orphelin",
      "scolarite",
      "bulletin",
      "enfant",
      "dossier",
      "suivi",
    ],
  },
  {
    id: "faq-recu-fiscal",
    category: "dons",
    categoryLabel: "Dons & Parrainage",
    question: "Délivrez-vous une attestation officielle ou un reçu justificatif de don ?",
    answer:
      "Absolument. Chaque contribution financière reçue fait l'objet d'une validation comptable et de l'émission d'un document justificatif officiel :",
    bullets: [
      "Reçu de don numéroté généré automatiquement pour les dons effectués en ligne",
      "Attestation annuelle récapitulative transmise aux donateurs réguliers et aux entreprises partenaires",
      "Cachet officiel de l'ONG et mentions d'enregistrement auprès du MATD (Ministère de tutelle)",
      "Document recevable pour vos bilans RSE, comptabilités associatives et justificatifs d'impôts",
    ],
    tags: [
      "recu",
      "attestation",
      "fiscal",
      "comptabilite",
      "justificatif",
      "deduction",
      "impot",
    ],
  },
  {
    id: "faq-nature",
    category: "dons",
    categoryLabel: "Dons & Parrainage",
    question: "Acceptez-vous les dons matériels ou en nature (kits scolaires, vivres, ordinateurs) ?",
    answer:
      "Oui, les dons matériels ont un impact immédiat sur le quotidien des enfants orphelins et des structures d'accueil communautaires soutenues :",
    bullets: [
      "Fournitures scolaires : cartables, cahiers, manuels scolaires conformes aux programmes, stylos",
      "Matériel informatique reconditionné : PC portables et tablettes pour nos ateliers d'alphabétisation numérique",
      "Denrées alimentaires de première nécessité : sacs de riz, bidons d'huile, lait nutritionnel pour nourrissons",
      "Bordereau officiel d'inventaire et attestation de réception signée remis au donateur",
    ],
    actionLink: {
      href: "mailto:contact@fondationsarancamara.org?subject=Proposition%20de%20don%20en%20nature%20ou%20mat%C3%A9riel",
      label: "Proposer un don en nature",
      isExternal: true,
    },
    tags: [
      "don en nature",
      "materiel",
      "ordinateurs",
      "nourriture",
      "riz",
      "vetements",
      "fournitures",
    ],
  },
  {
    id: "faq-transparence",
    category: "gouvernance",
    categoryLabel: "Transparence & Statuts",
    question: "Comment la FSCPE garantit-elle la transparence et l'affectation exacte des fonds ?",
    answer:
      "La redevabilité intégrale est la règle fondatrice imposée par notre Présidente Mme Saran Camara et le Conseil d'Administration :",
    bullets: [
      "Traçabilité rigoureuse : chaque somme versée est affectée à un code projet spécifique (Santé, Éducation, Urgence)",
      "Double signature requise pour tout décaissement financier sur les comptes de la Fondation",
      "Rapport moral et financier annuel consultable publiquement et soumis aux autorités compétentes",
      "Reportages photo, vidéo et témoignages concrets partagés après chaque opération terrain",
    ],
    tags: [
      "transparence",
      "audit",
      "comptes",
      "gouvernance",
      "redevabilite",
      "affectation",
      "securite",
    ],
  },
  {
    id: "faq-statut-juridique",
    category: "gouvernance",
    categoryLabel: "Transparence & Statuts",
    question: "Quel est le statut juridique officiel de la Fondation Saran Camara en Guinée ?",
    answer:
      "La Fondation Saran Camara pour la Protection des Enfants (FSCPE) est une Organisation Non Gouvernementale (ONG) à vocation humanitaire et sociale, légalement déclarée en République de Guinée :",
    bullets: [
      "Agréée officiellement par le Ministère de l'Administration du Territoire et de la Décentralisation (MATD)",
      "Enregistrée sous le statut d'association à but non lucratif et d'utilité publique sociale",
      "Gouvernée par un Conseil d'Administration et une équipe opérationnelle permanente à Conakry",
      "Soumise au strict respect de la Convention relative aux Droits de l'Enfant (CIDE)",
    ],
    actionLink: {
      href: "/mentions-legales",
      label: "Consulter nos mentions légales complètes",
      isExternal: false,
    },
    tags: [
      "statut juridique",
      "agrement",
      "matd",
      "republique de guinee",
      "ong",
      "legalite",
      "mentions legales",
    ],
  },
  {
    id: "faq-repartition-ressources",
    category: "gouvernance",
    categoryLabel: "Transparence & Statuts",
    question: "Quelle part de mon don arrive concrètement auprès des enfants bénéficiaires ?",
    answer:
      "Grâce à une gestion bénévole rigoureuse de la gouvernance et à des partenariats logistiques locaux, nous maximisons l'impact de chaque don :",
    bullets: [
      "88% des ressources sont directement allouées aux programmes de terrain (écolage, soins médicaux, repas, kits)",
      "8% sont consacrés au suivi éducatif, à l'assistance sociale et à la logistique sécurisée de transport",
      "4% seulement servent aux frais de gestion administrative, d'hébergement web et de conformité",
    ],
    tags: [
      "repartition",
      "pourcentage",
      "frais de fonctionnement",
      "terrain",
      "impact",
      "efficacite",
    ],
  },
  {
    id: "faq-partenariat-rse",
    category: "partenariats",
    categoryLabel: "Bénévolat & RSE",
    question: "Comment une entreprise peut-elle s'associer à la FSCPE dans le cadre de sa politique RSE ?",
    answer:
      "Nous co-développons avec les entreprises locales et internationales des partenariats solidaires sur-mesure répondant aux Objectifs de Développement Durable (ODD 1, 3, 4 et 10) :",
    bullets: [
      "Mécénat financier ou matériel ciblé (rénovation d'écoles, équipement de cantines, bourses d'études)",
      "Mécénat de compétences et journées d'engagement solidaire pour vos collaborateurs",
      "Convention de partenariat formelle précisant les objectifs, les jalons et les livrables d'impact",
      "Rapport d'impact RSE documenté valorisable dans votre rapport annuel extra-financier",
    ],
    actionLink: {
      href: "mailto:contact@fondationsarancamara.org?subject=Proposition%20de%20Partenariat%20RSE%20Entreprise",
      label: "Contacter le pôle Partenariats & Mécénat",
      isExternal: true,
    },
    tags: [
      "rse",
      "entreprise",
      "mecenat",
      "partenariat",
      "societe",
      "sponsoring",
      "odd",
    ],
  },
  {
    id: "faq-benevolat",
    category: "partenariats",
    categoryLabel: "Bénévolat & RSE",
    question: "Comment devenir bénévole ou effectuer une mission de volontariat ?",
    answer:
      "Nos équipes accueillent avec enthousiasme les bonnes volontés prêtes à mettre leurs compétences au service de l'émancipation des orphelins :",
    bullets: [
      "Pédagogie & Éducation : cours de soutien, aide aux devoirs, animation d'ateliers de lecture et de langues",
      "Santé & Bien-être : personnel médical pour dépistages forains, hygiène et sensibilisation",
      "Technologies : formation à l'informatique, bureautique et outils numériques pour adolescents",
      "Logistique, photographie humanitaire, communication et organisation de distributions festives",
    ],
    actionLink: {
      href: "mailto:contact@fondationsarancamara.org?subject=Candidature%20B%C3%A9n%C3%A9volat%20%26%20Volontariat",
      label: "Postuler comme bénévole",
      isExternal: true,
    },
    tags: [
      "benevolat",
      "volontariat",
      "competences",
      "aide",
      "engagement",
      "soutien scolaire",
    ],
  },
  {
    id: "faq-bailleurs-ong",
    category: "partenariats",
    categoryLabel: "Bénévolat & RSE",
    question: "Les bailleurs de fonds et ONG internationales peuvent-ils cofinancer des projets ?",
    answer:
      "Oui. La FSCPE dispose des protocoles administratifs, de la méthodologie de gestion de projet (cadre logique, indicateurs de performance M&E) et de la traçabilité exigés par les bailleurs multilatéraux et institutions internationales.",
    bullets: [
      "Gestion de subventions dédiées avec audits financiers réguliers",
      "Respect strict des standards internationaux de sauvegarde de l'enfant (Child Safeguarding Policy)",
      "Capacité de déploiement d'actions d'urgence ou de projets pluriannuels en Guinée",
    ],
    tags: [
      "bailleurs",
      "institutions",
      "subvention",
      "ong internationale",
      "unicef",
      "cooperation",
    ],
  },
  {
    id: "faq-delais-reponse",
    category: "visites",
    categoryLabel: "Visites & Urgences",
    question: "Dans quel délai puis-je espérer une réponse à mon message ou formulaire ?",
    answer:
      "Notre secrétariat permanent traite chaque demande avec une attention rigoureuse sous 24 à 48 heures ouvrées :",
    bullets: [
      "Notification d'accusé de réception dès l'envoi de votre message",
      "Mise en relation directe avec la personne compétente (Trésorerie, Parrainage, Direction)",
      "Possibilité d'un premier rendez-vous téléphonique ou en visioconférence pour les partenaires éloignés",
    ],
    tags: [
      "delai",
      "reponse",
      "secretariat",
      "temps de reponse",
      "contact",
      "urgence",
    ],
  },
  {
    id: "faq-visite-siege",
    category: "visites",
    categoryLabel: "Visites & Urgences",
    question: "Est-il possible de visiter vos locaux et de rencontrer les équipes à Conakry ?",
    answer:
      "Absolument. Nous encourageons les parrains, bienfaiteurs et partenaires à venir constater la concrétisation de leur générosité. Pour des raisons d'organisation et de sécurité des mineurs :",
    bullets: [
      "Les visites s'effectuent exclusivement sur rendez-vous préalable convenu au moins 48h à l'avance",
      "L'accueil se déroule à notre siège opérationnel de Conakry aux heures d'ouverture (08h00 - 17h00 GMT)",
      "Un membre de l'équipe vous présente les projets, le matériel et vous guide dans le respect de notre charte",
    ],
    actionLink: {
      href: "mailto:contact@fondationsarancamara.org?subject=Demande%20de%20visite%20au%20si%C3%A8ge%20de%20Conakry",
      label: "Planifier une visite au siège",
      isExternal: true,
    },
    tags: [
      "visite",
      "locaux",
      "siege",
      "conakry",
      "rendez-vous",
      "rencontre",
      "terrain",
    ],
  },
  {
    id: "faq-urgence-signalement",
    category: "visites",
    categoryLabel: "Visites & Urgences",
    question: "Comment signaler un enfant en détresse absolue ou une situation d'urgence vitale ?",
    answer:
      "Pour toute situation de détresse sévère nécessitant une mise à l'abri ou une assistance médicale immédiate, ne remplissez pas le formulaire général. Utilisez nos lignes directes :",
    bullets: [
      "Appel téléphonique prioritaire : +224 623 95 20 11 (24h/24, 7j/7)",
      "Signalement WhatsApp instantané avec géolocalisation et détails de la situation",
      "Intervention coordonnée immédiate avec nos travailleurs sociaux et les services de santé partenaires",
    ],
    actionLink: {
      href: "tel:+224623952011",
      label: "Appeler la ligne d'urgence (+224 623 95 20 11)",
      isExternal: true,
    },
    tags: [
      "urgence",
      "signalement",
      "detresse",
      "danger",
      "orphelin en difficulte",
      "hotline",
    ],
  },
];

export function ContactFaqSection() {
  const [activeCategory, setActiveCategory] = useState<FaqCategoryKey>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>("faq-paiements");

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  // Filtrage intelligent combiné (catégorie + texte de recherche)
  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return FAQ_ITEMS.filter((item) => {
      const matchesCategory =
        activeCategory === "all" || item.category === activeCategory;

      if (!matchesCategory) return false;
      if (!q) return true;

      const inQuestion = item.question.toLowerCase().includes(q);
      const inAnswer = item.answer.toLowerCase().includes(q);
      const inCategory = item.categoryLabel.toLowerCase().includes(q);
      const inTags = item.tags.some((t) => t.toLowerCase().includes(q));
      const inBullets =
        item.bullets?.some((b) => b.toLowerCase().includes(q)) ?? false;

      return inQuestion || inAnswer || inCategory || inTags || inBullets;
    });
  }, [activeCategory, searchQuery]);

  // Calcul du nombre de questions par catégorie
  const countByCategory = useMemo(() => {
    const counts: Record<string, number> = { all: FAQ_ITEMS.length };
    FAQ_ITEMS.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, []);

  const resetFilters = () => {
    setActiveCategory("all");
    setSearchQuery("");
    setOpenId(FAQ_ITEMS[0]?.id ?? null);
  };

  const whatsappPhone = BRAND.phone.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
    "Bonjour l'équipe FSCPE, j'ai une question complémentaire suite à la lecture de votre FAQ."
  )}`;

  return (
    <div className="mx-auto max-w-5xl">
      {/* En-tête prestige de la FAQ */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-50/80 px-4 py-1.5 text-xs font-semibold text-gold-900 shadow-sm backdrop-blur-sm">
          <Sparkles size={15} className="text-gold-600" />
          <span className="font-mono uppercase tracking-wider text-[0.6875rem]">
            Base de connaissances & Réponses directes
          </span>
        </div>

        <h3 className="font-display mt-4 text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl md:text-5xl">
          Foire aux{" "}
          <span className="bg-gradient-to-r from-primary-700 via-gold-600 to-primary-800 bg-clip-text text-transparent">
            questions fréquentes
          </span>
        </h3>

        <p className="mx-auto mt-4 max-w-2xl text-base text-navy-600 sm:text-lg">
          Toutes les réponses claires et documentées concernant nos dons, le
          parrainage d&apos;orphelins, notre gouvernance en Guinée et nos
          partenariats.
        </p>
      </div>

      {/* Barre de contrôle interactive : Recherche instantanée & Filtres par catégorie */}
      <div className="mt-10 space-y-5">
        {/* Champ de recherche en direct */}
        <div className="relative mx-auto max-w-2xl">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-navy-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une question (ex: parrainage, reçu fiscal, Orange Money, visite, audit...)"
            className="w-full rounded-2xl border border-navy-200/90 bg-white py-3.5 pl-11 pr-11 text-sm text-navy-900 shadow-sm placeholder:text-navy-400 focus:border-gold-500 focus:outline-none focus:ring-4 focus:ring-gold-500/15 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-navy-400 hover:text-navy-700 transition-colors"
              title="Effacer la recherche"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Boutons d'onglets de catégories */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {FAQ_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            const count = countByCategory[cat.id] ?? 0;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setActiveCategory(cat.id);
                  // Si l'élément ouvert n'est plus visible, on ouvre le premier résultat
                  const firstOfCategory = FAQ_ITEMS.find(
                    (it) => cat.id === "all" || it.category === cat.id
                  );
                  if (firstOfCategory) setOpenId(firstOfCategory.id);
                }}
                className={`group inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-navy-900 text-white shadow-lg shadow-navy-900/20 ring-2 ring-gold-400/80 scale-[1.02]"
                    : "border border-navy-200/80 bg-white/80 text-navy-700 hover:border-gold-300 hover:bg-white hover:text-navy-900 hover:shadow-sm"
                }`}
              >
                <Icon
                  size={14}
                  className={
                    isActive
                      ? "text-gold-400"
                      : "text-navy-400 group-hover:text-gold-600 transition-colors"
                  }
                />
                <span>{cat.label}</span>
                <span
                  className={`ml-1 rounded-full px-1.5 py-0.5 font-mono text-[0.6875rem] font-bold ${
                    isActive
                      ? "bg-white/20 text-gold-300"
                      : "bg-navy-100 text-navy-600 group-hover:bg-gold-100 group-hover:text-gold-800"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Résumé du compteur de questions affichées */}
      <div className="mt-6 flex items-center justify-between px-2 text-xs text-navy-500">
        <span>
          {filteredItems.length}{" "}
          {filteredItems.length > 1
            ? "questions disponibles"
            : "question disponible"}
          {searchQuery && (
            <>
              {" "}
              pour « <strong className="text-navy-900">{searchQuery}</strong> »
            </>
          )}
        </span>
        {(searchQuery || activeCategory !== "all") && (
          <button
            type="button"
            onClick={resetFilters}
            className="font-medium text-gold-700 hover:text-gold-900 hover:underline transition-colors"
          >
            Réinitialiser les filtres
          </button>
        )}
      </div>

      {/* Liste des cartes accordéon */}
      <div className="mt-4 space-y-4">
        {filteredItems.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-navy-200 bg-white/80 p-10 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-50 text-gold-600">
              <Search size={26} />
            </div>
            <h4 className="font-display mt-4 text-lg font-bold text-navy-900">
              Aucune question trouvée
            </h4>
            <p className="mx-auto mt-2 max-w-md text-sm text-navy-600">
              Aucune réponse ne correspond exactement à votre recherche «{" "}
              {searchQuery} ». Essayez d&apos;autres mots-clés ou posez-nous
              directement votre question.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={resetFilters}
                className="rounded-xl bg-navy-900 px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-navy-900 transition-colors"
              >
                Afficher toutes les questions
              </button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-600 bg-emerald-50 px-4 py-2.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition-colors"
              >
                <MessageCircle size={14} />
                <span>Poser ma question sur WhatsApp</span>
              </a>
            </div>
          </div>
        ) : (
          filteredItems.map((item, idx) => {
            const isOpen = openId === item.id;
            const indexFormatted = String(idx + 1).padStart(2, "0");

            return (
              <div
                key={item.id}
                className={`overflow-hidden rounded-2xl border bg-white transition-all duration-300 ${
                  isOpen
                    ? "border-gold-400 shadow-xl shadow-gold-500/5 ring-2 ring-gold-400/20"
                    : "border-navy-100 shadow-sm hover:border-gold-300 hover:shadow-md"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(item.id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-start justify-between gap-4 p-5 text-left transition-colors sm:p-6 hover:bg-navy-50/40"
                >
                  <div className="flex items-start gap-3.5 sm:gap-4">
                    {/* Index stylisé or & mono */}
                    <span className="mt-0.5 inline-flex h-7 shrink-0 items-center justify-center rounded-lg border border-gold-300/80 bg-gold-50/70 px-2 font-mono text-xs font-bold text-gold-900 shadow-xs">
                      {indexFormatted}
                    </span>

                    <div>
                      {/* Badge de catégorie */}
                      <span className="inline-block rounded-md bg-navy-50 px-2 py-0.5 font-mono text-[0.625rem] font-semibold uppercase tracking-wider text-navy-500">
                        {item.categoryLabel}
                      </span>
                      {/* Question */}
                      <h4 className="font-display mt-1 text-base font-bold text-navy-900 sm:text-lg">
                        {item.question}
                      </h4>
                    </div>
                  </div>

                  {/* Bouton d'extension rotatif */}
                  <span
                    className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                      isOpen
                        ? "rotate-180 border-gold-500 bg-gold-500 text-navy-900 shadow-sm"
                        : "border-navy-200 bg-navy-50 text-navy-600 group-hover:border-navy-300"
                    }`}
                  >
                    <ChevronDown size={16} />
                  </span>
                </button>

                {/* Contenu déroulant enrichi */}
                {isOpen && (
                  <div className="border-t border-navy-100/80 bg-gradient-to-b from-navy-50/30 to-white px-5 pb-6 pt-4 sm:px-6 sm:pb-7">
                    <p className="text-sm font-normal leading-relaxed text-navy-700 sm:text-base">
                      {item.answer}
                    </p>

                    {/* Liste à puces stylisée avec checkmarks émeraude */}
                    {item.bullets && item.bullets.length > 0 && (
                      <ul className="mt-4 space-y-2.5 rounded-xl border border-navy-100 bg-white/90 p-4 shadow-xs">
                        {item.bullets.map((bullet, bIdx) => (
                          <li
                            key={bIdx}
                            className="flex items-start gap-2.5 text-xs text-navy-700 sm:text-sm"
                          >
                            <CheckCircle2
                              size={16}
                              className="mt-0.5 shrink-0 text-primary-600"
                            />
                            <span className="leading-snug">{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Bouton d'action contextuel si disponible */}
                    {item.actionLink && (
                      <div className="mt-5 pt-3">
                        {item.actionLink.isExternal ? (
                          <a
                            href={item.actionLink.href}
                            target={
                              item.actionLink.href.startsWith("http")
                                ? "_blank"
                                : undefined
                            }
                            rel={
                              item.actionLink.href.startsWith("http")
                                ? "noopener noreferrer"
                                : undefined
                            }
                            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-navy-900 to-primary-900 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-navy-900/15 transition-all duration-200 hover:from-primary-900 hover:to-navy-900 hover:shadow-lg"
                          >
                            <span>{item.actionLink.label}</span>
                            <ArrowRight size={14} className="text-gold-400" />
                          </a>
                        ) : (
                          <Link
                            href={item.actionLink.href}
                            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-700 to-navy-900 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-primary-900/15 transition-all duration-200 hover:from-primary-600 hover:to-navy-900 hover:shadow-lg"
                          >
                            <span>{item.actionLink.label}</span>
                            <ArrowRight size={14} className="text-gold-400" />
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Bloc de réassurance et contact direct sous la FAQ */}
      <div className="mt-12 overflow-hidden rounded-3xl border border-[#e8d9b5] bg-gradient-to-br from-white via-[#faf7f0] to-[#f4ede0] p-6 shadow-xl shadow-navy-900/5 sm:p-8 md:p-10">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row md:text-left text-center">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-100/70 px-3 py-1 text-xs font-semibold text-gold-900">
              <HelpCircle size={14} className="text-gold-700" />
              <span>Vous avez une question particulière ?</span>
            </div>
            <h4 className="font-display mt-3 text-xl font-bold text-navy-900 sm:text-2xl">
              Notre équipe vous écoute et vous conseille
            </h4>
            <p className="mt-2 text-sm text-navy-600 leading-relaxed">
              Mme Saran Camara et le secrétariat de la Fondation sont joignables
              du lundi au vendredi pour étudier vos projets de mécénat,
              bénévolat ou vos questions de dons.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-xs font-semibold text-white shadow-md shadow-emerald-700/20 transition-all hover:bg-emerald-700 hover:shadow-lg"
            >
              <MessageCircle size={16} />
              <span>WhatsApp Direct</span>
            </a>

            <a
              href={`mailto:${BRAND.email}?subject=Question%20sp%C3%A9cifique%20FSCPE`}
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-navy-300 bg-white px-5 py-3 text-xs font-semibold text-navy-900 shadow-sm transition-all hover:border-gold-500 hover:bg-gold-50/50"
            >
              <Mail size={16} className="text-primary-700" />
              <span>Envoyer un e-mail</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
