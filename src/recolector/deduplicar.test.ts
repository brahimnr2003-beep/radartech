import { describe, expect, it } from "vitest";
import { deduplicar, sonElMismoEvento } from "./deduplicar";
import type { EventoBruto } from "./tipos";

const bruto = (datos: Partial<EventoBruto>): EventoBruto => ({
  fuente: "eventos.wiki",
  idExterno: "id",
  nombre: "Evento",
  inicio: "2026-11-06",
  url: "https://eventos.wiki/events/evento",
  urlFuente: "https://eventos.wiki/events/evento",
  ...datos,
});

describe("sonElMismoEvento", () => {
  it("reconoce el mismo evento con nombres distintos el mismo día", () => {
    expect(
      sonElMismoEvento(
        bruto({ nombre: "PyConES Barcelona 2026", inicio: "2026-11-06T09:00" }),
        bruto({ nombre: "PyConEs", inicio: "2026-11-06T16:30:00" }),
      ),
    ).toBe(true);
    expect(
      sonElMismoEvento(
        bruto({ nombre: "X-Ops Conference (copia)", inicio: "2026-11-19" }),
        bruto({ nombre: "X-Ops Conference Madrid", inicio: "2026-11-19" }),
      ),
    ).toBe(true);
  });

  it("distingue eventos distintos aunque coincidan en fecha", () => {
    expect(
      sonElMismoEvento(
        bruto({ nombre: "Lambda World" }),
        bruto({ nombre: "J On the Beach" }),
      ),
    ).toBe(false);
  });

  it("distingue el mismo nombre en fechas distintas", () => {
    expect(
      sonElMismoEvento(
        bruto({ nombre: "Codemotion Madrid", inicio: "2026-05-12" }),
        bruto({ nombre: "Codemotion Madrid", inicio: "2027-05-12" }),
      ),
    ).toBe(false);
  });
});

describe("deduplicar", () => {
  it("se queda con la fuente prioritaria y completa los huecos con las demás", () => {
    const [evento, ...resto] = deduplicar([
      bruto({
        fuente: "confs.tech",
        idExterno: "confs.tech:x",
        nombre: "X-Ops Conference Madrid",
        url: "https://xopsconference.com",
        ciudad: "Madrid",
      }),
      bruto({
        fuente: "eventos.wiki",
        idExterno: "eventos.wiki:x",
        nombre: "X-Ops Conference (copia)",
        descripcion: "Conferencia de DevOps",
      }),
    ]);
    expect(resto).toHaveLength(0);
    expect(evento).toMatchObject({
      idExterno: "eventos.wiki:x",
      descripcion: "Conferencia de DevOps",
      ciudad: "Madrid",
      // La web oficial sustituye al enlace del agregador
      url: "https://xopsconference.com",
    });
  });

  it("mantiene los eventos distintos", () => {
    expect(
      deduplicar([
        bruto({ nombre: "Lambda World" }),
        bruto({ nombre: "J On the Beach" }),
      ]),
    ).toHaveLength(2);
  });
});
