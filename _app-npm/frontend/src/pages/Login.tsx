import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { useAuthStore } from '../stores/authStore'

const schema = yup.object({
  email: yup.string().email('Email inválido').required('Email es requerido'),
  password: yup.string().required('Contraseña es requerida'),
})

type LoginForm = {
  email: string
  password: string
}

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isAuthenticated, isLoading } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: yupResolver(schema),
  })

  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/dashboard'
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, location])

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data.email, data.password)
      toast.success('Inicio de sesión exitoso')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error en el inicio de sesión')
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-gradient">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card shadow-lg border-0 rounded-lg">
              <div className="card-header bg-primary text-white text-center py-4">
                <h3 className="mb-0">
                  <i className="fas fa-cogs me-2"></i>
                  DTIC Bitácoras
                </h3>
                <p className="mb-0 mt-2">Sistema de gestión de técnicos</p>
              </div>
              <div className="card-body p-4">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      <i className="fas fa-envelope me-2"></i>
                      Email
                    </label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      id="email"
                      {...register('email')}
                      placeholder="tu.email@dtic.gob.ar"
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email.message}</div>
                    )}
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="form-label">
                      <i className="fas fa-lock me-2"></i>
                      Contraseña
                    </label>
                    <div className="input-group">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        id="password"
                        {...register('password')}
                        placeholder="Ingresa tu contraseña"
                      />
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                      </button>
                      {errors.password && (
                        <div className="invalid-feedback">{errors.password.message}</div>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Iniciando sesión...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-sign-in-alt me-2"></i>
                        Iniciar Sesión
                      </>
                    )}
                  </button>
                </form>
              </div>
              <div className="card-footer text-center py-3">
                <small className="text-muted">
                  Sistema de gestión de recursos y tareas - DTIC
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login