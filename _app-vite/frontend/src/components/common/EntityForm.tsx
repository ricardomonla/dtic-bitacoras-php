import React, { useState } from 'react'

export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'select' | 'textarea' | 'tel'
  required?: boolean
  options?: Array<{ value: string, label: string }>
  placeholder?: string
  rows?: number
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
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
        return (
          <select
            className="form-select"
            id={field.name}
            name={field.name}
            value={value}
            onChange={handleChange}
            required={field.required}
          >
            <option value="">Seleccionar...</option>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
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