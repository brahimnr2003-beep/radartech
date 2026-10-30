"use server";

import { eq, inArray, not } from "drizzle-orm";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { eventos } from "@/db/schema";
import { exigirAdministrador } from "@/lib/auth";
import { TAG_EVENTOS } from "@/lib/consultas";
import { esquemaEdicion, type ResultadoEnvio } from "@/lib/envio-evento";

type Estado = (typeof eventos.estado.enumValues)[number];

/** Aprobar, rechazar, ocultar (= rechazar uno publicado) o recuperar. */
export async function cambiarEstado(id: number, estado: Estado) {
  await exigirAdministrador();
  await db
    .update(eventos)
    .set({ estado: z.enum(eventos.estado.enumValues).parse(estado) })
    .where(eq(eventos.id, z.number().int().parse(id)));
  // La web pública se actualiza al momento
  updateTag(TAG_EVENTOS);
}

/** Lo mismo para todos los eventos marcados con las casillas del panel. */
export async function cambiarEstadoVarios(estado: Estado, formData: FormData) {
  await exigirAdministrador();
  const ids = z.array(z.coerce.number().int()).parse(formData.getAll("ids"));
  if (ids.length === 0) return;
  await db
    .update(eventos)
    .set({ estado: z.enum(eventos.estado.enumValues).parse(estado) })
    .where(inArray(eventos.id, ids));
  updateTag(TAG_EVENTOS);
}

export async function alternarDestacado(id: number) {
  await exigirAdministrador();
  await db
    .update(eventos)
    .set({ destacado: not(eventos.destacado) })
    .where(eq(eventos.id, id));
  updateTag(TAG_EVENTOS);
}

export async function editarEvento(
  id: number,
  _anterior: ResultadoEnvio,
  formData: FormData,
): Promise<ResultadoEnvio> {
  await exigirAdministrador();
  const resultado = esquemaEdicion.safeParse(
    Object.fromEntries(formData.entries()),
  );
  if (!resultado.success) {
    return {
      estado: "error",
      mensaje: "Revisa los campos marcados.",
      errores: z.flattenError(resultado.error).fieldErrors,
    };
  }
  const { email, ...datos } = resultado.data;
  const [editado] = await db
    .update(eventos)
    .set({
      ...datos,
      // Lo que se vacía en el formulario se borra en la base de datos
      fechaFin: datos.fechaFin ?? null,
      hora: datos.hora ?? null,
      lugar: datos.lugar ?? null,
      precioDesde: datos.precioDesde ?? null,
      imagenUrl: datos.imagenUrl ?? null,
      imagenAlt: datos.imagenUrl ? undefined : null,
      organizador: datos.organizador ?? null,
      emailContacto: email?.toLowerCase() ?? null,
    })
    .where(eq(eventos.id, id))
    .returning({ estado: eventos.estado });
  updateTag(TAG_EVENTOS);
  redirect(`/admin?estado=${editado?.estado ?? "pendiente"}`);
}
