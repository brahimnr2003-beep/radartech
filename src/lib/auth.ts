// Inicio de sesión del panel de administración: GitHub vía Better Auth.
// Solo en el servidor.
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { headers } from "next/headers";
import { db } from "@/db";
import { account, session, user, verification } from "@/db/schema";

/** Email de la cuenta de GitHub del administrador (variable de entorno). */
const esAdministrador = (email: string | undefined | null) =>
  !!email &&
  !!process.env.ADMIN_EMAIL &&
  email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase();

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { user, session, account, verification },
  }),
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    },
  },
  databaseHooks: {
    user: {
      create: {
        // Nadie más puede crearse una cuenta: devolver false cancela el registro
        before: async (nuevo) => esAdministrador(nuevo.email),
      },
    },
  },
  // Guarda la cookie de sesión también desde Server Actions
  plugins: [nextCookies()],
});

/** Administrador con sesión iniciada, o null. */
export async function getAdministrador() {
  const sesion = await auth.api.getSession({ headers: await headers() });
  return sesion && esAdministrador(sesion.user.email) ? sesion.user : null;
}

/** Para Server Actions: corta si quien llama no es el administrador. */
export async function exigirAdministrador() {
  const admin = await getAdministrador();
  if (!admin) throw new Error("No autorizado");
  return admin;
}
