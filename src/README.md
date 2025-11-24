# 🎓 Sistema de Gestión Escolar - EJEMPLO DE VIDA

Sistema completo de gestión de calificaciones escolares con autenticación por roles y gestión académica.

## 🌟 Características

- ✅ **Sistema de Autenticación** con 4 roles (Admin, Docente, Estudiante, Soporte)
- ✅ **Gestión de Calificaciones** por componentes (Tareas 30%, Conceptual 30%, Exámenes 40%)
- ✅ **Dashboards Personalizados** para cada rol
- ✅ **Orden de Mérito** automático por sección
- ✅ **Gestión de Estudiantes y Docentes**
- ✅ **Sistema de Períodos Académicos** (4 unidades)
- ✅ **Responsive Design** optimizado para móvil y escritorio

## 🚀 Deploy en GitHub Pages

### Opción 1: Deploy Automático (Recomendado)

1. **Fork o clona este repositorio**
2. **Habilita GitHub Pages:**
   - Ve a Settings → Pages
   - Source: GitHub Actions
3. **Push a la rama `main`:**
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```
4. **El deploy se ejecutará automáticamente**
   - Verifica en la pestaña "Actions"
   - Tu sitio estará en: `https://tu-usuario.github.io/tu-repo/`

### Opción 2: Deploy Manual

```bash
# Instalar dependencias
npm install

# Build para producción
npm run build

# El contenido de /dist está listo para deploy
# Estructura generada:
# dist/
# ├── index.html
# └── assets/
#     ├── css/
#     ├── js/
#     └── images/
```

Luego sube el contenido de `/dist` a tu hosting preferido.

**📖 Guía Detallada:** Ver [BUILD_GUIDE.md](./BUILD_GUIDE.md) para instrucciones completas de build.

## 💻 Desarrollo Local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Abrir en el navegador
# http://localhost:5173
```

## 🔐 Credenciales de Prueba

### Administrativo
- Email: `admin1@escuela.com`
- Password: `admin1`

### Soporte Técnico
- Email: `soporte@escuela.com`
- Password: `soporte123`

### Docentes
- Email: Cualquier email de docente registrado
- Password: `12345678`

### Estudiantes
- Email: Cualquier email de estudiante registrado
- Password: `12345678`

## 🏗️ Tecnologías

- **React 18** + TypeScript
- **Vite** - Build tool ultrarrápido
- **Tailwind CSS 4** - Framework CSS
- **Shadcn/ui** - Componentes UI
- **Lucide React** - Iconos
- **LocalStorage** - Persistencia de datos

## 📁 Estructura del Proyecto

```
/
├── components/
│   ├── AdminDashboard.tsx      # Panel administrativo
│   ├── TeacherDashboard.tsx    # Panel docente
│   ├── StudentDashboard.tsx    # Panel estudiante
│   ├── SupportDashboard.tsx    # Panel soporte
│   ├── AuthForm.tsx            # Formulario login
│   └── ui/                     # Componentes UI reutilizables
├── utils/
│   └── mockDatabase.ts         # Base de datos mock
├── styles/
│   └── globals.css             # Estilos globales
├── imports/                    # Assets de Figma
└── App.tsx                     # Componente principal
```

## 🎨 Paleta de Colores

- **Rojo Granate**: `#8c030e` - Color principal
- **Azul**: `#0433bf` - Botones y acciones
- **Dorado**: `#f5ba3c` - Acentos y detalles

## 📊 Sistema de Calificación

| Componente | Peso |
|------------|------|
| Tareas     | 30%  |
| Conceptual | 30%  |
| Exámenes   | 40%  |

**Escala:** 0-20 puntos  
**Aprobado:** ≥ 11 puntos

## 🔧 Configuración Avanzada

### Cambiar la URL base

Edita `vite.config.ts`:
```typescript
export default defineConfig({
  base: '/tu-nombre-de-repo/', // Para GitHub Pages
  // o
  base: '/', // Para dominio propio
});
```

### Variables de entorno

Crea un archivo `.env.local`:
```
VITE_API_URL=https://tu-api.com
```

## 📝 Licencia

Este proyecto está bajo la Licencia MIT.

## 👥 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📧 Contacto

Proyecto: Sistema de Gestión Escolar - EJEMPLO DE VIDA

---

**¡Hecho con ❤️ para la educación!**