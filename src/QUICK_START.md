# ⚡ Quick Start - GitHub Pages

Guía ultra-rápida para deployar en 5 minutos.

## 🚀 Deploy en 3 Pasos

### 1️⃣ Build
```bash
npm install
npm run build
```

### 2️⃣ Verificar
```bash
npm run build:verify
```

Deberías ver:
```
🔍 Verificando Build para GitHub Pages...

✓ index.html existe
✓ Favicon existe
✓ CSS existe con X archivos
✓ JavaScript existe con X archivos
✓ Rutas relativas correctas encontradas

🎉 ¡Build perfecto! Listo para GitHub Pages
```

### 3️⃣ Deploy
```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

## 📁 ¿Qué se genera?

```
dist/
├── index.html           ← Página principal
├── assets/
│   ├── css/            ← Estilos minificados
│   ├── js/             ← JavaScript optimizado
│   └── images/         ← Imágenes Figma
└── [otros archivos]
```

## ✅ Verificación Rápida

Después del build:

```bash
# Ver estructura
ls -R dist/

# Ver tamaño
du -sh dist/

# Preview local
npm run preview
```

Abre http://localhost:4173 y verifica:
- ✅ Login funciona
- ✅ Dashboards cargan
- ✅ No hay errores en consola (F12)

## 🌐 URL Final

Después del deploy, tu sitio estará en:

```
https://TU-USUARIO.github.io/TU-REPO/
```

## ⚙️ Configuración GitHub Pages

1. Ve a tu repo en GitHub
2. Settings → Pages
3. Source: **GitHub Actions**
4. Save

¡Listo! El workflow se ejecuta automáticamente en cada push.

## 🐛 Problema?

### Build Falla
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Assets no cargan
Ya está configurado con rutas relativas. Solo verifica que usaste:
```bash
npm run build  # NO otros comandos
```

### 404 en GitHub Pages
Espera 2-3 minutos después del push. GitHub tarda en actualizar.

## 📚 Más Info

- **Build detallado:** [BUILD_GUIDE.md](./BUILD_GUIDE.md)
- **Deploy paso a paso:** [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Optimizaciones:** [OPTIMIZATION_SUMMARY.md](./OPTIMIZATION_SUMMARY.md)
- **Checklist completo:** [CHECKLIST.md](./CHECKLIST.md)

## 🎉 ¡Eso es todo!

Tu sistema está optimizado y listo para GitHub Pages.

**Happy Deployment! 🚀**
