import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import {
  alternarDestacado,
  cambiarEstado,
  cambiarEstadoVarios,
} from "@/app/admin/acciones";
import { SeleccionarTodos } from "@/components/admin/seleccionar-todos";
import { CerrarSesion, EntrarConGitHub } from "@/components/admin/sesion-admin";
import { getAdministrador } from "@/lib/auth";
import { nombreCategoria } from "@/lib/categorias";
import { COMUNIDADES } from "@/lib/comunidades";
import {
  ESTADOS,
  contarPorEstado,
  getEventosAdmin,
  type EstadoEvento,
} from "@/lib/consultas-admin";
import { TIPOS_EVENTO, formatearFechas, formatearPrecio } from "@/lib/eventos";
import type { FilaEvento } from "@/db/schema";

export const metadata: Metadata = {
  title: "Panel de administración — RadarTech",
  robots: { index: false, follow: false },
};

/** Id del formulario de acciones en bloque. */
const SELECCION = "seleccion";

const ACCIONES_EN_BLOQUE: Record<
  EstadoEvento,
  { texto: string; destino: EstadoEvento; principal?: boolean }[]
> = {
  pendiente: [
    { texto: "Aprobar seleccionados", destino: "aprobado", principal: true },
    { texto: "Rechazar seleccionados", destino: "rechazado" },
  ],
  aprobado: [{ texto: "Ocultar seleccionados", destino: "rechazado" }],
  rechazado: [
    { texto: "Publicar seleccionados", destino: "aprobado", principal: true },
  ],
};

const PESTANAS: Record<EstadoEvento, string> = {
  pendiente: "Pendientes",
  aprobado: "Publicados",
  rechazado: "Descartados",
};

export default function PaginaAdmin({ searchParams }: PageProps<"/admin">) {
  return (
    <section className="wrap pt-14 pb-[100px]">
      <p className="eyebrow">Administración</p>
      <h1 className="mt-3.5 mb-8 text-[clamp(1.9rem,3.6vw,2.6rem)]">
        Panel de eventos
      </h1>
      {/* La sesión se lee en cada petición: va detrás de un Suspense */}
      <Suspense fallback={<p className="text-text-dim">Cargando…</p>}>
        <Panel searchParams={searchParams} />
      </Suspense>
    </section>
  );
}

async function Panel({
  searchParams,
}: {
  searchParams: PageProps<"/admin">["searchParams"];
}) {
  const parametros = await searchParams;
  const admin = await getAdministrador();

  if (!admin) {
    return (
      <div className="max-w-[520px]">
        <p className="mb-6 text-text-dim">
          Zona privada. Entra con la cuenta de GitHub del administrador para
          revisar y publicar eventos.
        </p>
        {parametros.error && (
          <p
            role="alert"
            className="mb-6 rounded-md border border-orange-bright px-[18px] py-3.5 text-[0.9rem] text-orange-bright"
          >
            Esta cuenta de GitHub no tiene acceso al panel.
          </p>
        )}
        <EntrarConGitHub />
      </div>
    );
  }

  const estado = ESTADOS.find((e) => e === parametros.estado) ?? "pendiente";
  const [lista, conteo] = await Promise.all([
    getEventosAdmin(estado),
    contarPorEstado(),
  ]);

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6">
        <nav
          aria-label="Estado de los eventos"
          className="flex flex-wrap gap-2"
        >
          {ESTADOS.map((e) => (
            <Link
              key={e}
              href={`/admin?estado=${e}`}
              aria-current={e === estado ? "page" : undefined}
              className={`rounded-full border px-4 py-2 font-mono text-[0.78rem] transition ${
                e === estado
                  ? "border-orange bg-orange/10 text-orange-bright"
                  : "border-line-strong text-text-dim hover:border-orange-dim hover:text-text"
              }`}
            >
              {PESTANAS[e]} · {conteo[e]}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <span className="font-mono text-[0.76rem] text-text-faint">
            {admin.name}
          </span>
          <CerrarSesion />
        </div>
      </div>

      {lista.length === 0 ? (
        <p className="text-text-dim">No hay eventos en esta lista.</p>
      ) : (
        <>
          {/* Acciones en bloque: las casillas de cada evento apuntan a este formulario */}
          <form
            id={SELECCION}
            className="sticky top-[72px] z-10 mb-5 flex flex-wrap items-center gap-3 rounded-md border border-line bg-bg/90 px-4 py-3 backdrop-blur-md"
          >
            <SeleccionarTodos formulario={SELECCION} />
            <span className="mr-auto" />
            {ACCIONES_EN_BLOQUE[estado].map(({ texto, destino, principal }) => (
              <button
                key={destino}
                type="submit"
                formAction={cambiarEstadoVarios.bind(null, destino)}
                className={`btn px-4 py-2.5 text-[0.76rem] ${principal ? "btn-primary" : "btn-ghost"}`}
              >
                {texto}
              </button>
            ))}
          </form>
          <ul className="flex flex-col gap-4">
            {lista.map((evento) => (
              <FilaAdmin key={evento.id} evento={evento} />
            ))}
          </ul>
        </>
      )}
    </>
  );
}

function FilaAdmin({ evento }: { evento: FilaEvento }) {
  const comunidad = COMUNIDADES.find((c) => c.slug === evento.comunidad);
  const origen =
    evento.origen === "formulario"
      ? "Formulario"
      : evento.origen === "admin"
        ? "Administrador"
        : (evento.fuente ?? "IA");

  const datos = [
    formatearFechas(evento.fecha, evento.fechaFin ?? undefined),
    `${evento.ciudad}, ${comunidad?.nombre}`,
    nombreCategoria(evento.categoria),
    TIPOS_EVENTO[evento.tipo],
    formatearPrecio(evento.precioDesde),
  ];

  return (
    <li
      className={`rounded-md border bg-bg-1 p-5 sm:p-6 ${
        evento.destacado ? "border-orange" : "border-line"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
        <input
          type="checkbox"
          name="ids"
          value={evento.id}
          form={SELECCION}
          aria-label={`Seleccionar ${evento.nombre}`}
          className="mt-1.5 size-4 flex-none accent-orange"
        />
        <div className="min-w-0 flex-1">
          <h2 className="text-[1.1rem] leading-snug">
            {evento.destacado && (
              <span className="mr-2 text-orange-bright">★</span>
            )}
            {evento.nombre}
          </h2>
          <p className="mt-2 font-mono text-[0.76rem] text-text-dim">
            {datos.join(" · ")}
          </p>
        </div>
        <span className="rounded-full border border-line-strong px-2.5 py-1 font-mono text-[0.7rem] text-text-dim">
          {origen}
        </span>
      </div>

      <p className="mt-3 line-clamp-2 text-[0.9rem] text-text-dim">
        {evento.descripcion}
      </p>
      {evento.motivoClasificacion && (
        <p className="mt-3 border-l-2 border-orange-dim pl-3 text-[0.84rem] text-text-dim">
          <span className="font-mono text-[0.72rem] text-text-faint uppercase">
            IA:{" "}
          </span>
          {evento.motivoClasificacion}
        </p>
      )}
      <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[0.74rem] text-text-faint">
        {evento.organizador && <span>Organiza: {evento.organizador}</span>}
        {evento.emailContacto && (
          <a
            href={`mailto:${evento.emailContacto}`}
            className="hover:text-orange-bright"
          >
            {evento.emailContacto}
          </a>
        )}
        <a
          href={evento.urlOficial}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-orange-bright"
        >
          Web oficial ↗
        </a>
        {evento.estado === "aprobado" && (
          <Link
            href={`/evento/${evento.slug}`}
            className="hover:text-orange-bright"
          >
            Ver ficha
          </Link>
        )}
      </p>

      <div className="mt-5 flex flex-wrap gap-2.5">
        {evento.estado !== "aprobado" && (
          <Accion
            accion={cambiarEstado.bind(null, evento.id, "aprobado")}
            principal
          >
            {evento.estado === "pendiente" ? "Aprobar" : "Publicar"}
          </Accion>
        )}
        {evento.estado === "aprobado" && (
          <Accion accion={alternarDestacado.bind(null, evento.id)} principal>
            {evento.destacado ? "Quitar destacado" : "★ Destacar"}
          </Accion>
        )}
        <Link
          href={`/admin/evento/${evento.id}`}
          className="btn btn-ghost px-4 py-2.5 text-[0.76rem]"
        >
          Editar
        </Link>
        {evento.estado !== "rechazado" && (
          <Accion accion={cambiarEstado.bind(null, evento.id, "rechazado")}>
            {evento.estado === "pendiente" ? "Rechazar" : "Ocultar"}
          </Accion>
        )}
      </div>
    </li>
  );
}

function Accion({
  accion,
  principal,
  children,
}: {
  accion: () => Promise<void>;
  principal?: boolean;
  children: React.ReactNode;
}) {
  return (
    <form action={accion}>
      <button
        type="submit"
        className={`btn px-4 py-2.5 text-[0.76rem] ${principal ? "btn-primary" : "btn-ghost"}`}
      >
        {children}
      </button>
    </form>
  );
}
