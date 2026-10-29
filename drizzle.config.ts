import { defineConfig } from "drizzle-kit";

// Next.js carga .env.local por su cuenta; drizzle-kit no, así que lo leemos aquí.
// En la CI no existe el archivo y DATABASE_URL llega como variable de entorno.
try {
  process.loadEnvFile(".env.local");
} catch {}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  casing: "snake_case",
  dbCredentials: { url: process.env.DATABASE_URL! },
});
