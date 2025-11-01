<?php
/**
 * Funciones para recordar sesión de usuario
 */

require_once 'database.php';
require_once 'security.php';
require_once 'functions.php';

/**
 * Verificar y restaurar sesión desde cookie de recordar
 */
function checkRememberMe(): void {
    if (!isset($_COOKIE['DTIC_REMEMBER']) || isAuthenticated()) {
        return;
    }

    $rememberToken = $_COOKIE['DTIC_REMEMBER'];

    try {
        // Buscar sesión válida con el token
        $sql = "SELECT s.*, u.dtic_id, u.first_name, u.last_name, u.email, u.role, u.department
                FROM sesiones s
                LEFT JOIN tecnicos u ON s.user_id = u.id AND s.user_type = 'technician'
                WHERE s.remember_token = ? AND s.remember_expires > NOW()
                UNION
                SELECT s.*, u.dtic_id, u.first_name, u.last_name, u.email, u.role, u.department
                FROM sesiones s
                LEFT JOIN usuarios u ON s.user_id = u.id AND s.user_type = 'user'
                WHERE s.remember_token = ? AND s.remember_expires > NOW()
                LIMIT 1";

        $stmt = executeQuery($sql, [$rememberToken, $rememberToken]);
        $session = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($session) {
            // Iniciar sesión con los datos recuperados
            startSecureSession();

            $_SESSION['user_id'] = $session['user_id'];
            $_SESSION['user_type'] = $session['user_type'];
            $_SESSION['dtic_id'] = $session['dtic_id'];
            $_SESSION['user_name'] = $session['first_name'] . ' ' . $session['last_name'];
            $_SESSION['user_email'] = $session['email'];
            $_SESSION['user_role'] = $session['role'];
            $_SESSION['user_department'] = $session['department'];
            $_SESSION['login_time'] = time();
            $_SESSION['session_id'] = $session['id'];

            // Actualizar last_activity
            $sql = "UPDATE sesiones SET last_activity = NOW() WHERE session_id = ?";
            executeQuery($sql, [$session['session_id']]);

            // Regenerar ID de sesión por seguridad
            session_regenerate_id(true);
        } else {
            // Token inválido, eliminar cookie
            setcookie('DTIC_REMEMBER', '', time() - 3600, '/');
        }
    } catch (Exception $e) {
        error_log("Error verificando remember token: " . $e->getMessage());
    }
}

/**
 * Limpiar tokens de recordar expirados
 */
function cleanupExpiredRememberTokens(): void {
    try {
        $sql = "UPDATE sesiones SET remember_token = NULL, remember_expires = NULL WHERE remember_expires < NOW()";
        executeQuery($sql);
    } catch (Exception $e) {
        error_log("Error limpiando tokens expirados: " . $e->getMessage());
    }
}
?>