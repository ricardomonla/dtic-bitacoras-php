<?php
/**
 * API para gestión de técnicos del DTIC
 * DTIC Bitácoras - Sistema de gestión de recursos y tareas
 */

// Incluir archivos necesarios
require_once '../config/database.php';
require_once '../includes/functions.php';
require_once '../includes/security.php';

// Iniciar sesión segura
startSecureSession();

// Headers CORS y JSON
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Manejar preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Obtener método HTTP
$method = $_SERVER['REQUEST_METHOD'];
$id = getRequestParam('id', null, 'GET');

// Temporal: Permitir acceso sin autenticación para desarrollo
// requirePermission('viewer');

// Routing según método HTTP
switch ($method) {
    case 'GET':
        if ($id) {
            getTechnician($id);
        } else {
            getTechnicians();
        }
        break;

    case 'POST':
        // Temporal: Permitir acceso sin autenticación para desarrollo
        // requirePermission('admin');
        createTechnician();
        break;

    case 'PUT':
        // Temporal: Permitir acceso sin autenticación para desarrollo
        // requirePermission('admin');
        if (!$id) {
            sendErrorResponse('ID de técnico requerido para actualización', 400);
        }
        updateTechnician($id);
        break;

    case 'PATCH':
        // PATCH no implementado - usar PUT para actualizaciones
        sendErrorResponse('Método PATCH no soportado, use PUT para actualizaciones', 405);
        break;

    case 'DELETE':
        requirePermission('admin');
        if (!$id) {
            sendErrorResponse('ID de técnico requerido para eliminación', 400);
        }
        deleteTechnician($id);
        break;

    default:
        sendErrorResponse('Método HTTP no soportado', 405);
}

/**
 * Obtiene lista de técnicos con filtros opcionales
 */
function getTechnicians(): void {
    try {
        $sql = "SELECT
                    t.id,
                    t.dtic_id,
                    t.first_name,
                    t.last_name,
                    CONCAT(t.first_name, ' ', t.last_name) as full_name,
                    t.email,
                    t.phone,
                    t.department,
                    t.role,
                    t.is_active,
                    t.created_at,
                    t.updated_at,
                    COUNT(ts.id) as active_tasks
                FROM technicians t
                LEFT JOIN tasks ts ON ts.technician_id = t.id AND ts.status IN ('pending', 'in_progress')
                WHERE 1=1";

        $params = [];
        $conditions = [];

        // Filtros opcionales
        if ($search = getRequestParam('search')) {
            $conditions[] = "(t.first_name LIKE ? OR t.last_name LIKE ? OR t.email LIKE ? OR t.dtic_id LIKE ?)";
            $searchParam = "%{$search}%";
            $params = array_merge($params, [$searchParam, $searchParam, $searchParam, $searchParam]);
        }

        if ($department = getRequestParam('department')) {
            $conditions[] = "t.department = ?";
            $params[] = $department;
        }

        if ($role = getRequestParam('role')) {
            $conditions[] = "t.role = ?";
            $params[] = $role;
        }

        if ($status = getRequestParam('status')) {
            $conditions[] = "t.is_active = ?";
            $params[] = $status === 'active' ? 1 : 0;
        }

        if (!empty($conditions)) {
            $sql .= " AND " . implode(" AND ", $conditions);
        }

        $sql .= " GROUP BY t.id ORDER BY t.is_active DESC, t.last_name, t.first_name";

        // Paginación
        $page = max(1, (int)getRequestParam('page', 1));
        $limit = min(100, max(1, (int)getRequestParam('limit', 20)));
        $offset = ($page - 1) * $limit;

        $sql .= " LIMIT ? OFFSET ?";
        $params[] = $limit;
        $params[] = $offset;

        $stmt = executeQuery($sql, $params);
        $technicians = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Obtener total para paginación
        $countSql = "SELECT COUNT(DISTINCT t.id) as total FROM technicians t WHERE 1=1";
        $countParams = [];
        if (!empty($conditions)) {
            $countSql .= " AND " . implode(" AND ", $conditions);
            // Extraer solo los parámetros de las condiciones (sin LIMIT/OFFSET)
            $countParams = array_slice($params, 0, count($conditions));
        }

        $countStmt = executeQuery($countSql, $countParams);
        $total = $countStmt->fetch(PDO::FETCH_ASSOC)['total'];

        $response = [
            'technicians' => $technicians,
            'pagination' => [
                'page' => $page,
                'limit' => $limit,
                'total' => (int)$total,
                'pages' => ceil($total / $limit)
            ]
        ];

        sendJsonResponse(true, 'Técnicos obtenidos exitosamente', $response);

    } catch (Exception $e) {
        error_log("Error obteniendo técnicos: " . $e->getMessage());
        sendErrorResponse('Error interno del servidor', 500);
    }
}

/**
 * Obtiene un técnico específico por ID
 */
function getTechnician(int $id): void {
    try {
        $sql = "SELECT
                    t.*,
                    COUNT(ts.id) as total_tasks,
                    COUNT(CASE WHEN ts.status = 'completed' THEN 1 END) as completed_tasks,
                    COUNT(CASE WHEN ts.status IN ('pending', 'in_progress') THEN 1 END) as active_tasks
                FROM technicians t
                LEFT JOIN tasks ts ON ts.technician_id = t.id
                WHERE t.id = ?
                GROUP BY t.id";

        $stmt = executeQuery($sql, [$id]);
        $technician = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$technician) {
            sendErrorResponse('Técnico no encontrado', 404);
        }

        // Obtener tareas recientes del técnico (solo si se solicita específicamente)
        if (getRequestParam('include_tasks', false)) {
            $tasksSql = "SELECT
                            id, dtic_id, title, status, priority, created_at, due_date
                         FROM tasks
                         WHERE technician_id = ?
                         ORDER BY created_at DESC
                         LIMIT 5";

            $tasksStmt = executeQuery($tasksSql, [$id]);
            $technician['recent_tasks'] = $tasksStmt->fetchAll(PDO::FETCH_ASSOC);
        }

        sendJsonResponse(true, 'Técnico obtenido exitosamente', ['technician' => $technician]);

    } catch (Exception $e) {
        error_log("Error obteniendo técnico {$id}: " . $e->getMessage());
        sendErrorResponse('Error interno del servidor', 500);
    }
}

/**
 * Crea un nuevo técnico
 */
function createTechnician(): void {
    try {
        $data = getJsonInput();

        // Validar datos requeridos
        $validationRules = [
            'first_name' => ['required' => true, 'min_length' => 2, 'max_length' => 50],
            'last_name' => ['required' => true, 'min_length' => 2, 'max_length' => 50],
            'email' => ['required' => true, 'email' => true],
            'department' => ['required' => true, 'min_length' => 2, 'max_length' => 100],
            'role' => ['required' => true, 'in' => ['admin', 'technician', 'viewer']]
        ];

        $validation = validateData($data, $validationRules);
        if (!$validation['valid']) {
            sendErrorResponse('Datos inválidos: ' . implode(', ', $validation['errors']), 400);
        }

        // Sanitizar datos
        $data = sanitizeData($data);

        // Convertir apellido a mayúsculas (conversión completa a mayúsculas)
        $data['last_name'] = mb_strtoupper($data['last_name'], 'UTF-8');

        // Generar DTIC ID único
        $dticId = generateDTICId('TEC');

        // Verificar email único
        $emailCheck = executeQuery("SELECT id FROM technicians WHERE email = ?", [$data['email']]);
        if ($emailCheck->fetch()) {
            sendErrorResponse('El email ya está registrado', 409);
        }

        // Insertar técnico
        $sql = "INSERT INTO technicians
                (dtic_id, first_name, last_name, email, phone, department, role, is_active)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        $params = [
            $dticId,
            $data['first_name'],
            $data['last_name'],
            $data['email'],
            $data['phone'] ?? null,
            $data['department'],
            $data['role'],
            $data['is_active'] ?? true
        ];

        executeQuery($sql, $params);
        $technicianId = getDBConnection()->lastInsertId();

        sendJsonResponse(true, 'Técnico creado exitosamente', [
            'technician_id' => $technicianId,
            'dtic_id' => $dticId
        ], 201);

    } catch (Exception $e) {
        error_log("Error creando técnico: " . $e->getMessage());
        sendErrorResponse('Error interno del servidor', 500);
    }
}

/**
 * Actualiza un técnico existente
 */
function updateTechnician(int $id): void {
    try {
        // Verificar que el técnico existe
        $existing = executeQuery("SELECT * FROM technicians WHERE id = ?", [$id])->fetch(PDO::FETCH_ASSOC);
        if (!$existing) {
            sendErrorResponse('Técnico no encontrado', 404);
        }

        $data = getJsonInput();

        // Validar datos
        $validationRules = [
            'first_name' => ['min_length' => 2, 'max_length' => 50],
            'last_name' => ['min_length' => 2, 'max_length' => 50],
            'email' => ['email' => true],
            'department' => ['min_length' => 2, 'max_length' => 100],
            'role' => ['in' => ['admin', 'technician', 'viewer']]
        ];

        $validation = validateData($data, $validationRules);
        if (!$validation['valid']) {
            sendErrorResponse('Datos inválidos: ' . implode(', ', $validation['errors']), 400);
        }

        // Sanitizar datos
        $data = sanitizeData($data);

        // Convertir apellido a mayúsculas si se está actualizando
        if (isset($data['last_name'])) {
            $data['last_name'] = mb_strtoupper($data['last_name'], 'UTF-8');
        }

        // Verificar email único (si se está cambiando)
        if (isset($data['email']) && $data['email'] !== $existing['email']) {
            $emailCheck = executeQuery("SELECT id FROM technicians WHERE email = ? AND id != ?", [$data['email'], $id]);
            if ($emailCheck->fetch()) {
                sendErrorResponse('El email ya está registrado por otro técnico', 409);
            }
        }

        // Construir consulta de actualización
        $updateFields = [];
        $params = [];

        $allowedFields = ['first_name', 'last_name', 'email', 'phone', 'department', 'role', 'is_active'];
        foreach ($allowedFields as $field) {
            if (isset($data[$field])) {
                $updateFields[] = "{$field} = ?";
                $params[] = $data[$field];
            }
        }

        if (empty($updateFields)) {
            sendErrorResponse('No se proporcionaron campos para actualizar', 400);
        }

        $params[] = $id;
        $sql = "UPDATE technicians SET " . implode(', ', $updateFields) . " WHERE id = ?";

        executeQuery($sql, $params);

        sendJsonResponse(true, 'Técnico actualizado exitosamente');

    } catch (Exception $e) {
        error_log("Error actualizando técnico {$id}: " . $e->getMessage());
        sendErrorResponse('Error interno del servidor', 500);
    }
}


/**
 * Elimina un técnico (desactivación lógica)
 */
function deleteTechnician(int $id): void {
    try {
        // Verificar que el técnico existe
        $existing = executeQuery("SELECT * FROM technicians WHERE id = ?", [$id])->fetch(PDO::FETCH_ASSOC);
        if (!$existing) {
            sendErrorResponse('Técnico no encontrado', 404);
        }

        // Verificar que no tenga tareas activas
        $activeTasks = executeQuery("SELECT COUNT(*) as count FROM tasks WHERE technician_id = ? AND status IN ('pending', 'in_progress')", [$id])->fetch()['count'];
        if ($activeTasks > 0) {
            sendErrorResponse('No se puede eliminar el técnico porque tiene tareas activas', 409);
        }

        // Desactivar técnico (eliminación lógica)
        executeQuery("UPDATE technicians SET is_active = 0 WHERE id = ?", [$id]);

        sendJsonResponse(true, 'Técnico eliminado exitosamente');

    } catch (Exception $e) {
        error_log("Error eliminando técnico {$id}: " . $e->getMessage());
        sendErrorResponse('Error interno del servidor', 500);
    }
}