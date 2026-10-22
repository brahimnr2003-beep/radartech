import { describe, expect, it } from "vitest";
import type { Evento } from "./eventos";
import { filtrarEventos, leerFiltros, opcionesUbicacion } from "./filtros";

const evento = (datos: Partial<Evento>): Evento => ({
  slug: "evento",
  nombre: "Evento",
  descripcion: "",
  fecha: "2026-11-15",
  comunidad: "andalucia",
  provincia: "Málaga",
  ciudad: "Málaga",
  categoria: "ia",
  tipo: "meetup",
  modalidad: "presencial",
  precioDesde: 0,
  organizador: "Organizador",
  urlOficial: "https://example.com",
  destacado: false,
  ...datos,
});

const slugs = (eventos: Evento[]) => eventos.map((e) => e.slug);

describe("filtrarEventos", () => {
  const HOY = "2026-10-23";

  it("sin filtros devuelve todos los eventos", () => {
    const eventos = [evento({ slug: "a" }), evento({ slug: "b" })];
    expect(filtrarEventos(eventos, {}, HOY)).toEqual(eventos);
  });

  it("filtra por los próximos 7 días, ambos extremos incluidos", () => {
    const eventos = [
      evento({ slug: "ayer", fecha: "2026-10-22" }),
      evento({ slug: "hoy", fecha: "2026-10-23" }),
      evento({ slug: "dentro-de-7", fecha: "2026-10-30" }),
      evento({ slug: "dentro-de-8", fecha: "2026-10-31" }),
    ];
    expect(slugs(filtrarEventos(eventos, { fecha: "7-dias" }, HOY))).toEqual([
      "hoy",
      "dentro-de-7",
    ]);
  });

  it("«este mes» incluye lo que queda del mes en curso", () => {
    const eventos = [
      evento({ slug: "pasado", fecha: "2026-10-01" }),
      evento({ slug: "final-de-mes", fecha: "2026-10-31" }),
      evento({ slug: "mes-siguiente", fecha: "2026-11-01" }),
    ];
    expect(slugs(filtrarEventos(eventos, { fecha: "este-mes" }, HOY))).toEqual([
      "final-de-mes",
    ]);
  });

  it("«próximos meses» empieza el mes siguiente, también al cambiar de año", () => {
    const eventos = [
      evento({ slug: "diciembre", fecha: "2026-12-20" }),
      evento({ slug: "enero", fecha: "2027-01-10" }),
    ];
    expect(
      slugs(filtrarEventos(eventos, { fecha: "proximos-meses" }, "2026-12-15")),
    ).toEqual(["enero"]);
  });

  it("distingue eventos gratuitos y de pago", () => {
    const eventos = [
      evento({ slug: "gratis", precioDesde: 0 }),
      evento({ slug: "pago", precioDesde: 20 }),
    ];
    expect(slugs(filtrarEventos(eventos, { precio: "gratuito" }, HOY))).toEqual(
      ["gratis"],
    );
    expect(slugs(filtrarEventos(eventos, { precio: "de-pago" }, HOY))).toEqual([
      "pago",
    ]);
  });

  it("filtra por comunidad", () => {
    const eventos = [
      evento({ slug: "andalucia", comunidad: "andalucia" }),
      evento({ slug: "madrid", comunidad: "madrid" }),
    ];
    expect(
      slugs(filtrarEventos(eventos, { comunidad: "madrid" }, HOY)),
    ).toEqual(["madrid"]);
  });

  it("combina varios filtros a la vez", () => {
    const eventos = [
      evento({ slug: "ia-online", categoria: "ia", modalidad: "online" }),
      evento({ slug: "ia-presencial", categoria: "ia" }),
      evento({ slug: "data-online", categoria: "data", modalidad: "online" }),
    ];
    expect(
      slugs(
        filtrarEventos(eventos, { categoria: "ia", modalidad: "online" }, HOY),
      ),
    ).toEqual(["ia-online"]);
  });

  it("filtra por provincia, ciudad y tipo", () => {
    const eventos = [
      evento({ slug: "malaga", provincia: "Málaga", ciudad: "Málaga" }),
      evento({
        slug: "marbella",
        provincia: "Málaga",
        ciudad: "Marbella",
        tipo: "taller",
      }),
      evento({ slug: "sevilla", provincia: "Sevilla", ciudad: "Sevilla" }),
    ];
    expect(
      slugs(filtrarEventos(eventos, { provincia: "Málaga" }, HOY)),
    ).toEqual(["malaga", "marbella"]);
    expect(slugs(filtrarEventos(eventos, { ciudad: "Marbella" }, HOY))).toEqual(
      ["marbella"],
    );
    expect(slugs(filtrarEventos(eventos, { tipo: "taller" }, HOY))).toEqual([
      "marbella",
    ]);
  });
});

describe("leerFiltros", () => {
  it("lee los filtros válidos de la URL", () => {
    const params = new URLSearchParams(
      "fecha=este-mes&categoria=ia&provincia=Málaga&precio=gratuito",
    );
    expect(leerFiltros(params)).toMatchObject({
      fecha: "este-mes",
      categoria: "ia",
      provincia: "Málaga",
      precio: "gratuito",
    });
  });

  it("ignora valores desconocidos", () => {
    const params = new URLSearchParams("categoria=cocina&fecha=ayer&tipo=x");
    const filtros = leerFiltros(params);
    expect(filtros.categoria).toBeUndefined();
    expect(filtros.fecha).toBeUndefined();
    expect(filtros.tipo).toBeUndefined();
  });
});

describe("opcionesUbicacion", () => {
  it("agrupa las ciudades por provincia, sin repetir y en orden alfabético", () => {
    const eventos = [
      evento({ provincia: "Sevilla", ciudad: "Sevilla" }),
      evento({ provincia: "Málaga", ciudad: "Marbella" }),
      evento({ provincia: "Málaga", ciudad: "Málaga" }),
      evento({ provincia: "Málaga", ciudad: "Málaga" }),
    ];
    expect(opcionesUbicacion(eventos)).toEqual([
      { provincia: "Málaga", ciudades: ["Málaga", "Marbella"] },
      { provincia: "Sevilla", ciudades: ["Sevilla"] },
    ]);
  });
});
