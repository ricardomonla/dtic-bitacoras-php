import { useEffect } from 'react'

const Dashboard = () => {
  useEffect(() => {
    // Aquí podríamos cargar estadísticas del dashboard
    console.log('Dashboard loaded')
  }, [])

  return (
    <div className="container mt-4">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <i className="fas fa-tachometer-alt me-3"></i>
            Dashboard
          </h1>
          <p className="page-subtitle">Panel de control principal del sistema DTIC Bitácoras</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card text-center h-100">
            <div className="card-body">
              <div className="display-4 text-primary mb-2">6</div>
              <h6 className="card-title">Total Técnicos</h6>
              <small className="text-muted">Registrados en el sistema</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center h-100">
            <div className="card-body">
              <div className="display-4 text-success mb-2">5</div>
              <h6 className="card-title">Activos</h6>
              <small className="text-muted">Con acceso al sistema</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center h-100">
            <div className="card-body">
              <div className="display-4 text-warning mb-2">1</div>
              <h6 className="card-title">Inactivos</h6>
              <small className="text-muted">Acceso suspendido</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center h-100">
            <div className="card-body">
              <div className="display-4 text-danger mb-2">1</div>
              <h6 className="card-title">Administradores</h6>
              <small className="text-muted">Acceso completo</small>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body text-center py-5">
              <h2 className="text-gradient mb-3">¡Bienvenido al Sistema DTIC Bitácoras!</h2>
              <p className="lead mb-4">
                Gestiona técnicos, tareas y recursos de manera eficiente y organizada.
              </p>
              <div className="row">
                <div className="col-md-4 mb-3">
                  <div className="card h-100 border-primary">
                    <div className="card-body">
                      <i className="fas fa-users fa-3x text-primary mb-3"></i>
                      <h5 className="card-title">Gestión de Técnicos</h5>
                      <p className="card-text">
                        Administra el personal técnico, sus roles y permisos en el sistema.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="card h-100 border-success">
                    <div className="card-body">
                      <i className="fas fa-tasks fa-3x text-success mb-3"></i>
                      <h5 className="card-title">Control de Tareas</h5>
                      <p className="card-text">
                        Asigna, sigue y gestiona las tareas de mantenimiento y soporte.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="card h-100 border-info">
                    <div className="card-body">
                      <i className="fas fa-server fa-3x text-info mb-3"></i>
                      <h5 className="card-title">Recursos del Sistema</h5>
                      <p className="card-text">
                        Monitorea y administra los recursos tecnológicos del DTIC.
                      </p>
                    </div>
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