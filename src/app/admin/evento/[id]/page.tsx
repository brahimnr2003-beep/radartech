import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { editarEvento } from "@/app/admin/acciones";
import { FormularioEvento } from "@/components/formulario-evento";
import { getAdministrador } from "@/lib/auth";
import { getEventoAdmin } from "@/lib/consultas-admin";

export const metadata: Metadata = {
  title: "Editar evento — RadarTech",
  robots: { index: false, follow: false },
};

export default function PaginaEditarEvento({
  params,
}: PageProps<"/admin/evento/[id]">) {
  return (
    <section className="wrap pt-14 pb-[100px]">
      <div className="max-w-[640px]">
        <Link
          href="/admin"
          className="font-mono text-[0.78rem] text-text-dim hover:text-orange-bright"
        >
          ← Volver al panel
        </Link>
        <h1 className="mt-5 mb-8 text-[clamp(1.9rem,3.6vw,2.6rem)]">
          Editar evento
        </h1>
        <Suspense fallback={<p className="text-text-dim">Cargando…</p>}>
          <Edicion params={params} />
        </Suspense>
      </div>
    </section>
  );
}

async function Edicion({
  params,
}: {
  params: PageProps<"/admin/evento/[id]">["params"];
}) {
  if (!(await getAdministrador())) redirect("/admin");
  const id = Number((await params).id);
  const evento = Number.isInteger(id) ? await getEventoAdmin(id) : undefined;
  if (!evento) notFound();

  return (
    <FormularioEvento
      edicion={{
        accion: editarEvento.bind(null, evento.id),
        valores: {
          nombre: evento.nombre,
          descripcion: evento.descripcion,
          fecha: evento.fecha,
          fechaFin: evento.fechaFin ?? undefined,
          hora: evento.hora?.slice(0, 5),
          comunidad: evento.comunidad,
          provincia: evento.provincia,
          ciudad: evento.ciudad,
          lugar: evento.lugar ?? undefined,
          categoria: evento.categoria,
          tipo: evento.tipo,
          modalidad: evento.modalidad,
          precioDesde: evento.precioDesde?.toString(),
          urlOficial: evento.urlOficial,
          imagenUrl: evento.imagenUrl ?? undefined,
          organizador: evento.organizador ?? undefined,
          email: evento.emailContacto ?? undefined,
        },
      }}
    />
  );
}
