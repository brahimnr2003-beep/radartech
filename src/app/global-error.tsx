"use client";

// Se muestra si falla el propio layout: sustituye a toda la página, así que
// lleva su propio <html> y avisa a Sentry del error.
import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import "./globals.css";

export default function ErrorGeneral({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="es">
      <body className="flex min-h-screen flex-col">
        <main className="wrap flex flex-1 flex-col items-start justify-center gap-6 py-24">
          <p className="eyebrow">Error</p>
          <h1 className="text-[clamp(2rem,4vw,3rem)]">Algo ha fallado</h1>
          <p className="max-w-[520px] text-text-dim">
            Hemos recibido el aviso y lo revisaremos. Prueba a cargar la página
            de nuevo dentro de un momento.
          </p>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={reset} className="btn btn-primary">
              Reintentar
            </button>
            {/* Enlace normal: si el layout ha fallado, mejor recargar entero */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/" className="btn btn-ghost">
              Volver al mapa
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
