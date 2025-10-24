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
        // Verificar si es una petición de imagen de perfil
        if (isset($_FILES['profile_image']) || strpos($_SERVER['CONTENT_TYPE'] ?? '', 'multipart/form-data') !== false) {
            if (!$id) {
                sendErrorResponse('ID de técnico requerido para actualización de imagen', 400);
            }
            updateTechnicianProfileImage($id);
        } else {
            createTechnician();
        }
        break;

    case 'PUT':
        requirePermission('admin');
        if (!$id) {
            sendErrorResponse('ID de técnico requerido para actualización', 400);
        }
        updateTechnician($id);
        break;

    case 'PATCH':
        // Temporal: Permitir acceso sin autenticación para desarrollo
        // requirePermission('admin');
        if (!$id) {
            sendErrorResponse('ID de técnico requerido para actualización', 400);
        }
        // Para debugging, verificar si es una petición de imagen
        if (isset($_FILES['profile_image']) || strpos($_SERVER['CONTENT_TYPE'] ?? '', 'multipart/form-data') !== false) {
            updateTechnicianProfileImage($id);
        } else {
            updateTechnician($id);
        }
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

        $sql .= " GROUP BY t.id ORDER BY t.last_name, t.first_name";

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
        $countSql = "SELECT COUNT(*) as total FROM technicians t WHERE 1=1";
        if (!empty($conditions)) {
            $countSql .= " AND " . implode(" AND ", array_slice($conditions, 0, -2)); // Remover LIMIT y OFFSET
        }

        $countStmt = executeQuery($countSql, array_slice($params, 0, -2));
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

        // Obtener tareas recientes del técnico
        $tasksSql = "SELECT
                        id, dtic_id, title, status, priority, created_at, due_date
                     FROM tasks
                     WHERE technician_id = ?
                     ORDER BY created_at DESC
                     LIMIT 5";

        $tasksStmt = executeQuery($tasksSql, [$id]);
        $technician['recent_tasks'] = $tasksStmt->fetchAll(PDO::FETCH_ASSOC);

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

        // Registrar en auditoría
        logAuditAction('create', 'technician', $technicianId, null, $data);

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

        // Registrar en auditoría
        logAuditAction('update', 'technician', $id, $existing, $data);

        sendJsonResponse(true, 'Técnico actualizado exitosamente');

    } catch (Exception $e) {
        error_log("Error actualizando técnico {$id}: " . $e->getMessage());
        sendErrorResponse('Error interno del servidor', 500);
    }
}

/**
 * Actualiza la imagen de perfil de un técnico
 */
function updateTechnicianProfileImage(int $id): void {
    try {
        // Verificar que el técnico existe
        $existing = executeQuery("SELECT * FROM technicians WHERE id = ?", [$id])->fetch(PDO::FETCH_ASSOC);
        if (!$existing) {
            sendErrorResponse('Técnico no encontrado', 404);
        }

        // Debug: Verificar qué se recibió
        error_log("METHOD: " . $_SERVER['REQUEST_METHOD']);
        error_log("CONTENT_TYPE: " . ($_SERVER['CONTENT_TYPE'] ?? 'not set'));
        error_log("FILES: " . print_r($_FILES, true));
        error_log("POST: " . print_r($_POST, true));
        error_log("REQUEST: " . print_r($_REQUEST, true));
        // error_log("RAW_INPUT: " . file_get_contents('php://input'));

        // Verificar que se recibió una imagen
        if (!isset($_FILES['profile_image'])) {
            sendErrorResponse('No se recibió el archivo de imagen. FILES: ' . print_r($_FILES, true), 400);
        }

        $file = $_FILES['profile_image'];

        // Verificar errores de upload
        if ($file['error'] !== UPLOAD_ERR_OK) {
            $errorMessages = [
                UPLOAD_ERR_INI_SIZE => 'La imagen excede el tamaño máximo permitido por el servidor',
                UPLOAD_ERR_FORM_SIZE => 'La imagen excede el tamaño máximo permitido por el formulario',
                UPLOAD_ERR_PARTIAL => 'La imagen se subió parcialmente',
                UPLOAD_ERR_NO_FILE => 'No se seleccionó ningún archivo',
                UPLOAD_ERR_NO_TMP_DIR => 'Falta el directorio temporal',
                UPLOAD_ERR_CANT_WRITE => 'Error al escribir el archivo en el disco',
                UPLOAD_ERR_EXTENSION => 'Una extensión de PHP detuvo la subida del archivo'
            ];
            $errorMessage = $errorMessages[$file['error']] ?? 'Error desconocido en la subida del archivo';
            sendErrorResponse($errorMessage, 400);
        }

        $file = $_FILES['profile_image'];

        // Validar tipo de archivo
        $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!in_array($file['type'], $allowedTypes)) {
            sendErrorResponse('Tipo de archivo no permitido. Solo se permiten imágenes JPEG, PNG, GIF y WebP', 400);
        }

        // Validar tamaño (máximo 5MB)
        $maxSize = 5 * 1024 * 1024; // 5MB
        if ($file['size'] > $maxSize) {
            sendErrorResponse('La imagen es demasiado grande. Máximo 5MB permitido', 400);
        }

        // Usar directorio de uploads existente
        $uploadDir = '/var/www/html/public/uploads/profile_images/';
        if (!is_dir($uploadDir)) {
            sendErrorResponse('Directorio de uploads no existe: ' . $uploadDir, 500);
        }

        // Generar nombre único para el archivo
        $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = 'profile_' . $id . '_' . time() . '.' . $extension;
        $filepath = $uploadDir . $filename;

        // Mover archivo
        if (!move_uploaded_file($file['tmp_name'], $filepath)) {
            sendErrorResponse('Error al guardar la imagen', 500);
        }

        // Eliminar imagen anterior si existe
        if (!empty($existing['profile_image'])) {
            $oldImagePath = '/var/www/html/public/' . $existing['profile_image'];
            if (file_exists($oldImagePath)) {
                unlink($oldImagePath);
            }
        }

        // Actualizar base de datos
        $relativePath = 'uploads/profile_images/' . $filename;
        executeQuery("UPDATE technicians SET profile_image = ? WHERE id = ?", [$relativePath, $id]);

        // Registrar en auditoría
        logAuditAction('update', 'technician', $id, $existing, ['profile_image' => $relativePath]);

        sendJsonResponse(true, 'Imagen de perfil actualizada exitosamente', [
            'profile_image' => $relativePath
        ]);

    } catch (Exception $e) {
        error_log("Error actualizando imagen de perfil del técnico {$id}: " . $e->getMessage());
        error_log("Stack trace: " . $e->getTraceAsString());
        sendErrorResponse('Error interno del servidor: ' . $e->getMessage(), 500);
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

        // Registrar en auditoría
        logAuditAction('delete', 'technician', $id, $existing, ['is_active' => 0]);

        sendJsonResponse(true, 'Técnico eliminado exitosamente');

    } catch (Exception $e) {
        error_log("Error eliminando técnico {$id}: " . $e->getMessage());
        sendErrorResponse('Error interno del servidor', 500);
    }
}