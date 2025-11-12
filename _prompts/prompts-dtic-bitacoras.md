# Catálogo de Plantillas DTIC Bitácoras
*Sistema de interpretación automática para selección de plantillas*

---

## Índice de Plantillas

```yaml
# CONFIGURACIÓN AUTOMÁTICA DE PLANTILLAS
plantillas:
  base_universal:
    id: "DTIC-BASE-001"
    nombre: "Plantilla Base Universal"
    categoria: "general"
    prioridad: 1
    palabras_clave: ["general", "universal", "base", "cualquier"]
    patrones_matching: ["cualquier tarea", "general", "sin especificar"]
    uso_recomendado: "Cuando no se especifica un tipo de tarea específico"
    descripcion: "Plantilla base para cualquier tipo de desarrollo en DTIC Bitácoras"

  documentacion_workflow:
    id: "DTIC-DOC-001"
    nombre: "Documentación y Workflow de Desarrollo"
    categoria: "documentacion"
    subcategoria: "workflow"
    prioridad: 1
    palabras_clave: ["documentar", "bitacora", "tareas completadas", "versionado", "commit", "verificacion", "changelog"]
    patrones_matching:
      - "documentar avance"
      - "tareas completadas"
      - "versionado"
      - "commit"
      - "changelog"
      - "verificacion"
      - "bitacora de desarrollo"
      - "documentar progreso"
      - "fase de documentacion"
    uso_recomendado: "Documentación de progreso de desarrollo y workflow de versionado"
    descripcion: "Plantilla para documentación de avances y workflow de desarrollo de 4 fases"

  desarrollo_frontend:
    id: "DTIC-FE-001"
    nombre: "Desarrollo Frontend (React + TypeScript)"
    categoria: "desarrollo"
    subcategoria: "frontend"
    prioridad: 2
    palabras_clave: ["react", "typescript", "frontend", "componente", "ui", "interfaz", "hooks", "useState", "useEffect"]
    patrones_matching: 
      - "desarrollo frontend"
      - "implementar componente"
      - "crear interfaz"
      - "react con typescript"
      - "hooks react"
      - "modificar componente"
      - "añadir funcionalidad al frontend"
    uso_recomendado: "Desarrollo de interfaces de usuario y componentes React"
    descripcion: "Plantilla especializada para desarrollo frontend con React y TypeScript"

  desarrollo_backend:
    id: "DTIC-BE-001"
    nombre: "Desarrollo Backend (Node.js + Express)"
    categoria: "desarrollo"
    subcategoria: "backend"
    prioridad: 2
    palabras_clave: ["node.js", "express", "backend", "api", "endpoint", "server", "middleware"]
    patrones_matching:
      - "desarrollo backend"
      - "crear api"
      - "endpoint express"
      - "server node"
      - "middleware"
      - "rutas rest"
      - "desarrollar servidor"
    uso_recomendado: "Desarrollo de APIs y servicios backend"
    descripcion: "Plantilla especializada para desarrollo backend con Node.js y Express"

  autenticacion:
    id: "DTIC-AUTH-001"
    nombre: "Autenticación y Autorización"
    categoria: "seguridad"
    subcategoria: "autenticacion"
    prioridad: 1
    palabras_clave: ["jwt", "autenticacion", "autorizacion", "token", "login", "logout", "seguridad", "permisos", "bcrypt"]
    patrones_matching:
      - "autenticación"
      - "jwt"
      - "login"
      - "seguridad"
      - "autorización"
      - "tokens"
      - "permisos"
      - "middleware auth"
    uso_recomendado: "Implementación de sistemas de autenticación y seguridad"
    descripcion: "Plantilla para funcionalidades de autenticación JWT y control de acceso"

  base_datos:
    id: "DTIC-DB-001"
    nombre: "Gestión de Base de Datos (PostgreSQL)"
    categoria: "datos"
    subcategoria: "base_datos"
    prioridad: 2
    palabras_clave: ["postgresql", "sql", "base de datos", "query", "tabla", "migración", "índices", "transacciones"]
    patrones_matching:
      - "base de datos"
      - "postgresql"
      - "query sql"
      - "tabla"
      - "migración"
      - "optimizar base de datos"
      - "índices"
    uso_recomendado: "Operaciones de base de datos y optimización SQL"
    descripcion: "Plantilla para gestión y optimización de PostgreSQL"

  debugging:
    id: "DTIC-DEBUG-001"
    nombre: "Debugging y Solución de Problemas"
    categoria: "debugging"
    subcategoria: "error_solving"
    prioridad: 1
    palabras_clave: ["debug", "error", "problema", "bug", "fallo", "troubleshoot", "solucionar", "diagnóstico"]
    patrones_matching:
      - "debug"
      - "error"
      - "problema"
      - "bug"
      - "no funciona"
      - "solución"
      - "diagnóstico"
      - "troubleshoot"
    uso_recomendado: "Resolución de errores y problemas del sistema"
    descripcion: "Plantilla para debugging y solución de problemas técnicos"

  optimizacion:
    id: "DTIC-OPT-001"
    nombre: "Optimización y Mejora de Rendimiento"
    categoria: "optimizacion"
    subcategoria: "performance"
    prioridad: 2
    palabras_clave: ["optimizar", "rendimiento", "performance", "velocidad", "eficiencia", "memoria", "cache"]
    patrones_matching:
      - "optimizar"
      - "rendimiento"
      - "performance"
      - "lento"
      - "velocidad"
      - "eficiencia"
      - "memoria"
      - "cache"
    uso_recomendado: "Mejora del rendimiento y optimización del sistema"
    descripcion: "Plantilla para optimización y mejora de performance"

  configuracion:
    id: "DTIC-CONF-001"
    nombre: "Configuración del Sistema"
    categoria: "configuracion"
    subcategoria: "deployment"
    prioridad: 2
    palabras_clave: ["docker", "configuración", "yaml", "env", "variables", "deployment", "setup", "instalación", "desplegar", "respaldo", "backup", "app-run.sh"]
    patrones_matching:
      - "docker"
      - "configuración"
      - "yaml"
      - "variables de entorno"
      - "deployment"
      - "setup"
      - "instalación"
    uso_recomendado: "Configuración y deployment del sistema"
    descripcion: "Plantilla para configuración de Docker, YAML y variables de entorno"

  crud_entidades:
    id: "DTIC-CRUD-001"
    nombre: "Entidades CRUD y Stores Genéricos"
    categoria: "desarrollo"
    subcategoria: "crud"
    prioridad: 2
    palabras_clave: ["crud", "entidades", "create", "read", "update", "delete", "stores", "generic", "useEntityManagement"]
    patrones_matching:
      - "crud"
      - "entidades"
      - "crear"
      - "leer"
      - "actualizar"
      - "eliminar"
      - "stores genéricos"
      - "useEntityManagement"
    uso_recomendado: "Implementación de operaciones CRUD para entidades"
    descripcion: "Plantilla para desarrollo de funcionalidades CRUD con stores genéricos"

  dashboard:
    id: "DTIC-DASH-001"
    nombre: "Dashboard y Reportes"
    categoria: "reportes"
    subcategoria: "dashboard"
    prioridad: 2
    palabras_clave: ["dashboard", "reportes", "estadísticas", "gráficos", "métricas", "visualización", "charts"]
    patrones_matching:
      - "dashboard"
      - "reportes"
      - "estadísticas"
      - "gráficos"
      - "métricas"
      - "visualización"
      - "charts"
    uso_recomendado: "Desarrollo de dashboards y sistemas de reportes"
    descripcion: "Plantilla para creación de dashboards y reportes estadísticos"

  mantenimiento_sistema:
    id: "DTIC-MAINT-001"
    nombre: "Mantenimiento y Limpieza del Sistema"
    categoria: "mantenimiento"
    subcategoria: "cleanup"
    prioridad: 2
    palabras_clave: ["mantenimiento", "limpieza", "archivos", "basurero", "organizar", "cleanup", "mover", "archivar", "sistema", "dtic", "bitacoras"]
    patrones_matching:
      - "mover a basurero"
      - "limpiar archivos"
      - "organizar documentacion"
      - "archivar archivos innecesarios"
      - "mantenimiento sistema"
    uso_recomendado: "Realizar mantenimiento y limpieza de archivos innecesarios en el sistema DTIC Bitácoras"
    descripcion: "Plantilla para tareas de mantenimiento, limpieza y organización de archivos del sistema"

  documentacion_sistema:
    id: "DTIC-DOCS-SYS-001"
    nombre: "Documentación del Sistema DTIC Bitácoras"
    categoria: "documentacion"
    subcategoria: "sistema"
    prioridad: 1
    palabras_clave: ["documentar", "sistema", "documentacion", "arquitectura", "componentes", "modulos", "api", "base de datos", "frontend", "backend", "dtic", "bitacoras"]
    patrones_matching:
      - "documentar sistema"
      - "documentacion completa"
      - "arquitectura del sistema"
      - "componentes del sistema"
      - "documentar dtic bitacoras"
    uso_recomendado: "Crear documentación completa del sistema DTIC Bitácoras utilizando información existente en _docs"
    descripcion: "Plantilla para documentar la arquitectura, componentes y funcionalidades del sistema DTIC Bitácoras"

  documentacion_actualizacion:
   id: "DTIC-DOCS-UPD-001"
   nombre: "Actualización de Documentación"
   categoria: "documentacion"
   subcategoria: "actualizacion"
   prioridad: 2
   palabras_clave: ["actualizar", "documentacion", "flujos", "workflows", "integrar", "incorporar", "mejorar", "sistema", "dtic", "bitacoras"]
   patrones_matching:
     - "actualizar documentacion"
     - "incorporar flujos"
     - "mejorar docs"
     - "integrar workflows"
     - "actualizar sistema docs"
   uso_recomendado: "Actualizar la documentación del sistema con nueva información de flujos de trabajo"
   descripcion: "Plantilla para actualizar y mejorar la documentación del sistema DTIC Bitácoras"

  documentacion_entidades:
   id: "DTIC-DOCS-ENT-001"
   nombre: "Documentación de Entidades del Sistema"
   categoria: "documentacion"
   subcategoria: "entidades"
   prioridad: 2
   palabras_clave: ["entidades", "configuracion", "yaml", "campos", "relaciones", "funcionalidades", "estados", "sistema", "dtic", "bitacoras"]
   patrones_matching:
     - "documentar entidades"
     - "configuracion entidades"
     - "entidades yaml"
     - "documentar configuracion entidades"
   uso_recomendado: "Documentar las entidades del sistema DTIC Bitácoras desde configuración YAML"
   descripcion: "Plantilla para documentar entidades y configuraciones del sistema"

# CLASIFICACIÓN AUTOMÁTICA
clasificacion:
  categorias:
   desarrollo: ["frontend", "backend", "crud"]
   seguridad: ["autenticacion"]
   datos: ["base_datos"]
   reportes: ["dashboard"]
   configuracion: ["deployment"]
   optimizacion: ["performance"]
   debugging: ["error_solving"]
   documentacion: ["workflow", "sistema", "actualizacion", "entidades"]
   general: ["general"]

    mantenimiento: ["cleanup"]

  priority_rules:
    - categoria: "debugging"
      prioridad_alta: true
    - categoria: "seguridad"
      prioridad_alta: true
    - categoria: "general"
      priority_base: true

  match_algorithm:
    exact_match: true
    fuzzy_match: true
    weight_by_priority: true
    consider_subcategoria: true
```

---

## Clasificación Automática de Prompts

### Algoritmo de Selección de Plantillas

```javascript
// Pseudo-código del algoritmo de clasificación automática
function seleccionarPlantilla(promptUsuario) {
    const promptLower = promptUsuario.toLowerCase();
    let mejorPlantilla = plantillas.base_universal;
    let mejorScore = 0;

    // Clasificación por palabras clave
    for (const plantilla of Object.values(plantillas)) {
        let score = 0;
        
        // Puntuación por palabras clave exactas
        for (const keyword of plantilla.palabras_clave) {
            if (promptLower.includes(keyword.toLowerCase())) {
                score += 2;
            }
        }

        // Puntuación por patrones de matching
        for (const pattern of plantilla.patrones_matching) {
            if (promptLower.includes(pattern.toLowerCase())) {
                score += 3;
            }
        }

        // Bonus por prioridad
        score += (10 - plantilla.prioridad) * 0.1;

        // Bonus por match de categoría
        if (promptLower.includes(plantilla.categoria)) {
            score += 1;
        }

        if (score > mejorScore) {
            mejorScore = score;
            mejorPlantilla = plantilla;
        }
    }

    return mejorPlantilla;
}

documentacion:
  - "documentar", "bitacora", "tareas completadas", "versionado"
  - "commit", "verificacion", "changelog", "progreso"

### Estructura de Respuesta Automática

```markdown
**PLANTILLA SELECCIONADA:** [ID de plantilla]
**CATEGORÍA:** [categoría/subcategoría]
**CONFIANZA:** [porcentaje de match]
**JUSTIFICACIÓN:** [razones de la selección]

[Siguiente: Plantilla completa...]
```

// Ejemplos de clasificación automática
const ejemplosClasificacion = {
    "Quiero crear un componente React para mostrar datos": "DTIC-FE-001",
    "El sistema no me deja hacer login": "DTIC-AUTH-001",
    "La aplicación va muy lenta": "DTIC-OPT-001",
    "Error 500 en el servidor": "DTIC-DEBUG-001",
    "Necesito crear una nueva API": "DTIC-BE-001",
    "Configurar Docker para el proyecto": "DTIC-CONF-001",
    "Crear un dashboard con estadísticas": "DTIC-DASH-001",
    "Optimizar queries de base de datos": "DTIC-DB-001",
    "Implementar CRUD para nuevas entidades": "DTIC-CRUD-001",
    "Documentar el progreso de desarrollo": "DTIC-DOC-001",
    "Crear changelog y actualizar versión": "DTIC-DOC-001",
    "Generar bitácora de tareas completadas": "DTIC-DOC-001",
    "Documentar el sistema DTIC Bitácoras": "DTIC-DOCS-SYS-001",
    "Actualizar documentación con flujos de _flujos": "DTIC-DOCS-UPD-001",
    "Documentar entidades desde _entidades": "DTIC-DOCS-ENT-001",

    "Mover archivos innecesarios a basurero": "DTIC-MAINT-001"
};
```

---

## Plantillas Técnicas Completas

### 1. Plantilla Base Universal

**ID:** `DTIC-BASE-001` | **Categoría:** `general` | **Prioridad:** `1`

```markdown
**IDIOMA: ESPAÑOL**
**CONTEXTO: Desarrollo DTIC Bitácoras (React + Node.js + PostgreSQL + Docker)**
**TAREA: [Descripción específica de la tarea]**
**SISTEMA: Módulos - Autenticación JWT, CRUD Entidades (Técnicos, Recursos, Usuarios, Tareas), Dashboard**

Instrucciones detalladas en español...

## Consideraciones Generales
- Stack: React + TypeScript + Node.js + Express + PostgreSQL + Docker
- Autenticación JWT con refresh tokens (8 horas expiración)
- Sistema de permisos: viewer → technician → admin
- Entidades principales: Técnicos, Recursos, Usuarios, Tareas, Usuarios_Asignados
- Configuración YAML en src/config/entities.yml
- Stores genéricos con useEntityManagement
- Auditoría automática de operaciones críticas
- Comentarios en español obligatorios
- Manejo de errores contextual
- Interfaz responsive y accesible
```

### 2. Desarrollo Frontend (React + TypeScript)

**ID:** `DTIC-FE-001` | **Categoría:** `desarrollo/frontend` | **Prioridad:** `2`

```markdown
**IDIOMA: ESPAÑOL**
**CONTEXTO: Desarrollo DTIC Bitácoras Frontend (React + TypeScript + Hooks)**
**TAREA: Implementar nueva funcionalidad frontend**
**MÓDULOS: Dashboard, CRUD Entidades, Autenticación**
**PLANTILLA_ID: DTIC-FE-001**

## Especificaciones Frontend
Desarrolla el código para [descripción de la funcionalidad].

### Componentes Requeridos
- Componente React con TypeScript estricto
- Manejo de estado con hooks (useState, useEffect, useCallback, useMemo)
- Integración con stores genéricos (useEntityManagement, genericEntityStore)
- Validación de datos de entrada con TypeScript
- Manejo de errores y estados de carga contextuales
- Paginación y filtros cuando sea necesario
- Interfaz responsive y accesible (WCAG 2.1)

### Integración con Sistema DTIC
- Configuración YAML: src/config/entities.yml
- Stores: genericEntityStore, authStore
- Hooks: useEntityManagement
- Componentes base: EntityForm, EntityLayout, ProfileModal
- Entidades del sistema: Técnicos, Recursos, Usuarios, Tareas, Usuarios_Asignados

### Estándares de Calidad
- TypeScript con strict mode
- ESLint y Prettier configurados
- Comentarios en español
- Tests unitarios con Jest + React Testing Library
- Documentación de componentes
- Manejo de edge cases
- Performance optimizations (memo, lazy loading)

### Ejemplo de Implementación
```typescript
// Ejemplo de componente genérico
import React from 'react';
import { useEntityManagement } from '../hooks/useEntityManagement';
import { EntityForm } from '../components/common/EntityForm';

interface Props {
  entityType: string;
  configPath: string;
}

export const GenericEntityComponent: React.FC<Props> = ({ 
  entityType, 
  configPath 
}) => {
  const { 
    data, 
    loading, 
    error, 
    handleCreate, 
    handleUpdate, 
    handleDelete 
  } = useEntityManagement(entityType);

  return (
    <EntityForm
      data={data}
      loading={loading}
      error={error}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
      configPath={configPath}
    />
  );
};
```

Proporciona el código completo con ejemplos de uso y configuración.
```

### 3. Desarrollo Backend (Node.js + Express)

**ID:** `DTIC-BE-001` | **Categoría:** `desarrollo/backend` | **Prioridad:** `2`

```markdown
**IDIOMA: ESPAÑOL**
**CONTEXTO: Desarrollo DTIC Bitácoras Backend (Node.js + Express + PostgreSQL)**
**TAREA: Implementar nueva API endpoint**
**MÓDULOS: Autenticación JWT, Rutas CRUD, Middleware de permisos**
**PLANTILLA_ID: DTIC-BE-001**

## Especificaciones Backend
Desarrolla el código backend para [descripción de la funcionalidad].

### Componentes Requeridos
- Endpoint Express con rutas RESTful
- Validación con express-validator
- Integración con base de datos PostgreSQL
- Middleware de autenticación JWT
- Manejo de errores contextual con logging
- Transacciones SQL cuando sea necesario
- Comentarios en español obligatorios
- Auditoría automática de operaciones críticas

### Integración con Sistema DTIC
- Autenticación: JWT + refresh tokens (8 horas)
- Permisos: viewer → technician → admin
- Middleware: auth.js, permisos.js
- Rutas existentes: auth.js, recursos.js, tareas.js, tecnicos.js, usuarios_asignados.js
- Base de datos: PostgreSQL con connection pooling
- Configuración: .env, docker-compose.yml

### Entidades Principales
- **Técnicos:** Personal técnico con permisos
- **Recursos:** Elementos asignados a técnicos  
- **Usuarios:** Usuarios del sistema con roles
- **Tareas:** Actividades asignadas y seguimiento
- **Usuarios_Asignados:** Relación entre usuarios y tareas

### Seguridad y Auditoría
- Rate limiting en rutas sensibles
- Validación de entrada robusta
- Sanitización de datos
- Logs de auditoría automáticos
- Manejo seguro de contraseñas (bcrypt, saltRounds=12)
- Validación de usuarios activos

### Ejemplo de Implementación
```javascript
// Ejemplo de endpoint con middleware
const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const audit = require('../middleware/audit');

const router = express.Router();

// POST /api/recursos
router.post('/recursos', 
  auth.verifyToken,
  auth.checkPermission('technician'),
  [
    body('nombre').isLength({ min: 1 }).trim().escape(),
    body('descripcion').optional().trim().escape(),
    body('tecnico_id').isInt()
  ],
  audit.logOperation('CREATE_RECURSO'),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { nombre, descripcion, tecnico_id } = req.body;
      const query = `
        INSERT INTO recursos (nombre, descripcion, tecnico_id, created_at) 
        VALUES ($1, $2, $3, NOW()) 
        RETURNING *
      `;
      
      const result = await pool.query(query, [nombre, descripcion, tecnico_id]);
      res.status(201).json(result.rows[0]);
      
    } catch (error) {
      console.error('Error creating recurso:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);

module.exports = router;
```

Proporciona el código completo con ejemplos de uso y documentación de API.
```

### 4. Autenticación y Autorización (JWT + Middleware)

**ID:** `DTIC-AUTH-001` | **Categoría:** `seguridad/autenticacion` | **Prioridad:** `1`

```markdown
**IDIOMA: ESPAÑOL**
**CONTEXTO: Desarrollo DTIC Bitácoras (Autenticación JWT + Middleware)**
**TAREA: Implementar funcionalidad de seguridad**
**MÓDULOS: Autenticación, Middleware de permisos, Auditoría**
**PLANTILLA_ID: DTIC-AUTH-001**

## Especificaciones de Seguridad
Implementa la funcionalidad de seguridad [descripción específica].

### Componentes de Autenticación
- Manejo de tokens JWT (8 horas de expiración)
- Refresh tokens para renovación de sesión
- Middleware de verificación de permisos
- Hashing de contraseñas con bcrypt (saltRounds=12)
- Validación de usuarios activos
- Auditoría automática de operaciones críticas
- Manejo seguro de logout
- Rate limiting en rutas sensibles

### Sistema de Permisos DTIC
- **viewer:** Solo lectura de datos
- **technician:** Lectura + escritura limitada
- **admin:** Control total del sistema
- **super_admin:** Acceso completo + configuración

### Componentes Existentes
- `routes/auth.js` - Endpoints de autenticación
- `middleware/auth.js` - Middleware de verificación
- `stores/authStore.ts` - Store de autenticación React
- `components/auth/PrivateRoute.tsx` - Protección de rutas

### Configuración de Seguridad
```javascript
// Configuración JWT
const jwtConfig = {
  accessTokenExpiry: '8h',
  refreshTokenExpiry: '7d',
  issuer: 'dtic-bitacoras',
  algorithm: 'HS256',
  saltRounds: 12
};

// Middleware de permisos
const checkPermission = (requiredRole) => {
  return (req, res, next) => {
    const userRole = req.user?.role;
    const roleHierarchy = {
      'viewer': 1,
      'technician': 2, 
      'admin': 3,
      'super_admin': 4
    };
    
    if (roleHierarchy[userRole] >= roleHierarchy[requiredRole]) {
      next();
    } else {
      res.status(403).json({ error: 'Permisos insuficientes' });
    }
  };
};
```

### Auditoría y Logging
- Registro automático de operaciones críticas
- Log de intentos de acceso fallidos
- Tracking de cambios en datos sensibles
- Alertas de seguridad configurables

Proporciona código completo con manejo de edge cases y casos de uso reales.
```

### 5. Gestión de Base de Datos (PostgreSQL)

**ID:** `DTIC-DB-001` | **Categoría:** `datos/base_datos` | **Prioridad:** `2`

```markdown
**IDIOMA: ESPAÑOL**
**CONTEXTO: Desarrollo DTIC Bitácoras (PostgreSQL + Queries optimizadas)**
**TAREA: Optimizar operación de base de datos**
**MÓDULOS: CRUD Entidades, Reportes, Estadísticas**
**PLANTILLA_ID: DTIC-DB-001`

## Especificaciones de Base de Datos
Desarrolla la funcionalidad de base de datos [descripción específica].

### Optimización PostgreSQL
- Queries SQL optimizadas para PostgreSQL 13+
- Paginación eficiente para listas grandes (LIMIT/OFFSET)
- Transacciones para operaciones críticas (BEGIN/COMMIT/ROLLBACK)
- Índices para mejorar performance
- Manejo de relaciones entre entidades
- Backup y restauración de datos
- Pool de conexiones con pg-pool

### Entidades Principales
- **tecnicos:** Personal técnico con permisos
- **recursos:** Elementos asignados a técnicos
- **usuarios:** Usuarios del sistema con roles  
- **tareas:** Actividades asignadas y seguimiento
- **usuarios_asignados:** Relación entre usuarios y tareas

### Estrategias de Performance
```sql
-- Ejemplo de query optimizada con índices
EXPLAIN ANALYZE 
SELECT t.id, t.nombre, t.email, 
       COUNT(r.id) as recursos_count
FROM tecnicos t
LEFT JOIN recursos r ON t.id = r.tecnico_id
WHERE t.activo = true
GROUP BY t.id, t.nombre, t.email
ORDER BY t.nombre
LIMIT 20 OFFSET 0;

-- Índice compuesto para optimizar la query
CREATE INDEX idx_tecnicos_activo_nombre 
ON tecnicos (activo, nombre) 
WHERE activo = true;
```

### Configuración de Conexiones
```javascript
// Pool de conexiones PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'dtic_bitacoras',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

### Integridad y Consistencia
- Constraints de integridad referencial
- Validaciones a nivel de base de datos
- Triggers para auditoría automática
- Backup automático diario
- Monitor de conexiones concurrentes

Proporciona ejemplos de queries optimizadas y consideraciones de escalabilidad.
```

### 6. Debugging y Solución de Problemas

**ID:** `DTIC-DEBUG-001` | **Categoría:** `debugging/error_solving` | **Prioridad:** `1`

```markdown
**IDIOMA: ESPAÑOL**
**CONTEXTO: Debugging DTIC Bitácoras (Stack completo)**
**TAREA: Resolver error específico en [módulo específico]**
**PLANTILLA_ID: DTIC-DEBUG-001`

## Análisis de Errores
Estoy experimentando el siguiente error:
```
[paste del error aquí]
```

### Contexto del Error
- **Módulo afectado:** [autenticación|frontend|backend|database]
- **Archivo donde ocurre:** [ruta del archivo]
- **Acción que lo provoca:** [descripción]
- **Comportamiento esperado:** [descripción]
- **Estado de autenticación:** [usuario/anonimo]
- **Base de datos:** PostgreSQL
- **Entidades relacionadas:** [Técnicos|Recursos|Usuarios|Tareas]
- **Navegador/Dispositivo:** [Chrome|Firefox|Safari|Mobile]
- **Variables de entorno:** [desarrollo|producción]

### Metodología de Debugging
Explica en español:

1. **Causa raíz del error**
   - Análisis del stack trace
   - Identificación de la línea problemática
   - Comprensión del flujo de ejecución

2. **Solución paso a paso**
   - Modificaciones necesarias
   - Orden de implementación
   - Testing de la solución

3. **Código corregido con comentarios**
   - Código completo funcional
   - Explicación de cada cambio
   - Edge cases considerados

4. **Prevención de errores similares**
   - Mejores prácticas a implementar
   - Validaciones adicionales
   - Testing automatizado

5. **Consideraciones de testing**
   - Casos de prueba necesarios
   - Herramientas de debugging
   - Logs y monitoring

### Herramientas de Debugging
```bash
# Debugging del frontend
npm run dev -- --debug
# React Developer Tools
# Browser DevTools

# Debugging del backend
node --inspect server.js
# Chrome DevTools
# VSCode debugger

# Debugging de base de datos
psql -h localhost -U postgres -d dtic_bitacoras
\d+ table_name
EXPLAIN ANALYZE query;
```

### Logging y Monitoring
- Configuración de logs estruturados
- Niveles de logging (debug, info, warn, error)
- Integración con herramientas de monitoring
- Alertas automáticas para errores críticos

Proporciona solución completa con código funcional y metodología de prevención.
```

### 7. Optimización y Mejora de Rendimiento

**ID:** `DTIC-OPT-001` | **Categoría:** `optimizacion/performance` | **Prioridad:** `2`

```markdown
**IDIOMA: ESPAÑOL**
**CONTEXTO: Optimización DTIC Bitácoras (Stack completo)**
**TAREA: Optimizar rendimiento del sistema**
**MÓDULOS: [Dashboard|CRUD|Autenticación|Reportes]**
**PLANTILLA_ID: DTIC-OPT-001`

## Análisis de Performance
Analiza el código actual y sugiere optimizaciones para:
- [lista de problemas específicos]

### Estrategias de Optimización

#### Frontend (React + TypeScript)
- **Lazy loading de componentes** con React.lazy()
- **Memoización** con useMemo y useCallback
- **Optimización de re-renders** con React.memo
- **Virtualización** de listas grandes
- **Code splitting** por rutas
- **Bundle analysis** y tree shaking
- **Compresión de assets** con gzip/brotli

```typescript
// Ejemplo de optimización con React
import React, { memo, useMemo, useCallback } from 'react';

const OptimizedComponent = memo(({ data, onUpdate }) => {
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      computed: expensiveCalculation(item)
    }));
  }, [data]);

  const handleUpdate = useCallback((id, updates) => {
    onUpdate(id, updates);
  }, [onUpdate]);

  return (
    <div>
      {processedData.map(item => (
        <ItemComponent 
          key={item.id} 
          data={item} 
          onUpdate={handleUpdate}
        />
      ))}
    </div>
  );
});
```

#### Backend (Node.js + Express)
- **Connection pooling** para PostgreSQL
- **Caching** con Redis o in-memory
- **Compresión** de responses
- **Rate limiting** inteligente
- **Async/await** en lugar de callbacks
- **Stream processing** para archivos grandes

```javascript
// Ejemplo de optimización backend
const express = require('express');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const NodeCache = require('node-cache');

const app = express();
const cache = new NodeCache({ stdTTL: 600 }); // 10 minutos

// Middleware de optimización
app.use(compression());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // límite de requests
}));

// Caching inteligente
const getCachedData = (key, queryFunction) => {
  const cached = cache.get(key);
  if (cached) {
    return Promise.resolve(cached);
  }
  
  return queryFunction().then(result => {
    cache.set(key, result);
    return result;
  });
};
```

#### Base de Datos (PostgreSQL)
- **Índices optimizados** para queries frecuentes
- **Query optimization** con EXPLAIN ANALYZE
- **Connection pooling** y keep-alive
- **Partitioning** para tablas grandes
- **Materialized views** para reportes complejos

```sql
-- Ejemplo de optimización de índices
CREATE INDEX CONCURRENTLY idx_tareas_fecha_estado 
ON tareas (fecha_creacion, estado) 
WHERE estado IN ('pendiente', 'en_progreso');

-- Query optimizada con índices
EXPLAIN ANALYZE
SELECT t.*, u.nombre as usuario_nombre
FROM tareas t
JOIN usuarios u ON t.usuario_id = u.id
WHERE t.fecha_creacion >= '2024-01-01'
  AND t.estado IN ('pendiente', 'en_progreso')
ORDER BY t.fecha_creacion DESC
LIMIT 50;
```

### Métricas de Mejora Esperadas
- **Tiempo de carga inicial:** -40% (de 3.2s a 1.9s)
- **Memory usage:** -25% (de 120MB a 90MB)
- **API response time:** -60% (de 800ms a 320ms)
- **Database query time:** -70% (de 200ms a 60ms)
- **Bundle size:** -30% (de 1.2MB a 840KB)

### Monitoring de Performance
- **Lighthouse scores** (Performance, Accessibility, SEO)
- **Web Vitals** (FCP, LCP, FID, CLS)
- **Database query performance** (slow query log)
- **Memory profiling** (Node.js heap snapshots)
- **Real User Monitoring** (RUM)

Considera el sistema de permisos y entidades principales.
Proporciona código optimizado con métricas de mejora esperadas.
```

### 8. Configuración del Sistema (Docker + YAML)

**ID:** `DTIC-CONF-001` | **Categoría:** `configuracion/deployment` | **Prioridad:** `2`

```markdown
**IDIOMA: ESPAÑOL**
**CONTEXTO: Configuración DTIC Bitácoras (Docker + YAML + Variables de entorno)**
**TAREA: Configurar [componente específico]**
**PLANTILLA_ID: DTIC-CONF-001`

## Configuración del Sistema
Configuración actual:
- **Puerto:** 3000 para frontend, 3001 para backend
- **Imagen:** dtic-bitacoras:latest
- **Base de datos:** PostgreSQL 13+
- **Variables de entorno:** .env
- **Configuración YAML:** src/config/entities.yml

### Estructura de Configuración
```
dtic-bitacoras/
├── docker-compose.yml
├── .env
├── backend/
│   ├── .env
│   ├── Dockerfile
│   └── package.json
└── frontend/
    ├── .env
    ├── Dockerfile
    ├── package.json
    └── src/config/entities.yml
```

### Docker Compose Configuration
```yaml
version: '3.8'
services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://localhost:3001
      - REACT_APP_ENVIRONMENT=development
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
      - NODE_ENV=development
      - DB_HOST=postgres
      - DB_PORT=5432
      - DB_NAME=dtic_bitacoras
      - DB_USER=postgres
      - DB_PASSWORD=password
      - JWT_SECRET=your-jwt-secret
      - REFRESH_TOKEN_SECRET=your-refresh-secret
    volumes:
      - ./backend/src:/app/src
      - ./backend/logs:/app/logs
    depends_on:
      - postgres

  postgres:
    image: postgres:13
    environment:
      - POSTGRES_DB=dtic_bitacoras
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./docker/init.sql:/docker-entrypoint-initdb.d/init.sql

volumes:
  postgres_data:
```

### Variables de Entorno
```bash
# .env (raíz del proyecto)
# Frontend
REACT_APP_API_URL=http://localhost:3001
REACT_APP_ENVIRONMENT=development
REACT_APP_VERSION=1.0.0

# Backend
NODE_ENV=development
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=dtic_bitacoras
DB_USER=postgres
DB_PASSWORD=password
JWT_SECRET=your-super-secret-jwt-key
REFRESH_TOKEN_SECRET=your-refresh-token-secret
ACCESS_TOKEN_EXPIRY=8h
REFRESH_TOKEN_EXPIRY=7d

# Database
POSTGRES_DB=dtic_bitacoras
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
```

### Configuración YAML de Entidades
```yaml
# src/config/entities.yml
entities:
  tecnicos:
    displayName: "Técnicos"
    pluralName: "Técnicos"
    fields:
      - name: "id"
        type: "number"
        primary: true
        autoIncrement: true
      - name: "nombre"
        type: "string"
        required: true
        maxLength: 100
      - name: "email"
        type: "string"
        required: true
        unique: true
        validation: "email"
      - name: "rol"
        type: "string"
        required: true
        enum: ["viewer", "technician", "admin"]
      - name: "activo"
        type: "boolean"
        default: true
    permissions:
      viewer: ["read"]
      technician: ["read", "create", "update"]
      admin: ["read", "create", "update", "delete"]
```

### Deployment y Validación
Explica en español cómo:

1. **Configurar el componente específico**
   - Modificación de archivos de configuración
   - Ajustes de variables de entorno
   - Configuración de servicios

2. **Integrar con Docker Compose**
   - Build de imágenes
   - Orquestación de servicios
   - Networks y volumes

3. **Gestionar variables de entorno**
   - Configuración por entorno
   - Secrets management
   - Rotación de tokens

4. **Configurar permisos y acceso**
   - User permissions
   - File system permissions
   - Database access control

5. **Validar la configuración**
    - Health checks
    - Integration tests
    - Performance tests

6. **Desplegar el sistema y restaurar respaldo** Para desplegar el sistema y restaurar el último respaldo, debes usar el script app-run.sh

Proporciona archivos de configuración completos y scripts de deployment.
```

### 9. Documentación del Sistema DTIC Bitácoras

**ID:** `DTIC-DOCS-SYS-001` | **Categoría:** `documentacion/sistema` | **Prioridad:** `1`

```markdown
**IDIOMA: ESPAÑOL**
**CONTEXTO: Documentación DTIC Bitácoras (Sistema completo)**
**TAREA: Documentar el sistema DTIC Bitácoras**
**MÓDULOS: Arquitectura, Componentes, API, Base de Datos, Frontend, Backend**
**PLANTILLA_ID: DTIC-DOCS-SYS-001**

## Especificaciones de Documentación
Documenta el sistema DTIC Bitácoras de manera completa y estructurada.

### Arquitectura General
- **Stack Tecnológico:** React + TypeScript (Frontend), Node.js + Express (Backend), PostgreSQL (Base de Datos), Docker (Contenedorización)
- **Autenticación:** JWT con refresh tokens (8 horas expiración)
- **Permisos:** viewer → technician → admin → super_admin
- **Entidades Principales:** Técnicos, Recursos, Usuarios, Tareas, Usuarios_Asignados

### Componentes del Sistema

#### Frontend (React + TypeScript)
- **Páginas:** Dashboard, Calendario, Reportes, EstadoProyecto, Login, EntityPage (CRUD)
- **Componentes:** EntityForm, EntityLayout, ProfileModal, Navbar, etc.
- **Stores:** authStore, genericEntityStore, useEntityManagement
- **Configuración:** entities.yml

#### Backend (Node.js + Express)
- **Rutas:** auth.js, recursos.js, tareas.js, tecnicos.js, usuarios_asignados.js
- **Middleware:** auth.js, audit.js
- **Base de Datos:** PostgreSQL con pool de conexiones

#### Base de Datos
- **Esquema:** Tablas para tecnicos, recursos, usuarios, tareas, usuarios_asignados
- **Relaciones:** Claves foráneas y constraints

### Documentación Existente
Utiliza la información en el directorio _docs para complementar:
- Implementaciones específicas (asignación de recursos, etc.)
- Correcciones y verificaciones
- Guías de testing

### Estructura de Documentación
1. **Introducción y Arquitectura**
2. **Componentes Frontend**
3. **APIs Backend**
4. **Esquema de Base de Datos**
5. **Configuración y Deployment**
6. **Guías de Desarrollo y Testing**
7. **Historial de Cambios**

Proporciona documentación completa y actualizada del sistema.
```

### 11. Entidades CRUD y Stores Genéricos

**ID:** `DTIC-CRUD-001` | **Categoría:** `desarrollo/crud` | **Prioridad:** `2`

```markdown
**IDIOMA: ESPAÑOL**
**CONTEXTO: Desarrollo DTIC Bitácoras (Entidades CRUD + Stores genéricos)**
**TAREA: Implementar funcionalidad CRUD para [entidad específica]**
**MÓDULOS: useEntityManagement, genericEntityStore, EntityForm**
**PLANTILLA_ID: DTIC-CRUD-001`

## Desarrollo CRUD de Entidades
Desarrolla la funcionalidad CRUD para [Técnicos|Recursos|Usuarios|Tareas|Usuarios_Asignados].

### Arquitectura de Stores Genéricos
```typescript
// genericEntityStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface EntityState<T> {
  entities: T[];
  loading: boolean;
  error: string | null;
  currentEntity: T | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: Record<string, any>;
}

interface EntityActions<T> {
  // CRUD Operations
  fetchEntities: (params?: FetchParams) => Promise<void>;
  createEntity: (entity: Omit<T, 'id'>) => Promise<T>;
  updateEntity: (id: number, updates: Partial<T>) => Promise<T>;
  deleteEntity: (id: number) => Promise<void>;
  
  // Utilities
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: Record<string, any>) => void;
  reset: () => void;
}

type EntityStore<T> = EntityState<T> & EntityActions<T>;

export const createGenericEntityStore = <T extends { id: number }>(
  entityType: string
): EntityStore<T> => {
  return create<EntityStore<T>>()(
    devtools(
      (set, get) => ({
        // Initial State
        entities: [],
        loading: false,
        error: null,
        currentEntity: null,
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
        },
        filters: {},

        // Actions
        fetchEntities: async (params = {}) => {
          set({ loading: true, error: null });
          try {
            const response = await entityApi.fetch(entityType, {
              ...get().filters,
              ...params,
            });
            set({
              entities: response.data,
              pagination: response.pagination,
              loading: false,
            });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Error desconocido',
              loading: false,
            });
          }
        },

        createEntity: async (entityData) => {
          set({ loading: true, error: null });
          try {
            const newEntity = await entityApi.create(entityType, entityData);
            set((state) => ({
              entities: [...state.entities, newEntity],
              loading: false,
            }));
            return newEntity;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Error al crear',
              loading: false,
            });
            throw error;
          }
        },

        updateEntity: async (id, updates) => {
          set({ loading: true, error: null });
          try {
            const updatedEntity = await entityApi.update(entityType, id, updates);
            set((state) => ({
              entities: state.entities.map((entity) =>
                entity.id === id ? updatedEntity : entity
              ),
              loading: false,
            }));
            return updatedEntity;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Error al actualizar',
              loading: false,
            });
            throw error;
          }
        },

        deleteEntity: async (id) => {
          set({ loading: true, error: null });
          try {
            await entityApi.delete(entityType, id);
            set((state) => ({
              entities: state.entities.filter((entity) => entity.id !== id),
              loading: false,
            }));
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Error al eliminar',
              loading: false,
            });
            throw error;
          }
        },

        setLoading: (loading) => set({ loading }),
        setError: (error) => set({ error }),
        setFilters: (filters) => set({ filters }),
        reset: () =>
          set({
            entities: [],
            loading: false,
            error: null,
            currentEntity: null,
            pagination: {
              page: 1,
              limit: 20,
              total: 0,
              totalPages: 0,
            },
            filters: {},
          }),
      }),
      {
        name: `${entityType}-store`,
      }
    )
  );
};
```

### Hook de Gestión de Entidades
```typescript
// useEntityManagement.ts
import { useEffect, useCallback } from 'react';
import { createGenericEntityStore, EntityStore } from '../stores/genericEntityStore';

export const useEntityManagement = <T extends { id: number }>(
  entityType: string
): EntityStore<T> & {
  // Additional hook-specific methods
  useEntity: (id: number) => T | null;
  refreshEntity: (id: number) => Promise<void>;
} => {
  const store = createGenericEntityStore<T>(entityType);

  // Auto-fetch on mount and filter changes
  useEffect(() => {
    store.fetchEntities();
  }, [store.filters]);

  const useEntity = useCallback(
    (id: number) => {
      return store.entities.find((entity) => entity.id === id) || null;
    },
    [store.entities]
  );

  const refreshEntity = useCallback(
    async (id: number) => {
      const entity = await entityApi.getById(entityType, id);
      set((state) => ({
        entities: state.entities.map((e) => (e.id === id ? entity : e)),
      }));
    },
    [entityType]
  );

  return {
    ...store,
    useEntity,
    refreshEntity,
  };
};
```

### Configuración de Entidades en YAML
```yaml
# src/config/entities.yml
entities:
  tecnicos:
    displayName: "Técnicos"
    pluralName: "Técnicos"
    apiEndpoint: "/api/tecnicos"
    permissions:
      viewer: ["read"]
      technician: ["read", "create", "update"]
      admin: ["read", "create", "update", "delete"]
    fields:
      - name: "id"
        type: "number"
        primary: true
        editable: false
      - name: "nombre"
        type: "string"
        required: true
        maxLength: 100
        searchable: true
      - name: "email"
        type: "string"
        required: true
        unique: true
        validation: "email"
      - name: "rol"
        type: "select"
        required: true
        options:
          - value: "viewer"
            label: "Visualizador"
          - value: "technician"
            label: "Técnico"
          - value: "admin"
            label: "Administrador"
      - name: "activo"
        type: "boolean"
        default: true
      - name: "fecha_creacion"
        type: "date"
        editable: false

  recursos:
    displayName: "Recurso"
    pluralName: "Recursos"
    apiEndpoint: "/api/recursos"
    permissions:
      viewer: ["read"]
      technician: ["read", "create", "update"]
      admin: ["read", "create", "update", "delete"]
    fields:
      - name: "id"
        type: "number"
        primary: true
        editable: false
      - name: "nombre"
        type: "string"
        required: true
        maxLength: 200
        searchable: true
      - name: "descripcion"
        type: "text"
        maxLength: 1000
      - name: "tecnico_id"
        type: "select"
        required: true
        relationship: "tecnicos"
        displayField: "nombre"
      - name: "fecha_asignacion"
        type: "date"
        required: true
      - name: "estado"
        type: "select"
        required: true
        options:
          - value: "disponible"
            label: "Disponible"
          - value: "en_uso"
            label: "En Uso"
          - value: "mantenimiento"
            label: "Mantenimiento"
          - value: "fuera_servicio"
            label: "Fuera de Servicio"
      - name: "activo"
        type: "boolean"
        default: true
```

### Componente EntityForm Genérico
```typescript
// EntityForm.tsx
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { entityConfig } from '../config/entities';

interface EntityFormProps<T> {
  entityType: string;
  data?: T;
  onSubmit: (data: T) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  error?: string | null;
}

export const EntityForm = <T extends Record<string, any>>({
  entityType,
  data,
  onSubmit,
  onCancel,
  loading = false,
  error = null,
}: EntityFormProps<T>) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<T>();
  const config = entityConfig[entityType];

  useEffect(() => {
    if (data) {
      reset(data);
    }
  }, [data, reset]);

  const renderField = (field: any) => {
    const { name, type, required, options, maxLength } = field;
    
    switch (type) {
      case 'select':
        return (
          <select {...register(name, { required })}>
            <option value="">Seleccionar...</option>
            {options?.map((option: any) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      case 'text':
        return (
          <textarea
            {...register(name, { 
              required,
              maxLength: maxLength ? { value: maxLength, message: `Máximo ${maxLength} caracteres` } : undefined
            })}
            rows={4}
          />
        );
      
      case 'boolean':
        return (
          <input
            type="checkbox"
            {...register(name)}
          />
        );
      
      default:
        return (
          <input
            type={type}
            {...register(name, { required })}
            maxLength={maxLength}
          />
        );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {config.fields.map((field) => (
        <div key={field.name}>
          <label>{field.name}</label>
          {renderField(field)}
          {errors[field.name] && (
            <span>{errors[field.name]?.message}</span>
          )}
        </div>
      ))}
      
      {error && <div className="error">{error}</div>}
      
      <div className="actions">
        <button type="button" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </form>
  );
};
```

### Integración con Backend
```javascript
// entityApi.js
const API_BASE = process.env.REACT_APP_API_URL;

const entityApi = {
  async fetch(entityType, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE}/api/${entityType}?${queryString}`);
    return response.json();
  },

  async getById(entityType, id) {
    const response = await fetch(`${API_BASE}/api/${entityType}/${id}`);
    return response.json();
  },

  async create(entityType, data) {
    const response = await fetch(`${API_BASE}/api/${entityType}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async update(entityType, id, data) {
    const response = await fetch(`${API_BASE}/api/${entityType}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async delete(entityType, id) {
    const response = await fetch(`${API_BASE}/api/${entityType}/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },
};

module.exports = entityApi;
```

### Consideraciones de Implementación
- **Validación de datos** específica para cada entidad
- **Paginación y filtros** apropiados para el tipo de datos
- **Integración con useEntityManagement** y stores genéricos
- **Manejo de relaciones** con otras entidades
- **Estados de carga y error** contextuales
- **Permisos de acceso** por rol de usuario
- **Auditoría de cambios** en entidades críticas

Considera las relaciones existentes entre entidades.
Utiliza los patrones establecidos para stores y hooks.
Proporciona código completo con ejemplos de uso.
```

### 12. Dashboard y Reportes

**ID:** `DTIC-DASH-001` | **Categoría:** `reportes/dashboard` | **Prioridad:** `2`

```markdown
**IDIOMA: ESPAÑOL**
**CONTEXTO: Desarrollo DTIC Bitácoras (Dashboard + Estadísticas + Reportes)**
**TAREA: Implementar funcionalidad de [dashboard|reportes|estadísticas]**
**MÓDULOS: Dashboard, Reportes, Carga de datos paralela**
**PLANTILLA_ID: DTIC-DASH-001`

## Desarrollo de Dashboard y Reportes
Desarrolla la funcionalidad para [descripción específica].

### Arquitectura de Dashboard
```typescript
// Dashboard.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { useEntityManagement } from '../hooks/useEntityManagement';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';

interface DashboardMetrics {
  tecnicos: {
    total: number;
    activos: number;
    inactivos: number;
    porRol: Record<string, number>;
  };
  recursos: {
    total: number;
    disponibles: number;
    enUso: number;
    mantenimiento: number;
  };
  tareas: {
    total: number;
    pendientes: number;
    enProgreso: number;
    completadas: number;
    porTecnico: Record<number, number>;
  };
  usuarios: {
    total: number;
    activos: number;
    nuevos: number;
  };
}

export const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    end: new Date(),
  });

  const tecnicosStore = useEntityManagement<any>('tecnicos');
  const recursosStore = useEntityManagement<any>('recursos');
  const tareasStore = useEntityManagement<any>('tareas');
  const usuariosStore = useEntityManagement<any>('usuarios');

  // Carga paralela de datos con Promise.all
  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [tecnicosData, recursosData, tareasData, usuariosData] = await Promise.all([
        tecnicosStore.fetchEntities(),
        recursosStore.fetchEntities(),
        tareasStore.fetchEntities({ 
          fecha_inicio: dateRange.start.toISOString().split('T')[0],
          fecha_fin: dateRange.end.toISOString().split('T')[0]
        }),
        usuariosStore.fetchEntities(),
      ]);

      // Calcular métricas
      const newMetrics = calculateMetrics({
        tecnicos: tecnicosStore.entities,
        recursos: recursosStore.entities,
        tareas: tareasStore.entities,
        usuarios: usuariosStore.entities,
      });

      setMetrics(newMetrics);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  }, [tecnicosStore, recursosStore, tareasStore, usuariosStore, dateRange]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={loadDashboardData} />;
  if (!metrics) return <ErrorMessage message="No hay datos disponibles" />;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Dashboard DTIC Bitácoras</h1>
        <div className="date-range-selector">
          <input
            type="date"
            value={dateRange.start.toISOString().split('T')[0]}
            onChange={(e) => setDateRange(prev => ({ ...prev, start: new Date(e.target.value) }))}
          />
          <input
            type="date"
            value={dateRange.end.toISOString().split('T')[0]}
            onChange={(e) => setDateRange(prev => ({ ...prev, end: new Date(e.target.value) }))}
          />
          <button onClick={loadDashboardData}>Actualizar</button>
        </div>
      </header>

      <div className="dashboard-grid">
        <MetricCard
          title="Técnicos"
          value={metrics.tecnicos.total}
          subtitle={`${metrics.tecnicos.activos} activos`}
          icon="users"
          trend={calculateTrend(metrics.tecnicos.total)}
        />
        
        <MetricCard
          title="Recursos"
          value={metrics.recursos.total}
          subtitle={`${metrics.recursos.disponibles} disponibles`}
          icon="tools"
          trend={calculateTrend(metrics.recursos.total)}
        />
        
        <MetricCard
          title="Tareas"
          value={metrics.tareas.total}
          subtitle={`${metrics.tareas.pendientes} pendientes`}
          icon="clipboard"
          trend={calculateTrend(metrics.tareas.total)}
        />
        
        <MetricCard
          title="Usuarios"
          value={metrics.usuarios.total}
          subtitle={`${metrics.usuarios.nuevos} nuevos este mes`}
          icon="user-plus"
          trend={calculateTrend(metrics.usuarios.total)}
        />
      </div>

      <div className="dashboard-charts">
        <ChartContainer
          title="Distribución de Tareas por Técnico"
          type="bar"
          data={prepareTareasPorTecnicoChart(metrics.tareas.porTecnico)}
        />
        
        <ChartContainer
          title="Estado de Recursos"
          type="doughnut"
          data={prepareRecursosEstadoChart(metrics.recursos)}
        />
        
        <ChartContainer
          title="Tareas por Estado"
          type="pie"
          data={prepareTareasEstadoChart(metrics.tareas)}
        />
      </div>

      <div className="dashboard-tables">
        <DataTable
          title="Técnicos Más Activos"
          data={topTecnicos}
          columns={tecnicoColumns}
          pagination={false}
        />
        
        <DataTable
          title="Tareas Recientes"
          data={recentTareas}
          columns={tareaColumns}
          limit={10}
        />
      </div>
    </div>
  );
};

// Cálculo de métricas
const calculateMetrics = (data: any): DashboardMetrics => {
  return {
    tecnicos: {
      total: data.tecnicos.length,
      activos: data.tecnicos.filter((t: any) => t.activo).length,
      inactivos: data.tecnicos.filter((t: any) => !t.activo).length,
      porRol: data.tecnicos.reduce((acc: any, t: any) => {
        acc[t.rol] = (acc[t.rol] || 0) + 1;
        return acc;
      }, {}),
    },
    recursos: {
      total: data.recursos.length,
      disponibles: data.recursos.filter((r: any) => r.estado === 'disponible').length,
      enUso: data.recursos.filter((r: any) => r.estado === 'en_uso').length,
      mantenimiento: data.recursos.filter((r: any) => r.estado === 'mantenimiento').length,
    },
    tareas: {
      total: data.tareas.length,
      pendientes: data.tareas.filter((t: any) => t.estado === 'pendiente').length,
      enProgreso: data.tareas.filter((t: any) => t.estado === 'en_progreso').length,
      completadas: data.tareas.filter((t: any) => t.estado === 'completada').length,
      porTecnico: data.tareas.reduce((acc: any, t: any) => {
        acc[t.usuario_id] = (acc[t.usuario_id] || 0) + 1;
        return acc;
      }, {}),
    },
    usuarios: {
      total: data.usuarios.length,
      activos: data.usuarios.filter((u: any) => u.activo).length,
      nuevos: data.usuarios.filter((u: any) => {
        const createdAt = new Date(u.fecha_creacion);
        const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        return createdAt >= firstDayOfMonth;
      }).length,
    },
  };
};
```

### Componentes de Reportes
```typescript
// Reportes.tsx
import React, { useState, useCallback } from 'react';
import { useEntityManagement } from '../hooks/useEntityManagement';
import { ExportButtons } from '../components/reports/ExportButtons';
import { ReportFilters } from '../components/reports/ReportFilters';
import { ChartVisualization } from '../components/reports/ChartVisualization';

interface ReportConfig {
  title: string;
  entity: string;
  fields: string[];
  filters: Record<string, any>;
  groupBy?: string;
  aggregations?: string[];
}

export const Reportes: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<ReportConfig | null>(null);
  const [reportData, setReportData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const entityStore = useEntityManagement<any>(selectedReport?.entity || '');

  const generateReport = useCallback(async (config: ReportConfig) => {
    setLoading(true);
    try {
      await entityStore.fetchEntities(config.filters);
      setReportData(entityStore.entities);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  }, [entityStore]);

  const exportReport = useCallback((format: 'pdf' | 'excel' | 'csv') => {
    // Implementación de exportación
    switch (format) {
      case 'pdf':
        exportToPDF(reportData, selectedReport?.title || 'Reporte');
        break;
      case 'excel':
        exportToExcel(reportData, selectedReport?.title || 'Reporte');
        break;
      case 'csv':
        exportToCSV(reportData, selectedReport?.title || 'Reporte');
        break;
    }
  }, [reportData, selectedReport]);

  return (
    <div className="reportes">
      <h1>Sistema de Reportes</h1>
      
      <ReportFilters
        onReportSelect={setSelectedReport}
        onGenerate={generateReport}
      />
      
      {selectedReport && (
        <div className="report-container">
          <div className="report-header">
            <h2>{selectedReport.title}</h2>
            <ExportButtons onExport={exportReport} />
          </div>
          
          <ChartVisualization
            data={reportData}
            config={selectedReport}
            loading={loading}
          />
          
          <DataTable
            data={reportData}
            columns={selectedReport.fields}
            loading={loading}
            exportable={true}
          />
        </div>
      )}
    </div>
  );
};
```

### Configuración de Métricas
```yaml
# config/metrics.yml
metrics:
  dashboard:
    - name: "tecnicos_total"
      label: "Total de Técnicos"
      entity: "tecnicos"
      aggregation: "count"
      filters: {}
    
    - name: "recursos_disponibles"
      label: "Recursos Disponibles"
      entity: "recursos"
      aggregation: "count"
      filters: 
        estado: "disponible"
    
    - name: "tareas_pendientes"
      label: "Tareas Pendientes"
      entity: "tareas"
      aggregation: "count"
      filters:
        estado: "pendiente"

  trends:
    - name: "tecnicos_monthly"
      entity: "tecnicos"
      dateField: "fecha_creacion"
      period: "month"
    
    - name: "tareas_completion_rate"
      entity: "tareas"
      dateField: "fecha_completada"
      period: "week"
```

### Consideraciones de Performance
- **Carga paralela** de datos con Promise.all
- **Caché** de cálculos de métricas
- **Lazy loading** de componentes de gráficos
- **Virtualización** para tablas con muchos datos
- **Compresión** de datos de reportes
- **Filtros** del lado del servidor para reducir payload

Considera las métricas relevantes para técnicos, recursos, tareas y usuarios.
Utiliza los patrones de Dashboard existentes.
Proporciona ejemplos con datos realistas y configuraciones exportables.
```

### 13. Documentación y Workflow de Desarrollo

**ID:** `DTIC-DOC-001` | **Categoría:** `documentacion/workflow` | **Prioridad:** `1`

```markdown
**IDIOMA: ESPAÑOL**
**CONTEXTO: Documentación y Workflow DTIC Bitácoras (4 Fases)**
**TAREA: Documentar avance de desarrollo y aplicar workflow de versionado**
**MÓDULOS: Tareas Completadas, Versionado, Commits, Verificación**
**PLANTILLA_ID: DTIC-DOC-001`

## Workflow de Documentación (4 Fases)
Implementa el proceso completo de documentación de avances en español.

### **Fase 1** — Tareas Completadas
Registra en español todas las tareas completadas desde el último registro.
Crea un archivo en el directorio _tareasTerminadas siguiendo el formato:

**Formato:** `YYYYMMDD_HHMMSS_[descripcion].md`

**El archivo debe incluir:**
- Resumen claro de la tarea completada (antes llamado "Task Completed"), traducido y redactado en español
- Análisis de acciones por módulo, redactado en español
- Detalle de cambios, mejoras y soluciones aplicadas
- Estado final del sistema y próximas tareas recomendadas

### **Fase 2** — Versionado
El formato está basado en [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
y este proyecto se adhiere al [Versionado Semántico](https://semver.org/spec/v2.0.0.html).

**Revisa si los cambios realizados requieren:**

**Actualización del número de versión del sistema en TODOS los archivos relevantes:**
- package.json (frontend y backend si corresponde)
- CHANGELOG.md
- Archivos de interfaz que muestren versión (Navbar.tsx, Dashboard.tsx, etc.)
- Cualquier otro archivo que contenga referencias de versión

**Actualización y registro correspondiente en CHANGELOG.md.**

**IMPORTANTE:** Buscar todas las referencias de versión en el código antes de actualizar para asegurar consistencia.

Si corresponde, aplícalo antes de continuar.

### **Fase 3** — Verificación
Antes del commit, verificar que:
- La aplicación funciona correctamente
- Las versiones se muestran actualizadas en la interfaz
- No hay errores de compilación o runtime
- Todos los cambios están completos y documentados

**Crea un archivo de verificación usando el formato:**
`YYYYMMDD_HHMMSS.md`

**El archivo se debe guardar en el directorio _estados/ y debe incluir:**
- Fecha y hora de la verificación
- Versión verificada
- Resultados de todas las verificaciones realizadas
- Estado final del sistema
- Conclusiones y próximos pasos recomendados

### **Fase 4** — Commit
Después de completar la verificación, guarda todos los archivos modificados (incluyendo el archivo de verificación) y realiza un commit en español que incluya:
- Resumen breve del cambio
- Referencia al archivo generado en _tareasTerminadas
- Mención de la verificación completada
- IMPORTANTE: Si se actualizó la versión, incluir mención explícita en el commit

Ejecuta todo preferentemente mediante un único comando o secuencia integrada.

## Estructura de Archivos de Documentación

### Tareas Terminadas
```markdown
# _tareasTerminadas/YYYYMMDD_HHMMSS_[descripcion].md

## Resumen de la Tarea
[Descripción clara de lo que se completó]

## Análisis por Módulo
### Frontend
- Cambios realizados
- Archivos modificados
- Impacto en la interfaz

### Backend
- APIs creadas/modificadas
- Middleware actualizado
- Base de datos afectada

### Configuración
- Variables de entorno
- Docker/部署 files
- Scripts de automatización

## Cambios Técnicos Implementados
- Funcionalidades nuevas
- Optimizaciones aplicadas
- Problemas resueltos
- Mejoras de rendimiento

## Estado del Sistema
- Versión actual
- Estado de la aplicación
- Issues resueltos
- Próximos pasos

## Archivos Modificados
- Lista completa de archivos
- Tipo de cambio (creado/modificado/eliminado)
- Línea principal de impacto
```

### Estados de Verificación
```markdown
# _estados/YYYYMMDD_HHMMSS.md

## Información de Verificación
- **Fecha:** [Timestamp completo]
- **Versión:** [Versión verificada]
- **Entorno:** [Desarrollo/Producción]
- **Usuario:** [Usuario que verificó]

## Verificaciones Realizadas
### Funcionalidad Core
- [ ] Login/Logout funciona
- [ ] CRUD de entidades operativo
- [ ] Dashboard carga correctamente
- [ ] Reportes generan sin errores

### Performance
- [ ] Tiempo de carga < 3 segundos
- [ ] Sin memory leaks detectados
- [ ] API responses < 500ms promedio
- [ ] Base de datos queries optimizadas

### Seguridad
- [ ] Autenticación JWT funcional
- [ ] Permisos por rol correctos
- [ ] Rate limiting activo
- [ ] Validaciones de entrada

### Interface
- [ ] Responsive en móvil/tablet/desktop
- [ ] Accesibilidad WCAG 2.1
- [ ] Sin errores de consola
- [ ] Navegación fluida

## Estado Final
- **Sistema:** Operativo / Con Issues / No Operativo
- **Cobertura:** [Porcentaje de funcionalidades probadas]
- **Issues Pendientes:** [Lista de issues conocidos]
- **Recomendaciones:** [Próximas acciones sugeridas]
```

## Integración con Sistema DTIC

### Entidades Involucradas
- **Técnicos:** Actualización de roles y permisos
- **Recursos:** Estado y disponibilidad
- **Tareas:** Progreso y completación
- **Usuarios:** Nuevos accesos y permisos

### Comandos de Automatización
```bash
# Script de documentación automática
./scripts/documentar_avance.sh

# Verificación de versión
npm run check-version

# Commit con documentación
git add . && git commit -m "docs: documentación completa de cambios - $(date +%Y%m%d_%H%M%S)"

# Verificación del sistema
npm run verify-system
```

### Hooks de Git
```bash
# Pre-commit hook para validar documentación
#!/bin/sh
if [ -n "$(git diff --cached --name-only | grep '^_tareasTerminadas/')" ]; then
  echo "Documentación de tareas incluida ✓"
else
  echo "WARNING: No se detectó documentación de tareas"
fi
```

## Consideraciones de Implementación

### Automatización
- Scripts para generar archivos de documentación automáticamente
- Integración con CI/CD para verificaciones
- Templates reutilizables para consistencia

### Versionado Semántico
- **MAJOR:** Cambios incompatibles en la API
- **MINOR:** Funcionalidades nuevas compatibles
- **PATCH:** Correcciones de bugs compatibles

### Mejores Prácticas
- Documentar en español siempre
- Incluir ejemplos de código cuando sea relevante
- Mantener historial de cambios claro
- Verificar funcionalidad después de cada commit

Considera el sistema de permisos y la estructura de entidades existente.
Utiliza los patrones de documentación establecidos.
Proporciona scripts automatizados para facilitar el proceso.
```

### 14. Mantenimiento y Limpieza del Sistema

**ID:** `DTIC-MAINT-001` | **Categoría:** `mantenimiento/cleanup` | **Prioridad:** `2`

```markdown
**IDIOMA: ESPAÑOL**
**CONTEXTO: Mantenimiento DTIC Bitácoras (Limpieza y organización de archivos)**
**TAREA: Realizar mantenimiento y limpieza del sistema**
**MÓDULOS: Archivos, Documentación, Estructura del proyecto**
**PLANTILLA_ID: DTIC-MAINT-001**

## Especificaciones de Mantenimiento
Realiza tareas de mantenimiento y limpieza en el sistema DTIC Bitácoras.

### Tareas de Limpieza
- Identificar archivos obsoletos o redundantes
- Mover archivos innecesarios al directorio _basurero
- Organizar documentación consolidada
- Limpiar código comentado o no utilizado
- Optimizar estructura de directorios

### Directorios a Revisar
- **_docs:** Archivos de documentación que pueden ser consolidados
- **_basurero:** Destino para archivos archivados
- **_tareasTerminadas:** Historial de tareas completadas
- **Código fuente:** Limpieza de archivos temporales

### Criterios para Archivar
- Documentación específica reemplazada por documentación general
- Archivos de implementación temporal
- Código de prueba o desarrollo obsoleto
- Backups antiguos no necesarios

### Procedimiento de Mantenimiento
1. **Análisis:** Revisar archivos y determinar obsolescencia
2. **Backup:** Crear respaldo antes de mover
3. **Movimiento:** Transferir archivos a _basurero
4. **Verificación:** Confirmar integridad del sistema
5. **Documentación:** Registrar cambios realizados

### Seguridad y Precauciones
- No eliminar archivos críticos del sistema
- Mantener historial de cambios
- Verificar dependencias antes de mover
- Documentar razones de archivado

Proporciona listado completo de archivos movidos y justificación de cada movimiento.
```

---

## Guía de Uso Automático

### Algoritmo de Selección de Plantillas

1. **Análisis del Prompt:** Extraer palabras clave y patrones
2. **Clasificación Automática:** Asignar categoría y subcategoría
3. **Puntuación:** Calcular score basado en coincidencias
4. **Selección:** Elegir plantilla con mayor score
5. **Personalización:** Adaptar plantilla al contexto específico

### Palabras Clave por Categoría

```yaml
desarrollo:
  - "crear", "implementar", "desarrollar", "añadir", "modificar"
  - "componente", "api", "endpoint", "frontend", "backend"
  - "react", "typescript", "node.js", "express"

debugging:
  - "error", "problema", "bug", "debug", "solución"
  - "no funciona", "falla", "crash", "exception"

seguridad:
  - "autenticación", "jwt", "login", "permisos", "seguridad"
  - "autorización", "token", "bcrypt", "hash"

optimización:
  - "optimizar", "rendimiento", "velocidad", "performance"
  - "lento", "memoria", "cache", "eficiencia"
```

### Estructura de Respuesta Automática

```markdown
**PLANTILLA SELECCIONADA:** [ID de plantilla]
**CATEGORÍA:** [categoría/subcategoría] 
**CONFIANZA:** [porcentaje de match]
**JUSTIFICACIÓN:** [razones de la selección]

[Siguiente: Plantilla completa...]
```

### Integración con Sistema de Prompts

Esta estructura permite:
- ✅ Selección automática de plantillas
- ✅ Clasificación por contexto y palabras clave
- ✅ Adaptación inteligente según el tipo de tarea
- ✅ Preservación completa del contenido técnico
- ✅ Extensibilidad para nuevas categorías
- ✅ Matching flexible con algoritmos de puntuación

El sistema puede ahora interpretar cualquier prompt relacionado con DTIC Bitácoras y seleccionar automáticamente la plantilla más apropiada sin intervención manual.

### 15. Actualización de Documentación

**ID:** `DTIC-DOCS-UPD-001` | **Categoría:** `documentacion/actualizacion` | **Prioridad:** `2`

```markdown
**IDIOMA: ESPAÑOL**
**CONTEXTO: Actualización DTIC Bitácoras (Documentación y flujos de trabajo)**
**TAREA: Actualizar documentación del sistema**
**MÓDULOS: Documentación, Flujos de trabajo, Integración de información**
**PLANTILLA_ID: DTIC-DOCS-UPD-001**

## Especificaciones de Actualización
Actualizar la documentación del sistema DTIC Bitácoras incorporando nueva información relevante.

### Fuentes de Información
- Directorio `_flujos`: Flujos de trabajo operativos
- Directorio `_docs`: Documentación existente
- Código fuente: Implementaciones actuales
- Requisitos del sistema: Funcionalidades nuevas

### Proceso de Actualización

#### 1. Análisis de Información Nueva
- Revisar archivos en `_flujos` para contenido relevante
- Identificar información faltante en documentación actual
- Evaluar necesidad de nuevas secciones o actualizaciones

#### 2. Integración de Contenido
- Incorporar flujos de trabajo en secciones apropiadas
- Actualizar esquemas de base de datos con nuevas tablas
- Expandir documentación de APIs con nuevos endpoints
- Mejorar secciones de configuración y deployment

#### 3. Estructura de Documentación
- Mantener consistencia en formato y estilo
- Actualizar índices y referencias cruzadas
- Verificar enlaces internos y externos
- Actualizar versiones y fechas

#### 4. Validación y Verificación
- Revisar completitud de información
- Verificar exactitud técnica
- Validar ejemplos de código
- Comprobar consistencia con implementación actual

### Secciones a Actualizar
- **Arquitectura General**: Nuevos componentes o flujos
- **APIs Backend**: Nuevos endpoints y funcionalidades
- **Base de Datos**: Nuevos esquemas y relaciones
- **Configuración**: Nuevas opciones y procedimientos
- **Flujos de Trabajo**: Nueva sección completa

### Mejoras de Documentación
- Claridad en explicaciones
- Ejemplos más detallados
- Diagramas y esquemas actualizados
- Referencias cruzadas mejoradas

Proporciona documentación actualizada completa con todas las mejoras integradas.
```

### 16. Documentación de Entidades del Sistema

**ID:** `DTIC-DOCS-ENT-001` | **Categoría:** `documentacion/entidades` | **Prioridad:** `2`

```markdown
**IDIOMA: ESPAÑOL**
**CONTEXTO: Documentación DTIC Bitácoras (Entidades y configuraciones)**
**TAREA: Documentar entidades del sistema**
**MÓDULOS: Entidades, Configuración YAML, Relaciones, Funcionalidades**
**PLANTILLA_ID: DTIC-DOCS-ENT-001**

## Especificaciones de Documentación de Entidades
Documentar todas las entidades del sistema DTIC Bitácoras basándose en la configuración YAML.

### Análisis de Configuración
- Revisar archivo `_entidades/entidades.yml`
- Identificar todas las entidades definidas
- Analizar campos, funcionalidades y relaciones

### Estructura de Documentación

#### 1. Entidades Principales
- **Usuarios**: Consumidores finales de servicios
- **Técnicos**: Operadores y administradores
- **Recursos**: Hardware, software y activos
- **Tareas**: Actividades de mantenimiento y soporte

#### 2. Entidades de Relación
- **Recurso_Asignaciones**: Vinculación recursos-usuarios
- **Tarea_Recursos**: Vinculación tareas-recursos
- **Usuario_Tareas**: Asignaciones de tareas

#### 3. Entidades de Auditoría
- **Recurso_Historial**: Cambios en recursos
- **Tarea_Historial**: Progreso de tareas
- **Logs_Sistema**: Auditoría general

#### 4. Entidades de Configuración
- **Departamentos**: Estructura organizacional
- **Categorías_Recursos**: Clasificación de recursos
- **Prioridades_Tareas**: Niveles de urgencia
- **Configuraciones_Sistema**: Parámetros globales

### Detalles por Entidad
Para cada entidad documentar:
- **Descripción**: Propósito y rol en el sistema
- **Campos clave**: Nombre, tipo y función
- **Funcionalidades**: Operaciones CRUD y específicas
- **Estados**: Valores posibles y significados
- **Relaciones**: Conexiones con otras entidades
- **Roles**: Permisos y accesos asociados

### Integración con Documentación
- Actualizar sección de base de datos con esquemas detallados
- Mejorar documentación de APIs con referencias a entidades
- Actualizar diagramas de relaciones entre entidades
- Incluir ejemplos de uso basados en configuración

### Validación y Consistencia
- Verificar que todas las entidades estén documentadas
- Comprobar consistencia entre YAML y documentación
- Validar referencias cruzadas entre entidades
- Asegurar completitud de campos y funcionalidades

Proporciona documentación completa y actualizada de todas las entidades del sistema.
```
