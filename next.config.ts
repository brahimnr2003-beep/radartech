import { withSentryConfig } from "@sentry/nextjs/config";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  // Solo en desarrollo: permite abrir la web local desde otro dispositivo de
  // la red (p. ej. el móvil). Se configura en .env.local, separado por comas.
  allowedDevOrigins: process.env.ORIGENES_DESARROLLO?.split(",")
    .map((origen) => origen.trim())
    .filter(Boolean),
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default withSentryConfig(nextConfig, {
  // Organización y proyecto de Sentry: no son secretos, van en Vercel
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  // Secreto: permite subir los source maps para ver el código original en
  // los errores. Sin él (en local y en la CI) simplemente no se suben.
  authToken: process.env.SENTRY_AUTH_TOKEN,
  sentryUrl: process.env.SENTRY_URL,
  widenClientFileUpload: true,
  // Envía los errores a través de la propia web: los bloqueadores de
  // anuncios no los interceptan
  tunnelRoute: "/monitorizacion",
  silent: !process.env.CI,
  telemetry: false,
});
