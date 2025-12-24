# GProA_IBM_AnalisisIAecommerce

## Descripción del Proyecto

Este proyecto es una landing page técnica-profesional para la propuesta de GProA Technology en el desarrollo de una plataforma de Inteligencia de Mercado e IA aplicada a eCommerce. La página explica de manera clara y demostrable las capacidades de la plataforma, sirviendo como demo conceptual para clientes enterprise y como base escalable hacia un MVP o producto comercial.

**Nueva funcionalidad**: Incluye un sistema de analytics interno que captura métricas de uso del sitio sin depender de servicios externos como Google Analytics. El dashboard en `/analytics.html` visualiza datos en tiempo real sobre visitas, clics y engagement.

## Objetivo

Evolucionar un HTML estático hacia una landing técnica-profesional que comunique efectivamente las capacidades de una plataforma de análisis de IA para eCommerce, con un diseño corporativo inspirado en IBM y estilo enterprise.

## Tecnologías Utilizadas

- **HTML5**: Estructura semántica de la página y dashboard.
- **CSS3**: Estilos corporativos, responsive design y animaciones suaves.
- **JavaScript (Vanilla)**: Interacciones simples, animaciones de scroll y sistema de analytics.
- **Chart.js**: Librería ligera para visualización de gráficos en el dashboard (cargada desde CDN).

Se minimizan dependencias externas; Chart.js se usa solo en la página de analytics para mantener la simplicidad en la landing principal.

## Estructura del Proyecto

```
/
├── index.html          # Página principal con todas las secciones
├── analytics.html      # Dashboard de métricas de uso
├── css/
│   └── styles.css      # Estilos corporativos y responsive
├── js/
│   ├── main.js         # Animaciones y interacciones
│   └── analytics.js    # Sistema de tracking y métricas
├── data/
│   └── metrics.json    # Datos de ejemplo para métricas
├── assets/
│   ├── icons/          # Iconos (placeholder)
│   └── images/         # Imágenes (placeholder)
└── README.md           # Este archivo
```

## Cómo Desplegar en GitHub Pages

1. Sube este repositorio a GitHub.
2. Ve a la configuración del repositorio (Settings).
3. En la sección "Pages", selecciona la rama `main` (o `master`) como fuente.
4. El sitio estará disponible en `https://[tu-usuario].github.io/[nombre-del-repositorio]/`.

## Características

- **Responsive**: Optimizado para desktop, tablet y mobile.
- **Animaciones Suaves**: Hover en elementos y fade-in on scroll.
- **Estilo Corporativo**: Colores negro, azul y blanco; inspirado en IBM.
- **Sistema de Analytics Interno**: Tracking de uso sin dependencias externas.
- **Dashboard Visual**: Gráficos interactivos para métricas en tiempo real.
- **Escalable**: Código limpio y comentado, fácil de mantener y expandir.

## Sistema de Analytics

### Cómo Funciona Técnicamente

El sistema de analytics utiliza JavaScript vanilla para capturar métricas de usuario sin enviar datos a servidores externos. Todas las métricas se almacenan localmente en el navegador del usuario usando `localStorage`.

#### Métricas Capturadas

1. **Sesiones**: Detecta visitas únicas usando `sessionStorage`. Cada sesión registra tiempo de inicio, fin y duración. KPI: Número total de sesiones únicas.
2. **Secciones Vistas**: Usa `IntersectionObserver` para detectar cuándo una sección entra en el viewport (50% visible). KPI: Conteo de vistas por sección, indica engagement por contenido.
3. **Scroll Depth**: Mide el porcentaje de scroll alcanzado en cada sección usando múltiples umbrales de intersección. KPI: Promedio de scroll depth por sección, mide profundidad de lectura.
4. **Clics en CTAs**: Escucha eventos de clic en elementos con atributo `data-cta`. KPI: Número de clics por tipo de CTA, evalúa efectividad de llamadas a acción.
5. **Tiempo en Página**: Calcula la duración total de la sesión desde entrada hasta salida. KPI: Tiempo promedio de visita, indica nivel de interés.

#### Almacenamiento

- **localStorage**: Persiste métricas agregadas entre sesiones.
- **sessionStorage**: Identifica sesiones únicas.
- **Estructura de Datos**: JSON con arrays de sesiones y contadores agregados.

#### Dashboard

La página `/analytics.html` carga métricas desde `localStorage` y las visualiza usando Chart.js:
- **Indicador Numérico**: Total de sesiones.
- **Gráfico de Barras**: Visitas por sección.
- **Gráfico de Pastel**: Distribución de clics en CTAs.
- **Indicador Numérico**: Tiempo promedio de visita.
- **Gráfico de Barras**: Scroll depth promedio por sección.

#### Interpretación de Gráficos

- **Sesiones Totales**: Número absoluto de visitas únicas al sitio. Útil para medir alcance general.
- **Visitas por Sección**: Indica qué contenido es más visto. Secciones con bajas visitas pueden necesitar mejor posicionamiento.
- **Clics en CTAs**: Muestra efectividad de llamadas a acción. Altos clics en "Descargar" indican interés en la propuesta.
- **Tiempo Promedio**: Mayor tiempo sugiere engagement alto. Comparar con benchmarks de la industria.
- **Scroll Depth**: Porcentajes bajos indican abandono temprano. Optimizar contenido para mantener atención.

#### API Pública

El objeto `window.GProAAnalytics` expone métodos para interactuar con las métricas:
- `getMetrics()`: Obtiene datos actuales.
- `resetMetrics()`: Resetea todas las métricas (útil para demo).
- `exportMetrics()`: Descarga métricas como archivo JSON.

#### Consideraciones de Privacidad

- No se recopilan datos personales ni se envían a servidores externos.
- Las métricas son locales al navegador del usuario.
- Compatible con regulaciones de privacidad (no requiere cookies de terceros).

## Extensión a Backend Real

Para integrar este sistema de analytics con un backend real (ej. Node.js, Python Flask, etc.):

1. **Modificar `saveMetrics()`**: Enviar datos a un endpoint REST en lugar de localStorage.
   ```javascript
   function saveMetrics(metrics) {
     fetch('/api/analytics', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(metrics)
     });
   }
   ```

2. **Agregar User ID**: Integrar con sistema de autenticación para trackear usuarios específicos.
3. **Base de Datos**: Usar MongoDB o PostgreSQL para almacenar métricas históricas.
4. **Dashboard Backend**: Crear panel administrativo con filtros por fecha, usuario, etc.
5. **Exportación Avanzada**: Generar reportes PDF/Excel con tendencias y comparativas.
6. **Alertas**: Configurar notificaciones cuando KPIs caen por debajo de umbrales.

El código frontend permanece igual, solo se modifica el almacenamiento.

## Licencia

Este proyecto utiliza una licencia placeholder. Consulta el archivo LICENSE para más detalles.