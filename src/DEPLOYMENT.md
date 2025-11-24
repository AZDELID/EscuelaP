# 📦 Guía de Deployment - GitHub Pages

Esta guía te ayudará a deployar el Sistema de Gestión Escolar en GitHub Pages paso a paso.

## ✅ Pre-requisitos

- ✅ Cuenta de GitHub
- ✅ Node.js instalado (v18 o superior)
- ✅ Git instalado

## 🚀 Método 1: Deploy Automático con GitHub Actions (RECOMENDADO)

### Paso 1: Preparar el Repositorio

```bash
# Si no tienes el repositorio clonado
git clone https://github.com/TU-USUARIO/TU-REPO.git
cd TU-REPO

# O si ya lo tienes
cd TU-REPO
```

### Paso 2: Instalar Dependencias

```bash
npm install
```

### Paso 3: Probar Localmente

```bash
# Ejecutar en modo desarrollo
npm run dev

# Abrir http://localhost:5173 en tu navegador
# Verifica que todo funcione correctamente
```

### Paso 4: Habilitar GitHub Pages

1. Ve a tu repositorio en GitHub
2. Click en **Settings** (Configuración)
3. En el menú lateral, click en **Pages**
4. En **Source**, selecciona: **GitHub Actions**
5. Guarda los cambios

### Paso 5: Hacer Push

```bash
# Añadir todos los archivos
git add .

# Hacer commit
git commit -m "Initial commit - Sistema de Gestión Escolar"

# Push a la rama main
git push origin main
```

### Paso 6: Verificar el Deploy

1. Ve a la pestaña **Actions** en tu repositorio
2. Verás un workflow ejecutándose llamado "Deploy to GitHub Pages"
3. Espera a que termine (toma 2-3 minutos)
4. Una vez completado, tu sitio estará disponible en:
   ```
   https://TU-USUARIO.github.io/TU-REPO/
   ```

## 🔧 Método 2: Deploy Manual

### Paso 1: Build Local

```bash
# Instalar dependencias
npm install

# Crear build de producción
npm run build
```

Esto creará una carpeta `/dist` con todos los archivos optimizados.

### Paso 2: Deploy a GitHub Pages

**Opción A: Usando gh-pages**

```bash
# Instalar gh-pages
npm install -g gh-pages

# Deploy
gh-pages -d dist
```

**Opción B: Manual**

1. Ve a GitHub → Settings → Pages
2. Source: Deploy from a branch
3. Branch: Selecciona `gh-pages` y carpeta `/root`
4. Sube el contenido de `/dist` a la rama `gh-pages`

## 🐛 Solución de Problemas

### Error: "Page not found"

**Solución:** Verifica que `base` en `vite.config.ts` sea correcto:

```typescript
// Para repositorio llamado "mi-sistema"
base: '/mi-sistema/'

// Para dominio personalizado
base: '/'
```

### Error: "Assets no cargan"

**Solución:** Asegúrate de que las rutas sean relativas. Ya está configurado con:
```typescript
base: './'
```

### Error: "Build failed"

**Solución:** 
```bash
# Limpiar caché
rm -rf node_modules
rm package-lock.json

# Reinstalar
npm install

# Intentar build nuevamente
npm run build
```

### Error: "Actions workflow no se ejecuta"

**Solución:**
1. Ve a Settings → Actions → General
2. En "Workflow permissions", selecciona: "Read and write permissions"
3. Marca: "Allow GitHub Actions to create and approve pull requests"
4. Guarda los cambios

## 📝 Configuración Avanzada

### Usar un Dominio Personalizado

1. Ve a Settings → Pages
2. En "Custom domain", ingresa tu dominio
3. Crea un archivo `CNAME` en la raíz:
   ```
   tu-dominio.com
   ```
4. Configura DNS en tu proveedor:
   ```
   Type: CNAME
   Name: www
   Value: TU-USUARIO.github.io
   ```

### Optimizar el Build

El archivo `vite.config.ts` ya incluye optimizaciones:
- ✅ Minificación con Terser
- ✅ Eliminación de console.log
- ✅ Code splitting
- ✅ Compresión de assets

### Variables de Entorno

Crea `.env.production`:
```bash
VITE_APP_NAME="Sistema de Gestión Escolar"
VITE_API_URL="https://api.tu-dominio.com"
```

Accede en el código:
```typescript
const appName = import.meta.env.VITE_APP_NAME;
```

## 🔄 Actualizar el Sitio

Cada vez que hagas cambios:

```bash
# Commit cambios
git add .
git commit -m "Descripción de cambios"

# Push
git push origin main

# El workflow se ejecutará automáticamente
```

## 📊 Monitoreo

### Ver Logs del Deploy

1. Actions → Click en el workflow más reciente
2. Revisa los logs de cada paso
3. Si hay errores, aparecerán en rojo

### Verificar Performance

Usa Google Lighthouse:
1. Abre tu sitio en Chrome
2. F12 → Lighthouse
3. Run audit
4. Revisa métricas de performance

## 🎉 ¡Listo!

Tu sistema está ahora deployado en GitHub Pages. Los usuarios pueden acceder desde cualquier lugar.

### URLs de Ejemplo

- **Desarrollo:** `http://localhost:5173`
- **Producción:** `https://tu-usuario.github.io/tu-repo/`
- **Custom Domain:** `https://tu-dominio.com`

## 📞 Soporte

Si encuentras problemas:

1. Revisa los logs en Actions
2. Verifica la consola del navegador (F12)
3. Revisa este documento de troubleshooting
4. Crea un issue en el repositorio

---

**¡Feliz deployment! 🚀**
