import type { Metadata } from "next";
import Link from "next/link";
import { PaginaTexto } from "@/components/pagina-legal";
import { CATEGORIAS } from "@/lib/categorias";
import {
  TITULAR,
  URL_GITHUB,
  URL_LINKEDIN,
  URL_REPOSITORIO,
} from "@/lib/proyecto";

export const metadata: Metadata = {
  title: "Sobre nosotros",
  alternates: { canonical: "/sobre-nosotros" },
  description:
    "Qué es RadarTech, cómo reúne los eventos tecnológicos de España y quién está detrás del proyecto.",
};

export default function PaginaSobreNosotros() {
  return (
    <PaginaTexto
      etiqueta="Proyecto"
      titulo="Sobre RadarTech"
      entradilla={
        <p className="text-[1.05rem] text-text-dim">
          Los eventos tecnológicos de España, en un solo mapa.
        </p>
      }
    >
      <h2>Por qué existe</h2>
      <p>
        La información sobre eventos tecnológicos está repartida entre webs de
        empresas, universidades, asociaciones, plataformas de entradas y redes
        sociales. Enterarse de lo que pasa cerca de ti obliga a mirar en muchos
        sitios a la vez.
      </p>
      <p>
        RadarTech los reúne en un{" "}
        <strong>mapa por comunidades autónomas</strong> para que puedas
        descubrir conferencias, meetups, hackathones y talleres de un vistazo,
        filtrarlos y llegar a la web oficial de cada uno. Es gratis y no hace
        falta registrarse.
      </p>

      <h2>De dónde salen los eventos</h2>
      <ul>
        <li>
          <strong>Agendas abiertas.</strong> Cada día se consultan agendas
          públicas de eventos tecnológicos que permiten reutilizar sus datos
          (las citamos en el pie de la web).
        </li>
        <li>
          <strong>Búsqueda con inteligencia artificial.</strong> Un proceso
          automático busca eventos en internet, sobre todo en las comunidades
          con menos actividad, y extrae sus datos de la web oficial.
        </li>
        <li>
          <strong>Organizadores.</strong> Cualquiera puede proponer un evento
          desde <Link href="/anadir-evento">Añadir evento</Link>.
        </li>
      </ul>
      <p>
        Lo que llega por la búsqueda automática o por el formulario{" "}
        <strong>lo revisa una persona antes de publicarse</strong>. Cada ficha
        enlaza a la web oficial del evento, que es donde se confirman la fecha,
        el precio y las entradas.
      </p>

      <h2>Qué tipo de eventos</h2>
      <p>
        Eventos tecnológicos relevantes en seis categorías:{" "}
        {CATEGORIAS.map((c) => c.nombre).join(" · ")}. Los eventos que ya han
        pasado desaparecen solos de la web.
      </p>

      <h2>Quién está detrás</h2>
      <p>
        RadarTech es un proyecto personal de <strong>{TITULAR}</strong>, que lo
        ha diseñado y desarrollado de principio a fin: la web, la base de datos,
        la recopilación automática de eventos y el panel de revisión.
      </p>
      <ul>
        <li>
          <a href={URL_LINKEDIN} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        </li>
        <li>
          <a href={URL_GITHUB} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </li>
        <li>
          <a href={URL_REPOSITORIO} target="_blank" rel="noopener noreferrer">
            Código de RadarTech
          </a>
        </li>
      </ul>
      <p>
        ¿Tienes una sugerencia o has visto un error?{" "}
        <Link href="/contacto">Escríbenos</Link>.
      </p>
    </PaginaTexto>
  );
}
