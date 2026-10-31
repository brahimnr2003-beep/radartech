import type { Metadata } from "next";
import Link from "next/link";
import { PaginaLegal } from "@/components/pagina-legal";
import { EMAIL_CONTACTO, TITULAR } from "@/lib/proyecto";

export const metadata: Metadata = {
  title: "Términos de uso",
  alternates: { canonical: "/terminos" },
  description:
    "Condiciones de uso de RadarTech y de la información que publica.",
};

export default function PaginaTerminos() {
  const email = <a href={`mailto:${EMAIL_CONTACTO}`}>{EMAIL_CONTACTO}</a>;
  return (
    <PaginaLegal titulo="Términos de uso">
      <p>
        RadarTech es una agenda gratuita de eventos tecnológicos en España,
        creada y mantenida por <strong>{TITULAR}</strong> como proyecto
        personal. Al usar la web aceptas estas condiciones.
      </p>

      <h2>La información de los eventos</h2>
      <ul>
        <li>
          Los eventos se recopilan de agendas públicas y de propuestas de los
          organizadores, y se revisan antes de publicarse. Aun así, pueden
          contener errores o quedar desactualizados.
        </li>
        <li>
          <strong>La información válida es siempre la del organizador.</strong>{" "}
          Antes de inscribirte o desplazarte, confirma fechas, precio y lugar en
          su web oficial, enlazada en cada ficha.
        </li>
        <li>
          RadarTech no organiza los eventos ni vende entradas, y no responde de
          cambios, cancelaciones o de lo que ocurra en ellos.
        </li>
      </ul>

      <h2>Si propones un evento</h2>
      <ul>
        <li>
          Garantizas que los datos son veraces y que puedes compartirlos,
          incluido el cartel que enlaces.
        </li>
        <li>
          Nos autorizas a publicarlos en RadarTech, a editarlos para corregir
          errores o adaptarlos al formato de la web, y a rechazarlos si no
          encajan con la temática o no son fiables.
        </li>
        <li>
          Cómo tratamos tu email se explica en la{" "}
          <Link href="/privacidad">política de privacidad</Link>.
        </li>
      </ul>

      <h2>Contenido de terceros</h2>
      <p>
        Los nombres, logotipos y carteles de los eventos pertenecen a sus
        organizadores; se muestran solo para identificar cada evento y se cargan
        desde su web de origen. Los datos de eventos de terceros se usan según
        sus licencias, citadas en cada ficha y en el pie de la web. Si eres
        titular de algún contenido y quieres que lo retiremos o corrijamos,
        escríbenos a {email} y lo haremos lo antes posible.
      </p>

      <h2>Uso de la web</h2>
      <p>
        Puedes consultar y compartir la información libremente. No está
        permitido enviar contenido falso, ofensivo o publicitario ajeno a
        eventos tecnológicos, ni usar la web de forma que dificulte su
        funcionamiento.
      </p>

      <h2>Ley aplicable</h2>
      <p>
        Estas condiciones se rigen por la ley española. Para cualquier duda,
        escríbenos a {email}.
      </p>
    </PaginaLegal>
  );
}
