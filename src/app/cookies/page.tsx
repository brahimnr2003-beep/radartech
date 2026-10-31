import type { Metadata } from "next";
import Link from "next/link";
import { PaginaLegal } from "@/components/pagina-legal";

export const metadata: Metadata = {
  title: "Política de cookies",
  alternates: { canonical: "/cookies" },
  description: "RadarTech no usa cookies de análisis ni de publicidad.",
};

export default function PaginaCookies() {
  return (
    <PaginaLegal titulo="Política de cookies">
      <p>
        Las cookies son pequeños archivos que una web guarda en tu navegador.
        RadarTech{" "}
        <strong>
          no usa cookies de análisis, de publicidad ni de redes sociales
        </strong>
        , por eso no te mostramos ningún aviso para aceptarlas.
      </p>

      <h2>Cookies que usamos</h2>
      <p>
        Solo las del{" "}
        <strong>inicio de sesión del panel de administración</strong>, que
        únicamente se crean si el administrador entra en él. Son técnicas y
        necesarias para que el panel funcione, así que la ley no exige pedir
        consentimiento para ellas (art. 22.2 de la LSSI).
      </p>
      <ul>
        <li>
          <code>better-auth.session_token</code>: mantiene la sesión iniciada
          del administrador. Caduca a los 7 días o al cerrar sesión.
        </li>
        <li>
          <code>better-auth.oauth_state</code> y similares: protegen el inicio
          de sesión con GitHub mientras se completa. Duran unos minutos.
        </li>
      </ul>
      <p>
        Si navegas por la web pública (mapa, eventos, formulario) no se guarda
        ninguna cookie en tu navegador.
      </p>

      <p>
        Las estadísticas de visitas (Vercel Web Analytics) funcionan sin cookies
        ni almacenamiento en tu navegador.
      </p>

      <h2>Contenido de otras webs</h2>
      <p>
        Los carteles de los eventos se cargan desde la web de cada organizador.
        Esos servidores podrían intentar guardar sus propias cookies, que no
        controlamos. Puedes bloquearlas desde la configuración de tu navegador
        sin que la web deje de funcionar.
      </p>

      <h2>Más información</h2>
      <p>
        Para saber cómo tratamos los datos personales, consulta la{" "}
        <Link href="/privacidad">política de privacidad</Link>.
      </p>
    </PaginaLegal>
  );
}
