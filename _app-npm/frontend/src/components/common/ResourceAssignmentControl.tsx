import React, { useState } from 'react'

// Types for the control
export interface AssignedResource {
  id: number
  name: string
  category?: string
  status?: string
  location?: string
}

export interface ResourceOption {
  id: number
  name: string
  category?: string
  status?: string
  location?: string
}

export interface ResourceAssignmentControlProps {
  entityId: number
  entityType: 'tarea' | 'usuario' | 'tecnico' | 'recurso'
  assignedResources: AssignedResource[]
  availableResources: ResourceOption[]
  onAssignResource: (resourceId: number) => Promise<boolean>
  onUnassignResource: (resourceId: number) => Promise<boolean>
  loading?: boolean
  className?: string
  showAddIcon?: boolean
  maxHeight?: string
}

export const ResourceAssignmentControl: React.FC<ResourceAssignmentControlProps> = ({
  entityId,
  entityType,
  assignedResources,
  availableResources,
  onAssignResource,
  onUnassignResource,
  loading = false,
  className = '',
  showAddIcon = true,
  maxHeight = '300px'
}) => {
  const [isAssigning, setIsAssigning] = useState<number | null>(null)
  const [isUnassigning, setIsUnassigning] = useState<number | null>(null)
  const [showAddResource, setShowAddResource] = useState(false)
  const [selectedResourceId, setSelectedResourceId] = useState<string>('')

  // Get icon and color for resource status
  const getResourceStatusInfo = (status?: string) => {
    switch (status) {
      case 'available':
        return { icon: 'fa-check', color: 'success', text: 'Disponible' }
      case 'assigned':
        return { icon: 'fa-user', color: 'info', text: 'Relacionado' }
      case 'maintenance':
        return { icon: 'fa-spinner', color: 'warning', text: 'Mantenimiento' }
      case 'retired':
        return { icon: 'fa-trash', color: 'danger', text: 'Retirado' }
      default:
        return { icon: 'fa-box', color: 'secondary', text: 'Desconocido' }
    }
  }

  // Handle resource assignment
  const handleAssignResource = async () => {
    if (!selectedResourceId) return

    setIsAssigning(parseInt(selectedResourceId))
    try {
      const success = await onAssignResource(parseInt(selectedResourceId))
      if (success) {
        setShowAddResource(false)
        setSelectedResourceId('')
      }
    } catch (error) {
      console.error('Error assigning resource:', error)
    } finally {
      setIsAssigning(null)
    }
  }

  // Handle resource unassignment
  const handleUnassignResource = async (resourceId: number) => {
    setIsUnassigning(resourceId)
    try {
      await onUnassignResource(resourceId)
    } catch (error) {
      console.error('Error unassigning resource:', error)
    } finally {
      setIsUnassigning(null)
    }
  }

  // Get category color
  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'hardware':
        return 'primary'
      case 'software':
        return 'info'
      case 'network':
        return 'success'
      case 'security':
        return 'danger'
      case 'tools':
        return 'warning'
      case 'facilities':
        return 'secondary'
      default:
        return 'secondary'
    }
  }

  return (
    <div className={`resource-assignment-control ${className}`}>
      {/* Header with Add Resource Button */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="mb-0">
          <i className="fas fa-boxes me-2"></i>
          Recursos Relacionados
        </h6>
        {showAddIcon && !loading && (
          <button
            type="button"
            className="btn btn-sm btn-outline-primary"
            onClick={() => setShowAddResource(!showAddResource)}
            disabled={isAssigning !== null}
          >
            <i className="fas fa-plus me-1"></i>
            Relacionar Recurso
          </button>
        )}
      </div>

      {/* Add Resource Section */}
      {showAddResource && (
        <div className="card mb-3 border-primary">
          <div className="card-body">
            <div className="row g-2 align-items-end">
              <div className="col-md-8">
                <label className="form-label small fw-bold">
                  Seleccionar Recurso:
                </label>
                <select
                  className="form-select form-select-sm"
                  value={selectedResourceId}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedResourceId(e.target.value)}
                  disabled={isAssigning !== null}
                >
                  <option value="">Seleccionar recurso...</option>
                  {availableResources
                    .filter((resource: ResourceOption) => 
                      !assignedResources.some((assigned: AssignedResource) => assigned.id === resource.id)
                    )
                    .map((resource: ResourceOption) => (
                      <option key={resource.id} value={resource.id}>
                        {resource.name} {resource.category ? `(${resource.category})` : ''}
                      </option>
                    ))
                  }
                </select>
              </div>
              <div className="col-md-4">
                <div className="d-flex gap-1">
                  <button
                    type="button"
                    className="btn btn-sm btn-success"
                    onClick={handleAssignResource}
                    disabled={!selectedResourceId || isAssigning !== null}
                  >
                    {isAssigning !== null ? (
                      <>
                        <i className="fas fa-spinner fa-spin me-1"></i>
                        Relacionando...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-check me-1"></i>
                        Relacionar
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => {
                      setShowAddResource(false)
                      setSelectedResourceId('')
                    }}
                    disabled={isAssigning !== null}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Currently Assigned Resources */}
      <div className="resource-list" style={{ maxHeight, overflowY: 'auto' }}>
        {loading ? (
          <div className="text-center py-3">
            <i className="fas fa-spinner fa-spin fa-2x text-muted"></i>
            <p className="text-muted mt-2">Cargando recursos...</p>
          </div>
        ) : assignedResources.length > 0 ? (
          <div className="row g-2">
            {assignedResources.map((resource: AssignedResource) => {
              const statusInfo = getResourceStatusInfo(resource.status)
              return (
                <div key={resource.id} className="col-12">
                  <div className="card border-0 bg-light">
                    <div className="card-body py-2 px-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <div className={`badge bg-${getCategoryColor(resource.category)} me-2`}>
                            <i className="fas fa-box me-1"></i>
                            {resource.category || 'Recurso'}
                          </div>
                          <div>
                            <h6 className="mb-0 small">{resource.name}</h6>
                            {resource.location && (
                              <small className="text-muted">
                                <i className="fas fa-map-marker-alt me-1"></i>
                                {resource.location}
                              </small>
                            )}
                          </div>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <span className={`badge bg-${statusInfo.color} small`}>
                            <i className={`fas ${statusInfo.icon} me-1`}></i>
                            {statusInfo.text}
                          </span>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleUnassignResource(resource.id)}
                            disabled={isUnassigning === resource.id}
                            title="Quitar relación"
                          >
                            {isUnassigning === resource.id ? (
                              <i className="fas fa-spinner fa-spin"></i>
                            ) : (
                              <i className="fas fa-trash"></i>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-4">
            <i className="fas fa-box fa-3x text-muted mb-3"></i>
            <p className="text-muted mb-0">No hay recursos relacionados</p>
            <small className="text-muted">
              {showAddResource ? 'Selecciona un recurso para asignar' : 'Haz clic en "Asignar Recurso" para comenzar'}
            </small>
          </div>
        )}
      </div>

      {/* Summary */}
      {assignedResources.length > 0 && (
        <div className="mt-3 pt-2 border-top">
          <small className="text-muted">
            <i className="fas fa-info-circle me-1"></i>
            Total: {assignedResources.length} recurso{assignedResources.length !== 1 ? 's' : ''} relacionado{assignedResources.length !== 1 ? 's' : ''}
          </small>
        </div>
      )}
    </div>
  )
}

export default ResourceAssignmentControl