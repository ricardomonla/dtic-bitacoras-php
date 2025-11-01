-- Esquema de base de datos para DTIC Bitácoras
-- Sistema de gestión de recursos y tareas del DTIC - UTN La Rioja

-- Configuración inicial
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "-03:00";

-- Base de datos
CREATE DATABASE IF NOT EXISTS `dtic_bitacoras_php` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `dtic_bitacoras_php`;

-- ============================================================
-- TABLA: categories (Categorías)
-- ============================================================
CREATE TABLE `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  `type` enum('resource','task') NOT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `parent_id` (`parent_id`),
  KEY `type_active` (`type`,`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLA: tecnicos (Técnicos del DTIC)
-- ============================================================
CREATE TABLE `tecnicos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dtic_id` varchar(20) NOT NULL COMMENT 'ID único del DTIC (ej: TEC-001)',
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20),
  `department` varchar(100) NOT NULL,
  `role` enum('admin','technician','viewer') NOT NULL DEFAULT 'technician',
  `password_hash` varchar(255) NOT NULL COMMENT 'Hash de la contraseña',
  `profile_image` varchar(255) DEFAULT NULL COMMENT 'Ruta de la imagen de perfil',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `dtic_id` (`dtic_id`),
  UNIQUE KEY `email` (`email`),
  KEY `department` (`department`),
  KEY `role` (`role`),
  KEY `is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLA: users (Usuarios operativos)
-- ============================================================
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dtic_id` varchar(20) NOT NULL COMMENT 'ID único del DTIC (ej: USR-001)',
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20),
  `department` varchar(100) NOT NULL,
  `role` enum('operator','supervisor','analyst','guest') NOT NULL DEFAULT 'operator',
  `password_hash` varchar(255) NOT NULL COMMENT 'Hash de la contraseña',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `dtic_id` (`dtic_id`),
  UNIQUE KEY `email` (`email`),
  KEY `department` (`department`),
  KEY `role` (`role`),
  KEY `is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLA: resources (Recursos del DTIC)
-- ============================================================
CREATE TABLE `resources` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dtic_id` varchar(20) NOT NULL COMMENT 'ID único del DTIC (ej: RES-001, srvv-KOHA)',
  `name` varchar(100) NOT NULL,
  `category_id` int(11) NOT NULL,
  `status` enum('available','assigned','maintenance','retired') NOT NULL DEFAULT 'available',
  `location` varchar(100),
  `technical_specs` text COMMENT 'Especificaciones técnicas, modelo, serie, etc.',
  `assigned_to` int(11) DEFAULT NULL COMMENT 'ID del usuario asignado',
  `last_task_id` int(11) DEFAULT NULL COMMENT 'ID de la última tarea que lo utilizó',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `dtic_id` (`dtic_id`),
  KEY `category_id` (`category_id`),
  KEY `status` (`status`),
  KEY `assigned_to` (`assigned_to`),
  KEY `last_task_id` (`last_task_id`),
  CONSTRAINT `fk_resources_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_resources_user` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLA: tasks (Tareas del DTIC)
-- ============================================================
CREATE TABLE `tasks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dtic_id` varchar(20) NOT NULL COMMENT 'ID único del DTIC (ej: TSK-001)',
  `title` varchar(200) NOT NULL,
  `description` text NOT NULL,
  `category_id` int(11) NOT NULL,
  `status` enum('pending','in_progress','completed','cancelled') NOT NULL DEFAULT 'pending',
  `priority` enum('low','medium','high','urgent') NOT NULL DEFAULT 'medium',
  `technician_id` int(11) DEFAULT NULL COMMENT 'Técnico asignado',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `started_at` timestamp NULL DEFAULT NULL,
  `due_date` timestamp NULL DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `dtic_id` (`dtic_id`),
  KEY `category_id` (`category_id`),
  KEY `status` (`status`),
  KEY `priority` (`priority`),
  KEY `technician_id` (`technician_id`),
  KEY `due_date` (`due_date`),
  CONSTRAINT `fk_tasks_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_tasks_technician` FOREIGN KEY (`technician_id`) REFERENCES `tecnicos` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLA: task_resources (Relación muchos a muchos: tareas-recursos)
-- ============================================================
CREATE TABLE `task_resources` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `task_id` int(11) NOT NULL,
  `resource_id` int(11) NOT NULL,
  `assigned_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `notes` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_task_resource` (`task_id`,`resource_id`),
  KEY `task_id` (`task_id`),
  KEY `resource_id` (`resource_id`),
  CONSTRAINT `fk_task_resources_task` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_task_resources_resource` FOREIGN KEY (`resource_id`) REFERENCES `resources` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLA: audit_log (Historial de auditoría)
-- ============================================================
CREATE TABLE `audit_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL COMMENT 'ID del usuario que realizó la acción',
  `user_type` enum('technician','user','system') NOT NULL DEFAULT 'system',
  `action` enum('create','update','delete','view','login','logout') NOT NULL,
  `entity_type` enum('task','resource','technician','user','category') NOT NULL,
  `entity_id` int(11) NOT NULL,
  `old_values` json DEFAULT NULL,
  `new_values` json DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `user_type` (`user_type`),
  KEY `action` (`action`),
  KEY `entity_type` (`entity_type`),
  KEY `entity_id` (`entity_id`),
  KEY `created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLA: sessions (Sesiones de usuario)
-- ============================================================
CREATE TABLE `sessions` (
  `session_id` varchar(128) NOT NULL COMMENT 'ID único de la sesión',
  `user_id` int(11) NOT NULL,
  `user_type` enum('technician','user') NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text,
  `remember_token` varchar(64) DEFAULT NULL COMMENT 'Token hasheado para recordar sesión',
  `remember_expires` timestamp NULL DEFAULT NULL COMMENT 'Fecha de expiración del remember token',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_activity` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`session_id`),
  KEY `user_id` (`user_id`),
  KEY `user_type` (`user_type`),
  KEY `last_activity` (`last_activity`),
  KEY `remember_token` (`remember_token`),
  KEY `remember_expires` (`remember_expires`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- DATOS INICIALES
-- ============================================================

-- Categorías principales
INSERT INTO `categories` (`name`, `description`, `type`, `parent_id`, `is_active`) VALUES
-- Categorías de Recursos
('Hardware', 'Equipos físicos y hardware', 'resource', NULL, 1),
('Software', 'Aplicaciones y licencias de software', 'resource', NULL, 1),
('Redes', 'Equipos y servicios de red', 'resource', NULL, 1),
('Seguridad', 'Herramientas y servicios de seguridad', 'resource', NULL, 1),
('Herramientas', 'Equipos y herramientas de trabajo', 'resource', NULL, 1),
-- Subcategorías de Hardware
('Computadoras', 'Equipos de computo', 'resource', 1, 1),
('Servidores', 'Servidores físicos y virtuales', 'resource', 1, 1),
('Almacenamiento', 'Dispositivos de almacenamiento', 'resource', 1, 1),
-- Subcategorías de Software
('Sistemas Operativos', 'Sistemas operativos', 'resource', 2, 1),
('Aplicaciones', 'Software de aplicación', 'resource', 2, 1),
('Bases de Datos', 'Sistemas de gestión de BD', 'resource', 2, 1),
-- Categorías de Tareas
('Mantenimiento', 'Tareas de mantenimiento', 'task', NULL, 1),
('Soporte Técnico', 'Soporte a usuarios y sistemas', 'task', NULL, 1),
('Desarrollo', 'Desarrollo de software y sistemas', 'task', NULL, 1),
('Operaciones', 'Operaciones diarias', 'task', NULL, 1),
-- Subcategorías de Mantenimiento
('Preventivo', 'Mantenimiento preventivo', 'task', 12, 1),
('Correctivo', 'Mantenimiento correctivo', 'task', 12, 1),
('Actualizaciones', 'Actualizaciones de software/sistema', 'task', 12, 1);

-- Técnico administrador inicial
INSERT INTO `technicians` (`dtic_id`, `first_name`, `last_name`, `email`, `phone`, `department`, `role`, `password_hash`, `is_active`) VALUES
('TEC-001', 'Ricardo', 'Monla', 'rmonla@frlr.utn.edu.ar', '+5493871234567', 'Departamento Servidores y Sistemas de Altas Prestaciones', 'admin', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPjYLC7qK0Jy', 1);

-- Usuario operativo inicial
INSERT INTO `users` (`dtic_id`, `first_name`, `last_name`, `email`, `phone`, `department`, `role`, `password_hash`, `is_active`) VALUES
('USR-001', 'Usuario', 'Demo', 'usuario@frlr.utn.edu.ar', '+5493877654321', 'DTIC', 'operator', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPjYLC7qK0Jy', 1);

-- Recursos iniciales basados en el histórico
INSERT INTO `resources` (`dtic_id`, `name`, `category_id`, `status`, `location`, `technical_specs`) VALUES
('srvv-KOHA', 'Servidor Virtual KOHA', 8, 'available', 'Proxmox Cluster', 'VM Ubuntu 20.04, 4GB RAM, 100GB Storage, MariaDB'),
('srvv-SITIO2', 'Servidor Virtual SITIO2', 8, 'available', 'Proxmox Cluster', 'VM Ubuntu 20.04, Apache, WordPress'),
('srvv-DTIC', 'Servidor Virtual DTIC', 8, 'available', 'Proxmox Cluster', 'VM Ubuntu 20.04, Docker, Unifi Network'),
('dtic-BITACORAS', 'Sistema de Bitácoras DTIC', 10, 'available', 'GitHub/Docker', 'Aplicación web PHP/MySQL para gestión de bitácoras'),
('dtic-BACKUPs', 'Sistema de Respaldos Automáticos', 10, 'available', 'Servidor NAS', 'Scripts bash, rsync, cron jobs');

COMMIT;