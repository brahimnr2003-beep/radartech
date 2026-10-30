// Importa eventos investigados fuera de la web (p. ej. con Claude) desde
// archivos JSON. Pasan los mismos filtros que la búsqueda y entran como pendientes.
// Uso: npm run importar -- importaciones/eventos.json [más archivos…]
import { readFileSync } from "node:fs";
import { gte, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db";
import { eventos } from "../db/schema";
import { CATEGORIAS } from "../lib/categorias";
import { COMUNIDADES } from "../lib/comunidades";
import {
  MODALIDADES_VALORES,
  TIPOS_EVENTO_VALORES,
  hoyEnEspana,
} from "../lib/eventos";
import { crearSlug } from "../lib/slug";
import { esAgregador, normalizarUrl } from "./busqueda-ia";
import { sonElMismoEvento } from "./deduplicar";
import { existeEnlace } from "./http";

const FUENTE = "Investigación manual";

/** «A Coruña» y «a coruña» son la misma ciudad */
const mismaCiudad = (a: string, b: string) =>
  a.localeCompare(b, "es", { sensitivity: "base" }) === 0;

const valores = <T extends { slug: string }>(lista: readonly T[]) =>
  lista.map((c) => c.slug) as [T["slug"], ...T["slug"][]];

const nulo = <T extends z.ZodType>(esquema: T) =>
  esquema
    .nullable()
    .optional()
    .transform((v) => v ?? null);

/** Formato del JSON: el mismo que se pide en el prompt de investigación. */
const esquemaImportado = z.object({
  nombre: z.string().trim().min(3).max(150),
  descripcion: z.string().trim().min(30).max(2000),
  fecha: z.iso.date(),
  fechaFin: nulo(z.iso.date()),
  hora: nulo(z.string().regex(/^\d{2}:\d{2}$/)),
  comunidad: z.enum(valores(COMUNIDADES)),
  provincia: z.string().trim().min(2).max(60),
  ciudad: z.string().trim().min(2).max(80),
  lugar: nulo(z.string().trim().max(150)),
  categoria: z.enum(valores(CATEGORIAS)),
  tipo: z.enum(TIPOS_EVENTO_VALORES),
  modalidad: z.enum(MODALIDADES_VALORES),
  precioDesde: nulo(z.number().int().min(0).max(10_000)),
  organizador: nulo(z.string().trim().max(120)),
  urlOficial: z.url({ protocol: /^https?$/ }),
  fuenteVerificacion: nulo(z.url()),
});

async function main() {
  const archivos = process.argv.slice(2).filter((a) => !a.startsWith("--"));
  if (archivos.length === 0) {
    throw new Error("Indica el archivo: npm run importar -- archivo.json");
  }
  const hoy = hoyEnEspana();

  const conocidos = await db
    .select({
      nombre: eventos.nombre,
      inicio: eventos.fecha,
      ciudad: eventos.ciudad,
      urlOficial: eventos.urlOficial,
    })
    .from(eventos)
    .where(gte(sql`coalesce(${eventos.fechaFin}, ${eventos.fecha})`, hoy));
  const slugsUsados = new Set(
    (await db.select({ slug: eventos.slug }).from(eventos)).map((e) => e.slug),
  );

  const resumen = {
    leidos: 0,
    invalidos: 0,
    pasados: 0,
    agregadores: 0,
    rotos: 0,
    repetidos: 0,
    pendientes: 0,
  };

  for (const archivo of archivos) {
    const datos: unknown = JSON.parse(readFileSync(archivo, "utf8"));
    // Se acepta una lista o un objeto { eventos: [...] }
    const lista = Array.isArray(datos)
      ? datos
      : z.object({ eventos: z.array(z.unknown()) }).parse(datos).eventos;
    console.log(`${archivo}: ${lista.length} eventos`);

    for (const [i, bruto] of lista.entries()) {
      resumen.leidos++;
      const r = esquemaImportado.safeParse(bruto);
      if (!r.success) {
        resumen.invalidos++;
        const campos = r.error.issues.map((x) => x.path.join(".")).join(", ");
        console.log(`  ✗ n.º ${i + 1}: formato no válido (${campos})`);
        continue;
      }
      const e = r.data;
      if ((e.fechaFin ?? e.fecha) < hoy) {
        resumen.pasados++;
        continue;
      }
      if (esAgregador(e.urlOficial)) {
        resumen.agregadores++;
        console.log(`  · no es web oficial: ${e.nombre} (${e.urlOficial})`);
        continue;
      }
      // Los eventos con varias sedes (NASA Space Apps, DevFest…) comparten
      // nombre y fecha: solo son el mismo si además coincide la ciudad
      const repetido = conocidos.some(
        (c) =>
          (sonElMismoEvento({ nombre: e.nombre, inicio: e.fecha }, c) &&
            mismaCiudad(c.ciudad, e.ciudad)) ||
          (c.inicio === e.fecha &&
            normalizarUrl(c.urlOficial) === normalizarUrl(e.urlOficial)),
      );
      if (repetido) {
        resumen.repetidos++;
        continue;
      }
      if (!(await existeEnlace(e.urlOficial))) {
        resumen.rotos++;
        console.log(`  · enlace roto: ${e.nombre} (${e.urlOficial})`);
        continue;
      }

      let slug = crearSlug(e.nombre, e.fecha.slice(0, 4));
      if (slugsUsados.has(slug)) slug = `${slug}-${e.fecha}`;
      if (slugsUsados.has(slug))
        slug = `${slug}-${crypto.randomUUID().slice(0, 6)}`;

      const { fuenteVerificacion, ...evento } = e;
      const insertado = await db
        .insert(eventos)
        .values({
          ...evento,
          slug,
          // Nada importado se publica sin revisión
          estado: "pendiente",
          origen: "ia",
          fuente: FUENTE,
          idExterno: `importacion:${normalizarUrl(e.urlOficial)}#${e.fecha}`,
          motivoClasificacion: fuenteVerificacion
            ? `Importado de ${archivo}. Verificado en ${fuenteVerificacion}`
            : `Importado de ${archivo}`,
        })
        .onConflictDoNothing()
        .returning({ id: eventos.id });
      if (insertado.length === 0) {
        resumen.repetidos++;
        continue;
      }
      slugsUsados.add(slug);
      conocidos.push({
        nombre: e.nombre,
        inicio: e.fecha,
        ciudad: e.ciudad,
        urlOficial: e.urlOficial,
      });
      resumen.pendientes++;
      console.log(`  ✓ ${e.nombre} (${e.fecha}, ${e.ciudad})`);
    }
  }

  console.log(
    `Leídos ${resumen.leidos} · pendientes de revisar ${resumen.pendientes} · repetidos ${resumen.repetidos} · ya celebrados ${resumen.pasados} · sin web oficial ${resumen.agregadores} · enlace roto ${resumen.rotos} · formato no válido ${resumen.invalidos}`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => process.exit());
