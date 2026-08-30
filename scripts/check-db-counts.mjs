import fs from "node:fs";
import { neon } from "@neondatabase/serverless";

const envText = fs.readFileSync(new URL("../.env", import.meta.url), "utf8");
const env = {};
for (const raw of envText.split(/\r?\n/)) {
  if (!raw || raw.startsWith("#") || !raw.includes("=")) continue;
  const i = raw.indexOf("=");
  env[raw.slice(0, i).trim()] = raw.slice(i + 1).trim().replace(/^\"|\"$/g, "");
}

const sql = neon(env.DATABASE_URL);
const tables = ["news", "testimonials", "team_members", "gallery_images", "programs", "events", "contact_messages", "settings"];

for (const table of tables) {
  const res = await sql.query(`SELECT COUNT(*)::int AS count FROM ${table}`);
  console.log(`${table}: ${res[0].count}`);
}
