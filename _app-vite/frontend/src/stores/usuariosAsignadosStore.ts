import { create } from 'zustand'
import toast from 'react-hot-toast'

export interface UsuarioAsignado {
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
  updated_at: string
  assigned_resources_count?: number
  assigned_resources?: RecursoAsignado[]
}

export interface RecursoAsignado {
  id: number
  dtic_id: string
  name: string
  category: string
  status: string
  location?: string
  assigned_at: string
}

interface UsuariosAsignadosState {
  usuarios: UsuarioAsignado[]
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
    department: string
  }

  // Actions
  fetchUsuarios: (page?: number) => Promise<void>
  createUsuario: (data: Partial<UsuarioAsignado>) => Promise<boolean>
  updateUsuario: (id: number, data: Partial<UsuarioAsignado>) => Promise<boolean>
  deleteUsuario: (id: number) => Promise<boolean>
  setFilters: (filters: Partial<UsuariosAsignadosState['filters']>) => void
  clearFilters: () => void
  getUsuarioById: (id: number) => UsuarioAsignado | undefined
}

const API_BASE = import.meta.env.VITE_API_URL || '/api'

export const useUsuariosAsignadosStore = create<UsuariosAsignadosState>((set, get) => ({
  usuarios: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  },
  filters: {
    search: '',
    department: ''
  },

  fetchUsuarios: async (page = 1) => {
    set({ loading: true, error: null })

    try {
      const { filters } = get()
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== '')
        )
      })

      const response = await fetch(`${API_BASE}/usuarios_asignados?${params}`)
      const data = await response.json()

      if (data.success) {
        set({
          usuarios: data.data.usuarios,
          pagination: data.data.pagination,
          loading: false
        })
      } else {
        throw new Error(data.message || 'Error al cargar usuarios asignados')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido'
      set({ error: message, loading: false })
      toast.error(`Error al cargar usuarios asignados: ${message}`)
    }
  },

  createUsuario: async (data) => {
    set({ loading: true, error: null })

    try {
      const response = await fetch(`${API_BASE}/usuarios_asignados`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Usuario asignado creado exitosamente')
        get().fetchUsuarios() // Recargar lista
        set({ loading: false })
        return true
      } else {
        throw new Error(result.message || 'Error al crear usuario asignado')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido'
      set({ error: message, loading: false })
      toast.error(`Error al crear usuario asignado: ${message}`)
      return false
    }
  },

  updateUsuario: async (id, data) => {
    set({ loading: true, error: null })

    try {
      const response = await fetch(`${API_BASE}/usuarios_asignados/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Usuario asignado actualizado exitosamente')
        get().fetchUsuarios() // Recargar lista
        set({ loading: false })
        return true
      } else {
        throw new Error(result.message || 'Error al actualizar usuario asignado')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido'
      set({ error: message, loading: false })
      toast.error(`Error al actualizar usuario asignado: ${message}`)
      return false
    }
  },

  deleteUsuario: async (id) => {
    if (!confirm('¿Está seguro de eliminar este usuario asignado? Esta acción no se puede deshacer.')) {
      return false
    }

    set({ loading: true, error: null })

    try {
      const response = await fetch(`${API_BASE}/usuarios_asignados/${id}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Usuario asignado eliminado exitosamente')
        get().fetchUsuarios() // Recargar lista
        set({ loading: false })
        return true
      } else {
        throw new Error(result.message || 'Error al eliminar usuario asignado')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido'
      set({ error: message, loading: false })
      toast.error(`Error al eliminar usuario asignado: ${message}`)
      return false
    }
  },

  setFilters: (newFilters) => {
    const { filters } = get()
    const updatedFilters = { ...filters, ...newFilters }
    set({ filters: updatedFilters })
    get().fetchUsuarios(1) // Reset to first page
  },

  clearFilters: () => {
    set({
      filters: {
        search: '',
        department: ''
      }
    })
    get().fetchUsuarios(1)
  },

  getUsuarioById: (id) => {
    return get().usuarios.find(u => u.id === id)
  }
}))