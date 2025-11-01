import { create } from 'zustand'
import toast from 'react-hot-toast'

export interface Recurso {
  id: number
  dtic_id: string
  name: string
  description?: string
  category: 'hardware' | 'software' | 'network' | 'security' | 'tools' | 'facilities'
  status: 'available' | 'assigned' | 'maintenance' | 'retired'
  location?: string
  technical_specs?: any
  serial_number?: string
  model?: string
  created_at: string
  updated_at: string
  assigned_users_count?: number
  active_tasks_count?: number
  assigned_users?: UsuarioAsignado[]
  history?: RecursoHistorial[]
}

export interface UsuarioAsignado {
  id: number
  dtic_id: string
  first_name: string
  last_name: string
  full_name: string
  email?: string
  phone?: string
  department?: string
  position?: string
  assigned_at: string
}

export interface RecursoHistorial {
  id: number
  action: string
  details?: string
  created_at: string
  tecnico_dtic_id?: string
  tecnico_name?: string
  usuario_dtic_id?: string
  usuario_name?: string
}

interface RecursosState {
  recursos: Recurso[]
  loading: boolean
  error: string | null
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
  filters: {
    search: string
    category: string
    status: string
    location: string
  }

  // Actions
  fetchRecursos: (page?: number) => Promise<void>
  createEntity: (data: Partial<Recurso>) => Promise<void>
  updateEntity: (id: number, data: Partial<Recurso>) => Promise<void>
  deleteEntity: (id: number) => Promise<void>
  createRecurso: (data: Partial<Recurso>) => Promise<boolean>
  updateRecurso: (id: number, data: Partial<Recurso>) => Promise<boolean>
  deleteRecurso: (id: number) => Promise<boolean>
  assignRecurso: (recursoId: number, usuarioId: number, tecnicoId?: number) => Promise<boolean>
  unassignRecurso: (recursoId: number, usuarioId: number, tecnicoId?: number) => Promise<boolean>
  setFilters: (filters: Partial<RecursosState['filters']>) => void
  clearFilters: () => void
  getRecursoById: (id: number) => Recurso | undefined
}

const API_BASE = import.meta.env.VITE_API_URL || '/api'

export const useRecursosStore = create<RecursosState>((set, get) => ({
  recursos: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  },
  filters: {
    search: '',
    category: '',
    status: '',
    location: ''
  },

  createEntity: async (data) => {
    console.log('[DEBUG] RecursosStore.createEntity called with data:', data)
    console.log('[DEBUG] API_BASE:', API_BASE)
    set({ loading: true, error: null })

    try {
      const url = `${API_BASE}/recursos`
      console.log('[DEBUG] Making POST request to:', url)

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      console.log('[DEBUG] Response status:', response.status)
      console.log('[DEBUG] Response ok:', response.ok)

      const result = await response.json()
      console.log('[DEBUG] Response result:', result)

      if (result.success) {
        console.log('[DEBUG] Create successful, showing toast and reloading')
        toast.success('Recurso creado exitosamente')
        get().fetchRecursos() // Recargar lista
        set({ loading: false })
      } else {
        console.log('[DEBUG] API returned success=false, throwing error')
        throw new Error(result.message || 'Error al crear recurso')
      }
    } catch (error) {
      console.log('[DEBUG] Error in createEntity:', error)
      const message = error instanceof Error ? error.message : 'Error desconocido'
      set({ error: message, loading: false })
      toast.error(`Error al crear recurso: ${message}`)
      throw error
    }
  },

  updateEntity: async (id, data) => {
    console.log('[DEBUG] RecursosStore.updateEntity called with id:', id, 'data:', data)
    console.log('[DEBUG] API_BASE:', API_BASE)
    set({ loading: true, error: null })

    try {
      const url = `${API_BASE}/recursos/${id}`
      console.log('[DEBUG] Making PUT request to:', url)

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      console.log('[DEBUG] Response status:', response.status)
      console.log('[DEBUG] Response ok:', response.ok)

      const result = await response.json()
      console.log('[DEBUG] Response result:', result)

      if (result.success) {
        console.log('[DEBUG] Update successful, showing toast and reloading')
        toast.success('Recurso actualizado exitosamente')
        get().fetchRecursos() // Recargar lista
        set({ loading: false })
      } else {
        console.log('[DEBUG] API returned success=false, throwing error')
        throw new Error(result.message || 'Error al actualizar recurso')
      }
    } catch (error) {
      console.log('[DEBUG] Error in updateEntity:', error)
      const message = error instanceof Error ? error.message : 'Error desconocido'
      set({ error: message, loading: false })
      toast.error(`Error al actualizar recurso: ${message}`)
      throw error
    }
  },

  deleteEntity: async (id) => {
    if (!confirm('¿Está seguro de eliminar este recurso? Esta acción no se puede deshacer.')) {
      throw new Error('Operación cancelada por el usuario')
    }

    set({ loading: true, error: null })

    try {
      const response = await fetch(`${API_BASE}/recursos/${id}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Recurso eliminado exitosamente')
        get().fetchRecursos() // Recargar lista
        set({ loading: false })
      } else {
        throw new Error(result.message || 'Error al eliminar recurso')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido'
      set({ error: message, loading: false })
      toast.error(`Error al eliminar recurso: ${message}`)
      throw error
    }
  },

  fetchRecursos: async (page = 1) => {
    set({ loading: true, error: null })

    try {
      const { filters } = get()
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== '')
        )
      })

      const response = await fetch(`${API_BASE}/recursos?${params}`)
      const data = await response.json()

      if (data.success) {
        set({
          recursos: data.data.recursos,
          pagination: data.data.pagination,
          loading: false
        })
      } else {
        throw new Error(data.message || 'Error al cargar recursos')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido'
      set({ error: message, loading: false })
      toast.error(`Error al cargar recursos: ${message}`)
    }
  },

  createRecurso: async (data) => {
    set({ loading: true, error: null })

    try {
      const response = await fetch(`${API_BASE}/recursos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Recurso creado exitosamente')
        get().fetchRecursos() // Recargar lista
        set({ loading: false })
        return true
      } else {
        throw new Error(result.message || 'Error al crear recurso')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido'
      set({ error: message, loading: false })
      toast.error(`Error al crear recurso: ${message}`)
      return false
    }
  },

  updateRecurso: async (id, data) => {
    set({ loading: true, error: null })

    try {
      const response = await fetch(`${API_BASE}/recursos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Recurso actualizado exitosamente')
        get().fetchRecursos() // Recargar lista
        set({ loading: false })
        return true
      } else {
        throw new Error(result.message || 'Error al actualizar recurso')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido'
      set({ error: message, loading: false })
      toast.error(`Error al actualizar recurso: ${message}`)
      return false
    }
  },

  deleteRecurso: async (id) => {
    if (!confirm('¿Está seguro de eliminar este recurso? Esta acción no se puede deshacer.')) {
      return false
    }

    set({ loading: true, error: null })

    try {
      const response = await fetch(`${API_BASE}/recursos/${id}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Recurso eliminado exitosamente')
        get().fetchRecursos() // Recargar lista
        set({ loading: false })
        return true
      } else {
        throw new Error(result.message || 'Error al eliminar recurso')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido'
      set({ error: message, loading: false })
      toast.error(`Error al eliminar recurso: ${message}`)
      return false
    }
  },

  assignRecurso: async (recursoId, usuarioId, tecnicoId) => {
    set({ loading: true, error: null })

    try {
      const response = await fetch(`${API_BASE}/recursos/${recursoId}/asignar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ usuario_id: usuarioId, tecnico_id: tecnicoId })
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Recurso asignado exitosamente')
        get().fetchRecursos() // Recargar lista
        set({ loading: false })
        return true
      } else {
        throw new Error(result.message || 'Error al asignar recurso')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido'
      set({ error: message, loading: false })
      toast.error(`Error al asignar recurso: ${message}`)
      return false
    }
  },

  unassignRecurso: async (recursoId, usuarioId, tecnicoId) => {
    set({ loading: true, error: null })

    try {
      const response = await fetch(`${API_BASE}/recursos/${recursoId}/desasignar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ usuario_id: usuarioId, tecnico_id: tecnicoId })
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Recurso desasignado exitosamente')
        get().fetchRecursos() // Recargar lista
        set({ loading: false })
        return true
      } else {
        throw new Error(result.message || 'Error al desasignar recurso')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido'
      set({ error: message, loading: false })
      toast.error(`Error al desasignar recurso: ${message}`)
      return false
    }
  },

  setFilters: (newFilters) => {
    const { filters } = get()
    const updatedFilters = { ...filters, ...newFilters }
    set({ filters: updatedFilters })
    get().fetchRecursos(1) // Reset to first page
  },

  clearFilters: () => {
    set({
      filters: {
        search: '',
        category: '',
        status: '',
        location: ''
      }
    })
    get().fetchRecursos(1)
  },

  getRecursoById: (id) => {
    return get().recursos.find(r => r.id === id)
  }
}))