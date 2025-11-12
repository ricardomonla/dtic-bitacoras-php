const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
const auth = require('../middleware/auth');

const router = express.Router();

// Middleware de autenticación (temporalmente comentado para desarrollo)
// router.use(auth);

// Función helper para ejecutar queries
const executeQuery = async (query, params = []) => {
  try {
    const result = await pool.query(query, params);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Función helper para generar DTIC ID para recursos
const generateDTICId = async (prefix = 'REC') => {
  const query = `
    SELECT generate_dtic_id($1) as new_id
  `;
  const result = await executeQuery(query, [prefix]);
  return result.rows[0].new_id;
};

// GET /api/recursos - Obtener lista de recursos con filtros
router.get('/', [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('search').optional().isString().trim(),
  query('category').optional().isIn(['hardware', 'software', 'network', 'security', 'tools', 'facilities']),
  query('status').optional().isIn(['available', 'assigned', 'maintenance', 'retired']),
  query('location').optional().isString().trim()
], async (req, res) => {
  try {
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
      category,
      status,
      location
    } = req.query;

    let query = `
      SELECT
        r.id, r.dtic_id, r.name, r.description, r.category, r.status,
        r.location, r.technical_specs, r.serial_number, r.model,
        r.created_at, r.updated_at,
        COUNT(DISTINCT ra.user_id) as assigned_users_count,
        COALESCE(json_agg(DISTINCT jsonb_build_object('id', t.id, 'title', t.title, 'status', t.status)) FILTER (WHERE t.id IS NOT NULL), '[]'::json) as related_tasks
      FROM dtic.recursos r
      LEFT JOIN dtic.recurso_asignaciones ra ON ra.recurso_id = r.id AND ra.activo = true
      LEFT JOIN dtic.tarea_recursos tr ON tr.recurso_id = r.id AND tr.activo = true
      LEFT JOIN dtic.tareas t ON t.id = tr.tarea_id
      WHERE 1=1
    `;

    const params = [];
    const conditions = [];

    // Filtros
    if (search) {
      conditions.push("(r.name ILIKE $1 OR r.description ILIKE $1 OR r.dtic_id ILIKE $1 OR r.serial_number ILIKE $1 OR r.model ILIKE $1)");
      params.push(`%${search}%`);
    }

    if (category) {
      conditions.push("r.category = $" + (params.length + 1));
      params.push(category);
    }

    if (status) {
      conditions.push("r.status = $" + (params.length + 1));
      params.push(status);
    }

    if (location) {
      conditions.push("r.location ILIKE $" + (params.length + 1));
      params.push(`%${location}%`);
    }

    if (conditions.length > 0) {
      query += " AND " + conditions.join(" AND ");
    }

    query += " GROUP BY r.id, r.dtic_id, r.name, r.description, r.category, r.status, r.location, r.technical_specs, r.serial_number, r.model, r.created_at, r.updated_at ORDER BY r.created_at DESC";

    // Paginación
    const offset = (page - 1) * limit;
    query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await executeQuery(query, params);

    // Obtener total para paginación
    let countQuery = "SELECT COUNT(*) as total FROM dtic.recursos r WHERE 1=1";
    const countParams = [];

    if (conditions.length > 0) {
      countQuery += " AND " + conditions.join(" AND ");
      countParams.push(...params.slice(0, -2));
    }

    const countResult = await executeQuery(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total);

    res.json({
      success: true,
      message: 'Recursos obtenidos exitosamente',
      data: {
        recursos: result.rows,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Error obteniendo recursos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// GET /api/recursos/:id - Obtener recurso específico
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
    const { include_history } = req.query;

    let query = `
      SELECT
        r.*,
        COUNT(DISTINCT ra.user_id) as total_assigned_users,
        COUNT(DISTINCT t.id) as total_tasks
      FROM dtic.recursos r
      LEFT JOIN dtic.recurso_asignaciones ra ON ra.recurso_id = r.id AND ra.activo = true
      LEFT JOIN dtic.tareas t ON t.recurso_id = r.id
      WHERE r.id = $1
      GROUP BY r.id
    `;

    const result = await executeQuery(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Recurso no encontrado'
      });
    }

    const recurso = result.rows[0];

    // Obtener usuarios asignados
    const assignedUsersQuery = `
      SELECT
        u.id, u.dtic_id, u.first_name, u.last_name,
        CONCAT(u.first_name, ' ', u.last_name) as full_name,
        ra.assigned_at, ra.assigned_by
      FROM dtic.recurso_asignaciones ra
      JOIN dtic.usuarios_relacionados u ON u.id = ra.user_id
      WHERE ra.recurso_id = $1 AND ra.activo = true
      ORDER BY ra.assigned_at DESC
    `;
    const assignedUsersResult = await executeQuery(assignedUsersQuery, [id]);
    recurso.assigned_users = assignedUsersResult.rows;

    // Obtener historial si se solicita
    if (include_history === 'true') {
      const historyQuery = `
        SELECT
          h.*,
          t.dtic_id as tecnico_dtic_id,
          CONCAT(t.first_name, ' ', t.last_name) as tecnico_name,
          u.dtic_id as usuario_dtic_id,
          CONCAT(u.first_name, ' ', u.last_name) as usuario_name
        FROM dtic.recurso_historial h
        LEFT JOIN dtic.tecnicos t ON t.id = h.tecnico_id
        LEFT JOIN dtic.usuarios_relacionados u ON u.id = h.usuario_id
        WHERE h.recurso_id = $1
        ORDER BY h.created_at DESC
        LIMIT 20
      `;
      const historyResult = await executeQuery(historyQuery, [id]);
      recurso.history = historyResult.rows;
    }

    res.json({
      success: true,
      message: 'Recurso obtenido exitosamente',
      data: { recurso }
    });

  } catch (error) {
    console.error('Error obteniendo recurso:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// POST /api/recursos - Crear nuevo recurso
router.post('/', [
  body('name').trim().isLength({ min: 2, max: 200 }),
  body('description').optional().trim().isLength({ max: 1000 }),
  body('category').isIn(['hardware', 'software', 'network', 'security', 'tools', 'facilities']),
  body('status').optional().isIn(['available', 'assigned', 'maintenance', 'retired']),
  body('location').optional().trim().isLength({ max: 200 }),
  body('technical_specs').optional(),
  body('serial_number').optional().trim().isLength({ max: 100 }),
  body('model').optional().trim().isLength({ max: 100 })
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

    const {
      name, description, category, status = 'available',
      location, technical_specs, serial_number, model
    } = req.body;

    // Generar DTIC ID
    const dticId = await generateDTICId('REC');

    // Insertar recurso
    const query = `
      INSERT INTO dtic.recursos
      (dtic_id, name, description, category, status, location, technical_specs, serial_number, model)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id
    `;

    const result = await executeQuery(query, [
      dticId, name, description, category, status, location,
      technical_specs, serial_number, model
    ]);

    res.status(201).json({
      success: true,
      message: 'Recurso creado exitosamente',
      data: {
        recurso_id: result.rows[0].id,
        dtic_id: dticId
      }
    });

  } catch (error) {
    console.error('Error creando recurso:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// PUT /api/recursos/:id - Actualizar recurso
router.put('/:id', [
  param('id').isInt({ min: 1 }).toInt(),
  body('name').optional().trim().isLength({ min: 2, max: 200 }),
  body('description').optional().trim().isLength({ max: 1000 }),
  body('category').optional().isIn(['hardware', 'software', 'network', 'security', 'tools', 'facilities']),
  body('status').optional().isIn(['available', 'assigned', 'maintenance', 'retired']),
  body('location').optional().trim().isLength({ max: 200 }),
  body('technical_specs').optional(),
  body('serial_number').optional().trim().isLength({ max: 100 }),
  body('model').optional().trim().isLength({ max: 100 })
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
    const {
      name, description, category, status, location,
      technical_specs, serial_number, model
    } = req.body;

    // Verificar que el recurso existe
    const existingQuery = 'SELECT * FROM dtic.recursos WHERE id = $1';
    const existingResult = await executeQuery(existingQuery, [id]);

    if (existingResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Recurso no encontrado'
      });
    }

    // Construir query de actualización
    const updateFields = [];
    const params = [];

    const allowedFields = [
      'name', 'description', 'category', 'status', 'location',
      'technical_specs', 'serial_number', 'model'
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateFields.push(`${field} = $${params.length + 1}`);
        params.push(req.body[field]);
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionaron campos para actualizar'
      });
    }

    params.push(id);
    const query = `
      UPDATE dtic.recursos
      SET ${updateFields.join(', ')}
      WHERE id = $${params.length}
    `;

    await executeQuery(query, params);

    res.json({
      success: true,
      message: 'Recurso actualizado exitosamente'
    });

  } catch (error) {
    console.error('Error actualizando recurso:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// DELETE /api/recursos/:id - Eliminar recurso
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

    // Verificar que el recurso existe
    const existingQuery = 'SELECT * FROM dtic.recursos WHERE id = $1';
    const existingResult = await executeQuery(existingQuery, [id]);

    if (existingResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Recurso no encontrado'
      });
    }

    const recurso = existingResult.rows[0];

    if (recurso.status === 'assigned') {
      // Verificar si tiene usuarios asignados activos
      const assignedUsersQuery = `
        SELECT COUNT(*) as count
        FROM dtic.recurso_asignaciones
        WHERE recurso_id = $1 AND activo = true
      `;
      const assignedResult = await executeQuery(assignedUsersQuery, [id]);

      if (parseInt(assignedResult.rows[0].count) > 0) {
        return res.status(409).json({
          success: false,
          message: 'No se puede eliminar el recurso porque tiene usuarios asignados'
        });
      }
    }

    // Cambiar estado a retirado (eliminación lógica)
    await executeQuery('UPDATE dtic.recursos SET status = $1 WHERE id = $2', ['retired', id]);

    res.json({
      success: true,
      message: 'Recurso retirado exitosamente'
    });

  } catch (error) {
    console.error('Error eliminando recurso:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// POST /api/recursos/:id/asignar - Asignar recurso a usuario
router.post('/:id/asignar', [
  param('id').isInt({ min: 1 }).toInt(),
  body('usuario_id').isInt({ min: 1 }),
  body('tecnico_id').optional().isInt({ min: 1 })
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
    const { usuario_id, tecnico_id } = req.body;

    // Verificar que el recurso existe
    const recursoQuery = 'SELECT * FROM dtic.recursos WHERE id = $1';
    const recursoResult = await executeQuery(recursoQuery, [id]);

    if (recursoResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Recurso no encontrado'
      });
    }

    // Verificar que el usuario existe
    const usuarioQuery = 'SELECT * FROM dtic.usuarios_relacionados WHERE id = $1';
    const usuarioResult = await executeQuery(usuarioQuery, [usuario_id]);

    if (usuarioResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Verificar que no esté ya asignado
    const existingQuery = `
      SELECT id FROM dtic.recurso_asignaciones
      WHERE recurso_id = $1 AND user_id = $2 AND activo = true
    `;
    const existingResult = await executeQuery(existingQuery, [id, usuario_id]);

    if (existingResult.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'El recurso ya está asignado a este usuario'
      });
    }

    // Crear asignación
    const assignQuery = `
      INSERT INTO dtic.recurso_asignaciones
      (recurso_id, user_id, assigned_by, activo)
      VALUES ($1, $2, $3, true)
    `;

    await executeQuery(assignQuery, [id, usuario_id, tecnico_id]);

    // Actualizar estado del recurso si estaba disponible
    if (recursoResult.rows[0].status === 'available') {
      await executeQuery('UPDATE dtic.recursos SET status = $1 WHERE id = $2', ['assigned', id]);
    }

    // Registrar en historial
    const historyQuery = `
      INSERT INTO dtic.recurso_historial
      (recurso_id, action, usuario_id, tecnico_id, details)
      VALUES ($1, $2, $3, $4, $5)
    `;

    await executeQuery(historyQuery, [
      id, 'assigned', usuario_id, tecnico_id,
      `Recurso asignado a ${usuarioResult.rows[0].first_name} ${usuarioResult.rows[0].last_name}`
    ]);

    res.json({
      success: true,
      message: 'Recurso asignado exitosamente'
    });

  } catch (error) {
    console.error('Error asignando recurso:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// POST /api/recursos/:id/desasignar - Desasignar recurso de usuario
router.post('/:id/desasignar', [
  param('id').isInt({ min: 1 }).toInt(),
  body('usuario_id').isInt({ min: 1 }),
  body('tecnico_id').optional().isInt({ min: 1 })
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
    const { usuario_id, tecnico_id } = req.body;

    // Verificar que la asignación existe
    const assignmentQuery = `
      SELECT ra.*, u.first_name, u.last_name
      FROM dtic.recurso_asignaciones ra
      JOIN dtic.usuarios_relacionados u ON u.id = ra.user_id
      WHERE ra.recurso_id = $1 AND ra.user_id = $2 AND ra.activo = true
    `;
    const assignmentResult = await executeQuery(assignmentQuery, [id, usuario_id]);

    if (assignmentResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Asignación no encontrada'
      });
    }

    // Desactivar asignación
    const updateQuery = `
      UPDATE dtic.recurso_asignaciones
      SET activo = false, unassigned_at = CURRENT_TIMESTAMP, unassigned_by = $1
      WHERE recurso_id = $2 AND user_id = $3 AND activo = true
    `;

    await executeQuery(updateQuery, [tecnico_id, id, usuario_id]);

    // Verificar si quedan usuarios asignados
    const remainingQuery = `
      SELECT COUNT(*) as count
      FROM dtic.recurso_asignaciones
      WHERE recurso_id = $1 AND activo = true
    `;
    const remainingResult = await executeQuery(remainingQuery, [id]);

    // Si no quedan usuarios asignados, cambiar estado a disponible
    if (parseInt(remainingResult.rows[0].count) === 0) {
      await executeQuery('UPDATE dtic.recursos SET status = $1 WHERE id = $2', ['available', id]);
    }

    // Registrar en historial
    const usuario = assignmentResult.rows[0];
    const historyQuery = `
      INSERT INTO dtic.recurso_historial
      (recurso_id, action, usuario_id, tecnico_id, details)
      VALUES ($1, $2, $3, $4, $5)
    `;

    await executeQuery(historyQuery, [
      id, 'unassigned', usuario_id, tecnico_id,
      `Recurso desasignado de ${usuario.first_name} ${usuario.last_name}`
    ]);

    res.json({
      success: true,
      message: 'Recurso desasignado exitosamente'
    });

  } catch (error) {
    console.error('Error desasignando recurso:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router;