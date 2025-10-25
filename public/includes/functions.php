<?php
/**
 * Funciones utilitarias para el sistema DTIC Bitácoras
 */

/**
 * Genera un ID único para el DTIC con prefijo
 *
 * @param string $prefix Prefijo (TEC, USR, RES, TSK)
 * @return string ID único generado
 */
function generateDTICId(string $prefix): string {
    // Obtener el último ID usado para este prefijo
    $lastId = getLastDTICId($prefix);

    // Extraer el número y aumentar en 1
    $nextNumber = $lastId ? intval(substr($lastId, 4)) + 1 : 1;

    // Formatear con 4 dígitos
    $formattedNumber = str_pad($nextNumber, 4, '0', STR_PAD_LEFT);

    return $prefix . '-' . $formattedNumber;
}

/**
 * Obtiene el último ID DTIC usado para un prefijo específico
 *
 * @param string $prefix Prefijo (TEC, USR, RES, TSK)
 * @return string|null Último ID o null si no existe
 */
function getLastDTICId(string $prefix): ?string {
    try {
        $sql = "SELECT dtic_id FROM technicians WHERE dtic_id LIKE ? ORDER BY dtic_id DESC LIMIT 1";
        $stmt = executeQuery($sql, [$prefix . '-%']);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        return $result ? $result['dtic_id'] : null;
    } catch (Exception $e) {
        error_log("Error obteniendo último ID DTIC para {$prefix}: " . $e->getMessage());
        return null;
    }
}

/**
 * Sanitiza entrada de texto
 *
 * @param string|null $input Texto a sanitizar
 * @return string Texto sanitizado
 */
function sanitizeInput(?string $input): string {
    if ($input === null) {
        return '';
    }
    return trim(htmlspecialchars(strip_tags($input), ENT_QUOTES, 'UTF-8'));
}

/**
 * Valida formato de email
 *
 * @param string $email Email a validar
 * @return bool True si es válido
 */
function validateEmail(string $email): bool {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

/**
 * Valida formato de teléfono (Argentina)
 *
 * @param string $phone Número de teléfono
 * @return bool True si es válido
 */
function validatePhone(string $phone): bool {
    // Formatos aceptados: +5493871234567, 03871234567, 3871234567
    $patterns = [
        '/^\+?549\d{10}$/',  // +5493871234567
        '/^0\d{10}$/',       // 03871234567
        '/^\d{8,10}$/'       // 3871234567
    ];

    foreach ($patterns as $pattern) {
        if (preg_match($pattern, $phone)) {
            return true;
        }
    }
    return false;
}

/**
 * Formatea fecha para display
 *
 * @param string $date Fecha en formato Y-m-d H:i:s
 * @param string $format Formato deseado (default: d/m/Y H:i)
 * @return string Fecha formateada
 */
function formatDate(string $date, string $format = 'd/m/Y H:i'): string {
    $timestamp = strtotime($date);
    return $timestamp ? date($format, $timestamp) : '';
}

/**
 * Calcula diferencia de tiempo en formato legible
 *
 * @param string $date Fecha a comparar
 * @return string Diferencia legible (ej: "hace 2 horas")
 */
function timeAgo(string $date): string {
    $timestamp = strtotime($date);
    if (!$timestamp) {
        return '';
    }

    $now = time();
    $diff = $now - $timestamp;

    if ($diff < 60) {
        return 'hace ' . $diff . ' segundos';
    } elseif ($diff < 3600) {
        $minutes = floor($diff / 60);
        return 'hace ' . $minutes . ' minuto' . ($minutes > 1 ? 's' : '');
    } elseif ($diff < 86400) {
        $hours = floor($diff / 3600);
        return 'hace ' . $hours . ' hora' . ($hours > 1 ? 's' : '');
    } elseif ($diff < 604800) {
        $days = floor($diff / 86400);
        return 'hace ' . $days . ' día' . ($days > 1 ? 's' : '');
    } else {
        return formatDate($date, 'd/m/Y');
    }
}

/**
 * Obtiene la IP real del cliente
 *
 * @return string IP del cliente
 */
function getClientIP(): string {
    $ipHeaders = [
        'HTTP_CF_CONNECTING_IP',
        'HTTP_CLIENT_IP',
        'HTTP_X_FORWARDED_FOR',
        'HTTP_X_FORWARDED',
        'HTTP_X_CLUSTER_CLIENT_IP',
        'HTTP_FORWARDED_FOR',
        'HTTP_FORWARDED',
        'REMOTE_ADDR'
    ];

    foreach ($ipHeaders as $header) {
        if (!empty($_SERVER[$header])) {
            $ip = $_SERVER[$header];
            // Si hay múltiples IPs (X-Forwarded-For), toma la primera
            if (strpos($ip, ',') !== false) {
                $ip = trim(explode(',', $ip)[0]);
            }
            // Valida que sea una IP válida
            if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
                return $ip;
            }
        }
    }

    return $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
}

/**
 * Registra acción en el log de auditoría
 *
 * @param string $action Acción realizada
 * @param string $entityType Tipo de entidad
 * @param int $entityId ID de la entidad
 * @param array|null $oldValues Valores anteriores
 * @param array|null $newValues Valores nuevos
 * @param int|null $userId ID del usuario
 * @param string $userType Tipo de usuario
 */
function logAuditAction(
    string $action,
    string $entityType,
    int $entityId,
    ?array $oldValues = null,
    ?array $newValues = null,
    ?int $userId = null,
    string $userType = 'system'
): void {
    try {
        $sql = "INSERT INTO audit_log
                (user_id, user_type, action, entity_type, entity_id, old_values, new_values, ip_address, user_agent)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

        $params = [
            $userId,
            $userType,
            $action,
            $entityType,
            $entityId,
            $oldValues ? json_encode($oldValues) : null,
            $newValues ? json_encode($newValues) : null,
            getClientIP(),
            $_SERVER['HTTP_USER_AGENT'] ?? null
        ];

        executeQuery($sql, $params);
    } catch (Exception $e) {
        error_log("Error registrando auditoría: " . $e->getMessage());
    }
}

/**
 * Envía respuesta JSON estandarizada
 *
 * @param bool $success Indica si la operación fue exitosa
 * @param string $message Mensaje de respuesta
 * @param array|null $data Datos adicionales
 * @param int $httpCode Código HTTP
 */
function sendJsonResponse(bool $success, string $message, ?array $data = null, int $httpCode = 200): void {
    http_response_code($httpCode);

    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');

    $response = [
        'success' => $success,
        'message' => $message,
        'timestamp' => date('c')
    ];

    if ($data !== null) {
        $response['data'] = $data;
    }

    echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

/**
 * Maneja errores y envía respuesta JSON de error
 *
 * @param string $message Mensaje de error
 * @param int $httpCode Código HTTP
 * @param array|null $details Detalles adicionales del error
 */
function sendErrorResponse(string $message, int $httpCode = 500, ?array $details = null): void {
    $response = ['error' => $message];
    if ($details) {
        $response['details'] = $details;
    }
    sendJsonResponse(false, $message, $response, $httpCode);
}

/**
 * Valida y obtiene parámetro de solicitud
 *
 * @param string $key Clave del parámetro
 * @param mixed $default Valor por defecto
 * @param string $method Método HTTP (GET, POST, PUT, DELETE)
 * @return mixed Valor del parámetro
 */
function getRequestParam(string $key, $default = null, string $method = 'REQUEST') {
    $method = strtoupper($method);

    switch ($method) {
        case 'GET':
            return $_GET[$key] ?? $default;
        case 'POST':
            return $_POST[$key] ?? $default;
        case 'PUT':
        case 'DELETE':
            // Para PUT/DELETE, obtener datos del body
            if ($method === 'PUT') {
                parse_str(file_get_contents('php://input'), $data);
            } else {
                $data = $_REQUEST;
            }
            return $data[$key] ?? $default;
        default:
            return $_REQUEST[$key] ?? $default;
    }
}

/**
 * Obtiene datos JSON del body de la solicitud
 *
 * @return array Datos JSON decodificados
 */
function getJsonInput(): array {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        sendErrorResponse('JSON inválido en la solicitud', 400);
    }

    return $data ?? [];
}

/**
 * Verifica si la solicitud es de tipo AJAX
 *
 * @return bool True si es AJAX
 */
function isAjaxRequest(): bool {
    return !empty($_SERVER['HTTP_X_REQUESTED_WITH']) &&
           strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';
}

/**
 * Genera token CSRF
 *
 * @return string Token CSRF
 */
function generateCSRFToken(): string {
    if (!isset($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

/**
 * Verifica token CSRF
 *
 * @param string $token Token a verificar
 * @return bool True si es válido
 */
function verifyCSRFToken(string $token): bool {
    return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
}

/**
 * Iniciar sesión segura con configuración avanzada
 */
function startSecureSession(): void {
    if (session_status() === PHP_SESSION_NONE) {
        // Configuración de sesión segura
        ini_set('session.cookie_httponly', 1);
        ini_set('session.cookie_secure', isset($_SERVER['HTTPS']));
        ini_set('session.cookie_samesite', 'Strict');
        ini_set('session.gc_maxlifetime', 86400); // 24 horas
        ini_set('session.use_only_cookies', 1);

        session_start();

        // Regenerar ID de sesión periódicamente
        if (!isset($_SESSION['last_regeneration']) ||
            $_SESSION['last_regeneration'] < time() - 300) { // 5 minutos
            session_regenerate_id(true);
            $_SESSION['last_regeneration'] = time();
        }
    }
}

/**
 * Alias para compatibilidad - función duplicada eliminada
 */

// Función cleanupExpiredSessions() movida a auth_middleware.php para evitar duplicación