import { useEffect, useState } from 'react'
import { useTecnicosStore, Tecnico } from '../stores/tecnicosStore'
import toast from 'react-hot-toast'
import TecnicoProfileModal from '../components/TecnicoProfileModal'

const Tecnicos = () => {
  const {
    tecnicos,
    isLoading,
    error,
    pagination,
    fetchTecnicos,
    createTecnico,
    updateTecnico,
    deleteTecnico,
    toggleTecnicoStatus,
    setFilters,
    clearFilters
  } = useTecnicosStore()

  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards')
  const [showAddForm, setShowAddForm] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [editingTecnico, setEditingTecnico] = useState<Tecnico | null>(null)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [profileTecnico, setProfileTecnico] = useState<Tecnico | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setLocalFilters] = useState({
    department: '',
    role: '',
    status: ''
  })

  useEffect(() => {
    console.log('[DEBUG] Tecnicos component mounted, calling fetchTecnicos')
    fetchTecnicos()
  }, [fetchTecnicos])

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setFilters({ search: value })
    fetchTecnicos(1) // Reset to first page
  }

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setLocalFilters(newFilters)
    setFilters(newFilters)
    fetchTecnicos(1) // Reset to first page
  }

  const handleClearFilters = () => {
    setSearchTerm('')
    setLocalFilters({ department: '', role: '', status: '' })
    clearFilters()
    fetchTecnicos(1)
  }

  const handleCreateTecnico = async (data: Partial<Tecnico>) => {
    try {
      await createTecnico(data)
      toast.success('Técnico creado exitosamente')
      setShowAddForm(false)
    } catch (error) {
      // Error ya manejado en el store
    }
  }

  const handleEditTecnico = async (id: number) => {
    // Buscar el técnico en la lista actual
    const tecnico = tecnicos.find(t => t.id === id)
    if (tecnico) {
      setEditingTecnico(tecnico)
      setShowEditForm(true)
    }
  }

  const handleUpdateTecnico = async (data: Partial<Tecnico>) => {
    if (!editingTecnico) return

    try {
      await updateTecnico(editingTecnico.id, data)
      toast.success('Técnico actualizado exitosamente')
      setShowEditForm(false)
      setEditingTecnico(null)
    } catch (error) {
      // Error ya manejado en el store
    }
  }

  const handleDeleteTecnico = async (id: number) => {
    if (window.confirm('¿Está seguro de eliminar este técnico?')) {
      try {
        await deleteTecnico(id)
        toast.success('Técnico eliminado exitosamente')
      } catch (error) {
        // Error ya manejado en el store
      }
    }
  }

  const handleToggleStatus = async (id: number, isActive: boolean) => {
    const action = isActive ? 'reactivar' : 'desactivar'
    if (window.confirm(`¿Está seguro de ${action} este técnico?`)) {
      try {
        await toggleTecnicoStatus(id, isActive)
        toast.success(`Técnico ${action}do exitosamente`)
      } catch (error) {
        // Error ya manejado en el store
      }
    }
  }

  const handleViewProfile = (id: number) => {
    const tecnico = tecnicos.find(t => t.id === id)
    if (tecnico) {
      setProfileTecnico(tecnico)
      setShowProfileModal(true)
    }
  }

  const formatRole = (role: string) => {
    const roles = {
      'admin': 'Administrador',
      'technician': 'Técnico',
      'viewer': 'Visualizador'
    }
    return roles[role as keyof typeof roles] || role
  }

  const formatDepartment = (dept: string) => {
    const departments = {
      'dtic': 'DTIC',
      'sistemas': 'Sistemas',
      'redes': 'Redes',
      'seguridad': 'Seguridad'
    }
    return departments[dept as keyof typeof departments] || dept
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR')
  }

  return (
    <div className="container mt-4">
      {/* Page Header */}
      <div className="page-header tecnicos">
        <div>
          <h1 className="page-title">
            <i className="fas fa-users me-3"></i>
            Gestión de Técnicos
          </h1>
          <p className="page-subtitle">Administra los técnicos asignados a recursos del sistema DTIC Bitácoras</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card text-center h-100">
            <div className="card-body">
              <div className="display-4 text-primary mb-2">{tecnicos.length}</div>
              <h6 className="card-title">Total Técnicos</h6>
              <small className="text-muted">Registrados en el sistema</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center h-100">
            <div className="card-body">
              <div className="display-4 text-success mb-2">
                {tecnicos.filter(t => t.is_active).length}
              </div>
              <h6 className="card-title">Activos</h6>
              <small className="text-muted">Con acceso al sistema</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center h-100">
            <div className="card-body">
              <div className="display-4 text-warning mb-2">
                {tecnicos.filter(t => !t.is_active).length}
              </div>
              <h6 className="card-title">Inactivos</h6>
              <small className="text-muted">Acceso suspendido</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center h-100">
            <div className="card-body">
              <div className="display-4 text-danger mb-2">
                {tecnicos.filter(t => t.role === 'admin').length}
              </div>
              <h6 className="card-title">Administradores</h6>
              <small className="text-muted">Acceso completo</small>
            </div>
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Lista de Técnicos</h5>
                <div className="btn-group" role="group">
                  <button
                    className="btn btn-outline-success btn-sm"
                    onClick={() => setShowAddForm(!showAddForm)}
                  >
                    <i className="fas fa-user-plus"></i>
                  </button>
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <i className="fas fa-search"></i>
                  </button>
                  <input
                    type="radio"
                    className="btn-check"
                    name="viewMode"
                    id="cardView"
                    checked={viewMode === 'cards'}
                    onChange={() => setViewMode('cards')}
                  />
                  <label className="btn btn-outline-primary btn-sm" htmlFor="cardView">
                    <i className="fas fa-th"></i>
                  </label>
                  <input
                    type="radio"
                    className="btn-check"
                    name="viewMode"
                    id="tableView"
                    checked={viewMode === 'table'}
                    onChange={() => setViewMode('table')}
                  />
                  <label className="btn btn-outline-primary btn-sm" htmlFor="tableView">
                    <i className="fas fa-list"></i>
                  </label>
                </div>
              </div>

              {/* Search and Filters */}
              {showFilters && (
                <div className="mt-3 p-3 bg-light rounded">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Buscar técnicos</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="fas fa-search"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Nombre, apellido, email o ID DTIC..."
                          value={searchTerm}
                          onChange={(e) => handleSearch(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-2">
                      <label className="form-label small fw-bold">Rol</label>
                      <select
                        className="form-select form-select-sm"
                        value={filters.role}
                        onChange={(e) => handleFilterChange('role', e.target.value)}
                      >
                        <option value="">Todos</option>
                        <option value="admin">Admin</option>
                        <option value="technician">Técnico</option>
                        <option value="viewer">Viewer</option>
                      </select>
                    </div>
                    <div className="col-md-2">
                      <label className="form-label small fw-bold">Estado</label>
                      <select
                        className="form-select form-select-sm"
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                      >
                        <option value="">Todos</option>
                        <option value="active">Activo</option>
                        <option value="inactive">Inactivo</option>
                        <option value="all">Todos (incluyendo inactivos)</option>
                      </select>
                    </div>
                    <div className="col-md-2">
                      <label className="form-label small fw-bold">Depto</label>
                      <select
                        className="form-select form-select-sm"
                        value={filters.department}
                        onChange={(e) => handleFilterChange('department', e.target.value)}
                      >
                        <option value="">Todos</option>
                        <option value="dtic">DTIC</option>
                        <option value="sistemas">Sistemas</option>
                        <option value="redes">Redes</option>
                        <option value="seguridad">Seguridad</option>
                      </select>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={handleClearFilters}
                    >
                      <i className="fas fa-times me-1"></i>Limpiar filtros
                    </button>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => setShowFilters(false)}
                    >
                      <i className="fas fa-chevron-up me-1"></i>Ocultar
                    </button>
                  </div>
                </div>
              )}

              {/* Add User Form */}
              {showAddForm && (
                <div className="mt-3 p-3 bg-light rounded">
                  <h6 className="fw-bold text-primary mb-3">
                    <i className="fas fa-user-plus me-2"></i>Agregar Nuevo Técnico
                  </h6>
                  <TecnicoForm onSubmit={handleCreateTecnico} onCancel={() => setShowAddForm(false)} />
                </div>
              )}

              {/* Edit User Form */}
              {showEditForm && editingTecnico && (
                <div className="mt-3 p-3 bg-light rounded">
                  <h6 className="fw-bold text-warning mb-3">
                    <i className="fas fa-edit me-2"></i>Editar Técnico
                  </h6>
                  <TecnicoForm
                    onSubmit={handleUpdateTecnico}
                    onCancel={() => {
                      setShowEditForm(false)
                      setEditingTecnico(null)
                    }}
                    initialData={editingTecnico}
                  />
                </div>
              )}
            </div>

            <div className="card-body">
              {isLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                </div>
              ) : error ? (
                <div className="alert alert-danger">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {error}
                </div>
              ) : tecnicos.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-users fa-3x text-muted mb-3"></i>
                  <h4>No hay técnicos registrados</h4>
                  <p className="text-muted">Comienza agregando tu primer técnico al sistema.</p>
                </div>
              ) : viewMode === 'cards' ? (
                <div className="row">
                  {tecnicos.map((tecnico) => (
                    <TecnicoCard
                      key={tecnico.id}
                      tecnico={tecnico}
                      onViewProfile={handleViewProfile}
                      onEdit={handleEditTecnico}
                      onDelete={handleDeleteTecnico}
                      onToggleStatus={handleToggleStatus}
                      formatRole={formatRole}
                      formatDepartment={formatDepartment}
                      formatDate={formatDate}
                    />
                  ))}
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
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
                      {tecnicos.map((tecnico) => (
                        <TecnicoRow
                          key={tecnico.id}
                          tecnico={tecnico}
                          onViewProfile={handleViewProfile}
                          onEdit={handleEditTecnico}
                          onDelete={handleDeleteTecnico}
                          onToggleStatus={handleToggleStatus}
                          formatRole={formatRole}
                          formatDepartment={formatDepartment}
                          formatDate={formatDate}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination */}
              {pagination && pagination.pages > 1 && (
                <nav className="mt-4">
                  <ul className="pagination justify-content-center">
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                      <li key={page} className={`page-item ${page === pagination.page ? 'active' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => fetchTecnicos(page)}
                        >
                          {page}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      <TecnicoProfileModal
        tecnico={profileTecnico}
        isOpen={showProfileModal}
        onClose={() => {
          setShowProfileModal(false)
          setProfileTecnico(null)
        }}
        onEdit={handleEditTecnico}
      />
    </div>
  )
}

// Componente para el formulario de técnico
const TecnicoForm = ({ onSubmit, onCancel, initialData }: any) => {
  const [formData, setFormData] = useState({
    first_name: initialData?.first_name || '',
    last_name: initialData?.last_name || '',
    email: initialData?.email || '',
    role: initialData?.role || '',
    department: initialData?.department || '',
    phone: initialData?.phone || ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label small fw-bold">Nombre *</label>
          <input
            type="text"
            className="form-control form-control-sm"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-bold">Apellido *</label>
          <input
            type="text"
            className="form-control form-control-sm"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-8">
          <label className="form-label small fw-bold">Email *</label>
          <input
            type="email"
            className="form-control form-control-sm"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-4">
          <label className="form-label small fw-bold">Rol *</label>
          <select
            className="form-select form-select-sm"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="">Seleccionar...</option>
            <option value="admin">Administrador</option>
            <option value="technician">Técnico</option>
            <option value="viewer">Visualizador</option>
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-bold">Departamento *</label>
          <select
            className="form-select form-select-sm"
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
          >
            <option value="">Seleccionar...</option>
            <option value="dtic">DTIC</option>
            <option value="sistemas">Sistemas</option>
            <option value="redes">Redes</option>
            <option value="seguridad">Seguridad</option>
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-bold">Teléfono</label>
          <input
            type="tel"
            className="form-control form-control-sm"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="d-flex justify-content-between align-items-center mt-3">
        <small className="text-muted">Los campos marcados con * son obligatorios</small>
        <div>
          <button type="button" className="btn btn-outline-secondary btn-sm me-2" onClick={onCancel}>
            <i className="fas fa-times me-1"></i>Cancelar
          </button>
          <button type="submit" className="btn btn-success btn-sm">
            <i className="fas fa-save me-1"></i>Guardar
          </button>
        </div>
      </div>
    </form>
  )
}

// Componente para la tarjeta de técnico
const TecnicoCard = ({ tecnico, onViewProfile, onEdit, onDelete, onToggleStatus, formatRole, formatDepartment, formatDate }: any) => {
  return (
    <div className="col-md-6 col-lg-4 mb-3">
      <div className="card h-100">
        <div className="card-header bg-primary text-white">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <div className="avatar-circle bg-white text-primary me-3" style={{ width: '40px', height: '40px', fontSize: '1.2rem' }}>
                <i className="fas fa-user"></i>
              </div>
              <div>
                <h6 className="mb-0">{tecnico.full_name}</h6>
                <small>{formatRole(tecnico.role)}</small>
              </div>
            </div>
            <span className={`badge ${tecnico.is_active ? 'bg-success' : 'bg-warning'}`}>
              {tecnico.is_active ? 'Activo' : 'Inactivo'}
            </span>
          </div>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-12">
              <p className="mb-2"><strong>ID DTIC:</strong> {tecnico.dtic_id}</p>
              <p className="mb-2"><strong>Email:</strong> {tecnico.email}</p>
              <p className="mb-2"><strong>Departamento:</strong> {formatDepartment(tecnico.department)}</p>
              <p className="mb-2"><strong>Teléfono:</strong> {tecnico.phone || 'No especificado'}</p>
              <p className="mb-2"><strong>Tareas activas:</strong> {tecnico.active_tasks || 0}</p>
              <p className="mb-0"><strong>Registro:</strong> {formatDate(tecnico.created_at)}</p>
            </div>
          </div>
        </div>
        <div className="card-footer">
          <div className="btn-group w-100" role="group">
            <button className="btn btn-outline-primary btn-sm" title="Ver Perfil" onClick={() => onViewProfile(tecnico.id)}>
              <i className="fas fa-eye"></i>
            </button>
            <button className="btn btn-outline-warning btn-sm" title="Editar" onClick={() => onEdit(tecnico.id)}>
              <i className="fas fa-edit"></i>
            </button>
            <button className="btn btn-outline-info btn-sm" title="Cambiar contraseña">
              <i className="fas fa-key"></i>
            </button>
            <button className="btn btn-outline-danger btn-sm" title="Eliminar técnico" onClick={() => onDelete(tecnico.id)}>
              <i className="fas fa-trash"></i>
            </button>
            <button
              className={`btn btn-outline-${tecnico.is_active ? 'danger' : 'success'} btn-sm`}
              title={tecnico.is_active ? 'Desactivar' : 'Reactivar'}
              onClick={() => onToggleStatus(tecnico.id, !tecnico.is_active)}
            >
              <i className={`fas fa-${tecnico.is_active ? 'ban' : 'check'}`}></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente para la fila de tabla de técnico
const TecnicoRow = ({ tecnico, onViewProfile, onEdit, onDelete, onToggleStatus, formatRole, formatDepartment, formatDate }: any) => {
  return (
    <tr>
      <td>{tecnico.full_name}</td>
      <td>{tecnico.email}</td>
      <td><span className="badge bg-info">{formatRole(tecnico.role)}</span></td>
      <td>{formatDepartment(tecnico.department)}</td>
      <td>
        <span className={`badge ${tecnico.is_active ? 'bg-success' : 'bg-warning'}`}>
          {tecnico.is_active ? 'Activo' : 'Inactivo'}
        </span>
      </td>
      <td>{formatDate(tecnico.updated_at)}</td>
      <td>
        <div className="btn-group" role="group">
          <button className="btn btn-outline-primary btn-sm" title="Ver Perfil" onClick={() => onViewProfile(tecnico.id)}>
            <i className="fas fa-eye"></i>
          </button>
          <button className="btn btn-outline-warning btn-sm" title="Editar" onClick={() => onEdit(tecnico.id)}>
            <i className="fas fa-edit"></i>
          </button>
          <button className="btn btn-outline-info btn-sm" title="Cambiar contraseña" onClick={() => alert('Cambiar contraseña próximamente')}>
            <i className="fas fa-key"></i>
          </button>
          <button className="btn btn-outline-danger btn-sm" title="Eliminar técnico" onClick={() => onDelete(tecnico.id)}>
            <i className="fas fa-trash"></i>
          </button>
          <button
            className={`btn btn-outline-${tecnico.is_active ? 'danger' : 'success'} btn-sm`}
            title={tecnico.is_active ? 'Desactivar' : 'Reactivar'}
            onClick={() => onToggleStatus(tecnico.id, !tecnico.is_active)}
          >
            <i className={`fas fa-${tecnico.is_active ? 'ban' : 'check'}`}></i>
          </button>
        </div>
      </td>
    </tr>
  )
}

export default Tecnicos