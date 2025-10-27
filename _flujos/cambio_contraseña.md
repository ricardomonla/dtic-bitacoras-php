# Flujo de Trabajo: Cambio de Contraseña

## Descripción General
Este documento detalla el proceso completo para cambiar la contraseña de un usuario existente en el sistema DTIC Bitácoras. Este flujo es utilizado por administradores para resetear contraseñas olvidadas, establecer contraseñas temporales o cambiar contraseñas por motivos de seguridad.

## Requisitos Previos
- Acceso administrativo al sistema
- Conocimiento del email o DTIC ID del usuario
- Nueva contraseña que cumpla con las políticas de seguridad

## Proceso de Cambio de Contraseña

### 1. Verificación de Usuario Existente
Antes de cambiar la contraseña, verificar que el usuario existe y está activo.

```bash
# Comando Docker para verificar usuario
docker exec dtic-bitacoras-php-db-1 mysql -u dtic_user -pdtic_password dtic_bitacoras_php -e "SELECT id, dtic_id, first_name, last_name, email, role, department, is_active FROM tecnicos WHERE email = 'usuario@ejemplo.com' AND is_active = 1;" 2>/dev/null || echo "User not found"
```

**Campos de la tabla `tecnicos`:**
- `id`: Identificador único del usuario
- `dtic_id`: ID único del DTIC
- `first_name`: Nombre
- `last_name`: Apellido
- `email`: Correo electrónico (único)
- `password_hash`: Hash bcrypt de la contraseña
- `role`: Rol del usuario (admin, technician, etc.)
- `department`: Departamento
- `is_active`: Estado del usuario (1 = activo, 0 = inactivo)

### 2. Generación del Hash de Contraseña
Las contraseñas deben ser hasheadas usando bcrypt con costo 12 para seguridad.

```bash
# Generar hash usando PHP en el contenedor
docker exec dtic-bitacoras-php-app-1 php -r "echo password_hash('nueva_contraseña', PASSWORD_BCRYPT, ['cost' => 12]);"
```

**Ejemplo de salida:**
```
$2y$12$afm1zzv8EcNFLTztemSd6.YFq7geLbnczaTnq0bqjXYH9tmB1GzBy
```

### 3. Actualización en Base de Datos
Actualizar el campo `password_hash` en la tabla `tecnicos`.

```bash
# Comando para actualizar contraseña
docker exec dtic-bitacoras-php-db-1 mysql -u dtic_user -pdtic_password dtic_bitacoras_php -e "UPDATE tecnicos SET password_hash = '\$2y\$12\$...' WHERE email = 'usuario@ejemplo.com' AND is_active = 1;" 2>/dev/null || echo "Update failed"
```

### 4. Verificación del Cambio
Confirmar que la actualización fue exitosa verificando los datos del usuario.

```bash
# Verificar actualización
docker exec dtic-bitacoras-php-db-1 mysql -u dtic_user -pdtic_password dtic_bitacoras_php -e "SELECT id, dtic_id, first_name, last_name, email, role, department, is_active FROM tecnicos WHERE email = 'usuario@ejemplo.com' AND is_active = 1;"
```

## Ejemplo Completo: Cambio de Contraseña para rmonla@frlr.utn.edu.ar

### Paso 1: Verificar Usuario
```bash
docker exec dtic-bitacoras-php-db-1 mysql -u dtic_user -pdtic_password dtic_bitacoras_php -e "SELECT id, dtic_id, first_name, last_name, email, role, department, is_active FROM tecnicos WHERE email = 'rmonla@frlr.utn.edu.ar';"
```

**Salida esperada:**
```
id	dtic_id	first_name	last_name	email	role	department	is_active
2	rmonla	Rodrigo	Monla	rmonla@frlr.utn.edu.ar	technician	DTIC	1
```

### Paso 2: Generar Hash
```bash
docker exec dtic-bitacoras-php-app-1 php -r "echo password_hash('utn123', PASSWORD_BCRYPT, ['cost' => 12]);"
```

**Salida:**
```
$2y$12$afm1zzv8EcNFLTztemSd6.YFq7geLbnczaTnq0bqjXYH9tmB1GzBy
```

### Paso 3: Actualizar Base de Datos
```bash
docker exec dtic-bitacoras-php-db-1 mysql -u dtic_user -pdtic_password dtic_bitacoras_php -e "UPDATE tecnicos SET password_hash = '\$2y\$12\$afm1zzv8EcNFLTztemSd6.YFq7geLbnczaTnq0bqjXYH9tmB1GzBy' WHERE email = 'rmonla@frlr.utn.edu.ar' AND is_active = 1;"
```

### Paso 4: Confirmar Cambio
```bash
docker exec dtic-bitacoras-php-db-1 mysql -u dtic_user -pdtic_password dtic_bitacoras_php -e "SELECT id, dtic_id, first_name, last_name, email, role, department, is_active FROM tecnicos WHERE email = 'rmonla@frlr.utn.edu.ar' AND is_active = 1;"
```

## Manejo de Errores

### Usuario No Encontrado
```bash
# Si el usuario no existe
echo "User not found"
```

**Solución:** Verificar el email o DTIC ID, o crear el usuario si es necesario.

### Error de Actualización
```bash
# Si la actualización falla
echo "Update failed"
```

**Solución:** Verificar permisos de base de datos, conexión al contenedor, y sintaxis del comando.

### Usuario Ya Existe (al Insertar)
```bash
# Al intentar insertar un usuario existente
echo "User might already exist"
```

**Solución:** Usar UPDATE en lugar de INSERT, o verificar primero con SELECT.

## Políticas de Contraseña
- **Longitud mínima:** 8 caracteres
- **Complejidad:** Al menos una mayúscula, minúscula, número y carácter especial
- **Hashing:** bcrypt con costo 12
- **Almacenamiento:** Nunca guardar contraseñas en texto plano

## Auditoría
Cada cambio de contraseña debe registrarse en la tabla `audit_log`:
```sql
INSERT INTO audit_log (user_id, action, details, ip_address) VALUES (?, 'password_change', ?, ?);
```

## Comandos Útiles para Administración

### Ver Todos los Usuarios Activos
```bash
docker exec dtic-bitacoras-php-db-1 mysql -u dtic_user -pdtic_password dtic_bitacoras_php -e "SELECT id, dtic_id, CONCAT(first_name, ' ', last_name) as name, email, role, department FROM tecnicos WHERE is_active = 1 ORDER BY id;"
```

### Desactivar Usuario
```bash
docker exec dtic-bitacoras-php-db-1 mysql -u dtic_user -pdtic_password dtic_bitacoras_php -e "UPDATE tecnicos SET is_active = 0 WHERE email = 'usuario@ejemplo.com';"
```

### Ver Historial de Sesiones
```bash
docker exec dtic-bitacoras-php-db-1 mysql -u dtic_user -pdtic_password dtic_bitacoras_php -e "SELECT * FROM sesiones WHERE user_id = (SELECT id FROM tecnicos WHERE email = 'usuario@ejemplo.com') ORDER BY created_at DESC LIMIT 10;"
```

## Consideraciones de Seguridad
- Ejecutar comandos solo desde entornos seguros
- No mostrar hashes de contraseña en logs
- Usar conexiones seguras (SSL/TLS) en producción
- Implementar rate limiting para operaciones administrativas
- Registrar todas las operaciones en audit_log

## Próximos Pasos
- Implementar interfaz web para cambio de contraseñas
- Agregar notificaciones por email al usuario
- Implementar políticas de expiración de contraseñas
- Agregar funcionalidad de "olvide mi contraseña"