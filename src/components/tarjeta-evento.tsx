import Link from "next/link";
import { nombreCategoria } from "@/lib/categorias";
import {
  MODALIDADES,
  formatearFecha,
  formatearPrecio,
  type Evento,
} from "@/lib/eventos";
import { Icon } from "./icon";

export function TarjetaEvento({ evento }: { evento: Evento }) {
  return (
    <Link
      href={`/evento/${evento.slug}`}
      className={`group flex w-full flex-col overflow-hidden rounded-md border bg-bg-1 transition duration-200 hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(0,0,0,.4)] ${
        evento.destacado
          ? "border-orange"
          : "border-line hover:border-orange-dim"
      }`}
    >
      <div className="patron-cuadricula relative flex aspect-[16/10] items-end p-3.5">
        {evento.destacado && (
          <span className="absolute top-3 right-3 z-1 rounded-full border border-orange bg-bg/70 px-[9px] py-1 font-mono text-[0.66rem] text-orange-bright">
            ★ Destacado
          </span>
        )}
        <EtiquetaCategoria>
          {nombreCategoria(evento.categoria)}
        </EtiquetaCategoria>
      </div>
      <div className="flex flex-1 flex-col gap-2.5 px-[18px] pt-[18px] pb-5">
        <h3 className="text-[1.05rem] leading-[1.3]">{evento.nombre}</h3>
        <ul className="flex flex-col gap-1.5 font-mono text-[0.78rem] text-text-dim">
          <DatoTarjeta icono="calendar">
            {formatearFecha(evento.fecha)}
          </DatoTarjeta>
          <DatoTarjeta icono="pin">{evento.ciudad}</DatoTarjeta>
          <DatoTarjeta icono="monitor">
            {MODALIDADES[evento.modalidad]}
          </DatoTarjeta>
        </ul>
        <div className="mt-auto flex items-center justify-between border-t border-line pt-3">
          <span className="font-mono text-[0.8rem] text-orange-bright">
            {formatearPrecio(evento.precioDesde)}
          </span>
          <span className="flex items-center gap-1.5 font-mono text-[0.76rem] text-text-dim group-hover:text-orange-bright">
            Ver evento <Icon name="link" size={12} />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function EtiquetaCategoria({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative z-1 rounded-full border border-white/20 bg-bg/65 px-2.5 py-[5px] font-mono text-[0.68rem] tracking-[0.06em] text-text uppercase backdrop-blur-[6px]">
      {children}
    </span>
  );
}

function DatoTarjeta({
  icono,
  children,
}: {
  icono: "calendar" | "pin" | "monitor";
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-center gap-2">
      <Icon name={icono} size={13} className="flex-none text-text-faint" />
      {children}
    </li>
  );
}
