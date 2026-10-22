"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CATEGORIAS } from "@/lib/categorias";
import { MODALIDADES, TIPOS_EVENTO, type Evento } from "@/lib/eventos";
import {
  CLAVES_FILTRO,
  FECHAS,
  PRECIOS,
  filtrarEventos,
  leerFiltros,
  opcionesLugar,
  type Filtros,
} from "@/lib/filtros";
import { TarjetaEvento } from "./tarjeta-evento";

/** Listado con filtros sincronizados con la URL (?categoria=ia&precio=gratuito…). */
export function EventosComunidad({ eventos }: { eventos: Evento[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filtros = leerFiltros(searchParams);

  const cambiar = (clave: keyof Filtros, valor: string) => {
    const params = new URLSearchParams(searchParams);
    if (valor) params.set(clave, valor);
    else params.delete(clave);
    // La ciudad depende de la provincia: al cambiar de provincia se reinicia
    if (clave === "provincia") params.delete("ciudad");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  const limpiar = () => router.replace(pathname, { scroll: false });

  return (
    <PanelEventos
      eventos={filtrarEventos(eventos, filtros, hoyISO())}
      opciones={eventos}
      filtros={filtros}
      onCambio={cambiar}
      onLimpiar={limpiar}
    />
  );
}

/** Versión sin filtros activos, para el primer render en el servidor. */
export function EventosComunidadInicial({ eventos }: { eventos: Evento[] }) {
  return (
    <PanelEventos
      eventos={eventos}
      opciones={eventos}
      filtros={{}}
      onCambio={() => {}}
      onLimpiar={() => {}}
    />
  );
}

function hoyISO(): string {
  const ahora = new Date();
  const mes = String(ahora.getMonth() + 1).padStart(2, "0");
  const dia = String(ahora.getDate()).padStart(2, "0");
  return `${ahora.getFullYear()}-${mes}-${dia}`;
}

function PanelEventos({
  eventos,
  opciones,
  filtros,
  onCambio,
  onLimpiar,
}: {
  eventos: Evento[];
  opciones: Evento[];
  filtros: Filtros;
  onCambio: (clave: keyof Filtros, valor: string) => void;
  onLimpiar: () => void;
}) {
  const { provincias, ciudades } = opcionesLugar(opciones, filtros.provincia);
  const destacados = eventos.filter((e) => e.destacado);
  const resto = eventos.filter((e) => !e.destacado);
  const hayFiltros = CLAVES_FILTRO.some((clave) => filtros[clave]);

  const selectores: {
    clave: keyof Filtros;
    etiqueta: string;
    opciones: [valor: string, texto: string][];
  }[] = [
    { clave: "fecha", etiqueta: "Fecha", opciones: Object.entries(FECHAS) },
    {
      clave: "provincia",
      etiqueta: "Provincia",
      opciones: provincias.map((p) => [p, p]),
    },
    {
      clave: "ciudad",
      etiqueta: "Ciudad",
      opciones: ciudades.map((c) => [c, c]),
    },
    {
      clave: "categoria",
      etiqueta: "Categoría",
      opciones: CATEGORIAS.map((c) => [c.slug, c.nombre]),
    },
    {
      clave: "modalidad",
      etiqueta: "Modalidad",
      opciones: Object.entries(MODALIDADES),
    },
    { clave: "precio", etiqueta: "Precio", opciones: Object.entries(PRECIOS) },
    {
      clave: "tipo",
      etiqueta: "Tipo de evento",
      opciones: Object.entries(TIPOS_EVENTO),
    },
  ];

  return (
    <>
      <div className="sticky top-16 z-40 border-b border-line bg-bg/92 backdrop-blur-[10px] sm:top-[72px]">
        <div
          role="group"
          aria-label="Filtros"
          className="wrap flex flex-wrap items-center gap-2.5 py-6"
        >
          {selectores.map(({ clave, etiqueta, opciones }) => (
            <select
              key={clave}
              aria-label={etiqueta}
              value={filtros[clave] ?? ""}
              onChange={(e) => onCambio(clave, e.target.value)}
              className={`cursor-pointer appearance-none rounded-full border bg-bg-1 px-4 py-[9px] font-mono text-[0.78rem] transition-colors hover:border-orange hover:text-text ${
                filtros[clave]
                  ? "border-orange text-text"
                  : "border-line-strong text-text-dim"
              }`}
            >
              <option value="">{etiqueta}</option>
              {opciones.map(([valor, texto]) => (
                <option key={valor} value={valor}>
                  {texto}
                </option>
              ))}
            </select>
          ))}
          {hayFiltros && (
            <button
              type="button"
              onClick={onLimpiar}
              className="px-2 font-mono text-[0.78rem] text-orange-bright hover:underline"
            >
              Quitar filtros
            </button>
          )}
        </div>
      </div>

      <div className="wrap pb-20">
        {eventos.length === 0 ? (
          <div className="py-20 text-center text-text-dim">
            <h3 className="mb-2.5 text-[1.2rem]">
              No hay eventos con estos filtros
            </h3>
            <p>Prueba a quitar alguno para ver más resultados.</p>
            <button
              type="button"
              onClick={onLimpiar}
              className="btn btn-ghost mt-6"
            >
              Quitar filtros
            </button>
          </div>
        ) : (
          <>
            {destacados.length > 0 && (
              <SeccionEventos titulo="Destacados" eventos={destacados} />
            )}
            {resto.length > 0 && (
              <SeccionEventos
                titulo={
                  destacados.length > 0 ? "Más eventos" : "Todos los eventos"
                }
                eventos={resto}
              />
            )}
          </>
        )}
      </div>
    </>
  );
}

function SeccionEventos({
  titulo,
  eventos,
}: {
  titulo: string;
  eventos: Evento[];
}) {
  return (
    <section className="pt-9">
      <h2 className="eyebrow">{titulo}</h2>
      <ul className="grid gap-6 pt-5 min-[641px]:grid-cols-2 min-[941px]:grid-cols-3">
        {eventos.map((evento) => (
          <li key={evento.slug} className="flex">
            <TarjetaEvento evento={evento} />
          </li>
        ))}
      </ul>
    </section>
  );
}
