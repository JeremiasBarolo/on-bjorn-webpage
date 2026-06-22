# Plan de mejora web — ON Bjorn

> **Documento para ejecución autónoma (Codex / agente)**  
> **Fecha de auditoría:** 22 de junio de 2026  
> **Repositorio:** `on-bjorn` — sitio en producción: `https://onbjorn.com`  
> **Stack:** Astro 4.7 (SSG) + CSS legacy de plantilla "Lizar Business" + Bootstrap estático en `public/`

---

## Objetivo general

Mejorar la web de ON Bjorn en calidad visual, UX, SEO/GEO, copywriting y performance percibida, **sin perder la identidad ni el mensaje actual**. Mantener el tono cercano hacia emprendedores argentinos, el estilo oscuro con acento naranja (`--thm-base: #FF6C1E`) y la estructura de secciones existente.

### Directivas técnicas del cliente

| Área | Decisión |
|------|----------|
| **Sliders / carruseles** | [Blossom Carousel](https://blossom-carousel.com/) (`@blossom-carousel/core`) |
| **Scroll global** | Lenis para sensación **smooth** al navegar — **sin zoom** ni scale al scrollear |
| **Animaciones** | GSAP solo para fade-in / slide-up al entrar en viewport |
| **Iconos** | [icons0.dev](https://icons0.dev/) — **descargar SVG y guardar en el repo** (no emojis ni paquetes npm de iconos) |

---

## Resumen ejecutivo de la auditoría

| Área | Estado actual | Severidad |
|------|---------------|-----------|
| Logo en header (mobile/desktop) | Tamaños en `vw`/`vh` desproporcionados; hasta `68vw` en tablet; `80vw` en menú móvil | 🔴 Alta |
| Asset `ON_BJORN_ISO.png` | Referenciado en favicon y hero pero **no existe** en `public/images/resource/` | 🔴 Alta |
| Iconos de servicios | Emojis Unicode (🌀🎨👟💼📑📦) en hero y carrusel | 🟡 Media |
| Carrusel de servicios | Scroll horizontal nativo; sin loop, sin flechas, sin autoplay — migrar a **Blossom Carousel** | 🟡 Media |
| Scroll global | Nativo del navegador; sin Lenis ni GSAP activos — objetivo: sensación **smooth**, sin zoom al scrollear | 🟡 Media |
| SEO técnico | Solo meta description + title global; sin OG, schema, sitemap, robots | 🔴 Alta |
| Copy / gramática | Title Case en español, tildes faltantes, mezcla tú/usted | 🟡 Media |
| Código legacy | Owl/Swiper/WOW/GSAP en `public/` pero **no cargados**; clases `wow fadeIn*` sin efecto | 🟢 Baja (limpieza) |
| Dependencias npm | Solo `astro` — todo el peso está en assets estáticos legacy | ℹ️ Info |

---

## Skills a instalar ANTES de empezar

> **⚠️ Gate de seguridad obligatorio:** antes de ejecutar cualquier `npx skills add`, escanear cada repositorio con **[NVIDIA SkillSpector](https://github.com/NVIDIA/SkillSpector)** siguiendo `SKILLS-SEGURIDAD.md`. Solo instalar skills con risk score ≤ 20 (SAFE) en escaneo estático, o ≤ 50 tras revisión manual documentada.

Instalar en la PC de casa (global o en el proyecto) con:

```bash
npx skills add <owner/repo@skill> -g -y
```

### Bloque de instalación rápida (copiar en PC de casa)

**Paso 0 — Verificar con SkillSpector** (ver `SKILLS-SEGURIDAD.md`):

```bash
# Ejemplo: escanear antes de instalar
skillspector scan https://github.com/resciencelab/opc-skills --no-llm -V
```

**Paso 1 — Instalar skills aprobadas:**

```bash
# GEO SEO
npx skills add resciencelab/opc-skills@seo-geo -g -y
npx skills add aaron-he-zhu/seo-geo-claude-skills@technical-seo-checker -g -y
npx skills add aaron-he-zhu/seo-geo-claude-skills@seo-content-writer -g -y
npx skills add aaron-he-zhu/seo-geo-claude-skills@geo-content-optimizer -g -y

# Stack y carruseles
npx skills add astrolicious/agent-skills@astro -g -y
npx skills add https://www.blossom-carousel.com -g -y

# Scroll smooth (sin zoom) y animaciones
npx skills add greensock/gsap-skills@gsap-core -g -y
npx skills add greensock/gsap-skills@gsap-scrolltrigger -g -y
npx skills add jerrar670/surf-website@implement_lenis_scroll -g -y

# Calidad
npx skills add addyosmani/web-quality-skills@accessibility -g -y
```

### Obligatorias (instalar sí o sí)

| Skill | Comando | Installs | Para qué |
|-------|---------|----------|----------|
| **GEO SEO** | `npx skills add resciencelab/opc-skills@seo-geo -g -y` | ~31K | SEO + optimización para motores generativos (ChatGPT, Perplexity, etc.) |
| **Technical SEO** | `npx skills add aaron-he-zhu/seo-geo-claude-skills@technical-seo-checker -g -y` | ~5K | Auditoría técnica: meta, sitemap, robots, canonical |
| **SEO Content Writer** | `npx skills add aaron-he-zhu/seo-geo-claude-skills@seo-content-writer -g -y` | ~7K | Redacción de títulos, descriptions y copy on-page |
| **GEO Content Optimizer** | `npx skills add aaron-he-zhu/seo-geo-claude-skills@geo-content-optimizer -g -y` | ~5K | Estructurar contenido para citabilidad en IA |
| **Astro** | `npx skills add astrolicious/agent-skills@astro -g -y` | ~9K | Patrones correctos de Astro 4 (layouts, islands, integraciones) |
| **GSAP Core** | `npx skills add greensock/gsap-skills@gsap-core -g -y` | ~27K | Animaciones base |
| **GSAP ScrollTrigger** | `npx skills add greensock/gsap-skills@gsap-scrolltrigger -g -y` | ~26K | Animaciones ligadas al scroll (complemento de Lenis) |
| **Blossom Carousel** | `npx skills add https://www.blossom-carousel.com -g -y` | oficial | Carruseles nativos con drag, loop (patrón Repeat) y controles |
| **Lenis Scroll** | `npx skills add jerrar670/surf-website@implement_lenis_scroll -g -y` | ~215 | Scroll vertical suave (inercia), **sin efectos de zoom** |
| **Accesibilidad** | `npx skills add addyosmani/web-quality-skills@accessibility -g -y` | ~31K | WCAG, carruseles accesibles, reduced motion |

### Recomendadas (complementarias)

| Skill | Comando | Para qué |
|-------|---------|----------|
| GSAP Performance | `npx skills add greensock/gsap-skills@gsap-performance -g -y` | Evitar jank en animaciones |
| Keyword Research | `npx skills add aaron-he-zhu/seo-geo-claude-skills@keyword-research -g -y` | Keywords para copy de servicios |

### Ya instaladas en la máquina (usar sin reinstalar)

Verificar que estén disponibles en Cursor/Codex:

- `web-design-guidelines` — `C:\Users\Matias\.cursor\skills-cursor\web-design-guidelines\SKILL.md`
- `software-ui-ux-design` — `C:\Users\Matias\.agents\skills\software-ui-ux-design\SKILL.md`
- `tailwindcss-mobile-first` — útil como referencia responsive aunque el sitio use Bootstrap legacy
- `refactoring-patterns` — para limpieza de CSS/JS legacy
- `node` — buenas prácticas al agregar dependencias npm

---

## Principios de ejecución

1. **No reescribir la web desde cero.** Trabajar sobre componentes Astro existentes en `src/`.
2. **Commits atómicos** por fase o subtarea (ej: `fix(header): proporciones del logo`, `feat(seo): og tags y sitemap`).
3. **Respetar `prefers-reduced-motion`.** Lenis y GSAP deben desactivarse o simplificarse cuando el usuario lo indique (ya hay base en `Layout.astro`).
4. **Unificar la marca:** decidir y aplicar una sola forma → `ON Bjorn` (recomendado en textos visibles) vs `ON BJORN` (solo si se prefiere en logo).
5. **Tono de voz:** unificar en **vos** (rioplatense) en toda la web, coherente con "¿Tenés alguna pregunta…?" del FAQ.
6. **No commitear secretos** ni tocar infra AWS salvo que sea estrictamente necesario.
7. **Probar en mobile (375px), tablet (768px) y desktop (1280px+)** antes de dar por cerrada cada fase.
8. **Leer y aplicar la skill `seo-geo`** al inicio de la Fase 4 (SEO).
9. **Carruseles con Blossom Carousel** (`@blossom-carousel/core`). No usar Swiper, Embla ni reactivar Owl legacy.
10. **Scroll smooth, no zoom:** Lenis solo para suavizar el desplazamiento vertical (inercia del wheel/trackpad). **Prohibido** usar scale, zoom, parallax de profundidad o transformaciones que agranden/achiquen contenido al scrollear. GSAP limitado a fades y desplazamientos sutiles (`opacity`, `y`) al entrar en viewport — nunca `scale` ligado al scroll.
11. **Iconos desde icons0.dev:** buscar en [icons0.dev](https://icons0.dev/), **descargar los SVG** y commitearlos en `public/images/icons/`. No usar emojis, icon fonts ni instalar librerías de iconos vía npm/React.

---

## Orden de fases (dependencias)

```
Fase 0 → Assets y logo (bloqueante)
Fase 1 → Header / logo responsive
Fase 2 → Iconos de servicios
Fase 3 → Carrusel infinito de servicios (Blossom Carousel)
Fase 4 → SEO / GEO
Fase 5 → Copy y gramática
Fase 6 → Lenis (scroll smooth) + GSAP (entradas sutiles, sin zoom)
Fase 7 → Contenido nuevo de valor
Fase 8 → Limpieza legacy y verificación final
```

---

## Fase 0 — Assets de marca (bloqueante)

### Problema

- `public/images/resource/ON_BJORN_ISO.png` está referenciado en:
  - `src/layouts/Layout.astro` (favicon)
  - `src/components/inicio/Presentacion.astro` (isotipo central del hero)
- El archivo **no existe** en el repositorio → favicon y hero rotos.

### Tareas

1. **Obtener o recrear** el isotipo ON Bjorn en PNG (ideal: 512×512 para favicon + versiones @2x).
2. Agregar a `public/images/resource/`:
   - `ON_BJORN_ISO.png` — isotipo
   - Considerar variantes: `logo-header.svg` (wordmark optimizado para header), `logo-header-mobile.svg`
3. Si `marca-de-agua.png` es muy ancha para header, crear versión compacta solo con wordmark (sin marca de agua de fondo).
4. Agregar `favicon.ico` y/o `apple-touch-icon.png` en `public/`.
5. Actualizar `<link rel="icon">` en `Layout.astro` con tamaños correctos.

### Criterios de aceptación

- [ ] Favicon visible en pestaña del navegador
- [ ] Isotipo central del hero carga sin 404
- [ ] Assets optimizados (WebP opcional con fallback PNG)

---

## Fase 1 — Header y logo (mobile + desktop)

### Problema detectado

Archivos involucrados:

- `src/components/shared/Header.astro`
- `public/css/module-css/header.css` (líneas ~2037–2147)
- `public/css/responsive.css`

Reglas problemáticas en `header.css`:

```css
.logo { min-width: 19vw; height: 7.8vh; margin-left: 4vw; }
/* ≤1340px */ .main-header-one__logo-box img { width: 68vw; height: 5.7vh; }
/* ≥1310px */ .main-header-one__logo-box img { width: 21vw; height: 7.7vh; }
/* mobile menu */ .mobile-menu .nav-logo img { width: 80vw; height: 7vh; }
```

El logo usa unidades `vw`/`vh` que hacen que ocupe casi toda la pantalla en tablet y menú móvil.

Además, hay CSS muerto en `Header.astro`: clase `.main-header.sticky` que nunca se aplica (el JS usa `fixed-header`).

### Tareas

1. **Redefinir tamaños del logo** con un enfoque estable:
   - Desktop: altura fija ~40–48px, ancho `auto`, `max-width` razonable (~180px)
   - Tablet: altura ~36px
   - Mobile header: altura ~32px, sin `min-width: 19vw`
   - Menú móvil (`.nav-logo img`): máx. 160–200px de ancho, centrado, **no** 80vw
2. Usar **SVG** si está disponible (mejor nitidez en retina).
3. Alinear verticalmente logo + nav + hamburguesa con flexbox (revisar `padding` de `.main-header-one__logo-box`).
4. En estado `fixed-header` (scroll > 50px): verificar que el logo no salte de tamaño ni se recorte.
5. Eliminar o corregir estilos muertos (`.main-header.sticky` vs `.fixed-header`).
6. Asegurar que `scroll-margin-top: 100px` en `Layout.astro` siga compensando anchors con el nuevo header.
7. Misma imagen/logo coherente en `Footer.astro`.

### Criterios de aceptación

- [ ] Logo legible y proporcionado en 375px, 768px y 1280px
- [ ] No desborda el contenedor del header en ningún breakpoint
- [ ] Menú móvil: logo centrado, tamaño contenido
- [ ] Header fijo al scroll sin saltos visuales (layout shift)

---

## Fase 2 — Iconos de servicios ([icons0.dev](https://icons0.dev/))

### Directiva del cliente

Usar **[icons0.dev](https://icons0.dev/)** como única fuente de iconos. **Descargar los SVG y guardarlos en el repositorio** — no linkear URLs externas en runtime ni depender de paquetes npm de iconos.

**Por qué guardarlos localmente:**
- Sin dependencia de red al cargar la web
- Control total del color vía CSS (`currentColor`)
- Mejor performance (sin requests extra)
- Los SVG quedan versionados y auditables en git
- Coherente con el stack Astro estático del proyecto

### Problema

Emojis Unicode en:
- `src/components/inicio/Presentacion.astro` (hero)
- `src/components/inicio/Servicios.astro` → `src/components/shared/Card.astro`

No transmiten profesionalismo ni coherencia visual con una agencia de desarrollo web.

### Servicios a iconificar

| Servicio | Emoji actual | Búsqueda sugerida en icons0.dev | Archivo local |
|----------|-------------|----------------------------------|---------------|
| Desarrollo web | 🌀 | `code`, `globe`, `layout` — colección **lucide** o **phosphor** | `desarrollo-web.svg` |
| Rebranding de marca | 🎨 | `palette`, `brush`, `sparkles` — misma colección que el resto | `rebranding.svg` |
| E-commerce | 👟 | `shopping-cart`, `store`, `bag` | `e-commerce.svg` |
| Webs empresariales | 💼 | `building`, `briefcase`, `landmark` | `webs-empresariales.svg` |
| Portfolio web interactivo | 📑 | `folder`, `presentation`, `user` | `portfolio-web.svg` |
| Sistemas de stock | 📦 | `package`, `boxes`, `warehouse` | `sistemas-stock.svg` |

> **Importante:** los 6 iconos deben venir de la **misma colección** (ej. todos `lucide` o todos `phosphor`) para mantener peso de trazo y estilo uniforme.

### Flujo de descarga (manual o por Codex)

1. Ir a [icons0.dev](https://icons0.dev/)
2. Elegir colección (recomendado: **lucide** — outline, limpio, combina con el sitio oscuro)
3. Buscar cada icono según la tabla de arriba
4. En el panel del icono, usar **Copy as → SVG**
5. Guardar el contenido en `public/images/icons/services/<nombre>.svg`
6. Verificar la **licencia** del icono en icons0.dev antes de commitear (filtrar por licencia MIT/Apache si hay duda)
7. Repetir para los 6 servicios + iconos de la sección "Por qué ON Bjorn" (Fase 7) si aplica

**Estructura de carpetas** (ver también `public/images/icons/README.md`):

```
public/images/icons/
├── services/
│   ├── desarrollo-web.svg
│   ├── rebranding.svg
│   ├── e-commerce.svg
│   ├── webs-empresariales.svg
│   ├── portfolio-web.svg
│   └── sistemas-stock.svg
└── pillars/                    ← opcional, Fase 7
    ├── desarrollo-a-medida.svg
    ├── acompanamiento.svg
    ├── presencia-online.svg
    └── enfoque-emprendedores.svg
```

### Preparación de cada SVG descargado

Antes de commitear, normalizar cada archivo:

```svg
<!-- Ejemplo: usar currentColor para que el CSS controle el color de marca -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
     aria-hidden="true">
  <!-- paths del icono descargado -->
</svg>
```

Checklist por archivo:
- [ ] `viewBox` consistente (idealmente `0 0 24 24`)
- [ ] Colores fijos (`#000`, `#fff`) reemplazados por `currentColor` donde corresponda
- [ ] Sin `width`/`height` fijos en el SVG (el tamaño lo define CSS: 48px cards, 40px hero)
- [ ] `aria-hidden="true"` en el markup del componente, no dentro del archivo SVG

### Integración en código

1. Refactorizar `Card.astro` para aceptar `iconSrc: string` (ruta al SVG local) en lugar de `icon` (emoji).
2. Renderizar con `<img src={iconSrc} alt="" aria-hidden="true" />` o inline SVG si se prefiere colorear con CSS (`currentColor`).
3. Actualizar `Presentacion.astro` y `Servicios.astro` con las rutas locales.
4. Agregar clase CSS compartida para tamaño y color:

```css
.service-icon {
  width: 48px;
  height: 48px;
  color: var(--thm-base, #FF6C1E);
}
.feature-one__icon .service-icon {
  width: 40px;
  height: 40px;
}
```

5. Mantener el nombre del servicio como texto accesible; el icono es decorativo.
6. Unificar nomenclatura de servicios entre hero y carrusel (ver Fase 5).

### Lo que NO hacer

- ❌ No usar emojis
- ❌ No instalar `@iconify/*`, `lucide-react`, `phosphor-icons` ni similares vía npm
- ❌ No usar `npx shadcn add` de icons0 (genera componentes React; este proyecto es Astro estático)
- ❌ No hotlinkar SVGs desde icons0.dev o CDNs externos en producción
- ❌ No mezclar colecciones (lucide + phosphor + tabler en la misma sección)

### Ayuda opcional para el agente (MCP)

icons0.dev expone un **MCP server** para buscar iconos desde el agente. Sirve para **encontrar** el icono correcto, pero el SVG final igual debe **descargarse y guardarse** en `public/images/icons/`.

Referencia: [github.com/marcoripa96/i0](https://github.com/marcoripa96/i0)

### Criterios de aceptación

- [ ] Los 6 iconos de servicios existen como archivos `.svg` en `public/images/icons/services/`
- [ ] Todos provienen de icons0.dev (misma colección)
- [ ] Cero emojis en hero y carrusel de servicios
- [ ] Cero dependencias npm de librerías de iconos
- [ ] Iconos nítidos en retina y coloreables con `--thm-base`
- [ ] Mismo set y estilo en hero y carrusel

---

## Fase 3 — Carrusel de servicios con Blossom Carousel (loop infinito)

### Directiva del cliente

Usar **[Blossom Carousel](https://blossom-carousel.com/)** — carrusel native-first que mejora el scroll nativo con drag físico en desktop, sin reemplazar el comportamiento del navegador.

### Estado actual

`src/components/inicio/Servicios.astro`:
- `overflow-x: auto` + drag manual con mouse
- Sin loop, sin flechas, sin autoplay
- En tablet (768–1199px) las cards siguen al 25% de ancho → se ven muy pequeñas
- ID con typo: `service-carrousel`

### Por qué Blossom (y no Swiper/Embla/Owl)

- Se apoya en **scroll nativo** → mejor accesibilidad y performance en touch (0 KB de engine en dispositivos táctiles)
- Drag con física en desktop, swipe nativo en mobile
- Configuración responsive vía **CSS** (`scroll-snap`, `grid-auto-columns`, media queries)
- Loop infinito mediante el patrón **Repeat** (documentado como experimental en la lib)
- Coherente con el carrusel actual (ya es scroll horizontal nativo) — migración incremental

### Skill obligatoria para esta fase

```bash
npx skills add https://www.blossom-carousel.com -g -y
```

Leer la documentación oficial antes de implementar:
- [Installation (Core)](https://www.blossom-carousel.com/docs/getting-started/installation)
- [Repeat (loop infinito)](https://www.blossom-carousel.com/docs/examples/repeat)
- [Buttons](https://www.blossom-carousel.com/docs/examples/buttons)
- [Dots](https://www.blossom-carousel.com/docs/examples/dots)

### Instalación

```bash
npm install @blossom-carousel/core
```

```js
import { Blossom } from "@blossom-carousel/core";
import "@blossom-carousel/core/style.css";

const element = document.querySelector("#service-carousel");
const blossom = Blossom(element);
blossom.init();
```

**Lazy loading recomendado** (solo carga drag engine en dispositivos con mouse):

```js
const hasMouse = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
if (hasMouse) {
  const { Blossom } = await import("@blossom-carousel/core");
  // ...
}
```

### Tareas

1. Instalar `@blossom-carousel/core` y la skill oficial de Blossom.
2. Refactorizar `Servicios.astro`:
   - Corregir ID a `service-carousel`
   - Estructura: contenedor scrollable con slides como hijos directos
   - CSS con `scroll-snap-type: x mandatory` y `scroll-snap-align: start` por slide
   - Breakpoints responsive vía CSS (no JS):
     - Mobile: ~1 slide visible (`grid-auto-columns: 85%` o similar)
     - Tablet: 2 slides
     - Desktop: 3–4 slides
3. Implementar **loop infinito** con el patrón **Repeat** de Blossom (duplicar slides al inicio/fin o seguir el ejemplo oficial Repeat).
4. Agregar controles:
   - Botones prev/next que llamen `blossom.prev()` y `blossom.next()`
   - Dots de paginación con `IntersectionObserver` o evento `scrollsnapchange` (ver ejemplo Dots de Blossom)
5. **Autoplay opcional:** timer que llame `blossom.next()` cada ~4–5 s; pausar en `hover` y `focus-within`.
6. Respetar `prefers-reduced-motion`: desactivar autoplay; mantener scroll manual.
7. Eliminar el JS de drag manual actual (Blossom lo reemplaza en desktop).
8. Mantener `role="region"` y `aria-label="Carrusel de servicios"`.
9. **No usar** el evento `overscroll` de Blossom para efectos de `scale` en slides (el ejemplo oficial lo muestra, pero va contra la directiva de no-zoom del cliente).

### Criterios de aceptación

- [ ] Carrusel implementado con `@blossom-carousel/core` (no Swiper/Embla/Owl)
- [ ] Loop infinito perceptible sin salto brusco (patrón Repeat)
- [ ] Touch/swipe nativo funcional en mobile
- [ ] Drag físico en desktop
- [ ] Flechas y dots de navegación
- [ ] Cards legibles en tablet (no al 25% de ancho)
- [ ] Autoplay desactivado con `prefers-reduced-motion`
- [ ] Skill blossom-carousel consultada durante la implementación

---

## Fase 4 — SEO y GEO

> **Usar skill `seo-geo`** (`resciencelab/opc-skills@seo-geo`) como guía principal de esta fase.

### Estado actual (`src/layouts/Layout.astro`)

Presente:
- `<meta name="description">` (única para todo el sitio)
- `<title>` global
- `lang="es"`
- `theme-color`

Ausente:
- Open Graph (`og:title`, `og:description`, `og:image`, `og:url`, `og:type`)
- Twitter Cards
- `<link rel="canonical">`
- JSON-LD (Organization, LocalBusiness, WebSite, FAQPage)
- `robots.txt`
- `sitemap.xml`
- Meta por página (`/about`, `/contact`, `/404`)
- `hreflang` (opcional, solo ES)

### Tareas

1. Instalar integración Astro:
   ```bash
   npx astro add sitemap
   ```
   (Genera `sitemap-index.xml` usando `site: 'https://onbjorn.com'` de `astro.config.mjs`)

2. Crear `public/robots.txt`:
   ```
   User-agent: *
   Allow: /
   Sitemap: https://onbjorn.com/sitemap-index.xml
   ```

3. Refactorizar `Layout.astro` para aceptar props SEO:
   ```astro
   interface Props {
     title?: string;
     description?: string;
     ogImage?: string;
     canonical?: string;
     noindex?: boolean;
   }
   ```

4. Definir meta únicos por página:

   | Página | Title sugerido | Description sugerida |
   |--------|---------------|---------------------|
   | `/` | ON Bjorn — Desarrollo web y diseño para emprendedores | Agencia de desarrollo web, e-commerce y rebranding en Buenos Aires. Potenciá tu emprendimiento online. |
   | `/about` | Sobre nosotros — ON Bjorn | Conocé al equipo y las herramientas con las que desarrollamos tu marca online. |
   | `/contact` | Contacto — ON Bjorn | Contactanos para empezar tu proyecto web. Buenos Aires, Argentina. |
   | `/404` | Página no encontrada — ON Bjorn | … |

5. Agregar **JSON-LD** en home:
   - `Organization` + `LocalBusiness` (nombre, url, teléfono +54 11 6820 4445, dirección Buenos Aires, sameAs redes)
   - `WebSite` con `potentialAction: SearchAction` (opcional)
   - `FAQPage` en home (las 7 preguntas de `Preguntas.astro`)

6. Crear imagen OG (`public/images/og-default.jpg`, 1200×630) con marca ON Bjorn.

7. Aplicar **GEO** (skill): estructurar contenido para que motores de IA puedan citar:
   - Definición clara de qué es ON Bjorn en primer párrafo visible
   - Listas de servicios con descripciones concretas
   - FAQ con respuestas directas y datos (ej: estadística de e-commerce USA en FAQ-1 — verificar fuente o marcar como aproximada)
   - Headings jerárquicos correctos (un solo `h1` por página ✓ ya en home)

8. Ejecutar checklist de `technical-seo-checker` al finalizar.

### Criterios de aceptación

- [ ] Cada página tiene `<title>` y `description` únicos
- [ ] OG tags presentes y válidos (probar con https://www.opengraph.xyz/)
- [ ] `sitemap-index.xml` generado en build
- [ ] `robots.txt` accesible
- [ ] JSON-LD válido (probar con Google Rich Results Test)
- [ ] Canonical en todas las páginas

---

## Fase 5 — Copy, gramática y consistencia

### Reglas de español a aplicar

1. **No usar Title Case** (estilo inglés). En español solo se capitaliza la primera palabra del enunciado y nombres propios.
   - ❌ `Potencia tu Emprendimiento` → ✅ `Potencia tu emprendimiento`
   - ❌ `Nuestros Servicios` → ✅ `Nuestros servicios`
   - ❌ `Para Ayudar a tu Emprendimiento` → ✅ `Para ayudar a tu emprendimiento`
   - ❌ `Desarrollamos tu Marca Online` → ✅ `Desarrollamos tu marca online`
   - ❌ `Emprende Online` → ✅ `Emprendé online`
   - ❌ `Redes Sociales` → ✅ `redes sociales`

2. **Tildes obligatorias:**
   - `Contactanos` → `Contáctanos`
   - `paginas` → `páginas`
   - `Emprende` → `Emprendé` (imperativo voseo)

3. **Tono unificado en vos** (rioplatense) en toda la web:
   - Cambiar respuestas del FAQ que usan "usted/su" a "vos/tu"
   - Ejemplo FAQ-1: "estarías perdiendo" en lugar de "usted estaría perdiendo"

4. **Nombres de servicios unificados** (elegir una forma y aplicar en hero + carrusel):

   | Actual (inconsistente) | Propuesta unificada |
   |------------------------|---------------------|
   | E-commerce / E-Commerce | E-commerce |
   | Web Empresariales | Webs empresariales |
   | Portfolio / CV Web Interactivo / Portfolio Web Interactivo | Portfolio web interactivo |
   | Sistemas Stock / Sistemas de Stock | Sistemas de stock |
   | Rebranding Marca / Rebranding | Rebranding de marca |

### Archivos a revisar

- `src/layouts/Layout.astro` — title
- `src/components/inicio/Presentacion.astro` — h1 y labels de servicios
- `src/components/inicio/Servicios.astro` — h2 y contenido de cards
- `src/components/inicio/Preguntas.astro` — 7 FAQs completas
- `src/components/shared/Contacto.astro`
- `src/pages/about.astro`
- `src/pages/contact.astro`
- `src/pages/index.astro` — título de sección proyectos
- `src/components/shared/Footer.astro` — copyright

### Criterios de aceptación

- [ ] Cero instancias de Title Case incorrecto en español
- [ ] Tildes correctas en imperativos (contactanos → Contáctanos)
- [ ] Tono vos consistente en FAQ y CTAs
- [ ] Nombres de servicios idénticos en hero y carrusel

---

## Fase 6 — Scroll smooth (Lenis) + entradas sutiles (GSAP)

### Directiva del cliente

> La web debe **sentirse smooth** al navegar, pero **no** debe hacer zoom ni escalar contenido al scrollear.

Esto significa:
- **Sí:** inercia suave al bajar/subir la página, transiciones fluidas entre secciones
- **No:** efectos de scale/zoom, parallax agresivo, elementos que crecen o achican con el scroll, scrub de transformaciones dramáticas

### Estado actual

- Scroll 100% nativo (sin inercia)
- `prefers-reduced-motion` ya contemplado en `Layout.astro`
- Clases `wow fadeInUp` en `Proyectos.astro` y `Footer.astro` **sin efecto** (WOW.js no cargado)
- GSAP comentado en `public/js/script.js` (no se usa)
- Animaciones CSS existentes (`float-bob`, `zoominout`, `img-bounce` en shapes decorativos del hero) — **revisar** `zoominout`: si resulta intrusivo, suavizar o limitar a elementos decorativos con `aria-hidden`, nunca al contenido principal

### Dependencias a agregar

```bash
npm install lenis gsap
```

### Configuración Lenis (scroll smooth, no invasivo)

Objetivo: que el scroll se sienta **mantequilla**, no que los elementos reaccionen con zoom.

```js
const lenis = new Lenis({
  duration: 1.0,        // moderado — no demasiado lento
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo suave
  smoothWheel: true,
  wheelMultiplier: 0.9, // ligeramente atenuado para no sentirse "flotante"
  touchMultiplier: 1,   // en mobile, considerar desactivar Lenis y dejar scroll nativo
});
```

**Recomendaciones:**
- En **mobile**, evaluar **no inicializar Lenis** y dejar el scroll nativo del SO (suele sentirse mejor en iOS/Android).
- Conectar Lenis con GSAP ScrollTrigger solo para sincronizar triggers: `lenis.on('scroll', ScrollTrigger.update)`.
- **Desactivar Lenis** si `prefers-reduced-motion: reduce`.

### GSAP — solo entradas al viewport (sin zoom)

Usar ScrollTrigger únicamente para revelar contenido al entrar en pantalla:

| Permitido | Prohibido |
|-----------|-----------|
| `opacity: 0 → 1` | `scale` ligado al scroll |
| `y: 24–40px → 0` (entrada suave) | `scrub` con transformaciones |
| `duration: 0.6–0.8`, `ease: "power2.out"` | Parallax de capas a distinta velocidad |
| Stagger leve en listas | Pin + zoom de secciones enteras |

Aplicar en:
- `src/components/inicio/Proyectos.astro` (3 bloques de proyecto)
- `src/components/shared/Footer.astro`
- Opcional: fade-in de títulos de sección (Servicios, FAQ, Contacto)

**No animar** header, logo ni carrusel Blossom.

### Tareas

1. **Leer skills** `implement_lenis_scroll`, `gsap-core`, `gsap-scrolltrigger` antes de implementar.
2. Crear `src/scripts/scroll.ts` (o `.js`):
   - Inicializar Lenis con config moderada (ver arriba)
   - Loop `requestAnimationFrame` → `lenis.raf(time)`
   - Integrar con ScrollTrigger si hay animaciones GSAP
   - Guard: no iniciar si `prefers-reduced-motion`
   - Guard: opcionalmente no iniciar en viewport mobile (`max-width: 767px`)
3. Cargar el script en `Layout.astro` (solo cliente):
   ```astro
   <script>
     import '../scripts/scroll';
   </script>
   ```
4. Reemplazar clases `wow fadeInUp` por animaciones GSAP de entrada (opacity + y, sin scale).
5. Auditar clases `zoominout` del template en contenido visible — mantener solo en decorativos (`aria-hidden`) o reemplazar por `float-bob` sutil.
6. **No usar** `public/js/script.js` ni jQuery.
7. Verificar que **Lenis no interfiera** con el scroll horizontal del carrusel Blossom (Lenis debe ignorar eventos dentro de `#service-carousel` o usar `prevent` en nodos hijos del carrusel según docs de Lenis).

### Criterios de aceptación

- [ ] El scroll vertical se siente notablemente más suave en desktop
- [ ] **Ningún elemento de contenido** hace zoom/scale al scrollear
- [ ] Sin conflictos con menú móvil ni carrusel Blossom
- [ ] `prefers-reduced-motion` desactiva Lenis y animaciones GSAP
- [ ] Proyectos y footer aparecen con fade-in sutil al entrar en viewport
- [ ] Sin sensación de "flotar" o lag excesivo (duration ≤ 1.2)
- [ ] Lighthouse performance ≥ 85

---

## Fase 7 — Contenido de valor (sin cambiar el mensaje)

Agregar contenido que refuerce confianza y SEO, manteniendo estructura visual existente.

### 7.1 Home — sección "Por qué ON Bjorn" (nueva)

Insertar entre `Servicios` y `Proyectos` en `src/pages/index.astro`.

Contenido sugerido (3–4 pilares con iconos de Fase 2, también desde [icons0.dev](https://icons0.dev/) descargados a `public/images/icons/pillars/`):

- **Desarrollo a medida** — Cada proyecto se adapta a tu objetivo, no usamos plantillas genéricas.
- **Acompañamiento cercano** — Comunicación fluida durante todo el proceso.
- **Presencia online real** — No solo diseño: hosting, deploy y optimización.
- **Enfoque en emprendedores** — Entendemos las necesidades de quien está empezando o escalando.

### 7.2 Home — mejorar intro de proyectos

Texto actual en `index.astro` es genérico. Expandir con 1–2 oraciones sobre tipo de clientes (ingeniería, e-commerce, servicios).

### 7.3 About — proceso de trabajo (nueva subsección)

Agregar en `about.astro` un bloque "Cómo trabajamos" con 4 pasos:

1. Charla inicial y definición de objetivos
2. Propuesta y diseño
3. Desarrollo e iteración
4. Lanzamiento y entrega

### 7.4 About — ampliar "valores" existentes

La sección `ai-product` en about tiene valores. Revisar copy con skill `seo-content-writer` para que sean más específicos y menos genéricos.

### 7.5 Contact — expectativas de respuesta

Agregar debajo del formulario/datos: "Respondemos en menos de 24 horas hábiles."

### 7.6 Datos de confianza (opcional)

Si hay métricas reales, agregarlas (ej: "X proyectos entregados"). **No inventar números** si no están verificados.

### Criterios de aceptación

- [ ] Al menos 1 sección nueva de valor en home
- [ ] Proceso de trabajo visible en about
- [ ] Contenido coherente con vos/tono de marca
- [ ] Nuevos textos pasan por revisión gramatical de Fase 5

---

## Fase 8 — Limpieza y verificación final

### Tareas

1. Eliminar CSS/JS legacy no usado **solo si es seguro** (muchos archivos en `public/css/module-css/` no se referencian — auditar antes de borrar).
2. Quitar clases `wow fadeIn*` huérfanas tras migrar a GSAP.
3. Verificar build de producción: `npm run build && npm run preview`.
4. Correr checklist completo:

### Checklist de verificación

**Visual / UX**
- [ ] Logo OK en mobile, tablet, desktop
- [ ] Carrusel Blossom con loop infinito
- [ ] Iconos SVG locales desde icons0.dev en servicios
- [ ] Scroll Lenis smooth (sin zoom al scrollear)
- [ ] Animaciones GSAP sutiles (fade-in, sin scale)
- [ ] Menú móvil funcional (abrir/cerrar/Escape)

**SEO / GEO**
- [ ] Titles y descriptions únicos
- [ ] OG image
- [ ] Sitemap y robots
- [ ] JSON-LD válido
- [ ] Skill seo-geo aplicada

**Contenido**
- [ ] Gramática y tildes
- [ ] Tono vos consistente
- [ ] Servicios unificados

**Técnico**
- [ ] Sin 404 de imágenes
- [ ] Lighthouse: Performance ≥ 85, Accessibility ≥ 90, SEO ≥ 95
- [ ] `prefers-reduced-motion` respetado
- [ ] Deploy workflow (`.github/workflows/deploy.yml`) sigue pasando

---

## Mapa de archivos clave

```
src/
├── layouts/Layout.astro          ← SEO props, Lenis/GSAP script, meta global
├── pages/
│   ├── index.astro               ← Orden de secciones, título proyectos
│   ├── about.astro               ← Copy Title Case, nueva sección proceso
│   ├── contact.astro             ← Copy, meta
│   └── 404.astro
├── components/
│   ├── shared/
│   │   ├── Header.astro          ← Logo, menú móvil, fixed-header JS
│   │   ├── Footer.astro          ← Logo, animaciones
│   │   ├── Card.astro            ← Iconos SVG
│   │   └── Contacto.astro        ← CTA copy
│   └── inicio/
│       ├── Presentacion.astro    ← Hero h1, isotipo, iconos servicios
│       ├── Servicios.astro       ← Carrusel → Blossom Carousel (loop Repeat)
│       ├── Proyectos.astro       ← Animaciones GSAP
│       └── Preguntas.astro       ← FAQ copy + JSON-LD fuente
├── scripts/
│   └── scroll.ts                 ← NUEVO: Lenis (smooth) + GSAP (fade-in)
public/
├── images/
│   ├── resource/                 ← ON_BJORN_ISO.png (FALTANTE), logos
│   └── icons/
│       ├── services/             ← SVGs descargados de icons0.dev (6 servicios)
│       └── pillars/              ← SVGs opcionales Fase 7
├── robots.txt                    ← NUEVO
└── css/module-css/header.css     ← Tamaños logo (crítico)
astro.config.mjs                  ← site URL, sitemap integration
package.json                    ← @blossom-carousel/core, lenis, gsap, @astrojs/sitemap
```

---

## Dependencias npm finales esperadas

```json
{
  "dependencies": {
    "astro": "^4.7.0",
    "@blossom-carousel/core": "^0.x",
    "gsap": "^3.x",
    "lenis": "^1.x"
  },
  "devDependencies": {
    "@astrojs/sitemap": "^3.x"
  }
}
```

Versiones exactas: usar las últimas compatibles con Astro 4 al momento de instalar.

---

## Notas para el ejecutor (Codex)

1. **Empezar leyendo este documento completo** y las skills listadas en "Obligatorias".
2. **Verificar skills con SkillSpector** (`SKILLS-SEGURIDAD.md`) antes de instalarlas — no asumir que un paquete de skills.sh es seguro por tener muchos installs.
3. **No saltar Fase 0** — el favicon roto y el isotipo faltante son bugs en producción.
3. Si no se dispone del archivo `ON_BJORN_ISO.png`, **preguntar al usuario** o usar placeholder temporal con issue documentado; no inventar un logo.
4. Priorizar cambios en `src/` sobre modificar `public/css/` legacy; si se modifica `header.css`, comentar qué reglas se cambiaron y por qué.
5. Hacer **un commit por fase** (o por subtarea grande) con mensajes en español o inglés según convención del repo.
6. Al terminar, dejar un breve `CHANGELOG.md` o sección al final de este doc con lo implementado y lo pendiente.
7. **Blossom para sliders, Lenis para smooth scroll sin zoom, icons0.dev para iconos** — ver directivas en Objetivo general y Fases 2, 3 y 6.

---

## Prompt sugerido para iniciar Codex

```
Lee PLAN-MEJORA-WEB.md y SKILLS-SEGURIDAD.md en la raíz del repo.
Verifica con NVIDIA SkillSpector que las skills a instalar no sean dañinas (risk score ≤ 20).
Instala solo las skills aprobadas. Ejecuta las fases 0→8 en orden.
Usa Blossom Carousel para el carrusel de servicios (no Swiper).
Lenis solo para scroll vertical smooth — sin zoom ni scale al scrollear.
Iconos desde icons0.dev: descargar SVG y guardar en public/images/icons/ (no npm, no emojis).
No inventes assets de marca ni métricas. Usa la skill seo-geo en la Fase 4.
Commitea por fase. Al finalizar, actualiza la sección "Registro de ejecución".
```

---

## Registro de ejecución

_Pendiente — completar al finalizar la implementación._

| Fase | Estado | Commit(s) | Notas |
|------|--------|-----------|-------|
| 0 | ⬜ Pendiente | | |
| 1 | ⬜ Pendiente | | |
| 2 | ⬜ Pendiente | | |
| 3 | ⬜ Pendiente | | |
| 4 | ⬜ Pendiente | | |
| 5 | ⬜ Pendiente | | |
| 6 | ⬜ Pendiente | | |
| 7 | ⬜ Pendiente | | |
| 8 | ⬜ Pendiente | | |
