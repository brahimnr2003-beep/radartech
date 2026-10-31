import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Compartir } from "@/components/compartir";
import { Icon, type IconName } from "@/components/icon";
import { Migas } from "@/components/migas";
import { PortadaEvento } from "@/components/portada-evento";
import { EtiquetaCategoria } from "@/components/tarjeta-evento";
import { nombreCategoria } from "@/lib/categorias";
import { COMUNIDADES } from "@/lib/comunidades";
import { getEvento, getSlugsEventos } from "@/lib/consultas";
import { MODALIDADES, formatearFechas, formatearPrecio } from "@/lib/eventos";
import { datosEstructuradosEvento, jsonLd } from "@/lib/seo";

export async function generateStaticParams() {
  const slugs = await getSlugsEventos();
  // Con Cache Components debe haber al menos uno; con la base de datos vacía,
  // un valor de relleno que la página resuelve con notFound()
  return slugs.length > 0
    ? slugs.map((slug) => ({ slug }))
    : [{ slug: "__sin-eventos__" }];
}

export async function generateMetadata({
  params,
}: PageProps<"/evento/[slug]">): Promise<Metadata> {
  const evento = await getEvento((await params).slug);
  if (!evento) return {};
  return {
    title: evento.nombre,
    description: evento.descripcion,
    alternates: { canonical: `/evento/${evento.slug}` },
  };
}

export default async function PaginaEvento({
  params,
}: PageProps<"/evento/[slug]">) {
  const evento = await getEvento((await params).slug);
  if (!evento) notFound();

  const comunidad = COMUNIDADES.find((c) => c.slug === evento.comunidad)!;
  const categoria = nombreCategoria(evento.categoria);

  const datos: { icono: IconName; texto: string }[] = [
    {
      icono: "calendar",
      texto: [formatearFechas(evento.fecha, evento.fechaFin), evento.hora]
        .filter(Boolean)
        .join(" · "),
    },
    { icono: "pin", texto: `${evento.ciudad}, ${comunidad.nombre}` },
    { icono: "tag", texto: categoria },
    { icono: "monitor", texto: MODALIDADES[evento.modalidad] },
  ];

  const ficha: [etiqueta: string, valor: string | undefined][] = [
    ["Precio", formatearPrecio(evento.precioDesde)],
    ["Modalidad", MODALIDADES[evento.modalidad]],
    ["Organizador", evento.organizador],
    ["Lugar", evento.lugar],
    ["Ciudad", evento.ciudad],
    ["Provincia", evento.provincia],
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(datosEstructuradosEvento(evento)),
        }}
      />
      <Migas
        enlaces={[
          { href: "/", texto: "España" },
          { href: `/eventos/${comunidad.slug}`, texto: comunidad.nombre },
        ]}
        actual={evento.nombre}
      />
      <div className="wrap">
        <div className="relative mt-[26px] mb-8 flex aspect-[4/5] items-end overflow-hidden rounded-lg border border-line bg-bg-2 p-[18px] [--tamano-cuadricula:28px] sm:aspect-[21/8] sm:p-7">
          <PortadaEvento
            imagen={evento.imagen}
            categoria={evento.categoria}
            variante="cabecera"
          />
          <EtiquetaCategoria>{categoria}</EtiquetaCategoria>
        </div>

        <div className="grid items-start gap-12 pb-[100px] min-[901px]:grid-cols-[1fr_320px]">
          <article>
            <h1 className="mb-[18px] text-[clamp(1.9rem,3.6vw,2.7rem)]">
              {evento.nombre}
            </h1>
            <ul className="mb-9 flex flex-wrap gap-6 border-b border-line pb-7 font-mono text-[0.84rem] text-text-dim">
              {datos.map(({ icono, texto }) => (
                <li key={icono} className="flex items-center gap-2">
                  <Icon name={icono} size={15} className="text-orange" />
                  {texto}
                </li>
              ))}
            </ul>
            <h2 className="mt-[34px] mb-3.5 text-[1.2rem]">Sobre el evento</h2>
            <p className="mb-3.5 text-text-dim">{evento.descripcion}</p>
            {evento.ponentes && evento.ponentes.length > 0 && (
              <>
                <h2 className="mt-[34px] mb-3.5 text-[1.2rem]">Ponentes</h2>
                <ul className="mt-1.5 flex flex-wrap gap-3.5">
                  {evento.ponentes.map(({ nombre, cargo }) => (
                    <li
                      key={nombre}
                      className="min-w-[170px] rounded-md border border-line px-[18px] py-3.5"
                    >
                      <b className="block font-display text-[0.95rem] font-semibold">
                        {nombre}
                      </b>
                      <span className="font-mono text-[0.74rem] text-text-faint">
                        {cargo}
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </article>

          <aside className="flex flex-col gap-4 min-[901px]:sticky min-[901px]:top-[100px]">
            <div className="rounded-md border border-line bg-bg-1 p-6">
              <dl>
                {ficha
                  .filter(([, valor]) => valor)
                  .map(([etiqueta, valor]) => (
                    <div
                      key={etiqueta}
                      className="flex justify-between gap-4 border-b border-line py-3 text-[0.86rem] last:border-b-0"
                    >
                      <dt className="font-mono text-[0.76rem] text-text-faint uppercase">
                        {etiqueta}
                      </dt>
                      <dd className="text-right">{valor}</dd>
                    </div>
                  ))}
              </dl>
              <a
                href={evento.urlOficial}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary mt-[18px] w-full justify-center"
              >
                Ver evento oficial <Icon name="link" size={14} />
              </a>
              <p className="mt-1.5 text-[0.78rem] text-text-faint">
                Serás redirigido a la fuente oficial del organizador para
                completar tu inscripción.
              </p>
              {evento.fuente && (
                <p className="mt-3 border-t border-line pt-3 font-mono text-[0.72rem] text-text-faint">
                  Fuente:{" "}
                  <a
                    href={evento.fuente.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-dim underline-offset-2 hover:text-orange-bright hover:underline"
                  >
                    {evento.fuente.nombre}
                  </a>
                </p>
              )}
            </div>
            <div className="rounded-md border border-line bg-bg-1 p-6">
              <span className="font-mono text-[0.76rem] text-text-faint">
                COMPARTIR
              </span>
              <Compartir titulo={evento.nombre} />
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
