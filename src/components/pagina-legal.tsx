import { FECHA_TEXTOS_LEGALES } from "@/lib/proyecto";

/** Plantilla común de las páginas de texto (legales, Sobre nosotros…). */
export function PaginaTexto({
  etiqueta,
  titulo,
  entradilla,
  children,
}: {
  etiqueta: string;
  titulo: string;
  entradilla: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <article className="wrap pt-14 pb-[100px]">
      <div className="max-w-[720px]">
        <p className="eyebrow">{etiqueta}</p>
        <h1 className="mt-3.5 text-[clamp(1.9rem,3.6vw,2.6rem)]">{titulo}</h1>
        <div className="mt-3 mb-10">{entradilla}</div>
        <div className="texto-legal">{children}</div>
      </div>
    </article>
  );
}

/** Privacidad, Cookies y Términos: llevan la fecha de la última revisión. */
export function PaginaLegal({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <PaginaTexto
      etiqueta="Legal"
      titulo={titulo}
      entradilla={
        <p className="font-mono text-[0.76rem] text-text-faint">
          Última actualización: {FECHA_TEXTOS_LEGALES}
        </p>
      }
    >
      {children}
    </PaginaTexto>
  );
}
