import { defineConfig, devices } from "@playwright/test";

// Pruebas de extremo a extremo: abren la web compilada en un navegador real.
// Uso: npm run build && npm run test:e2e (con la base de datos levantada).
const PUERTO = 3100;

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://localhost:${PUERTO}`,
    locale: "es-ES",
    timezoneId: "Europe/Madrid",
    trace: "on-first-retry",
  },
  projects: [{ name: "escritorio", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `npm run start -- -p ${PUERTO}`,
    url: `http://localhost:${PUERTO}`,
    reuseExistingServer: !process.env.CI,
  },
});
