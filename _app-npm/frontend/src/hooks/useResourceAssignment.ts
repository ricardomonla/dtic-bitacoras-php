import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'

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

export interface ResourceAssignmentData {
  entity_type: 'tarea' | 'usuario' | 'tecnico' | 'recurso'
  entity_id: number
  resource_id: number
}

export interface UseResourceAssignmentState {
  assignedResources: AssignedResource[]
  availableResources: ResourceOption[]
  loading: boolean
  error: string | null
}

export interface UseResourceAssignmentActions {
  assignResource: (resourceId: number) => Promise<boolean>
  unassignResource: (resourceId: number) => Promise<boolean>
  loadAssignedResources: () => Promise<void>
  loadAvailableResources: () => Promise<void>
  refreshAssignments: () => Promise<void>
}

export type UseResourceAssignment = UseResourceAssignmentState & UseResourceAssignmentActions

export const useResourceAssignment = (
  entityType: 'tarea' | 'usuario' | 'tecnico' | 'recurso',
  entityId: number
): UseResourceAssignment => {
  const [state, setState] = useState<UseResourceAssignmentState>({
    assignedResources: [],
    availableResources: [],
    loading: false,
    error: null
  })

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }))
  }, [])

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }))
  }, [])

  // Load currently assigned resources
  const loadAssignedResources = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const endpoint = getAssignmentEndpoint(entityType)
      const response = await fetch(`${endpoint}?entity_type=${entityType}&entity_id=${entityId}`)
      
      if (!response.ok) {
        throw new Error(`Error al cargar recursos asignados: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.success && data.data) {
        const resources = Array.isArray(data.data) ? data.data : 
          data.data.recursos || data.data.assigned_resources || []
        
        setState(prev => ({
          ...prev,
          assignedResources: resources.map((resource: any) => ({
            id: resource.id,
            name: resource.name,
            category: resource.category,
            status: resource.status,
            location: resource.location
          }))
        }))
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      setError(errorMessage)
      toast.error(`Error al cargar recursos asignados: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }, [entityType, entityId, setLoading, setError])

  // Load available resources for assignment
  const loadAvailableResources = useCallback(async () => {
    try {
      const response = await fetch('/api/recursos?status=available')
      
      if (!response.ok) {
        throw new Error(`Error al cargar recursos disponibles: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.success && data.data) {
        const resources = Array.isArray(data.data) ? data.data : data.data.recursos || []
        
        setState(prev => ({
          ...prev,
          availableResources: resources.map((resource: any) => ({
            id: resource.id,
            name: resource.name,
            category: resource.category,
            status: resource.status,
            location: resource.location
          }))
        }))
      }
    } catch (error) {
      console.error('Error loading available resources:', error)
      // Don't show error toast for available resources as it's not critical
    }
  }, [])

  // Assign a resource to the entity
  const assignResource = useCallback(async (resourceId: number): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const assignmentData: ResourceAssignmentData = {
        entity_type: entityType,
        entity_id: entityId,
        resource_id: resourceId
      }

      const response = await fetch('/api/tarea-recursos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(assignmentData)
      })

      if (!response.ok) {
        if (response.status === 409) {
          const errorData = await response.json().catch(() => ({}))
          const message = errorData.message || 'Error de conflicto al asignar recurso'
          throw new Error(message)
        } else {
          throw new Error(`Error al asignar recurso: ${response.status}`)
        }
      }

      const data = await response.json()
      
      if (data.success) {
        toast.success('Recurso asignado exitosamente')
        await refreshAssignments()
        return true
      } else {
        throw new Error(data.message || 'Error al asignar recurso')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      setError(errorMessage)
      toast.error(`Error al asignar recurso: ${errorMessage}`)
      return false
    } finally {
      setLoading(false)
    }
  }, [entityType, entityId, setLoading, setError])

  // Unassign a resource from the entity
  const unassignResource = useCallback(async (resourceId: number): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/tarea-recursos', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          entity_type: entityType,
          entity_id: entityId,
          resource_id: resourceId
        })
      })

      if (!response.ok) {
        throw new Error(`Error al desasignar recurso: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.success) {
        toast.success('Recurso desasignado exitosamente')
        await refreshAssignments()
        return true
      } else {
        throw new Error(data.message || 'Error al desasignar recurso')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      setError(errorMessage)
      toast.error(`Error al desasignar recurso: ${errorMessage}`)
      return false
    } finally {
      setLoading(false)
    }
  }, [entityType, entityId, setLoading, setError])

  // Refresh both assigned and available resources
  const refreshAssignments = useCallback(async () => {
    await Promise.all([
      loadAssignedResources(),
      loadAvailableResources()
    ])
  }, [loadAssignedResources, loadAvailableResources])

  // Helper function to get the correct endpoint for assignments
  const getAssignmentEndpoint = (type: string): string => {
    switch (type) {
      case 'tarea':
        return '/api/tarea-recursos'
      case 'usuario':
        return '/api/usuario-recursos'
      case 'tecnico':
        return '/api/tecnico-recursos'
      case 'recurso':
        return '/api/recursos-asignados'
      default:
        return '/api/tarea-recursos'
    }
  }

  return {
    // State
    assignedResources: state.assignedResources,
    availableResources: state.availableResources,
    loading: state.loading,
    error: state.error,
    
    // Actions
    assignResource,
    unassignResource,
    loadAssignedResources,
    loadAvailableResources,
    refreshAssignments
  }
}

export default useResourceAssignment