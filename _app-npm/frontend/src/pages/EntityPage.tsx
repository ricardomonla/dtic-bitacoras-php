import React, { useEffect, useState } from 'react'
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

// Funciones de formateo especializadas para optimización de tablas
const formatStatusPriority = (entity: any) => {
  const statusBadge = tareaUtils.getBadge(entity.status)
  const priorityBadge = tareaUtils.getBadge(entity.priority)
  return (
    <div className="d-flex flex-column gap-1">
      <span className={`badge ${statusBadge.class} badge-sm`}>
        {statusBadge.text}
      </span>
      <span className={`badge ${priorityBadge.class} badge-sm`}>
        {priorityBadge.text}
      </span>
    </div>
  )
}

const formatAssignedResources = (entity: any) => {
  // Esta función se implementará cuando tengamos los datos de recursos asignados
  // Por ahora retorna un placeholder
  const assignedResources = entity.assigned_resources || []

  if (assignedResources.length === 0) {
    return (
      <span className="text-muted small">
        <i className="fas fa-box me-1"></i>
        Sin recursos asignados
      </span>
    )
  }

  const firstResource = assignedResources[0]
  const remainingCount = assignedResources.length - 1

  return (
    <div className="d-flex align-items-center">
      <span className="badge bg-light text-dark me-2">
        <i className="fas fa-box me-1"></i>
        {typeof firstResource === 'string' ? firstResource : firstResource.name || 'Sin nombre'}
      </span>
      {remainingCount > 0 && (
        <small className="text-muted">
          y {remainingCount} recurso{remainingCount !== 1 ? 's' : ''} más
        </small>
      )}
    </div>
  )
}

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

  /* Estilos específicos para prioridades y estados de tareas */
  .badge-priority-low {
    background-color: #28a745 !important;
    color: white;
  }

  .badge-priority-medium {
    background-color: #ffc107 !important;
    color: black;
  }

  .badge-priority-high {
    background-color: #fd7e14 !important;
    color: white;
  }

  .badge-priority-urgent {
    background-color: #dc3545 !important;
    color: white;
  }

  .badge-status-pending {
    background-color: #ffc107 !important;
    color: black;
  }

  .badge-status-in_progress {
    background-color: #17a2b8 !important;
    color: white;
  }

  .badge-status-completed {
    background-color: #28a745 !important;
    color: white;
  }

  .badge-status-cancelled {
    background-color: #6c757d !important;
    color: white;
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

  /* Panel lateral deslizante para confirmaciones */
  .slide-panel {
    position: fixed;
    top: 50%;
    right: -450px;
    width: 420px;
    height: auto;
    max-height: 80vh;
    background: white;
    box-shadow: -4px 4px 20px rgba(0,0,0,0.15);
    z-index: 1050;
    transition: right 0.3s ease-in-out;
    overflow-y: auto;
    border-radius: 12px 0 0 12px;
    transform: translateY(-50%);
  }

  .slide-panel.show {
    right: 20px;
  }

  .slide-panel-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,0.3);
    z-index: 1049;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  }

  .slide-panel-backdrop.show {
    opacity: 1;
  }

  .slide-panel .panel-header {
    background: linear-gradient(135deg, #ffc107 0%, #ff8c00 100%);
    color: white;
    padding: 1.25rem 1.5rem;
    border: none;
    border-radius: 12px 0 0 0;
  }

  .slide-panel .panel-body {
    padding: 1.5rem;
  }

  .slide-panel .btn-close-panel {
    background: none;
    border: none;
    color: white;
    font-size: 1.25rem;
    opacity: 0.8;
    padding: 0.25rem;
    border-radius: 4px;
  }

  .slide-panel .btn-close-panel:hover {
    opacity: 1;
    background: rgba(255,255,255,0.1);
  }

  /* Notificación deslizante superior */
  .top-notification {
    position: fixed;
    top: -80px;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    max-width: 500px;
    z-index: 1060;
    transition: top 0.3s ease-in-out;
  }

  .top-notification.show {
    top: 20px;
  }

  .top-notification .alert {
    margin: 0;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
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
  // Extract entity key from URL path - handle both direct routes (/recursos) and dynamic routes (/entity/recursos)
  const pathname = window.location.pathname
  const pathParts = pathname.split('/').filter(Boolean)
  const entityKey = params.entityKey || pathParts[0] // Use first part of path or param
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
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [confirmationMessage, setConfirmationMessage] = useState('')
  const [confirmationAction, setConfirmationAction] = useState<(() => void) | null>(null)
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState('')
  const [notificationType, setNotificationType] = useState<'success' | 'error' | 'warning' | 'info'>('info')

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
      // console.log('Loading entities for config:', config.name, 'entityKey:', entityKey)
      store.fetchEntities()
    }
  }, [config, entityUtils, entityKey])

  // Clear entities when entityKey changes to prevent stale data
  useEffect(() => {
    if (entityKey) {
      // console.log('Entity key changed to:', entityKey, '- clearing entities')
      store.setEntities([])
      store.setError(null)
      // Don't set loading here, let the fetchEntities call handle it
    }
  }, [entityKey])

  // Sort entities based on entity type
  const getSortedEntities = () => {
    if (!store.entities) return []

    return [...store.entities].sort((a, b) => {
      switch (entityKey) {
        case 'tecnicos':
          // Primero por Rol, luego por Nombre
          const roleOrder = { 'admin': 0, 'technician': 1, 'viewer': 2 }
          const roleA = roleOrder[a.role] ?? 3
          const roleB = roleOrder[b.role] ?? 3
          if (roleA !== roleB) return roleA - roleB
          return (a.first_name + ' ' + a.last_name).localeCompare(b.first_name + ' ' + b.last_name)

        case 'recursos':
          // Primero por Categoría, luego por Nombre
          const categoryOrder = { 'hardware': 0, 'software': 1, 'network': 2, 'security': 3, 'tools': 4, 'facilities': 5 }
          const catA = categoryOrder[a.category] ?? 6
          const catB = categoryOrder[b.category] ?? 6
          if (catA !== catB) return catA - catB
          return (a.name || '').localeCompare(b.name || '')

        case 'usuarios':
          // Primero por Departamento, luego por Nombre
          const deptOrder = { 'dtic': 0, 'sistemas': 1, 'redes': 2, 'seguridad': 3 }
          const deptA = deptOrder[a.department] ?? 4
          const deptB = deptOrder[b.department] ?? 4
          if (deptA !== deptB) return deptA - deptB
          return (a.first_name + ' ' + a.last_name).localeCompare(b.first_name + ' ' + b.last_name)

        case 'tareas':
          // Primero por Estado, luego por Nombre
          const statusOrder = { 'urgent': 0, 'pending': 1, 'in_progress': 2, 'completed': 3, 'cancelled': 4 }
          const statusA = statusOrder[a.status] ?? 5
          const statusB = statusOrder[b.status] ?? 5
          if (statusA !== statusB) return statusA - statusB
          return (a.title || '').localeCompare(b.title || '')

        default:
          return 0
      }
    })
  }

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

  const showCustomConfirmation = (message: string, action: () => void) => {
    setConfirmationMessage(message)
    setConfirmationAction(() => action)
    setShowConfirmation(true)
  }

  const showCustomNotification = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    setNotificationMessage(message)
    setNotificationType(type)
    setShowNotification(true)
    // Auto-hide after 5 seconds
    setTimeout(() => setShowNotification(false), 5000)
  }

  // Make functions available globally for EntityRow component
  React.useEffect(() => {
    ;(window as any).showCustomConfirmation = showCustomConfirmation
    ;(window as any).showCustomNotification = showCustomNotification
    ;(window as any).entityStore = store
    return () => {
      delete (window as any).showCustomConfirmation
      delete (window as any).showCustomNotification
      delete (window as any).entityStore
    }
  }, [])

  const handleAssignEntity = async (entityId: number, usuarioId: number) => {
    if (!usuarioId) {
      showCustomNotification('Debe seleccionar un usuario', 'error')
      return
    }

    try {
      await store.assignEntity?.(entityId, usuarioId)
      setShowAssignModal(false)
      setSelectedEntity(null)
      setSelectedUsuario(null)
      showCustomNotification('Recurso asignado exitosamente', 'success')
    } catch (error) {
      showCustomNotification('Error al asignar recurso', 'error')
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
                        {config.table.columns.filter((column: any) => !column.hidden).map((column: any) => (
                          <th key={column.key}>{column.label}</th>
                        ))}
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getSortedEntities().map((entity: any) => (
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
                          entityKey={entityKey}
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

      {/* Slide Panel Backdrop */}
      {showConfirmation && (
        <div
          className={`slide-panel-backdrop ${showConfirmation ? 'show' : ''}`}
          onClick={() => setShowConfirmation(false)}
        ></div>
      )}

      {/* Slide Panel for Confirmations */}
      <div className={`slide-panel ${showConfirmation ? 'show' : ''}`}>
        <div className="panel-header">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <i className="fas fa-exclamation-triangle me-2"></i>
              Confirmar Acción
            </h5>
            <button
              className="btn-close-panel"
              onClick={() => setShowConfirmation(false)}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
        <div className="panel-body">
          <p className="mb-4">{confirmationMessage}</p>
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-secondary flex-fill"
              onClick={() => setShowConfirmation(false)}
            >
              <i className="fas fa-times me-1"></i>
              Cancelar
            </button>
            <button
              className="btn btn-warning flex-fill"
              onClick={() => {
                if (confirmationAction) {
                  confirmationAction()
                }
                setShowConfirmation(false)
              }}
            >
              <i className="fas fa-check me-1"></i>
              Confirmar
            </button>
          </div>
        </div>
      </div>

      {/* Top Sliding Notification */}
      <div className={`top-notification ${showNotification ? 'show' : ''}`}>
        <div className={`alert alert-${notificationType === 'error' ? 'danger' : notificationType} alert-dismissible fade show d-flex align-items-center mb-0`}
             style={{ borderRadius: '8px', border: 'none' }}>
          <i className={`fas fa-${notificationType === 'success' ? 'check-circle' : notificationType === 'error' ? 'exclamation-triangle' : notificationType === 'warning' ? 'exclamation-circle' : 'info-circle'} fa-lg me-3`}></i>
          <div className="flex-grow-1">
            <strong>
              {notificationType === 'success' ? 'Éxito' :
               notificationType === 'error' ? 'Error' :
               notificationType === 'warning' ? 'Advertencia' : 'Información'}
            </strong>
            <div className="mt-1">{notificationMessage}</div>
          </div>
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowNotification(false)}
            aria-label="Cerrar"
          ></button>
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
const EntityRow = ({ entity, config, onAction, utils, entityKey }: any) => {
  // console.log('EntityRow - Rendering entity:', entity)
  // console.log('EntityRow - Config:', config)
  // console.log('EntityRow - Utils:', utils)
  // console.log('EntityRow - entityKey:', entityKey)

  return (
    <tr>
      {config.table.columns.filter((column: any) => !column.hidden).map((column: any) => {
        // console.log('EntityRow - Processing column:', column.key, 'Value:', entity[column.key])
        let cellValue: string | JSX.Element = '-'

        // Handle special formatters for optimized columns
        if (column.key === 'status_priority' && entityKey === 'tareas') {
          cellValue = formatStatusPriority(entity)
        } else if (column.key === 'assigned_resources' && entityKey === 'tareas') {
          cellValue = formatAssignedResources(entity)
        } else if (column.formatter && utils && utils[column.formatter]) {
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

        // Safeguard: Ensure cellValue is not an object (except valid React elements)
        if (typeof cellValue === 'object' && cellValue !== null && !React.isValidElement(cellValue)) {
          cellValue = 'N/A'
        }

        // Apply color styling for specific columns based on entity type
        const getCellStyle = () => {
          // Tareas - Estado
          if (entityKey === 'tareas' && column.key === 'status') {
            switch (entity[column.key]) {
              case 'pending': return { backgroundColor: '#fff3cd', color: '#856404', fontWeight: '600', padding: '4px 8px', borderRadius: '12px', fontSize: '0.85em', display: 'inline-block', margin: '2px 0' }
              case 'in_progress': return { backgroundColor: '#d1ecf1', color: '#0c5460', fontWeight: '600', padding: '4px 8px', borderRadius: '12px', fontSize: '0.85em', display: 'inline-block', margin: '2px 0' }
              case 'completed': return { backgroundColor: '#d4edda', color: '#155724', fontWeight: '600', padding: '4px 8px', borderRadius: '12px', fontSize: '0.85em', display: 'inline-block', margin: '2px 0' }
              case 'cancelled': return { backgroundColor: '#f8d7da', color: '#721c24', fontWeight: '600', padding: '4px 8px', borderRadius: '12px', fontSize: '0.85em', display: 'inline-block', margin: '2px 0' }
              default: return {}
            }
          }
          // Tareas - Prioridad
          if (entityKey === 'tareas' && column.key === 'priority') {
            switch (entity[column.key]) {
              case 'low': return { backgroundColor: '#d4edda', color: '#155724', fontWeight: '600', padding: '4px 8px', borderRadius: '12px', fontSize: '0.85em', display: 'inline-block', margin: '2px 0' }
              case 'medium': return { backgroundColor: '#fff3cd', color: '#856404', fontWeight: '600', padding: '4px 8px', borderRadius: '12px', fontSize: '0.85em', display: 'inline-block', margin: '2px 0' }
              case 'high': return { backgroundColor: '#ffeaa7', color: '#d63031', fontWeight: '600', padding: '4px 8px', borderRadius: '12px', fontSize: '0.85em', display: 'inline-block', margin: '2px 0' }
              case 'urgent': return { backgroundColor: '#fab1a0', color: '#e17055', fontWeight: '600', padding: '4px 8px', borderRadius: '12px', fontSize: '0.85em', display: 'inline-block', margin: '2px 0' }
              default: return {}
            }
          }
          // Tecnicos - Estado
          if (entityKey === 'tecnicos' && column.key === 'is_active') {
            const isActive = entity[column.key]
            return isActive
              ? { backgroundColor: '#d4edda', color: '#155724', fontWeight: '600', padding: '4px 8px', borderRadius: '12px', fontSize: '0.85em', display: 'inline-block', margin: '2px 0' }
              : { backgroundColor: '#f8d7da', color: '#721c24', fontWeight: '600', padding: '4px 8px', borderRadius: '12px', fontSize: '0.85em', display: 'inline-block', margin: '2px 0' }
          }
          // Tecnicos - Rol
          if (entityKey === 'tecnicos' && column.key === 'role') {
            switch (entity[column.key]) {
              case 'admin': return { backgroundColor: '#dc3545', color: 'white', fontWeight: '600', padding: '4px 8px', borderRadius: '12px', fontSize: '0.85em', display: 'inline-block', margin: '2px 0' }
              case 'technician': return { backgroundColor: '#17a2b8', color: 'white', fontWeight: '600', padding: '4px 8px', borderRadius: '12px', fontSize: '0.85em', display: 'inline-block', margin: '2px 0' }
              case 'viewer': return { backgroundColor: '#6c757d', color: 'white', fontWeight: '600', padding: '4px 8px', borderRadius: '12px', fontSize: '0.85em', display: 'inline-block', margin: '2px 0' }
              default: return {}
            }
          }
          // Recursos - Estado
          if (entityKey === 'recursos' && column.key === 'status') {
            switch (entity[column.key]) {
              case 'available': return { backgroundColor: '#d4edda', color: '#155724', fontWeight: '600', padding: '4px 8px', borderRadius: '12px', fontSize: '0.85em', display: 'inline-block', margin: '2px 0' }
              case 'assigned': return { backgroundColor: '#d1ecf1', color: '#0c5460', fontWeight: '600', padding: '4px 8px', borderRadius: '12px', fontSize: '0.85em', display: 'inline-block', margin: '2px 0' }
              case 'maintenance': return { backgroundColor: '#fff3cd', color: '#856404', fontWeight: '600', padding: '4px 8px', borderRadius: '12px', fontSize: '0.85em', display: 'inline-block', margin: '2px 0' }
              case 'retired': return { backgroundColor: '#f8d7da', color: '#721c24', fontWeight: '600', padding: '4px 8px', borderRadius: '12px', fontSize: '0.85em', display: 'inline-block', margin: '2px 0' }
              default: return {}
            }
          }
          // Recursos - Categoría
          if (entityKey === 'recursos' && column.key === 'category') {
            switch (entity[column.key]) {
              case 'hardware': return { backgroundColor: '#e3f2fd', color: '#1565c0', fontWeight: '600', padding: '4px 8px', borderRadius: '12px', fontSize: '0.85em', display: 'inline-block', margin: '2px 0' }
              case 'software': return { backgroundColor: '#f3e5f5', color: '#7b1fa2', fontWeight: '600', padding: '4px 8px', borderRadius: '12px', fontSize: '0.85em', display: 'inline-block', margin: '2px 0' }
              case 'network': return { backgroundColor: '#e8f5e8', color: '#2e7d32', fontWeight: '600', padding: '4px 8px', borderRadius: '12px', fontSize: '0.85em', display: 'inline-block', margin: '2px 0' }
              case 'security': return { backgroundColor: '#fff3e0', color: '#ef6c00', fontWeight: '600', padding: '4px 8px', borderRadius: '12px', fontSize: '0.85em', display: 'inline-block', margin: '2px 0' }
              case 'tools': return { backgroundColor: '#fce4ec', color: '#c2185b', fontWeight: '600', padding: '4px 8px', borderRadius: '12px', fontSize: '0.85em', display: 'inline-block', margin: '2px 0' }
              case 'facilities': return { backgroundColor: '#f1f8e9', color: '#558b2f', fontWeight: '600', padding: '4px 8px', borderRadius: '12px', fontSize: '0.85em', display: 'inline-block', margin: '2px 0' }
              default: return {}
            }
          }
          // Usuarios - Estado
          if (entityKey === 'usuarios' && column.key === 'status') {
            const status = entity[column.key]
            return status === 'active'
              ? { backgroundColor: '#d4edda', color: '#155724', fontWeight: '600', padding: '4px 8px', borderRadius: '12px', fontSize: '0.85em', display: 'inline-block', margin: '2px 0' }
              : { backgroundColor: '#f8d7da', color: '#721c24', fontWeight: '600', padding: '4px 8px', borderRadius: '12px', fontSize: '0.85em', display: 'inline-block', margin: '2px 0' }
          }
          // Usuarios - Departamento
          if (entityKey === 'usuarios' && column.key === 'department') {
            switch (entity[column.key]) {
              case 'dtic': return { backgroundColor: '#e3f2fd', color: '#1565c0', fontWeight: '600', padding: '4px 8px', borderRadius: '12px', fontSize: '0.85em', display: 'inline-block', margin: '2px 0' }
              case 'sistemas': return { backgroundColor: '#f3e5f5', color: '#7b1fa2', fontWeight: '600', padding: '4px 8px', borderRadius: '12px', fontSize: '0.85em', display: 'inline-block', margin: '2px 0' }
              case 'redes': return { backgroundColor: '#e8f5e8', color: '#2e7d32', fontWeight: '600', padding: '4px 8px', borderRadius: '12px', fontSize: '0.85em', display: 'inline-block', margin: '2px 0' }
              case 'seguridad': return { backgroundColor: '#fff3e0', color: '#ef6c00', fontWeight: '600', padding: '4px 8px', borderRadius: '12px', fontSize: '0.85em', display: 'inline-block', margin: '2px 0' }
              default: return {}
            }
          }
          return {}
        }

        const cellStyle = getCellStyle()
        return (
          <td key={column.key} style={cellStyle.display === 'inline-block' ? { verticalAlign: 'middle', textAlign: 'center' } : {}}>
            {cellStyle.display === 'inline-block' ? (
              <span style={cellStyle}>{cellValue}</span>
            ) : (
              cellValue
            )}
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
              onClick={() => {
                if (action.key === 'delete') {
                  // Sistema inteligente de eliminación/desactivación
                  const entityName = entity.first_name || entity.name || 'este elemento'

                  if (entity.is_active === false) {
                    // Si ya está inactivo, confirmar eliminación permanente
                    const confirmMessage = `¿Estás seguro de que deseas eliminar permanentemente a ${entityName}? Esta acción no se puede deshacer.`

                    const deleteAction = async () => {
                      try {
                        await (window as any).entityStore.deleteEntity(entity.id)
                        ;(window as any).showCustomNotification('Elemento eliminado permanentemente', 'success')
                      } catch (error) {
                        ;(window as any).showCustomNotification(error instanceof Error ? error.message : 'Error al eliminar', 'error')
                      }
                    }

                    ;(window as any).showCustomConfirmation(confirmMessage, deleteAction)
                  } else {
                    // Si está activo, mostrar opciones inteligentes
                    const hasActiveTasks = entity.active_tasks_count > 0 // Asumiendo que el backend proporciona esto
                    const isAdmin = entity.role === 'admin'

                    let confirmMessage = ''
                    let primaryAction = null
                    let secondaryAction = null

                    if (isAdmin) {
                      confirmMessage = `El administrador ${entity.first_name} ${entity.last_name} tiene acceso completo al sistema. ¿Qué deseas hacer?`
                      primaryAction = {
                        label: 'Desactivar Administrador',
                        action: async () => {
                          try {
                            await (window as any).entityStore.toggleEntityStatus(entity.id, false)
                            ;(window as any).showCustomNotification('Administrador desactivado exitosamente', 'success')
                          } catch (error) {
                            ;(window as any).showCustomNotification(error instanceof Error ? error.message : 'Error al desactivar', 'error')
                          }
                        }
                      }
                      secondaryAction = {
                        label: 'Eliminar Permanentemente',
                        action: async () => {
                          try {
                            await (window as any).entityStore.deleteEntity(entity.id)
                            ;(window as any).showCustomNotification('Administrador eliminado permanentemente', 'success')
                          } catch (error) {
                            ;(window as any).showCustomNotification(error instanceof Error ? error.message : 'Error al eliminar', 'error')
                          }
                        }
                      }
                    } else {
                      // Mostrar opciones simples sin verificación de tareas (por simplicidad)
                      const showSmartConfirmation = (message: string, primary: any, secondary: any) => {
                        // Crear un panel personalizado con dos opciones
                        const customPanel = document.createElement('div')
                        customPanel.className = 'slide-panel show'
                        customPanel.style.cssText = `
                          position: fixed;
                          top: 50%;
                          right: 20px;
                          width: 450px;
                          height: auto;
                          max-height: 80vh;
                          background: white;
                          box-shadow: -4px 4px 20px rgba(0,0,0,0.15);
                          z-index: 1050;
                          border-radius: 12px 0 0 12px;
                          transform: translateY(-50%);
                        `

                        customPanel.innerHTML = `
                          <div style="background: linear-gradient(135deg, #ffc107 0%, #ff8c00 100%); color: white; padding: 1.25rem 1.5rem; border-radius: 12px 0 0 0;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                              <h5 style="margin: 0;"><i class="fas fa-exclamation-triangle me-2"></i>Confirmar Acción</h5>
                              <button class="btn-close-panel" style="background: none; border: none; color: white; font-size: 1.25rem; opacity: 0.8; padding: 0.25rem; border-radius: 4px;">
                                <i class="fas fa-times"></i>
                              </button>
                            </div>
                          </div>
                          <div style="padding: 1.5rem;">
                            <p style="margin-bottom: 1.5rem;">${message}</p>
                            <div style="display: flex; gap: 0.5rem;">
                              <button class="btn btn-outline-secondary flex-fill" style="padding: 0.5rem 1rem;">
                                <i class="fas fa-times me-1"></i>
                                Cancelar
                              </button>
                              <button class="btn btn-warning flex-fill" style="padding: 0.5rem 1rem;">
                                <i class="fas fa-ban me-1"></i>
                                ${primary.label}
                              </button>
                              <button class="btn btn-danger flex-fill" style="padding: 0.5rem 1rem;">
                                <i class="fas fa-trash me-1"></i>
                                ${secondary.label}
                              </button>
                            </div>
                          </div>
                        `

                        // Backdrop
                        const backdrop = document.createElement('div')
                        backdrop.className = 'slide-panel-backdrop show'
                        backdrop.style.cssText = `
                          position: fixed;
                          top: 0;
                          left: 0;
                          width: 100vw;
                          height: 100vh;
                          background: rgba(0,0,0,0.3);
                          z-index: 1049;
                          opacity: 1;
                        `

                        // Event listeners
                        const closePanel = () => {
                          customPanel.remove()
                          backdrop.remove()
                        }

                        backdrop.onclick = closePanel
                        customPanel.querySelector('.btn-close-panel').onclick = closePanel
                        customPanel.querySelector('.btn-outline-secondary').onclick = closePanel

                        const primaryBtn = customPanel.querySelector('.btn-warning')
                        primaryBtn.onclick = async () => {
                          closePanel()
                          await primary.action()
                        }

                        const secondaryBtn = customPanel.querySelector('.btn-danger')
                        secondaryBtn.onclick = async () => {
                          closePanel()
                          await secondary.action()
                        }

                        document.body.appendChild(backdrop)
                        document.body.appendChild(customPanel)
                      }

                      showSmartConfirmation(`¿Qué deseas hacer con ${entityName}?`, {
                        label: 'Desactivar',
                        action: async () => {
                          try {
                            await (window as any).entityStore.toggleEntityStatus(entity.id, false)
                            ;(window as any).showCustomNotification('Elemento desactivado exitosamente', 'success')
                          } catch (error) {
                            ;(window as any).showCustomNotification(error instanceof Error ? error.message : 'Error al desactivar', 'error')
                          }
                        }
                      }, {
                        label: 'Eliminar Permanentemente',
                        action: async () => {
                          try {
                            await (window as any).entityStore.deleteEntity(entity.id)
                            ;(window as any).showCustomNotification('Elemento eliminado permanentemente', 'success')
                          } catch (error) {
                            ;(window as any).showCustomNotification(error instanceof Error ? error.message : 'Error al eliminar', 'error')
                          }
                        }
                      })
                    }

                    // Mostrar panel con opciones
                    const showSmartConfirmation = (message: string, primary: any, secondary: any) => {
                      // Crear un panel personalizado con dos opciones
                      const customPanel = document.createElement('div')
                      customPanel.className = 'slide-panel show'
                      customPanel.style.cssText = `
                        position: fixed;
                        top: 50%;
                        right: 20px;
                        width: 450px;
                        height: auto;
                        max-height: 80vh;
                        background: white;
                        box-shadow: -4px 4px 20px rgba(0,0,0,0.15);
                        z-index: 1050;
                        border-radius: 12px 0 0 12px;
                        transform: translateY(-50%);
                      `

                      customPanel.innerHTML = `
                        <div style="background: linear-gradient(135deg, #ffc107 0%, #ff8c00 100%); color: white; padding: 1.25rem 1.5rem; border-radius: 12px 0 0 0;">
                          <div style="display: flex; justify-content: space-between; align-items: center;">
                            <h5 style="margin: 0;"><i class="fas fa-exclamation-triangle me-2"></i>Confirmar Acción</h5>
                            <button class="btn-close-panel" style="background: none; border: none; color: white; font-size: 1.25rem; opacity: 0.8; padding: 0.25rem; border-radius: 4px;">
                              <i class="fas fa-times"></i>
                            </button>
                          </div>
                        </div>
                        <div style="padding: 1.5rem;">
                          <p style="margin-bottom: 1.5rem;">${message}</p>
                          <div style="display: flex; gap: 0.5rem;">
                            <button class="btn btn-outline-secondary flex-fill" style="padding: 0.5rem 1rem;">
                              <i class="fas fa-times me-1"></i>
                              Cancelar
                            </button>
                            <button class="btn ${primary.label.includes('Recomendado') ? 'btn-success' : 'btn-warning'} flex-fill" style="padding: 0.5rem 1rem;">
                              <i class="fas fa-${primary.label.includes('Desactivar') ? 'ban' : 'trash'} me-1"></i>
                              ${primary.label}
                            </button>
                            ${secondary ? `<button class="btn btn-danger flex-fill" style="padding: 0.5rem 1rem;">
                              <i class="fas fa-${secondary.label.includes('Eliminar') ? 'trash' : 'exclamation-triangle'} me-1"></i>
                              ${secondary.label}
                            </button>` : ''}
                          </div>
                        </div>
                      `

                      // Backdrop
                      const backdrop = document.createElement('div')
                      backdrop.className = 'slide-panel-backdrop show'
                      backdrop.style.cssText = `
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100vw;
                        height: 100vh;
                        background: rgba(0,0,0,0.3);
                        z-index: 1049;
                        opacity: 1;
                      `

                      // Event listeners
                      const closePanel = () => {
                        customPanel.remove()
                        backdrop.remove()
                      }

                      backdrop.onclick = closePanel
                      customPanel.querySelector('.btn-close-panel').onclick = closePanel
                      customPanel.querySelector('.btn-outline-secondary').onclick = closePanel

                      const primaryBtn = customPanel.querySelector(`.btn-${primary.label.includes('Recomendado') ? 'success' : 'warning'}`)
                      primaryBtn.onclick = async () => {
                        closePanel()
                        await primary.action()
                      }

                      if (secondary) {
                        const secondaryBtn = customPanel.querySelector('.btn-danger')
                        secondaryBtn.onclick = async () => {
                          closePanel()
                          await secondary.action()
                        }
                      }

                      document.body.appendChild(backdrop)
                      document.body.appendChild(customPanel)
                    }

                    showSmartConfirmation(confirmMessage, primaryAction, secondaryAction)
                  }
                } else if (action.key === 'toggleStatus') {
                  // Usar confirmación para activar/desactivar
                  const actionText = entity.is_active ? 'desactivar' : 'reactivar'
                  const confirmMessage = `¿Estás seguro de que deseas ${actionText} a ${entity.first_name || entity.name || 'este elemento'}?`

                  const toggleAction = async () => {
                    try {
                      await (window as any).entityStore.toggleEntityStatus(entity.id, !entity.is_active)
                      ;(window as any).showCustomNotification(`Elemento ${actionText}do exitosamente`, 'success')
                    } catch (error) {
                      ;(window as any).showCustomNotification(error instanceof Error ? error.message : 'Error al cambiar estado', 'error')
                    }
                  }

                  showCustomConfirmation(confirmMessage, toggleAction)
                } else {
                  onAction(action.key)
                }
              }}
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