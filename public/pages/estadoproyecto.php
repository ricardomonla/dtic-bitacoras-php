<?php
require_once '../includes/auth_middleware.php';
require_once '../includes/navigation.php';
$currentPage = 'estadoproyecto';
?>
<?php echo renderPage($currentPage, 'Estado del Proyecto', '

    <!-- Main Content -->
    <div class="container mt-4">
        <!-- Project Status Header -->
        <div class="dashboard-header fade-in">
            <h1 class="dashboard-title">
                <i class="fas fa-project-diagram me-3"></i>
                Estado del Proyecto DTIC Bitácoras
            </h1>
            <p class="dashboard-subtitle">
                Seguimiento del progreso y estado actual del desarrollo del sistema
            </p>
        </div>

        <!-- Current Phase -->
        <div class="row mb-4">
            <div class="col-12">
                <div class="card">
                    <div class="card-header">
                        <i class="fas fa-play-circle text-success me-2"></i>
                        Fase Actual: Etapa 2 - Maquetación de la Interfaz
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-8">
                                <h5 class="text-success">✅ Completada: Etapa 1 - Preparación del Entorno Docker</h5>
                                <p class="mb-2">Configuración completa del contenedor Docker con PHP 8.1, MySQL 8.0 y Apache.</p>

                                <h5 class="text-primary">🔄 En Progreso: Etapa 2 - Maquetación de la Interfaz</h5>
                                <p class="mb-2">Creación del dashboard responsivo con diseño moderno y elementos de UI.</p>

                                <h5 class="text-muted">⏳ Pendiente: Etapa 3 - Implementación del Backend PHP</h5>
                                <p class="mb-2">Desarrollo de APIs y conexión con base de datos MySQL.</p>

                                <h5 class="text-muted">⏳ Pendiente: Etapa 4 - Desarrollo de Funcionalidades JavaScript</h5>
                                <p class="mb-2">Implementación de AJAX y formularios dinámicos.</p>

                                <h5 class="text-muted">⏳ Pendiente: Etapa 5 - Pruebas y Despliegue Final</h5>
                                <p class="mb-0">Testing completo y configuración de producción.</p>
                            </div>
                            <div class="col-md-4">
                                <div class="text-center">
                                    <div class="progress-circle mb-3">
                                        <div class="progress-circle-inner">
                                            <span class="progress-percentage">40%</span>
                                        </div>
                                    </div>
                                    <h6>Progreso Total</h6>
                                    <small class="text-muted">2 de 5 etapas completadas</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Project Details -->
        <div class="row">
            <!-- Technologies Used -->
            <div class="col-md-6 mb-4">
                <div class="card h-100">
                    <div class="card-header">
                        <i class="fas fa-cogs me-2"></i>
                        Tecnologías Utilizadas
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-6">
                                <h6 class="text-primary">Frontend</h6>
                                <ul class="list-unstyled">
                                    <li><i class="fab fa-html5 text-danger me-1"></i> HTML5</li>
                                    <li><i class="fab fa-css3 text-primary me-1"></i> CSS3</li>
                                    <li><i class="fab fa-js text-warning me-1"></i> JavaScript ES6+</li>
                                    <li><i class="fas fa-bootstrap text-purple me-1"></i> Bootstrap 5</li>
                                </ul>
                <?php echo renderUserInfo(); ?>
                            </div>
                            <div class="col-6">
                                <h6 class="text-success">Backend</h6>
                                <ul class="list-unstyled">
                                    <li><i class="fab fa-php text-indigo me-1"></i> PHP 8.1</li>
                                    <li><i class="fas fa-database text-info me-1"></i> MySQL 8.0</li>
                                    <li><i class="fas fa-server text-secondary me-1"></i> Apache</li>
                                    <li><i class="fab fa-docker text-blue me-1"></i> Docker</li>
                                </ul>
                <?php echo renderUserInfo(); ?>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Project Structure -->
            <div class="col-md-6 mb-4">
                <div class="card h-100">
                    <div class="card-header">
                        <i class="fas fa-folder-tree me-2"></i>
                        Estructura del Proyecto
                    </div>
                    <div class="card-body">
                        <div class="project-structure">
                            <div class="structure-item">
                                <i class="fas fa-folder text-warning me-2"></i>
                                <strong>dtic-bitacoras-php/</strong>
                            </div>
                            <div class="structure-item ms-3">
                                <i class="fas fa-file text-primary me-2"></i>
                                <span class="text-success">✅ Dockerfile</span>
                            </div>
                            <div class="structure-item ms-3">
                                <i class="fas fa-file text-primary me-2"></i>
                                <span class="text-success">✅ docker-compose.yml</span>
                            </div>
                            <div class="structure-item ms-3">
                                <i class="fas fa-folder text-warning me-2"></i>
                                <strong class="text-success">✅ public/</strong>
                                <div class="structure-item ms-4">
                                    <i class="fas fa-file text-info me-2"></i>
                                    <span class="text-success">✅ index.html</span>
                                </div>
                                <div class="structure-item ms-4">
                                    <i class="fas fa-file text-info me-2"></i>
                                    <span class="text-success">✅ estadoproyecto.html</span>
                                </div>
                                <div class="structure-item ms-4">
                                    <i class="fas fa-file text-info me-2"></i>
                                    <span class="text-success">✅ index.php</span>
                                </div>
                                <div class="structure-item ms-4">
                                    <i class="fas fa-folder text-warning me-2"></i>
                                    <strong class="text-success">✅ css/</strong>
                                </div>
                                <div class="structure-item ms-4">
                                    <i class="fas fa-folder text-warning me-2"></i>
                                    <strong class="text-success">✅ js/</strong>
                                </div>
                            </div>
                            <div class="structure-item ms-3">
                                <i class="fas fa-folder text-warning me-2"></i>
                                <strong class="text-muted">⏳ api/</strong>
                            </div>
                            <div class="structure-item ms-3">
                                <i class="fas fa-folder text-warning me-2"></i>
                                <strong class="text-muted">⏳ config/</strong>
                            </div>
                            <div class="structure-item ms-3">
                                <i class="fas fa-folder text-warning me-2"></i>
                                <strong class="text-muted">⏳ includes/</strong>
                            </div>
                            <div class="structure-item ms-3">
                                <i class="fas fa-folder text-warning me-2"></i>
                                <strong class="text-muted">⏳ database/</strong>
                            </div>
                            <div class="structure-item ms-3">
                                <i class="fas fa-folder text-warning me-2"></i>
                                <strong class="text-muted">⏳ logs/</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Recent Updates -->
        <div class="row">
            <div class="col-12 mb-4">
                <div class="card">
                    <div class="card-header">
                        <i class="fas fa-history me-2"></i>
                        Actualizaciones Recientes
                    </div>
                    <div class="card-body">
                        <div class="timeline">
                            <div class="timeline-item">
                                <div class="timeline-marker bg-success"></div>
                                <div class="timeline-content">
                                    <h6 class="text-success">✅ Etapa 2 Completada</h6>
                                    <p class="mb-1">Dashboard responsivo con diseño moderno implementado</p>
                                    <small class="text-muted">Hoy - Maquetación de interfaz finalizada</small>
                                </div>
                            </div>
                            <div class="timeline-item">
                                <div class="timeline-marker bg-success"></div>
                                <div class="timeline-content">
                                    <h6 class="text-success">✅ Etapa 1 Completada</h6>
                                    <p class="mb-1">Entorno Docker configurado y funcionando correctamente</p>
                                    <small class="text-muted">Hoy - Configuración de contenedores PHP y MySQL</small>
                                </div>
                            </div>
                            <div class="timeline-item">
                                <div class="timeline-marker bg-primary"></div>
                                <div class="timeline-content">
                                    <h6 class="text-primary">🔄 Próxima Etapa</h6>
                                    <p class="mb-1">Implementación del backend PHP con APIs REST</p>
                                    <small class="text-muted">Próximamente - Etapa 3</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Quick Links -->
        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-header">
                        <i class="fas fa-link me-2"></i>
                        Enlaces Rápidos
                    </div>
                    <div class="card-body">
                        <div class="row text-center">
                            <div class="col-md-3 mb-3">
                                <a href="index.html" class="btn btn-primary btn-lg w-100">
                                    <i class="fas fa-tachometer-alt fa-2x mb-2"></i><br>
                                    Dashboard
                                </a>
                            </div>
                            <div class="col-md-3 mb-3">
                                <a href="index.php" class="btn btn-success btn-lg w-100">
                                    <i class="fas fa-check-circle fa-2x mb-2"></i><br>
                                    Verificación
                                </a>
                            </div>
                            <div class="col-md-3 mb-3">
                                <button class="btn btn-warning btn-lg w-100" disabled>
                                    <i class="fas fa-code fa-2x mb-2"></i><br>
                                    APIs (Etapa 3)
                                </button>
                            </div>
                            <div class="col-md-3 mb-3">
                                <button class="btn btn-info btn-lg w-100" disabled>
                                    <i class="fas fa-database fa-2x mb-2"></i><br>
                                    Base de Datos (Etapa 3)
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

', renderLogoutScript() . "
    <script src='../js/dashboard.js'></script>
    <script>
        // Actualizar fecha y hora en tiempo real
        function updateDateTime() {
            const now = new Date();
            const dateElement = document.getElementById('current-date');
            const timeElement = document.getElementById('current-time');

            if (dateElement) {
                const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                dateElement.textContent = now.toLocaleDateString('es-ES', options);
            }

            if (timeElement) {
                timeElement.textContent = now.toLocaleTimeString('es-ES', {
                    hour: '2-digit', minute: '2-digit', second: '2-digit'
                });
            }
        }

        // Inicializar cuando el DOM esté listo
        document.addEventListener('DOMContentLoaded', function() {
            updateDateTime();
            setInterval(updateDateTime, 1000);

            console.log('📊 Página de Estado del Proyecto DTIC Bitácoras cargada');
        });
    </script>
"); ?>