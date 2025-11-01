import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { useState, useEffect } from 'react'

const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuthStore()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path: string) => {
    return location.pathname === path
  }

  // Detect scroll for navbar styling and auto-hide
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const scrollThreshold = 100

      // Update scrolled state for visual effects
      setIsScrolled(currentScrollY > 20)

      // Auto-hide logic: hide when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > scrollThreshold) {
        setIsHidden(true)
      } else if (currentScrollY < lastScrollY) {
        setIsHidden(false)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  if (!isAuthenticated) {
    return null
  }

  const navItems = [
    { path: '/dashboard', icon: 'fas fa-tachometer-alt', label: 'Dashboard', color: 'text-primary' },
    { path: '/tecnicos', icon: 'fas fa-users', label: 'Técnicos', color: 'text-success' },
    { path: '/tareas', icon: 'fas fa-tasks', label: 'Tareas', color: 'text-warning' },
    { path: '/recursos', icon: 'fas fa-server', label: 'Recursos', color: 'text-info' },
    { path: '/calendario', icon: 'fas fa-calendar', label: 'Calendario', color: 'text-secondary' },
    { path: '/reportes', icon: 'fas fa-chart-bar', label: 'Reportes', color: 'text-danger' },
    ...(user?.role === 'admin' ? [{ path: '/usuarios', icon: 'fas fa-user-cog', label: 'Usuarios', color: 'text-dark' }] : [])
  ]

  return (
    <>
      {/* Custom CSS for modern navbar */}
      <style>{`
        .modern-navbar {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          transform: translateY(0);
        }

        .modern-navbar.scrolled {
          background: rgba(102, 126, 234, 0.95);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        }

        .modern-navbar.hidden {
          transform: translateY(-100%);
        }

        .modern-navbar:hover {
          transform: translateY(0) !important;
        }

        .nav-item-modern {
          position: relative;
          margin: 0 8px;
        }

        .nav-link-modern {
          color: rgba(255, 255, 255, 0.9) !important;
          font-weight: 500;
          padding: 12px 20px;
          border-radius: 25px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .nav-link-modern::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }

        .nav-link-modern:hover::before {
          left: 100%;
        }

        .nav-link-modern:hover {
          color: white !important;
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .nav-link-modern.active {
          background: rgba(255, 255, 255, 0.15);
          color: white !important;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        }

        .nav-link-modern i {
          margin-right: 8px;
          font-size: 1.1em;
        }

        .navbar-brand-modern {
          font-weight: 700;
          font-size: 1.5rem;
          color: white !important;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .navbar-brand-modern:hover {
          color: rgba(255, 255, 255, 0.8) !important;
          transform: scale(1.05);
          transition: all 0.3s ease;
        }

        .user-menu-modern {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 25px;
          padding: 8px 16px;
          color: white !important;
          transition: all 0.3s ease;
        }

        .user-menu-modern:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.3);
        }

        .dropdown-menu-modern {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 15px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(10px);
          margin-top: 10px;
        }

        .dropdown-item-modern {
          color: rgba(255, 255, 255, 0.9) !important;
          padding: 12px 20px;
          border-radius: 8px;
          margin: 4px 8px;
          transition: all 0.3s ease;
        }

        .dropdown-item-modern:hover {
          background: rgba(255, 255, 255, 0.2);
          color: white !important;
          transform: translateX(5px);
        }

        .mobile-menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(5px);
          z-index: 1040;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
        }

        .mobile-menu-overlay.active {
          opacity: 1;
          visibility: visible;
        }

        .mobile-menu {
          position: fixed;
          top: 0;
          right: -300px;
          width: 280px;
          height: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          box-shadow: -5px 0 25px rgba(0, 0, 0, 0.3);
          transition: right 0.3s ease;
          z-index: 1050;
          padding: 80px 20px 20px;
        }

        .mobile-menu.active {
          right: 0;
        }

        .mobile-nav-item {
          margin-bottom: 10px;
        }

        .mobile-nav-link {
          display: block;
          color: rgba(255, 255, 255, 0.9) !important;
          padding: 15px 20px;
          border-radius: 12px;
          text-decoration: none;
          transition: all 0.3s ease;
          font-weight: 500;
        }

        .mobile-nav-link:hover,
        .mobile-nav-link.active {
          background: rgba(255, 255, 255, 0.2);
          color: white !important;
          transform: translateX(10px);
        }

        .mobile-nav-link i {
          margin-right: 12px;
          width: 20px;
        }

        .hamburger-menu {
          display: none;
          flex-direction: column;
          cursor: pointer;
          padding: 10px;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .hamburger-menu:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .hamburger-line {
          width: 25px;
          height: 3px;
          background: white;
          margin: 3px 0;
          transition: all 0.3s ease;
          border-radius: 2px;
        }

        .hamburger-menu.active .hamburger-line:nth-child(1) {
          transform: rotate(45deg) translate(5px, 5px);
        }

        .hamburger-menu.active .hamburger-line:nth-child(2) {
          opacity: 0;
        }

        .hamburger-menu.active .hamburger-line:nth-child(3) {
          transform: rotate(-45deg) translate(7px, -6px);
        }

        @media (max-width: 991px) {
          .hamburger-menu {
            display: flex;
          }

          .desktop-nav {
            display: none;
          }
        }

        @media (min-width: 992px) {
          .mobile-menu-overlay,
          .mobile-menu {
            display: none !important;
          }
        }
      `}</style>

      {/* Mobile menu overlay */}
      <div
        className={`mobile-menu-overlay ${isMenuOpen ? 'active' : ''}`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Mobile menu */}
      <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
        <div className="text-center mb-4">
          <h5 className="text-white mb-4">Menú de Navegación</h5>
        </div>

        {navItems.map((item) => (
          <div key={item.path} className="mobile-nav-item">
            <Link
              to={item.path}
              className={`mobile-nav-link ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <i className={item.icon}></i>
              {item.label}
            </Link>
          </div>
        ))}

        <hr className="border-light my-4" />

        <div className="mobile-nav-item">
          <Link
            to="/perfil"
            className="mobile-nav-link"
            onClick={() => setIsMenuOpen(false)}
          >
            <i className="fas fa-user-edit"></i>
            Mi Perfil
          </Link>
        </div>

        <div className="mobile-nav-item">
          <button
            className="mobile-nav-link w-100 text-start border-0 bg-transparent"
            onClick={() => {
              handleLogout()
              setIsMenuOpen(false)
            }}
          >
            <i className="fas fa-sign-out-alt"></i>
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        className={`navbar navbar-expand-lg fixed-top modern-navbar ${isScrolled ? 'scrolled' : ''} ${isHidden ? 'hidden' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="container-fluid">
          {/* Brand */}
          <Link className="navbar-brand navbar-brand-modern" to="/dashboard">
            <i className="fas fa-cogs me-2"></i>
            DTIC Bitácoras
          </Link>

          {/* Hamburger Menu for Mobile */}
          <div
            className={`hamburger-menu ${isMenuOpen ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
          </div>

          {/* Desktop Navigation */}
          <div className="collapse navbar-collapse desktop-nav">
            <ul className="navbar-nav me-auto">
              {navItems.map((item) => (
                <li key={item.path} className="nav-item nav-item-modern">
                  <Link
                    to={item.path}
                    className={`nav-link nav-link-modern ${isActive(item.path) ? 'active' : ''}`}
                  >
                    <i className={item.icon}></i>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* User Menu */}
            <ul className="navbar-nav">
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle user-menu-modern"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="fas fa-user-circle me-2"></i>
                  <span className="d-none d-md-inline">{user?.first_name}</span>
                  <span className="d-md-none">Perfil</span>
                </a>
                <ul className="dropdown-menu dropdown-menu-end dropdown-menu-modern" aria-labelledby="navbarDropdown">
                  <li>
                    <Link className="dropdown-item dropdown-item-modern" to="/perfil">
                      <i className="fas fa-user-edit me-2"></i>
                      Mi Perfil
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider border-light" /></li>
                  <li>
                    <button className="dropdown-item dropdown-item-modern" onClick={handleLogout}>
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
    </>
  )
}

export default Navbar