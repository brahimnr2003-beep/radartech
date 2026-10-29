import type { Modalidad } from "../lib/eventos";

export type NombreFuente = "eventos.wiki" | "agenda-tech" | "confs.tech";

/** Evento tal como llega de una fuente, antes de clasificarlo. */
export type EventoBruto = {
  fuente: NombreFuente;
  /** Único entre fuentes: «fuente:identificador» */
  idExterno: string;
  nombre: string;
  /** Fecha u hora ISO de inicio (AAAA-MM-DD o AAAA-MM-DDTHH:MM) */
  inicio: string;
  fin?: string;
  descripcion?: string;
  modalidad?: Modalidad;
  /** Recinto o dirección */
  lugar?: string;
  ciudad?: string;
  region?: string;
  /** Mejor enlace conocido a la web oficial del evento */
  url: string;
  /** Página del evento en la fuente, para citarla */
  urlFuente: string;
  organizador?: string;
  /** Precio mínimo en euros, si la fuente lo da */
  precioDesde?: number;
  etiquetas?: string[];
};
