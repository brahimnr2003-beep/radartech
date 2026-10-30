"use client";

/** Marca o desmarca todas las casillas de eventos del formulario indicado. */
export function SeleccionarTodos({ formulario }: { formulario: string }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 font-mono text-[0.78rem] text-text-dim">
      <input
        type="checkbox"
        className="size-4 accent-orange"
        onChange={(e) => {
          const casillas = document.querySelectorAll<HTMLInputElement>(
            `input[name="ids"][form="${formulario}"]`,
          );
          for (const casilla of casillas) casilla.checked = e.target.checked;
        }}
      />
      Seleccionar todos
    </label>
  );
}
