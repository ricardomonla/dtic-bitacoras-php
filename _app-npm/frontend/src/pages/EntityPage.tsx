import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useGenericEntityStore, EntityConfig } from '../stores/genericEntityStore'
import { useEntityManagement } from '../hooks/useEntityManagement'
import { EntityUtils, tecnicoUtils, recursoUtils, tareaUtils, createEntityUtils } from '../utils/entityUtils'
import { createActionHandlers, getActionIcon, getActionColor, getActionLabel } from '../utils/entityActions'
import { EntityLayout } from '../components/common/EntityLayout'
import { EntityForm, FormField } from '../components/common/EntityForm'
import { ProfileModal } from '../components/common/ProfileModal'
import toast from 'react-hot-toast'

// Import YAML parser
import yaml from 'js-yaml'

// CSS para animaciones y estética mejorada
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

  /* Estética mejorada para tablas */
  .entity-table {
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  }

  .entity-table thead th {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.85rem;
    letter-spacing: 0.5px;
    border: none;
    padding: 1rem 0.75rem;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .entity-table tbody tr {
    transition: all 0.2s ease;
    border-bottom: 1px solid #f1f3f4;
  }

  .entity-table tbody tr:hover {
    background-color: #f8f9ff;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }

  .entity-table tbody tr:nth-child(even) {
    background-color: #fafbfc;
  }

  .entity-table tbody tr:nth-child(even):hover {
    background-color: #f0f2ff;
  }

  .entity-table tbody td {
    padding: 0.875rem 0.75rem;
    vertical-align: middle;
    border: none;
  }

  /* Estilos para badges en celdas */
  .entity-table .badge {
    font-size: 0.75rem;
    padding: 0.375rem 0.5rem;
    border-radius: 20px;
    font-weight: 500;
  }

  /* Botones de acción mejorados */
  .entity-actions .btn {
    border-radius: 6px;
    margin: 0 1px;
    transition: all 0.2s ease;
    border: none;
  }

  .entity-actions .btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }

  .entity-actions .btn-outline-primary:hover {
    background-color: #007bff;
    border-color: #007bff;
  }

  .entity-actions .btn-outline-warning:hover {
    background-color: #ffc107;
    border-color: #ffc107;
  }

  .entity-actions .btn-outline-info:hover {
    background-color: #17a2b8;
    border-color: #17a2b8;
  }

  .entity-actions .btn-outline-success:hover {
    background-color: #28a745;
    border-color: #28a745;
  }

  .entity-actions .btn-outline-danger:hover {
    background-color: #dc3545;
    border-color: #dc3545;
  }

  /* Estilos para estados vacíos */
  .empty-state {
    padding: 3rem 2rem;
    text-align: center;
    color: #6c757d;
  }

  .empty-state i {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }

  .empty-state h4 {
    color: #495057;
    margin-bottom: 0.5rem;
  }

  /* Responsive improvements */
  @media (max-width: 768px) {
    .entity-table {
      font-size: 0.875rem;
    }

    .entity-table thead th,
    .entity-table tbody td {
      padding: 0.5rem 0.375rem;
    }

    .entity-actions .btn {
      padding: 0.25rem 0.5rem;
      font-size: 0.75rem;
    }

    .entity-actions .btn i {
      font-size: 0.875rem;
    }
  }

  /* Estilos para filtros */
  .filters-section {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border: 1px solid #dee2e6;
    border-radius: 8px;
    margin-bottom: 1rem;
  }

  .filters-section .form-label {
    color: #495057;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .filters-section .input-group-text {
    background-color: #e9ecef;
    border-color: #ced4da;
  }

  /* Estilos para formularios */
  .form-section {
    background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
    border: 1px solid #dee2e6;
    border-radius: 8px;
    margin-bottom: 1rem;
  }

  .form-section .card-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-bottom: none;
    border-radius: 8px 8px 0 0 !important;
  }

  .form-section .card-header h5 {
    margin: 0;
    font-weight: 600;
  }
`

// Inyectar estilos
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style')
  styleSheet.textContent = styles
  document.head.appendChild(styleSheet)
}

const EntityPage = () => {
  const params = useParams<{ entityKey?: string }>()
  const entityKey = params.entityKey || window.location.pathname.split('/').filter(Boolean)[0] // Extract from URL path
  const store = useGenericEntityStore()

  // console.log('EntityPage - Current URL:', window.location.pathname)
  // console.log('EntityPage - Extracted entityKey:', entityKey)
  // console.log('EntityPage - Params:', params)

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
  } = useEntityManagement(store, entityKey || '')

  const [config, setConfig] = useState<EntityConfig | null>(null)
  const [entityUtils, setEntityUtils] = useState<EntityUtils | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setLocalFilters] = useState<Record<string, any>>({})
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [profileEntity, setProfileEntity] = useState<any>(null)
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false)
  const [changePasswordEntity, setChangePasswordEntity] = useState<any>(null)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [selectedEntity, setSelectedEntity] = useState<any>(null)
  const [selectedUsuario, setSelectedUsuario] = useState<number | null>(null)

  // Load configuration from YAML
  useEffect(() => {
    const loadConfig = async () => {
      try {
        // console.log('Loading config for entityKey:', entityKey)
        const response = await fetch('/src/config/entities.yml')
        // console.log('Fetch response status:', response.status)

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const yamlText = await response.text()
        // console.log('YAML text length:', yamlText.length)

        const entitiesConfig = yaml.load(yamlText) as any
        // console.log('Parsed entities config:', entitiesConfig)
        // console.log('Available entity keys:', Object.keys(entitiesConfig.entities || {}))

        if (entityKey && entitiesConfig.entities && entitiesConfig.entities[entityKey]) {
          const entityConfig = entitiesConfig.entities[entityKey]
          // console.log('Found entity config for', entityKey, ':', entityConfig)
          setConfig(entityConfig)
          store.setConfig(entityConfig)

          // Create entity utils based on entity type
          let utils: EntityUtils
          switch (entityKey) {
            case 'tecnicos':
              utils = tecnicoUtils
              break
            case 'recursos':
              utils = recursoUtils
              break
            case 'tareas':
              utils = tareaUtils
              break
            case 'usuarios':
              utils = createEntityUtils({
                formatters: {
                  date: (date: string) => new Date(date).toLocaleDateString('es-AR'),
                  status: (status: string) => status === 'active' ? 'Activo' : 'Inactivo'
                },
                icons: {},
                badges: {
                  active: { text: 'Activo', class: 'bg-success' },
                  inactive: { text: 'Inactivo', class: 'bg-warning' }
                },
                roles: {},
                departments: {},
                categories: {}
              })
              break
            default:
              utils = tecnicoUtils // fallback
          }
          setEntityUtils(utils)
        } else {
          console.error('Entity key not found:', entityKey, 'Available keys:', Object.keys(entitiesConfig.entities || {}))
          toast.error(`Entidad '${entityKey}' no encontrada en configuración. Claves disponibles: ${Object.keys(entitiesConfig.entities || {}).join(', ')}`)
          return
        }
      } catch (error) {
        console.error('Error loading entity config:', error)
        toast.error(`Error cargando configuración: ${error instanceof Error ? error.message : 'Error desconocido'}`)
        return
      }
    }

    if (entityKey) {
      loadConfig()
    } else {
      console.error('No entityKey provided')
      toast.error('No se pudo determinar la entidad a cargar')
    }
  }, [entityKey])

  // Load entities when config is ready
  useEffect(() => {
    if (config && entityUtils) {
      // console.log('Loading entities for config:', config.name)
      store.fetchEntities()
    }
  }, [config, entityUtils])

  // Handle errors
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
    setLocalFilters({})
    store.clearFilters()
    store.fetchEntities(1)
  }

  const handleViewProfileClick = (id: number) => {
    const entity = store.entities.find((e: any) => e.id === id)
    if (entity) {
      setProfileEntity(entity)
      setShowProfileModal(true)
    } else {
      console.error('Entity not found for view profile:', id)
    }
  }

  const handleChangePassword = (id: number) => {
    const entity = store.entities.find((e: any) => e.id === id)
    if (entity) {
      setChangePasswordEntity(entity)
      setShowChangePasswordModal(true)
    }
  }

  const handleAssignEntity = async (entityId: number, usuarioId: number) => {
    if (!usuarioId) {
      toast.error('Debe seleccionar un usuario')
      return
    }

    try {
      await store.assignEntity?.(entityId, usuarioId)
      setShowAssignModal(false)
      setSelectedEntity(null)
      setSelectedUsuario(null)
    } catch (error) {
      // Error handled by store
    }
  }

  const actionHandlers = createActionHandlers(entityKey || '')

  // Calculate stats dynamically
  const calculateStats = () => {
    if (!config?.stats) return []

    return config.stats.map((stat: any) => {
      try {
        // Replace 'entities' with 'store.entities' and evaluate
        const expression = stat.value.replace(/entities/g, 'store.entities')
        const value = eval(expression)
        return {
          ...stat,
          value: typeof value === 'number' ? value : 0
        }
      } catch (error) {
        console.error('Error calculating stat:', stat.title, error)
        return {
          ...stat,
          value: 0
        }
      }
    })
  }

  if (!config || !entityUtils) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3 text-muted">
          Cargando configuración para <strong>{entityKey}</strong>...
        </p>
        <div className="mt-3">
          <small className="text-muted">
            Si esta pantalla persiste, verifica que la entidad esté configurada correctamente.
          </small>
        </div>
      </div>
    )
  }

  return (
    <EntityLayout
      title={config.title}
      subtitle={config.subtitle}
      icon={config.icon}
      stats={calculateStats()}
      className="entity-page"
    >
      {/* Entity List */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Lista de {config.name}</h5>
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
                </div>
              </div>

              {/* Search and Filters */}
              {showFilters && (
                <div className="mt-3 filters-section">
                  <div className="p-3">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label small fw-bold">Buscar {config.name.toLowerCase()}</label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <i className="fas fa-search"></i>
                          </span>
                          <input
                            type="text"
                            className="form-control"
                            placeholder={`Nombre, descripción, ID DTIC...`}
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                          />
                        </div>
                      </div>
                      {config.filters.map((filter: any) => (
                        <div key={filter.key} className="col-md-2">
                          <label className="form-label small fw-bold">{filter.label}</label>
                          {filter.type === 'select' ? (
                            <select
                              className="form-select form-select-sm"
                              value={filters[filter.key] || ''}
                              onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                            >
                              {filter.options.map((option: any) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type={filter.type}
                              className="form-control form-control-sm"
                              placeholder={filter.placeholder}
                              value={filters[filter.key] || ''}
                              onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                            />
                          )}
                        </div>
                      ))}
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
                </div>
              )}

              {/* Create Form */}
              {showCreateForm && (
                <div className="mt-3 form-section">
                  <div className="card">
                    <div className="card-header">
                      <h5 className="mb-0">
                        <i className="fas fa-plus me-2"></i>
                        Agregar Nuevo {config.name.slice(0, -1)}
                      </h5>
                    </div>
                    <div className="card-body">
                      <EntityForm
                        fields={config.fields}
                        onSubmit={handleCreate}
                        onCancel={() => setShowCreateForm(false)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Edit Form */}
              {showEditForm && editingEntity && (
                <div
                  id="editFormSection"
                  className="mt-3 form-section edit-form-container"
                  style={{
                    scrollMarginTop: '20px',
                    animation: 'slideInFromTop 0.5s ease-out'
                  }}
                >
                  <div className="card">
                    <div className="card-header">
                      <h5 className="mb-0">
                        <i className="fas fa-edit me-2"></i>
                        Editar {config.name.slice(0, -1)}
                      </h5>
                    </div>
                    <div className="card-body">
                      <EntityForm
                        fields={config.fields}
                        onSubmit={handleUpdate}
                        onCancel={() => {
                          setShowEditForm(false)
                          setEditingEntity(null)
                        }}
                        initialData={editingEntity}
                      />
                    </div>
                  </div>
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
              ) : store.entities.length === 0 ? (
                <div className="empty-state">
                  <i className={`fas ${config.icon} fa-3x text-muted mb-3`}></i>
                  <h4>No hay {config.name.toLowerCase()} registrados</h4>
                  <p className="text-muted">Comienza agregando tu primer {config.name.slice(0, -1).toLowerCase()} al sistema.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table entity-table">
                    <thead>
                      <tr>
                        {config.table.columns.map((column: any) => (
                          <th key={column.key}>{column.label}</th>
                        ))}
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {store.entities.map((entity: any) => (
                        <EntityRow
                          key={entity.id}
                          entity={entity}
                          config={config}
                          onAction={(actionKey, ...args) => {
                            if (actionKey === 'view') {
                              handleViewProfileClick(entity.id)
                            } else if (actionKey === 'edit') {
                              handleEdit(entity.id)
                            } else if (actionKey === 'changePassword') {
                              handleChangePassword(entity.id)
                            } else if (actionKey === 'assign') {
                              setSelectedEntity(entity)
                              setShowAssignModal(true)
                            } else {
                              const handler = actionHandlers[actionKey]
                              if (handler) {
                                handler(entity, ...args)
                              }
                            }
                          }}
                          utils={entityUtils}
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

      {/* Modals */}
      {showProfileModal && profileEntity && config?.modals && (
        <ProfileModal
          entity={profileEntity}
          entityKey={entityKey || ''}
          config={config}
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          onEdit={handleViewProfileClick}
        />
      )}
    </EntityLayout>
  )
}


// Generic Entity Row Component
const EntityRow = ({ entity, config, onAction, utils }: any) => {
  // console.log('EntityRow - Rendering entity:', entity)
  // console.log('EntityRow - Config:', config)
  // console.log('EntityRow - Utils:', utils)

  return (
    <tr>
      {config.table.columns.map((column: any) => {
        // console.log('EntityRow - Processing column:', column.key, 'Value:', entity[column.key])
        let cellValue: string | JSX.Element = '-'

        try {
          if (column.formatter && utils && utils[column.formatter]) {
            const formattedValue = utils[column.formatter](entity[column.key])
            // console.log('EntityRow - Formatted value:', formattedValue)

            // If formatter returns JSX (like badges), use it directly
            if (React.isValidElement(formattedValue)) {
              cellValue = formattedValue
            } else {
              cellValue = formattedValue || '-'
            }
          } else {
            cellValue = entity[column.key] || '-'
            // console.log('EntityRow - Raw value:', cellValue)
          }
        } catch (error) {
          console.error('EntityRow - Error formatting column', column.key, ':', error)
          cellValue = entity[column.key] || '-'
        }

        return (
          <td key={column.key}>
            {cellValue}
          </td>
        )
      })}
      <td>
        <div className="entity-actions">
          {config.actions.map((action: any) => (
            <button
              key={action.key}
              className={`btn btn-outline-${getActionColor(action.key, entity[action.condition])} btn-sm`}
              title={getActionLabel(action.key, config.name.slice(0, -1))}
              onClick={() => onAction(action.key)}
            >
              <i className={`fas ${getActionIcon(action.key, entity[action.condition])}`}></i>
            </button>
          ))}
        </div>
      </td>
    </tr>
  )
}

export default EntityPage