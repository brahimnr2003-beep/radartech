# Hoja de ruta

Plan de desarrollo de RadarTech, desde la preparación del proyecto hasta la versión final. Cada fase termina con una revisión en el navegador y un commit propio.

```
 ✔ 0  Preparación
 ✔ 1  Aspecto visual
 ✔ 2  Portada con el mapa
 ✔ 3  Página de comunidad y ficha de evento
 ✔ 4  Base de datos
 ▼ 8  Recopilación automática con IA   (adelantada)
 ▼ 7  Publicación  ◄── primera versión pública, con eventos reales
 ▼ 5  Formulario «Añadir evento»
 ▼ 6  Panel de administración
 ▼ 9  Remate final
 │
 ○ 10 Futuro
```

Orden revisado el 2026-10-29: se adelantan la recopilación automática y la publicación para tener cuanto antes una versión pública con eventos reales. La numeración de las fases se mantiene.

Las herramientas se incorporan en la fase que las necesita, no antes. El detalle de cada elección está en [decisiones.md](decisiones.md).

---

## 0. Preparación — hecho

- Documentación de producto en `contexto/` y registro de decisiones.
- Boceto navegable en `docs/boceto/`.
- Proyecto Next.js 16 con TypeScript y Tailwind CSS.
- ESLint, Prettier e integración continua en GitHub Actions (lint, formato, tipos y build en cada push y PR).

## 1. Aspecto visual

- Tokens de diseño del boceto (colores, radios) en el tema de Tailwind.
- Tipografías Space Grotesk, Inter y JetBrains Mono con `next/font`.
- Cabecera y pie de página comunes a toda la web.

**Resultado:** la web con la identidad visual de RadarTech.

## 2. Portada con el mapa

- Hero con llamada a la acción.
- Mapa vectorial interactivo de las 17 comunidades autónomas más Ceuta y Melilla: resaltado al pasar el cursor, tooltip, navegación con clic y teclado.
- Bloque de las 6 categorías y sección «Cómo funciona».

**Resultado:** portada completa, fiel al boceto.

## 3. Página de comunidad y ficha de evento

- Ruta `/eventos/[comunidad]` con eventos destacados primero, tarjetas y filtros.
- Página `/eventos` con todos los eventos de España y filtro adicional de comunidad; las categorías de la portada enlazan a ella ya filtrada.
- Filtro «Ubicación» que une provincia y ciudad (ciudades agrupadas por provincia).
- Ficha de evento con todos sus datos y el enlace «Ver evento oficial».
- Tests unitarios de la lógica de filtrado con **Vitest**.

**Resultado:** navegación completa portada → comunidad → evento.

## 4. Base de datos

- PostgreSQL en **Docker** para desarrollo local.
- Esquema y migraciones con **Drizzle**.
- Las páginas leen los eventos de la base de datos.
- Los eventos ya celebrados dejan de mostrarse.

**Resultado:** los datos dejan de estar en el código.

## 5. Formulario «Añadir evento»

- Formulario público con validación (Zod) en cliente y servidor.
- Los eventos enviados se guardan como **pendientes de revisión**.
- Protección anti-spam (pendiente de decidir).

**Resultado:** los organizadores pueden proponer eventos.

## 6. Panel de administración

- Acceso privado con **Better Auth** e inicio de sesión con GitHub.
- Cola de pendientes con relevancia, categoría y fuente.
- Acciones Aprobar / Editar / Rechazar.
- Aviso por email al administrador (pendiente de decidir).

**Resultado:** nada se publica sin aprobación del administrador.

## 7. Publicación — primera versión pública

- Web en **Vercel** y base de datos en **Neon**.
- Monitorización de errores con **Sentry**.

**Resultado:** RadarTech accesible en internet, solo con eventos reales.

## 8. Recopilación automática con IA

- Fuentes aprobadas: eventos.wiki, agenda-tech y confs.tech (ver [07_recopilacion_eventos.md](07_recopilacion_eventos.md)); eliminación de duplicados entre fuentes.
- Extracción y clasificación con **Gemini** vía Vercel AI SDK, con salida estructurada validada por Zod.
- Ejecución periódica en **GitHub Actions**.
- Siguiente mejora: que la IA busque eventos en internet para cubrir comunidades sin fuentes; esos entran como pendientes.
- Métricas desde el primer día: nº de fuentes, eventos procesados y publicados al mes, porcentaje aprobado sin editar y tiempo/coste por evento.

**Resultado:** eventos nuevos llegan solos a la cola de revisión.

## 9. Remate final

- Tests de extremo a extremo con **Playwright**.
- Revisión de la versión móvil y de la accesibilidad, con los filtros en un panel desplegable en móvil.
- SEO: metadatos, sitemap y datos estructurados de eventos.
- Páginas legales: privacidad, cookies y términos.
- README final con captura y autoría.

**Resultado:** versión final del proyecto.

## 10. Futuro

Fuera del alcance actual:

- Nivel 3: páginas por provincia.
- Eventos destacados de pago (Stripe).
- Publicidad no intrusiva.
- Perfiles profesionales.
