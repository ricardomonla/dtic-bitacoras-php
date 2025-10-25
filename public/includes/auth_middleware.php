<?php
/**
 * Middleware de autenticación - DTIC Bitácoras
 * Verifica autenticación y maneja sesiones
 */

// Incluir archivos necesarios
require_once 'functions.php';
require_once 'security.php';

// Iniciar sesión segura
startSecureSession();

/**
 * Verificar si el usuario está autenticado
 */
function isAuthenticated(): bool {
    error_log("[AUTH] Verificando autenticación - Session ID: " . ($_SESSION['session_id'] ?? 'no definido'));

    // Verificar sesión PHP
    if (!isset($_SESSION['user_id']) || !isset($_SESSION['session_id'])) {
        error_log("[AUTH] Sesión PHP incompleta - user_id o session_id faltante");
        return false;
    }

    $sessionId = $_SESSION['session_id'];
    $userId = $_SESSION['user_id'];

    // Verificar sesión en base de datos
    try {
        $session = executeQuery(
            "SELECT s.*, u.is_active
             FROM sessions s
             JOIN technicians u ON s.user_id = u.id
             WHERE s.session_id = ? AND u.is_active = 1
             AND s.last_activity > DATE_SUB(NOW(), INTERVAL 24 HOUR)",
            [$sessionId]
        )->fetch(PDO::FETCH_ASSOC);

        if ($session) {
            error_log("[AUTH] Sesión válida encontrada en BD para user_id: {$userId}");
            // Actualizar última actividad
            executeQuery("UPDATE sessions SET last_activity = NOW() WHERE session_id = ?", [$sessionId]);
            $_SESSION['last_activity'] = time();
            return true;
        } else {
            error_log("[AUTH] Sesión no encontrada en BD o expirada para session_id: {$sessionId}");
        }
    } catch (Exception $e) {
        error_log("[AUTH] Error verificando sesión en BD: " . $e->getMessage());
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
    error_log("[AUTH] Verificando remember token - Cookie presente: " . (isset($_COOKIE['remember_token']) ? 'sí' : 'no'));

    if (isAuthenticated() || !isset($_COOKIE['remember_token'])) {
        return;
    }

    $rememberToken = $_COOKIE['remember_token'];
    error_log("[AUTH] Remember token presente, verificando validez");

    try {
        // Buscar sesión válida con token de recordar
        $session = executeQuery(
            "SELECT s.*, u.dtic_id, u.first_name, u.last_name, u.email, u.role, u.department
             FROM sessions s
             JOIN technicians u ON s.user_id = u.id
             WHERE s.remember_token IS NOT NULL
             AND s.remember_expires > NOW()
             AND u.is_active = 1
             ORDER BY s.last_activity DESC
             LIMIT 1",
            []
        )->fetch(PDO::FETCH_ASSOC);

        if ($session) {
            error_log("[AUTH] Sesión remember encontrada en BD, verificando token");
            if (password_verify($rememberToken, $session['remember_token'])) {
                error_log("[AUTH] Remember token válido, restaurando sesión para user_id: {$session['user_id']}");
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
                executeQuery("UPDATE sessions SET last_activity = NOW() WHERE session_id = ?", [$session['session_id']]);
            } else {
                error_log("[AUTH] Remember token no coincide con hash almacenado");
            }
        } else {
            error_log("[AUTH] No se encontró sesión remember válida en BD");
        }
    } catch (Exception $e) {
        error_log("[AUTH] Error verificando remember token: " . $e->getMessage());
    }
}

/**
 * Limpiar sesiones expiradas (debe ejecutarse periódicamente)
 */
function cleanupExpiredSessions(): void {
    try {
        // Eliminar sesiones expiradas (más de 24 horas sin actividad)
        executeQuery("DELETE FROM sessions WHERE last_activity < DATE_SUB(NOW(), INTERVAL 24 HOUR)");

        // Limpiar tokens de recordar expirados
        executeQuery("UPDATE sessions SET remember_token = NULL, remember_expires = NULL WHERE remember_expires < NOW()");
    } catch (Exception $e) {
        error_log("Error limpiando sesiones expiradas: " . $e->getMessage());
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

/**
 * Generar JavaScript para logout
 */
function renderLogoutScript(): string {
    return "
        <script>
        async function logout() {
            try {
                const response = await fetch('/api/logout.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    credentials: 'same-origin'
                });

                const data = await response.json();

                if (data.success) {
                    // Limpiar cualquier dato local si existe
                    localStorage.clear();
                    sessionStorage.clear();

                    // Redirigir a login
                    window.location.href = data.redirect || '/login';
                } else {
                    alert('Error al cerrar sesión: ' + data.message);
                }
            } catch (error) {
                console.error('Logout error:', error);
                // Forzar redirección aunque falle la API
                window.location.href = '/login';
            }
        }

        // Verificar sesión periódicamente (cada 5 minutos)
        setInterval(async () => {
            try {
                const response = await fetch('/api/auth/check.php', {
                    method: 'GET',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    credentials: 'same-origin'
                });

                if (!response.ok) {
                    // Sesión expirada o inválida
                    window.location.href = '/login';
                }
            } catch (error) {
                console.error('Session check error:', error);
            }
        }, 5 * 60 * 1000); // 5 minutos
        </script>
    ";
}