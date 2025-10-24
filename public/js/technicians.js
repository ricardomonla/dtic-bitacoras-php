/**
 * JavaScript para la gestión de técnicos
 * DTIC Bitácoras - Sistema de gestión de recursos y tareas
 */

class TechniciansManager {
    constructor() {
        this.apiUrl = '/api/technicians.php';
        this.currentPage = 1;
        this.pageSize = 12;
        this.currentFilters = {};

        this.init();
    }

    init() {
        this.bindEvents();
        this.loadTechnicians();
        this.loadStatistics();
    }

    bindEvents() {
        // Filtros
        document.getElementById('searchUsers')?.addEventListener('input', (e) => {
            this.currentFilters.search = e.target.value;
            this.loadTechnicians();
        });

        document.getElementById('filterRole')?.addEventListener('change', (e) => {
            this.currentFilters.role = e.target.value;
            this.loadTechnicians();
        });

        document.getElementById('filterStatus')?.addEventListener('change', (e) => {
            this.currentFilters.status = e.target.value;
            this.loadTechnicians();
        });

        document.getElementById('filterDepartment')?.addEventListener('change', (e) => {
            this.currentFilters.department = e.target.value;
            this.loadTechnicians();
        });

        document.getElementById('clearFilters')?.addEventListener('click', () => {
            this.clearFilters();
        });

        // Vista (cards/table)
        document.getElementById('cardView')?.addEventListener('change', (e) => {
            if (e.target.checked) {
                this.toggleView('cards');
            }
        });

        document.getElementById('tableView')?.addEventListener('change', (e) => {
            if (e.target.checked) {
                this.toggleView('table');
            }
        });

        // Crear técnico
        document.getElementById('saveUserBtn')?.addEventListener('click', () => {
            this.createTechnician();
        });

        // Paginación
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('page-link')) {
                e.preventDefault();
                const page = parseInt(e.target.dataset.page);
                if (page) {
                    this.currentPage = page;
                    this.loadTechnicians();
                }
            }
        });
    }

    async loadTechnicians() {
        try {
            this.showLoading();

            const params = new URLSearchParams({
                page: this.currentPage,
                limit: this.pageSize,
                ...this.currentFilters
            });

            const response = await fetch(`${this.apiUrl}?${params}`, {
                method: 'GET',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            console.log('API Response:', data); // Debug log

            if (data.success) {
                console.log('Technicians data:', data.data.technicians); // Debug log
                this.renderTechnicians(data.data.technicians);
                this.renderPagination(data.data.pagination);
            } else {
                this.showError(data.message || 'Error al cargar técnicos');
            }
        } catch (error) {
            console.error('Error loading technicians:', error);
            this.showError('Error de conexión al cargar técnicos');
        } finally {
            this.hideLoading();
        }
    }

    async loadStatistics() {
        try {
            // Para estadísticas, podríamos hacer una llamada específica o calcular desde los datos
            const response = await fetch(`${this.apiUrl}?page=1&limit=1000`, {
                method: 'GET',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (data.success) {
                this.updateStatistics(data.data.technicians);
            }
        } catch (error) {
            console.error('Error loading statistics:', error);
        }
    }

    updateStatistics(technicians) {
        const total = technicians.length;
        const active = technicians.filter(t => t.is_active == 1).length;
        const inactive = total - active;
        const admins = technicians.filter(t => t.role === 'admin').length;

        document.getElementById('totalUsers').textContent = total;
        document.getElementById('activeUsers').textContent = active;
        document.getElementById('inactiveUsers').textContent = inactive;
        document.getElementById('adminUsers').textContent = admins;
    }

    renderTechnicians(technicians) {
        const cardContainer = document.getElementById('cardViewContainer');
        const tableContainer = document.getElementById('tableViewContainer');

        if (!cardContainer || !tableContainer) {
            console.error('Containers not found:', { cardContainer, tableContainer });
            return;
        }

        console.log('Rendering technicians:', technicians.length); // Debug log

        // Render cards
        const cardsHtml = technicians.map(tech => {
            console.log('Creating card for technician:', tech.id, tech.profile_image); // Debug log
            return this.createTechnicianCard(tech);
        }).join('');
        cardContainer.innerHTML = cardsHtml;

        // Render table
        const tableBody = tableContainer.querySelector('tbody');
        if (tableBody) {
            tableBody.innerHTML = technicians.map(tech => this.createTechnicianRow(tech)).join('');
        }

        // Bind events for action buttons
        this.bindActionButtons();
    }

    createTechnicianCard(technician) {
        const roleColors = {
            'admin': 'danger',
            'technician': 'info',
            'viewer': 'secondary'
        };

        const statusBadge = technician.is_active == 1
            ? '<span class="badge bg-success">Activo</span>'
            : '<span class="badge bg-warning">Inactivo</span>';

        const roleIcon = technician.role === 'admin' ? 'user-shield' : 'user-cog';
        const profileImage = technician.profile_image ?
            `<img src="${technician.profile_image}?t=${Date.now()}" class="rounded-circle me-3" style="width: 40px; height: 40px; object-fit: cover; border: 2px solid #dee2e6;" alt="Foto de perfil de ${technician.full_name}">` :
            `<div class="avatar-circle bg-white text-${roleColors[technician.role]} me-3" style="width: 40px; height: 40px; font-size: 1.2rem;">
                <i class="fas fa-${roleIcon}"></i>
            </div>`;

        return `
            <div class="col-md-6 col-lg-4 mb-3" data-technician-id="${technician.id}">
                <div class="card h-100">
                    <div class="card-header bg-${roleColors[technician.role]} text-white">
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="d-flex align-items-center">
                                ${profileImage}
                                <div>
                                    <h6 class="mb-0">${technician.full_name}</h6>
                                    <small>${this.formatRole(technician.role)}</small>
                                </div>
                            </div>
                            ${statusBadge}
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-12">
                                <p class="mb-2"><strong>ID DTIC:</strong> ${technician.dtic_id}</p>
                                <p class="mb-2"><strong>Email:</strong> ${technician.email}</p>
                                <p class="mb-2"><strong>Departamento:</strong> ${this.formatDepartment(technician.department)}</p>
                                <p class="mb-2"><strong>Teléfono:</strong> ${technician.phone || 'No especificado'}</p>
                                <p class="mb-2"><strong>Tareas activas:</strong> ${technician.active_tasks || 0}</p>
                                <p class="mb-0"><strong>Registro:</strong> ${this.formatDate(technician.created_at)}</p>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer">
                        <div class="btn-group w-100" role="group">
                            <button class="btn btn-outline-primary btn-sm" title="Ver Perfil" data-action="view" data-id="${technician.id}">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn btn-outline-warning btn-sm" title="Editar" data-action="edit" data-id="${technician.id}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-outline-info btn-sm" title="Permisos" data-action="permissions" data-id="${technician.id}">
                                <i class="fas fa-key"></i>
                            </button>
                            <button class="btn btn-outline-${technician.is_active == 1 ? 'danger' : 'success'} btn-sm" title="${technician.is_active == 1 ? 'Desactivar' : 'Reactivar'}" data-action="${technician.is_active == 1 ? 'deactivate' : 'activate'}" data-id="${technician.id}">
                                <i class="fas fa-${technician.is_active == 1 ? 'ban' : 'check'}"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    createTechnicianRow(technician) {
        const roleBadge = this.getRoleBadge(technician.role);
        const statusBadge = technician.is_active == 1
            ? '<span class="badge bg-success">Activo</span>'
            : '<span class="badge bg-warning">Inactivo</span>';

        return `
            <tr data-technician-id="${technician.id}">
                <td>${technician.full_name}</td>
                <td>${technician.email}</td>
                <td>${roleBadge}</td>
                <td>${this.formatDepartment(technician.department)}</td>
                <td>${statusBadge}</td>
                <td>${this.formatDate(technician.updated_at)}</td>
                <td>
                    <div class="btn-group" role="group">
                        <button class="btn btn-outline-primary btn-sm" title="Ver" data-action="view" data-id="${technician.id}">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-outline-warning btn-sm" title="Editar" data-action="edit" data-id="${technician.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-outline-${technician.is_active == 1 ? 'danger' : 'success'} btn-sm" title="${technician.is_active == 1 ? 'Desactivar' : 'Reactivar'}" data-action="${technician.is_active == 1 ? 'deactivate' : 'activate'}" data-id="${technician.id}">
                            <i class="fas fa-${technician.is_active == 1 ? 'ban' : 'check'}"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }

    renderPagination(pagination) {
        const paginationContainer = document.querySelector('.pagination');
        if (!paginationContainer) return;

        let paginationHtml = '';

        if (pagination.pages > 1) {
            paginationHtml = '<nav><ul class="pagination justify-content-center">';

            // Anterior
            if (pagination.page > 1) {
                paginationHtml += `<li class="page-item"><a class="page-link" href="#" data-page="${pagination.page - 1}">Anterior</a></li>`;
            }

            // Páginas
            for (let i = Math.max(1, pagination.page - 2); i <= Math.min(pagination.pages, pagination.page + 2); i++) {
                paginationHtml += `<li class="page-item ${i === pagination.page ? 'active' : ''}"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
            }

            // Siguiente
            if (pagination.page < pagination.pages) {
                paginationHtml += `<li class="page-item"><a class="page-link" href="#" data-page="${pagination.page + 1}">Siguiente</a></li>`;
            }

            paginationHtml += '</ul></nav>';
        }

        paginationContainer.innerHTML = paginationHtml;
    }

    bindActionButtons() {
        document.querySelectorAll('[data-action]').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const action = e.currentTarget.dataset.action;
                const id = e.currentTarget.dataset.id;

                switch (action) {
                    case 'view':
                        this.viewTechnician(id);
                        break;
                    case 'edit':
                        this.editTechnician(id);
                        break;
                    case 'deactivate':
                        this.toggleTechnicianStatus(id, 0);
                        break;
                    case 'activate':
                        this.toggleTechnicianStatus(id, 1);
                        break;
                    case 'permissions':
                        this.showPermissions(id);
                        break;
                }
            });
        });
    }

    async createTechnician() {
        const formData = {
            first_name: document.getElementById('userFirstName').value.trim(),
            last_name: document.getElementById('userLastName').value.trim(),
            email: document.getElementById('userEmail').value.trim(),
            role: document.getElementById('userRole').value,
            department: document.getElementById('userDepartment').value,
            phone: document.getElementById('userPhone').value.trim()
        };

        // Validación básica
        if (!formData.first_name || !formData.last_name || !formData.email || !formData.role || !formData.department) {
            this.showNotification('Por favor complete todos los campos requeridos', 'danger');
            return;
        }

        try {
            this.showLoading();

            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                this.showNotification('Técnico creado exitosamente', 'success');

                // Cerrar modal y resetear formulario
                const modal = bootstrap.Modal.getInstance(document.getElementById('addUserModal'));
                modal.hide();
                document.getElementById('addUserForm').reset();

                // Recargar lista
                this.loadTechnicians();
                this.loadStatistics();
            } else {
                this.showNotification(data.message || 'Error al crear técnico', 'danger');
            }
        } catch (error) {
            console.error('Error creating technician:', error);
            this.showNotification('Error de conexión', 'danger');
        } finally {
            this.hideLoading();
        }
    }

    async toggleTechnicianStatus(id, isActive) {
        const action = isActive ? 'reactivar' : 'desactivar';
        if (!confirm(`¿Está seguro de ${action} este técnico?`)) {
            return;
        }

        try {
            this.showLoading();

            const response = await fetch(`${this.apiUrl}?id=${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({ is_active: isActive })
            });

            const data = await response.json();

            if (data.success) {
                this.showNotification(`Técnico ${action}do exitosamente`, 'success');
                this.loadTechnicians();
                this.loadStatistics();
            } else {
                this.showNotification(data.message || `Error al ${action} técnico`, 'danger');
            }
        } catch (error) {
            console.error('Error toggling technician status:', error);
            this.showNotification('Error de conexión', 'danger');
        } finally {
            this.hideLoading();
        }
    }

    async viewTechnician(id) {
        try {
            this.showLoading();

            const response = await fetch(`${this.apiUrl}?id=${id}`, {
                method: 'GET',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (data.success) {
                this.showTechnicianProfile(data.data.technician);
            } else {
                this.showNotification(data.message || 'Error al obtener técnico', 'danger');
            }
        } catch (error) {
            console.error('Error viewing technician:', error);
            this.showNotification('Error de conexión', 'danger');
        } finally {
            this.hideLoading();
        }
    }

    showTechnicianProfile(technician) {
        // Crear modal de perfil
        const modalHtml = `
            <div class="modal fade" id="technicianProfileModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">
                                <i class="fas fa-user me-2"></i>Perfil de ${technician.first_name} ${technician.last_name}
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-md-4 text-center">
                                    ${technician.profile_image ?
                                        `<img src="${technician.profile_image}" class="rounded-circle mx-auto mb-3" style="width: 80px; height: 80px; object-fit: cover; border: 3px solid #dee2e6;">` :
                                        `<div class="avatar-circle bg-${technician.role === 'admin' ? 'danger' : 'info'} text-white mx-auto mb-3" style="width: 80px; height: 80px; font-size: 2rem;">
                                            <i class="fas fa-${technician.role === 'admin' ? 'user-shield' : 'user-cog'}"></i>
                                        </div>`
                                    }
                                    <span class="badge bg-${technician.role === 'admin' ? 'danger' : technician.role === 'technician' ? 'info' : 'secondary'} mb-2">${this.formatRole(technician.role)}</span>
                                    <div>
                                        <span class="badge bg-${technician.is_active == 1 ? 'success' : 'warning'}">${technician.is_active == 1 ? 'Activo' : 'Inactivo'}</span>
                                    </div>
                                </div>
                                <div class="col-md-8">
                                    <div class="row">
                                        <div class="col-sm-6">
                                            <p><strong>Email:</strong> ${technician.email}</p>
                                            <p><strong>Teléfono:</strong> ${technician.phone || 'No especificado'}</p>
                                        </div>
                                        <div class="col-sm-6">
                                            <p><strong>Departamento:</strong> ${this.formatDepartment(technician.department)}</p>
                                            <p><strong>Registro:</strong> ${this.formatDate(technician.created_at)}</p>
                                            <p><strong>Última actualización:</strong> ${this.formatDate(technician.updated_at)}</p>
                                        </div>
                                    </div>

                                    <hr>

                                    <div class="row">
                                        <div class="col-sm-4">
                                            <div class="text-center">
                                                <div class="h4 text-primary">${technician.total_tasks || 0}</div>
                                                <small class="text-muted">Total Tareas</small>
                                            </div>
                                        </div>
                                        <div class="col-sm-4">
                                            <div class="text-center">
                                                <div class="h4 text-success">${technician.completed_tasks || 0}</div>
                                                <small class="text-muted">Completadas</small>
                                            </div>
                                        </div>
                                        <div class="col-sm-4">
                                            <div class="text-center">
                                                <div class="h4 text-warning">${technician.active_tasks || 0}</div>
                                                <small class="text-muted">Activas</small>
                                            </div>
                                        </div>
                                    </div>

                                    ${technician.recent_tasks && technician.recent_tasks.length > 0 ? `
                                        <hr>
                                        <h6>Tareas Recientes</h6>
                                        <div class="list-group">
                                            ${technician.recent_tasks.slice(0, 3).map(task => `
                                                <div class="list-group-item">
                                                    <div class="d-flex w-100 justify-content-between">
                                                        <h6 class="mb-1">${task.title}</h6>
                                                        <small class="text-${task.status === 'completed' ? 'success' : task.status === 'in_progress' ? 'warning' : 'secondary'}">${this.formatTaskStatus(task.status)}</small>
                                                    </div>
                                                    <p class="mb-1">${task.description || 'Sin descripción'}</p>
                                                    <small class="text-muted">Creada: ${this.formatDate(task.created_at)}</small>
                                                </div>
                                            `).join('')}
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                            <button type="button" class="btn btn-warning" onclick="techniciansManager.editTechnician(${technician.id})">
                                <i class="fas fa-edit me-2"></i>Editar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Agregar modal al DOM
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        // Mostrar modal
        const modal = new bootstrap.Modal(document.getElementById('technicianProfileModal'));
        modal.show();

        // Limpiar modal cuando se cierre
        document.getElementById('technicianProfileModal').addEventListener('hidden.bs.modal', function() {
            this.remove();
        });
    }

    formatTaskStatus(status) {
        const statuses = {
            'pending': 'Pendiente',
            'in_progress': 'En Progreso',
            'completed': 'Completada',
            'cancelled': 'Cancelada'
        };
        return statuses[status] || status;
    }

    editTechnician(id) {
        // Por ahora, solo mostrar un alert con el ID
        this.showNotification(`Editar técnico ID: ${id}`, 'info');
    }


    showPermissions(id) {
        // Por ahora, solo mostrar un alert con el ID
        this.showNotification(`Mostrar permisos del técnico ID: ${id}`, 'info');
    }

    clearFilters() {
        document.getElementById('searchUsers').value = '';
        document.getElementById('filterRole').value = '';
        document.getElementById('filterStatus').value = '';
        document.getElementById('filterDepartment').value = '';

        this.currentFilters = {};
        this.currentPage = 1;
        this.loadTechnicians();
    }

    toggleView(view) {
        const cardContainer = document.getElementById('cardViewContainer');
        const tableContainer = document.getElementById('tableViewContainer');

        if (view === 'cards') {
            cardContainer.classList.remove('d-none');
            tableContainer.classList.add('d-none');
        } else {
            tableContainer.classList.remove('d-none');
            cardContainer.classList.add('d-none');
        }
    }

    // Funciones auxiliares
    formatRole(role) {
        const roles = {
            'admin': 'Administrador',
            'technician': 'Técnico',
            'viewer': 'Visualizador'
        };
        return roles[role] || role;
    }

    formatDepartment(dept) {
        const departments = {
            'dtic': 'DTIC',
            'sistemas': 'Sistemas',
            'redes': 'Redes',
            'seguridad': 'Seguridad'
        };
        return departments[dept] || dept;
    }

    getRoleBadge(role) {
        const badges = {
            'admin': '<span class="badge bg-danger">Administrador</span>',
            'technician': '<span class="badge bg-info">Técnico</span>',
            'viewer': '<span class="badge bg-secondary">Visualizador</span>'
        };
        return badges[role] || role;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-AR');
    }

    showLoading() {
        // Implementar indicador de carga si es necesario
    }

    hideLoading() {
        // Ocultar indicador de carga si es necesario
    }

    showError(message) {
        this.showNotification(message, 'danger');
    }

    showNotification(message, type = 'info') {
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
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('👥 Inicializando gestión de técnicos');
    window.techniciansManager = new TechniciansManager();
});