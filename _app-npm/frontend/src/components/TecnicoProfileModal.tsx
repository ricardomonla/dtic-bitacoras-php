import { useEffect, useState } from 'react'
import { Tecnico } from '../stores/tecnicosStore'
import { ResourceAssignmentControl } from './common/ResourceAssignmentControl'
import { useResourceAssignment } from '../hooks/useResourceAssignment'

interface TecnicoProfileModalProps {
  tecnico: Tecnico | null
  isOpen: boolean
  onClose: () => void
  onEdit: (id: number) => void
}

interface TecnicoStats {
  total_tasks: number
  completed_tasks: number
  active_tasks: number
  recent_tasks: any[]
}

const TecnicoProfileModal = ({ tecnico, isOpen, onClose, onEdit }: TecnicoProfileModalProps) => {
  const [stats, setStats] = useState<TecnicoStats | null>(null)
  const [loading, setLoading] = useState(false)
  
  // Initialize resource assignment hook for this tecnico
  const resourceAssignment = useResourceAssignment('tecnico', tecnico.id)
  
  // Load assigned resources when modal opens
  useEffect(() => {
    if (isOpen && tecnico) {
      resourceAssignment.refreshAssignments()
    }
  }, [isOpen, tecnico?.id])

  useEffect(() => {
    if (tecnico && isOpen) {
      fetchTecnicoStats()
    }
  }, [tecnico, isOpen])

  const fetchTecnicoStats = async () => {
    if (!tecnico) return

    setLoading(true)
    try {
      const response = await fetch(`http://localhost:3001/api/tecnicos/${tecnico.id}?include_tasks=true`)
      const data = await response.json()

      if (data.success) {
        setStats({
          total_tasks: data.data.technician.total_tasks || 0,
          completed_tasks: data.data.technician.completed_tasks || 0,
          active_tasks: data.data.technician.active_tasks || 0,
          recent_tasks: data.data.technician.recent_tasks || []
        })
      }
    } catch (error) {
      console.error('Error fetching tecnico stats:', error)
    } finally {
      setLoading(false)
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

  if (!isOpen || !tecnico) return null

  return (
    <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">
              <i className="fas fa-user me-2"></i>Perfil de {tecnico.first_name} {tecnico.last_name}
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
                  <i className="fas fa-user"></i>
                </div>
                <h5 className="mb-1">{tecnico.full_name}</h5>
                <span className={`badge fs-6 mb-2 ${tecnico.role === 'admin' ? 'bg-danger' : tecnico.role === 'technician' ? 'bg-info' : 'bg-secondary'}`}>
                  {formatRole(tecnico.role)}
                </span>
                <div>
                  <span className={`badge ${tecnico.is_active ? 'bg-success' : 'bg-warning'} fs-6`}>
                    {tecnico.is_active ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>

              {/* Información detallada */}
              <div className="col-md-8">
                <div className="row">
                  <div className="col-sm-6">
                    <div className="mb-3">
                      <strong className="text-muted d-block">ID DTIC</strong>
                      <span className="badge bg-light text-dark fs-6">{tecnico.dtic_id}</span>
                    </div>
                    <div className="mb-3">
                      <strong className="text-muted d-block">Email</strong>
                      <span>{tecnico.email}</span>
                    </div>
                    <div className="mb-3">
                      <strong className="text-muted d-block">Teléfono</strong>
                      <span>{tecnico.phone || 'No especificado'}</span>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="mb-3">
                      <strong className="text-muted d-block">Departamento</strong>
                      <span>{formatDepartment(tecnico.department)}</span>
                    </div>
                    <div className="mb-3">
                      <strong className="text-muted d-block">Registro</strong>
                      <span>{formatDate(tecnico.created_at)}</span>
                    </div>
                    <div className="mb-3">
                      <strong className="text-muted d-block">Última actualización</strong>
                      <span>{formatDate(tecnico.updated_at)}</span>
                    </div>
                  </div>
                </div>

                <hr />

                {/* Estadísticas de tareas */}
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

                {/* Resource Assignment Control */}
                <hr className="my-4" />
                <h6 className="fw-bold text-info mb-3">
                  <i className="fas fa-boxes me-2"></i>Gestión de Recursos Asignados
                </h6>
                <ResourceAssignmentControl
                  entityId={tecnico.id}
                  entityType="tecnico"
                  assignedResources={resourceAssignment.assignedResources}
                  availableResources={resourceAssignment.availableResources}
                  onAssignResource={resourceAssignment.assignResource}
                  onUnassignResource={resourceAssignment.unassignResource}
                  loading={resourceAssignment.loading}
                  className="border-0 p-0"
                  showAddIcon={true}
                  maxHeight="250px"
                />
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
                onEdit(tecnico.id)
              }}
            >
              <i className="fas fa-edit me-2"></i>Editar Técnico
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TecnicoProfileModal