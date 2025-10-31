import { useEffect, useState } from 'react'
import { useRecursosStore, Recurso } from '../stores/recursosStore'
import { useUsuariosAsignadosStore, UsuarioAsignado } from '../stores/usuariosAsignadosStore'
import toast from 'react-hot-toast'

// CSS para animaciones (igual que Técnicos)
const styles = `
  @keyframes slideInFromTop {
    0% {
      opacity: 0;
      transform: translateY(-20px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .edit-form-container {
    border-left: 4px solid #ffc107;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    transition: all 0.3s ease;
  }

  .edit-form-container:hover {
    box-shadow: 0 6px 20px rgba(0,0,0,0.15);
  }

  .edit-form-container.highlight-form {
    animation: highlightPulse 2s ease-in-out;
    border-left-color: #28a745;
  }

  .scroll-smooth {
    scroll-behavior: smooth;
  }

  @keyframes highlightPulse {
    0%, 100% {
      border-left-color: #ffc107;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }
    50% {
      border-left-color: #28a745;
      box-shadow: 0 8px 25px rgba(40, 167, 69, 0.3);
    }
  }
`

// Inyectar estilos
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style')
  styleSheet.textContent = styles
  document.head.appendChild(styleSheet)
}


const Recursos = () => {
  const {
    recursos,
    loading,
    error,
    pagination,
    filters,
    fetchRecursos,
    createRecurso,
    updateRecurso,
    deleteRecurso,
    assignRecurso,
    unassignRecurso,
    setFilters,
    clearFilters
  } = useRecursosStore()

  const { usuarios, fetchUsuarios } = useUsuariosAsignadosStore()

  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards')
  const [showAddForm, setShowAddForm] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [editingRecurso, setEditingRecurso] = useState<Recurso | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filtersLocal, setFiltersLocal] = useState({
    department: '',
    role: '',
    status: ''
  })

  // Estados para formularios
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    status: 'available',
    location: '',
    technical_specs: '',
    serial_number: '',
    model: ''
  })

  // Estados para asignación
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [selectedRecurso, setSelectedRecurso] = useState<Recurso | null>(null)
  const [selectedUsuario, setSelectedUsuario] = useState<number | null>(null)

  useEffect(() => {
    console.log('[DEBUG] Recursos component mounted, calling fetchRecursos')
    fetchRecursos()
    fetchUsuarios()
  }, [fetchRecursos, fetchUsuarios])

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setFilters({ search: value })
    fetchRecursos(1) // Reset to first page
  }

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filtersLocal, [key]: value }
    setFiltersLocal(newFilters)
    setFilters(newFilters)
    fetchRecursos(1) // Reset to first page
  }

  const handleClearFilters = () => {
    setSearchTerm('')
    setFiltersLocal({ department: '', role: '', status: '' })
    clearFilters()
    fetchRecursos(1)
  }

  const handleCreateTecnico = async (data: Partial<Recurso>) => {
    try {
      await createRecurso(data)
      toast.success('Recurso creado exitosamente')
      setShowAddForm(false)
    } catch (error) {
      // Error ya manejado en el store
    }
  }

  const handleEditTecnico = async (id: number) => {
    // Buscar el recurso en la lista actual
    const recurso = recursos.find(r => r.id === id)
    if (recurso) {
      setEditingRecurso(recurso)
      setShowEditForm(true)

      // Scroll suave al formulario de edición con animación mejorada
      setTimeout(() => {
        const editForm = document.getElementById('editFormSection')
        if (editForm) {
          // Primero hacer scroll al elemento
          editForm.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          })

          // Agregar clase para animación adicional
          editForm.classList.add('highlight-form')
          setTimeout(() => {
            editForm.classList.remove('highlight-form')
          }, 2000)
        }
      }, 150)
    }
  }

  const handleUpdateTecnico = async (data: Partial<Recurso>) => {
    if (!editingRecurso) return

    try {
      await updateRecurso(editingRecurso.id, data)
      toast.success('Recurso actualizado exitosamente')
      setShowEditForm(false)
      setEditingRecurso(null)
    } catch (error) {
      // Error ya manejado en el store
    }
  }

  const handleDeleteTecnico = async (id: number) => {
    if (window.confirm('¿Está seguro de eliminar este recurso?')) {
      try {
        await deleteRecurso(id)
        toast.success('Recurso eliminado exitosamente')
      } catch (error) {
        // Error ya manejado en el store
      }
    }
  }

  const handleToggleStatus = async (id: number, isActive: boolean) => {
    const action = isActive ? 'reactivar' : 'desactivar'
    if (window.confirm(`¿Está seguro de ${action} este recurso?`)) {
      try {
        await updateRecurso(id, { status: isActive ? 'available' : 'retired' })
        toast.success(`Recurso ${action}do exitosamente`)
      } catch (error) {
        // Error ya manejado en el store
      }
    }
  }

  const handleViewProfile = (id: number) => {
    const recurso = recursos.find(r => r.id === id)
    if (recurso) {
      // TODO: Implementar modal de detalles
      toast.info(`Ver detalles del recurso: ${recurso.name}`)
    }
  }

  const handleChangePassword = (id: number) => {
    // No aplica para recursos
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      status: 'available',
      location: '',
      technical_specs: '',
      serial_number: '',
      model: ''
    })
  }

  const formatCategory = (category: string) => {
    const categories: { [key: string]: string } = {
      'hardware': 'Hardware',
      'software': 'Software',
      'network': 'Redes',
      'security': 'Seguridad',
      'tools': 'Herramientas',
      'facilities': 'Instalaciones'
    }
    return categories[category] || category
  }

  const getStatusBadge = (status: string) => {
    const badges: { [key: string]: { text: string, class: string } } = {
      'available': { text: 'Disponible', class: 'bg-success' },
      'assigned': { text: 'Asignado', class: 'bg-info' },
      'maintenance': { text: 'Mantenimiento', class: 'bg-warning' },
      'retired': { text: 'Retirado', class: 'bg-secondary' }
    }
    const badge = badges[status] || { text: status, class: 'bg-secondary' }
    return <span className={`badge ${badge.class}`}>{badge.text}</span>
  }

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      'hardware': 'fa-laptop',
      'software': 'fa-key',
      'network': 'fa-router',
      'security': 'fa-shield-alt',
      'tools': 'fa-tools',
      'facilities': 'fa-building'
    }
    return icons[category] || 'fa-box'
  }

  return (
    <div className="container mt-4 scroll-smooth">
      {/* Page Header */}
      <div className="page-header recursos">
        <div>
          <h1 className="page-title">
            <i className="fas fa-boxes me-3"></i>
            Gestión de Recursos
          </h1>
          <p className="page-subtitle">Administra el inventario de recursos del sistema DTIC Bitácoras</p>
        </div>
      </div>

      {/* Resource Statistics */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card text-center h-100">
            <div className="card-body">
              <div className="display-4 text-primary mb-2">{recursos.length}</div>
              <h6 className="card-title">Total Recursos</h6>
              <small className="text-muted">En inventario</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center h-100">
            <div className="card-body">
              <div className="display-4 text-success mb-2">
                {recursos.filter(r => r.status === 'available').length}
              </div>
              <h6 className="card-title">Disponibles</h6>
              <small className="text-muted">Listos para asignar</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center h-100">
            <div className="card-body">
              <div className="display-4 text-info mb-2">
                {recursos.filter(r => r.status === 'assigned').length}
              </div>
              <h6 className="card-title">Asignados</h6>
              <small className="text-muted">En uso actualmente</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center h-100">
            <div className="card-body">
              <div className="display-4 text-warning mb-2">
                {recursos.filter(r => r.status === 'maintenance').length}
              </div>
              <h6 className="card-title">En Mantenimiento</h6>
              <small className="text-muted">Fuera de servicio</small>
            </div>
          </div>
        </div>
      </div>

      {/* Resources List */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Lista de Recursos</h5>
                <div className="btn-group" role="group">
                  <button
                    className="btn btn-outline-success btn-sm"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#addResourceCollapse"
                    aria-expanded="false"
                    aria-controls="addResourceCollapse"
                    title="Agregar nuevo recurso"
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                  <button
                    className="btn btn-outline-primary btn-sm"
                    type="button"
                    onClick={() => {
                      const searchCollapse = document.getElementById('searchCollapse');
                      if (searchCollapse) {
                        searchCollapse.classList.toggle('show');
                      }
                    }}
                    title="Buscar y filtrar recursos"
                  >
                    <i className="fas fa-search"></i>
                  </button>
                  <input type="radio" className="btn-check" name="viewMode" id="cardView" autoComplete="off" defaultChecked />
                  <label className="btn btn-outline-primary btn-sm" htmlFor="cardView" title="Vista de tarjetas">
                    <i className="fas fa-th"></i>
                  </label>
                  <input type="radio" className="btn-check" name="viewMode" id="tableView" autoComplete="off" />
                  <label className="btn btn-outline-primary btn-sm" htmlFor="tableView" title="Vista de tabla">
                    <i className="fas fa-list"></i>
                  </label>
                </div>
              </div>

              {/* Collapsible Search and Filters */}
              <div className="collapse collapse-search mt-3" id="searchCollapse">
                <div className="p-3 bg-light rounded">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Buscar recursos</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="fas fa-search"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          id="searchRecursos"
                          placeholder="Nombre, descripción, ID DTIC, serial..."
                          value={filters.search}
                          onChange={(e) => setFilters({ search: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="col-md-2">
                      <label className="form-label small fw-bold">Categoría</label>
                      <select
                        className="form-select form-select-sm"
                        id="filterCategory"
                        value={filters.category}
                        onChange={(e) => setFilters({ category: e.target.value })}
                      >
                        <option value="">Todas</option>
                        <option value="hardware">Hardware</option>
                        <option value="software">Software</option>
                        <option value="network">Redes</option>
                        <option value="security">Seguridad</option>
                        <option value="tools">Herramientas</option>
                        <option value="facilities">Instalaciones</option>
                      </select>
                    </div>
                    <div className="col-md-2">
                      <label className="form-label small fw-bold">Estado</label>
                      <select
                        className="form-select form-select-sm"
                        id="filterStatus"
                        value={filters.status}
                        onChange={(e) => setFilters({ status: e.target.value })}
                      >
                        <option value="">Todos</option>
                        <option value="available">Disponible</option>
                        <option value="assigned">Asignado</option>
                        <option value="maintenance">Mantenimiento</option>
                        <option value="retired">Retirado</option>
                      </select>
                    </div>
                    <div className="col-md-2">
                      <label className="form-label small fw-bold">Ubicación</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="filterLocation"
                        placeholder="Ubicación..."
                        value={filters.location}
                        onChange={(e) => setFilters({ location: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      id="clearFilters"
                      onClick={clearFilters}
                    >
                      <i className="fas fa-times me-1"></i>Limpiar filtros
                    </button>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      type="button"
                      onClick={() => {
                        const searchCollapse = document.getElementById('searchCollapse');
                        if (searchCollapse) {
                          searchCollapse.classList.remove('show');
                        }
                      }}
                    >
                      <i className="fas fa-chevron-up me-1"></i>Ocultar
                    </button>
                  </div>
                </div>
              </div>

              {/* Collapsible Add Resource Form */}
              <div className="collapse collapse-form mt-3" id="addResourceCollapse">
                <div className="p-3 bg-light rounded">
                  <h6 className="fw-bold text-success mb-3">
                    <i className="fas fa-plus me-2"></i>Agregar Nuevo Recurso
                  </h6>
                  <form id="addResourceForm">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label small fw-bold">Nombre *</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="resourceName"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-bold">Categoría *</label>
                        <select
                          className="form-select form-select-sm"
                          id="resourceCategory"
                          required
                          value={formData.category}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                        >
                          <option value="">Seleccionar...</option>
                          <option value="hardware">Hardware</option>
                          <option value="software">Software</option>
                          <option value="network">Redes</option>
                          <option value="security">Seguridad</option>
                          <option value="tools">Herramientas</option>
                          <option value="facilities">Instalaciones</option>
                        </select>
                      </div>
                      <div className="col-12">
                        <label className="form-label small fw-bold">Descripción</label>
                        <textarea
                          className="form-control form-control-sm"
                          id="resourceDescription"
                          rows={2}
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-bold">Ubicación</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="resourceLocation"
                          value={formData.location}
                          onChange={(e) => setFormData({...formData, location: e.target.value})}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-bold">Modelo</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="resourceModel"
                          value={formData.model}
                          onChange={(e) => setFormData({...formData, model: e.target.value})}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-bold">Número de Serie</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="resourceSerial"
                          value={formData.serial_number}
                          onChange={(e) => setFormData({...formData, serial_number: e.target.value})}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-bold">Estado</label>
                        <select
                          className="form-select form-select-sm"
                          id="resourceStatus"
                          value={formData.status}
                          onChange={(e) => setFormData({...formData, status: e.target.value})}
                        >
                          <option value="available">Disponible</option>
                          <option value="assigned">Asignado</option>
                          <option value="maintenance">Mantenimiento</option>
                          <option value="retired">Retirado</option>
                        </select>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <small className="text-muted">Los campos marcados con * son obligatorios</small>
                      <div>
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm me-2"
                          data-bs-toggle="collapse"
                          data-bs-target="#addResourceCollapse"
                          onClick={() => {
                            resetForm()
                          }}
                        >
                          <i className="fas fa-times me-1"></i>Cancelar
                        </button>
                        <button
                          type="button"
                          className="btn btn-success btn-sm"
                          id="saveResourceBtn"
                          onClick={() => handleCreateTecnico(formData)}
                          disabled={!formData.name || !formData.category}
                        >
                          <i className="fas fa-save me-1"></i>Crear Recurso
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <div className="card-body">
              {/* Card View */}
              <div id="cardViewContainer" className="row">
                {loading ? (
                  <div className="col-12 text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Cargando...</span>
                    </div>
                  </div>
                ) : recursos.length === 0 ? (
                  <div className="col-12 text-center py-5">
                    <i className="fas fa-boxes fa-3x text-muted mb-3"></i>
                    <h4>No hay recursos registrados</h4>
                    <p className="text-muted">Comienza agregando tu primer recurso al sistema.</p>
                  </div>
                ) : (
                  recursos.map((recurso) => (
                    <div className="col-md-6 col-lg-4 mb-3" key={recurso.id}>
                      <div className="card h-100">
                        <div className="card-header bg-primary text-white">
                          <div className="d-flex justify-content-between align-items-center">
                            <h6 className="mb-0">
                              <i className={`fas ${getCategoryIcon(recurso.category)} me-2`}></i>
                              {recurso.name}
                            </h6>
                            {getStatusBadge(recurso.status)}
                          </div>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            <div className="col-4 text-center">
                              <i className={`fas ${getCategoryIcon(recurso.category)} fa-3x text-primary mb-2`}></i>
                            </div>
                            <div className="col-8">
                              <p className="mb-2"><strong>ID:</strong> {recurso.dtic_id}</p>
                              <p className="mb-2"><strong>Categoría:</strong> {formatCategory(recurso.category)}</p>
                              {recurso.model && <p className="mb-2"><strong>Modelo:</strong> {recurso.model}</p>}
                              {recurso.location && <p className="mb-0"><strong>Ubicación:</strong> {recurso.location}</p>}
                            </div>
                          </div>
                          {recurso.description && (
                            <>
                              <hr />
                              <p className="mb-2 small text-muted">{recurso.description}</p>
                            </>
                          )}
                          <hr />
                          <div className="mb-2">
                            <small className="text-muted d-block">Usuarios asignados: {recurso.assigned_users_count || 0}</small>
                            <small className="text-muted d-block">Tareas activas: {recurso.active_tasks_count || 0}</small>
                          </div>
                        </div>
                        <div className="card-footer">
                          <div className="btn-group w-100" role="group">
                            <button
                              className="btn btn-outline-primary btn-sm"
                              title="Ver Detalles"
                              onClick={() => {/* TODO: Implementar modal de detalles */}}
                            >
                              <i className="fas fa-eye"></i>
                            </button>
                            <button
                              className="btn btn-outline-warning btn-sm"
                              title="Editar"
                              onClick={() => handleEditTecnico(recurso.id)}
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              className="btn btn-outline-success btn-sm"
                              title="Asignar Usuario"
                              onClick={() => {
                                setSelectedRecurso(recurso)
                                setShowAssignModal(true)
                              }}
                            >
                              <i className="fas fa-user-plus"></i>
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              title="Eliminar"
                              onClick={() => handleDeleteTecnico(recurso.id)}
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Table View (Hidden by default) */}
              <div id="tableViewContainer" className="d-none">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>ID DTIC</th>
                        <th>Categoría</th>
                        <th>Estado</th>
                        <th>Ubicación</th>
                        <th>Modelo</th>
                        <th>Usuarios Asignados</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recursos.map((recurso) => (
                        <tr key={recurso.id}>
                          <td>{recurso.name}</td>
                          <td>{recurso.dtic_id}</td>
                          <td>{formatCategory(recurso.category)}</td>
                          <td>{getStatusBadge(recurso.status)}</td>
                          <td>{recurso.location || '-'}</td>
                          <td>{recurso.model || '-'}</td>
                          <td>{recurso.assigned_users_count || 0}</td>
                          <td>
                            <div className="btn-group" role="group">
                              <button
                                className="btn btn-outline-primary btn-sm"
                                title="Ver"
                                onClick={() => {/* TODO: Implementar modal de detalles */}}
                              >
                                <i className="fas fa-eye"></i>
                              </button>
                              <button
                                className="btn btn-outline-warning btn-sm"
                                title="Editar"
                                onClick={() => handleEditTecnico(recurso.id)}
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button
                                className="btn btn-outline-success btn-sm"
                                title="Asignar Usuario"
                                onClick={() => {
                                  setSelectedRecurso(recurso)
                                  setShowAssignModal(true)
                                }}
                              >
                                <i className="fas fa-user-plus"></i>
                              </button>
                              <button
                                className="btn btn-outline-danger btn-sm"
                                title="Eliminar"
                                onClick={() => handleDeleteTecnico(recurso.id)}
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Resource Form */}
      {showCreateForm && (
        <div className="mt-3 p-3 bg-light rounded">
          <h6 className="fw-bold text-success mb-3">
            <i className="fas fa-plus me-2"></i>Crear Nuevo Recurso
          </h6>
          <div className="row g-3">
            <div className="col-md-8">
              <input
                type="text"
                className="form-control"
                placeholder="Nombre del recurso"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="">Categoría</option>
                <option value="hardware">Hardware</option>
                <option value="software">Software</option>
                <option value="network">Redes</option>
                <option value="security">Seguridad</option>
                <option value="tools">Herramientas</option>
                <option value="facilities">Instalaciones</option>
              </select>
            </div>
            <div className="col-12">
              <textarea
                className="form-control"
                placeholder="Descripción"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Ubicación"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
              />
            </div>
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Modelo"
                value={formData.model}
                onChange={(e) => setFormData({...formData, model: e.target.value})}
              />
            </div>
          </div>
          <div className="d-flex justify-content-end mt-3">
            <button
              className="btn btn-secondary me-2"
              onClick={() => {
                setShowCreateForm(false)
                resetForm()
              }}
            >
              Cancelar
            </button>
            <button
              className="btn btn-success"
              onClick={() => handleCreateTecnico(formData)}
              disabled={!formData.name || !formData.category}
            >
              <i className="fas fa-save me-2"></i>Crear Recurso
            </button>
          </div>
        </div>
      )}

      {/* Edit Resource Form */}
      {showEditForm && editingRecurso && (
        <div
          id="editFormSection"
          className="mt-3 p-3 bg-light rounded edit-form-container"
          style={{
            scrollMarginTop: '20px',
            animation: 'slideInFromTop 0.5s ease-out'
          }}
        >
          <h6 className="fw-bold text-warning mb-3">
            <i className="fas fa-edit me-2"></i>Editar Recurso
          </h6>
          <div className="row g-3">
            <div className="col-md-8">
              <input
                type="text"
                className="form-control"
                placeholder="Nombre del recurso"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="">Categoría</option>
                <option value="hardware">Hardware</option>
                <option value="software">Software</option>
                <option value="network">Redes</option>
                <option value="security">Seguridad</option>
                <option value="tools">Herramientas</option>
                <option value="facilities">Instalaciones</option>
              </select>
            </div>
            <div className="col-12">
              <textarea
                className="form-control"
                placeholder="Descripción"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Ubicación"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
              />
            </div>
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Modelo"
                value={formData.model}
                onChange={(e) => setFormData({...formData, model: e.target.value})}
              />
            </div>
          </div>
          <div className="d-flex justify-content-end mt-3">
            <button
              className="btn btn-secondary me-2"
              onClick={() => {
                setShowEditForm(false)
                setEditingRecurso(null)
                resetForm()
              }}
            >
              Cancelar
            </button>
            <button
              className="btn btn-warning"
              onClick={() => handleUpdateTecnico(formData)}
              disabled={!formData.name || !formData.category}
            >
              <i className="fas fa-save me-2"></i>Actualizar Recurso
            </button>
          </div>
        </div>
      )}

      {/* Resources Grid */}
      <div className="row" id="resourcesGrid">
        {loading ? (
          <div className="col-12">
            <div className="card">
              <div className="card-body text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="col-12">
            <div className="alert alert-danger">
              <i className="fas fa-exclamation-triangle me-2"></i>
              {error}
            </div>
          </div>
        ) : recursos.length === 0 ? (
          <div className="col-12">
            <div className="card">
              <div className="card-body text-center py-5">
                <i className="fas fa-boxes fa-3x text-muted mb-3"></i>
                <h4>No hay recursos registrados</h4>
                <p className="text-muted">Comienza agregando tu primer recurso al sistema.</p>
              </div>
            </div>
          </div>
        ) : (
          recursos.map((recurso) => (
            <div className="col-md-6 col-lg-4 mb-4" key={recurso.id}>
              <div className="card h-100">
                <div className="card-header bg-primary text-white">
                  <div className="d-flex justify-content-between align-items-center">
                    <h6 className="mb-0">
                      <i className={`fas ${getCategoryIcon(recurso.category)} me-2`}></i>
                      {recurso.name}
                    </h6>
                    {getStatusBadge(recurso.status)}
                  </div>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-4 text-center">
                      <i className={`fas ${getCategoryIcon(recurso.category)} fa-3x text-primary mb-2`}></i>
                    </div>
                    <div className="col-8">
                      <p className="mb-2"><strong>ID:</strong> {recurso.dtic_id}</p>
                      <p className="mb-2"><strong>Categoría:</strong> {formatCategory(recurso.category)}</p>
                      {recurso.model && <p className="mb-2"><strong>Modelo:</strong> {recurso.model}</p>}
                      {recurso.location && <p className="mb-0"><strong>Ubicación:</strong> {recurso.location}</p>}
                    </div>
                  </div>
                  {recurso.description && (
                    <>
                      <hr />
                      <p className="mb-2 small text-muted">{recurso.description}</p>
                    </>
                  )}
                  <hr />
                  <div className="mb-2">
                    <small className="text-muted d-block">Usuarios asignados: {recurso.assigned_users_count || 0}</small>
                    <small className="text-muted d-block">Tareas activas: {recurso.active_tasks_count || 0}</small>
                  </div>
                </div>
                <div className="card-footer">
                  <div className="btn-group w-100" role="group">
                    <button
                      className="btn btn-outline-primary btn-sm"
                      title="Ver Detalles"
                      onClick={() => {/* TODO: Implementar modal de detalles */}}
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                    <button
                      className="btn btn-outline-warning btn-sm"
                      title="Editar"
                      onClick={() => handleEditTecnico(recurso.id)}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      className="btn btn-outline-success btn-sm"
                      title="Asignar Usuario"
                      onClick={() => {
                        setSelectedRecurso(recurso)
                        setShowAssignModal(true)
                      }}
                    >
                      <i className="fas fa-user-plus"></i>
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      title="Eliminar"
                      onClick={() => handleDeleteTecnico(recurso.id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <nav>
          <ul className="pagination justify-content-center">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
              <li key={page} className={`page-item ${page === pagination.page ? 'active' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => fetchRecursos(page)}
                >
                  {page}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {/* Assign User Modal */}
      {showAssignModal && selectedRecurso && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-user-plus me-2"></i>Asignar Usuario
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowAssignModal(false)
                    setSelectedRecurso(null)
                    setSelectedUsuario(null)
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="alert alert-info">
                  <i className="fas fa-info-circle me-2"></i>
                  Asignando recurso: <strong>{selectedRecurso.name}</strong>
                </div>
                <div className="mb-3">
                  <label className="form-label">Seleccionar Usuario</label>
                  <select
                    className="form-select"
                    value={selectedUsuario || ''}
                    onChange={(e) => setSelectedUsuario(Number(e.target.value))}
                  >
                    <option value="">Seleccionar usuario...</option>
                    {usuarios.map((usuario) => (
                      <option key={usuario.id} value={usuario.id}>
                        {usuario.full_name} ({usuario.dtic_id})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowAssignModal(false)
                    setSelectedRecurso(null)
                    setSelectedUsuario(null)
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() => handleAssignRecurso(selectedRecurso!.id, selectedUsuario!)}
                  disabled={!selectedUsuario}
                >
                  <i className="fas fa-save me-2"></i>Asignar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Recursos