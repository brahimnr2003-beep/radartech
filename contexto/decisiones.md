# Registro de decisiones

Aquí se anota cada decisión técnica del proyecto (stack, hosting, base de datos, servicios de IA, etc.). Una entrada por decisión, la más reciente arriba. Solo se registran decisiones **aprobadas por el propietario**.

## Plantilla

Copia este bloque para cada decisión nueva:

```markdown
### [Área] — Título de la decisión

- **Decisión:** qué se ha elegido.
- **Fecha:** AAAA-MM-DD
- **Motivo:** por qué se ha elegido.
- **Alternativas descartadas:**
  - Alternativa A — por qué se descartó.
  - Alternativa B — por qué se descartó.
```

---

## Stack

Criterios generales: **coste cero** (planes gratuitos sin tarjeta), herramientas demandadas en el mercado laboral y cobertura de los requisitos de `contexto/`.

### [Framework] — Next.js con TypeScript (frontend + backend)

- **Decisión:** Next.js (App Router) con TypeScript para la web, la API, el formulario público y el panel de administración.
- **Fecha:** 2026-10-14
- **Motivo:** las páginas de comunidad y evento necesitan SEO (renderizado en servidor/estático); un solo proyecto cubre front y back; muy demandado.
- **Alternativas descartadas:**
  - Front y back separados (p. ej. React + Express/FastAPI) — más infraestructura y coste de despliegue sin beneficio en esta fase.

### [Base de datos] — PostgreSQL en Neon

- **Decisión:** PostgreSQL alojado en Neon (plan gratuito); Postgres en Docker para desarrollo local.
- **Fecha:** 2026-10-14
- **Motivo:** Postgres es la base de datos más valorada; búsqueda de texto completo útil para filtros. Neon: gratis (1 GB por proyecto), escala a cero, ramas de base de datos para PRs y sin pausas por inactividad.
- **Alternativas descartadas:**
  - Turso (libSQL/SQLite) — plan gratuito generoso, pero SQLite es menos valorado y no es PostgreSQL.
  - Supabase — pausa los proyectos gratuitos tras 7 días sin actividad; la demo quedaría caída.

### [ORM] — Drizzle

- **Decisión:** Drizzle ORM con Drizzle Kit para migraciones.
- **Fecha:** 2026-10-14
- **Motivo:** ligero, cercano a SQL, tipado fuerte y buen soporte para Neon serverless.
- **Alternativas descartadas:**
  - Prisma — más extendido, pero más pesado y menos cercano a SQL.

### [IA] — Gemini API (plan gratuito) vía Vercel AI SDK

- **Decisión:** extracción y clasificación de eventos con modelos Gemini Flash/Flash-Lite del plan gratuito, usando el Vercel AI SDK con salida estructurada validada por Zod.
- **Fecha:** 2026-10-14
- **Motivo:** gratuito sin tarjeta y suficiente para decenas de eventos al día; el AI SDK permite cambiar de proveedor sin reescribir código. Los datos procesados son públicos (el plan gratuito puede usarlos para mejorar los modelos).
- **Alternativas descartadas:**
  - Groq — también gratuito; se mantiene como alternativa intercambiable.
  - Ollama en local — sin límites, pero depende de tener el PC encendido.

### [Estilos] — Tailwind CSS

- **Decisión:** Tailwind CSS, trasladando los tokens del boceto (colores, tipografías, radios) a su tema.
- **Fecha:** 2026-10-14
- **Motivo:** el más demandado; mantiene el sistema de diseño consistente.
- **Alternativas descartadas:**
  - CSS Modules — reaprovecharía el CSS del boceto casi literal, pero es menos demandado.

### [Autenticación] — Better Auth

- **Decisión:** Better Auth con login de GitHub para el panel de administración; usuarios y sesiones en Postgres vía Drizzle.
- **Fecha:** 2026-10-14
- **Motivo:** gratuito, código abierto, TypeScript nativo e integración directa con Drizzle.
- **Alternativas descartadas:**
  - Auth.js (NextAuth) — muy conocido, pero documentación más irregular.

### [Hosting y tareas programadas] — Vercel Hobby + GitHub Actions

- **Decisión:** la web en Vercel (plan Hobby); la recopilación periódica de eventos con IA en workflows programados de GitHub Actions.
- **Fecha:** 2026-10-14
- **Motivo:** ambos gratuitos; las tareas programadas de Vercel Hobby tienen límites de frecuencia dudosos, y GitHub Actions es gratis en repos públicos y demuestra CI/CD.
- **Alternativas descartadas:**
  - Todo en Vercel — riesgo de que las tareas programadas solo se ejecuten una vez al día.
- **Nota:** Vercel Hobby es solo para uso no comercial. Si se monetiza, migrar a Vercel Pro (20 $/mes) u otro hosting.

### [Calidad] — Tests, lint y CI

- **Decisión:** Vitest (unitarios), Playwright (E2E), ESLint + Prettier y CI en GitHub Actions (lint, tipos y tests en cada push/PR).
- **Fecha:** 2026-10-14
- **Motivo:** prácticas muy valoradas por las empresas; protegen la calidad desde el inicio.
- **Alternativas descartadas:**
  - Jest — más lento y con peor integración con herramientas modernas que Vitest.

### [Gestor de paquetes] — npm

- **Decisión:** npm.
- **Fecha:** 2026-10-14
- **Motivo:** viene con Node, sin configuración extra.
- **Alternativas descartadas:**
  - pnpm — más rápido y estricto, pero añade una herramienta más.

### [Monitorización] — Sentry

- **Decisión:** Sentry, plan Developer gratuito (5.000 errores/mes, 1 usuario).
- **Fecha:** 2026-10-14
- **Motivo:** estándar del sector para errores y rendimiento; integración oficial con Next.js; al superar el límite descarta eventos, no cobra.
- **Alternativas descartadas:**
  - Ninguna valorada.

### [Pagos] — Stripe (aplazado)

- **Decisión:** no se implementa por ahora. Cuando se aborde, Stripe en modo test (p. ej. pago de «evento destacado»).
- **Fecha:** 2026-10-14
- **Motivo:** no es necesario en esta fase; Stripe no tiene cuota fija y el modo test es gratuito.
- **Alternativas descartadas:**
  - Implementarlo ya — añade complejidad sin valor inmediato.

### Pendiente de decidir

- Almacenamiento de imágenes (de momento, imagen oficial del evento enlazada desde su fuente).
- Anti-spam del formulario (propuesta: Cloudflare Turnstile, gratuito).
- Notificaciones por email al administrador (propuesta: Resend, plan gratuito).

---

## Otras decisiones

### [Mapa] — Trazado propio a partir de Natural Earth

- **Decisión:** el mapa de la portada se genera a partir de Natural Earth (`ne_10m_admin_1_states_provinces`, dominio público): provincias unidas por comunidad, proyección cónica conforme de Lambert y simplificado con mapshaper (ejecutado una sola vez, no es dependencia del proyecto). Incluye Ceuta y Melilla, ampliadas para que se puedan señalar; Canarias se desplaza abajo a la izquierda.
- **Fecha:** 2026-10-23
- **Motivo:** el origen del trazado del boceto es desconocido y el repositorio es público; Natural Earth no tiene restricciones de uso y trae también las provincias para el futuro nivel 3.
- **Alternativas descartadas:**
  - Reutilizar el trazado del boceto — licencia desconocida.
  - Datos del IGN — exigen atribución (CC BY 4.0) y son más pesados de procesar.

### [Repositorio] — Ubicación del boceto de la web

- **Decisión:** el boceto se guarda en `docs/boceto/index.html` como referencia de diseño; la aplicación Next.js vive en la raíz del repo.
- **Fecha:** 2026-10-15 (sustituye a la del 2026-10-14: `web/index.html`)
- **Motivo:** Next.js en la raíz es lo estándar y simplifica el despliegue en Vercel; el boceto queda separado del código real.
- **Alternativas descartadas:**
  - Next.js dentro de `web/` — obliga a configurar el directorio raíz en Vercel y en la CI sin aportar nada.
  - Mantener el boceto en `web/` — se confundiría con el frontend real.

### [Despliegue] — Demo del boceto con GitHub Pages (descartada)

- **Decisión:** no publicar el boceto por separado; la demo pública será la propia aplicación desplegada en Vercel.
- **Fecha:** 2026-10-15 (sustituye a la del 2026-10-14 de usar GitHub Pages)
- **Motivo:** el despliegue se hará al final con la aplicación completa.
- **Alternativas descartadas:**
  - GitHub Pages para el boceto — duplicaría la demo y quedaría obsoleta.
