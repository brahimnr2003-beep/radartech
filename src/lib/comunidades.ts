// Comunidades y ciudades autónomas. El slug forma la URL: /eventos/{slug}
export const COMUNIDADES = [
  { slug: "andalucia", nombre: "Andalucía" },
  { slug: "aragon", nombre: "Aragón" },
  { slug: "asturias", nombre: "Asturias" },
  { slug: "baleares", nombre: "Islas Baleares" },
  { slug: "canarias", nombre: "Canarias" },
  { slug: "cantabria", nombre: "Cantabria" },
  { slug: "castilla-la-mancha", nombre: "Castilla-La Mancha" },
  { slug: "castilla-y-leon", nombre: "Castilla y León" },
  { slug: "cataluna", nombre: "Cataluña" },
  { slug: "ceuta", nombre: "Ceuta" },
  { slug: "extremadura", nombre: "Extremadura" },
  { slug: "galicia", nombre: "Galicia" },
  { slug: "la-rioja", nombre: "La Rioja" },
  { slug: "madrid", nombre: "Madrid" },
  { slug: "melilla", nombre: "Melilla" },
  { slug: "murcia", nombre: "Murcia" },
  { slug: "navarra", nombre: "Navarra" },
  { slug: "pais-vasco", nombre: "País Vasco" },
  { slug: "valencia", nombre: "C. Valenciana" },
] as const;

export type ComunidadSlug = (typeof COMUNIDADES)[number]["slug"];
