---
title: "DTIC-BITACORAs Template Framework"
version: "1.6.0"
author: "[DTIC Organization]"
description: "A specialized framework for automatic template selection and automation in the DTIC-BITACORAs bitácoras management system."
language: "es"
communication_policy: "spanish_only"
last_updated: "2025-11-14"
framework_type: "hybrid_markdown_yaml"
extensions: []
  # Placeholder for extension metadata
  # - name: "example_extension"
  #   version: "1.0.0"
  #   description: "Description of extension"
---

# DTIC-BITACORAs Template Framework

A specialized framework for automatic template selection and automation, designed for the DTIC-BITACORAs bitácoras management system.

## Template Index

### Structured Catalog

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

  system_documentation_versioning:
    id: "DTIC-SYS-DOC-001"
    nombre: "System Documentation and Versioning Tasks"
    categoria: "documentacion"
    subcategoria: "versioning"
    prioridad: 1
    palabras_clave: ["versioning", "documentation", "system", "version", "changelog", "update", "record", "database", "restore", "backup", "verification"]
    patrones_matching:
      - "system documentation"
      - "versioning tasks"
      - "update versioning"
      - "create version record"
      - "database restore documentation"
      - "system state documentation"
    uso_recomendado: "Perform system documentation and versioning tasks including version updates, changelog entries, and system state documentation"
    descripcion: "Template for system documentation and versioning tasks, including database restore documentation, version updates, and system state recording"

  task_resources_assignment:
    id: "DTIC-TASK-RESOURCES-001"
    nombre: "Problema de Asignación de Recursos en Tareas"
    categoria: "desarrollo"
    subcategoria: "frontend"
    prioridad: 1
    palabras_clave: ["tareas", "recursos", "asignar", "editar", "agregar", "relacionados", "no funciona", "problema", "asignacion"]
    patrones_matching:
      - "no puedo agregar recursos"
      - "problema asignar recursos tareas"
      - "editar tarea recursos"
      - "no se pueden agregar recursos relacionados"
      - "asignación de recursos en tareas"
    uso_recomendado: "Resolver problemas donde no se pueden agregar nuevos recursos relacionados al editar tareas"
    descripcion: "Plantilla para diagnosticar y resolver problemas de asignación de recursos relacionados en la edición de tareas"

  system_documentation:
    id: "DTIC-SYSTEM-DOCS-001"
    nombre: "Documentación Completa del Sistema DTIC Bitácoras"
    categoria: "documentacion"
    subcategoria: "sistema"
    prioridad: 1
    palabras_clave: ["documentar", "sistema", "changelog", "readme", "sistema_dtic_bitacoras", "documentacion", "completa", "arquitectura", "componentes", "apis", "base_datos"]
    patrones_matching:
      - "documentar sistema"
      - "actualizar documentacion"
      - "changelog completo"
      - "readme actualizado"
      - "sistema_dtic_bitacoras.md"
      - "documentacion completa"
      - "arquitectura del sistema"
      - "componentes documentados"
      - "apis documentadas"
      - "base de datos documentada"
    uso_recomendado: "Documentar completamente el sistema DTIC Bitácoras en los archivos CHANGELOG.md, README.md y SISTEMA_DTIC_BITACORAS.md"
    descripcion: "Plantilla para documentación completa del sistema incluyendo arquitectura, componentes, APIs, base de datos y funcionalidades"

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

   version_control:
        id: "DTIC-VC-001"
        nombre: "Control de Versiones y Git"
        categoria: "version_control"
        subcategoria: "git"
        prioridad: 3
        palabras_clave: ["git", "commit", "push", "github", "version", "control", "repositorio", "branch", "merge", "pull"]
        patrones_matching:
          - "commit"
          - "push github"
          - "version control"
          - "git operations"
          - "subir cambios"
        uso_recomendado: "Realizar operaciones de control de versiones con Git y GitHub"
        descripcion: "Plantilla para operaciones de version control y gestión de repositorio"

   database_restore:
     id: "DTIC-DB-RESTORE-001"
     nombre: "Database Restore - srvv-KOHA Resource Restored"
     categoria: "datos"
     subcategoria: "backup_restore"
     prioridad: 1
     palabras_clave: ["restore", "backup", "database", "bd-restore", "srvv-KOHA", "verificación", "restauración", "script", "app-run.sh", "resolved", "successful"]
     patrones_matching:
       - "database restore"
       - "bd-restore functionality"
       - "srvv-KOHA resource restored"
       - "backup verification"
       - "restore script"
       - "successful restore"
     uso_recomendado: "Documentar restauración exitosa de base de datos y verificación de recursos"
     descripcion: "Plantilla para documentación de restauración exitosa de base de datos con resolución del problema de recurso srvv-KOHA faltante"

   database_restore_completed:
     id: "DTIC-DB-RESTORE-COMPLETED-001"
     nombre: "Database Restore Completed Documentation"
     categoria: "datos"
     subcategoria: "backup_restore"
     prioridad: 2
     palabras_clave: ["restore", "backup", "database", "completed", "successful", "verification", "documentation", "bd-restore", "script", "app-run.sh"]
     patrones_matching:
       - "successful database restore"
       - "restore completed"
       - "document restore operation"
       - "backup restore verification"
       - "restore documentation"
     uso_recomendado: "Documentar operaciones exitosas de restauración de base de datos"
     descripcion: "Plantilla para documentar restauraciones exitosas de base de datos con detalles de proceso y verificación"

   pdf_import:
      id: "DTIC-PDF-IMPORT-001"
      nombre: "Importación de Datos desde PDF"
      categoria: "datos"
      subcategoria: "importacion"
      prioridad: 2
      palabras_clave: ["pdf", "importar", "extraer", "texto", "parsing", "mapeo", "base de datos", "error handling", "duplicados", "conexion", "multi-line", "estructurado"]
      patrones_matching:
        - "importar datos pdf"
        - "extraer texto pdf"
        - "cargar pdf a base de datos"
        - "parsing pdf"
        - "mapeo schema pdf"
        - "insertar datos pdf"
        - "manejo errores pdf"
        - "duplicados pdf"
        - "conexion bd pdf"
        - "multi-line entries pdf"
      uso_recomendado: "Importar datos desde archivos PDF a la base de datos con manejo de errores y validaciones"
      descripcion: "Plantilla para el proceso completo de importación de datos desde PDF: extracción de texto, parsing a datos estructurados, mapeo a schema de base de datos, inserción con error handling, y manejo de entradas multi-línea, duplicados y problemas de conexión"

   system_administration:
      id: "DTIC-SYSTEM-001"
      nombre: "Modificaciones del Sistema"
      categoria: "sistema"
      subcategoria: "administracion"
      prioridad: 1
      palabras_clave: ["sistema", "administracion", "modificaciones", "configuracion", "usuarios", "permisos", "seguridad", "gestion", "ajustes", "parametros"]
      patrones_matching:
        - "modificar sistema"
        - "administrar sistema"
        - "configurar sistema"
        - "gestionar usuarios"
        - "cambiar permisos"
        - "ajustar configuracion"
        - "seguridad sistema"
        - "parametros sistema"
      uso_recomendado: "Realizar modificaciones y administración del sistema DTIC Bitácoras, incluyendo configuración, usuarios y permisos"
      descripcion: "Plantilla para tareas de administración y modificaciones del sistema, incluyendo gestión de usuarios, permisos, configuraciones de seguridad y ajustes de parámetros del sistema"

   backup_restore_operations:
     id: "DTIC-BACKUP-RESTORE-001"
     nombre: "Backup and Restore Operations"
     categoria: "datos"
     subcategoria: "backup_restore"
     prioridad: 1
     palabras_clave: ["backup", "restore", "database", "system administration"]
     patrones_matching:
       - "backup operations"
       - "restore database"
       - "system backup"
       - "database restore"
       - "backup and restore"
     uso_recomendado: "Perform backup and restore operations for the DTIC Bitácoras system"
     descripcion: "Template for backup and restore operations including database backups, system state preservation, and restoration procedures"

     # CLASIFICACIÓN AUTOMÁTICA
clasificacion:
  categorias:
   desarrollo: ["frontend", "backend", "crud"]
   seguridad: ["autenticacion"]
   datos: ["base_datos", "backup_restore"]
   reportes: ["dashboard"]
   configuracion: ["deployment"]
   optimizacion: ["performance"]
   debugging: ["error_solving"]
   documentacion: ["workflow", "sistema", "actualizacion", "entidades", "system_documentation"]
   general: ["general"]

   mantenimiento: ["cleanup"]

   version_control: ["git"]

   database_restore_completed: ["backup_restore"]

   task_resources_assignment: ["frontend"]

   sistema: ["administracion"]

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

## Classification Algorithm

### Pseudo-Code for Template Selection

```javascript
// Specialized classification algorithm for DTIC-BITACORAs
function selectTemplate(userPrompt) {
    const promptLower = userPrompt.toLowerCase();
    let bestTemplate = templates.base_bitacoras;
    let bestScore = 0;

    // Iterate through all templates
    for (const template of Object.values(templates)) {
        let score = 0;

        // Score based on exact keyword matches
        for (const keyword of template.keywords) {
            if (promptLower.includes(keyword.toLowerCase())) {
                score += 2;
            }
        }

        // Score based on pattern matches
        for (const pattern of template.patterns) {
            if (promptLower.includes(pattern.toLowerCase())) {
                score += 3;
            }
        }

        // Bonus for priority (lower priority number = higher bonus)
        score += (10 - template.priority) * 0.1;

        // Bonus for category match
        if (promptLower.includes(template.category)) {
            score += 1;
        }

        if (score > bestScore) {
            bestScore = score;
            bestTemplate = template;
        }
    }

    return bestTemplate;
}
```

## Example Template Definitions

### Base Bitácoras Template

**ID:** BIT-001  
**Category:** general/bitacoras  
**Priority:** 10  

**Keywords:** bitácoras, logs, general  
**Patterns:** standard, default  

**Template Content:**
```
**SELECTED TEMPLATE:** BIT-001
**CATEGORY:** general/bitacoras
**CONFIDENCE:** [calculated percentage]
**JUSTIFICATION:** [selection reasons]

## Proposed Execution Plan
[Step-by-step plan details for bitácoras management]

Confirm execution of this plan? (Yes/No)

[Next: Full template content...]
```

### Tarea Management Template Example

**ID:** TAREA-001  
**Category:** tareas/management  
**Priority:** 5  

**Keywords:** tarea, task, assignment, create, update, delete  
**Patterns:** manage, assign, process  

**Template Content:**
```
**SELECTED TEMPLATE:** TAREA-001
**CATEGORY:** tareas/management
**CONFIDENCE:** [calculated percentage]
**JUSTIFICATION:** [selection reasons]

## Tarea Management Plan
1. Identify tarea requirements
2. Validate tarea data
3. Execute tarea operation (create/update/delete)
4. Update related assignments
5. Verify tarea status

Confirm execution of this plan? (Yes/No)

[Next: Detailed tarea management steps...]
```

### Recurso Assignment Template Example

**ID:** RECURSO-001  
**Category:** recursos/assignment  
**Priority:** 4  

**Keywords:** recurso, resource, assign, allocation  
**Patterns:** assign, allocate, manage  

**Template Content:**
```
**SELECTED TEMPLATE:** RECURSO-001
**CATEGORY:** recursos/assignment
**CONFIDENCE:** [calculated percentage]
**JUSTIFICATION:** [selection reasons]

## Recurso Assignment Plan
1. Identify available recursos
2. Check assignment requirements
3. Validate compatibility
4. Execute assignment
5. Update assignment records

Confirm execution of this plan? (Yes/No)

[Next: Detailed assignment steps...]
```

## Integration Mechanisms

### Framework Integration

This framework integrates with automation systems through:

1. **Prompt Analysis:** Automatic extraction of keywords and patterns from user inputs related to DTIC-BITACORAs entities.
2. **Template Matching:** Scoring-based selection of most appropriate template for bitácoras management.
3. **Response Generation:** Structured output with plan proposal and confirmation for project-specific operations.
4. **Extension Support:** Modular design allowing custom templates and categories for DTIC-BITACORAs functionalities.

### Structured Request Format

Recognized format for prioritized processing:

```
[REQUEST]
[Task description related to DTIC-BITACORAs]
Use [_prompts/prompts_app_dtic-BITACORAs.md] for this request.
```

**System Behavior:**
- Automatic detection of [REQUEST] format
- Priority boost for specified framework file
- Mandatory plan proposal and confirmation

**Response Structure:**
```markdown
**REQUEST RECOGNIZED**
**PRIORITY FILE:** [_prompts/prompts_app_dtic-BITACORAs.md]

## Proposed Execution Plan
[Step-by-step details for DTIC-BITACORAs task]

Confirm execution? (Yes/No)
```

## Extension Guidelines

### Adding New Templates

1. **Define Template Structure:**
   - Unique ID (format: CATEGORY-XXX, e.g., REPORTS-001)
   - Category and subcategory relevant to DTIC-BITACORAs
   - Priority level (1-10, lower = higher priority)
   - Keywords array specific to bitácoras management
   - Patterns array for operation types
   - Description of template purpose

2. **Update Catalog:**
   - Add to `templates` section in YAML
   - Include in `categories` list if new category needed

3. **Test Integration:**
   - Verify classification algorithm selects correctly for DTIC-BITACORAs prompts
   - Ensure response format consistency with project requirements

### Framework Extensions

Extensions can be added via:

- **YAML Metadata:** Update `extensions` array in frontmatter
- **Template Additions:** Append new templates to catalog for additional DTIC-BITACORAs functionalities
- **Category Expansions:** Add new categories as the project evolves
- **Algorithm Modifications:** Customize scoring logic for specific DTIC-BITACORAs domains

### Best Practices

- Maintain keyword/pattern relevance to bitácoras management
- Use consistent ID naming conventions (e.g., entity-based prefixes)
- Test extensions across different DTIC-BITACORAs prompt types
- Document extension purposes and usage within the project context

---

## Política de Comunicación - REQUISITO CRÍTICO

**🚨 REQUISITO OBLIGATORIO: TODA LA COMUNICACIÓN DEBE SER EN ESPAÑOL**

Esta política es un **requisito crítico y no negociable** para todas las interacciones con el usuario. Cualquier violación será considerada un error grave.

### 📋 Requisitos Obligatorios

#### **Comunicación con el Usuario**
- ✅ **TODAS** las respuestas al usuario deben estar **exclusivamente en español**
- ✅ **TODAS** las explicaciones técnicas deben estar **en español**
- ✅ **TODAS** las documentaciones deben estar **en español**
- ✅ **TODAS** las bitácoras de tareas deben estar **en español**
- ✅ **TODAS** las entradas del CHANGELOG deben estar **en español**
- ✅ **TODAS** las confirmaciones de tareas deben estar **en español**

#### **Contenido Prohibido**
- ❌ **NINGUNA** respuesta en inglés al usuario
- ❌ **NINGUNA** documentación en inglés
- ❌ **NINGUNA** explicación técnica en inglés para el usuario
- ❌ **NINGUNA** comunicación que no sea en español

### 🔧 Procesamiento Interno (Permitido en Inglés)

**ÚNICAMENTE** se permite inglés para:
- Código fuente y comentarios técnicos internos
- Logs del sistema y debugging técnico
- Nombres de variables y funciones
- Documentación técnica de APIs de terceros
- Configuraciones técnicas del sistema

### ⚖️ Reglas de Ejecución

#### **Validación Automática**
- El sistema debe validar que todas las respuestas al usuario estén en español
- Cualquier respuesta en inglés debe ser rechazada automáticamente
- Las plantillas deben garantizar contenido en español

#### **Corrección de Errores**
- Si se detecta contenido en inglés, debe corregirse inmediatamente
- Las respuestas deben ser regeneradas completamente en español
- No se aceptan "traducciones posteriores"

#### **Alcance Completo**
Esta política aplica a:
- ✅ Respuestas a consultas del usuario
- ✅ Documentación del sistema
- ✅ Bitácoras de tareas completadas
- ✅ Entradas del CHANGELOG
- ✅ Mensajes de confirmación
- ✅ Explicaciones técnicas
- ✅ Reportes de estado
- ✅ Cualquier comunicación dirigida al usuario

### 🚨 Consecuencias de Violación

- **Error Crítico:** Violación de política de comunicación
- **Rechazo Automático:** Respuestas en inglés serán invalidadas
- **Corrección Obligatoria:** Regeneración inmediata en español
- **Registro:** Incidente documentado en logs del sistema

### 📊 Estado de Cumplimiento

- **Política Activa:** ✅ Implementada y obligatoria
- **Validación:** ✅ Automática en todas las respuestas
- **Monitoreo:** ✅ Activo en tiempo real
- **Cumplimiento:** ✅ 100% requerido

---

**Esta política es permanente y no puede ser modificada sin aprobación explícita del usuario.**

---

## Version History

- **Version 1.6.0:** 2025-11-14 - Added DTIC-BACKUP-RESTORE-001 template for backup and restore operations
- **Version 1.5.0:** 2025-11-14 - Nueva plantilla DTIC-SYSTEM-001 para modificaciones y administración del sistema, incluyendo gestión de usuarios, permisos, configuraciones de seguridad y ajustes de parámetros.
- **Version 1.4.0:** 2025-11-14 - Nueva plantilla DTIC-PDF-IMPORT-001 para importación de datos desde archivos PDF a la base de datos, incluyendo extracción de texto, parsing estructurado, mapeo de schema, inserción con error handling y manejo de multi-line entries, duplicados y problemas de conexión.
- **Version 1.3.0:** 2025-11-14 - Nueva plantilla DTIC-SYSTEM-DOCS-001 para documentación completa del sistema. Inclusión de requerimiento persistente para documentar CHANGELOG.md, README.md y SISTEMA_DTIC_BITACORAS.md.
- **Version 1.2.0:** 2025-11-14 - Política de comunicación en español implementada como requisito crítico y obligatorio. Refuerzo de directivas de idioma para todas las interacciones con el usuario.
- **Version 1.1.0:** 2025-11-14 - Comprehensive template integration from prompts-dtic-bitacoras.md, added detailed technical templates, classification algorithms, and resolved issues log
- **Version 1.0.0:** 2025-11-14 - Initial DTIC-BITACORAs framework implementation