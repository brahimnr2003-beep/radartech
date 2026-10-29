// Tipos, textos y formato de eventos. Sin acceso a datos: se puede usar en el navegador.
// Las consultas a la base de datos están en ./consultas.ts.
import type { CategoriaSlug } from "./categorias";
import type { ComunidadSlug } from "./comunidades";

export const MODALIDADES_VALORES = ["presencial", "online", "hibrido"] as const;
export const TIPOS_EVENTO_VALORES = [
  "conferencia",
  "meetup",
  "hackathon",
  "taller",
  "otro",
] as const;

export type Modalidad = (typeof MODALIDADES_VALORES)[number];
export type TipoEvento = (typeof TIPOS_EVENTO_VALORES)[number];

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

/** Fecha de hoy en España en formato ISO (AAAA-MM-DD). */
export function hoyEnEspana(): string {
  // El formato sueco (sv-SE) produce justo AAAA-MM-DD
  return new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Madrid" });
}
