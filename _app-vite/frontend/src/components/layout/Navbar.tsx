import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'

const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : ''
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/dashboard">
          <i className="fas fa-cogs me-2"></i>
          DTIC Bitácoras
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/dashboard')}`} to="/dashboard">
                <i className="fas fa-tachometer-alt me-1"></i>
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/tecnicos')}`} to="/tecnicos">
                <i className="fas fa-users me-1"></i>
                Técnicos
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/tareas')}`} to="/tareas">
                <i className="fas fa-tasks me-1"></i>
                Tareas
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/recursos')}`} to="/recursos">
                <i className="fas fa-server me-1"></i>
                Recursos
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/calendario')}`} to="/calendario">
                <i className="fas fa-calendar me-1"></i>
                Calendario
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/reportes')}`} to="/reportes">
                <i className="fas fa-chart-bar me-1"></i>
                Reportes
              </Link>
            </li>
            {user?.role === 'admin' && (
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/usuarios')}`} to="/usuarios">
                  <i className="fas fa-user-cog me-1"></i>
                  Usuarios
                </Link>
              </li>
            )}
          </ul>

          <ul className="navbar-nav">
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="fas fa-user me-2"></i>
                {user?.first_name} {user?.last_name}
              </a>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                <li>
                  <Link className="dropdown-item" to="/perfil">
                    <i className="fas fa-user-edit me-2"></i>
                    Mi Perfil
                  </Link>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button className="dropdown-item" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt me-2"></i>
                    Cerrar Sesión
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar