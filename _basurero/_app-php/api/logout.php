<?php
/**
 * API de logout - DTIC Bitácoras
 * Maneja el cierre de sesión seguro
 */

// Incluir archivos necesarios
require_once '../config/database.php';
require_once '../includes/functions.php';
require_once '../includes/security.php';

// Headers CORS y JSON
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Manejar preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Solo aceptar POST para logout
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendErrorResponse('Método no permitido', 405);
}

// Iniciar sesión si no está iniciada
if (session_status() === PHP_SESSION_NONE) {
    startSecureSession();
}

// Obtener datos de la sesión actual
$userId = $_SESSION['user_id'] ?? null;
$sessionId = $_SESSION['session_id'] ?? null;
debugLog("Iniciando logout - user_id: {$userId}, session_id: {$sessionId}", 'LOGOUT');

// Registrar logout en auditoría si hay usuario autenticado
if ($userId) {
    logAuditAction('logout', 'user', $userId, null, [
        'session_id' => $sessionId,
        'ip_address' => getClientIP(),
        'manual_logout' => true
    ]);
    debugLog("Auditoría registrada para user_id: {$userId}", 'LOGOUT');
}

// Eliminar sesión de base de datos
if ($sessionId) {
    try {
        executeQuery("DELETE FROM sesiones WHERE session_id = ?", [$sessionId]);
    } catch (Exception $e) {
        debugLog("Error eliminando sesión de BD: " . $e->getMessage(), 'ERROR');
        // Continuar con el logout aunque falle la BD
    }
}

// Limpiar cookies de recordar sesión
if (isset($_COOKIE['remember_token'])) {
    // Invalidar token en BD
    try {
        executeQuery("UPDATE sesiones SET remember_token = NULL, remember_expires = NULL WHERE remember_token IS NOT NULL");
    } catch (Exception $e) {
        debugLog("Error limpiando remember tokens: " . $e->getMessage(), 'ERROR');
    }

    // Eliminar cookie
    setcookie(
        'remember_token',
        '',
        [
            'expires' => time() - 3600,
            'path' => '/',
            'secure' => isset($_SERVER['HTTPS']),
            'httponly' => true,
            'samesite' => 'Strict'
        ]
    );
}

// Destruir sesión PHP
$_SESSION = [];
session_destroy();

// Limpiar cookies de sesión
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(
        session_name(),
        '',
        time() - 42000,
        $params["path"],
        $params["domain"],
        $params["secure"],
        $params["httponly"]
    );
}

// Respuesta exitosa
sendJsonResponse(true, 'Logout exitoso', [
    'redirect' => 'dashboard'
], 200);