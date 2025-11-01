<?php
/**
 * Middleware de autenticación - DTIC Bitácoras
 * Verifica autenticación y maneja sesiones
 */

// Incluir archivos necesarios
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/functions.php';
require_once __DIR__ . '/security.php';

// Iniciar sesión segura
startSecureSession();

/**
 * Verificar si el usuario está autenticado
 */
function isAuthenticated(): bool {
    debugLog("Verificando autenticación - Session ID: " . ($_SESSION['session_id'] ?? 'no definido'), 'AUTH');

    // Verificar sesión PHP
    if (!isset($_SESSION['user_id']) || !isset($_SESSION['session_id'])) {
        debugLog("Sesión PHP incompleta - user_id o session_id faltante", 'AUTH');
        return false;
    }

    $sessionId = $_SESSION['session_id'];
    $userId = $_SESSION['user_id'];

    // Verificar sesión en base de datos
    try {
        $session = executeQuery(
            "SELECT s.*, u.is_active
             FROM sesiones s
             JOIN tecnicos u ON s.user_id = u.id
             WHERE s.session_id = ? AND u.is_active = 1
             AND s.last_activity > DATE_SUB(NOW(), INTERVAL 24 HOUR)",
            [$sessionId]
        )->fetch(PDO::FETCH_ASSOC);

        if ($session) {
            debugLog("Sesión válida encontrada en BD para user_id: {$userId}", 'AUTH');
            // Actualizar última actividad
            executeQuery("UPDATE sesiones SET last_activity = NOW() WHERE session_id = ?", [$sessionId]);
            $_SESSION['last_activity'] = time();
            return true;
        } else {
            debugLog("Sesión no encontrada en BD o expirada para session_id: {$sessionId}", 'AUTH');
        }
    } catch (Exception $e) {
        debugLog("Error verificando sesión en BD: " . $e->getMessage(), 'ERROR');
    }

    return false;
}

/**
 * Verificar si el usuario tiene un rol específico
 */
function hasRole(string $role): bool {
    return isset($_SESSION['user_role']) && $_SESSION['user_role'] === $role;
}

/**
 * Verificar si el usuario tiene uno de los roles especificados
 */
function hasAnyRole(array $roles): bool {
    return isset($_SESSION['user_role']) && in_array($_SESSION['user_role'], $roles);
}

/**
 * Requerir autenticación - redirigir si no está autenticado
 */
function requireAuth(): void {
    if (!isAuthenticated()) {
        // Limpiar sesión
        $_SESSION = [];
        session_destroy();

        // Redirigir a login
        header('Location: /login');
        exit;
    }
}

/**
 * Requerir rol específico
 */
function requireRole(string $role): void {
    requireAuth();

    if (!hasRole($role)) {
        sendErrorResponse('Acceso denegado - Rol requerido: ' . $role, 403);
    }
}

/**
 * Requerir uno de los roles especificados
 */
function requireAnyRole(array $roles): void {
    requireAuth();

    if (!hasAnyRole($roles)) {
        $rolesStr = implode(', ', $roles);
        sendErrorResponse('Acceso denegado - Roles requeridos: ' . $rolesStr, 403);
    }
}

/**
 * Obtener información del usuario actual
 */
function getCurrentUser(): ?array {
    if (!isAuthenticated()) {
        return null;
    }

    return [
        'id' => $_SESSION['user_id'],
        'dtic_id' => $_SESSION['user_dtic_id'],
        'name' => $_SESSION['user_name'],
        'email' => $_SESSION['user_email'],
        'role' => $_SESSION['user_role'],
        'department' => $_SESSION['user_department']
    ];
}

/**
 * Verificar y restaurar sesión desde cookie de recordar
 */
function checkRememberMe(): void {
    debugLog("Verificando remember token - Cookie presente: " . (isset($_COOKIE['remember_token']) ? 'sí' : 'no'), 'AUTH');

    if (isAuthenticated() || !isset($_COOKIE['remember_token'])) {
        return;
    }

    $rememberToken = $_COOKIE['remember_token'];
    debugLog("Remember token presente, verificando validez", 'AUTH');

    try {
        // Buscar sesión válida con token de recordar
        $session = executeQuery(
            "SELECT s.*, u.dtic_id, u.first_name, u.last_name, u.email, u.role, u.department
             FROM sesiones s
             JOIN tecnicos u ON s.user_id = u.id
             WHERE s.remember_token IS NOT NULL
             AND s.remember_expires > NOW()
             AND u.is_active = 1
             ORDER BY s.last_activity DESC
             LIMIT 1",
            []
        )->fetch(PDO::FETCH_ASSOC);

        if ($session) {
            debugLog("Sesión remember encontrada en BD, verificando token", 'AUTH');
            if (password_verify($rememberToken, $session['remember_token'])) {
                debugLog("Remember token válido, restaurando sesión para user_id: {$session['user_id']}", 'AUTH');
                // Restaurar sesión
                $_SESSION['user_id'] = $session['user_id'];
                $_SESSION['user_dtic_id'] = $session['dtic_id'];
                $_SESSION['user_name'] = trim($session['first_name'] . ' ' . $session['last_name']);
                $_SESSION['user_email'] = $session['email'];
                $_SESSION['user_role'] = $session['role'];
                $_SESSION['user_department'] = $session['department'];
                $_SESSION['session_id'] = $session['session_id'];
                $_SESSION['login_time'] = strtotime($session['created_at']);
                $_SESSION['last_activity'] = time();

                // Actualizar última actividad
                executeQuery("UPDATE sesiones SET last_activity = NOW() WHERE session_id = ?", [$session['session_id']]);
            } else {
                debugLog("Remember token no coincide con hash almacenado", 'AUTH');
            }
        } else {
            debugLog("No se encontró sesión remember válida en BD", 'AUTH');
        }
    } catch (Exception $e) {
        debugLog("Error verificando remember token: " . $e->getMessage(), 'ERROR');
    }
}

/**
 * Limpiar sesiones expiradas (debe ejecutarse periódicamente)
 */
function cleanupExpiredSessions(): void {
    try {
        // Eliminar sesiones expiradas (más de 24 horas sin actividad)
        executeQuery("DELETE FROM sesiones WHERE last_activity < DATE_SUB(NOW(), INTERVAL 24 HOUR)");

        // Limpiar tokens de recordar expirados
        executeQuery("UPDATE sesiones SET remember_token = NULL, remember_expires = NULL WHERE remember_expires < NOW()");

        debugLog("Sesiones expiradas limpiadas exitosamente", 'MAINTENANCE');
    } catch (Exception $e) {
        debugLog("Error limpiando sesiones expiradas: " . $e->getMessage(), 'ERROR');
    }
}

/**
 * Generar HTML para el navbar con información del usuario
 */
function renderUserInfo(): string {
    $user = getCurrentUser();

    if (!$user) {
        return '';
    }

    $userName = htmlspecialchars($user['name']);
    $userRole = htmlspecialchars(ucfirst($user['role']));
    $userDepartment = htmlspecialchars(ucfirst($user['department']));

    return "
        <ul class='navbar-nav ms-auto'>
            <li class='nav-item dropdown'>
                <a class='nav-link dropdown-toggle' href='#' id='userDropdown' role='button' data-bs-toggle='dropdown' aria-expanded='false'>
                    <i class='fas fa-user-circle me-2'></i>{$userName}
                </a>
                <ul class='dropdown-menu dropdown-menu-end' aria-labelledby='userDropdown'>
                    <li><h6 class='dropdown-header'>{$userName}</h6></li>
                    <li><span class='dropdown-item-text small text-muted'>{$userRole} • {$userDepartment}</span></li>
                    <li><hr class='dropdown-divider'></li>
                    <li><a class='dropdown-item' href='#' onclick='logout()'>
                        <i class='fas fa-sign-out-alt me-2'></i>Cerrar Sesión
                    </a></li>
                </ul>
            </li>
        </ul>
    ";
}

// Función renderLogoutScript() movida a navigation.php para evitar duplicación