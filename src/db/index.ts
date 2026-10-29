import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("Falta DATABASE_URL. Copia .env.example a .env.local.");
}

// En desarrollo, la recarga en caliente reevalúa este módulo: se reutiliza
// el mismo pool para no abrir conexiones nuevas en cada cambio.
const globalParaDb = globalThis as unknown as { pool?: Pool };
const pool =
  globalParaDb.pool ?? new Pool({ connectionString: process.env.DATABASE_URL });
if (process.env.NODE_ENV !== "production") globalParaDb.pool = pool;

export const db = drizzle({ client: pool, schema, casing: "snake_case" });
