import { create } from 'zustand'

export interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}

export interface BaseEntityState<T> {
  entities: T[]
  loading: boolean
  error: string | null
  pagination: Pagination
  filters: Record<string, any>
}

export interface BaseEntityActions<T> {
  setEntities: (entities: T[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setPagination: (pagination: Pagination) => void
  setFilters: (filters: Record<string, any>) => void
  clearFilters: () => void
  reset: () => void
}

export type BaseEntityStore<T> = BaseEntityState<T> & BaseEntityActions<T>

export const createBaseEntityStore = <T extends { id: number }>(
  entityName: string,
  apiUrl: string
) => {
  const initialState: BaseEntityState<T> = {
    entities: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 12,
      total: 0,
      pages: 1
    },
    filters: {}
  }

  return create<BaseEntityStore<T>>((set, get) => ({
    ...initialState,

    setEntities: (entities) => set({ entities }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    setPagination: (pagination) => set({ pagination }),
    setFilters: (filters) => set({ filters: { ...get().filters, ...filters } }),
    clearFilters: () => set({ filters: {} }),
    reset: () => set(initialState)
  }))
}

// Función helper para crear acciones comunes de API
export const createEntityApiActions = <T extends { id: number }>(
  apiUrl: string,
  store: any
) => ({
  fetchEntities: async (page = 1) => {
    store.setLoading(true)
    store.setError(null)

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: store.pagination.limit.toString(),
        ...store.filters
      })

      const response = await fetch(`${apiUrl}?${params}`)
      const data = await response.json()

      if (data.success) {
        store.setEntities(data.data.entities || data.data.technicians || data.data.tasks || [])
        store.setPagination(data.data.pagination)
      } else {
        store.setError(data.message || 'Error al cargar datos')
      }
    } catch (error) {
      console.error(`Error fetching ${apiUrl}:`, error)
      store.setError('Error de conexión')
    } finally {
      store.setLoading(false)
    }
  },

  createEntity: async (data: Partial<T>) => {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (result.success) {
        // Refresh the list
        store.fetchEntities(store.pagination.page)
      } else {
        throw new Error(result.message || 'Error al crear')
      }
    } catch (error) {
      console.error(`Error creating entity in ${apiUrl}:`, error)
      throw error
    }
  },

  updateEntity: async (id: number, data: Partial<T>) => {
    try {
      const response = await fetch(`${apiUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (result.success) {
        // Refresh the list
        store.fetchEntities(store.pagination.page)
      } else {
        throw new Error(result.message || 'Error al actualizar')
      }
    } catch (error) {
      console.error(`Error updating entity ${id} in ${apiUrl}:`, error)
      throw error
    }
  },

  deleteEntity: async (id: number) => {
    try {
      const response = await fetch(`${apiUrl}/${id}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (result.success) {
        // Refresh the list
        store.fetchEntities(store.pagination.page)
      } else {
        throw new Error(result.message || 'Error al eliminar')
      }
    } catch (error) {
      console.error(`Error deleting entity ${id} in ${apiUrl}:`, error)
      throw error
    }
  }
})