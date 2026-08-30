import { desc, eq, asc } from "drizzle-orm";
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
  type NewTeamMember,
  type NewGalleryImage,
  type NewProgram,
  type NewEventItem,
} from "./schema";

/* -------------------------- NEWS -------------------------- */
export const newsRepo = {
  listPublished: () =>
    db.select().from(news).where(eq(news.published, true)).orderBy(desc(news.publishedAt)),
  listAll: () => db.select().from(news).orderBy(desc(news.createdAt)),
  getBySlug: (slug: string) =>
    db.select().from(news).where(eq(news.slug, slug)).limit(1).then((r) => r[0]),
  getById: (id: number) => db.select().from(news).where(eq(news.id, id)).limit(1).then((r) => r[0]),
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
    db.select().from(testimonials).where(eq(testimonials.published, true)).orderBy(desc(testimonials.createdAt)),
  listAll: () => db.select().from(testimonials).orderBy(desc(testimonials.createdAt)),
  getById: (id: number) =>
    db.select().from(testimonials).where(eq(testimonials.id, id)).limit(1).then((r) => r[0]),
  create: (data: NewTestimonial) => db.insert(testimonials).values(data).returning(),
  update: (id: number, data: Partial<NewTestimonial>) =>
    db.update(testimonials).set(data).where(eq(testimonials.id, id)).returning(),
  remove: (id: number) => db.delete(testimonials).where(eq(testimonials.id, id)),
};

/* -------------------------- TEAM -------------------------- */
export const teamRepo = {
  listAll: () => db.select().from(teamMembers).orderBy(asc(teamMembers.displayOrder)),
  getById: (id: number) =>
    db.select().from(teamMembers).where(eq(teamMembers.id, id)).limit(1).then((r) => r[0]),
  create: (data: NewTeamMember) => db.insert(teamMembers).values(data).returning(),
  update: (id: number, data: Partial<NewTeamMember>) =>
    db.update(teamMembers).set(data).where(eq(teamMembers.id, id)).returning(),
  remove: (id: number) => db.delete(teamMembers).where(eq(teamMembers.id, id)),
};

/* ------------------------- GALLERY ------------------------- */
export const galleryRepo = {
  listAll: () => db.select().from(galleryImages).orderBy(desc(galleryImages.createdAt)),
  create: (data: NewGalleryImage) => db.insert(galleryImages).values(data).returning(),
  remove: (id: number) => db.delete(galleryImages).where(eq(galleryImages.id, id)),
};

/* ------------------------ PROGRAMS ------------------------ */
export const programsRepo = {
  listPublished: () =>
    db.select().from(programs).where(eq(programs.published, true)).orderBy(desc(programs.createdAt)),
  listAll: () => db.select().from(programs).orderBy(desc(programs.createdAt)),
  getBySlug: (slug: string) =>
    db.select().from(programs).where(eq(programs.slug, slug)).limit(1).then((r) => r[0]),
  getById: (id: number) =>
    db.select().from(programs).where(eq(programs.id, id)).limit(1).then((r) => r[0]),
  create: (data: NewProgram) => db.insert(programs).values(data).returning(),
  update: (id: number, data: Partial<NewProgram>) =>
    db.update(programs).set(data).where(eq(programs.id, id)).returning(),
  remove: (id: number) => db.delete(programs).where(eq(programs.id, id)),
};

/* ------------------------- EVENTS ------------------------- */
export const eventsRepo = {
  listPublished: () =>
    db.select().from(events).where(eq(events.published, true)).orderBy(asc(events.startAt)),
  listAll: () => db.select().from(events).orderBy(asc(events.startAt)),
  getById: (id: number) => db.select().from(events).where(eq(events.id, id)).limit(1).then((r) => r[0]),
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
export const contactRepo = {
  create: (data: { name: string; email: string; phone?: string | null; subject?: string | null; message: string }) =>
    db.insert(contactMessages).values(data).returning(),
  listAll: () => db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt)),
  listUnread: () =>
    db.select().from(contactMessages).where(eq(contactMessages.read, false)).orderBy(desc(contactMessages.createdAt)),
  markRead: (id: number) => db.update(contactMessages).set({ read: true }).where(eq(contactMessages.id, id)),
};

/* -------------------------- DONATIONS -------------------------- */
export const donationsRepo = {
  create: (data: typeof donations.$inferInsert) => db.insert(donations).values(data).returning(),
  updateStatus: (reference: string, status: string, payload?: unknown) =>
    db
      .update(donations)
      .set({ status, providerPayload: payload as object })
      .where(eq(donations.reference, reference))
      .returning(),
  listAll: () => db.select().from(donations).orderBy(desc(donations.createdAt)),
};

/* -------------------------- SETTINGS -------------------------- */
export const settingsRepo = {
  get: (key: string, fallback: string | null = null) =>
    db
      .select()
      .from(settings)
      .where(eq(settings.key, key))
      .limit(1)
      .then((r) => r[0]?.value ?? fallback),
  set: (key: string, value: string) =>
    db
      .insert(settings)
      .values({ key, value })
      .onConflictDoUpdate({ target: settings.key, set: { value } }),
};

/**
 * Construit le contexte texte utilisé par le chatbot : uniquement du
 * contenu NON sensible et déjà publié (jamais de dons, jamais d'admin).
 */
export async function buildPublicKnowledgeContext(): Promise<string> {
  const [publishedNews, publishedPrograms, publishedTestimonials, team, upcomingEvents] =
    await Promise.all([
      newsRepo.listPublished(),
      programsRepo.listPublished(),
      testimonialsRepo.listPublished(),
      teamRepo.listAll(),
      eventsRepo.listPublished(),
    ]);

  const sections: string[] = [];

  sections.push(
    "FONDATION SARAN CAMARA POUR L'ÉDUCATION ET LA PROTECTION DES ENFANTS (FSCPE) — Kissosso, Conakry, Guinée."
  );

  if (publishedPrograms.length) {
    sections.push(
      "Programmes:\n" +
        publishedPrograms
          .slice(0, 15)
          .map((p) => `- ${p.title}: ${p.summary}`)
          .join("\n")
    );
  }
  if (publishedNews.length) {
    sections.push(
      "Actualités récentes:\n" +
        publishedNews
          .slice(0, 10)
          .map((n) => `- ${n.title}: ${n.excerpt}`)
          .join("\n")
    );
  }
  if (team.length) {
    sections.push(
      "Équipe / gouvernance:\n" + team.map((t) => `- ${t.fullName}, ${t.role}`).join("\n")
    );
  }
  if (upcomingEvents.length) {
    sections.push(
      "Agenda:\n" +
        upcomingEvents
          .slice(0, 10)
          .map((e) => `- ${e.title} (${e.location ?? "lieu à confirmer"})`)
          .join("\n")
    );
  }
  if (publishedTestimonials.length) {
    sections.push(
      "Témoignages:\n" +
        publishedTestimonials
          .slice(0, 8)
          .map((t) => `- ${t.authorName}: "${t.quote}"`)
          .join("\n")
    );
  }

  return sections.join("\n\n");
}
