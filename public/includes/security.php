<?php
/**
 * Funciones de seguridad para el sistema DTIC Bitácoras
 */

// Función startSecureSession() movida a functions.php para evitar duplicación

/**
 * Verifica si el usuario está autenticado
 *
 * @return bool True si está autenticado
 */
function isAuthenticated(): bool {
    // Verificar variables de sesión básicas
    if (!isset($_SESSION['user_id']) ||
        !isset($_SESSION['session_id']) ||
        !isset($_SESSION['login_time'])) {
        return false;
    }

    // Verificar que la sesión no haya expirado (24 horas)
    if (time() - $_SESSION['login_time'] > 86400) {
        error_log("[AUTH] Sesión expirada por tiempo: " . (time() - $_SESSION['login_time']) . " segundos");
        return false;
    }

    // Verificar sesión en base de datos
    try {
        $sql = "SELECT session_id FROM sessions
                WHERE session_id = ? AND last_activity > DATE_SUB(NOW(), INTERVAL 24 HOUR)";
        $stmt = executeQuery($sql, [$_SESSION['session_id']]);
        $session = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$session) {
            error_log("[AUTH] Sesión no encontrada en BD o expirada: {$_SESSION['session_id']}");
            return false;
        }

        // Actualizar last_activity
        $sql = "UPDATE sessions SET last_activity = NOW() WHERE session_id = ?";
        executeQuery($sql, [$_SESSION['session_id']]);

    } catch (Exception $e) {
        error_log("[AUTH] Error verificando sesión en BD: " . $e->getMessage());
        return false;
    }

    return true;
}

/**
 * Obtiene información del usuario autenticado
 *
 * @return array|null Información del usuario o null si no está autenticado
 */
function getCurrentUser(): ?array {
    if (!isAuthenticated()) {
        return null;
    }

    return [
        'id' => $_SESSION['user_id'],
        'dtic_id' => $_SESSION['user_dtic_id'] ?? null,
        'name' => $_SESSION['user_name'] ?? null,
        'email' => $_SESSION['user_email'] ?? null,
        'role' => $_SESSION['user_role'] ?? null,
        'department' => $_SESSION['user_department'] ?? null,
        'login_time' => $_SESSION['login_time']
    ];
}

/**
 * Verifica permisos del usuario
 *
 * @param string $requiredRole Rol requerido
 * @return bool True si tiene permisos
 */
function hasPermission(string $requiredRole): bool {
    $user = getCurrentUser();
    if (!$user) {
        return false;
    }

    $roleHierarchy = [
        'viewer' => 1,
        'operator' => 2,
        'analyst' => 3,
        'supervisor' => 4,
        'technician' => 5,
        'admin' => 10
    ];

    $userRole = $user['role'] ?? 'viewer';
    $requiredLevel = $roleHierarchy[$requiredRole] ?? 0;
    $userLevel = $roleHierarchy[$userRole] ?? 0;

    return $userLevel >= $requiredLevel;
}

/**
 * Requiere autenticación, redirige si no está autenticado
 */
function requireAuth(): void {
    if (!isAuthenticated()) {
        if (isAjaxRequest()) {
            sendErrorResponse('Sesión expirada. Por favor, inicie sesión nuevamente.', 401);
        } else {
            header('Location: login.html');
            exit;
        }
    }
}

/**
 * Requiere permisos específicos
 *
 * @param string $requiredRole Rol requerido
 */
function requirePermission(string $requiredRole): void {
    requireAuth();

    if (!hasPermission($requiredRole)) {
        if (isAjaxRequest()) {
            sendErrorResponse('No tiene permisos suficientes para realizar esta acción.', 403);
        } else {
            http_response_code(403);
            die('Acceso denegado: No tiene permisos suficientes.');
        }
    }
}

/**
 * Valida contraseña (requisitos mínimos)
 *
 * @param string $password Contraseña a validar
 * @return array Array con 'valid' (bool) y 'errors' (array)
 */
function validatePassword(string $password): array {
    $errors = [];

    if (strlen($password) < 8) {
        $errors[] = 'La contraseña debe tener al menos 8 caracteres';
    }

    if (!preg_match('/[A-Z]/', $password)) {
        $errors[] = 'La contraseña debe contener al menos una letra mayúscula';
    }

    if (!preg_match('/[a-z]/', $password)) {
        $errors[] = 'La contraseña debe contener al menos una letra minúscula';
    }

    if (!preg_match('/[0-9]/', $password)) {
        $errors[] = 'La contraseña debe contener al menos un número';
    }

    if (!preg_match('/[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?]/', $password)) {
        $errors[] = 'La contraseña debe contener al menos un carácter especial';
    }

    return [
        'valid' => empty($errors),
        'errors' => $errors
    ];
}

/**
 * Hashea contraseña usando bcrypt
 *
 * @param string $password Contraseña en texto plano
 * @return string Hash de la contraseña
 */
function hashPassword(string $password): string {
    return password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
}

/**
 * Verifica contraseña contra hash
 *
 * @param string $password Contraseña en texto plano
 * @param string $hash Hash almacenado
 * @return bool True si coincide
 */
function verifyPassword(string $password, string $hash): bool {
    return password_verify($password, $hash);
}

/**
 * Rate limiting básico por IP usando base de datos
 *
 * @param string $action Acción a limitar
 * @param int $maxAttempts Máximo número de intentos
 * @param int $timeWindow Ventana de tiempo en segundos
 * @return bool True si está dentro del límite
 */
function checkRateLimit(string $action, int $maxAttempts = 5, int $timeWindow = 300): bool {
    $ip = getClientIP();
    $key = "rate_limit:{$action}:{$ip}";

    try {
        // Verificar intentos recientes en BD
        $sql = "SELECT COUNT(*) as attempts FROM audit_log
                WHERE ip_address = ? AND action = ?
                AND created_at > DATE_SUB(NOW(), INTERVAL ? SECOND)";
        $stmt = executeQuery($sql, [$ip, $action, $timeWindow]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($result['attempts'] >= $maxAttempts) {
            error_log("[RATE_LIMIT] Límite excedido para IP {$ip}, acción {$action}: {$result['attempts']} intentos");
            return false;
        }

        return true;
    } catch (Exception $e) {
        error_log("[RATE_LIMIT] Error verificando rate limit: " . $e->getMessage());
        // En caso de error, permitir el intento (fail-open)
        return true;
    }
}

/**
 * Implementa cache básico usando archivos (para desarrollo)
 */
function getCache(string $key): ?string {
    $cacheFile = sys_get_temp_dir() . '/dtic_cache_' . md5($key) . '.cache';

    if (!file_exists($cacheFile)) {
        return null;
    }

    $data = unserialize(file_get_contents($cacheFile));

    // Verificar expiración
    if ($data['expires'] < time()) {
        unlink($cacheFile);
        return null;
    }

    return $data['value'];
}

/**
 * Establece valor en cache
 */
function setCache(string $key, string $value, int $ttl = 3600): void {
    $cacheFile = sys_get_temp_dir() . '/dtic_cache_' . md5($key) . '.cache';

    $data = [
        'value' => $value,
        'expires' => time() + $ttl
    ];

    file_put_contents($cacheFile, serialize($data));
}

/**
 * Elimina valor de cache
 */
function deleteCache(string $key): void {
    $cacheFile = sys_get_temp_dir() . '/dtic_cache_' . md5($key) . '.cache';

    if (file_exists($cacheFile)) {
        unlink($cacheFile);
    }
}

/**
 * Sanitiza datos de entrada recursivamente
 *
 * @param mixed $data Datos a sanitizar
 * @return mixed Datos sanitizados
 */
function sanitizeData($data) {
    if (is_array($data)) {
        return array_map('sanitizeData', $data);
    } elseif (is_string($data)) {
        return sanitizeInput($data);
    } else {
        return $data;
    }
}

/**
 * Valida datos de entrada según reglas
 *
 * @param array $data Datos a validar
 * @param array $rules Reglas de validación
 * @return array Array con 'valid' (bool) y 'errors' (array)
 */
function validateData(array $data, array $rules): array {
    $errors = [];

    foreach ($rules as $field => $fieldRules) {
        $value = $data[$field] ?? null;

        foreach ($fieldRules as $rule => $param) {
            switch ($rule) {
                case 'required':
                    if ($param && (is_null($value) || $value === '')) {
                        $errors[] = "El campo {$field} es obligatorio";
                    }
                    break;

                case 'email':
                    if ($param && $value && !validateEmail($value)) {
                        $errors[] = "El campo {$field} debe ser un email válido";
                    }
                    break;

                case 'phone':
                    if ($param && $value && !validatePhone($value)) {
                        $errors[] = "El campo {$field} debe ser un teléfono válido";
                    }
                    break;

                case 'min_length':
                    if ($value && strlen($value) < $param) {
                        $errors[] = "El campo {$field} debe tener al menos {$param} caracteres";
                    }
                    break;

                case 'max_length':
                    if ($value && strlen($value) > $param) {
                        $errors[] = "El campo {$field} debe tener máximo {$param} caracteres";
                    }
                    break;

                case 'in':
                    if ($value && !in_array($value, $param)) {
                        $errors[] = "El campo {$field} debe ser uno de: " . implode(', ', $param);
                    }
                    break;
            }
        }
    }

    return [
        'valid' => empty($errors),
        'errors' => $errors
    ];
}

/**
 * Escapa datos para consultas SQL (usar con precaución, preferir prepared statements)
 *
 * @param string $data Dato a escapar
 * @return string Dato escapado
 */
function escapeSQL(string $data): string {
    return getDBConnection()->quote($data);
}

// Función cleanupExpiredSessions() movida a functions.php para evitar duplicación

/**
 * Registra intento de login fallido
 *
 * @param string $identifier Identificador del usuario (email/DTIC ID)
 */
function logFailedLogin(string $identifier): void {
    $ip = getClientIP();
    error_log("Intento de login fallido - Usuario: {$identifier}, IP: {$ip}, Time: " . date('Y-m-d H:i:s'));
}

/**
 * Verifica si la IP está bloqueada por múltiples intentos fallidos
 *
 * @return bool True si está bloqueada
 */
function isIPBlocked(): bool {
    $ip = getClientIP();
    $key = "blocked_ip:{$ip}";

    // En un entorno real, usar Redis o similar
    $blockFile = sys_get_temp_dir() . "/dtic_blocked_" . md5($ip);

    if (file_exists($blockFile)) {
        $blockData = json_decode(file_get_contents($blockFile), true);
        if ($blockData && time() < $blockData['expires']) {
            return true;
        } else {
            // Bloqueo expirado, eliminar archivo
            unlink($blockFile);
        }
    }

    return false;
}

/**
 * Bloquea IP por intentos fallidos
 *
 * @param int $duration Duración del bloqueo en segundos (default: 15 minutos)
 */
function blockIP(int $duration = 900): void {
    $ip = getClientIP();
    $blockFile = sys_get_temp_dir() . "/dtic_blocked_" . md5($ip);

    $blockData = [
        'ip' => $ip,
        'blocked_at' => time(),
        'expires' => time() + $duration
    ];

    file_put_contents($blockFile, json_encode($blockData));
}