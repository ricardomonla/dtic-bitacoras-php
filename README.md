# DTIC Bitácoras PHP - Nueva Arquitectura HTML/JS/PHP/MySQL

## Descripción del Proyecto

Este proyecto representa el desarrollo desde cero del sistema DTIC Bitácoras utilizando una arquitectura moderna basada en HTML, JavaScript, PHP y MySQL. El sistema implementará todas las funcionalidades requeridas con un enfoque en la escalabilidad, seguridad y facilidad de mantenimiento.

## Metodología de Desarrollo

El proyecto se desarrollará en etapas claramente definidas para asegurar una implementación ordenada y funcional:

### Etapa 1: Preparación del Entorno Docker
Configuración completa del contenedor Docker con PHP, MySQL y permisos necesarios para el desarrollo.

### Etapa 2: Maquetación de la Interfaz
Creación del dashboard y pantalla inicial con diseño visual responsivo y elementos básicos de UI.

### Etapa 3: Implementación del Backend PHP
Desarrollo de la lógica backend en PHP para conectar con MySQL y manejar las operaciones del sistema.

### Etapa 4: Desarrollo de Funcionalidades JavaScript
Implementación de la interactividad del frontend con JavaScript para una experiencia de usuario fluida.

### Etapa 5: Pruebas y Despliegue Final
Testing completo del sistema y configuración para despliegue en producción.

## Arquitectura del Sistema

### Estructura de Archivos
```
dtic-bitacoras-php/
├── Dockerfile             # Configuración del contenedor Docker
├── docker-compose.yml     # Orquestación de servicios Docker
├── .env                   # Variables de entorno (producción)
├── public/                # Archivos públicos accesibles por web
│   ├── index.html        # Página principal del dashboard
│   ├── css/
│   │   └── styles.css    # Estilos CSS personalizados
│   └── js/               # JavaScript del frontend (por etapa)
├── js/                   # JavaScript del frontend
│   ├── auth.js          # Funciones de autenticación
│   ├── api.js           # Comunicación con APIs
│   ├── dashboard.js     # Lógica del dashboard
│   └── app.js           # Lógica principal de la aplicación
├── api/                  # Endpoints PHP del backend
│   ├── auth.php         # API de autenticación
│   ├── tasks.php        # API de gestión de tareas
│   ├── resources.php    # API de gestión de recursos
│   ├── categories.php   # API de gestión de categorías
│   ├── users.php        # API de gestión de usuarios
│   ├── history.php      # API de historial de auditoría
│   └── export.php       # API de exportación CSV
├── config/               # Configuración del sistema
│   ├── database.php     # Conexión a base de datos MySQL
│   └── config.php       # Configuración general
├── includes/             # Funciones y clases compartidas
│   ├── functions.php    # Funciones utilitarias
│   └── security.php     # Funciones de seguridad
├── database/             # Base de datos y esquemas
│   └── schema.sql       # Esquema de base de datos MySQL
└── logs/                 # Archivos de log del sistema
    └── audit.log
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

### Etapa 2: Maquetación de la Interfaz

#### Objetivos
- Crear dashboard inicial con diseño responsivo
- Implementar layout básico con navegación
- Establecer estructura HTML/CSS base

#### Archivos a Crear

1. **public/index.html** - Página principal del dashboard
2. **public/css/styles.css** - Estilos CSS con Bootstrap
3. **public/js/dashboard.js** - Lógica básica del dashboard

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

#### Resultado Esperado de la Etapa 2
- Dashboard funcional con navegación responsiva
- Cards con estadísticas básicas (inicialmente en 0)
- Diseño moderno con Bootstrap 5
- Estructura preparada para futuras funcionalidades

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

### Gestión de Usuarios (Etapa 3)
- Administración de usuarios (solo administradores)
- Roles y permisos

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