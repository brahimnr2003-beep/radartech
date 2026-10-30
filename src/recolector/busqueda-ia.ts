// Búsqueda de eventos en internet: Tavily busca y Gemini extrae y clasifica.
// Lo que encuentra entra siempre como pendiente: no viene de una fuente aprobada.
import { google } from "@ai-sdk/google";
import { generateText, Output } from "ai";
import { z } from "zod";
import { MODELO, esquemaClasificacion } from "./clasificar";

/**
 * Enfoques de la búsqueda: cada uno es una búsqueda por comunidad. Frases
 * cortas: el buscador devuelve muchos menos resultados con frases largas.
 */
export const ENFOQUES = {
  general: "eventos tecnológicos",
  conferencias: "congreso tecnología",
  comunidades: "meetup desarrolladores",
  practicos: "hackathon",
} as const;
export type Enfoque = keyof typeof ENFOQUES;

/**
 * Webs que reúnen eventos de otros: sirven para descubrirlos, pero nunca son
 * su fuente primaria. Por decisión del administrador, tampoco cuentan las
 * plataformas de inscripción (Eventbrite, Meetup, Luma, Devpost): solo la web
 * propia del evento o de su organizador.
 */
const AGREGADORES = [
  "eventbrite.es",
  "eventbrite.com",
  "eventbrite.co.uk",
  "meetup.com",
  "lu.ma",
  "luma.com",
  "devpost.com",
  "eventos.wiki",
  "agenda-tech.h1756.es",
  "confs.tech",
  "dev.events",
  "hackathonhub.eu",
  "hackathonspain.com",
  "hackathonradar.com",
  "openhackathons.org",
  "10times.com",
  "allevents.in",
  "conferenceindex.org",
  "eventseye.com",
  "nferias.com",
  "interempresas.net",
  "datos.gob.es",
  "instagram.com",
  "facebook.com",
  "linkedin.com",
  "x.com",
  "twitter.com",
  "youtube.com",
];

/** Dominio sin «www.»: dos eventos el mismo día en la misma web son el mismo */
export const dominio = (url: string) =>
  new URL(url).hostname.replace(/^www\./, "");

/** «https://www.Ejemplo.es/evento/?utm=x» → «ejemplo.es/evento» */
export const normalizarUrl = (url: string) => {
  const u = new URL(url);
  return `${dominio(u.href)}${u.pathname.replace(/\/$/, "")}`.toLowerCase();
};

export const esAgregador = (url: string) =>
  AGREGADORES.some((a) => dominio(url) === a || dominio(url).endsWith(`.${a}`));

type ResultadoBusqueda = {
  title: string;
  url: string;
  content: string;
  raw_content?: string | null;
};

/** Texto de cada página que se le pasa a Gemini (suficiente para un calendario). */
const MAX_CARACTERES_PAGINA = 12_000;

/** «2026-10-31» → «2026»; en noviembre y diciembre, también el año siguiente */
function añosBuscados(hoy: string): string {
  const año = Number(hoy.slice(0, 4));
  return Number(hoy.slice(5, 7)) >= 11 ? `${año} ${año + 1}` : `${año}`;
}

/**
 * Llamada a Tavily (plan gratuito: 1.000 créditos al mes; búsqueda básica = 1,
 * avanzada = 2. Si se agotan, deja de responder sin cobrar).
 */
async function tavily(cuerpo: object): Promise<ResultadoBusqueda[]> {
  const respuesta = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.TAVILY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cuerpo),
    signal: AbortSignal.timeout(60_000),
  });
  if (!respuesta.ok) {
    throw new Error(`Tavily respondió ${respuesta.status}`);
  }
  const { results } = (await respuesta.json()) as {
    results: ResultadoBusqueda[];
  };
  return results;
}

/** Paso 1: búsqueda avanzada (el doble de resultados útiles que la básica). */
export function buscarEnInternet(
  comunidad: string,
  enfoque: Enfoque,
  hoy: string,
): Promise<ResultadoBusqueda[]> {
  return tavily({
    query: `${ENFOQUES[enfoque]} ${comunidad} ${añosBuscados(hoy)}`,
    search_depth: "advanced",
    max_results: 10,
    // Texto completo de cada página: los extractos casi nunca traen la fecha
    include_raw_content: "markdown",
  });
}

const esquemaEncontrado = esquemaClasificacion.extend({
  nombre: z.string().describe("Nombre del evento, tal cual"),
  fecha: z.iso.date().describe("Fecha de inicio AAAA-MM-DD"),
  fechaFin: z.iso
    .date()
    .nullable()
    .describe("Fecha de fin, si dura varios días"),
  hora: z
    .string()
    .regex(/^\d{2}:\d{2}$/)
    .nullable()
    .describe("Hora de inicio HH:MM, si se sabe"),
  lugar: z.string().nullable(),
  organizador: z.string().nullable(),
  precioDesde: z
    .number()
    .int()
    .nullable()
    .describe("Precio mínimo en euros; 0 si es gratuito; null si no se sabe"),
  urlOficial: z
    .url()
    .nullable()
    .describe(
      "Web propia del evento o de su organizador. NUNCA una agenda, calendario, listado, noticia, red social ni plataforma de entradas (Eventbrite, Meetup, Luma, Devpost). null si no aparece en el texto.",
    ),
  urlEncontrado: z
    .url()
    .describe("URL del resultado de búsqueda donde aparece el evento"),
});
export type EventoEncontrado = z.infer<typeof esquemaEncontrado>;

/** Paso 2: Gemini extrae de los resultados los eventos con fecha y los clasifica. */
export async function estructurar(
  resultados: ResultadoBusqueda[],
  comunidad: string,
  hoy: string,
): Promise<EventoEncontrado[]> {
  if (resultados.length === 0) return [];
  const texto = resultados
    .map(
      (r, i) =>
        `[${i + 1}] ${r.title}\nURL: ${r.url}\n${(r.raw_content || r.content).slice(0, MAX_CARACTERES_PAGINA)}`,
    )
    .join("\n\n");
  const { output } = await generateText({
    model: google(MODELO),
    temperature: 0,
    output: Output.object({
      schema: z.object({ eventos: z.array(esquemaEncontrado) }),
    }),
    system:
      "Eres el editor de RadarTech, una agenda de eventos tecnológicos de España. Clasificas eventos con precisión y nunca inventas datos.",
    prompt: [
      `Hoy es ${hoy}. Estos son resultados de una búsqueda de eventos tech en ${comunidad} (España).`,
      "Extrae cada evento concreto que se celebre en España, aunque sea de otra comunidad. Las páginas de calendario pueden contener muchos eventos: extráelos todos. Reglas:",
      "- Solo eventos con fecha concreta igual o posterior a hoy que aparezca en el texto. Si no hay fecha clara, omítelo.",
      "- urlOficial y urlEncontrado deben aparecer tal cual en el texto. Si el evento solo aparece en una agenda o listado sin enlace a su propia web, urlOficial es null.",
      "- Omite agendas genéricas, noticias de eventos pasados, cursos sin fecha y ofertas de empleo.",
      "- Sé estricto con esEventoTech: solo eventos de tecnología digital (software, IA, datos, cloud, ciberseguridad, startups tecnológicas). Son false los de energía, hidrógeno, industria no digital, ciencia general o divulgación, salud, educación general, turismo y financiación o subvenciones.",
      "- No inventes datos: lo que no aparezca, déjalo en null.",
      "",
      texto,
    ].join("\n"),
  });
  // Solo se aceptan enlaces que aparecen de verdad en la búsqueda, y una web
  // oficial nunca puede ser un agregador
  return output.eventos
    .filter((e) => texto.includes(e.urlEncontrado))
    .map((e) => ({
      ...e,
      urlOficial:
        e.urlOficial &&
        texto.includes(e.urlOficial) &&
        !esAgregador(e.urlOficial)
          ? e.urlOficial
          : null,
    }));
}

/** Palabras significativas de un nombre: «PyConES Barcelona 2026» → [pycones, barcelona] */
const palabras = (texto: string) =>
  texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .split(/[^a-z0-9]+/)
    .filter((p) => p.length > 3 && !/^\d+$/.test(p));

/**
 * Paso 3: si el evento solo apareció en una agenda, busca su web oficial
 * (búsqueda básica, 1 crédito). Devuelve el primer resultado que no sea un
 * agregador y que mencione el nombre del evento, o null.
 */
export async function buscarWebOficial(
  nombre: string,
  fecha: string,
): Promise<string | null> {
  const resultados = await tavily({
    query: `${nombre} ${fecha.slice(0, 4)}`,
    search_depth: "basic",
    max_results: 5,
  });
  const clave = palabras(nombre);
  const candidato = resultados.find((r) => {
    if (esAgregador(r.url)) return false;
    const texto = palabras(`${r.title} ${r.url} ${r.content}`);
    // Debe mencionar la mayoría de las palabras del nombre
    const coincidencias = clave.filter((p) => texto.includes(p)).length;
    return clave.length > 0 && coincidencias / clave.length >= 0.6;
  });
  return candidato?.url ?? null;
}
