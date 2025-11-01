# DTIC Bitácoras - Aplicación Vite

Sistema de gestión de bitácoras para el Departamento de Tecnología de la Información y Comunicación (DTIC).

## 🚀 Inicio Rápido

### Opción 1: Usando Scripts Automatizados (Recomendado)

```bash
# Configuración inicial
./setup.sh

# Despliegue interactivo
./deploy.sh
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

## 📁 Estructura del Proyecto

```
_app-npm/
├── backend/                 # API Node.js/Express
│   ├── src/
│   │   ├── routes/         # Endpoints de la API
│   │   ├── middleware/     # Middleware de autenticación
│   │   └── server.js       # Servidor principal
│   └── Dockerfile
├── frontend/                # Aplicación React/Vite
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── pages/          # Páginas principales
│   │   ├── stores/         # Zustand stores
│   │   └── hooks/          # Custom hooks
│   └── Dockerfile
├── docker/                  # Configuración Docker
│   └── init.sql            # Inicialización de BD
├── docker-compose.yml       # Configuración base Docker
├── docker-compose.override.yml  # Override por entorno
├── .env.example            # Variables de entorno ejemplo
├── setup.sh                # Script de instalación
├── deploy.sh               # Script de despliegue interactivo
├── Makefile                # Comandos Make
└── README.md
```

## 🛠️ Comandos Disponibles

### Scripts Automatizados

```bash
./setup.sh          # Configuración inicial
./deploy.sh         # Menú interactivo de despliegue
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

## 🧪 Desarrollo

### Ejecutar en Modo Desarrollo

```bash
# Frontend
make dev-frontend

# Backend
make dev-backend

# Base de datos
make dev-db
```

### Tests

```bash
make test           # Todos los tests
make test-backend   # Tests del backend
make test-frontend  # Tests del frontend
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📝 Notas de Desarrollo

- La aplicación utiliza una arquitectura modular con componentes reutilizables
- Los stores de Zustand manejan el estado global de la aplicación
- La API sigue principios RESTful con validación de datos
- Se implementa autenticación JWT
- La base de datos incluye datos de ejemplo para desarrollo

## 📞 Soporte

Para soporte técnico o reportar issues, por favor crea un issue en el repositorio del proyecto.