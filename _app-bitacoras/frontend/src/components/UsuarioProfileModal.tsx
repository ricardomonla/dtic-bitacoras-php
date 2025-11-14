import { useEffect, useState } from 'react'
import { ResourceAssignmentControl } from './common/ResourceAssignmentControl'
import { useResourceAssignment } from '../hooks/useResourceAssignment'

interface UsuarioRelacionado {
  id: number
  dtic_id: string
  first_name: string
  last_name: string
  full_name?: string
  email?: string
  phone?: string
  department?: string
  position?: string
  created_at: string
  updated_at?: string
  assigned_resources_count?: number
}

interface UsuarioProfileModalProps {
  usuario: UsuarioRelacionado | null
  isOpen: boolean
  onClose: () => void
  onEdit: (id: number) => void
}

interface UsuarioStats {
  total_assignments: number
  active_assignments: number
  assignment_history: any[]
  resource_categories: { [key: string]: number }
}

const UsuarioProfileModal = ({ usuario, isOpen, onClose, onEdit }: UsuarioProfileModalProps) => {
  const [stats, setStats] = useState<UsuarioStats | null>(null)
  const [loading, setLoading] = useState(false)
  
  // Initialize resource assignment hook for this usuario
  const resourceAssignment = useResourceAssignment('usuario', usuario.id)
  
  // Load assigned resources when modal opens
  useEffect(() => {
    if (isOpen && usuario) {
      resourceAssignment.refreshAssignments()
    }
  }, [isOpen, usuario?.id])

  useEffect(() => {
    if (usuario && isOpen) {
      fetchUsuarioStats()
    }
  }, [usuario, isOpen])

  const fetchUsuarioStats = async () => {
    if (!usuario) return

    setLoading(true)
    try {
      const response = await fetch(`/api/usuarios_relacionados/${usuario.id}?include_history=true`)
      const data = await response.json()

      if (data.success) {
        setStats({
          total_assignments: data.data.usuario.total_assignments || 0,
          active_assignments: data.data.usuario.active_assignments || 0,
          assignment_history: data.data.usuario.assignment_history || [],
          resource_categories: data.data.usuario.resource_categories || {}
        })
      }
    } catch (error) {
      console.error('Error fetching usuario stats:', error)
    } finally {
      setLoading(false)
    }
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatCategory = (category: string) => {
    const categories = {
      'hardware': 'Hardware',
      'software': 'Software',
      'network': 'Redes',
      'security': 'Seguridad',
      'tools': 'Herramientas',
      'facilities': 'Instalaciones'
    }
    return categories[category as keyof typeof categories] || category
  }

  if (!isOpen || !usuario) return null

  return (
    <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">
              <i className="fas fa-user me-2"></i>Perfil de {usuario.full_name || `${usuario.first_name} ${usuario.last_name}`}
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
                <h5 className="mb-1">{usuario.full_name || `${usuario.first_name} ${usuario.last_name}`}</h5>
                {usuario.position && (
                  <span className="badge fs-6 mb-2 bg-info">
                    {usuario.position}
                  </span>
                )}
                <div>
                  <span className="badge fs-6 bg-secondary">
                    Usuario Relacionado
                  </span>
                </div>
              </div>

              {/* Información detallada */}
              <div className="col-md-8">
                <div className="row">
                  <div className="col-sm-6">
                    <div className="mb-3">
                      <strong className="text-muted d-block">ID DTIC</strong>
                      <span className="badge bg-light text-dark fs-6">{usuario.dtic_id}</span>
                    </div>
                    <div className="mb-3">
                      <strong className="text-muted d-block">Email</strong>
                      <span>{usuario.email || 'No especificado'}</span>
                    </div>
                    <div className="mb-3">
                      <strong className="text-muted d-block">Teléfono</strong>
                      <span>{usuario.phone || 'No especificado'}</span>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="mb-3">
                      <strong className="text-muted d-block">Departamento</strong>
                      <span>{usuario.department ? formatDepartment(usuario.department) : 'No especificado'}</span>
                    </div>
                    <div className="mb-3">
                      <strong className="text-muted d-block">Cargo</strong>
                      <span>{usuario.position || 'No especificado'}</span>
                    </div>
                    <div className="mb-3">
                      <strong className="text-muted d-block">Registro</strong>
                      <span>{formatDate(usuario.created_at)}</span>
                    </div>
                  </div>
                </div>

                <hr />

                {/* Estadísticas de recursos asignados */}
                <h6 className="fw-bold text-primary mb-3">
                  <i className="fas fa-chart-bar me-2"></i>Estadísticas de Recursos Relacionados
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
                        <small className="text-muted fw-bold">Total Relaciones</small>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="p-3 bg-success rounded text-white">
                        <div className="h4 mb-1">{stats.active_assignments}</div>
                        <small className="fw-bold">Relaciones Activas</small>
                      </div>
                    </div>
                  </div>
                ) : null}

                {/* Categorías de recursos */}
                {stats && stats.resource_categories && Object.keys(stats.resource_categories).length > 0 && (
                  <>
                    <h6 className="fw-bold text-info mb-3">
                      <i className="fas fa-tags me-2"></i>Categorías de Recursos Relacionados
                    </h6>
                    <div className="row mb-4">
                      {Object.entries(stats.resource_categories).map(([category, count]) => (
                        <div key={category} className="col-sm-6 col-md-4 mb-2">
                          <div className="p-2 bg-light rounded text-center">
                            <div className="fw-bold text-primary">{count}</div>
                            <small className="text-muted">{formatCategory(category)}</small>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Historial de asignaciones */}
                {stats && stats.assignment_history && stats.assignment_history.length > 0 && (
                  <>
                    <h6 className="fw-bold text-primary mb-3">
                      <i className="fas fa-history me-2"></i>Historial de Relaciones
                    </h6>
                    <div className="list-group">
                      {stats.assignment_history.slice(0, 5).map((assignment: any, index: number) => (
                        <div key={index} className="list-group-item">
                          <div className="d-flex w-100 justify-content-between">
                            <h6 className="mb-1">{assignment.recurso_name || 'Recurso desconocido'}</h6>
                            <small className={`badge ${assignment.action === 'assigned' ? 'bg-success' : 'bg-warning'}`}>
                              {assignment.action === 'assigned' ? 'Relacionado' : 'Desrelacionado'}
                            </small>
                          </div>
                          <p className="mb-1">
                            ID DTIC: {assignment.recurso_dtic_id} • Categoría: {formatCategory(assignment.recurso_category)}
                          </p>
                          <small className="text-muted">
                            {assignment.action === 'assigned' ? 'Relacionado' : 'Desrelacionado'}: {formatDate(assignment.created_at)}
                            {assignment.tecnico_name && ` • Por: ${assignment.tecnico_name}`}
                          </small>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {stats && (!stats.assignment_history || stats.assignment_history.length === 0) && (
                  <div className="text-center py-4 text-muted">
                    <i className="fas fa-inbox fa-2x mb-2"></i>
                    <p>No hay historial de relaciones</p>
                  </div>
                )}

                {/* Resource Assignment Control */}
                <hr className="my-4" />
                <h6 className="fw-bold text-info mb-3">
                  <i className="fas fa-boxes me-2"></i>Gestión de Recursos Relacionados
                </h6>
                <ResourceAssignmentControl
                  entityId={usuario.id}
                  entityType="usuario"
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
                onEdit(usuario.id)
              }}
            >
              <i className="fas fa-edit me-2"></i>Editar Usuario
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UsuarioProfileModal