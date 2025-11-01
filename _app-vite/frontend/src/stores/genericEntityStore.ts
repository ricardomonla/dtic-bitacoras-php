import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export interface EntityConfig {
  name: string
  api: {
    endpoint: string
    methods: Record<string, string>
  }
  fields: any[]
  table: {
    columns: any[]
  }
  filters: any[]
  actions: any[]
  stats: any[]
  modals: any[]
}

export interface GenericEntityState {
  entities: any[]
  loading: boolean
  error: string | null
  pagination: {
    page: number
    pages: number
    total: number
    per_page: number
  } | null
  filters: Record<string, any>
  config: EntityConfig | null
}

export interface GenericEntityActions {
  setConfig: (config: EntityConfig) => void
  fetchEntities: (page?: number) => Promise<void>
  createEntity: (data: any) => Promise<void>
  updateEntity: (id: number, data: any) => Promise<void>
  deleteEntity: (id: number) => Promise<void>
  setFilters: (filters: Record<string, any>) => void
  clearFilters: () => void
  reset: () => void
}

export type GenericEntityStore = GenericEntityState & GenericEntityActions

const initialState: GenericEntityState = {
  entities: [],
  loading: false,
  error: null,
  pagination: null,
  filters: {},
  config: null
}

export const useGenericEntityStore = create<GenericEntityStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      setConfig: (config: EntityConfig) => {
        set({ config })
      },

      fetchEntities: async (page = 1) => {
        const { config, filters } = get()
        if (!config) return

        set({ loading: true, error: null })

        try {
          const queryParams = new URLSearchParams({
            page: page.toString(),
            ...filters
          })

          const response = await fetch(`${config.api.endpoint}?${queryParams}`)
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }

          const data = await response.json()
          set({
            entities: data.data || data,
            pagination: data.pagination || null,
            loading: false
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Error fetching entities',
            loading: false
          })
        }
      },

      createEntity: async (data: any) => {
        const { config } = get()
        if (!config) return

        try {
          const response = await fetch(config.api.endpoint, {
            method: config.api.methods.create,
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          })

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }

          // Refresh entities after creation
          get().fetchEntities()
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Error creating entity'
          })
          throw error
        }
      },

      updateEntity: async (id: number, data: any) => {
        const { config } = get()
        if (!config) return

        try {
          const response = await fetch(`${config.api.endpoint}/${id}`, {
            method: config.api.methods.update,
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          })

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }

          // Refresh entities after update
          get().fetchEntities()
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Error updating entity'
          })
          throw error
        }
      },

      deleteEntity: async (id: number) => {
        const { config } = get()
        if (!config) return

        try {
          const response = await fetch(`${config.api.endpoint}/${id}`, {
            method: config.api.methods.delete
          })

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }

          // Refresh entities after deletion
          get().fetchEntities()
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Error deleting entity'
          })
          throw error
        }
      },

      setFilters: (filters: Record<string, any>) => {
        set({ filters })
      },

      clearFilters: () => {
        set({ filters: {} })
      },

      reset: () => {
        set(initialState)
      }
    }),
    {
      name: 'generic-entity-store'
    }
  )
)