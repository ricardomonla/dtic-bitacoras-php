--
-- PostgreSQL database dump
--

\restrict mwWeJTW8qPMoUWB0VLtUsd5yEbJ73wgH71Ht201UffXdcIeREChrEriHSEQsGt0

-- Dumped from database version 15.14
-- Dumped by pg_dump version 15.14

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: dtic; Type: SCHEMA; Schema: -; Owner: dtic_user
--

CREATE SCHEMA dtic;


ALTER SCHEMA dtic OWNER TO dtic_user;

--
-- Name: generate_dtic_id(text); Type: FUNCTION; Schema: dtic; Owner: dtic_user
--

CREATE FUNCTION dtic.generate_dtic_id(prefix text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
    counter INTEGER;
    new_id TEXT;
BEGIN
    -- Obtener el último contador para este prefijo
    SELECT COALESCE(MAX(CAST(SUBSTRING(dtic_id FROM LENGTH(prefix) + 2) AS INTEGER)), 0) + 1
    INTO counter
    FROM tecnicos
    WHERE dtic_id LIKE prefix || '-%';

    -- Generar nuevo ID
    new_id := prefix || '-' || LPAD(counter::TEXT, 4, '0');

    RETURN new_id;
END;
$$;


ALTER FUNCTION dtic.generate_dtic_id(prefix text) OWNER TO dtic_user;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: dtic; Owner: dtic_user
--

CREATE FUNCTION dtic.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION dtic.update_updated_at_column() OWNER TO dtic_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: audit_log; Type: TABLE; Schema: dtic; Owner: dtic_user
--

CREATE TABLE dtic.audit_log (
    id integer NOT NULL,
    user_id integer,
    action character varying(50) NOT NULL,
    entity_type character varying(50) NOT NULL,
    entity_id integer,
    old_values jsonb,
    new_values jsonb,
    ip_address inet,
    user_agent text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE dtic.audit_log OWNER TO dtic_user;

--
-- Name: TABLE audit_log; Type: COMMENT; Schema: dtic; Owner: dtic_user
--

COMMENT ON TABLE dtic.audit_log IS 'Registro de auditoría de todas las operaciones del sistema';


--
-- Name: audit_log_id_seq; Type: SEQUENCE; Schema: dtic; Owner: dtic_user
--

CREATE SEQUENCE dtic.audit_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE dtic.audit_log_id_seq OWNER TO dtic_user;

--
-- Name: audit_log_id_seq; Type: SEQUENCE OWNED BY; Schema: dtic; Owner: dtic_user
--

ALTER SEQUENCE dtic.audit_log_id_seq OWNED BY dtic.audit_log.id;


--
-- Name: recurso_asignaciones; Type: TABLE; Schema: dtic; Owner: dtic_user
--

CREATE TABLE dtic.recurso_asignaciones (
    id integer NOT NULL,
    recurso_id integer NOT NULL,
    user_id integer NOT NULL,
    assigned_by integer,
    assigned_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    unassigned_by integer,
    unassigned_at timestamp with time zone,
    activo boolean DEFAULT true
);


ALTER TABLE dtic.recurso_asignaciones OWNER TO dtic_user;

--
-- Name: recurso_asignaciones_id_seq; Type: SEQUENCE; Schema: dtic; Owner: dtic_user
--

CREATE SEQUENCE dtic.recurso_asignaciones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE dtic.recurso_asignaciones_id_seq OWNER TO dtic_user;

--
-- Name: recurso_asignaciones_id_seq; Type: SEQUENCE OWNED BY; Schema: dtic; Owner: dtic_user
--

ALTER SEQUENCE dtic.recurso_asignaciones_id_seq OWNED BY dtic.recurso_asignaciones.id;


--
-- Name: recurso_historial; Type: TABLE; Schema: dtic; Owner: dtic_user
--

CREATE TABLE dtic.recurso_historial (
    id integer NOT NULL,
    recurso_id integer NOT NULL,
    action character varying(50) NOT NULL,
    usuario_id integer,
    tecnico_id integer,
    details text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE dtic.recurso_historial OWNER TO dtic_user;

--
-- Name: recurso_historial_id_seq; Type: SEQUENCE; Schema: dtic; Owner: dtic_user
--

CREATE SEQUENCE dtic.recurso_historial_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE dtic.recurso_historial_id_seq OWNER TO dtic_user;

--
-- Name: recurso_historial_id_seq; Type: SEQUENCE OWNED BY; Schema: dtic; Owner: dtic_user
--

ALTER SEQUENCE dtic.recurso_historial_id_seq OWNED BY dtic.recurso_historial.id;


--
-- Name: recursos; Type: TABLE; Schema: dtic; Owner: dtic_user
--

CREATE TABLE dtic.recursos (
    id integer NOT NULL,
    dtic_id character varying(20) NOT NULL,
    name character varying(200) NOT NULL,
    description text,
    category character varying(50) NOT NULL,
    status character varying(20) DEFAULT 'available'::character varying,
    location character varying(200),
    technical_specs jsonb,
    serial_number character varying(100),
    model character varying(100),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT recursos_category_check CHECK (((category)::text = ANY ((ARRAY['hardware'::character varying, 'software'::character varying, 'network'::character varying, 'security'::character varying, 'tools'::character varying, 'facilities'::character varying])::text[]))),
    CONSTRAINT recursos_status_check CHECK (((status)::text = ANY ((ARRAY['available'::character varying, 'assigned'::character varying, 'maintenance'::character varying, 'retired'::character varying])::text[])))
);


ALTER TABLE dtic.recursos OWNER TO dtic_user;

--
-- Name: recursos_id_seq; Type: SEQUENCE; Schema: dtic; Owner: dtic_user
--

CREATE SEQUENCE dtic.recursos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE dtic.recursos_id_seq OWNER TO dtic_user;

--
-- Name: recursos_id_seq; Type: SEQUENCE OWNED BY; Schema: dtic; Owner: dtic_user
--

ALTER SEQUENCE dtic.recursos_id_seq OWNED BY dtic.recursos.id;


--
-- Name: tarea_recursos; Type: TABLE; Schema: dtic; Owner: dtic_user
--

CREATE TABLE dtic.tarea_recursos (
    id integer NOT NULL,
    tarea_id integer NOT NULL,
    recurso_id integer NOT NULL,
    assigned_by integer,
    assigned_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    unassigned_by integer,
    unassigned_at timestamp with time zone,
    activo boolean DEFAULT true,
    estimated_hours numeric(5,2),
    actual_hours numeric(5,2),
    notes text
);


ALTER TABLE dtic.tarea_recursos OWNER TO dtic_user;

--
-- Name: tarea_recursos_id_seq; Type: SEQUENCE; Schema: dtic; Owner: dtic_user
--

CREATE SEQUENCE dtic.tarea_recursos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE dtic.tarea_recursos_id_seq OWNER TO dtic_user;

--
-- Name: tarea_recursos_id_seq; Type: SEQUENCE OWNED BY; Schema: dtic; Owner: dtic_user
--

ALTER SEQUENCE dtic.tarea_recursos_id_seq OWNED BY dtic.tarea_recursos.id;


--
-- Name: tareas; Type: TABLE; Schema: dtic; Owner: dtic_user
--

CREATE TABLE dtic.tareas (
    id integer NOT NULL,
    dtic_id character varying(20) NOT NULL,
    title character varying(200) NOT NULL,
    description text,
    technician_id integer,
    status character varying(20) DEFAULT 'pending'::character varying,
    priority character varying(10) DEFAULT 'medium'::character varying,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    due_date timestamp with time zone,
    completed_at timestamp with time zone,
    CONSTRAINT tareas_priority_check CHECK (((priority)::text = ANY ((ARRAY['low'::character varying, 'medium'::character varying, 'high'::character varying, 'urgent'::character varying])::text[]))),
    CONSTRAINT tareas_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'in_progress'::character varying, 'completed'::character varying, 'cancelled'::character varying])::text[])))
);


ALTER TABLE dtic.tareas OWNER TO dtic_user;

--
-- Name: TABLE tareas; Type: COMMENT; Schema: dtic; Owner: dtic_user
--

COMMENT ON TABLE dtic.tareas IS 'Tabla de tareas asignadas a técnicos';


--
-- Name: tareas_id_seq; Type: SEQUENCE; Schema: dtic; Owner: dtic_user
--

CREATE SEQUENCE dtic.tareas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE dtic.tareas_id_seq OWNER TO dtic_user;

--
-- Name: tareas_id_seq; Type: SEQUENCE OWNED BY; Schema: dtic; Owner: dtic_user
--

ALTER SEQUENCE dtic.tareas_id_seq OWNED BY dtic.tareas.id;


--
-- Name: tecnicos; Type: TABLE; Schema: dtic; Owner: dtic_user
--

CREATE TABLE dtic.tecnicos (
    id integer NOT NULL,
    dtic_id character varying(20) NOT NULL,
    first_name character varying(50) NOT NULL,
    last_name character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    phone character varying(20),
    department character varying(100) NOT NULL,
    role character varying(20) NOT NULL,
    password_hash character varying(255),
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT tecnicos_role_check CHECK (((role)::text = ANY ((ARRAY['admin'::character varying, 'technician'::character varying, 'viewer'::character varying])::text[])))
);


ALTER TABLE dtic.tecnicos OWNER TO dtic_user;

--
-- Name: TABLE tecnicos; Type: COMMENT; Schema: dtic; Owner: dtic_user
--

COMMENT ON TABLE dtic.tecnicos IS 'Tabla principal de técnicos del sistema DTIC Bitácoras';


--
-- Name: tecnicos_id_seq; Type: SEQUENCE; Schema: dtic; Owner: dtic_user
--

CREATE SEQUENCE dtic.tecnicos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE dtic.tecnicos_id_seq OWNER TO dtic_user;

--
-- Name: tecnicos_id_seq; Type: SEQUENCE OWNED BY; Schema: dtic; Owner: dtic_user
--

ALTER SEQUENCE dtic.tecnicos_id_seq OWNED BY dtic.tecnicos.id;


--
-- Name: usuarios_asignados; Type: TABLE; Schema: dtic; Owner: dtic_user
--

CREATE TABLE dtic.usuarios_asignados (
    id integer NOT NULL,
    dtic_id character varying(20) NOT NULL,
    first_name character varying(50) NOT NULL,
    last_name character varying(50) NOT NULL,
    email character varying(100),
    phone character varying(20),
    department character varying(100),
    "position" character varying(100),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE dtic.usuarios_asignados OWNER TO dtic_user;

--
-- Name: usuarios_asignados_id_seq; Type: SEQUENCE; Schema: dtic; Owner: dtic_user
--

CREATE SEQUENCE dtic.usuarios_asignados_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE dtic.usuarios_asignados_id_seq OWNER TO dtic_user;

--
-- Name: usuarios_asignados_id_seq; Type: SEQUENCE OWNED BY; Schema: dtic; Owner: dtic_user
--

ALTER SEQUENCE dtic.usuarios_asignados_id_seq OWNED BY dtic.usuarios_asignados.id;


--
-- Name: audit_log id; Type: DEFAULT; Schema: dtic; Owner: dtic_user
--

ALTER TABLE ONLY dtic.audit_log ALTER COLUMN id SET DEFAULT nextval('dtic.audit_log_id_seq'::regclass);


--
-- Name: recurso_asignaciones id; Type: DEFAULT; Schema: dtic; Owner: dtic_user
--

ALTER TABLE ONLY dtic.recurso_asignaciones ALTER COLUMN id SET DEFAULT nextval('dtic.recurso_asignaciones_id_seq'::regclass);


--
-- Name: recurso_historial id; Type: DEFAULT; Schema: dtic; Owner: dtic_user
--

ALTER TABLE ONLY dtic.recurso_historial ALTER COLUMN id SET DEFAULT nextval('dtic.recurso_historial_id_seq'::regclass);


--
-- Name: recursos id; Type: DEFAULT; Schema: dtic; Owner: dtic_user
--

ALTER TABLE ONLY dtic.recursos ALTER COLUMN id SET DEFAULT nextval('dtic.recursos_id_seq'::regclass);


--
-- Name: tarea_recursos id; Type: DEFAULT; Schema: dtic; Owner: dtic_user
--

ALTER TABLE ONLY dtic.tarea_recursos ALTER COLUMN id SET DEFAULT nextval('dtic.tarea_recursos_id_seq'::regclass);


--
-- Name: tareas id; Type: DEFAULT; Schema: dtic; Owner: dtic_user
--

ALTER TABLE ONLY dtic.tareas ALTER COLUMN id SET DEFAULT nextval('dtic.tareas_id_seq'::regclass);


--
-- Name: tecnicos id; Type: DEFAULT; Schema: dtic; Owner: dtic_user
--

ALTER TABLE ONLY dtic.tecnicos ALTER COLUMN id SET DEFAULT nextval('dtic.tecnicos_id_seq'::regclass);


--
-- Name: usuarios_asignados id; Type: DEFAULT; Schema: dtic; Owner: dtic_user
--

ALTER TABLE ONLY dtic.usuarios_asignados ALTER COLUMN id SET DEFAULT nextval('dtic.usuarios_asignados_id_seq'::regclass);


--
-- Data for Name: audit_log; Type: TABLE DATA; Schema: dtic; Owner: dtic_user
--

COPY dtic.audit_log (id, user_id, action, entity_type, entity_id, old_values, new_values, ip_address, user_agent, created_at) FROM stdin;
\.


--
-- Data for Name: recurso_asignaciones; Type: TABLE DATA; Schema: dtic; Owner: dtic_user
--

COPY dtic.recurso_asignaciones (id, recurso_id, user_id, assigned_by, assigned_at, unassigned_by, unassigned_at, activo) FROM stdin;
1	2	1	1	2025-11-01 21:09:56.362271+00	\N	\N	t
2	6	3	2	2025-11-01 21:09:56.362271+00	\N	\N	t
3	8	6	1	2025-11-04 21:20:33.13337+00	\N	\N	t
\.


--
-- Data for Name: recurso_historial; Type: TABLE DATA; Schema: dtic; Owner: dtic_user
--

COPY dtic.recurso_historial (id, recurso_id, action, usuario_id, tecnico_id, details, created_at) FROM stdin;
\.


--
-- Data for Name: recursos; Type: TABLE DATA; Schema: dtic; Owner: dtic_user
--

COPY dtic.recursos (id, dtic_id, name, description, category, status, location, technical_specs, serial_number, model, created_at, updated_at) FROM stdin;
1	REC-0001	Laptop Dell Latitude 5420	Laptop para trabajo administrativo	hardware	available	Oficina Principal	{"cpu": "Intel i5", "ram": "16GB", "storage": "512GB SSD"}	DL5420-2025-001	Dell Latitude 5420	2025-11-01 21:09:56.358911+00	2025-11-01 21:09:56.358911+00
2	REC-0002	Proyector Epson EB-S41	Proyector para presentaciones	hardware	assigned	Sala de Reuniones	{"brightness": "3200 lumens", "resolution": "SVGA"}	EP-S41-2025-002	Epson EB-S41	2025-11-01 21:09:56.358911+00	2025-11-01 21:09:56.358911+00
3	REC-0003	Antivirus Bitdefender Total Security	Licencia corporativa de antivirus	software	available	\N	{"licenses": 25, "valid_until": "2025-12-15"}	BD-TS-2025-003	Bitdefender Total Security	2025-11-01 21:09:56.358911+00	2025-11-01 21:09:56.358911+00
4	REC-0004	Router Cisco RV340	Router para red corporativa	network	maintenance	Sala de Servidores	{"wifi": "Dual Band", "ports": "16 Gigabit"}	CS-RV340-2025-004	Cisco RV340	2025-11-01 21:09:56.358911+00	2025-11-01 21:09:56.358911+00
5	REC-0005	Kit de Herramientas de Red	Herramientas para mantenimiento de red	tools	available	Depósito Técnico	{"items": ["Tester", "Cables", "Conectores"]}	KT-RD-2025-005	Kit Herramientas Red	2025-11-01 21:09:56.358911+00	2025-11-01 21:09:56.358911+00
6	REC-0006	Licencia Windows Server 2022	Licencia para servidor principal	software	assigned	Sala de Servidores	{"cores": 16, "edition": "Standard"}	WS2022-STD-006	Windows Server 2022	2025-11-01 21:09:56.358911+00	2025-11-01 21:09:56.358911+00
8	REC-0007	srvv-KOHA	Servidor KOHA - Sistema de gestión bibliotecaria	hardware	available	Servidor Principal	\N	\N	Servidor Dedicado	2025-11-04 21:19:53.245336+00	2025-11-04 21:19:53.245336+00
\.


--
-- Data for Name: tarea_recursos; Type: TABLE DATA; Schema: dtic; Owner: dtic_user
--

COPY dtic.tarea_recursos (id, tarea_id, recurso_id, assigned_by, assigned_at, unassigned_by, unassigned_at, activo, estimated_hours, actual_hours, notes) FROM stdin;
2	2	8	7	2025-11-04 21:48:08.869521+00	\N	\N	t	8.00	\N	Recurso asignado para reconfiguración del puerto KOHA
\.


--
-- Data for Name: tareas; Type: TABLE DATA; Schema: dtic; Owner: dtic_user
--

COPY dtic.tareas (id, dtic_id, title, description, technician_id, status, priority, created_at, updated_at, due_date, completed_at) FROM stdin;
1	TAR-1249	Actualizar script nuevaBitacora.sh	Mejorar el script de generación de bitácoras para estandarizar registros automáticos	7	pending	medium	2025-11-03 19:57:37.00588+00	2025-11-03 19:57:37.00588+00	2025-11-10 23:59:59+00	\N
3	TAR-6204	Armado y testeo de UPS2	Armar UPS2 con baterías nuevas y realizar pruebas de carga y autonomía	1	pending	urgent	2025-11-03 19:58:14.057204+00	2025-11-04 19:16:33.376187+00	2025-11-05 23:59:59+00	\N
2	TAR-3273	Reconfigurar puerto KOHA 8080 → 80	Cambiar puerto de acceso de KOHA del 8080 al 80 y configurar DNS interno/externo	1	pending	high	2025-11-03 19:57:55.302421+00	2025-11-04 19:16:47.41898+00	2025-11-15 23:59:59+00	\N
4	TAR-3565	Actualización Servicios Docker srvv-DTIC	Actualizar servicios Docker y plataforma Unifi Network a versión 9.5.21	4	completed	medium	2025-11-03 19:58:21.741026+00	2025-11-04 19:36:21.599331+00	2025-11-08 23:59:59+00	2025-11-04 19:36:21.599331+00
\.


--
-- Data for Name: tecnicos; Type: TABLE DATA; Schema: dtic; Owner: dtic_user
--

COPY dtic.tecnicos (id, dtic_id, first_name, last_name, email, phone, department, role, password_hash, is_active, created_at, updated_at) FROM stdin;
4	TEC-0004	Ana	MARTÍNEZ	ana.martinez@dtic.gob.ar	\N	seguridad	technician	$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPjYQmHqU9yO	t	2025-11-01 21:09:56.299511+00	2025-11-01 21:09:56.299511+00
2	TEC-0002	Wilfredo	KRUPP	wkrupp@frlr.utn.edu.ar	\N	sistemas	technician	$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPjYQmHqU9yO	t	2025-11-01 21:09:56.299511+00	2025-11-03 21:04:54.277867+00
3	TEC-0003	Roberto	CANIZA	rcaniza@frlr.utn.edu.ar	\N	sistemas	technician	$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPjYQmHqU9yO	t	2025-11-01 21:09:56.299511+00	2025-11-03 21:06:04.697119+00
8	TEC-3543895	Juan Carlos	PEPE	pepe@pepe123.com	\N	dtic	admin	\N	t	2025-11-03 23:34:53.543556+00	2025-11-04 00:01:35.688127+00
1	TEC-0001	Ricardo	MONLA	rmonla@frlr.utn.edu.ar	\N	dtic	admin	$2a$12$mvekc1y6v5DYadiSWcbtVu7coELOKQm5ZixXLYO6WU/O3UDGBYgC2	t	2025-11-01 21:09:56.299511+00	2025-11-04 00:23:51.786536+00
7	TEC-0007	Ricardo	MONLA	rmonla@frlr.utn.edu.cl	\N	dtic	admin	$2a$12$T4OKj7qWBnjtYhXGmDibP.WszYyFIF5iKEZW3TDpVE2GI9Pfmu5zS	f	2025-11-01 21:09:56.299511+00	2025-11-04 00:52:10.12474+00
\.


--
-- Data for Name: usuarios_asignados; Type: TABLE DATA; Schema: dtic; Owner: dtic_user
--

COPY dtic.usuarios_asignados (id, dtic_id, first_name, last_name, email, phone, department, "position", created_at, updated_at) FROM stdin;
1	USR-0001	Juan	Pérez	juan.perez@empresa.com	+54 11 1234-5678	Administración	Gerente	2025-11-01 21:09:56.360668+00	2025-11-01 21:09:56.360668+00
2	USR-0002	María	González	maria.gonzalez@empresa.com	+54 11 2345-6789	Recursos Humanos	Coordinadora	2025-11-01 21:09:56.360668+00	2025-11-01 21:09:56.360668+00
3	USR-0003	Carlos	Rodríguez	carlos.rodriguez@empresa.com	+54 11 3456-7890	IT	Analista	2025-11-01 21:09:56.360668+00	2025-11-01 21:09:56.360668+00
4	USR-0004	Ana	Martínez	ana.martinez@empresa.com	+54 11 4567-8901	Contabilidad	Contadora	2025-11-01 21:09:56.360668+00	2025-11-01 21:09:56.360668+00
5	USR-0005	Luis	López	luis.lopez@empresa.com	+54 11 5678-9012	Ventas	Vendedor	2025-11-01 21:09:56.360668+00	2025-11-01 21:09:56.360668+00
6	USR-0006	Ricardo	MONLA	ricardo.monla@dtic.gob.ar	\N	dtic	Técnico Senior	2025-11-04 21:21:55.244194+00	2025-11-04 21:21:55.244194+00
\.


--
-- Name: audit_log_id_seq; Type: SEQUENCE SET; Schema: dtic; Owner: dtic_user
--

SELECT pg_catalog.setval('dtic.audit_log_id_seq', 1, false);


--
-- Name: recurso_asignaciones_id_seq; Type: SEQUENCE SET; Schema: dtic; Owner: dtic_user
--

SELECT pg_catalog.setval('dtic.recurso_asignaciones_id_seq', 3, true);


--
-- Name: recurso_historial_id_seq; Type: SEQUENCE SET; Schema: dtic; Owner: dtic_user
--

SELECT pg_catalog.setval('dtic.recurso_historial_id_seq', 1, false);


--
-- Name: recursos_id_seq; Type: SEQUENCE SET; Schema: dtic; Owner: dtic_user
--

SELECT pg_catalog.setval('dtic.recursos_id_seq', 8, true);


--
-- Name: tarea_recursos_id_seq; Type: SEQUENCE SET; Schema: dtic; Owner: dtic_user
--

SELECT pg_catalog.setval('dtic.tarea_recursos_id_seq', 2, true);


--
-- Name: tareas_id_seq; Type: SEQUENCE SET; Schema: dtic; Owner: dtic_user
--

SELECT pg_catalog.setval('dtic.tareas_id_seq', 4, true);


--
-- Name: tecnicos_id_seq; Type: SEQUENCE SET; Schema: dtic; Owner: dtic_user
--

SELECT pg_catalog.setval('dtic.tecnicos_id_seq', 8, true);


--
-- Name: usuarios_asignados_id_seq; Type: SEQUENCE SET; Schema: dtic; Owner: dtic_user
--

SELECT pg_catalog.setval('dtic.usuarios_asignados_id_seq', 6, true);


--
-- Name: audit_log audit_log_pkey; Type: CONSTRAINT; Schema: dtic; Owner: dtic_user
--

ALTER TABLE ONLY dtic.audit_log
    ADD CONSTRAINT audit_log_pkey PRIMARY KEY (id);


--
-- Name: recurso_asignaciones recurso_asignaciones_pkey; Type: CONSTRAINT; Schema: dtic; Owner: dtic_user
--

ALTER TABLE ONLY dtic.recurso_asignaciones
    ADD CONSTRAINT recurso_asignaciones_pkey PRIMARY KEY (id);


--
-- Name: recurso_asignaciones recurso_asignaciones_recurso_id_user_id_key; Type: CONSTRAINT; Schema: dtic; Owner: dtic_user
--

ALTER TABLE ONLY dtic.recurso_asignaciones
    ADD CONSTRAINT recurso_asignaciones_recurso_id_user_id_key UNIQUE (recurso_id, user_id);


--
-- Name: recurso_historial recurso_historial_pkey; Type: CONSTRAINT; Schema: dtic; Owner: dtic_user
--

ALTER TABLE ONLY dtic.recurso_historial
    ADD CONSTRAINT recurso_historial_pkey PRIMARY KEY (id);


--
-- Name: recursos recursos_dtic_id_key; Type: CONSTRAINT; Schema: dtic; Owner: dtic_user
--

ALTER TABLE ONLY dtic.recursos
    ADD CONSTRAINT recursos_dtic_id_key UNIQUE (dtic_id);


--
-- Name: recursos recursos_pkey; Type: CONSTRAINT; Schema: dtic; Owner: dtic_user
--

ALTER TABLE ONLY dtic.recursos
    ADD CONSTRAINT recursos_pkey PRIMARY KEY (id);


--
-- Name: tarea_recursos tarea_recursos_pkey; Type: CONSTRAINT; Schema: dtic; Owner: dtic_user
--

ALTER TABLE ONLY dtic.tarea_recursos
    ADD CONSTRAINT tarea_recursos_pkey PRIMARY KEY (id);


--
-- Name: tarea_recursos tarea_recursos_tarea_id_recurso_id_activo_key; Type: CONSTRAINT; Schema: dtic; Owner: dtic_user
--

ALTER TABLE ONLY dtic.tarea_recursos
    ADD CONSTRAINT tarea_recursos_tarea_id_recurso_id_activo_key UNIQUE (tarea_id, recurso_id, activo) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: tareas tareas_dtic_id_key; Type: CONSTRAINT; Schema: dtic; Owner: dtic_user
--

ALTER TABLE ONLY dtic.tareas
    ADD CONSTRAINT tareas_dtic_id_key UNIQUE (dtic_id);


--
-- Name: tareas tareas_pkey; Type: CONSTRAINT; Schema: dtic; Owner: dtic_user
--

ALTER TABLE ONLY dtic.tareas
    ADD CONSTRAINT tareas_pkey PRIMARY KEY (id);


--
-- Name: tecnicos tecnicos_dtic_id_key; Type: CONSTRAINT; Schema: dtic; Owner: dtic_user
--

ALTER TABLE ONLY dtic.tecnicos
    ADD CONSTRAINT tecnicos_dtic_id_key UNIQUE (dtic_id);


--
-- Name: tecnicos tecnicos_email_key; Type: CONSTRAINT; Schema: dtic; Owner: dtic_user
--

ALTER TABLE ONLY dtic.tecnicos
    ADD CONSTRAINT tecnicos_email_key UNIQUE (email);


--
-- Name: tecnicos tecnicos_pkey; Type: CONSTRAINT; Schema: dtic; Owner: dtic_user
--

ALTER TABLE ONLY dtic.tecnicos
    ADD CONSTRAINT tecnicos_pkey PRIMARY KEY (id);


--
-- Name: usuarios_asignados usuarios_asignados_dtic_id_key; Type: CONSTRAINT; Schema: dtic; Owner: dtic_user
--

ALTER TABLE ONLY dtic.usuarios_asignados
    ADD CONSTRAINT usuarios_asignados_dtic_id_key UNIQUE (dtic_id);


--
-- Name: usuarios_asignados usuarios_asignados_email_key; Type: CONSTRAINT; Schema: dtic; Owner: dtic_user
--

ALTER TABLE ONLY dtic.usuarios_asignados
    ADD CONSTRAINT usuarios_asignados_email_key UNIQUE (email);


--
-- Name: usuarios_asignados usuarios_asignados_pkey; Type: CONSTRAINT; Schema: dtic; Owner: dtic_user
--

ALTER TABLE ONLY dtic.usuarios_asignados
    ADD CONSTRAINT usuarios_asignados_pkey PRIMARY KEY (id);


--
-- Name: idx_audit_created; Type: INDEX; Schema: dtic; Owner: dtic_user
--

CREATE INDEX idx_audit_created ON dtic.audit_log USING btree (created_at);


--
-- Name: idx_audit_entity; Type: INDEX; Schema: dtic; Owner: dtic_user
--

CREATE INDEX idx_audit_entity ON dtic.audit_log USING btree (entity_type, entity_id);


--
-- Name: idx_audit_user; Type: INDEX; Schema: dtic; Owner: dtic_user
--

CREATE INDEX idx_audit_user ON dtic.audit_log USING btree (user_id);


--
-- Name: idx_recurso_asignaciones_activo; Type: INDEX; Schema: dtic; Owner: dtic_user
--

CREATE INDEX idx_recurso_asignaciones_activo ON dtic.recurso_asignaciones USING btree (activo);


--
-- Name: idx_recurso_asignaciones_assigned_at; Type: INDEX; Schema: dtic; Owner: dtic_user
--

CREATE INDEX idx_recurso_asignaciones_assigned_at ON dtic.recurso_asignaciones USING btree (assigned_at);


--
-- Name: idx_recurso_asignaciones_recurso; Type: INDEX; Schema: dtic; Owner: dtic_user
--

CREATE INDEX idx_recurso_asignaciones_recurso ON dtic.recurso_asignaciones USING btree (recurso_id);


--
-- Name: idx_recurso_asignaciones_user; Type: INDEX; Schema: dtic; Owner: dtic_user
--

CREATE INDEX idx_recurso_asignaciones_user ON dtic.recurso_asignaciones USING btree (user_id);


--
-- Name: idx_recurso_historial_action; Type: INDEX; Schema: dtic; Owner: dtic_user
--

CREATE INDEX idx_recurso_historial_action ON dtic.recurso_historial USING btree (action);


--
-- Name: idx_recurso_historial_created; Type: INDEX; Schema: dtic; Owner: dtic_user
--

CREATE INDEX idx_recurso_historial_created ON dtic.recurso_historial USING btree (created_at);


--
-- Name: idx_recurso_historial_recurso; Type: INDEX; Schema: dtic; Owner: dtic_user
--

CREATE INDEX idx_recurso_historial_recurso ON dtic.recurso_historial USING btree (recurso_id);


--
-- Name: idx_recurso_historial_tecnico; Type: INDEX; Schema: dtic; Owner: dtic_user
--

CREATE INDEX idx_recurso_historial_tecnico ON dtic.recurso_historial USING btree (tecnico_id);


--
-- Name: idx_recursos_category; Type: INDEX; Schema: dtic; Owner: dtic_user
--

CREATE INDEX idx_recursos_category ON dtic.recursos USING btree (category);


--
-- Name: idx_recursos_dtic_id; Type: INDEX; Schema: dtic; Owner: dtic_user
--

CREATE INDEX idx_recursos_dtic_id ON dtic.recursos USING btree (dtic_id);


--
-- Name: idx_recursos_location; Type: INDEX; Schema: dtic; Owner: dtic_user
--

CREATE INDEX idx_recursos_location ON dtic.recursos USING btree (location);


--
-- Name: idx_recursos_name; Type: INDEX; Schema: dtic; Owner: dtic_user
--

CREATE INDEX idx_recursos_name ON dtic.recursos USING gin (to_tsvector('spanish'::regconfig, (((((name)::text || ' '::text) || description) || ' '::text) || (dtic_id)::text)));


--
-- Name: idx_recursos_status; Type: INDEX; Schema: dtic; Owner: dtic_user
--

CREATE INDEX idx_recursos_status ON dtic.recursos USING btree (status);


--
-- Name: idx_tarea_recursos_activo; Type: INDEX; Schema: dtic; Owner: dtic_user
--

CREATE INDEX idx_tarea_recursos_activo ON dtic.tarea_recursos USING btree (activo);


--
-- Name: idx_tarea_recursos_recurso; Type: INDEX; Schema: dtic; Owner: dtic_user
--

CREATE INDEX idx_tarea_recursos_recurso ON dtic.tarea_recursos USING btree (recurso_id);


--
-- Name: idx_tarea_recursos_tarea; Type: INDEX; Schema: dtic; Owner: dtic_user
--

CREATE INDEX idx_tarea_recursos_tarea ON dtic.tarea_recursos USING btree (tarea_id);


--
-- Name: idx_tareas_due_date; Type: INDEX; Schema: dtic; Owner: dtic_user
--

CREATE INDEX idx_tareas_due_date ON dtic.tareas USING btree (due_date);


--
-- Name: idx_tareas_priority; Type: INDEX; Schema: dtic; Owner: dtic_user
--

CREATE INDEX idx_tareas_priority ON dtic.tareas USING btree (priority);


--
-- Name: idx_tareas_status; Type: INDEX; Schema: dtic; Owner: dtic_user
--

CREATE INDEX idx_tareas_status ON dtic.tareas USING btree (status);


--
-- Name: idx_tareas_technician; Type: INDEX; Schema: dtic; Owner: dtic_user
--

CREATE INDEX idx_tareas_technician ON dtic.tareas USING btree (technician_id);


--
-- Name: idx_tecnicos_active; Type: INDEX; Schema: dtic; Owner: dtic_user
--

CREATE INDEX idx_tecnicos_active ON dtic.tecnicos USING btree (is_active);


--
-- Name: idx_tecnicos_department; Type: INDEX; Schema: dtic; Owner: dtic_user
--

CREATE INDEX idx_tecnicos_department ON dtic.tecnicos USING btree (department);


--
-- Name: idx_tecnicos_dtic_id; Type: INDEX; Schema: dtic; Owner: dtic_user
--

CREATE INDEX idx_tecnicos_dtic_id ON dtic.tecnicos USING btree (dtic_id);


--
-- Name: idx_tecnicos_email; Type: INDEX; Schema: dtic; Owner: dtic_user
--

CREATE INDEX idx_tecnicos_email ON dtic.tecnicos USING btree (email);


--
-- Name: idx_tecnicos_full_name; Type: INDEX; Schema: dtic; Owner: dtic_user
--

CREATE INDEX idx_tecnicos_full_name ON dtic.tecnicos USING gin (to_tsvector('spanish'::regconfig, (((first_name)::text || ' '::text) || (last_name)::text)));


--
-- Name: idx_tecnicos_role; Type: INDEX; Schema: dtic; Owner: dtic_user
--

CREATE INDEX idx_tecnicos_role ON dtic.tecnicos USING btree (role);


--
-- Name: idx_tecnicos_search; Type: INDEX; Schema: dtic; Owner: dtic_user
--

CREATE INDEX idx_tecnicos_search ON dtic.tecnicos USING gin (to_tsvector('spanish'::regconfig, (((((((first_name)::text || ' '::text) || (last_name)::text) || ' '::text) || (email)::text) || ' '::text) || (dtic_id)::text)));


--
-- Name: idx_usuarios_asignados_department; Type: INDEX; Schema: dtic; Owner: dtic_user
--

CREATE INDEX idx_usuarios_asignados_department ON dtic.usuarios_asignados USING btree (department);


--
-- Name: idx_usuarios_asignados_dtic_id; Type: INDEX; Schema: dtic; Owner: dtic_user
--

CREATE INDEX idx_usuarios_asignados_dtic_id ON dtic.usuarios_asignados USING btree (dtic_id);


--
-- Name: idx_usuarios_asignados_email; Type: INDEX; Schema: dtic; Owner: dtic_user
--

CREATE INDEX idx_usuarios_asignados_email ON dtic.usuarios_asignados USING btree (email);


--
-- Name: idx_usuarios_asignados_name; Type: INDEX; Schema: dtic; Owner: dtic_user
--

CREATE INDEX idx_usuarios_asignados_name ON dtic.usuarios_asignados USING gin (to_tsvector('spanish'::regconfig, (((((((first_name)::text || ' '::text) || (last_name)::text) || ' '::text) || (email)::text) || ' '::text) || (dtic_id)::text)));


--
-- Name: recursos update_recursos_updated_at; Type: TRIGGER; Schema: dtic; Owner: dtic_user
--

CREATE TRIGGER update_recursos_updated_at BEFORE UPDATE ON dtic.recursos FOR EACH ROW EXECUTE FUNCTION dtic.update_updated_at_column();


--
-- Name: tareas update_tareas_updated_at; Type: TRIGGER; Schema: dtic; Owner: dtic_user
--

CREATE TRIGGER update_tareas_updated_at BEFORE UPDATE ON dtic.tareas FOR EACH ROW EXECUTE FUNCTION dtic.update_updated_at_column();


--
-- Name: tecnicos update_tecnicos_updated_at; Type: TRIGGER; Schema: dtic; Owner: dtic_user
--

CREATE TRIGGER update_tecnicos_updated_at BEFORE UPDATE ON dtic.tecnicos FOR EACH ROW EXECUTE FUNCTION dtic.update_updated_at_column();


--
-- Name: usuarios_asignados update_usuarios_asignados_updated_at; Type: TRIGGER; Schema: dtic; Owner: dtic_user
--

CREATE TRIGGER update_usuarios_asignados_updated_at BEFORE UPDATE ON dtic.usuarios_asignados FOR EACH ROW EXECUTE FUNCTION dtic.update_updated_at_column();


--
-- Name: audit_log audit_log_user_id_fkey; Type: FK CONSTRAINT; Schema: dtic; Owner: dtic_user
--

ALTER TABLE ONLY dtic.audit_log
    ADD CONSTRAINT audit_log_user_id_fkey FOREIGN KEY (user_id) REFERENCES dtic.tecnicos(id) ON DELETE SET NULL;


--
-- Name: recurso_asignaciones recurso_asignaciones_assigned_by_fkey; Type: FK CONSTRAINT; Schema: dtic; Owner: dtic_user
--

ALTER TABLE ONLY dtic.recurso_asignaciones
    ADD CONSTRAINT recurso_asignaciones_assigned_by_fkey FOREIGN KEY (assigned_by) REFERENCES dtic.tecnicos(id);


--
-- Name: recurso_asignaciones recurso_asignaciones_recurso_id_fkey; Type: FK CONSTRAINT; Schema: dtic; Owner: dtic_user
--

ALTER TABLE ONLY dtic.recurso_asignaciones
    ADD CONSTRAINT recurso_asignaciones_recurso_id_fkey FOREIGN KEY (recurso_id) REFERENCES dtic.recursos(id) ON DELETE CASCADE;


--
-- Name: recurso_asignaciones recurso_asignaciones_unassigned_by_fkey; Type: FK CONSTRAINT; Schema: dtic; Owner: dtic_user
--

ALTER TABLE ONLY dtic.recurso_asignaciones
    ADD CONSTRAINT recurso_asignaciones_unassigned_by_fkey FOREIGN KEY (unassigned_by) REFERENCES dtic.tecnicos(id);


--
-- Name: recurso_asignaciones recurso_asignaciones_user_id_fkey; Type: FK CONSTRAINT; Schema: dtic; Owner: dtic_user
--

ALTER TABLE ONLY dtic.recurso_asignaciones
    ADD CONSTRAINT recurso_asignaciones_user_id_fkey FOREIGN KEY (user_id) REFERENCES dtic.usuarios_asignados(id) ON DELETE CASCADE;


--
-- Name: recurso_historial recurso_historial_recurso_id_fkey; Type: FK CONSTRAINT; Schema: dtic; Owner: dtic_user
--

ALTER TABLE ONLY dtic.recurso_historial
    ADD CONSTRAINT recurso_historial_recurso_id_fkey FOREIGN KEY (recurso_id) REFERENCES dtic.recursos(id) ON DELETE CASCADE;


--
-- Name: recurso_historial recurso_historial_tecnico_id_fkey; Type: FK CONSTRAINT; Schema: dtic; Owner: dtic_user
--

ALTER TABLE ONLY dtic.recurso_historial
    ADD CONSTRAINT recurso_historial_tecnico_id_fkey FOREIGN KEY (tecnico_id) REFERENCES dtic.tecnicos(id);


--
-- Name: recurso_historial recurso_historial_usuario_id_fkey; Type: FK CONSTRAINT; Schema: dtic; Owner: dtic_user
--

ALTER TABLE ONLY dtic.recurso_historial
    ADD CONSTRAINT recurso_historial_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES dtic.usuarios_asignados(id);


--
-- Name: tarea_recursos tarea_recursos_assigned_by_fkey; Type: FK CONSTRAINT; Schema: dtic; Owner: dtic_user
--

ALTER TABLE ONLY dtic.tarea_recursos
    ADD CONSTRAINT tarea_recursos_assigned_by_fkey FOREIGN KEY (assigned_by) REFERENCES dtic.tecnicos(id);


--
-- Name: tarea_recursos tarea_recursos_recurso_id_fkey; Type: FK CONSTRAINT; Schema: dtic; Owner: dtic_user
--

ALTER TABLE ONLY dtic.tarea_recursos
    ADD CONSTRAINT tarea_recursos_recurso_id_fkey FOREIGN KEY (recurso_id) REFERENCES dtic.recursos(id) ON DELETE CASCADE;


--
-- Name: tarea_recursos tarea_recursos_tarea_id_fkey; Type: FK CONSTRAINT; Schema: dtic; Owner: dtic_user
--

ALTER TABLE ONLY dtic.tarea_recursos
    ADD CONSTRAINT tarea_recursos_tarea_id_fkey FOREIGN KEY (tarea_id) REFERENCES dtic.tareas(id) ON DELETE CASCADE;


--
-- Name: tarea_recursos tarea_recursos_unassigned_by_fkey; Type: FK CONSTRAINT; Schema: dtic; Owner: dtic_user
--

ALTER TABLE ONLY dtic.tarea_recursos
    ADD CONSTRAINT tarea_recursos_unassigned_by_fkey FOREIGN KEY (unassigned_by) REFERENCES dtic.tecnicos(id);


--
-- Name: tareas tareas_technician_id_fkey; Type: FK CONSTRAINT; Schema: dtic; Owner: dtic_user
--

ALTER TABLE ONLY dtic.tareas
    ADD CONSTRAINT tareas_technician_id_fkey FOREIGN KEY (technician_id) REFERENCES dtic.tecnicos(id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict mwWeJTW8qPMoUWB0VLtUsd5yEbJ73wgH71Ht201UffXdcIeREChrEriHSEQsGt0

