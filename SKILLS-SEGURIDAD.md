# Verificación de skills con NVIDIA SkillSpector

> **Proceso externo al plan de mejora web** — ejecutar **antes** de instalar cualquier skill con `npx skills add`.  
> **Herramienta:** [NVIDIA/SkillSpector](https://github.com/NVIDIA/SkillSpector) (Apache 2.0, Python 3.12+)

---

## Por qué

Las agent skills se ejecutan con alto nivel de confianza implícita. SkillSpector analiza patrones de riesgo (inyección de prompts, exfiltración de datos, código peligroso, supply chain, etc.) y devuelve un **risk score de 0 a 100** con recomendación.

**Regla del proyecto:** ninguna skill del plan `PLAN-MEJORA-WEB.md` se instala sin pasar SkillSpector primero.

---

## Instalación de SkillSpector (una sola vez en la PC de casa)

### Opción A — Python (recomendada si tenés Python 3.12+)

```bash
git clone https://github.com/NVIDIA/SkillSpector.git
cd SkillSpector

python3 -m venv .venv
source .venv/bin/activate   # Windows Git Bash: source .venv/Scripts/activate

make install
skillspector --version
```

### Opción B — Docker (sin instalar Python)

```bash
git clone https://github.com/NVIDIA/SkillSpector.git
cd SkillSpector
make docker-build

# Alias útil para escaneos repetidos
alias skillspector-docker='docker run --rm -v "$PWD:/scan" skillspector'
```

### Opción C — pip directo (sin clonar)

```bash
pip install git+https://github.com/NVIDIA/SkillSpector
skillspector --version
```

---

## Umbrales de decisión

| Risk score | Severidad | Acción |
|------------|-----------|--------|
| **0–20** | LOW — SAFE | ✅ Instalar |
| **21–50** | MEDIUM — CAUTION | ⚠️ Revisar hallazgos manualmente; instalar solo si son falsos positivos documentados |
| **51–80** | HIGH — DO NOT INSTALL | ❌ No instalar |
| **81–100** | CRITICAL — DO NOT INSTALL | ❌ No instalar |

SkillSpector devuelve **exit code 1** si `risk_score > 50` — útil para scripts de gate.

**Política recomendada para ON Bjorn:** instalar solo skills con score **≤ 20** en escaneo estático. Si el score está entre 21–50, correr análisis con LLM (segunda pasada) antes de decidir.

---

## Flujo por cada skill (checklist)

```
1. Escanear repositorio origen (estático, sin API key)
2. Guardar reporte en .planning/skillspector/
3. Si score ≤ 20 → npx skills add ...
4. Si score 21–50 → revisar reporte + opcional escaneo con LLM
5. Si score > 50 → NO instalar; buscar alternativa o omitir
6. Registrar resultado en la tabla de abajo
```

---

## Comandos de escaneo

### Escaneo estático (rápido, sin API key)

```bash
# Desde repo clonado de SkillSpector o con skillspector en PATH
skillspector scan <URL-o-ruta> --no-llm -V

# Guardar reporte Markdown
skillspector scan <URL-o-ruta> --no-llm --format markdown -o .planning/skillspector/<nombre-skill>.md

# Guardar JSON (para comparar entre versiones)
skillspector scan <URL-o-ruta> --no-llm --format json -o .planning/skillspector/<nombre-skill>.json
```

### Escaneo con análisis semántico (opcional, requiere API key)

Útil cuando el score estático está en zona gris (21–50):

```bash
export SKILLSPECTOR_PROVIDER=anthropic   # o openai, nv_build
export ANTHROPIC_API_KEY=sk-ant-...

skillspector scan <URL-o-ruta> --format markdown -o .planning/skillspector/<nombre-skill>-full.md
```

Alternativa local con Ollama (sin enviar código a APIs externas):

```bash
export SKILLSPECTOR_PROVIDER=openai
export OPENAI_API_KEY=ollama
export OPENAI_BASE_URL=http://localhost:11434/v1
export SKILLSPECTOR_MODEL=llama3.1:8b

skillspector scan <URL-o-ruta> --format markdown -o .planning/skillspector/<nombre-skill>-ollama.md
```

### Con Docker

```bash
mkdir -p .planning/skillspector

skillspector-docker scan https://github.com/resciencelab/opc-skills --no-llm \
  --format markdown -o .planning/skillspector/seo-geo.md
```

> **Nota:** con Docker, las URLs de Git funcionan; para `--output` el archivo debe escribirse dentro del volumen montado (`/scan` = directorio actual).

---

## Skills del plan — URLs a escanear

Escanear el **repositorio origen** antes de `npx skills add`. Si la skill vive en un subpath del monorepo, escanear también ese directorio tras un clone local.

| Skill del plan | Comando de instalación | URL para SkillSpector |
|----------------|------------------------|------------------------|
| GEO SEO | `npx skills add resciencelab/opc-skills@seo-geo -g -y` | `https://github.com/resciencelab/opc-skills` |
| Technical SEO | `npx skills add aaron-he-zhu/seo-geo-claude-skills@technical-seo-checker -g -y` | `https://github.com/aaron-he-zhu/seo-geo-claude-skills` |
| SEO Content Writer | `npx skills add aaron-he-zhu/seo-geo-claude-skills@seo-content-writer -g -y` | `https://github.com/aaron-he-zhu/seo-geo-claude-skills` |
| GEO Content Optimizer | `npx skills add aaron-he-zhu/seo-geo-claude-skills@geo-content-optimizer -g -y` | `https://github.com/aaron-he-zhu/seo-geo-claude-skills` |
| Astro | `npx skills add astrolicious/agent-skills@astro -g -y` | `https://github.com/astrolicious/agent-skills` |
| Blossom Carousel | `npx skills add https://www.blossom-carousel.com -g -y` | `https://github.com/jespervos/blossom-carousel` |
| GSAP Core | `npx skills add greensock/gsap-skills@gsap-core -g -y` | `https://github.com/greensock/gsap-skills` |
| GSAP ScrollTrigger | `npx skills add greensock/gsap-skills@gsap-scrolltrigger -g -y` | `https://github.com/greensock/gsap-skills` |
| Lenis Scroll | `npx skills add jerrar670/surf-website@implement_lenis_scroll -g -y` | `https://github.com/jerrar670/surf-website` |
| Accesibilidad | `npx skills add addyosmani/web-quality-skills@accessibility -g -y` | `https://github.com/addyosmani/web-quality-skills` |
| GSAP Performance *(opcional)* | `npx skills add greensock/gsap-skills@gsap-performance -g -y` | `https://github.com/greensock/gsap-skills` |
| Keyword Research *(opcional)* | `npx skills add aaron-he-zhu/seo-geo-claude-skills@keyword-research -g -y` | `https://github.com/aaron-he-zhu/seo-geo-claude-skills` |

> Los repos con varias skills (`seo-geo-claude-skills`, `gsap-skills`) se escanean **una vez**; el reporte cubre todo el repositorio.

---

## Script de barrido (bash)

Crear la carpeta de reportes y escanear todas las URLs del plan en un solo paso:

```bash
mkdir -p .planning/skillspector

REPOS=(
  "https://github.com/resciencelab/opc-skills"
  "https://github.com/aaron-he-zhu/seo-geo-claude-skills"
  "https://github.com/astrolicious/agent-skills"
  "https://github.com/jespervos/blossom-carousel"
  "https://github.com/greensock/gsap-skills"
  "https://github.com/jerrar670/surf-website"
  "https://github.com/addyosmani/web-quality-skills"
)

for repo in "${REPOS[@]}"; do
  name=$(basename "$repo")
  echo "=== Escaneando $name ==="
  skillspector scan "$repo" --no-llm -V \
    --format markdown -o ".planning/skillspector/${name}.md" \
    --format json -o ".planning/skillspector/${name}.json" || true
done

echo "Reportes en .planning/skillspector/"
```

Revisar cada `.md` generado. Solo después ejecutar el bloque de `npx skills add` del plan.

---

## Registro de escaneos

Completar al escanear (copiar risk score del reporte):

| Repositorio | Fecha | Modo | Risk score | Decisión | Notas |
|-------------|-------|------|------------|----------|-------|
| resciencelab/opc-skills | | `--no-llm` | | ⬜ Pendiente | |
| aaron-he-zhu/seo-geo-claude-skills | | `--no-llm` | | ⬜ Pendiente | |
| astrolicious/agent-skills | | `--no-llm` | | ⬜ Pendiente | |
| jespervos/blossom-carousel | | `--no-llm` | | ⬜ Pendiente | |
| greensock/gsap-skills | | `--no-llm` | | ⬜ Pendiente | |
| jerrar670/surf-website | | `--no-llm` | | ⬜ Pendiente | |
| addyosmani/web-quality-skills | | `--no-llm` | | ⬜ Pendiente | |

**Leyenda de decisión:** ✅ Instalar · ⚠️ Revisar · ❌ Rechazar

---

## Qué hacer si una skill falla el escaneo

1. **Leer el reporte** — identificar si es hallazgo real o falso positivo (scripts de build, ejemplos en docs, etc.).
2. **No instalar** si hay CRITICAL/HIGH no explicables.
3. **Buscar alternativa** en [skills.sh](https://skills.sh/) con mejor reputación e installs.
4. **Documentar** en la tabla de registro por qué se rechazó.
5. **Actualizar `PLAN-MEJORA-WEB.md`** si hay que cambiar la skill del plan.

---

## Integración opcional en CI (futuro)

Si más adelante las skills viven versionadas en el repo bajo `skills/`:

```yaml
# .github/workflows/skills-security.yml
name: Skill Security Scan
on:
  pull_request:
    paths: ['skills/**', '.cursor/skills/**']

permissions:
  contents: read
  security-events: write

jobs:
  skillspector:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.12'
      - run: pip install git+https://github.com/NVIDIA/SkillSpector
      - name: Scan skills
        run: skillspector scan ./skills --no-llm --format sarif -o skillspector.sarif
      - uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: skillspector.sarif
```

---

## Orden correcto de trabajo

```
1. Instalar SkillSpector (este documento)
2. Escanear todos los repos de la tabla
3. Aprobar / rechazar según umbrales
4. Instalar solo skills aprobadas (PLAN-MEJORA-WEB.md)
5. Codex ejecuta el plan de mejora web
```

---

## Referencias

- Repositorio: https://github.com/NVIDIA/SkillSpector
- OWASP Agentic Skills + SkillSpector: https://owasp.org/www-project-agentic-skills-top-10/skill-scanner-integration.html
- Plan de mejora web: `PLAN-MEJORA-WEB.md`
