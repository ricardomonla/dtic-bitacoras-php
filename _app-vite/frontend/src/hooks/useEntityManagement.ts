import { useState } from 'react'
import toast from 'react-hot-toast'

export interface EntityManagementState<T> {
  showEditForm: boolean
  setShowEditForm: (show: boolean) => void
  editingEntity: T | null
  setEditingEntity: (entity: T | null) => void
  showCreateForm: boolean
  setShowCreateForm: (show: boolean) => void
}

export interface EntityManagementActions<T> {
  handleCreate: (data: Partial<T>) => Promise<void>
  handleEdit: (id: number) => Promise<void>
  handleUpdate: (data: Partial<T>) => Promise<void>
  handleDelete: (id: number) => Promise<void>
  handleViewProfile: (id: number) => void
}

export interface EntityStore<T> {
  entities: T[]
  loading: boolean
  error: string | null
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
  filters: Record<string, any>
  fetchEntities: (page?: number) => Promise<void>
  createEntity: (data: Partial<T>) => Promise<void>
  updateEntity: (id: number, data: Partial<T>) => Promise<void>
  deleteEntity: (id: number) => Promise<void>
  setFilters: (filters: Record<string, any>) => void
  clearFilters: () => void
}

export const useEntityManagement = <T extends { id: number; name?: string; full_name?: string }>(
  store: EntityStore<T>,
  entityName: string,
  entityNamePlural: string = entityName + 's'
): EntityManagementState<T> & EntityManagementActions<T> => {
  const [showEditForm, setShowEditForm] = useState(false)
  const [editingEntity, setEditingEntity] = useState<T | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)

  const handleCreate = async (data: Partial<T>) => {
    try {
      await store.createEntity(data)
      toast.success(`${entityName} creado exitosamente`)
      setShowCreateForm(false)
    } catch (error) {
      // Error handled by store
    }
  }

  const handleEdit = async (id: number) => {
    console.log('[DEBUG] handleEdit called with id:', id)
    console.log('[DEBUG] store.entities:', store.entities)
    console.log('[DEBUG] store.entities type:', typeof store.entities)
    console.log('[DEBUG] store.entities length:', store.entities?.length)

    if (!store.entities || !Array.isArray(store.entities)) {
      console.error('[DEBUG] store.entities is not an array or is undefined')
      return
    }

    const entity = store.entities.find(e => e.id === id)
    console.log('[DEBUG] Found entity:', entity)

    if (entity) {
      setEditingEntity(entity)
      setShowEditForm(true)

      // Scroll suave al formulario de edición con animación mejorada
      setTimeout(() => {
        const editForm = document.getElementById('editFormSection')
        if (editForm) {
          editForm.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          })

          // Agregar clase para animación adicional
          editForm.classList.add('highlight-form')
          setTimeout(() => {
            editForm.classList.remove('highlight-form')
          }, 2000)
        }
      }, 150)
    } else {
      console.warn(`Entity with id ${id} not found in store. Available entities:`, store.entities.map(e => e.id))
    }
  }

  const handleUpdate = async (data: Partial<T>) => {
    console.log('[DEBUG] handleUpdate called with data:', data)
    console.log('[DEBUG] editingEntity:', editingEntity)

    if (!editingEntity) {
      console.warn('[DEBUG] No editingEntity found, returning early')
      return
    }

    try {
      console.log('[DEBUG] Calling store.updateEntity with id:', editingEntity.id)
      await store.updateEntity(editingEntity.id, data)
      console.log('[DEBUG] Update successful, showing success toast')
      toast.success(`${entityName} actualizado exitosamente`)

      console.log('[DEBUG] Setting showEditForm to false and editingEntity to null')
      setShowEditForm(false)
      setEditingEntity(null)

      console.log('[DEBUG] Form should be closed now')
    } catch (error) {
      console.error('[DEBUG] Error in handleUpdate:', error)
      // Error handled by store
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm(`¿Está seguro de eliminar este ${entityName.toLowerCase()}?`)) {
      try {
        await store.deleteEntity(id)
        toast.success(`${entityName} eliminado exitosamente`)
      } catch (error) {
        // Error handled by store
      }
    }
  }

  const handleViewProfile = (id: number) => {
    const entity = store.entities.find(e => e.id === id)
    if (entity) {
      toast.info(`Ver detalles del ${entityName.toLowerCase()}: ${entity.full_name || entity.name || 'Sin nombre'}`)
    }
  }

  return {
    // State
    showEditForm,
    setShowEditForm,
    editingEntity,
    setEditingEntity,
    showCreateForm,
    setShowCreateForm,
    // Actions
    handleCreate,
    handleEdit,
    handleUpdate,
    handleDelete,
    handleViewProfile
  }
}