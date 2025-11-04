import { useGenericEntityStore } from '../stores/genericEntityStore'
import toast from 'react-hot-toast'

export interface ActionHandler {
  (entity: any, ...args: any[]): Promise<void> | void
}

export interface ActionHandlers {
  [key: string]: ActionHandler
}

export const createActionHandlers = (entityKey: string): ActionHandlers => {
  const store = useGenericEntityStore()

  return {
    view: (entity: any) => {
      // This will be handled by the modal system in EntityPage
      console.log('View entity:', entity)
      // The actual modal opening is handled in EntityPage.tsx
    },

    edit: (entity: any) => {
      store.setEditingEntity?.(entity.id)
      store.setShowEditForm?.(true)
    },

    delete: async (entity: any) => {
      // This is now handled by the EntityPage component with custom confirmation
      // The actual deletion logic is in EntityPage.tsx
    },

    changePassword: (entity: any) => {
      // This will be handled by the modal system
      console.log('Change password for:', entity)
    },

    toggleStatus: async (entity: any, isActive?: boolean) => {
      const action = entity.is_active ? 'desactivar' : 'reactivar'
      if (window.confirm(`¿Está seguro de ${action} este ${entityKey.slice(0, -1)}?`)) {
        try {
          await store.toggleEntityStatus?.(entity.id, !entity.is_active)
          toast.success(`${entityKey.slice(0, -1)} ${action}do exitosamente`)
        } catch (error) {
          // Error handled by store
        }
      }
    },

    assign: (entity: any) => {
      // This will be handled by the modal system
      console.log('Assign entity:', entity)
    },

    unassign: async (entity: any, userId: number) => {
      if (window.confirm('¿Está seguro de desasignar este recurso del usuario?')) {
        try {
          await store.unassignEntity?.(entity.id, userId)
        } catch (error) {
          // Error handled by store
        }
      }
    }
  }
}

export const getActionIcon = (actionKey: string, condition?: boolean): string => {
  const icons: Record<string, string> = {
    view: 'fa-eye',
    edit: 'fa-edit',
    delete: 'fa-trash',
    changePassword: 'fa-key',
    assign: 'fa-user-plus',
    unassign: 'fa-user-minus'
  }

  if (actionKey === 'toggleStatus') {
    return condition ? 'fa-ban' : 'fa-check'
  }

  return icons[actionKey] || 'fa-cog'
}

export const getActionColor = (actionKey: string, condition?: boolean): string => {
  const colors: Record<string, string> = {
    view: 'primary',
    edit: 'warning',
    delete: 'danger',
    changePassword: 'info',
    assign: 'success',
    unassign: 'secondary'
  }

  if (actionKey === 'toggleStatus') {
    return condition ? 'danger' : 'success'
  }

  return colors[actionKey] || 'secondary'
}

export const getActionLabel = (actionKey: string, entityName: string): string => {
  const labels: Record<string, string> = {
    view: `Ver ${entityName}`,
    edit: 'Editar',
    delete: `Eliminar ${entityName}`,
    changePassword: 'Cambiar contraseña',
    assign: 'Asignar Usuario',
    unassign: 'Desasignar',
    toggleStatus: 'Desactivar/Reactivar'
  }

  return labels[actionKey] || actionKey
}