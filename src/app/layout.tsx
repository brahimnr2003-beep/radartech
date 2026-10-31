import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { Suspense } from "react";
import { Estadisticas } from "@/components/estadisticas";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { DESCRIPCION_WEB, NOMBRE_WEB, URL_WEB } from "@/lib/proyecto";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Base para convertir en absolutas las URL de canónicos e imágenes
  metadataBase: new URL(URL_WEB),
  title: {
    default: `${NOMBRE_WEB} — Eventos tecnológicos de España`,
    // Cada página pone su título y se le añade el nombre de la web
    template: `%s — ${NOMBRE_WEB}`,
  },
  description: DESCRIPCION_WEB,
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: NOMBRE_WEB,
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">
        <Header />
        <main className="flex flex-1 flex-col">{children}</main>
        <Footer />
        <Suspense>
          <Estadisticas />
        </Suspense>
      </body>
    </html>
  );
}
