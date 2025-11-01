import React from 'react'

interface StatCard {
  title: string
  value: number
  subtitle: string
  color: string
}

interface EntityLayoutProps {
  title: string
  subtitle: string
  icon: string
  stats: StatCard[]
  children: React.ReactNode
  className?: string
}

export const EntityLayout = ({
  title,
  subtitle,
  icon,
  stats,
  children,
  className = ''
}: EntityLayoutProps) => {
  return (
    <div className={`container mt-4 scroll-smooth ${className}`}>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <i className={`fas ${icon} me-3`}></i>
            {title}
          </h1>
          <p className="page-subtitle">{subtitle}</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="row mb-3">
        {stats.map((stat, index) => (
          <div key={index} className="col-md-3 mb-2">
            <div className="card text-center">
              <div className="card-body py-2">
                <div className={`h4 text-${stat.color} mb-1 fw-bold`}>
                  {stat.value}
                </div>
                <h6 className="card-title mb-1" style={{ fontSize: '0.9rem' }}>{stat.title}</h6>
                <small className="text-muted" style={{ fontSize: '0.75rem' }}>{stat.subtitle}</small>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      {children}
    </div>
  )
}