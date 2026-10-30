import type { Metadata } from "next";
import Link from "next/link";
import { PaginaLegal } from "@/components/pagina-legal";
import { EMAIL_CONTACTO, TITULAR } from "@/lib/proyecto";

export const metadata: Metadata = {
  title: "Política de privacidad — RadarTech",
  description:
    "Qué datos personales trata RadarTech, para qué y cómo ejercer tus derechos.",
};

export default function PaginaPrivacidad() {
  const email = <a href={`mailto:${EMAIL_CONTACTO}`}>{EMAIL_CONTACTO}</a>;
  return (
    <PaginaLegal titulo="Política de privacidad">
      <p>
        RadarTech es un proyecto personal, gratuito y sin ánimo de lucro para
        descubrir eventos tecnológicos en España. Recogemos los mínimos datos
        personales posibles: no hay cuentas de usuario, ni publicidad, ni
        cookies de seguimiento.
      </p>

      <h2>Responsable</h2>
      <p>
        <strong>{TITULAR}</strong>, persona física residente en España.
        Contacto: {email}.
      </p>

      <h2>Qué datos tratamos y para qué</h2>
      <ul>
        <li>
          <strong>Formulario «Añadir evento».</strong> Los datos del evento
          (nombre, fechas, lugar, organizador, enlaces…) sirven para revisarlo
          y, si se aprueba, publicarlo en la web. El{" "}
          <strong>email de contacto no se publica</strong>: solo lo usamos para
          escribirte si necesitamos aclarar algo sobre el evento que propusiste.
        </li>
        <li>
          <strong>Panel de administración.</strong> Solo accede el
          administrador, con su cuenta de GitHub. Para ello se guardan su
          nombre, email, foto de perfil y los datos de la sesión (dirección IP y
          navegador).
        </li>
        <li>
          <strong>Registros técnicos.</strong> El servicio de alojamiento
          registra datos básicos de cada visita (dirección IP, navegador, página
          solicitada) para mantener la web funcionando y segura.
        </li>
        <li>
          <strong>Estadísticas de visitas.</strong> Usamos Vercel Web Analytics
          para saber cuántas personas visitan la web, qué páginas ven, desde qué
          país, con qué tipo de dispositivo y de qué web llegan. No usa cookies
          ni identifica a nadie: los datos son agregados y anónimos, y las
          visitas no se pueden relacionar entre días distintos.
        </li>
      </ul>
      <p>
        Los eventos que publicamos se recopilan de agendas públicas que permiten
        reutilizar sus datos, citadas en cada ficha y en el pie de la web.
      </p>

      <h2>Base legal</h2>
      <ul>
        <li>
          Datos del formulario: tu <strong>consentimiento</strong>, que das al
          enviarlo (art. 6.1.a RGPD). Puedes retirarlo cuando quieras.
        </li>
        <li>
          Seguridad de la web, acceso al panel y estadísticas anónimas de
          visitas: <strong>interés legítimo</strong> en mantener el servicio
          protegido y saber cómo se usa para mejorarlo (art. 6.1.f RGPD).
        </li>
      </ul>

      <h2>Cuánto tiempo los conservamos</h2>
      <p>
        El email de contacto se borra automáticamente <strong>12 meses</strong>{" "}
        después de que termine el evento, o antes si nos lo pides. Los datos de
        un evento publicado se mantienen mientras siga en la web. Los datos de
        sesión del panel se eliminan al caducar la sesión.
      </p>

      <h2>Quién más interviene</h2>
      <p>
        No vendemos ni cedemos datos a nadie. Para funcionar usamos estos
        proveedores, que los tratan solo por nuestra cuenta:
      </p>
      <ul>
        <li>
          <strong>Vercel Inc.</strong> (alojamiento web y estadísticas de
          visitas, Estados Unidos), con las garantías del Marco de Privacidad de
          Datos UE-EE. UU. y las cláusulas contractuales tipo de la Comisión
          Europea.
        </li>
        <li>
          <strong>Neon</strong> (base de datos), con los datos guardados en
          servidores de Fráncfort (Unión Europea).
        </li>
        <li>
          <strong>GitHub</strong>, solo para el inicio de sesión del
          administrador.
        </li>
      </ul>
      <p>
        Los datos del formulario no se envían a ningún servicio de inteligencia
        artificial.
      </p>

      <h2>Contenido de otras webs</h2>
      <p>
        Los carteles de los eventos se cargan directamente desde la web de cada
        organizador o agenda, así que tu navegador se conecta a esos servidores
        (no les indicamos desde qué página vienes). Los enlaces «Ver evento
        oficial» llevan a webs de terceros con sus propias políticas de
        privacidad.
      </p>

      <h2>Tus derechos</h2>
      <p>
        Puedes pedir el acceso, la rectificación o la supresión de tus datos,
        oponerte a su tratamiento, solicitar su limitación o su portabilidad
        escribiendo a {email}. Si crees que no hemos atendido bien tu solicitud,
        puedes reclamar ante la{" "}
        <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">
          Agencia Española de Protección de Datos
        </a>
        .
      </p>

      <h2>Cookies</h2>
      <p>
        La web pública no usa cookies. Consulta los detalles en la{" "}
        <Link href="/cookies">política de cookies</Link>.
      </p>
    </PaginaLegal>
  );
}
