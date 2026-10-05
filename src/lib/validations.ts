import * as yup from "yup";

export const contactSchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(2, "Le nom doit contenir au moins 2 caractères.")
    .max(150, "Le nom est trop long.")
    .required("Le nom est obligatoire."),
  email: yup
    .string()
    .trim()
    .email("Adresse e-mail invalide.")
    .max(200, "E-mail trop long.")
    .required("L'e-mail est obligatoire."),
  phone: yup
    .string()
    .trim()
    .max(50, "Numéro trop long.")
    .nullable()
    .transform((v) => (v === "" ? null : v)),
  subject: yup
    .string()
    .trim()
    .min(2, "Sujet trop court.")
    .max(250, "Sujet trop long.")
    .required("L'objet est obligatoire."),
  message: yup
    .string()
    .trim()
    .min(10, "Le message doit contenir au moins 10 caractères.")
    .max(5000, "Message trop long.")
    .required("Le message est obligatoire."),
  consent: yup
    .boolean()
    .oneOf([true], "Vous devez accepter que vos données soient traitées.")
    .required(),
  // Keep server-side honeypot checks, but ignore browser autofill on the client.
  website: yup.string().transform(() => "").optional(),
});
export type ContactFormValues = yup.InferType<typeof contactSchema>;

export const donationSchema = yup.object({
  amount: yup
    .number()
    .typeError("Montant invalide.")
    .min(1000, "Le montant minimum est de 1 000 GNF.")
    .max(100_000_000, "Montant trop élevé.")
    .required("Le montant est obligatoire."),
  paymentMethod: yup
    .string()
    .oneOf(["orange_money", "mtn_money", "moov_money", "wave", "card"], "Moyen de paiement invalide.")
    .required(),
  donorName: yup.string().trim().min(2, "Nom invalide.").max(150).required("Le nom est obligatoire."),
  donorPhone: yup.string().trim().min(8, "Numéro invalide.").max(50).required("Le téléphone est obligatoire."),
  donorEmail: yup.string().trim().email("E-mail invalide.").max(200).required("L'e-mail est obligatoire."),
  mmoProvider: yup.string().trim().max(50).optional(),
  customerCountry: yup.string().trim().length(2).optional(),
});
export type DonationFormValues = yup.InferType<typeof donationSchema>;

export { formatGNF } from "./utils";

export const loginSchema = yup.object({
  password: yup
    .string()
    .min(1, "Mot de passe requis")
    .required("Mot de passe requis"),
});
export type LoginFormValues = yup.InferType<typeof loginSchema>;

export const siteSettingsSchema = yup.object({
  name: yup.string().trim().min(2).max(200).required("Nom requis"),
  fullName: yup.string().trim().min(2).max(250).required("Nom complet requis"),
  acronym: yup.string().trim().min(2).max(20).required("Sigle requis"),
  slogan: yup.string().trim().min(2).max(250).required("Slogan requis"),
  founderName: yup
    .string()
    .trim()
    .min(2)
    .max(150)
    .required("Nom du fondateur requis"),
  address: yup.string().trim().min(2).max(250).required("Adresse requise"),
  phone: yup.string().trim().min(6).max(50).required("Téléphone requis"),
  phoneSecondary: yup
    .string()
    .trim()
    .transform((v) => (v === "" || v === undefined ? null : v))
    .max(50)
    .nullable()
    .optional(),
  email: yup.string().trim().email("E-mail invalide").required("E-mail requis"),
  quote: yup.string().trim().min(10).max(500).required("Citation requise"),
  whatsappNumber: yup
    .string()
    .trim()
    .min(6)
    .max(50)
    .required("WhatsApp requis"),
  whatsappDisplay: yup
    .string()
    .trim()
    .min(6)
    .max(50)
    .required("Affichage WhatsApp requis"),
  heroVideoUrl: yup
    .string()
    .trim()
    .transform((v) => (v === "" || v === undefined ? null : v))
    .url("URL vidéo invalide")
    .nullable()
    .optional(),
  heroPosterUrl: yup
    .string()
    .trim()
    .transform((v) => (v === "" || v === undefined ? null : v))
    .url("URL poster invalide")
    .nullable()
    .optional(),
});
export type SiteSettingsFormValues = yup.InferType<typeof siteSettingsSchema>;

export const adminPasswordUpdateSchema = yup.object({
  currentPassword: yup
    .string()
    .min(1, "Mot de passe actuel requis")
    .required("Mot de passe actuel requis"),
  newPassword: yup
    .string()
    .min(8, "Le nouveau mot de passe doit contenir au moins 8 caractères")
    .required("Nouveau mot de passe requis"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Les mots de passe ne correspondent pas")
    .required("Confirmation requise"),
});
export type AdminPasswordUpdateFormValues = yup.InferType<
  typeof adminPasswordUpdateSchema
>;

export const newsSchema = yup.object({
  title: yup.string().trim().min(3, "Le titre doit contenir au moins 3 caractères").max(250).required("Titre requis"),
  slug: yup
    .string()
    .trim()
    .matches(
      /^[a-z0-9-]+$/,
      "Le slug ne doit contenir que des minuscules, chiffres et tirets",
    )
    .required("Slug requis"),
  excerpt: yup.string().trim().min(10, "Le résumé doit faire au moins 10 caractères").max(500).required("Résumé requis"),
  content: yup.string().trim().min(20, "Le contenu doit faire au moins 20 caractères").required("Contenu requis"),
  coverImageUrl: yup
    .string()
    .trim()
    .transform((v) => (v === "" || v === undefined ? null : v))
    .url("URL d'image invalide")
    .nullable()
    .optional(),
  coverImagePublicId: yup
    .string()
    .trim()
    .transform((v) => (v === "" || v === undefined ? null : v))
    .nullable()
    .optional(),
  published: yup.boolean().default(false),
});
export type NewsFormValues = yup.InferType<typeof newsSchema>;

export const testimonialSchema = yup.object({
  authorName: yup.string().trim().min(2, "Nom requis (min 2 caractères)").max(150).required("Nom requis"),
  authorRole: yup
    .string()
    .trim()
    .transform((v) => (v === "" || v === undefined ? null : v))
    .max(150)
    .nullable()
    .optional(),
  quote: yup.string().trim().min(10, "Témoignage trop court (min 10 caractères)").max(2000).required("Témoignage requis"),
  photoUrl: yup
    .string()
    .trim()
    .transform((v) => (v === "" || v === undefined ? null : v))
    .url("URL de photo invalide")
    .nullable()
    .optional(),
  photoPublicId: yup
    .string()
    .trim()
    .transform((v) => (v === "" || v === undefined ? null : v))
    .nullable()
    .optional(),
  rating: yup
    .number()
    .transform((v, orig) => (String(orig).trim() === "" || orig === null || orig === undefined || isNaN(v) ? 5 : v))
    .min(1)
    .max(5)
    .default(5),
  published: yup.boolean().default(true),
});
export type TestimonialFormValues = yup.InferType<typeof testimonialSchema>;

export const teamMemberSchema = yup.object({
  fullName: yup.string().trim().min(2, "Nom complet requis (min 2 caractères)").max(150).required("Nom requis"),
  role: yup.string().trim().min(2, "Fonction requise").max(150).required("Fonction requise"),
  bio: yup
    .string()
    .trim()
    .transform((v) => (v === "" || v === undefined ? null : v))
    .max(3000)
    .nullable()
    .optional(),
  photoUrl: yup
    .string()
    .trim()
    .transform((v) => (v === "" || v === undefined ? null : v))
    .url("URL de photo invalide")
    .nullable()
    .optional(),
  photoPublicId: yup
    .string()
    .trim()
    .transform((v) => (v === "" || v === undefined ? null : v))
    .nullable()
    .optional(),
  organBody: yup
    .string()
    .oneOf(["bureau", "ca", "fondatrice"])
    .default("bureau"),
  displayOrder: yup
    .number()
    .transform((v, orig) => (String(orig).trim() === "" || orig === null || orig === undefined || isNaN(v) ? 0 : v))
    .default(0),
});
export type TeamMemberFormValues = yup.InferType<typeof teamMemberSchema>;

export const galleryImageSchema = yup.object({
  title: yup
    .string()
    .trim()
    .transform((v) => (v === "" || v === undefined ? null : v))
    .max(200)
    .nullable()
    .optional(),
  imageUrl: yup
    .string()
    .trim()
    .url("URL d'image invalide")
    .required("Image requise"),
  imagePublicId: yup
    .string()
    .trim()
    .required("Identifiant d'image requis"),
  category: yup
    .string()
    .trim()
    .transform((v) => (v === "" || v === undefined ? null : v))
    .max(100)
    .nullable()
    .optional(),
});
export type GalleryImageFormValues = yup.InferType<typeof galleryImageSchema>;

export const programSchema = yup.object({
  title: yup.string().trim().min(3, "Titre requis (min 3 caractères)").max(250).required("Titre requis"),
  slug: yup
    .string()
    .trim()
    .matches(/^[a-z0-9-]+$/, "Slug invalide (minuscules, chiffres et tirets uniquement)")
    .required("Slug requis"),
  summary: yup.string().trim().min(10, "Résumé trop court (min 10 caractères)").max(500).required("Résumé requis"),
  content: yup.string().trim().min(20, "Présentation trop courte (min 20 caractères)").required("Contenu requis"),
  coverImageUrl: yup
    .string()
    .trim()
    .transform((v) => (v === "" || v === undefined ? null : v))
    .url("URL d'image invalide")
    .nullable()
    .optional(),
  coverImagePublicId: yup
    .string()
    .trim()
    .transform((v) => (v === "" || v === undefined ? null : v))
    .nullable()
    .optional(),
  pillar: yup
    .string()
    .oneOf(["education", "protection", "orphelins", "social"])
    .required("Pilier requis"),
  beneficiariesCount: yup
    .number()
    .transform((v, orig) => (String(orig).trim() === "" || orig === null || orig === undefined || isNaN(v) ? null : v))
    .min(0, "Le nombre doit être positif")
    .nullable()
    .optional(),
  published: yup.boolean().default(true),
});
export type ProgramFormValues = yup.InferType<typeof programSchema>;

export const eventSchema = yup.object({
  title: yup.string().trim().min(3, "Titre requis (min 3 caractères)").max(250).required("Titre requis"),
  description: yup
    .string()
    .trim()
    .transform((v) => (v === "" || v === undefined ? null : v))
    .max(3000)
    .nullable()
    .optional(),
  location: yup
    .string()
    .trim()
    .transform((v) => (v === "" || v === undefined ? null : v))
    .max(250)
    .nullable()
    .optional(),
  startAt: yup.string().required("Date de début requise"),
  endAt: yup
    .string()
    .trim()
    .transform((v) => (v === "" || v === undefined ? null : v))
    .nullable()
    .optional(),
  coverImageUrl: yup
    .string()
    .trim()
    .transform((v) => (v === "" || v === undefined ? null : v))
    .url("URL d'image invalide")
    .nullable()
    .optional(),
  coverImagePublicId: yup
    .string()
    .trim()
    .transform((v) => (v === "" || v === undefined ? null : v))
    .nullable()
    .optional(),
  published: yup.boolean().default(true),
});
export type EventFormValues = yup.InferType<typeof eventSchema>;

export const chatMessageSchema = yup.object({
  message: yup.string().trim().min(1).max(1000).required(),
});
