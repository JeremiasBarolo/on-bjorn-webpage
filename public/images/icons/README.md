# Iconos ON BJORN

SVGs descargados desde [icons0.dev](https://icons0.dev/) y guardados en el repo.

Ver **Fase 2** en `PLAN-MEJORA-WEB.md` para el flujo completo.

## `services/` — carrusel y hero (obligatorio)

| Archivo | Servicio | Búsqueda sugerida en icons0.dev |
|---------|----------|----------------------------------|
| `desarrollo-web.svg` | Desarrollo web | `code`, `globe`, `layout` |
| `rebranding.svg` | Rebranding de marca | `palette`, `brush` |
| `e-commerce.svg` | E-commerce | `shopping-cart`, `store` |
| `webs-empresariales.svg` | Webs empresariales | `building`, `briefcase` |
| `portfolio-web.svg` | Portfolio web interactivo | `presentation`, `folder` |
| `sistemas-stock.svg` | Sistemas de stock | `package`, `warehouse` |

Usar la **misma colección** para los 6 (recomendado: `lucide`).

## `pillars/` — sección "Por qué ON BJORN" (opcional, Fase 7)

| Archivo | Pilar |
|---------|-------|
| `desarrollo-a-medida.svg` | Desarrollo a medida |
| `acompanamiento.svg` | Acompañamiento cercano |
| `presencia-online.svg` | Presencia online real |
| `enfoque-emprendedores.svg` | Enfoque en emprendedores |

## Cómo descargar

1. Ir a [icons0.dev](https://icons0.dev/)
2. Filtrar por colección (ej. `lucide`)
3. Buscar el icono → **Copy as → SVG**
4. Guardar en la carpeta correspondiente con el nombre de la tabla
5. Normalizar: `viewBox="0 0 24 24"`, `currentColor` en lugar de colores fijos

## Uso en código

```astro
<img src="/images/icons/services/desarrollo-web.svg" alt="" class="service-icon" aria-hidden="true" />
```

No hotlinkar URLs externas. No instalar paquetes npm de iconos.
