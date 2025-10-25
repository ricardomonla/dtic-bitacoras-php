<?php
require_once '../includes/navigation.php';
$currentPage = 'calendario';
?>
<?php echo renderPage($currentPage, 'Calendario Interactivo', '

    <!-- Main Content -->
    <div class="container mt-4">
        <!-- Page Header -->
        <div class="page-header calendario">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h1 class="page-title">
                        <i class="fas fa-calendar-alt me-3"></i>
                        Calendario Interactivo
                    </h1>
                    <p class="page-subtitle">Gestión de eventos, tareas programadas y asignaciones de técnicos del DTIC</p>
                </div>
                <div class="btn-group" role="group">
                    <button class="btn btn-light" data-bs-toggle="modal" data-bs-target="#addEventModal">
                        <i class="fas fa-plus me-2"></i>Nuevo Evento
                    </button>
                    <button class="btn btn-outline-light" id="exportCalendar">
                        <i class="fas fa-download me-2"></i>Exportar
                    </button>
                </div>
            </div>
        </div>

        <!-- Calendar Filters and Controls -->
        <div class="row mb-4">
            <div class="col-12">
                <div class="card">
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-md-3">
                                <select class="form-select" id="calendarView">
                                    <option value="dayGridMonth">Vista Mensual</option>
                                    <option value="timeGridWeek">Vista Semanal</option>
                                    <option value="timeGridDay">Vista Diaria</option>
                                    <option value="listWeek">Lista Semanal</option>
                                </select>
                            </div>
                            <div class="col-md-3">
                                <select class="form-select" id="technicianFilter">
                                    <option value="">Todos los técnicos</option>
                                    <option value="jgarcia">Juan García</option>
                                    <option value="mrodriguez">María Rodríguez</option>
                                    <option value="clopez">Carlos López</option>
                                    <option value="amartinez">Ana Martínez</option>
                                    <option value="rmartinez">Roberto Martínez</option>
                                </select>
                            </div>
                            <div class="col-md-3">
                                <select class="form-select" id="resourceFilter">
                                    <option value="">Todos los recursos</option>
                                    <option value="auditorio">Auditorio</option>
                                    <option value="proyector">Proyectores</option>
                                    <option value="computadoras">Computadoras</option>
                                    <option value="redes">Equipos de Red</option>
                                </select>
                            </div>
                            <div class="col-md-3">
                                <div class="d-flex gap-2">
                                    <button class="btn btn-outline-primary flex-fill" id="todayBtn">Hoy</button>
                                    <button class="btn btn-outline-secondary flex-fill" id="clearFilters">Limpiar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Calendar Container -->
        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-body">
                        <div id="calendar"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Upcoming Events Sidebar -->
        <div class="row mt-4">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0">Próximos Eventos</h5>
                    </div>
                    <div class="card-body">
                        <div id="upcomingEvents" class="list-group list-group-flush">
                            <!-- Events will be populated by JavaScript -->
                            <div class="text-center text-muted py-4">
                                <i class="fas fa-calendar-check fa-3x mb-3"></i>
                                <p>Cargando próximos eventos...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0">Estadísticas del Mes</h5>
                    </div>
                    <div class="card-body">
                        <div class="row text-center">
                            <div class="col-6">
                                <div class="h4 text-primary mb-1" id="monthEvents">0</div>
                                <small class="text-muted">Eventos</small>
                            </div>
                            <div class="col-6">
                                <div class="h4 text-success mb-1" id="monthTasks">0</div>
                                <small class="text-muted">Tareas</small>
                            </div>
                        </div>
                        <hr>
                        <div class="row text-center">
                            <div class="col-6">
                                <div class="h4 text-info mb-1" id="activeTechnicians">0</div>
                                <small class="text-muted">Técnicos Activos</small>
                            </div>
                            <div class="col-6">
                                <div class="h4 text-warning mb-1" id="busyResources">0</div>
                                <small class="text-muted">Recursos Ocupados</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
', renderLogoutScript()); ?>

<!-- Add Event Modal -->
    <div class="modal fade" id="addEventModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">
                        <i class="fas fa-plus me-2"></i>Nuevo Evento
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="addEventForm">
                        <div class="row">
                            <div class="col-md-8">
                                <div class="mb-3">
                                    <label for="eventTitle" class="form-label">Título del Evento *</label>
                                    <input type="text" class="form-control" id="eventTitle" required>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="mb-3">
                                    <label for="eventType" class="form-label">Tipo *</label>
                                    <select class="form-select" id="eventType" required>
                                        <option value="">Seleccionar...</option>
                                        <option value="maintenance">Mantenimiento</option>
                                        <option value="event">Evento Especial</option>
                                        <option value="training">Capacitación</option>
                                        <option value="meeting">Reunión</option>
                                        <option value="other">Otro</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="eventDescription" class="form-label">Descripción</label>
                            <textarea class="form-control" id="eventDescription" rows="3"></textarea>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="eventStart" class="form-label">Fecha y Hora de Inicio *</label>
                                    <input type="datetime-local" class="form-control" id="eventStart" required>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="eventEnd" class="form-label">Fecha y Hora de Fin *</label>
                                    <input type="datetime-local" class="form-control" id="eventEnd" required>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="eventTechnician" class="form-label">Técnico Asignado *</label>
                                    <select class="form-select" id="eventTechnician" required>
                                        <option value="">Seleccionar técnico...</option>
                                        <option value="jgarcia">Juan García - Desarrollador</option>
                                        <option value="mrodriguez">María Rodríguez - Analista</option>
                                        <option value="clopez">Carlos López - Diseñador</option>
                                        <option value="amartinez">Ana Martínez - Tester</option>
                                        <option value="rmartinez">Roberto Martínez - Administrador</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="eventResource" class="form-label">Recurso Principal</label>
                                    <select class="form-select" id="eventResource">
                                        <option value="">Seleccionar recurso...</option>
                                        <option value="auditorio">Auditorio</option>
                                        <option value="proyector">Proyector Principal</option>
                                        <option value="computadoras">Sala de Computadoras</option>
                                        <option value="redes">Equipos de Red</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="eventReminders" class="form-label">Recordatorios</label>
                            <div class="row">
                                <div class="col-md-4">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="reminder1h" value="1h">
                                        <label class="form-check-label" for="reminder1h">
                                            1 hora antes
                                        </label>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="reminder30m" value="30m">
                                        <label class="form-check-label" for="reminder30m">
                                            30 min antes
                                        </label>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="reminder15m" value="15m">
                                        <label class="form-check-label" for="reminder15m">
                                            15 min antes
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Sub-tareas Dependientes</label>
                            <div id="subtasksContainer">
                                <div class="subtask-item mb-2 p-2 border rounded">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <input type="text" class="form-control form-control-sm" placeholder="Descripción de sub-tarea">
                                        </div>
                                        <div class="col-md-3">
                                            <input type="datetime-local" class="form-control form-control-sm" placeholder="Horario">
                                        </div>
                                        <div class="col-md-2">
                                            <select class="form-select form-select-sm">
                                                <option value="jgarcia">Juan G.</option>
                                                <option value="mrodriguez">María R.</option>
                                                <option value="clopez">Carlos L.</option>
                                            </select>
                                        </div>
                                        <div class="col-md-1">
                                            <button type="button" class="btn btn-outline-danger btn-sm remove-subtask">
                                                <i class="fas fa-times"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button type="button" class="btn btn-outline-secondary btn-sm" id="addSubtask">
                                <i class="fas fa-plus me-1"></i>Agregar Sub-tarea
                            </button>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-info" id="saveEventBtn">
                        <i class="fas fa-save me-2"></i>Guardar Evento
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Event Details Modal -->
    <div class="modal fade" id="eventDetailsModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">
                        <i class="fas fa-info-circle me-2"></i>Detalles del Evento
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body" id="eventDetailsContent">
                    <!-- Event details will be populated by JavaScript -->
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    <button type="button" class="btn btn-warning" id="editEventBtn">
                        <i class="fas fa-edit me-2"></i>Editar
                    </button>
                    <button type="button" class="btn btn-danger" id="deleteEventBtn">
                        <i class="fas fa-trash me-2"></i>Eliminar
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Footer -->
    <?php echo renderFooter(); ?>

    <!-- Bootstrap 5 JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>

    <!-- FullCalendar JS -->
    <script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.js"></script>

    <!-- Custom JavaScript -->
    <script src="../js/dashboard.js"></script>
    <script src="../js/calendar.js"></script>
</body>
</html>