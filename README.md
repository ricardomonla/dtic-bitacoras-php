# DTIC Bitácoras PHP - Arquitectura HTML/JS/PHP/MySQL

## Descripción del Proyecto

Este proyecto representa el desarrollo desde cero del sistema DTIC Bitácoras utilizando una arquitectura moderna basada en HTML, JavaScript, PHP y MySQL. El sistema está diseñado exclusivamente para el uso de técnicos autorizados del DTIC, implementando todas las funcionalidades requeridas con un enfoque en la escalabilidad, seguridad y facilidad de mantenimiento. Los usuarios externos no tienen acceso directo al sistema; solo los técnicos pueden gestionar tareas, recursos y eventos a través de una interfaz web segura.

**Autor:** Lic. Ricardo MONLA

## Metodología de Desarrollo

El proyecto se desarrollará siguiendo un estilo de programación autogenerativo, donde el código PHP genera dinámicamente el contenido HTML basado en estructuras de datos organizadas. Este enfoque permite fácil mantenimiento y actualización del contenido sin modificar directamente el HTML.

**Características del estilo de programación:**
- **Estructura modular**: Código dividido en archivos con responsabilidades claras
- **Generación dinámica de HTML**: Uso de funciones que retornan strings HTML con here-doc syntax
- **Arrays multidimensionales**: Organización de datos en estructuras jerárquicas
- **Constantes de configuración**: Definición de constantes para URLs, configuración y datos de aplicación
- **Comentarios distintivos**: Uso de «®» como delimitadores para secciones importantes
- **Nombres de variables concisos**: Preferencia por nombres cortos y descriptivos

El proyecto se desarrollará en etapas claramente definidas para asegurar una implementación ordenada y funcional:

### Etapa 1: Preparación del Entorno Docker ✅ COMPLETADA
Configuración completa del contenedor Docker con PHP, MySQL y permisos necesarios para el desarrollo.

#### Sub-items Completados:
- ✅ Dockerfile con PHP 8.1 y Apache
- ✅ docker-compose.yml con servicios MySQL y PHP
- ✅ Configuración de extensiones PHP (PDO, MySQLi)
- ✅ Permisos de directorios configurados
- ✅ Variables de entorno definidas
- ✅ Página de verificación de estado del proyecto

### Etapa 2: Maquetación de la Interfaz ✅ COMPLETADA
Creación del dashboard y pantalla inicial con diseño visual responsivo y elementos básicos de UI. Incluye funcionalidades avanzadas como auto-hide del navbar, datos de ejemplo en "Próximos Eventos" y "Actividad Reciente", y calendario integrado.

#### Sub-items Completados:
- ✅ Dashboard principal con estadísticas y navegación
- ✅ Páginas de gestión: Técnicos, Usuarios, Tareas, Recursos, Reportes
- ✅ Calendario interactivo con FullCalendar.js
- ✅ Auto-hide navbar con animaciones CSS
- ✅ Sección "Próximos Eventos" con datos de ejemplo
- ✅ Sección "Actividad Reciente" con historial simulado
- ✅ Diseño responsivo con Bootstrap 5
- ✅ Navegación consistente entre todas las páginas
- ✅ Estilos CSS personalizados y animaciones
- ✅ JavaScript del dashboard con funcionalidades avanzadas

### Etapa 3: Implementación del Backend PHP
Desarrollo de la lógica backend en PHP siguiendo el estilo autogenerativo, donde las APIs generan dinámicamente respuestas JSON/HTML basadas en estructuras de datos organizadas y consultas a MySQL.

#### Sub-items Pendientes:
- 🔄 Configuración de conexión a base de datos MySQL
- 🔄 Creación del esquema de base de datos
- 🔄 APIs para gestión de tareas (CRUD)
- 🔄 APIs para gestión de recursos (CRUD)
- 🔄 APIs para gestión de técnicos (CRUD)
- 🔄 APIs para gestión de usuarios operativos (CRUD)
- 🔄 Sistema de autenticación básico
- 🔄 Validación de datos y sanitización
- 🔄 Manejo de sesiones PHP

### Etapa 4: Desarrollo de Funcionalidades JavaScript
Implementación de la interactividad del frontend con JavaScript vanilla, manteniendo la separación clara entre la lógica autogenerativa del backend PHP y la manipulación dinámica del DOM en el cliente.

#### Sub-items Pendientes:
- 🔄 AJAX para comunicación con APIs del backend
- 🔄 Formularios dinámicos con validación
- 🔄 Actualización en tiempo real de datos
- 🔄 Manejo de estados de carga (loading states)
- 🔄 Gestión de errores del lado cliente
- 🔄 Implementación de modales y popups
- 🔄 Funcionalidad de búsqueda y filtrado
- 🔄 Paginación de resultados

### Etapa 5: Implementación del Calendario Interactivo
Desarrollo e integración del calendario interactivo con funcionalidades avanzadas de gestión de eventos, sub-tareas dependientes, asignación de técnicos y control de conflictos de horarios.

#### Sub-items Pendientes:
- 🔄 Gestión avanzada de eventos (crear, editar, eliminar)
- 🔄 Sub-tareas dependientes con horarios específicos
- 🔄 Asignación de técnicos a eventos
- 🔄 Asociación de recursos a eventos
- 🔄 Control de conflictos de horarios
- 🔄 Alertas y recordatorios automáticos
- 🔄 Filtros avanzados por técnico/recurso/tipo
- 🔄 Exportación a PDF/CSV
- 🔄 Permisos de edición por roles
- 🔄 Sincronización con cambios en tareas/recursos

### Etapa 6: Pruebas y Despliegue Final
Testing completo del sistema incluyendo calendario, auto-hide navbar, datos de ejemplo en dashboard, y configuración para despliegue en producción.

#### Sub-items Pendientes:
- 🔄 Testing unitario de funciones PHP
- 🔄 Testing de integración de APIs
- 🔄 Testing de interfaz de usuario
- 🔄 Testing de compatibilidad cross-browser
- 🔄 Testing de rendimiento y carga
- 🔄 Validación de seguridad (OWASP)
- 🔄 Configuración de producción
- 🔄 Documentación de despliegue
- 🔄 Optimización de assets y código

## Entidades del Sistema

### Recursos
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

### Técnicos
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

### Usuarios
Los **usuarios** son las personas que trabajan con los recursos del DTIC en sus actividades diarias. A diferencia de los técnicos, no resuelven tareas del sistema sino que utilizan los recursos asignados para realizar su trabajo operativo.

**Características principales:**
- **ID único**: Identificador único del usuario
- **Información personal**: Nombre, apellido, email, teléfono
- **Rol operativo**: Operador, Supervisor, Analista, Invitado
- **Departamento**: Área específica donde opera
- **Estado**: Activo, Inactivo
- **Recursos asignados**: Lista de recursos bajo su responsabilidad
- **Historial de uso**: Registro de recursos utilizados

**Roles operativos:**
- **Operador**: Uso básico de recursos asignados
- **Supervisor**: Coordinación de recursos y supervisión de operadores
- **Analista**: Análisis de datos y reportes usando recursos específicos
- **Invitado**: Acceso limitado a recursos específicos por tiempo determinado

### Tareas
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

### Categorías
Las **categorías** proporcionan una estructura jerárquica para organizar tanto recursos como tareas en el sistema. Permiten una clasificación lógica y facilitan la búsqueda y filtrado.

**Características principales:**
- **Estructura jerárquica**: Categorías padre/hijo (árbol)
- **Tipo**: Recursos o Tareas
- **Nombre**: Descripción clara de la categoría
- **Descripción**: Detalles adicionales
- **Estado**: Activa, Inactiva
- **Ícono**: Representación visual opcional

**Ejemplos de categorías:**
- **Recursos**: Hardware → Computadoras → Laptops
- **Tareas**: Mantenimiento → Preventivo → Sistemas

### Historial de Auditoría
El **historial de auditoría** registra todas las acciones realizadas en el sistema para mantener un registro completo de cambios y actividades.

**Características principales:**
- **Usuario**: Quién realizó la acción
- **Acción**: Tipo de operación (crear, modificar, eliminar, consultar)
- **Entidad**: Objeto afectado (tarea, recurso, usuario, etc.)
- **Fecha/Hora**: Timestamp preciso de la acción
- **Detalles**: Información específica de lo que cambió
- **IP**: Dirección desde donde se realizó la acción

### Reportes
Los **reportes** son consultas estructuradas que permiten analizar el estado y rendimiento del sistema DTIC Bitácoras.

**Tipos de reportes:**
- **Tareas**: Estado, productividad, tiempos de resolución
- **Recursos**: Utilización, disponibilidad, mantenimiento
- **Usuarios**: Actividad, asignaciones, rendimiento
- **Sistema**: Estadísticas generales, logs de auditoría

## Arquitectura del Sistema

### Estructura de Archivos
```
dtic-bitacoras-php/
├── Dockerfile             # Configuración del contenedor Docker
├── docker-compose.yml     # Orquestación de servicios Docker
├── .env                   # Variables de entorno (producción)
├── public/                # Archivos públicos accesibles por web
│   ├── index.php         # Punto de entrada autogenerativo único
│   ├── includes/         # Archivos PHP autogenerativos
│   │   ├── appApDATs.php # Constantes y configuración del sistema
│   │   ├── appBbPaginas.php # Base de datos de páginas y navegación
│   │   ├── appFxGetHTMLs.php # Funciones generadoras de HTML comunes
│   │   └── appFxPaginas.php # Funciones generadoras de contenido por página
│   ├── css/
│   │   └── styles.css    # Estilos CSS personalizados
│   └── js/               # JavaScript del frontend (por etapa)
│       ├── dashboard.js  # Lógica básica del dashboard
│       └── calendar.js   # Lógica del calendario interactivo
├── js/                   # JavaScript del frontend
│   ├── auth.js          # Funciones de autenticación
│   ├── api.js           # Comunicación con APIs
│   ├── dashboard.js     # Lógica del dashboard
│   └── app.js           # Lógica principal de la aplicación
├── api/                  # Endpoints PHP autogenerativos del backend
│   ├── auth.php         # API de autenticación autogenerativa
│   ├── tasks.php        # API de gestión de tareas autogenerativa
│   ├── resources.php    # API de gestión de recursos autogenerativa
│   ├── technicians.php  # API de gestión de técnicos autogenerativa
│   ├── users.php        # API de gestión de usuarios operativos autogenerativa
│   ├── calendar.php     # API de gestión del calendario autogenerativa
│   ├── categories.php   # API de gestión de categorías autogenerativa
│   ├── history.php      # API de historial de auditoría autogenerativa
│   └── export.php       # API de exportación CSV/PDF autogenerativa
├── config/               # Configuración del sistema
│   ├── database.php     # Conexión a base de datos MySQL
│   └── config.php       # Configuración general
├── includes/             # Funciones y clases compartidas autogenerativas
│   ├── functions.php    # Funciones utilitarias autogenerativas
│   └── security.php     # Funciones de seguridad autogenerativas
├── database/             # Base de datos y esquemas
│   └── schema.sql       # Esquema de base de datos MySQL
├── logs/                 # Archivos de log del sistema
│   └── audit.log
└── _hist/                # Historial de estilos de programación
    └── EstiloProg/      # Ejemplos de estilo autogenerativo
        ├── index.php
        ├── appApDATs.php
        ├── appBbAulas.php
        └── appFxGetHTMLs.php
```

## Tecnologías Utilizadas

### Infraestructura
- **Docker & Docker Compose**: Contenedorización y orquestación
- **PHP 8.1**: Lenguaje de servidor con Apache
- **MySQL 8.0**: Base de datos relacional

### Backend
- **PHP 8.1**: Lenguaje de servidor para APIs
- **PDO**: Extensión para acceso a base de datos MySQL
- **Sesiones PHP**: Manejo de autenticación

### Frontend
- **HTML5**: Estructura de páginas
- **CSS3 + Bootstrap 5**: Estilos y diseño responsivo
- **Vanilla JavaScript (ES6+)**: Lógica del cliente
- **FullCalendar.js**: Biblioteca de calendario interactivo
- **Fetch API**: Comunicación AJAX con el backend

### Seguridad (Implementado por Etapas)
- **Prepared Statements**: Prevención de SQL injection
- **CSRF Protection**: Protección contra ataques CSRF
- **Input Sanitization**: Limpieza de datos de entrada
- **Rate Limiting**: Control de frecuencia de requests


## Guía de Desarrollo por Etapas

### Etapa 1: Preparación del Entorno Docker

#### Prerrequisitos
- Docker Engine 20.10+
- Docker Compose 2.0+
- Git

#### Instrucciones de Configuración

1. **Clonar el repositorio:**
   ```bash
   git clone <repository-url>
   cd dtic-bitacoras-php
   ```

2. **Crear estructura de directorios básica:**
   ```bash
   mkdir -p public js api config includes database logs
   ```

3. **Crear Dockerfile:**
   ```dockerfile
   FROM php:8.1-apache

   # Instalar extensiones PHP necesarias
   RUN docker-php-ext-install pdo pdo_mysql mysqli

   # Habilitar mod_rewrite para Apache
   RUN a2enmod rewrite

   # Instalar herramientas adicionales
   RUN apt-get update && apt-get install -y \
       vim \
       nano \
       && rm -rf /var/lib/apt/lists/*

   # Configurar directorio de trabajo
   WORKDIR /var/www/html

   # Copiar archivos del proyecto
   COPY . /var/www/html/

   # Configurar permisos
   RUN chown -R www-data:www-data /var/www/html/
   RUN chmod -R 755 /var/www/html/database/
   RUN chmod -R 755 /var/www/html/logs/

   # Exponer puerto 80
   EXPOSE 80
   ```

4. **Crear docker-compose.yml:**
   ```yaml
   version: '3.8'

   services:
     app:
       build: .
       ports:
         - "8080:80"
       volumes:
         - .:/var/www/html
         - ./logs:/var/www/html/logs
       depends_on:
         - db
       environment:
         - DB_HOST=db
         - DB_NAME=dtic_bitacoras_php
         - DB_USER=dtic_user
         - DB_PASSWORD=dtic_password
       networks:
         - dtic-network

     db:
       image: mysql:8.0
       restart: always
       environment:
          MYSQL_ROOT_PASSWORD: rootpassword
          MYSQL_DATABASE: dtic_bitacoras_php
          MYSQL_USER: dtic_user
          MYSQL_PASSWORD: dtic_password
       ports:
         - "3306:3306"
       volumes:
         - mysql_data:/var/lib/mysql
       networks:
         - dtic-network

   volumes:
     mysql_data:

   networks:
     dtic-network:
       driver: bridge
   ```

5. **Levantar el entorno Docker:**
   ```bash
   docker-compose up --build -d
   ```

6. **Verificar funcionamiento:**
   ```bash
   docker-compose ps
   ```

7. **Acceder al contenedor para desarrollo:**
   ```bash
   docker-compose exec app bash
   ```

#### Resultado Esperado de la Etapa 1
- Contenedor PHP con Apache corriendo en puerto 8080
- Base de datos MySQL corriendo en puerto 3306
- Entorno listo para desarrollo con permisos configurados
- Punto de entrada único en `public/index.php` con sistema autogenerativo

#### Verificación de la Etapa 1
Después de completar la configuración, puedes verificar que todo funciona correctamente accediendo a:
- **URL principal**: http://localhost:8080/index.php
- **Estado del proyecto**: http://localhost:8080/index.php?page=estadoproyecto
- **Estado de contenedores**: `docker compose ps`
- **Logs de contenedores**: `docker compose logs`

La página de prueba mostrará:
- ✅ PHP 8.1 funcionando correctamente
- ✅ Extensiones PDO, PDO_MySQL y MySQLi cargadas
- ✅ Conexión exitosa a la base de datos MySQL
- 📅 Información del servidor y fecha/hora

### Etapa 2: Maquetación de la Interfaz

#### Objetivos
- Crear dashboard inicial con diseño responsivo
- Implementar layout básico con navegación
- Establecer estructura HTML/CSS base

#### Archivos Creados

1. **public/index.php** - Punto de entrada autogenerativo único ✅
2. **public/includes/appApDATs.php** - Constantes y configuración del sistema ✅
3. **public/includes/appBbPaginas.php** - Base de datos de páginas y navegación ✅
4. **public/includes/appFxGetHTMLs.php** - Funciones generadoras de HTML comunes ✅
5. **public/includes/appFxPaginas.php** - Funciones generadoras de contenido por página ✅
6. **public/css/styles.css** - Estilos CSS con Bootstrap y auto-hide navbar ✅
7. **public/js/dashboard.js** - Lógica avanzada del dashboard con auto-hide y datos de ejemplo ✅
8. **public/js/calendar.js** - Funcionalidad del calendario interactivo ✅

#### Estructura del Dashboard

```html
<!-- public/index.html -->
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DTIC Bitácoras - Dashboard</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="css/styles.css" rel="stylesheet">
</head>
<body>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container">
            <a class="navbar-brand" href="#">DTIC Bitácoras</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a class="nav-link active" href="#">Dashboard</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Tareas</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Recursos</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <div class="container mt-4">
        <div class="row">
            <div class="col-md-12">
                <h1 class="mb-4">Dashboard DTIC Bitácoras</h1>
            </div>
        </div>

        <div class="row">
            <div class="col-md-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Tareas Pendientes</h5>
                        <p class="card-text display-4" id="pending-tasks">0</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Tareas en Progreso</h5>
                        <p class="card-text display-4" id="in-progress-tasks">0</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Tareas Completadas</h5>
                        <p class="card-text display-4" id="completed-tasks">0</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="js/dashboard.js"></script>
</body>
</html>
```

#### Resultado Esperado de la Etapa 2 ✅ COMPLETADA
- Dashboard funcional con navegación responsiva y auto-hide inteligente
- Sistema autogenerativo completo con todas las secciones del menú:
  - Gestión de Técnicos (index.php?page=tecnicos)
  - Gestión de Usuarios (index.php?page=usuarios)
  - Gestión de Tareas (index.php?page=tareas)
  - Gestión de Recursos (index.php?page=recursos)
  - Calendario Interactivo (index.php?page=calendario)
  - Reportes y Estadísticas (index.php?page=reportes)
- Cards con estadísticas básicas y datos de ejemplo realistas
- Secciones "Próximos Eventos" y "Actividad Reciente" con datos de ejemplo
- Diseño moderno con Bootstrap 5 y animaciones CSS
- Estructura preparada para futuras funcionalidades
- Distinción clara entre las distinas entidades como por ejemplo Técnicos (resuelven tareas) y Usuarios (trabajan con recursos)
- Calendario integrado con navegación consistente

### Etapa 3: Implementación del Backend PHP

#### Objetivos
- Configurar conexión a MySQL
- Crear APIs básicas para tareas y recursos
- Implementar sistema de autenticación básico

#### Archivos a Crear
- `config/database.php` - Configuración de conexión MySQL
- `api/tasks.php` - API para gestión de tareas
- `api/auth.php` - API de autenticación
- `database/schema.sql` - Esquema de base de datos

#### Resultado Esperado de la Etapa 3
- Conexión establecida con MySQL
- APIs funcionales para CRUD básico
- Sistema de autenticación operativo

### Etapa 4: Desarrollo de Funcionalidades JavaScript

#### Objetivos
- Implementar AJAX para comunicación con APIs
- Crear formularios dinámicos
- Agregar validación del lado cliente

#### Resultado Esperado de la Etapa 4
- Interfaz completamente funcional
- Actualización en tiempo real de datos
- Experiencia de usuario fluida

### Etapa 5: Pruebas y Despliegue Final

#### Objetivos
- Testing completo del sistema
- Configuración de producción
- Documentación final

#### Resultado Esperado de la Etapa 5
- Sistema completamente funcional
- Configurado para despliegue en producción
- Documentación completa de uso

## Configuración del Entorno

### Variables de Entorno
Crear archivo `.env` en la raíz del proyecto (solo para producción):
```env
MYSQL_ROOT_PASSWORD=your_secure_root_password
MYSQL_USER=dtic_user
MYSQL_PASSWORD=your_secure_password
DB_USER=dtic_user
DB_PASSWORD=your_secure_password
```

### Configuración de PHP
Editar `config/config.php` para:
- Configurar zona horaria
- Ajustar límites de rate limiting
- Configurar URLs de CORS
- Establecer modo debug

## Desarrollo y Testing

### Verificación de Sintaxis PHP
```bash
# Desde el contenedor Docker
docker-compose exec app php -l config/*.php
docker-compose exec app php -l includes/*.php
docker-compose exec app php -l api/*.php
```

### Logs del Sistema
Los logs se escriben en `logs/audit.log`. Para habilitar debug, configurar `DEBUG_MODE = true` en `config/config.php`.

## Mantenimiento

### Tareas Periódicas
- Limpieza de sesiones expiradas
- Backup de base de datos MySQL
- Rotación de logs
- Actualización de dependencias Docker

### Backup de Base de Datos
```bash
# Backup desde el contenedor
docker-compose exec db mysqldump -u dtic_user -p dtic_bitacoras_php > database/backup_$(date +%Y%m%d_%H%M%S).sql

# O desde el host (si MySQL está expuesto)
mysqldump -h localhost -P 3306 -u dtic_user -p dtic_bitacoras_php > database/backup_$(date +%Y%m%d_%H%M%S).sql
```

### Monitoreo del Sistema
- Logs de auditoría para tracking de cambios
- Estadísticas de uso en el dashboard
- Monitoreo de contenedores con `docker-compose ps`
- Logs de contenedores con `docker-compose logs`

## Funcionalidades Planificadas

### Sistema de Autenticación (Etapa 3)
- Login/logout con sesiones seguras
- Roles de usuario: Admin, Technician, Viewer
- Control de acceso basado en roles

### Gestión de Tareas (Etapa 3-4)
- CRUD completo de tareas
- Estados: Pending, In Progress, Completed, Cancelled
- Prioridades: Low, Medium, High, Urgent
- Asignación a usuarios y fechas de vencimiento

### Gestión de Recursos (Etapa 3-4)
- CRUD completo de recursos
- Categorización jerárquica
- Asociación con tareas

### Sistema de Categorías (Etapa 3)
- Estructura jerárquica (árbol)
- Categorías padre/hijo

### Gestión de Técnicos (Etapa 3)
- Administración de técnicos del sistema (solo administradores)
- Roles: Administrador, Técnico, Visualizador
- Asignación y seguimiento de tareas
- Control de permisos para edición del calendario

### Gestión de Usuarios Operativos (Etapa 3)
- Administración de usuarios que trabajan con recursos
- Roles operativos: Operador, Supervisor, Analista, Invitado
- Asignación de recursos y seguimiento de uso

### Calendario Interactivo (Etapa 5)
- **Visualización**: Vistas mensuales, semanales y diarias con FullCalendar.js
- **Gestión de Eventos**: Creación, edición y eliminación de eventos programados
- **Sub-tareas Dependientes**: Tareas intermedias con horarios específicos (ej. "Hacer pruebas de sonido 1 hora antes")
- **Asignación de Técnicos**: Vinculación de técnicos a eventos y sub-tareas
- **Recursos de Eventos**: Asociación con recursos específicos (ej. "Evento del Auditorio")
- **Alertas y Recordatorios**: Notificaciones automáticas antes de eventos
- **Control de Conflictos**: Detección y advertencia de superposiciones de horarios
- **Filtros Avanzados**: Por técnico, recurso, tipo de evento, estado
- **Exportación**: PDF y CSV de eventos y programaciones
- **Permisos**: Editable solo por administradores y técnicos autorizados
- **Integración**: Actualización dinámica con cambios en tareas y recursos
- **Ejemplo de Uso**: Evento "Preparar los equipos en el Auditorio con música y proyector" (15/10/2023, 14:00-16:00) con sub-tareas como "Hacer pruebas de sonido y video 1 hora antes" y "Verificar conectividad de proyectores 30 minutos antes"

### Historial de Auditoría (Etapa 4)
- Registro completo de cambios
- Tracking de acciones por usuario

### Exportación CSV (Etapa 4)
- Exportación de datos en formato CSV
- Filtros aplicables

## Licencia

Este proyecto se desarrolla bajo la licencia correspondiente al sistema DTIC original.

## Soporte

Para soporte técnico durante el desarrollo, consultar la documentación del proyecto o crear un issue en el repositorio.