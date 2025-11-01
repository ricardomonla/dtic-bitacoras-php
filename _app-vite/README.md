# DTIC Bitácoras - Aplicación Vite

Sistema de gestión de bitácoras para el Departamento de Tecnología de la Información y Comunicación (DTIC).

## 🚀 Inicio Rápido

### Usando Docker Compose (Recomendado)

```bash
# Clonar el repositorio
git clone <repository-url>
cd dtic-bitacoras-php/_app-vite

# Ejecutar la aplicación completa
docker-compose up --build

# Acceder a la aplicación
# Frontend: http://localhost:5173
# Backend API: http://localhost:3001
# Base de datos: localhost:5432
```

### Desarrollo Local

#### Backend
```bash
cd _app-vite/backend
npm install
npm run dev
```

#### Frontend
```bash
cd _app-vite/frontend
npm install
npm run dev
```

## 🔧 Configuración para Despliegue Remoto

### 1. Variables de Entorno del Backend

Crear archivo `_app-vite/backend/.env`:

```env
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://username:password@your-db-host:5432/database_name
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

### 2. Variables de Entorno del Frontend

Crear archivo `_app-vite/frontend/.env`:

```env
VITE_API_URL=http://your-server-ip:3001/api
```

### 3. Configuración CORS

En `_app-vite/backend/src/server.js`, actualizar la configuración CORS:

```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://your-server-ip:5173',
    'https://your-domain.com'
  ],
  credentials: true
}));
```

### 4. Docker Compose para Producción

```yaml
# docker-compose.prod.yml
services:
  frontend:
    environment:
      VITE_API_URL: http://your-server-ip:3001/api
    ports:
      - "80:5173"

  api:
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://user:pass@db-host:5432/db
    ports:
      - "3001:3001"
```

## 📁 Estructura del Proyecto

```
_app-vite/
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
├── docker-compose.yml       # Configuración Docker
└── README.md
```

## 🔍 Solución de Problemas

### Error "NetworkError when attempting to fetch resource"

1. **Verificar configuración CORS**: Asegurarse de que el backend permita el origen del frontend
2. **Verificar VITE_API_URL**: Confirmar que apunte al servidor backend correcto
3. **Verificar conectividad**: Probar que el backend esté ejecutándose y accesible

### Comandos Útiles

```bash
# Ver logs de Docker
docker-compose logs -f

# Reiniciar servicios
docker-compose restart

# Acceder a base de datos
docker-compose exec postgres psql -U dtic_user -d dtic_bitacoras

# Limpiar contenedores
docker-compose down -v
```

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 18, TypeScript, Vite, Bootstrap 5, Zustand
- **Backend**: Node.js, Express.js, PostgreSQL, JWT
- **Infraestructura**: Docker, Docker Compose

## 📝 Notas de Desarrollo

- La aplicación utiliza una arquitectura modular con componentes reutilizables
- Los stores de Zustand manejan el estado global de la aplicación
- La API sigue principios RESTful con validación de datos
- Se implementa autenticación JWT (actualmente comentada para desarrollo)

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request