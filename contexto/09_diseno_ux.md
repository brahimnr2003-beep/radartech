# Diseño y experiencia de usuario

## 1. Concepto visual

La web debe transmitir tres ideas principales:

Tecnología · Exploración · Eventos

No debe parecer una simple agenda con una lista interminable de eventos. La sensación debe ser más cercana a una plataforma moderna de descubrimiento.

El usuario debería entrar y pensar:

"Aquí puedo ver qué está pasando en tecnología en España."

El diseño debe ser:

- moderno;
- minimalista;
- tecnológico;
- profesional;
- visual;
- dinámico;
- intuitivo;
- limpio.

Debe evitarse un diseño excesivamente corporativo o genérico de SaaS.

El elemento principal de la web es el mapa de españa, dividido por comunidades autonomas, cada comunidad es una región independiente el mapa debe ser un mapa vectorial estilizado de España, de color negro con lineas divisorias entre comunidades naranjas, y el bordeado del mapa también naranja con sombras, cuando se ponga el cursor encima de alguna comunidad, pasará de color negro a naranja y que aumente un poco el tamaño , como que sale hacia delante. Al hacer click en la comunidad llevaría a la página de dicha comunidad. Donde aparecerían las tarjetas de eventos y la opción de 'ver más' en cada evento.

La experiencia debe diseñarse primero pensando en escritorio, porque el mapa tendrá mucho protagonismo, pero debe adaptarse perfectamente a móvil.

Por ejemplo (no tiene por que ser así):

Desktop:
- Mapa grande.
- Hover.
- Tooltips.
- Grid de 3 eventos.

Tablet:
- Mapa reducido.
- Grid de 2 eventos.

Móvil:
- Mapa adaptable.
- Tap en lugar de hover.
- Una columna de eventos.
- Filtros mediante panel.
- Header compacto.

El footer sigue el boceto (`docs/boceto/index.html`):

- **Logo** y lema: «El radar del ecosistema tecnológico español.»
- **Explorar:** Mapa · Eventos · Categorías.
- **Organizadores:** Añadir evento · Promociona tu evento.
- **Proyecto:** Sobre nosotros · Contacto.

Debajo de una línea divisoria:

© 2026 RadarTech · Privacidad · Cookies · Términos · Contacto

«Eventos» lleva a la página con todos los eventos de España (`/eventos`), que complementa al mapa.
