const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const { Pool } = require('pg');

const router = express.Router();

// Configuración de PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

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

// GET /api/tareas/:id/recursos - Obtener recursos asignados a una tarea
router.get('/tareas/:id/recursos', [
  param('id').isInt({ min: 1 }).toInt(),
  query('include_details').optional().isBoolean()
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

    const { id } = req.params;
    const { include_details } = req.query;

    // Verificar que la tarea existe
    const taskQuery = 'SELECT id, title FROM dtic.tareas WHERE id = $1';
    const taskResult = await executeQuery(taskQuery, [id]);

    if (taskResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada'
      });
    }

    let query = `
      SELECT
        tr.id,
        tr.tarea_id,
        tr.recurso_id,
        tr.assigned_by,
        tr.assigned_at,
        tr.estimated_hours,
        tr.actual_hours,
        tr.notes,
        tr.activo,
        r.dtic_id as recurso_dtic_id,
        r.name as recurso_name,
        r.category as recurso_category,
        r.status as recurso_status,
        r.location as recurso_location,
        r.model as recurso_model,
        t.first_name || ' ' || t.last_name as assigned_by_name
      FROM dtic.tarea_recursos tr
      JOIN dtic.recursos r ON r.id = tr.recurso_id
      LEFT JOIN dtic.tecnicos t ON t.id = tr.assigned_by
      WHERE tr.tarea_id = $1 AND tr.activo = true
      ORDER BY tr.assigned_at DESC
    `;

    const result = await executeQuery(query, [id]);

    // Si se solicitan detalles adicionales
    if (include_details === 'true') {
      for (let assignment of result.rows) {
        // Obtener historial de esta asignación
        const historyQuery = `
          SELECT action, created_at, details
          FROM dtic.tarea_recurso_historial
          WHERE tarea_recurso_id = $1
          ORDER BY created_at DESC
          LIMIT 5
        `;
        const historyResult = await executeQuery(historyQuery, [assignment.id]);
        assignment.history = historyResult.rows;
      }
    }

    res.json({
      success: true,
      message: 'Recursos asignados obtenidos exitosamente',
      data: {
        task: taskResult.rows[0],
        assignments: result.rows
      }
    });

  } catch (error) {
    console.error('Error obteniendo recursos asignados:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// POST /api/tareas/:id/recursos - Asignar recursos a una tarea
router.post('/tareas/:id/recursos', [
  param('id').isInt({ min: 1 }).toInt(),
  body('recurso_id').isInt({ min: 1 }),
  body('estimated_hours').optional().isFloat({ min: 0 }),
  body('notes').optional().isString().trim()
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
    const { recurso_id, estimated_hours, notes } = req.body;

    // Verificar que la tarea existe
    const taskQuery = 'SELECT id, title FROM dtic.tareas WHERE id = $1';
    const taskResult = await executeQuery(taskQuery, [id]);

    if (taskResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada'
      });
    }

    // Verificar que el recurso existe y está disponible
    const resourceQuery = 'SELECT id, name, status FROM dtic.recursos WHERE id = $1';
    const resourceResult = await executeQuery(resourceQuery, [recurso_id]);

    if (resourceResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Recurso no encontrado'
      });
    }

    if (resourceResult.rows[0].status !== 'available') {
      return res.status(409).json({
        success: false,
        message: 'El recurso no está disponible para asignación'
      });
    }

    // Verificar que no esté ya asignado a esta tarea
    const existingQuery = `
      SELECT id FROM dtic.tarea_recursos
      WHERE tarea_id = $1 AND recurso_id = $2 AND activo = true
    `;
    const existingResult = await executeQuery(existingQuery, [id, recurso_id]);

    if (existingResult.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'El recurso ya está asignado a esta tarea'
      });
    }

    // Obtener ID del técnico actual (debería venir del middleware de auth)
    const assigned_by = req.user?.id || 1; // Temporal hasta implementar auth

    // Insertar asignación
    const insertQuery = `
      INSERT INTO dtic.tarea_recursos
      (tarea_id, recurso_id, assigned_by, estimated_hours, notes)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `;

    const insertResult = await executeQuery(insertQuery, [
      id, recurso_id, assigned_by, estimated_hours, notes
    ]);

    // TODO: Registrar en historial - tabla tarea_recurso_historial no existe
    // const historyQuery = `
    //   INSERT INTO dtic.tarea_recurso_historial
    //   (tarea_recurso_id, action, tecnico_id, details)
    //   VALUES ($1, 'assigned', $2, $3)
    // `;

    // await executeQuery(historyQuery, [
    //   insertResult.rows[0].id,
    //   assigned_by,
    //   `Recurso asignado a tarea: ${taskResult.rows[0].title}`
    // ]);

    res.status(201).json({
      success: true,
      message: 'Recurso asignado exitosamente a la tarea',
      data: {
        assignment_id: insertResult.rows[0].id,
        task: taskResult.rows[0],
        resource: resourceResult.rows[0]
      }
    });

  } catch (error) {
    console.error('Error asignando recurso:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// PUT /api/tareas/:id/recursos/:recursoId - Actualizar asignación
router.put('/tareas/:id/recursos/:recursoId', [
  param('id').isInt({ min: 1 }).toInt(),
  param('recursoId').isInt({ min: 1 }).toInt(),
  body('estimated_hours').optional().isFloat({ min: 0 }),
  body('actual_hours').optional().isFloat({ min: 0 }),
  body('notes').optional().isString().trim()
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

    const { id, recursoId } = req.params;
    const { estimated_hours, actual_hours, notes } = req.body;

    // Verificar que la asignación existe y está activa
    const assignmentQuery = `
      SELECT tr.*, t.title as task_title, r.name as resource_name
      FROM dtic.tarea_recursos tr
      JOIN dtic.tareas t ON t.id = tr.tarea_id
      JOIN dtic.recursos r ON r.id = tr.recurso_id
      WHERE tr.tarea_id = $1 AND tr.recurso_id = $2 AND tr.activo = true
    `;

    const assignmentResult = await executeQuery(assignmentQuery, [id, recursoId]);

    if (assignmentResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Asignación no encontrada o inactiva'
      });
    }

    const assignment = assignmentResult.rows[0];

    // Obtener técnico actual
    const tecnico_id = req.user?.id || 1;

    // Construir query de actualización
    const updateFields = [];
    const params = [];
    const oldValues = {};

    if (estimated_hours !== undefined) {
      updateFields.push(`estimated_hours = $${params.length + 1}`);
      params.push(estimated_hours);
      oldValues.estimated_hours = assignment.estimated_hours;
    }

    if (actual_hours !== undefined) {
      updateFields.push(`actual_hours = $${params.length + 1}`);
      params.push(actual_hours);
      oldValues.actual_hours = assignment.actual_hours;
    }

    if (notes !== undefined) {
      updateFields.push(`notes = $${params.length + 1}`);
      params.push(notes);
      oldValues.notes = assignment.notes;
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionaron campos para actualizar'
      });
    }

    params.push(id, recursoId);
    const updateQuery = `
      UPDATE dtic.tarea_recursos
      SET ${updateFields.join(', ')}
      WHERE tarea_id = $${params.length - 1} AND recurso_id = $${params.length} AND activo = true
    `;

    await executeQuery(updateQuery, params);

    // TODO: Registrar en historial - tabla tarea_recurso_historial no existe
    // const historyQuery = `
    //   INSERT INTO dtic.tarea_recurso_historial
    //   (tarea_recurso_id, action, tecnico_id, old_values, new_values, details)
    //   VALUES ($1, 'updated', $2, $3, $4, $5)
    // `;

    // const newValues = { estimated_hours, actual_hours, notes };
    // await executeQuery(historyQuery, [
    //   assignment.id,
    //   tecnico_id,
    //   JSON.stringify(oldValues),
    //   JSON.stringify(newValues),
    //   `Asignación actualizada: ${assignment.task_title} - ${assignment.resource_name}`
    // ]);

    res.json({
      success: true,
      message: 'Asignación actualizada exitosamente'
    });

  } catch (error) {
    console.error('Error actualizando asignación:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// DELETE /api/tareas/:id/recursos/:recursoId - Desasignar recurso de tarea
router.delete('/tareas/:id/recursos/:recursoId', [
  param('id').isInt({ min: 1 }).toInt(),
  param('recursoId').isInt({ min: 1 }).toInt()
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

    const { id, recursoId } = req.params;

    // Verificar que la asignación existe y está activa
    const assignmentQuery = `
      SELECT tr.*, t.title as task_title, r.name as resource_name
      FROM dtic.tarea_recursos tr
      JOIN dtic.tareas t ON t.id = tr.tarea_id
      JOIN dtic.recursos r ON r.id = tr.recurso_id
      WHERE tr.tarea_id = $1 AND tr.recurso_id = $2 AND tr.activo = true
    `;

    const assignmentResult = await executeQuery(assignmentQuery, [id, recursoId]);

    if (assignmentResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Asignación no encontrada o ya inactiva'
      });
    }

    const assignment = assignmentResult.rows[0];
    const tecnico_id = req.user?.id || 1;

    // Desactivar asignación
    const updateQuery = `
      UPDATE dtic.tarea_recursos
      SET activo = false, unassigned_by = $1, unassigned_at = CURRENT_TIMESTAMP
      WHERE tarea_id = $2 AND recurso_id = $3 AND activo = true
    `;

    await executeQuery(updateQuery, [tecnico_id, id, recursoId]);

    // TODO: Registrar en historial - tabla tarea_recurso_historial no existe
    // const historyQuery = `
    //   INSERT INTO dtic.tarea_recurso_historial
    //   (tarea_recurso_id, action, tecnico_id, details)
    //   VALUES ($1, 'unassigned', $2, $3)
    // `;

    // await executeQuery(historyQuery, [
    //   assignment.id,
    //   tecnico_id,
    //   `Recurso desasignado de tarea: ${assignment.task_title}`
    // ]);

    res.json({
      success: true,
      message: 'Recurso desasignado exitosamente de la tarea'
    });

  } catch (error) {
    console.error('Error desasignando recurso:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// GET /api/recursos/:id/tareas - Obtener tareas que usan un recurso
router.get('/recursos/:id/tareas', [
  param('id').isInt({ min: 1 }).toInt(),
  query('include_completed').optional().isBoolean()
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

    const { id } = req.params;
    const { include_completed } = req.query;

    // Verificar que el recurso existe
    const resourceQuery = 'SELECT id, name FROM dtic.recursos WHERE id = $1';
    const resourceResult = await executeQuery(resourceQuery, [id]);

    if (resourceResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Recurso no encontrado'
      });
    }

    let statusCondition = 'tr.activo = true';
    if (include_completed === 'true') {
      statusCondition = 'true'; // Incluir todas las asignaciones
    }

    const query = `
      SELECT
        tr.id,
        tr.tarea_id,
        tr.assigned_at,
        tr.estimated_hours,
        tr.actual_hours,
        tr.notes,
        tr.activo,
        t.dtic_id as tarea_dtic_id,
        t.title as tarea_title,
        t.status as tarea_status,
        t.priority as tarea_priority,
        tec.first_name || ' ' || tec.last_name as tecnico_name
      FROM dtic.tarea_recursos tr
      JOIN dtic.tareas t ON t.id = tr.tarea_id
      LEFT JOIN dtic.tecnicos tec ON tec.id = t.technician_id
      WHERE tr.recurso_id = $1 AND ${statusCondition}
      ORDER BY tr.assigned_at DESC
    `;

    const result = await executeQuery(query, [id]);

    res.json({
      success: true,
      message: 'Tareas que usan el recurso obtenidas exitosamente',
      data: {
        resource: resourceResult.rows[0],
        assignments: result.rows
      }
    });

  } catch (error) {
    console.error('Error obteniendo tareas del recurso:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router;