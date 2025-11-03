const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const { executeQuery } = require('../database');

const router = express.Router();

// Función helper para generar DTIC ID para tareas
const generateDTICId = async (prefix = 'TAR') => {
  // Generar ID simple con formato TAR-XXXX
  const random = Math.floor(Math.random() * 10000);
  return `${prefix}-${random.toString().padStart(4, '0')}`;
};

// GET /api/tareas - Obtener lista de tareas
router.get('/', [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('technician_id').optional().isInt().toInt(),
  query('status').optional().isIn(['pending', 'in_progress', 'completed', 'cancelled']),
  query('priority').optional().isIn(['low', 'medium', 'high', 'urgent'])
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
      technician_id,
      status,
      priority
    } = req.query;

    let query = `
      SELECT
        t.id, t.dtic_id, t.title, t.description, t.status, t.priority,
        t.created_at, t.updated_at, t.due_date, t.completed_at,
        tec.id as technician_id, tec.first_name, tec.last_name,
        CONCAT(tec.first_name, ' ', tec.last_name) as technician_name
      FROM dtic.tareas t
      LEFT JOIN dtic.tecnicos tec ON tec.id = t.technician_id
      WHERE 1=1
    `;

    const params = [];
    const conditions = [];

    if (technician_id) {
      conditions.push("t.technician_id = $" + (params.length + 1));
      params.push(technician_id);
    }

    if (status) {
      conditions.push("t.status = $" + (params.length + 1));
      params.push(status);
    }

    if (priority) {
      conditions.push("t.priority = $" + (params.length + 1));
      params.push(priority);
    }

    if (conditions.length > 0) {
      query += " AND " + conditions.join(" AND ");
    }

    query += " ORDER BY t.created_at DESC";

    // Paginación
    const offset = (page - 1) * limit;
    query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await executeQuery(query, params);

    // Obtener total para paginación
    let countQuery = "SELECT COUNT(*) as total FROM dtic.tareas WHERE 1=1";
    const countParams = conditions.length > 0 ? params.slice(0, -2) : [];

    if (conditions.length > 0) {
      countQuery += " AND " + conditions.join(" AND ");
    }

    const countResult = await executeQuery(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total);

    res.json({
      success: true,
      message: 'Tareas obtenidas exitosamente',
      data: {
        tasks: result.rows,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Error obteniendo tareas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// GET /api/tareas/:id - Obtener tarea específica
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

    const query = `
      SELECT
        t.*,
        tec.id as technician_id, tec.first_name, tec.last_name,
        CONCAT(tec.first_name, ' ', tec.last_name) as technician_name
      FROM dtic.tareas t
      LEFT JOIN dtic.tecnicos tec ON tec.id = t.technician_id
      WHERE t.id = $1
    `;

    const result = await executeQuery(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Tarea obtenida exitosamente',
      data: { task: result.rows[0] }
    });

  } catch (error) {
    console.error('Error obteniendo tarea:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// POST /api/tareas - Crear nueva tarea
router.post('/', [
  body('title').trim().isLength({ min: 3, max: 200 }),
  body('description').optional().trim().isLength({ max: 1000 }),
  body('technician_id').optional().isInt({ min: 1 }).toInt(),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
  body('due_date').optional().isISO8601()
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

    const { title, description, technician_id, priority = 'medium', due_date } = req.body;

    // Verificar que el técnico existe si se especifica
    if (technician_id) {
      const techQuery = 'SELECT id FROM dtic.tecnicos WHERE id = $1 AND is_active = true';
      const techResult = await executeQuery(techQuery, [technician_id]);
      if (techResult.rows.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Técnico no encontrado o inactivo'
        });
      }
    }

    // Generar DTIC ID
    const dticId = await generateDTICId('TAR');

    // Insertar tarea
    const query = `
      INSERT INTO dtic.tareas
      (dtic_id, title, description, technician_id, priority, due_date, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `;

    const result = await executeQuery(query, [
      dticId, title, description, technician_id, priority, due_date, 'pending'
    ]);

    res.status(201).json({
      success: true,
      message: 'Tarea creada exitosamente',
      data: {
        task_id: result.rows[0].id,
        dtic_id: dticId
      }
    });

  } catch (error) {
    console.error('Error creando tarea:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// PUT /api/tareas/:id - Actualizar tarea
router.put('/:id', [
  param('id').isInt({ min: 1 }).toInt(),
  body('title').optional().trim().isLength({ min: 3, max: 200 }),
  body('description').optional().trim().isLength({ max: 1000 }),
  body('technician_id').optional().isInt({ min: 1 }).toInt(),
  body('status').optional().isIn(['pending', 'in_progress', 'completed', 'cancelled']),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
  body('due_date').optional().isISO8601()
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
    const { title, description, technician_id, status, priority, due_date } = req.body;

    // Verificar que la tarea existe
    const existingQuery = 'SELECT * FROM dtic.tareas WHERE id = $1';
    const existingResult = await executeQuery(existingQuery, [id]);

    if (existingResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada'
      });
    }

    // Verificar técnico si se está cambiando
    if (technician_id) {
      const techQuery = 'SELECT id FROM dtic.tecnicos WHERE id = $1 AND is_active = true';
      const techResult = await executeQuery(techQuery, [technician_id]);
      if (techResult.rows.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Técnico no encontrado o inactivo'
        });
      }
    }

    // Construir query de actualización
    const updateFields = [];
    const params = [];

    if (title !== undefined) {
      updateFields.push(`title = $${params.length + 1}`);
      params.push(title);
    }
    if (description !== undefined) {
      updateFields.push(`description = $${params.length + 1}`);
      params.push(description);
    }
    if (technician_id !== undefined) {
      updateFields.push(`technician_id = $${params.length + 1}`);
      params.push(technician_id);
    }
    if (status !== undefined) {
      updateFields.push(`status = $${params.length + 1}`);
      params.push(status);
      // Si se marca como completada, actualizar completed_at
      if (status === 'completed') {
        updateFields.push(`completed_at = CURRENT_TIMESTAMP`);
      }
    }
    if (priority !== undefined) {
      updateFields.push(`priority = $${params.length + 1}`);
      params.push(priority);
    }
    if (due_date !== undefined) {
      updateFields.push(`due_date = $${params.length + 1}`);
      params.push(due_date);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionaron campos para actualizar'
      });
    }

    params.push(id);
    const query = `
      UPDATE dtic.tareas
      SET ${updateFields.join(', ')}
      WHERE id = $${params.length}
    `;

    await executeQuery(query, params);

    res.json({
      success: true,
      message: 'Tarea actualizada exitosamente'
    });

  } catch (error) {
    console.error('Error actualizando tarea:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// DELETE /api/tareas/:id - Eliminar tarea
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

    // Verificar que la tarea existe
    const existingQuery = 'SELECT * FROM dtic.tareas WHERE id = $1';
    const existingResult = await executeQuery(existingQuery, [id]);

    if (existingResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada'
      });
    }

    // Eliminar tarea
    await executeQuery('DELETE FROM dtic.tareas WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'Tarea eliminada exitosamente'
    });

  } catch (error) {
    console.error('Error eliminando tarea:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router;