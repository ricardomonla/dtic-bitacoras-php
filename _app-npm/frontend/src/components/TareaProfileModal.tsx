import React, { useEffect } from 'react'
import { Tarea } from '../stores/tareasStore'
import { tareaUtils } from '../utils/entityUtils'
import { ResourceAssignmentControl } from './common/ResourceAssignmentControl'
import { useResourceAssignment } from '../hooks/useResourceAssignment'

interface TareaProfileModalProps {
  tarea: Tarea | null
  isOpen: boolean
  onClose: () => void
  onEdit: (id: number) => void
  onRefresh?: () => void
}

const TareaProfileModal: React.FC<TareaProfileModalProps> = ({
  tarea,
  isOpen,
  onClose,
  onEdit,
  onRefresh
}) => {
  if (!isOpen || !tarea) return null

  // Initialize resource assignment hook for this tarea
  const resourceAssignment = useResourceAssignment('tarea', tarea.id)
  
  // Load assigned resources when modal opens
  useEffect(() => {
    if (isOpen && tarea) {
      resourceAssignment.refreshAssignments()
    }
  }, [isOpen, tarea?.id])

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">
              <i className="fas fa-tasks me-2"></i>
              Detalles de Tarea
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-8">
                <h4 className="mb-3">{tarea.title}</h4>
                {tarea.description && (
                  <p className="text-muted mb-4">{tarea.description}</p>
                )}
              </div>
              <div className="col-md-4 text-end">
                <span className={`badge fs-6 ${tareaUtils.getBadge(tarea.status).class}`}>
                  {tareaUtils.getBadge(tarea.status).text}
                </span>
              </div>
            </div>

            <div className="row g-3">
              <div className="col-md-4">
                <div className="card h-100">
                  <div className="card-body">
                    <h6 className="card-title">
                      <i className="fas fa-info-circle me-2 text-primary"></i>
                      Información General
                    </h6>
                    <hr />
                    <p className="mb-2"><strong>ID DTIC:</strong> {tarea.dtic_id}</p>
                    <p className="mb-2">
                      <strong>Prioridad:</strong>
                      <span className={`badge ms-2 ${tareaUtils.getBadge(tarea.priority).class}`}>
                        {tareaUtils.formatPriority(tarea.priority)}
                      </span>
                    </p>
                    <p className="mb-2"><strong>Estado:</strong> {tareaUtils.getBadge(tarea.status).text}</p>
                    <p className="mb-2"><strong>Creada:</strong> {tareaUtils.formatDate(tarea.created_at)}</p>
                    <p className="mb-2"><strong>Actualizada:</strong> {tareaUtils.formatDate(tarea.updated_at)}</p>
                    {tarea.due_date && (
                      <p className="mb-2"><strong>Fecha límite:</strong> {tareaUtils.formatDate(tarea.due_date)}</p>
                    )}
                    {tarea.completed_at && (
                      <p className="mb-0"><strong>Completada:</strong> {tareaUtils.formatDate(tarea.completed_at)}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card h-100">
                  <div className="card-body">
                    <h6 className="card-title">
                      <i className="fas fa-user me-2 text-success"></i>
                      Asignación
                    </h6>
                    <hr />
                    {tarea.technician_name ? (
                      <>
                        <p className="mb-2"><strong>Técnico asignado:</strong></p>
                        <div className="d-flex align-items-center">
                          <div className="avatar-circle bg-primary text-white me-3" style={{ width: '40px', height: '40px' }}>
                            <i className="fas fa-user"></i>
                          </div>
                          <div>
                            <h6 className="mb-0">{tarea.technician_name}</h6>
                            <small className="text-muted">ID: {tarea.technician_id}</small>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-3">
                        <i className="fas fa-user-slash fa-2x text-muted mb-2"></i>
                        <p className="text-muted mb-0">Sin técnico asignado</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card h-100">
                  <div className="card-body">
                    <h6 className="card-title">
                      <i className="fas fa-boxes me-2 text-info"></i>
                      Recursos Asignados
                    </h6>
                    <hr />
                    <ResourceAssignmentControl
                      entityId={tarea.id}
                      entityType="tarea"
                      assignedResources={resourceAssignment.assignedResources}
                      availableResources={resourceAssignment.availableResources}
                      onAssignResource={resourceAssignment.assignResource}
                      onUnassignResource={resourceAssignment.unassignResource}
                      loading={resourceAssignment.loading}
                      className="border-0 p-0"
                      showAddIcon={true}
                      maxHeight="300px"
                    />
                  </div>
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
              className="btn btn-primary"
              onClick={() => {
                onEdit(tarea.id)
                onClose()
              }}
            >
              <i className="fas fa-edit me-2"></i>Editar Tarea
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TareaProfileModal