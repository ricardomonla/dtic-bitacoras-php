# Flujo de Trabajo: Acceso de Usuario Administrador

## Descripción General
Este documento detalla el proceso completo de autenticación y acceso al sistema DTIC Bitácoras para usuarios con rol de administrador.

## Roles y Permisos
- **Admin**: Nivel máximo de permisos (nivel 10 en jerarquía)
- **Supervisor**: Nivel 4
- **Technician**: Nivel 5
- **Analyst**: Nivel 3
- **Operator**: Nivel 2
- **Viewer**: Nivel 1 (solo lectura)

## Proceso de Login

### 1. Acceso a la Página de Login
- **URL**: `/login` o `/pages/login.php`
- **Método**: GET
- **Interfaz**: Formulario web responsive con Bootstrap 5

### 2. Verificación de Sesión Activa
Antes de mostrar el formulario de login, el sistema verifica si ya existe una sesión activa:

```javascript
// Verificación automática al cargar la página
async checkAuthStatus() {
    const response = await fetch('/api/auth/check.php', {
        method: 'GET',
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
        credentials: 'same-origin'
    });

    if (response.ok) {
        const data = await response.json();
        if (data.authenticated) {
            window.location.href = '/dashboard'; // Redirección automática
        }
    }
}
```

### 3. Ingreso de Credenciales
El usuario administrador debe proporcionar:
- **Usuario**: Email o DTIC ID
- **Contraseña**: Mínimo 8 caracteres con requisitos de complejidad
- **Opción**: "Recordar sesión" (30 días)

### 4. Validación del Lado Cliente
- Campos requeridos completos
- Formato básico de email si se usa email
- Longitud mínima de contraseña

### 5. Envío de Datos de Autenticación
```javascript
const response = await fetch('/api/login.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    },
    body: JSON.stringify(loginData),
    credentials: 'same-origin'
});
```

### 6. Procesamiento en el Servidor (`/api/login.php`)

#### 6.1 Validación de Datos
- Sanitización de entrada
- Validación de formato y longitud
- Rate limiting (máximo 5 intentos por 15 minutos por IP)

#### 6.2 Búsqueda del Usuario
El sistema busca el usuario en el siguiente orden:
1. **Tabla `tecnicos`** por email
2. **Tabla `tecnicos`** por DTIC ID
3. **Tabla `users`** por email o DTIC ID

```php
// Solo usuarios activos (is_active = 1)
WHERE email = ? AND is_active = 1
```

#### 6.3 Verificación de Contraseña
- Hash bcrypt con costo 12
- Comparación segura usando `password_verify()`

#### 6.4 Creación de Sesión
Si la autenticación es exitosa:
- Genera session ID único (32 bytes hex)
- Almacena datos en `$_SESSION`
- Guarda sesión en tabla `sesiones` de BD
- Registra auditoría del login exitoso

#### 6.5 Manejo de "Recordar Sesión"
Si se marca la opción:
- Genera token seguro (32 bytes)
- Hash del token con `password_hash()`
- Establece cookie HTTP-only segura
- Actualiza tabla `sesiones` con token y expiración (30 días)

### 7. Respuesta del Servidor
```json
{
    "success": true,
    "message": "Login exitoso",
    "user": {
        "id": 123,
        "dtic_id": "ADMIN001",
        "name": "Juan Pérez",
        "email": "admin@dtic.gob.ar",
        "role": "admin",
        "department": "DTIC"
    },
    "redirect": "index.html",
    "session_expires": 1640995200
}
```

### 8. Redirección al Dashboard
- Redirección automática a `/dashboard`
- Sesión válida por 24 horas de inactividad

## Verificación Continua de Sesión

### Middleware de Autenticación (`auth_middleware.php`)
Cada página protegida incluye verificación:
- Sesión PHP activa
- Sesión válida en base de datos
- Usuario activo
- Actualización de última actividad

### Verificación de Permisos
```php
function hasPermission(string $requiredRole): bool {
    $roleHierarchy = [
        'viewer' => 1,
        'operator' => 2,
        'analyst' => 3,
        'supervisor' => 4,
        'technician' => 5,
        'admin' => 10
    ];

    $userLevel = $roleHierarchy[$_SESSION['user_role']] ?? 0;
    $requiredLevel = $roleHierarchy[$requiredRole] ?? 0;

    return $userLevel >= $requiredLevel;
}
```

## Manejo de Sesiones Recordadas

### Restauración Automática
- Verificación de cookie `remember_token`
- Búsqueda de sesión válida en BD
- Verificación de hash del token
- Restauración de sesión PHP si es válida

### Seguridad
- Tokens hasheados en BD
- Cookies HTTP-only y SameSite
- Expiración automática (30 días)
- Invalidación al cerrar sesión

## Auditoría y Logging

### Eventos Registrados
- Intentos de login exitosos
- Intentos de login fallidos
- Cambios de sesión
- Acceso a recursos protegidos

### Rate Limiting
- Máximo 5 intentos por 15 minutos
- Bloqueo temporal por IP
- Logging de intentos excedidos

## Casos de Error

### Credenciales Incorrectas
- Mensaje genérico: "Usuario o contraseña incorrectos"
- Logging detallado para auditoría
- Rate limiting aplicado

### Usuario Inactivo
- Tratado como "usuario no encontrado"
- Logging de intento

### Sesión Expirada
- Redirección automática a login
- Limpieza de sesión

## Seguridad Implementada

### Protección XSS
- Sanitización de todas las entradas
- Escape de HTML en outputs

### Protección CSRF
- Headers `X-Requested-With`
- Validación de origen

### Encriptación
- Contraseñas: bcrypt
- Sesiones: PHP session handling seguro
- Cookies: flags seguros

### Rate Limiting
- Por IP y acción
- Ventanas de tiempo configurables
- Logging de violaciones

## Diagramas de Flujo

### Flujo de Login Básico
```
Usuario accede a /login
    ↓
¿Sesión activa?
    ├── Sí → Redirección a dashboard
    └── No → Mostrar formulario
        ↓
Usuario ingresa credenciales
    ↓
Validación cliente
    ↓
Envío a /api/login.php
    ↓
Validación servidor
    ↓
¿Usuario encontrado?
    ├── No → Error "Usuario o contraseña incorrectos"
    └── Sí → ¿Contraseña correcta?
        ├── No → Error + auditoría
        └── Sí → Crear sesión + redirección
```

### Verificación de Permisos
```
Acceso a página protegida
    ↓
¿Sesión PHP válida?
    ├── No → Redirección a login
    └── Sí → ¿Sesión BD válida?
        ├── No → Redirección a login
        └── Sí → ¿Usuario activo?
            ├── No → Redirección a login
            └── Sí → ¿Permisos suficientes?
                ├── No → Error 403
                └── Sí → Acceso concedido
```

## Configuración y Dependencias

### Archivos Requeridos
- `public/pages/login.php` - Interfaz de login
- `public/api/login.php` - API de autenticación
- `public/api/auth/check.php` - Verificación de sesión
- `public/includes/auth_middleware.php` - Middleware de auth
- `public/includes/security.php` - Funciones de seguridad
- `public/includes/functions.php` - Funciones auxiliares
- `public/config/database.php` - Configuración BD

### Base de Datos
**Tabla `tecnicos`:**
- id, dtic_id, first_name, last_name, email, password_hash, role, department, is_active

**Tabla `sesiones`:**
- session_id, user_id, user_type, user_agent, ip_address, created_at, last_activity, remember_token, remember_expires

**Tabla `audit_log`:**
- id, user_id, action, details, ip_address, created_at

## Consideraciones de Producción

### Configuración HTTPS
- Cookies seguras solo en HTTPS
- Headers de seguridad HSTS

### Monitoreo
- Logs de autenticación
- Alertas de intentos fallidos masivos
- Monitoreo de sesiones activas

### Mantenimiento
- Limpieza automática de sesiones expiradas
- Rotación de tokens de recordar
- Actualización periódica de hashes de contraseña

## Gestión de Usuarios y Roles

### Verificación de Usuarios Existentes
Los administradores pueden verificar la existencia de usuarios en el sistema.

```bash
# Verificar usuario por email
docker exec dtic-bitacoras-php-db-1 mysql -u dtic_user -pdtic_password dtic_bitacoras_php -e "SELECT id, dtic_id, first_name, last_name, email, role, department, is_active FROM tecnicos WHERE email = 'usuario@ejemplo.com' AND is_active = 1;" 2>/dev/null || echo "User not found"
```

### Inserción de Nuevos Técnicos
Para agregar nuevos usuarios al sistema:

```bash
# Insertar nuevo técnico (contraseña en blanco inicialmente)
docker exec dtic-bitacoras-php-db-1 mysql -u dtic_user -pdtic_password dtic_bitacoras_php -e "INSERT INTO tecnicos (dtic_id, first_name, last_name, email, password_hash, role, department, is_active) VALUES ('dtic_id', 'Nombre', 'Apellido', 'email@ejemplo.com', '', 'technician', 'DTIC', 1);" 2>/dev/null || echo "User might already exist"
```

### Gestión de Roles
**Jerarquía de Roles:**
- `admin`: Nivel 10 - Control total del sistema
- `supervisor`: Nivel 4 - Supervisión de operaciones
- `technician`: Nivel 5 - Operaciones técnicas
- `analyst`: Nivel 3 - Análisis de datos
- `operator`: Nivel 2 - Operaciones básicas
- `viewer`: Nivel 1 - Solo lectura

### Cambio de Contraseña
Para cambiar la contraseña de un usuario, consulte el flujo detallado en [`cambio_contraseña.md`](cambio_contraseña.md).

## Próximos Pasos
- Implementar autenticación de dos factores (2FA)
- Integración con LDAP/Active Directory
- Políticas de contraseña avanzadas
- Notificaciones de seguridad