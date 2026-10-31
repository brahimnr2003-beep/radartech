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

export default nextConfig;
