"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { authCliente } from "@/lib/auth-cliente";

/** Botón «Entrar con GitHub». */
export function EntrarConGitHub() {
  const [cargando, setCargando] = useState(false);
  return (
    <button
      type="button"
      disabled={cargando}
      onClick={() => {
        setCargando(true);
        authCliente.signIn.social({
          provider: "github",
          callbackURL: "/admin",
          // Si GitHub devuelve otra cuenta, el registro se bloquea y vuelve aquí
          errorCallbackURL: "/admin?error=acceso",
        });
      }}
      className="btn btn-primary disabled:opacity-60"
    >
      {cargando ? "Abriendo GitHub…" : "Entrar con GitHub"}
    </button>
  );
}

export function CerrarSesion() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={async () => {
        await authCliente.signOut();
        router.refresh();
      }}
      className="btn btn-ghost"
    >
      Cerrar sesión
    </button>
  );
}
