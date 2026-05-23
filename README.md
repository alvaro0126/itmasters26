# Workshop · IT Masters Forum 2026

Sitio estático de referencia del workshop sobre capacidades, gobernanza y decisiones para escalar IA. Diseñado para ser desplegado en `montelva.ai/itmasters26`.

## Estructura

```
web/
├── index.html          Página única con todas las secciones
├── canvas-mesa.pdf     PDF del canvas que se entrega físicamente
├── assets/
│   ├── styles.css      Identidad gráfica del workshop
│   └── app.js          Tabs de casos + deeplink + smooth scroll
└── README.md
```

El sitio es 100% estático. No requiere build, ni Node, ni servidor.

## Probarlo localmente

```bash
cd web
python3 -m http.server 8000
# Abrir: http://localhost:8000
```

## Despliegue recomendado: Cloudflare Pages (5 minutos)

Como `montelva.ai` ya está en Cloudflare, esta es la ruta más limpia. Cloudflare Pages sirve estáticos, conecta a GitHub, y puedes configurar la ruta `/itmasters26` sin pasar por Vercel.

### Paso 1 · Subir a GitHub

```bash
cd web
git init
git add .
git commit -m "feat: sitio del workshop Smells Like AI Spirit"
git branch -M main
gh repo create itmasters26 --public --source=. --push
```

### Paso 2 · Crear el proyecto en Cloudflare Pages

1. Entra a [Cloudflare Dashboard](https://dash.cloudflare.com) → Workers & Pages → **Create application** → **Pages** → **Connect to Git**.
2. Selecciona el repo `itmasters26`.
3. **Project name:** `itmasters26`
4. **Production branch:** `main`
5. **Framework preset:** None
6. **Build command:** _vacío_
7. **Build output directory:** `/` (raíz)
8. Click **Save and Deploy**.

Tras el primer deploy te darán una URL tipo `https://itmasters26.pages.dev`. Verifica que funcione antes de seguir.

### Paso 3 · Conectar la ruta /itmasters26 de montelva.ai

Hay dos opciones según cómo esté estructurado tu sitio principal `montelva.ai`.

**Opción A · Subdominio (recomendado, más simple):**

En tu proyecto Pages, ve a **Custom domains** → **Set up a custom domain** → ingresa `itmasters26.montelva.ai`. Cloudflare crea el CNAME automáticamente y resuelve TLS. Funciona en minutos.

**Opción B · Subpath `/itmasters26` (requiere Worker):**

Si necesitas que la URL final sea `montelva.ai/itmasters26`, necesitas un Cloudflare Worker que haga proxy. Crea un Worker llamado `itmasters26-proxy`:

```js
export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (!url.pathname.startsWith('/itmasters26')) {
      return new Response('Not Found', { status: 404 });
    }
    // Strip /itmasters26 prefix and rewrite to Pages origin
    const subpath = url.pathname.replace(/^\/itmasters26\/?/, '/');
    const target = `https://itmasters26.pages.dev${subpath}${url.search}`;
    return fetch(target, request);
  }
};
```

Asigna el Worker a la ruta `montelva.ai/itmasters26*` en **Workers Routes**.

## Alternativa: Vercel

Si prefieres Vercel:

1. Sube el repo a GitHub (paso 1 igual).
2. En Vercel → New Project → Import del repo.
3. Framework Preset: **Other**.
4. Output Directory: `.` (raíz).
5. Deploy.

Vercel da una URL tipo `https://itmasters26.vercel.app`. Para apuntarla a `montelva.ai/itmasters26`, mantén `montelva.ai` en Cloudflare y crea un **Rewrite Rule** en Cloudflare:

- URL pattern: `montelva.ai/itmasters26*`
- Rewrite to: `https://itmasters26.vercel.app/$1`

## Actualizar el contenido

El contenido vive en `index.html`. Edita ahí. Cada push a `main` redespliega automáticamente (Cloudflare Pages o Vercel detectan el cambio en GitHub).

Si actualizas el canvas, sustituye `canvas-mesa.pdf` y commitea. El link de descarga apunta al mismo nombre de archivo.

## Notas de diseño

- **Tipografías:** Georgia (serif, display), Helvetica Neue / system (sans, body), Menlo (mono, etiquetas).
- **Paleta:** cream `#F5EFE6` (fondo), ink `#1A1814` (texto), brick `#B23A1F` (acentos), tan `#E8DDC7` (cards).
- **Responsive:** breakpoints en 880 / 720 / 640 px. Funciona bien en móvil.
- **A11y:** skip link, focus states, contraste AA.
- **Performance:** un solo HTML, un CSS, un JS de ~30 líneas. Cero dependencias externas. Carga bajo 100 KB sin el PDF.
