# DTIC Bitácoras - Sistema de Gestión Integral

## 📋 Descripción del Sistema

DTIC Bitácoras es un sistema web completo de gestión de recursos tecnológicos y tareas para el Departamento de Tecnología de la Información y Comunicación (DTIC). Desarrollado con tecnologías modernas, permite administrar eficientemente el inventario de hardware/software, asignar recursos a usuarios, gestionar tareas técnicas y mantener un registro completo de todas las operaciones.

### 🎯 Propósito y Alcance

El sistema está diseñado para:
- **Gestión de Recursos**: Controlar inventario de hardware, software, equipos de red y herramientas
- **Administración de Personal**: Gestionar técnicos del DTIC con diferentes roles y permisos
- **Asignación de Recursos**: Vincular recursos tecnológicos con usuarios finales
- **Seguimiento de Tareas**: Administrar y monitorear tareas técnicas asignadas a técnicos
- **Auditoría Completa**: Mantener registro detallado de todas las operaciones del sistema
- **Reportes y Estadísticas**: Generar informes sobre el estado del inventario y rendimiento

## 🚀 Inicio Rápido

### Opción 1: Usando Scripts Automatizados (Recomendado)

```bash
# Configuración inicial
./setup.sh

# Instalación y despliegue interactivo
./install.sh
```

### Opción 2: Usando Make

```bash
# Configuración inicial
make setup

# Despliegue completo
make up

# Ver estado
make status

# Ver logs
make logs
```

### Opción 3: Usando Docker Compose Manual

```bash
# Clonar el repositorio
git clone <repository-url>
cd dtic-bitacoras-php/_app-npm

# Ejecutar la aplicación completa
docker-compose up --build

# Acceder a la aplicación
# Frontend: http://localhost:5173
# Backend API: http://localhost:3001
# Base de datos: localhost:5432
```

## 🔧 Configuración para Despliegue Remoto

### 1. Variables de Entorno

Copia el archivo de ejemplo y configura tus variables:

```bash
cp .env.example .env
# Edita .env según tus necesidades
```

### 2. Configuración por Entorno

El archivo `docker-compose.override.yml` permite personalizar la configuración:

```yaml
# Variables disponibles en .env
POSTGRES_PORT=5432
API_PORT=3001
FRONTEND_PORT=5173
NODE_ENV=production
# ... etc
```

### 3. Despliegue en Producción

```bash
# Configurar variables de producción en .env
NODE_ENV=production
VITE_API_URL=https://tu-dominio.com/api

# Desplegar
make up
```

## 🏗️ Arquitectura del Sistema

### Arquitectura General

El sistema sigue una arquitectura de **3 capas** con contenedores Docker:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │     Backend      │    │   Database      │
│   React/Vite    │◄──►│  Node.js/Express │◄──►│  PostgreSQL     │
│   Puerto 5173   │    │   Puerto 3001    │    │   Puerto 5432   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Componentes Principales

#### 🖥️ Frontend (React + Vite)
- **Framework**: React 18 con TypeScript
- **Estado Global**: Zustand para gestión de estado
- **UI Components**: Bootstrap + FontAwesome
- **Rutas**: React Router con protección de rutas
- **Configuración**: Sistema de entidades dinámicas vía YAML

#### 🚀 Backend (Node.js + Express)
- **Runtime**: Node.js 18 con Alpine Linux
- **Framework**: Express.js con middleware avanzado
- **Base de Datos**: PostgreSQL con pool de conexiones
- **Autenticación**: JWT con bcrypt para hashing
- **API**: RESTful con validación de datos
- **Seguridad**: Helmet, CORS, Rate Limiting

#### 🗄️ Base de Datos (PostgreSQL)
- **Motor**: PostgreSQL 15
- **Esquema**: `dtic` con tablas normalizadas
- **Índices**: Optimizados para búsquedas comunes
- **Auditoría**: Triggers automáticos para `updated_at`
- **Datos de Ejemplo**: Incluye usuarios y recursos de prueba

### Entidades del Sistema

#### 👥 Técnicos
Los **técnicos** son los profesionales especializados del DTIC que resuelven las tareas asignadas al departamento. Son los responsables directos de ejecutar y completar las actividades del sistema.

**Características principales:**
- **ID único**: Identificador único del técnico
- **Información personal**: Nombre, apellido, email, teléfono
- **Rol**: Administrador, Técnico, Visualizador
- **Departamento**: Área específica dentro del DTIC
- **Estado**: Activo, Inactivo
- **Tareas asignadas**: Número y lista de tareas bajo su responsabilidad
- **Historial de actividad**: Registro de tareas completadas y en progreso
- **Permisos**: Nivel de acceso al sistema según su rol

**Roles definidos:**
- **Administrador**: Acceso completo, gestión de usuarios y configuración
- **Técnico**: Ejecución de tareas, gestión de recursos asignados
- **Visualizador**: Solo lectura, acceso a reportes y consultas

#### 📦 Recursos
Los **recursos** son los elementos físicos o digitales que utiliza el DTIC para realizar sus tareas operativas. Cada recurso tiene características específicas y puede estar asignado a usuarios para su utilización.

**Características principales:**
- **ID único**: Identificador alfanumérico único (ej: RES-001)
- **Nombre**: Descripción clara del recurso
- **Categoría**: Clasificación jerárquica (Hardware, Software, Redes, Seguridad, Herramientas)
- **Estado**: Disponible, Asignado, Mantenimiento, Retirado
- **Ubicación**: Lugar físico donde se encuentra el recurso
- **Información técnica**: Modelo, serie, especificaciones técnicas
- **Historial de uso**: Registro de tareas en las que ha sido utilizado
- **Última tarea**: Información de la tarea más reciente donde participó

**Ejemplos de recursos:**
- Laptops, proyectores, servidores (Hardware)
- Licencias de software, antivirus (Software)
- Routers, switches, cables (Redes)
- Certificados, firewalls (Seguridad)
- Kits de herramientas, testers (Herramientas)

#### 👤 Usuarios Relacionados
Los **usuarios** son las personas que trabajan con los recursos del DTIC en sus actividades diarias. A diferencia de los técnicos, no resuelven tareas del sistema sino que utilizan los recursos relacionados para realizar su trabajo operativo.

**Características principales:**
- **ID único**: Identificador único del usuario
- **Información personal**: Nombre, apellido, email, teléfono
- **Rol operativo**: Operador, Supervisor, Analista, Invitado
- **Departamento**: Área específica donde opera
- **Estado**: Activo, Inactivo
- **Recursos relacionados**: Lista de recursos bajo su responsabilidad
- **Historial de uso**: Registro de recursos utilizados

**Roles operativos:**
- **Operador**: Uso básico de recursos asignados
- **Supervisor**: Coordinación de recursos y supervisión de operadores
- **Analista**: Análisis de datos y reportes usando recursos específicos
- **Invitado**: Acceso limitado a recursos específicos por tiempo determinado

#### 📋 Tareas
Las **tareas** son las actividades específicas que debe realizar el DTIC, asignadas a técnicos para su resolución. Cada tarea tiene un ciclo de vida completo desde su creación hasta su finalización.

**Características principales:**
- **ID único**: Identificador alfanumérico único (ej: TSK-001)
- **Título**: Descripción breve de la tarea
- **Descripción**: Detalles completos de lo que se debe realizar
- **Estado**: Pendiente, En Progreso, Completada, Cancelada
- **Prioridad**: Baja, Media, Alta, Urgente
- **Técnico asignado**: Profesional responsable de la ejecución
- **Fechas**: Creación, inicio, vencimiento, finalización
- **Historial de actividad**: Registro detallado de todos los movimientos
- **Recursos utilizados**: Lista de recursos que participaron en la tarea

**Estados del ciclo de vida:**
- **Pendiente**: Esperando asignación de técnico
- **En Progreso**: Siendo ejecutada por el técnico asignado
- **Completada**: Finalizada exitosamente
- **Cancelada**: Terminada sin completar por diversos motivos

#### 📊 Historial de Auditoría
El **historial de auditoría** registra todas las acciones realizadas en el sistema para mantener un registro completo de cambios y actividades.

**Características principales:**
- **Usuario**: Quién realizó la acción
- **Acción**: Tipo de operación (crear, modificar, eliminar, consultar)
- **Entidad**: Objeto afectado (tarea, recurso, usuario, etc.)
- **Fecha/Hora**: Timestamp preciso de la acción
- **Detalles**: Información específica de lo que cambió
- **IP**: Dirección desde donde se realizó la acción

#### 📈 Reportes y Análisis
Los **reportes** son consultas estructuradas que permiten analizar el estado y rendimiento del sistema DTIC Bitácoras.

**Tipos de reportes:**
- **Tareas**: Estado, productividad, tiempos de resolución
- **Recursos**: Utilización, disponibilidad, mantenimiento
- **Usuarios**: Actividad, asignaciones, rendimiento
- **Sistema**: Estadísticas generales, logs de auditoría

### Funcionalidades Clave

#### 🔐 Sistema de Autenticación
- Login seguro con JWT
- Roles y permisos granulares
- Cambio de contraseña
- Sesiones persistentes

#### 📊 Dashboard y Estadísticas
- Métricas en tiempo real
- Gráficos de estado de recursos
- Contadores de tareas por estado
- Información consolidada del sistema

#### 🔍 Gestión Dinámica de Entidades
- Sistema configurable vía archivos YAML
- Formularios dinámicos
- Tablas con filtros y búsqueda
- Modales para acciones específicas

#### 📈 Reportes y Análisis
- Estados de proyectos
- Calendarios de tareas
- Reportes personalizados
- Exportación de datos

## 📁 Estructura del Proyecto

```
_app-npm/
├── backend/                          # API REST Node.js/Express
│   ├── src/
│   │   ├── routes/                  # Endpoints por entidad
│   │   │   ├── auth.js             # Autenticación
│   │   │   ├── tecnicos.js         # Gestión de técnicos
│   │   │   ├── recursos.js         # Gestión de recursos
│   │   │   ├── tareas.js           # Gestión de tareas
│   │   │   └── usuarios_relacionados.js # Gestión de usuarios
│   │   ├── middleware/             # Middleware de seguridad
│   │   │   └── auth.js            # Verificación JWT
│   │   └── server.js              # Servidor principal
│   ├── Dockerfile                  # Contenedor backend
│   └── package.json               # Dependencias Node.js
├── frontend/                        # SPA React/Vite
│   ├── src/
│   │   ├── components/             # Componentes reutilizables
│   │   │   ├── common/            # Componentes genéricos
│   │   │   ├── layout/            # Layout y navegación
│   │   │   └── auth/              # Componentes de auth
│   │   ├── pages/                 # Páginas principales
│   │   │   ├── Dashboard.tsx      # Dashboard principal
│   │   │   ├── EntityPage.tsx     # Páginas dinámicas
│   │   │   ├── Login.tsx          # Página de login
│   │   │   └── Reportes.tsx       # Reportes del sistema
│   │   ├── stores/                # Estado global (Zustand)
│   │   │   ├── authStore.ts       # Estado de autenticación
│   │   │   └── genericEntityStore.ts # Estado de entidades
│   │   ├── config/                # Configuración
│   │   │   └── entities.yml       # Definición de entidades
│   │   └── utils/                 # Utilidades
│   ├── Dockerfile                 # Contenedor frontend
│   ├── package.json              # Dependencias frontend
│   └── vite.config.ts            # Configuración Vite
├── docker/                         # Configuración Docker
│   └── init.sql                   # Inicialización BD
├── docker-compose.yml             # Orquestación de servicios
├── docker-compose.override.yml    # Override por entorno
├── .env.example                   # Variables de entorno
├── setup.sh                       # Script de configuración inicial
├── install.sh                     # Script de instalación y despliegue
├── Makefile                       # Comandos Make
└── README.md                      # Esta documentación
```

## 🛠️ Comandos Disponibles

### Scripts Automatizados

```bash
./setup.sh          # Configuración inicial
./install.sh        # Menú interactivo de instalación y despliegue
```

### Comandos Make

```bash
make help           # Ver todos los comandos disponibles
make setup          # Configuración inicial
make up             # Iniciar aplicación
make down           # Detener aplicación
make restart        # Reiniciar aplicación
make logs           # Ver logs
make status         # Ver estado de contenedores
make health-check   # Verificar estado de servicios
make backup         # Crear backup de BD
make restore        # Restaurar backup de BD
make clean          # Limpiar contenedores y volúmenes
```

### Docker Compose

```bash
docker-compose up -d              # Iniciar en background
docker-compose up --build         # Construir e iniciar
docker-compose down               # Detener
docker-compose logs -f            # Ver logs en tiempo real
docker-compose ps                 # Ver estado
docker-compose exec api sh        # Acceder al shell del API
docker-compose exec postgres bash # Acceder a PostgreSQL
```

## 🔍 Solución de Problemas

### Error "NetworkError when attempting to fetch resource"

1. **Verificar configuración CORS**: Asegurarse de que el backend permita el origen del frontend
2. **Verificar VITE_API_URL**: Confirmar que apunte al servidor backend correcto
3. **Verificar conectividad**: Probar que el backend esté ejecutándose y accesible

### Puertos Ocupados

Si los puertos por defecto están ocupados, modificalos en `.env`:

```env
POSTGRES_PORT=5433
API_PORT=3002
FRONTEND_PORT=5174
```

### Problemas de Base de Datos

```bash
# Ver logs de PostgreSQL
make logs-db

# Acceder a la base de datos
make dev-db

# Recrear base de datos
docker-compose down -v
make up
```

## 🔒 Seguridad

### Producción

- Cambia `JWT_SECRET` por una clave segura
- Cambia `POSTGRES_PASSWORD` por una contraseña fuerte
- Configura `NODE_ENV=production`
- Usa HTTPS en producción
- Configura firewall para exponer solo los puertos necesarios

### Variables Sensibles

Nunca commits las siguientes variables al repositorio:
- `JWT_SECRET`
- `POSTGRES_PASSWORD`
- Cualquier clave API

## 📊 Monitoreo

### Health Checks

```bash
make health-check
```

### Logs

```bash
make logs           # Todos los logs
make logs-api       # Solo API
make logs-frontend  # Solo frontend
make logs-db        # Solo base de datos
```

### Estado de Contenedores

```bash
make status
```

## 🔄 Backup y Restauración

### Crear Backup

```bash
make backup
# Los backups se guardan en ./backups/
```

### Restaurar Backup

```bash
make restore
# Selecciona el archivo de backup del listado
```

## 🐳 Docker

### Imágenes

- **PostgreSQL**: `postgres:15-alpine`
- **API**: `node:18-alpine` con aplicación Node.js
- **Frontend**: `node:18-alpine` con aplicación React/Vite

### Volúmenes

- `postgres_data`: Datos persistentes de PostgreSQL
- `./backups`: Backups de base de datos
- `./logs`: Logs de la aplicación

### Redes

- `dtic_network`: Red interna para comunicación entre servicios

## 🧪 Desarrollo y Testing

### Entorno de Desarrollo

#### Configuración Inicial
```bash
# Clonar repositorio
git clone <repository-url>
cd dtic-bitacoras-php/_app-npm

# Configuración automática
./setup.sh

# O configuración manual
make setup
```

#### Ejecución en Modo Desarrollo
```bash
# Todos los servicios
make up

# Solo frontend (puerto 5173)
make dev-frontend

# Solo backend (puerto 3001)
make dev-backend

# Acceder a base de datos
make dev-db
```

#### Desarrollo con Hot Reload
- **Frontend**: Cambios automáticos con Vite HMR
- **Backend**: Reinicio automático con nodemon
- **Base de Datos**: Persistente con volúmenes Docker

### Testing

#### Ejecutar Tests
```bash
# Suite completa
make test

# Tests específicos
make test-backend   # Tests del backend
make test-frontend  # Tests del frontend

# Tests con coverage
make test-coverage
```

#### Tipos de Tests
- **Unit Tests**: Componentes individuales y funciones utilitarias
- **Integration Tests**: Endpoints de API y interacciones con BD
- **E2E Tests**: Flujos completos de usuario con Playwright/Cypress

### Debugging

#### Logs en Tiempo Real
```bash
# Todos los servicios
make logs

# Servicio específico
make logs-api       # Backend
make logs-frontend  # Frontend
make logs-db        # Base de datos
```

#### Acceso a Contenedores
```bash
# Shell en backend
docker-compose exec api sh

# PostgreSQL CLI
docker-compose exec postgres psql -U dtic_user -d dtic_bitacoras

# Inspeccionar red
docker network inspect dtic_bitacoras_dtic_network
```

### Base de Datos de Desarrollo

#### Conexión Directa
```bash
# Desde host
psql -h localhost -p 5432 -U dtic_user -d dtic_bitacoras

# Desde contenedor
make dev-db
```

#### Datos de Prueba
La base de datos incluye datos de ejemplo:
- **7 Técnicos**: Admin, técnicos y visualizadores
- **6 Recursos**: Hardware, software y herramientas
- **5 Usuarios Relacionados**: Personal administrativo
- **Asignaciones**: Recursos vinculados a usuarios

#### Reset de Datos
```bash
# Recrear base de datos
make clean
make up

# O desde contenedor
docker-compose exec postgres psql -U dtic_user -d dtic_bitacoras -c "DROP SCHEMA dtic CASCADE; CREATE SCHEMA dtic;"
```

## 🤝 Contribución y Desarrollo

### Flujo de Trabajo

1. **Fork y Clone**
   ```bash
   git clone <tu-fork-url>
   cd dtic-bitacoras-php/_app-npm
   git checkout -b feature/nueva-funcionalidad
   ```

2. **Desarrollo**
   ```bash
   # Instalar dependencias
   make setup

   # Ejecutar en desarrollo
   make up

   # Tests continuos
   make test-watch
   ```

3. **Commits y Pull Request**
   ```bash
   git add .
   git commit -m "feat: descripción de la funcionalidad"
   git push origin feature/nueva-funcionalidad
   # Crear PR en GitHub
   ```

### Estándares de Código

#### Frontend (TypeScript/React)
- **Linter**: ESLint con reglas de Airbnb
- **Formatter**: Prettier
- **Tipos**: TypeScript estricto
- **Componentes**: Funcionales con hooks
- **Estado**: Zustand para estado global

#### Backend (Node.js)
- **Linter**: ESLint Node.js
- **Estructura**: MVC con separación de responsabilidades
- **Validación**: Joi para schemas de datos
- **Errores**: Manejo centralizado de errores
- **Logs**: Winston para logging estructurado

#### Base de Datos
- **Migrations**: Versionado de schema
- **Seeds**: Datos de prueba consistentes
- **Índices**: Optimización de consultas
- **Constraints**: Integridad referencial

### Documentación

#### Código
- **JSDoc**: Comentarios en funciones complejas
- **README**: Actualización de documentación
- **API Docs**: Swagger/OpenAPI para endpoints

#### Commits
- **Conventional Commits**: `feat:`, `fix:`, `docs:`, `refactor:`
- **Descripciones**: Claras y específicas
- **Issues**: Referencia a issues relacionados

## 📋 API Reference

### Endpoints Principales

#### Autenticación
```
POST   /api/auth/login              # Login de usuario
POST   /api/auth/logout             # Logout (cliente-side)
GET    /api/auth/verify             # Verificar token
```

#### Técnicos
```
GET    /api/tecnicos                # Listar técnicos
POST   /api/tecnicos                # Crear técnico
PUT    /api/tecnicos/:id            # Actualizar técnico
DELETE /api/tecnicos/:id            # Eliminar técnico
PATCH  /api/tecnicos/:id/toggle     # Activar/desactivar
```

#### Recursos
```
GET    /api/recursos                # Listar recursos
POST   /api/recursos                # Crear recurso
PUT    /api/recursos/:id            # Actualizar recurso
DELETE /api/recursos/:id            # Eliminar recurso
POST   /api/recursos/:id/assign     # Asignar a usuario
DELETE /api/recursos/:id/unassign   # Desasignar
```

#### Tareas
```
GET    /api/tareas                  # Listar tareas
POST   /api/tareas                  # Crear tarea
PUT    /api/tareas/:id              # Actualizar tarea
DELETE /api/tareas/:id              # Eliminar tarea
```

#### Usuarios Relacionados
```
GET    /api/usuarios_relacionados      # Listar usuarios
POST   /api/usuarios_relacionados      # Crear usuario
PUT    /api/usuarios_relacionados/:id  # Actualizar usuario
DELETE /api/usuarios_relacionados/:id  # Eliminar usuario
```

### Configuración Dinámica
```
GET    /api/config/entities.yml     # Configuración de entidades
```

## 🔧 Configuración Avanzada

### Variables de Entorno

| Variable | Descripción | Default |
|----------|-------------|---------|
| `NODE_ENV` | Ambiente (development/production) | development |
| `PORT` | Puerto del backend | 3001 |
| `DATABASE_URL` | URL de conexión PostgreSQL | - |
| `JWT_SECRET` | Clave secreta para JWT | - |
| `JWT_EXPIRES_IN` | Expiración del token | 24h |
| `CORS_ORIGIN` | Origen permitido para CORS | * |

### Docker Compose Overrides

```yaml
# docker-compose.override.yml
services:
  api:
    environment:
      NODE_ENV: production
      JWT_SECRET: ${JWT_SECRET}
    ports:
      - "80:3001"

  postgres:
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}
```

## 📊 Monitoreo y Métricas

### Health Checks
- **Endpoint**: `GET /health`
- **Base de Datos**: Verificación de conexión
- **Servicios**: Estado de dependencias

### Métricas de Rendimiento
- **Response Times**: Tiempos de respuesta por endpoint
- **Database Queries**: Consultas lentas y optimización
- **Memory Usage**: Uso de memoria por contenedor
- **Error Rates**: Tasa de errores por servicio

## 🚨 Solución de Problemas Comunes

### Problemas de Conexión
```bash
# Verificar servicios
docker-compose ps

# Logs de errores
make logs

# Reiniciar servicios
make restart
```

### Problemas de Base de Datos
```bash
# Verificar conexión
make health-check

# Reset de datos
make clean && make up
```

### Problemas de Frontend
```bash
# Limpiar cache
rm -rf node_modules/.vite
make dev-frontend
```

## 📞 Soporte y Contacto

### Canales de Soporte
- **Issues**: GitHub Issues para bugs y features
- **Discussions**: GitHub Discussions para preguntas
- **Wiki**: Documentación detallada en GitHub Wiki

### Reportar Bugs
1. Verificar si ya existe el issue
2. Incluir pasos para reproducir
3. Adjuntar logs relevantes
4. Especificar versión y entorno

### Solicitar Features
1. Describir la funcionalidad deseada
2. Explicar el caso de uso
3. Proponer implementación si es posible

## 📚 Evolución del Proyecto

### Antecedentes
Este proyecto representa la evolución completa del sistema DTIC Bitácoras, desde un enfoque inicial basado en PHP/MySQL hasta la implementación actual con tecnologías modernas React/Node.js/PostgreSQL.

### Fases de Desarrollo

#### **Fase 1: Fundación PHP (2025-10)**
- **Arquitectura**: HTML/JS/PHP/MySQL con Docker
- **Alcance**: Desarrollo de interfaces básicas y configuración de contenedores
- **Estado**: ✅ Completado - Etapas 1 y 2 del plan original
- **Resultado**: Base sólida para la evolución tecnológica
- **Tareas Clave**: Configuración Docker, maquetación interfaz, auto-hide navbar

#### **Fase 2: Migración Tecnológica (2025-11)**
- **Arquitectura**: React/Node.js/PostgreSQL con Docker
- **Alcance**: Reimplementación completa con tecnologías modernas
- **Estado**: ✅ Completado - Sistema 100% funcional (v1.2.0)
- **Resultado**: Aplicación full-stack moderna y escalable
- **Tareas Clave**: APIs RESTful, autenticación JWT, gestión entidades CRUD

### Metodología de Desarrollo
El proyecto se desarrolló siguiendo una metodología estructurada:

1. **Análisis y Planificación**: Definición de entidades y arquitectura
2. **Implementación por Etapas**: Desarrollo incremental con hitos claros
3. **Migración Tecnológica**: Transición de PHP a Node.js/React
4. **Optimización Continua**: Mejoras en scripts, documentación y procesos

### Tecnologías Evolutivas
- **Inicial**: PHP 8.1, MySQL 8.0, HTML5/CSS3/JS, Bootstrap 5
- **Actual**: React 18, Node.js 18, PostgreSQL 15, TypeScript, Docker

### 📋 Resumen de Tareas Completadas

#### **Estimación de Versión (2025-11-04)**
- ✅ Análisis completo de evolución del proyecto
- ✅ Determinación de versión 1.1.0 según Semantic Versioning
- ✅ Justificación técnica por componentes MAJOR/MINOR/PATCH
- ✅ Planificación de versiones futuras (1.2.0, 1.3.0, 2.0.0)

#### **Optimización de Scripts (2025-11-04)**
- ✅ Script app-run.sh completamente optimizado
- ✅ Modo dual: interactivo + parámetros start/stop/restart/status
- ✅ Verificación robusta de dependencias (Docker, docker-compose)
- ✅ Validación completa de conectividad PostgreSQL
- ✅ Cleanup automático de recursos Docker

#### **Reorganización de Documentación (2025-11-04)**
- ✅ CHANGELOG.md movido a _app-npm/ para centralización
- ✅ README.md histórico archivado en _basurero/ como referencia
- ✅ Estructura de documentación consolidada
- ✅ Navegabilidad mejorada para desarrolladores

#### **Enriquecimiento con Información Histórica (2025-11-04)**
- ✅ Sección "Entidades del Sistema" enriquecida con detalles técnicos
- ✅ Nueva sección "Evolución del Proyecto" documentada
- ✅ Información institucional completa del autor agregada
- ✅ Contexto académico de UTN FR La Rioja incorporado

---

## 👨‍💻 Autor y Desarrollo

**Desarrollado por:** Lic. Ricardo MONLA
**Institución:** Universidad Tecnológica Nacional - Facultad Regional La Rioja
**Departamento:** Departamento de Servidores, Dirección de TIC
**Proyecto:** Sistema DTIC Bitácoras v1.5.0
**Fecha:** Noviembre 2025

### Contacto
Para soporte técnico o consultas sobre el desarrollo del sistema, contactar al departamento DTIC de la UTN FR La Rioja.

## 🔄 Cambios Recientes y Mantenimiento

### Últimas Actualizaciones (2025-11-04)
- ✅ **Versión 1.1.0** establecida según Semantic Versioning
- ✅ **Script app-run.sh** completamente optimizado con modos duales
- ✅ **Documentación reorganizada** y centralizada en _app-npm/
- ✅ **Información histórica** incorporada y enriquecida
- ✅ **Identidad institucional** completa documentada

### Próximas Versiones Planificadas
- **v1.2.0**: Calendario interactivo completo + sistema de reportes
- **v1.3.0**: Notificaciones en tiempo real + filtros avanzados
- **v2.0.0**: Multi-tenancy + APIs públicas

### Mantenimiento y Soporte
- **Repositorio**: Gestión completa con Git y Conventional Commits
- **Documentación**: README.md + CHANGELOG.md actualizados
- **Scripts**: Automatización completa con app-run.sh optimizado
- **Soporte**: Departamento DTIC - UTN FR La Rioja

---

**Desarrollado por:** Lic. Ricardo MONLA
**Institución:** Universidad Tecnológica Nacional - Facultad Regional La Rioja
**Departamento:** Departamento de Servidores, Dirección de TIC
**Proyecto:** Sistema DTIC Bitácoras v1.5.0
**Última actualización:** Noviembre 2025