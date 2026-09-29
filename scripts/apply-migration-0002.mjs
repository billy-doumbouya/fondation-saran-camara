import fs from "node:fs";
import crypto from "node:crypto";
import { neon } from "@neondatabase/serverless";

const envText = fs.readFileSync(new URL("../.env", import.meta.url), "utf8");
const env = {};
for (const raw of envText.split(/\r?\n/)) {
  if (!raw || raw.startsWith("#") || !raw.includes("=")) continue;
  const i = raw.indexOf("=");
  env[raw.slice(0, i).trim()] = raw.slice(i + 1).trim().replace(/^\"|\"$/g, "");
}

const sql = neon(env.DATABASE_URL);

console.log("Applying migration 0002 changes...");

// 1. Add missing columns safely
await sql`ALTER TABLE "donations" ADD COLUMN IF NOT EXISTS "updated_at" timestamp with time zone DEFAULT now() NOT NULL;`;
console.log("✓ donations.updated_at added");

await sql`ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "slug" varchar(200);`;
console.log("✓ events.slug added");

// Update any event with empty slug before adding unique constraint
await sql`UPDATE "events" SET "slug" = 'forum-citoyen-sur-leducation' WHERE "slug" IS NULL;`;

await sql`ALTER TABLE "partners" ADD COLUMN IF NOT EXISTS "created_at" timestamp with time zone DEFAULT now() NOT NULL;`;
console.log("✓ partners.created_at added");

await sql`ALTER TABLE "settings" ADD COLUMN IF NOT EXISTS "updated_at" timestamp with time zone DEFAULT now() NOT NULL;`;
console.log("✓ settings.updated_at added");

// 2. Add constraint on events.slug if not exists
const constraints = await sql`
  SELECT conname FROM pg_constraint WHERE conname = 'events_slug_unique';
`;
if (constraints.length === 0) {
  await sql`ALTER TABLE "events" ADD CONSTRAINT "events_slug_unique" UNIQUE("slug");`;
  console.log("✓ events_slug_unique constraint added");
} else {
  console.log("✓ events_slug_unique constraint already exists");
}

// 3. Add indexes IF NOT EXISTS
const indexStatements = [
  `CREATE INDEX IF NOT EXISTS "contact_is_read_idx" ON "contact_messages" USING btree ("is_read");`,
  `CREATE INDEX IF NOT EXISTS "contact_created_at_idx" ON "contact_messages" USING btree ("created_at");`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "donations_reference_idx" ON "donations" USING btree ("reference");`,
  `CREATE INDEX IF NOT EXISTS "donations_status_idx" ON "donations" USING btree ("status");`,
  `CREATE INDEX IF NOT EXISTS "donations_created_at_idx" ON "donations" USING btree ("created_at");`,
  `CREATE INDEX IF NOT EXISTS "events_published_idx" ON "events" USING btree ("published");`,
  `CREATE INDEX IF NOT EXISTS "events_start_at_idx" ON "events" USING btree ("start_at");`,
  `CREATE INDEX IF NOT EXISTS "gallery_category_idx" ON "gallery_images" USING btree ("category");`,
  `CREATE INDEX IF NOT EXISTS "news_published_idx" ON "news" USING btree ("published");`,
  `CREATE INDEX IF NOT EXISTS "news_published_at_idx" ON "news" USING btree ("published_at");`,
  `CREATE INDEX IF NOT EXISTS "partners_order_idx" ON "partners" USING btree ("display_order");`,
  `CREATE INDEX IF NOT EXISTS "programs_published_idx" ON "programs" USING btree ("published");`,
  `CREATE INDEX IF NOT EXISTS "programs_pillar_idx" ON "programs" USING btree ("pillar");`,
  `CREATE INDEX IF NOT EXISTS "team_organ_order_idx" ON "team_members" USING btree ("organ_body","display_order");`,
  `CREATE INDEX IF NOT EXISTS "testimonials_published_idx" ON "testimonials" USING btree ("published");`
];

for (const stmt of indexStatements) {
  await sql.query(stmt);
}
console.log("✓ All indexes created successfully");

// 4. Update drizzle.__drizzle_migrations table
// Check if 0001 and 0002 entries exist
const existingMigrations = await sql`SELECT created_at FROM drizzle.__drizzle_migrations;`;
const existingTimestamps = new Set(existingMigrations.map(m => String(m.created_at)));

// 0001
if (!existingTimestamps.has("1788094466891")) {
  const content0001 = fs.readFileSync(new URL("../drizzle/0001_sparkling_iron_lad.sql", import.meta.url), "utf8");
  const hash0001 = crypto.createHash("sha256").update(content0001).digest("hex");
  await sql`INSERT INTO drizzle.__drizzle_migrations (hash, created_at) VALUES (${hash0001}, 1788094466891);`;
  console.log("✓ Migration 0001 recorded in drizzle.__drizzle_migrations");
}

// 0002
if (!existingTimestamps.has("1790643364524")) {
  const content0002 = fs.readFileSync(new URL("../drizzle/0002_deep_tenebrous.sql", import.meta.url), "utf8");
  const hash0002 = crypto.createHash("sha256").update(content0002).digest("hex");
  await sql`INSERT INTO drizzle.__drizzle_migrations (hash, created_at) VALUES (${hash0002}, 1790643364524);`;
  console.log("✓ Migration 0002 recorded in drizzle.__drizzle_migrations");
}

console.log("Migration complete!");
