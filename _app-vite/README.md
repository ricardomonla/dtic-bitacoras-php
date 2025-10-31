# DTIC Bitácoras - React Migration

Migración del sistema DTIC Bitácoras de PHP a React con Node.js backend.

## Arquitectura

- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express + PostgreSQL
- **Estado**: Zustand
- **Estilos**: Bootstrap + CSS personalizado
- **Contenedores**: Docker

## Estructura del Proyecto

```
_app-vite/
├── docker-compose.yml          # Configuración de contenedores
├── docker/
│   └── init.sql               # Inicialización de base de datos
├── backend/                   # API Node.js/Express
│   ├── Dockerfile
│   ├── package.json
│   ├── src/
│   │   ├── server.js          # Servidor principal
│   │   ├── routes/            # Rutas de la API
│   │   │   ├── auth.js
│   │   │   ├── tecnicos.js
│   │   │   └── tareas.js
│   │   └── middleware/
│   │       └── auth.js
├── frontend/                  # Aplicación React
│   ├── Dockerfile
│   ├── package.json
│   ├── vite.config.ts
│   ├── index.html
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── stores/            # Zustand stores
│   │   │   ├── authStore.ts
│   │   │   └── tecnicosStore.ts
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   └── Navbar.tsx
│   │   │   └── auth/
│   │   │       └── PrivateRoute.tsx
│   │   └── pages/             # Páginas principales
│   │       ├── Login.tsx
│   │       ├── Dashboard.tsx
│   │       ├── Tecnicos.tsx
│   │       └── ...
```

## Instalación y Ejecución

### Prerrequisitos
- Docker y Docker Compose
- Node.js 18+ (solo para desarrollo local)

### Inicio Rápido
```bash
# Clonar el repositorio
cd _app-vite

# Construir e iniciar contenedores
docker-compose up --build

# Acceder a la aplicación
# Frontend: http://localhost:5173
# Backend API: http://localhost:3001
# Base de datos: localhost:5432
```

### Desarrollo Local
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

## API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión
- `GET /api/auth/me` - Información del usuario actual

### Técnicos
- `GET /api/tecnicos` - Listar técnicos con filtros
- `GET /api/tecnicos/:id` - Obtener técnico específico
- `POST /api/tecnicos` - Crear nuevo técnico
- `PUT /api/tecnicos/:id` - Actualizar técnico
- `DELETE /api/tecnicos/:id` - Eliminar técnico

### Tareas
- `GET /api/tareas` - Listar tareas
- `POST /api/tareas` - Crear tarea
- `PUT /api/tareas/:id` - Actualizar tarea
- `DELETE /api/tareas/:id` - Eliminar tarea

## Características Implementadas

### ✅ Completado
- Configuración Docker completa
- API backend con Express y PostgreSQL
- Autenticación JWT
- Gestión completa de técnicos (CRUD)
- Estados globales con Zustand
- Componentes básicos de UI
- Sistema de routing

### 🔄 En Desarrollo
- Formularios con validación completa
- Sistema de búsqueda y filtros avanzados
- Paginación
- Manejo de errores mejorado
- Tests unitarios

### 📋 Pendiente
- Módulos adicionales (Tareas, Recursos, etc.)
- Sistema de notificaciones
- Reportes y estadísticas
- Calendario interactivo
- Gestión de archivos
- Auditoría completa

## Variables de Entorno

### Backend (.env)
```env
NODE_ENV=development
DATABASE_URL=postgresql://dtic_user:dtic_password@postgres:5432/dtic_bitacoras
JWT_SECRET=your-super-secret-jwt-key-change-in-production
PORT=3001
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001/api
```

## Base de Datos

### Esquema PostgreSQL
- `tecnicos` - Información de técnicos
- `tareas` - Tareas asignadas
- `audit_log` - Registro de auditoría

### Datos de Prueba
Se incluyen datos de ejemplo para desarrollo:
- 6 técnicos con diferentes roles
- Contraseñas de prueba (cambiar en producción)

## Scripts Disponibles

### Backend
```bash
npm start      # Producción
npm run dev    # Desarrollo con nodemon
npm test       # Ejecutar tests
```

### Frontend
```bash
npm run dev    # Desarrollo
npm run build  # Construir para producción
npm run preview # Vista previa de producción
```

## Contribución

1. Crear rama para nueva funcionalidad
2. Implementar cambios
3. Agregar tests si corresponde
4. Hacer commit con mensaje descriptivo
5. Crear Pull Request

## Licencia

Este proyecto es propiedad del DTIC - Gobierno de la Provincia de Buenos Aires.