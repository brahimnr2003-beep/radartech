// Sentry en el navegador: errores de la parte interactiva (mapa, filtros, formularios)
import * as Sentry from "@sentry/nextjs";
import { opcionesSentry } from "./lib/sentry";

Sentry.init(opcionesSentry);

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
