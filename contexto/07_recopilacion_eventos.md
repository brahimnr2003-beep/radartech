# Recopilación de eventos

Sistema de recopilación de eventos

Esta será una de las partes más importantes del proyecto.

La plataforma no dependerá exclusivamente de que el administrador introduzca eventos manualmente.

El objetivo será construir progresivamente un sistema capaz de detectar eventos automáticamente.

Las fuentes podrán incluir:

- páginas oficiales;
- APIs;
- RSS;
- plataformas de eventos;
- universidades;
- parques tecnológicos;
- comunidades;
- empresas;
- asociaciones;
- organizadores;
- formularios enviados por usuarios.

Las incorporaciones de eventos se harán mediante Automatización mediante IA

Cuando el sistema encuentre un posible evento, podrá procesarlo automáticamente.

Por ejemplo, una fuente publica:

"Meetup sobre Inteligencia Artificial Generativa en Málaga..."

El sistema podrá extraer:

- Nombre
- Fecha
- Hora
- Ciudad
- Provincia
- Comunidad
- Categoría
- Organizador
- Precio
- Modalidad
- URL
- Descripción

Posteriormente, la IA podrá analizar el evento. Asignar automaticamente las categorías y datos del evento.

Aunque la recopilación y clasificación estén automatizadas, la publicación final estará controlada por el administrador.

Este punto es muy importante.

El sistema no publicará automáticamente cualquier cosa que encuentre.

**Fuentes aprobadas (decisión del 2026-10-29).** El administrador aprueba cada fuente antes de usarla. Los eventos que vienen de una fuente aprobada se publican directamente si la IA los considera eventos tecnológicos; los que no, se guardan como rechazados con el motivo. Desde el panel se podrá ocultar cualquier evento. Lo que no venga de una fuente aprobada (formulario, búsquedas de la IA en internet) entra siempre como pendiente.

Fuentes aprobadas:

| Fuente | Formato | Licencia |
|---|---|---|
| [eventos.wiki](https://eventos.wiki) | JSON (Open Tech Events) | CC BY 4.0 |
| [agenda-tech](https://agenda-tech.h1756.es) | Sitemap + datos schema.org en cada página | CC BY 4.0 |
| [confs.tech](https://github.com/tech-conferences/conference-data) | JSON en GitHub | MIT |

Reglas del recolector: respetar `robots.txt` y las condiciones de cada web, identificarse, pausar entre peticiones, guardar solo datos y un resumen propio (no textos completos ni imágenes) y citar siempre la fuente con su licencia. Descartadas: Meetup y Eventbrite (sus condiciones prohíben el scraping) y dev.events (no indica si permite reutilizar su contenido).

Existirá un panel de administración con eventos pendientes.

Por ejemplo:

Eventos pendientes

AI & Data Meetup Málaga

- Relevancia: 87/100
- Categoría: IA / Data
- Ciudad: Málaga
- Fuente: Meetup

[ Aprobar ] [ Editar ] [ Rechazar ]

De esta forma se consigue una combinación de:

automatización + inteligencia artificial + supervisión humana.

La IA hace el trabajo pesado y el administrador mantiene el control sobre la calidad.

La plataforma tendrá también un formulario público:

¿Organizas un evento tecnológico?

Añádelo a nuestra agenda.

El organizador podrá proporcionar:

- nombre;
- descripción;
- fecha;
- ubicación;
- ciudad;
- categoría;
- precio;
- URL;
- organizador;
- imagen.

El evento entrará automáticamente en el sistema como:

Pendiente de revisión

El administrador podrá:

- aprobarlo;
- editarlo;
- rechazarlo.

Esto permite que los propios organizadores ayuden a aumentar la cantidad de eventos de la plataforma.

Los eventos que sean de especial relevancia, o el organizador pague por su promoción apareceran como eventos destacados (en cada provincia al entrar a la página, primero se muestran los eventos destacados).
