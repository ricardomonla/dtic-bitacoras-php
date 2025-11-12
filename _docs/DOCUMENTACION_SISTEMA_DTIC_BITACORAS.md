# Documentación del Sistema DTIC Bitácoras

**ID:** `DTIC-DOCS-SYS-001` | **Categoría:** `documentacion/sistema` | **Prioridad:** `1`

---

## 1. INTRODUCCIÓN Y ARQUITECTURA

### 1.1 Resumen Ejecutivo

El Sistema DTIC Bitácoras es una aplicación web completa para la gestión de tareas, recursos y personal técnico del Departamento de Tecnología de la Información y Comunicación (DTIC) de la Universidad Tecnológica Nacional - Facultad Regional La Rioja.

**Stack Tecnológico:**
- **Frontend:** React 18 + TypeScript + Bootstrap 5
- **Backend:** Node.js + Express + PostgreSQL
- **Contenedorización:** Docker + Docker Compose
- **Autenticación:** JWT con refresh tokens (8 horas expiración)
- **Base de Datos:** PostgreSQL 13+ con pool de conexiones

**Funcionalidades Principales:**
- Gestión completa de técnicos con roles y permisos
- Control de tareas con asignación a técnicos
- Inventario de recursos con asignación a tareas/usuarios
- Dashboard con métricas y estadísticas
- Sistema de reportes y calendarios
- Autenticación segura con múltiples niveles de acceso

### 1.2 Arquitectura General

#### Diagrama de Arquitectura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   PostgreSQL    │
│   (React + TS)  │◄──►│ (Node.js + Exp) │◄──►│   Database      │
│                 │    │                 │    │                 │
│ • Dashboard     │    │ • Auth Routes   │    │ • tecnicos      │
│ • Entity Mgmt   │    │ • CRUD Routes   │    │ • tareas        │
│ • Resource Ass. │    │ • Resource Ass. │    │ • recursos      │
│ • Reports       │    │ • Middleware    │    │ • tarea_recursos│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

#### Componentes Principales

**Frontend:**
- **App.tsx:** Enrutamiento principal y configuración global
- **EntityPage.tsx:** Página genérica para gestión de entidades
- **Dashboard.tsx:** Panel principal con métricas y estadísticas
- **EntityForm.tsx:** Formulario genérico con soporte para asignación de recursos
- **ResourceAssignmentControl.tsx:** Componente especializado para gestión de recursos

**Backend:**
- **server.js:** Servidor principal con middleware y rutas
- **routes/:** Endpoints RESTful para cada entidad
- **database.js:** Configuración de conexión PostgreSQL
- **middleware/auth.js:** Autenticación JWT

**Base de Datos:**
- **init.sql:** Esquema completo con datos de ejemplo
- **tarea_recursos:** Tabla de relación many-to-many entre tareas y recursos
- **tarea_recurso_historial:** Auditoría de asignaciones

### 1.3 Sistema de Permisos

```
viewer (1) → technician (2) → admin (3) → super_admin (4)
```

- **viewer:** Solo lectura de datos
- **technician:** Lectura + escritura limitada
- **admin:** Control total del sistema
- **super_admin:** Acceso completo + configuración

### 1.4 Entidades Principales

#### 1.4.1 Técnicos
**Descripción:** Operadores y administradores del sistema DTIC que gestionan recursos, usuarios y tareas.

**Campos Clave:**
- `dtic_id`: Identificador único del técnico
- `first_name`, `last_name`: Nombre y apellido
- `email`: Correo electrónico único
- `phone`: Número de teléfono
- `department`: Departamento (dtic, sistemas, redes, seguridad)
- `role`: Rol del sistema (admin, technician, viewer)
- `is_active`: Estado activo/inactivo

**Funcionalidades:**
- CRUD completo de perfiles técnicos
- Gestión de contraseñas y autenticación
- Asignación de recursos a tareas
- Creación y gestión de tareas
- Acceso basado en roles y permisos

**Estados:** active/inactive
**Roles:** admin, technician, viewer

#### 1.4.2 Usuarios Asignados
**Descripción:** Personas o entidades que CONSUMEN los servicios del DTIC (beneficiarios/clientes finales).

**Campos Clave:**
- `dtic_id`: Identificador único del usuario
- `first_name`, `last_name`: Nombre y apellido
- `email`: Correo electrónico
- `phone`: Número de teléfono
- `department`: Departamento al que pertenece
- `position`: Cargo o posición

**Funcionalidades:**
- CRUD completo de perfiles de usuarios
- Asignación de recursos para uso personal
- Recepción de servicios técnicos
- Generación de historial de uso de recursos

**Relaciones:** Puede tener múltiples recursos asignados simultáneamente

#### 1.4.3 Recursos
**Descripción:** Hardware, software, equipos y activos gestionados por el DTIC.

**Campos Clave:**
- `dtic_id`: Identificador único del recurso
- `name`: Nombre del recurso
- `description`: Descripción detallada
- `category`: Categoría (hardware, software, network, security, tools, facilities)
- `status`: Estado actual
- `location`: Ubicación física
- `technical_specs`: Especificaciones técnicas (JSON)
- `serial_number`: Número de serie
- `model`: Modelo del equipo

**Estados:** available, assigned, maintenance, retired

**Funcionalidades:**
- CRUD completo de inventario
- Asignación a usuarios y tareas
- Historial completo de cambios
- Gestión automática de estados
- Control de disponibilidad

#### 1.4.4 Tareas
**Descripción:** Trabajos de mantenimiento, instalación, soporte técnico y otras actividades del DTIC.

**Campos Clave:**
- `dtic_id`: Identificador único de la tarea
- `title`: Título descriptivo
- `description`: Descripción detallada del trabajo
- `status`: Estado de progreso
- `priority`: Nivel de prioridad
- `technician_id`: Técnico asignado
- `due_date`: Fecha límite
- `completed_at`: Fecha de finalización

**Estados:** pending, in_progress, completed, cancelled
**Prioridades:** low, medium, high, urgent

**Funcionalidades:**
- CRUD completo de tareas
- Asignación automática a técnicos
- Seguimiento de progreso con timestamps
- Control de fechas límite
- Priorización automática

#### 1.4.5 Entidades de Relación y Auditoría

**Tarea_Recursos:** Relación many-to-many entre tareas y recursos asignados
- Campos: tarea_id, recurso_id, assigned_by, assigned_at, unassigned_at, estimated_hours, actual_hours, notes
- Funcionalidad: Control de asignaciones con horas estimadas/reales y auditoría

**Recurso_Asignaciones:** Relaciones entre recursos y usuarios asignados
- Campos: recurso_id, user_id, assigned_by, assigned_at, unassigned_at, activo
- Funcionalidad: Gestión de asignaciones personales con control de estado activo

**Historial y Auditoría:**
- `Recurso_Historial`: Auditoría completa de cambios en recursos
- `Tarea_Historial`: Seguimiento de cambios en tareas
- `Logs_Sistema`: Auditoría general de operaciones

#### 1.4.6 Entidades de Configuración

**Departamentos:** Estructura organizacional del DTIC
**Categorías_Recursos:** Clasificación de tipos de recursos
**Prioridades_Tareas:** Niveles de urgencia con SLA
**Reportes_Programados:** Sistema de reportes automáticos
**Configuraciones_Sistema:** Configuración centralizada del sistema

---

## 2. COMPONENTES FRONTEND

### 2.1 Estructura de Componentes

#### App.tsx - Enrutamiento Principal
```typescript
// Rutas principales del sistema
<Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
<Route path="/tecnicos" element={<PrivateRoute><EntityPage /></PrivateRoute>} />
<Route path="/tareas" element={<PrivateRoute><EntityPage /></PrivateRoute>} />
<Route path="/recursos" element={<PrivateRoute><EntityPage /></PrivateRoute>} />
<Route path="/usuarios" element={<PrivateRoute><EntityPage /></PrivateRoute>} />
```

#### EntityPage.tsx - Gestión Genérica de Entidades
**Características:**
- Carga dinámica de configuración desde `entities.yml`
- Tabla responsive con filtros y búsqueda
- Formularios de creación/edición integrados
- Modales de perfil con información detallada
- Sistema de acciones con confirmaciones inteligentes

**Funcionalidades Clave:**
- **Filtros Dinámicos:** Por estado, departamento, prioridad
- **Búsqueda Global:** Nombre, email, DTIC ID
- **Paginación:** Controlada por backend
- **Acciones Contextuales:** Ver, editar, eliminar, cambiar estado

#### Dashboard.tsx - Panel de Control
**Métricas Mostradas:**
- Total de técnicos activos/inactivos
- Estado de tareas (pendientes, en progreso, completadas)
- Recursos disponibles/asignados/en mantenimiento
- Usuarios con/sin recursos asignados

**Características:**
- Carga paralela de datos para mejor performance
- Actualización automática de fecha/hora
- Eventos próximos simulados
- Actividad reciente con tipos de eventos

### 2.2 Sistema de Asignación de Recursos

#### ResourceAssignmentControl.tsx
**Props Principales:**
```typescript
interface ResourceAssignmentControlProps {
  entityId: number
  entityType: 'tarea' | 'usuario' | 'tecnico' | 'recurso'
  assignedResources: AssignedResource[]
  availableResources: ResourceOption[]
  onAssignResource: (resourceId: number) => Promise<boolean>
  onUnassignResource: (resourceId: number) => Promise<boolean>
  loading?: boolean
}
```

**Funcionalidades:**
- Visualización de recursos asignados con metadatos
- Selector de recursos disponibles con filtrado
- Operaciones de asignación/desasignación con feedback visual
- Estados de carga y manejo de errores
- Diseño responsive con soporte para categorías

#### useResourceAssignment.ts - Hook Personalizado
**Funciones Principales:**
- `assignResource()`: Asigna recurso a entidad
- `unassignResource()`: Desasigna recurso de entidad
- `loadAssignedResources()`: Carga recursos asignados
- `loadAvailableResources()`: Carga recursos disponibles
- `refreshAssignments()`: Actualiza ambas listas

**Manejo de Errores:**
- Captura de errores de red y API
- Mensajes contextualizados en español
- Fallbacks para casos de fallo
- Logging para debugging

### 2.3 Configuración YAML (entities.yml)

#### Estructura de Configuración
```yaml
entities:
  tecnicos:
    name: "Técnicos"
    api:
      endpoint: "/api/tecnicos"
      methods: ["GET", "POST", "PUT", "DELETE"]
    fields:
      - name: "first_name"
        label: "Nombre"
        type: "text"
        required: true
    table:
      columns: [...]
    filters: [...]
    actions: [...]
    modals: [...]
```

#### Tipos de Campos Soportados
- **text/email/tel:** Campos de texto estándar
- **select:** Selectores con opciones estáticas/dinámicas
- **textarea:** Áreas de texto multilínea
- **date:** Selectores de fecha
- **resource_assignment:** Control especializado de recursos

**Nota:** Para información detallada completa sobre todas las entidades del sistema, incluyendo descripciones, campos clave, funcionalidades, estados, relaciones y roles, consulte la sección [4.7 Configuración de Entidades](#47-configuración-de-entidades).

### 2.4 Sistema de Autenticación Frontend

#### PrivateRoute.tsx
- Protección de rutas basada en autenticación
- Redirección automática a login
- Preservación de ruta intentada

#### authStore.ts
```typescript
interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  refreshToken: () => Promise<void>
}
```

### 2.5 Componentes Comunes

#### EntityLayout.tsx
- Layout consistente para páginas de entidades
- Header con título, subtítulo e icono
- Panel de estadísticas dinámicas
- Contenedor responsive

#### EntityForm.tsx
- Formulario genérico con validación
- Soporte para campos dinámicos
- Integración con ResourceAssignmentControl
- Estados de carga y errores

#### ProfileModal.tsx
- Modal genérico para visualización de perfiles
- Carga dinámica de componentes específicos
- Layout adaptable por entidad

---

## 3. APIs BACKEND

### 3.1 Arquitectura de Rutas

#### server.js - Servidor Principal
**Middleware Configurado:**
- **Helmet:** Seguridad de headers HTTP
- **CORS:** Control de origen cruzado
- **Rate Limiting:** Límite de solicitudes (1000/15min para API, 5/15min para auth)
- **Compression:** Compresión gzip
- **Body Parser:** JSON y URL-encoded

**Rutas Principales:**
```javascript
app.use('/api/auth', authRoutes)
app.use('/api/tecnicos', tecnicosRoutes)
app.use('/api/tareas', tareasRoutes)
app.use('/api/recursos', recursosRoutes)
app.use('/api/tarea-recursos', tareaRecursosRoutes)
app.use('/api/usuarios_asignados', usuariosAsignadosRoutes)
```

### 3.2 API de Autenticación

#### POST /api/auth/login
```javascript
// Request
{
  "email": "user@example.com",
  "password": "password123"
}

// Response
{
  "success": true,
  "message": "Inicio de sesión exitoso",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": 1,
      "dtic_id": "TEC-0001",
      "first_name": "Juan",
      "role": "admin"
    }
  }
}
```

#### GET /api/auth/me
- Retorna información del usuario actual
- Requiere token JWT válido

#### POST /api/auth/refresh
- Renueva token JWT expirado
- Mantiene sesión activa

### 3.3 API de Técnicos

#### GET /api/tecnicos
**Parámetros de Query:**
- `page`, `limit`: Paginación
- `search`: Búsqueda por nombre/email/DTIC ID
- `department`: Filtrar por departamento
- `role`: Filtrar por rol
- `status`: active/inactive/all

#### POST /api/tecnicos
```javascript
{
  "first_name": "Juan",
  "last_name": "Pérez",
  "email": "juan.perez@dtic.gob.ar",
  "department": "dtic",
  "role": "technician"
}
```

#### PUT /api/tecnicos/:id
- Actualización completa de técnico
- Validación de email único
- Conversión automática de apellido a mayúsculas

### 3.4 API de Tareas

#### GET /api/tareas
**Incluye automáticamente:**
- Información del técnico asignado
- Recursos asignados con detalles
- Conteo de recursos por tarea

#### POST /api/tareas
```javascript
{
  "title": "Configurar servidor",
  "description": "Instalación y configuración...",
  "technician_id": 1,
  "priority": "high",
  "due_date": "2025-12-01"
}
```

### 3.5 API de Recursos

#### GET /api/recursos
**Parámetros:**
- `category`: hardware/software/network/security/tools/facilities
- `status`: available/assigned/maintenance/retired
- `location`: Ubicación física

#### Funcionalidades Especiales:
- **Asignación a usuarios:** POST /api/recursos/:id/asignar
- **Desasignación:** POST /api/recursos/:id/desasignar
- **Historial:** GET /api/recursos/:id?include_history=true

### 3.6 API de Asignación Tarea-Recursos

#### GET /api/tarea-recursos/tareas/:id/recursos
Retorna todos los recursos asignados a una tarea específica con metadatos completos.

**Respuesta Exitosa:**
```javascript
{
  "success": true,
  "data": {
    "task": {
      "id": 2,
      "title": "Reconfigurar puerto KOHA",
      "status": "in_progress",
      "technician_id": 1
    },
    "assignments": [
      {
        "id": 2,
        "recurso_id": 8,
        "recurso_name": "srvv-KOHA",
        "recurso_category": "hardware",
        "recurso_status": "assigned",
        "assigned_at": "2025-11-04T21:48:08.869Z",
        "assigned_by": 1,
        "estimated_hours": "8.00",
        "actual_hours": null,
        "notes": "Recurso asignado para reconfiguración",
        "activo": true
      }
    ]
  }
}
```

#### POST /api/tarea-recursos/tareas/:id/recursos
Asigna uno o múltiples recursos a una tarea con validaciones de negocio.

**Parámetros Requeridos:**
```javascript
{
  "recurso_id": 8,
  "estimated_hours": 8,
  "notes": "Recurso asignado para reconfiguración"
}
```

**Validaciones:**
- El recurso debe existir y estar disponible
- El recurso no puede estar asignado a otra tarea activa
- Solo usuarios con rol technician o superior pueden asignar
- Se registra automáticamente en `tarea_recurso_historial`

#### PUT /api/tarea-recursos/tareas/:id/recursos/:recursoId
Actualiza una asignación existente (horas reales, notas, etc.).

```javascript
{
  "actual_hours": 6.5,
  "notes": "Tarea completada exitosamente"
}
```

#### DELETE /api/tarea-recursos/tareas/:id/recursos/:recursoId
Desasigna un recurso de una tarea y actualiza su estado.

**Comportamiento:**
- Marca la asignación como inactiva (`activo = false`)
- Registra `unassigned_at` y `unassigned_by`
- Actualiza el estado del recurso a 'available'
- Crea entrada en historial con acción 'unassigned'

#### GET /api/recursos/:id/tareas
Retorna todas las tareas que han utilizado un recurso específico.

**Respuesta:**
```javascript
{
  "success": true,
  "data": {
    "recurso": {
      "id": 8,
      "name": "srvv-KOHA",
      "category": "hardware"
    },
    "assignments": [
      {
        "tarea_id": 2,
        "tarea_title": "Reconfigurar puerto KOHA",
        "assigned_at": "2025-11-04T21:48:08.869Z",
        "unassigned_at": null,
        "estimated_hours": 8,
        "actual_hours": null,
        "activo": true
      }
    ]
  }
}
```

#### Validaciones de Integridad
- **Disponibilidad**: Un recurso no puede asignarse a múltiples tareas activas
- **Permisos**: Solo técnicos pueden gestionar asignaciones
- **Estado**: Recursos en mantenimiento no pueden asignarse
- **Auditoría**: Todas las operaciones quedan registradas

### 3.7 Middleware de Autenticación

#### auth.js - Verificación JWT
```javascript
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'Token requerido' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' })
  }
}
```

#### Sistema de Roles
```javascript
const checkPermission = (requiredRole) => {
  return (req, res, next) => {
    const userRole = req.user?.role
    const roleHierarchy = {
      'viewer': 1, 'technician': 2, 'admin': 3, 'super_admin': 4
    }

    if (roleHierarchy[userRole] >= roleHierarchy[requiredRole]) {
      next()
    } else {
      res.status(403).json({ error: 'Permisos insuficientes' })
    }
  }
}
```

---

## 4. ESQUEMA DE BASE DE DATOS

### 4.1 Diagrama de Relaciones

```
tecnicos (1) ──── (1,N) tareas
   │                      │
   │                      │
   └── (1,N) audit_log    └── (N,N) tarea_recursos (N,N) ── recursos
                              │                              │
                              │                              │
                              └── (N,N) recurso_asignaciones ── usuarios_asignados
```

### 4.2 Tablas Principales

#### tecnicos
```sql
CREATE TABLE tecnicos (
    id SERIAL PRIMARY KEY,
    dtic_id VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    department VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'technician', 'viewer')),
    password_hash VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### tareas
```sql
CREATE TABLE tareas (
    id SERIAL PRIMARY KEY,
    dtic_id VARCHAR(20) UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    technician_id INTEGER REFERENCES tecnicos(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    due_date TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);
```

#### recursos
```sql
CREATE TABLE recursos (
    id SERIAL PRIMARY KEY,
    dtic_id VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'assigned', 'maintenance', 'retired')),
    location VARCHAR(200),
    technical_specs JSONB,
    serial_number VARCHAR(100),
    model VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### tarea_recursos (Tabla de Relación)
```sql
CREATE TABLE tarea_recursos (
    id SERIAL PRIMARY KEY,
    tarea_id INTEGER NOT NULL REFERENCES tareas(id) ON DELETE CASCADE,
    recurso_id INTEGER NOT NULL REFERENCES recursos(id) ON DELETE CASCADE,
    assigned_by INTEGER REFERENCES tecnicos(id),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    unassigned_by INTEGER REFERENCES tecnicos(id),
    unassigned_at TIMESTAMP WITH TIME ZONE,
    activo BOOLEAN DEFAULT true,
    estimated_hours DECIMAL(5,2),
    actual_hours DECIMAL(5,2),
    notes TEXT,
    UNIQUE (tarea_id, recurso_id, activo) DEFERRABLE INITIALLY DEFERRED,
    CHECK (NOT (tarea_id = ANY(SELECT t.tarea_id FROM tarea_recursos t
                               WHERE t.recurso_id = recurso_id AND t.activo = true
                               AND t.id != id)))
);
```

### 4.3 Tablas de Auditoría

#### audit_log
```sql
CREATE TABLE audit_log (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES tecnicos(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INTEGER,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### tarea_recurso_historial
```sql
CREATE TABLE tarea_recurso_historial (
    id SERIAL PRIMARY KEY,
    tarea_recurso_id INTEGER NOT NULL REFERENCES tarea_recursos(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL, -- 'assigned', 'unassigned', 'updated', 'completed'
    tecnico_id INTEGER REFERENCES tecnicos(id), -- técnico que realizó la acción
    old_values JSONB, -- valores anteriores (JSON)
    new_values JSONB, -- valores nuevos (JSON)
    details TEXT, -- descripción detallada de la acción
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

**Acciones Registradas:**
- `assigned`: Asignación inicial de recurso a tarea
- `unassigned`: Desasignación de recurso de tarea
- `updated`: Modificación de horas estimadas/reales o notas
- `completed`: Marcado como completado con horas reales

### 4.4 Funciones y Triggers

#### Función para Generar DTIC ID
```sql
CREATE OR REPLACE FUNCTION dtic.generate_dtic_id(prefix TEXT)
RETURNS TEXT AS $$
DECLARE
    counter INTEGER;
    new_id TEXT;
BEGIN
    SELECT COALESCE(MAX(CAST(SUBSTRING(dtic_id FROM LENGTH(prefix) + 2) AS INTEGER)), 0) + 1
    INTO counter
    FROM (
        SELECT dtic_id FROM dtic.tecnicos WHERE dtic_id LIKE prefix || '-%'
        UNION ALL
        SELECT dtic_id FROM dtic.tareas WHERE dtic_id LIKE prefix || '-%'
        UNION ALL
        SELECT dtic_id FROM dtic.recursos WHERE dtic_id LIKE prefix || '-%'
        UNION ALL
        SELECT dtic_id FROM dtic.usuarios_asignados WHERE dtic_id LIKE prefix || '-%'
    ) AS all_ids;

    new_id := prefix || '-' || LPAD(counter::TEXT, 4, '0');
    RETURN new_id;
END;
$$ LANGUAGE plpgsql;
```

#### Triggers de Actualización Automática
```sql
CREATE TRIGGER update_tecnicos_updated_at
    BEFORE UPDATE ON tecnicos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tareas_updated_at
    BEFORE UPDATE ON tareas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

#### Triggers de Integridad de Recursos
```sql
CREATE TRIGGER validate_tarea_recurso_assignment_trigger
    BEFORE INSERT OR UPDATE ON tarea_recursos
    FOR EACH ROW EXECUTE FUNCTION validate_tarea_recurso_assignment();

CREATE TRIGGER update_recurso_status_from_assignments_trigger
    AFTER INSERT OR UPDATE OR DELETE ON tarea_recursos
    FOR EACH ROW EXECUTE FUNCTION update_recurso_status_from_assignments();

CREATE TRIGGER tarea_recurso_historial_trigger
    AFTER INSERT OR UPDATE OR DELETE ON tarea_recursos
    FOR EACH ROW EXECUTE FUNCTION log_tarea_recurso_changes();
```

### 4.5 Índices de Performance

```sql
-- Índices para búsquedas comunes
CREATE INDEX idx_tecnicos_email ON tecnicos (email);
CREATE INDEX idx_tecnicos_department ON tecnicos (department);
CREATE INDEX idx_tecnicos_role ON tecnicos (role);
CREATE INDEX idx_tareas_technician ON tareas (technician_id);
CREATE INDEX idx_tareas_status ON tareas (status);
CREATE INDEX idx_recursos_category ON recursos (category);
CREATE INDEX idx_recursos_status ON recursos (status);
CREATE INDEX idx_tarea_recursos_tarea ON tarea_recursos (tarea_id);
CREATE INDEX idx_tarea_recursos_recurso ON tarea_recursos (recurso_id);
CREATE INDEX idx_tarea_recursos_activo ON tarea_recursos (activo);
CREATE INDEX idx_tarea_recursos_tarea_activo ON tarea_recursos (tarea_id, activo);
CREATE INDEX idx_tarea_recursos_recurso_activo ON tarea_recursos (recurso_id, activo);
CREATE INDEX idx_tarea_recurso_historial_tarea_recurso ON tarea_recurso_historial (tarea_recurso_id);
CREATE INDEX idx_tarea_recurso_historial_action ON tarea_recurso_historial (action);
CREATE INDEX idx_tarea_recurso_historial_created_at ON tarea_recurso_historial (created_at);
```

### 4.6 Datos de Ejemplo

La base de datos incluye datos de ejemplo para:
- 7 técnicos con diferentes roles y departamentos
- 6 recursos de diferentes categorías (hardware, software, network, security, tools, facilities)
- 5 usuarios asignados para uso de recursos
- Tareas asignadas con diferentes estados y prioridades
- Asignaciones tarea-recurso con horas estimadas y reales
- Historial completo de asignaciones y desasignaciones
- Registros de auditoría para todas las operaciones críticas

### 4.7 Configuración de Entidades

Esta sección detalla la configuración completa de todas las entidades del sistema DTIC Bitácoras, basada en el archivo de configuración `entities.yml`. Cada entidad incluye descripción detallada, campos clave, funcionalidades, estados, relaciones y roles asociados.

#### 4.7.1 Usuarios (Usuarios Asignados)
**Descripción Completa:**
Los "Usuarios" en este contexto no son usuarios del sistema (como login/accounts), sino que son las personas o entidades que CONSUMEN los servicios del DTIC - es decir, los usuarios finales que reciben los recursos, técnicos, y servicios del departamento. Los "Usuarios" serían los beneficiarios/clientes finales del sistema DTIC, no los operadores/administradores.

**Campos Clave:**
- `dtic_id`: Identificador único (formato: USU-XXXX)
- `first_name`: Nombre del usuario
- `last_name`: Apellido del usuario
- `email`: Correo electrónico de contacto
- `phone`: Número de teléfono
- `department`: Departamento al que pertenece
- `position`: Cargo o posición en la organización

**Funcionalidades:**
- Gestión completa de perfiles de beneficiarios
- Asignación de recursos para uso personal
- Recepción de servicios técnicos del DTIC
- Generación automática de historial de uso
- Control de acceso a recursos asignados

**Relaciones:**
- **Con Recursos:** Many-to-many a través de `recurso_asignaciones`
- **Con Técnicos:** A través de servicios prestados
- **Con Historial:** Genera registros en `recurso_historial`

**Estados:** No tiene estados explícitos (siempre activos para asignaciones)

#### 4.7.2 Técnicos
**Descripción Completa:**
Operadores y administradores del sistema DTIC que gestionan recursos, usuarios y tareas. Son los usuarios del sistema con capacidades de login y gestión.

**Campos Clave:**
- `dtic_id`: Identificador único (formato: TEC-XXXX)
- `first_name`: Nombre del técnico
- `last_name`: Apellido del técnico
- `email`: Correo electrónico único (usado para login)
- `phone`: Número de teléfono de contacto
- `department`: Departamento (dtic, sistemas, redes, seguridad)
- `role`: Rol en el sistema
- `is_active`: Estado activo/inactivo
- `password_hash`: Contraseña encriptada (bcrypt)

**Funcionalidades:**
- Autenticación completa en el sistema
- Gestión de contraseñas con políticas de seguridad
- Asignación de recursos a tareas y usuarios
- Creación y gestión de tareas técnicas
- Acceso basado en roles y permisos jerárquicos
- Auditoría completa de todas las operaciones realizadas

**Estados:** active/inactive

**Roles y Jerarquía:**
- `super_admin` (4): Acceso completo + configuración del sistema
- `admin` (3): Control total del sistema operativo
- `technician` (2): Operaciones técnicas + gestión limitada
- `viewer` (1): Solo lectura de datos

**Relaciones:**
- **Con Tareas:** One-to-many (un técnico puede tener múltiples tareas asignadas)
- **Con Recursos:** A través de asignaciones realizadas
- **Con Usuarios:** A través de servicios prestados
- **Con Historial:** Genera registros en todas las tablas de auditoría

#### 4.7.3 Recursos
**Descripción Completa:**
Hardware, software, equipos y activos físicos/digitales gestionados por el DTIC. Representa el inventario completo de recursos tecnológicos disponibles.

**Campos Clave:**
- `dtic_id`: Identificador único (formato: REC-XXXX)
- `name`: Nombre descriptivo del recurso
- `description`: Descripción detallada del recurso y su uso
- `category`: Categoría del recurso
- `status`: Estado actual del recurso
- `location`: Ubicación física o lógica
- `technical_specs`: Especificaciones técnicas (JSONB)
- `serial_number`: Número de serie del fabricante
- `model`: Modelo específico del equipo

**Categorías:**
- `hardware`: Equipos físicos (servidores, computadoras, periféricos)
- `software`: Aplicaciones y sistemas operativos
- `network`: Equipos de red (routers, switches, cables)
- `security`: Herramientas de seguridad (firewalls, antivirus)
- `tools`: Herramientas técnicas y de mantenimiento
- `facilities`: Infraestructura física (salas, racks, climatización)

**Estados:**
- `available`: Disponible para asignación
- `assigned`: Actualmente asignado a usuario o tarea
- `maintenance`: En mantenimiento o reparación
- `retired`: Retirado del servicio activo

**Funcionalidades:**
- CRUD completo del inventario
- Asignación automática a usuarios y tareas
- Historial completo del ciclo de vida
- Gestión automática de estados basada en asignaciones
- Control de disponibilidad en tiempo real
- Especificaciones técnicas detalladas

**Relaciones:**
- **Con Usuarios:** Many-to-many a través de `recurso_asignaciones`
- **Con Tareas:** Many-to-many a través de `tarea_recursos`
- **Con Técnicos:** A través de asignaciones realizadas
- **Con Historial:** Tabla dedicada `recurso_historial`

#### 4.7.4 Tareas
**Descripción Completa:**
Trabajos de mantenimiento, instalación, soporte técnico y otras actividades operativas del DTIC. Representa el workload técnico del departamento.

**Campos Clave:**
- `dtic_id`: Identificador único (formato: TAR-XXXX)
- `title`: Título descriptivo de la tarea
- `description`: Descripción detallada del trabajo a realizar
- `status`: Estado actual de progreso
- `priority`: Nivel de urgencia y prioridad
- `technician_id`: Técnico asignado (FK a tecnicos)
- `due_date`: Fecha límite para completación
- `completed_at`: Timestamp de finalización real
- `created_at`: Timestamp de creación
- `updated_at`: Timestamp de última modificación

**Estados:**
- `pending`: Esperando asignación o inicio
- `in_progress`: En ejecución activa
- `completed`: Finalizada exitosamente
- `cancelled`: Cancelada antes de completarse

**Prioridades:**
- `low`: Baja prioridad, sin urgencia
- `medium`: Prioridad normal
- `high`: Alta prioridad, requiere atención
- `urgent`: Urgente, requiere respuesta inmediata

**Funcionalidades:**
- Gestión completa del ciclo de vida de tareas
- Asignación automática o manual a técnicos
- Seguimiento de progreso con timestamps
- Control de fechas límite con alertas
- Sistema de priorización automática
- Cálculo de métricas de eficiencia

**Relaciones:**
- **Con Técnicos:** Many-to-one (asignación a técnico específico)
- **Con Recursos:** Many-to-many a través de `tarea_recursos`
- **Con Historial:** Tabla dedicada `tarea_historial`

#### 4.7.5 Entidades de Relación

**Recurso_Asignaciones:**
**Descripción:** Relaciones entre recursos y usuarios asignados (entidad relacional pura).

**Campos Clave:**
- `recurso_id`: ID del recurso asignado
- `user_id`: ID del usuario asignado
- `assigned_by`: ID del técnico que realizó la asignación
- `assigned_at`: Timestamp de asignación
- `unassigned_at`: Timestamp de desasignación (nullable)
- `unassigned_by`: ID del técnico que realizó la desasignación (nullable)
- `activo`: Estado activo de la asignación

**Funcionalidades:**
- Creación y desactivación de asignaciones personales
- Auditoría completa de cambios de asignación
- Control de estado activo para asignaciones vigentes
- Prevención de asignaciones duplicadas

**Tarea_Recursos:**
**Descripción:** Relaciones many-to-many entre tareas y recursos con metadatos adicionales.

**Campos Clave:**
- `tarea_id`: ID de la tarea
- `recurso_id`: ID del recurso asignado
- `assigned_by`: Técnico que realizó la asignación
- `assigned_at`: Timestamp de asignación
- `unassigned_at`: Timestamp de desasignación (nullable)
- `activo`: Estado activo de la asignación
- `estimated_hours`: Horas estimadas para el uso
- `actual_hours`: Horas reales utilizadas (nullable)
- `notes`: Notas adicionales sobre la asignación

**Funcionalidades:**
- Gestión de asignaciones con estimaciones de tiempo
- Seguimiento de horas reales vs estimadas
- Notas y comentarios por asignación
- Control de disponibilidad de recursos

#### 4.7.6 Entidades de Auditoría e Historial

**Recurso_Historial:**
**Descripción:** Auditoría completa de todos los cambios realizados en recursos.

**Campos Clave:**
- `recurso_id`: ID del recurso afectado
- `action`: Tipo de acción realizada
- `details`: Detalles específicos del cambio (JSON)
- `tecnico_id`: Técnico que realizó la acción
- `usuario_id`: Usuario afectado (si aplica)
- `created_at`: Timestamp del registro

**Acciones Registradas:**
- `assigned`: Asignación a usuario o tarea
- `unassigned`: Desasignación de usuario o tarea
- `created`: Creación del recurso
- `updated`: Modificación de datos
- `maintenance`: Inicio/fin de mantenimiento
- `retired`: Retiro del servicio

**Tarea_Historial:**
**Descripción:** Seguimiento de cambios y progreso en tareas.

**Campos Clave:**
- `tarea_id`: ID de la tarea afectada
- `action`: Tipo de acción realizada
- `details`: Detalles del cambio (JSON)
- `tecnico_id`: Técnico que realizó la acción
- `created_at`: Timestamp del registro

**Acciones Registradas:**
- `created`: Creación de la tarea
- `assigned`: Asignación a técnico
- `status_changed`: Cambio de estado
- `completed`: Marcado como completado
- `cancelled`: Cancelación de la tarea

**Logs_Sistema:**
**Descripción:** Auditoría general de todas las operaciones del sistema.

**Campos Clave:**
- `user_id`: ID del usuario que realizó la acción
- `action`: Acción realizada
- `module`: Módulo del sistema afectado
- `details`: Detalles de la operación (JSON)
- `ip_address`: Dirección IP del cliente
- `user_agent`: Información del navegador/cliente
- `created_at`: Timestamp del registro

**Módulos Auditados:**
- `auth`: Operaciones de autenticación
- `recursos`: Gestión de recursos
- `tareas`: Gestión de tareas
- `usuarios`: Gestión de usuarios
- `reportes`: Generación de reportes

#### 4.7.7 Entidades de Configuración del Sistema

**Departamentos:**
**Descripción:** Estructura organizacional del DTIC.

**Campos Clave:**
- `code`: Código único del departamento
- `name`: Nombre del departamento
- `description`: Descripción de funciones
- `manager_id`: ID del técnico manager
- `is_active`: Estado activo del departamento

**Funcionalidades:**
- Clasificación jerárquica de técnicos
- Organización de usuarios por departamento
- Reporting por estructura organizacional

**Categorías_Recursos:**
**Descripción:** Clasificación de tipos de recursos disponibles.

**Campos Clave:**
- `code`: Código único de la categoría
- `name`: Nombre de la categoría
- `description`: Descripción de la categoría
- `icon`: Icono representativo
- `color`: Color para interfaz visual
- `is_active`: Estado activo de la categoría

**Funcionalidades:**
- Agrupación lógica de recursos
- Interfaz visual diferenciada por categoría
- Filtros y búsquedas por categoría

**Prioridades_Tareas:**
**Descripción:** Niveles de urgencia y tiempo de respuesta para tareas.

**Campos Clave:**
- `level`: Nivel numérico de prioridad
- `name`: Nombre descriptivo
- `color`: Color para interfaz visual
- `response_time_hours`: SLA en horas
- `is_active`: Estado activo de la prioridad

**Funcionalidades:**
- Service Level Agreement (SLA)
- Priorización automática de tareas
- Métricas de cumplimiento de SLA

**Reportes_Programados:**
**Descripción:** Reportes automáticos del sistema DTIC.

**Campos Clave:**
- `name`: Nombre del reporte
- `type`: Tipo de reporte
- `frequency`: Frecuencia de ejecución
- `filters`: Filtros aplicados (JSON)
- `recipients`: Lista de destinatarios
- `is_active`: Estado activo del reporte
- `last_run`: Última ejecución
- `next_run`: Próxima ejecución programada

**Tipos de Reporte:**
- `recursos`: Reportes de inventario y asignaciones
- `tareas`: Reportes de productividad y eficiencia
- `usuarios`: Reportes de uso de servicios
- `rendimiento`: Métricas generales del sistema

**Frecuencias:**
- `daily`: Diario
- `weekly`: Semanal
- `monthly`: Mensual
- `quarterly`: Trimestral

**Configuraciones_Sistema:**
**Descripción:** Configuraciones globales del sistema DTIC.

**Campos Clave:**
- `key`: Clave única de configuración
- `value`: Valor de configuración
- `description`: Descripción del parámetro
- `category`: Categoría de configuración
- `is_encrypted`: Si el valor está encriptado
- `updated_by`: Técnico que realizó el cambio
- `updated_at`: Timestamp de modificación

**Categorías:**
- `email`: Configuración de correos electrónicos
- `security`: Parámetros de seguridad
- `ui`: Configuración de interfaz de usuario
- `api`: Configuración de APIs
- `database`: Configuración de base de datos

**Funcionalidades:**
- Configuración centralizada
- Valores encriptados para datos sensibles
- Historial de cambios de configuración
- Validación de parámetros

---


## 5. CONFIGURACIÓN Y DEPLOYMENT

### 5.1 Variables de Entorno

#### .env (Backend)
```bash
# Base de datos
DATABASE_URL=postgresql://dtic_user:password@postgres:5432/dtic_bitacoras

# JWT
JWT_SECRET=your-super-secret-jwt-key
REFRESH_TOKEN_SECRET=your-refresh-token-secret
ACCESS_TOKEN_EXPIRY=8h
REFRESH_TOKEN_EXPIRY=7d

# Servidor
NODE_ENV=development
PORT=3001

# CORS
FRONTEND_URL=http://localhost:5173
```

#### .env (Frontend)
```bash
VITE_API_URL=http://localhost:3001
VITE_ENVIRONMENT=development
VITE_VERSION=1.3.4
```

### 5.2 Docker Compose

#### docker-compose.yml
```yaml
version: '3.8'
services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "5173:5173"
    environment:
      - VITE_API_URL=http://localhost:3001
    volumes:
      - ./frontend/src:/app/src
    depends_on:
      - backend

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3001:3001"
    environment:
      - DATABASE_URL=postgresql://dtic_user:password@postgres:5432/dtic_bitacoras
      - JWT_SECRET=your-jwt-secret
    volumes:
      - ./backend/src:/app/src
    depends_on:
      - postgres

  postgres:
    image: postgres:13
    environment:
      - POSTGRES_DB=dtic_bitacoras
      - POSTGRES_USER=dtic_user
      - POSTGRES_PASSWORD=password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./docker/init.sql:/docker-entrypoint-initdb.d/init.sql

volumes:
  postgres_data:
```

### 5.3 Scripts de Automatización

#### app-run.sh - Gestión Unificada de Aplicación
```bash
#!/bin/bash
# Script de gestión completa del sistema DTIC Bitácoras
# Ubicación: Raíz del proyecto
# Dependencias: Docker, Docker Compose, MySQL client

# Funciones principales:
# - up: Levantar aplicación completa con restauración automática
# - start: Iniciar contenedores con restauración opcional
# - stop: Crear backup y detener contenedores
# - backup: Generar backup manual de base de datos
# - restore <archivo>: Restaurar desde backup específico
# - status: Mostrar estado del sistema

# Ejemplo de uso:
echo "🚀 Iniciando Sistema DTIC Bitácoras..."

# Verificar Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado"
    exit 1
fi

# Construir y ejecutar contenedores
docker-compose up --build -d

# Esperar a que la base de datos esté lista
echo "⏳ Esperando base de datos..."
sleep 10

# Buscar y restaurar backup más reciente
LATEST_BACKUP=$(ls -t ./backups/db_backup_*.sql.gz 2>/dev/null | head -1)
if [ -n "$LATEST_BACKUP" ]; then
    echo "📦 Restaurando backup: $LATEST_BACKUP"
    gunzip -c "$LATEST_BACKUP" | docker exec -i dtic-bitacoras-php-db-1 mysql -u dtic_user -pdtic_password dtic_bitacoras_php
fi

# Verificar servicios
docker-compose ps

echo "✅ Sistema DTIC Bitácoras iniciado correctamente"
echo "📊 Frontend: http://localhost:5173"
echo "🔧 Backend API: http://localhost:3001"
echo "🗄️ Base de datos: localhost:3306"
```

**Características del Script:**
- **Gestión de Backups**: Automatización completa de respaldos con timestamp
- **Restauración Inteligente**: Búsqueda automática del backup más reciente
- **Monitoreo**: Verificación de estado de contenedores y conectividad
- **Manejo de Errores**: Validación de dependencias y estados
- **Logging**: Mensajes informativos con emojis para mejor UX

### 5.4 Sistema de Backups Automatizados

#### Estructura de Backups
```
./backups/
├── db_backup_20251112_143000.sql.gz    # Backup completo comprimido
├── db_backup_20251111_090000.sql.gz    # Backup anterior
└── ...                                 # Histórico de backups
```

#### Comando de Backup Manual
```bash
# Crear backup sin detener servicios
./app_run.sh backup

# Salida esperada:
# 📦 Creando backup: db_backup_20251112_143000.sql.gz
# ✅ Backup creado exitosamente (2.3MB)
```

#### Restauración desde Backup Específico
```bash
# Restaurar backup específico
./app_run.sh restore backups/db_backup_20251111_090000.sql.gz

# Verificación post-restauración
./app_run.sh status
```

#### Políticas de Retención
- **Automática**: Los últimos 10 backups se mantienen
- **Manual**: Backups importantes pueden conservarse indefinidamente
- **Compresión**: Todos los backups usan gzip para optimizar espacio

### 5.4 Health Checks

#### GET /health
```json
{
  "status": "OK",
  "timestamp": "2025-11-12T02:20:47.703Z",
  "version": "1.4.0"
}
```

### 5.5 Configuración de Producción

#### Nginx Reverse Proxy
```nginx
server {
    listen 80;
    server_name dtic-bitacoras.utn.edu.ar;

    location / {
        proxy_pass http://localhost:5173;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### SSL con Let's Encrypt
```bash
certbot --nginx -d dtic-bitacoras.utn.edu.ar
```

---

## 5. FLUJOS DE TRABAJO

### 5.1 Relación Tareas-Recursos

#### Arquitectura de la Relación Many-to-Many

El sistema implementa una relación many-to-many entre tareas y recursos mediante la tabla `tarea_recursos`, permitiendo que una tarea utilice múltiples recursos y que un recurso sea asignado a múltiples tareas.

**Tabla Principal: `tarea_recursos`**
```sql
CREATE TABLE tarea_recursos (
    id SERIAL PRIMARY KEY,
    tarea_id INTEGER NOT NULL REFERENCES tareas(id) ON DELETE CASCADE,
    recurso_id INTEGER NOT NULL REFERENCES recursos(id) ON DELETE CASCADE,
    assigned_by INTEGER REFERENCES tecnicos(id),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    unassigned_by INTEGER REFERENCES tecnicos(id),
    unassigned_at TIMESTAMP WITH TIME ZONE,
    activo BOOLEAN DEFAULT true,
    estimated_hours DECIMAL(5,2),
    actual_hours DECIMAL(5,2),
    notes TEXT,
    UNIQUE (tarea_id, recurso_id, activo)
);
```

**Tabla de Historial: `tarea_recurso_historial`**
```sql
CREATE TABLE tarea_recurso_historial (
    id SERIAL PRIMARY KEY,
    tarea_recurso_id INTEGER NOT NULL REFERENCES tarea_recursos(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL,
    tecnico_id INTEGER REFERENCES tecnicos(id),
    old_values JSONB,
    new_values JSONB,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### APIs de Asignación Tarea-Recursos

**GET /api/tarea-recursos/tareas/:id/recursos**
- Retorna recursos asignados a una tarea específica
- Incluye metadatos como horas estimadas y notas

**POST /api/tarea-recursos/tareas/:id/recursos**
```javascript
{
  "recurso_id": 8,
  "estimated_hours": 8,
  "notes": "Recurso asignado para reconfiguración"
}
```

**DELETE /api/tarea-recursos/tareas/:id/recursos/:recursoId**
- Desasigna recurso de tarea
- Actualiza estado del recurso automáticamente

#### Validaciones de Negocio
- Un recurso no puede estar asignado a múltiples tareas activas simultáneamente
- Solo recursos con estado 'available' pueden ser asignados
- Solo técnicos pueden asignar/desasignar recursos
- Todas las operaciones quedan registradas en auditoría

### 5.2 Acceso Administrativo

#### Proceso de Autenticación de Administradores

**Jerarquía de Roles:**
- **admin**: Nivel 10 - Control total del sistema
- **supervisor**: Nivel 4 - Supervisión de operaciones
- **technician**: Nivel 5 - Operaciones técnicas
- **analyst**: Nivel 3 - Análisis de datos
- **operator**: Nivel 2 - Operaciones básicas
- **viewer**: Nivel 1 - Solo lectura

#### Flujo de Login Administrativo

1. **Verificación de Sesión Activa**: Chequeo automático de sesiones existentes
2. **Validación de Credenciales**: Email/DTIC ID + contraseña (bcrypt costo 12)
3. **Rate Limiting**: Máximo 5 intentos por 15 minutos por IP
4. **Creación de Sesión**: Session ID único + almacenamiento en BD
5. **Manejo de "Recordar Sesión"**: Tokens seguros con expiración de 30 días

#### Middleware de Autenticación
```javascript
const checkPermission = (requiredRole) => {
  return (req, res, next) => {
    const userRole = req.user?.role
    const roleHierarchy = {
      'viewer': 1, 'technician': 2, 'admin': 3, 'super_admin': 4
    }
    if (roleHierarchy[userRole] >= roleHierarchy[requiredRole]) {
      next()
    } else {
      res.status(403).json({ error: 'Permisos insuficientes' })
    }
  }
}
```

#### Seguridad Implementada
- **Protección XSS**: Sanitización de entradas
- **Protección CSRF**: Headers `X-Requested-With`
- **Encriptación**: Contraseñas bcrypt, sesiones seguras
- **Rate Limiting**: Por IP y acción
- **Auditoría**: Registro de todos los accesos y operaciones

### 5.3 Gestión de Aplicación

#### Script app_run.sh - Gestión Unificada de Contenedores

**Comandos Principales:**
- **`up`**: Levantar aplicación completa con restauración automática de backup
- **`start`**: Iniciar contenedores con restauración opcional
- **`stop`**: Crear backup y detener contenedores
- **`backup`**: Generar backup manual de base de datos
- **`restore <archivo>`**: Restaurar desde backup específico
- **`status`**: Mostrar estado del sistema

#### Funcionalidades del Script

**Restauración Automática:**
- Busca backup más reciente en `./backups/db_backup_*.sql.gz`
- Restaura automáticamente al ejecutar `up`
- Verificación de integridad de archivos

**Gestión de Backups:**
- Formato: `db_backup_YYYYMMDD_HHMMSS.sql.gz`
- Compresión gzip automática
- Verificación de integridad post-creación

**Monitoreo del Sistema:**
- Estado de conexión a base de datos
- Número de tablas y usuarios
- Lista de backups recientes
- Logs detallados por nivel (INFO, SUCCESS, WARNING, ERROR)

#### Configuración de Base de Datos
- **Host**: `db` (servicio Docker)
- **Base de datos**: `dtic_bitacoras_php`
- **Usuario**: `dtic_user`
- **Contraseña**: `dtic_password`

#### Manejo de Errores
- Verificación de conectividad Docker
- Validación de permisos de archivos
- Recuperación automática de estados fallidos
- Logs detallados para troubleshooting

### 5.4 Cambio de Contraseña

#### Proceso de Cambio de Contraseña Administrativo

**Requisitos Previos:**
- Acceso administrativo al sistema
- Email o DTIC ID del usuario
- Nueva contraseña cumpliendo políticas de seguridad

#### Pasos del Proceso

1. **Verificación de Usuario Existente**
```bash
docker exec dtic-bitacoras-php-db-1 mysql -u dtic_user -pdtic_password dtic_bitacoras_php \
  -e "SELECT id, dtic_id, first_name, last_name, email, role, department, is_active \
      FROM tecnicos WHERE email = 'usuario@ejemplo.com' AND is_active = 1;"
```

2. **Generación del Hash de Contraseña**
```bash
docker exec dtic-bitacoras-php-app-1 php -r \
  "echo password_hash('nueva_contraseña', PASSWORD_BCRYPT, ['cost' => 12]);"
```

3. **Actualización en Base de Datos**
```bash
docker exec dtic-bitacoras-php-db-1 mysql -u dtic_user -pdtic_password dtic_bitacoras_php \
  -e "UPDATE tecnicos SET password_hash = '\$2y\$12\$...' WHERE email = 'usuario@ejemplo.com';"
```

4. **Verificación del Cambio**
- Confirmar actualización exitosa
- Validar que el usuario puede autenticarse

#### Políticas de Contraseña
- **Longitud mínima**: 8 caracteres
- **Complejidad**: Mayúscula, minúscula, número y carácter especial
- **Hashing**: bcrypt con costo 12
- **Almacenamiento**: Nunca en texto plano

#### Auditoría de Cambios
Cada cambio de contraseña se registra en `audit_log`:
```sql
INSERT INTO audit_log (user_id, action, details, ip_address)
VALUES (?, 'password_change', ?, ?);
```

#### Comandos de Administración Útiles
- Ver todos los usuarios activos
- Desactivar/reactivar usuarios
- Ver historial de sesiones
- Gestión de roles y permisos

---

## 7. GUÍAS DE DESARROLLO Y TESTING

### 6.1 Workflow de Desarrollo

#### Fase 1: Tareas Completadas
- Documentar avances en `_tareasTerminadas/YYYYMMDD_HHMMSS_[descripcion].md`
- Incluir análisis por módulo (Frontend/Backend/Configuración)
- Detallar cambios técnicos implementados

#### Fase 2: Versionado
- Actualizar versión en package.json, Navbar.tsx y CHANGELOG.md
- Seguir Versionado Semántico (MAJOR.MINOR.PATCH)
- Actualizar referencias de versión en todo el código

#### Fase 3: Verificación
- Testing exhaustivo de funcionalidades
- Verificación de versiones actualizadas
- Validación de compatibilidad

#### Fase 4: Commit
- Commit con mensaje estructurado en español
- Referencia a archivos de documentación
- Mención explícita de cambios de versión

### 6.2 Testing del Sistema

#### Casos de Prueba Críticos

**TAR-3273 y REC-0007:**
1. Abrir modal de perfil de TAR-3273
2. Verificar sección "Recursos Asignados"
3. Confirmar que REC-0007 aparece listado
4. Verificar detalles del recurso
5. Probar asignación/desasignación

**Funcionalidad de Asignación:**
1. Verificar carga del dropdown de recursos
2. Probar asignación de recurso disponible
3. Confirmar prevención de duplicados
4. Verificar manejo de errores de API

#### Testing de APIs con curl

```bash
# Verificar asignación específica
curl http://localhost:3001/api/tarea-recursos/tareas/2/recursos

# Crear nueva asignación
curl -X POST http://localhost:3001/api/tarea-recursos/tareas/1/recursos \
  -H "Content-Type: application/json" \
  -d '{"recurso_id": 5, "estimated_hours": 4}'

# Desasignar recurso
curl -X DELETE http://localhost:3001/api/tarea-recursos/tareas/1/recursos/5
```

### 6.3 Debugging y Troubleshooting

#### Problemas Comunes

**Endpoints API no funcionan:**
- Verificar que el servidor esté ejecutándose en puerto 3001
- Comprobar configuración de CORS
- Revisar logs del backend

**Frontend no carga recursos:**
- Verificar conectividad con API
- Comprobar formato de respuesta JSON
- Revisar configuración en entities.yml

**Asignaciones no se reflejan:**
- Verificar triggers de base de datos
- Comprobar constraints de integridad
- Revisar logs de transacciones

#### Herramientas de Debugging

```bash
# Logs del backend
docker-compose logs backend

# Logs de PostgreSQL
docker-compose logs postgres

# Acceso a base de datos
docker-compose exec postgres psql -U dtic_user -d dtic_bitacoras

# Verificar contenedores
docker-compose ps
```

### 6.4 Optimizaciones de Performance

#### Frontend
- **Lazy Loading:** Componentes cargados bajo demanda
- **Memoization:** useCallback y useMemo para funciones costosas
- **Virtualización:** Para listas grandes de entidades

#### Backend
- **Connection Pooling:** PostgreSQL con pg-pool
- **Caching:** Para queries frecuentes
- **Compression:** Gzip para responses

#### Base de Datos
- **Índices Optimizados:** Para búsquedas comunes
- **Query Optimization:** EXPLAIN ANALYZE para queries complejas
- **Partitioning:** Para tablas con mucho historial

### 6.5 Mejores Prácticas

#### Código
- **TypeScript Estrict:** Tipos explícitos en todo el código
- **ESLint + Prettier:** Formateo y linting consistentes
- **Comentarios en Español:** Para mantenimiento local

#### Seguridad
- **Validación de Input:** En frontend y backend
- **Rate Limiting:** Protección contra abuso
- **Auditoría:** Registro de todas las operaciones críticas

#### Testing
- **Cobertura Completa:** Unit tests y integration tests
- **Datos de Prueba:** Consistentes y realistas
- **Edge Cases:** Manejo de errores y casos límite

---

## 8. HISTORIAL DE CAMBIOS

### v1.3.3 (2025-11-07)
- ✅ **Corrección Crítica:** Endpoint API `/api/tarea-recursos` corregido
- ✅ **Funcionalidad de Recursos:** Sistema completo de asignación implementado
- ✅ **TAR-3273/REC-0007:** Problema específico resuelto y verificado
- ✅ **Extensión Multi-Módulo:** Recursos asignables a técnicos y usuarios
- ✅ **Testing Exhaustivo:** Validación completa del sistema

### v1.3.2 (2025-11-07)
- ✅ **ResourceAssignmentControl:** Componente principal implementado
- ✅ **useResourceAssignment:** Hook personalizado creado
- ✅ **EntityForm Integration:** Soporte para campos resource_assignment
- ✅ **TareaProfileModal:** Control integrado en modal de tareas

### v1.3.1 (2025-11-07)
- ✅ **Backend API:** Endpoints de tarea-recursos implementados
- ✅ **Base de Datos:** Esquema tarea_recursos creado con triggers
- ✅ **Middleware Auth:** Sistema de autenticación JWT completado
- ✅ **Validaciones:** Express-validator implementado en todas las rutas

### v1.2.0 (2025-11-06)
- ✅ **EntityPage.tsx:** Sistema genérico de gestión de entidades
- ✅ **entities.yml:** Configuración YAML completa
- ✅ **Dashboard:** Panel con métricas y estadísticas
- ✅ **Docker Compose:** Configuración completa de contenedores

### v1.1.0 (2025-11-05)
- ✅ **Frontend Base:** React + TypeScript + Bootstrap 5
- ✅ **Backend Base:** Node.js + Express + PostgreSQL
- ✅ **Autenticación:** Sistema JWT básico implementado
- ✅ **Base de Datos:** Esquema inicial con datos de ejemplo

### v1.0.0 (2025-11-04)
- ✅ **Arquitectura:** Diseño del sistema completo definido
- ✅ **Stack Tecnológico:** Selección de tecnologías
- ✅ **Esquema BD:** Diseño inicial de tablas y relaciones
- ✅ **Proyecto Base:** Estructura de directorios creada

---

## 9. APÉNDICES

### A.1 Glosario de Términos

- **DTIC:** Departamento de Tecnología de la Información y Comunicación
- **JWT:** JSON Web Token - Sistema de autenticación
- **CRUD:** Create, Read, Update, Delete - Operaciones básicas
- **YAML:** Yet Another Markup Language - Formato de configuración
- **Pool de Conexiones:** Técnica para reutilizar conexiones de BD
- **Middleware:** Software intermedio que procesa requests
- **Trigger:** Procedimiento automático en base de datos
- **Índice:** Estructura para optimizar búsquedas en BD

### A.2 Referencias Técnicas

- **React:** https://reactjs.org/
- **TypeScript:** https://www.typescriptlang.org/
- **Node.js:** https://nodejs.org/
- **Express:** https://expressjs.com/
- **PostgreSQL:** https://www.postgresql.org/
- **Docker:** https://www.docker.com/
- **Bootstrap:** https://getbootstrap.com/

### A.3 Contacto y Soporte

**Desarrollador Principal:**
Lic. Ricardo MONLA
Departamento de Servidores
Dirección de TIC - UTN La Rioja

**Repositorio:**
https://github.com/rmonla/dtic-bitacoras-php

**Documentación Técnica:**
- `_docs/DOCUMENTACION_SISTEMA_DTIC_BITACORAS.md`
- `_docs/RESOURCE_ASSIGNMENT_DOCUMENTATION.md`
- `_docs/TESTING_GUIDE_RESOURCE_ASSIGNMENT_FIXED.md`

---

**Documento generado automáticamente por DTIC-DOCS-SYS-001**
**Última actualización:** 2025-11-12
**Versión del Sistema:** 1.4.2
**Estado:** FINAL - Documentación Completa con Flujos de Trabajo