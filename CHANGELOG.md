# REGISTRO DE CAMBIOS - DTIC Bitácoras

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
y este proyecto se adhiere al [Versionado Semántico](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-11-04

### Added
- **Arquitectura Completa**: Migración completa de PHP a React/Node.js/PostgreSQL
- **Sistema de Autenticación JWT**: Login seguro con roles y permisos (Admin, Técnico, Visualizador)
- **Dashboard Interactivo**: Estadísticas dinámicas conectadas a APIs en tiempo real
- **Gestión de Entidades CRUD**: Técnicos, Recursos, Usuarios Asignados, Tareas
- **Interfaz Modular YAML-driven**: Configuración dinámica de entidades vía archivos YAML
- **APIs RESTful Completas**: Endpoints para todas las operaciones CRUD
- **Base de Datos PostgreSQL**: Esquema normalizado con datos de ejemplo
- **Sistema de Navegación React**: Rutas protegidas con React Router
- **Interfaz Responsive**: Bootstrap 5 con diseño moderno y animaciones
- **Panel de Confirmaciones Inteligente**: Sistema contextual para acciones de eliminación
- **Documentación Completa**: README detallado con arquitectura y guías de desarrollo
- **Scripts de Automatización**: Setup, instalación y despliegue automatizados
- **Configuración Docker**: Contenedores para desarrollo y producción

### Changed
- **Migración Tecnológica**: De arquitectura PHP/MySQL a React/Node.js/PostgreSQL
- **Estructura del Proyecto**: Reorganización completa siguiendo mejores prácticas
- **Sistema de Estados**: De manejo manual a Zustand para estado global
- **Configuración**: De archivos PHP a configuración YAML modular

### Fixed
- **Errores de Formateo**: Corrección de funciones faltantes en configuraciones
- **Problemas de Conectividad**: Resolución de errores 500 en APIs
- **Referencias Globales**: Exposición correcta de funciones en window object
- **Sintaxis TypeScript**: Corrección de errores de compilación en async/await

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
