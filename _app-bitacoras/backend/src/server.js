const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Configuración de PostgreSQL
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Establecer search_path para incluir el esquema dtic
pool.on('connect', (client) => {
  client.query('SET search_path TO dtic, public');
});

// Importar rutas
const authRoutes = require('./routes/auth');
const tecnicosRoutes = require('./routes/tecnicos');
const tareasRoutes = require('./routes/tareas');
const recursosRoutes = require('./routes/recursos');
const usuariosRelacionadosRoutes = require('./routes/usuarios_relacionados');
const tareaRecursosRoutes = require('./routes/tarea-recursos');

// Configuración de la aplicación
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware de seguridad
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate limiting - más permisivo para desarrollo
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 1000, // límite de 1000 requests por windowMs (aumentado para desarrollo)
  message: 'Demasiadas solicitudes desde esta IP, por favor intenta más tarde.'
});
app.use('/api/', limiter);

// Rate limiting más estricto para autenticación
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // límite de 5 requests por windowMs
  message: 'Demasiados intentos de autenticación, por favor intenta más tarde.'
});
app.use('/api/auth/login', authLimiter);

// CORS - Allow all origins for development and remote access
app.use(cors({
  origin: true, // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Compresión
app.use(compression());

// Body parsing with logging
app.use(express.json({
  limit: '10mb',
  verify: (req, res, buf) => {
    console.log(`[PAYLOAD SIZE] ${req.method} ${req.path}: ${buf.length} bytes`);
  }
}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging básico
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/tecnicos', tecnicosRoutes);
app.use('/api/tareas', tareasRoutes);
app.use('/api/recursos', recursosRoutes);
app.use('/api/tarea-recursos', tareaRecursosRoutes); // Rutas para asignaciones tarea-recurso
// Ruta para servir el archivo de configuración YAML
app.get('/api/config/entities.yml', (req, res) => {
  const path = require('path');
  const fs = require('fs');

  // El archivo está montado en /host/_app-npm/frontend/src/config/entities.yml
  const configPath = path.join('/host', '_app-npm', 'frontend', 'src', 'config', 'entities.yml');

  console.log(`[CONFIG] Intentando leer archivo desde: ${configPath}`);

  fs.readFile(configPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error leyendo archivo de configuración:', err);
      console.error('Path attempted:', configPath);
      return res.status(500).json({
        success: false,
        message: 'Error al leer el archivo de configuración',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }

    console.log(`[CONFIG] Archivo de configuración leído exitosamente (${data.length} bytes)`);
    res.setHeader('Content-Type', 'text/yaml');
    res.send(data);
  });
});
app.use('/api/usuarios_relacionados', usuariosRelacionadosRoutes);

// Manejo de errores 404
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint no encontrado'
  });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err);

  // Error de validación
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Datos de entrada inválidos',
      errors: err.errors
    });
  }

  // Error de base de datos
  if (err.code && err.code.startsWith('23')) {
    return res.status(400).json({
      success: false,
      message: 'Error de integridad de datos'
    });
  }

  // Error interno del servidor
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production'
      ? 'Error interno del servidor'
      : err.message
  });
});

// Función para verificar conexión a la base de datos
const testDatabaseConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Conexión a PostgreSQL exitosa');
    client.release();
  } catch (err) {
    console.error('❌ Error conectando a PostgreSQL:', err);
    process.exit(1);
  }
};

// Iniciar servidor
const startServer = async () => {
  await testDatabaseConnection();

  app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
    console.log(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  });
};

// Manejo de señales para cerrar gracefully
process.on('SIGTERM', () => {
  console.log('SIGTERM recibido, cerrando servidor...');
  pool.end(() => {
    console.log('Pool de conexiones cerrado');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT recibido, cerrando servidor...');
  pool.end(() => {
    console.log('Pool de conexiones cerrado');
    process.exit(0);
  });
});

// Exportar app para uso en otros módulos si es necesario
module.exports = { app, pool };

startServer();