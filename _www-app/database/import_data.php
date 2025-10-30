<?php
/**
 * Script para importar datos de MySQL a SQLite
 * DTIC Bitácoras - Migración de base de datos
 */

// Configuración de conexiones
$mysql_host = 'db';
$mysql_db = 'dtic_bitacoras_php';
$mysql_user = 'dtic_user';
$mysql_pass = 'dtic_password';

$sqlite_file = __DIR__ . '/dtic_bitacoras.db';

// Conectar a MySQL
try {
    $mysql = new PDO("mysql:host=$mysql_host;dbname=$mysql_db;charset=utf8mb4", $mysql_user, $mysql_pass);
    $mysql->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Conectado a MySQL\n";
} catch (PDOException $e) {
    die("Error MySQL: " . $e->getMessage() . "\n");
}

// Crear/conectar a SQLite
try {
    $sqlite = new PDO("sqlite:$sqlite_file");
    $sqlite->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Conectado a SQLite\n";
} catch (PDOException $e) {
    die("Error SQLite: " . $e->getMessage() . "\n");
}

// Crear tablas en SQLite
$schema = file_get_contents(__DIR__ . '/schema_sqlite.sql');
$sqlite->exec($schema);
echo "Esquema creado en SQLite\n";

// Importar datos de tecnicos
echo "Importando técnicos...\n";
$stmt = $mysql->query("SELECT * FROM tecnicos");
$tecnicos = $stmt->fetchAll(PDO::FETCH_ASSOC);

foreach ($tecnicos as $tecnico) {
    $sql = "INSERT OR REPLACE INTO tecnicos (id, dtic_id, email, nombre, apellido, password_hash, role, activo, created_at, updated_at, first_name, last_name, department, is_active, phone)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $sqlite->prepare($sql)->execute([
        $tecnico['id'], $tecnico['dtic_id'], $tecnico['email'], $tecnico['nombre'], $tecnico['apellido'],
        $tecnico['password_hash'], $tecnico['role'], $tecnico['activo'], $tecnico['created_at'],
        $tecnico['updated_at'], $tecnico['first_name'], $tecnico['last_name'], $tecnico['department'],
        $tecnico['is_active'], $tecnico['phone']
    ]);
}

// Importar datos de sesiones
echo "Importando sesiones...\n";
$stmt = $mysql->query("SELECT * FROM sesiones");
$sesiones = $stmt->fetchAll(PDO::FETCH_ASSOC);

foreach ($sesiones as $sesion) {
    $sql = "INSERT OR REPLACE INTO sesiones (id, session_id, user_id, user_type, user_agent, ip_address, created_at, last_activity, remember_token, remember_expires)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $sqlite->prepare($sql)->execute([
        $sesion['id'], $sesion['session_id'], $sesion['user_id'], $sesion['user_type'], $sesion['user_agent'],
        $sesion['ip_address'], $sesion['created_at'], $sesion['last_activity'], $sesion['remember_token'],
        $sesion['remember_expires']
    ]);
}

// Importar datos de tareas
echo "Importando tareas...\n";
$stmt = $mysql->query("SELECT * FROM tareas");
$tareas = $stmt->fetchAll(PDO::FETCH_ASSOC);

foreach ($tareas as $tarea) {
    $sql = "INSERT OR REPLACE INTO tareas (id, dtic_id, technician_id, title, description, status, priority, created_at, updated_at, due_date, completed_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $sqlite->prepare($sql)->execute([
        $tarea['id'], $tarea['dtic_id'], $tarea['technician_id'], $tarea['title'], $tarea['description'],
        $tarea['status'], $tarea['priority'], $tarea['created_at'], $tarea['updated_at'], $tarea['due_date'],
        $tarea['completed_at']
    ]);
}

echo "Migración completada exitosamente!\n";
echo "Archivo SQLite creado: $sqlite_file\n";