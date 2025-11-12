import { useState, useCallback, useEffect } from 'react'
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
  // Use relative paths for Vite proxy
  const API_BASE = '/api'
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
      let endpoint = ''
      let queryParams = ''
      
      // Build endpoint based on entity type
      switch (entityType) {
        case 'tarea':
          endpoint = `${API_BASE}/tarea-recursos/tareas/${entityId}/recursos`
          break
        case 'usuario':
          endpoint = `${API_BASE}/usuario-recursos/usuarios/${entityId}/recursos`
          break
        case 'tecnico':
          endpoint = `${API_BASE}/tecnico-recursos/tecnicos/${entityId}/recursos`
          break
        case 'recurso':
          endpoint = `${API_BASE}/recursos-asignados/recursos/${entityId}/asignaciones`
          break
        default:
          endpoint = `${API_BASE}/tarea-recursos/tareas/${entityId}/recursos`
      }

      const response = await fetch(endpoint)
      
      if (!response.ok) {
        throw new Error(`Error al cargar recursos asignados: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.success && data.data) {
        // Handle different response structures
        let resources = []
        if (data.data.assignments) {
          // Backend returns { assignments: [...] }
          resources = data.data.assignments
        } else if (Array.isArray(data.data)) {
          // Direct array response
          resources = data.data
        } else {
          resources = []
        }
        
        // Map resources to expected format
        const mappedResources = resources.map((resource: any) => {
          // Handle different naming patterns from backend
          const name = resource.recurso_name || resource.name || resource.resource_name || 'Recurso desconocido'
          const category = resource.recurso_category || resource.category
          const status = resource.recurso_status || resource.status
          const location = resource.recurso_location || resource.location
          const id = resource.recurso_id || resource.id || resource.resource_id
          
          return {
            id: id || 0,
            name: name,
            category: category,
            status: status,
            location: location
          }
        }).filter(resource => resource.id) // Filter out invalid resources
        
        setState(prev => ({
          ...prev,
          assignedResources: mappedResources
        }))
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      setError(errorMessage)
      console.error('Error loading assigned resources:', error)
      // Don't show toast error for missing assignments, it's normal for new entities
    } finally {
      setLoading(false)
    }
  }, [entityType, entityId, setLoading, setError])

  // Load available resources for assignment
  const loadAvailableResources = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/recursos?status=available`)
      
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
      // Build endpoint based on entity type
      let endpoint = ''
      let requestBody = {}
      
      switch (entityType) {
        case 'tarea':
          endpoint = `${API_BASE}/tarea-recursos/tareas/${entityId}/recursos`
          requestBody = { recurso_id: resourceId }
          break
        case 'usuario':
          endpoint = `${API_BASE}/usuario-recursos/usuarios/${entityId}/recursos`
          requestBody = { resource_id: resourceId }
          break
        case 'tecnico':
          endpoint = `${API_BASE}/tecnico-recursos/tecnicos/${entityId}/recursos`
          requestBody = { resource_id: resourceId }
          break
        case 'recurso':
          endpoint = `${API_BASE}/recursos-asignados/recursos/${entityId}/asignaciones`
          requestBody = { entity_type: 'tarea', entity_id: entityId, resource_id: resourceId }
          break
        default:
          throw new Error('Tipo de entidad no soportado')
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
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
      console.error('Error assigning resource:', error)
      // Don't show toast for now due to missing backend endpoints
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
      // Build endpoint based on entity type
      let endpoint = ''
      let requestBody = {}
      
      switch (entityType) {
        case 'tarea':
          endpoint = `${API_BASE}/tarea-recursos/tareas/${entityId}/recursos/${resourceId}`
          requestBody = {}
          break
        case 'usuario':
          endpoint = `${API_BASE}/usuario-recursos/usuarios/${entityId}/recursos/${resourceId}`
          requestBody = {}
          break
        case 'tecnico':
          endpoint = `${API_BASE}/tecnico-recursos/tecnicos/${entityId}/recursos/${resourceId}`
          requestBody = {}
          break
        case 'recurso':
          endpoint = `${API_BASE}/recursos-asignados/recursos/${resourceId}/asignaciones`
          requestBody = { entity_type: entityType, entity_id: entityId }
          break
        default:
          throw new Error('Tipo de entidad no soportado')
      }

      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        throw new Error(`Error al desasignar recurso: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.success) {
        // Don't show toast for now due to missing backend endpoints
        await refreshAssignments()
        return true
      } else {
        throw new Error(data.message || 'Error al desasignar recurso')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      setError(errorMessage)
      console.error('Error unassigning resource:', error)
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

  // Auto-load data when hook is initialized
  useEffect(() => {
    refreshAssignments()
  }, [refreshAssignments])

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