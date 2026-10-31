import { TAMANO_IMAGEN, imagenCompartir } from "@/lib/imagen-compartir";

export const alt = "RadarTech — Eventos tecnológicos de España";
export const size = TAMANO_IMAGEN;
export const contentType = "image/png";

/** Imagen al compartir cualquier página que no tenga una propia. */
export default function Image() {
  return imagenCompartir({
    etiqueta: "Eventos tech · España",
    titulo: "Descubre los eventos tecnológicos más relevantes de España.",
    resaltado: "relevantes",
    pie: "Mapa por comunidades · IA · Data · Cloud · Ciberseguridad",
  });
}
