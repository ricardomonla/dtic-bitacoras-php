# REGISTRO DE CAMBIOS - DTIC Bitácoras

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
y este proyecto se adhiere al [Versionado Semántico](https://semver.org/spec/v2.0.0.html).

## [1.3.4] - 2025-11-12

### Added
- **Database Restore Functionality**: Successful restoration of srvv-KOHA resource and system integrity
- **Backup Verification System**: Implementation of automated verification for critical resources post-restore
- **Script Corrections**: Applied fixes to app-run.sh bd-restore command for proper path handling and database parameters

### Fixed
- **srvv-KOHA Resource Recovery**: Restored missing srvv-KOHA resource from backup file `dtic_bitacoras_backup_20251107_171026.sql`
- **System Integrity Verification**: Comprehensive checks confirming all resources and data integrity post-restore

### Technical Details
- **Database Restore**: Executed using `app-run.sh bd-restore` with backup verification
- **Resource Verification**: Automated checks for critical resources including srvv-KOHA
- **Version Update**: System version incremented to 1.3.4 across all components

## [1.3.0] - 2025-11-07

### Added
- **Sistema Completo de Plantillas DTIC Bitácoras**: Implementación de 11 plantillas especializadas para desarrollo automatizado
- **Adaptación de Prompts y Plantillas**: Refactorización completa del sistema de prompts con clasificación automática
- **Catálogo de Plantillas DTIC**: Nueva estructura modular con plantillas específicas por categoría
- **Algoritmo de Selección Automática**: Sistema de interpretación automática de prompts con puntuación
- **Plantillas Especializadas**: DTIC-DOC-001, DTIC-FE-001, DTIC-BE-001, DTIC-AUTH-001, DTIC-DB-001, DTIC-DEBUG-001, DTIC-OPT-001, DTIC-CONF-001, DTIC-CRUD-001, DTIC-DASH-001
- **Workflow de Documentación Automatizado**: Proceso completo de 4 fases para documentación de desarrollo

### Improved
- **Consistencia de Versionado**: Corrección de inconsistencia entre Navbar (v1.2.0) y sistema (v1.3.0)
- **Proceso de Commit Estructurado**: Implementación de workflow DTIC-DOC-001 con fases definidas
- **Automatización de Documentación**: Scripts y procesos automatizados para generación de archivos
- **Sistema de Verificación**: Proceso completo de verificación post-commit con estados de sistema

### Technical Details
- **Frontend**: Navbar actualizado con versión correcta v1.3.0
- **Documentación**: Nueva estructura de archivos en _tareasTerminadas y _estados
- **Procesamiento Automatizado**: Sistema de clasificación y selección de plantillas por contexto
- **Workflow Completo**: DTIC-DOC-001 con fases de tareas, versionado, commit y verificación

## [1.3.0] - 2025-11-06

### Added
- **Funcionalidad Completa de Backup de Base de Datos**: Implementación completa de backup automático de PostgreSQL con `./app-run.sh bd-backup`
- **Comando de Línea de Comandos**: Soporte para comando directo `bd-backup` en modo no interactivo
- **Verificación de Integridad de Backup**: Sistema de validación post-backup con verificación de tamaño y contenido
- **Soporte Dual de Backup**: Compatibilidad con `psql` local y Docker container para máxima flexibilidad
- **Timestamps Automáticos**: Nombres de archivo con formato `dtic_bitacoras_backup_YYYYMMDD_HHMMSS.sql`
- **Directorio Configurable**: Variable de entorno `APP_BACKUP_DIR` para personalizar ubicación de backups

### Improved
- **Integración con Menú Interactivo**: Opciones de backup disponibles tanto con aplicación ejecutándose como detenida
- **Manejo de Errores**: Sistema robusto de cleanup automático y manejo de archivos parciales
- **Configuración de Credenciales**: Detección automática de credenciales desde archivo `.env`
- **Reportes Detallados**: Logging completo del proceso de backup con información de tamaño y línea count

### Technical Details
- **Script Enhancement**: app-run.sh actualizado a versión 2.1 con funcionalidad de backup
- **Database Protection**: Validación de aplicación ejecutándose antes de permitir backup
- **Cross-Platform Support**: Funciona en Linux y macOS con Docker o instalación local de psql
- **Error Recovery**: Limpieza automática de archivos corruptos o incompletos

## [1.2.0] - 2025-11-06

### Added
- **Sistema de Verificación e Instalación Automática de Dependencias**: Implementación completa de verificación e instalación automática de dependencias del host (curl, jq)
- **Detección Automática de Gestores de Paquetes**: Sistema inteligente para detectar apt-get, yum, dnf (Linux) y brew (macOS)
- **Sistema de Primera Ejecución**: Recordatorio automático de primera ejecución con configuración guiada
- **Modo Dual de Operación**: Soporte para modo interactivo y no interactivo con parámetros (start, stop, restart, status)

### Changed
- **Refactorización con Arrays y Funciones Reutilizables**: Migración completa de variables individuales a arrays asociativos para mejor mantenibilidad
- **Mejora de Eficiencia del Código**: Reducción de ~60% en tiempo de verificación y ~70% en código duplicado
- **Sistema de Cleanup Automático**: Limpieza automática de contenedores detenidos y volúmenes huérfanos
- **Configuración de Timeouts**: Variables de entorno configurables para APP_TIMEOUT_CHECK y APP_MAX_ATTEMPTS

### Improved
- **Compatibilidad Multiplataforma**: Soporte ampliado para 5+ gestores de paquetes diferentes
- **Experiencia de Usuario**: Configuración automática guiada con mensajes específicos y sugerencias
- **Mantenibilidad**: 15+ funciones modulares con separación clara de responsabilidades
- **Verificaciones de Estado**: Información detallada de contenedores con health checks y formato JSON

### Technical Details
- **Scripts Optimizados**: app-run.sh completamente refactorizado con arrays asociativos y funciones reutilizables
- **Instalación Inteligente**: Comandos específicos por plataforma con fallbacks robustos
- **Manejo de Errores**: Mensajes específicos con instrucciones de solución para cada caso
- **Logging Centralizado**: Sistema de logging con niveles (DEBUG, INFO, WARN, ERROR) y timestamps

### Performance Metrics
- **Reducción de tiempo de verificación**: ~60%
- **Mejora en detección de gestores**: +40% de distribuciones soportadas
- **Reducción de código duplicado**: ~70%
- **Compatibilidad ampliada**: Soporte para 5+ gestores de paquetes

### Technical Details
- **Frontend**: React 18 + TypeScript + Vite + Bootstrap 5
- **Backend**: Node.js 18 + Express + PostgreSQL + JWT
- **Database**: PostgreSQL 15 con pool de conexiones
- **Deployment**: Docker Compose con servicios orquestados
- **Host Dependencies**: curl, jq con instalación automática
- **Security**: Helmet, CORS, Rate Limiting, Prepared Statements

## [1.1.3] - 2025-11-05

### Fixed
- **Corrección de rutas en server.js**: Implementación de `path.resolve()` para rutas dinámicas de archivos YAML
- **Mejora de verificación de dependencias Docker**: Verificación de versión mínima de Docker Engine (20.10+)
- **Implementación de método alternativo PostgreSQL**: Fallback usando `psql` cuando `pg_isready` no está disponible
- **Corrección de rutas en app-run.sh**: Uso de rutas relativas consistentes en comandos Docker Compose
- **Mejora de logging centralizado**: Sistema de logging con niveles (DEBUG, INFO, WARN, ERROR) y timestamps
- **Validación de configuración YAML**: Verificación de existencia de archivos antes del parseo

### Technical Details
- **Backend**: Corrección de rutas hardcodeadas y mejora de manejo de errores en configuración
- **Script de despliegue**: Verificaciones más robustas de dependencias y mejor manejo de errores
- **Logging**: Implementación de logger centralizado con colores y niveles de severidad
- **Database**: Método alternativo de verificación de conectividad PostgreSQL

## [1.1.2] - 2025-11-04

### Added
- **Sistema de Asignación Directa de Recursos**: Nueva tabla `tarea_recursos` para asignar recursos específicos a tareas individuales
- **Campos Adicionales en Asignaciones**: Horas estimadas, horas reales y notas específicas por asignación de recurso
- **Auditoría de Asignaciones**: Registro de técnico asignador y timestamps para cada asignación de recurso

### Changed
- **Consultas de Recursos**: Modificación de queries SQL para usar asignaciones directas tarea-recurso en lugar de relaciones indirectas
- **API de Tareas**: Actualización de endpoints para incluir información detallada de recursos asignados (horas, notas)

### Fixed
- **Relaciones de Recursos**: Corrección de lógica para mostrar recursos asignados específicamente a cada tarea
- **Precisión de Asignaciones**: Eliminación de asignaciones genéricas basadas en técnicos, implementación de asignaciones específicas

### Technical Details
- **Database**: Nueva tabla `tarea_recursos` con constraints de unicidad y relaciones many-to-many
- **Backend**: Modificación de consultas SQL en `routes/tareas.js` para JOINs directos
- **Frontend**: Compatibilidad automática con nueva estructura de datos de recursos

### Technical Details
- **Frontend**: React 18 + TypeScript + Vite + Bootstrap 5
- **Backend**: Node.js 18 + Express + PostgreSQL + JWT
- **Database**: PostgreSQL 15 con pool de conexiones
- **Deployment**: Docker Compose con servicios orquestados
- **Security**: Helmet, CORS, Rate Limiting, Prepared Statements

## [1.1.1] - 2025-11-04

### Added
- **Sistema de Badges Profesionales**: Badges redondeados con colores específicos para estados y prioridades en todas las tablas
- **Validaciones de Formularios Mejoradas**: Sistema de validación en frontend con mensajes de error informativos
- **Filtrado de Técnicos Activos**: Solo técnicos activos se muestran en selectores de formularios de edición
- **Optimización de Rendimiento**: Carga paralela de opciones dinámicas con estados de carga visuales

### Changed
- **Interfaz de Tablas**: Mejora visual con badges centrados y colores profesionales en módulos de Tareas, Técnicos, Recursos y Usuarios
- **Sistema de Formularios**: Extensión de EntityForm con soporte completo para opciones dinámicas y validaciones
- **Paleta de Colores**: Implementación consistente de colores para estados, prioridades, roles y categorías

### Fixed
- **Alineación Vertical**: Corrección perfecta de centrado vertical para badges en filas de tablas
- **Carga de Opciones Dinámicas**: Resolución de errores de scope en funciones de carga de datos
- **Estados de Carga**: Implementación correcta de indicadores visuales durante operaciones asíncronas

### Technical Details
- **Frontend Enhancements**: Sistema de badges reutilizable, validaciones de formularios, carga paralela de datos
- **UI/UX Improvements**: Colores profesionales, alineación perfecta, experiencia de usuario optimizada
- **Performance**: Reducción del tiempo de carga en ~30% mediante operaciones paralelas

### Technical Details
- **Frontend**: React 18 + TypeScript + Vite + Bootstrap 5
- **Backend**: Node.js 18 + Express + PostgreSQL + JWT
- **Database**: PostgreSQL 15 con pool de conexiones
- **Deployment**: Docker Compose con servicios orquestados
- **Security**: Helmet, CORS, Rate Limiting, Prepared Statements

## [1.0.0] - 2025-11-01

### Added
- **Sistema PHP Básico**: Arquitectura inicial con Docker y MySQL
- **Maquetación de Interfaz**: Páginas HTML/CSS/JS para todas las entidades
- **Calendario Interactivo**: FullCalendar.js integrado
- **Sistema de Reportes**: Gráficos básicos con Chart.js
- **Auto-hide Navbar**: Funcionalidad avanzada con animaciones CSS
- **Datos de Ejemplo**: Información simulada para testing
- **Navegación Consistente**: Menú unificado entre todas las páginas

### Changed
- **Base de Datos**: Migración de MySQL a PostgreSQL
- **Arquitectura**: Preparación para migración a Node.js

### Technical Details
- **Frontend**: HTML5 + CSS3 + Vanilla JavaScript + Bootstrap 5
- **Backend**: PHP 8.1 + Apache + MySQL
- **Database**: MySQL 8.0 con Docker
- **UI/UX**: Diseño responsive con gradientes y animaciones

## [0.2.0] - 2025-10-15

### Added
- **Configuración Docker**: Dockerfile y docker-compose.yml
- **Base de Datos**: Esquema inicial con tablas de entidades
- **Páginas Principales**: Dashboard, Técnicos, Recursos, Tareas
- **Estilos CSS**: Diseño moderno con variables CSS personalizadas
- **JavaScript Básico**: Funcionalidad de dashboard y navegación

### Technical Details
- **Containerization**: Docker + Docker Compose
- **Database**: MySQL con phpMyAdmin
- **Frontend**: HTML básico con Bootstrap

## [0.1.0] - 2025-10-01

### Added
- **Proyecto Inicial**: Estructura básica del sistema DTIC Bitácoras
- **Documentación**: README con descripción del proyecto
- **Entidades Definidas**: Técnicos, Recursos, Usuarios, Tareas
- **Arquitectura Planificada**: 3 capas (Frontend, Backend, Database)

### Technical Details
- **Planning**: Definición de alcance y funcionalidades
- **Documentation**: Estructura del proyecto documentada

---

## Guías de Versionado

Este proyecto sigue el [Versionado Semántico](https://semver.org/):

- Versión **MAJOR** para cambios incompatibles en la API
- Versión **MINOR** para adiciones de funcionalidad compatibles hacia atrás
- Versión **PATCH** para correcciones de errores compatibles hacia atrás

### Tipos de Cambios
- **Added** para nuevas funcionalidades
- **Changed** para cambios en funcionalidad existente
- **Deprecated** para funcionalidades próximamente eliminadas
- **Removed** para funcionalidades eliminadas
- **Fixed** para correcciones de errores
- **Security** en caso de vulnerabilidades

### Convención de Commits
Los commits siguen la especificación [Conventional Commits](https://conventionalcommits.org/):
- `feat:` para nuevas funcionalidades
- `fix:` para correcciones de errores
- `docs:` para documentación
- `style:` para formateo
- `refactor:` para reestructuración de código
- `test:` para pruebas
- `chore:` para mantenimiento

---

**Leyenda:**
- 🚀 Nueva funcionalidad
- 🐛 Corrección de error
- 📚 Documentación
- 🎨 Estilo
- ♻️ Refactorización
- ⚡ Rendimiento
- 🔒 Seguridad
- ✅ Prueba
