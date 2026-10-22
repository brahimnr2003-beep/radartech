"use client";

import { useState } from "react";
import { Icon } from "./icon";

const estiloBoton =
  "flex size-9 items-center justify-center rounded-full border border-line-strong text-text-dim transition-colors hover:border-orange hover:text-text";

export function Compartir({ titulo }: { titulo: string }) {
  const [copiado, setCopiado] = useState(false);

  const copiar = async () => {
    await navigator.clipboard.writeText(location.href);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  // Menú nativo del sistema (móvil); si no existe, se copia el enlace
  const compartir = async () => {
    if (!navigator.share) return copiar();
    try {
      await navigator.share({ title: titulo, url: location.href });
    } catch {
      // El usuario canceló el menú de compartir
    }
  };

  return (
    <div className="mt-1.5 flex items-center gap-2.5">
      <button
        type="button"
        onClick={compartir}
        aria-label="Compartir"
        className={estiloBoton}
      >
        <Icon name="share" size={15} />
      </button>
      <button
        type="button"
        onClick={copiar}
        aria-label="Copiar enlace"
        className={estiloBoton}
      >
        <Icon name="link" size={15} />
      </button>
      <span
        role="status"
        className="font-mono text-[0.76rem] text-orange-bright"
      >
        {copiado && "Enlace copiado"}
      </span>
    </div>
  );
}
