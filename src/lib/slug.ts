/** «PyConES Barcelona 2026» → «pycones-barcelona-2026» */
export function crearSlug(nombre: string, año: string): string {
  const base = nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  // El año distingue ediciones distintas del mismo evento
  return base.includes(año) ? base : `${base}-${año}`;
}
