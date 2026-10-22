import Link from "next/link";
import { Logo } from "./logo";

const NAV_LINKS = [
  { href: "/#mapa", label: "Mapa" },
  { href: "/eventos", label: "Eventos" },
  { href: "/#categorias", label: "Categorías" },
  { href: "/anadir-evento", label: "Añadir evento" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-100 border-b border-line bg-bg/78 backdrop-blur-[14px]">
      <nav
        aria-label="Principal"
        className="mx-auto flex h-16 max-w-content items-center justify-between px-5 sm:h-[72px] sm:px-8"
      >
        <Logo />
        <ul className="hidden gap-9 text-[0.9rem] text-text-dim min-[900px]:flex">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} className="transition-colors hover:text-text">
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/anadir-evento"
          className="btn btn-ghost px-[18px] py-2.5 text-[0.75rem]"
        >
          <span className="max-[520px]:hidden">Publica tu evento</span>
          <span className="min-[521px]:hidden">Publicar</span>
        </Link>
      </nav>
    </header>
  );
}
