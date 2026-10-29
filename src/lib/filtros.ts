import { CATEGORIAS, type CategoriaSlug } from "./categorias";
import { COMUNIDADES, type ComunidadSlug } from "./comunidades";
import {
  MODALIDADES,
  TIPOS_EVENTO,
  type Evento,
  type Modalidad,
  type TipoEvento,
} from "./eventos";

export const FECHAS = {
  "7-dias": "Próximos 7 días",
  "este-mes": "Este mes",
  "proximos-meses": "Próximos meses",
} as const;

export const PRECIOS = {
  gratuito: "Gratuito",
  "de-pago": "De pago",
} as const;

export type Filtros = {
  fecha?: keyof typeof FECHAS;
  /** Solo en la página de todos los eventos */
  comunidad?: ComunidadSlug;
  /** Provincia y ciudad se eligen en un único filtro «Ubicación» */
  provincia?: string;
  ciudad?: string;
  categoria?: CategoriaSlug;
  modalidad?: Modalidad;
  precio?: keyof typeof PRECIOS;
  tipo?: TipoEvento;
};

export const CLAVES_FILTRO = [
  "fecha",
  "comunidad",
  "provincia",
  "ciudad",
  "categoria",
  "modalidad",
  "precio",
  "tipo",
] as const satisfies readonly (keyof Filtros)[];

const enLista = <T extends string>(
  valor: string | null,
  validos: readonly T[],
): T | undefined => (validos.includes(valor as T) ? (valor as T) : undefined);

/** Lee los filtros de la URL, ignorando valores desconocidos. */
export function leerFiltros(params: URLSearchParams): Filtros {
  return {
    fecha: enLista(
      params.get("fecha"),
      Object.keys(FECHAS) as (keyof typeof FECHAS)[],
    ),
    comunidad: enLista(
      params.get("comunidad"),
      COMUNIDADES.map((c) => c.slug),
    ),
    provincia: params.get("provincia") ?? undefined,
    ciudad: params.get("ciudad") ?? undefined,
    categoria: enLista(
      params.get("categoria"),
      CATEGORIAS.map((c) => c.slug),
    ),
    modalidad: enLista(
      params.get("modalidad"),
      Object.keys(MODALIDADES) as Modalidad[],
    ),
    precio: enLista(
      params.get("precio"),
      Object.keys(PRECIOS) as (keyof typeof PRECIOS)[],
    ),
    tipo: enLista(
      params.get("tipo"),
      Object.keys(TIPOS_EVENTO) as TipoEvento[],
    ),
  };
}

/** Suma días a una fecha ISO (AAAA-MM-DD). */
function sumarDias(fecha: string, dias: number): string {
  const d = new Date(`${fecha}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + dias);
  return d.toISOString().slice(0, 10);
}

function cumpleFecha(
  fecha: string,
  filtro: Filtros["fecha"],
  hoy: string,
): boolean {
  if (!filtro) return true;
  const mesActual = hoy.slice(0, 7);
  switch (filtro) {
    case "7-dias":
      return fecha >= hoy && fecha <= sumarDias(hoy, 7);
    case "este-mes":
      return fecha >= hoy && fecha.slice(0, 7) === mesActual;
    case "proximos-meses":
      return fecha.slice(0, 7) > mesActual;
  }
}

/** Un evento de varios días ya empezado cuenta como si fuera hoy. */
function fechaEfectiva(e: Evento, hoy: string): string {
  return e.fecha < hoy && (e.fechaFin ?? e.fecha) >= hoy ? hoy : e.fecha;
}

/**
 * Aplica los filtros a una lista de eventos.
 * @param hoy fecha actual en ISO (AAAA-MM-DD), para los filtros de fecha
 */
export function filtrarEventos(
  eventos: Evento[],
  filtros: Filtros,
  hoy: string,
): Evento[] {
  return eventos.filter(
    (e) =>
      cumpleFecha(fechaEfectiva(e, hoy), filtros.fecha, hoy) &&
      (!filtros.comunidad || e.comunidad === filtros.comunidad) &&
      (!filtros.provincia || e.provincia === filtros.provincia) &&
      (!filtros.ciudad || e.ciudad === filtros.ciudad) &&
      (!filtros.categoria || e.categoria === filtros.categoria) &&
      (!filtros.modalidad || e.modalidad === filtros.modalidad) &&
      // Con precio desconocido no se cumple ni «gratuito» ni «de pago»
      (!filtros.precio ||
        (filtros.precio === "gratuito"
          ? e.precioDesde === 0
          : (e.precioDesde ?? 0) > 0)) &&
      (!filtros.tipo || e.tipo === filtros.tipo),
  );
}

const ordenar = (a: string, b: string) => a.localeCompare(b, "es");

/** Ciudades con eventos agrupadas por provincia, en orden alfabético. */
export function opcionesUbicacion(
  eventos: Evento[],
): { provincia: string; ciudades: string[] }[] {
  const grupos = new Map<string, Set<string>>();
  for (const e of eventos) {
    if (!grupos.has(e.provincia)) grupos.set(e.provincia, new Set());
    grupos.get(e.provincia)!.add(e.ciudad);
  }
  return [...grupos]
    .sort(([a], [b]) => ordenar(a, b))
    .map(([provincia, ciudades]) => ({
      provincia,
      ciudades: [...ciudades].sort(ordenar),
    }));
}
