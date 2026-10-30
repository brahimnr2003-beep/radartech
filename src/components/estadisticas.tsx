"use client";

import { Analytics } from "@vercel/analytics/next";

/** Vercel Web Analytics: visitas sin cookies. No cuenta el panel de administración. */
export function Estadisticas() {
  return (
    <Analytics
      beforeSend={(evento) =>
        new URL(evento.url).pathname.startsWith("/admin") ? null : evento
      }
    />
  );
}
