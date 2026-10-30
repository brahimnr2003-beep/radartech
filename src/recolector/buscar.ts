// Búsqueda de eventos en internet (Tavily + Gemini) para completar el mapa.
// Todo entra como pendiente de revisión.
// Uso: npm run buscar               → mantenimiento: las 4 comunidades con menos eventos
//      npm run buscar -- --inicial  → todas las comunidades, con varios enfoques
import { gte, sql } from "drizzle-orm";
import { db } from "../db";
import { ejecucionesRecolector, eventos } from "../db/schema";
import { COMUNIDADES } from "../lib/comunidades";
import { hoyEnEspana } from "../lib/eventos";
import { crearSlug } from "../lib/slug";
import {
  buscarEnInternet,
  buscarWebOficial,
  estructurar,
  type Enfoque,
  type EventoEncontrado,
} from "./busqueda-ia";
import { sonElMismoEvento } from "./deduplicar";
import { esperar, existeEnlace } from "./http";

const FUENTE = "Búsqueda IA";
const COMUNIDADES_MANTENIMIENTO = 4;
/** Margen entre llamadas para no superar el límite por minuto del plan gratuito */
const PAUSA_MS = 4000;

/** «https://www.Ejemplo.es/evento/?utm=x» → «ejemplo.es/evento» */
const normalizarUrl = (url: string) => {
  const u = new URL(url);
  return `${u.hostname.replace(/^www\./, "")}${u.pathname.replace(/\/$/, "")}`.toLowerCase();
};

/** Dominio sin «www.»: dos eventos el mismo día en la misma web son el mismo */
const dominio = (url: string) => new URL(url).hostname.replace(/^www\./, "");

async function main() {
  if (!process.env.TAVILY_API_KEY) {
    throw new Error("Falta TAVILY_API_KEY (clave de https://tavily.com)");
  }
  const inicio = new Date();
  const hoy = hoyEnEspana();
  const inicial = process.argv.includes("--inicial");

  // Eventos vigentes ya conocidos, en cualquier estado: no se vuelven a añadir
  const conocidos = await db
    .select({
      nombre: eventos.nombre,
      inicio: eventos.fecha,
      comunidad: eventos.comunidad,
      estado: eventos.estado,
      urlOficial: eventos.urlOficial,
    })
    .from(eventos)
    .where(gte(sql`coalesce(${eventos.fechaFin}, ${eventos.fecha})`, hoy));

  // Qué buscar: todo en el modo inicial; si no, las comunidades con menos eventos
  let busquedas: {
    comunidad: (typeof COMUNIDADES)[number];
    enfoque: Enfoque;
  }[];
  if (inicial) {
    const enfoques: Enfoque[] = ["conferencias", "comunidades", "practicos"];
    busquedas = COMUNIDADES.flatMap((comunidad) =>
      enfoques.map((enfoque) => ({ comunidad, enfoque })),
    );
  } else {
    const visibles = conocidos.filter((c) => c.estado !== "rechazado");
    const total = (slug: string) =>
      visibles.filter((c) => c.comunidad === slug).length;
    busquedas = [...COMUNIDADES]
      .sort((a, b) => total(a.slug) - total(b.slug))
      .slice(0, COMUNIDADES_MANTENIMIENTO)
      .map((comunidad) => ({ comunidad, enfoque: "general" as const }));
  }
  console.log(
    `Modo ${inicial ? "inicial" : "mantenimiento"}: ${busquedas.length} búsquedas.`,
  );

  const slugsUsados = new Set(
    (await db.select({ slug: eventos.slug }).from(eventos)).map((e) => e.slug),
  );
  const errores: Record<string, string> = {};
  let encontrados = 0;
  let repetidos = 0;
  let pendientes = 0;
  let descartados = 0;

  for (const { comunidad, enfoque } of busquedas) {
    let resultados: EventoEncontrado[];
    try {
      const paginas = await buscarEnInternet(comunidad.nombre, enfoque, hoy);
      resultados = await estructurar(paginas, comunidad.nombre, hoy);
      await esperar(PAUSA_MS);
    } catch (error) {
      errores[`${comunidad.slug}/${enfoque}`] = String(error);
      console.error(`✗ ${comunidad.nombre} (${enfoque}): ${error}`);
      await esperar(PAUSA_MS);
      continue;
    }
    encontrados += resultados.length;
    console.log(
      `${comunidad.nombre} (${enfoque}): ${resultados.length} encontrados`,
    );

    for (const e of resultados) {
      const fin = e.fechaFin ?? e.fecha;
      const mismoNombre = conocidos.some((c) =>
        sonElMismoEvento({ nombre: e.nombre, inicio: e.fecha }, c),
      );
      if (fin < hoy || mismoNombre) {
        repetidos++;
        continue;
      }

      // Solo se publican fuentes primarias: si el evento salió en una agenda,
      // se busca su web oficial (1 crédito); los que no son tech no gastan nada
      const esTech = e.esEventoTech && e.comunidad !== null;
      let url = e.urlOficial;
      if (esTech && !url) {
        url = await buscarWebOficial(e.nombre, e.fecha);
        await esperar(1000);
      }
      const sinWebOficial = esTech && !url;
      url ??= e.urlEncontrado;

      if (
        conocidos.some(
          (c) => c.inicio === e.fecha && dominio(c.urlOficial) === dominio(url),
        )
      ) {
        repetidos++;
        continue;
      }
      // La IA a veces se inventa enlaces: si la página no existe, se ignora
      if (esTech && !sinWebOficial && !(await existeEnlace(url))) {
        console.log(`  · enlace roto, ignorado: ${e.nombre}`);
        descartados++;
        continue;
      }

      // Sin web oficial se guarda como descartado: así no se vuelve a buscar
      const valido = esTech && !sinWebOficial;
      const motivo = sinWebOficial
        ? `Sin web oficial: solo aparece en agendas como ${e.urlEncontrado}`
        : e.motivo;
      let slug = crearSlug(e.nombre, e.fecha.slice(0, 4));
      if (slugsUsados.has(slug)) slug = `${slug}-${e.fecha}`;
      if (slugsUsados.has(slug))
        slug = `${slug}-${crypto.randomUUID().slice(0, 6)}`;

      const insertado = await db
        .insert(eventos)
        .values({
          slug,
          nombre: e.nombre,
          descripcion: e.resumen,
          fecha: e.fecha,
          fechaFin: e.fechaFin,
          hora: e.hora,
          comunidad: e.comunidad ?? comunidad.slug,
          provincia: e.provincia,
          ciudad: e.ciudad,
          lugar: e.lugar,
          categoria: e.categoria,
          tipo: e.tipo,
          modalidad: e.modalidad,
          precioDesde: e.precioDesde,
          organizador: e.organizador,
          urlOficial: url,
          // No viene de una fuente aprobada: siempre se revisa a mano
          estado: valido ? "pendiente" : "rechazado",
          origen: "ia",
          fuente: FUENTE,
          idExterno: `busqueda-ia:${normalizarUrl(url)}#${e.fecha}`,
          motivoClasificacion: `${motivo} (buscando ${enfoque} en ${comunidad.nombre})`,
        })
        .onConflictDoNothing()
        .returning({ id: eventos.id });

      if (insertado.length === 0) {
        repetidos++;
        continue;
      }
      slugsUsados.add(slug);
      conocidos.push({
        nombre: e.nombre,
        inicio: e.fecha,
        comunidad: e.comunidad ?? comunidad.slug,
        estado: valido ? "pendiente" : "rechazado",
        urlOficial: url,
      });
      if (valido) pendientes++;
      else descartados++;
      console.log(
        `  ${valido ? "✓" : sinWebOficial ? "· sin web oficial:" : "·"} ${e.nombre} (${e.fecha})`,
      );
    }
  }

  await db.insert(ejecucionesRecolector).values({
    inicio,
    duracionMs: Date.now() - inicio.getTime(),
    leidosPorFuente: { [FUENTE]: encontrados },
    errores,
    unicos: encontrados - repetidos,
    yaConocidos: repetidos,
    // En la búsqueda IA, «publicados» son los que quedan pendientes de revisión
    publicados: pendientes,
    descartados,
  });
  console.log(
    `Encontrados ${encontrados}, ya conocidos ${repetidos}, pendientes de revisar ${pendientes}, descartados ${descartados}.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => process.exit());
