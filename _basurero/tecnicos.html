<?php require_once 'includes/auth_middleware.php'; ?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DTIC Bitácoras - Gestión de Usuarios</title>

    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- Font Awesome Icons -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">

    <!-- Custom CSS -->
    <link href="css/styles.css" rel="stylesheet">
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-dark">
        <div class="container">
            <a class="navbar-brand" href="index.html">
                <i class="fas fa-clipboard-list me-2"></i>
                DTIC Bitácoras
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav me-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="index.html">
                            <i class="fas fa-tachometer-alt me-1"></i>Dashboard
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="tareas.html">
                            <i class="fas fa-tasks me-1"></i>Tareas
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="recursos.html">
                            <i class="fas fa-boxes me-1"></i>Recursos
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="calendario.html">
                            <i class="fas fa-calendar-alt me-1"></i>Calendario
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link active" href="tecnicos.html">
                            <i class="fas fa-user-cog me-1"></i>Técnicos
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="usuarios.html">
                            <i class="fas fa-users me-1"></i>Usuarios
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="reportes.html">
                            <i class="fas fa-chart-bar me-1"></i>Reportes
                        </a>
                    </li>
                </ul>
                <?php echo renderUserInfo(); ?>
            </div>
        </div>
    </nav>

    <!-- Main Content -->
    <div class="container mt-4">
        <!-- Page Header -->
        <div class="page-header tecnicos">
            <div>
                <h1 class="page-title">
                    <i class="fas fa-users me-3"></i>
                    Gestión de Técnicos
                </h1>
                <p class="page-subtitle">Administra los técnicos asignados a recursos del sistema DTIC Bitácoras</p>
            </div>
        </div>

        <!-- User Statistics -->
        <div class="row mb-4">
            <div class="col-md-3 mb-3">
                <div class="card text-center h-100">
                    <div class="card-body">
                        <div class="display-4 text-primary mb-2" id="totalUsers">6</div>
                        <h6 class="card-title">Total Técnicos</h6>
                        <small class="text-muted">Registrados en el sistema</small>
                    </div>
                </div>
            </div>
            <div class="col-md-3 mb-3">
                <div class="card text-center h-100">
                    <div class="card-body">
                        <div class="display-4 text-success mb-2" id="activeUsers">5</div>
                        <h6 class="card-title">Activos</h6>
                        <small class="text-muted">Con acceso al sistema</small>
                    </div>
                </div>
            </div>
            <div class="col-md-3 mb-3">
                <div class="card text-center h-100">
                    <div class="card-body">
                        <div class="display-4 text-warning mb-2" id="inactiveUsers">1</div>
                        <h6 class="card-title">Inactivos</h6>
                        <small class="text-muted">Acceso suspendido</small>
                    </div>
                </div>
            </div>
            <div class="col-md-3 mb-3">
                <div class="card text-center h-100">
                    <div class="card-body">
                        <div class="display-4 text-danger mb-2" id="adminUsers">1</div>
                        <h6 class="card-title">Administradores</h6>
                        <small class="text-muted">Acceso completo</small>
                    </div>
                </div>
            </div>
        </div>


        <!-- Users List -->
        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-header">
                        <div class="d-flex justify-content-between align-items-center">
                            <h5 class="mb-0">Lista de Técnicos</h5>
                            <div class="btn-group" role="group">
                                <button class="btn btn-outline-success btn-sm" type="button" data-bs-toggle="collapse" data-bs-target="#addUserCollapse" aria-expanded="false" aria-controls="addUserCollapse" title="Agregar nuevo técnico">
                                    <i class="fas fa-user-plus"></i>
                                </button>
                                <button class="btn btn-outline-primary btn-sm" type="button" data-bs-toggle="collapse" data-bs-target="#searchCollapse" aria-expanded="false" aria-controls="searchCollapse" title="Buscar y filtrar técnicos">
                                    <i class="fas fa-search"></i>
                                </button>
                                <input type="radio" class="btn-check" name="viewMode" id="cardView" autocomplete="off" checked>
                                <label class="btn btn-outline-primary btn-sm" for="cardView" title="Vista de tarjetas">
                                    <i class="fas fa-th"></i>
                                </label>
                                <input type="radio" class="btn-check" name="viewMode" id="tableView" autocomplete="off">
                                <label class="btn btn-outline-primary btn-sm" for="tableView" title="Vista de tabla">
                                    <i class="fas fa-list"></i>
                                </label>
                            </div>
                        </div>
                        <!-- Collapsible Search and Filters -->
                        <div class="collapse collapse-search" id="searchCollapse">
                            <div class="mt-3 p-3 bg-light rounded">
                                <div class="row g-3">
                                    <div class="col-md-6">
                                        <label class="form-label small fw-bold">Buscar técnicos</label>
                                        <div class="input-group">
                                            <span class="input-group-text">
                                                <i class="fas fa-search"></i>
                                            </span>
                                            <input type="text" class="form-control" id="searchUsers" placeholder="Nombre, apellido, email o ID DTIC...">
                                        </div>
                                    </div>
                                    <div class="col-md-2">
                                        <label class="form-label small fw-bold">Rol</label>
                                        <select class="form-select form-select-sm" id="filterRole">
                                            <option value="">Todos</option>
                                            <option value="admin">Admin</option>
                                            <option value="technician">Técnico</option>
                                            <option value="viewer">Viewer</option>
                                        </select>
                                    </div>
                                    <div class="col-md-2">
                                        <label class="form-label small fw-bold">Estado</label>
                                        <select class="form-select form-select-sm" id="filterStatus">
                                            <option value="">Todos</option>
                                            <option value="active">Activo</option>
                                            <option value="inactive">Inactivo</option>
                                        </select>
                                    </div>
                                    <div class="col-md-2">
                                        <label class="form-label small fw-bold">Depto</label>
                                        <select class="form-select form-select-sm" id="filterDepartment">
                                            <option value="">Todos</option>
                                            <option value="dtic">DTIC</option>
                                            <option value="sistemas">Sistemas</option>
                                            <option value="redes">Redes</option>
                                            <option value="seguridad">Seguridad</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-between align-items-center mt-3">
                                    <button class="btn btn-outline-secondary btn-sm" id="clearFilters">
                                        <i class="fas fa-times me-1"></i>Limpiar filtros
                                    </button>
                                    <button class="btn btn-outline-secondary btn-sm" type="button" data-bs-toggle="collapse" data-bs-target="#searchCollapse">
                                        <i class="fas fa-chevron-up me-1"></i>Ocultar
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Collapsible Add User Form -->
                        <div class="collapse collapse-form" id="addUserCollapse">
                            <div class="mt-3 p-3 bg-light rounded">
                                <h6 class="fw-bold text-primary mb-3">
                                    <i class="fas fa-user-plus me-2"></i>Agregar Nuevo Técnico
                                </h6>
                                <form id="addUserForm">
                                    <div class="row g-3">
                                        <div class="col-md-6">
                                            <label class="form-label small fw-bold">Nombre *</label>
                                            <input type="text" class="form-control form-control-sm" id="userFirstName" required>
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label small fw-bold">Apellido *</label>
                                            <input type="text" class="form-control form-control-sm" id="userLastName" required>
                                        </div>
                                        <div class="col-md-8">
                                            <label class="form-label small fw-bold">Email *</label>
                                            <input type="email" class="form-control form-control-sm" id="userEmail" required>
                                        </div>
                                        <div class="col-md-4">
                                            <label class="form-label small fw-bold">Rol *</label>
                                            <select class="form-select form-select-sm" id="userRole" required>
                                                <option value="">Seleccionar...</option>
                                                <option value="admin">Administrador</option>
                                                <option value="technician">Técnico</option>
                                                <option value="viewer">Visualizador</option>
                                            </select>
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label small fw-bold">Departamento *</label>
                                            <select class="form-select form-select-sm" id="userDepartment" required>
                                                <option value="">Seleccionar...</option>
                                                <option value="dtic">DTIC</option>
                                                <option value="sistemas">Sistemas</option>
                                                <option value="redes">Redes</option>
                                                <option value="seguridad">Seguridad</option>
                                            </select>
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label small fw-bold">Teléfono</label>
                                            <input type="tel" class="form-control form-control-sm" id="userPhone">
                                        </div>
                                    </div>
                                    <div class="d-flex justify-content-between align-items-center mt-3">
                                        <small class="text-muted">Los campos marcados con * son obligatorios</small>
                                        <div>
                                            <button type="button" class="btn btn-outline-secondary btn-sm me-2" data-bs-toggle="collapse" data-bs-target="#addUserCollapse">
                                                <i class="fas fa-times me-1"></i>Cancelar
                                            </button>
                                            <button type="button" class="btn btn-success btn-sm" id="saveUserBtn">
                                                <i class="fas fa-save me-1"></i>Crear Técnico
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <!-- Card View -->
                        <div id="cardViewContainer" class="row">
                            <!-- Cards will be populated by JavaScript -->
                        </div>

                        <!-- Table View (Hidden by default) -->
                        <div id="tableViewContainer" class="d-none">
                            <div class="table-responsive">
                                <table class="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>Nombre</th>
                                            <th>Email</th>
                                            <th>Rol</th>
                                            <th>Departamento</th>
                                            <th>Estado</th>
                                            <th>Último Acceso</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <!-- Table rows will be populated by JavaScript -->
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>


    <!-- Footer -->
    <footer class="footer mt-5">
        <div class="container">
            <div class="row">
                <div class="col-12 text-center">
                    <p class="mb-0">
                        <i class="fas fa-copyright me-1"></i>
                        2025 DTIC - Departamento de Tecnología de la Información y Comunicación |
                        <i class="fas fa-user-cog me-1"></i> Gestión de Técnicos
                    </p>
                </div>
            </div>
        </div>
    </footer>

    <!-- Bootstrap 5 JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>

    <!-- Custom JavaScript -->

    <?php echo renderLogoutScript(); ?>
    <script src="js/dashboard.js"></script>
    <script src="js/tecnicos.js"></script>
</body>
</html>