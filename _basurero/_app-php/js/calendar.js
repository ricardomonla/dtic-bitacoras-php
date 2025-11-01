// Calendar functionality for DTIC Bitácoras
document.addEventListener('DOMContentLoaded', function() {
    console.log('📅 Inicializando Calendario Interactivo DTIC');

    let calendar;
    let currentEvents = [];

    // Initialize FullCalendar
    initializeCalendar();

    // Setup event listeners
    setupEventListeners();

    // Load initial data
    loadCalendarData();

    function initializeCalendar() {
        const calendarEl = document.getElementById('calendar');

        calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            locale: 'es',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
            },
            buttonText: {
                today: 'Hoy',
                month: 'Mes',
                week: 'Semana',
                day: 'Día',
                list: 'Lista'
            },
            height: 'auto',
            editable: true,
            selectable: true,
            selectMirror: true,
            dayMaxEvents: true,
            eventDisplay: 'block',
            eventTimeFormat: {
                hour: '2-digit',
                minute: '2-digit',
                meridiem: false
            },
            slotLabelFormat: {
                hour: '2-digit',
                minute: '2-digit',
                meridiem: false
            },
            nowIndicator: true,
            businessHours: {
                daysOfWeek: [1, 2, 3, 4, 5], // Monday - Friday
                startTime: '08:00',
                endTime: '18:00'
            },
            eventClick: function(info) {
                showEventDetails(info.event);
            },
            select: function(info) {
                openNewEventModal(info.start, info.end);
            },
            eventDrop: function(info) {
                updateEventTime(info.event);
            },
            eventResize: function(info) {
                updateEventTime(info.event);
            },
            datesSet: function(dateInfo) {
                updateMonthStatistics();
            }
        });

        calendar.render();
    }

    function setupEventListeners() {
        // View change
        document.getElementById('calendarView').addEventListener('change', function() {
            const view = this.value;
            calendar.changeView(view);
        });

        // Filters
        document.getElementById('technicianFilter').addEventListener('change', applyFilters);
        document.getElementById('resourceFilter').addEventListener('change', applyFilters);
        document.getElementById('clearFilters').addEventListener('click', clearFilters);
        document.getElementById('todayBtn').addEventListener('click', function() {
            calendar.today();
        });

        // Export
        document.getElementById('exportCalendar').addEventListener('click', exportCalendar);

        // Save event
        document.getElementById('saveEventBtn').addEventListener('click', saveEvent);

        // Add subtask
        document.getElementById('addSubtask').addEventListener('click', addSubtask);

        // Remove subtasks
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('remove-subtask')) {
                e.target.closest('.subtask-item').remove();
            }
        });
    }

    function loadCalendarData() {
        // Mock data - in production this would come from API
        const mockEvents = [
            {
                id: '1',
                title: 'Preparar los equipos en el Auditorio con música y proyector',
                start: '2025-10-15T14:00:00',
                end: '2025-10-15T16:00:00',
                backgroundColor: '#17a2b8',
                borderColor: '#17a2b8',
                textColor: '#ffffff',
                extendedProps: {
                    type: 'event',
                    technician: 'jgarcia',
                    technicianName: 'Juan García',
                    resource: 'auditorio',
                    resourceName: 'Auditorio',
                    description: 'Evento especial de capacitación técnica',
                    subtasks: [
                        {
                            title: 'Hacer pruebas de sonido y video 1 hora antes',
                            time: '2025-10-15T13:00:00',
                            technician: 'jgarcia'
                        },
                        {
                            title: 'Verificar conectividad de proyectores 30 minutos antes',
                            time: '2025-10-15T13:30:00',
                            technician: 'mrodriguez'
                        }
                    ],
                    reminders: ['1h', '30m']
                }
            },
            {
                id: '2',
                title: 'Mantenimiento preventivo de servidores',
                start: '2025-10-16T09:00:00',
                end: '2025-10-16T12:00:00',
                backgroundColor: '#28a745',
                borderColor: '#28a745',
                textColor: '#ffffff',
                extendedProps: {
                    type: 'maintenance',
                    technician: 'clopez',
                    technicianName: 'Carlos López',
                    resource: 'computadoras',
                    resourceName: 'Sala de Servidores',
                    description: 'Mantenimiento rutinario de equipos',
                    subtasks: [],
                    reminders: ['1h']
                }
            },
            {
                id: '3',
                title: 'Capacitación en ciberseguridad',
                start: '2025-10-18T10:00:00',
                end: '2025-10-18T12:00:00',
                backgroundColor: '#ffc107',
                borderColor: '#ffc107',
                textColor: '#000000',
                extendedProps: {
                    type: 'training',
                    technician: 'amartinez',
                    technicianName: 'Ana Martínez',
                    resource: 'auditorio',
                    resourceName: 'Auditorio',
                    description: 'Sesión de capacitación para todo el equipo',
                    subtasks: [],
                    reminders: ['1h', '15m']
                }
            },
            {
                id: '4',
                title: 'Reunión de coordinación semanal',
                start: '2025-10-17T08:30:00',
                end: '2025-10-17T09:30:00',
                backgroundColor: '#6c757d',
                borderColor: '#6c757d',
                textColor: '#ffffff',
                extendedProps: {
                    type: 'meeting',
                    technician: 'rmartinez',
                    technicianName: 'Roberto Martínez',
                    resource: 'auditorio',
                    resourceName: 'Sala de Reuniones',
                    description: 'Reunión semanal de coordinación del equipo DTIC',
                    subtasks: [],
                    reminders: ['15m']
                }
            }
        ];

        currentEvents = mockEvents;
        calendar.addEventSource(mockEvents);
        updateUpcomingEvents();
        updateMonthStatistics();
    }

    function applyFilters() {
        const technicianFilter = document.getElementById('technicianFilter').value;
        const resourceFilter = document.getElementById('resourceFilter').value;

        calendar.getEvents().forEach(event => {
            let show = true;

            if (technicianFilter && event.extendedProps.technician !== technicianFilter) {
                show = false;
            }

            if (resourceFilter && event.extendedProps.resource !== resourceFilter) {
                show = false;
            }

            if (show) {
                event.setProp('display', 'auto');
            } else {
                event.setProp('display', 'none');
            }
        });
    }

    function clearFilters() {
        document.getElementById('technicianFilter').value = '';
        document.getElementById('resourceFilter').value = '';
        calendar.getEvents().forEach(event => {
            event.setProp('display', 'auto');
        });
    }

    function showEventDetails(event) {
        const modal = new bootstrap.Modal(document.getElementById('eventDetailsModal'));
        const content = document.getElementById('eventDetailsContent');

        const eventTypeLabels = {
            'maintenance': 'Mantenimiento',
            'event': 'Evento Especial',
            'training': 'Capacitación',
            'meeting': 'Reunión',
            'other': 'Otro'
        };

        const startTime = event.start.toLocaleString('es-AR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const endTime = event.end ? event.end.toLocaleString('es-AR', {
            hour: '2-digit',
            minute: '2-digit'
        }) : '';

        let subtasksHtml = '';
        if (event.extendedProps.subtasks && event.extendedProps.subtasks.length > 0) {
            subtasksHtml = '<h6>Sub-tareas:</h6><ul class="list-group list-group-flush">';
            event.extendedProps.subtasks.forEach(subtask => {
                const subTime = new Date(subtask.time).toLocaleString('es-AR', {
                    hour: '2-digit',
                    minute: '2-digit'
                });
                subtasksHtml += `<li class="list-group-item">${subtask.title} - ${subTime} (${subtask.technician})</li>`;
            });
            subtasksHtml += '</ul>';
        }

        content.innerHTML = `
            <div class="row">
                <div class="col-md-8">
                    <h4>${event.title}</h4>
                    <p class="text-muted">${eventTypeLabels[event.extendedProps.type] || 'Evento'}</p>
                    <hr>
                    <p><strong>Fecha y Hora:</strong> ${startTime} - ${endTime}</p>
                    <p><strong>Técnico Asignado:</strong> ${event.extendedProps.technicianName}</p>
                    <p><strong>Recurso:</strong> ${event.extendedProps.resourceName}</p>
                    ${event.extendedProps.description ? `<p><strong>Descripción:</strong> ${event.extendedProps.description}</p>` : ''}
                    ${subtasksHtml}
                </div>
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-body text-center">
                            <i class="fas fa-clock fa-3x text-info mb-3"></i>
                            <h6>Próximo Recordatorio</h6>
                            <p class="mb-0">15 minutos antes</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        modal.show();
    }

    function openNewEventModal(start, end) {
        // Pre-fill start and end times
        document.getElementById('eventStart').value = formatDateTime(start);
        document.getElementById('eventEnd').value = formatDateTime(end);

        const modal = new bootstrap.Modal(document.getElementById('addEventModal'));
        modal.show();
    }

    function saveEvent() {
        const title = document.getElementById('eventTitle').value;
        const type = document.getElementById('eventType').value;
        const description = document.getElementById('eventDescription').value;
        const start = document.getElementById('eventStart').value;
        const end = document.getElementById('eventEnd').value;
        const technician = document.getElementById('eventTechnician').value;
        const resource = document.getElementById('eventResource').value;

        if (!title || !type || !start || !end || !technician) {
            showNotification('Por favor complete todos los campos requeridos', 'danger');
            return;
        }

        // Check for conflicts
        if (checkScheduleConflict(start, end, technician)) {
            if (!confirm('⚠️ Hay un conflicto de horario con otro evento. ¿Desea continuar de todos modos?')) {
                return;
            }
        }

        // Collect subtasks
        const subtasks = [];
        document.querySelectorAll('.subtask-item').forEach(item => {
            const inputs = item.querySelectorAll('input, select');
            if (inputs[0].value) {
                subtasks.push({
                    title: inputs[0].value,
                    time: inputs[1].value,
                    technician: inputs[2].value
                });
            }
        });

        // Collect reminders
        const reminders = [];
        ['reminder1h', 'reminder30m', 'reminder15m'].forEach(id => {
            if (document.getElementById(id).checked) {
                reminders.push(document.getElementById(id).value);
            }
        });

        const newEvent = {
            id: Date.now().toString(),
            title: title,
            start: start,
            end: end,
            backgroundColor: getEventColor(type),
            borderColor: getEventColor(type),
            textColor: '#ffffff',
            extendedProps: {
                type: type,
                technician: technician,
                technicianName: getTechnicianName(technician),
                resource: resource,
                resourceName: getResourceName(resource),
                description: description,
                subtasks: subtasks,
                reminders: reminders
            }
        };

        calendar.addEvent(newEvent);
        currentEvents.push(newEvent);

        // Close modal and reset form
        const modal = bootstrap.Modal.getInstance(document.getElementById('addEventModal'));
        modal.hide();
        document.getElementById('addEventForm').reset();

        // Clear subtasks
        document.getElementById('subtasksContainer').innerHTML = '';

        updateUpcomingEvents();
        updateMonthStatistics();
        showNotification('✅ Evento creado exitosamente', 'success');
    }

    function checkScheduleConflict(startTime, endTime, technician) {
        const start = new Date(startTime);
        const end = new Date(endTime);

        return calendar.getEvents().some(event => {
            if (event.extendedProps.technician !== technician) return false;

            const eventStart = event.start;
            const eventEnd = event.end || eventStart;

            return (start < eventEnd && end > eventStart);
        });
    }

    function updateEventTime(event) {
        // In production, this would update the backend
        console.log('Event time updated:', event.id, event.start, event.end);
        showNotification('✅ Evento actualizado', 'success');
    }

    function updateUpcomingEvents() {
        const upcomingContainer = document.getElementById('upcomingEvents');
        const now = new Date();
        const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

        const upcoming = calendar.getEvents().filter(event => {
            return event.start >= now && event.start <= nextWeek;
        }).sort((a, b) => a.start - b.start).slice(0, 5);

        if (upcoming.length === 0) {
            upcomingContainer.innerHTML = `
                <div class="text-center text-muted py-4">
                    <i class="fas fa-calendar-check fa-3x mb-3"></i>
                    <p>No hay eventos próximos programados</p>
                </div>
            `;
            return;
        }

        let html = '';
        upcoming.forEach(event => {
            const time = event.start.toLocaleString('es-AR', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            html += `
                <div class="list-group-item">
                    <div class="d-flex w-100 justify-content-between">
                        <h6 class="mb-1">${event.title}</h6>
                        <small class="text-muted">${time}</small>
                    </div>
                    <p class="mb-1">${event.extendedProps.technicianName}</p>
                    <small class="text-muted">${event.extendedProps.resourceName}</small>
                </div>
            `;
        });

        upcomingContainer.innerHTML = html;
    }

    function updateMonthStatistics() {
        const view = calendar.view;
        const start = view.activeStart;
        const end = view.activeEnd;

        const monthEvents = calendar.getEvents().filter(event => {
            return event.start >= start && event.start < end;
        });

        const technicians = new Set();
        const resources = new Set();

        monthEvents.forEach(event => {
            technicians.add(event.extendedProps.technician);
            if (event.extendedProps.resource) {
                resources.add(event.extendedProps.resource);
            }
        });

        document.getElementById('monthEvents').textContent = monthEvents.length;
        document.getElementById('monthTasks').textContent = monthEvents.reduce((sum, event) => {
            return sum + (event.extendedProps.subtasks ? event.extendedProps.subtasks.length : 0);
        }, 0);
        document.getElementById('activeTechnicians').textContent = technicians.size;
        document.getElementById('busyResources').textContent = resources.size;
    }

    function addSubtask() {
        const container = document.getElementById('subtasksContainer');
        const subtaskHtml = `
            <div class="subtask-item mb-2 p-2 border rounded">
                <div class="row">
                    <div class="col-md-6">
                        <input type="text" class="form-control form-control-sm" placeholder="Descripción de sub-tarea">
                    </div>
                    <div class="col-md-3">
                        <input type="datetime-local" class="form-control form-control-sm">
                    </div>
                    <div class="col-md-2">
                        <select class="form-select form-select-sm">
                            <option value="jgarcia">Juan G.</option>
                            <option value="mrodriguez">María R.</option>
                            <option value="clopez">Carlos L.</option>
                            <option value="amartinez">Ana M.</option>
                            <option value="rmartinez">Roberto M.</option>
                        </select>
                    </div>
                    <div class="col-md-1">
                        <button type="button" class="btn btn-outline-danger btn-sm remove-subtask">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', subtaskHtml);
    }

    function exportCalendar() {
        // Mock export functionality
        const events = calendar.getEvents();
        const csvContent = generateCSV(events);

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'calendario_dtic.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showNotification('✅ Calendario exportado exitosamente', 'success');
    }

    function generateCSV(events) {
        let csv = 'Título,Inicio,Fin,Técnico,Recurso,Tipo,Descripción\n';

        events.forEach(event => {
            const start = event.start.toISOString();
            const end = event.end ? event.end.toISOString() : '';
            const technician = event.extendedProps.technicianName || '';
            const resource = event.extendedProps.resourceName || '';
            const type = event.extendedProps.type || '';
            const description = event.extendedProps.description || '';

            csv += `"${event.title}","${start}","${end}","${technician}","${resource}","${type}","${description}"\n`;
        });

        return csv;
    }

    // Utility functions
    function formatDateTime(date) {
        return date.toISOString().slice(0, 16);
    }

    function getEventColor(type) {
        const colors = {
            'maintenance': '#28a745',
            'event': '#17a2b8',
            'training': '#ffc107',
            'meeting': '#6c757d',
            'other': '#6f42c1'
        };
        return colors[type] || '#6f42c1';
    }

    function getTechnicianName(id) {
        const names = {
            'jgarcia': 'Juan García',
            'mrodriguez': 'María Rodríguez',
            'clopez': 'Carlos López',
            'amartinez': 'Ana Martínez',
            'rmartinez': 'Roberto Martínez'
        };
        return names[id] || id;
    }

    function getResourceName(id) {
        const names = {
            'auditorio': 'Auditorio',
            'proyector': 'Proyector Principal',
            'computadoras': 'Sala de Computadoras',
            'redes': 'Equipos de Red'
        };
        return names[id] || id;
    }

    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = `
            top: 20px;
            right: 20px;
            z-index: 9999;
            min-width: 300px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        `;

        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
});