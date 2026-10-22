import type { IconName } from "@/components/icon";

export const CATEGORIAS: { slug: string; nombre: string; icono: IconName }[] = [
  { slug: "ia", nombre: "IA", icono: "cpu" },
  { slug: "data", nombre: "Data", icono: "bars" },
  { slug: "software", nombre: "Software", icono: "code" },
  { slug: "cloud", nombre: "Cloud & DevOps", icono: "cloud" },
  { slug: "ciberseguridad", nombre: "Ciberseguridad", icono: "shield" },
  { slug: "startups", nombre: "Startups & Negocio", icono: "rocket" },
];
