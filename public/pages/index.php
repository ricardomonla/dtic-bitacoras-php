<?php
// Página básica de prueba para verificar que PHP funciona
echo "<!DOCTYPE html>";
echo "<html lang='es'>";
echo "<head>";
echo "    <meta charset='UTF-8'>";
echo "    <meta name='viewport' content='width=device-width, initial-scale=1.0'>";
echo "    <title>DTIC Bitácoras - Prueba</title>";
echo "    <style>";
echo "        body { font-family: Arial, sans-serif; margin: 40px; background-color: #f5f5f5; }";
echo "        .container { max-width: 800px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }";
echo "        h1 { color: #007bff; }";
echo "        .status { padding: 10px; margin: 10px 0; border-radius: 4px; }";
echo "        .success { background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb; }";
echo "        .info { background-color: #d1ecf1; color: #0c5460; border: 1px solid #bee5eb; }";
echo "    </style>";
echo "</head>";
echo "<body>";
echo "    <div class='container'>";
echo "        <h1>🚀 DTIC Bitácoras - Entorno Docker Funcionando</h1>";
echo "        <div class='status success'>";
echo "            <strong>✅ PHP:</strong> " . phpversion() . " - Funcionando correctamente";
echo "        </div>";
echo "        <div class='status info'>";
echo "            <strong>📅 Fecha/Hora del servidor:</strong> " . date('Y-m-d H:i:s') . " (UTC-3)";
echo "        </div>";
echo "        <div class='status info'>";
echo "            <strong>🗂️ Directorio actual:</strong> " . __DIR__;
echo "        </div>";

// Verificar extensiones PHP
$extensions = ['pdo', 'pdo_mysql', 'mysqli'];
echo "        <h2>Extensiones PHP</h2>";
foreach ($extensions as $ext) {
    $status = extension_loaded($ext) ? '✅' : '❌';
    $color = extension_loaded($ext) ? 'success' : 'error';
    echo "        <div class='status $color'>";
    echo "            <strong>$status $ext:</strong> " . (extension_loaded($ext) ? 'Cargada' : 'No disponible');
    echo "        </div>";
}

// Verificar conexión a MySQL
echo "        <h2>Conexión a Base de Datos</h2>";
try {
    $pdo = new PDO('mysql:host=db;dbname=dtic_bitacoras_php;charset=utf8', 'dtic_user', 'dtic_password');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "        <div class='status success'>";
    echo "            <strong>✅ MySQL:</strong> Conexión exitosa a la base de datos";
    echo "        </div>";
} catch (PDOException $e) {
    echo "        <div class='status error'>";
    echo "            <strong>❌ MySQL:</strong> Error de conexión - " . $e->getMessage();
    echo "        </div>";
}

echo "        <h2>Información del Sistema</h2>";
echo "        <ul>";
echo "            <li><strong>Servidor:</strong> " . $_SERVER['SERVER_SOFTWARE'] . "</li>";
echo "            <li><strong>IP del cliente:</strong> " . $_SERVER['REMOTE_ADDR'] . "</li>";
echo "            <li><strong>Puerto del servidor:</strong> " . $_SERVER['SERVER_PORT'] . "</li>";
echo "        </ul>";

echo "        <p><em>Esta es una página de prueba básica. El entorno Docker está configurado correctamente.</em></p>";
echo "    </div>";
echo "</body>";
echo "</html>";
?>