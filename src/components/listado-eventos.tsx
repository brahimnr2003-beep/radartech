"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";
import { CATEGORIAS } from "@/lib/categorias";
import { COMUNIDADES } from "@/lib/comunidades";
import {
  MODALIDADES,
  TIPOS_EVENTO,
  hoyEnEspana,
  type Evento,
} from "@/lib/eventos";
import {
  CLAVES_FILTRO,
  FECHAS,
  PRECIOS,
  filtrarEventos,
  leerFiltros,
  opcionesUbicacion,
  type Filtros,
} from "@/lib/filtros";
import { Icon } from "./icon";
import { TarjetaEvento } from "./tarjeta-evento";

type Props = {
  eventos: Evento[];
  /** Muestra el filtro de comunidad (página de todos los eventos) */
  conComunidad?: boolean;
};

/** Listado con filtros sincronizados con la URL (?categoria=ia&precio=gratuito…). */
export function ListadoEventos({ eventos, conComunidad }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filtros = leerFiltros(searchParams);

  const cambiar: CambioFiltros = (cambios) => {
    const params = new URLSearchParams(searchParams);
    for (const [clave, valor] of Object.entries(cambios)) {
      if (valor) params.set(clave, valor);
      else params.delete(clave);
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  const limpiar = () => router.replace(pathname, { scroll: false });

  return (
    <PanelEventos
      eventos={filtrarEventos(eventos, filtros, hoyEnEspana())}
      todos={eventos}
      filtros={filtros}
      conComunidad={conComunidad}
      onCambio={cambiar}
      onLimpiar={limpiar}
    />
  );
}

/** Versión sin filtros activos, para el primer render en el servidor. */
export function ListadoEventosInicial({ eventos, conComunidad }: Props) {
  return (
    <PanelEventos
      eventos={eventos}
      todos={eventos}
      filtros={{}}
      conComunidad={conComunidad}
      onCambio={() => {}}
      onLimpiar={() => {}}
    />
  );
}

type CambioFiltros = (cambios: Partial<Record<keyof Filtros, string>>) => void;

/** Píldoras en la barra de escritorio; a todo el ancho en el panel del móvil. */
const estiloSelector = (activo: boolean, apilado?: boolean) =>
  `cursor-pointer appearance-none truncate border bg-bg-1 font-mono transition-colors hover:border-orange hover:text-text ${
    apilado
      ? "w-full rounded-sm px-3.5 py-[13px] text-[0.86rem]"
      : "max-w-40 rounded-full px-4 py-[9px] text-[0.78rem]"
  } ${activo ? "border-orange text-text" : "border-line-strong text-text-dim"}`;

function PanelEventos({
  eventos,
  todos,
  filtros,
  conComunidad,
  onCambio,
  onLimpiar,
}: {
  eventos: Evento[];
  todos: Evento[];
  filtros: Filtros;
  conComunidad?: boolean;
  onCambio: CambioFiltros;
  onLimpiar: () => void;
}) {
  const panel = useRef<HTMLDialogElement>(null);
  const destacados = eventos.filter((e) => e.destacado);
  const resto = eventos.filter((e) => !e.destacado);
  // Provincia y ciudad son un único filtro («Ubicación»)
  const activos = CLAVES_FILTRO.filter(
    (clave) => filtros[clave] && !(clave === "provincia" && filtros.ciudad),
  ).length;

  const controles = (apilado?: boolean) => (
    <ControlesFiltros
      todos={todos}
      filtros={filtros}
      conComunidad={conComunidad}
      onCambio={onCambio}
      apilado={apilado}
    />
  );
  const quitar = activos > 0 && (
    <button
      type="button"
      onClick={onLimpiar}
      className="px-2 font-mono text-[0.78rem] text-orange-bright hover:underline"
    >
      Quitar filtros
    </button>
  );

  return (
    <>
      <div className="sticky top-16 z-40 border-b border-line bg-bg/92 backdrop-blur-[10px] sm:top-[72px]">
        {/* Escritorio y tablet: todos los filtros a la vista */}
        <div
          role="group"
          aria-label="Filtros"
          className="wrap hidden flex-wrap items-center gap-2.5 py-6 min-[641px]:flex"
        >
          {controles()}
          {quitar}
        </div>

        {/* Móvil: un botón que abre el panel de filtros */}
        <div className="wrap flex items-center gap-3 py-3.5 min-[641px]:hidden">
          <button
            type="button"
            onClick={() => panel.current?.showModal()}
            className={`flex items-center gap-2 rounded-full border bg-bg-1 px-4 py-[9px] font-mono text-[0.78rem] ${
              activos > 0
                ? "border-orange text-text"
                : "border-line-strong text-text-dim"
            }`}
          >
            <Icon name="filtros" size={14} />
            Filtros{activos > 0 && ` (${activos})`}
          </button>
          <span className="mr-auto font-mono text-[0.74rem] text-text-faint">
            {eventos.length} {eventos.length === 1 ? "evento" : "eventos"}
          </span>
          {quitar}
        </div>
      </div>

      {/* Panel de filtros del móvil: se abre desde abajo */}
      <dialog
        ref={panel}
        aria-label="Filtros"
        className="mx-0 mt-auto mb-0 max-h-[85dvh] w-full max-w-none rounded-t-lg border-t border-line-strong bg-bg-1 p-0 text-text backdrop:bg-black/60"
        // Tocar el fondo oscuro cierra el panel
        onClick={(e) => e.target === panel.current && panel.current.close()}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-[1.1rem]">Filtros</h2>
          <button
            type="button"
            aria-label="Cerrar filtros"
            onClick={() => panel.current?.close()}
            className="flex size-9 items-center justify-center rounded-full border border-line-strong hover:border-orange"
          >
            <Icon name="cerrar" size={16} />
          </button>
        </div>
        <div className="flex flex-col gap-3 px-5 py-5">{controles(true)}</div>
        <div className="sticky bottom-0 flex items-center gap-3 border-t border-line bg-bg-1 px-5 py-4">
          {quitar}
          <button
            type="button"
            onClick={() => panel.current?.close()}
            className="btn btn-primary ml-auto justify-center"
          >
            Ver {eventos.length} {eventos.length === 1 ? "evento" : "eventos"}
          </button>
        </div>
      </dialog>

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

/** Los desplegables de filtro: en fila (escritorio) o apilados (panel del móvil). */
function ControlesFiltros({
  todos,
  filtros,
  conComunidad,
  onCambio,
  apilado,
}: {
  todos: Evento[];
  filtros: Filtros;
  conComunidad?: boolean;
  onCambio: CambioFiltros;
  apilado?: boolean;
}) {
  // La ubicación ofrece solo lugares de la comunidad elegida
  const ubicaciones = opcionesUbicacion(
    todos.filter(
      (e) => !filtros.comunidad || e.comunidad === filtros.comunidad,
    ),
  );

  const selectores: {
    clave: keyof Filtros;
    etiqueta: string;
    opciones: [valor: string, texto: string][];
  }[] = [
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
      <select
        aria-label="Fecha"
        value={filtros.fecha ?? ""}
        onChange={(e) => onCambio({ fecha: e.target.value })}
        className={estiloSelector(!!filtros.fecha, apilado)}
      >
        <option value="">Fecha</option>
        {Object.entries(FECHAS).map(([valor, texto]) => (
          <option key={valor} value={valor}>
            {texto}
          </option>
        ))}
      </select>

      {conComunidad && (
        <select
          aria-label="Comunidad"
          value={filtros.comunidad ?? ""}
          // Al cambiar de comunidad, la ubicación anterior deja de tener sentido
          onChange={(e) =>
            onCambio({
              comunidad: e.target.value,
              provincia: "",
              ciudad: "",
            })
          }
          className={estiloSelector(!!filtros.comunidad, apilado)}
        >
          <option value="">Comunidad</option>
          {[...COMUNIDADES]
            .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"))
            .map(({ slug, nombre }) => (
              <option key={slug} value={slug}>
                {nombre}
              </option>
            ))}
        </select>
      )}

      <SelectorUbicacion
        ubicaciones={ubicaciones}
        filtros={filtros}
        onCambio={onCambio}
        apilado={apilado}
      />

      {selectores.map(({ clave, etiqueta, opciones }) => (
        <select
          key={clave}
          aria-label={etiqueta}
          value={filtros[clave] ?? ""}
          onChange={(e) => onCambio({ [clave]: e.target.value })}
          className={estiloSelector(!!filtros[clave], apilado)}
        >
          <option value="">{etiqueta}</option>
          {opciones.map(([valor, texto]) => (
            <option key={valor} value={valor}>
              {texto}
            </option>
          ))}
        </select>
      ))}
    </>
  );
}

/**
 * Provincia y ciudad en un solo desplegable. Con varias provincias, las ciudades
 * se agrupan por provincia y cada grupo permite elegir la provincia entera.
 */
function SelectorUbicacion({
  ubicaciones,
  filtros,
  onCambio,
  apilado,
}: {
  ubicaciones: { provincia: string; ciudades: string[] }[];
  filtros: Filtros;
  onCambio: CambioFiltros;
  apilado?: boolean;
}) {
  const valor = filtros.ciudad
    ? `ciudad:${filtros.ciudad}`
    : filtros.provincia
      ? `provincia:${filtros.provincia}`
      : "";

  const elegir = (seleccion: string) => {
    const [tipo, nombre = ""] = seleccion.split(/:(.*)/);
    onCambio({
      provincia: tipo === "provincia" ? nombre : "",
      ciudad: tipo === "ciudad" ? nombre : "",
    });
  };

  const ciudad = (nombre: string) => (
    <option key={nombre} value={`ciudad:${nombre}`}>
      {nombre}
    </option>
  );

  return (
    <select
      aria-label="Ubicación"
      value={valor}
      onChange={(e) => elegir(e.target.value)}
      className={estiloSelector(!!valor, apilado)}
    >
      <option value="">Ubicación</option>
      {ubicaciones.length === 1
        ? ubicaciones[0].ciudades.map(ciudad)
        : ubicaciones.map(({ provincia, ciudades }) => (
            <optgroup key={provincia} label={provincia}>
              {ciudades.length > 1 && (
                <option value={`provincia:${provincia}`}>
                  Toda la provincia
                </option>
              )}
              {ciudades.map(ciudad)}
            </optgroup>
          ))}
    </select>
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
