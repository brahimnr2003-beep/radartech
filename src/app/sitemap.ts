import type { MetadataRoute } from "next";
import { COMUNIDADES } from "@/lib/comunidades";
import { getSlugsEventos } from "@/lib/consultas";
import { URL_WEB } from "@/lib/proyecto";

/** Mapa del sitio para los buscadores: páginas públicas y fichas de eventos. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getSlugsEventos();
  const pagina = (
    ruta: string,
    changeFrequency: "daily" | "weekly" | "yearly",
    priority: number,
  ) => ({ url: `${URL_WEB}${ruta}`, changeFrequency, priority });

  return [
    pagina("/", "daily", 1),
    pagina("/eventos", "daily", 0.9),
    ...COMUNIDADES.map((c) => pagina(`/eventos/${c.slug}`, "daily", 0.8)),
    ...slugs.map((slug) => pagina(`/evento/${slug}`, "weekly", 0.7)),
    pagina("/anadir-evento", "yearly", 0.5),
    pagina("/privacidad", "yearly", 0.2),
    pagina("/cookies", "yearly", 0.2),
    pagina("/terminos", "yearly", 0.2),
  ];
}
