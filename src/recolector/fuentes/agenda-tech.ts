// agenda-tech lista sus próximos eventos en un sitemap; cada página incluye
// los datos del evento en formato schema.org (JSON-LD). Licencia: CC BY 4.0.
import type { Modalidad } from "../../lib/eventos";
import { esperar, obtenerTexto } from "../http";
import type { EventoBruto } from "../tipos";

const SITEMAP = "https://agenda-tech.h1756.es/sitemap-eventos-proximos.xml";

type EventoSchemaOrg = {
  "@type": string;
  "@id": string;
  name: string;
  startDate: string;
  endDate?: string;
  description?: string;
  eventStatus?: string;
  eventAttendanceMode?: string;
  isAccessibleForFree?: boolean;
  location?: {
    name?: string;
    address?: {
      addressLocality?: string | null;
      addressRegion?: string | null;
    };
  };
  organizer?: { name?: string } | { name?: string }[];
  offers?: { price?: number | string } | { price?: number | string }[];
  sameAs?: string;
};

const MODALIDAD: Record<string, Modalidad> = {
  OfflineEventAttendanceMode: "presencial",
  OnlineEventAttendanceMode: "online",
  MixedEventAttendanceMode: "hibrido",
};

const comoLista = <T>(valor?: T | T[]): T[] =>
  valor === undefined ? [] : Array.isArray(valor) ? valor : [valor];

/** Extrae el evento schema.org del HTML de una página. */
export function extraerEventoSchemaOrg(
  html: string,
): EventoSchemaOrg | undefined {
  for (const [, json] of html.matchAll(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
  )) {
    try {
      const datos = JSON.parse(json);
      if (datos?.["@type"] === "Event") return datos;
    } catch {
      // Bloque JSON-LD mal formado: se ignora
    }
  }
}

function precioMinimo(e: EventoSchemaOrg): number | undefined {
  if (e.isAccessibleForFree) return 0;
  const precios = comoLista(e.offers)
    .map((o) => Number(o.price))
    .filter((p) => Number.isFinite(p));
  return precios.length > 0 ? Math.min(...precios) : undefined;
}

export async function leerAgendaTech(desde: string): Promise<EventoBruto[]> {
  const sitemap = await obtenerTexto(SITEMAP);
  const paginas = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    ([, url]) => url,
  );

  const eventos: EventoBruto[] = [];
  for (const pagina of paginas) {
    await esperar(1000);
    const e = extraerEventoSchemaOrg(await obtenerTexto(pagina));
    if (!e || (e.endDate ?? e.startDate).slice(0, 10) < desde) continue;
    if (e.eventStatus?.endsWith("EventCancelled")) continue;
    eventos.push({
      fuente: "agenda-tech",
      idExterno: `agenda-tech:${e["@id"]}`,
      nombre: e.name,
      inicio: e.startDate,
      fin: e.endDate,
      descripcion: e.description,
      modalidad: MODALIDAD[e.eventAttendanceMode?.split("/").pop() ?? ""],
      lugar: e.location?.name,
      ciudad: e.location?.address?.addressLocality ?? undefined,
      region: e.location?.address?.addressRegion ?? undefined,
      // sameAs apunta a la fuente original (web oficial u otra agenda)
      url: e.sameAs ?? e["@id"],
      urlFuente: e["@id"],
      organizador: comoLista(e.organizer)[0]?.name,
      precioDesde: precioMinimo(e),
    });
  }
  return eventos;
}
