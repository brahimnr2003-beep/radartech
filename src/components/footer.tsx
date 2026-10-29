import Link from "next/link";
import { Logo } from "./logo";

const FOOTER_COLUMNS = [
  {
    title: "Explorar",
    links: [
      { href: "/#mapa", label: "Mapa" },
      { href: "/eventos", label: "Eventos" },
      { href: "/#categorias", label: "Categorías" },
    ],
  },
  {
    title: "Organizadores",
    links: [
      { href: "/anadir-evento", label: "Añadir evento" },
      { href: "/promociona-tu-evento", label: "Promociona tu evento" },
    ],
  },
  {
    title: "Proyecto",
    links: [
      { href: "/sobre-nosotros", label: "Sobre nosotros" },
      { href: "/contacto", label: "Contacto" },
    ],
  },
];

// Atribución que exigen las licencias de las fuentes del recolector
const FUENTES_DATOS = [
  {
    nombre: "eventos.wiki",
    url: "https://eventos.wiki",
    licencia: "CC BY 4.0",
    urlLicencia: "https://creativecommons.org/licenses/by/4.0/deed.es",
  },
  {
    nombre: "agenda-tech",
    url: "https://agenda-tech.h1756.es",
    licencia: "CC BY 4.0",
    urlLicencia: "https://creativecommons.org/licenses/by/4.0/deed.es",
  },
  {
    nombre: "confs.tech",
    url: "https://github.com/tech-conferences/conference-data",
    licencia: "MIT",
    urlLicencia:
      "https://github.com/tech-conferences/conference-data/blob/main/LICENSE",
  },
];

const LEGAL_LINKS = [
  { href: "/privacidad", label: "Privacidad" },
  { href: "/cookies", label: "Cookies" },
  { href: "/terminos", label: "Términos" },
  { href: "/contacto", label: "Contacto" },
];

export function Footer() {
  return (
    <footer className="mt-10 border-t border-line pt-14 pb-8">
      <div className="wrap">
        <div className="mb-10 flex flex-wrap justify-between gap-8">
          <div>
            <Logo />
            <p className="mt-3.5 max-w-[260px] text-[0.86rem] text-text-dim">
              El radar del ecosistema tecnológico español.
            </p>
          </div>
          <div className="flex flex-wrap gap-14">
            {FOOTER_COLUMNS.map(({ title, links }) => (
              <div key={title}>
                <h2 className="mb-3.5 font-mono text-[0.72rem] font-normal tracking-[0.14em] text-text-faint uppercase">
                  {title}
                </h2>
                <ul>
                  {links.map(({ href, label }) => (
                    <li key={href} className="mb-2.5">
                      <Link
                        href={href}
                        className="text-[0.9rem] text-text-dim transition-colors hover:text-orange-bright"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap justify-between gap-3 border-t border-line pt-6 font-mono text-[0.76rem] text-text-faint">
          <span>© 2026 RadarTech</span>
          <ul className="flex flex-wrap gap-[22px]">
            {LEGAL_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="hover:text-orange-bright">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-4 font-mono text-[0.7rem] text-text-faint">
          Datos de eventos:{" "}
          {FUENTES_DATOS.map(({ nombre, url, licencia, urlLicencia }, i) => (
            <span key={nombre}>
              {i > 0 && " · "}
              <a href={url} className="hover:text-orange-bright">
                {nombre}
              </a>{" "}
              (
              <a href={urlLicencia} className="hover:text-orange-bright">
                {licencia}
              </a>
              )
            </span>
          ))}
        </p>
      </div>
    </footer>
  );
}
