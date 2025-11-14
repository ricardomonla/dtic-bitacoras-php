---
title: "DTIC-BKPs Template Framework"
version: "1.1.0"
author: "Lic. Ricardo MONLA"
description: "A specialized template framework for the dtic-BKPs backup processing system, designed for automatic template selection and automation across backup operations."
language: "es"
last_updated: "2025-11-14"
framework_type: "hybrid_markdown_yaml"
extensions: []
  # Placeholder for extension metadata
  # - name: "example_extension"
  #   version: "1.0.0"
  #   description: "Description of extension"
---

# DTIC-BKPs Template Framework

A specialized framework for automatic template selection and automation in the dtic-BKPs backup processing system, designed for portability across backup operations and domains.

## System Context

- **System Name:** dtic-BKPs
- **Author:** Lic. Ricardo MONLA
- **Department:** Servidores
- **Organization:** Dirección de TIC, Facultad Regional La Rioja, Universidad Tecnológica Nacional
- **Technology Stack:** Ruby-based backup processing system
- **Dependencies:** rclone, pv, tar, gzip, screen
- **Operating System:** Linux
- **Architecture:** Modular Ruby architecture with separate processors for different backup types
- **Core Functionality:** Automated backup processing for XenServer/XCP-ng (.xva files) and Proxmox VE backup sets

## Template Index

### Structured Catalog

```yaml
templates:
  base_universal:
    id: "DTIC-BASE-001"
    category: "general"
    subcategory: "universal"
    priority: 10
    keywords:
      - "general"
      - "universal"
      - "base"
      - "cualquier"
    patterns:
      - "cualquier tarea"
      - "general"
      - "sin especificar"
    description: "Plantilla base para cualquier tipo de desarrollo en DTIC Bitácoras"

  documentacion_workflow:
    id: "DTIC-DOC-001"
    category: "documentacion"
    subcategory: "workflow"
    priority: 1
    keywords:
      - "documentar"
      - "bitacora"
      - "tareas completadas"
      - "versionado"
      - "commit"
      - "verificacion"
      - "changelog"
    patterns:
      - "documentar avance"
      - "tareas completadas"
      - "versionado"
      - "commit"
      - "changelog"
      - "verificacion"
      - "bitacora de desarrollo"
      - "documentar progreso"
      - "fase de documentacion"
    description: "Plantilla para documentación de avances y workflow de desarrollo de 4 fases"

  base_datos:
    id: "DTIC-DB-001"
    category: "datos"
    subcategory: "backup_database"
    priority: 2
    keywords:
      - "backup"
      - "base de datos"
      - "catálogo"
      - "metadata"
      - "postgresql"
      - "sql"
      - "query"
      - "restauración"
      - "backup_restore"
      - "bd-restore"
      - "srvv-KOHA"
    patterns:
      - "base de datos respaldos"
      - "backup database"
      - "catálogo de respaldos"
      - "metadata backup"
      - "restauración bd"
      - "bd-restore"
      - "backup verification"
    description: "Plantilla para gestión de bases de datos de respaldos, catálogos y operaciones de restauración"

  debugging:
    id: "DTIC-DEBUG-001"
    category: "debugging"
    subcategory: "backup_debugging"
    priority: 1
    keywords:
      - "debug"
      - "error"
      - "problema"
      - "ruby"
      - "rclone"
      - "backup"
      - "procesamiento"
      - "fallo"
      - "troubleshoot"
      - "logs"
      - "dticBKPs.log"
      - "xva"
      - "proxmox"
    patterns:
      - "debug backup"
      - "error procesamiento"
      - "problema rclone"
      - "ruby error"
      - "backup falló"
      - "logs dtic-BKPs"
      - "error xva"
      - "problema proxmox"
    description: "Plantilla para debugging de operaciones de respaldo, Ruby scripts y sincronización rclone"

  optimizacion:
    id: "DTIC-OPT-001"
    category: "optimizacion"
    subcategory: "backup_performance"
    priority: 2
    keywords:
      - "optimizar"
      - "rendimiento"
      - "backup"
      - "compresión"
      - "velocidad"
      - "eficiencia"
      - "rclone"
      - "tar"
      - "gzip"
      - "procesamiento"
      - "paralelo"
      - "transferencia"
    patterns:
      - "optimizar backup"
      - "rendimiento respaldos"
      - "compresión eficiente"
      - "velocidad transferencia"
      - "procesamiento paralelo"
      - "optimizar rclone"
      - "eficiencia tar gzip"
    description: "Plantilla para optimización de compresión, transferencia y procesamiento de respaldos"

  configuracion:
    id: "DTIC-CONF-001"
    category: "configuracion"
    subcategory: "backup_config"
    priority: 2
    keywords:
      - "ruby"
      - "configuración"
      - "dticBKPs_tasks.rb"
      - "rclone"
      - "procesador"
      - "backup"
      - "instalación"
      - "setup"
      - "tareas"
      - "comando"
      - "linux"
      - "tar"
      - "gzip"
      - "screen"
    patterns:
      - "configuración respaldos"
      - "dtic-BKPs_tasks.rb"
      - "ruby backup processor"
      - "rclone config"
      - "backup setup"
      - "instalación sistema"
      - "configurar tareas"
    description: "Plantilla para configuración del procesador de respaldos Ruby, tareas y dependencias del sistema"

  mantenimiento_sistema:
    id: "DTIC-MAINT-001"
    category: "mantenimiento"
    subcategory: "cleanup"
    priority: 2
    keywords:
      - "mantenimiento"
      - "limpieza"
      - "archivos"
      - "basurero"
      - "organizar"
      - "cleanup"
      - "mover"
      - "archivar"
      - "sistema"
      - "dtic"
      - "bitacoras"
    patterns:
      - "mover a basurero"
      - "limpiar archivos"
      - "organizar documentacion"
      - "archivar archivos innecesarios"
      - "mantenimiento sistema"
    description: "Plantilla para tareas de mantenimiento, limpieza y organización de archivos del sistema"

  documentacion_sistema:
    id: "DTIC-DOCS-SYS-001"
    category: "documentacion"
    subcategory: "sistema"
    priority: 1
    keywords:
      - "documentar"
      - "sistema"
      - "documentacion"
      - "arquitectura"
      - "componentes"
      - "modulos"
      - "api"
      - "base de datos"
      - "frontend"
      - "backend"
      - "dtic"
      - "bitacoras"
    patterns:
      - "documentar sistema"
      - "documentacion completa"
      - "arquitectura del sistema"
      - "componentes del sistema"
      - "documentar dtic bitacoras"
    description: "Plantilla para documentar la arquitectura, componentes y funcionalidades del sistema DTIC Bitácoras"

  system_documentation_versioning:
    id: "DTIC-SYS-DOC-001"
    category: "documentacion"
    subcategory: "versioning"
    priority: 1
    keywords:
      - "versioning"
      - "documentation"
      - "system"
      - "version"
      - "changelog"
      - "update"
      - "record"
      - "database"
      - "restore"
      - "backup"
      - "verification"
    patterns:
      - "system documentation"
      - "versioning tasks"
      - "update versioning"
      - "create version record"
      - "database restore documentation"
      - "system state documentation"
    description: "Template for system documentation and versioning tasks, including version updates, changelog entries, and system state recording"

  documentacion_actualizacion:
    id: "DTIC-DOCS-UPD-001"
    category: "documentacion"
    subcategory: "actualizacion"
    priority: 2
    keywords:
      - "actualizar"
      - "documentacion"
      - "flujos"
      - "workflows"
      - "integrar"
      - "incorporar"
      - "mejorar"
      - "sistema"
      - "dtic"
      - "bitacoras"
    patterns:
      - "actualizar documentacion"
      - "incorporar flujos"
      - "mejorar docs"
      - "integrar workflows"
      - "actualizar sistema docs"
    description: "Plantilla para actualizar y mejorar la documentación del sistema DTIC Bitácoras"

  documentacion_entidades:
    id: "DTIC-DOCS-ENT-001"
    category: "documentacion"
    subcategory: "entidades"
    priority: 2
    keywords:
      - "entidades"
      - "configuracion"
      - "yaml"
      - "campos"
      - "relaciones"
      - "funcionalidades"
      - "estados"
      - "sistema"
      - "dtic"
      - "bitacoras"
    patterns:
      - "documentar entidades"
      - "configuracion entidades"
      - "entidades yaml"
      - "documentar configuracion entidades"
    description: "Plantilla para documentar entidades y configuraciones del sistema"

  version_control:
    id: "DTIC-VC-001"
    category: "version_control"
    subcategory: "git"
    priority: 3
    keywords:
      - "git"
      - "commit"
      - "push"
      - "github"
      - "version"
      - "control"
      - "repositorio"
      - "branch"
      - "merge"
      - "pull"
    patterns:
      - "commit"
      - "push github"
      - "version control"
      - "git operations"
      - "subir cambios"
    description: "Plantilla para operaciones de control de versiones con Git y GitHub"

  database_restore:
    id: "DTIC-DB-RESTORE-001"
    category: "datos"
    subcategory: "backup_restore"
    priority: 1
    keywords:
      - "restore"
      - "backup"
      - "database"
      - "bd-restore"
      - "srvv-KOHA"
      - "verificación"
      - "restauración"
      - "script"
      - "app-run.sh"
      - "resolved"
      - "successful"
    patterns:
      - "database restore"
      - "bd-restore functionality"
      - "srvv-KOHA resource restored"
      - "backup verification"
      - "restore script"
      - "successful restore"
    description: "Plantilla para documentación de restauración exitosa de base de datos con resolución del problema de recurso srvv-KOHA faltante"

  database_restore_completed:
    id: "DTIC-DB-RESTORE-COMPLETED-001"
    category: "datos"
    subcategory: "backup_restore"
    priority: 2
    keywords:
      - "restore"
      - "backup"
      - "database"
      - "completed"
      - "successful"
      - "verification"
      - "documentation"
      - "bd-restore"
      - "script"
      - "app-run.sh"
    patterns:
      - "successful database restore"
      - "restore completed"
      - "document restore operation"
      - "backup restore verification"
      - "restore documentation"
    description: "Plantilla para documentar restauraciones exitosas de base de datos con detalles de proceso y verificación"

  backup_sync:
    id: "DTIC-BKP-SYNC-001"
    category: "backup"
    subcategory: "synchronization"
    priority: 2
    keywords:
      - "sincronización"
      - "rclone"
      - "backup"
      - "transferencia"
      - "remoto"
      - "nube"
      - "sync"
      - "copy"
      - "move"
    patterns:
      - "sincronizar respaldos"
      - "rclone sync"
      - "backup remoto"
      - "transferencia nube"
    description: "Plantilla para sincronización de respaldos procesados a destinos remotos usando rclone"

  vm_backup_processing:
    id: "DTIC-VM-BKP-001"
    category: "backup"
    subcategory: "vm_processing"
    priority: 2
    keywords:
      - "vm"
      - "máquina virtual"
      - "xva"
      - "proxmox"
      - "xen"
      - "procesamiento"
      - "backup"
      - "compresión"
    patterns:
      - "procesar backup vm"
      - "xva processing"
      - "proxmox backup"
      - "vm compression"
    description: "Plantilla para procesamiento de respaldos de máquinas virtuales desde diferentes plataformas"

categories:
  - general
  - debugging
  - optimizacion
  - configuracion
  - datos
  - mantenimiento
  - documentacion
  - version_control
  - backup
```

## Classification Algorithm

### Pseudo-Code for Template Selection

```javascript
// Specialized classification algorithm for dtic-BKPs
function selectTemplate(userPrompt) {
    const promptLower = userPrompt.toLowerCase();
    let bestTemplate = templates.base_universal;
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

        // Bonus for subcategory match
        if (template.subcategory && promptLower.includes(template.subcategory)) {
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

### Base Universal Template

**ID:** DTIC-BASE-001  
**Category:** general/universal  
**Priority:** 10  

**Keywords:** general, universal, base, cualquier  
**Patterns:** cualquier tarea, general, sin especificar  

**Template Content:**
```
**IDIOMA: ESPAÑOL**
**CONTEXTO: Desarrollo dtic-BKPs (Ruby-based backup processing system)**
**TAREA: [Descripción específica de la tarea]**
**SISTEMA: Procesadores modulares para respaldos XenServer y Proxmox**

Instrucciones detalladas en español...

## Consideraciones Generales
- Stack: Ruby-based backup processing system
- Dependencias: rclone, pv, tar, gzip, screen
- Arquitectura: Modular con procesadores separados
- Funcionalidad core: Procesamiento automatizado de respaldos
- Sistema operativo: Linux
- Comentarios en español obligatorios
- Manejo de errores contextual
- Logging automático de operaciones
```

### Documentación Workflow Template

**ID:** DTIC-DOC-001  
**Category:** documentacion/workflow  
**Priority:** 1  

**Keywords:** documentar, bitacora, tareas completadas, versionado, commit, verificacion, changelog  
**Patterns:** documentar avance, tareas completadas, versionado, commit, changelog, verificacion, bitacora de desarrollo, documentar progreso, fase de documentacion  

**Template Content:**
```
**IDIOMA: ESPAÑOL**
**CONTEXTO: Documentación y Workflow DTIC Bitácoras (4 Fases)**
**TAREA: Documentar avance de desarrollo y aplicar workflow de versionado**
**MÓDULOS: Tareas Completadas, Versionado, Commits, Verificación**
**PLANTILLA_ID: DTIC-DOC-001**

## Workflow de Documentación (4 Fases)
Implementa el proceso completo de documentación de avances en español.

### Fase 1 — Tareas Completadas
Registra en español todas las tareas completadas desde el último registro.
Crea un archivo en el directorio _tareasTerminadas siguiendo el formato:

**Formato:** `YYYYMMDD_HHMMSS_[descripcion].md`

**El archivo debe incluir:**
- Resumen claro de la tarea completada (antes llamado "Task Completed"), traducido y redactado en español
- Análisis de acciones por módulo, redactado en español
- Detalle de cambios, mejoras y soluciones aplicadas
- Estado final del sistema y próximas tareas recomendadas

### Fase 2 — Versionado
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

### Fase 3 — Verificación
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

### Fase 4 — Commit
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

### Debugging Template

**ID:** DTIC-DEBUG-001  
**Category:** debugging/backup_debugging  
**Priority:** 1  

**Keywords:** debug, error, problema, ruby, rclone, backup, procesamiento, fallo, troubleshoot, logs, dticBKPs.log, xva, proxmox  
**Patterns:** debug backup, error procesamiento, problema rclone, ruby error, backup falló, logs dtic-BKPs, error xva, problema proxmox  

**Template Content:**
```
**IDIOMA: ESPAÑOL**
**CONTEXTO: Debugging DTIC-BKPs (Sistema de procesamiento de respaldos Ruby)**
**TAREA: Resolver error específico en [procesador específico]**
**MÓDULOS: dticBKPs_app.rb, procesadores, rclone, logs**
**PLANTILLA_ID: DTIC-DEBUG-001**

## Análisis de Errores de Respaldos
Estoy experimentando el siguiente error en el procesamiento de respaldos:
```
[paste del error aquí]
```

### Contexto del Error
- **Módulo afectado:** [dticBKPs_app.rb|proc_syncXEN.rb|proc_syncPmox.rb|sync_rclone.rb]
- **Tipo de procesamiento:** [xva|proxmox_log_notes|rclone_sync]
- **Archivo donde ocurre:** [ruta del archivo Ruby]
- **Acción que lo provoca:** [descripción del proceso fallido]
- **Comportamiento esperado:** [qué debería suceder]
- **Estado del sistema:** [Ruby version, rclone instalado, permisos]
- **Archivos de respaldo:** [.xva files|Proxmox backup sets|rclone remotes]
- **Sistema operativo:** Linux
- **Logs disponibles:** [dtic-BKPs.log path]

### Metodología de Debugging de Respaldos
Explica en español:

1. **Causa raíz del error**
    - Análisis del log dticBKPs.log
    - Verificación de dependencias (Ruby, rclone, tar, gzip)
    - Chequeo de permisos de archivos y directorios
    - Validación de configuración de tareas

2. **Solución paso a paso**
    - Corrección de rutas de origen/destino
    - Verificación de conectividad rclone
    - Ajuste de configuración de tareas
    - Testing de procesadores individuales

3. **Código corregido con comentarios**
    - Código Ruby funcional corregido
    - Explicación de cambios en procesadores
    - Manejo de edge cases en respaldos

4. **Prevención de errores similares**
    - Validaciones adicionales en configuración
    - Checks de integridad de archivos
    - Logging mejorado para troubleshooting
    - Tests automatizados para procesadores

5. **Consideraciones de testing**
    - Casos de prueba para diferentes tipos de respaldo
    - Validación de archivos procesados
    - Verificación de sincronización rclone

### Herramientas de Debugging de Respaldos
```bash
# Verificación de dependencias
ruby --version
rclone version
which tar gzip pv

# Debugging del script Ruby
ruby -c dticBKPs_app.rb  # Syntax check
ruby -d dticBKPs_app.rb  # Debug mode

# Análisis de logs
tail -f logs/dtic-BKPs.log
grep "ERROR" logs/dtic-BKPs.log
grep "WARN" logs/dtic-BKPs.log

# Testing de rclone
rclone listremotes
rclone ls remote:path/

# Verificación de archivos de respaldo
file /path/to/backup.xva
ls -la /path/to/proxmox/backup/
tar -tzf /path/to/backup.tar.gz

# Debugging de procesadores específicos
ruby -e "require './fxs/proc_syncXEN.rb'; test_function()"
ruby -e "require './fxs/sync_rclone.rb'; test_rclone_sync()"
```

### Logging y Monitoring del Sistema
- Archivo de log principal: `logs/dtic-BKPs.log`
- Niveles de logging: INFO, WARN, ERROR
- Rotación diaria de logs automática
- Estadísticas de ejecución por tarea
- Alertas para operaciones fallidas

### Problemas Comunes y Soluciones

#### Error de Conectividad rclone
```bash
# Verificar configuración rclone
rclone config show remote_name

# Test de conectividad
rclone ls remote_name:/

# Solución: Reconfigurar remote
rclone config update remote_name
```

#### Error en Procesamiento XVA
```ruby
# Verificar archivo XVA
def verificar_archivo_xva(ruta_archivo)
  unless File.exist?(ruta_archivo)
    log :error, "Archivo XVA no encontrado: #{ruta_archivo}"
    return false
  end

  # Verificar que sea un archivo XVA válido
  # (lógica de verificación específica)

  true
end
```

#### Error en Backup Proxmox
```bash
# Verificar estructura de backup Proxmox
ls -la /path/to/proxmox/backup/
# Debería contener: .log, .notes, archivos de datos

# Verificar archivo .notes
cat /path/to/proxmox/backup/*.notes
```

Proporciona solución completa con código funcional y debugging específico para respaldos.
```

## Integration Mechanisms

### Framework Integration

This framework integrates with automation systems through:

1. **Prompt Analysis:** Automatic extraction of keywords and patterns from user inputs.
2. **Template Matching:** Scoring-based selection of most appropriate template for backup operations.
3. **Response Generation:** Structured output with plan proposal and confirmation for dtic-BKPs tasks.
4. **Extension Support:** Modular design allowing custom templates and categories for backup processing.

### Structured Request Format

Recognized format for prioritized processing in dtic-BKPs:

```
[REQUEST]
[Task description related to backup processing]
Use [_prompts/prompts_app_dtic-BKPs.md] for this request.
```

**System Behavior:**
- Automatic detection of [REQUEST] format
- Priority boost for specified framework file
- Mandatory plan proposal and confirmation for backup operations

**Response Structure:**
```markdown
**REQUEST RECOGNIZED**
**PRIORITY FILE:** [_prompts/prompts_app_dtic-BKPs.md]

## Proposed Execution Plan
[Step-by-step details for backup task]

Confirm execution? (Yes/No)
```

## Extension Guidelines

### Adding New Templates

1. **Define Template Structure:**
   - Unique ID (format: DTIC-CATEGORY-XXX)
   - Category and subcategory related to backup operations
   - Priority level (1-10, lower = higher priority)
   - Keywords array in Spanish
   - Patterns array for backup-specific tasks
   - Description in Spanish

2. **Update Catalog:**
   - Add to `templates` section in YAML
   - Include in `categories` list if new
   - Ensure compatibility with dtic-BKPs system

3. **Test Integration:**
   - Verify classification algorithm selects correctly
   - Ensure response format consistency
   - Test with actual backup processing scenarios

### Framework Extensions

Extensions can be added via:

- **YAML Metadata:** Update `extensions` array in frontmatter
- **Template Additions:** Append new templates to catalog for backup operations
- **Category Expansions:** Add new categories as needed for backup processing
- **Algorithm Modifications:** Customize scoring logic for specific backup domains

### Best Practices

- Maintain keyword/pattern relevance for backup tasks
- Use consistent ID naming conventions (DTIC-*)
- Test extensions across different backup prompt types
- Document extension purposes and usage in Spanish

---

## Communication Preferences

This framework implements a dual-language approach for optimal efficiency in the dtic-BKPs backup processing system:

- **User Interactions:** All user-facing communications, prompts, responses, documentation, and interactions must be conducted exclusively in Spanish
- **Internal Processing:** Technical operations, backend processing, system logs, and internal communications can remain in English for efficiency
- **Language Policy Clarification:**
  - Spanish-only enforcement for all user-facing elements related to backup operations
  - English allowed for backend processing and technical operations
- **Automatic Detection:** System automatically detects language context and applies appropriate processing for backup tasks
- **Fallback Mechanisms:**
  - For user inputs: Automatic translation to Spanish where possible, rejection with correction instructions
  - For internal processing: English processing maintained for technical efficiency in backup scripts
- **Enforcement Rules:**
  - All user-generated content, templates, and responses must be in Spanish
  - User inputs validated for Spanish language compliance
  - Documentation, help text, and system messages provided exclusively in Spanish
  - Backend processing, logging, and technical operations in English
- **Impact on System Operations:**
  - Prompt interpretation: User prompts processed in Spanish context, internal logic in English
  - Response generation: User responses generated in Spanish, internal responses in English
  - System operations: User-facing operations in Spanish, backend operations in English

---

## Version History

- **Version 1.1.0:** 2025-11-14 - Restructured to align with general framework format, preserving dtic-BKPs specific content
- **Version 1.0.0:** Initial implementation of dtic-BKPs specialized template framework
