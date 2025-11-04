import React, { useState, useEffect } from 'react'

export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'select' | 'textarea' | 'tel' | 'date' | 'multiselect'
  required?: boolean
  options?: Array<{ value: string, label: string }>
  placeholder?: string
  rows?: number
  dynamicOptions?: {
    endpoint: string
    labelField: string
    valueField: string
    params?: Record<string, any>
  }
}

interface EntityFormProps<T> {
  onSubmit: (data: Partial<T>) => void
  onCancel: () => void
  initialData?: Partial<T>
  fields: FormField[]
  submitText?: string
  title?: string
}

export const EntityForm = <T extends Record<string, any>>({
  onSubmit,
  onCancel,
  initialData = {},
  fields,
  submitText = 'Guardar',
  title
}: EntityFormProps<T>) => {
  const [formData, setFormData] = useState<Partial<T>>(initialData)
  const [dynamicOptions, setDynamicOptions] = useState<Record<string, Array<{ value: string, label: string }>>>({})
  const [loadingOptions, setLoadingOptions] = useState<Record<string, boolean>>({})

  // Load dynamic options for select fields with caching
  useEffect(() => {
    const loadDynamicOptions = async () => {
      const newOptions: Record<string, Array<{ value: string, label: string }>> = {}
      const newLoading: Record<string, boolean> = {}

      // Process fields in parallel for better performance
      const promises = fields.map(async (field) => {
        if (field.dynamicOptions) {
          newLoading[field.name] = true
          try {
            const { endpoint, labelField, valueField, params } = field.dynamicOptions
            const queryParams = new URLSearchParams(params || {})
            const url = `${endpoint}?${queryParams}`

            const response = await fetch(url)
            if (response.ok) {
              const data = await response.json()
              if (data.success && data.data) {
                const entities = Array.isArray(data.data) ? data.data :
                  data.data.tecnicos || data.data.recursos || data.data.usuarios || data.data.tareas || []

                const options = entities.map((entity: any) => ({
                  value: entity[valueField].toString(),
                  label: entity[labelField]
                }))

                newOptions[field.name] = options
              }
            }
          } catch (error) {
            console.error(`Error loading dynamic options for ${field.name}:`, error)
          } finally {
            newLoading[field.name] = false
          }
        }
      })

      await Promise.all(promises)
      setDynamicOptions(newOptions)
      setLoadingOptions(newLoading)
    }

    loadDynamicOptions()
  }, [fields])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    const errors: string[] = []
    fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        errors.push(`${field.label} es obligatorio`)
      }
    })

    if (errors.length > 0) {
      alert(`Errores de validación:\n${errors.join('\n')}`)
      return
    }

    onSubmit(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const renderField = (field: FormField) => {
    const value = formData[field.name] || ''

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            className="form-control"
            id={field.name}
            name={field.name}
            value={value}
            onChange={handleChange}
            placeholder={field.placeholder}
            rows={field.rows || 3}
            required={field.required}
          />
        )

      case 'select':
        const selectOptions = dynamicOptions[field.name] || field.options || []
        const isLoading = loadingOptions[field.name]
        return (
          <select
            className="form-select"
            id={field.name}
            name={field.name}
            value={value}
            onChange={handleChange}
            required={field.required}
            disabled={isLoading}
          >
            <option value="">
              {isLoading ? 'Cargando...' : 'Seleccionar...'}
            </option>
            {selectOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )

      case 'multiselect':
        const multiselectOptions = dynamicOptions[field.name] || field.options || []
        const isLoadingMulti = loadingOptions[field.name]
        const selectedValues = Array.isArray(value) ? value : []
        return (
          <div className="multiselect-container">
            <select
              className="form-select"
              multiple
              id={field.name}
              name={field.name}
              value={selectedValues}
              onChange={(e) => {
                const selectedOptions = Array.from(e.target.selectedOptions, option => option.value)
                setFormData(prev => ({ ...prev, [field.name]: selectedOptions }))
              }}
              style={{ minHeight: '120px' }}
              disabled={isLoadingMulti}
            >
              {isLoadingMulti && <option disabled>Cargando...</option>}
              {multiselectOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {selectedValues.length > 0 && (
              <small className="text-muted mt-1">
                {selectedValues.length} recurso{selectedValues.length !== 1 ? 's' : ''} seleccionado{selectedValues.length !== 1 ? 's' : ''}
              </small>
            )}
          </div>
        )

      default:
        return (
          <input
            type={field.type}
            className="form-control"
            id={field.name}
            name={field.name}
            value={value}
            onChange={handleChange}
            placeholder={field.placeholder}
            required={field.required}
          />
        )
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {title && (
        <h6 className="fw-bold text-primary mb-3">
          <i className="fas fa-edit me-2"></i>
          {title}
        </h6>
      )}

      <div className="row g-3">
        {fields.map(field => (
          <div key={field.name} className="col-md-6">
            <label className="form-label small fw-bold">
              {field.label} {field.required && '*'}
            </label>
            {renderField(field)}
          </div>
        ))}
      </div>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <small className="text-muted">
          Los campos marcados con * son obligatorios
        </small>
        <div>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm me-2"
            onClick={onCancel}
          >
            <i className="fas fa-times me-1"></i>Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-success btn-sm"
            disabled={!fields.some(f => f.required) || !fields.filter(f => f.required).every(f => formData[f.name])}
          >
            <i className="fas fa-save me-1"></i>{submitText}
          </button>
        </div>
      </div>
    </form>
  )
}