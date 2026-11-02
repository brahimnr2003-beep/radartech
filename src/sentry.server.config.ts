// Sentry en el servidor (Node.js): páginas, Server Actions y rutas de la API
import * as Sentry from "@sentry/nextjs";
import { opcionesSentry } from "./lib/sentry";

Sentry.init(opcionesSentry);
