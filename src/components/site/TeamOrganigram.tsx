"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  GitFork,
  LayoutGrid,
  Briefcase,
  Stethoscope,
  GraduationCap,
  Megaphone,
  UserRound,
  Sparkles,
  ChevronRight,
  X,
  Scale,
  Award,
  Compass,
  ArrowRight,
  Info,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";
import type { TeamMember } from "@/lib/db/schema";

interface TeamOrganigramProps {
  members: TeamMember[];
}

export default function TeamOrganigram({ members }: TeamOrganigramProps) {
  const [viewMode, setViewMode] = useState<"chart" | "grid">("chart");
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [activeFilter, setActiveFilter] = useState<"all" | "fondatrice" | "bureau" | "ca">("all");
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Référence pour le conteneur scrollable sur mobile
  const containerRef = useRef<HTMLDivElement>(null);

  // Centrer automatiquement sur le sommet de l'organigramme (la Fondatrice) sur mobile
  useEffect(() => {
    if (viewMode === "chart" && containerRef.current) {
      const el = containerRef.current;
      if (el.scrollWidth > el.clientWidth) {
        el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
      }
    }
  }, [viewMode]);

  // Fonction pour recentrer manuellement l'organigramme
  const centerOrganigram = () => {
    if (containerRef.current) {
      const el = containerRef.current;
      el.scrollTo({
        left: (el.scrollWidth - el.clientWidth) / 2,
        behavior: "smooth",
      });
    }
  };

  // Regroupement sémantique des membres
  const fondatrice = useMemo(
    () => members.find((m) => m.organBody === "fondatrice") || members[0],
    [members],
  );

  const bureauMembers = useMemo(
    () => members.filter((m) => m.organBody === "bureau"),
    [members],
  );

  const caMembers = useMemo(
    () => members.filter((m) => m.organBody === "ca"),
    [members],
  );

  // Bureau : Direction centrale (Vice-président, SG, Trésorier)
  const bureauDirection = useMemo(
    () => bureauMembers.slice(0, 3),
    [bureauMembers],
  );

  // Bureau : Pôles Opérationnels de Terrain (Santé, Scolarité, Communication)
  const bureauPoles = useMemo(
    () => bureauMembers.slice(3),
    [bureauMembers],
  );

  // Membres filtrés pour la vue Grille
  const filteredGridMembers = useMemo(() => {
    if (activeFilter === "all") return members;
    return members.filter((m) => m.organBody === activeFilter);
  }, [members, activeFilter]);

  // Informations enrichies pour la modale
  const getMemberDetails = (m: TeamMember) => {
    const roleLower = (m.role || "").toLowerCase();
    const isFounder = m.organBody === "fondatrice" || roleLower.includes("fondat");
    const isMedical = roleLower.includes("santé") || roleLower.includes("médecin") || roleLower.includes("pédiatre");
    const isEducation = roleLower.includes("scolaire") || roleLower.includes("programme") || roleLower.includes("enseignant");
    const isFinance = roleLower.includes("trésorier") || roleLower.includes("financ");
    const isLegal = roleLower.includes("avocat") || roleLower.includes("jurid");
    const isCommunication = roleLower.includes("comm") || roleLower.includes("événement");
    const isOps = roleLower.includes("opération") || roleLower.includes("vice-président");

    let responsibilities = [
      "Veille à l'application stricte des statuts et du règlement de la FSCPE",
      "Coordination transversale avec les relais communautaires de quartier",
      "Évaluation continue de l'impact direct auprès des enfants orphelins",
    ];

    if (isFounder) {
      responsibilities = [
        "Définition des orientations stratégiques et vision globale de la fondation",
        "Représentation institutionnelle auprès des ministères et bailleurs internationaux",
        "Plaidoyer national pour les droits fondamentaux de l'enfant en Guinée",
      ];
    } else if (isMedical) {
      responsibilities = [
        "Coordination des caravanes pédiatriques mobiles et des dépistages",
        "Partenariats cliniques avec le CHU de Donka et les centres de santé de province",
        "Supervision des urgences chirurgicales et des dotations pharmaceutiques",
      ];
    } else if (isEducation) {
      responsibilities = [
        "Sélection et suivi pédagogique des écoliers et collégiens boursiers",
        "Supervision logistique des distributions annuelles de kits scolaires",
        "Médiation auprès des directions d'écoles pour le maintien des enfants en classe",
      ];
    } else if (isFinance) {
      responsibilities = [
        "Contrôle budgétaire et double certification des dépenses de terrain",
        "Audit des flux de dons et émission des rapports de transparence",
        "Gestion prévisionnelle des fonds d'urgence pour orphelins",
      ];
    } else if (isLegal) {
      responsibilities = [
        "Défense juridique bénévole des mineurs victimes d'exploitation ou d'abandon",
        "Rétablissement d'actes de naissance par jugement supplétif",
        "Médiation des conflits de tutelle et protection des familles d'accueil",
      ];
    } else if (isCommunication) {
      responsibilities = [
        "Diffusion des récits d'impact et des rapports d'activités sur le terrain",
        "Organisation des galas de bienfaisance et campagnes d'appel à la générosité",
        "Gestion des relations presse et animation des canaux numériques",
      ];
    } else if (isOps) {
      responsibilities = [
        "Supervision du déploiement logistique dans les 5 communes de Conakry et en région",
        "Coordination générale des équipes de bénévoles et des travailleurs sociaux",
        "Pilotage de la réhabilitation des centres d'accueil et cantines scolaires",
      ];
    }

    return {
      isFounder,
      organLabel:
        m.organBody === "fondatrice"
          ? "Direction Générale & Présidence"
          : m.organBody === "ca"
            ? "Conseil d'Administration"
            : "Bureau Exécutif",
      responsibilities,
    };
  };

  return (
    <div className="relative">
      {/* Barre de contrôle supérieure : Bascule de vue & Filtres */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-navy-100 pb-6 mb-12">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-500/10 text-gold-600">
            <Compass size={18} />
          </span>
          <div>
            <h2 className="font-display text-xl font-bold text-navy-950 sm:text-2xl">
              Architecture &amp; Organigramme
            </h2>
            <p className="text-xs text-navy-500">
              Gouvernance statutaire et chaîne de décision de la fondation
            </p>
          </div>
        </div>

        {/* Toggle Vue Organigramme vs Annuaire */}
        <div className="flex items-center gap-2 self-start sm:self-auto rounded-lg bg-navy-50 p-1 hairline">
          <button
            type="button"
            onClick={() => setViewMode("chart")}
            className={`flex items-center gap-2 rounded-md px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
              viewMode === "chart"
                ? "bg-white text-navy-900 shadow-sm"
                : "text-navy-500 hover:text-navy-900"
            }`}
          >
            <GitFork size={14} className={viewMode === "chart" ? "text-primary-600" : ""} />
            <span>Organigramme vivant</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={`flex items-center gap-2 rounded-md px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
              viewMode === "grid"
                ? "bg-white text-navy-900 shadow-sm"
                : "text-navy-500 hover:text-navy-900"
            }`}
          >
            <LayoutGrid size={14} className={viewMode === "grid" ? "text-primary-600" : ""} />
            <span>Annuaire fiches</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          VUE 1 : ORGANIGRAMME HIÉRARCHIQUE VIVANT (Desktop & Mobile)
          ========================================================================= */}
      {viewMode === "chart" && (
        <div className="relative">
          {/* Guide tactile mobile avec bouton de recentrage */}
          <div className="lg:hidden flex items-center justify-between gap-3 rounded-xl bg-gold-50/90 border border-gold-300/80 p-3 mb-6 shadow-xs">
            <div className="flex items-center gap-2.5 text-xs text-gold-950 font-medium">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold-500 text-white font-bold animate-pulse text-[12px] shrink-0">
                ↔
              </span>
              <span>Glissez latéralement pour explorer tout l&apos;organigramme</span>
            </div>
            <button
              type="button"
              onClick={centerOrganigram}
              className="flex items-center gap-1.5 rounded-lg bg-white border border-gold-300 px-3 py-1.5 text-xs font-bold text-navy-900 shadow-2xs hover:bg-gold-50 transition-colors shrink-0"
            >
              <RotateCcw size={12} className="text-gold-600" />
              <span>Recentrer</span>
            </button>
          </div>

          {/* Conteneur défilable tactile pour mobile, plein format centré sur grand écran */}
          <div
            ref={containerRef}
            className="relative overflow-x-auto pb-8 touch-pan-x scrollbar-thin cursor-grab active:cursor-grabbing rounded-2xl"
          >
            <div className="min-w-[960px] lg:min-w-0 w-full relative py-6">
            {/* Sommet : La Fondatrice & Présidence */}
            {fondatrice && (
              <div className="flex flex-col items-center">
                <div
                  onMouseEnter={() => setHoveredNode("founder")}
                  onMouseLeave={() => setHoveredNode(null)}
                  className="group relative z-20"
                >
                  {/* Aura lumineuse animée */}
                  <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-gold-500/30 via-primary-500/20 to-gold-500/30 opacity-70 blur-lg transition duration-500 group-hover:opacity-100 group-hover:blur-xl" />

                  {/* Carte Présidente */}
                  <div
                    onClick={() => setSelectedMember(fondatrice)}
                    className="relative cursor-pointer overflow-hidden rounded-xl border border-gold-400/50 bg-gradient-to-b from-white via-white to-gold-50/30 p-6 shadow-xl shadow-gold-500/5 transition-all duration-300 hover:-translate-y-1 hover:border-gold-500 hover:shadow-2xl hover:shadow-gold-500/15 w-[420px]"
                  >
                    {/* Badge sommet doré */}
                    <div className="flex items-center justify-between pb-4 border-b border-gold-100">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-500/10 px-3 py-1 font-mono text-[0.6875rem] font-bold uppercase tracking-wider text-gold-700">
                        <Sparkles size={12} className="text-gold-500" />
                        Sommet Hiérarchique — Niveau 0
                      </span>
                      <span className="text-[0.6875rem] font-medium text-navy-400">
                        Direction Générale
                      </span>
                    </div>

                    <div className="mt-4 flex items-center gap-4">
                      {/* Portrait grand format avec double anneau */}
                      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border-2 border-gold-400 shadow-md">
                        {fondatrice.photoUrl ? (
                          <Image
                            src={fondatrice.photoUrl}
                            alt={fondatrice.fullName}
                            fill
                            sizes="96px"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-navy-100 text-navy-400">
                            <UserRound size={32} />
                          </div>
                        )}
                        <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
                      </div>

                      {/* Identité & Rôle */}
                      <div className="min-w-0 flex-1">
                        <h3 className="font-display text-lg font-bold text-navy-950 group-hover:text-primary-700 transition-colors">
                          {fondatrice.fullName}
                        </h3>
                        <p className="font-mono text-xs font-semibold uppercase tracking-wider text-gold-600 mt-0.5">
                          {fondatrice.role}
                        </p>
                        <p className="mt-2 text-xs text-navy-600 line-clamp-2 leading-relaxed">
                          {fondatrice.bio}
                        </p>
                      </div>
                    </div>

                    {/* Footer carte avec invite d'interaction */}
                    <div className="mt-4 flex items-center justify-between pt-3 border-t border-navy-50 text-[0.6875rem]">
                      <span className="text-navy-400">Cliquez pour voir la fiche officielle</span>
                      <span className="flex items-center gap-1 font-semibold text-primary-600 group-hover:translate-x-0.5 transition-transform">
                        Détails <ChevronRight size={13} />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Point d'ancrage SVG inférieur du sommet */}
                <div className="relative h-10 w-full flex items-center justify-center">
                  <div className="h-3 w-3 rounded-full bg-gold-500 shadow-[0_0_12px_rgba(212,160,23,0.8)] z-10" />
                </div>
              </div>
            )}

            {/* Canvas SVG de connexion hiérarchique complexe (Fondatrice -> CA & Bureau) */}
            <div className="relative w-full h-32 -my-2 pointer-events-none z-0">
              <svg
                className="w-full h-full"
                viewBox="0 0 1000 128"
                preserveAspectRatio="none"
                fill="none"
              >
                <defs>
                  {/* Dégradé or vers émeraude */}
                  <linearGradient id="goldToEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#d4a017" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#2f9950" stopOpacity="0.9" />
                  </linearGradient>

                  {/* Dégradé or vers bleu navy */}
                  <linearGradient id="goldToNavy" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#d4a017" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#223c69" stopOpacity="0.9" />
                  </linearGradient>

                  {/* Filtre de lueur intense */}
                  <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* 1. Ligne verticale centrale depuis la Fondatrice */}
                <path
                  d="M 500 0 L 500 45"
                  stroke="#d4a017"
                  strokeWidth="2.5"
                  strokeDasharray="4 4"
                  className="animate-[dash_20s_linear_infinite]"
                />

                {/* Nœud central de bifurcation */}
                <circle cx="500" cy="45" r="5" fill="#d4a017" filter="url(#glowEffect)" />
                <circle cx="500" cy="45" r="9" fill="none" stroke="#d4a017" strokeWidth="1" opacity="0.4" />

                {/* 2. Branche gauche : Vers le Conseil d'Administration (x: 250) */}
                <path
                  d="M 500 45 C 500 85, 250 85, 250 128"
                  stroke="url(#goldToNavy)"
                  strokeWidth={hoveredNode === "ca" ? "3.5" : "2"}
                  strokeDasharray="6 6"
                  className="transition-all duration-300"
                />

                {/* 3. Branche droite : Vers le Bureau Exécutif (x: 750) */}
                <path
                  d="M 500 45 C 500 85, 750 85, 750 128"
                  stroke="url(#goldToEmerald)"
                  strokeWidth={hoveredNode === "bureau" ? "3.5" : "2"}
                  strokeDasharray="6 6"
                  className="transition-all duration-300"
                />

                {/* Particules d'énergie lumineuse descendant vers la gauche */}
                <circle r="3.5" fill="#325086" filter="url(#glowEffect)">
                  <animateMotion
                    path="M 500 45 C 500 85, 250 85, 250 128"
                    dur="3s"
                    repeatCount="indefinite"
                  />
                </circle>

                {/* Particules d'énergie lumineuse descendant vers la droite */}
                <circle r="3.5" fill="#2f9950" filter="url(#glowEffect)">
                  <animateMotion
                    path="M 500 45 C 500 85, 750 85, 750 128"
                    dur="2.5s"
                    repeatCount="indefinite"
                  />
                </circle>
              </svg>
            </div>

            {/* Niveau 1 : Les Deux Piliers Stratégiques (Conseil d'Administration & Bureau Exécutif) */}
            <div className="grid grid-cols-2 gap-12 relative z-10">
              {/* Colonne Gauche : Conseil d'Administration */}
              <div
                onMouseEnter={() => setHoveredNode("ca")}
                onMouseLeave={() => setHoveredNode(null)}
                className="flex flex-col items-center"
              >
                {/* Entête d'Organe CA */}
                <div className="relative mb-6 text-center">
                  <div className="inline-flex items-center gap-2 rounded-full border border-navy-200 bg-white px-4 py-1.5 shadow-sm">
                    <Scale size={15} className="text-navy-600" />
                    <span className="font-display text-xs font-bold uppercase tracking-wider text-navy-900">
                      Conseil d&apos;Administration
                    </span>
                    <span className="rounded-full bg-navy-100 px-2 py-0.5 text-[0.625rem] font-bold text-navy-700">
                      {caMembers.length}
                    </span>
                  </div>
                  <p className="mt-1 text-[0.6875rem] text-navy-400">
                    Orientation stratégique, contrôle &amp; conformité
                  </p>
                </div>

                {/* Cartes CA empilées avec lignes de raccordement */}
                <div className="w-full space-y-4 max-w-md">
                  {caMembers.map((member, idx) => (
                    <motion.div
                      key={member.id}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => setSelectedMember(member)}
                      className="group relative cursor-pointer overflow-hidden rounded-xl border border-navy-100 bg-white p-4 shadow-sm transition-all duration-300 hover:border-navy-300 hover:shadow-md"
                    >
                      <span className="absolute inset-y-0 left-0 w-1 bg-navy-600 opacity-60 group-hover:opacity-100 transition-opacity" />
                      <div className="flex items-center gap-3 pl-1">
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-navy-100 bg-navy-50">
                          {member.photoUrl ? (
                            <Image
                              src={member.photoUrl}
                              alt={member.fullName}
                              fill
                              sizes="56px"
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-navy-300">
                              <UserRound size={20} />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-display text-sm font-bold text-navy-950 group-hover:text-navy-700 transition-colors">
                              {member.fullName}
                            </h4>
                            <span className="font-mono text-[0.625rem] text-navy-300">
                              0{idx + 1}
                            </span>
                          </div>
                          <p className="text-xs font-medium text-navy-600 mt-0.5">
                            {member.role}
                          </p>
                          <p className="mt-1 text-[0.6875rem] text-navy-400 line-clamp-1">
                            {member.bio}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Colonne Droite : Bureau Exécutif (Coordination centrale) */}
              <div
                onMouseEnter={() => setHoveredNode("bureau")}
                onMouseLeave={() => setHoveredNode(null)}
                className="flex flex-col items-center"
              >
                {/* Entête d'Organe Bureau */}
                <div className="relative mb-6 text-center">
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white px-4 py-1.5 shadow-sm">
                    <Briefcase size={15} className="text-primary-600" />
                    <span className="font-display text-xs font-bold uppercase tracking-wider text-navy-900">
                      Bureau Exécutif
                    </span>
                    <span className="rounded-full bg-primary-100 px-2 py-0.5 text-[0.625rem] font-bold text-primary-800">
                      {bureauMembers.length}
                    </span>
                  </div>
                  <p className="mt-1 text-[0.6875rem] text-navy-400">
                    Direction opérationnelle, gestion &amp; terrain
                  </p>
                </div>

                {/* Cartes Bureau Direction (Top 3) */}
                <div className="w-full space-y-4 max-w-md">
                  {bureauDirection.map((member, idx) => (
                    <motion.div
                      key={member.id}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => setSelectedMember(member)}
                      className="group relative cursor-pointer overflow-hidden rounded-xl border border-primary-100 bg-white p-4 shadow-sm transition-all duration-300 hover:border-primary-400 hover:shadow-md"
                    >
                      <span className="absolute inset-y-0 left-0 w-1 bg-primary-600 opacity-60 group-hover:opacity-100 transition-opacity" />
                      <div className="flex items-center gap-3 pl-1">
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-primary-100 bg-primary-50">
                          {member.photoUrl ? (
                            <Image
                              src={member.photoUrl}
                              alt={member.fullName}
                              fill
                              sizes="56px"
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-primary-300">
                              <UserRound size={20} />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-display text-sm font-bold text-navy-950 group-hover:text-primary-700 transition-colors">
                              {member.fullName}
                            </h4>
                            <span className="font-mono text-[0.625rem] text-primary-400">
                              BE-0{idx + 1}
                            </span>
                          </div>
                          <p className="text-xs font-medium text-primary-600 mt-0.5">
                            {member.role}
                          </p>
                          <p className="mt-1 text-[0.6875rem] text-navy-400 line-clamp-1">
                            {member.bio}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Raccordement SVG complexe du Bureau Exécutif vers les Pôles Opérationnels */}
            <div className="relative w-full h-24 my-2 pointer-events-none z-0">
              <svg
                className="w-full h-full"
                viewBox="0 0 1000 96"
                preserveAspectRatio="none"
                fill="none"
              >
                {/* Ligne descendante depuis le bureau exécutif (x: 750) */}
                <path
                  d="M 750 0 L 750 35"
                  stroke="#2f9950"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />

                <circle cx="750" cy="35" r="4" fill="#2f9950" />

                {/* Courbe vers Pôle Santé (x: 500) */}
                <path
                  d="M 750 35 C 750 65, 520 65, 520 96"
                  stroke="#2f9950"
                  strokeWidth="1.75"
                  strokeDasharray="5 5"
                />

                {/* Courbe vers Pôle Éducation (x: 750) */}
                <path
                  d="M 750 35 L 750 96"
                  stroke="#2f9950"
                  strokeWidth="1.75"
                  strokeDasharray="5 5"
                />

                {/* Courbe vers Pôle Communication (x: 950) */}
                <path
                  d="M 750 35 C 750 65, 920 65, 920 96"
                  stroke="#2f9950"
                  strokeWidth="1.75"
                  strokeDasharray="5 5"
                />

                {/* Particule active sur la branche éducation */}
                <circle r="3" fill="#2f9950">
                  <animateMotion
                    path="M 750 35 L 750 96"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </circle>
              </svg>
            </div>

            {/* Niveau 2 : Pôles Opérationnels & Missions Spécialisées */}
            <div className="mt-2">
              <div className="text-center mb-6">
                <span className="inline-flex items-center gap-1.5 font-mono text-[0.6875rem] font-bold uppercase tracking-wider text-primary-700 bg-primary-50 px-3 py-1 rounded-full border border-primary-200">
                  Niveau Opérationnel &amp; Déploiement Terrain
                </span>
                <h3 className="font-display text-base font-bold text-navy-950 mt-2">
                  Responsables de Pôles &amp; Coordination Spécialisée
                </h3>
              </div>

              <div className="grid grid-cols-3 gap-6 max-w-5xl mx-auto">
                {bureauPoles.map((member, idx) => {
                  const roleLower = (member.role || "").toLowerCase();
                  let Icon = Award;
                  let poleTheme = "border-emerald-200 bg-emerald-50/40 text-emerald-700";

                  if (roleLower.includes("santé") || roleLower.includes("médecin")) {
                    Icon = Stethoscope;
                    poleTheme = "border-rose-200 bg-rose-50/40 text-rose-700";
                  } else if (roleLower.includes("scolaire") || roleLower.includes("éducation")) {
                    Icon = GraduationCap;
                    poleTheme = "border-blue-200 bg-blue-50/40 text-blue-700";
                  } else if (roleLower.includes("comm") || roleLower.includes("événement")) {
                    Icon = Megaphone;
                    poleTheme = "border-amber-200 bg-amber-50/40 text-amber-700";
                  }

                  return (
                    <motion.div
                      key={member.id}
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => setSelectedMember(member)}
                      className="group relative cursor-pointer overflow-hidden rounded-xl border border-navy-100 bg-white p-5 shadow-sm transition-all duration-300 hover:border-primary-400 hover:shadow-lg"
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-navy-50">
                        <span className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[0.6875rem] font-bold ${poleTheme}`}>
                          <Icon size={13} />
                          Pôle Action
                        </span>
                        <span className="font-mono text-[0.625rem] text-navy-300">
                          0{idx + 1}
                        </span>
                      </div>

                      <div className="mt-4 flex items-center gap-3.5">
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-navy-100">
                          {member.photoUrl ? (
                            <Image
                              src={member.photoUrl}
                              alt={member.fullName}
                              fill
                              sizes="64px"
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-navy-50 text-navy-300">
                              <UserRound size={24} />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h4 className="font-display text-sm font-bold text-navy-950 group-hover:text-primary-700 transition-colors">
                            {member.fullName}
                          </h4>
                          <p className="text-xs font-semibold text-primary-600 line-clamp-1 mt-0.5">
                            {member.role}
                          </p>
                        </div>
                      </div>

                      <p className="mt-3 text-xs text-navy-600 line-clamp-2 leading-relaxed">
                        {member.bio}
                      </p>

                      <div className="mt-4 pt-3 border-t border-navy-50 flex items-center justify-between text-[0.6875rem] font-semibold text-navy-500 group-hover:text-primary-600 transition-colors">
                        <span>Voir les attributions</span>
                        <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    )}

      {/* =========================================================================
          VUE 2 : ANNUAIRE & FICHES DÉTAILLÉES (Mode Grille)
          ========================================================================= */}
      {viewMode === "grid" && (
        <div>
          {/* Filtres par organe */}
          <div className="flex flex-wrap items-center gap-2 mb-8">
            <span className="text-xs font-semibold text-navy-400 mr-2">Filtrer par organe :</span>
            {[
              { id: "all", label: `Tous (${members.length})` },
              { id: "fondatrice", label: "Présidence & Fondatrice" },
              { id: "bureau", label: `Bureau Exécutif (${bureauMembers.length})` },
              { id: "ca", label: `Conseil d'Administration (${caMembers.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id as typeof activeFilter)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                  activeFilter === tab.id
                    ? "bg-navy-900 text-white shadow-xs"
                    : "bg-navy-50 text-navy-600 hover:bg-navy-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Grille de cartes */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredGridMembers.map((member, index) => {
              const details = getMemberDetails(member);
              return (
                <motion.article
                  key={member.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.04 }}
                  onClick={() => setSelectedMember(member)}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-navy-100 bg-white p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-primary-400 hover:shadow-xl cursor-pointer"
                >
                  <span
                    className={`absolute inset-x-0 top-0 h-1 ${
                      details.isFounder
                        ? "bg-gradient-to-r from-gold-500 via-primary-500 to-gold-500"
                        : member.organBody === "bureau"
                          ? "bg-primary-500"
                          : "bg-navy-600"
                    }`}
                  />

                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-navy-100 bg-navy-50">
                        {member.photoUrl ? (
                          <Image
                            src={member.photoUrl}
                            alt={member.fullName}
                            fill
                            sizes="80px"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-navy-300">
                            <UserRound size={28} />
                          </div>
                        )}
                      </div>

                      <span className="font-mono text-[0.625rem] font-bold uppercase tracking-wider text-navy-400 bg-navy-50 px-2 py-0.5 rounded-sm">
                        {member.organBody}
                      </span>
                    </div>

                    <h3 className="font-display text-base font-bold text-navy-950 mt-4 group-hover:text-primary-700 transition-colors">
                      {member.fullName}
                    </h3>
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 mt-0.5">
                      {member.role}
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-navy-600 line-clamp-3">
                      {member.bio}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-navy-50 flex items-center justify-between text-[0.6875rem] font-medium text-navy-400 group-hover:text-primary-600 transition-colors">
                    <span>Fiche de gouvernance</span>
                    <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          MODALE DE PROFIL : DOSSIER DE GOUVERNANCE OFFICIEL
          ========================================================================= */}
      <AnimatePresence>
        {selectedMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop sombre flouté */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMember(null)}
              className="absolute inset-0 bg-navy-950/75 backdrop-blur-md"
            />

            {/* Fenêtre modale */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-2xl z-10 max-h-[90vh] flex flex-col"
            >
              {/* Entête décoratif aux couleurs FSCPE */}
              <div className="relative h-28 w-full bg-gradient-to-r from-navy-900 via-primary-900 to-navy-950 p-6 flex items-start justify-between">
                <span className="font-mono text-xs uppercase tracking-widest text-gold-400 font-bold">
                  Fondation Saran Camara • Dossier de Gouvernance
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedMember(null)}
                  className="rounded-full bg-white/10 p-1.5 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Corps de la modale */}
              <div className="p-6 sm:p-8 overflow-y-auto">
                <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5 -mt-16 sm:-mt-20 mb-6">
                  {/* Portrait grand format */}
                  <div className="relative h-28 w-28 sm:h-32 sm:w-32 shrink-0 overflow-hidden rounded-2xl border-4 border-white bg-navy-100 shadow-xl">
                    {selectedMember.photoUrl ? (
                      <Image
                        src={selectedMember.photoUrl}
                        alt={selectedMember.fullName}
                        fill
                        sizes="128px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-navy-300">
                        <UserRound size={48} />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-xs font-bold text-primary-700 border border-primary-200">
                      <Sparkles size={12} />
                      {getMemberDetails(selectedMember).organLabel}
                    </span>
                    <h3 className="font-display text-2xl font-bold text-navy-950 mt-1.5">
                      {selectedMember.fullName}
                    </h3>
                    <p className="font-mono text-xs font-semibold uppercase tracking-wider text-gold-600 mt-0.5">
                      {selectedMember.role}
                    </p>
                  </div>
                </div>

                {/* Biographie détaillée */}
                <div className="space-y-6">
                  <div>
                    <h4 className="font-display text-sm font-bold text-navy-900 flex items-center gap-2">
                      <Info size={16} className="text-primary-600" />
                      Parcours &amp; Engagement au sein de la FSCPE
                    </h4>
                    <p className="mt-2 text-sm leading-relaxed text-navy-700 whitespace-pre-line bg-navy-50/50 p-4 rounded-xl border border-navy-100">
                      {selectedMember.bio || "Membre engagé au service de la protection de l'enfance en Guinée."}
                    </p>
                  </div>

                  {/* Piliers de responsabilité */}
                  <div>
                    <h4 className="font-display text-sm font-bold text-navy-900 flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-primary-600" />
                      Missions statutaires &amp; Responsabilités clés
                    </h4>
                    <ul className="mt-3 space-y-2">
                      {getMemberDetails(selectedMember).responsibilities.map((resp, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs text-navy-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary-500 mt-1.5 shrink-0" />
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer d'action */}
                <div className="mt-8 pt-5 border-t border-navy-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-xs text-navy-400">
                    Mandat officiel en cours • République de Guinée
                  </span>
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setSelectedMember(null)}
                      className="w-full sm:w-auto rounded-lg px-4 py-2 text-xs font-semibold text-navy-600 hover:bg-navy-50 border border-navy-200 transition-colors"
                    >
                      Fermer
                    </button>
                    <Link
                      href="/contact"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-navy-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-primary-600 transition-colors"
                    >
                      <span>Contacter ce pôle</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
