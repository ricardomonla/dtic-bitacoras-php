import { useEffect, useState } from 'react'
import { Recurso } from '../stores/recursosStore'
import { recursoUtils } from '../utils/entityUtils'
import { ResourceAssignmentControl } from './common/ResourceAssignmentControl'
import { useResourceAssignment } from '../hooks/useResourceAssignment'

interface RecursoProfileModalProps {
  recurso: Recurso | null
  isOpen: boolean
  onClose: () => void
  onEdit: (id: number) => void
}

interface RecursoStats {
  total_assignments: number
  active_assignments: number
  assignment_history: any[]
  maintenance_history: any[]
}

const RecursoProfileModal = ({ recurso, isOpen, onClose, onEdit }: RecursoProfileModalProps) => {
  const [stats, setStats] = useState<RecursoStats | null>(null)
  const [loading, setLoading] = useState(false)
  
  // Initialize resource assignment hook for this recurso
  const resourceAssignment = useResourceAssignment('recurso', recurso.id)
  
  // Load assigned resources when modal opens
  useEffect(() => {
    if (isOpen && recurso) {
      resourceAssignment.refreshAssignments()
    }
  }, [isOpen, recurso?.id])

  useEffect(() => {
    if (recurso && isOpen) {
      fetchRecursoStats()
    }
  }, [recurso, isOpen])

  const fetchRecursoStats = async () => {
    if (!recurso) return

    setLoading(true)
    try {
      const response = await fetch(`/api/recursos/${recurso.id}?include_history=true`)
      const data = await response.json()

      if (data.success) {
        setStats({
          total_assignments: data.data.resource.total_assignments || 0,
          active_assignments: data.data.resource.active_assignments || 0,
          assignment_history: data.data.resource.assignment_history || [],
          maintenance_history: data.data.resource.maintenance_history || []
        })
      }
    } catch (error) {
      console.error('Error fetching recurso stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!isOpen || !recurso) return null

  return (
    <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">
              <i className={`fas ${recursoUtils.getIcon(recurso.category)} me-2`}></i>Perfil de {recurso.name}
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
                  <i className={`fas ${recursoUtils.getIcon(recurso.category)}`}></i>
                </div>
                <h5 className="mb-1">{recurso.name}</h5>
                <span className={`badge fs-6 mb-2 ${recurso.status === 'available' ? 'bg-success' : recurso.status === 'assigned' ? 'bg-info' : recurso.status === 'maintenance' ? 'bg-warning' : 'bg-secondary'}`}>
                  {recursoUtils.getBadge(recurso.status).text}
                </span>
                <div>
                  <span className={`badge fs-6 ${recurso.category === 'hardware' ? 'bg-primary' : recurso.category === 'software' ? 'bg-info' : recurso.category === 'network' ? 'bg-success' : recurso.category === 'security' ? 'bg-danger' : 'bg-secondary'}`}>
                    {recursoUtils.formatCategory(recurso.category)}
                  </span>
                </div>
              </div>

              {/* Información detallada */}
              <div className="col-md-8">
                <div className="row">
                  <div className="col-sm-6">
                    <div className="mb-3">
                      <strong className="text-muted d-block">ID DTIC</strong>
                      <span className="badge bg-light text-dark fs-6">{recurso.dtic_id}</span>
                    </div>
                    <div className="mb-3">
                      <strong className="text-muted d-block">Categoría</strong>
                      <span>{recursoUtils.formatCategory(recurso.category)}</span>
                    </div>
                    <div className="mb-3">
                      <strong className="text-muted d-block">Estado</strong>
                      <span className={`badge ${recurso.status === 'available' ? 'bg-success' : recurso.status === 'assigned' ? 'bg-info' : recurso.status === 'maintenance' ? 'bg-warning' : 'bg-secondary'}`}>
                        {recursoUtils.getBadge(recurso.status).text}
                      </span>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="mb-3">
                      <strong className="text-muted d-block">Ubicación</strong>
                      <span>{recurso.location || 'No especificada'}</span>
                    </div>
                    <div className="mb-3">
                      <strong className="text-muted d-block">Modelo</strong>
                      <span>{recurso.model || 'No especificado'}</span>
                    </div>
                    <div className="mb-3">
                      <strong className="text-muted d-block">Número de Serie</strong>
                      <span>{recurso.serial_number || 'No especificado'}</span>
                    </div>
                  </div>
                </div>

                {recurso.description && (
                  <>
                    <hr />
                    <div className="mb-3">
                      <strong className="text-muted d-block">Descripción</strong>
                      <p className="mb-0">{recurso.description}</p>
                    </div>
                  </>
                )}

                {recurso.technical_specs && (
                  <>
                    <hr />
                    <div className="mb-3">
                      <strong className="text-muted d-block">Especificaciones Técnicas</strong>
                      <pre className="bg-light p-2 rounded small">{JSON.stringify(recurso.technical_specs, null, 2)}</pre>
                    </div>
                  </>
                )}

                <hr />

                {/* Estadísticas de asignaciones */}
                <h6 className="fw-bold text-primary mb-3">
                  <i className="fas fa-chart-bar me-2"></i>Estadísticas de Asignaciones
                </h6>

                {loading ? (
                  <div className="text-center py-3">
                    <div className="spinner-border spinner-border-sm text-primary" role="status">
                      <span className="visually-hidden">Cargando...</span>
                    </div>
                  </div>
                ) : stats ? (
                  <div className="row text-center mb-4">
                    <div className="col-sm-6">
                      <div className="p-3 bg-light rounded">
                        <div className="h4 text-primary mb-1">{stats.total_assignments}</div>
                        <small className="text-muted fw-bold">Total Asignaciones</small>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="p-3 bg-info rounded text-white">
                        <div className="h4 mb-1">{stats.active_assignments}</div>
                        <small className="fw-bold">Asignaciones Activas</small>
                      </div>
                    </div>
                  </div>
                ) : null}

                {/* Historial de asignaciones */}
                {stats && stats.assignment_history && stats.assignment_history.length > 0 && (
                  <>
                    <h6 className="fw-bold text-primary mb-3">
                      <i className="fas fa-history me-2"></i>Historial de Asignaciones
                    </h6>
                    <div className="list-group mb-4">
                      {stats.assignment_history.slice(0, 5).map((assignment: any, index: number) => (
                        <div key={index} className="list-group-item">
                          <div className="d-flex w-100 justify-content-between">
                            <h6 className="mb-1">{assignment.usuario_name || 'Usuario desconocido'}</h6>
                            <small className={`badge ${assignment.action === 'assigned' ? 'bg-success' : 'bg-warning'}`}>
                              {assignment.action === 'assigned' ? 'Asignado' : 'Desasignado'}
                            </small>
                          </div>
                          <p className="mb-1">ID DTIC: {assignment.usuario_dtic_id}</p>
                          <small className="text-muted">
                            {assignment.action === 'assigned' ? 'Asignado' : 'Desasignado'}: {formatDate(assignment.created_at)}
                            {assignment.tecnico_name && ` • Por: ${assignment.tecnico_name}`}
                          </small>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Historial de mantenimiento */}
                {stats && stats.maintenance_history && stats.maintenance_history.length > 0 && (
                  <>
                    <h6 className="fw-bold text-warning mb-3">
                      <i className="fas fa-tools me-2"></i>Historial de Mantenimiento
                    </h6>
                    <div className="list-group">
                      {stats.maintenance_history.slice(0, 3).map((maintenance: any, index: number) => (
                        <div key={index} className="list-group-item">
                          <div className="d-flex w-100 justify-content-between">
                            <h6 className="mb-1">{maintenance.action || 'Mantenimiento'}</h6>
                            <small className="badge bg-warning text-dark">
                              {formatDate(maintenance.created_at)}
                            </small>
                          </div>
                          {maintenance.details && <p className="mb-1">{maintenance.details}</p>}
                          <small className="text-muted">
                            {maintenance.tecnico_name && `Técnico: ${maintenance.tecnico_name}`}
                          </small>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {stats && (!stats.assignment_history || stats.assignment_history.length === 0) &&
                         (!stats.maintenance_history || stats.maintenance_history.length === 0) && (
                  <div className="text-center py-4 text-muted">
                    <i className="fas fa-inbox fa-2x mb-2"></i>
                    <p>No hay historial disponible</p>
                  </div>
                )}

                {/* Resource Assignment Control - Reverse Assignment View */}
                <hr className="my-4" />
                <h6 className="fw-bold text-info mb-3">
                  <i className="fas fa-link me-2"></i>Entidades que Usan Este Recurso
                </h6>
                <div className="bg-light p-3 rounded">
                  <p className="text-muted mb-0">
                    <i className="fas fa-info-circle me-2"></i>
                    Este recurso actualmente está asignado a {stats?.active_assignments || 0} entidad{stats?.active_assignments !== 1 ? 'es' : ''}.
                  </p>
                  {stats && stats.active_assignments > 0 && (
                    <small className="text-muted">
                      Las asignaciones se pueden gestionar desde los perfiles de tareas y usuarios.
                    </small>
                  )}
                </div>
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
                onEdit(recurso.id)
              }}
            >
              <i className="fas fa-edit me-2"></i>Editar Recurso
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecursoProfileModal