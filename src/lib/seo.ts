// Datos estructurados (schema.org) para que los buscadores entiendan las páginas.
import { COMUNIDADES } from "./comunidades";
import type { Evento } from "./eventos";
import { NOMBRE_WEB, URL_WEB } from "./proyecto";

const MODO_ASISTENCIA = {
  presencial: "https://schema.org/OfflineEventAttendanceMode",
  online: "https://schema.org/OnlineEventAttendanceMode",
  hibrido: "https://schema.org/MixedEventAttendanceMode",
} as const;

/**
 * Desfase horario de España peninsular en una fecha: «+01:00» en invierno y
 * «+02:00» en verano.
 */
export function desfaseMadrid(fecha: string): string {
  const nombre = new Intl.DateTimeFormat("en", {
    timeZone: "Europe/Madrid",
    timeZoneName: "longOffset",
  })
    .formatToParts(new Date(`${fecha}T12:00:00Z`))
    .find((p) => p.type === "timeZoneName")?.value;
  return nombre?.replace("GMT", "") || "+01:00";
}

/** «2026-11-14» + «09:30» → «2026-11-14T09:30:00+01:00»; sin hora, solo la fecha. */
const fechaHora = (fecha: string, hora?: string) =>
  hora ? `${fecha}T${hora}:00${desfaseMadrid(fecha)}` : fecha;

/** schema.org/Event de una ficha: Google puede mostrarlo con fecha y lugar. */
export function datosEstructuradosEvento(evento: Evento) {
  const comunidad = COMUNIDADES.find((c) => c.slug === evento.comunidad);
  const lugarFisico = {
    "@type": "Place",
    name: evento.lugar ?? evento.ciudad,
    address: {
      "@type": "PostalAddress",
      addressLocality: evento.ciudad,
      addressRegion: comunidad?.nombre ?? evento.provincia,
      addressCountry: "ES",
    },
  };
  const lugarVirtual = { "@type": "VirtualLocation", url: evento.urlOficial };
  const url = `${URL_WEB}/evento/${evento.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: evento.nombre,
    description: evento.descripcion,
    url,
    startDate: fechaHora(evento.fecha, evento.hora),
    endDate: evento.fechaFin ?? evento.fecha,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: MODO_ASISTENCIA[evento.modalidad],
    location:
      evento.modalidad === "online"
        ? lugarVirtual
        : evento.modalidad === "hibrido"
          ? [lugarFisico, lugarVirtual]
          : lugarFisico,
    image: [evento.imagen?.url ?? `${url}/opengraph-image`],
    ...(evento.organizador && {
      organizer: { "@type": "Organization", name: evento.organizador },
    }),
    ...(evento.precioDesde !== null && {
      offers: {
        "@type": "Offer",
        price: evento.precioDesde,
        priceCurrency: "EUR",
        url: evento.urlOficial,
      },
    }),
  };
}

/** schema.org/WebSite de la portada. */
export function datosEstructuradosWeb() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: NOMBRE_WEB,
    url: URL_WEB,
    inLanguage: "es-ES",
  };
}

/** Texto seguro para un <script type="application/ld+json">. */
export const jsonLd = (datos: object) =>
  JSON.stringify(datos).replace(/</g, "\\u003c");
