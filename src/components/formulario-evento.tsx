"use client";

import {
  cloneElement,
  startTransition,
  useActionState,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { enviarEvento } from "@/app/anadir-evento/acciones";
import { CATEGORIAS } from "@/lib/categorias";
import { COMUNIDADES } from "@/lib/comunidades";
import type { CampoEnvio, ResultadoEnvio } from "@/lib/envio-evento";
import { MODALIDADES, TIPOS_EVENTO } from "@/lib/eventos";

const INICIAL: ResultadoEnvio = { estado: "inicial" };

export function FormularioEvento() {
  const [resultado, accion, enviando] = useActionState(enviarEvento, INICIAL);
  // Momento en que se abrió el formulario: los bots lo envían al instante
  const abierto = useRef(0);
  useEffect(() => {
    abierto.current = Date.now();
  }, []);

  if (resultado.estado === "enviado") {
    return (
      <div
        role="status"
        className="rounded-md border border-orange bg-orange/6 p-[26px]"
      >
        <b className="mb-2 block font-display text-[1.1rem]">Recibido ✓</b>
        <p className="text-text-dim">
          Tu evento ha entrado como{" "}
          <b className="text-orange">pendiente de revisión</b>. Lo revisaremos
          antes de publicarlo y te escribiremos si necesitamos algo.
        </p>
        <a href="/anadir-evento" className="btn btn-ghost mt-5">
          Enviar otro evento
        </a>
      </div>
    );
  }

  const errores = resultado.estado === "error" ? resultado.errores : undefined;
  const error = (campo: CampoEnvio) => errores?.[campo]?.[0];

  return (
    <form
      onSubmit={(e) => {
        // Envío manual: así el formulario no se vacía si hay errores
        e.preventDefault();
        const datos = new FormData(e.currentTarget);
        datos.set("inicio", String(abierto.current));
        startTransition(() => accion(datos));
      }}
    >
      <Campo
        nombre="nombre"
        etiqueta="Nombre del evento"
        error={error("nombre")}
      >
        <input
          type="text"
          placeholder="Ej. Madrid AI Summit 2026"
          maxLength={150}
          required
        />
      </Campo>
      <Campo
        nombre="descripcion"
        etiqueta="Descripción"
        error={error("descripcion")}
      >
        <textarea
          rows={4}
          placeholder="¿De qué trata el evento? ¿A quién va dirigido?"
          minLength={30}
          maxLength={2000}
          required
        />
      </Campo>

      <Fila>
        <Campo nombre="fecha" etiqueta="Fecha" error={error("fecha")}>
          <input type="date" required />
        </Campo>
        <Campo
          nombre="fechaFin"
          etiqueta="Fecha de fin"
          opcional
          error={error("fechaFin")}
        >
          <input type="date" />
        </Campo>
      </Fila>
      <Fila>
        <Campo
          nombre="hora"
          etiqueta="Hora de inicio"
          opcional
          error={error("hora")}
        >
          <input type="time" />
        </Campo>
        <Campo
          nombre="modalidad"
          etiqueta="Modalidad"
          error={error("modalidad")}
        >
          <Desplegable
            opciones={Object.entries(MODALIDADES).map(([valor, texto]) => ({
              valor,
              texto,
            }))}
          />
        </Campo>
      </Fila>

      <Fila>
        <Campo
          nombre="comunidad"
          etiqueta="Comunidad"
          error={error("comunidad")}
        >
          <Desplegable
            opciones={COMUNIDADES.map((c) => ({
              valor: c.slug,
              texto: c.nombre,
            }))}
          />
        </Campo>
        <Campo
          nombre="provincia"
          etiqueta="Provincia"
          error={error("provincia")}
        >
          <input type="text" placeholder="Ej. Málaga" maxLength={60} required />
        </Campo>
      </Fila>
      <Fila>
        <Campo nombre="ciudad" etiqueta="Ciudad" error={error("ciudad")}>
          <input type="text" placeholder="Ej. Málaga" maxLength={80} required />
        </Campo>
        <Campo nombre="lugar" etiqueta="Lugar" opcional error={error("lugar")}>
          <input
            type="text"
            placeholder="Ej. Palacio de Ferias y Congresos"
            maxLength={150}
          />
        </Campo>
      </Fila>

      <Fila>
        <Campo
          nombre="categoria"
          etiqueta="Categoría"
          error={error("categoria")}
        >
          <Desplegable
            opciones={CATEGORIAS.map((c) => ({
              valor: c.slug,
              texto: c.nombre,
            }))}
          />
        </Campo>
        <Campo nombre="tipo" etiqueta="Tipo de evento" error={error("tipo")}>
          <Desplegable
            opciones={Object.entries(TIPOS_EVENTO).map(([valor, texto]) => ({
              valor,
              texto,
            }))}
          />
        </Campo>
      </Fila>

      <Campo
        nombre="precioDesde"
        etiqueta="Precio desde (€)"
        opcional
        ayuda="0 si es gratuito. Déjalo vacío si aún no se sabe."
        error={error("precioDesde")}
      >
        <input
          type="number"
          min={0}
          max={10000}
          step={1}
          placeholder="Ej. 20"
        />
      </Campo>
      <Campo
        nombre="urlOficial"
        etiqueta="URL oficial"
        error={error("urlOficial")}
      >
        <input type="url" placeholder="https://" maxLength={500} required />
      </Campo>
      <Campo
        nombre="imagenUrl"
        etiqueta="URL del cartel"
        opcional
        ayuda="Enlace a la imagen del evento. Si no hay, usaremos la portada de la categoría."
        error={error("imagenUrl")}
      >
        <input type="url" placeholder="https://" maxLength={500} />
      </Campo>

      <Fila>
        <Campo
          nombre="organizador"
          etiqueta="Organizador"
          error={error("organizador")}
        >
          <input
            type="text"
            placeholder="Nombre de tu organización"
            maxLength={120}
            required
          />
        </Campo>
        <Campo
          nombre="email"
          etiqueta="Email de contacto"
          ayuda="No se publica: solo lo usaremos si necesitamos consultarte algo."
          error={error("email")}
        >
          <input
            type="email"
            placeholder="tu@email.com"
            maxLength={200}
            autoComplete="email"
            required
          />
        </Campo>
      </Fila>

      {/* Campo trampa: invisible para las personas, los bots lo rellenan */}
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] size-px overflow-hidden"
      >
        <label htmlFor="sitio_web">No rellenes este campo</label>
        <input
          type="text"
          id="sitio_web"
          name="sitio_web"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {resultado.estado === "error" && (
        <p
          role="alert"
          className="mb-4 rounded-md border border-orange-bright px-[18px] py-3.5 text-[0.9rem] text-orange-bright"
        >
          {resultado.mensaje}
        </p>
      )}
      <button
        type="submit"
        disabled={enviando}
        className="btn btn-primary mt-2 disabled:pointer-events-none disabled:opacity-60"
      >
        {enviando ? "Enviando…" : "Enviar para revisión"}
      </button>
    </form>
  );
}

function Fila({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 min-[561px]:grid-cols-2">{children}</div>;
}

/** Etiqueta + control + ayuda + error, enlazados para lectores de pantalla. */
function Campo({
  nombre,
  etiqueta,
  opcional,
  ayuda,
  error,
  children,
}: {
  nombre: CampoEnvio;
  etiqueta: string;
  opcional?: boolean;
  ayuda?: string;
  error?: string;
  children: React.ReactElement<React.InputHTMLAttributes<HTMLElement>>;
}) {
  const idAyuda = `${nombre}-ayuda`;
  const idError = `${nombre}-error`;
  const control = cloneElement(children, {
    id: nombre,
    name: nombre,
    className: "campo-control",
    "aria-invalid": error ? true : undefined,
    "aria-describedby":
      [ayuda && idAyuda, error && idError].filter(Boolean).join(" ") ||
      undefined,
  });
  return (
    <div className="mb-[22px]">
      <label htmlFor={nombre} className="campo-etiqueta">
        {etiqueta}
        {opcional && (
          <span className="text-text-faint normal-case"> · opcional</span>
        )}
      </label>
      {control}
      {ayuda && (
        <p id={idAyuda} className="mt-1.5 text-[0.8rem] text-text-faint">
          {ayuda}
        </p>
      )}
      {error && (
        <p id={idError} className="mt-1.5 text-[0.8rem] text-orange-bright">
          {error}
        </p>
      )}
    </div>
  );
}

function Desplegable({
  opciones,
  ...props
}: {
  opciones: { valor: string; texto: string }[];
} & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select required defaultValue="" {...props}>
      <option value="" disabled>
        Selecciona
      </option>
      {opciones.map(({ valor, texto }) => (
        <option key={valor} value={valor}>
          {texto}
        </option>
      ))}
    </select>
  );
}
