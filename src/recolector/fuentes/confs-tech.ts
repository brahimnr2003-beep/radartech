// confs.tech mantiene sus conferencias en GitHub, un JSON por año y tema.
// Licencia: MIT.
import { obtenerJson } from "../http";
import type { EventoBruto } from "../tipos";

const REPO = "tech-conferences/conference-data";

type Conferencia = {
  name: string;
  url: string;
  startDate: string;
  endDate?: string;
  city?: string;
  country?: string;
  online?: boolean;
};

export async function leerConfsTech(desde: string): Promise<EventoBruto[]> {
  const año = Number(desde.slice(0, 4));
  const porClave = new Map<string, EventoBruto>();

  for (const a of [año, año + 1]) {
    const archivos = await obtenerJson<{ name: string }[]>(
      `https://api.github.com/repos/${REPO}/contents/conferences/${a}`,
    ).catch(() => []); // El año siguiente puede no existir aún
    for (const { name: archivo } of archivos) {
      const tema = archivo.replace(/\.json$/, "");
      const conferencias = await obtenerJson<Conferencia[]>(
        `https://raw.githubusercontent.com/${REPO}/main/conferences/${a}/${archivo}`,
      );
      for (const c of conferencias) {
        if (c.country !== "Spain" || (c.endDate ?? c.startDate) < desde) {
          continue;
        }
        // La misma conferencia aparece en varios temas: se juntan
        const clave = `${c.name}:${c.startDate}`;
        const existente = porClave.get(clave);
        if (existente) {
          existente.etiquetas?.push(tema);
          continue;
        }
        porClave.set(clave, {
          fuente: "confs.tech",
          idExterno: `confs.tech:${clave}`,
          nombre: c.name,
          inicio: c.startDate,
          fin: c.endDate,
          modalidad: c.online ? (c.city ? "hibrido" : "online") : "presencial",
          ciudad: c.city,
          url: c.url,
          urlFuente: "https://confs.tech/",
          etiquetas: [tema],
        });
      }
    }
  }
  return [...porClave.values()];
}
