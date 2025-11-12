# Documentación: Funcionalidad de Asignación de Recursos - DTIC-FE-001

## Resumen Ejecutivo

Se ha implementado exitosamente la funcionalidad de asignación de recursos usando la plantilla DTIC-FE-001, que permite la gestión completa de asignaciones de recursos en el módulo de Tareas del sistema DTIC Bitácoras. La implementación es completamente reutilizable y puede ser aplicada a otros módulos siguiendo los patrones establecidos.

## Arquitectura Implementada

### 1. Componente Principal: ResourceAssignmentControl

**Archivo:** `src/components/common/ResourceAssignmentControl.tsx`

**Funcionalidades:**
- Visualización de recursos actualmente asignados
- Interfaz intuitiva para asignar nuevos recursos
- Capacidad de desasignar recursos existentes
- Indicadores visuales de estado de recursos
- Diseño responsive y accesible

**Props del Control:**
```typescript
interface ResourceAssignmentControlProps {
  entityId: number                    // ID de la entidad (tarea, usuario, etc.)
  entityType: 'tarea' | 'usuario' | 'tecnico' | 'recurso'
  assignedResources: AssignedResource[]    // Recursos actualmente asignados
  availableResources: ResourceOption[]     // Recursos disponibles para asignar
  onAssignResource: (resourceId: number) => Promise<boolean>
  onUnassignResource: (resourceId: number) => Promise<boolean>
  loading?: boolean                   // Estado de carga
  className?: string                  // Clases CSS adicionales
  showAddIcon?: boolean               // Mostrar botón de asignación
  maxHeight?: string                  // Altura máxima del área de recursos
}
```

### 2. Hook de Gestión: useResourceAssignment

**Archivo:** `src/hooks/useResourceAssignment.ts`

**Funcionalidades:**
- Operaciones CRUD para asignaciones de recursos
- Gestión de estado de recursos asignados y disponibles
- Manejo de errores y estados de carga
- Integración con APIs del backend

**Funciones Principales:**
- `assignResource()`: Asigna un recurso a una entidad
- `unassignResource()`: Desasigna un recurso de una entidad
- `loadAssignedResources()`: Carga recursos asignados
- `loadAvailableResources()`: Carga recursos disponibles
- `refreshAssignments()`: Actualiza ambas listas

### 3. Extensión de EntityForm

**Archivo:** `src/components/common/EntityForm.tsx`

**Mejoras Implementadas:**
- Nuevo tipo de campo: `resource_assignment`
- Integración automática del ResourceAssignmentControl
- Soporte para configuración dinámica via YAML

**Configuración en YAML:**
```yaml
- name: "assigned_resources"
  label: "Recursos Asignados"
  type: "resource_assignment"
  resourceAssignmentConfig:
    entityType: "tarea"
    entityId: "{{id}}"
  required: false
  description: "Gestión de recursos asignados a esta tarea"
```

### 4. Configuración de Entidades

**Archivo:** `src/config/entities.yml`

**Modificaciones:**
- Actualización del módulo "tareas" para usar el nuevo tipo de campo
- Configuración flexible para otros módulos

## Integración con Módulo Tareas

### TareaProfileModal Actualizado

**Archivo:** `src/components/TareaProfileModal.tsx`

**Características:**
- Integración completa del ResourceAssignmentControl
- Layout expandido (modal-xl) para mejor visualización
- Carga automática de asignaciones al abrir el modal
- Actualización en tiempo real de asignaciones

## API Endpoints Utilizados

### 1. Asignación de Recursos
- **Endpoint:** `POST /api/tarea-recursos`
- **Payload:** 
  ```json
  {
    "entity_type": "tarea",
    "entity_id": 123,
    "resource_id": 456
  }
  ```

### 2. Desasignación de Recursos
- **Endpoint:** `DELETE /api/tarea-recursos`
- **Payload:**
  ```json
  {
    "entity_type": "tarea",
    "entity_id": 123,
    "resource_id": 456
  }
  ```

### 3. Consulta de Asignaciones
- **Endpoint:** `GET /api/tarea-recursos?entity_type=tarea&entity_id=123`
- **Respuesta:** Lista de recursos asignados con metadatos

## Patrones de Reutilización

### Para Otros Módulos

1. **Actualizar entities.yml:**
   ```yaml
   - name: "assigned_resources"
     label: "Recursos Asignados"
     type: "resource_assignment"
     resourceAssignmentConfig:
       entityType: "usuario"  # o "tecnico", etc.
       entityId: "{{id}}"
   ```

2. **Importar en Modales:**
   ```typescript
   import { ResourceAssignmentControl } from './common/ResourceAssignmentControl'
   import { useResourceAssignment } from '../hooks/useResourceAssignment'
   
   const resourceAssignment = useResourceAssignment('usuario', userId)
   
   <ResourceAssignmentControl
     entityId={userId}
     entityType="usuario"
     assignedResources={resourceAssignment.assignedResources}
     availableResources={resourceAssignment.availableResources}
     onAssignResource={resourceAssignment.assignResource}
     onUnassignResource={resourceAssignment.unassignResource}
     loading={resourceAssignment.loading}
   />
   ```

### Entidades Soportadas

- **tareas:** Funcionalidad completa implementada
- **usuarios:** Soporte nativo (requiere endpoint `/api/usuario-recursos`)
- **tecnicos:** Soporte nativo (requiere endpoint `/api/tecnico-recursos`)
- **recursos:** Soporte para asignaciones inversas

## Mejores Prácticas Implementadas

### 1. Manejo de Estados
- Estados de carga explícitos
- Manejo robusto de errores
- Feedback visual para el usuario

### 2. Performance
- Carga lazy de componentes
- Memoización de datos cuando es apropiado
- Actualización optimizada de estado

### 3. UX/UI
- Indicadores visuales claros de estado
- Confirmaciones para acciones destructivas
- Diseño responsive y accesible

### 4. Integración
- Sin dependencias circulares
- Patrones consistentes con el resto del sistema
- Configuración declarativa via YAML

## Consideraciones de Backend

### Endpoints Requeridos

1. **Para Módulo Usuarios:**
   ```javascript
   // GET /api/usuario-recursos
   // POST /api/usuario-recursos  
   // DELETE /api/usuario-recursos
   ```

2. **Para Módulo Técnicos:**
   ```javascript
   // GET /api/tecnico-recursos
   // POST /api/tecnico-recursos
   // DELETE /api/tecnico-recursos
   ```

### Base de Datos

La funcionalidad asume la existencia de una tabla de relaciones como:
```sql
CREATE TABLE tarea_recursos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  entity_type VARCHAR(50) NOT NULL,
  entity_id INT NOT NULL,
  resource_id INT NOT NULL,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  assigned_by INT,
  UNIQUE KEY unique_assignment (entity_type, entity_id, resource_id)
);
```

## Testing y Validación

### Casos de Prueba

1. **Asignación de Recursos:**
   - ✅ Asignar recurso disponible
   - ✅ Prevenir asignación de recurso ya asignado
   - ✅ Manejo de errores de API

2. **Desasignación de Recursos:**
   - ✅ Desasignar recurso asignado
   - ✅ Confirmación de acción
   - ✅ Manejo de errores

3. **Integración con Formularios:**
   - ✅ Renderizado correcto en EntityForm
   - ✅ Configuración via YAML
   - ✅ Estados de carga

## Próximos Pasos

1. **Implementar endpoints para otros módulos** (usuarios, tecnicos)
2. **Agregar validaciones de negocio** (compatibilidad de recursos, permisos)
3. **Optimizaciones de performance** para listas grandes
4. **Funcionalidad de búsqueda** en el selector de recursos
5. **Historial de asignaciones** con auditoría

## Soporte y Mantenimiento

### Actualizaciones del Control
Para modificar la funcionalidad del ResourceAssignmentControl:
1. Actualizar la interfaz TypeScript si es necesario
2. Modificar la lógica de renderizado
3. Mantener compatibilidad con useResourceAssignment hook

### Extensión a Nuevos Módulos
1. Agregar tipo de entidad a los tipos TypeScript
2. Implementar endpoints en el backend
3. Actualizar configuración YAML del módulo
4. Importar y configurar en el modal correspondiente

## Conclusión

La implementación de la funcionalidad de asignación de recursos utilizando la plantilla DTIC-FE-001 ha sido exitosa y establece una base sólida para la gestión de recursos en el sistema DTIC Bitácoras. El diseño modular y reutilizable facilita la extensión a otros módulos mientras mantiene la consistencia con los patrones establecidos en el sistema.