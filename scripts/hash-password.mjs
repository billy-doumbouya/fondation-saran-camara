#!/usr/bin/env node
/**
 * Génère un hash bcrypt et un seed de configuration pour la fondation.
 *
 * Usage : npm run hash-password -- "MonMotDePasse"
 */
import bcrypt from "bcryptjs";

const password = process.argv[2];

if (!password) {
  console.error("Usage : npm run hash-password -- \"fondation@saran\"");
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 12);
const envHash = hash.replaceAll("$", "\\$");

const defaultBrand = {
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
  whatsappNumber: "224628532214",
  whatsappDisplay: "+224 628 53 22 14",
  heroVideoUrl: "",
  heroPosterUrl: "",
};

const seed = {
  admin_password_hash: hash,
  site_name: defaultBrand.name,
  site_full_name: defaultBrand.fullName,
  site_acronym: defaultBrand.acronym,
  site_slogan: defaultBrand.slogan,
  site_founder_name: defaultBrand.founderName,
  site_address: defaultBrand.address,
  site_phone: defaultBrand.phone,
  site_phone_secondary: defaultBrand.phoneSecondary,
  site_email: defaultBrand.email,
  site_quote: defaultBrand.quote,
  site_whatsapp_number: defaultBrand.whatsappNumber,
  site_whatsapp_display: defaultBrand.whatsappDisplay,
  site_hero_video_url: defaultBrand.heroVideoUrl,
  site_hero_poster_url: defaultBrand.heroPosterUrl,
};

console.log("\nADMIN_PASSWORD_HASH=\"" + envHash + "\"\n");
console.log("# Seed de configuration de la fondation");
console.log(JSON.stringify(seed, null, 2));
console.log("\n# Exemple d'insertion SQL");
console.log(
  Object.entries(seed)
    .map(([key, value]) => `INSERT INTO settings (key, value) VALUES ('${key}', '${String(value).replace(/'/g, "''")}') ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;`)
    .join("\n")
);
console.log("\nCopiez ADMIN_PASSWORD_HASH dans votre .env.local et adaptez les valeurs ci-dessus depuis le dashboard admin.");
