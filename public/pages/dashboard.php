<?php
require_once '../includes/navigation.php';
$currentPage = 'dashboard';

// Verificar si está autenticado
$user = getCurrentUser();
if (!$user) {
    // Dashboard público - mostrar información general sin requerir login
    $currentPage = 'dashboard-public';
}

function getDashboardContent() {
    $user = getCurrentUser();
    $isLoggedIn = $user !== null;

    $welcomeMessage = $isLoggedIn
        ? "Bienvenido de vuelta, {$user['name']}!"
        : "Bienvenido al Sistema DTIC Bitácoras";

    $subtitle = $isLoggedIn
        ? "Sistema de Gestión de Tareas y Recursos - Departamento de Tecnología de la Información y Comunicación"
        : "Sistema de Gestión de Tareas y Recursos del DTIC - UTN La Rioja";

    return <<<HTML

    <!-- Main Content -->
    <div class="container mt-4">
        <!-- Dashboard Header -->
        <div class="dashboard-header fade-in">
            <h1 class="dashboard-title">
                <i class="fas fa-chart-line me-3"></i>
                {$welcomeMessage}
            </h1>
            <p class="dashboard-subtitle">
                {$subtitle}
            </p>
            <div class="row mt-4">
                <div class="col-md-3">
                    <div class="text-center">
                        <div id="current-date" class="h5 text-muted"></div>
                        <small class="text-secondary">Fecha Actual</small>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="text-center">
                        <div id="current-time" class="h5 text-muted"></div>
                        <small class="text-secondary">Hora Actual</small>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="text-center">
                        <div id="system-status" class="h5 text-success">
                            <i class="fas fa-circle text-success me-1"></i>Online
                        </div>
                        <small class="text-secondary">Estado del Sistema</small>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="text-center">
                        <div id="user-status" class="h5 text-primary">
                            <i class="fas fa-user" . ($isLoggedIn ? 'text-success' : 'text-muted') . " me-1"></i>
                            " . ($isLoggedIn ? 'Conectado' : 'Público') . "
                        </div>
                        <small class="text-secondary">Estado de Sesión</small>
                    </div>
                </div>
            </div>
        </div>

        <!-- Statistics Cards -->
        " . ($isLoggedIn ? '
        <div class="row mb-4">
            <div class="col-md-3 mb-3">
                <div class="card h-100">
                    <div class="card-header">
                        <i class="fas fa-clock text-warning me-2"></i>
                        Tareas Pendientes
                    </div>
                    <div class="card-body text-center">
                        <div class="card-text task-pending" id="pending-tasks">0</div>
                        <small class="text-muted">Esperando asignación</small>
                    </div>
                </div>
            </div>
            <div class="col-md-3 mb-3">
                <div class="card h-100">
                    <div class="card-header">
                        <i class="fas fa-play-circle text-info me-2"></i>
                        En Progreso
                    </div>
                    <div class="card-body text-center">
                        <div class="card-text task-in-progress" id="in-progress-tasks">0</div>
                        <small class="text-muted">Actualmente trabajando</small>
                    </div>
                </div>
            </div>
            <div class="col-md-3 mb-3">
                <div class="card h-100">
                    <div class="card-header">
                        <i class="fas fa-check-circle text-success me-2"></i>
                        Completadas
                    </div>
                    <div class="card-body text-center">
                        <div class="card-text task-completed" id="completed-tasks">0</div>
                        <small class="text-muted">Esta semana</small>
                    </div>
                </div>
            </div>
            <div class="col-md-3 mb-3">
                <div class="card h-100">
                    <div class="card-header">
                        <i class="fas fa-times-circle text-danger me-2"></i>
                        Canceladas
                    </div>
                    <div class="card-body text-center">
                        <div class="card-text task-cancelled" id="cancelled-tasks">0</div>
                        <small class="text-muted">Esta semana</small>
                    </div>
                </div>
            </div>
        </div>' : '
        <div class="row mb-4">
            <div class="col-md-4 mb-3">
                <div class="card h-100">
                    <div class="card-header">
                        <i class="fas fa-users text-primary me-2"></i>
                        Gestión de Técnicos
                    </div>
                    <div class="card-body text-center">
                        <div class="card-text">
                            <i class="fas fa-user-cog fa-2x text-primary mb-3"></i>
                            <p>Administra el personal técnico del DTIC</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-4 mb-3">
                <div class="card h-100">
                    <div class="card-header">
                        <i class="fas fa-tasks text-success me-2"></i>
                        Control de Tareas
                    </div>
                    <div class="card-body text-center">
                        <div class="card-text">
                            <i class="fas fa-clipboard-list fa-2x text-success mb-3"></i>
                            <p>Gestiona tareas y proyectos del departamento</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-4 mb-3">
                <div class="card h-100">
                    <div class="card-header">
                        <i class="fas fa-boxes text-info me-2"></i>
                        Inventario de Recursos
                    </div>
                    <div class="card-body text-center">
                        <div class="card-text">
                            <i class="fas fa-server fa-2x text-info mb-3"></i>
                            <p>Controla equipos y recursos tecnológicos</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>') . "

        <!-- Recent Activity & Upcoming Events -->
        <div class="row">
            <!-- Recent Tasks -->
            <div class="col-md-6 mb-4">
                <div class="card">
                    <div class="card-header">
                        <i class="fas fa-history me-2"></i>
                        Actividad Reciente
                    </div>
                    <div class="card-body">
                        <div id="recent-activity" class="text-center text-muted py-4">
                            <i class="fas fa-inbox fa-3x mb-3"></i>
                            <p>No hay actividad reciente para mostrar.</p>
                            <small>Las actividades aparecerán aquí una vez que se implemente el backend.</small>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Upcoming Events -->
            <div class="col-md-6 mb-4">
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <div>
                            <i class="fas fa-calendar-check me-2"></i>
                            Próximos Eventos
                        </div>
                        <a href="/calendario" class="btn btn-sm btn-outline-primary">
                            <i class="fas fa-external-link-alt"></i>
                        </a>
                    </div>
                    <div class="card-body">
                        <div id="dashboard-upcoming-events">
                            <!-- Events will be populated by JavaScript -->
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Quick Actions -->
        " . ($isLoggedIn ? '
        <div class="row">
            <div class="col-12 mb-4">
                <div class="card">
                    <div class="card-header">
                        <i class="fas fa-bolt me-2"></i>
                        Acciones Rápidas
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-3">
                                <div class="d-grid gap-2">
                                    <button class="btn btn-primary" id="btn-new-task" disabled>
                                        <i class="fas fa-plus me-2"></i>Nueva Tarea
                                    </button>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="d-grid gap-2">
                                    <button class="btn btn-success" id="btn-new-resource" disabled>
                                        <i class="fas fa-box me-2"></i>Nuevo Recurso
                                    </button>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="d-grid gap-2">
                                    <button class="btn btn-info" onclick="window.location.href=\'/calendario\'">
                                        <i class="fas fa-calendar-plus me-2"></i>Nuevo Evento
                                    </button>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="d-grid gap-2">
                                    <button class="btn btn-warning" id="btn-reports" disabled>
                                        <i class="fas fa-chart-bar me-2"></i>Ver Reportes
                                    </button>
                                </div>
                            </div>
                        </div>
                        <hr>
                        <div class="text-center">
                            <small class="text-muted">
                                <i class="fas fa-info-circle me-1"></i>
                                Las acciones estarán disponibles en etapas posteriores
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        </div>' : '
        <div class="row">
            <div class="col-12 mb-4">
                <div class="card">
                    <div class="card-header">
                        <i class="fas fa-sign-in-alt me-2"></i>
                        Acceso al Sistema
                    </div>
                    <div class="card-body text-center">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="d-grid gap-2">
                                    <button class="btn btn-primary btn-lg" onclick="window.location.href=\'/login\'">
                                        <i class="fas fa-sign-in-alt me-2"></i>Iniciar Sesión
                                    </button>
                                    <small class="text-muted">Accede a todas las funcionalidades del sistema</small>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="d-grid gap-2">
                                    <button class="btn btn-outline-secondary btn-lg" onclick="window.location.href=\'/test\'">
                                        <i class="fas fa-flask me-2"></i>Verificar Sistema
                                    </button>
                                    <small class="text-muted">Página de diagnóstico y pruebas</small>
                                </div>
                            </div>
                        </div>
                        <hr>
                        <div class="text-center">
                            <small class="text-muted">
                                <i class="fas fa-info-circle me-1"></i>
                                Para acceder a funciones avanzadas, inicia sesión con tus credenciales
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        </div>') . "

        <!-- System Information -->
        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-header">
                        <i class="fas fa-server me-2"></i>
                        Información del Sistema
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-3">
                                <div class="text-center">
                                    <i class="fas fa-code fa-2x text-primary mb-2"></i>
                                    <div class="h6">PHP 8.1</div>
                                    <small class="text-muted">Versión del servidor</small>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="text-center">
                                    <i class="fas fa-database fa-2x text-success mb-2"></i>
                                    <div class="h6">MySQL 8.0</div>
                                    <small class="text-muted">Base de datos</small>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="text-center">
                                    <i class="fas fa-calendar-alt fa-2x text-warning mb-2"></i>
                                    <div class="h6">Calendario</div>
                                    <small class="text-muted">Gestión de eventos</small>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="text-center">
                                    <a href="/estado-proyecto" class="text-decoration-none">
                                        <i class="fas fa-info-circle fa-2x text-info mb-2"></i>
                                        <div class="h6 text-info">Estado del Proyecto</div>
                                        <small class="text-muted">Ver progreso</small>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
HTML;
}

echo renderPage($currentPage, 'Dashboard', getDashboardContent(), renderLogoutScript());