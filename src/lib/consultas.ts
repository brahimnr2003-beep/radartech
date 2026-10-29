// Consultas de eventos públicos. Solo en el servidor.
// Se guardan en caché como mucho una hora: así los eventos ya celebrados
// desaparecen solos sin consultar la base de datos en cada visita.
import { and, asc, count, eq, gte, sql } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/db";
import { eventos, type FilaEvento } from "@/db/schema";
import type { ComunidadSlug } from "./comunidades";
import { hoyEnEspana, type Evento } from "./eventos";

/** Etiqueta de caché: al aprobar un evento (fase 6) se invalida para verlo al instante. */
export const TAG_EVENTOS = "eventos";

const publicados = () => eq(eventos.estado, "aprobado");
// Un evento de varios días sigue visible hasta su último día
const proximos = () =>
  gte(sql`coalesce(${eventos.fechaFin}, ${eventos.fecha})`, hoyEnEspana());

function aEvento(fila: FilaEvento): Evento {
  return {
    slug: fila.slug,
    nombre: fila.nombre,
    descripcion: fila.descripcion,
    fecha: fila.fecha,
    fechaFin: fila.fechaFin ?? undefined,
    // Postgres devuelve «09:30:00»
    hora: fila.hora?.slice(0, 5),
    comunidad: fila.comunidad,
    provincia: fila.provincia,
    ciudad: fila.ciudad,
    lugar: fila.lugar ?? undefined,
    categoria: fila.categoria,
    tipo: fila.tipo,
    modalidad: fila.modalidad,
    precioDesde: fila.precioDesde,
    organizador: fila.organizador ?? undefined,
    urlOficial: fila.urlOficial,
    fuente:
      fila.fuente && fila.urlFuente
        ? { nombre: fila.fuente, url: fila.urlFuente }
        : undefined,
    destacado: fila.destacado,
    ponentes: fila.ponentes ?? undefined,
  };
}

/** Próximos eventos publicados de toda España, por fecha. */
export async function getEventos(): Promise<Evento[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAG_EVENTOS);
  const filas = await db
    .select()
    .from(eventos)
    .where(and(publicados(), proximos()))
    .orderBy(asc(eventos.fecha));
  return filas.map(aEvento);
}

/** Próximos eventos publicados de una comunidad, por fecha. */
export async function getEventosDeComunidad(
  comunidad: ComunidadSlug,
): Promise<Evento[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAG_EVENTOS);
  const filas = await db
    .select()
    .from(eventos)
    .where(and(publicados(), proximos(), eq(eventos.comunidad, comunidad)))
    .orderBy(asc(eventos.fecha));
  return filas.map(aEvento);
}

/** Un evento publicado, aunque ya se haya celebrado (su ficha sigue accesible). */
export async function getEvento(slug: string): Promise<Evento | undefined> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAG_EVENTOS);
  const [fila] = await db
    .select()
    .from(eventos)
    .where(and(publicados(), eq(eventos.slug, slug)));
  return fila && aEvento(fila);
}

/** Slugs de todos los eventos publicados, para generar sus páginas. */
export async function getSlugsEventos(): Promise<string[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAG_EVENTOS);
  const filas = await db
    .select({ slug: eventos.slug })
    .from(eventos)
    .where(publicados());
  return filas.map((f) => f.slug);
}

/** Nº de próximos eventos publicados por comunidad (las que no tienen, con 0). */
export async function contarEventosPorComunidad(
  comunidades: readonly { slug: ComunidadSlug }[],
): Promise<Record<ComunidadSlug, number>> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAG_EVENTOS);
  const filas = await db
    .select({ comunidad: eventos.comunidad, total: count() })
    .from(eventos)
    .where(and(publicados(), proximos()))
    .groupBy(eventos.comunidad);
  const conteo = Object.fromEntries(
    comunidades.map(({ slug }) => [slug, 0]),
  ) as Record<ComunidadSlug, number>;
  for (const { comunidad, total } of filas) conteo[comunidad] = total;
  return conteo;
}
