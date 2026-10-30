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

### [Despliegue] — Vercel + Neon y recolector diario en GitHub Actions

- **Decisión:** la web se publica en Vercel (plan Hobby) conectada a GitHub, y cada push a `main` despliega. La base de datos de producción es Neon (plan gratuito, región Frankfurt `aws-eu-central-1`) y las funciones de Vercel corren en Frankfurt (`fra1`) para estar junto a ella. El recolector se ejecuta cada día a las 05:00 UTC con GitHub Actions ([`recolector.yml`](../.github/workflows/recolector.yml)), con `DATABASE_URL` y la clave de Gemini como secretos del repositorio. Las migraciones de producción se aplican a mano con la conexión directa de Neon antes de desplegar código que las necesite. Producción nunca recibe los datos de ejemplo.
- **Fecha:** 2026-10-30
- **Motivo:** todo gratis y sin tarjeta; despliegue automático y recopilación sin servidor propio. GitHub Actions es gratuito sin límite de minutos en repositorios públicos.
- **Límites a vigilar:** el plan Hobby de Vercel es solo para uso no comercial (si se monetiza, hará falta el plan Pro u otro proveedor); GitHub pausa las tareas programadas tras 60 días sin actividad en el repositorio.
- **Alternativas descartadas:**
  - Cron de Vercel — en Hobby se limita a ejecuciones diarias de corta duración y el recolector tarda varios minutos.
  - Migrar automáticamente en cada despliegue — de momento hay pocas migraciones y así se controla cuándo cambia producción.

### [Analítica] — Vercel Web Analytics, sin cookies

- **Decisión:** estadísticas de visitas con Vercel Web Analytics (`@vercel/analytics`), en el layout raíz. No se cuentan las visitas al panel `/admin`. Se informa en la política de privacidad (interés legítimo) y en la de cookies.
- **Fecha:** 2026-10-31
- **Motivo:** el propietario quiere ver las estadísticas de la web. Funciona sin cookies, así que no hace falta banner de consentimiento, y está integrado en el hosting que ya usamos. Plan Hobby: 50.000 eventos al mes incluidos; si se superan, deja de recoger datos durante unos días, pero nunca cobra. Solo guarda el último mes de datos.
- **Alternativas descartadas:**
  - Google Analytics — usa cookies y obliga a mostrar un banner de consentimiento.
  - Analítica propia en la base de datos — más trabajo sin aportar nada en esta fase.

### [Interfaz] — Carteles oficiales de los eventos

- **Decisión:** las tarjetas y la ficha muestran el cartel oficial cuando la fuente lo da (eventos.wiki); se enlaza desde su web de origen sin copiarlo ni optimizarlo. Si no hay cartel o no carga, se muestra una portada con el icono de la categoría sobre la cuadrícula del boceto.
- **Fecha:** 2026-10-30
- **Motivo:** sin imagen las tarjetas quedaban vacías. Los carteles vienen de más de cien dominios distintos, así que optimizarlos con Vercel obligaría a abrir el optimizador a cualquier dominio y consumiría el cupo gratuito.
- **Alternativas descartadas:**
  - Solo portadas generadas — no se vería el cartel real del evento.
  - Imagen de vista previa de agenda-tech — es una tarjeta con su propia marca, no el cartel del evento.

### [Recopilación] — Fuentes abiertas y clasificación con Gemini

- **Decisión:**
  - Recolector propio (`npm run recolectar`) que lee eventos.wiki, agenda-tech y confs.tech, elimina duplicados entre fuentes y frente a la base de datos, y clasifica cada evento nuevo con **Gemini 3.5 Flash-Lite** (plan gratuito) mediante el Vercel AI SDK con salida validada por Zod.
  - La IA decide si es un evento tech, asigna categoría, tipo, comunidad, provincia, ciudad y modalidad, escribe un resumen propio y explica el motivo. Los descartados se guardan como rechazados para no volver a clasificarlos.
  - Eventos de fuentes aprobadas: publicación directa. Se cita la fuente en la ficha y en el pie.
  - Cada ejecución guarda sus métricas en `ejecuciones_recolector`.
- **Fecha:** 2026-10-29
- **Motivo:** son las fuentes con datos estructurados y licencia que permite reutilizarlos; la IA resuelve la parte difícil (relevancia, categoría, ubicación) sin reglas frágiles.
- **Alternativas descartadas:**
  - Meetup y Eventbrite — sus condiciones prohíben el scraping.
  - dev.events — no indica si permite reutilizar su contenido.
  - Clasificar con palabras clave — más errores y sin resúmenes.

### [Base de datos] — Configuración de la fase 4

- **Decisión:**
  - PostgreSQL 17 en Docker (`docker-compose.yml`, puerto 5433 en el equipo para no chocar con instalaciones locales de PostgreSQL); misma versión mayor que se usará en Neon.
  - Conexión con `pg` (node-postgres) a través de Drizzle; migraciones versionadas en `drizzle/`.
  - Tabla `eventos` preparada para las fases siguientes: `estado` (pendiente / aprobado / rechazado), `origen` (formulario / IA / admin) y fechas de creación y actualización. La web solo muestra eventos aprobados y no celebrados.
  - Consultas en caché con `use cache` y `cacheLife("hours")`: las páginas se regeneran como mucho cada hora; la etiqueta `eventos` permitirá invalidarlas al aprobar un evento.
  - Eventos de ejemplo cargados con `npm run db:seed` (script con `tsx`), solo contra bases de datos locales.
  - La CI levanta un PostgreSQL temporal, aplica las migraciones y carga los ejemplos antes de construir.
- **Fecha:** 2026-10-29
- **Motivo:** reproducible en cualquier equipo, sin coste, y cerca de cómo se trabaja en empresas (migraciones versionadas y comprobadas en CI). La caché por horas reduce las consultas al plan gratuito de Neon.
- **Alternativas descartadas:**
  - Renderizar en cada visita — más consumo de base de datos sin beneficio real para este tipo de contenido.
  - Construir en la CI sin base de datos — no comprobaría las migraciones.

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
