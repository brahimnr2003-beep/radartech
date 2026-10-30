import {
  boolean,
  date,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  time,
  timestamp,
} from "drizzle-orm/pg-core";
// Rutas relativas: drizzle-kit no resuelve el alias «@/»
import { CATEGORIAS } from "../lib/categorias";
import { COMUNIDADES } from "../lib/comunidades";
import { MODALIDADES_VALORES, TIPOS_EVENTO_VALORES } from "../lib/eventos";

const valores = <T extends { slug: string }>(lista: readonly T[]) =>
  lista.map((c) => c.slug) as [T["slug"], ...T["slug"][]];

export const comunidadEnum = pgEnum("comunidad", valores(COMUNIDADES));
export const categoriaEnum = pgEnum("categoria", valores(CATEGORIAS));
export const modalidadEnum = pgEnum("modalidad", MODALIDADES_VALORES);
export const tipoEventoEnum = pgEnum("tipo_evento", TIPOS_EVENTO_VALORES);

/** Ciclo de revisión: nada se publica sin aprobación del administrador. */
export const estadoEnum = pgEnum("estado_evento", [
  "pendiente",
  "aprobado",
  "rechazado",
]);

/** Vía por la que entró el evento. */
export const origenEnum = pgEnum("origen_evento", [
  "formulario",
  "ia",
  "admin",
]);

export const eventos = pgTable(
  "eventos",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    slug: text().notNull().unique(),
    nombre: text().notNull(),
    descripcion: text().notNull(),
    fecha: date({ mode: "string" }).notNull(),
    /** Último día en eventos de varios días */
    fechaFin: date({ mode: "string" }),
    hora: time(),
    comunidad: comunidadEnum().notNull(),
    provincia: text().notNull(),
    ciudad: text().notNull(),
    lugar: text(),
    categoria: categoriaEnum().notNull(),
    tipo: tipoEventoEnum().notNull(),
    modalidad: modalidadEnum().notNull(),
    /** Precio mínimo en euros; 0 = gratuito, null = desconocido */
    precioDesde: integer(),
    organizador: text(),
    urlOficial: text().notNull(),
    /** Cartel oficial (enlazado, no copiado); sin él se muestra la portada de la categoría */
    imagenUrl: text(),
    imagenAlt: text(),
    destacado: boolean().notNull().default(false),
    ponentes: jsonb().$type<{ nombre: string; cargo: string }[]>(),
    estado: estadoEnum().notNull().default("pendiente"),
    origen: origenEnum().notNull(),
    /** Web de la que se recogió (recolector): se cita en la ficha */
    fuente: text(),
    urlFuente: text(),
    /** Identificador en la fuente, para no duplicar entre ejecuciones */
    idExterno: text().unique(),
    /** Por qué la IA lo publicó o descartó (se mostrará en el panel) */
    motivoClasificacion: text(),
    creadoEn: timestamp({ withTimezone: true }).notNull().defaultNow(),
    actualizadoEn: timestamp({ withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    // Las páginas públicas siempre filtran por estado y fecha
    index("eventos_estado_fecha_idx").on(t.estado, t.fecha),
    index("eventos_comunidad_idx").on(t.comunidad),
  ],
);

/** Una fila por ejecución del recolector: métricas de la recopilación. */
export const ejecucionesRecolector = pgTable("ejecuciones_recolector", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  inicio: timestamp({ withTimezone: true }).notNull(),
  duracionMs: integer().notNull(),
  /** Eventos leídos por fuente, p. ej. { "eventos.wiki": 16 } */
  leidosPorFuente: jsonb().$type<Record<string, number>>().notNull(),
  /** Fuentes que fallaron y por qué */
  errores: jsonb().$type<Record<string, string>>().notNull(),
  unicos: integer().notNull(),
  yaConocidos: integer().notNull(),
  publicados: integer().notNull(),
  descartados: integer().notNull(),
});

export type FilaEvento = typeof eventos.$inferSelect;
export type NuevoEvento = typeof eventos.$inferInsert;
