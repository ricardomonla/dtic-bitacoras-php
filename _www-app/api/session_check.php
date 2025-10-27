<?php
/**
 * API para verificar estado de sesión
 */

require_once '../config/database.php';
require_once '../includes/security.php';
require_once '../includes/functions.php';
require_once '../includes/auth_middleware.php';

// Iniciar sesión segura
startSecureSession();
debugLog("Verificando estado de sesión", 'SESSION');

// Verificar autenticación
if (isAuthenticated()) {
    $user = getCurrentUser();
    debugLog("Sesión activa para user_id: " . ($user['id'] ?? 'desconocido'), 'SESSION');
    sendJsonResponse(true, 'Sesión activa', [
        'user' => $user
    ]);
} else {
    debugLog("Sesión expirada o inválida", 'SESSION');
    sendJsonResponse(false, 'Sesión expirada', null, 401);
}
?>