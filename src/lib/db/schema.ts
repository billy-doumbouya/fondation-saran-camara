import {
  pgTable,
  serial,
  text,
  varchar,
  timestamp,
  boolean,
  integer,
  jsonb,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

/* =========================================================
   FSCPE — Drizzle Schema (Neon Postgres)
   ========================================================= */

/** Actualités / Blog */
export const news = pgTable(
  "news",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 200 }).notNull().unique(),
    title: varchar("title", { length: 250 }).notNull(),
    excerpt: text("excerpt").notNull(),
    content: text("content").notNull(),
    coverImageUrl: text("cover_image_url"),
    coverImagePublicId: text("cover_image_public_id"),
    published: boolean("published").notNull().default(false),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("news_published_idx").on(t.published),
    index("news_published_at_idx").on(t.publishedAt),
  ],
);

/** Témoignages */
export const testimonials = pgTable(
  "testimonials",
  {
    id: serial("id").primaryKey(),
    authorName: varchar("author_name", { length: 150 }).notNull(),
    authorRole: varchar("author_role", { length: 150 }),
    quote: text("quote").notNull(),
    photoUrl: text("photo_url"),
    photoPublicId: text("photo_public_id"),
    rating: integer("rating").default(5),
    published: boolean("published").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("testimonials_published_idx").on(t.published)],
);

/** Équipe / Gouvernance */
export const teamMembers = pgTable(
  "team_members",
  {
    id: serial("id").primaryKey(),
    fullName: varchar("full_name", { length: 150 }).notNull(),
    role: varchar("role", { length: 150 }).notNull(),
    bio: text("bio"),
    photoUrl: text("photo_url"),
    photoPublicId: text("photo_public_id"),
    organBody: varchar("organ_body", { length: 50 }).default("bureau"), // bureau | ca | fondatrice
    displayOrder: integer("display_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("team_organ_order_idx").on(t.organBody, t.displayOrder)],
);

/** Galerie photos */
export const galleryImages = pgTable(
  "gallery_images",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 200 }),
    imageUrl: text("image_url").notNull(),
    imagePublicId: text("image_public_id").notNull(),
    category: varchar("category", { length: 100 }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("gallery_category_idx").on(t.category)],
);

/** Programmes / Projets */
export const programs = pgTable(
  "programs",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 200 }).notNull().unique(),
    title: varchar("title", { length: 250 }).notNull(),
    summary: text("summary").notNull(),
    content: text("content").notNull(),
    coverImageUrl: text("cover_image_url"),
    coverImagePublicId: text("cover_image_public_id"),
    pillar: varchar("pillar", { length: 100 }), // education | protection | orphelins | social
    beneficiariesCount: integer("beneficiaries_count"),
    published: boolean("published").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("programs_published_idx").on(t.published),
    index("programs_pillar_idx").on(t.pillar),
  ],
);

/** Agenda / Événements */
export const events = pgTable(
  "events",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 200 }).unique(), // optionnel mais recommandé pour SEO
    title: varchar("title", { length: 250 }).notNull(),
    description: text("description"),
    location: varchar("location", { length: 250 }),
    startAt: timestamp("start_at", { withTimezone: true }).notNull(),
    endAt: timestamp("end_at", { withTimezone: true }),
    coverImageUrl: text("cover_image_url"),
    published: boolean("published").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("events_published_idx").on(t.published),
    index("events_start_at_idx").on(t.startAt),
  ],
);

/** Partenaires */
export const partners = pgTable(
  "partners",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 200 }).notNull(),
    logoUrl: text("logo_url"),
    websiteUrl: text("website_url"),
    displayOrder: integer("display_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("partners_order_idx").on(t.displayOrder)],
);

/** Messages du formulaire de contact */
export const contactMessages = pgTable(
  "contact_messages",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 150 }).notNull(),
    email: varchar("email", { length: 200 }).notNull(),
    phone: varchar("phone", { length: 50 }),
    subject: varchar("subject", { length: 250 }),
    message: text("message").notNull(),
    isRead: boolean("is_read").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("contact_is_read_idx").on(t.isRead),
    index("contact_created_at_idx").on(t.createdAt),
  ],
);

/** Dons (traçabilité, données sensibles — jamais exposées au chatbot) */
export const donations = pgTable(
  "donations",
  {
    id: serial("id").primaryKey(),
    reference: varchar("reference", { length: 100 }).notNull().unique(),
    donorName: varchar("donor_name", { length: 150 }),
    donorEmail: varchar("donor_email", { length: 200 }),
    donorPhone: varchar("donor_phone", { length: 50 }),
    amount: integer("amount").notNull(), // en GNF
    currency: varchar("currency", { length: 10 }).notNull().default("GNF"),
    provider: varchar("provider", { length: 50 }).notNull().default("geniuspay"),
    paymentMethod: varchar("payment_method", { length: 50 }), // orange_money | mtn_money | moov_money | wave | card | checkout
    status: varchar("status", { length: 30 }).notNull().default("pending"), // pending | success | failed
    providerPayload: jsonb("provider_payload"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("donations_reference_idx").on(t.reference),
    index("donations_status_idx").on(t.status),
    index("donations_created_at_idx").on(t.createdAt),
  ],
);

/** Réglages admin (mot de passe hashé, textes globaux, vidéo hero, etc.) */
export const settings = pgTable("settings", {
  key: varchar("key", { length: 100 }).primaryKey(),
  value: text("value"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/* =========================================================
   Types inférés (Select + Insert pour toutes les tables)
   ========================================================= */

export type News = typeof news.$inferSelect;
export type NewNews = typeof news.$inferInsert;
export type Testimonial = typeof testimonials.$inferSelect;
export type NewTestimonial = typeof testimonials.$inferInsert;
export type TeamMember = typeof teamMembers.$inferSelect;
export type NewTeamMember = typeof teamMembers.$inferInsert;
export type GalleryImage = typeof galleryImages.$inferSelect;
export type NewGalleryImage = typeof galleryImages.$inferInsert;
export type Program = typeof programs.$inferSelect;
export type NewProgram = typeof programs.$inferInsert;
export type EventItem = typeof events.$inferSelect;
export type NewEventItem = typeof events.$inferInsert;
export type Partner = typeof partners.$inferSelect;
export type NewPartner = typeof partners.$inferInsert;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type NewContactMessage = typeof contactMessages.$inferInsert;
export type Donation = typeof donations.$inferSelect;
export type NewDonation = typeof donations.$inferInsert;
export type Setting = typeof settings.$inferSelect;
export type NewSetting = typeof settings.$inferInsert;