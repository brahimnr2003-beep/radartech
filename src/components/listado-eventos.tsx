"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
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

  const cambiar = (cambios: Partial<Record<keyof Filtros, string>>) => {
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

const estiloSelector = (activo: boolean) =>
  `max-w-40 cursor-pointer appearance-none truncate rounded-full border bg-bg-1 px-4 py-[9px] font-mono text-[0.78rem] transition-colors hover:border-orange hover:text-text ${
    activo ? "border-orange text-text" : "border-line-strong text-text-dim"
  }`;

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
  onCambio: (cambios: Partial<Record<keyof Filtros, string>>) => void;
  onLimpiar: () => void;
}) {
  // La ubicación ofrece solo lugares de la comunidad elegida
  const ubicaciones = opcionesUbicacion(
    todos.filter(
      (e) => !filtros.comunidad || e.comunidad === filtros.comunidad,
    ),
  );
  const destacados = eventos.filter((e) => e.destacado);
  const resto = eventos.filter((e) => !e.destacado);
  const hayFiltros = CLAVES_FILTRO.some((clave) => filtros[clave]);

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
      <div className="sticky top-16 z-40 border-b border-line bg-bg/92 backdrop-blur-[10px] sm:top-[72px]">
        <div
          role="group"
          aria-label="Filtros"
          className="wrap flex flex-wrap items-center gap-2.5 py-6"
        >
          <select
            aria-label="Fecha"
            value={filtros.fecha ?? ""}
            onChange={(e) => onCambio({ fecha: e.target.value })}
            className={estiloSelector(!!filtros.fecha)}
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
              className={estiloSelector(!!filtros.comunidad)}
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
          />

          {selectores.map(({ clave, etiqueta, opciones }) => (
            <select
              key={clave}
              aria-label={etiqueta}
              value={filtros[clave] ?? ""}
              onChange={(e) => onCambio({ [clave]: e.target.value })}
              className={estiloSelector(!!filtros[clave])}
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

/**
 * Provincia y ciudad en un solo desplegable. Con varias provincias, las ciudades
 * se agrupan por provincia y cada grupo permite elegir la provincia entera.
 */
function SelectorUbicacion({
  ubicaciones,
  filtros,
  onCambio,
}: {
  ubicaciones: { provincia: string; ciudades: string[] }[];
  filtros: Filtros;
  onCambio: (cambios: Partial<Record<keyof Filtros, string>>) => void;
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
      className={estiloSelector(!!valor)}
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
