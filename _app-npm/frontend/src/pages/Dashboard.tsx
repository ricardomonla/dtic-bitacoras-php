import { useEffect, useState } from 'react'
import { useAuthStore } from '../stores/authStore'

interface DashboardStats {
  tecnicos: {
    total: number
    activos: number
    inactivos: number
    administradores: number
  }
  tareas: {
    total: number
    pendientes: number
    enProgreso: number
    completadas: number
    canceladas: number
  }
  recursos: {
    total: number
    disponibles: number
    asignados: number
    mantenimiento: number
  }
  usuarios: {
    total: number
    conRecursos: number
    sinRecursos: number
  }
}

interface UpcomingEvent {
  id: string
  title: string
  start: string
  end: string
  type: string
  technician: string
  technicianName: string
  resource: string
  resourceName: string
  description: string
}

interface RecentActivity {
  id: string
  timestamp: string
  title: string
  description: string
  type: string
}

const Dashboard = () => {
  const { user } = useAuthStore()
  const [stats, setStats] = useState<DashboardStats>({
    tecnicos: { total: 0, activos: 0, inactivos: 0, administradores: 0 },
    tareas: { total: 0, pendientes: 0, enProgreso: 0, completadas: 0, canceladas: 0 },
    recursos: { total: 0, disponibles: 0, asignados: 0, mantenimiento: 0 },
    usuarios: { total: 0, conRecursos: 0, sinRecursos: 0 }
  })
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([])
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [currentDate, setCurrentDate] = useState('')
  const [currentTime, setCurrentTime] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
    updateDateTime()
    const timeInterval = setInterval(updateDateTime, 1000)
    return () => clearInterval(timeInterval)
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)

      // Load data from all entities
      const [tecnicosRes, tareasRes, recursosRes, usuariosRes] = await Promise.all([
        fetch('/api/tecnicos'),
        fetch('/api/tareas'),
        fetch('/api/recursos'),
        fetch('/api/usuarios_asignados')
      ])

      const tecnicos = tecnicosRes.ok ? await tecnicosRes.json() : []
      const tareas = tareasRes.ok ? await tareasRes.json() : []
      const recursos = recursosRes.ok ? await recursosRes.json() : []
      const usuarios = usuariosRes.ok ? await usuariosRes.json() : []

      // Calculate statistics
      const tecnicosStats = {
        total: tecnicos.length,
        activos: tecnicos.filter((t: any) => t.is_active).length,
        inactivos: tecnicos.filter((t: any) => !t.is_active).length,
        administradores: tecnicos.filter((t: any) => t.role === 'admin').length
      }

      const tareasStats = {
        total: tareas.length,
        pendientes: tareas.filter((t: any) => t.status === 'pending').length,
        enProgreso: tareas.filter((t: any) => t.status === 'in_progress').length,
        completadas: tareas.filter((t: any) => t.status === 'completed').length,
        canceladas: tareas.filter((t: any) => t.status === 'cancelled').length
      }

      const recursosStats = {
        total: recursos.length,
        disponibles: recursos.filter((r: any) => r.status === 'available').length,
        asignados: recursos.filter((r: any) => r.status === 'assigned').length,
        mantenimiento: recursos.filter((r: any) => r.status === 'maintenance').length
      }

      const usuariosStats = {
        total: usuarios.length,
        conRecursos: usuarios.filter((u: any) => (u.assigned_resources_count || 0) > 0).length,
        sinRecursos: usuarios.filter((u: any) => (u.assigned_resources_count || 0) === 0).length
      }

      setStats({
        tecnicos: tecnicosStats,
        tareas: tareasStats,
        recursos: recursosStats,
        usuarios: usuariosStats
      })

      // Generate mock upcoming events (in production, this would come from a dedicated events API)
      const mockEvents: UpcomingEvent[] = [
        {
          id: '1',
          title: 'Preparar los equipos en el Auditorio con música y proyector',
          start: '2025-11-15T14:00:00',
          end: '2025-11-15T16:00:00',
          type: 'event',
          technician: 'jgarcia',
          technicianName: 'Juan García',
          resource: 'auditorio',
          resourceName: 'Auditorio',
          description: 'Evento especial de capacitación técnica'
        },
        {
          id: '2',
          title: 'Mantenimiento preventivo de servidores',
          start: '2025-11-16T09:00:00',
          end: '2025-11-16T12:00:00',
          type: 'maintenance',
          technician: 'clopez',
          technicianName: 'Carlos López',
          resource: 'servidores',
          resourceName: 'Sala de Servidores',
          description: 'Mantenimiento rutinario de equipos'
        },
        {
          id: '3',
          title: 'Capacitación en ciberseguridad',
          start: '2025-11-18T10:00:00',
          end: '2025-11-18T12:00:00',
          type: 'training',
          technician: 'amartinez',
          technicianName: 'Ana Martínez',
          resource: 'auditorio',
          resourceName: 'Auditorio',
          description: 'Sesión de capacitación para todo el equipo'
        }
      ]
      setUpcomingEvents(mockEvents)

      // Generate mock recent activity
      const mockActivity: RecentActivity[] = [
        {
          id: '1',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          title: 'Nueva tarea completada',
          description: 'Implementar API de autenticación finalizada por María Rodríguez',
          type: 'task'
        },
        {
          id: '2',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          title: 'Recurso asignado',
          description: 'Laptop Dell Latitude 5420 asignada a Juan García',
          type: 'resource'
        },
        {
          id: '3',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          title: 'Usuario registrado',
          description: 'Ana Martínez se unió al sistema como Visualizador',
          type: 'user'
        }
      ]
      setRecentActivity(mockActivity)

    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateDateTime = () => {
    const now = new Date()
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
    setCurrentDate(now.toLocaleDateString('es-ES', options))
    setCurrentTime(now.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }))
  }

  const getEventTypeIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      'maintenance': 'fas fa-wrench',
      'event': 'fas fa-calendar-star',
      'training': 'fas fa-graduation-cap',
      'meeting': 'fas fa-users'
    }
    return icons[type] || 'fas fa-calendar'
  }

  const getActivityTypeIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      'maintenance': 'fas fa-wrench',
      'task': 'fas fa-tasks',
      'user': 'fas fa-user-plus',
      'training': 'fas fa-graduation-cap',
      'system': 'fas fa-server',
      'meeting': 'fas fa-users',
      'resource': 'fas fa-box'
    }
    return icons[type] || 'fas fa-info-circle'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-AR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mt-4">
      {/* Dashboard Header */}
      <div className="dashboard-header fade-in">
        <h1 className="dashboard-title">
          <i className="fas fa-chart-line me-3"></i>
          {user ? `Bienvenido de vuelta, ${user.first_name}!` : 'Bienvenido al Sistema DTIC Bitácoras'}
        </h1>
        <p className="dashboard-subtitle">
          {user
            ? 'Sistema de Gestión de Tareas y Recursos - Departamento de Tecnología de la Información y Comunicación'
            : 'Sistema de Gestión de Tareas y Recursos del DTIC - UTN La Rioja'
          }
        </p>
        <div className="row mt-4">
          <div className="col-md-3">
            <div className="text-center">
              <div id="current-date" className="h5 text-muted">{currentDate}</div>
              <small className="text-secondary">Fecha Actual</small>
            </div>
          </div>
          <div className="col-md-3">
            <div className="text-center">
              <div id="current-time" className="h5 text-muted">{currentTime}</div>
              <small className="text-secondary">Hora Actual</small>
            </div>
          </div>
          <div className="col-md-3">
            <div className="text-center">
              <div id="system-status" className="h5 text-success">
                <i className="fas fa-circle text-success me-1"></i>Online
              </div>
              <small className="text-secondary">Estado del Sistema</small>
            </div>
          </div>
          <div className="col-md-3">
            <div className="text-center">
              <div id="user-status" className="h5 text-primary">
                <i className="fas fa-user text-success me-1"></i>
                {user ? 'Conectado' : 'Público'}
              </div>
              <small className="text-secondary">Estado de Sesión</small>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      {user && (
        <div className="row mb-4">
          <div className="col-md-3 mb-3">
            <div className="card h-100">
              <div className="card-header">
                <i className="fas fa-clock text-warning me-2"></i>
                Tareas Pendientes
              </div>
              <div className="card-body text-center">
                <div className="card-text task-pending" id="pending-tasks">{stats.tareas.pendientes}</div>
                <small className="text-muted">Esperando asignación</small>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card h-100">
              <div className="card-header">
                <i className="fas fa-play-circle text-info me-2"></i>
                En Progreso
              </div>
              <div className="card-body text-center">
                <div className="card-text task-in-progress" id="in-progress-tasks">{stats.tareas.enProgreso}</div>
                <small className="text-muted">Actualmente trabajando</small>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card h-100">
              <div className="card-header">
                <i className="fas fa-check-circle text-success me-2"></i>
                Completadas
              </div>
              <div className="card-body text-center">
                <div className="card-text task-completed" id="completed-tasks">{stats.tareas.completadas}</div>
                <small className="text-muted">Esta semana</small>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card h-100">
              <div className="card-header">
                <i className="fas fa-times-circle text-danger me-2"></i>
                Canceladas
              </div>
              <div className="card-body text-center">
                <div className="card-text task-cancelled" id="cancelled-tasks">{stats.tareas.canceladas}</div>
                <small className="text-muted">Esta semana</small>
              </div>
            </div>
          </div>
        </div>
      )}

      {!user && (
        <div className="row mb-4">
          <div className="col-md-4 mb-3">
            <div className="card h-100">
              <div className="card-header">
                <i className="fas fa-users text-primary me-2"></i>
                Gestión de Técnicos
              </div>
              <div className="card-body text-center">
                <div className="card-text">
                  <i className="fas fa-user-cog fa-2x text-primary mb-3"></i>
                  <p>Administra el personal técnico del DTIC</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card h-100">
              <div className="card-header">
                <i className="fas fa-tasks text-success me-2"></i>
                Control de Tareas
              </div>
              <div className="card-body text-center">
                <div className="card-text">
                  <i className="fas fa-clipboard-list fa-2x text-success mb-3"></i>
                  <p>Gestiona tareas y proyectos del departamento</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card h-100">
              <div className="card-header">
                <i className="fas fa-boxes text-info me-2"></i>
                Inventario de Recursos
              </div>
              <div className="card-body text-center">
                <div className="card-text">
                  <i className="fas fa-server fa-2x text-info mb-3"></i>
                  <p>Controla equipos y recursos tecnológicos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity & Upcoming Events */}
      <div className="row">
        {/* Recent Tasks */}
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header">
              <i className="fas fa-history me-2"></i>
              Actividad Reciente
            </div>
            <div className="card-body">
              {recentActivity.length > 0 ? (
                <div className="activity-list">
                  {recentActivity.map(activity => (
                    <div key={activity.id} className="activity-item mb-3 p-2 border-start border-primary border-3">
                      <div className="d-flex align-items-start">
                        <i className={`${getActivityTypeIcon(activity.type)} me-2 mt-1`}></i>
                        <div className="flex-grow-1">
                          <small className="text-muted">{formatDate(activity.timestamp)}</small>
                          <div className="fw-bold">{activity.title}</div>
                          <small>{activity.description}</small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div id="recent-activity" className="text-center text-muted py-4">
                  <i className="fas fa-inbox fa-3x mb-3"></i>
                  <p>No hay actividad reciente para mostrar.</p>
                  <small>Las actividades aparecerán aquí una vez que se implemente el backend.</small>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <div>
                <i className="fas fa-calendar-check me-2"></i>
                Próximos Eventos
              </div>
              <a href="/calendario" className="btn btn-sm btn-outline-primary">
                <i className="fas fa-external-link-alt"></i>
              </a>
            </div>
            <div className="card-body">
              <div id="dashboard-upcoming-events">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.slice(0, 4).map(event => (
                    <div key={event.id} className="dashboard-upcoming-event mb-3 p-2 border rounded">
                      <div className="event-title">
                        <i className={`${getEventTypeIcon(event.type)} me-2`}></i>{event.title}
                      </div>
                      <div className="event-time">
                        {new Date(event.start).toLocaleString('es-AR', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                      <div className="event-details">
                        <small><strong>{event.technicianName}</strong> • {event.resourceName}</small>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted py-3">
                    <i className="fas fa-calendar-alt fa-3x mb-2"></i>
                    <p className="mb-1">No hay eventos próximos</p>
                    <small>Los próximos eventos aparecerán aquí</small>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {user && (
        <div className="row">
          <div className="col-12 mb-4">
            <div className="card">
              <div className="card-header">
                <i className="fas fa-bolt me-2"></i>
                Acciones Rápidas
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-3">
                    <div className="d-grid gap-2">
                      <button className="btn btn-primary" id="btn-new-task" disabled>
                        <i className="fas fa-plus me-2"></i>Nueva Tarea
                      </button>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="d-grid gap-2">
                      <button className="btn btn-success" id="btn-new-resource" disabled>
                        <i className="fas fa-box me-2"></i>Nuevo Recurso
                      </button>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="d-grid gap-2">
                      <a href="/calendario" className="btn btn-info">
                        <i className="fas fa-calendar-plus me-2"></i>Nuevo Evento
                      </a>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="d-grid gap-2">
                      <a href="/reportes" className="btn btn-warning">
                        <i className="fas fa-chart-bar me-2"></i>Ver Reportes
                      </a>
                    </div>
                  </div>
                </div>
                <hr />
                <div className="text-center">
                  <small className="text-muted">
                    <i className="fas fa-info-circle me-1"></i>
                    Las acciones estarán disponibles en etapas posteriores
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Access System */}
      {!user && (
        <div className="row">
          <div className="col-12 mb-4">
            <div className="card">
              <div className="card-header">
                <i className="fas fa-sign-in-alt me-2"></i>
                Acceso al Sistema
              </div>
              <div className="card-body text-center">
                <div className="row">
                  <div className="col-md-6">
                    <div className="d-grid gap-2">
                      <a href="/login" className="btn btn-primary btn-lg">
                        <i className="fas fa-sign-in-alt me-2"></i>Iniciar Sesión
                      </a>
                      <small className="text-muted">Accede a todas las funcionalidades del sistema</small>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-grid gap-2">
                      <a href="/test" className="btn btn-outline-secondary btn-lg">
                        <i className="fas fa-flask me-2"></i>Verificar Sistema
                      </a>
                      <small className="text-muted">Página de diagnóstico y pruebas</small>
                    </div>
                  </div>
                </div>
                <hr />
                <div className="text-center">
                  <small className="text-muted">
                    <i className="fas fa-info-circle me-1"></i>
                    Para acceder a funciones avanzadas, inicia sesión con tus credenciales
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* System Information */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <i className="fas fa-server me-2"></i>
              Información del Sistema
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-3">
                  <div className="text-center">
                    <i className="fas fa-code fa-2x text-primary mb-2"></i>
                    <div className="h6">React + TypeScript</div>
                    <small className="text-muted">Framework Frontend</small>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="text-center">
                    <i className="fas fa-database fa-2x text-success mb-2"></i>
                    <div className="h6">Node.js + Express</div>
                    <small className="text-muted">Backend API</small>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="text-center">
                    <i className="fas fa-calendar-alt fa-2x text-warning mb-2"></i>
                    <div className="h6">Calendario</div>
                    <small className="text-muted">Gestión de eventos</small>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="text-center">
                    <a href="/estado-proyecto" className="text-decoration-none">
                      <i className="fas fa-info-circle fa-2x text-info mb-2"></i>
                      <div className="h6 text-info">Estado del Proyecto</div>
                      <small className="text-muted">Ver progreso</small>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard