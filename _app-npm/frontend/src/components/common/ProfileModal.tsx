import { useEffect, useState } from 'react'
import { EntityConfig } from '../../stores/genericEntityStore'

interface ProfileModalProps {
  entity: any
  entityKey: string
  config: EntityConfig
  isOpen: boolean
  onClose: () => void
  onEdit: (id: number) => void
}

interface EntityStats {
  total_tasks?: number
  completed_tasks?: number
  active_tasks?: number
  recent_tasks?: any[]
  assigned_resources_count?: number
}

const ProfileModal = ({ entity, entityKey, config, isOpen, onClose, onEdit }: ProfileModalProps) => {
  const [stats, setStats] = useState<EntityStats | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (entity && isOpen) {
      fetchEntityStats()
    }
  }, [entity, isOpen])

  const fetchEntityStats = async () => {
    if (!entity) return

    setLoading(true)
    try {
      const response = await fetch(`http://localhost:3001/api/${entityKey}/${entity.id}?include_tasks=true`)
      const data = await response.json()

      if (data.success) {
        setStats({
          total_tasks: data.data.technician?.total_tasks || data.data.tarea?.total_tasks || 0,
          completed_tasks: data.data.technician?.completed_tasks || data.data.tarea?.completed_tasks || 0,
          active_tasks: data.data.technician?.active_tasks || data.data.tarea?.active_tasks || 0,
          recent_tasks: data.data.technician?.recent_tasks || data.data.tarea?.recent_tasks || [],
          assigned_resources_count: data.data.usuario?.assigned_resources_count || 0
        })
      }
    } catch (error) {
      console.error('Error fetching entity stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTaskStatus = (status: string) => {
    const statuses = {
      'pending': 'Pendiente',
      'in_progress': 'En Progreso',
      'completed': 'Completada',
      'cancelled': 'Cancelada'
    }
    return statuses[status as keyof typeof statuses] || status
  }

  const getEntityIcon = () => {
    const icons: { [key: string]: string } = {
      'tecnicos': 'fa-user',
      'recursos': 'fa-box',
      'usuarios': 'fa-user-cog',
      'tareas': 'fa-tasks'
    }
    return icons[entityKey] || 'fa-info-circle'
  }

  const getEntityTitle = () => {
    const titles: { [key: string]: string } = {
      'tecnicos': 'Perfil de Técnico',
      'recursos': 'Detalles del Recurso',
      'usuarios': 'Perfil de Usuario',
      'tareas': 'Detalles de Tarea'
    }
    return titles[entityKey] || 'Detalles'
  }

  if (!isOpen || !entity) return null

  return (
    <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">
              <i className={`fas ${getEntityIcon()} me-2`}></i>
              {getEntityTitle()}: {entity.first_name ? `${entity.first_name} ${entity.last_name}` : entity.name || entity.title || 'Sin nombre'}
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body">
            <div className="row">
              {/* Información básica y avatar */}
              <div className="col-md-4 text-center mb-4">
                <div className="avatar-circle bg-primary text-white mx-auto mb-3"
                     style={{ width: '80px', height: '80px', fontSize: '2rem', border: '4px solid #dee2e6' }}>
                  <i className={`fas ${getEntityIcon()}`}></i>
                </div>
                <h5 className="mb-1">{entity.first_name ? `${entity.first_name} ${entity.last_name}` : entity.name || entity.title || 'Sin nombre'}</h5>
                {entity.role && (
                  <span className={`badge fs-6 mb-2 ${entity.role === 'admin' ? 'bg-danger' : entity.role === 'technician' ? 'bg-info' : 'bg-secondary'}`}>
                    {entity.role === 'admin' ? 'Administrador' : entity.role === 'technician' ? 'Técnico' : entity.role === 'viewer' ? 'Visualizador' : entity.role}
                  </span>
                )}
                {entity.status && (
                  <div>
                    <span className={`badge ${entity.status === 'active' || entity.is_active ? 'bg-success' : 'bg-warning'} fs-6`}>
                      {entity.status === 'active' || entity.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                )}
              </div>

              {/* Información detallada */}
              <div className="col-md-8">
                <div className="row">
                  <div className="col-sm-6">
                    <div className="mb-3">
                      <strong className="text-muted d-block">ID DTIC</strong>
                      <span className="badge bg-light text-dark fs-6">{entity.dtic_id}</span>
                    </div>
                    {entity.email && (
                      <div className="mb-3">
                        <strong className="text-muted d-block">Email</strong>
                        <span>{entity.email}</span>
                      </div>
                    )}
                    {entity.phone && (
                      <div className="mb-3">
                        <strong className="text-muted d-block">Teléfono</strong>
                        <span>{entity.phone || 'No especificado'}</span>
                      </div>
                    )}
                  </div>
                  <div className="col-sm-6">
                    {entity.department && (
                      <div className="mb-3">
                        <strong className="text-muted d-block">Departamento</strong>
                        <span>{entity.department}</span>
                      </div>
                    )}
                    {entity.created_at && (
                      <div className="mb-3">
                        <strong className="text-muted d-block">Registro</strong>
                        <span>{formatDate(entity.created_at)}</span>
                      </div>
                    )}
                    {entity.updated_at && (
                      <div className="mb-3">
                        <strong className="text-muted d-block">Última actualización</strong>
                        <span>{formatDate(entity.updated_at)}</span>
                      </div>
                    )}
                  </div>
                </div>

                <hr />

                {/* Estadísticas específicas por entidad */}
                {entityKey === 'tecnicos' && (
                  <>
                    <h6 className="fw-bold text-primary mb-3">
                      <i className="fas fa-chart-bar me-2"></i>Estadísticas de Tareas
                    </h6>

                    {loading ? (
                      <div className="text-center py-3">
                        <div className="spinner-border spinner-border-sm text-primary" role="status">
                          <span className="visually-hidden">Cargando...</span>
                        </div>
                      </div>
                    ) : stats ? (
                      <div className="row text-center mb-4">
                        <div className="col-sm-4">
                          <div className="p-3 bg-light rounded">
                            <div className="h4 text-primary mb-1">{stats.total_tasks}</div>
                            <small className="text-muted fw-bold">Total Tareas</small>
                          </div>
                        </div>
                        <div className="col-sm-4">
                          <div className="p-3 bg-success rounded text-white">
                            <div className="h4 mb-1">{stats.completed_tasks}</div>
                            <small className="fw-bold">Completadas</small>
                          </div>
                        </div>
                        <div className="col-sm-4">
                          <div className="p-3 bg-warning rounded">
                            <div className="h4 text-dark mb-1">{stats.active_tasks}</div>
                            <small className="text-dark fw-bold">Activas</small>
                          </div>
                        </div>
                      </div>
                    ) : null}

                    {/* Tareas recientes */}
                    {stats && stats.recent_tasks && stats.recent_tasks.length > 0 && (
                      <>
                        <h6 className="fw-bold text-primary mb-3">
                          <i className="fas fa-clock me-2"></i>Tareas Recientes
                        </h6>
                        <div className="list-group">
                          {stats.recent_tasks.slice(0, 3).map((task: any, index: number) => (
                            <div key={index} className="list-group-item">
                              <div className="d-flex w-100 justify-content-between">
                                <h6 className="mb-1">{task.title}</h6>
                                <small className={`badge ${
                                  task.status === 'completed' ? 'bg-success' :
                                  task.status === 'in_progress' ? 'bg-warning text-dark' :
                                  'bg-secondary'
                                }`}>
                                  {formatTaskStatus(task.status)}
                                </small>
                              </div>
                              <p className="mb-1">{task.description || 'Sin descripción'}</p>
                              <small className="text-muted">
                                Creada: {formatDate(task.created_at)}
                                {task.due_date && ` • Vence: ${formatDate(task.due_date)}`}
                              </small>
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    {stats && (!stats.recent_tasks || stats.recent_tasks.length === 0) && (
                      <div className="text-center py-4 text-muted">
                        <i className="fas fa-inbox fa-2x mb-2"></i>
                        <p>No hay tareas recientes</p>
                      </div>
                    )}
                  </>
                )}

                {entityKey === 'usuarios' && stats && (
                  <>
                    <h6 className="fw-bold text-primary mb-3">
                      <i className="fas fa-chart-bar me-2"></i>Estadísticas de Recursos
                    </h6>
                    <div className="row text-center mb-4">
                      <div className="col-sm-6">
                        <div className="p-3 bg-info rounded text-white">
                          <div className="h4 mb-1">{stats.assigned_resources_count || 0}</div>
                          <small className="fw-bold">Recursos Asignados</small>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="p-3 bg-success rounded text-white">
                          <div className="h4 mb-1">{entity.position || 'Sin cargo'}</div>
                          <small className="fw-bold">Cargo</small>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {entityKey === 'recursos' && (
                  <>
                    <h6 className="fw-bold text-primary mb-3">
                      <i className="fas fa-info-circle me-2"></i>Detalles del Recurso
                    </h6>
                    <div className="row">
                      <div className="col-sm-6">
                        <div className="mb-3">
                          <strong className="text-muted d-block">Categoría</strong>
                          <span>{entity.category}</span>
                        </div>
                        <div className="mb-3">
                          <strong className="text-muted d-block">Estado</strong>
                          <span className={`badge ${entity.status === 'available' ? 'bg-success' : entity.status === 'assigned' ? 'bg-info' : 'bg-warning'}`}>
                            {entity.status === 'available' ? 'Disponible' : entity.status === 'assigned' ? 'Asignado' : entity.status === 'maintenance' ? 'Mantenimiento' : entity.status}
                          </span>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="mb-3">
                          <strong className="text-muted d-block">Ubicación</strong>
                          <span>{entity.location || 'No especificada'}</span>
                        </div>
                        <div className="mb-3">
                          <strong className="text-muted d-block">Modelo</strong>
                          <span>{entity.model || 'No especificado'}</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {entityKey === 'tareas' && (
                  <>
                    <h6 className="fw-bold text-primary mb-3">
                      <i className="fas fa-tasks me-2"></i>Detalles de la Tarea
                    </h6>
                    <div className="row">
                      <div className="col-sm-6">
                        <div className="mb-3">
                          <strong className="text-muted d-block">Estado</strong>
                          <span className={`badge ${entity.status === 'completed' ? 'bg-success' : entity.status === 'in_progress' ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                            {formatTaskStatus(entity.status)}
                          </span>
                        </div>
                        <div className="mb-3">
                          <strong className="text-muted d-block">Prioridad</strong>
                          <span className={`badge ${entity.priority === 'urgent' ? 'bg-danger' : entity.priority === 'high' ? 'bg-warning text-dark' : entity.priority === 'medium' ? 'bg-info' : 'bg-light text-dark'}`}>
                            {entity.priority === 'urgent' ? 'Urgente' : entity.priority === 'high' ? 'Alta' : entity.priority === 'medium' ? 'Media' : 'Baja'}
                          </span>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="mb-3">
                          <strong className="text-muted d-block">Fecha Límite</strong>
                          <span>{entity.due_date ? formatDate(entity.due_date) : 'Sin fecha límite'}</span>
                        </div>
                        <div className="mb-3">
                          <strong className="text-muted d-block">Técnico Asignado</strong>
                          <span>{entity.technician_name || 'Sin asignar'}</span>
                        </div>
                      </div>
                    </div>
                    {entity.description && (
                      <div className="mb-3">
                        <strong className="text-muted d-block">Descripción</strong>
                        <p className="mb-0">{entity.description}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              <i className="fas fa-times me-2"></i>Cerrar
            </button>
            <button
              type="button"
              className="btn btn-warning"
              onClick={() => {
                onClose()
                onEdit(entity.id)
              }}
            >
              <i className="fas fa-edit me-2"></i>Editar {config.name.slice(0, -1)}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export { ProfileModal }