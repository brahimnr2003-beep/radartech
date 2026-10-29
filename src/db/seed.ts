// Carga los eventos de ejemplo en la base de datos local o de la CI.
// Uso: npm run db:seed (nunca contra producción).
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { EVENTOS_EJEMPLO } from "./datos-ejemplo";
import { eventos } from "./schema";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("Falta DATABASE_URL (ver .env.example).");
if (!/@(localhost|127\.0\.0\.1)[:/]/.test(url)) {
  throw new Error(
    "db:seed solo se ejecuta contra una base de datos local, nunca contra producción.",
  );
}

const pool = new Pool({ connectionString: url });
const db = drizzle({ client: pool, casing: "snake_case" });

const filas = EVENTOS_EJEMPLO.map((evento) => ({
  ...evento,
  // Los ejemplos no tienen fuente externa
  fuente: null,
  estado: "aprobado" as const,
  origen: "admin" as const,
}));

async function main() {
  // Idempotente: si un evento ya existe (mismo slug), se actualiza
  for (const fila of filas) {
    await db
      .insert(eventos)
      .values(fila)
      .onConflictDoUpdate({ target: eventos.slug, set: fila });
  }
  console.log(`Cargados ${filas.length} eventos de ejemplo.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
