// Sentry en el entorno edge de Vercel
import * as Sentry from "@sentry/nextjs";
import { opcionesSentry } from "./lib/sentry";

Sentry.init(opcionesSentry);
