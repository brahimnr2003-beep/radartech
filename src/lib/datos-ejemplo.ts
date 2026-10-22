import type { ComunidadSlug } from "./comunidades";

// DATOS DE EJEMPLO para desarrollo: las cifras son ficticias.
// Se sustituyen por consultas a la base de datos en la fase 4 (ver contexto/10_hoja_de_ruta.md).
export const EVENTOS_POR_COMUNIDAD: Record<ComunidadSlug, number> = {
  madrid: 76,
  cataluna: 68,
  andalucia: 42,
  valencia: 31,
  "pais-vasco": 24,
  galicia: 15,
  canarias: 14,
  "castilla-y-leon": 12,
  aragon: 11,
  baleares: 10,
  murcia: 9,
  navarra: 8,
  "castilla-la-mancha": 7,
  asturias: 6,
  cantabria: 5,
  extremadura: 4,
  "la-rioja": 3,
  ceuta: 1,
  melilla: 1,
};
