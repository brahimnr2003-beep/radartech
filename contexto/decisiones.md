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

<!-- Pendiente de decidir. Añadir aquí las decisiones de stack usando la plantilla. -->

---

## Otras decisiones

### [Repositorio] — Ubicación del boceto de la web

- **Decisión:** el boceto se guarda en `web/index.html` (renombrado desde `index (1).html`).
- **Fecha:** 2026-10-14
- **Motivo:** la raíz queda para documentación y configuración; `web/` alojará el frontend cuando se elija el stack.
- **Alternativas descartadas:**
  - Raíz del repo — solo aportaría servir el boceto con GitHub Pages desde la raíz, y mezcla documentación con código.
  - `web/boceto/` — aislamiento innecesario por ahora.

### [Despliegue] — Demo del boceto con GitHub Pages

- **Decisión:** publicar el boceto con GitHub Pages desde la rama `main` (carpeta raíz), accesible en `/web/`.
- **Fecha:** 2026-10-14
- **Motivo:** el proyecto forma parte de un portfolio; permite ver la web en vivo sin instalar nada.
- **Alternativas descartadas:**
  - Netlify / Vercel — innecesario para un HTML estático; Pages no requiere cuentas ni configuración extra.
