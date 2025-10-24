/**
 * DTIC Bitácoras - Dashboard JavaScript
 * Lógica básica del dashboard para la Etapa 2
 */

// Clase principal del Dashboard
class Dashboard {
    constructor() {
        this.init();
    }

    init() {
        // Inicializar componentes cuando el DOM esté listo
        document.addEventListener('DOMContentLoaded', () => {
            this.initializeComponents();
            this.setupEventListeners();
            this.updateDateTime();
            this.startClock();
            this.showWelcomeMessage();
            this.loadUpcomingEvents();
            this.loadRecentActivity();
        });
    }

    // Upcoming Events functionality
    loadUpcomingEvents() {
        const upcomingContainer = document.getElementById('dashboard-upcoming-events');
        if (!upcomingContainer) return;

        // Mock upcoming events - in production this would come from API
        const upcomingEvents = [
            {
                title: 'Preparar los equipos en el Auditorio con música y proyector',
                time: '2025-10-15T14:00:00',
                type: 'event',
                technician: 'Juan García',
                resource: 'Auditorio',
                description: 'Evento especial de capacitación técnica con equipos audiovisuales'
            },
            {
                title: 'Mantenimiento preventivo de servidores',
                time: '2025-10-16T09:00:00',
                type: 'maintenance',
                technician: 'Carlos López',
                resource: 'Sala de Servidores',
                description: 'Revisión rutinaria de equipos y actualización de firmware'
            },
            {
                title: 'Capacitación en ciberseguridad',
                time: '2025-10-18T10:00:00',
                type: 'training',
                technician: 'Ana Martínez',
                resource: 'Auditorio',
                description: 'Sesión de formación para todo el equipo técnico'
            },
            {
                title: 'Reunión de coordinación semanal',
                time: '2025-10-17T08:30:00',
                type: 'meeting',
                technician: 'Roberto Martínez',
                resource: 'Sala de Reuniones',
                description: 'Revisión de proyectos en curso y planificación semanal'
            },
            {
                title: 'Configurar red WiFi en el laboratorio',
                time: '2025-10-19T13:00:00',
                type: 'maintenance',
                technician: 'María Rodríguez',
                resource: 'Laboratorio de Redes',
                description: 'Instalación y configuración de puntos de acceso inalámbricos'
            },
            {
                title: 'Actualización de software antivirus',
                time: '2025-10-20T11:00:00',
                type: 'maintenance',
                technician: 'Carlos López',
                resource: 'Todos los equipos',
                description: 'Actualización masiva de definiciones y escaneo completo'
            },
            {
                title: 'Instalación de cámaras de seguridad',
                time: '2025-10-21T08:00:00',
                type: 'maintenance',
                technician: 'Juan García',
                resource: 'Edificio Principal',
                description: 'Montaje y configuración de sistema de videovigilancia'
            },
            {
                title: 'Backup de base de datos mensual',
                time: '2025-10-22T02:00:00',
                type: 'maintenance',
                technician: 'Ana Martínez',
                resource: 'Servidores de BD',
                description: 'Respaldo completo de todas las bases de datos críticas'
            },
            {
                title: 'Taller de desarrollo web moderno',
                time: '2025-10-23T09:00:00',
                type: 'training',
                technician: 'María Rodríguez',
                resource: 'Sala de Capacitación',
                description: 'Introducción a frameworks JavaScript modernos'
            },
            {
                title: 'Auditoría de seguridad de red',
                time: '2025-10-24T14:30:00',
                type: 'maintenance',
                technician: 'Roberto Martínez',
                resource: 'Red Corporativa',
                description: 'Revisión completa de vulnerabilidades y configuraciones'
            },
            {
                title: 'Mantenimiento de aire acondicionado',
                time: '2025-10-25T07:00:00',
                type: 'maintenance',
                technician: 'Carlos López',
                resource: 'Data Center',
                description: 'Limpieza y verificación de sistemas de climatización'
            },
            {
                title: 'Evaluación de proveedores tecnológicos',
                time: '2025-10-26T10:00:00',
                type: 'meeting',
                technician: 'Roberto Martínez',
                resource: 'Sala de Juntas',
                description: 'Revisión de propuestas y negociación de contratos'
            }
        ];

        if (upcomingEvents.length === 0) {
            upcomingContainer.innerHTML = `
                <div class="text-center text-muted py-3">
                    <i class="fas fa-calendar-alt fa-2x mb-2"></i>
                    <p class="mb-1">No hay eventos próximos</p>
                    <small>Los próximos eventos aparecerán aquí</small>
                </div>
            `;
            return;
        }

        let html = '';
        upcomingEvents.slice(0, 6).forEach(event => {
            const eventDate = new Date(event.time);
            const timeString = eventDate.toLocaleString('es-AR', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            const typeClass = `event-${event.type}`;
            const typeIcon = this.getEventTypeIcon(event.type);

            html += `
                <div class="dashboard-upcoming-event ${typeClass}">
                    <div class="event-title">
                        <i class="${typeIcon} me-2"></i>${event.title}
                    </div>
                    <div class="event-time">${timeString}</div>
                    <div class="event-details">
                        <small><strong>${event.technician}</strong> • ${event.resource}</small>
                    </div>
                </div>
            `;
        });

        upcomingContainer.innerHTML = html;
    }

        getEventTypeIcon(type) {
        const icons = {
            'maintenance': 'fas fa-wrench',
            'event': 'fas fa-calendar-star',
            'training': 'fas fa-graduation-cap',
            'meeting': 'fas fa-users'
        };
        return icons[type] || 'fas fa-calendar';
    }

    initializeComponents() {
        // Referencias a elementos del DOM
        this.elements = {
            currentDate: document.getElementById('current-date'),
            currentTime: document.getElementById('current-time'),
            systemStatus: document.getElementById('system-status'),
            activeUsers: document.getElementById('active-users'),
            pendingTasks: document.getElementById('pending-tasks'),
            inProgressTasks: document.getElementById('in-progress-tasks'),
            completedTasks: document.getElementById('completed-tasks'),
            cancelledTasks: document.getElementById('cancelled-tasks'),
            recentActivity: document.getElementById('recent-activity'),
            navLinks: document.querySelectorAll('.nav-link'),
            navbar: document.querySelector('.navbar')
        };

        // Inicializar auto-hide navbar
        this.initializeAutoHideNavbar();
    }

    setupEventListeners() {
        // Event listeners para navegación - Solo para enlaces que no tienen href funcional
        this.elements.navLinks.forEach(link => {
            // Solo agregar event listener si el enlace no tiene un href válido
            if (!link.getAttribute('href') || link.getAttribute('href') === '#') {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.handleNavigation(e.target.id);
                });
            }
            // Si tiene href, dejar que funcione normalmente
        });

        // Event listeners para botones (deshabilitados por ahora)
        const buttons = ['btn-new-task', 'btn-new-resource', 'btn-reports', 'btn-settings'];
        buttons.forEach(btnId => {
            const button = document.getElementById(btnId);
            if (button) {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.showComingSoonMessage(btnId);
                });
            }
        });
    }

    updateDateTime() {
        const now = new Date();

        // Formatear fecha en español
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        const formattedDate = now.toLocaleDateString('es-ES', options);

        if (this.elements.currentDate) {
            this.elements.currentDate.textContent = formattedDate;
        }

        // Formatear hora
        const timeString = now.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        if (this.elements.currentTime) {
            this.elements.currentTime.textContent = timeString;
        }
    }

    startClock() {
        // Actualizar reloj cada segundo
        setInterval(() => {
            this.updateDateTime();
        }, 1000);
    }

    handleNavigation(navId) {
        // Remover clase active de todos los links
        this.elements.navLinks.forEach(link => {
            link.classList.remove('active');
        });

        // Agregar clase active al link clickeado
        const clickedLink = document.getElementById(navId);
        if (clickedLink) {
            clickedLink.classList.add('active');
        }

        // Mostrar mensaje según la sección
        const messages = {
            'nav-dashboard': '📊 Mostrando Dashboard principal',
            'nav-project-status': '📋 Estado del Proyecto - Información actualizada',
            'nav-tasks': '📋 Gestión de Tareas - Disponible en Etapa 3',
            'nav-resources': '📦 Gestión de Recursos - Disponible en Etapa 3',
            'nav-users': '👥 Gestión de Usuarios - Disponible en Etapa 3',
            'nav-reports': '📈 Reportes y Estadísticas - Disponible en Etapa 4'
        };

        const message = messages[navId] || 'Sección seleccionada';
        this.showNotification(message, navId.includes('dashboard') || navId.includes('project-status') ? 'success' : 'info');
    }

    showWelcomeMessage() {
        // Solo mostrar el mensaje de bienvenida una vez por sesión
        if (!sessionStorage.getItem('welcomeShown')) {
            setTimeout(() => {
                this.showNotification('🎉 ¡Bienvenido al Dashboard DTIC Bitácoras!', 'success');
                sessionStorage.setItem('welcomeShown', 'true');
            }, 1000);
        }
    }

    showComingSoonMessage(btnId) {
        const messages = {
            'btn-new-task': '📝 Crear nueva tarea - Disponible en Etapa 3',
            'btn-new-resource': '📦 Agregar nuevo recurso - Disponible en Etapa 3',
            'btn-reports': '📊 Ver reportes - Disponible en Etapa 4',
            'btn-settings': '⚙️ Configuración del sistema - Disponible en Etapa 5'
        };

        const message = messages[btnId] || 'Funcionalidad próximamente disponible';
        this.showNotification(message, 'info');
    }

    showNotification(message, type = 'info') {
        // Crear elemento de notificación
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

        // Agregar al body
        document.body.appendChild(notification);

        // Auto-remover después de 5 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    // Método para actualizar estadísticas (se usará en etapas posteriores)
    updateStatistics(stats) {
        if (stats) {
            this.elements.pendingTasks.textContent = stats.pending || 0;
            this.elements.inProgressTasks.textContent = stats.inProgress || 0;
            this.elements.completedTasks.textContent = stats.completed || 0;
            this.elements.cancelledTasks.textContent = stats.cancelled || 0;
        }
    }

    // Método para cargar actividad reciente con datos de ejemplo
    loadRecentActivity() {
        // Verificar que los elementos estén inicializados antes de continuar
        if (!this.elements || !this.elements.recentActivity) {
            // Reintentar después de un breve delay
            setTimeout(() => this.loadRecentActivity(), 100);
            return;
        }

        const recentActivities = [
            {
                timestamp: '2025-10-22 14:30',
                title: 'Mantenimiento completado',
                description: 'Actualización de firmware en servidores principales',
                type: 'maintenance'
            },
            {
                timestamp: '2025-10-22 11:15',
                title: 'Nueva tarea asignada',
                description: 'Configuración de red WiFi en laboratorio de redes',
                type: 'task'
            },
            {
                timestamp: '2025-10-22 09:45',
                title: 'Usuario registrado',
                description: 'Nuevo técnico agregado al sistema: María Rodríguez',
                type: 'user'
            },
            {
                timestamp: '2025-10-21 16:20',
                title: 'Capacitación finalizada',
                description: 'Sesión de ciberseguridad completada exitosamente',
                type: 'training'
            },
            {
                timestamp: '2025-10-21 14:00',
                title: 'Sistema actualizado',
                description: 'Backup automático de base de datos completado',
                type: 'system'
            },
            {
                timestamp: '2025-10-21 10:30',
                title: 'Reunión programada',
                description: 'Coordinación semanal del equipo técnico',
                type: 'meeting'
            }
        ];

        this.updateRecentActivity(recentActivities);
    }

    // Método para actualizar actividad reciente (se usará en etapas posteriores)
    updateRecentActivity(activities) {
        if (this.elements.recentActivity && activities && activities.length > 0) {
            const activityHtml = activities.map(activity => {
                const typeIcon = this.getActivityTypeIcon(activity.type);
                const typeClass = `activity-${activity.type}`;
                return `
                    <div class="activity-item mb-2 p-2 border-start border-primary border-3 ${typeClass}">
                        <div class="d-flex align-items-start">
                            <i class="${typeIcon} me-2 mt-1"></i>
                            <div class="flex-grow-1">
                                <small class="text-muted">${activity.timestamp}</small>
                                <div class="fw-bold">${activity.title}</div>
                                <small>${activity.description}</small>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');

            this.elements.recentActivity.innerHTML = activityHtml;
        }
    }

    // Método para obtener ícono según tipo de actividad
    getActivityTypeIcon(type) {
        const icons = {
            'maintenance': 'fas fa-wrench',
            'task': 'fas fa-tasks',
            'user': 'fas fa-user-plus',
            'training': 'fas fa-graduation-cap',
            'system': 'fas fa-server',
            'meeting': 'fas fa-users'
        };
        return icons[type] || 'fas fa-info-circle';
    }

    // Método para verificar estado del sistema
    checkSystemStatus() {
        // Simular verificación de conectividad
        fetch(window.location.href, { method: 'HEAD' })
            .then(response => {
                if (response.ok) {
                    this.elements.systemStatus.innerHTML = '<i class="fas fa-circle text-success me-1"></i>Online';
                } else {
                    this.elements.systemStatus.innerHTML = '<i class="fas fa-circle text-warning me-1"></i>Degradado';
                }
            })
            .catch(() => {
                this.elements.systemStatus.innerHTML = '<i class="fas fa-circle text-danger me-1"></i>Offline';
            });
    }

    // Método para inicializar el auto-hide del navbar
    initializeAutoHideNavbar() {
        if (!this.elements.navbar) return;

        let lastScrollTop = 0;
        let isNavbarHidden = false;
        const navbarHeight = this.elements.navbar.offsetHeight;
        const hideThreshold = 100; // Píxeles de scroll antes de ocultar
        const showThreshold = 50; // Altura desde arriba para mostrar

        // Función para ocultar el navbar
        const hideNavbar = () => {
            if (!isNavbarHidden) {
                this.elements.navbar.style.transform = `translateY(-${navbarHeight}px)`;
                this.elements.navbar.style.transition = 'transform 0.3s ease-in-out';
                isNavbarHidden = true;
            }
        };

        // Función para mostrar el navbar
        const showNavbar = () => {
            if (isNavbarHidden) {
                this.elements.navbar.style.transform = 'translateY(0)';
                isNavbarHidden = false;
            }
        };

        // Event listener para scroll
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            // Si estamos scrolleando hacia abajo y pasamos el threshold, ocultar navbar
            if (scrollTop > lastScrollTop && scrollTop > hideThreshold) {
                hideNavbar();
            }
            // Si estamos scrolleando hacia arriba, mostrar navbar
            else if (scrollTop < lastScrollTop) {
                showNavbar();
            }

            lastScrollTop = scrollTop;
        });

        // Event listener para mouse en la parte superior
        let mouseInTopArea = false;
        window.addEventListener('mousemove', (e) => {
            const mouseY = e.clientY;

            // Si el mouse está en la parte superior (primeros 100px) y el navbar está oculto
            if (mouseY <= showThreshold && isNavbarHidden) {
                if (!mouseInTopArea) {
                    mouseInTopArea = true;
                    showNavbar();
                }
            } else {
                mouseInTopArea = false;
            }
        });

        // También mostrar navbar cuando el mouse sale de la ventana (para evitar que quede oculto)
        document.addEventListener('mouseleave', () => {
            mouseInTopArea = false;
        });

        // Auto-hide navbar inicializado
    }
}

// Inicializar dashboard cuando se carga la página
const dashboard = new Dashboard();

// Verificar estado del sistema cada 30 segundos
setInterval(() => {
    dashboard.checkSystemStatus();
}, 30000);



// Exportar clase para uso futuro
window.Dashboard = Dashboard;