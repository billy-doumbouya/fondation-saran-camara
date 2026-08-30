#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import bcrypt from "bcryptjs";
import { neon } from "@neondatabase/serverless";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const envPath = path.join(projectRoot, ".env");
const defaultPassword = "FSCPE2026!";

function parseEnvFile(content) {
  const result = {};
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const idx = line.indexOf("=");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    result[key] = value;
  }
  return result;
}

function saveEnvValue(key, value) {
  const content = fs.readFileSync(envPath, "utf8");
  const env = parseEnvFile(content);
  env[key] = value;
  const lines = Object.entries(env).map(([k, v]) => `${k}=${v}`);
  fs.writeFileSync(envPath, `${lines.join("\n")}\n`, "utf8");
}

async function main() {
  if (!fs.existsSync(envPath)) {
    throw new Error("Le fichier .env est introuvable.");
  }

  const envText = fs.readFileSync(envPath, "utf8");
  const env = parseEnvFile(envText);
  const databaseUrl = env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL est absent dans le fichier .env.");
  }

  const hash = bcrypt.hashSync(defaultPassword, 12);
  const envHash = hash.replaceAll("$", "\\$");
  saveEnvValue("ADMIN_PASSWORD_HASH", `"${envHash}"`);

  const sql = neon(databaseUrl);

  const rows = [
    ["admin_password_hash", hash],
    ["site_name", "Fondation Saran Camara"],
    ["site_full_name", "Fondation Saran Camara pour l'Éducation et la Protection des Enfants"],
    ["site_acronym", "FSCPE"],
    ["site_slogan", "Ensemble pour un avenir meilleur, des enfants"],
    ["site_founder_name", "Saran Camara"],
    ["site_address", "Kissosso, Commune de Matoto, Conakry, République de Guinée"],
    ["site_phone", "+224 620 32 19 16"],
    ["site_phone_secondary", "+224 628 53 22 14"],
    ["site_email", "saran4camara@gmail.com"],
    ["site_quote", "Offrir une éducation à un orphelin, c'est lui donner espoir d'un avenir meilleur"],
    ["site_whatsapp_number", "224628532214"],
    ["site_whatsapp_display", "+224 628 53 22 14"],
    ["site_hero_video_url", ""],
    ["site_hero_poster_url", ""],
  ];

  await Promise.all(
    rows.map(([key, value]) =>
      sql`INSERT INTO settings (key, value) VALUES (${key}, ${String(value)}) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;`
    )
  );

  const demoSeedQueries = [
    sql`INSERT INTO news (slug, title, excerpt, content, published, published_at, created_at, updated_at)
      SELECT 'remise-des-kits-scolaires', 'Remise des kits scolaires', 'Des fournitures scolaires offertes aux enfants vulnérables.', 'La Fondation Saran Camara a distribué des kits scolaires...', true, NOW(), NOW(), NOW()
      WHERE NOT EXISTS (SELECT 1 FROM news WHERE slug = 'remise-des-kits-scolaires');`,
    sql`INSERT INTO programs (slug, title, summary, content, pillar, beneficiaries_count, published, created_at)
      SELECT 'bourses-scolaires', 'Bourses scolaires', 'Soutien aux enfants pour assurer leur scolarité.', 'Le programme vise à couvrir les frais de scolarité, fournitures et suivi pédagogique.', 'education', 120, true, NOW()
      WHERE NOT EXISTS (SELECT 1 FROM programs WHERE slug = 'bourses-scolaires');`,
    sql`INSERT INTO testimonials (author_name, author_role, quote, rating, published, created_at)
      SELECT 'Aminata Diallo', 'Parent bénéficiaire', 'Merci à la fondation pour l’appui scolaire offert à mon fils.', 5, true, NOW()
      WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE quote = 'Merci à la fondation pour l’appui scolaire offert à mon fils.');`,
    sql`INSERT INTO team_members (full_name, role, bio, organ_body, display_order, created_at)
      SELECT 'Saran Camara', 'Fondatrice', 'Dirigeante engagée pour l’éducation et la protection des enfants.', 'fondatrice', 1, NOW()
      WHERE NOT EXISTS (SELECT 1 FROM team_members WHERE full_name = 'Saran Camara');`,
    sql`INSERT INTO gallery_images (title, image_url, image_public_id, category, created_at)
      SELECT 'Atelier de soutien', 'https://images.unsplash.com/photo-1517486808906-6ca8b3d5c0f5', 'atelier-soutien', 'education', NOW()
      WHERE NOT EXISTS (SELECT 1 FROM gallery_images WHERE title = 'Atelier de soutien');`,
    sql`INSERT INTO events (title, description, location, start_at, end_at, published, created_at)
      SELECT 'Forum citoyen sur l’éducation', 'Rencontre avec les parents et partenaires pour renforcer l’accès à l’école.', 'Conakry', NOW() + INTERVAL '7 days', NOW() + INTERVAL '7 days' + INTERVAL '3 hours', true, NOW()
      WHERE NOT EXISTS (SELECT 1 FROM events WHERE title = 'Forum citoyen sur l’éducation');`,
    sql`INSERT INTO contact_messages (name, email, phone, subject, message, is_read, created_at)
      SELECT 'Mamadou Bah', 'mamadou@example.com', '+224 600 00 00 00', 'Demande de partenariat', 'Bonjour, nous souhaitons nous associer à vos actions.', false, NOW()
      WHERE NOT EXISTS (SELECT 1 FROM contact_messages WHERE email = 'mamadou@example.com');`,
  ];

  await Promise.all(demoSeedQueries);

  console.log("Seed OK");
  console.log(`Mot de passe admin par défaut : ${defaultPassword}`);
  console.log("Les paramètres du site et les données d’exemple du dashboard ont été enregistrés.");
}

main().catch((error) => {
  console.error("Erreur lors du seed :");
  console.error(error);
  process.exit(1);
});
