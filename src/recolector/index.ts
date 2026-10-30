// Recolector de eventos: lee las fuentes aprobadas, quita repetidos, clasifica
// con Gemini los nuevos y los guarda. Uso: npm run recolectar
import { eq, gte, sql } from "drizzle-orm";
import { db } from "../db";
import { ejecucionesRecolector, eventos } from "../db/schema";
import { hoyEnEspana } from "../lib/eventos";
import { crearSlug } from "../lib/slug";
import { clasificar } from "./clasificar";
import { deduplicar, sonElMismoEvento } from "./deduplicar";
import { leerAgendaTech } from "./fuentes/agenda-tech";
import { leerConfsTech } from "./fuentes/confs-tech";
import { leerEventosWiki } from "./fuentes/eventos-wiki";
import { esperar } from "./http";
import type { EventoBruto, NombreFuente } from "./tipos";

const FUENTES: Record<NombreFuente, (desde: string) => Promise<EventoBruto[]>> =
  {
    "eventos.wiki": leerEventosWiki,
    "agenda-tech": leerAgendaTech,
    "confs.tech": leerConfsTech,
  };

/** «2026-11-06T15:30:00» → «15:30»; sin hora o a medianoche, nada */
function horaDe(inicio: string): string | undefined {
  const hora = inicio.slice(11, 16);
  return hora && hora !== "00:00" ? hora : undefined;
}

async function main() {
  const inicio = new Date();
  const desde = hoyEnEspana();

  // 1. Leer todas las fuentes; si una falla, se sigue con las demás
  const leidosPorFuente: Record<string, number> = {};
  const errores: Record<string, string> = {};
  const brutos: EventoBruto[] = [];
  for (const [nombre, leer] of Object.entries(FUENTES)) {
    try {
      const leidos = await leer(desde);
      leidosPorFuente[nombre] = leidos.length;
      brutos.push(...leidos);
    } catch (error) {
      errores[nombre] = String(error);
      console.error(`✗ ${nombre}: ${error}`);
    }
  }
  const unicos = deduplicar(brutos);

  // 2. Descartar los que ya están en la base de datos (por id o por nombre y fecha)
  const existentes = await db
    .select({
      id: eventos.id,
      idExterno: eventos.idExterno,
      nombre: eventos.nombre,
      fecha: eventos.fecha,
      imagenUrl: eventos.imagenUrl,
    })
    .from(eventos)
    .where(gte(sql`coalesce(${eventos.fechaFin}, ${eventos.fecha})`, desde));
  const slugsUsados = new Set(
    (await db.select({ slug: eventos.slug }).from(eventos)).map((e) => e.slug),
  );
  const nuevos: EventoBruto[] = [];
  let carteles = 0;
  for (const u of unicos) {
    const conocido = existentes.find(
      (e) =>
        e.idExterno === u.idExterno ||
        sonElMismoEvento(u, { ...u, nombre: e.nombre, inicio: e.fecha }),
    );
    if (!conocido) {
      nuevos.push(u);
    } else if (!conocido.imagenUrl && u.imagen) {
      // Si la fuente ha añadido el cartel después, se completa
      await db
        .update(eventos)
        .set({ imagenUrl: u.imagen.url, imagenAlt: u.imagen.alt })
        .where(eq(eventos.id, conocido.id));
      carteles++;
    }
  }
  console.log(
    `Leídos ${brutos.length}, únicos ${unicos.length}, nuevos ${nuevos.length}, carteles añadidos ${carteles}.`,
  );

  // 3. Clasificar y guardar los nuevos
  let publicados = 0;
  let descartados = 0;
  for (const evento of nuevos) {
    try {
      const c = await clasificar(evento);
      const valido = c.esEventoTech && c.comunidad !== null;
      const fecha = evento.inicio.slice(0, 10);
      let slug = crearSlug(evento.nombre, fecha.slice(0, 4));
      if (slugsUsados.has(slug)) slug = `${slug}-${fecha}`;
      slugsUsados.add(slug);

      await db.insert(eventos).values({
        slug,
        nombre: evento.nombre,
        descripcion: c.resumen,
        fecha,
        fechaFin: evento.fin?.slice(0, 10),
        hora: horaDe(evento.inicio),
        // Los descartados se guardan para no volver a clasificarlos
        comunidad: c.comunidad ?? "madrid",
        provincia: c.provincia,
        ciudad: c.ciudad,
        lugar: evento.lugar,
        categoria: c.categoria,
        tipo: c.tipo,
        modalidad: evento.modalidad ?? c.modalidad,
        precioDesde: evento.precioDesde ?? null,
        organizador: evento.organizador,
        urlOficial: evento.url,
        imagenUrl: evento.imagen?.url,
        imagenAlt: evento.imagen?.alt,
        // Fuentes aprobadas por el administrador: se publican directamente
        estado: valido ? "aprobado" : "rechazado",
        origen: "ia",
        fuente: evento.fuente,
        urlFuente: evento.urlFuente,
        idExterno: evento.idExterno,
        motivoClasificacion: c.motivo,
      });
      if (valido) publicados++;
      else descartados++;
      console.log(`${valido ? "✓" : "·"} ${evento.nombre}`);
    } catch (error) {
      console.error(`✗ ${evento.nombre}: ${error}`);
    }
    // Margen para no superar el límite por minuto del plan gratuito
    await esperar(4000);
  }

  // 4. Métricas de la ejecución
  await db.insert(ejecucionesRecolector).values({
    inicio,
    duracionMs: Date.now() - inicio.getTime(),
    leidosPorFuente,
    errores,
    unicos: unicos.length,
    yaConocidos: unicos.length - nuevos.length,
    publicados,
    descartados,
  });
  console.log(`Publicados ${publicados}, descartados ${descartados}.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => process.exit());
