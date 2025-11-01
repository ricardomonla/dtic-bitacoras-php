import { useEffect, useState } from 'react'
import { useTareasStore, Tarea } from '../stores/tareasStore'
import { useTecnicosStore } from '../stores/tecnicosStore'
import { useEntityManagement } from '../hooks/useEntityManagement'
import { tareaUtils } from '../utils/entityUtils'
import { EntityLayout } from '../components/common/EntityLayout'
import { EntityForm, FormField } from '../components/common/EntityForm'
import TareaProfileModal from '../components/TareaProfileModal'
import ChangePasswordModal from '../components/ChangePasswordModal'
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

const TareasRefactored = () => {
  const store = useTareasStore()
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
  } = useEntityManagement(store, 'Tarea')

  const { entities: tecnicos, fetchEntities: fetchTecnicos } = useTecnicosStore()

  useEffect(() => {
    fetchTecnicos()
  }, [fetchTecnicos])

  const [viewMode] = useState<'table'>('table')
  const [showFilters, setShowFilters] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setLocalFilters] = useState({
    technician_id: '',
    status: '',
    priority: ''
  })
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [profileTarea, setProfileTarea] = useState<Tarea | null>(null)
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false)
  const [changePasswordTarea, setChangePasswordTarea] = useState<Tarea | null>(null)

  useEffect(() => {
    store.fetchTareas()
  }, [store.fetchTareas])

  useEffect(() => {
    if (store.error) {
      toast.error(store.error)
    }
  }, [store.error])

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    store.setFilters({ search: value })
    store.fetchTareas(1)
  }

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setLocalFilters(newFilters)
    store.setFilters(newFilters)
    store.fetchTareas(1)
  }

  const handleClearFilters = () => {
    setSearchTerm('')
    setLocalFilters({ technician_id: '', status: '', priority: '' })
    store.clearFilters()
    store.fetchTareas(1)
  }

  const handleViewProfileClick = (id: number) => {
    const tarea = store.tareas.find((t: Tarea) => t.id === id)
    if (tarea) {
      setProfileTarea(tarea)
      setShowProfileModal(true)
    }
  }

  const handleChangePassword = (id: number) => {
    const tarea = store.tareas.find((t: Tarea) => t.id === id)
    if (tarea) {
      setChangePasswordTarea(tarea)
      setShowChangePasswordModal(true)
    }
  }

  // Form fields configuration
  const tareaFormFields: FormField[] = [
    { name: 'title', label: 'Título', type: 'text', required: true },
    { name: 'description', label: 'Descripción', type: 'textarea', rows: 3 },
    {
      name: 'technician_id',
      label: 'Técnico Asignado',
      type: 'select',
      options: [
        { value: '', label: 'Sin asignar' },
        ...(tecnicos || []).map((tecnico: any) => ({
          value: tecnico.id.toString(),
          label: `${tecnico.first_name} ${tecnico.last_name}`
        }))
      ]
    },
    {
      name: 'priority',
      label: 'Prioridad',
      type: 'select',
      required: true,
      options: [
        { value: 'low', label: 'Baja' },
        { value: 'medium', label: 'Media' },
        { value: 'high', label: 'Alta' },
        { value: 'urgent', label: 'Urgente' }
      ]
    },
    {
      name: 'status',
      label: 'Estado',
      type: 'select',
      required: true,
      options: [
        { value: 'pending', label: 'Pendiente' },
        { value: 'in_progress', label: 'En Progreso' },
        { value: 'completed', label: 'Completada' },
        { value: 'cancelled', label: 'Cancelada' }
      ]
    },
    { name: 'due_date', label: 'Fecha Límite', type: 'text' }
  ]

  // Statistics for layout
  const stats = [
    {
      title: 'Total Tareas',
      value: store.tareas.length,
      subtitle: 'Registradas en el sistema',
      color: 'primary'
    },
    {
      title: 'Pendientes',
      value: store.tareas.filter((t: Tarea) => t.status === 'pending').length,
      subtitle: 'Esperando asignación',
      color: 'warning'
    },
    {
      title: 'En Progreso',
      value: store.tareas.filter((t: Tarea) => t.status === 'in_progress').length,
      subtitle: 'Siendo trabajadas',
      color: 'info'
    },
    {
      title: 'Completadas',
      value: store.tareas.filter((t: Tarea) => t.status === 'completed').length,
      subtitle: 'Finalizadas exitosamente',
      color: 'success'
    }
  ]

  return (
    <EntityLayout
      title="Gestión de Tareas"
      subtitle="Administra las tareas asignadas a los técnicos del sistema DTIC Bitácoras"
      icon="fa-tasks"
      stats={stats}
    >
      {/* Tasks List */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Lista de Tareas</h5>
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
                  <button
                    className="btn btn-outline-primary btn-sm"
                    disabled
                  >
                    <i className="fas fa-list"></i> Vista Tabla
                  </button>
                </div>
              </div>

              {/* Search and Filters */}
              {showFilters && (
                <div className="mt-3 p-3 bg-light rounded">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Buscar tareas</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="fas fa-search"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Título, descripción o ID DTIC..."
                          value={searchTerm}
                          onChange={(e) => handleSearch(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-2">
                      <label className="form-label small fw-bold">Técnico</label>
                      <select
                        className="form-select form-select-sm"
                        value={filters.technician_id}
                        onChange={(e) => handleFilterChange('technician_id', e.target.value)}
                      >
                        <option value="">Todos</option>
                        {(tecnicos || []).map((tecnico: any) => (
                          <option key={tecnico.id} value={tecnico.id.toString()}>
                            {tecnico.first_name} {tecnico.last_name}
                          </option>
                        ))}
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
                        <option value="pending">Pendiente</option>
                        <option value="in_progress">En Progreso</option>
                        <option value="completed">Completada</option>
                        <option value="cancelled">Cancelada</option>
                      </select>
                    </div>
                    <div className="col-md-2">
                      <label className="form-label small fw-bold">Prioridad</label>
                      <select
                        className="form-select form-select-sm"
                        value={filters.priority}
                        onChange={(e) => handleFilterChange('priority', e.target.value)}
                      >
                        <option value="">Todas</option>
                        <option value="low">Baja</option>
                        <option value="medium">Media</option>
                        <option value="high">Alta</option>
                        <option value="urgent">Urgente</option>
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

              {/* Create Form */}
              {showCreateForm && (
                <div className="mt-3 p-3 bg-light rounded">
                  <EntityForm
                    fields={tareaFormFields}
                    onSubmit={handleCreate}
                    onCancel={() => setShowCreateForm(false)}
                    title="Agregar Nueva Tarea"
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
                    fields={tareaFormFields}
                    onSubmit={handleUpdate}
                    onCancel={() => {
                      setShowEditForm(false)
                      setEditingEntity(null)
                    }}
                    initialData={editingEntity}
                    title="Editar Tarea"
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
              ) : store.tareas.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-tasks fa-3x text-muted mb-3"></i>
                  <h4>No hay tareas registradas</h4>
                  <p className="text-muted">Comienza agregando tu primera tarea al sistema.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Título</th>
                        <th>Técnico</th>
                        <th>Prioridad</th>
                        <th>Estado</th>
                        <th>Fecha Límite</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {store.tareas.map((tarea) => (
                        <TareaRow
                          key={tarea.id}
                          tarea={tarea}
                          onViewProfile={handleViewProfileClick}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                          onChangePassword={handleChangePassword}
                          utils={tareaUtils}
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
                          onClick={() => store.fetchTareas(page)}
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
      <TareaProfileModal
        tarea={profileTarea}
        isOpen={showProfileModal}
        onClose={() => {
          setShowProfileModal(false)
          setProfileTarea(null)
        }}
        onEdit={handleEdit}
      />

      {/* Change Password Modal */}
      <ChangePasswordModal
        tecnico={changePasswordTarea}
        isOpen={showChangePasswordModal}
        onClose={() => {
          setShowChangePasswordModal(false)
          setChangePasswordTarea(null)
        }}
      />
    </EntityLayout>
  )
}

// Componente para la tarjeta de tarea
const TareaCard = ({ tarea, onViewProfile, onEdit, onDelete, onChangePassword, utils }: any) => {
  return (
    <div className="col-md-6 col-lg-4 mb-3">
      <div className="card h-100">
        <div className="card-header bg-primary text-white">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <div className="avatar-circle bg-white text-primary me-3" style={{ width: '40px', height: '40px', fontSize: '1.2rem' }}>
                <i className={`fas ${utils.getIcon(tarea.priority)}`}></i>
              </div>
              <div>
                <h6 className="mb-0">{tarea.title}</h6>
                <small>{utils.formatPriority(tarea.priority)}</small>
              </div>
            </div>
            <span className={`badge ${tarea.status === 'pending' ? 'bg-warning' : tarea.status === 'in_progress' ? 'bg-info' : tarea.status === 'completed' ? 'bg-success' : 'bg-secondary'}`}>
              {utils.getBadge(tarea.status).text}
            </span>
          </div>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-12">
              <p className="mb-2"><strong>ID DTIC:</strong> {tarea.dtic_id}</p>
              <p className="mb-2"><strong>Técnico:</strong> {tarea.technician_name || 'Sin asignar'}</p>
              <p className="mb-2"><strong>Fecha límite:</strong> {tarea.due_date ? utils.formatDate(tarea.due_date) : 'Sin fecha'}</p>
              <p className="mb-2"><strong>Creada:</strong> {utils.formatDate(tarea.created_at)}</p>
              {tarea.description && (
                <>
                  <hr />
                  <p className="mb-2 small text-muted">{tarea.description}</p>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="card-footer">
          <div className="btn-group w-100" role="group">
            <button className="btn btn-outline-primary btn-sm" title="Ver Detalles" onClick={() => onViewProfile(tarea.id)}>
              <i className="fas fa-eye"></i>
            </button>
            <button className="btn btn-outline-warning btn-sm" title="Editar" onClick={() => onEdit(tarea.id)}>
              <i className="fas fa-edit"></i>
            </button>
            <button className="btn btn-outline-info btn-sm" title="Cambiar contraseña" onClick={() => onChangePassword(tarea.id)}>
              <i className="fas fa-key"></i>
            </button>
            <button className="btn btn-outline-danger btn-sm" title="Eliminar tarea" onClick={() => onDelete(tarea.id)}>
              <i className="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente para la fila de tabla de tarea
const TareaRow = ({ tarea, onViewProfile, onEdit, onDelete, onChangePassword, utils }: any) => {
  return (
    <tr>
      <td>{tarea.title}</td>
      <td>{tarea.technician_name || '-'}</td>
      <td><span className="badge bg-info">{utils.formatPriority(tarea.priority)}</span></td>
      <td>
        <span className={`badge ${tarea.status === 'pending' ? 'bg-warning' : tarea.status === 'in_progress' ? 'bg-info' : tarea.status === 'completed' ? 'bg-success' : 'bg-secondary'}`}>
          {utils.getBadge(tarea.status).text}
        </span>
      </td>
      <td>{tarea.due_date ? utils.formatDate(tarea.due_date) : '-'}</td>
      <td>
        <div className="btn-group" role="group">
          <button className="btn btn-outline-primary btn-sm" title="Ver Detalles" onClick={() => onViewProfile(tarea.id)}>
            <i className="fas fa-eye"></i>
          </button>
          <button className="btn btn-outline-warning btn-sm" title="Editar" onClick={() => onEdit(tarea.id)}>
            <i className="fas fa-edit"></i>
          </button>
          <button className="btn btn-outline-info btn-sm" title="Cambiar contraseña" onClick={() => onChangePassword(tarea.id)}>
            <i className="fas fa-key"></i>
          </button>
          <button className="btn btn-outline-danger btn-sm" title="Eliminar tarea" onClick={() => onDelete(tarea.id)}>
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  )
}

export default TareasRefactored