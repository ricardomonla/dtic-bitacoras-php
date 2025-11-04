-- Inicialización de base de datos PostgreSQL para DTIC Bitácoras
-- Ejecutado automáticamente al crear el contenedor

-- Crear esquema principal
CREATE SCHEMA IF NOT EXISTS dtic;

-- Usar el esquema dtic por defecto
SET search_path TO dtic;

-- Tabla de técnicos
CREATE TABLE IF NOT EXISTS tecnicos (
    id SERIAL PRIMARY KEY,
    dtic_id VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    department VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'technician', 'viewer')),
    password_hash VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para búsquedas comunes
CREATE INDEX IF NOT EXISTS idx_tecnicos_email ON tecnicos (email);
CREATE INDEX IF NOT EXISTS idx_tecnicos_department ON tecnicos (department);
CREATE INDEX IF NOT EXISTS idx_tecnicos_role ON tecnicos (role);
CREATE INDEX IF NOT EXISTS idx_tecnicos_active ON tecnicos (is_active);
CREATE INDEX IF NOT EXISTS idx_tecnicos_dtic_id ON tecnicos (dtic_id);

-- Tabla de tareas
CREATE TABLE IF NOT EXISTS tareas (
    id SERIAL PRIMARY KEY,
    dtic_id VARCHAR(20) UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    technician_id INTEGER REFERENCES tecnicos(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    due_date TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Índices para tareas
CREATE INDEX IF NOT EXISTS idx_tareas_technician ON tareas (technician_id);
CREATE INDEX IF NOT EXISTS idx_tareas_status ON tareas (status);
CREATE INDEX IF NOT EXISTS idx_tareas_priority ON tareas (priority);
CREATE INDEX IF NOT EXISTS idx_tareas_due_date ON tareas (due_date);

-- Tabla de auditoría
CREATE TABLE IF NOT EXISTS audit_log (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES tecnicos(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INTEGER,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para auditoría
CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_log (user_id);
CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_log (entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_log (created_at);

-- Función para generar DTIC ID
CREATE OR REPLACE FUNCTION dtic.generate_dtic_id(prefix TEXT)
RETURNS TEXT AS $$
DECLARE
    counter INTEGER;
    new_id TEXT;
BEGIN
    -- Obtener el último contador para este prefijo desde todas las tablas
    SELECT COALESCE(MAX(CAST(SUBSTRING(dtic_id FROM LENGTH(prefix) + 2) AS INTEGER)), 0) + 1
    INTO counter
    FROM (
        SELECT dtic_id FROM dtic.tecnicos WHERE dtic_id LIKE prefix || '-%'
        UNION ALL
        SELECT dtic_id FROM dtic.tareas WHERE dtic_id LIKE prefix || '-%'
        UNION ALL
        SELECT dtic_id FROM dtic.recursos WHERE dtic_id LIKE prefix || '-%'
        UNION ALL
        SELECT dtic_id FROM dtic.usuarios_asignados WHERE dtic_id LIKE prefix || '-%'
        UNION ALL
        SELECT dtic_id FROM dtic.tarea_recursos WHERE dtic_id LIKE prefix || '-%'
    ) AS all_ids;

    -- Generar nuevo ID
    new_id := prefix || '-' || LPAD(counter::TEXT, 4, '0');

    RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar updated_at
CREATE TRIGGER update_tecnicos_updated_at
    BEFORE UPDATE ON tecnicos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tareas_updated_at
    BEFORE UPDATE ON tareas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insertar datos de ejemplo
INSERT INTO tecnicos (dtic_id, first_name, last_name, email, password_hash, department, role, is_active) VALUES
('TEC-0001', 'Juan', 'PÉREZ', 'juan.perez@dtic.gob.ar', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPjYQmHqU9yO', 'dtic', 'admin', true),
('TEC-0002', 'María', 'GONZÁLEZ', 'maria.gonzalez@dtic.gob.ar', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPjYQmHqU9yO', 'sistemas', 'technician', true),
('TEC-0003', 'Carlos', 'RODRÍGUEZ', 'carlos.rodriguez@dtic.gob.ar', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPjYQmHqU9yO', 'redes', 'technician', true),
('TEC-0004', 'Ana', 'MARTÍNEZ', 'ana.martinez@dtic.gob.ar', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPjYQmHqU9yO', 'seguridad', 'technician', true),
('TEC-0005', 'Luis', 'LÓPEZ', 'luis.lopez@dtic.gob.ar', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPjYQmHqU9yO', 'dtic', 'viewer', true),
('TEC-0006', 'Laura', 'SÁNCHEZ', 'laura.sanchez@dtic.gob.ar', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPjYQmHqU9yO', 'sistemas', 'technician', false),
('TEC-0007', 'Rodrigo', 'MONLA', 'rmonla@frlr.utn.edu.ar', '$2a$12$T4OKj7qWBnjtYhXGmDibP.WszYyFIF5iKEZW3TDpVE2GI9Pfmu5zS', 'dtic', 'admin', true)
ON CONFLICT (dtic_id) DO NOTHING;

-- Tabla de recursos
CREATE TABLE IF NOT EXISTS recursos (
    id SERIAL PRIMARY KEY,
    dtic_id VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL CHECK (category IN ('hardware', 'software', 'network', 'security', 'tools', 'facilities')),
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'assigned', 'maintenance', 'retired')),
    location VARCHAR(200),
    technical_specs JSONB,
    serial_number VARCHAR(100),
    model VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para recursos
CREATE INDEX IF NOT EXISTS idx_recursos_dtic_id ON recursos (dtic_id);
CREATE INDEX IF NOT EXISTS idx_recursos_category ON recursos (category);
CREATE INDEX IF NOT EXISTS idx_recursos_status ON recursos (status);
CREATE INDEX IF NOT EXISTS idx_recursos_location ON recursos (location);

-- Tabla de usuarios asignados (diferentes de técnicos del sistema)
CREATE TABLE IF NOT EXISTS usuarios_asignados (
    id SERIAL PRIMARY KEY,
    dtic_id VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    department VARCHAR(100),
    position VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para usuarios asignados
CREATE INDEX IF NOT EXISTS idx_usuarios_asignados_dtic_id ON usuarios_asignados (dtic_id);
CREATE INDEX IF NOT EXISTS idx_usuarios_asignados_email ON usuarios_asignados (email);
CREATE INDEX IF NOT EXISTS idx_usuarios_asignados_department ON usuarios_asignados (department);

-- Tabla de asignaciones recurso-usuario (relación muchos a muchos)
CREATE TABLE IF NOT EXISTS recurso_asignaciones (
    id SERIAL PRIMARY KEY,
    recurso_id INTEGER NOT NULL REFERENCES recursos(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES usuarios_asignados(id) ON DELETE CASCADE,
    assigned_by INTEGER REFERENCES tecnicos(id), -- técnico que realizó la asignación
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    unassigned_by INTEGER REFERENCES tecnicos(id), -- técnico que realizó la desasignación
    unassigned_at TIMESTAMP WITH TIME ZONE,
    activo BOOLEAN DEFAULT true,

    -- Constraint único para asignaciones activas
    UNIQUE (recurso_id, user_id)
);

-- Índices para asignaciones de recursos
CREATE INDEX IF NOT EXISTS idx_recurso_asignaciones_recurso ON recurso_asignaciones (recurso_id);
CREATE INDEX IF NOT EXISTS idx_recurso_asignaciones_user ON recurso_asignaciones (user_id);
CREATE INDEX IF NOT EXISTS idx_recurso_asignaciones_activo ON recurso_asignaciones (activo);
CREATE INDEX IF NOT EXISTS idx_recurso_asignaciones_assigned_at ON recurso_asignaciones (assigned_at);

-- Tabla de asignaciones tarea-recurso (relación muchos a muchos)
CREATE TABLE IF NOT EXISTS tarea_recursos (
    id SERIAL PRIMARY KEY,
    tarea_id INTEGER NOT NULL REFERENCES tareas(id) ON DELETE CASCADE,
    recurso_id INTEGER NOT NULL REFERENCES recursos(id) ON DELETE CASCADE,
    assigned_by INTEGER REFERENCES tecnicos(id), -- técnico que realizó la asignación
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    unassigned_by INTEGER REFERENCES tecnicos(id), -- técnico que realizó la desasignación
    unassigned_at TIMESTAMP WITH TIME ZONE,
    activo BOOLEAN DEFAULT true,

    -- Campos adicionales específicos de la asignación
    estimated_hours DECIMAL(5,2), -- horas estimadas para usar el recurso en esta tarea
    actual_hours DECIMAL(5,2), -- horas reales utilizadas
    notes TEXT, -- notas específicas sobre el uso del recurso en esta tarea

    -- Constraint único para asignaciones activas de la misma tarea-recurso
    UNIQUE (tarea_id, recurso_id, activo) DEFERRABLE INITIALLY DEFERRED,

    -- Constraint para evitar asignaciones duplicadas activas
    CHECK (NOT (tarea_id = ANY(SELECT t.tarea_id FROM tarea_recursos t WHERE t.recurso_id = recurso_id AND t.activo = true AND t.id != id)))
);

-- Tabla de historial de asignaciones tarea-recurso
CREATE TABLE IF NOT EXISTS tarea_recurso_historial (
    id SERIAL PRIMARY KEY,
    tarea_recurso_id INTEGER NOT NULL REFERENCES tarea_recursos(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL, -- 'assigned', 'unassigned', 'updated', 'completed'
    tecnico_id INTEGER REFERENCES tecnicos(id), -- técnico que realizó la acción
    old_values JSONB, -- valores anteriores
    new_values JSONB, -- valores nuevos
    details TEXT, -- descripción detallada de la acción
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de historial de recursos
CREATE TABLE IF NOT EXISTS recurso_historial (
    id SERIAL PRIMARY KEY,
    recurso_id INTEGER NOT NULL REFERENCES recursos(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL, -- 'assigned', 'unassigned', 'maintenance', 'created', 'updated'
    usuario_id INTEGER REFERENCES usuarios_asignados(id), -- usuario asignado (si aplica)
    tecnico_id INTEGER REFERENCES tecnicos(id), -- técnico que realizó la acción
    details TEXT, -- descripción detallada de la acción
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para asignaciones tarea-recurso
CREATE INDEX IF NOT EXISTS idx_tarea_recursos_tarea ON tarea_recursos (tarea_id);
CREATE INDEX IF NOT EXISTS idx_tarea_recursos_recurso ON tarea_recursos (recurso_id);
CREATE INDEX IF NOT EXISTS idx_tarea_recursos_activo ON tarea_recursos (activo);
CREATE INDEX IF NOT EXISTS idx_tarea_recursos_assigned_at ON tarea_recursos (assigned_at);

-- Índices para historial de asignaciones tarea-recurso
CREATE INDEX IF NOT EXISTS idx_tarea_recurso_historial_tarea_recurso ON tarea_recurso_historial (tarea_recurso_id);
CREATE INDEX IF NOT EXISTS idx_tarea_recurso_historial_action ON tarea_recurso_historial (action);
CREATE INDEX IF NOT EXISTS idx_tarea_recurso_historial_tecnico ON tarea_recurso_historial (tecnico_id);
CREATE INDEX IF NOT EXISTS idx_tarea_recurso_historial_created ON tarea_recurso_historial (created_at);

-- Índices para historial de recursos
CREATE INDEX IF NOT EXISTS idx_recurso_historial_recurso ON recurso_historial (recurso_id);
CREATE INDEX IF NOT EXISTS idx_recurso_historial_action ON recurso_historial (action);
CREATE INDEX IF NOT EXISTS idx_recurso_historial_tecnico ON recurso_historial (tecnico_id);
CREATE INDEX IF NOT EXISTS idx_recurso_historial_created ON recurso_historial (created_at);

-- Triggers para actualizar updated_at
CREATE TRIGGER update_recursos_updated_at
    BEFORE UPDATE ON recursos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_usuarios_asignados_updated_at
    BEFORE UPDATE ON usuarios_asignados
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para validar asignaciones de recursos a tareas
CREATE OR REPLACE FUNCTION validate_tarea_recurso_assignment()
RETURNS TRIGGER AS $$
BEGIN
    -- Si es una nueva asignación activa
    IF NEW.activo = true THEN
        -- Verificar que el recurso esté disponible (no asignado a otras tareas activas)
        IF EXISTS (
            SELECT 1 FROM tarea_recursos tr
            WHERE tr.recurso_id = NEW.recurso_id
            AND tr.activo = true
            AND tr.id != COALESCE(NEW.id, 0)
        ) THEN
            RAISE EXCEPTION 'El recurso ya está asignado a otra tarea activa';
        END IF;

        -- Verificar que el recurso esté en estado 'available'
        IF NOT EXISTS (
            SELECT 1 FROM recursos r
            WHERE r.id = NEW.recurso_id
            AND r.status = 'available'
        ) THEN
            RAISE EXCEPTION 'El recurso debe estar en estado disponible para ser asignado';
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para validar asignaciones
CREATE TRIGGER validate_tarea_recurso_assignment_trigger
    BEFORE INSERT OR UPDATE ON tarea_recursos
    FOR EACH ROW EXECUTE FUNCTION validate_tarea_recurso_assignment();

-- Función para actualizar estado de recursos basado en asignaciones
CREATE OR REPLACE FUNCTION update_recurso_status_from_assignments()
RETURNS TRIGGER AS $$
BEGIN
    -- Si se asigna un recurso a una tarea
    IF (TG_OP = 'INSERT' AND NEW.activo = true) OR (TG_OP = 'UPDATE' AND NEW.activo = true AND OLD.activo = false) THEN
        -- Cambiar estado del recurso a 'assigned'
        UPDATE recursos SET status = 'assigned', updated_at = CURRENT_TIMESTAMP
        WHERE id = NEW.recurso_id AND status = 'available';

    -- Si se desasigna un recurso de una tarea
    ELSIF (TG_OP = 'UPDATE' AND NEW.activo = false AND OLD.activo = true) OR TG_OP = 'DELETE' THEN
        -- Verificar si el recurso ya no está asignado a ninguna tarea activa
        IF NOT EXISTS (
            SELECT 1 FROM tarea_recursos tr
            WHERE tr.recurso_id = COALESCE(NEW.recurso_id, OLD.recurso_id)
            AND tr.activo = true
        ) THEN
            -- Cambiar estado del recurso a 'available'
            UPDATE recursos SET status = 'available', updated_at = CURRENT_TIMESTAMP
            WHERE id = COALESCE(NEW.recurso_id, OLD.recurso_id) AND status = 'assigned';
        END IF;
    END IF;

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar estado de recursos
CREATE TRIGGER update_recurso_status_from_assignments_trigger
    AFTER INSERT OR UPDATE OR DELETE ON tarea_recursos
    FOR EACH ROW EXECUTE FUNCTION update_recurso_status_from_assignments();

-- Insertar datos de ejemplo para recursos
INSERT INTO recursos (dtic_id, name, description, category, status, location, technical_specs, serial_number, model) VALUES
('REC-0001', 'Laptop Dell Latitude 5420', 'Laptop para trabajo administrativo', 'hardware', 'available', 'Oficina Principal', '{"cpu": "Intel i5", "ram": "16GB", "storage": "512GB SSD"}', 'DL5420-2025-001', 'Dell Latitude 5420'),
('REC-0002', 'Proyector Epson EB-S41', 'Proyector para presentaciones', 'hardware', 'assigned', 'Sala de Reuniones', '{"resolution": "SVGA", "brightness": "3200 lumens"}', 'EP-S41-2025-002', 'Epson EB-S41'),
('REC-0003', 'Antivirus Bitdefender Total Security', 'Licencia corporativa de antivirus', 'software', 'available', NULL, '{"licenses": 25, "valid_until": "2025-12-15"}', 'BD-TS-2025-003', 'Bitdefender Total Security'),
('REC-0004', 'Router Cisco RV340', 'Router para red corporativa', 'network', 'maintenance', 'Sala de Servidores', '{"ports": "16 Gigabit", "wifi": "Dual Band"}', 'CS-RV340-2025-004', 'Cisco RV340'),
('REC-0005', 'Kit de Herramientas de Red', 'Herramientas para mantenimiento de red', 'tools', 'available', 'Depósito Técnico', '{"items": ["Tester", "Cables", "Conectores"]}', 'KT-RD-2025-005', 'Kit Herramientas Red'),
('REC-0006', 'Licencia Windows Server 2022', 'Licencia para servidor principal', 'software', 'assigned', 'Sala de Servidores', '{"edition": "Standard", "cores": 16}', 'WS2022-STD-006', 'Windows Server 2022')
ON CONFLICT (dtic_id) DO NOTHING;

-- Insertar datos de ejemplo para usuarios asignados
INSERT INTO usuarios_asignados (dtic_id, first_name, last_name, email, phone, department, position) VALUES
('USR-0001', 'Juan', 'Pérez', 'juan.perez@empresa.com', '+54 11 1234-5678', 'Administración', 'Gerente'),
('USR-0002', 'María', 'González', 'maria.gonzalez@empresa.com', '+54 11 2345-6789', 'Recursos Humanos', 'Coordinadora'),
('USR-0003', 'Carlos', 'Rodríguez', 'carlos.rodriguez@empresa.com', '+54 11 3456-7890', 'IT', 'Analista'),
('USR-0004', 'Ana', 'Martínez', 'ana.martinez@empresa.com', '+54 11 4567-8901', 'Contabilidad', 'Contadora'),
('USR-0005', 'Luis', 'López', 'luis.lopez@empresa.com', '+54 11 5678-9012', 'Ventas', 'Vendedor')
ON CONFLICT (dtic_id) DO NOTHING;

-- Insertar asignaciones de ejemplo
INSERT INTO recurso_asignaciones (recurso_id, user_id, assigned_by) VALUES
(2, 1, 1), -- Proyector asignado a Juan Pérez
(6, 3, 2)  -- Windows Server asignado a Carlos Rodríguez
ON CONFLICT DO NOTHING;

-- Crear índices adicionales para búsquedas de texto completo
CREATE INDEX IF NOT EXISTS idx_tecnicos_full_name ON tecnicos USING gin (to_tsvector('spanish', first_name || ' ' || last_name));
CREATE INDEX IF NOT EXISTS idx_tecnicos_search ON tecnicos USING gin (to_tsvector('spanish', first_name || ' ' || last_name || ' ' || email || ' ' || dtic_id));

CREATE INDEX IF NOT EXISTS idx_recursos_name ON recursos USING gin (to_tsvector('spanish', name || ' ' || description || ' ' || dtic_id));
CREATE INDEX IF NOT EXISTS idx_usuarios_asignados_name ON usuarios_asignados USING gin (to_tsvector('spanish', first_name || ' ' || last_name || ' ' || email || ' ' || dtic_id));

-- Comentarios en las tablas
COMMENT ON TABLE tecnicos IS 'Tabla principal de técnicos del sistema DTIC Bitácoras';
COMMENT ON TABLE tareas IS 'Tabla de tareas asignadas a técnicos';
COMMENT ON TABLE tarea_recursos IS 'Tabla de relación many-to-many entre tareas y recursos asignados';
COMMENT ON TABLE tarea_recurso_historial IS 'Historial de asignaciones y desasignaciones de recursos a tareas';
COMMENT ON TABLE audit_log IS 'Registro de auditoría de todas las operaciones del sistema';

-- Permisos básicos (ajustar según necesidades de seguridad)
GRANT USAGE ON SCHEMA dtic TO dtic_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA dtic TO dtic_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA dtic TO dtic_user;