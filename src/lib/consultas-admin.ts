// Consultas del panel de administración. Sin caché: el panel siempre muestra
// el estado real. Solo en el servidor y siempre tras comprobar la sesión.
import { asc, count, desc, eq, gte, sql, and } from "drizzle-orm";
import { db } from "@/db";
import { eventos, type FilaEvento } from "@/db/schema";
import { hoyEnEspana } from "./eventos";

export const ESTADOS = ["pendiente", "aprobado", "rechazado"] as const;
export type EstadoEvento = (typeof ESTADOS)[number];

// Publicados y descartados ya celebrados no interesan; los pendientes, todos
const vigentes = () =>
  gte(sql`coalesce(${eventos.fechaFin}, ${eventos.fecha})`, hoyEnEspana());

export async function getEventosAdmin(
  estado: EstadoEvento,
): Promise<FilaEvento[]> {
  return estado === "pendiente"
    ? db
        .select()
        .from(eventos)
        .where(eq(eventos.estado, estado))
        .orderBy(desc(eventos.creadoEn))
    : db
        .select()
        .from(eventos)
        .where(and(eq(eventos.estado, estado), vigentes()))
        .orderBy(desc(eventos.destacado), asc(eventos.fecha));
}

export async function contarPorEstado(): Promise<Record<EstadoEvento, number>> {
  const filas = await db
    .select({ estado: eventos.estado, total: count() })
    .from(eventos)
    .where(
      sql`${eventos.estado} = 'pendiente' or coalesce(${eventos.fechaFin}, ${eventos.fecha}) >= ${hoyEnEspana()}`,
    )
    .groupBy(eventos.estado);
  const conteo = { pendiente: 0, aprobado: 0, rechazado: 0 };
  for (const { estado, total } of filas) conteo[estado] = total;
  return conteo;
}

export async function getEventoAdmin(id: number) {
  const [fila] = await db.select().from(eventos).where(eq(eventos.id, id));
  return fila;
}
