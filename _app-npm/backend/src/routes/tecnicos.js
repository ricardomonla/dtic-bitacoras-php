const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const { pool } = require('../database');
const auth = require('../middleware/auth');

const router = express.Router();

// Middleware de autenticación (temporalmente comentado para desarrollo)
// router.use(auth);

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


// Función helper para generar DTIC ID
const generateDTICId = async (prefix = 'TEC') => {
  // Generar ID simple sin función de PostgreSQL por ahora
  const timestamp = Date.now().toString().slice(-4);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}-${timestamp}${random}`;
};

// Función helper para validar email único
const isEmailUnique = async (email, excludeId = null) => {
  let query = 'SELECT id FROM dtic.tecnicos WHERE email = $1';
  const params = [email];

  if (excludeId) {
    query += ' AND id != $2';
    params.push(excludeId);
  }

  const result = await executeQuery(query, params);
  return result.rows.length === 0;
};

// GET /api/tecnicos - Obtener lista de técnicos con filtros
router.get('/', [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('search').optional().isString().trim(),
  query('department').optional().isIn(['dtic', 'sistemas', 'redes', 'seguridad']),
  query('role').optional().isIn(['admin', 'technician', 'viewer']),
  query('status').optional().isIn(['active', 'inactive', 'all'])
], async (req, res) => {
  try {
    // Validar parámetros
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Parámetros inválidos',
        errors: errors.array()
      });
    }

    const {
      page = 1,
      limit = 12,
      search,
      department,
      role,
      status
    } = req.query;

    // Construir query base
    let query = `
      SELECT
        tec.id, tec.dtic_id, tec.first_name, tec.last_name,
        CONCAT(tec.first_name, ' ', tec.last_name) as full_name,
        tec.email, tec.phone, tec.department, tec.role, tec.is_active,
        tec.created_at, tec.updated_at,
        COUNT(t.id) as active_tasks
      FROM dtic.tecnicos tec
      LEFT JOIN dtic.tareas t ON t.technician_id = tec.id AND t.status IN ('pending', 'in_progress')
      WHERE 1=1
    `;

    const params = [];
    const conditions = [];

    // Filtros
    if (search) {
      conditions.push("(tec.first_name ILIKE $1 OR tec.last_name ILIKE $1 OR tec.email ILIKE $1 OR tec.dtic_id ILIKE $1)");
      params.push(`%${search}%`);
    }

    if (department) {
      conditions.push("tec.department = $" + (params.length + 1));
      params.push(department);
    }

    if (role) {
      conditions.push("tec.role = $" + (params.length + 1));
      params.push(role);
    }

    if (status) {
      if (status === 'active') {
        conditions.push("tec.is_active = $" + (params.length + 1));
        params.push(true);
      } else if (status === 'inactive') {
        conditions.push("tec.is_active = $" + (params.length + 1));
        params.push(false);
      }
      // 'all' no agrega condición (muestra todos)
    }
    // Por defecto mostrar todos los técnicos (activos e inactivos)

    if (conditions.length > 0) {
      query += " AND " + conditions.join(" AND ");
    }

    query += " GROUP BY tec.id ORDER BY tec.is_active DESC, tec.last_name, tec.first_name";

    // Paginación
    const offset = (page - 1) * limit;
    query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    // Ejecutar query principal
    console.log('[DEBUG] Executing query:', query);
    console.log('[DEBUG] With params:', params);
    const result = await executeQuery(query, params);

    // Obtener total para paginación
    let countQuery = "SELECT COUNT(*) as total FROM dtic.tecnicos tec WHERE 1=1";
    const countParams = [];

    if (conditions.length > 0) {
      countQuery += " AND " + conditions.join(" AND ");
      countParams.push(...params.slice(0, -2));
    }

    const countResult = await executeQuery(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total);

    res.json({
      success: true,
      message: 'Técnicos obtenidos exitosamente',
      data: {
        tecnicos: result.rows,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Error obteniendo técnicos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// GET /api/tecnicos/:id - Obtener técnico específico
router.get('/:id', [
  param('id').isInt({ min: 1 }).toInt()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'ID inválido',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { include_tasks } = req.query;

    let query = `
      SELECT
        t.*,
        COUNT(ts.id) as total_tasks,
        COUNT(CASE WHEN ts.status = 'completed' THEN 1 END) as completed_tasks,
        COUNT(CASE WHEN ts.status IN ('pending', 'in_progress') THEN 1 END) as active_tasks
      FROM dtic.tecnicos t
      LEFT JOIN dtic.tareas ts ON ts.technician_id = t.id
      WHERE t.id = $1
      GROUP BY t.id
    `;

    const result = await executeQuery(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Técnico no encontrado'
      });
    }

    const technician = result.rows[0];

    // Incluir tareas recientes si se solicita
    if (include_tasks === 'true') {
      const tasksQuery = `
        SELECT id, dtic_id, title, status, priority, created_at, due_date
        FROM dtic.tareas
        WHERE technician_id = $1
        ORDER BY created_at DESC
        LIMIT 5
      `;
      const tasksResult = await executeQuery(tasksQuery, [id]);
      technician.recent_tasks = tasksResult.rows;
    }

    res.json({
      success: true,
      message: 'Técnico obtenido exitosamente',
      data: { technician }
    });

  } catch (error) {
    console.error('Error obteniendo técnico:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// POST /api/tecnicos - Crear nuevo técnico
router.post('/', [
  body('first_name').trim().isLength({ min: 2, max: 50 }),
  body('last_name').trim().isLength({ min: 2, max: 50 }),
  body('email').isEmail().normalizeEmail(),
  body('department').isIn(['dtic', 'sistemas', 'redes', 'seguridad']),
  body('role').isIn(['admin', 'technician', 'viewer']),
  body('phone').optional()
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

    const { first_name, last_name, email, department, role, phone } = req.body;

    // Verificar email único
    if (!(await isEmailUnique(email))) {
      return res.status(409).json({
        success: false,
        message: 'El email ya está registrado'
      });
    }

    // Generar DTIC ID
    const dticId = await generateDTICId('TEC');

    // Insertar técnico (apellido siempre en mayúsculas)
    const query = `
      INSERT INTO dtic.tecnicos
      (dtic_id, first_name, last_name, email, phone, department, role, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id
    `;

    const result = await executeQuery(query, [
      dticId, first_name, last_name.toUpperCase(), email, phone, department, role, true
    ]);

    res.status(201).json({
      success: true,
      message: 'Técnico creado exitosamente',
      data: {
        technician_id: result.rows[0].id,
        dtic_id: dticId
      }
    });

  } catch (error) {
    console.error('Error creando técnico:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// PUT /api/tecnicos/:id - Actualizar técnico
router.put('/:id', [
  param('id').isInt({ min: 1 }).toInt(),
  query('action').optional().isIn(['change_password']),
  body('first_name').optional().trim().isLength({ min: 2, max: 50 }),
  body('last_name').optional().trim().isLength({ min: 2, max: 50 }),
  body('email').optional().isEmail().normalizeEmail(),
  body('department').optional().isIn(['dtic', 'sistemas', 'redes', 'seguridad']),
  body('role').optional().isIn(['admin', 'technician', 'viewer']),
  body('phone').optional(),
  body('is_active').optional().isBoolean(),
  body('new_password').optional().isLength({ min: 8 }),
  body('force_change').optional().isBoolean()
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

    const { id } = req.params;
    const { action } = req.query;
    const { first_name, last_name, email, department, role, phone, is_active, new_password, force_change } = req.body;

    // Verificar si es cambio de contraseña
    if (action === 'change_password') {
      return await changeTechnicianPassword(id, { new_password, force_change }, res);
    }

    // Verificar que el técnico existe
    const existingQuery = 'SELECT * FROM dtic.tecnicos WHERE id = $1';
    const existingResult = await executeQuery(existingQuery, [id]);

    if (existingResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Técnico no encontrado'
      });
    }

    // Verificar email único si se está cambiando
    if (email && email !== existingResult.rows[0].email) {
      if (!(await isEmailUnique(email, id))) {
        return res.status(409).json({
          success: false,
          message: 'El email ya está registrado por otro técnico'
        });
      }
    }

    // Construir query de actualización
    const updateFields = [];
    const params = [];

    if (first_name !== undefined) {
      updateFields.push(`first_name = $${params.length + 1}`);
      params.push(first_name);
    }
    if (last_name !== undefined) {
      updateFields.push(`last_name = $${params.length + 1}`);
      params.push(last_name.toUpperCase()); // Siempre convertir apellido a mayúsculas
    }
    if (email !== undefined) {
      updateFields.push(`email = $${params.length + 1}`);
      params.push(email);
    }
    if (department !== undefined) {
      updateFields.push(`department = $${params.length + 1}`);
      params.push(department);
    }
    if (role !== undefined) {
      updateFields.push(`role = $${params.length + 1}`);
      params.push(role);
    }
    if (phone !== undefined) {
      updateFields.push(`phone = $${params.length + 1}`);
      params.push(phone);
    }
    if (is_active !== undefined) {
      updateFields.push(`is_active = $${params.length + 1}`);
      params.push(is_active);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionaron campos para actualizar'
      });
    }

    params.push(id);
    const query = `
      UPDATE dtic.tecnicos
      SET ${updateFields.join(', ')}
      WHERE id = $${params.length}
    `;

    await executeQuery(query, params);

    res.json({
      success: true,
      message: 'Técnico actualizado exitosamente'
    });

  } catch (error) {
    console.error('Error actualizando técnico:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// DELETE /api/tecnicos/:id - Eliminar técnico
router.delete('/:id', [
  param('id').isInt({ min: 1 }).toInt()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'ID inválido',
        errors: errors.array()
      });
    }

    const { id } = req.params;

    // Verificar que el técnico existe
    const existingQuery = 'SELECT * FROM dtic.tecnicos WHERE id = $1';
    const existingResult = await executeQuery(existingQuery, [id]);

    if (existingResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Técnico no encontrado'
      });
    }

    const technician = existingResult.rows[0];

    if (technician.is_active) {
      // Verificar tareas activas antes de desactivar
      const tasksQuery = `
        SELECT COUNT(*) as count
        FROM dtic.tareas
        WHERE technician_id = $1 AND status IN ('pending', 'in_progress')
      `;
      const tasksResult = await executeQuery(tasksQuery, [id]);

      if (parseInt(tasksResult.rows[0].count) > 0) {
        return res.status(409).json({
          success: false,
          message: 'No se puede desactivar el técnico porque tiene tareas activas'
        });
      }

      // Desactivar técnico
      await executeQuery('UPDATE dtic.tecnicos SET is_active = false WHERE id = $1', [id]);

      res.json({
        success: true,
        message: 'Técnico desactivado exitosamente'
      });
    } else {
      // Verificar tareas activas antes de eliminar permanentemente
      const tasksQuery = `
        SELECT COUNT(*) as count
        FROM dtic.tareas
        WHERE technician_id = $1 AND status IN ('pending', 'in_progress')
      `;
      const tasksResult = await executeQuery(tasksQuery, [id]);

      if (parseInt(tasksResult.rows[0].count) > 0) {
        return res.status(409).json({
          success: false,
          message: 'No se puede eliminar permanentemente el técnico porque tiene tareas activas'
        });
      }

      // Eliminar permanentemente
      await executeQuery('DELETE FROM dtic.tecnicos WHERE id = $1', [id]);

      res.json({
        success: true,
        message: 'Técnico eliminado permanentemente del sistema'
      });
    }

  } catch (error) {
    console.error('Error eliminando técnico:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Función para cambiar contraseña de técnico
const changeTechnicianPassword = async (id, { new_password, force_change }, res) => {
  try {
    // Verificar que el técnico existe
    const existingQuery = 'SELECT * FROM dtic.tecnicos WHERE id = $1';
    const existingResult = await executeQuery(existingQuery, [id]);

    if (existingResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Técnico no encontrado'
      });
    }

    // Validar contraseña
    if (!new_password || new_password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 8 caracteres'
      });
    }

    // Validar fortaleza de contraseña
    const hasUpperCase = /[A-Z]/.test(new_password);
    const hasLowerCase = /[a-z]/.test(new_password);
    const hasNumbers = /\d/.test(new_password);
    const hasNonalphas = /[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?]/.test(new_password);

    if (!(hasUpperCase && hasLowerCase && hasNumbers && hasNonalphas)) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe contener mayúsculas, minúsculas, números y caracteres especiales'
      });
    }

    // Hashear nueva contraseña
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(new_password, 12);

    // Actualizar contraseña
    const query = 'UPDATE dtic.tecnicos SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2';
    await executeQuery(query, [hashedPassword, id]);

    // Log de auditoría
    console.log(`[AUDIT] Contraseña cambiada para técnico ID: ${id}, force_change: ${force_change || false}`);

    res.json({
      success: true,
      message: 'Contraseña cambiada exitosamente'
    });

  } catch (error) {
    console.error('Error cambiando contraseña:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

module.exports = router;