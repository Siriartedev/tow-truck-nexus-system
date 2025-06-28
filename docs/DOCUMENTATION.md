
# 📚 TMS Grúas - Documentación Completa del Sistema

## 🏗️ Arquitectura de la Aplicación

### Stack Tecnológico
- **Frontend:** React 18 + TypeScript + Vite
- **Backend:** Supabase (PostgreSQL + Row Level Security)
- **Autenticación:** Supabase Auth
- **UI Framework:** Tailwind CSS + shadcn/ui
- **Estado:** React Context + useState/useEffect
- **Routing:** React Router DOM v6
- **Iconografía:** Lucide React
- **Notificaciones:** Sonner

### Estructura del Proyecto
```
src/
├── components/          # Componentes reutilizables
│   ├── ui/             # Componentes base de shadcn/ui
│   ├── layout/         # Componentes de layout
│   ├── auth/           # Componentes de autenticación
│   ├── client-portal/  # Componentes del portal cliente
│   ├── operator-portal/# Componentes del portal operador
│   └── configuration/ # Componentes de configuración
├── hooks/              # Custom hooks
├── pages/              # Páginas principales
├── types/              # Definiciones de TypeScript
├── lib/                # Utilidades y helpers
└── integrations/       # Integraciones externas
    └── supabase/       # Cliente y tipos de Supabase
```

## 📋 Documentación Técnica

### Base de Datos (Supabase)

#### Tablas Principales
1. **user_profiles** - Perfiles de usuario
2. **clients** - Información de clientes
3. **operators** - Información de operadores
4. **services** - Servicios de grúa
5. **cranes** - Información de grúas
6. **service_types** - Tipos de servicio

#### Políticas RLS (Row Level Security)
- **user_profiles_read/write**: Usuarios ven su perfil + admins ven todo
- **clients_access**: Clientes ven sus datos + admins/operadores ven todo
- **operators_access**: Operadores ven sus datos + admins ven todo
- **services_access**: Control granular por rol
- **cranes_access**: Solo admin y operadores
- **service_types_read/write**: Lectura pública, escritura solo admin

#### Trigger Automático
```sql
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Sistema de Autenticación

#### Roles del Sistema
- **admin**: Acceso completo, gestión de usuarios y configuración
- **client**: Portal de solicitudes, historial de servicios
- **operator**: Gestión de servicios asignados, inspecciones

#### Hook useAuth
```typescript
const { user, profile, signIn, signUp, signOut, isAdmin, isClient, isOperator } = useAuth();
```

#### Flujo de Autenticación
1. Usuario se registra/inicia sesión
2. Trigger automático crea perfil en `user_profiles`
3. Hook `useAuth` obtiene perfil completo
4. Redirección automática según rol

## 🚀 Prompt de Desarrollo

### Comandos de Desarrollo
```bash
# Instalar dependencias
npm install

# Desarrollo local
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

### Variables de Entorno
```env
VITE_SUPABASE_URL=https://ipgodqlupnijbyexkvsz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Estructura de Comandos SQL
```sql
-- Verificar políticas RLS
SELECT * FROM pg_policies WHERE schemaname = 'public';

-- Verificar usuarios
SELECT * FROM public.user_profiles;

-- Verificar trigger
SELECT * FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';
```

## 📖 Guía de Instalación

### Requisitos Previos
- Node.js 18+
- npm o pnpm
- Cuenta de Supabase

### Pasos de Instalación
1. **Clonar repositorio**
   ```bash
   git clone [repositorio]
   cd tms-gruas
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar Supabase**
   - Crear proyecto en Supabase
   - Ejecutar migraciones SQL
   - Configurar variables de entorno

4. **Ejecutar aplicación**
   ```bash
   npm run dev
   ```

## 👥 Manual de Usuario

### Para Administradores
- **Dashboard completo**: Métricas y resumen general
- **Gestión de servicios**: CRUD completo de servicios
- **Gestión de usuarios**: Crear/editar usuarios y roles
- **Configuración**: Ajustes del sistema
- **Reportes**: Informes detallados

### Para Clientes
- **Portal cliente**: Vista simplificada
- **Solicitar servicios**: Formulario de solicitud
- **Historial**: Ver servicios anteriores
- **Estado de servicios**: Seguimiento en tiempo real

### Para Operadores
- **Portal operador**: Herramientas específicas
- **Servicios asignados**: Lista de trabajos
- **Inspecciones**: Formularios de inspección
- **Firmas digitales**: Captura de firmas

### Cuentas Demo
- **admin@demo.com** / admin123 - Administrador
- **cliente@demo.com** / cliente123 - Cliente
- **operador@demo.com** / operador123 - Operador

## 🎨 Sistema Visual

### Paleta de Colores
```css
--green-light: #10b981;
--green-medium: #059669;
--green-dark: #065f46;
--gradient-green: linear-gradient(135deg, #10b981 0%, #059669 100%);
```

### Componentes UI
- **Botones**: Variantes primary, secondary, outline
- **Cards**: Bordes suaves, sombras sutiles
- **Forms**: Validación integrada, estados de error
- **Modals**: Overlay oscuro, animaciones suaves

### Responsive Design
- **Mobile First**: Diseño optimizado para móviles
- **Breakpoints**: sm, md, lg, xl
- **Grid System**: CSS Grid y Flexbox

## 🖥️ Portal Cliente

### Características Principales
- **Dashboard simplificado**: Métricas relevantes
- **Solicitud de servicios**: Formulario intuitivo
- **Historial detallado**: Filtros y búsqueda
- **Estados en tiempo real**: Actualizaciones automáticas

### Flujo de Usuario Cliente
1. Login con credenciales
2. Ver dashboard personalizado
3. Solicitar nuevo servicio
4. Seguir estado del servicio
5. Ver historial completo

## 👷 Portal Operador

### Características Principales
- **Lista de servicios**: Servicios asignados
- **Inspecciones detalladas**: Formularios completos
- **Captura de fotos**: Documentación visual
- **Firmas digitales**: Confirmación de servicios

### Flujo de Usuario Operador
1. Login con PIN
2. Ver servicios asignados
3. Realizar inspecciones
4. Capturar evidencias
5. Completar servicio

## 🔧 Solución de Problemas

### Errores Comunes

#### Error: "Row violates RLS policy"
```sql
-- Verificar políticas RLS
SELECT * FROM pg_policies WHERE tablename = 'user_profiles';
```

#### Error: "Profile not found"
```sql
-- Verificar trigger de creación automática
SELECT * FROM information_schema.triggers 
WHERE event_object_table = 'users';
```

#### Error de autenticación
1. Verificar variables de entorno
2. Comprobar configuración de Supabase
3. Revisar Site URL y Redirect URLs

### Testing del Sistema

#### Checklist Post-Instalación
- [ ] Registro de nuevo usuario funciona
- [ ] Login con cuentas demo funciona
- [ ] Redirección por roles correcta
- [ ] Sin errores en consola del navegador
- [ ] Políticas RLS funcionando
- [ ] Trigger de perfil automático activo

#### Comandos de Verificación
```sql
-- Verificar usuarios demo
SELECT email, role FROM public.user_profiles;

-- Verificar políticas activas
SELECT * FROM pg_policies WHERE schemaname = 'public';

-- Verificar trigger
SELECT trigger_name, event_manipulation, event_object_table 
FROM information_schema.triggers 
WHERE trigger_schema = 'public';
```

## 📞 Soporte Técnico

### Contacto
- **Desarrollador**: [Información de contacto]
- **Repositorio**: [URL del repositorio]
- **Documentación**: docs/DOCUMENTATION.md

### Recursos Adicionales
- [Documentación de Supabase](https://supabase.com/docs)
- [Documentación de React](https://react.dev)
- [Documentación de Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui Components](https://ui.shadcn.com)

---

**Última actualización:** 2025-06-28  
**Versión del sistema:** 1.0.0  
**Estado:** ✅ Completamente funcional
