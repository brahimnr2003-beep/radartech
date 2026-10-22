"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { COMUNIDADES, type ComunidadSlug } from "@/lib/comunidades";
import { MAPA_VIEWBOX, TRAZADOS } from "./trazados";

type Tooltip = { nombre: string; eventos: number; x: number; y: number };

export function MapaEspana({
  eventos,
}: {
  eventos: Record<ComunidadSlug, number>;
}) {
  const router = useRouter();
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);
  const maximo = Math.max(1, ...Object.values(eventos));

  const ir = (slug: ComunidadSlug) => router.push(`/eventos/${slug}`);

  return (
    <>
      <svg
        viewBox={MAPA_VIEWBOX}
        className="block h-auto w-full"
        role="group"
        aria-label="Mapa interactivo de España por comunidades autónomas"
      >
        {COMUNIDADES.map(({ slug, nombre }) => (
          <path
            key={slug}
            d={TRAZADOS[slug].d}
            className="map-region"
            role="link"
            tabIndex={0}
            aria-label={`${nombre}, ${eventos[slug]} eventos`}
            onClick={() => ir(slug)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                ir(slug);
              }
            }}
            onMouseMove={(e) =>
              setTooltip({
                nombre,
                eventos: eventos[slug],
                x: e.clientX,
                y: e.clientY,
              })
            }
            onMouseLeave={() => setTooltip(null)}
          />
        ))}
        <g className="pointer-events-none">
          {COMUNIDADES.map(({ slug }) => {
            const { cx, cy } = TRAZADOS[slug];
            // Más eventos = señal más grande (relativa a la comunidad con más eventos)
            const r = 2 + (5 * eventos[slug]) / maximo;
            return (
              <g key={slug}>
                <circle className="map-blip-ring" cx={cx} cy={cy} r={r} />
                <circle
                  className="fill-orange opacity-85"
                  cx={cx}
                  cy={cy}
                  r={Math.max(2, r * 0.55)}
                />
              </g>
            );
          })}
        </g>
      </svg>
      {tooltip && (
        <div
          role="tooltip"
          className="pointer-events-none fixed z-200 rounded-sm border border-orange bg-bg-2 px-3.5 py-2.5 font-mono text-[0.78rem] whitespace-nowrap shadow-[0_8px_30px_rgba(0,0,0,.5),0_0_20px_var(--color-glow)]"
          style={{ left: tooltip.x + 16, top: tooltip.y + 16 }}
        >
          <b className="mb-0.5 block font-display text-[0.95rem] font-semibold text-text">
            {tooltip.nombre}
          </b>
          <span className="text-orange-bright">
            {tooltip.eventos} eventos próximos
          </span>
        </div>
      )}
    </>
  );
}
