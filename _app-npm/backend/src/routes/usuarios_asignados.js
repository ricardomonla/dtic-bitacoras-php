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

// Función helper para generar DTIC ID para usuarios asignados
const generateDTICId = async (prefix = 'USR') => {
  const query = `
    SELECT generate_dtic_id($1) as new_id
  `;
  const result = await executeQuery(query, [prefix]);
  return result.rows[0].new_id;
};

// GET /api/usuarios_asignados - Obtener lista de usuarios asignados
router.get('/', [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('search').optional().isString().trim(),
  query('department').optional().isString().trim()
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
      limit = 20,
      search,
      department
    } = req.query;

    let query = `
      SELECT
        u.id, u.dtic_id, u.first_name, u.last_name,
        CONCAT(u.first_name, ' ', u.last_name) as full_name,
        u.email, u.phone, u.department, u.position,
        u.created_at, u.updated_at,
        COUNT(DISTINCT ra.recurso_id) as assigned_resources_count
      FROM dtic.usuarios_asignados u
      LEFT JOIN dtic.recurso_asignaciones ra ON ra.user_id = u.id AND ra.activo = true
      WHERE 1=1
    `;

    const params = [];
    const conditions = [];

    // Filtros
    if (search) {
      conditions.push("(u.first_name ILIKE $1 OR u.last_name ILIKE $1 OR u.email ILIKE $1 OR u.dtic_id ILIKE $1)");
      params.push(`%${search}%`);
    }

    if (department) {
      conditions.push("u.department ILIKE $" + (params.length + 1));
      params.push(`%${department}%`);
    }

    if (conditions.length > 0) {
      query += " AND " + conditions.join(" AND ");
    }

    query += " GROUP BY u.id ORDER BY u.last_name, u.first_name";

    // Paginación
    const offset = (page - 1) * limit;
    query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await executeQuery(query, params);

    // Obtener total para paginación
    let countQuery = "SELECT COUNT(*) as total FROM dtic.usuarios_asignados u WHERE 1=1";
    const countParams = [];

    if (conditions.length > 0) {
      countQuery += " AND " + conditions.join(" AND ");
      countParams.push(...params.slice(0, -2));
    }

    const countResult = await executeQuery(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total);

    res.json({
      success: true,
      message: 'Usuarios asignados obtenidos exitosamente',
      data: {
        usuarios: result.rows,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Error obteniendo usuarios asignados:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// GET /api/usuarios_asignados/:id - Obtener usuario asignado específico
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
    const { include_resources } = req.query;

    let query = `
      SELECT
        u.*,
        COUNT(DISTINCT ra.recurso_id) as total_assigned_resources
      FROM dtic.usuarios_asignados u
      LEFT JOIN dtic.recurso_asignaciones ra ON ra.user_id = u.id AND ra.activo = true
      WHERE u.id = $1
      GROUP BY u.id
    `;

    const result = await executeQuery(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario asignado no encontrado'
      });
    }

    const usuario = result.rows[0];

    // Obtener recursos asignados si se solicita
    if (include_resources === 'true') {
      const resourcesQuery = `
        SELECT
          r.id, r.dtic_id, r.name, r.category, r.status, r.location,
          ra.assigned_at
        FROM dtic.recurso_asignaciones ra
        JOIN dtic.recursos r ON r.id = ra.recurso_id
        WHERE ra.user_id = $1 AND ra.activo = true
        ORDER BY ra.assigned_at DESC
      `;
      const resourcesResult = await executeQuery(resourcesQuery, [id]);
      usuario.assigned_resources = resourcesResult.rows;
    }

    res.json({
      success: true,
      message: 'Usuario asignado obtenido exitosamente',
      data: { usuario }
    });

  } catch (error) {
    console.error('Error obteniendo usuario asignado:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// POST /api/usuarios_asignados - Crear nuevo usuario asignado
router.post('/', [
  body('first_name').trim().isLength({ min: 2, max: 50 }),
  body('last_name').trim().isLength({ min: 2, max: 50 }),
  body('email').optional().isEmail().normalizeEmail(),
  body('phone').optional().isMobilePhone('es-AR'),
  body('department').optional().trim().isLength({ max: 100 }),
  body('position').optional().trim().isLength({ max: 100 })
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

    const { first_name, last_name, email, phone, department, position } = req.body;

    // Verificar email único si se proporciona
    if (email) {
      const emailCheck = await executeQuery('SELECT id FROM dtic.usuarios_asignados WHERE email = $1', [email]);
      if (emailCheck.rows.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'El email ya está registrado'
        });
      }
    }

    // Generar DTIC ID
    const dticId = await generateDTICId('USR');

    // Insertar usuario asignado
    const query = `
      INSERT INTO dtic.usuarios_asignados
      (dtic_id, first_name, last_name, email, phone, department, position)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `;

    const result = await executeQuery(query, [
      dticId, first_name, last_name.toUpperCase(), email, phone, department, position
    ]);

    res.status(201).json({
      success: true,
      message: 'Usuario asignado creado exitosamente',
      data: {
        usuario_id: result.rows[0].id,
        dtic_id: dticId
      }
    });

  } catch (error) {
    console.error('Error creando usuario asignado:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// PUT /api/usuarios_asignados/:id - Actualizar usuario asignado
router.put('/:id', [
  param('id').isInt({ min: 1 }).toInt(),
  body('first_name').optional().trim().isLength({ min: 2, max: 50 }),
  body('last_name').optional().trim().isLength({ min: 2, max: 50 }),
  body('email').optional().isEmail().normalizeEmail(),
  body('phone').optional().isMobilePhone('es-AR'),
  body('department').optional().trim().isLength({ max: 100 }),
  body('position').optional().trim().isLength({ max: 100 })
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
    const { first_name, last_name, email, phone, department, position } = req.body;

    // Verificar que el usuario existe
    const existingQuery = 'SELECT * FROM dtic.usuarios_asignados WHERE id = $1';
    const existingResult = await executeQuery(existingQuery, [id]);

    if (existingResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario asignado no encontrado'
      });
    }

    // Verificar email único si se está cambiando
    if (email && email !== existingResult.rows[0].email) {
      const emailCheck = await executeQuery('SELECT id FROM dtic.usuarios_asignados WHERE email = $1 AND id != $2', [email, id]);
      if (emailCheck.rows.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'El email ya está registrado por otro usuario'
        });
      }
    }

    // Construir query de actualización
    const updateFields = [];
    const params = [];

    const allowedFields = ['first_name', 'last_name', 'email', 'phone', 'department', 'position'];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateFields.push(`${field} = $${params.length + 1}`);
        params.push(field === 'last_name' ? req.body[field].toUpperCase() : req.body[field]);
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
      UPDATE dtic.usuarios_asignados
      SET ${updateFields.join(', ')}
      WHERE id = $${params.length}
    `;

    await executeQuery(query, params);

    res.json({
      success: true,
      message: 'Usuario asignado actualizado exitosamente'
    });

  } catch (error) {
    console.error('Error actualizando usuario asignado:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// DELETE /api/usuarios_asignados/:id - Eliminar usuario asignado
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

    // Verificar que el usuario existe
    const existingQuery = 'SELECT * FROM dtic.usuarios_asignados WHERE id = $1';
    const existingResult = await executeQuery(existingQuery, [id]);

    if (existingResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario asignado no encontrado'
      });
    }

    // Verificar que no tenga recursos asignados activos
    const resourcesQuery = `
      SELECT COUNT(*) as count
      FROM dtic.recurso_asignaciones
      WHERE user_id = $1 AND activo = true
    `;
    const resourcesResult = await executeQuery(resourcesQuery, [id]);

    if (parseInt(resourcesResult.rows[0].count) > 0) {
      return res.status(409).json({
        success: false,
        message: 'No se puede eliminar el usuario porque tiene recursos asignados'
      });
    }

    // Eliminar usuario asignado
    await executeQuery('DELETE FROM dtic.usuarios_asignados WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'Usuario asignado eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error eliminando usuario asignado:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router;