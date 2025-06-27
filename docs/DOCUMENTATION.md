
# TMS Grúas - Sistema de Gestión de Transportes

## Arquitectura de la Aplicación

### Tecnologías Principales
- **Frontend**: React 18 con TypeScript
- **Backend**: Supabase (PostgreSQL + Auth + API)
- **UI Components**: Shadcn/UI + Tailwind CSS
- **Estado**: React Context + TanStack Query
- **Routing**: React Router DOM

### Estructura del Proyecto
```
src/
├── components/           # Componentes reutilizables
│   ├── ui/              # Componentes base de shadcn/ui
│   ├── layout/          # Layout y navegación
│   ├── auth/            # Componentes de autenticación
│   └── [feature]/       # Componentes por funcionalidad
├── pages/               # Páginas principales
├── hooks/               # Hooks personalizados
├── types/               # Definiciones de tipos TypeScript
└── integrations/        # Configuración de Supabase
```

## Documentación Técnica

### Sistema de Autenticación
- **Proveedor**: Supabase Auth
- **Tipos de Usuario**: Admin, Cliente, Operador
- **Autenticación**: Email/Password
- **Protección de Rutas**: ProtectedRoute component

### Base de Datos
- **user_profiles**: Perfiles de usuarios con roles
- **clients**: Información de clientes
- **operators**: Datos de operadores
- **cranes**: Registro de grúas
- **services**: Servicios de transporte
- **service_types**: Tipos de servicio disponibles

### Roles y Permisos
- **Admin**: Acceso completo al sistema
- **Cliente**: Portal específico para solicitar servicios
- **Operador**: Portal para gestionar servicios asignados

## Prompt de Desarrollo

Para continuar el desarrollo de este sistema:

```
Eres un desarrollador experto trabajando en TMS Grúas, un sistema de gestión de transportes para una empresa de grúas. 

Tecnologías:
- React 18 + TypeScript
- Supabase (Auth + DB)
- Shadcn/UI + Tailwind
- React Router DOM

Estructura de roles:
- Admin: Panel completo de administración
- Cliente: Portal para solicitar servicios
- Operador: Portal para gestionar servicios asignados

Mantén:
- Diseño coherente con tema verde
- Componentes reutilizables
- Manejo de errores apropiado
- Autenticación y autorización
- Responsive design
```

## Guía de Instalación

### Prerrequisitos
- Node.js 18+
- npm o bun
- Cuenta de Supabase

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone [repo-url]
cd tms-gruas
```

2. **Instalar dependencias**
```bash
npm install
# o
bun install
```

3. **Configurar Supabase**
- Crear proyecto en Supabase
- Ejecutar migraciones SQL
- Configurar variables de entorno

4. **Ejecutar la aplicación**
```bash
npm run dev
# o
bun dev
```

## Manual de Usuario

### Acceso al Sistema

#### Para Administradores
1. Ir a `/auth`
2. Usar credenciales de admin
3. Acceso completo al sistema de gestión

#### Para Clientes
1. Registro en `/auth`
2. Acceso al portal cliente
3. Solicitar servicios de grúa
4. Ver historial de servicios

#### Para Operadores
1. Credenciales proporcionadas por admin
2. Acceso al portal operador
3. Gestionar servicios asignados
4. Actualizar estado de servicios

### Funcionalidades por Rol

#### Admin
- Gestión de usuarios
- Gestión de clientes
- Gestión de operadores
- Gestión de grúas
- Administración de servicios
- Reportes y estadísticas

#### Cliente
- Solicitar nuevos servicios
- Ver servicios activos
- Historial de servicios
- Seguimiento en tiempo real

#### Operador
- Ver servicios asignados
- Actualizar estado de servicios
- Cargar fotos y documentos
- Firmas digitales

## Sistema Visual

### Paleta de Colores
- **Verde Principal**: #22c55e (green-500)
- **Verde Medio**: #16a34a (green-600)
- **Verde Oscuro**: #15803d (green-700)
- **Verde Claro**: #bbf7d0 (green-200)

### Componentes UI
- Basados en Shadcn/UI
- Diseño consistente
- Responsive design
- Accesibilidad incorporada

## Portal Cliente

### Funcionalidades
- **Dashboard**: Resumen de servicios
- **Solicitar Servicio**: Formulario de solicitud
- **Servicios Activos**: Estado actual
- **Historial**: Servicios anteriores

### Flujo de Solicitud
1. Completar formulario de solicitud
2. Revisión automática
3. Asignación de grúa y operador
4. Seguimiento del servicio

## Portal Operador

### Funcionalidades
- **Servicios Asignados**: Lista de trabajos
- **Formulario de Inspección**: Detalles del servicio
- **Captura de Fotos**: Documentación visual
- **Firmas Digitales**: Confirmación de cliente

### Flujo de Trabajo
1. Ver servicios asignados
2. Aceptar/iniciar servicio
3. Completar inspección
4. Finalizar y confirmar

## Casos de Prueba

### Usuarios Demo
- **Admin**: admin@gruas.com / admin123
- **Cliente**: cliente@empresa.com / cliente123  
- **Operador**: operador@gruas.com / operador123

### Escenarios de Prueba
1. Login con diferentes roles
2. Navegación entre portales
3. Creación de servicios
4. Gestión de datos maestros
5. Flujos de autorización

---

*Last updated: 2024-12-27*
