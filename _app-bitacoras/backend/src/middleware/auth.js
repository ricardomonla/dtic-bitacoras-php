const jwt = require('jsonwebtoken');
const { pool } = require('../server');

// Función helper para ejecutar queries
const executeQuery = async (query, params = []) => {
  const client = await pool.connect();
  try {
    const result = await client.query(query, params);
    return result;
  } finally {
    client.release();
  }
};

/**
 * Middleware de autenticación JWT
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token de acceso requerido'
      });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verificar que el usuario aún existe y está activo
    const query = 'SELECT id, is_active, role FROM dtic.tecnicos WHERE id = $1';
    const result = await executeQuery(query, [decoded.id]);

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    const user = result.rows[0];

    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Usuario inactivo'
      });
    }

    // Agregar información del usuario a la request
    req.user = {
      id: decoded.id,
      dtic_id: decoded.dtic_id,
      email: decoded.email,
      role: user.role,
      department: decoded.department
    };

    next();
  } catch (error) {
    console.error('Error en autenticación:', error);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * Middleware para verificar permisos por rol
 */
const requirePermission = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }

    const roleHierarchy = {
      'viewer': 1,
      'technician': 2,
      'admin': 3
    };

    const userRoleLevel = roleHierarchy[req.user.role] || 0;
    const requiredRoleLevel = roleHierarchy[requiredRole] || 0;

    if (userRoleLevel < requiredRoleLevel) {
      return res.status(403).json({
        success: false,
        message: 'Permisos insuficientes'
      });
    }

    next();
  };
};

/**
 * Middleware para verificar propiedad de recursos
 */
const requireOwnership = (resourceType) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }

    // Los administradores pueden acceder a todo
    if (req.user.role === 'admin') {
      return next();
    }

    const resourceId = req.params.id;

    try {
      let query;
      let params;

      switch (resourceType) {
        case 'technician':
          // Los técnicos solo pueden acceder a su propio perfil
          if (req.user.id !== parseInt(resourceId)) {
            return res.status(403).json({
              success: false,
              message: 'No tienes permisos para acceder a este recurso'
            });
          }
          break;

        case 'task':
          // Verificar si el usuario es el asignado a la tarea
          query = 'SELECT technician_id FROM dtic.tareas WHERE id = $1';
          params = [resourceId];
          break;

        default:
          return res.status(400).json({
            success: false,
            message: 'Tipo de recurso no válido'
          });
      }

      if (query) {
        const result = await executeQuery(query, params);

        if (result.rows.length === 0) {
          return res.status(404).json({
            success: false,
            message: 'Recurso no encontrado'
          });
        }

        if (result.rows[0].technician_id !== req.user.id) {
          return res.status(403).json({
            success: false,
            message: 'No tienes permisos para acceder a este recurso'
          });
        }
      }

      next();
    } catch (error) {
      console.error('Error verificando propiedad:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  };
};

/**
 * Middleware para logging de auditoría
 */
const auditLog = (action) => {
  return async (req, res, next) => {
    const originalSend = res.send;

    res.send = function(data) {
      // Solo loguear si la operación fue exitosa
      if (res.statusCode >= 200 && res.statusCode < 300) {
        try {
          const auditData = {
            user_id: req.user?.id,
            action: action,
            entity_type: req.route?.path?.split('/')[1] || 'unknown',
            entity_id: req.params?.id ? parseInt(req.params.id) : null,
            old_values: null, // Para actualizaciones, se podría implementar comparación
            new_values: req.method === 'POST' || req.method === 'PUT' ? req.body : null,
            ip_address: req.ip,
            user_agent: req.get('User-Agent')
          };

          // Insertar en auditoría (de forma asíncrona, no bloqueante)
          executeQuery(`
            INSERT INTO dtic.audit_log
            (user_id, action, entity_type, entity_id, old_values, new_values, ip_address, user_agent)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          `, [
            auditData.user_id,
            auditData.action,
            auditData.entity_type,
            auditData.entity_id,
            auditData.old_values ? JSON.stringify(auditData.old_values) : null,
            auditData.new_values ? JSON.stringify(auditData.new_values) : null,
            auditData.ip_address,
            auditData.user_agent
          ]).catch(err => console.error('Error en audit log:', err));

        } catch (error) {
          console.error('Error creando audit log:', error);
        }
      }

      originalSend.call(this, data);
    };

    next();
  };
};

module.exports = {
  authenticateToken,
  requirePermission,
  requireOwnership,
  auditLog
};