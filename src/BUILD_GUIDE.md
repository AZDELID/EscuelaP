# 🏗️ Guía de Build para GitHub Pages

Esta guía explica cómo generar el build optimizado para GitHub Pages.

## 📦 Estructura del Build Final

Cuando ejecutes `npm run build`, se generará esta estructura en `/dist`:

```
dist/
├── index.html                     # HTML principal optimizado
├── favicon.svg                    # Favicon
├── manifest.json                  # PWA manifest
├── robots.txt                     # SEO
├── sitemap.xml                    # Sitemap
├── 404.html                       # Página 404 para SPA routing
├── .htaccess                      # Configuración de servidor (opcional)
└── assets/
    ├── css/
    │   └── index-[hash].css       # CSS minificado
    ├── js/
    │   ├── index-[hash].js        # Código principal
    │   ├── vendor-react-[hash].js # React + ReactDOM
    │   ├── vendor-ui-[hash].js    # Radix UI components
    │   ├── vendor-icons-[hash].js # Lucide icons
    │   └── vendor-[hash].js       # Otras librerías
    └── images/
        └── [imágenes-hash].[ext]  # Imágenes optimizadas
```

## ✅ Características del Build Optimizado

### 1. **Rutas Relativas**
✅ Todos los assets usan rutas relativas (`./assets/...`)  
✅ Compatible con cualquier base path de GitHub Pages  
✅ Funciona sin configuración adicional

### 2. **Organización de Assets**
✅ CSS en `/assets/css/`  
✅ JavaScript en `/assets/js/`  
✅ Imágenes en `/assets/images/`  
✅ Hash en nombres de archivo para cache-busting

### 3. **Optimizaciones Aplicadas**
✅ **Minificación:** Terser para JS, cssnano para CSS  
✅ **Tree-shaking:** Código no usado eliminado  
✅ **Code Splitting:** Chunks separados por vendor  
✅ **Compresión:** Assets < 4KB inline como base64  
✅ **Cache:** Headers de caché optimizados  
✅ **Console logs:** Eliminados en producción

### 4. **SEO y Performance**
✅ Meta tags optimizados  
✅ Open Graph para redes sociales  
✅ PWA manifest incluido  
✅ Robots.txt configurado  
✅ Sitemap.xml generado

## 🚀 Comandos de Build

### Build Standard
```bash
npm run build
```
Genera el build en `/dist` con todas las optimizaciones.

### Build Clean
```bash
npm run build:clean
```
Elimina `/dist` anterior y genera build fresco.

### Preview Local
```bash
npm run preview
```
Sirve el build de producción localmente en http://localhost:4173

## 📊 Análisis del Build

### Ver Tamaño de Chunks
```bash
npm run build
```
Al final del build verás un reporte como:

```
dist/index.html                      2.45 kB │ gzip:  1.12 kB
dist/assets/css/index-a1b2c3.css    48.23 kB │ gzip: 12.45 kB
dist/assets/js/index-d4e5f6.js     142.34 kB │ gzip: 45.67 kB
dist/assets/js/vendor-react.js     140.12 kB │ gzip: 44.23 kB
dist/assets/js/vendor-ui.js         85.45 kB │ gzip: 28.90 kB
```

### Targets de Tamaño

| Asset | Target | Esperado |
|-------|--------|----------|
| **index.html** | < 5KB | ~2-3KB |
| **Total CSS** | < 60KB | ~50KB |
| **Total JS** | < 500KB | ~400KB |
| **Gzipped Total** | < 200KB | ~150KB |

## 🔍 Verificación del Build

### 1. Verificar Rutas
```bash
# Después del build, verifica que todas las rutas sean relativas
grep -r "src=\"/" dist/index.html
# No debería mostrar resultados (todas deben ser "./")
```

### 2. Verificar Estructura
```bash
# Listar estructura
tree dist/

# Verificar assets
ls -lh dist/assets/css/
ls -lh dist/assets/js/
ls -lh dist/assets/images/
```

### 3. Test Local
```bash
# Servir el build
npm run preview

# O usar servidor simple
npx serve dist
```

Abre http://localhost:4173 y verifica:
- ✅ Login funciona
- ✅ Dashboards cargan
- ✅ Imágenes visibles
- ✅ CSS aplicado
- ✅ No hay errores en consola (F12)

## 🌐 Deploy a GitHub Pages

### Opción 1: GitHub Actions (Automático)

El archivo `.github/workflows/deploy.yml` ya está configurado:

```bash
# Solo haz push
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main

# El workflow se ejecuta automáticamente
```

### Opción 2: Manual

```bash
# 1. Build local
npm run build

# 2. Deploy con gh-pages
npx gh-pages -d dist

# O subir manualmente el contenido de /dist
```

## ⚙️ Configuración Avanzada

### Cambiar Base URL

Si tu repo NO es `https://usuario.github.io/repo/`, edita `vite.config.ts`:

```typescript
// Para dominio raíz (usuario.github.io)
base: '/'

// Para subpath (usuario.github.io/mi-app/)
base: '/mi-app/'

// Para rutas relativas (recomendado)
base: './'
```

### Optimizar Imágenes

Las imágenes Figma ya están optimizadas, pero puedes:

```bash
# Instalar image optimizer
npm install -D vite-plugin-image-optimizer

# Agregar a vite.config.ts
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

plugins: [
  react(),
  ViteImageOptimizer()
]
```

### Analizar Bundle

```bash
# Instalar analyzer
npm install -D rollup-plugin-visualizer

# Agregar a vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer';

plugins: [
  react(),
  visualizer({ open: true })
]

# Build mostrará gráfico
npm run build
```

## 🐛 Troubleshooting

### Build Falla

**Error:** `Module not found`

**Solución:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Assets 404 en GitHub Pages

**Causa:** Base path incorrecto

**Solución:**
```typescript
// vite.config.ts
base: './' // Usar rutas relativas
```

### CSS No Aplica

**Causa:** Purge agresivo de Tailwind

**Solución:** Ya configurado correctamente en `tailwind.config.js`

### Bundle Muy Grande

**Solución:**
```bash
# Ver análisis
npm run build

# Chunks ya están optimizados:
# - vendor-react (React core)
# - vendor-ui (Radix)
# - vendor-icons (Lucide)
```

## 📈 Métricas de Performance

### Lighthouse Scores Esperados

Después del deploy, corre Lighthouse (Chrome DevTools → F12 → Lighthouse):

| Métrica | Target | Esperado |
|---------|--------|----------|
| **Performance** | >85 | 90-95 |
| **Accessibility** | >90 | 95-100 |
| **Best Practices** | >90 | 95-100 |
| **SEO** | >85 | 90-95 |

### Web Vitals

| Métrica | Target | Descripción |
|---------|--------|-------------|
| **LCP** | <2.5s | Largest Contentful Paint |
| **FID** | <100ms | First Input Delay |
| **CLS** | <0.1 | Cumulative Layout Shift |
| **FCP** | <1.8s | First Contentful Paint |
| **TTI** | <3.8s | Time to Interactive |

## 🎯 Checklist Final

Antes de deployar, verifica:

- [ ] ✅ `npm run build` exitoso sin errores
- [ ] ✅ `npm run preview` funciona correctamente
- [ ] ✅ Todas las rutas son relativas (`./assets/`)
- [ ] ✅ Assets organizados en subcarpetas correctas
- [ ] ✅ Favicon visible en pestaña
- [ ] ✅ No hay console.log en código compilado
- [ ] ✅ CSS minificado (< 60KB)
- [ ] ✅ JS minificado y split en chunks
- [ ] ✅ index.html tiene meta tags
- [ ] ✅ manifest.json presente
- [ ] ✅ robots.txt y sitemap.xml presentes

## 🎉 Build Exitoso

Si todos los checks están ✅, tu build está listo para:

1. **GitHub Pages** (push a main)
2. **Netlify** (drag & drop `/dist`)
3. **Vercel** (import repo)
4. **Cloudflare Pages** (connect repo)
5. **Surge** (`surge dist/`)

---

**Estructura Final Confirmada:**
```
✅ index.html
✅ assets/css/[hash].css
✅ assets/js/[hash].js
✅ assets/images/[hash].[ext]
```

**¡Tu proyecto está 100% optimizado para GitHub Pages! 🚀**
