import { FECHA_TEXTOS_LEGALES } from "@/lib/proyecto";

/** Plantilla común de Privacidad, Cookies y Términos. */
export function PaginaLegal({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <article className="wrap pt-14 pb-[100px]">
      <div className="max-w-[720px]">
        <p className="eyebrow">Legal</p>
        <h1 className="mt-3.5 text-[clamp(1.9rem,3.6vw,2.6rem)]">{titulo}</h1>
        <p className="mt-3 mb-10 font-mono text-[0.76rem] text-text-faint">
          Última actualización: {FECHA_TEXTOS_LEGALES}
        </p>
        <div className="texto-legal">{children}</div>
      </div>
    </article>
  );
}
