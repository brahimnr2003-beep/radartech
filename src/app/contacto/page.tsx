import type { Metadata } from "next";
import Link from "next/link";
import { PaginaTexto } from "@/components/pagina-legal";
import { EMAIL_CONTACTO } from "@/lib/proyecto";

export const metadata: Metadata = {
  title: "Contacto",
  alternates: { canonical: "/contacto" },
  description:
    "Escríbenos para corregir un evento, promocionar el tuyo, colaborar con RadarTech o ejercer tus derechos de privacidad.",
};

export default function PaginaContacto() {
  const email = <a href={`mailto:${EMAIL_CONTACTO}`}>{EMAIL_CONTACTO}</a>;
  return (
    <PaginaTexto
      etiqueta="Proyecto"
      titulo="Contacto"
      entradilla={
        <a href={`mailto:${EMAIL_CONTACTO}`} className="btn btn-primary mt-3">
          {EMAIL_CONTACTO}
        </a>
      }
    >
      <p>
        La forma de contactar con RadarTech es por email, en {email}. Para que
        podamos ayudarte antes, cuéntanos en el asunto de qué se trata:
      </p>

      <h2>Un evento tiene un error o ya no se celebra</h2>
      <p>
        Indica el enlace de la ficha en RadarTech y qué hay que corregir (fecha,
        lugar, precio…). Si eres el organizador y prefieres que no aparezca, lo
        retiramos.
      </p>

      <h2>Organizas un evento</h2>
      <p>
        Para que aparezca en la web, envíalo desde{" "}
        <Link href="/anadir-evento">Añadir evento</Link>: es la vía más rápida.
        Si quieres darle más visibilidad, mira{" "}
        <Link href="/promociona-tu-evento">Promociona tu evento</Link>.
      </p>

      <h2>Colaboraciones y patrocinios</h2>
      <p>
        Si eres una empresa, comunidad o universidad y quieres colaborar con el
        proyecto, escríbenos y lo hablamos.
      </p>

      <h2>Privacidad</h2>
      <p>
        Para acceder, corregir o borrar tus datos, escribe a la misma dirección.
        Tienes los detalles en la{" "}
        <Link href="/privacidad">política de privacidad</Link>.
      </p>
    </PaginaTexto>
  );
}
