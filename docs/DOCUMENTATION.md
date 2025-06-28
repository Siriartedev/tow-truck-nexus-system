
# TMS Grúas - Sistema de Gestión de Transporte
## Documentación Completa del Sistema

### 🏗️ Arquitectura de la Aplicación

#### Estructura General
```
TMS Grúas/
├── Frontend (React + TypeScript + Vite)
├── Backend (Supabase)
├── Base de Datos (PostgreSQL)
├── Autenticación (Supabase Auth)
└── Almacenamiento (Supabase Storage)
```

#### Stack Tecnológico
- **Frontend**: React 18, TypeScript, Tailwind CSS, Shadcn/UI
- **Backend**: Supabase (PostgreSQL + APIs)
- **Autenticación**: Supabase Auth con RLS
- **Routing**: React Router v6
- **Estado**: React Query + Context API
- **Estilos**: Tailwind CSS + CSS Modules
- **Validación**: Zod + React Hook Form

### 📊 Documentación Técnica

#### Base de Datos - Esquema Principal

##### Tablas Principales:
1. **user_profiles** - Perfiles de usuario del sistema
2. **clients** - Información de clientes
3. **operators** - Datos de operadores de grúa
4. **cranes** - Inventario de grúas
5. **service_types** - Tipos de servicios disponibles
6. **services** - Registro de servicios realizados

##### Relaciones:
```sql
user_profiles (1) -> (N) clients
user_profiles (1) -> (N) operators
operators (1) -> (N) cranes
clients (1) -> (N) services
service_types (1) -> (N) services
```

#### Sistema de Roles
- **Admin**: Acceso completo al sistema
- **Client**: Portal de cliente con servicios
- **Operator**: Portal de operador con inspecciones

### 🚀 Prompt de Desarrollo

#### Contexto del Sistema
TMS Grúas es un sistema integral de gestión de servicios de grúa que incluye:

1. **Portal Administrativo**: Gestión completa de servicios, clientes, operadores y grúas
2. **Portal de Cliente**: Solicitudes de servicio, historial y documentos
3. **Portal de Operador**: Inspecciones, inventarios y firmas digitales

#### Comandos de Desarrollo Frecuentes:
```bash
# Desarrollo local
npm run dev

# Build de producción
npm run build

# Linting y formato
npm run lint
npm run format

# Supabase local
supabase start
supabase db reset
```

### 📥 Guía de Instalación

#### Requisitos Previos:
- Node.js 18+
- npm o yarn
- Cuenta de Supabase

#### Pasos de Instalación:

1. **Clonar el repositorio**
```bash
git clone [repository-url]
cd tms-gruas
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
# Crear archivo .env.local
VITE_SUPABASE_URL=https://ipgodqlupnijbyexkvsz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

4. **Ejecutar migraciones de Supabase**
```bash
supabase db reset
```

5. **Iniciar desarrollo**
```bash
npm run dev
```

### 📖 Manual de Usuario

#### Para Administradores:

##### Dashboard Principal
- Vista general de servicios activos
- Métricas de rendimiento
- Alertas del sistema

##### Gestión de Servicios
- Crear nuevos servicios
- Asignar operadores y grúas
- Seguimiento de estado
- Generación de reportes

##### Gestión de Clientes
- Registro de nuevos clientes
- Actualización de información
- Historial de servicios

##### Gestión de Operadores
- Registro de operadores
- Asignación de PINs
- Control de licencias

##### Gestión de Grúas
- Inventario de equipos
- Mantenimiento programado
- Asignación a operadores

#### Para Clientes:

##### Portal de Servicios
- Solicitar nuevos servicios
- Ver servicios activos
- Historial de servicios
- Descargar documentos

##### Documentación
- Certificados de servicio
- Facturas y reportes
- Fotografías de inspección

#### Para Operadores:

##### Portal Móvil
- Ver servicios asignados
- Realizar inspecciones
- Capturar fotografías
- Obtener firmas digitales

##### Inspecciones
- Checklist de seguridad
- Inventario de vehículos
- Documentación fotográfica

### 🎨 Sistema Visual

#### Paleta de Colores:
```css
:root {
  --green-light: #f0fdf4;
  --green-medium: #22c55e;
  --green-dark: #15803d;
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-900: #111827;
}
```

#### Tipografía:
- **Primaria**: Inter, system-ui
- **Monospace**: Fira Code, monospace

#### Componentes UI:
- Basados en Shadcn/UI
- Totalmente personalizables
- Responsive design

### 🏠 Portal del Cliente

#### Funcionalidades Principales:

##### Dashboard
- Resumen de servicios
- Próximas citas
- Documentos recientes

##### Solicitudes de Servicio
- Formulario detallado
- Selección de tipo de servicio
- Información de vehículo
- Ubicaciones de recogida/entrega

##### Historial
- Servicios completados
- Estados de seguimiento
- Descargas de documentos

##### Documentos
- Certificados PDF
- Fotografías de inspección
- Facturas digitales

### 🔧 Portal del Operador

#### Funcionalidades Principales:

##### Dashboard Móvil
- Servicios del día
- Navegación GPS
- Estado de grúa

##### Inspecciones Digitales
- Checklist interactivo
- Captura de fotos
- Inventario de vehículo
- Observaciones

##### Firmas Digitales
- Firma del cliente
- Firma del operador
- Validación timestamp

##### Documentación
- Generación automática de reportes
- Envío por email
- Almacenamiento en nube

### ⚙️ Estado Actual del Sistema

#### ✅ Funcionalidades Implementadas:
- Autenticación completa con Supabase
- Sistema de roles (Admin/Cliente/Operador)
- Base de datos relacional
- Portales diferenciados por rol
- Componentes de UI responsivos
- Sistema de navegación

#### 🔄 En Desarrollo:
- Optimización de rendimiento
- Pruebas de integración
- Documentación de API

#### 🚨 Problemas Conocidos:
- Warnings de features del navegador (no críticos)
- Optimización de carga inicial
- Configuración de políticas RLS

### 🔐 Seguridad

#### Medidas Implementadas:
- Row Level Security (RLS) en todas las tablas
- Autenticación JWT con Supabase
- Validación de entrada en frontend y backend
- Políticas de acceso por rol

#### Usuarios Demo:
- **Admin**: admin@demo.com / admin123
- **Cliente**: cliente@demo.com / cliente123  
- **Operador**: operador@demo.com / operador123

### 📞 Soporte y Mantenimiento

#### Contacto Técnico:
- Sistema desarrollado con Lovable
- Documentación actualizada en /docs
- Logs disponibles en Supabase Dashboard

#### Monitoreo:
- Supabase Analytics
- Error tracking en consola
- Métricas de rendimiento

---

**Última actualización**: 28/06/2025
**Versión del sistema**: 1.0.0
**Estado**: Funcional con optimizaciones pendientes
