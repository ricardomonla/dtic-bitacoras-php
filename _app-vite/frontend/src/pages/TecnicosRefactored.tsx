import { useEffect, useState } from 'react'
import { useTecnicosStore, Tecnico } from '../stores/tecnicosStore'
import { useEntityManagement } from '../hooks/useEntityManagement'
import { tecnicoUtils } from '../utils/entityUtils'
import { EntityLayout } from '../components/common/EntityLayout'
import { EntityForm, FormField } from '../components/common/EntityForm'
import TecnicoProfileModal from '../components/TecnicoProfileModal'
import ChangePasswordModal from '../components/ChangePasswordModal'
import toast from 'react-hot-toast'

// CSS para animaciones
const styles = `
  @keyframes slideInFromTop {
    0% { opacity: 0; transform: translateY(-20px); }
    100% { opacity: 1; transform: translateY(0); }
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

  .scroll-smooth { scroll-behavior: smooth; }

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

const TecnicosRefactored = () => {
  const store = useTecnicosStore()
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
  } = useEntityManagement(store, 'Técnico')

  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards')
  const [showFilters, setShowFilters] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [profileTecnico, setProfileTecnico] = useState<Tecnico | null>(null)
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false)
  const [changePasswordTecnico, setChangePasswordTecnico] = useState<Tecnico | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setLocalFilters] = useState({
    department: '',
    role: '',
    status: ''
  })

  useEffect(() => {
    store.fetchEntities()
  }, [store.fetchEntities])

  useEffect(() => {
    if (store.error) {
      toast.error(store.error)
    }
  }, [store.error])

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    store.setFilters({ search: value })
    store.fetchEntities(1)
  }

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setLocalFilters(newFilters)
    store.setFilters(newFilters)
    store.fetchEntities(1)
  }

  const handleClearFilters = () => {
    setSearchTerm('')
    setLocalFilters({ department: '', role: '', status: '' })
    store.clearFilters()
    store.fetchEntities(1)
  }

  const handleViewProfileClick = (id: number) => {
    const tecnico = store.entities.find(t => t.id === id)
    if (tecnico) {
      setProfileTecnico(tecnico)
      setShowProfileModal(true)
    }
  }

  const handleChangePassword = (id: number) => {
    const tecnico = store.entities.find(t => t.id === id)
    if (tecnico) {
      setChangePasswordTecnico(tecnico)
      setShowChangePasswordModal(true)
    }
  }

  const handleToggleStatus = async (id: number, isActive: boolean) => {
    const action = isActive ? 'reactivar' : 'desactivar'
    if (window.confirm(`¿Está seguro de ${action} este técnico?`)) {
      try {
        await store.toggleTecnicoStatus(id, isActive)
        toast.success(`Técnico ${action}do exitosamente`)
      } catch (error) {
        // Error handled by store
      }
    }
  }

  // Form fields configuration
  const tecnicoFormFields: FormField[] = [
    { name: 'first_name', label: 'Nombre', type: 'text', required: true },
    { name: 'last_name', label: 'Apellido', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    {
      name: 'role',
      label: 'Rol',
      type: 'select',
      required: true,
      options: [
        { value: 'admin', label: 'Administrador' },
        { value: 'technician', label: 'Técnico' },
        { value: 'viewer', label: 'Visualizador' }
      ]
    },
    {
      name: 'department',
      label: 'Departamento',
      type: 'select',
      required: true,
      options: [
        { value: 'dtic', label: 'DTIC' },
        { value: 'sistemas', label: 'Sistemas' },
        { value: 'redes', label: 'Redes' },
        { value: 'seguridad', label: 'Seguridad' }
      ]
    },
    { name: 'phone', label: 'Teléfono', type: 'tel' }
  ]

  // Statistics for layout
  const stats = [
    {
      title: 'Total Técnicos',
      value: store.entities.length,
      subtitle: 'Registrados en el sistema',
      color: 'primary'
    },
    {
      title: 'Activos',
      value: store.entities.filter(t => t.is_active).length,
      subtitle: 'Con acceso al sistema',
      color: 'success'
    },
    {
      title: 'Inactivos',
      value: store.entities.filter(t => !t.is_active).length,
      subtitle: 'Acceso suspendido',
      color: 'warning'
    },
    {
      title: 'Administradores',
      value: store.entities.filter(t => t.role === 'admin').length,
      subtitle: 'Acceso completo',
      color: 'danger'
    }
  ]

  return (
    <EntityLayout
      title="Gestión de Técnicos"
      subtitle="Administra los técnicos asignados a recursos del sistema DTIC Bitácoras"
      icon="fa-users"
      stats={stats}
    >
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
                    onClick={() => setShowCreateForm(true)}
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

              {/* Create Form */}
              {showCreateForm && (
                <div className="mt-3 p-3 bg-light rounded">
                  <EntityForm
                    fields={tecnicoFormFields}
                    onSubmit={handleCreate}
                    onCancel={() => setShowCreateForm(false)}
                    title="Agregar Nuevo Técnico"
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
                    fields={tecnicoFormFields}
                    onSubmit={handleUpdate}
                    onCancel={() => {
                      setShowEditForm(false)
                      setEditingEntity(null)
                    }}
                    initialData={editingEntity}
                    title="Editar Técnico"
                  />
                </div>
              )}
            </div>

            <div className="card-body">
              {store.isLoading ? (
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
              ) : store.entities.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-users fa-3x text-muted mb-3"></i>
                  <h4>No hay técnicos registrados</h4>
                  <p className="text-muted">Comienza agregando tu primer técnico al sistema.</p>
                </div>
              ) : viewMode === 'cards' ? (
                <div className="row">
                  {store.entities.map((tecnico) => (
                    <TecnicoCard
                      key={tecnico.id}
                      tecnico={tecnico}
                      onViewProfile={handleViewProfileClick}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onToggleStatus={handleToggleStatus}
                      onChangePassword={handleChangePassword}
                      utils={tecnicoUtils}
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
                      {store.entities.map((tecnico) => (
                        <TecnicoRow
                          key={tecnico.id}
                          tecnico={tecnico}
                          onViewProfile={handleViewProfileClick}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                          onToggleStatus={handleToggleStatus}
                          onChangePassword={handleChangePassword}
                          utils={tecnicoUtils}
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
                          onClick={() => store.fetchEntities(page)}
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
        onEdit={handleEdit}
      />

      {/* Change Password Modal */}
      <ChangePasswordModal
        tecnico={changePasswordTecnico}
        isOpen={showChangePasswordModal}
        onClose={() => {
          setShowChangePasswordModal(false)
          setChangePasswordTecnico(null)
        }}
      />
    </EntityLayout>
  )
}

// Componente para la tarjeta de técnico
const TecnicoCard = ({ tecnico, onViewProfile, onEdit, onDelete, onToggleStatus, onChangePassword, utils }: any) => {
  return (
    <div className="col-md-6 col-lg-4 mb-3">
      <div className="card h-100">
        <div className="card-header bg-primary text-white">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <div className="avatar-circle bg-white text-primary me-3" style={{ width: '40px', height: '40px', fontSize: '1.2rem' }}>
                <i className={`fas ${utils.getIcon(tecnico.role)}`}></i>
              </div>
              <div>
                <h6 className="mb-0">{tecnico.full_name}</h6>
                <small>{utils.formatRole(tecnico.role)}</small>
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
              <p className="mb-2"><strong>Departamento:</strong> {utils.formatDepartment(tecnico.department)}</p>
              <p className="mb-2"><strong>Teléfono:</strong> {tecnico.phone || 'No especificado'}</p>
              <p className="mb-2"><strong>Tareas activas:</strong> {tecnico.active_tasks || 0}</p>
              <p className="mb-0"><strong>Registro:</strong> {utils.formatDate(tecnico.created_at)}</p>
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
            <button className="btn btn-outline-info btn-sm" title="Cambiar contraseña" onClick={() => onChangePassword(tecnico.id)}>
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
const TecnicoRow = ({ tecnico, onViewProfile, onEdit, onDelete, onToggleStatus, onChangePassword, utils }: any) => {
  return (
    <tr>
      <td>{tecnico.full_name}</td>
      <td>{tecnico.email}</td>
      <td><span className="badge bg-info">{utils.formatRole(tecnico.role)}</span></td>
      <td>{utils.formatDepartment(tecnico.department)}</td>
      <td>
        <span className={`badge ${tecnico.is_active ? 'bg-success' : 'bg-warning'}`}>
          {tecnico.is_active ? 'Activo' : 'Inactivo'}
        </span>
      </td>
      <td>{utils.formatDate(tecnico.updated_at)}</td>
      <td>
        <div className="btn-group" role="group">
          <button className="btn btn-outline-primary btn-sm" title="Ver Perfil" onClick={() => onViewProfile(tecnico.id)}>
            <i className="fas fa-eye"></i>
          </button>
          <button className="btn btn-outline-warning btn-sm" title="Editar" onClick={() => onEdit(tecnico.id)}>
            <i className="fas fa-edit"></i>
          </button>
          <button className="btn btn-outline-info btn-sm" title="Cambiar contraseña" onClick={() => onChangePassword(tecnico.id)}>
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

export default TecnicosRefactored