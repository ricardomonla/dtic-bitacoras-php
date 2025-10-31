const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { executeQuery } = require('../database');

const router = express.Router();

// POST /api/auth/login - Iniciar sesión
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Buscar usuario por email
    const query = `
      SELECT id, dtic_id, first_name, last_name, email, password_hash, role, department, is_active
      FROM dtic.tecnicos
      WHERE email = $1
    `;

    const result = await executeQuery(query, [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    const user = result.rows[0];

    // Verificar si el usuario está activo
    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Usuario inactivo'
      });
    }

    // Verificar contraseña
    if (!user.password_hash) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no tiene contraseña configurada'
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Generar token JWT
    const token = jwt.sign(
      {
        id: user.id,
        dtic_id: user.dtic_id,
        email: user.email,
        role: user.role,
        department: user.department
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    // Actualizar último acceso
    await executeQuery(
      'UPDATE dtic.tecnicos SET updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );

    res.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      data: {
        token,
        user: {
          id: user.id,
          dtic_id: user.dtic_id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          role: user.role,
          department: user.department
        }
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// POST /api/auth/register - Registrar nuevo usuario (solo admin)
router.post('/register', [
  body('first_name').trim().isLength({ min: 2, max: 50 }),
  body('last_name').trim().isLength({ min: 2, max: 50 }),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('department').isIn(['dtic', 'sistemas', 'redes', 'seguridad']),
  body('role').isIn(['admin', 'technician', 'viewer'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Datos inválidos',
        errors: errors.array()
      });
    }

    const { first_name, last_name, email, password, department, role } = req.body;

    // Verificar email único
    const emailCheck = await executeQuery('SELECT id FROM dtic.tecnicos WHERE email = $1', [email]);
    if (emailCheck.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'El email ya está registrado'
      });
    }

    // Generar DTIC ID
    const dticIdResult = await executeQuery('SELECT generate_dtic_id($1) as new_id', ['TEC']);
    const dticId = dticIdResult.rows[0].new_id;

    // Hashear contraseña
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insertar usuario
    const query = `
      INSERT INTO dtic.tecnicos
      (dtic_id, first_name, last_name, email, password_hash, department, role, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id
    `;

    const result = await executeQuery(query, [
      dticId, first_name, last_name.toUpperCase(), email, hashedPassword, department, role, true
    ]);

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        user_id: result.rows[0].id,
        dtic_id: dticId
      }
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// POST /api/auth/logout - Cerrar sesión
router.post('/logout', (req, res) => {
  // En una implementación real, podrías mantener una lista negra de tokens
  // Por ahora, simplemente respondemos con éxito
  res.json({
    success: true,
    message: 'Sesión cerrada exitosamente'
  });
});

// GET /api/auth/me - Obtener información del usuario actual
router.get('/me', async (req, res) => {
  try {
    // El middleware de auth debería haber establecido req.user
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token no proporcionado'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const query = `
      SELECT id, dtic_id, first_name, last_name, email, role, department, is_active, created_at, updated_at
      FROM dtic.tecnicos
      WHERE id = $1
    `;

    const result = await executeQuery(query, [decoded.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    const user = result.rows[0];

    res.json({
      success: true,
      message: 'Información de usuario obtenida exitosamente',
      data: { user }
    });

  } catch (error) {
    console.error('Error obteniendo usuario actual:', error);

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
});

// POST /api/auth/refresh - Refrescar token
router.post('/refresh', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token requerido'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });

    // Verificar que el usuario aún existe y está activo
    const query = 'SELECT id, is_active FROM dtic.tecnicos WHERE id = $1';
    const result = await executeQuery(query, [decoded.id]);

    if (result.rows.length === 0 || !result.rows[0].is_active) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no válido'
      });
    }

    // Generar nuevo token
    const newToken = jwt.sign(
      {
        id: decoded.id,
        dtic_id: decoded.dtic_id,
        email: decoded.email,
        role: decoded.role,
        department: decoded.department
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      success: true,
      message: 'Token refrescado exitosamente',
      data: { token: newToken }
    });

  } catch (error) {
    console.error('Error refrescando token:', error);
    res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }
});

module.exports = router;