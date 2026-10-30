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
 * Paso 1: búsqueda en internet con Tavily (plan gratuito: 1.000 créditos al
 * mes; la búsqueda avanzada gasta 2 y trae el doble de resultados útiles.
 * Si se agotan, deja de responder sin cobrar).
 */
export async function buscarEnInternet(
  comunidad: string,
  enfoque: Enfoque,
  hoy: string,
): Promise<ResultadoBusqueda[]> {
  const respuesta = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.TAVILY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `${ENFOQUES[enfoque]} ${comunidad} ${añosBuscados(hoy)}`,
      search_depth: "advanced",
      max_results: 10,
      // Texto completo de cada página: los extractos casi nunca traen la fecha
      include_raw_content: "markdown",
    }),
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
  url: z.url().describe("URL oficial o de inscripción del evento"),
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
      "- La url debe aparecer tal cual en el texto: la del propio evento si está enlazada, o si no la URL del resultado.",
      "- Omite agendas genéricas, noticias de eventos pasados, cursos sin fecha y ofertas de empleo.",
      "- Sé estricto con esEventoTech: solo eventos de tecnología digital (software, IA, datos, cloud, ciberseguridad, startups tecnológicas). Son false los de energía, hidrógeno, industria no digital, ciencia general o divulgación, salud, educación general, turismo y financiación o subvenciones.",
      "- No inventes datos: lo que no aparezca, déjalo en null.",
      "",
      texto,
    ].join("\n"),
  });
  // Solo se aceptan enlaces que aparecen de verdad en la búsqueda
  console.log(
    output.eventos
      .map(
        (e) =>
          `${e.fecha} ${e.nombre} ${e.url} en_texto=${texto.includes(e.url)}`,
      )
      .join("\n"),
  );
  return output.eventos.filter((e) => texto.includes(e.url));
}
