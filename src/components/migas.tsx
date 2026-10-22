import Link from "next/link";

/** Ruta de navegación: España / Comunidad / Evento */
export function Migas({
  enlaces,
  actual,
}: {
  enlaces: { href: string; texto: string }[];
  actual: string;
}) {
  return (
    <nav aria-label="Ruta de navegación" className="wrap pt-7">
      <ol className="flex flex-wrap items-center gap-2 font-mono text-[0.8rem] text-text-faint">
        {enlaces.map(({ href, texto }) => (
          <li key={href} className="flex items-center gap-2">
            <Link
              href={href}
              className="text-text-dim hover:text-orange-bright"
            >
              {texto}
            </Link>
            <span aria-hidden="true">/</span>
          </li>
        ))}
        <li aria-current="page" className="text-text">
          {actual}
        </li>
      </ol>
    </nav>
  );
}
