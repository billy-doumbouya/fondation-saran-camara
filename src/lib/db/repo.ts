import { desc, eq, asc, like, inArray, and, lt } from "drizzle-orm";
import { db } from "./index";
import {
  news,
  testimonials,
  teamMembers,
  galleryImages,
  programs,
  events,
  partners,
  contactMessages,
  donations,
  settings,
  type NewNews,
  type NewTestimonial,
  type TeamMember,
  type NewTeamMember,
  type GalleryImage,
  type NewGalleryImage,
  type NewProgram,
  type Program,
  type NewEventItem,
} from "./schema";

export type { TeamMember, NewTeamMember, GalleryImage, NewGalleryImage, Program, NewProgram };

/* -------------------------- NEWS -------------------------- */
export const newsRepo = {
  listPublished: () =>
    db
      .select()
      .from(news)
      .where(eq(news.published, true))
      .orderBy(desc(news.publishedAt)),
  listFeatured: () =>
    db
      .select()
      .from(news)
      .where(eq(news.published, true))
      .orderBy(desc(news.publishedAt))
      .limit(3),
  listAll: () => db.select().from(news).orderBy(desc(news.createdAt)),
  getBySlug: (slug: string) =>
    db
      .select()
      .from(news)
      .where(eq(news.slug, slug))
      .limit(1)
      .then((r) => r[0]),
  getById: (id: number) =>
    db
      .select()
      .from(news)
      .where(eq(news.id, id))
      .limit(1)
      .then((r) => r[0]),
  create: (data: NewNews) => db.insert(news).values(data).returning(),
  update: (id: number, data: Partial<NewNews>) =>
    db
      .update(news)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(news.id, id))
      .returning(),
  remove: (id: number) => db.delete(news).where(eq(news.id, id)),
};

/* ----------------------- TESTIMONIALS ----------------------- */
export const testimonialsRepo = {
  listPublished: () =>
    db
      .select()
      .from(testimonials)
      .where(eq(testimonials.published, true))
      .orderBy(desc(testimonials.createdAt)),
  listFeatured: () =>
    db
      .select()
      .from(testimonials)
      .where(eq(testimonials.published, true))
      .orderBy(desc(testimonials.createdAt))
      .limit(3),
  listAll: () =>
    db.select().from(testimonials).orderBy(desc(testimonials.createdAt)),
  getById: (id: number) =>
    db
      .select()
      .from(testimonials)
      .where(eq(testimonials.id, id))
      .limit(1)
      .then((r) => r[0]),
  create: (data: NewTestimonial) =>
    db.insert(testimonials).values(data).returning(),
  update: (id: number, data: Partial<NewTestimonial>) =>
    db
      .update(testimonials)
      .set(data)
      .where(eq(testimonials.id, id))
      .returning(),
  remove: (id: number) =>
    db.delete(testimonials).where(eq(testimonials.id, id)),
};

/* -------------------------- TEAM -------------------------- */
export const teamRepo = {
  listAll: (): Promise<TeamMember[]> =>
    db.select().from(teamMembers).orderBy(asc(teamMembers.displayOrder)),
  getById: (id: number) =>
    db
      .select()
      .from(teamMembers)
      .where(eq(teamMembers.id, id))
      .limit(1)
      .then((r) => r[0]),
  create: (data: NewTeamMember) =>
    db.insert(teamMembers).values(data).returning(),
  update: (id: number, data: Partial<NewTeamMember>) =>
    db.update(teamMembers).set(data).where(eq(teamMembers.id, id)).returning(),
  remove: (id: number) => db.delete(teamMembers).where(eq(teamMembers.id, id)),
};

/* ------------------------- GALLERY ------------------------- */
export const galleryRepo = {
  listAll: (): Promise<GalleryImage[]> =>
    db.select().from(galleryImages).orderBy(desc(galleryImages.createdAt)),
  getById: (id: number) =>
    db
      .select()
      .from(galleryImages)
      .where(eq(galleryImages.id, id))
      .limit(1)
      .then((r) => r[0]),
  create: (data: NewGalleryImage) =>
    db.insert(galleryImages).values(data).returning(),
  update: (id: number, data: Partial<NewGalleryImage>) =>
    db.update(galleryImages).set(data).where(eq(galleryImages.id, id)).returning(),
  remove: (id: number) =>
    db.delete(galleryImages).where(eq(galleryImages.id, id)),
};

/* ------------------------ PROGRAMS ------------------------ */
export const programsRepo = {
  listPublished: async (): Promise<Program[]> =>
    db
      .select()
      .from(programs)
      .where(eq(programs.published, true))
      .orderBy(desc(programs.createdAt)),
  listFeatured: async (): Promise<Program[]> =>
    db
      .select()
      .from(programs)
      .where(eq(programs.published, true))
      .orderBy(desc(programs.createdAt))
      .limit(3),
  listAll: async (): Promise<Program[]> =>
    db.select().from(programs).orderBy(desc(programs.createdAt)),
  getBySlug: async (slug: string): Promise<Program | null> =>
    db
      .select()
      .from(programs)
      .where(eq(programs.slug, slug))
      .limit(1)
      .then((r) => r[0] ?? null),
  getById: (id: number) =>
    db
      .select()
      .from(programs)
      .where(eq(programs.id, id))
      .limit(1)
      .then((r) => r[0]),
  create: (data: NewProgram) => db.insert(programs).values(data).returning(),
  update: (id: number, data: Partial<NewProgram>) =>
    db.update(programs).set(data).where(eq(programs.id, id)).returning(),
  remove: (id: number) => db.delete(programs).where(eq(programs.id, id)),
};

/* ------------------------- EVENTS ------------------------- */
export const eventsRepo = {
  listPublished: () =>
    db
      .select()
      .from(events)
      .where(eq(events.published, true))
      .orderBy(asc(events.startAt)),
  listAll: () => db.select().from(events).orderBy(asc(events.startAt)),
  getById: (id: number) =>
    db
      .select()
      .from(events)
      .where(eq(events.id, id))
      .limit(1)
      .then((r) => r[0]),
  create: (data: NewEventItem) => db.insert(events).values(data).returning(),
  update: (id: number, data: Partial<NewEventItem>) =>
    db.update(events).set(data).where(eq(events.id, id)).returning(),
  remove: (id: number) => db.delete(events).where(eq(events.id, id)),
};

/* ------------------------ PARTNERS ------------------------ */
export const partnersRepo = {
  listAll: () => db.select().from(partners).orderBy(asc(partners.displayOrder)),
};

/* ---------------------- CONTACT FORM ---------------------- */
export interface ContactMessageInput {
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  ip?: string;
}

export const contactMessagesRepo = {
  create: async (input: ContactMessageInput) => {
    return db
      .insert(contactMessages)
      .values({
        name: input.name,
        email: input.email,
        phone: input.phone,
        subject: input.subject,
        message: input.message,
        isRead: false,
      })
      .returning();
  },
};

export const contactRepo = {
  create: (data: {
    name: string;
    email: string;
    phone?: string | null;
    subject?: string | null;
    message: string;
  }) =>
    db
      .insert(contactMessages)
      .values({ ...data, isRead: false })
      .returning(),
  listAll: () =>
    db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt)),
  listUnread: () =>
    db
      .select()
      .from(contactMessages)
      .where(eq(contactMessages.isRead, false))
      .orderBy(desc(contactMessages.createdAt)),
  markRead: (id: number) =>
    db
      .update(contactMessages)
      .set({ isRead: true })
      .where(eq(contactMessages.id, id)),
  remove: (id: number) =>
    db
      .delete(contactMessages)
      .where(eq(contactMessages.id, id))
      .returning({ id: contactMessages.id }),
};

/* -------------------------- DONATIONS -------------------------- */
/* -------------------------- DONATIONS -------------------------- */
export const PENDING_DONATION_TTL_MS = 30 * 60 * 1000;

export const donationsRepo = {
  expireStalePending: () =>
    db
      .update(donations)
      .set({ status: "failed", updatedAt: new Date() })
      .where(
        and(
          eq(donations.status, "pending"),
          lt(donations.createdAt, new Date(Date.now() - PENDING_DONATION_TTL_MS))
        )
      )
      .returning({ id: donations.id }),
  create: (data: typeof donations.$inferInsert) =>
    db.insert(donations).values(data).returning(),
  updateStatus: (reference: string, status: string, payload?: unknown) =>
    db
      .update(donations)
      .set({ status, providerPayload: payload as object })
      .where(eq(donations.reference, reference))
      .returning(),
  findByReference: (reference: string) =>
    db
      .select()
      .from(donations)
      .where(eq(donations.reference, reference))
      .limit(1)
      .then((r) => r[0]),
  listAll: async () => {
    await donationsRepo.expireStalePending();
    return db.select().from(donations).orderBy(desc(donations.createdAt));
  },
};
/* -------------------------- SETTINGS -------------------------- */
export const settingsRepo = {
  getMany: async (keys: string[]) => {
    if (keys.length === 0) return {};
    const rows = await db
      .select({ key: settings.key, value: settings.value })
      .from(settings)
      .where(inArray(settings.key, keys));
    return Object.fromEntries(rows.map(({ key, value }) => [key, value]));
  },
  get: (key: string, fallback: string | null = null) =>
    db
      .select()
      .from(settings)
      .where(eq(settings.key, key))
      .limit(1)
      .then((r) => r[0]?.value ?? fallback),
  has: (key: string) =>
    db
      .select({ key: settings.key })
      .from(settings)
      .where(eq(settings.key, key))
      .limit(1)
      .then((r) => r.length > 0),
  listByPrefix: async (prefix: string) =>
    db
      .select()
      .from(settings)
      .where(like(settings.key, `${prefix}%`))
      .orderBy(desc(settings.updatedAt)),
  listNewsletterSubscribers: async () => {
    const rows = await settingsRepo.listByPrefix("newsletter:");

    return rows
      .map((row) => {
        let payload: {
          email?: string;
          subscribedAt?: string;
          ip?: string | null;
          source?: string;
        } | null = null;

        try {
          payload = row.value ? JSON.parse(row.value) : null;
        } catch {
          payload = null;
        }

        const email = payload?.email || row.key.replace(/^newsletter:/, "");

        return {
          key: row.key,
          email,
          subscribedAt: payload?.subscribedAt ?? row.updatedAt?.toISOString?.() ?? null,
          ip: payload?.ip ?? null,
          source: payload?.source ?? "footer",
          updatedAt: row.updatedAt,
        };
      })
      .sort((a, b) => new Date(b.subscribedAt ?? 0).getTime() - new Date(a.subscribedAt ?? 0).getTime());
  },
  set: (key: string, value: string) =>
    db
      .insert(settings)
      .values({ key, value })
      .onConflictDoUpdate({ target: settings.key, set: { value, updatedAt: new Date() } }),
  remove: (key: string) => db.delete(settings).where(eq(settings.key, key)),
};

export const newsletterRepo = {
  listAll: () => settingsRepo.listNewsletterSubscribers(),
};

/**
 * Construit le contexte texte utilisé par le chatbot : uniquement du
 * contenu NON sensible et déjà publié (jamais de dons, jamais d'admin).
 */
export async function buildPublicKnowledgeContext(): Promise<string> {
  const [
    publishedNews,
    publishedPrograms,
    publishedTestimonials,
    team,
    upcomingEvents,
  ] = await Promise.all([
    newsRepo.listPublished(),
    programsRepo.listPublished(),
    testimonialsRepo.listPublished(),
    teamRepo.listAll(),
    eventsRepo.listPublished(),
  ]);

  const sections: string[] = [];

  sections.push(
    "FONDATION SARAN CAMARA POUR L'ÉDUCATION ET LA PROTECTION DES ENFANTS (FSCPE) — Kissosso, Conakry, Guinée.",
  );

  if (publishedPrograms.length) {
    sections.push(
      "Programmes:\n" +
        publishedPrograms
          .slice(0, 15)
          .map((p) => `- ${p.title}: ${p.summary}`)
          .join("\n"),
    );
  }
  if (publishedNews.length) {
    sections.push(
      "Actualités récentes:\n" +
        publishedNews
          .slice(0, 10)
          .map((n) => `- ${n.title}: ${n.excerpt}`)
          .join("\n"),
    );
  }
  if (team.length) {
    sections.push(
      "Équipe / gouvernance:\n" +
        team.map((t) => `- ${t.fullName}, ${t.role}`).join("\n"),
    );
  }
  if (upcomingEvents.length) {
    sections.push(
      "Agenda:\n" +
        upcomingEvents
          .slice(0, 10)
          .map((e) => `- ${e.title} (${e.location ?? "lieu à confirmer"})`)
          .join("\n"),
    );
  }
  if (publishedTestimonials.length) {
    sections.push(
      "Témoignages:\n" +
        publishedTestimonials
          .slice(0, 8)
          .map((t) => `- ${t.authorName}: "${t.quote}"`)
          .join("\n"),
    );
  }

  return sections.join("\n\n");
}
