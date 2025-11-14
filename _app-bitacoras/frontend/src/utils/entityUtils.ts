// Utilidades compartidas para formateo y configuración de entidades
import React from 'react'

export interface BadgeConfig {
  text: string
  class: string
}

export interface EntityConfig {
  formatters: Record<string, (value: any) => string>
  icons: Record<string, string>
  badges: Record<string, BadgeConfig>
  categories?: Record<string, string>
  roles?: Record<string, string>
  departments?: Record<string, string>
}

export interface PartialEntityConfig extends Partial<EntityConfig> {
  formatters: Record<string, (value: any) => string>
  icons: Record<string, string>
  badges: Record<string, BadgeConfig>
}

// Configuración específica para técnicos
export const tecnicoConfig: EntityConfig = {
  formatters: {
    role: (role: string) => ({
      'admin': 'Administrador',
      'technician': 'Técnico',
      'viewer': 'Visualizador'
    }[role] || role),

    department: (dept: string) => ({
      'dtic': 'DTIC',
      'sistemas': 'Sistemas',
      'redes': 'Redes',
      'seguridad': 'Seguridad'
    }[dept] || dept),

    status: (status: boolean) => status ? 'Activo' : 'Inactivo',

    date: (date: string) => new Date(date).toLocaleDateString('es-AR')
  },

  icons: {
    'admin': 'fa-user-shield',
    'technician': 'fa-user-cog',
    'viewer': 'fa-user'
  },

  badges: {
    'admin': { text: 'Administrador', class: 'bg-danger' },
    'technician': { text: 'Técnico', class: 'bg-info' },
    'viewer': { text: 'Visualizador', class: 'bg-secondary' },
    'active': { text: 'Activo', class: 'bg-success' },
    'inactive': { text: 'Inactivo', class: 'bg-warning' }
  },

  roles: {
    'admin': 'Administrador',
    'technician': 'Técnico',
    'viewer': 'Visualizador'
  },

  departments: {
    'dtic': 'DTIC',
    'sistemas': 'Sistemas',
    'redes': 'Redes',
    'seguridad': 'Seguridad'
  }
}

// Configuración específica para recursos
export const recursoConfig: EntityConfig = {
  formatters: {
    category: (category: string) => ({
      'hardware': 'Hardware',
      'software': 'Software',
      'network': 'Redes',
      'security': 'Seguridad',
      'tools': 'Herramientas',
      'facilities': 'Instalaciones'
    }[category] || category),

    status: (status: string) => ({
      'available': 'Disponible',
      'assigned': 'Asignado',
      'maintenance': 'Mantenimiento',
      'retired': 'Retirado'
    }[status] || status),

    statusCategory: (entity: any) => {
      const statusText = ({
        'available': 'Disponible',
        'assigned': 'Asignado',
        'maintenance': 'Mantenimiento',
        'retired': 'Retirado'
      } as Record<string, string>)[entity.status] || entity.status;

      const categoryText = ({
        'hardware': 'Hardware',
        'software': 'Software',
        'network': 'Redes',
        'security': 'Seguridad',
        'tools': 'Herramientas',
        'facilities': 'Instalaciones'
      } as Record<string, string>)[entity.category] || entity.category;

      return `${statusText} - ${categoryText}`;
    },

    modeloSerie: (entity: any) => {
      const model = entity.model || '';
      const serie = entity.serial_number || '';
      if (model && serie) return `${model} - ${serie}`;
      if (model) return model;
      if (serie) return serie;
      return '-';
    },

    recursoModeloSerie: (entity: any) => {
      const name = entity.name || '';
      const model = entity.model || '';
      const serie = entity.serial_number || '';
      let modelSerie = '';
      if (model && serie) modelSerie = `${model} - ${serie}`;
      else if (model) modelSerie = model;
      else if (serie) modelSerie = serie;
      else modelSerie = '-';

      return `${name}\n${modelSerie}`;
    },

    formatRelatedTasks: (entity: any) => {
      const relatedTasks = entity.related_tasks || []

      if (!Array.isArray(relatedTasks) || relatedTasks.length === 0) {
        return 'Sin tareas relacionadas'
      }

      const firstTask = relatedTasks[0]
      const remainingCount = relatedTasks.length - 1

      let result = firstTask.title || 'Sin título'
      if (remainingCount > 0) {
        result += ` y ${remainingCount} tarea${remainingCount !== 1 ? 's' : ''} más`
      }
      return result
    },

    date: (date: string) => new Date(date).toLocaleDateString('es-AR')
  },

  icons: {
    'hardware': 'fa-laptop',
    'software': 'fa-key',
    'network': 'fa-router',
    'security': 'fa-shield-alt',
    'tools': 'fa-tools',
    'facilities': 'fa-building'
  },

  badges: {
    'available': { text: 'Disponible', class: 'bg-success' },
    'assigned': { text: 'Asignado', class: 'bg-info' },
    'maintenance': { text: 'Mantenimiento', class: 'bg-warning' },
    'retired': { text: 'Retirado', class: 'bg-secondary' }
  },

  categories: {
    'hardware': 'Hardware',
    'software': 'Software',
    'network': 'Redes',
    'security': 'Seguridad',
    'tools': 'Herramientas',
    'facilities': 'Instalaciones'
  }
}

// Clase utilitaria para trabajar con configuraciones de entidades
export class EntityUtils {
  constructor(private config: EntityConfig) {}

  formatValue(key: string, value: any): string {
    const formatter = this.config.formatters[key]
    return formatter ? formatter(value) : String(value)
  }

  getIcon(key: string): string {
    return this.config.icons[key] || 'fa-question'
  }

  getBadge(status: string): BadgeConfig {
    return this.config.badges[status] || { text: status, class: 'bg-secondary' }
  }

  getCategoryIcon(category: string): string {
    return this.config.icons[category] || 'fa-box'
  }

  formatRole(role: string): string {
    return this.config.roles?.[role] || role
  }

  formatDepartment(dept: string): string {
    return this.config.departments?.[dept] || dept
  }

  formatCategory(category: string): string {
    return this.config.categories?.[category] || category
  }

  formatPriority(priority: string): string {
    return this.config.formatters.priority(priority)
  }

  formatStatus(status: string): string {
    return this.config.formatters.status(status)
  }

  formatDate(dateString: string): string {
    return this.config.formatters.date(dateString)
  }
}

// Configuración específica para tareas
export const tareaConfig: EntityConfig = {
  formatters: {
    priority: (priority: string) => ({
      'low': 'Baja',
      'medium': 'Media',
      'high': 'Alta',
      'urgent': 'Urgente'
    }[priority] || priority),

    status: (status: string) => ({
      'pending': 'Pendiente',
      'in_progress': 'En Progreso',
      'completed': 'Completada',
      'cancelled': 'Cancelada'
    }[status] || status),

    date: (date: string) => new Date(date).toLocaleDateString('es-AR')
  },

  icons: {
    'low': 'fa-arrow-down',
    'medium': 'fa-minus',
    'high': 'fa-arrow-up',
    'urgent': 'fa-exclamation-triangle',
    'pending': 'fa-clock',
    'in_progress': 'fa-play',
    'completed': 'fa-check',
    'cancelled': 'fa-times'
  },

  badges: {
    'pending': { text: 'Pendiente', class: 'badge-status-pending' },
    'in_progress': { text: 'En Progreso', class: 'badge-status-in_progress' },
    'completed': { text: 'Completada', class: 'badge-status-completed' },
    'cancelled': { text: 'Cancelada', class: 'badge-status-cancelled' },
    'low': { text: 'Baja', class: 'badge-priority-low' },
    'medium': { text: 'Media', class: 'badge-priority-medium' },
    'high': { text: 'Alta', class: 'badge-priority-high' },
    'urgent': { text: 'Urgente', class: 'badge-priority-urgent' }
  }
}

// Instancias pre-configuradas
export const tecnicoUtils = new EntityUtils(tecnicoConfig)
export const recursoUtils = new EntityUtils(recursoConfig)
export const tareaUtils = new EntityUtils(tareaConfig)

// Función helper para crear utilidades personalizadas
export const createEntityUtils = (config: PartialEntityConfig) => new EntityUtils(config as EntityConfig)