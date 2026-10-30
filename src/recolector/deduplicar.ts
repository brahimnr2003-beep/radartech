import type { EventoBruto, NombreFuente } from "./tipos";

/** Ante un duplicado se queda la fuente más completa y se rellenan huecos con las demás. */
const PRIORIDAD: Record<NombreFuente, number> = {
  "eventos.wiki": 0,
  "agenda-tech": 1,
  "confs.tech": 2,
};

/** Palabras que no ayudan a distinguir eventos */
const RELLENO = new Set(["de", "la", "el", "en", "y", "the", "of", "conf"]);

/** «PyConES Barcelona 2026» → {"pycones", "barcelona"} */
function palabras(nombre: string): Set<string> {
  return new Set(
    nombre
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, " ")
      .split(" ")
      .filter((p) => p && !/^\d+$/.test(p) && !RELLENO.has(p)),
  );
}

/** Mismo día de inicio y nombres equivalentes (uno contiene al otro o comparten la mayoría de palabras). */
type Comparable = Pick<EventoBruto, "nombre" | "inicio">;

export function sonElMismoEvento(a: Comparable, b: Comparable): boolean {
  if (a.inicio.slice(0, 10) !== b.inicio.slice(0, 10)) return false;
  const pa = palabras(a.nombre);
  const pb = palabras(b.nombre);
  const comunes = [...pa].filter((p) => pb.has(p)).length;
  const menor = Math.min(pa.size, pb.size);
  const union = pa.size + pb.size - comunes;
  return (menor > 0 && comunes === menor) || comunes / union >= 0.5;
}

/** Junta los eventos repetidos entre fuentes. */
export function deduplicar(eventos: EventoBruto[]): EventoBruto[] {
  const ordenados = [...eventos].sort(
    (a, b) => PRIORIDAD[a.fuente] - PRIORIDAD[b.fuente],
  );
  const unicos: EventoBruto[] = [];
  for (const evento of ordenados) {
    const principal = unicos.find((u) => sonElMismoEvento(u, evento));
    if (!principal) {
      unicos.push({ ...evento });
      continue;
    }
    // Completa los datos que falten sin pisar los de la fuente principal
    for (const [clave, valor] of Object.entries(evento)) {
      const k = clave as keyof EventoBruto;
      if (principal[k] === undefined && valor !== undefined) {
        (principal as Record<string, unknown>)[k] = valor;
      }
    }
    // Una web oficial es mejor enlace que la ficha de otra agenda
    if (esAgregador(principal.url) && !esAgregador(evento.url)) {
      principal.url = evento.url;
    }
  }
  return unicos;
}

const esAgregador = (url: string) =>
  /eventos\.wiki|agenda-tech\.h1756\.es|confs\.tech/.test(url);
