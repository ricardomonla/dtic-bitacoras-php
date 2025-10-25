<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DTIC Bitácoras - Iniciar Sesión</title>

    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- Font Awesome Icons -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">

    <!-- Custom CSS -->
    <link href="css/styles.css" rel="stylesheet">

    <style>
        .login-container {
            min-height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .login-card {
            background: white;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
            max-width: 400px;
            width: 100%;
        }

        .login-header {
            background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
            color: white;
            padding: 2rem;
            text-align: center;
        }

        .login-body {
            padding: 2rem;
        }

        .login-logo {
            font-size: 3rem;
            margin-bottom: 1rem;
        }

        .form-control:focus {
            border-color: #667eea;
            box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
        }

        .btn-login {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            padding: 0.75rem 2rem;
            border-radius: 25px;
            font-weight: 600;
            transition: transform 0.2s ease;
        }

        .btn-login:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
        }

        .login-footer {
            text-align: center;
            padding: 1rem;
            background: #f8f9fa;
            border-top: 1px solid #dee2e6;
        }

        .alert {
            border-radius: 10px;
            border: none;
        }

        .form-check-input:checked {
            background-color: #667eea;
            border-color: #667eea;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="login-card">
            <div class="login-header">
                <div class="login-logo">
                    <i class="fas fa-clipboard-list"></i>
                </div>
                <h2 class="mb-0">DTIC Bitácoras</h2>
                <p class="mb-0 opacity-75">Sistema de Gestión de Recursos</p>
            </div>

            <div class="login-body">
                <!-- Alertas de error -->
                <div id="loginAlert" class="alert alert-danger d-none" role="alert">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    <span id="loginAlertText"></span>
                </div>

                <!-- Formulario de login -->
                <form id="loginForm">
                    <div class="mb-3">
                        <label for="username" class="form-label">
                            <i class="fas fa-user me-2"></i>Usuario o Email
                        </label>
                        <input type="text" class="form-control" id="username" name="username" required
                               placeholder="Ingrese su usuario o email">
                        <div class="invalid-feedback">
                            Por favor ingrese su usuario o email.
                        </div>
                    </div>

                    <div class="mb-3">
                        <label for="password" class="form-label">
                            <i class="fas fa-lock me-2"></i>Contraseña
                        </label>
                        <div class="input-group">
                            <input type="password" class="form-control" id="password" name="password" required
                                   placeholder="Ingrese su contraseña">
                            <button class="btn btn-outline-secondary" type="button" id="togglePassword">
                                <i class="fas fa-eye"></i>
                            </button>
                            <div class="invalid-feedback">
                                Por favor ingrese su contraseña.
                            </div>
                        </div>
                    </div>

                    <div class="mb-3 form-check">
                        <input type="checkbox" class="form-check-input" id="rememberMe" name="remember_me">
                        <label class="form-check-label" for="rememberMe">
                            Recordar sesión (30 días)
                        </label>
                    </div>

                    <div class="d-grid">
                        <button type="submit" class="btn btn-primary btn-login" id="loginBtn">
                            <i class="fas fa-sign-in-alt me-2"></i>
                            <span id="loginBtnText">Iniciar Sesión</span>
                        </button>
                    </div>
                </form>
            </div>

            <div class="login-footer">
                <small class="text-muted">
                    <i class="fas fa-shield-alt me-1"></i>
                    Conexión segura • DTIC 2025
                </small>
            </div>
        </div>
    </div>

    <!-- Bootstrap 5 JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>

    <!-- Custom JavaScript -->
    <script>
        class LoginManager {
            constructor() {
                this.loginForm = document.getElementById('loginForm');
                this.loginBtn = document.getElementById('loginBtn');
                this.loginBtnText = document.getElementById('loginBtnText');
                this.loginAlert = document.getElementById('loginAlert');
                this.loginAlertText = document.getElementById('loginAlertText');

                this.init();
            }

            init() {
                this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
                document.getElementById('togglePassword').addEventListener('click', () => this.togglePassword());

                // Verificar si ya está autenticado
                this.checkAuthStatus();
            }

            async checkAuthStatus() {
                try {
                    const response = await fetch('/api/auth/check.php', {
                        method: 'GET',
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest'
                        },
                        credentials: 'same-origin'
                    });

                    if (response.ok) {
                        const data = await response.json();
                        if (data.authenticated) {
                            // Usuario ya autenticado, redirigir al dashboard
                            window.location.href = '/dashboard';
                        }
                    }
                } catch (error) {
                    // Ignorar errores de verificación inicial
                }
            }

            async handleLogin(e) {
                e.preventDefault();

                // Limpiar errores previos
                this.clearErrors();

                const formData = new FormData(this.loginForm);
                const loginData = {
                    username: formData.get('username').trim(),
                    password: formData.get('password'),
                    remember_me: formData.get('remember_me') === 'on'
                };

                // Validación básica
                if (!loginData.username || !loginData.password) {
                    this.showError('Por favor complete todos los campos.');
                    return;
                }

                // Mostrar loading
                this.setLoading(true);

                try {
                    const response = await fetch('/api/login.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Requested-With': 'XMLHttpRequest'
                        },
                        body: JSON.stringify(loginData),
                        credentials: 'same-origin'
                    });

                    const data = await response.json();

                    if (data.success) {
                        // Login exitoso
                        this.showSuccess('Iniciando sesión...');

                        // Redirigir después de un breve delay
                        setTimeout(() => {
                            window.location.href = data.redirect || '/dashboard';
                        }, 1000);
                    } else {
                        // Error de login
                        this.showError(data.message || 'Error al iniciar sesión.');
                    }
                } catch (error) {
                    console.error('Login error:', error);
                    this.showError('Error de conexión. Por favor intente nuevamente.');
                } finally {
                    this.setLoading(false);
                }
            }

            togglePassword() {
                const passwordInput = document.getElementById('password');
                const toggleBtn = document.getElementById('togglePassword');
                const icon = toggleBtn.querySelector('i');

                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    icon.className = 'fas fa-eye-slash';
                } else {
                    passwordInput.type = 'password';
                    icon.className = 'fas fa-eye';
                }
            }

            setLoading(loading) {
                this.loginBtn.disabled = loading;
                this.loginBtnText.textContent = loading ? 'Iniciando sesión...' : 'Iniciar Sesión';

                if (loading) {
                    this.loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i><span id="loginBtnText">Iniciando sesión...</span>';
                } else {
                    this.loginBtn.innerHTML = '<i class="fas fa-sign-in-alt me-2"></i><span id="loginBtnText">Iniciar Sesión</span>';
                }
            }

            showError(message) {
                this.loginAlertText.textContent = message;
                this.loginAlert.className = 'alert alert-danger';
                this.loginAlert.classList.remove('d-none');
            }

            showSuccess(message) {
                this.loginAlertText.textContent = message;
                this.loginAlert.className = 'alert alert-success';
                this.loginAlert.classList.remove('d-none');
            }

            clearErrors() {
                this.loginAlert.classList.add('d-none');
                this.loginForm.classList.remove('was-validated');

                // Limpiar clases de error
                const inputs = this.loginForm.querySelectorAll('.form-control');
                inputs.forEach(input => {
                    input.classList.remove('is-invalid');
                });
            }
        }

        // Inicializar cuando el DOM esté listo
        document.addEventListener('DOMContentLoaded', function() {
            window.loginManager = new LoginManager();
        });
    </script>
</body>
</html>