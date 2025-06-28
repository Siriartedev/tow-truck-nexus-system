
# 🚛 TMS Grúas - Sistema de Gestión de Transporte

[![Estado](https://img.shields.io/badge/Estado-Funcional-green)]()
[![Versión](https://img.shields.io/badge/Versión-1.0.0-blue)]()
[![Tecnología](https://img.shields.io/badge/Tecnología-React%20+%20Supabase-purple)]()

## 🌟 Descripción

TMS Grúas es un sistema integral de gestión de servicios de grúa que permite la administración completa de servicios, clientes, operadores y equipos a través de portales especializados.

## 🚀 Inicio Rápido

### Credenciales Demo
```
🔑 Admin:     admin@demo.com / admin123
🔑 Cliente:   cliente@demo.com / cliente123  
🔑 Operador:  operador@demo.com / operador123
```

### Acceso al Sistema
1. Visita la aplicación en tu navegador
2. Usa las credenciales demo
3. Explora los diferentes portales según tu rol

## 🏗️ Arquitectura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Portal Admin  │    │  Portal Cliente │    │ Portal Operador │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ • Dashboard     │    │ • Solicitudes   │    │ • Inspecciones  │
│ • Servicios     │    │ • Historial     │    │ • Inventarios   │
│ • Clientes      │    │ • Documentos    │    │ • Firmas        │
│ • Operadores    │    │ • Seguimiento   │    │ • Fotografías   │
│ • Grúas         │    └─────────────────┘    └─────────────────┘
│ • Reportes      │              │                        │
└─────────────────┘              │                        │
         │                       │                        │
         └───────────────────────┼────────────────────────┘
                                 │
                    ┌─────────────────┐
                    │    Supabase     │
                    ├─────────────────┤
                    │ • PostgreSQL    │
                    │ • Auth          │
                    │ • Storage       │
                    │ • RLS           │
                    └─────────────────┘
```

## 📋 Funcionalidades Principales

### 👨‍💼 Portal Administrativo
- **Dashboard**: Métricas y resumen general
- **Servicios**: Gestión completa de servicios de grúa
- **Clientes**: Administración de base de clientes
- **Operadores**: Control de personal operativo
- **Grúas**: Inventario y mantenimiento de equipos
- **Reportes**: Análisis y documentación

### 🏢 Portal de Cliente
- **Solicitudes**: Crear nuevos pedidos de servicio
- **Seguimiento**: Estado en tiempo real de servicios
- **Historial**: Servicios anteriores y documentación
- **Documentos**: Descargas de certificados y facturas

### 🚛 Portal de Operador
- **Inspecciones**: Checklist digital de seguridad
- **Inventarios**: Documentación de vehículos
- **Fotografías**: Captura y almacenamiento de evidencias
- **Firmas**: Validación digital de servicios

## 🛠️ Tecnologías

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: Tailwind CSS + Shadcn/UI
- **Backend**: Supabase (PostgreSQL + APIs)
- **Autenticación**: Supabase Auth + RLS
- **Estado**: React Query + Context API
- **Routing**: React Router v6

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── auth/           # Autenticación
│   ├── client-portal/  # Portal de cliente
│   ├── operator-portal/# Portal de operador
│   └── ui/            # Componentes base UI
├── pages/              # Páginas principales
├── hooks/              # Custom hooks
├── types/              # Definiciones TypeScript
├── lib/                # Utilidades y helpers
└── integrations/       # Configuración Supabase
```

## 🔐 Sistema de Seguridad

### Autenticación
- JWT Tokens con Supabase Auth
- Sesiones persistentes
- Logout automático por inactividad

### Autorización
- Row Level Security (RLS)
- Políticas por rol de usuario
- Validación en frontend y backend

### Roles de Usuario
```typescript
type UserRole = 'admin' | 'client' | 'operator'
```

## 📊 Base de Datos

### Tablas Principales
- `user_profiles` - Perfiles de usuario
- `clients` - Información de clientes
- `operators` - Datos de operadores
- `cranes` - Inventario de grúas
- `services` - Registro de servicios
- `service_types` - Tipos de servicio

### Configuración Supabase
```sql
-- URL del proyecto
https://ipgodqlupnijbyexkvsz.supabase.co

-- Configuración RLS habilitada
-- Políticas por rol implementadas
-- Triggers para perfiles automáticos
```

## 🚀 Instalación y Desarrollo

### Requisitos
- Node.js 18+
- npm o yarn
- Cuenta Supabase

### Variables de Entorno
```env
VITE_SUPABASE_URL=https://ipgodqlupnijbyexkvsz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

### Comandos
```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build producción
npm run build

# Supabase local
supabase start
```

## 📈 Estado del Proyecto

### ✅ Completado
- [x] Autenticación completa
- [x] Sistema de roles
- [x] Portales diferenciados
- [x] Base de datos relacional
- [x] UI responsiva
- [x] Navegación por roles

### 🔄 En Progreso
- [ ] Optimización de rendimiento
- [ ] Tests unitarios
- [ ] Documentación API

### 🚨 Problemas Conocidos
- Warnings de features del navegador (no críticos)
- Optimización de carga inicial pendiente

## 📞 Soporte

### Documentación
- [Documentación Completa](./docs/DOCUMENTATION.md)
- [Manual de Usuario](./docs/USER_MANUAL.md)
- [Guía Técnica](./docs/TECHNICAL_GUIDE.md)

### Contacto
- Sistema desarrollado con Lovable
- Logs disponibles en Supabase Dashboard
- Monitoreo de errores activo

---

**🎯 Objetivo**: Proporcionar una solución completa y eficiente para la gestión de servicios de grúa con portales especializados para cada tipo de usuario.

**🏆 Estado**: Sistema funcional listo para uso en producción con optimizaciones pendientes.
