// Next.js lo ejecuta al arrancar el servidor: carga Sentry según el entorno
import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

// Errores de Server Components, Server Actions y rutas
export const onRequestError = Sentry.captureRequestError;
