import type { Metadata } from "next";
import { FormularioEvento } from "@/components/formulario-evento";
import { Icon } from "@/components/icon";

export const metadata: Metadata = {
  title: "Añadir evento — RadarTech",
  description:
    "¿Organizas un evento tecnológico en España? Añádelo a la agenda de RadarTech.",
};

export default function PaginaAnadirEvento() {
  return (
    <section className="wrap pt-14 pb-[100px]">
      <div className="max-w-[640px]">
        <p className="eyebrow">Organizadores</p>
        <h1 className="mt-3.5 text-[clamp(1.9rem,3.6vw,2.6rem)]">
          ¿Organizas un evento tecnológico?
        </h1>
        <p className="mt-3.5 mb-10 text-text-dim">
          Añádelo a nuestra agenda. Revisamos cada envío antes de publicarlo
          para mantener la calidad del radar.
        </p>

        <FormularioEvento />

        <div className="mt-7 flex gap-3 rounded-md border border-line px-[18px] py-4 text-[0.86rem] text-text-dim">
          <Icon
            name="info"
            size={18}
            className="mt-0.5 flex-none text-orange"
          />
          <span>
            Todos los eventos pasan por aprobación manual antes de publicarse.
            Te contactaremos si necesitamos algo más.
          </span>
        </div>
      </div>
    </section>
  );
}
