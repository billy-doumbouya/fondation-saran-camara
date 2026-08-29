#!/usr/bin/env node
/**
 * Génère un hash bcrypt à partir d'un mot de passe en clair,
 * à copier dans ADMIN_PASSWORD_HASH (.env.local).
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
console.log('\nADMIN_PASSWORD_HASH="' + envHash + '"\n');
console.log("Copiez cette ligne dans votre fichier .env.local.");
