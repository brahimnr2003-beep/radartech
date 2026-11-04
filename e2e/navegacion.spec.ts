import { expect, test } from "@playwright/test";

// Las pruebas usan los eventos de ejemplo (npm run db:seed)
const tarjetas = (page: import("@playwright/test").Page) =>
  page.locator('main a[href^="/evento/"]');

test("el mapa de la portada lleva a la página de cada comunidad", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Descubre los eventos",
  );

  // Con el ratón
  await page.getByRole("link", { name: /^Madrid, \d+ eventos$/ }).click();
  await expect(page).toHaveURL("/eventos/madrid");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Eventos tecnológicos en Madrid",
  );

  // Con el teclado
  await page.goto("/");
  await page.getByRole("link", { name: /^Cataluña, \d+ eventos$/ }).focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL("/eventos/cataluna");
});

test("los filtros de /eventos reducen la lista y se guardan en la URL", async ({
  page,
}) => {
  await page.goto("/eventos");
  // La barra de escritorio (el panel de móvil repite los mismos controles)
  const categoria = page
    .getByRole("group", { name: "Filtros" })
    .getByLabel("Categoría");
  const total = await tarjetas(page).count();
  expect(total).toBeGreaterThan(0);

  await categoria.selectOption("ia");
  await expect(page).toHaveURL(/categoria=ia/);
  await expect(async () => {
    const filtradas = await tarjetas(page).count();
    expect(filtradas).toBeGreaterThan(0);
    expect(filtradas).toBeLessThan(total);
  }).toPass();
  for (const tarjeta of await tarjetas(page).all()) {
    await expect(tarjeta).toContainText("IA");
  }

  // Al recargar con la URL, el filtro sigue aplicado
  await page.reload();
  await expect(categoria).toHaveValue("ia");
});

test("una tarjeta abre la ficha completa del evento", async ({ page }) => {
  await page.goto("/eventos/madrid");
  const tarjeta = tarjetas(page).first();
  const nombre = await tarjeta.getByRole("heading", { level: 3 }).innerText();

  await tarjeta.click();
  await expect(page).toHaveURL(/\/evento\/[a-z0-9-]+$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(nombre);
  await expect(
    page.getByRole("link", { name: /Ver evento oficial/ }),
  ).toHaveAttribute("href", /^https:\/\//);
});
