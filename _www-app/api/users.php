<?php
/**
 * API para gestión de usuarios operativos del DTIC
 * DTIC Bitácoras - Sistema de gestión de recursos y tareas
 */

// Incluir archivos necesarios
require_once 'config/database.php';
require_once 'includes/functions.php';
require_once 'includes/security.php';

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
            getUser($id);
        } else {
            getUsers();
        }
        break;

    case 'POST':
        requirePermission('admin');
        createUser();
        break;

    case 'PUT':
        requirePermission('admin');
        if (!$id) {
            sendErrorResponse('ID de usuario requerido para actualización', 400);
        }
        updateUser($id);
        break;

    case 'DELETE':
        requirePermission('admin');
        if (!$id) {
            sendErrorResponse('ID de usuario requerido para eliminación', 400);
        }
        deleteUser($id);
        break;

    default:
        sendErrorResponse('Método HTTP no soportado', 405);
}

/**
 * Obtiene lista de usuarios con filtros opcionales
 */
function getUsers(): void {
    try {
        $sql = "SELECT
                    u.id,
                    u.dtic_id,
                    u.first_name,
                    u.last_name,
                    CONCAT(u.first_name, ' ', u.last_name) as full_name,
                    u.email,
                    u.phone,
                    u.department,
                    u.role,
                    u.is_active,
                    u.created_at,
                    u.updated_at,
                    COUNT(ur.id) as assigned_resources
                FROM users u
                LEFT JOIN resources r ON r.assigned_to = u.id AND r.status = 'assigned'
                LEFT JOIN task_resources ur ON ur.resource_id = r.id
                WHERE 1=1";

        $params = [];
        $conditions = [];

        // Filtros opcionales
        if ($search = getRequestParam('search')) {
            $conditions[] = "(u.first_name LIKE ? OR u.last_name LIKE ? OR u.email LIKE ? OR u.dtic_id LIKE ?)";
            $searchParam = "%{$search}%";
            $params = array_merge($params, [$searchParam, $searchParam, $searchParam, $searchParam]);
        }

        if ($department = getRequestParam('department')) {
            $conditions[] = "u.department = ?";
            $params[] = $department;
        }

        if ($role = getRequestParam('role')) {
            $conditions[] = "u.role = ?";
            $params[] = $role;
        }

        if ($status = getRequestParam('status')) {
            $conditions[] = "u.is_active = ?";
            $params[] = $status === 'active' ? 1 : 0;
        }

        if (!empty($conditions)) {
            $sql .= " AND " . implode(" AND ", $conditions);
        }

        $sql .= " GROUP BY u.id ORDER BY u.last_name, u.first_name";

        // Paginación
        $page = max(1, (int)getRequestParam('page', 1));
        $limit = min(100, max(1, (int)getRequestParam('limit', 20)));
        $offset = ($page - 1) * $limit;

        $sql .= " LIMIT ? OFFSET ?";
        $params[] = $limit;
        $params[] = $offset;

        $stmt = executeQuery($sql, $params);
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Obtener total para paginación
        $countSql = "SELECT COUNT(*) as total FROM users u WHERE 1=1";
        if (!empty($conditions)) {
            $countSql .= " AND " . implode(" AND ", array_slice($conditions, 0, -2)); // Remover LIMIT y OFFSET
        }

        $countStmt = executeQuery($countSql, array_slice($params, 0, -2));
        $total = $countStmt->fetch(PDO::FETCH_ASSOC)['total'];

        $response = [
            'users' => $users,
            'pagination' => [
                'page' => $page,
                'limit' => $limit,
                'total' => (int)$total,
                'pages' => ceil($total / $limit)
            ]
        ];

        sendJsonResponse(true, 'Usuarios obtenidos exitosamente', $response);

    } catch (Exception $e) {
        error_log("Error obteniendo usuarios: " . $e->getMessage());
        sendErrorResponse('Error interno del servidor', 500);
    }
}

/**
 * Obtiene un usuario específico por ID
 */
function getUser(int $id): void {
    try {
        $sql = "SELECT
                    u.*,
                    COUNT(DISTINCT r.id) as total_resources,
                    COUNT(DISTINCT CASE WHEN r.status = 'assigned' THEN r.id END) as active_resources
                FROM users u
                LEFT JOIN resources r ON r.assigned_to = u.id
                WHERE u.id = ?
                GROUP BY u.id";

        $stmt = executeQuery($sql, [$id]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            sendErrorResponse('Usuario no encontrado', 404);
        }

        // Obtener recursos asignados al usuario
        $resourcesSql = "SELECT
                            r.id, r.dtic_id, r.name, r.status, r.location, r.technical_specs,
                            COUNT(tr.id) as active_tasks
                         FROM resources r
                         LEFT JOIN task_resources tr ON tr.resource_id = r.id
                         LEFT JOIN tasks t ON t.id = tr.task_id AND t.status IN ('pending', 'in_progress')
                         WHERE r.assigned_to = ?
                         GROUP BY r.id
                         ORDER BY r.name";

        $resourcesStmt = executeQuery($resourcesSql, [$id]);
        $user['assigned_resources'] = $resourcesStmt->fetchAll(PDO::FETCH_ASSOC);

        sendJsonResponse(true, 'Usuario obtenido exitosamente', ['user' => $user]);

    } catch (Exception $e) {
        error_log("Error obteniendo usuario {$id}: " . $e->getMessage());
        sendErrorResponse('Error interno del servidor', 500);
    }
}

/**
 * Crea un nuevo usuario operativo
 */
function createUser(): void {
    try {
        $data = getJsonInput();

        // Validar datos requeridos
        $validationRules = [
            'first_name' => ['required' => true, 'min_length' => 2, 'max_length' => 50],
            'last_name' => ['required' => true, 'min_length' => 2, 'max_length' => 50],
            'email' => ['required' => true, 'email' => true],
            'department' => ['required' => true, 'min_length' => 2, 'max_length' => 100],
            'role' => ['required' => true, 'in' => ['operator', 'supervisor', 'analyst', 'guest']]
        ];

        $validation = validateData($data, $validationRules);
        if (!$validation['valid']) {
            sendErrorResponse('Datos inválidos: ' . implode(', ', $validation['errors']), 400);
        }

        // Sanitizar datos
        $data = sanitizeData($data);

        // Generar DTIC ID único
        $dticId = generateDTICId('USR');

        // Verificar email único
        $emailCheck = executeQuery("SELECT id FROM users WHERE email = ?", [$data['email']]);
        if ($emailCheck->fetch()) {
            sendErrorResponse('El email ya está registrado', 409);
        }

        // Insertar usuario
        $sql = "INSERT INTO users
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
        $userId = getDBConnection()->lastInsertId();

        // Registrar en auditoría
        logAuditAction('create', 'user', $userId, null, $data);

        sendJsonResponse(true, 'Usuario creado exitosamente', [
            'user_id' => $userId,
            'dtic_id' => $dticId
        ], 201);

    } catch (Exception $e) {
        error_log("Error creando usuario: " . $e->getMessage());
        sendErrorResponse('Error interno del servidor', 500);
    }
}

/**
 * Actualiza un usuario operativo existente
 */
function updateUser(int $id): void {
    try {
        // Verificar que el usuario existe
        $existing = executeQuery("SELECT * FROM users WHERE id = ?", [$id])->fetch(PDO::FETCH_ASSOC);
        if (!$existing) {
            sendErrorResponse('Usuario no encontrado', 404);
        }

        $data = getJsonInput();

        // Validar datos
        $validationRules = [
            'first_name' => ['min_length' => 2, 'max_length' => 50],
            'last_name' => ['min_length' => 2, 'max_length' => 50],
            'email' => ['email' => true],
            'department' => ['min_length' => 2, 'max_length' => 100],
            'role' => ['in' => ['operator', 'supervisor', 'analyst', 'guest']]
        ];

        $validation = validateData($data, $validationRules);
        if (!$validation['valid']) {
            sendErrorResponse('Datos inválidos: ' . implode(', ', $validation['errors']), 400);
        }

        // Sanitizar datos
        $data = sanitizeData($data);

        // Verificar email único (si se está cambiando)
        if (isset($data['email']) && $data['email'] !== $existing['email']) {
            $emailCheck = executeQuery("SELECT id FROM users WHERE email = ? AND id != ?", [$data['email'], $id]);
            if ($emailCheck->fetch()) {
                sendErrorResponse('El email ya está registrado por otro usuario', 409);
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
        $sql = "UPDATE users SET " . implode(', ', $updateFields) . " WHERE id = ?";

        executeQuery($sql, $params);

        // Registrar en auditoría
        logAuditAction('update', 'user', $id, $existing, $data);

        sendJsonResponse(true, 'Usuario actualizado exitosamente');

    } catch (Exception $e) {
        error_log("Error actualizando usuario {$id}: " . $e->getMessage());
        sendErrorResponse('Error interno del servidor', 500);
    }
}

/**
 * Elimina un usuario operativo (desactivación lógica)
 */
function deleteUser(int $id): void {
    try {
        // Verificar que el usuario existe
        $existing = executeQuery("SELECT * FROM users WHERE id = ?", [$id])->fetch(PDO::FETCH_ASSOC);
        if (!$existing) {
            sendErrorResponse('Usuario no encontrado', 404);
        }

        // Verificar que no tenga recursos asignados activos
        $activeResources = executeQuery("SELECT COUNT(*) as count FROM resources WHERE assigned_to = ? AND status = 'assigned'", [$id])->fetch()['count'];
        if ($activeResources > 0) {
            sendErrorResponse('No se puede eliminar el usuario porque tiene recursos asignados activos', 409);
        }

        // Desactivar usuario (eliminación lógica)
        executeQuery("UPDATE users SET is_active = 0 WHERE id = ?", [$id]);

        // Registrar en auditoría
        logAuditAction('delete', 'user', $id, $existing, ['is_active' => 0]);

        sendJsonResponse(true, 'Usuario eliminado exitosamente');

    } catch (Exception $e) {
        error_log("Error eliminando usuario {$id}: " . $e->getMessage());
        sendErrorResponse('Error interno del servidor', 500);
    }
}