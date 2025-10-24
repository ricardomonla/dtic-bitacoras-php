<?php
/**
 * API para verificar estado de autenticación
 * DTIC Bitácoras
 */

// Incluir archivos necesarios
require_once '../../config/database.php';
require_once '../../includes/functions.php';
require_once '../../includes/security.php';

// Headers CORS y JSON
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Manejar preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Solo aceptar GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendErrorResponse('Método no permitido', 405);
}

// Iniciar sesión si no está iniciada
if (session_status() === PHP_SESSION_NONE) {
    startSecureSession();
}

// Verificar si hay sesión activa
$authenticated = false;
$user = null;

if (isset($_SESSION['user_id']) && isset($_SESSION['session_id'])) {
    $sessionId = $_SESSION['session_id'];
    $userId = $_SESSION['user_id'];

    // Verificar sesión en base de datos
    try {
        $session = executeQuery(
            "SELECT s.*, u.dtic_id, u.first_name, u.last_name, u.email, u.role, u.department
             FROM sessions s
             JOIN technicians u ON s.user_id = u.id
             WHERE s.session_id = ? AND u.is_active = 1
             AND s.last_activity > DATE_SUB(NOW(), INTERVAL 24 HOUR)",
            [$sessionId]
        )->fetch(PDO::FETCH_ASSOC);

        if ($session) {
            $authenticated = true;
            $user = [
                'id' => $session['user_id'],
                'dtic_id' => $session['dtic_id'],
                'name' => trim($session['first_name'] . ' ' . $session['last_name']),
                'email' => $session['email'],
                'role' => $session['role'],
                'department' => $session['department']
            ];

            // Actualizar última actividad
            executeQuery("UPDATE sessions SET last_activity = NOW() WHERE session_id = ?", [$sessionId]);
            $_SESSION['last_activity'] = time();
        }
    } catch (Exception $e) {
        error_log("Error verificando sesión: " . $e->getMessage());
    }
}

// Si no hay sesión activa, intentar recordar sesión desde cookie
if (!$authenticated && isset($_COOKIE['remember_token'])) {
    $rememberToken = $_COOKIE['remember_token'];

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

        if ($session && password_verify($rememberToken, $session['remember_token'])) {
            // Restaurar sesión
            startSecureSession();

            $_SESSION['user_id'] = $session['user_id'];
            $_SESSION['user_dtic_id'] = $session['dtic_id'];
            $_SESSION['user_name'] = trim($session['first_name'] . ' ' . $session['last_name']);
            $_SESSION['user_email'] = $session['email'];
            $_SESSION['user_role'] = $session['role'];
            $_SESSION['user_department'] = $session['department'];
            $_SESSION['session_id'] = $session['session_id'];
            $_SESSION['login_time'] = strtotime($session['created_at']);
            $_SESSION['last_activity'] = time();

            $authenticated = true;
            $user = [
                'id' => $session['user_id'],
                'dtic_id' => $session['dtic_id'],
                'name' => $_SESSION['user_name'],
                'email' => $session['email'],
                'role' => $session['role'],
                'department' => $session['department']
            ];

            // Actualizar última actividad
            executeQuery("UPDATE sessions SET last_activity = NOW() WHERE session_id = ?", [$session['session_id']]);
        }
    } catch (Exception $e) {
        error_log("Error verificando remember token: " . $e->getMessage());
    }
}

// Respuesta
if ($authenticated && $user) {
    sendJsonResponse(true, 'Usuario autenticado', [
        'authenticated' => true,
        'user' => $user,
        'session_expires' => time() + (24 * 60 * 60) // 24 horas
    ]);
} else {
    sendJsonResponse(false, 'Usuario no autenticado', [
        'authenticated' => false,
        'redirect' => 'login.html'
    ], 401);
}