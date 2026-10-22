import type { Metadata } from "next";
import { Suspense } from "react";
import {
  ListadoEventos,
  ListadoEventosInicial,
} from "@/components/listado-eventos";
import { Migas } from "@/components/migas";
import { getEventos } from "@/lib/eventos";

export const metadata: Metadata = {
  title: "Todos los eventos tecnológicos de España — RadarTech",
  description:
    "Todos los próximos eventos tecnológicos de España en un solo listado: filtra por comunidad, ubicación, fecha, categoría, modalidad, precio y tipo de evento.",
};

export default function PaginaEventos() {
  const eventos = getEventos();
  const comunidades = new Set(eventos.map((e) => e.comunidad));
  const destacados = eventos.filter((e) => e.destacado);

  return (
    <>
      <Migas enlaces={[{ href: "/", texto: "España" }]} actual="Eventos" />
      <section className="border-b border-line pt-14 pb-10">
        <div className="wrap">
          <p className="eyebrow">Toda España</p>
          <h1 className="mt-3.5 text-[clamp(2rem,4vw,3rem)]">
            Todos los eventos tecnológicos
          </h1>
          <p className="mt-4 max-w-[640px] text-text-dim">
            Conferencias, meetups, hackathons y talleres de IA, Data, Software,
            Cloud, Ciberseguridad y Startups en todas las comunidades. Usa los
            filtros para encontrar el tuyo.
          </p>
          <dl className="mt-7 flex flex-wrap gap-7 font-mono text-[0.8rem] text-text-dim">
            {[
              { valor: eventos.length, etiqueta: "eventos próximos" },
              {
                valor: comunidades.size,
                etiqueta: "comunidades con actividad",
              },
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
      <Suspense
        fallback={<ListadoEventosInicial eventos={eventos} conComunidad />}
      >
        <ListadoEventos eventos={eventos} conComunidad />
      </Suspense>
    </>
  );
}
