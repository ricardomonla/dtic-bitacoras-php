<?php
/**
 * Configuración de conexión a base de datos MySQL
 * DTIC Bitácoras - Sistema de gestión de recursos y tareas
 */

// Configuración de conexión
define('DB_TYPE', getenv('DB_TYPE') ?: 'sqlite'); // 'mysql' o 'sqlite'
define('DB_HOST', getenv('DB_HOST') ?: 'db');
define('DB_NAME', getenv('DB_NAME') ?: 'dtic_bitacoras_php');
define('DB_USER', getenv('DB_USER') ?: 'dtic_user');
define('DB_PASS', getenv('DB_PASSWORD') ?: 'dtic_password');
define('DB_CHARSET', 'utf8mb4');
define('DB_SQLITE_PATH', getenv('DB_SQLITE_PATH') ?: __DIR__ . '/../database/dtic_bitacoras.db');

// Modo Debug - Controla logging y otras restricciones para desarrollo/producción
define('DEBUG_MODE', getenv('DEBUG_MODE') ?: false);

// Función helper para logging condicional
function debugLog(string $message, string $level = 'INFO'): void {
    if (DEBUG_MODE) {
        $timestamp = date('Y-m-d H:i:s');
        $logMessage = "[{$timestamp}] [{$level}] {$message}";
        error_log($logMessage);
    }
}

// Opciones PDO
define('DB_OPTIONS', [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
]);

/**
 * Obtiene una instancia de conexión PDO a la base de datos
 *
 * @return PDO
 * @throws PDOException
 */
function getDBConnection(): PDO {
    static $pdo = null;

    if ($pdo === null) {
        try {
            if (DB_TYPE === 'sqlite') {
                $dsn = "sqlite:" . DB_SQLITE_PATH;
                $pdo = new PDO($dsn, null, null, DB_OPTIONS);
            } else {
                $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
                $pdo = new PDO($dsn, DB_USER, DB_PASS, DB_OPTIONS);

                // Configurar zona horaria
                $pdo->exec("SET time_zone = '-03:00'"); // Argentina Time Zone
            }
        } catch (PDOException $e) {
            debugLog("Error de conexión a BD: " . $e->getMessage(), 'ERROR');
            throw new PDOException("Error al conectar con la base de datos");
        }
    }

    return $pdo;
}

/**
 * Ejecuta una consulta preparada de forma segura
 *
 * @param string $sql Consulta SQL con placeholders
 * @param array $params Parámetros para bind
 * @return PDOStatement
 * @throws PDOException
 */
function executeQuery(string $sql, array $params = []): PDOStatement {
    try {
        $pdo = getDBConnection();
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt;
    } catch (PDOException $e) {
        debugLog("Error en consulta SQL: " . $e->getMessage() . " | SQL: " . $sql, 'ERROR');
        throw $e;
    }
}

/**
 * Inicia una transacción
 */
function beginTransaction(): void {
    getDBConnection()->beginTransaction();
}

/**
 * Confirma una transacción
 */
function commitTransaction(): void {
    getDBConnection()->commit();
}

/**
 * Revierte una transacción
 */
function rollbackTransaction(): void {
    getDBConnection()->rollBack();
}

/**
 * Verifica si hay una transacción activa
 */
function inTransaction(): bool {
    return getDBConnection()->inTransaction();
}