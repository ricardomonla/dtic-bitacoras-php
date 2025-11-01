import { useEffect, useState } from 'react'
import { useRecursosStore, Recurso } from '../stores/recursosStore'
import { useUsuariosAsignadosStore } from '../stores/usuariosAsignadosStore'
import { useEntityManagement } from '../hooks/useEntityManagement'
import { recursoUtils } from '../utils/entityUtils'
import { EntityLayout } from '../components/common/EntityLayout'
import { EntityForm, FormField } from '../components/common/EntityForm'
import RecursoProfileModal from '../components/RecursoProfileModal'
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
  const store = useRecursosStore()
  const {
    showEditForm,
    setShowEditForm,
    editingEntity,
    setEditingEntity,
    showCreateForm,
    setShowCreateForm,
    handleCreate,
    handleEdit,
    handleUpdate,
    handleDelete,
    handleViewProfile
  } = useEntityManagement(store, 'Recurso')

  const { usuarios, fetchUsuarios } = useUsuariosAsignadosStore()

  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards')
  const [showFilters, setShowFilters] = useState(false)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [selectedRecurso, setSelectedRecurso] = useState<Recurso | null>(null)
  const [selectedUsuario, setSelectedUsuario] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setLocalFilters] = useState({
    category: '',
    status: '',
    location: ''
  })
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [profileRecurso, setProfileRecurso] = useState<Recurso | null>(null)

  useEffect(() => {
    store.fetchRecursos()
    fetchUsuarios()
  }, [store.fetchRecursos, fetchUsuarios])

  useEffect(() => {
    if (store.error) {
      toast.error(store.error)
    }
  }, [store.error])

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    store.setFilters({ search: value })
    store.fetchRecursos(1)
  }

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setLocalFilters(newFilters)
    store.setFilters(newFilters)
    store.fetchRecursos(1)
  }

  const handleClearFilters = () => {
    setSearchTerm('')
    setLocalFilters({ category: '', status: '', location: '' })
    store.clearFilters()
    store.fetchRecursos(1)
  }

  const handleAssignRecurso = async (recursoId: number, usuarioId: number) => {
    if (!usuarioId) {
      toast.error('Debe seleccionar un usuario')
      return
    }

    try {
      await store.assignRecurso(recursoId, usuarioId)
      setShowAssignModal(false)
      setSelectedRecurso(null)
      setSelectedUsuario(null)
    } catch (error) {
      // Error handled by store
    }
  }

  const handleUnassignRecurso = async (recursoId: number, usuarioId: number) => {
    if (window.confirm('¿Está seguro de desasignar este recurso del usuario?')) {
      try {
        await store.unassignRecurso(recursoId, usuarioId)
      } catch (error) {
        // Error handled by store
      }
    }
  }

  const handleViewProfileClick = (id: number) => {
    const recurso = store.recursos.find(r => r.id === id)
    if (recurso) {
      setProfileRecurso(recurso)
      setShowProfileModal(true)
    }
  }

  // Form fields configuration
  const recursoFormFields: FormField[] = [
    { name: 'name', label: 'Nombre', type: 'text', required: true },
    { name: 'description', label: 'Descripción', type: 'textarea', rows: 3 },
    {
      name: 'category',
      label: 'Categoría',
      type: 'select',
      required: true,
      options: [
        { value: 'hardware', label: 'Hardware' },
        { value: 'software', label: 'Software' },
        { value: 'network', label: 'Redes' },
        { value: 'security', label: 'Seguridad' },
        { value: 'tools', label: 'Herramientas' },
        { value: 'facilities', label: 'Instalaciones' }
      ]
    },
    {
      name: 'status',
      label: 'Estado',
      type: 'select',
      required: true,
      options: [
        { value: 'available', label: 'Disponible' },
        { value: 'assigned', label: 'Asignado' },
        { value: 'maintenance', label: 'Mantenimiento' },
        { value: 'retired', label: 'Retirado' }
      ]
    },
    { name: 'location', label: 'Ubicación', type: 'text' },
    { name: 'model', label: 'Modelo', type: 'text' },
    { name: 'serial_number', label: 'Número de Serie', type: 'text' }
  ]

  // Statistics for layout
  const stats = [
    {
      title: 'Total Recursos',
      value: store.recursos.length,
      subtitle: 'En inventario',
      color: 'primary'
    },
    {
      title: 'Disponibles',
      value: store.recursos.filter(r => r.status === 'available').length,
      subtitle: 'Listos para asignar',
      color: 'success'
    },
    {
      title: 'Asignados',
      value: store.recursos.filter(r => r.status === 'assigned').length,
      subtitle: 'En uso actualmente',
      color: 'info'
    },
    {
      title: 'En Mantenimiento',
      value: store.recursos.filter(r => r.status === 'maintenance').length,
      subtitle: 'Fuera de servicio',
      color: 'warning'
    }
  ]

  return (
    <EntityLayout
      title="Gestión de Recursos"
      subtitle="Administra el inventario de recursos del sistema DTIC Bitácoras"
      icon="fa-boxes"
      stats={stats}
    >
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
                    onClick={() => setShowCreateForm(true)}
                  >
                    <i className="fas fa-plus"></i>
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
                      <label className="form-label small fw-bold">Buscar recursos</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="fas fa-search"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Nombre, descripción, ID DTIC, serial..."
                          value={searchTerm}
                          onChange={(e) => handleSearch(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-2">
                      <label className="form-label small fw-bold">Categoría</label>
                      <select
                        className="form-select form-select-sm"
                        value={filters.category}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
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
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
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
                        placeholder="Ubicación..."
                        value={filters.location}
                        onChange={(e) => handleFilterChange('location', e.target.value)}
                      />
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

              {/* Create Form */}
              {showCreateForm && (
                <div className="mt-3 p-3 bg-light rounded">
                  <EntityForm
                    fields={recursoFormFields}
                    onSubmit={handleCreate}
                    onCancel={() => setShowCreateForm(false)}
                    title="Agregar Nuevo Recurso"
                  />
                </div>
              )}

              {/* Edit Form */}
              {showEditForm && editingEntity && (
                <div
                  id="editFormSection"
                  className="mt-3 p-3 bg-light rounded edit-form-container"
                  style={{
                    scrollMarginTop: '20px',
                    animation: 'slideInFromTop 0.5s ease-out'
                  }}
                >
                  <EntityForm
                    fields={recursoFormFields}
                    onSubmit={handleUpdate}
                    onCancel={() => {
                      setShowEditForm(false)
                      setEditingEntity(null)
                    }}
                    initialData={editingEntity}
                    title="Editar Recurso"
                  />
                </div>
              )}
            </div>

            <div className="card-body">
              {store.loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                </div>
              ) : store.error ? (
                <div className="alert alert-danger">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {store.error}
                </div>
              ) : store.recursos.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-boxes fa-3x text-muted mb-3"></i>
                  <h4>No hay recursos registrados</h4>
                  <p className="text-muted">Comienza agregando tu primer recurso al sistema.</p>
                </div>
              ) : viewMode === 'cards' ? (
                <div className="row">
                  {store.recursos.map((recurso) => (
                    <RecursoCard
                      key={recurso.id}
                      recurso={recurso}
                      onViewProfile={handleViewProfileClick}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onAssign={() => {
                        setSelectedRecurso(recurso)
                        setShowAssignModal(true)
                      }}
                      onUnassign={handleUnassignRecurso}
                      utils={recursoUtils}
                    />
                  ))}
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Categoría</th>
                        <th>Estado</th>
                        <th>Ubicación</th>
                        <th>Modelo</th>
                        <th>Usuarios Asignados</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {store.recursos.map((recurso) => (
                        <RecursoRow
                          key={recurso.id}
                          recurso={recurso}
                          onViewProfile={handleViewProfileClick}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                          onAssign={() => {
                            setSelectedRecurso(recurso)
                            setShowAssignModal(true)
                          }}
                          onUnassign={handleUnassignRecurso}
                          utils={recursoUtils}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination */}
              {store.pagination && store.pagination.pages > 1 && (
                <nav className="mt-4">
                  <ul className="pagination justify-content-center">
                    {Array.from({ length: store.pagination.pages }, (_, i) => i + 1).map((page) => (
                      <li key={page} className={`page-item ${page === store.pagination.page ? 'active' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => store.fetchRecursos(page)}
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

      {/* Profile Modal */}
      <RecursoProfileModal
        recurso={profileRecurso}
        isOpen={showProfileModal}
        onClose={() => {
          setShowProfileModal(false)
          setProfileRecurso(null)
        }}
        onEdit={handleEdit}
      />
    </EntityLayout>
  )
}

// Componente para la tarjeta de recurso
const RecursoCard = ({ recurso, onViewProfile, onEdit, onDelete, onAssign, onUnassign, utils }: any) => {
  return (
    <div className="col-md-6 col-lg-4 mb-3">
      <div className="card h-100">
        <div className="card-header bg-primary text-white">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <div className="avatar-circle bg-white text-primary me-3" style={{ width: '40px', height: '40px', fontSize: '1.2rem' }}>
                <i className={`fas ${utils.getIcon(recurso.category)}`}></i>
              </div>
              <div>
                <h6 className="mb-0">{recurso.name}</h6>
                <small>{utils.formatCategory(recurso.category)}</small>
              </div>
            </div>
            <span className={`badge ${recurso.status === 'available' ? 'bg-success' : recurso.status === 'assigned' ? 'bg-info' : recurso.status === 'maintenance' ? 'bg-warning' : 'bg-secondary'}`}>
              {utils.getBadge(recurso.status).text}
            </span>
          </div>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-12">
              <p className="mb-2"><strong>ID DTIC:</strong> {recurso.dtic_id}</p>
              <p className="mb-2"><strong>Ubicación:</strong> {recurso.location || 'No especificada'}</p>
              <p className="mb-2"><strong>Modelo:</strong> {recurso.model || 'No especificado'}</p>
              <p className="mb-2"><strong>Serie:</strong> {recurso.serial_number || 'No especificado'}</p>
              <p className="mb-2"><strong>Usuarios asignados:</strong> {recurso.assigned_users_count || 0}</p>
              <p className="mb-0"><strong>Registro:</strong> {utils.formatDate(recurso.created_at)}</p>
            </div>
          </div>
          {recurso.description && (
            <>
              <hr />
              <p className="mb-2 small text-muted">{recurso.description}</p>
            </>
          )}
        </div>
        <div className="card-footer">
          <div className="btn-group w-100" role="group">
            <button className="btn btn-outline-primary btn-sm" title="Ver Detalles" onClick={() => onViewProfile(recurso.id)}>
              <i className="fas fa-eye"></i>
            </button>
            <button className="btn btn-outline-warning btn-sm" title="Editar" onClick={() => onEdit(recurso.id)}>
              <i className="fas fa-edit"></i>
            </button>
            <button className="btn btn-outline-success btn-sm" title="Asignar Usuario" onClick={onAssign}>
              <i className="fas fa-user-plus"></i>
            </button>
            <button className="btn btn-outline-danger btn-sm" title="Eliminar recurso" onClick={() => onDelete(recurso.id)}>
              <i className="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente para la fila de tabla de recurso
const RecursoRow = ({ recurso, onViewProfile, onEdit, onDelete, onAssign, onUnassign, utils }: any) => {
  return (
    <tr>
      <td>{recurso.name}</td>
      <td><span className="badge bg-info">{utils.formatCategory(recurso.category)}</span></td>
      <td>
        <span className={`badge ${recurso.status === 'available' ? 'bg-success' : recurso.status === 'assigned' ? 'bg-info' : recurso.status === 'maintenance' ? 'bg-warning' : 'bg-secondary'}`}>
          {utils.getBadge(recurso.status).text}
        </span>
      </td>
      <td>{recurso.location || '-'}</td>
      <td>{recurso.model || '-'}</td>
      <td>{recurso.assigned_users_count || 0}</td>
      <td>
        <div className="btn-group" role="group">
          <button className="btn btn-outline-primary btn-sm" title="Ver Detalles" onClick={() => onViewProfile(recurso.id)}>
            <i className="fas fa-eye"></i>
          </button>
          <button className="btn btn-outline-warning btn-sm" title="Editar" onClick={() => onEdit(recurso.id)}>
            <i className="fas fa-edit"></i>
          </button>
          <button className="btn btn-outline-success btn-sm" title="Asignar Usuario" onClick={onAssign}>
            <i className="fas fa-user-plus"></i>
          </button>
          <button className="btn btn-outline-danger btn-sm" title="Eliminar recurso" onClick={() => onDelete(recurso.id)}>
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  )
}

export default Recursos