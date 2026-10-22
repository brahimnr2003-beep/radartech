import { CATEGORIAS, type CategoriaSlug } from "./categorias";
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
  provincia?: string;
  ciudad?: string;
  categoria?: CategoriaSlug;
  modalidad?: Modalidad;
  precio?: keyof typeof PRECIOS;
  tipo?: TipoEvento;
};

export const CLAVES_FILTRO = [
  "fecha",
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
      cumpleFecha(e.fecha, filtros.fecha, hoy) &&
      (!filtros.provincia || e.provincia === filtros.provincia) &&
      (!filtros.ciudad || e.ciudad === filtros.ciudad) &&
      (!filtros.categoria || e.categoria === filtros.categoria) &&
      (!filtros.modalidad || e.modalidad === filtros.modalidad) &&
      (!filtros.precio ||
        (filtros.precio === "gratuito") === (e.precioDesde === 0)) &&
      (!filtros.tipo || e.tipo === filtros.tipo),
  );
}

const unicosOrdenados = (valores: string[]) =>
  [...new Set(valores)].sort((a, b) => a.localeCompare(b, "es"));

/** Provincias y ciudades con eventos; las ciudades se limitan a la provincia elegida. */
export function opcionesLugar(eventos: Evento[], provincia?: string) {
  return {
    provincias: unicosOrdenados(eventos.map((e) => e.provincia)),
    ciudades: unicosOrdenados(
      eventos
        .filter((e) => !provincia || e.provincia === provincia)
        .map((e) => e.ciudad),
    ),
  };
}
