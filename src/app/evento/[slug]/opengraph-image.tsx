import { nombreCategoria } from "@/lib/categorias";
import { getEvento, getSlugsEventos } from "@/lib/consultas";
import { formatearFechas } from "@/lib/eventos";
import { TAMANO_IMAGEN, imagenCompartir } from "@/lib/imagen-compartir";

export const alt = "Evento tecnológico en RadarTech";
export const size = TAMANO_IMAGEN;
export const contentType = "image/png";

export async function generateStaticParams() {
  const slugs = await getSlugsEventos();
  return slugs.length > 0
    ? slugs.map((slug) => ({ slug }))
    : [{ slug: "__sin-eventos__" }];
}

/** Imagen al compartir la ficha de un evento: nombre, fecha, ciudad y categoría. */
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const evento = await getEvento((await params).slug);
  if (!evento) {
    return imagenCompartir({
      etiqueta: "Eventos tech · España",
      titulo: "Evento no encontrado",
      pie: "radartech",
    });
  }
  return imagenCompartir({
    etiqueta: nombreCategoria(evento.categoria),
    titulo: evento.nombre,
    pie: `${formatearFechas(evento.fecha, evento.fechaFin)} · ${evento.ciudad}`,
  });
}
