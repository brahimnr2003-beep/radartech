import type { Metadata } from "next";
import Link from "next/link";
import { PaginaTexto } from "@/components/pagina-legal";
import { EMAIL_CONTACTO } from "@/lib/proyecto";

export const metadata: Metadata = {
  title: "Promociona tu evento",
  alternates: { canonical: "/promociona-tu-evento" },
  description:
    "Destaca tu evento tecnológico en RadarTech: aparece el primero en su comunidad y en el listado de toda España.",
};

const ASUNTO = encodeURIComponent("Promocionar un evento");

export default function PaginaPromociona() {
  return (
    <PaginaTexto
      etiqueta="Organizadores"
      titulo="Promociona tu evento"
      entradilla={
        <p className="text-[1.05rem] text-text-dim">
          Haz que tu evento sea lo primero que ve quien busca en tu comunidad.
        </p>
      }
    >
      <h2>Qué es un evento destacado</h2>
      <ul>
        <li>
          Aparece <strong>el primero</strong>, en la sección «Destacados», en la
          página de su comunidad y en el listado de todos los eventos de España.
        </li>
        <li>
          Su tarjeta lleva el <strong>borde naranja</strong> y la etiqueta «★
          Destacado», para que se distinga del resto.
        </li>
        <li>
          Sigue enlazando a tu web oficial: las entradas y los datos los
          gestionas tú, como siempre.
        </li>
      </ul>
      <p>
        También destacamos por nuestra cuenta algunos eventos por su relevancia,
        así que la etiqueta no siempre significa que el evento esté patrocinado.
      </p>

      <h2>Cómo solicitarlo</h2>
      <ol className="mb-4 list-decimal pl-5 marker:font-mono marker:text-orange">
        <li className="mb-1.5">
          Si tu evento todavía no está en RadarTech, envíalo desde{" "}
          <Link href="/anadir-evento">Añadir evento</Link>.
        </li>
        <li className="mb-1.5">
          Escríbenos a{" "}
          <a href={`mailto:${EMAIL_CONTACTO}?subject=${ASUNTO}`}>
            {EMAIL_CONTACTO}
          </a>{" "}
          con el nombre del evento y su web oficial, y te contamos cómo
          funciona.
        </li>
      </ol>
      <p>
        Solo promocionamos eventos tecnológicos que cumplan los mismos criterios
        que el resto de la web: que sean reales, tengan web oficial y encajen en
        alguna de nuestras categorías.
      </p>
    </PaginaTexto>
  );
}
