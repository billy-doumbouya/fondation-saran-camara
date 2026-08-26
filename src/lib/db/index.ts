import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

/**
 * Neon serverless driver — works in Edge and Node runtimes.
 * DATABASE_URL must be set (see .env.example). During build time
 * (e.g. static analysis) we lazily create the client so the app
 * doesn't crash if the env var isn't present yet.
 */
function createDb() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    // Return a proxy that throws only when actually used, so builds
    // that don't touch the DB (like `tsc --noEmit`) don't fail.
    return new Proxy(
      {},
      {
        get() {
          throw new Error(
            "DATABASE_URL n'est pas défini. Copiez .env.example vers .env.local et renseignez votre connexion Neon."
          );
        },
      }
    ) as ReturnType<typeof drizzle>;
  }
  const sql = neon(url);
  return drizzle(sql, { schema });
}

export const db = createDb();
export * as dbSchema from "./schema";
