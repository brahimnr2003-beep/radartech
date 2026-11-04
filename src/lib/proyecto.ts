// Datos generales del proyecto: responsable (páginas legales) y dirección web.
export const TITULAR = "Brahim Nouni Ros";
export const EMAIL_CONTACTO = "radartech.esp@gmail.com";
/** Última revisión de los textos legales */
export const FECHA_TEXTOS_LEGALES = "2 de noviembre de 2026";

/** Perfiles del autor y código de la web (página Sobre nosotros) */
export const URL_GITHUB = "https://github.com/brahimnr2003-beep";
export const URL_REPOSITORIO = `${URL_GITHUB}/radartech`;
export const URL_LINKEDIN =
  "https://www.linkedin.com/in/brahim-nouni-ros-data-ia/";

export const NOMBRE_WEB = "RadarTech";
export const DESCRIPCION_WEB =
  "Descubre los eventos tecnológicos más relevantes de España a través de un mapa interactivo por comunidades autónomas.";

/**
 * Dirección pública de la web, para enlaces absolutos (sitemap, imágenes al
 * compartir, datos estructurados). Vercel define la variable en cada despliegue.
 */
export const URL_WEB = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";
