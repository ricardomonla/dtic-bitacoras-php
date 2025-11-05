# Implementación de Asignación Directa de Recursos a Tareas

## Resumen
Se implementó un sistema de asignación directa de recursos a tareas específicas, reemplazando el enfoque anterior basado en técnicos. Ahora cada tarea puede tener recursos dedicados asignados individualmente.

## Análisis de Acciones por Módulo

### Backend (API)
- **routes/tareas.js**: Modificación de consultas SQL para usar tabla `tarea_recursos` en lugar de relaciones indirectas a través de técnicos
- **Base de datos**: Creación de tabla `tarea_recursos` con campos adicionales (estimated_hours, actual_hours, notes)

### Base de Datos
- **Nueva tabla**: `dtic.tarea_recursos` con relaciones many-to-many entre tareas y recursos
- **Campos adicionales**: horas estimadas, horas reales, notas específicas de asignación
- **Constraints**: Unicidad de asignaciones activas, índices de rendimiento

### Frontend
- **Configuración**: Actualización de entidades.yml para mostrar recursos asignados
- **Componentes**: EntityForm y EntityLayout ya soportan la visualización de recursos

## Detalle de Cambios, Mejoras y Soluciones Aplicadas

### 1. Creación de Tabla Intermedia
```sql
CREATE TABLE dtic.tarea_recursos (
    id SERIAL PRIMARY KEY,
    tarea_id INTEGER NOT NULL REFERENCES tareas(id),
    recurso_id INTEGER NOT NULL REFERENCES recursos(id),
    assigned_by INTEGER REFERENCES tecnicos(id),
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT true,
    estimated_hours DECIMAL(5,2),
    actual_hours DECIMAL(5,2),
    notes TEXT
);
```

### 2. Modificación de Consultas API
- Cambio de JOINs indirectos (técnico → usuario → recurso) a JOINs directos (tarea → tarea_recursos → recurso)
- Inclusión de campos adicionales en respuesta JSON (estimated_hours, actual_hours, notes)

### 3. Asignación Específica
- Recurso srvv-KOHA (REC-0007) asignado directamente a tarea TAR-3273
- 8 horas estimadas para reconfiguración del puerto KOHA
- Notas específicas de la asignación

### 4. Verificación
- API devuelve correctamente recursos asignados por tarea
- Frontend muestra recursos en columna "Recursos" de la tabla de tareas

## Beneficios del Nuevo Sistema
- **Precisión**: Recursos asignados específicamente a tareas, no a técnicos
- **Flexibilidad**: Una tarea puede tener múltiples recursos, un recurso puede asignarse a múltiples tareas
- **Seguimiento**: Horas estimadas vs reales, notas específicas por asignación
- **Auditoría**: Registro de quién asignó cada recurso y cuándo

## Archivos Modificados
- `_app-npm/backend/src/routes/tareas.js`
- `_app-npm/docker/init.sql` (nueva tabla)
- `_app-npm/frontend/src/config/entities.yml`