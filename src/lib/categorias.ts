import type { IconName } from "@/components/icon";

export const CATEGORIAS = [
  { slug: "ia", nombre: "IA", icono: "cpu" },
  { slug: "data", nombre: "Data", icono: "bars" },
  { slug: "software", nombre: "Software", icono: "code" },
  { slug: "cloud", nombre: "Cloud & DevOps", icono: "cloud" },
  { slug: "ciberseguridad", nombre: "Ciberseguridad", icono: "shield" },
  { slug: "startups", nombre: "Startups & Negocio", icono: "rocket" },
] as const satisfies readonly {
  slug: string;
  nombre: string;
  icono: IconName;
}[];

export type CategoriaSlug = (typeof CATEGORIAS)[number]["slug"];

export function nombreCategoria(slug: CategoriaSlug): string {
  return CATEGORIAS.find((c) => c.slug === slug)!.nombre;
}
