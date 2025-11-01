-- SQLite schema converted from MySQL dump
-- DTIC Bitácoras - Sistema de gestión de recursos y tareas

CREATE TABLE IF NOT EXISTS sesiones (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT,
  user_id INTEGER,
  user_type TEXT DEFAULT 'technician',
  user_agent TEXT,
  ip_address TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  last_activity TEXT DEFAULT CURRENT_TIMESTAMP,
  remember_token TEXT,
  remember_expires TEXT
);

CREATE TABLE IF NOT EXISTS tareas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  dtic_id TEXT,
  technician_id INTEGER,
  title TEXT,
  description TEXT,
  status TEXT DEFAULT 'pending',
  priority TEXT DEFAULT 'medium',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  due_date TEXT,
  completed_at TEXT
);

CREATE TABLE IF NOT EXISTS tecnicos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  dtic_id TEXT,
  email TEXT,
  nombre TEXT,
  apellido TEXT,
  password_hash TEXT,
  role TEXT DEFAULT 'technician',
  activo INTEGER DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  first_name TEXT,
  last_name TEXT,
  department TEXT,
  is_active INTEGER DEFAULT 1,
  phone TEXT
);