# RadarTech

**Descubre los eventos tecnológicos más relevantes de España.**
*Discover the most relevant tech events in Spain.*

🔗 **Demo en vivo / Live demo:** https://brahimnr2003-beep.github.io/radartech/web/

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
| Diseño / boceto navegable | ✅ Terminado ([`web/index.html`](web/index.html)) |
| Stack tecnológico | ⏳ Pendiente de decidir ([`decisiones.md`](contexto/decisiones.md)) |
| Desarrollo | ⏳ Próxima fase |

El boceto usa datos de ejemplo.

### Funcionalidades previstas

- **Mapa interactivo de España:** 17 comunidades con hover, tooltip con nº de eventos y navegación a cada comunidad.
- **Página por comunidad:** eventos destacados primero, tarjetas y filtros (fecha, provincia, ciudad, categoría, modalidad, precio).
- **Ficha de evento** con enlace a la fuente oficial.
- **Recopilación automática con IA:** detección, extracción y clasificación de eventos desde fuentes públicas.
- **Supervisión humana:** todo evento pasa por un panel de administración (aprobar / editar / rechazar) antes de publicarse.
- **Formulario para organizadores** que quieran publicar su evento.
- **Seis categorías:** IA · Data · Software · Cloud & DevOps · Ciberseguridad · Startups & Negocio.

### Qué muestra el boceto

- SPA en un solo archivo con **HTML, CSS y JavaScript sin frameworks**, con router por hash.
- Mapa **SVG** de España generado dinámicamente, accesible por teclado.
- Sistema de diseño con *design tokens* (negro + naranja neón; Space Grotesk, Inter, JetBrains Mono).
- Enfoque **desktop-first** adaptado a tablet y móvil; respeta `prefers-reduced-motion`.

### Estructura

```
radartech/
├── contexto/        # Documentación de producto, UX, negocio y registro de decisiones
└── web/
    └── index.html   # Boceto navegable
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
| Design / clickable mockup | ✅ Done ([`web/index.html`](web/index.html)) |
| Tech stack | ⏳ To be decided ([`decisiones.md`](contexto/decisiones.md)) |
| Development | ⏳ Next phase |

The mockup uses sample data.

### Planned features

- **Interactive map of Spain:** 17 regions with hover, event-count tooltip and navigation to each region.
- **Region page:** featured events first, event cards and filters (date, province, city, category, format, price).
- **Event page** linking to the official source.
- **AI-powered event collection:** detection, extraction and classification of events from public sources.
- **Human in the loop:** every event goes through an admin panel (approve / edit / reject) before going live.
- **Submission form** for event organisers.
- **Six categories:** AI · Data · Software · Cloud & DevOps · Cybersecurity · Startups & Business.

### What the mockup demonstrates

- Single-file SPA built with **plain HTML, CSS and JavaScript (no frameworks)** and a hash router.
- Dynamically generated, keyboard-accessible **SVG** map of Spain.
- Token-based design system (black + neon orange; Space Grotesk, Inter, JetBrains Mono).
- **Desktop-first** layout adapted to tablet and mobile; honours `prefers-reduced-motion`.

---

© 2026 RadarTech. Todos los derechos reservados / All rights reserved.
