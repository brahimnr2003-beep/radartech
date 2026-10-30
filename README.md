# RadarTech

**Descubre los eventos tecnológicos más relevantes de España.**
*Discover the most relevant tech events in Spain.*

**Web:** https://radartech-lyart.vercel.app

[Español](#español) · [English](#english)

---

## Español

### Qué es

RadarTech es una plataforma web que centraliza los eventos tecnológicos de España —conferencias, meetups, hackathons, eventos de IA, Data, startups, ciberseguridad…— y permite explorarlos a través de un **mapa interactivo por comunidades autónomas**.

Hoy esa información está dispersa entre webs de empresas, universidades, asociaciones, comunidades y redes sociales. RadarTech la reúne en un solo lugar con una experiencia visual, geográfica y actualizada.

### Estado actual

| Área | Estado |
|---|---|
| Definición de producto | ✅ Completa ([`contexto/`](contexto/)) |
| Diseño / boceto navegable | ✅ Terminado ([`docs/boceto/index.html`](docs/boceto/index.html)) |
| Stack tecnológico | ✅ Decidido ([`decisiones.md`](contexto/decisiones.md)) |
| Web pública con eventos reales | ✅ Publicada en Vercel + Neon |
| Recopilación diaria con IA | ✅ GitHub Actions + Gemini |
| Formulario para organizadores y panel de administración | ✅ Con login de GitHub (Better Auth) |

### Funcionalidades

- **Mapa interactivo de España:** 17 comunidades más Ceuta y Melilla, con hover, tooltip con nº de eventos y navegación a cada comunidad.
- **Página por comunidad y de todos los eventos:** destacados primero, tarjetas con el cartel oficial y filtros (fecha, comunidad, ubicación, categoría, modalidad, precio, tipo).
- **Ficha de evento** con enlace a la web oficial y cita de la fuente.
- **Recopilación automática con IA:** cada día se leen agendas abiertas (eventos.wiki, agenda-tech, confs.tech), se eliminan duplicados y Gemini decide si cada evento es tech y lo clasifica.
- **Formulario para organizadores** con validación en el servidor y anti-spam sin cuentas.
- **Supervisión humana:** panel de administración privado (aprobar / editar / rechazar, ocultar, destacar y recuperar descartados) con el motivo de la IA en cada evento.
- **Seis categorías:** IA · Data · Software · Cloud & DevOps · Ciberseguridad · Startups & Negocio.

### Stack

Next.js 16 (App Router, Cache Components, Server Actions) · TypeScript · Tailwind CSS 4 · PostgreSQL (Neon) + Drizzle ORM · Better Auth · Vercel AI SDK + Gemini · Zod · Vitest · ESLint + Prettier · GitHub Actions · Vercel.

### Cómo ejecutarlo en local

Requisitos: Node.js 24 y Docker.

```bash
npm install
cp .env.example .env.local   # añade tu GOOGLE_GENERATIVE_AI_API_KEY para el recolector
npm run db:up                # PostgreSQL en Docker (puerto 5433)
npm run db:migrate
npm run db:seed              # eventos de ejemplo (solo en local)
npm run dev                  # http://localhost:3000
```

`npm run recolectar` busca eventos reales y los clasifica con Gemini.

### Qué muestra el boceto

- SPA en un solo archivo con **HTML, CSS y JavaScript sin frameworks**, con router por hash.
- Mapa **SVG** de España generado dinámicamente, accesible por teclado.
- Sistema de diseño con *design tokens* (negro + naranja neón; Space Grotesk, Inter, JetBrains Mono).
- Enfoque **desktop-first** adaptado a tablet y móvil; respeta `prefers-reduced-motion`.

### Estructura

```
radartech/
├── contexto/        # Documentación de producto, UX, negocio y registro de decisiones
├── docs/boceto/     # Boceto navegable (HTML/CSS/JS)
├── drizzle/         # Migraciones de la base de datos
├── public/          # Recursos estáticos
└── src/
    ├── app/         # Páginas (App Router)
    ├── components/  # Componentes de interfaz y mapa
    ├── db/          # Esquema, conexión y datos de ejemplo
    ├── lib/         # Dominio: eventos, filtros, consultas
    └── recolector/  # Lectura de fuentes, duplicados y clasificación con IA
```

---

## English

### What it is

RadarTech is a web platform that gathers Spain's tech events —conferences, meetups, hackathons, AI, Data, startup and cybersecurity events— and lets users explore them through an **interactive map of Spain's autonomous communities**.

That information is currently scattered across company, university and community websites and social media. RadarTech brings it together in one visual, geographic and up-to-date experience.

### Current status

| Area | Status |
|---|---|
| Product definition | ✅ Done ([`contexto/`](contexto/), in Spanish) |
| Design / clickable mockup | ✅ Done ([`docs/boceto/index.html`](docs/boceto/index.html)) |
| Tech stack | ✅ Decided ([`decisiones.md`](contexto/decisiones.md), in Spanish) |
| Public website with real events | ✅ Live on Vercel + Neon |
| Daily AI-powered collection | ✅ GitHub Actions + Gemini |
| Submission form and admin panel | ✅ With GitHub login (Better Auth) |

### Features

- **Interactive map of Spain:** 17 regions plus Ceuta and Melilla, with hover, event-count tooltip and navigation to each region.
- **Region page and all-events page:** featured events first, cards with the official poster and filters (date, region, location, category, format, price, type).
- **Event page** linking to the official website and citing the source.
- **AI-powered event collection:** every day open event listings (eventos.wiki, agenda-tech, confs.tech) are read, duplicates removed and Gemini decides whether each event is tech and classifies it.
- **Submission form** for event organisers, with server-side validation and account-free spam protection.
- **Human in the loop:** private admin panel (approve / edit / reject, hide, feature and restore discarded events) showing the AI's reasoning for each event.
- **Six categories:** AI · Data · Software · Cloud & DevOps · Cybersecurity · Startups & Business.

### Stack

Next.js 16 (App Router, Cache Components, Server Actions) · TypeScript · Tailwind CSS 4 · PostgreSQL (Neon) + Drizzle ORM · Better Auth · Vercel AI SDK + Gemini · Zod · Vitest · ESLint + Prettier · GitHub Actions · Vercel.

### Running locally

Requirements: Node.js 24 and Docker. See the commands in the [Spanish section](#cómo-ejecutarlo-en-local).

### What the mockup demonstrates

- Single-file SPA built with **plain HTML, CSS and JavaScript (no frameworks)** and a hash router.
- Dynamically generated, keyboard-accessible **SVG** map of Spain.
- Token-based design system (black + neon orange; Space Grotesk, Inter, JetBrains Mono).
- **Desktop-first** layout adapted to tablet and mobile; honours `prefers-reduced-motion`.

---

© 2026 RadarTech. Todos los derechos reservados / All rights reserved.
