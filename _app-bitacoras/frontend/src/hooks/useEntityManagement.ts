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
  entities?: T[]
  loading: boolean
  error: string | null
  pagination?: {
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
  store: EntityStore<T> & { [key: string]: any },
  entityName: string,
  entityNamePlural: string = entityName + 's',
  entitiesKey: string = 'entities'
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
    console.log('[DEBUG] entitiesKey:', entitiesKey)
    console.log('[DEBUG] store[entitiesKey]:', store[entitiesKey])
    console.log('[DEBUG] store[entitiesKey] type:', typeof store[entitiesKey])
    console.log('[DEBUG] store[entitiesKey] length:', store[entitiesKey]?.length)
    console.log('[DEBUG] entityName:', entityName)

    const entities = store[entitiesKey]
    if (!entities || !Array.isArray(entities)) {
      console.error('[DEBUG] store[entitiesKey] is not an array or is undefined')
      return
    }

    const entity = entities.find(e => e.id === id)
    console.log('[DEBUG] Found entity:', entity)
    console.log('[DEBUG] Entity id type:', typeof entity?.id, 'Entity id value:', entity?.id)

    if (entity) {
      console.log('[DEBUG] Setting editingEntity and showEditForm')
      setEditingEntity(entity)
      setShowEditForm(true)

      // Scroll suave al formulario de edición con animación mejorada
      setTimeout(() => {
        const editForm = document.getElementById('editFormSection')
        console.log('[DEBUG] Looking for editFormSection element:', editForm)
        if (editForm) {
          console.log('[DEBUG] Scrolling to edit form')
          editForm.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          })

          // Agregar clase para animación adicional
          editForm.classList.add('highlight-form')
          setTimeout(() => {
            editForm.classList.remove('highlight-form')
          }, 2000)
        } else {
          console.warn('[DEBUG] editFormSection element not found')
        }
      }, 150)
    } else {
      console.warn(`Entity with id ${id} not found in store. Available entities:`, entities.map(e => e.id))
    }
  }

  const handleUpdate = async (data: Partial<T>) => {
    console.log('[DEBUG] handleUpdate called with data:', data)
    console.log('[DEBUG] editingEntity:', editingEntity)
    console.log('[DEBUG] store.updateEntity available:', typeof store.updateEntity)

    if (!editingEntity) {
      console.warn('[DEBUG] No editingEntity found, returning early')
      return
    }

    try {
      // Filtrar solo los campos que realmente cambiaron y son válidos para actualizar
      const updateData: Partial<T> = {}

      // Para tareas, solo enviar campos específicos que pueden actualizarse
      if (entityName === 'tareas') {
        const allowedFields = ['title', 'description', 'technician_id', 'status', 'priority', 'due_date']
        allowedFields.forEach(key => {
          const currentValue = editingEntity[key as keyof T]
          const newValue = data[key as keyof T]
          // Comparar valores y solo incluir si son diferentes
          if (newValue !== undefined && newValue !== currentValue) {
            updateData[key as keyof T] = newValue
          }
        })
      } else {
        // Para otras entidades, copiar todos los datos
        Object.assign(updateData, data)
      }

      console.log('[DEBUG] Filtered update data:', updateData)

      if (Object.keys(updateData).length === 0) {
        console.log('[DEBUG] No changes detected, closing form')
        setShowEditForm(false)
        setEditingEntity(null)
        return
      }

      console.log('[DEBUG] Calling store.updateEntity with id:', editingEntity.id)
      console.log('[DEBUG] Data to send:', updateData)
      await store.updateEntity(editingEntity.id, updateData)
      console.log('[DEBUG] Update successful, showing success toast')
      toast.success(`${entityName} actualizado exitosamente`)

      console.log('[DEBUG] Setting showEditForm to false and editingEntity to null')
      setShowEditForm(false)
      setEditingEntity(null)

      console.log('[DEBUG] Form should be closed now')
    } catch (error) {
      console.error('[DEBUG] Error in handleUpdate:', error)
      console.error('[DEBUG] Error details:', error instanceof Error ? error.message : error)
      toast.error(`Error al actualizar ${entityName.toLowerCase()}: ${error instanceof Error ? error.message : 'Error desconocido'}`)
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
    const entities = store[entitiesKey]
    const entity = entities?.find(e => e.id === id)
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