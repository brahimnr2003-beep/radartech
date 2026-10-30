"use server";

import { and, count, eq, gte } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { eventos } from "@/db/schema";
import { type ResultadoEnvio, validarEnvio } from "@/lib/envio-evento";
import { hoyEnEspana } from "@/lib/eventos";
import { crearSlug } from "@/lib/slug";

/** Anti-spam sin cuentas: tope global por hora y por email al día. */
const MAX_ENVIOS_HORA = 20;
const MAX_ENVIOS_EMAIL_DIA = 3;
/** Un humano tarda más que esto en rellenar el formulario. */
const SEGUNDOS_MINIMOS = 3;

export async function enviarEvento(
  _anterior: ResultadoEnvio,
  formData: FormData,
): Promise<ResultadoEnvio> {
  const campos = Object.fromEntries(
    [...formData.entries()].filter(([, v]) => typeof v === "string"),
  ) as Record<string, string>;

  // Campo trampa (invisible para personas) o envío demasiado rápido: es un bot.
  // Se responde como si hubiera ido bien para no darle pistas.
  const segundos = (Date.now() - Number(campos.inicio)) / 1000;
  if (campos.sitio_web || !(segundos >= SEGUNDOS_MINIMOS)) {
    return { estado: "enviado" };
  }

  const resultado = validarEnvio(campos, hoyEnEspana());
  if (!resultado.success) {
    return {
      estado: "error",
      mensaje: "Revisa los campos marcados.",
      errores: z.flattenError(resultado.error).fieldErrors,
    };
  }
  const envio = resultado.data;

  const haceUnaHora = new Date(Date.now() - 60 * 60 * 1000);
  const haceUnDia = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const delFormulario = eq(eventos.origen, "formulario");
  const [[recientes], [delEmail]] = await Promise.all([
    db
      .select({ total: count() })
      .from(eventos)
      .where(and(delFormulario, gte(eventos.creadoEn, haceUnaHora))),
    db
      .select({ total: count() })
      .from(eventos)
      .where(
        and(
          delFormulario,
          eq(eventos.emailContacto, envio.email.toLowerCase()),
          gte(eventos.creadoEn, haceUnDia),
        ),
      ),
  ]);
  if (
    recientes.total >= MAX_ENVIOS_HORA ||
    delEmail.total >= MAX_ENVIOS_EMAIL_DIA
  ) {
    return {
      estado: "error",
      mensaje:
        "Hemos recibido muchos envíos en poco tiempo. Inténtalo de nuevo más tarde.",
    };
  }

  const valores = {
    nombre: envio.nombre,
    descripcion: envio.descripcion,
    fecha: envio.fecha,
    fechaFin: envio.fechaFin,
    hora: envio.hora,
    comunidad: envio.comunidad,
    provincia: envio.provincia,
    ciudad: envio.ciudad,
    lugar: envio.lugar,
    categoria: envio.categoria,
    tipo: envio.tipo,
    modalidad: envio.modalidad,
    precioDesde: envio.precioDesde ?? null,
    organizador: envio.organizador,
    urlOficial: envio.urlOficial,
    imagenUrl: envio.imagenUrl,
    emailContacto: envio.email.toLowerCase(),
    // Nada del formulario se publica sin revisión
    estado: "pendiente" as const,
    origen: "formulario" as const,
  };

  // El slug debe ser único: si ya existe, se prueba con la fecha y luego al azar
  const base = crearSlug(envio.nombre, envio.fecha.slice(0, 4));
  for (const slug of [
    base,
    `${base}-${envio.fecha}`,
    `${base}-${crypto.randomUUID().slice(0, 6)}`,
  ]) {
    const insertado = await db
      .insert(eventos)
      .values({ ...valores, slug })
      .onConflictDoNothing({ target: eventos.slug })
      .returning({ id: eventos.id });
    if (insertado.length > 0) return { estado: "enviado" };
  }

  return {
    estado: "error",
    mensaje: "No hemos podido guardar el evento. Inténtalo de nuevo.",
  };
}
