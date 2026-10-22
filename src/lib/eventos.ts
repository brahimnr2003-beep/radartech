import type { CategoriaSlug } from "./categorias";
import type { ComunidadSlug } from "./comunidades";
import { EVENTOS_EJEMPLO } from "./datos-ejemplo";

export type Modalidad = "presencial" | "online" | "hibrido";
export type TipoEvento =
  "conferencia" | "meetup" | "hackathon" | "taller" | "otro";

export type Evento = {
  slug: string;
  nombre: string;
  descripcion: string;
  /** Fecha ISO (AAAA-MM-DD) */
  fecha: string;
  /** Hora local (HH:MM) */
  hora?: string;
  comunidad: ComunidadSlug;
  provincia: string;
  ciudad: string;
  /** Recinto o dirección */
  lugar?: string;
  categoria: CategoriaSlug;
  tipo: TipoEvento;
  modalidad: Modalidad;
  /** Precio mínimo en euros; 0 = gratuito */
  precioDesde: number;
  organizador: string;
  urlOficial: string;
  destacado: boolean;
  ponentes?: { nombre: string; cargo: string }[];
};

export const MODALIDADES: Record<Modalidad, string> = {
  presencial: "Presencial",
  online: "Online",
  hibrido: "Híbrido",
};

export const TIPOS_EVENTO: Record<TipoEvento, string> = {
  conferencia: "Conferencia",
  meetup: "Meetup",
  hackathon: "Hackathon",
  taller: "Taller",
  otro: "Otro",
};

// Acceso a datos. Hoy leen los datos de ejemplo; en la fase 4 consultarán la base de datos.

const porFecha = (a: Evento, b: Evento) => a.fecha.localeCompare(b.fecha);

export function getEventos(): Evento[] {
  return [...EVENTOS_EJEMPLO].sort(porFecha);
}

export function getEventosDeComunidad(comunidad: ComunidadSlug): Evento[] {
  return EVENTOS_EJEMPLO.filter((e) => e.comunidad === comunidad).sort(
    porFecha,
  );
}

export function getEvento(slug: string): Evento | undefined {
  return EVENTOS_EJEMPLO.find((e) => e.slug === slug);
}

export function getSlugsEventos(): string[] {
  return EVENTOS_EJEMPLO.map((e) => e.slug);
}

export function contarEventosPorComunidad(
  comunidades: readonly { slug: ComunidadSlug }[],
): Record<ComunidadSlug, number> {
  const conteo = Object.fromEntries(
    comunidades.map(({ slug }) => [slug, 0]),
  ) as Record<ComunidadSlug, number>;
  for (const e of EVENTOS_EJEMPLO) conteo[e.comunidad]++;
  return conteo;
}

// Formato

const FORMATO_FECHA = new Intl.DateTimeFormat("es-ES", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

/** «2026-10-15» → «15 oct 2026» */
export function formatearFecha(fecha: string): string {
  return FORMATO_FECHA.format(new Date(`${fecha}T00:00:00Z`)).replace(".", "");
}

export function formatearPrecio(precioDesde: number): string {
  return precioDesde === 0 ? "Gratuito" : `Desde ${precioDesde}€`;
}
