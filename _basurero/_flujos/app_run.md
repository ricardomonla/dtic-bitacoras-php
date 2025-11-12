# Flujo Documental: Gestión de Aplicación DTIC Bitácoras

## Información General

**Script:** `app_run.sh`
**Ubicación:** Raíz del proyecto
**Propósito:** Gestión unificada de contenedores Docker y base de datos MySQL
**Dependencias:** Docker, Docker Compose, MySQL client

## Funcionalidades

### 1. Comando `up` - Levantar aplicación completa
**Propósito:** Iniciar contenedores y restaurar base de datos desde último backup

**Sintaxis:**
```bash
./app_run.sh up
```

**Comportamiento:**
- Verifica si los contenedores están ejecutándose
- Si no están ejecutándose, inicia los contenedores con `docker compose up -d`
- Espera a que la base de datos MySQL esté lista (máximo 30 intentos)
- Busca el backup más reciente en `./backups/db_backup_*.sql.gz`
- Restaura automáticamente la base de datos desde el backup encontrado
- En modo interactivo, solicita confirmación antes de restaurar
- En modo no interactivo, usa variable `AUTO_RESTORE=yes` por defecto

**Variables de entorno:**
- `AUTO_RESTORE=yes|no`: Controla restauración automática (default: yes para `up`)

**Archivos involucrados:**
- `./backups/db_backup_*.sql.gz`: Archivos de backup comprimidos
- `./docker-compose.yml`: Configuración de contenedores
- `./Dockerfile`: Configuración de imagen de aplicación

### 2. Comando `start` - Iniciar contenedores
**Propósito:** Iniciar contenedores con restauración opcional

**Sintaxis:**
```bash
./app_run.sh start
```

**Comportamiento:**
- Similar a `up` pero con restauración opcional (default: no)
- Siempre inicia contenedores si no están ejecutándose
- Pregunta por restauración de backup

### 3. Comando `stop` - Detener aplicación con backup
**Propósito:** Crear backup y detener contenedores

**Sintaxis:**
```bash
./app_run.sh stop
```

**Comportamiento:**
- Crea un backup completo de la base de datos
- Detiene todos los contenedores con `docker compose down`
- El backup se guarda como `./backups/db_backup_YYYYMMDD_HHMMSS.sql.gz`

### 4. Comando `backup` - Crear backup manual
**Propósito:** Generar backup de base de datos sin detener contenedores

**Sintaxis:**
```bash
./app_run.sh backup
```

**Comportamiento:**
- Ejecuta `mysqldump` dentro del contenedor de base de datos
- Comprime el resultado con gzip
- Guarda el archivo en `./backups/`
- Verifica integridad del archivo creado

### 5. Comando `restore` - Restaurar desde backup específico
**Propósito:** Restaurar base de datos desde archivo de backup específico

**Sintaxis:**
```bash
./app_run.sh restore <ruta_del_backup>
```

**Parámetros:**
- `<ruta_del_backup>`: Ruta al archivo `.sql.gz` (relativa o absoluta)

**Comportamiento:**
- Verifica integridad del archivo de backup
- Extrae el archivo comprimido temporalmente
- Restaura la base de datos usando `mysql`
- Verifica que las tablas se restauraron correctamente
- Limpia archivos temporales

### 6. Comando `status` - Ver estado del sistema
**Propósito:** Mostrar información del estado de la base de datos

**Sintaxis:**
```bash
./app_run.sh status
```

**Información mostrada:**
- Estado de conexión a base de datos
- Número de tablas
- Número de usuarios (técnicos)
- Número de sesiones activas
- Lista de backups recientes

## Configuración de Base de Datos

**Credenciales (hardcodeadas en script):**
- Host: `db` (nombre del servicio Docker)
- Base de datos: `dtic_bitacoras_php`
- Usuario: `dtic_user`
- Contraseña: `dtic_password`

**Tablas principales:**
- `tecnicos`: Información de técnicos del DTIC
- `sesiones`: Sesiones de usuario activas
- `tareas`: Tareas asignadas (si existe)

## Manejo de Errores

### Errores Comunes y Soluciones

1. **"Database connection failed"**
   - Verificar que los contenedores estén ejecutándose: `docker compose ps`
   - Revisar logs de MySQL: `docker compose logs db`

2. **"Backup file not found"**
   - Verificar existencia de archivos en `./backups/`
   - Crear backup manual si no existe ninguno

3. **"Permission denied"**
   - Asegurar permisos de ejecución: `chmod +x app_run.sh`
   - Verificar permisos de escritura en `./backups/`

4. **"Docker command failed"**
   - Verificar instalación de Docker y Docker Compose
   - Asegurar que el usuario tenga permisos para ejecutar Docker

## Variables de Entorno

- `AUTO_RESTORE=yes|no`: Controla restauración automática en modo no interactivo
  - Default para `up`: `yes`
  - Default para `start`: `no`

## Archivos de Backup

**Formato:** `db_backup_YYYYMMDD_HHMMSS.sql.gz`
**Ubicación:** `./backups/`
**Compresión:** gzip
**Contenido:** Dump completo de MySQL con `--no-tablespaces`

## Ejemplos de Uso

### Desarrollo diario
```bash
# Levantar aplicación completa
./app_run.sh up

# Verificar estado
./app_run.sh status

# Crear backup antes de cambios
./app_run.sh backup

# Detener al final del día
./app_run.sh stop
```

### Restauración específica
```bash
# Restaurar backup específico
./app_run.sh restore backups/db_backup_20231027_143000.sql.gz

# Verificar restauración
./app_run.sh status
```

### Automatización
```bash
# En scripts de CI/CD
AUTO_RESTORE=yes ./app_run.sh up
```

## Logs y Monitoreo

**Ubicación de logs:**
- Aplicación: `docker compose logs app`
- Base de datos: `docker compose logs db`

**Niveles de log del script:**
- INFO: Información general de operaciones
- SUCCESS: Operaciones completadas exitosamente
- WARNING: Advertencias que no detienen ejecución
- ERROR: Errores que requieren atención

## Seguridad

- Credenciales de base de datos hardcodeadas (considerar variables de entorno para producción)
- Backups comprimidos y almacenados localmente
- Verificación de integridad de archivos de backup
- Manejo seguro de contraseñas en comandos MySQL

## Mantenimiento

### Limpieza de backups antiguos
```bash
# Listar backups ordenados por fecha
ls -la backups/db_backup_*.sql.gz

# Eliminar backups antiguos manualmente
rm backups/db_backup_20231001_*.sql.gz
```

### Verificación de integridad
```bash
# Verificar archivo de backup
gzip -t backups/db_backup_20231027_143000.sql.gz

# Verificar contenido
gunzip -c backups/db_backup_20231027_143000.sql.gz | head -20
```

## Troubleshooting

### Contenedores no inician
```bash
# Verificar estado
docker compose ps

# Ver logs detallados
docker compose logs

# Reiniciar servicios
docker compose restart
```

### Base de datos no responde
```bash
# Verificar conectividad
docker compose exec db mysqladmin ping -u dtic_user -pdtic_password

# Reiniciar solo base de datos
docker compose restart db
```

### Backups corruptos
```bash
# Verificar integridad
gzip -t backups/db_backup_20231027_143000.sql.gz

# Si está corrupto, crear nuevo backup
./app_run.sh backup