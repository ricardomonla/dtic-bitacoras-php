import { create } from 'zustand'

export interface Tecnico {
  id: number
  dtic_id: string
  first_name: string
  last_name: string
  full_name: string
  email: string
  phone?: string
  department: string
  role: 'admin' | 'technician' | 'viewer'
  is_active: boolean
  created_at: string
  updated_at: string
  active_tasks: number
}

interface TecnicosFilters {
  search?: string
  department?: string
  role?: string
  status?: 'active' | 'inactive' | 'all'
}

interface PaginationInfo {
  page: number
  limit: number
  total: number
  pages: number
}

interface TecnicosState {
  tecnicos: Tecnico[]
  filters: TecnicosFilters
  pagination: PaginationInfo | null
  isLoading: boolean
  error: string | null

  // Actions
  fetchTecnicos: (page?: number) => Promise<void>
  createTecnico: (data: Partial<Tecnico>) => Promise<void>
  updateTecnico: (id: number, data: Partial<Tecnico>) => Promise<void>
  deleteTecnico: (id: number) => Promise<void>
  toggleTecnicoStatus: (id: number, isActive: boolean) => Promise<void>
  setFilters: (filters: Partial<TecnicosFilters>) => void
  clearFilters: () => void
  getTecnicoById: (id: number) => Tecnico | undefined
}

export const useTecnicosStore = create<TecnicosState>((set, get) => ({
  tecnicos: [],
  filters: {},
  pagination: null,
  isLoading: false,
  error: null,

  fetchTecnicos: async (page = 1) => {
    console.log('[DEBUG] fetchTecnicos called with page:', page)
    set({ isLoading: true, error: null })

    try {
      const { filters } = get()
      console.log('[DEBUG] Current filters:', filters)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        ...filters
      })

      const url = `/api/tecnicos?${params}`
      console.log('[DEBUG] Fetching URL:', url)

      const response = await fetch(url)
      console.log('[DEBUG] Response status:', response.status)
      console.log('[DEBUG] Response headers:', Object.fromEntries(response.headers.entries()))

      const data = await response.json()
      console.log('[DEBUG] Response data:', data)

      if (!data.success) {
        throw new Error(data.message || 'Error al cargar técnicos')
      }

      console.log('[DEBUG] Setting tecnicos:', data.data.tecnicos?.length || 0, 'items')
      set({
        tecnicos: data.data.tecnicos,
        pagination: data.data.pagination,
        isLoading: false
      })
    } catch (error) {
      console.error('[DEBUG] Error in fetchTecnicos:', error)
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false
      })
    }
  },

  createTecnico: async (data) => {
    console.log('[DEBUG] createTecnico called with data:', data)
    set({ isLoading: true, error: null })

    try {
      const url = '/api/tecnicos'
      console.log('[DEBUG] POST request to:', url)

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      console.log('[DEBUG] Response status:', response.status)
      console.log('[DEBUG] Response headers:', Object.fromEntries(response.headers.entries()))

      const result = await response.json()
      console.log('[DEBUG] Response data:', result)

      if (!result.success) {
        throw new Error(result.message || 'Error al crear técnico')
      }

      // Recargar la lista
      console.log('[DEBUG] Reloading tecnicos list after create')
      await get().fetchTecnicos()
      set({ isLoading: false })
    } catch (error) {
      console.error('[DEBUG] Error creating tecnico:', error)
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false
      })
      throw error
    }
  },

  updateTecnico: async (id, data) => {
    console.log('[DEBUG] updateTecnico called with id:', id, 'data:', data)
    set({ isLoading: true, error: null })

    try {
      const url = `/api/tecnicos/${id}`
      console.log('[DEBUG] PUT request to:', url)

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      console.log('[DEBUG] Response status:', response.status)
      console.log('[DEBUG] Response headers:', Object.fromEntries(response.headers.entries()))

      const result = await response.json()
      console.log('[DEBUG] Response data:', result)

      if (!result.success) {
        throw new Error(result.message || 'Error al actualizar técnico')
      }

      // Recargar la lista
      console.log('[DEBUG] Reloading tecnicos list after update')
      await get().fetchTecnicos()
      set({ isLoading: false })
    } catch (error) {
      console.error('[DEBUG] Error updating tecnico:', error)
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false
      })
      throw error
    }
  },

  deleteTecnico: async (id) => {
    set({ isLoading: true, error: null })

    try {
      const response = await fetch(`/api/tecnicos/${id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.message || 'Error al eliminar técnico')
      }

      // Recargar la lista
      await get().fetchTecnicos()
      set({ isLoading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false
      })
      throw error
    }
  },

  toggleTecnicoStatus: async (id, isActive) => {
    await get().updateTecnico(id, { is_active: isActive })
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters }
    }))
  },

  clearFilters: () => {
    set({ filters: {} })
  },

  getTecnicoById: (id) => {
    return get().tecnicos.find((tecnico) => tecnico.id === id)
  },
}))