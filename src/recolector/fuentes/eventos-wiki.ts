// eventos.wiki publica todos sus eventos en un JSON (formato Open Tech Events).
// Licencia de los datos: CC BY 4.0.
import type { Modalidad } from "../../lib/eventos";
import { obtenerJson } from "../http";
import type { EventoBruto } from "../tipos";

type EventoOte = {
  id: string;
  name: string;
  startDate: string;
  endDate?: string;
  url: string;
  description?: string;
  attendanceMode?: "in-person" | "online" | "hybrid";
  status?: string;
  tags?: string[];
  location?: {
    venue?: string;
    onlineUrl?: string;
    address?: { street?: string; region?: string; country?: string };
  };
  organizers?: { name: string }[];
  offers?: { price?: number }[];
  source?: { url?: string };
  image?: { url: string; alt?: string }[];
};

const MODALIDAD: Record<string, Modalidad> = {
  "in-person": "presencial",
  online: "online",
  hybrid: "hibrido",
};

/** «C. Cifuentes, 5, Villaverde, 28021 Madrid, España» → «Madrid» */
function ciudadDeDireccion(direccion?: string): string | undefined {
  return direccion?.match(/\b\d{5}\s+([^,]+)/)?.[1]?.trim();
}

export async function leerEventosWiki(desde: string): Promise<EventoBruto[]> {
  const { events } = await obtenerJson<{ events: EventoOte[] }>(
    "https://eventos.wiki/events.json",
  );
  return events
    .filter(
      (e) =>
        (e.endDate ?? e.startDate).slice(0, 10) >= desde &&
        e.status !== "cancelled" &&
        (!e.location?.address?.country || e.location.address.country === "ES"),
    )
    .map((e) => {
      const precios = (e.offers ?? [])
        .map((o) => o.price)
        .filter((p): p is number => typeof p === "number");
      return {
        fuente: "eventos.wiki",
        idExterno: `eventos.wiki:${e.id}`,
        // Algunos eventos duplicados en eventos.wiki llevan «(copia)» en el nombre
        nombre: e.name.replace(/\s*\(copia\)\s*$/i, ""),
        inicio: e.startDate,
        fin: e.endDate,
        descripcion: e.description,
        modalidad: e.attendanceMode && MODALIDAD[e.attendanceMode],
        lugar: e.location?.venue,
        ciudad: ciudadDeDireccion(e.location?.address?.street),
        region: e.location?.address?.region,
        // La ficha de eventos.wiki enlaza a su vez a la web oficial
        url: e.source?.url ?? e.location?.onlineUrl ?? e.url,
        urlFuente: e.url,
        organizador: e.organizers?.[0]?.name,
        precioDesde: precios.length > 0 ? Math.min(...precios) : undefined,
        etiquetas: e.tags,
        imagen: e.image?.[0],
      };
    });
}
