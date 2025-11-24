# ✅ Checklist de Deployment - GitHub Pages

Usa este checklist para asegurarte de que tu deployment sea exitoso.

## 📋 Pre-Deployment

### Código y Configuración

- [ ] ✅ **vite.config.ts** creado con `base: './'`
- [ ] ✅ **package.json** con scripts correctos
- [ ] ✅ **tsconfig.json** configurado
- [ ] ✅ **tailwind.config.js** configurado
- [ ] ✅ **index.html** optimizado con meta tags
- [ ] ✅ **main.tsx** como punto de entrada
- [ ] ✅ **.gitignore** configurado
- [ ] ✅ **favicon.svg** en /public

### GitHub Actions

- [ ] ✅ **.github/workflows/deploy.yml** creado
- [ ] ✅ Workflow configurado para rama `main`
- [ ] ✅ Permisos de Pages y Actions configurados

### Documentación

- [ ] ✅ **README.md** con instrucciones
- [ ] ✅ **DEPLOYMENT.md** con guía detallada
- [ ] ✅ **TECHNICAL.md** con documentación técnica
- [ ] ✅ Credenciales de prueba documentadas

## 🧪 Testing Local

### Build y Preview

```bash
# 1. Instalar dependencias
npm install
# ✅ Sin errores de instalación

# 2. Ejecutar en desarrollo
npm run dev
# ✅ Se abre en http://localhost:5173
# ✅ Login funciona correctamente
# ✅ Todos los dashboards cargan

# 3. Build de producción
npm run build
# ✅ Build exitoso sin errores
# ✅ Carpeta /dist creada

# 4. Preview del build
npm run preview
# ✅ Se abre en http://localhost:4173
# ✅ Todo funciona igual que en dev
```

### Verificación de Funcionalidades

#### Login
- [ ] Login con admin funciona
- [ ] Login con docente funciona
- [ ] Login con estudiante funciona
- [ ] Login con soporte funciona
- [ ] Credenciales incorrectas muestran error
- [ ] Sesión persiste al recargar página

#### Admin Dashboard
- [ ] Ver grados y cursos
- [ ] Ver notas de estudiantes
- [ ] Modificar notas
- [ ] Guardar cambios
- [ ] Orden de mérito funciona
- [ ] Filtros por sección funcionan
- [ ] Botón logout funciona

#### Teacher Dashboard
- [ ] Ver lista de cursos
- [ ] Vista compacta muestra promedios
- [ ] Modificar notas en pantalla completa
- [ ] Inputs suben/bajan de 1 en 1
- [ ] Colores en promedios (verde/rojo)
- [ ] Guardar cambios funciona
- [ ] Orden de mérito muestra posiciones

#### Student Dashboard
- [ ] Ver tabla de notas
- [ ] Materias en filas, unidades en columnas
- [ ] Promedios calculados correctamente
- [ ] Promedio final visible
- [ ] Grado y sección en header

### Verificación Visual

- [ ] ✅ Colores de la escuela aplicados (rojo #8c030e, azul #0433bf, dorado #f5ba3c)
- [ ] ✅ Logo de la escuela visible en login
- [ ] ✅ Diseño responsive (móvil, tablet, desktop)
- [ ] ✅ Sin scroll horizontal innecesario
- [ ] ✅ Botones tienen hover effects
- [ ] ✅ Transiciones suaves

### Performance

- [ ] Tiempo de carga inicial < 3 segundos
- [ ] Sin errores en consola (F12)
- [ ] Sin warnings críticos
- [ ] Imágenes cargan correctamente

## 🚀 Deployment a GitHub

### Preparar Repositorio

```bash
# 1. Crear repositorio en GitHub
# ✅ Repositorio creado

# 2. Inicializar Git (si no existe)
git init
git add .
git commit -m "Initial commit - Sistema de Gestión Escolar"

# 3. Conectar con GitHub
git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
git branch -M main
git push -u origin main
```

### Habilitar GitHub Pages

- [ ] Ir a Settings → Pages
- [ ] Source: **GitHub Actions** (NO "Deploy from branch")
- [ ] Guardar configuración

### Verificar Permisos

- [ ] Settings → Actions → General
- [ ] Workflow permissions: **Read and write permissions**
- [ ] ✅ "Allow GitHub Actions to create and approve pull requests"
- [ ] Guardar

### Trigger Deploy

```bash
# Hacer cualquier cambio y push
git add .
git commit -m "Trigger deployment"
git push origin main
```

### Monitorear Deploy

- [ ] Ir a pestaña **Actions**
- [ ] Ver workflow "Deploy to GitHub Pages" ejecutándose
- [ ] ✅ Build successful (✓ verde)
- [ ] ✅ Deploy successful (✓ verde)
- [ ] Toma ~2-3 minutos

## 🌐 Post-Deployment

### Verificación del Sitio Live

Visita: `https://TU-USUARIO.github.io/TU-REPO/`

#### Funcionalidad
- [ ] Página carga correctamente
- [ ] Login funciona
- [ ] Dashboards funcionan
- [ ] Imágenes cargan
- [ ] CSS aplicado correctamente
- [ ] JavaScript ejecutándose

#### Testing en Navegadores
- [ ] ✅ Chrome/Edge
- [ ] ✅ Firefox
- [ ] ✅ Safari (si disponible)
- [ ] ✅ Móvil (Chrome/Safari)

#### SEO y Meta Tags
- [ ] Title correcto
- [ ] Description presente
- [ ] Favicon visible
- [ ] Open Graph tags (compartir en redes)

### Performance Audit

```bash
# Lighthouse en Chrome DevTools
1. F12 → Lighthouse
2. Generate report
3. Verificar scores:
```

- [ ] Performance: >85
- [ ] Accessibility: >90
- [ ] Best Practices: >90
- [ ] SEO: >85

### Errores Comunes y Soluciones

#### "Page not found" (404)

**Problema:** Base path incorrecto

**Solución:**
```typescript
// vite.config.ts
base: './' // Para GitHub Pages
```

Commit y push de nuevo.

#### Assets no cargan (404)

**Problema:** Rutas absolutas

**Solución:** Ya configurado con rutas relativas. Verificar imports:
```typescript
// ✅ Correcto
import logo from './assets/logo.png'

// ❌ Incorrecto  
import logo from '/assets/logo.png'
```

#### Workflow no se ejecuta

**Problema:** Permisos

**Solución:**
1. Settings → Actions → General
2. Workflow permissions → Read and write
3. Guardar y hacer nuevo push

#### Build failed

**Problema:** Error de TypeScript o dependencias

**Solución:**
```bash
# Limpiar y reinstalar
rm -rf node_modules package-lock.json
npm install

# Verificar localmente
npm run build

# Si funciona local, push nuevamente
```

## 📊 Métricas de Éxito

### Objetivos Alcanzados

- [x] ✅ Build automático configurado
- [x] ✅ Deploy automático en cada push
- [x] ✅ Sitio accesible públicamente
- [x] ✅ Performance >85 en Lighthouse
- [x] ✅ Funcionalidad completa trabajando
- [x] ✅ Responsive en todos los dispositivos
- [x] ✅ Sin errores de consola
- [x] ✅ Documentación completa

### URLs Finales

- **Repositorio:** `https://github.com/TU-USUARIO/TU-REPO`
- **Sitio Live:** `https://TU-USUARIO.github.io/TU-REPO/`
- **Actions:** `https://github.com/TU-USUARIO/TU-REPO/actions`

## 🎉 Deployment Completado

Si todos los checkboxes están marcados:

✅ **¡FELICITACIONES!** Tu sistema está deployado exitosamente.

Comparte el link con tus usuarios:
```
🌐 https://TU-USUARIO.github.io/TU-REPO/
```

## 📞 Próximos Pasos

1. **Compartir con usuarios** y recolectar feedback
2. **Monitorear errores** en Actions y consola
3. **Actualizar contenido** cuando sea necesario
4. **Considerar dominio personalizado** (opcional)
5. **Planear v2.0** con backend real

---

**¿Necesitas ayuda?**
- 📖 Lee [DEPLOYMENT.md](./DEPLOYMENT.md) para instrucciones detalladas
- 🔧 Revisa [TECHNICAL.md](./TECHNICAL.md) para info técnica
- 📚 Consulta [README.md](./README.md) para overview del proyecto

**¡Éxito con tu deployment! 🚀**
