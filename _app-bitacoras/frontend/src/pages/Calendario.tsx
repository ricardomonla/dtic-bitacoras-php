import { useEffect, useState } from 'react'
import { useAuthStore } from '../stores/authStore'

interface CalendarEvent {
  id: string
  title: string
  start: string
  end: string
  backgroundColor: string
  borderColor: string
  textColor: string
  extendedProps: {
    type: string
    technician: string
    technicianName: string
    resource: string
    resourceName: string
    description: string
    subtasks: Array<{
      title: string
      time: string
      technician: string
    }>
    reminders: string[]
  }
}

interface CalendarStats {
  events: number
  tasks: number
  activeTechnicians: number
  busyResources: number
}

const Calendario = () => {
  const { user } = useAuthStore()
  const [calendar, setCalendar] = useState<any>(null)
  const [currentEvents, setCurrentEvents] = useState<CalendarEvent[]>([])
  const [upcomingEvents, setUpcomingEvents] = useState<CalendarEvent[]>([])
  const [stats, setStats] = useState<CalendarStats>({
    events: 0,
    tasks: 0,
    activeTechnicians: 0,
    busyResources: 0
  })
  const [showEventModal, setShowEventModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    initializeCalendar()
    return () => {
      if (calendar) {
        calendar.destroy()
      }
    }
  }, [])

  useEffect(() => {
    if (calendar) {
      loadCalendarData()
    }
  }, [calendar])

  const initializeCalendar = () => {
    // Load FullCalendar dynamically
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.js'
    script.onload = () => {
      setTimeout(() => {
        const calendarEl = document.getElementById('calendar')
        if (calendarEl && (window as any).FullCalendar) {
          const cal = new (window as any).FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            locale: 'es',
            headerToolbar: {
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
            },
            buttonText: {
              today: 'Hoy',
              month: 'Mes',
              week: 'Semana',
              day: 'Día',
              list: 'Lista'
            },
            height: 'auto',
            editable: true,
            selectable: true,
            selectMirror: true,
            dayMaxEvents: true,
            eventDisplay: 'block',
            eventTimeFormat: {
              hour: '2-digit',
              minute: '2-digit',
              meridiem: false
            },
            slotLabelFormat: {
              hour: '2-digit',
              minute: '2-digit',
              meridiem: false
            },
            nowIndicator: true,
            businessHours: {
              daysOfWeek: [1, 2, 3, 4, 5],
              startTime: '08:00',
              endTime: '18:00'
            },
            eventClick: function(info: any) {
              showEventDetails(info.event)
            },
            select: function(info: any) {
              openNewEventModal(info.start, info.end)
            },
            eventDrop: function(info: any) {
              updateEventTime(info.event)
            },
            eventResize: function(info: any) {
              updateEventTime(info.event)
            },
            datesSet: function(dateInfo: any) {
              updateMonthStatistics()
            }
          })

          cal.render()
          setCalendar(cal)
          setLoading(false)
        } else {
          console.error('FullCalendar not loaded or calendar element not found')
          setLoading(false)
        }
      }, 1000) // Wait for script to fully load
    }
    script.onerror = () => {
      console.error('Failed to load FullCalendar script')
      setLoading(false)
    }
    document.head.appendChild(script)
  }

  const loadCalendarData = () => {
    // Mock data - in production this would come from API
    const mockEvents: CalendarEvent[] = [
      {
        id: '1',
        title: 'Preparar los equipos en el Auditorio con música y proyector',
        start: '2025-11-15T14:00:00',
        end: '2025-11-15T16:00:00',
        backgroundColor: '#17a2b8',
        borderColor: '#17a2b8',
        textColor: '#ffffff',
        extendedProps: {
          type: 'event',
          technician: 'jgarcia',
          technicianName: 'Juan García',
          resource: 'auditorio',
          resourceName: 'Auditorio',
          description: 'Evento especial de capacitación técnica',
          subtasks: [
            {
              title: 'Hacer pruebas de sonido y video 1 hora antes',
              time: '2025-11-15T13:00:00',
              technician: 'jgarcia'
            },
            {
              title: 'Verificar conectividad de proyectores 30 minutos antes',
              time: '2025-11-15T13:30:00',
              technician: 'mrodriguez'
            }
          ],
          reminders: ['1h', '30m']
        }
      },
      {
        id: '2',
        title: 'Mantenimiento preventivo de servidores',
        start: '2025-11-16T09:00:00',
        end: '2025-11-16T12:00:00',
        backgroundColor: '#28a745',
        borderColor: '#28a745',
        textColor: '#ffffff',
        extendedProps: {
          type: 'maintenance',
          technician: 'clopez',
          technicianName: 'Carlos López',
          resource: 'computadoras',
          resourceName: 'Sala de Servidores',
          description: 'Mantenimiento rutinario de equipos',
          subtasks: [],
          reminders: ['1h']
        }
      },
      {
        id: '3',
        title: 'Capacitación en ciberseguridad',
        start: '2025-11-18T10:00:00',
        end: '2025-11-18T12:00:00',
        backgroundColor: '#ffc107',
        borderColor: '#ffc107',
        textColor: '#000000',
        extendedProps: {
          type: 'training',
          technician: 'amartinez',
          technicianName: 'Ana Martínez',
          resource: 'auditorio',
          resourceName: 'Auditorio',
          description: 'Sesión de capacitación para todo el equipo',
          subtasks: [],
          reminders: ['1h', '15m']
        }
      },
      {
        id: '4',
        title: 'Reunión de coordinación semanal',
        start: '2025-11-17T08:30:00',
        end: '2025-11-17T09:30:00',
        backgroundColor: '#6c757d',
        borderColor: '#6c757d',
        textColor: '#ffffff',
        extendedProps: {
          type: 'meeting',
          technician: 'rmartinez',
          technicianName: 'Roberto Martínez',
          resource: 'auditorio',
          resourceName: 'Sala de Reuniones',
          description: 'Reunión semanal de coordinación del equipo DTIC',
          subtasks: [],
          reminders: ['15m']
        }
      }
    ]

    setCurrentEvents(mockEvents)

    // Add events to calendar if it's initialized
    if (calendar) {
      calendar.addEventSource(mockEvents)
    }

    updateUpcomingEvents(mockEvents)
    updateMonthStatistics()
  }

  const updateUpcomingEvents = (events: CalendarEvent[] = currentEvents) => {
    const now = new Date()
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

    const upcoming = events
      .filter(event => {
        const eventStart = new Date(event.start)
        return eventStart >= now && eventStart <= nextWeek
      })
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
      .slice(0, 6)

    setUpcomingEvents(upcoming)
  }

  const updateMonthStatistics = () => {
    if (!calendar) return

    const view = calendar.view
    const start = view.activeStart
    const end = view.activeEnd

    const monthEvents = currentEvents.filter(event => {
      const eventStart = new Date(event.start)
      return eventStart >= start && eventStart < end
    })

    const technicians = new Set()
    const resources = new Set()

    monthEvents.forEach(event => {
      technicians.add(event.extendedProps.technician)
      if (event.extendedProps.resource) {
        resources.add(event.extendedProps.resource)
      }
    })

    const totalTasks = monthEvents.reduce((sum, event) => {
      return sum + (event.extendedProps.subtasks ? event.extendedProps.subtasks.length : 0)
    }, 0)

    setStats({
      events: monthEvents.length,
      tasks: totalTasks,
      activeTechnicians: technicians.size,
      busyResources: resources.size
    })
  }

  const showEventDetails = (event: any) => {
    const calendarEvent = currentEvents.find(e => e.id === event.id)
    if (calendarEvent) {
      setSelectedEvent(calendarEvent)
      setShowDetailsModal(true)
    }
  }

  const openNewEventModal = (start: Date, end: Date) => {
    // Pre-fill start and end times
    const startInput = document.getElementById('eventStart') as HTMLInputElement
    const endInput = document.getElementById('eventEnd') as HTMLInputElement

    if (startInput && endInput) {
      startInput.value = formatDateTime(start)
      endInput.value = formatDateTime(end)
    }

    setShowEventModal(true)
  }

  const updateEventTime = (event: any) => {
    console.log('Event time updated:', event.id, event.start, event.end)
    // In production, this would update the backend
  }

  const formatDateTime = (date: Date) => {
    return date.toISOString().slice(0, 16)
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

  const handleViewChange = (view: string) => {
    if (calendar) {
      calendar.changeView(view)
    }
  }

  const handleTechnicianFilter = (technician: string) => {
    if (!calendar) return

    calendar.getEvents().forEach((event: any) => {
      const show = !technician || event.extendedProps.technician === technician
      event.setProp('display', show ? 'auto' : 'none')
    })
  }

  const handleResourceFilter = (resource: string) => {
    if (!calendar) return

    calendar.getEvents().forEach((event: any) => {
      const show = !resource || event.extendedProps.resource === resource
      event.setProp('display', show ? 'auto' : 'none')
    })
  }

  const clearFilters = () => {
    if (!calendar) return

    const technicianSelect = document.getElementById('technicianFilter') as HTMLSelectElement
    const resourceSelect = document.getElementById('resourceFilter') as HTMLSelectElement

    if (technicianSelect) technicianSelect.value = ''
    if (resourceSelect) resourceSelect.value = ''

    calendar.getEvents().forEach((event: any) => {
      event.setProp('display', 'auto')
    })
  }

  const goToToday = () => {
    if (calendar) {
      calendar.today()
    }
  }

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">Cargando calendario...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mt-4">
      {/* Page Header */}
      <div className="page-header calendario">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h1 className="page-title">
              <i className="fas fa-calendar-alt me-3"></i>
              Calendario Interactivo
            </h1>
            <p className="page-subtitle">Gestión de eventos, tareas programadas y asignaciones de técnicos del DTIC</p>
          </div>
          <div className="btn-group" role="group">
            <button className="btn btn-light" onClick={() => setShowEventModal(true)}>
              <i className="fas fa-plus me-2"></i>Nuevo Evento
            </button>
            <button className="btn btn-outline-light" onClick={() => console.log('Export functionality')}>
              <i className="fas fa-download me-2"></i>Exportar
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Filters and Controls */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-3">
                  <select className="form-select" id="calendarView" onChange={(e) => handleViewChange(e.target.value)}>
                    <option value="dayGridMonth">Vista Mensual</option>
                    <option value="timeGridWeek">Vista Semanal</option>
                    <option value="timeGridDay">Vista Diaria</option>
                    <option value="listWeek">Lista Semanal</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <select className="form-select" id="technicianFilter" onChange={(e) => handleTechnicianFilter(e.target.value)}>
                    <option value="">Todos los técnicos</option>
                    <option value="jgarcia">Juan García</option>
                    <option value="mrodriguez">María Rodríguez</option>
                    <option value="clopez">Carlos López</option>
                    <option value="amartinez">Ana Martínez</option>
                    <option value="rmartinez">Roberto Martínez</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <select className="form-select" id="resourceFilter" onChange={(e) => handleResourceFilter(e.target.value)}>
                    <option value="">Todos los recursos</option>
                    <option value="auditorio">Auditorio</option>
                    <option value="proyector">Proyectores</option>
                    <option value="computadoras">Computadoras</option>
                    <option value="redes">Equipos de Red</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <div className="d-flex gap-2">
                    <button className="btn btn-outline-primary flex-fill" onClick={goToToday}>Hoy</button>
                    <button className="btn btn-outline-secondary flex-fill" onClick={clearFilters}>Limpiar</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Container */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div id="calendar"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Events Sidebar */}
      <div className="row mt-4">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Próximos Eventos</h5>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map(event => (
                    <div key={event.id} className="list-group-item">
                      <div className="d-flex w-100 justify-content-between">
                        <h6 className="mb-1">{event.title}</h6>
                        <small className="text-muted">
                          {new Date(event.start).toLocaleString('es-AR', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </small>
                      </div>
                      <p className="mb-1">{event.extendedProps.technicianName}</p>
                      <small className="text-muted">{event.extendedProps.resourceName}</small>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted py-4">
                    <i className="fas fa-calendar-check fa-3x mb-3"></i>
                    <p>No hay eventos próximos programados</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Estadísticas del Mes</h5>
            </div>
            <div className="card-body">
              <div className="row text-center">
                <div className="col-6">
                  <div className="h4 text-primary mb-1" id="monthEvents">{stats.events}</div>
                  <small className="text-muted">Eventos</small>
                </div>
                <div className="col-6">
                  <div className="h4 text-success mb-1" id="monthTasks">{stats.tasks}</div>
                  <small className="text-muted">Tareas</small>
                </div>
              </div>
              <hr />
              <div className="row text-center">
                <div className="col-6">
                  <div className="h4 text-info mb-1" id="activeTechnicians">{stats.activeTechnicians}</div>
                  <small className="text-muted">Técnicos Activos</small>
                </div>
                <div className="col-6">
                  <div className="h4 text-warning mb-1" id="busyResources">{stats.busyResources}</div>
                  <small className="text-muted">Recursos Ocupados</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {showEventModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-plus me-2"></i>Nuevo Evento
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowEventModal(false)}></button>
              </div>
              <div className="modal-body">
                <form id="addEventForm">
                  <div className="row">
                    <div className="col-md-8">
                      <div className="mb-3">
                        <label className="form-label">Título del Evento *</label>
                        <input type="text" className="form-control" id="eventTitle" required />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="form-label">Tipo *</label>
                        <select className="form-select" id="eventType" required>
                          <option value="">Seleccionar...</option>
                          <option value="maintenance">Mantenimiento</option>
                          <option value="event">Evento Especial</option>
                          <option value="training">Capacitación</option>
                          <option value="meeting">Reunión</option>
                          <option value="other">Otro</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Descripción</label>
                    <textarea className="form-control" id="eventDescription" rows={3}></textarea>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Fecha y Hora de Inicio *</label>
                        <input type="datetime-local" className="form-control" id="eventStart" required />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Fecha y Hora de Fin *</label>
                        <input type="datetime-local" className="form-control" id="eventEnd" required />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Técnico Asignado *</label>
                        <select className="form-select" id="eventTechnician" required>
                          <option value="">Seleccionar técnico...</option>
                          <option value="jgarcia">Juan García - Desarrollador</option>
                          <option value="mrodriguez">María Rodríguez - Analista</option>
                          <option value="clopez">Carlos López - Diseñador</option>
                          <option value="amartinez">Ana Martínez - Tester</option>
                          <option value="rmartinez">Roberto Martínez - Administrador</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Recurso Principal</label>
                        <select className="form-select" id="eventResource">
                          <option value="">Seleccionar recurso...</option>
                          <option value="auditorio">Auditorio</option>
                          <option value="proyector">Proyector Principal</option>
                          <option value="computadoras">Sala de Computadoras</option>
                          <option value="redes">Equipos de Red</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEventModal(false)}>Cancelar</button>
                <button type="button" className="btn btn-info" onClick={() => console.log('Save event')}>
                  <i className="fas fa-save me-2"></i>Guardar Evento
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Event Details Modal */}
      {showDetailsModal && selectedEvent && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-info-circle me-2"></i>Detalles del Evento
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowDetailsModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-8">
                    <h4>{selectedEvent.title}</h4>
                    <p className="text-muted">
                      {selectedEvent.extendedProps.type === 'maintenance' ? 'Mantenimiento' :
                       selectedEvent.extendedProps.type === 'event' ? 'Evento Especial' :
                       selectedEvent.extendedProps.type === 'training' ? 'Capacitación' :
                       selectedEvent.extendedProps.type === 'meeting' ? 'Reunión' : 'Evento'}
                    </p>
                    <hr />
                    <p><strong>Fecha y Hora:</strong> {new Date(selectedEvent.start).toLocaleString('es-AR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })} - {new Date(selectedEvent.end).toLocaleString('es-AR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</p>
                    <p><strong>Técnico Asignado:</strong> {selectedEvent.extendedProps.technicianName}</p>
                    <p><strong>Recurso:</strong> {selectedEvent.extendedProps.resourceName}</p>
                    {selectedEvent.extendedProps.description && (
                      <p><strong>Descripción:</strong> {selectedEvent.extendedProps.description}</p>
                    )}
                  </div>
                  <div className="col-md-4">
                    <div className="card">
                      <div className="card-body text-center">
                        <i className="fas fa-clock fa-3x text-info mb-3"></i>
                        <h6>Próximo Recordatorio</h6>
                        <p className="mb-0">15 minutos antes</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowDetailsModal(false)}>Cerrar</button>
                <button type="button" className="btn btn-warning">
                  <i className="fas fa-edit me-2"></i>Editar
                </button>
                <button type="button" className="btn btn-danger">
                  <i className="fas fa-trash me-2"></i>Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Calendario