import { describe, expect, it } from "vitest";
import { validarEnvio } from "./envio-evento";

const HOY = "2026-10-30";

const valido = {
  nombre: "Málaga JS Meetup",
  descripcion: "Charlas sobre JavaScript y TypeScript para la comunidad local.",
  fecha: "2026-11-20",
  fechaFin: "",
  hora: "18:30",
  comunidad: "andalucia",
  provincia: "Málaga",
  ciudad: "Málaga",
  lugar: "",
  categoria: "software",
  tipo: "meetup",
  modalidad: "presencial",
  precioDesde: "0",
  urlOficial: "https://malagajs.org/noviembre",
  imagenUrl: "",
  organizador: "Málaga JS",
  email: "hola@malagajs.org",
};

describe("validarEnvio", () => {
  it("acepta un envío completo y convierte los campos vacíos en ausentes", () => {
    const r = validarEnvio(valido, HOY);
    expect(r.success).toBe(true);
    expect(r.data).toMatchObject({ precioDesde: 0, hora: "18:30" });
    expect(r.data?.fechaFin).toBeUndefined();
    expect(r.data?.imagenUrl).toBeUndefined();
  });

  it("deja el precio sin rellenar como desconocido", () => {
    const r = validarEnvio({ ...valido, precioDesde: "" }, HOY);
    expect(r.data?.precioDesde).toBeUndefined();
  });

  it("rechaza eventos pasados y fechas de fin anteriores al inicio", () => {
    const pasado = validarEnvio({ ...valido, fecha: "2026-10-01" }, HOY);
    expect(pasado.error?.issues[0].path).toEqual(["fecha"]);
    const fin = validarEnvio({ ...valido, fechaFin: "2026-11-19" }, HOY);
    expect(fin.error?.issues[0].path).toEqual(["fechaFin"]);
  });

  it("rechaza enlaces que no son web, valores fuera de lista y descripciones cortas", () => {
    const r = validarEnvio(
      {
        ...valido,
        urlOficial: "javascript:alert(1)",
        comunidad: "narnia",
        descripcion: "Corta",
      },
      HOY,
    );
    const campos = r.error?.issues.map((i) => i.path[0]);
    expect(campos).toEqual(
      expect.arrayContaining(["urlOficial", "comunidad", "descripcion"]),
    );
  });
});
