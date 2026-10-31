import { describe, expect, it } from "vitest";
import type { Evento } from "./eventos";
import { datosEstructuradosEvento, desfaseMadrid, jsonLd } from "./seo";

const evento: Evento = {
  slug: "pycones-barcelona-2026",
  nombre: "PyConES Barcelona 2026",
  descripcion: "Conferencia anual de la comunidad Python en España.",
  fecha: "2026-11-06",
  fechaFin: "2026-11-08",
  hora: "09:30",
  comunidad: "cataluna",
  provincia: "Barcelona",
  ciudad: "Barcelona",
  categoria: "software",
  tipo: "conferencia",
  modalidad: "presencial",
  precioDesde: null,
  urlOficial: "https://2026.es.pycon.org/",
  destacado: false,
};

describe("datos estructurados", () => {
  it("usa el horario de invierno o de verano de España", () => {
    expect(desfaseMadrid("2026-11-06")).toBe("+01:00");
    expect(desfaseMadrid("2026-07-01")).toBe("+02:00");
  });

  it("describe un evento presencial con fecha, hora y lugar", () => {
    const datos = datosEstructuradosEvento(evento);
    expect(datos).toMatchObject({
      "@type": "Event",
      startDate: "2026-11-06T09:30:00+01:00",
      endDate: "2026-11-08",
      location: {
        address: { addressLocality: "Barcelona", addressCountry: "ES" },
      },
    });
    // Sin precio conocido no se inventa una oferta
    expect(datos).not.toHaveProperty("offers");
  });

  it("marca los eventos online con ubicación virtual y precio si lo hay", () => {
    const datos = datosEstructuradosEvento({
      ...evento,
      modalidad: "online",
      hora: undefined,
      precioDesde: 0,
    });
    expect(datos.startDate).toBe("2026-11-06");
    expect(datos.location).toMatchObject({ "@type": "VirtualLocation" });
    expect(datos).toMatchObject({ offers: { price: 0, priceCurrency: "EUR" } });
  });

  it("escapa los «<» para no cerrar la etiqueta script", () => {
    expect(jsonLd({ nombre: "</script>" })).not.toContain("</script>");
  });
});
