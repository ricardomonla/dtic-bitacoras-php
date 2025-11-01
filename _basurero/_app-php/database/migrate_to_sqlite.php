<?php
/**
 * Script para migrar datos de MySQL a SQLite
 * Ejecutar desde el contenedor Docker o host con PHP
 */

// Configuración
$mysql_host = 'db';
$mysql_db = 'dtic_bitacoras_php';
$mysql_user = 'dtic_user';
$mysql_pass = 'dtic_password';

$sqlite_file = '/var/www/html/_www-app/database/dtic_bitacoras.db';

// Conectar a MySQL
try {
    $mysql = new PDO("mysql:host=$mysql_host;dbname=$mysql_db;charset=utf8mb4", $mysql_user, $mysql_pass);
    $mysql->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "✓ Conectado a MySQL\n";
} catch (PDOException $e) {
    die("✗ Error MySQL: " . $e->getMessage() . "\n");
}

// Crear/conectar a SQLite
try {
    $sqlite = new PDO("sqlite:$sqlite_file");
    $sqlite->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "✓ Conectado a SQLite\n";
} catch (PDOException $e) {
    die("✗ Error SQLite: " . $e->getMessage() . "\n");
}

// Crear tablas
$schema = file_get_contents('/tmp/schema.sql');
$sqlite->exec($schema);
echo "✓ Esquema creado en SQLite\n";

// Migrar técnicos
echo "Migrando técnicos...\n";
$stmt = $mysql->query("SELECT * FROM tecnicos");
$tecnicos = $stmt->fetchAll(PDO::FETCH_ASSOC);

foreach ($tecnicos as $t) {
    $sql = "INSERT INTO tecnicos (id, dtic_id, email, nombre, apellido, password_hash, role, activo, created_at, updated_at, first_name, last_name, department, is_active, phone)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $sqlite->prepare($sql)->execute([
        $t['id'], $t['dtic_id'], $t['email'], $t['nombre'], $t['apellido'],
        $t['password_hash'], $t['role'], $t['activo'], $t['created_at'],
        $t['updated_at'], $t['first_name'], $t['last_name'], $t['department'],
        $t['is_active'], $t['phone']
    ]);
}
echo "✓ Técnicos migrados: " . count($tecnicos) . "\n";

// Migrar sesiones
echo "Migrando sesiones...\n";
$stmt = $mysql->query("SELECT * FROM sesiones");
$sesiones = $stmt->fetchAll(PDO::FETCH_ASSOC);

foreach ($sesiones as $s) {
    $sql = "INSERT INTO sesiones (id, session_id, user_id, user_type, user_agent, ip_address, created_at, last_activity, remember_token, remember_expires)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $sqlite->prepare($sql)->execute([
        $s['id'], $s['session_id'], $s['user_id'], $s['user_type'], $s['user_agent'],
        $s['ip_address'], $s['created_at'], $s['last_activity'], $s['remember_token'],
        $s['remember_expires']
    ]);
}
echo "✓ Sesiones migradas: " . count($sesiones) . "\n";

// Migrar tareas
echo "Migrando tareas...\n";
$stmt = $mysql->query("SELECT * FROM tareas");
$tareas = $stmt->fetchAll(PDO::FETCH_ASSOC);

foreach ($tareas as $t) {
    $sql = "INSERT INTO tareas (id, dtic_id, technician_id, title, description, status, priority, created_at, updated_at, due_date, completed_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $sqlite->prepare($sql)->execute([
        $t['id'], $t['dtic_id'], $t['technician_id'], $t['title'], $t['description'],
        $t['status'], $t['priority'], $t['created_at'], $t['updated_at'], $t['due_date'],
        $t['completed_at']
    ]);
}
echo "✓ Tareas migradas: " . count($tareas) . "\n";

echo "\n🎉 Migración completada exitosamente!\n";
echo "📁 Archivo SQLite: $sqlite_file\n";
echo "💾 Tamaño: " . filesize($sqlite_file) . " bytes\n";