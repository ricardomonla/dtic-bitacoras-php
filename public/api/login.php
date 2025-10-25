<?php
/**
 * API de autenticación - DTIC Bitácoras
 * Maneja login, logout y verificación de sesiones
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

// Solo aceptar POST para login
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendErrorResponse('Método no permitido', 405);
}

// Obtener datos del login
$data = getJsonInput();
error_log("[LOGIN] Datos recibidos: " . json_encode($data));

// Validar datos requeridos
$validationRules = [
    'username' => ['required' => true, 'min_length' => 2, 'max_length' => 100],
    'password' => ['required' => true, 'min_length' => 4]
];

$validation = validateData($data, $validationRules);
if (!$validation['valid']) {
    error_log("[LOGIN] Validación fallida: " . implode(', ', $validation['errors']));
    sendErrorResponse('Datos inválidos: ' . implode(', ', $validation['errors']), 400);
}

// Sanitizar datos
$data = sanitizeData($data);

// Verificar rate limiting (máximo 5 intentos por 15 minutos por IP)
$clientIP = getClientIP();
if (!checkRateLimit('login', 5, 900)) { // 15 minutos = 900 segundos
    error_log("[LOGIN] Rate limit excedido para IP: {$clientIP}");
    sendErrorResponse('Demasiados intentos fallidos. Intente nuevamente en 15 minutos.', 429);
}

// Buscar usuario por email o DTIC ID
$user = null;
$username = $data['username'];
error_log("[LOGIN] Buscando usuario: {$username}");

// Intentar buscar por email primero
$user = executeQuery(
    "SELECT id, dtic_id, first_name, last_name, email, password_hash, role, department, is_active
     FROM technicians
     WHERE email = ? AND is_active = 1",
    [$username]
)->fetch(PDO::FETCH_ASSOC);

error_log("[LOGIN] Búsqueda por email en technicians: " . ($user ? "encontrado (ID: {$user['id']})" : "no encontrado"));

// Si no encontró por email, buscar por DTIC ID
if (!$user) {
    $user = executeQuery(
        "SELECT id, dtic_id, first_name, last_name, email, password_hash, role, department, is_active
         FROM technicians
         WHERE dtic_id = ? AND is_active = 1",
        [$username]
    )->fetch(PDO::FETCH_ASSOC);
    error_log("[LOGIN] Búsqueda por DTIC ID en technicians: " . ($user ? "encontrado (ID: {$user['id']})" : "no encontrado"));
}

// Si no encontró en technicians, buscar en users
if (!$user) {
    $user = executeQuery(
        "SELECT id, username as dtic_id, name as first_name, '' as last_name, email, password_hash, role, department, is_active
         FROM users
         WHERE (email = ? OR username = ?) AND is_active = 1",
        [$username, $username]
    )->fetch(PDO::FETCH_ASSOC);
    error_log("[LOGIN] Búsqueda en users: " . ($user ? "encontrado (ID: {$user['id']})" : "no encontrado"));
}

// Usuario no encontrado o inactivo
if (!$user) {
    error_log("[LOGIN] Usuario no encontrado o inactivo: {$username}");
    // Registrar intento fallido en auditoría
    logAuditAction('login_failed', 'user', 0, null, [
        'username' => $username,
        'reason' => 'user_not_found',
        'ip_address' => $clientIP
    ]);
    sendErrorResponse('Usuario o contraseña incorrectos', 401);
}

error_log("[LOGIN] Verificando contraseña para usuario ID: {$user['id']}");
// Verificar contraseña
if (!password_verify($data['password'], $user['password_hash'])) {
    error_log("[LOGIN] Contraseña incorrecta para usuario ID: {$user['id']}");
    // Registrar intento fallido en auditoría
    logAuditAction('login_failed', 'user', $user['id'], null, [
        'username' => $username,
        'reason' => 'wrong_password',
        'ip_address' => $clientIP
    ]);
    sendErrorResponse('Usuario o contraseña incorrectos', 401);
}

error_log("[LOGIN] Login exitoso para usuario ID: {$user['id']} ({$user['dtic_id']})");

// Login exitoso - rate limiting ya se maneja en BD

// Iniciar sesión segura
startSecureSession();

// Generar session ID único
$sessionId = bin2hex(random_bytes(32));
$userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';
$ipAddress = $clientIP;

// Guardar datos de sesión
$_SESSION['user_id'] = $user['id'];
$_SESSION['user_dtic_id'] = $user['dtic_id'];
$_SESSION['user_name'] = trim($user['first_name'] . ' ' . $user['last_name']);
$_SESSION['user_email'] = $user['email'];
$_SESSION['user_role'] = $user['role'];
$_SESSION['user_department'] = $user['department'];
$_SESSION['session_id'] = $sessionId;
$_SESSION['login_time'] = time();
$_SESSION['last_activity'] = time();

// Guardar sesión en base de datos
try {
    executeQuery(
        "INSERT INTO sessions (session_id, user_id, user_type, user_agent, ip_address, created_at, last_activity)
         VALUES (?, ?, 'technician', ?, ?, NOW(), NOW())
         ON DUPLICATE KEY UPDATE last_activity = NOW()",
        [$sessionId, $user['id'], $userAgent, $ipAddress]
    );
    error_log("[LOGIN] Sesión guardada en BD para user_id: {$user['id']}");
} catch (Exception $e) {
    error_log("[LOGIN] Error guardando sesión en BD: " . $e->getMessage());
    // Continuar sin guardar en BD (sesión PHP seguirá funcionando)
}

// Manejar "Recordar sesión"
if (isset($data['remember_me']) && $data['remember_me']) {
    // Generar token seguro para recordar sesión
    $rememberToken = bin2hex(random_bytes(32));
    $tokenHash = password_hash($rememberToken, PASSWORD_DEFAULT);

    // Guardar token en BD
    executeQuery(
        "UPDATE sessions SET remember_token = ?, remember_expires = DATE_ADD(NOW(), INTERVAL 30 DAY)
         WHERE session_id = ?",
        [$tokenHash, $sessionId]
    );

    // Establecer cookie segura (30 días)
    setcookie(
        'remember_token',
        $rememberToken,
        [
            'expires' => time() + (30 * 24 * 60 * 60), // 30 días
            'path' => '/',
            'secure' => isset($_SERVER['HTTPS']), // Solo HTTPS en producción
            'httponly' => true,
            'samesite' => 'Strict'
        ]
    );
}

// Registrar login en auditoría
logAuditAction('login', 'user', $user['id'], null, [
    'ip_address' => $ipAddress,
    'user_agent' => $userAgent,
    'remember_me' => $data['remember_me'] ?? false
]);

// Respuesta exitosa
sendJsonResponse(true, 'Login exitoso', [
    'user' => [
        'id' => $user['id'],
        'dtic_id' => $user['dtic_id'],
        'name' => $_SESSION['user_name'],
        'email' => $user['email'],
        'role' => $user['role'],
        'department' => $user['department']
    ],
    'redirect' => 'index.html',
    'session_expires' => time() + (24 * 60 * 60) // 24 horas
], 200);