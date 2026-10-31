// Plantilla de las imágenes que se ven al compartir un enlace (Open Graph).
// Se dibujan con next/og, que solo admite estilos en línea y flexbox.
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const TAMANO_IMAGEN = { width: 1200, height: 630 };

// Colores del tema (los mismos tokens que globals.css)
const COLOR = {
  fondo: "#0a0a0b",
  texto: "#f2f0ec",
  tenue: "#9a988f",
  naranja: "#ff6a1a",
  linea: "rgba(255,255,255,.14)",
};

const leerFuente = (archivo: string) =>
  readFile(join(process.cwd(), "src/assets/fuentes", archivo));

/** Imagen de 1200×630 con el logo, una etiqueta, un titular y un pie. */
export async function imagenCompartir({
  etiqueta,
  titulo,
  resaltado,
  pie,
}: {
  etiqueta: string;
  titulo: string;
  /** Palabra del titular que va en naranja */
  resaltado?: string;
  pie: string;
}) {
  const [display, mono] = await Promise.all([
    leerFuente("SpaceGrotesk-Bold.woff"),
    leerFuente("JetBrainsMono-Medium.woff"),
  ]);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 72px",
        backgroundColor: COLOR.fondo,
        backgroundImage:
          "radial-gradient(circle at 100% 0%, rgba(255,106,26,.18) 0%, rgba(10,10,11,0) 55%)",
        color: COLOR.texto,
        fontFamily: "Space Grotesk",
        borderBottom: `10px solid ${COLOR.naranja}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            width: 18,
            height: 18,
            borderRadius: 9,
            background: COLOR.naranja,
            boxShadow: `0 0 24px ${COLOR.naranja}`,
          }}
        />
        <div style={{ fontSize: 40 }}>RadarTech</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        <div
          style={{
            display: "flex",
            alignSelf: "flex-start",
            border: `2px solid ${COLOR.linea}`,
            borderRadius: 999,
            padding: "8px 22px",
            fontFamily: "JetBrains Mono",
            fontSize: 24,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: COLOR.naranja,
          }}
        >
          {etiqueta}
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            fontSize: titulo.length > 60 ? 60 : 76,
            lineHeight: 1.08,
            letterSpacing: -1.5,
            maxWidth: 1000,
          }}
        >
          {/* Palabra a palabra: next/og no admite texto anidado con estilos */}
          {titulo.split(" ").map((palabra, i) => (
            <span
              key={i}
              style={{
                marginRight: 20,
                color: palabra === resaltado ? COLOR.naranja : COLOR.texto,
              }}
            >
              {palabra}
            </span>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          fontFamily: "JetBrains Mono",
          fontSize: 28,
          color: COLOR.tenue,
        }}
      >
        {pie}
      </div>
    </div>,
    {
      ...TAMANO_IMAGEN,
      fonts: [
        { name: "Space Grotesk", data: display, weight: 700, style: "normal" },
        { name: "JetBrains Mono", data: mono, weight: 500, style: "normal" },
      ],
    },
  );
}
