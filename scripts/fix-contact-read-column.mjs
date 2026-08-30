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
const columns = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'contact_messages' ORDER BY ordinal_position`;
const names = columns.map((row) => row.column_name);

if (names.includes("read") && !names.includes("is_read")) {
  await sql`ALTER TABLE contact_messages RENAME COLUMN read TO is_read;`;
  console.log("Renamed contact_messages.read -> contact_messages.is_read");
} else if (!names.includes("read") && !names.includes("is_read")) {
  await sql`ALTER TABLE contact_messages ADD COLUMN is_read boolean NOT NULL DEFAULT false;`;
  console.log("Added contact_messages.is_read column");
} else {
  console.log("contact_messages already uses is_read");
}

const refreshed = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'contact_messages' ORDER BY ordinal_position`;
console.log(refreshed.map((row) => row.column_name).join(", "));
