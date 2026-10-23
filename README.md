# ON BJORN

Sitio institucional estático construido con Astro. Incluye inicio, presentación (`/about`), contacto (`/contact`), página 404 y redirección de `/inicio` al inicio.

## Desarrollo

```sh
npm ci
npm run dev
```

Para verificar y recorrer la versión compilada:

```sh
npm run check
npm run preview
```

`check` compila el sitio y verifica las cuatro páginas, archivos y anclas locales, número de WhatsApp, atribución a CUOS, cinco servicios, correspondencia del FAQ con sus datos estructurados, metadatos, sitemap y redirección histórica. Las interacciones y la composición responsive se revisan además en el navegador.

## Contenido y diseño

| Ubicación | Contenido |
| --- | --- |
| `src/data/site.ts` | Contacto, WhatsApp confirmado, redes y enlace a CUOS |
| `src/data/services.ts` | Cinco familias de servicios y ejemplos |
| `src/data/faqs.ts` | Preguntas visibles y datos estructurados del inicio |
| `src/data/process.ts` | Cuatro pasos de trabajo |
| `src/components/inicio/` | Secciones de la home |
| `src/styles/global.css` | Colores, tipografía, tamaños y adaptación responsive |
| `src/styles/projects.css` | Composiciones de escritorio y móvil, y galería ampliable |
| `src/components/shared/ProjectShowcase.astro` | Vista compartida de proyectos con tres pantallas por galería |
| `src/assets/projects/` | Capturas públicas reales, convertidas a WebP responsive al compilar |
| `public/fonts/` | Manrope y Space Grotesk variables, alojadas localmente con sus licencias OFL |
| `public/images/og-on-bjorn.jpg` | Imagen social del nuevo diseño |

GBL Ingeniería es el proyecto destacado de ON BJORN. Marca Latam y Riesgo Red se presentan como experiencia de desarrollo principal a través de CUOS; no como proyectos de autoría exclusiva ni contratos de ON BJORN. Branding se coordina con agencias y profesionales independientes, según el proyecto.

## Logo y movimiento

`src/data/logo-shape.json` conserva los contornos trazados del símbolo original. `src/scripts/logo-scene.js` genera una misma geometría con espesor para ambas caras, completamente blanca, sin circuitos ni acabados metalizados. Three.js se carga sólo en la portada al acercarse el logo a la vista.

El arrastre modifica la orientación y la velocidad de salida; la inercia se amortigua al soltar. Las flechas permiten rotar, Espacio pausa o reanuda y Home vuelve al frente. También hay controles visibles de pausa y frente. El movimiento reducido desactiva el giro automático y la inercia. Si WebGL no está disponible, permanece el símbolo original como imagen.

El giro automático empieza sin una espera inicial y un clic simple no lo desactiva. El arrastre se reconoce a partir de un recorrido mínimo de 4 píxeles. Los controles permiten detener el movimiento o volver a activar el giro con un clic; el foco por teclado tiene un indicador independiente del uso del mouse.

Las galerías de proyectos permiten alternar escritorio, detalle y móvil, ver la imagen a tamaño real y cerrar con Escape. El foco vuelve al enlace que abrió la galería. El grafo de detalle de Riesgo Red es una exportación vectorial del ejemplo público de esa plataforma y conserva la aclaración de datos enmascarados.

La página mantiene scroll nativo y entradas de opacidad y desplazamiento, sin zoom. El menú móvil y los desplegables usan elementos HTML nativos. El contenido y los enlaces de contacto están presentes sin depender de las animaciones.

## Publicación

La compilación se genera en `dist/`. El flujo existente de GitHub Actions publica en S3 e invalida CloudFront al hacer push a `main`, o por ejecución manual. La implementación del rediseño queda para revisión en `codex/on-bjorn-redesign`; no se publicó durante este trabajo.

## Límites de esta revisión

Se conservaron las versiones existentes de Astro y sitemap. `npm ci` informa 26 avisos de auditoría en el árbol de dependencias (incluido uno crítico); este rediseño no incluye una actualización del framework ni una revisión de seguridad. La compilación también informa el tamaño del módulo de Three.js, de unos 129 kB comprimidos, cargado por separado del contenido principal.
