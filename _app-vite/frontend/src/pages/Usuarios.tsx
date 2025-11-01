import { useEffect, useState } from 'react'
import { useUsuariosAsignadosStore, UsuarioAsignado } from '../stores/usuariosAsignadosStore'
import { useEntityManagement } from '../hooks/useEntityManagement'
import { EntityLayout } from '../components/common/EntityLayout'
import { EntityForm, FormField } from '../components/common/EntityForm'
import UsuarioProfileModal from '../components/UsuarioProfileModal'
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

const Usuarios = () => {
  const store = useUsuariosAsignadosStore()
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
  } = useEntityManagement(store, 'Usuario')

  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards')
  const [showFilters, setShowFilters] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setLocalFilters] = useState({
    department: ''
  })
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [profileUsuario, setProfileUsuario] = useState<UsuarioAsignado | null>(null)

  useEffect(() => {
    store.fetchUsuarios()
  }, [store.fetchUsuarios])

  useEffect(() => {
    if (store.error) {
      toast.error(store.error)
    }
  }, [store.error])

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    store.setFilters({ search: value })
    store.fetchUsuarios(1)
  }

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setLocalFilters(newFilters)
    store.setFilters(newFilters)
    store.fetchUsuarios(1)
  }

  const handleClearFilters = () => {
    setSearchTerm('')
    setLocalFilters({ department: '' })
    store.clearFilters()
    store.fetchUsuarios(1)
  }

  const handleViewProfileClick = (id: number) => {
    const usuario = store.usuarios.find(u => u.id === id)
    if (usuario) {
      setProfileUsuario(usuario)
      setShowProfileModal(true)
    }
  }

  // Form fields configuration
  const usuarioFormFields: FormField[] = [
    { name: 'first_name', label: 'Nombre', type: 'text', required: true },
    { name: 'last_name', label: 'Apellido', type: 'text', required: true },
    { name: 'dtic_id', label: 'ID DTIC', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'phone', label: 'Teléfono', type: 'tel' },
    {
      name: 'department',
      label: 'Departamento',
      type: 'select',
      options: [
        { value: 'dtic', label: 'DTIC' },
        { value: 'sistemas', label: 'Sistemas' },
        { value: 'redes', label: 'Redes' },
        { value: 'seguridad', label: 'Seguridad' }
      ]
    },
    { name: 'position', label: 'Cargo', type: 'text' }
  ]

  // Statistics for layout
  const stats = [
    {
      title: 'Total Usuarios',
      value: store.usuarios.length,
      subtitle: 'Registrados en el sistema',
      color: 'primary'
    },
    {
      title: 'Con Recursos',
      value: store.usuarios.filter(u => (u.assigned_resources_count || 0) > 0).length,
      subtitle: 'Tienen recursos asignados',
      color: 'success'
    },
    {
      title: 'Sin Recursos',
      value: store.usuarios.filter(u => (u.assigned_resources_count || 0) === 0).length,
      subtitle: 'Sin asignaciones activas',
      color: 'warning'
    },
    {
      title: 'Recursos Totales',
      value: store.usuarios.reduce((total, u) => total + (u.assigned_resources_count || 0), 0),
      subtitle: 'Asignados actualmente',
      color: 'info'
    }
  ]

  return (
    <EntityLayout
      title="Gestión de Usuarios Asignados"
      subtitle="Administra usuarios que pueden tener recursos asignados del sistema DTIC Bitácoras"
      icon="fa-user-cog"
      stats={stats}
    >
      {/* Users List */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Lista de Usuarios Asignados</h5>
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
                    <div className="col-md-8">
                      <label className="form-label small fw-bold">Buscar usuarios</label>
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
                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Departamento</label>
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
                    fields={usuarioFormFields}
                    onSubmit={handleCreate}
                    onCancel={() => setShowCreateForm(false)}
                    title="Agregar Nuevo Usuario Asignado"
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
                    fields={usuarioFormFields}
                    onSubmit={handleUpdate}
                    onCancel={() => {
                      setShowEditForm(false)
                      setEditingEntity(null)
                    }}
                    initialData={editingEntity}
                    title="Editar Usuario Asignado"
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
              ) : store.usuarios.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-users fa-3x text-muted mb-3"></i>
                  <h4>No hay usuarios asignados registrados</h4>
                  <p className="text-muted">Comienza agregando tu primer usuario asignado al sistema.</p>
                </div>
              ) : viewMode === 'cards' ? (
                <div className="row">
                  {store.usuarios.map((usuario) => (
                    <UsuarioCard
                      key={usuario.id}
                      usuario={usuario}
                      onViewProfile={handleViewProfileClick}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>ID DTIC</th>
                        <th>Email</th>
                        <th>Departamento</th>
                        <th>Cargo</th>
                        <th>Recursos Asignados</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {store.usuarios.map((usuario) => (
                        <UsuarioRow
                          key={usuario.id}
                          usuario={usuario}
                          onViewProfile={handleViewProfileClick}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
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
                          onClick={() => store.fetchUsuarios(page)}
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
      <UsuarioProfileModal
        usuario={profileUsuario}
        isOpen={showProfileModal}
        onClose={() => {
          setShowProfileModal(false)
          setProfileUsuario(null)
        }}
        onEdit={handleEdit}
      />
    </EntityLayout>
  )
}

// Componente para la tarjeta de usuario
const UsuarioCard = ({ usuario, onViewProfile, onEdit, onDelete }: any) => {
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
                <h6 className="mb-0">{usuario.full_name || `${usuario.first_name} ${usuario.last_name}`}</h6>
                <small>{usuario.position || 'Sin cargo especificado'}</small>
              </div>
            </div>
          </div>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-12">
              <p className="mb-2"><strong>ID DTIC:</strong> {usuario.dtic_id}</p>
              <p className="mb-2"><strong>Email:</strong> {usuario.email || 'No especificado'}</p>
              <p className="mb-2"><strong>Teléfono:</strong> {usuario.phone || 'No especificado'}</p>
              <p className="mb-2"><strong>Departamento:</strong> {usuario.department || 'No especificado'}</p>
              <p className="mb-2"><strong>Recursos asignados:</strong> {usuario.assigned_resources_count || 0}</p>
              <p className="mb-0"><strong>Registro:</strong> {new Date(usuario.created_at).toLocaleDateString('es-AR')}</p>
            </div>
          </div>
        </div>
        <div className="card-footer">
          <div className="btn-group w-100" role="group">
            <button className="btn btn-outline-primary btn-sm" title="Ver Perfil" onClick={() => onViewProfile(usuario.id)}>
              <i className="fas fa-eye"></i>
            </button>
            <button className="btn btn-outline-warning btn-sm" title="Editar" onClick={() => onEdit(usuario.id)}>
              <i className="fas fa-edit"></i>
            </button>
            <button className="btn btn-outline-danger btn-sm" title="Eliminar usuario" onClick={() => onDelete(usuario.id)}>
              <i className="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente para la fila de tabla de usuario
const UsuarioRow = ({ usuario, onViewProfile, onEdit, onDelete }: any) => {
  return (
    <tr>
      <td>{usuario.full_name || `${usuario.first_name} ${usuario.last_name}`}</td>
      <td>{usuario.dtic_id}</td>
      <td>{usuario.email || '-'}</td>
      <td>{usuario.department || '-'}</td>
      <td>{usuario.position || '-'}</td>
      <td>{usuario.assigned_resources_count || 0}</td>
      <td>
        <div className="btn-group" role="group">
          <button className="btn btn-outline-primary btn-sm" title="Ver Perfil" onClick={() => onViewProfile(usuario.id)}>
            <i className="fas fa-eye"></i>
          </button>
          <button className="btn btn-outline-warning btn-sm" title="Editar" onClick={() => onEdit(usuario.id)}>
            <i className="fas fa-edit"></i>
          </button>
          <button className="btn btn-outline-danger btn-sm" title="Eliminar usuario" onClick={() => onDelete(usuario.id)}>
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  )
}

export default Usuarios