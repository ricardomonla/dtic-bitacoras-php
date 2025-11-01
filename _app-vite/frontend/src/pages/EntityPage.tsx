import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useGenericEntityStore, EntityConfig } from '../stores/genericEntityStore'
import { useEntityManagement } from '../hooks/useEntityManagement'
import { EntityUtils } from '../utils/entityUtils'
import { createActionHandlers, getActionIcon, getActionColor, getActionLabel } from '../utils/entityActions'
import { EntityLayout } from '../components/common/EntityLayout'
import { EntityForm, FormField } from '../components/common/EntityForm'
import toast from 'react-hot-toast'

// Import YAML parser
import yaml from 'js-yaml'

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

const EntityPage = () => {
  const { entityKey } = useParams<{ entityKey: string }>()
  const store = useGenericEntityStore()

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
        const response = await fetch('/src/config/entities.yml')
        const yamlText = await response.text()
        const entitiesConfig = yaml.load(yamlText) as any

        if (entityKey && entitiesConfig.entities[entityKey]) {
          const entityConfig = entitiesConfig.entities[entityKey]
          setConfig(entityConfig)
          store.setConfig(entityConfig)
        }
      } catch (error) {
        console.error('Error loading entity config:', error)
        toast.error('Error cargando configuración de entidad')
      }
    }

    if (entityKey) {
      loadConfig()
    }
  }, [entityKey, store])

  // Load entities when config is ready
  useEffect(() => {
    if (config) {
      store.fetchEntities()
    }
  }, [config, store])

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

    return config.stats.map((stat: any) => ({
      ...stat,
      value: eval(stat.value.replace('entities', 'store.entities'))
    }))
  }

  if (!config) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
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
                <div className="mt-3 p-3 bg-light rounded">
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
              )}

              {/* Create Form */}
              {showCreateForm && (
                <div className="mt-3 p-3 bg-light rounded">
                  <EntityForm
                    fields={config.fields}
                    onSubmit={handleCreate}
                    onCancel={() => setShowCreateForm(false)}
                    title={`Agregar Nuevo ${config.name.slice(0, -1)}`}
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
                    fields={config.fields}
                    onSubmit={handleUpdate}
                    onCancel={() => {
                      setShowEditForm(false)
                      setEditingEntity(null)
                    }}
                    initialData={editingEntity}
                    title={`Editar ${config.name.slice(0, -1)}`}
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
              ) : store.entities.length === 0 ? (
                <div className="text-center py-5">
                  <i className={`fas ${config.icon} fa-3x text-muted mb-3`}></i>
                  <h4>No hay {config.name.toLowerCase()} registrados</h4>
                  <p className="text-muted">Comienza agregando tu primer {config.name.slice(0, -1).toLowerCase()} al sistema.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
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
                            const handler = actionHandlers[actionKey]
                            if (handler) {
                              handler(entity, ...args)
                            }
                          }}
                          utils={EntityUtils}
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

      {/* Modals would be rendered here based on config.modals */}
    </EntityLayout>
  )
}

// Generic Entity Row Component
const EntityRow = ({ entity, config, onAction, utils }: any) => {
  return (
    <tr>
      {config.table.columns.map((column: any) => (
        <td key={column.key}>
          {column.formatter
            ? utils[column.formatter](entity[column.key])
            : entity[column.key] || '-'
          }
        </td>
      ))}
      <td>
        <div className="btn-group" role="group">
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