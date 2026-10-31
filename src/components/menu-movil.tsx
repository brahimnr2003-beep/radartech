"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Icon } from "./icon";

/** Menú desplegable de la cabecera para pantallas de menos de 900 px. */
export function MenuMovil({
  enlaces,
}: {
  enlaces: { href: string; label: string }[];
}) {
  const [abierto, setAbierto] = useState(false);
  const contenedor = useRef<HTMLDivElement>(null);

  // Se cierra con Escape o al tocar fuera del menú
  useEffect(() => {
    if (!abierto) return;
    const alPulsarTecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAbierto(false);
    };
    const alTocarFuera = (e: PointerEvent) => {
      if (!contenedor.current?.contains(e.target as Node)) setAbierto(false);
    };
    document.addEventListener("keydown", alPulsarTecla);
    document.addEventListener("pointerdown", alTocarFuera);
    return () => {
      document.removeEventListener("keydown", alPulsarTecla);
      document.removeEventListener("pointerdown", alTocarFuera);
    };
  }, [abierto]);

  return (
    <div ref={contenedor} className="min-[900px]:hidden">
      <button
        type="button"
        aria-expanded={abierto}
        aria-controls="menu-movil"
        aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
        onClick={() => setAbierto(!abierto)}
        className="flex size-10 items-center justify-center rounded-full border border-line-strong text-text transition-colors hover:border-orange"
      >
        <Icon name={abierto ? "cerrar" : "menu"} size={18} />
      </button>
      {abierto && (
        <ul
          id="menu-movil"
          className="absolute inset-x-0 top-full border-b border-line bg-bg/96 px-5 py-3 backdrop-blur-[14px] sm:px-8"
        >
          {enlaces.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                onClick={() => setAbierto(false)}
                className="block border-b border-line py-3.5 font-display text-[1.05rem] text-text-dim last:border-b-0 hover:text-orange-bright"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
