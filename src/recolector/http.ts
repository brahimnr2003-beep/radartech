// Peticiones educadas: nos identificamos, con tiempo límite y sin prisas.
const USER_AGENT =
  "RadarTechBot/0.1 (+https://github.com/brahimnr2003-beep/radartech)";

async function pedir(url: string): Promise<Response> {
  const respuesta = await fetch(url, {
    headers: { "User-Agent": USER_AGENT },
    signal: AbortSignal.timeout(60_000),
  });
  if (!respuesta.ok) throw new Error(`${respuesta.status} al pedir ${url}`);
  return respuesta;
}

export const obtenerJson = async <T>(url: string): Promise<T> =>
  (await pedir(url)).json() as Promise<T>;

export const obtenerTexto = async (url: string): Promise<string> =>
  (await pedir(url)).text();

/** Pausa entre peticiones a un mismo sitio, para no sobrecargarlo. */
export const esperar = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
