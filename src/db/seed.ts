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

// Los ejemplos empiezan el 27 de octubre de 2026. Si esa fecha ya ha pasado,
// se mueven todos hacia delante para que sigan saliendo en la web (que solo
// muestra eventos futuros) y las pruebas no dependan del día en que se ejecutan.
const DIA = 24 * 60 * 60 * 1000;
const PRIMERA_FECHA = Date.parse("2026-10-27T00:00:00Z");
const desfase = Math.max(0, Math.ceil((Date.now() - PRIMERA_FECHA) / DIA));
const mover = (fecha: string) =>
  new Date(Date.parse(`${fecha}T00:00:00Z`) + desfase * DIA)
    .toISOString()
    .slice(0, 10);

const filas = EVENTOS_EJEMPLO.map((evento) => ({
  ...evento,
  fecha: mover(evento.fecha),
  fechaFin: evento.fechaFin && mover(evento.fechaFin),
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
