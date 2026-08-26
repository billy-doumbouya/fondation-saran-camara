export interface NavLink {
  label: string;
  href: string;
  children?: { label: string; href: string; description?: string }[];
}

export const NAV_LINKS: NavLink[] = [
  { label: "Accueil", href: "/" },
  {
    label: "À propos",
    href: "/a-propos",
    children: [
      { label: "Notre histoire", href: "/a-propos", description: "D'où vient la Fondation" },
      { label: "Mission & vision", href: "/mission", description: "Ce que nous poursuivons" },
      { label: "Équipe & gouvernance", href: "/equipe", description: "Bureau, CA et Fondatrice" },
    ],
  },
  {
    label: "Nos actions",
    href: "/programmes",
    children: [
      { label: "Programmes & projets", href: "/programmes" },
      { label: "Notre impact", href: "/impact" },
      { label: "Agenda", href: "/agenda" },
    ],
  },
  { label: "Actualités", href: "/actualites" },
  { label: "Témoignages", href: "/temoignages" },
  { label: "Partenaires", href: "/partenaires" },
  { label: "Contact", href: "/contact" },
];

export const BRAND = {
  name: "Fondation Saran Camara",
  fullName: "Fondation Saran Camara pour l'Éducation et la Protection des Enfants",
  acronym: "FSCPE",
  slogan: "Ensemble pour un avenir meilleur, des enfants",
  founderName: "Saran Camara",
  address: "Kissosso, Commune de Matoto, Conakry, République de Guinée",
  phone: "+224 620 32 19 16",
  phoneSecondary: "+224 628 53 22 14",
  email: "saran4camara@gmail.com",
  quote: "Offrir une éducation à un orphelin, c'est lui donner espoir d'un avenir meilleur",
  whatsappNumber: "224628532214", // format international sans "+", pour les liens wa.me
  whatsappDisplay: "+224 628 53 22 14",
};

export const HERO_TYPING_WORDS = [
  "un avenir meilleur.",
  "l'éducation pour tous.",
  "la protection de chaque enfant.",
  "l'espoir d'une vie digne.",
];
