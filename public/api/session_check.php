<?php
/**
 * API para verificar estado de sesión
 */

require_once '../config/database.php';
require_once '../includes/security.php';

// Iniciar sesión segura
startSecureSession();

// Verificar autenticación
if (isAuthenticated()) {
    sendJsonResponse(true, 'Sesión activa', [
        'user' => getCurrentUser()
    ]);
} else {
    sendJsonResponse(false, 'Sesión expirada', null, 401);
}
?>