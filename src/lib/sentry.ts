// Opciones comunes de Sentry (navegador, servidor y edge). Solo se activa en
// producción y si hay DSN: en local y en la CI no envía nada.
import type * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

export const opcionesSentry = {
  dsn,
  enabled: process.env.NODE_ENV === "production" && !!dsn,
  // Rendimiento: una de cada diez visitas, suficiente para ver tendencias
  tracesSampleRate: 0.1,
  // Privacidad: solo el error y su contexto técnico, nada que identifique a
  // quien visita (ni IP, ni cookies, ni el email del formulario)
  dataCollection: {
    userInfo: false,
    cookies: false,
    httpHeaders: false,
    httpBodies: [],
    genAI: { inputs: false, outputs: false },
  },
} satisfies Sentry.BrowserOptions & Sentry.NodeOptions;
