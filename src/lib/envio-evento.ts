// Validación del formulario «Añadir evento». Se usa en el servidor; el
// navegador solo hace las comprobaciones básicas de HTML (required, type…).
import { z } from "zod";
import { CATEGORIAS } from "./categorias";
import { COMUNIDADES } from "./comunidades";
import { MODALIDADES_VALORES, TIPOS_EVENTO_VALORES } from "./eventos";

const valores = <T extends { slug: string }>(lista: readonly T[]) =>
  lista.map((c) => c.slug) as [T["slug"], ...T["slug"][]];

/** Los campos vacíos del formulario llegan como "": se tratan como no rellenados. */
const opcional = <T extends z.ZodType>(esquema: T) =>
  z.preprocess((v) => (v === "" ? undefined : v), esquema.optional());

const texto = (max: number) =>
  z
    .string("Este campo es obligatorio")
    .trim()
    .min(1, "Este campo es obligatorio")
    .max(max, `Como máximo ${max} caracteres`);

const enlace = z
  .url({
    protocol: /^https?$/,
    error: "Escribe un enlace que empiece por https://",
  })
  .max(500, "El enlace es demasiado largo");

const elegir = (mensaje: string) => ({ error: mensaje });

export const esquemaEnvio = z
  .object({
    nombre: texto(150),
    descripcion: texto(2000).refine((d) => d.length >= 30, {
      message: "Cuéntanos algo más: al menos 30 caracteres",
    }),
    fecha: z.iso.date("Elige la fecha del evento"),
    fechaFin: opcional(z.iso.date("Fecha no válida")),
    hora: opcional(z.iso.time({ precision: -1, error: "Hora no válida" })),
    comunidad: z.enum(valores(COMUNIDADES), elegir("Elige una comunidad")),
    provincia: texto(60),
    ciudad: texto(80),
    lugar: opcional(texto(150)),
    categoria: z.enum(valores(CATEGORIAS), elegir("Elige una categoría")),
    tipo: z.enum(TIPOS_EVENTO_VALORES, elegir("Elige el tipo de evento")),
    modalidad: z.enum(MODALIDADES_VALORES, elegir("Elige la modalidad")),
    precioDesde: opcional(
      z.coerce
        .number("Escribe un número")
        .int("Sin decimales")
        .min(0, "No puede ser negativo")
        .max(10_000, "Revisa el precio"),
    ),
    urlOficial: enlace,
    imagenUrl: opcional(enlace),
    organizador: texto(120),
    email: z.email("Escribe un email válido").max(200),
  })
  .refine((e) => !e.fechaFin || e.fechaFin >= e.fecha, {
    path: ["fechaFin"],
    message: "Debe ser igual o posterior a la fecha de inicio",
  });

export type EnvioEvento = z.infer<typeof esquemaEnvio>;
export type CampoEnvio = keyof EnvioEvento;

export type ResultadoEnvio =
  | { estado: "inicial" }
  | { estado: "enviado" }
  | {
      estado: "error";
      mensaje: string;
      errores?: Partial<Record<CampoEnvio, string[]>>;
    };

/** Valida el envío; la fecha debe ser de hoy en adelante (hora de España). */
export function validarEnvio(datos: Record<string, unknown>, hoy: string) {
  return esquemaEnvio
    .refine((e) => e.fecha >= hoy, {
      path: ["fecha"],
      message: "El evento tiene que ser de hoy en adelante",
    })
    .safeParse(datos);
}
