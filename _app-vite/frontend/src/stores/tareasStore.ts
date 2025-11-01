import { create } from 'zustand'
import toast from 'react-hot-toast'

export interface Tarea {
  id: number
  dtic_id: string
  title: string
  description?: string
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  technician_id?: number
  technician_name?: string
  created_at: string
  updated_at: string
  due_date?: string
  completed_at?: string
}

interface TareasState {
  tareas: Tarea[]
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
    technician_id: string
    status: string
    priority: string
  }

  // Actions
  fetchTareas: (page?: number) => Promise<void>
  createTarea: (data: Partial<Tarea>) => Promise<boolean>
  updateTarea: (id: number, data: Partial<Tarea>) => Promise<boolean>
  deleteTarea: (id: number) => Promise<boolean>
  setFilters: (filters: Partial<TareasState['filters']>) => void
  clearFilters: () => void
  getTareaById: (id: number) => Tarea | undefined
}

const API_BASE = import.meta.env.VITE_API_URL || '/api'

export const useTareasStore = create<TareasState>((set, get) => ({
  tareas: [],
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
    technician_id: '',
    status: '',
    priority: ''
  },

  fetchTareas: async (page = 1) => {
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

      const response = await fetch(`${API_BASE}/tareas?${params}`)
      const data = await response.json()

      if (data.success) {
        set({
          tareas: data.data.tasks,
          pagination: data.data.pagination,
          loading: false
        })
      } else {
        throw new Error(data.message || 'Error al cargar tareas')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido'
      set({ error: message, loading: false })
      toast.error(`Error al cargar tareas: ${message}`)
    }
  },

  createTarea: async (data) => {
    set({ loading: true, error: null })

    try {
      const response = await fetch(`${API_BASE}/tareas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Tarea creada exitosamente')
        get().fetchTareas() // Recargar lista
        set({ loading: false })
        return true
      } else {
        throw new Error(result.message || 'Error al crear tarea')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido'
      set({ error: message, loading: false })
      toast.error(`Error al crear tarea: ${message}`)
      return false
    }
  },

  updateTarea: async (id, data) => {
    set({ loading: true, error: null })

    try {
      const response = await fetch(`${API_BASE}/tareas/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Tarea actualizada exitosamente')
        get().fetchTareas() // Recargar lista
        set({ loading: false })
        return true
      } else {
        throw new Error(result.message || 'Error al actualizar tarea')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido'
      set({ error: message, loading: false })
      toast.error(`Error al actualizar tarea: ${message}`)
      return false
    }
  },

  deleteTarea: async (id) => {
    if (!confirm('¿Está seguro de eliminar esta tarea? Esta acción no se puede deshacer.')) {
      return false
    }

    set({ loading: true, error: null })

    try {
      const response = await fetch(`${API_BASE}/tareas/${id}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Tarea eliminada exitosamente')
        get().fetchTareas() // Recargar lista
        set({ loading: false })
        return true
      } else {
        throw new Error(result.message || 'Error al eliminar tarea')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido'
      set({ error: message, loading: false })
      toast.error(`Error al eliminar tarea: ${message}`)
      return false
    }
  },

  setFilters: (newFilters) => {
    const { filters } = get()
    const updatedFilters = { ...filters, ...newFilters }
    set({ filters: updatedFilters })
    get().fetchTareas(1) // Reset to first page
  },

  clearFilters: () => {
    set({
      filters: {
        search: '',
        technician_id: '',
        status: '',
        priority: ''
      }
    })
    get().fetchTareas(1)
  },

  getTareaById: (id) => {
    return get().tareas.find(t => t.id === id)
  }
}))