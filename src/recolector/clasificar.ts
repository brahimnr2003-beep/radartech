// Clasificación con Gemini: decide si un evento es tech y lo encaja en el modelo de RadarTech.
import { google } from "@ai-sdk/google";
import { generateText, Output } from "ai";
import { z } from "zod";
import { CATEGORIAS } from "../lib/categorias";
import { COMUNIDADES } from "../lib/comunidades";
import { MODALIDADES_VALORES, TIPOS_EVENTO_VALORES } from "../lib/eventos";
import type { EventoBruto } from "./tipos";

/** Modelo ligero del plan gratuito, suficiente para clasificar. */
export const MODELO = "gemini-3.5-flash-lite";

const valores = <T extends { slug: string }>(lista: readonly T[]) =>
  lista.map((c) => c.slug) as [T["slug"], ...T["slug"][]];

export const esquemaClasificacion = z.object({
  esEventoTech: z
    .boolean()
    .describe(
      [
        "true si es un evento profesional o de comunidad sobre tecnología: desarrollo de software, IA, datos, cloud, DevOps, ciberseguridad o startups tecnológicas. También ferias y festivales de talento o empleo tecnológico.",
        "false si es una actividad cultural, divulgativa general o de ocio.",
        "false si es un congreso académico comercial de los que se organizan en serie para cobrar inscripciones: nombres genéricos («International Conference on…», «Annual Global Summit on…») y web de un organizador con muchos congresos distintos.",
        "Las ferias y congresos tecnológicos profesionales (p. ej. en IFEMA o Fira de Barcelona) sí son eventos tech.",
        "Una conferencia con web propia del evento es válida aunque haya poca información.",
      ].join(" "),
    ),
  motivo: z
    .string()
    .describe("Una frase que explique por qué es o no es un evento tech"),
  categoria: z
    .enum(valores(CATEGORIAS))
    .describe(
      [
        "La temática principal:",
        "ia = inteligencia artificial, machine learning, IA generativa;",
        "data = datos, big data, analítica, ingeniería de datos, bases de datos;",
        "software = desarrollo en general: lenguajes, web, móvil, frontend, CMS, accesibilidad, buenas prácticas;",
        "cloud = cloud, DevOps, SRE, plataformas, infraestructura, contenedores;",
        "ciberseguridad = seguridad informática, hacking ético, privacidad;",
        "startups = emprendimiento, negocio digital, inversión, fintech, blockchain, transformación digital.",
        "Elige software solo si ninguna otra encaja mejor.",
      ].join(" "),
    ),
  tipo: z.enum(TIPOS_EVENTO_VALORES),
  comunidad: z
    .enum(valores(COMUNIDADES))
    .nullable()
    .describe(
      "Comunidad o ciudad autónoma donde se celebra. Si es online, la del organizador. null si no se puede saber o no es en España.",
    ),
  provincia: z
    .string()
    .describe("Provincia, con su nombre en castellano, p. ej. «Málaga»"),
  ciudad: z
    .string()
    .describe(
      "Ciudad, con su nombre en castellano (Valencia, no València; La Coruña o A Coruña según uso habitual), p. ej. «Torremolinos»",
    ),
  modalidad: z.enum(MODALIDADES_VALORES),
  resumen: z
    .string()
    .describe(
      "Resumen de 1 a 3 frases en español, escrito con tus propias palabras (no copies el texto original), sin inventar datos que no aparezcan.",
    ),
});

export type Clasificacion = z.infer<typeof esquemaClasificacion>;

export async function clasificar(evento: EventoBruto): Promise<Clasificacion> {
  const { output } = await generateText({
    model: google(MODELO),
    // Respuestas lo más estables posible entre ejecuciones
    temperature: 0,
    output: Output.object({ schema: esquemaClasificacion }),
    system:
      "Eres el editor de RadarTech, una agenda de eventos tecnológicos de España. Clasificas eventos con precisión y nunca inventas datos.",
    prompt: `Clasifica este evento. Datos tal como vienen de la fuente (pueden estar incompletos o en otro idioma):\n\n${JSON.stringify(
      {
        nombre: evento.nombre,
        inicio: evento.inicio,
        fin: evento.fin,
        descripcion: evento.descripcion,
        modalidad: evento.modalidad,
        lugar: evento.lugar,
        ciudad: evento.ciudad,
        region: evento.region,
        organizador: evento.organizador,
        etiquetas: evento.etiquetas,
        web: evento.url,
      },
      null,
      2,
    )}`,
  });
  return output;
}
