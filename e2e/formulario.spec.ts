import { expect, test } from "@playwright/test";

test("el formulario vacío no se envía y marca los campos obligatorios", async ({
  page,
}) => {
  await page.goto("/anadir-evento");
  const nombre = page.getByLabel("Nombre del evento");

  await page.getByRole("button", { name: "Enviar para revisión" }).click();

  // El navegador bloquea el envío y lleva el foco al primer campo vacío
  await expect(page).toHaveURL("/anadir-evento");
  await expect(nombre).toBeFocused();
  expect(
    await nombre.evaluate(
      (campo: HTMLInputElement) => campo.validity.valueMissing,
    ),
  ).toBe(true);
  // No llega al servidor: no hay aviso de error del envío
  await expect(page.locator("form").getByRole("alert")).toHaveCount(0);
});
