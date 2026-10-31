import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/icon";
import { MapaEspana } from "@/components/mapa/mapa-espana";
import { CATEGORIAS } from "@/lib/categorias";
import { COMUNIDADES } from "@/lib/comunidades";
import { contarEventosPorComunidad } from "@/lib/consultas";
import { datosEstructuradosWeb, jsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const PASOS = [
  {
    titulo: "Explora el mapa",
    texto:
      "Recorre España y detecta dónde está pasando algo en tecnología ahora mismo.",
  },
  {
    titulo: "Filtra por interés",
    texto:
      "Afina por categoría, fecha, ciudad, modalidad o precio hasta encontrar tu evento.",
  },
  {
    titulo: "Descubre y asiste",
    texto:
      "Accede a la fuente oficial del evento y resérvate tu plaza directamente.",
  },
];

export default async function Home() {
  const eventosPorComunidad = await contarEventosPorComunidad(COMUNIDADES);
  const totalEventos = Object.values(eventosPorComunidad).reduce(
    (a, b) => a + b,
    0,
  );
  const porActividad = [...COMUNIDADES].sort(
    (a, b) => eventosPorComunidad[b.slug] - eventosPorComunidad[a.slug],
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(datosEstructuradosWeb()) }}
      />
      <section className="relative overflow-hidden pt-[100px] pb-[70px]">
        <div className="hero-rings" />
        <div className="hero-sweep" />
        <div className="wrap relative max-w-[760px] text-center">
          <p className="eyebrow mb-[22px] justify-center">RadarTech · España</p>
          <h1 className="text-[clamp(2.4rem,5.6vw,4.4rem)] leading-[1.06]">
            Descubre los eventos
            <br />
            tecnológicos más{" "}
            <em className="text-orange not-italic">relevantes</em>
            <br />
            de España.
          </h1>
          <p className="mx-auto mt-[22px] max-w-[560px] text-[1.08rem] text-text-dim">
            Un mapa interactivo con conferencias, meetups, hackathons y
            encuentros de IA, Data, Software, Cloud, Ciberseguridad y Startups
            en toda España.
          </p>
          <div className="mt-[38px] flex flex-wrap justify-center gap-3.5">
            <a href="#mapa" className="group btn btn-primary">
              Explorar el mapa{" "}
              <span
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-[3px]"
              >
                ↓
              </span>
            </a>
            <Link href="/anadir-evento" className="btn btn-ghost">
              Publica tu evento
            </Link>
          </div>
          <dl className="mt-14 flex justify-center border-t border-line pt-[22px] font-mono text-[0.78rem] text-text-dim max-sm:flex-wrap">
            {[
              { valor: "Todas", etiqueta: "Comunidades" },
              { valor: `${totalEventos}+`, etiqueta: "Eventos activos" },
              { valor: CATEGORIAS.length, etiqueta: "Categorías tech" },
            ].map(({ valor, etiqueta }) => (
              <div
                key={etiqueta}
                className="flex flex-col-reverse border-line px-[26px] not-last:border-r max-sm:border-r-0 max-sm:px-4 max-sm:py-2"
              >
                <dt>{etiqueta}</dt>
                <dd className="font-display text-[1.3rem] font-semibold text-text">
                  {valor}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section id="mapa" className="scroll-mt-[72px] py-24">
        <div className="wrap">
          <SectionHead
            eyebrow="Todas las comunidades · Actualizado en vivo"
            titulo="Elige dónde quieres mirar."
          >
            {/* En pantallas táctiles no hay cursor: se toca directamente */}
            <span className="pointer-coarse:hidden">
              Pasa el cursor sobre una comunidad para ver cuántos eventos hay
              programados. Haz clic para explorarlos en detalle.
            </span>
            <span className="hidden pointer-coarse:inline">
              Toca una comunidad para ver sus eventos. Debajo tienes todas
              ordenadas por actividad.
            </span>
          </SectionHead>
          <div className="grid items-start gap-10 min-[941px]:grid-cols-[1fr_300px]">
            <div className="relative overflow-hidden rounded-lg border border-line bg-bg-1 bg-[radial-gradient(circle_at_30%_20%,rgba(255,106,26,0.05),transparent_55%)] p-5">
              <MapaEspana eventos={eventosPorComunidad} />
            </div>
            <div className="flex flex-col gap-3.5">
              <SideCard titulo="Cómo leer el mapa">
                <p className="text-[0.88rem] text-text-dim">
                  Cada punto naranja es una señal: representa el volumen de
                  eventos activos en esa comunidad.
                </p>
                <p className="mt-3.5 flex items-center gap-2.5 font-mono text-[0.76rem] text-text-dim">
                  <span className="size-[9px] rounded-full bg-orange shadow-[0_0_8px_var(--color-glow)]" />
                  Más brillo = más eventos
                </p>
              </SideCard>
              <SideCard titulo="Comunidades por actividad">
                <ul className="max-h-[340px] overflow-auto">
                  {porActividad.map(({ slug, nombre }) => (
                    <li key={slug}>
                      <Link
                        href={`/eventos/${slug}`}
                        className="flex items-center justify-between border-b border-line px-1 py-2.5 text-[0.86rem] text-text-dim transition-colors hover:text-orange-bright"
                      >
                        {nombre}
                        <span className="font-mono text-[0.76rem] text-text-faint">
                          {eventosPorComunidad[slug]} ev.
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </SideCard>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-line py-24">
        <div className="wrap">
          <SectionHead
            eyebrow="Cómo funciona"
            titulo="De la señal al evento en tres pasos."
          />
          <ol className="grid gap-7 min-[801px]:grid-cols-3">
            {PASOS.map(({ titulo, texto }, i) => (
              <li key={titulo} className="border-t border-line-strong pt-5">
                <span className="font-mono text-[0.8rem] text-orange">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3.5 text-[1.15rem]">{titulo}</h3>
                <p className="mt-2.5 text-[0.92rem] text-text-dim">{texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        id="categorias"
        className="scroll-mt-[72px] border-t border-line py-24"
      >
        <div className="wrap">
          <SectionHead
            eyebrow="Categorías"
            titulo="Seis áreas del ecosistema tech."
          />
          <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-line bg-line min-[521px]:grid-cols-3 min-[901px]:grid-cols-6">
            {CATEGORIAS.map(({ slug, nombre, icono }) => (
              <li key={slug} className="flex">
                <Link
                  href={`/eventos?categoria=${slug}`}
                  className="flex w-full flex-col gap-3.5 bg-bg-1 px-[18px] py-[26px] transition-colors duration-200 hover:bg-bg-2"
                >
                  <Icon name={icono} size={22} className="text-orange" />
                  <span>
                    <span className="block text-[0.86rem] font-medium">
                      {nombre}
                    </span>
                    <small className="font-mono text-[0.7rem] text-text-faint">
                      Explorar categoría
                    </small>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

function SectionHead({
  eyebrow,
  titulo,
  children,
}: {
  eyebrow: string;
  titulo: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-[52px] max-w-[640px]">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-3.5 text-[clamp(1.7rem,3.2vw,2.5rem)]">{titulo}</h2>
      {children && <p className="mt-3.5 text-text-dim">{children}</p>}
    </div>
  );
}

function SideCard({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-md border border-line bg-bg-1 p-5">
      <h3 className="mb-2 text-base">{titulo}</h3>
      {children}
    </div>
  );
}
