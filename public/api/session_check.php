<?php
/**
 * API para verificar estado de sesión
 */

require_once '../config/database.php';
require_once '../includes/security.php';

// Iniciar sesión segura
startSecureSession();
error_log("[SESSION_CHECK] Verificando estado de sesión");

// Verificar autenticación
if (isAuthenticated()) {
    $user = getCurrentUser();
    error_log("[SESSION_CHECK] Sesión activa para user_id: " . ($user['id'] ?? 'desconocido'));
    sendJsonResponse(true, 'Sesión activa', [
        'user' => $user
    ]);
} else {
    error_log("[SESSION_CHECK] Sesión expirada o inválida");
    sendJsonResponse(false, 'Sesión expirada', null, 401);
}
?>