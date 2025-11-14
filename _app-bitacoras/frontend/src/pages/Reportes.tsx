import { useEffect, useState } from 'react'
import { useAuthStore } from '../stores/authStore'

interface ReportData {
  tasks: {
    total: number
    completed: number
    pending: number
    inProgress: number
    cancelled: number
    completionRate: number
    averageTime: number
  }
  resources: {
    total: number
    available: number
    assigned: number
    maintenance: number
    retired: number
    utilizationRate: number
  }
  users: {
    total: number
    withResources: number
    withoutResources: number
    totalAssignedResources: number
  }
  technicians: {
    total: number
    active: number
    inactive: number
    admins: number
  }
}

interface ChartData {
  labels: string[]
  datasets: Array<{
    label: string
    data: number[]
    backgroundColor: string[]
    borderColor?: string
    borderWidth?: number
  }>
}

const Reportes = () => {
  const { user } = useAuthStore()
  const [reportData, setReportData] = useState<ReportData>({
    tasks: { total: 0, completed: 0, pending: 0, inProgress: 0, cancelled: 0, completionRate: 0, averageTime: 0 },
    resources: { total: 0, available: 0, assigned: 0, maintenance: 0, retired: 0, utilizationRate: 0 },
    users: { total: 0, withResources: 0, withoutResources: 0, totalAssignedResources: 0 },
    technicians: { total: 0, active: 0, inactive: 0, admins: 0 }
  })
  const [tasksChart, setTasksChart] = useState<ChartData | null>(null)
  const [productivityChart, setProductivityChart] = useState<ChartData | null>(null)
  const [resourcesChart, setResourcesChart] = useState<ChartData | null>(null)
  const [reportType, setReportType] = useState('tasks')
  const [reportPeriod, setReportPeriod] = useState('month')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    loadReportData()
    setDefaultDates()
  }, [])

  useEffect(() => {
    if (!loading) {
      initializeCharts()
    }
  }, [loading, reportData])

  const loadReportData = async () => {
    try {
      setLoading(true)

      // Load data from all entities
      const [tecnicosRes, tareasRes, recursosRes, usuariosRes] = await Promise.all([
        fetch('/api/tecnicos'),
        fetch('/api/tareas'),
        fetch('/api/recursos'),
        fetch('/api/usuarios_relacionados')
      ])

      const tecnicos = tecnicosRes.ok ? await tecnicosRes.json() : []
      const tareas = tareasRes.ok ? await tareasRes.json() : []
      const recursos = recursosRes.ok ? await recursosRes.json() : []
      const usuarios = usuariosRes.ok ? await usuariosRes.json() : []

      // Calculate report data
      const tareasArray = Array.isArray(tareas) ? tareas : []
      const recursosArray = Array.isArray(recursos) ? recursos : []
      const usuariosArray = Array.isArray(usuarios) ? usuarios : []
      const tecnicosArray = Array.isArray(tecnicos) ? tecnicos : []

      const tasksData = {
        total: tareasArray.length,
        completed: tareasArray.filter((t: any) => t.status === 'completed').length,
        pending: tareasArray.filter((t: any) => t.status === 'pending').length,
        inProgress: tareasArray.filter((t: any) => t.status === 'in_progress').length,
        cancelled: tareasArray.filter((t: any) => t.status === 'cancelled').length,
        completionRate: tareasArray.length > 0 ? Math.round((tareasArray.filter((t: any) => t.status === 'completed').length / tareasArray.length) * 100) : 0,
        averageTime: 3.2 // Mock data
      }

      const resourcesData = {
        total: recursosArray.length,
        available: recursosArray.filter((r: any) => r.status === 'available').length,
        assigned: recursosArray.filter((r: any) => r.status === 'assigned').length,
        maintenance: recursosArray.filter((r: any) => r.status === 'maintenance').length,
        retired: recursosArray.filter((r: any) => r.status === 'retired').length,
        utilizationRate: recursosArray.length > 0 ? Math.round((recursosArray.filter((r: any) => r.status === 'assigned').length / recursosArray.length) * 100) : 0
      }

      const usersData = {
        total: usuariosArray.length,
        withResources: usuariosArray.filter((u: any) => (u.assigned_resources_count || 0) > 0).length,
        withoutResources: usuariosArray.filter((u: any) => (u.assigned_resources_count || 0) === 0).length,
        totalAssignedResources: usuariosArray.reduce((total: number, u: any) => total + (u.assigned_resources_count || 0), 0)
      }

      const techniciansData = {
        total: tecnicosArray.length,
        active: tecnicosArray.filter((t: any) => t.is_active).length,
        inactive: tecnicosArray.filter((t: any) => !t.is_active).length,
        admins: tecnicosArray.filter((t: any) => t.role === 'admin').length
      }

      setReportData({
        tasks: tasksData,
        resources: resourcesData,
        users: usersData,
        technicians: techniciansData
      })

    } catch (error) {
      console.error('Error loading report data:', error)
    } finally {
      setLoading(false)
    }
  }

  const initializeCharts = () => {
    // Load Chart.js dynamically
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js'
    script.onload = () => {
      setTimeout(() => {
        // Destroy existing charts to prevent "Canvas is already in use" error
        const tasksCtx = document.getElementById('tasksChart') as HTMLCanvasElement
        const resourcesCtx = document.getElementById('resourcesChart') as HTMLCanvasElement

        // Destroy existing chart instances if they exist
        if ((window as any).tasksChartInstance) {
          (window as any).tasksChartInstance.destroy()
        }
        if ((window as any).resourcesChartInstance) {
          (window as any).resourcesChartInstance.destroy()
        }

        // Tasks Status Chart
        if (tasksCtx) {
          (window as any).tasksChartInstance = new (window as any).Chart(tasksCtx, {
            type: 'doughnut',
            data: {
              labels: ['Pendientes', 'En Progreso', 'Completadas', 'Canceladas'],
              datasets: [{
                data: [reportData.tasks.pending, reportData.tasks.inProgress, reportData.tasks.completed, reportData.tasks.cancelled],
                backgroundColor: [
                  '#ffc107', // warning
                  '#17a2b8', // info
                  '#28a745', // success
                  '#dc3545'  // danger
                ],
                borderWidth: 2
              }]
            },
            options: {
              responsive: true,
              plugins: {
                legend: {
                  position: 'bottom'
                }
              }
            }
          })
        }

        // Resources Chart
        if (resourcesCtx) {
          (window as any).resourcesChartInstance = new (window as any).Chart(resourcesCtx, {
            type: 'bar',
            data: {
              labels: ['Hardware', 'Software', 'Redes', 'Herramientas'],
              datasets: [{
                label: 'Total',
                data: [15, 12, 8, 13],
                backgroundColor: '#28a745',
                borderWidth: 1
              }, {
                label: 'Relacionados',
                data: [8, 5, 4, 3],
                backgroundColor: '#17a2b8',
                borderWidth: 1
              }]
            },
            options: {
              responsive: true,
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            }
          })
        }
      }, 1000) // Wait for script to load
    }
    script.onerror = () => {
      console.error('Failed to load Chart.js script')
    }
    document.head.appendChild(script)
  }

  const setDefaultDates = () => {
    const today = new Date()
    const monthAgo = new Date()
    monthAgo.setMonth(today.getMonth() - 1)

    setDateTo(today.toISOString().split('T')[0])
    setDateFrom(monthAgo.toISOString().split('T')[0])
  }

  const generateReport = async () => {
    setGenerating(true)
    // Simulate report generation
    setTimeout(() => {
      setGenerating(false)
      showNotification('✅ Reporte generado exitosamente', 'success')
    }, 2000)
  }

  const resetFilters = () => {
    setReportType('tasks')
    setReportPeriod('month')
    setDefaultDates()
    showNotification('🔄 Filtros restablecidos', 'info')
  }

  const exportReport = (format: string) => {
    showNotification(`📄 Función de exportación ${format.toUpperCase()} disponible en Etapa 3`, 'warning')
  }

  const printReport = () => {
    showNotification('🖨️ Función de impresión disponible en Etapa 3', 'warning')
  }

  const showNotification = (message: string, type: string = 'info') => {
    // Create notification element
    const notification = document.createElement('div')
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`
    notification.style.cssText = `
      top: 20px;
      right: 20px;
      z-index: 9999;
      min-width: 300px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    `

    notification.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `

    document.body.appendChild(notification)

    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove()
      }
    }, 5000)
  }

  useEffect(() => {
    if (!loading) {
      initializeCharts()
    }
  }, [loading, reportData])

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">Cargando reportes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mt-4">
      {/* Page Header */}
      <div className="page-header reportes">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h1 className="page-title">
              <i className="fas fa-chart-bar me-3"></i>
              Reportes y Estadísticas
            </h1>
            <p className="page-subtitle">Análisis y reportes del sistema DTIC Bitácoras</p>
          </div>
          <div className="btn-group" role="group">
            <button className="btn btn-light" onClick={() => exportReport('general')}>
              <i className="fas fa-download me-2"></i>Exportar
            </button>
            <button className="btn btn-outline-light" onClick={printReport}>
              <i className="fas fa-print me-2"></i>Imprimir
            </button>
          </div>
        </div>
      </div>

      {/* Report Filters */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-3">
                  <label className="form-label">Tipo de Reporte</label>
                  <select
                    className="form-select"
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                  >
                    <option value="tasks">Tareas</option>
                    <option value="resources">Recursos</option>
                    <option value="users">Usuarios</option>
                    <option value="system">Sistema</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Período</label>
                  <select
                    className="form-select"
                    value={reportPeriod}
                    onChange={(e) => setReportPeriod(e.target.value)}
                  >
                    <option value="today">Hoy</option>
                    <option value="week">Esta semana</option>
                    <option value="month">Este mes</option>
                    <option value="quarter">Este trimestre</option>
                    <option value="year">Este año</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Fecha Desde</label>
                  <input
                    type="date"
                    className="form-control"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Fecha Hasta</label>
                  <input
                    type="date"
                    className="form-control"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                  />
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-12">
                  <button
                    className="btn btn-primary me-2"
                    onClick={generateReport}
                    disabled={generating}
                  >
                    <i className="fas fa-chart-line me-2"></i>
                    {generating ? 'Generando...' : 'Generar Reporte'}
                  </button>
                  <button className="btn btn-outline-secondary" onClick={resetFilters}>
                    <i className="fas fa-times me-1"></i>Limpiar Filtros
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="row mb-4">
        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header">
              <i className="fas fa-chart-pie me-2"></i>
              Estado de Tareas
            </div>
            <div className="card-body">
              <div className="chart-container">
                <canvas id="tasksChart" width="400" height="300"></canvas>
              </div>
              <div className="row text-center mt-3">
                <div className="col-3">
                  <div className="text-warning">
                    <div className="h5 mb-0" id="chartPending">{reportData.tasks.pending}</div>
                    <small>Pendientes</small>
                  </div>
                </div>
                <div className="col-3">
                  <div className="text-info">
                    <div className="h5 mb-0" id="chartInProgress">{reportData.tasks.inProgress}</div>
                    <small>En Progreso</small>
                  </div>
                </div>
                <div className="col-3">
                  <div className="text-success">
                    <div className="h5 mb-0" id="chartCompleted">{reportData.tasks.completed}</div>
                    <small>Completadas</small>
                  </div>
                </div>
                <div className="col-3">
                  <div className="text-danger">
                    <div className="h5 mb-0" id="chartCancelled">{reportData.tasks.cancelled}</div>
                    <small>Canceladas</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header">
              <i className="fas fa-chart-bar me-2"></i>
              Recursos por Categoría
            </div>
            <div className="card-body">
              <div className="chart-container">
                <canvas id="resourcesChart" width="400" height="300"></canvas>
              </div>
              <div className="text-center mt-3">
                <small className="text-muted">Distribución de recursos por categoría</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Reports */}
      <div className="row">
        {/* Tasks Report */}
        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header">
              <i className="fas fa-tasks me-2"></i>
              Reporte de Tareas
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Métrica</th>
                      <th>Valor</th>
                      <th>Cambio</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Total de Tareas</td>
                      <td><strong>{reportData.tasks.total}</strong></td>
                      <td><span className="badge bg-success">+12%</span></td>
                    </tr>
                    <tr>
                      <td>Tareas Completadas</td>
                      <td><strong>{reportData.tasks.completed}</strong></td>
                      <td><span className="badge bg-success">+8%</span></td>
                    </tr>
                    <tr>
                      <td>Tiempo Promedio</td>
                      <td><strong>{reportData.tasks.averageTime} días</strong></td>
                      <td><span className="badge bg-warning">-5%</span></td>
                    </tr>
                    <tr>
                      <td>Tasa de Éxito</td>
                      <td><strong>{reportData.tasks.completionRate}%</strong></td>
                      <td><span className="badge bg-success">+3%</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Resources Report */}
        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header">
              <i className="fas fa-boxes me-2"></i>
              Reporte de Recursos
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Categoría</th>
                      <th>Total</th>
                      <th>Relacionados</th>
                      <th>Disponibles</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Hardware</td>
                      <td><strong>15</strong></td>
                      <td><strong>8</strong></td>
                      <td><strong>7</strong></td>
                    </tr>
                    <tr>
                      <td>Software</td>
                      <td><strong>12</strong></td>
                      <td><strong>5</strong></td>
                      <td><strong>7</strong></td>
                    </tr>
                    <tr>
                      <td>Redes</td>
                      <td><strong>8</strong></td>
                      <td><strong>4</strong></td>
                      <td><strong>4</strong></td>
                    </tr>
                    <tr>
                      <td>Herramientas</td>
                      <td><strong>13</strong></td>
                      <td><strong>3</strong></td>
                      <td><strong>10</strong></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Report */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <i className="fas fa-history me-2"></i>
              Actividad Reciente del Sistema
            </div>
            <div className="card-body">
              <div className="timeline">
                <div className="timeline-item">
                  <div className="timeline-marker bg-success"></div>
                  <div className="timeline-content">
                    <h6 className="text-success mb-1">Nueva tarea completada</h6>
                    <p className="mb-1">"Implementar API de autenticación" finalizada por María Rodríguez</p>
                    <small className="text-muted">Hace 2 horas</small>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-marker bg-info"></div>
                  <div className="timeline-content">
                    <h6 className="text-info mb-1">Recurso relacionado</h6>
                    <p className="mb-1">Laptop Dell Latitude 5420 relacionada con Juan García</p>
                    <small className="text-muted">Hace 4 horas</small>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-marker bg-warning"></div>
                  <div className="timeline-content">
                    <h6 className="text-warning mb-1">Nuevo usuario registrado</h6>
                    <p className="mb-1">Ana Martínez se unió al sistema como Visualizador</p>
                    <small className="text-muted">Hace 1 día</small>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-marker bg-danger"></div>
                  <div className="timeline-content">
                    <h6 className="text-danger mb-1">Tarea cancelada</h6>
                    <p className="mb-1">"Migrar base de datos legacy" fue cancelada por falta de requerimientos</p>
                    <small className="text-muted">Hace 2 días</small>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-marker bg-primary"></div>
                  <div className="timeline-content">
                    <h6 className="text-primary mb-1">Mantenimiento completado</h6>
                    <p className="mb-1">Router Cisco RV340 reparado y devuelto a servicio</p>
                    <small className="text-muted">Hace 3 días</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <i className="fas fa-file-export me-2"></i>
              Opciones de Exportación
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-3 mb-3">
                  <button className="btn btn-success w-100" onClick={() => exportReport('pdf')}>
                    <i className="fas fa-file-pdf fa-2x mb-2"></i>
                    <br />
                    Exportar PDF
                  </button>
                </div>
                <div className="col-md-3 mb-3">
                  <button className="btn btn-info w-100" onClick={() => exportReport('excel')}>
                    <i className="fas fa-file-excel fa-2x mb-2"></i>
                    <br />
                    Exportar Excel
                  </button>
                </div>
                <div className="col-md-3 mb-3">
                  <button className="btn btn-warning w-100" onClick={() => exportReport('csv')}>
                    <i className="fas fa-file-csv fa-2x mb-2"></i>
                    <br />
                    Exportar CSV
                  </button>
                </div>
                <div className="col-md-3 mb-3">
                  <button className="btn btn-secondary w-100" onClick={() => exportReport('json')}>
                    <i className="fas fa-file-code fa-2x mb-2"></i>
                    <br />
                    Exportar JSON
                  </button>
                </div>
              </div>
              <div className="alert alert-info">
                <i className="fas fa-info-circle me-2"></i>
                <strong>Nota:</strong> Las funciones de exportación estarán disponibles cuando se implemente el backend en la Etapa 3.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reportes