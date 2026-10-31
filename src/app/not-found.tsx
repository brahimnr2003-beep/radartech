import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Página no encontrada",
};

export default function NotFound() {
  return (
    <section className="wrap flex flex-1 flex-col items-start justify-center gap-6 py-24">
      <p className="eyebrow">Error 404</p>
      <h1 className="text-[clamp(2rem,4vw,3rem)]">Página no encontrada</h1>
      <p className="max-w-[520px] text-text-dim">
        Esta página no existe o todavía está en construcción.
      </p>
      <Link href="/" className="btn btn-primary">
        Volver al mapa <span aria-hidden="true">→</span>
      </Link>
    </section>
  );
}
