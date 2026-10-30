"use client";

import Image from "next/image";
import { useState } from "react";
import { CATEGORIAS, type CategoriaSlug } from "@/lib/categorias";
import type { Evento } from "@/lib/eventos";
import { Icon } from "./icon";

/**
 * Cartel oficial del evento o, si no hay o no carga, una portada con el icono
 * de su categoría. Los carteles se enlazan desde la web de origen sin
 * optimizarlos: vienen de cientos de dominios distintos.
 */
export function PortadaEvento({
  imagen,
  categoria,
  variante,
}: {
  imagen: Evento["imagen"];
  categoria: CategoriaSlug;
  variante: "tarjeta" | "cabecera";
}) {
  const [fallo, setFallo] = useState(false);
  const icono = CATEGORIAS.find((c) => c.slug === categoria)!.icono;

  if (!imagen || fallo) {
    return (
      <div className="patron-cuadricula absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_50%_45%,rgba(255,106,26,.16),transparent_62%)]">
        <Icon
          name={icono}
          size={variante === "tarjeta" ? 56 : 96}
          className="text-orange drop-shadow-[0_0_18px_var(--color-glow)]"
        />
      </div>
    );
  }

  const propiedades = {
    src: imagen.url,
    unoptimized: true,
    // Algunos servidores bloquean imágenes enlazadas desde otras webs
    referrerPolicy: "no-referrer" as const,
    onError: () => setFallo(true),
  };

  if (variante === "tarjeta") {
    return (
      <Image
        {...propiedades}
        alt={imagen.alt}
        fill
        className="object-cover transition duration-500 group-hover:scale-[1.04]"
      />
    );
  }

  // Cabecera: el cartel entero, sobre una copia desenfocada que rellena el fondo
  return (
    <>
      <Image
        {...propiedades}
        alt=""
        fill
        className="scale-110 object-cover opacity-35 blur-2xl"
      />
      <Image
        {...propiedades}
        alt={imagen.alt}
        fill
        priority
        className="object-contain"
      />
    </>
  );
}
