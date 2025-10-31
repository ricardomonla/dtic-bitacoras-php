import { useState } from 'react'
import { Tecnico } from '../stores/tecnicosStore'
import toast from 'react-hot-toast'

interface ChangePasswordModalProps {
  tecnico: Tecnico | null
  isOpen: boolean
  onClose: () => void
}

const ChangePasswordModal = ({ tecnico, isOpen, onClose }: ChangePasswordModalProps) => {
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
    forceChange: false
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!tecnico) return

    // Validaciones
    if (!formData.newPassword) {
      toast.error('La nueva contraseña es obligatoria')
      return
    }

    if (!formData.confirmPassword) {
      toast.error('La confirmación de contraseña es obligatoria')
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden')
      return
    }

    if (!validatePasswordStrength(formData.newPassword)) {
      toast.error('La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y caracteres especiales')
      return
    }

    try {
      setIsLoading(true)

      const response = await fetch(`http://localhost:3001/api/tecnicos?action=change_password&id=${tecnico.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          new_password: formData.newPassword,
          force_change: formData.forceChange
        })
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Contraseña cambiada exitosamente')
        handleClose()
      } else {
        toast.error(data.message || 'Error al cambiar contraseña')
      }
    } catch (error) {
      console.error('Error cambiando contraseña:', error)
      toast.error('Error de conexión')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({
      newPassword: '',
      confirmPassword: '',
      forceChange: false
    })
    setShowPassword(false)
    setShowConfirmPassword(false)
    onClose()
  }

  const validatePasswordStrength = (password: string): boolean => {
    const minLength = password.length >= 8
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasNonalphas = /[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?]/.test(password)

    return minLength && hasUpperCase && hasLowerCase && hasNumbers && hasNonalphas
  }

  const getPasswordStrength = (password: string): { level: number; text: string; color: string } => {
    if (password.length === 0) return { level: 0, text: '', color: '' }

    let score = 0
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[a-z]/.test(password)) score++
    if (/\d/.test(password)) score++
    if (/[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?]/.test(password)) score++

    if (score <= 2) return { level: 1, text: 'Débil', color: 'text-danger' }
    if (score <= 3) return { level: 2, text: 'Regular', color: 'text-warning' }
    if (score <= 4) return { level: 3, text: 'Buena', color: 'text-info' }
    return { level: 4, text: 'Fuerte', color: 'text-success' }
  }

  if (!isOpen || !tecnico) return null

  const passwordStrength = getPasswordStrength(formData.newPassword)

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="fas fa-key me-2"></i>
              Cambiar Contraseña
            </h5>
            <button type="button" className="btn-close" onClick={handleClose}></button>
          </div>
          <div className="modal-body">
            <div className="alert alert-info">
              <i className="fas fa-info-circle me-2"></i>
              Cambiando contraseña para: <strong>{tecnico.first_name} {tecnico.last_name}</strong>
              <br />
              <small className="text-muted">ID DTIC: {tecnico.dtic_id}</small>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="newPassword" className="form-label">
                  Nueva Contraseña <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control"
                    id="newPassword"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    placeholder="Ingrese la nueva contraseña"
                    required
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i className={`fas fa-${showPassword ? 'eye-slash' : 'eye'}`}></i>
                  </button>
                </div>
                {formData.newPassword && (
                  <div className="mt-2">
                    <small className={`form-text ${passwordStrength.color}`}>
                      Fortaleza: {passwordStrength.text}
                    </small>
                    <div className="progress mt-1" style={{ height: '4px' }}>
                      <div
                        className={`progress-bar ${passwordStrength.level === 1 ? 'bg-danger' :
                                                   passwordStrength.level === 2 ? 'bg-warning' :
                                                   passwordStrength.level === 3 ? 'bg-info' : 'bg-success'}`}
                        style={{ width: `${(passwordStrength.level / 4) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                <div className="form-text">
                  La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y caracteres especiales.
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirmar Contraseña <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="form-control"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Confirme la nueva contraseña"
                    required
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <i className={`fas fa-${showConfirmPassword ? 'eye-slash' : 'eye'}`}></i>
                  </button>
                </div>
                {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                  <div className="mt-1">
                    <small className="form-text text-danger">
                      Las contraseñas no coinciden
                    </small>
                  </div>
                )}
              </div>

              <div className="mb-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="forceChange"
                    checked={formData.forceChange}
                    onChange={(e) => setFormData({ ...formData, forceChange: e.target.checked })}
                  />
                  <label className="form-check-label" htmlFor="forceChange">
                    Forzar cambio de contraseña en el próximo inicio de sesión
                  </label>
                </div>
                <div className="form-text">
                  Si se marca, el técnico deberá cambiar su contraseña la próxima vez que inicie sesión.
                </div>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-warning"
              onClick={handleSubmit}
              disabled={isLoading || !formData.newPassword || !formData.confirmPassword || formData.newPassword !== formData.confirmPassword}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Cambiando...
                </>
              ) : (
                <>
                  <i className="fas fa-save me-2"></i>
                  Cambiar Contraseña
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChangePasswordModal