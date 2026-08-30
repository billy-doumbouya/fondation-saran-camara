import * as yup from "yup";

export const contactSchema = yup.object({
  name: yup.string().trim().min(2, "Le nom est trop court").max(150).required("Le nom est requis"),
  email: yup.string().trim().email("Adresse e-mail invalide").required("L'e-mail est requis"),
  phone: yup.string().trim().max(50).optional(),
  subject: yup.string().trim().max(250).optional(),
  message: yup.string().trim().min(10, "Message trop court").max(5000).required("Le message est requis"),
});
export type ContactFormValues = yup.InferType<typeof contactSchema>;

export const donationSchema = yup.object({
  donorName: yup.string().trim().min(2).max(150).required("Le nom est requis"),
  donorEmail: yup.string().trim().email("Adresse e-mail invalide").required("L'e-mail est requis"),
  donorPhone: yup
    .string()
    .trim()
    .matches(/^[+0-9 ]{6,20}$/, "Numéro de téléphone invalide")
    .required("Le numéro de téléphone est requis"),
  amount: yup
    .number()
    .typeError("Montant invalide")
    .positive("Le montant doit être positif")
    .min(5000, "Montant minimum : 5 000 GNF")
    .required("Le montant est requis"),
});
export type DonationFormValues = yup.InferType<typeof donationSchema>;

export const loginSchema = yup.object({
  password: yup.string().min(1, "Mot de passe requis").required("Mot de passe requis"),
});
export type LoginFormValues = yup.InferType<typeof loginSchema>;

export const siteSettingsSchema = yup.object({
  name: yup.string().trim().min(2).max(200).required("Nom requis"),
  fullName: yup.string().trim().min(2).max(250).required("Nom complet requis"),
  acronym: yup.string().trim().min(2).max(20).required("Sigle requis"),
  slogan: yup.string().trim().min(2).max(250).required("Slogan requis"),
  founderName: yup.string().trim().min(2).max(150).required("Nom du fondateur requis"),
  address: yup.string().trim().min(2).max(250).required("Adresse requise"),
  phone: yup.string().trim().min(6).max(50).required("Téléphone requis"),
  phoneSecondary: yup.string().trim().max(50).nullable().optional(),
  email: yup.string().trim().email("E-mail invalide").required("E-mail requis"),
  quote: yup.string().trim().min(10).max(500).required("Citation requise"),
  whatsappNumber: yup.string().trim().min(6).max(50).required("WhatsApp requis"),
  whatsappDisplay: yup.string().trim().min(6).max(50).required("Affichage WhatsApp requis"),
  heroVideoUrl: yup.string().trim().url("URL vidéo invalide").nullable().optional(),
  heroPosterUrl: yup.string().trim().url("URL poster invalide").nullable().optional(),
});
export type SiteSettingsFormValues = yup.InferType<typeof siteSettingsSchema>;

export const adminPasswordUpdateSchema = yup.object({
  currentPassword: yup.string().min(1, "Mot de passe actuel requis").required("Mot de passe actuel requis"),
  newPassword: yup.string().min(8, "Le nouveau mot de passe doit contenir au moins 8 caractères").required("Nouveau mot de passe requis"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Les mots de passe ne correspondent pas")
    .required("Confirmation requise"),
});
export type AdminPasswordUpdateFormValues = yup.InferType<typeof adminPasswordUpdateSchema>;

export const newsSchema = yup.object({
  title: yup.string().trim().min(3).max(250).required("Titre requis"),
  slug: yup
    .string()
    .trim()
    .matches(/^[a-z0-9-]+$/, "Le slug ne doit contenir que des minuscules, chiffres et tirets")
    .required("Slug requis"),
  excerpt: yup.string().trim().min(10).max(500).required("Résumé requis"),
  content: yup.string().trim().min(20).required("Contenu requis"),
  coverImageUrl: yup.string().url().nullable().optional(),
  coverImagePublicId: yup.string().nullable().optional(),
  published: yup.boolean().default(false),
});
export type NewsFormValues = yup.InferType<typeof newsSchema>;

export const testimonialSchema = yup.object({
  authorName: yup.string().trim().min(2).max(150).required("Nom requis"),
  authorRole: yup.string().trim().max(150).nullable().optional(),
  quote: yup.string().trim().min(10).max(2000).required("Témoignage requis"),
  photoUrl: yup.string().url().nullable().optional(),
  photoPublicId: yup.string().nullable().optional(),
  rating: yup.number().min(1).max(5).default(5),
  published: yup.boolean().default(true),
});
export type TestimonialFormValues = yup.InferType<typeof testimonialSchema>;

export const teamMemberSchema = yup.object({
  fullName: yup.string().trim().min(2).max(150).required("Nom requis"),
  role: yup.string().trim().min(2).max(150).required("Fonction requise"),
  bio: yup.string().trim().max(3000).nullable().optional(),
  photoUrl: yup.string().url().nullable().optional(),
  photoPublicId: yup.string().nullable().optional(),
  organBody: yup.string().oneOf(["bureau", "ca", "fondatrice"]).default("bureau"),
  displayOrder: yup.number().default(0),
});
export type TeamMemberFormValues = yup.InferType<typeof teamMemberSchema>;

export const galleryImageSchema = yup.object({
  title: yup.string().trim().max(200).nullable().optional(),
  imageUrl: yup.string().url().required("Image requise"),
  imagePublicId: yup.string().required("Image requise"),
  category: yup.string().trim().max(100).nullable().optional(),
});
export type GalleryImageFormValues = yup.InferType<typeof galleryImageSchema>;

export const programSchema = yup.object({
  title: yup.string().trim().min(3).max(250).required("Titre requis"),
  slug: yup
    .string()
    .trim()
    .matches(/^[a-z0-9-]+$/, "Slug invalide")
    .required("Slug requis"),
  summary: yup.string().trim().min(10).max(500).required("Résumé requis"),
  content: yup.string().trim().min(20).required("Contenu requis"),
  coverImageUrl: yup.string().url().nullable().optional(),
  coverImagePublicId: yup.string().nullable().optional(),
  pillar: yup
    .string()
    .oneOf(["education", "protection", "orphelins", "social"])
    .required("Pilier requis"),
  beneficiariesCount: yup.number().min(0).nullable().optional(),
  published: yup.boolean().default(true),
});
export type ProgramFormValues = yup.InferType<typeof programSchema>;

export const eventSchema = yup.object({
  title: yup.string().trim().min(3).max(250).required("Titre requis"),
  description: yup.string().trim().max(3000).nullable().optional(),
  location: yup.string().trim().max(250).nullable().optional(),
  startAt: yup.string().required("Date de début requise"),
  endAt: yup.string().nullable().optional(),
  coverImageUrl: yup.string().url().nullable().optional(),
  published: yup.boolean().default(true),
});
export type EventFormValues = yup.InferType<typeof eventSchema>;

export const chatMessageSchema = yup.object({
  message: yup.string().trim().min(1).max(1000).required(),
});
