import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  ListadoEventos,
  ListadoEventosInicial,
} from "@/components/listado-eventos";
import { Migas } from "@/components/migas";
import { COMUNIDADES } from "@/lib/comunidades";
import { getEventosDeComunidad } from "@/lib/eventos";

export function generateStaticParams() {
  return COMUNIDADES.map(({ slug }) => ({ comunidad: slug }));
}

function buscarComunidad(slug: string) {
  return COMUNIDADES.find((c) => c.slug === slug);
}

export async function generateMetadata({
  params,
}: PageProps<"/eventos/[comunidad]">): Promise<Metadata> {
  const comunidad = buscarComunidad((await params).comunidad);
  if (!comunidad) return {};
  return {
    title: `Eventos tecnológicos en ${comunidad.nombre} — RadarTech`,
    description: `Próximos eventos tecnológicos en ${comunidad.nombre}: conferencias, meetups, hackathons, IA, Data, Startups, Ciberseguridad y más.`,
  };
}

export default async function PaginaComunidad({
  params,
}: PageProps<"/eventos/[comunidad]">) {
  const comunidad = buscarComunidad((await params).comunidad);
  if (!comunidad) notFound();

  const eventos = getEventosDeComunidad(comunidad.slug);
  const provincias = new Set(eventos.map((e) => e.provincia));
  const destacados = eventos.filter((e) => e.destacado);

  return (
    <>
      <Migas
        enlaces={[{ href: "/", texto: "España" }]}
        actual={comunidad.nombre}
      />
      <section className="border-b border-line pt-14 pb-10">
        <div className="wrap">
          <p className="eyebrow">
            {comunidad.slug === "ceuta" || comunidad.slug === "melilla"
              ? "Ciudad autónoma"
              : "Comunidad autónoma"}
          </p>
          <h1 className="mt-3.5 text-[clamp(2rem,4vw,3rem)]">
            Eventos tecnológicos en {comunidad.nombre}
          </h1>
          <p className="mt-4 max-w-[640px] text-text-dim">
            Descubre los próximos eventos tecnológicos en {comunidad.nombre}:
            conferencias, meetups, hackathons, IA, Data, Startups,
            Ciberseguridad y mucho más.
          </p>
          <dl className="mt-7 flex flex-wrap gap-7 font-mono text-[0.8rem] text-text-dim">
            {[
              { valor: eventos.length, etiqueta: "eventos próximos" },
              { valor: provincias.size, etiqueta: "provincias con actividad" },
              { valor: destacados.length, etiqueta: "destacados" },
            ].map(({ valor, etiqueta }) => (
              <div key={etiqueta} className="flex flex-col-reverse">
                <dt>{etiqueta}</dt>
                <dd className="font-display text-[1.1rem] font-semibold text-text">
                  {valor}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
      {/* Los filtros leen la URL en el navegador; mientras, se muestra el listado completo */}
      <Suspense fallback={<ListadoEventosInicial eventos={eventos} />}>
        <ListadoEventos eventos={eventos} />
      </Suspense>
    </>
  );
}
