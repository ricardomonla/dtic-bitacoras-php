# Makefile para DTIC Bitácoras
# Facilita las tareas comunes de desarrollo y despliegue

.PHONY: help setup install build up down restart logs clean backup restore status health-check

# Variables por defecto
DOCKER_COMPOSE := $(shell command -v docker-compose 2>/dev/null || echo "docker compose")
PROJECT_NAME := dtic-bitacoras

# Colores para output
RED := \033[0;31m
GREEN := \033[0;32m
YELLOW := \033[1;33m
BLUE := \033[0;34m
NC := \033[0m

# Función para imprimir con color
define print_status
	@echo -e "$(BLUE)[INFO]$(NC) $(1)"
endef

define print_success
	@echo -e "$(GREEN)[SUCCESS]$(NC) $(1)"
endef

define print_warning
	@echo -e "$(YELLOW)[WARNING]$(NC) $(1)"
endef

define print_error
	@echo -e "$(RED)[ERROR]$(NC) $(1)"
endef

# Target por defecto
help: ## Muestra esta ayuda
	@echo "DTIC Bitácoras - Comandos disponibles:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(BLUE)%-20s$(NC) %s\n", $$1, $$2}'

# Configuración inicial
setup: ## Configuración inicial del proyecto
	$(call print_status, "Ejecutando configuración inicial...")
	@chmod +x setup.sh
	@./setup.sh

install: ## Instala dependencias (alias de setup)
	$(MAKE) setup

# Construcción y despliegue
build: ## Construye las imágenes Docker
	$(call print_status, "Construyendo imágenes Docker...")
	@$(DOCKER_COMPOSE) build --no-cache
	$(call print_success, "Imágenes construidas exitosamente")

up: ## Inicia todos los servicios
	$(call print_status, "Iniciando servicios...")
	@$(DOCKER_COMPOSE) up -d
	$(call print_status, "Esperando a que los servicios estén listos...")
	@sleep 5
	$(MAKE) health-check
	$(call print_success, "Aplicación iniciada!")
	@echo ""
	@echo "URLs de acceso:"
	@echo "  Frontend: http://localhost:5173"
	@echo "  API:      http://localhost:3001"
	@echo "  DB:       localhost:5432"

start: ## Alias de up
	$(MAKE) up

down: ## Detiene todos los servicios
	$(call print_status, "Deteniendo servicios...")
	@$(DOCKER_COMPOSE) down
	$(call print_success, "Servicios detenidos")

stop: ## Alias de down
	$(MAKE) down

restart: ## Reinicia todos los servicios
	$(call print_status, "Reiniciando servicios...")
	@$(DOCKER_COMPOSE) restart
	$(MAKE) health-check
	$(call print_success, "Servicios reiniciados")

# Monitoreo y logs
logs: ## Muestra logs de todos los servicios
	@$(DOCKER_COMPOSE) logs -f

logs-api: ## Muestra logs solo del API
	@$(DOCKER_COMPOSE) logs -f api

logs-frontend: ## Muestra logs solo del frontend
	@$(DOCKER_COMPOSE) logs -f frontend

logs-db: ## Muestra logs solo de la base de datos
	@$(DOCKER_COMPOSE) logs -f postgres

status: ## Muestra estado de los contenedores
	@echo "Estado de los contenedores:"
	@echo "=========================="
	@$(DOCKER_COMPOSE) ps

health-check: ## Verifica el estado de los servicios
	$(call print_status, "Verificando estado de los servicios...")
	@$(DOCKER_COMPOSE) exec -T api wget -q -O - http://localhost:3001/health >/dev/null 2>&1 && \
		$(call print_success, "API: OK") || $(call print_error, "API: FAIL")
	@$(DOCKER_COMPOSE) exec -T postgres pg_isready -U dtic_user -d dtic_bitacoras >/dev/null 2>&1 && \
		$(call print_success, "Database: OK") || $(call print_error, "Database: FAIL")

# Limpieza
clean: ## Limpia contenedores, redes y volúmenes
	$(call print_warning, "Esto eliminará todos los datos. ¿Estás seguro? [y/N]")
	@read -p "" -n 1 -r; echo ""; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		$(call print_status, "Limpiando contenedores y volúmenes..."); \
		$(DOCKER_COMPOSE) down -v --remove-orphans; \
		docker system prune -f; \
		$(call print_success, "Limpieza completada"); \
	else \
		$(call print_status, "Operación cancelada"); \
	fi

clean-logs: ## Limpia archivos de log
	$(call print_status, "Limpiando logs...")
	@rm -rf logs/*.log
	$(call print_success, "Logs limpiados")

# Backup y restauración
backup: ## Crea backup de la base de datos
	$(call print_status, "Creando backup de la base de datos...")
	@mkdir -p backups
	@TIMESTAMP=$$(date +"%Y%m%d_%H%M%S"); \
	$(DOCKER_COMPOSE) exec -T postgres pg_dump -U dtic_user dtic_bitacoras | \
	gzip > backups/db_backup_$${TIMESTAMP}.sql.gz && \
	$(call print_success, "Backup creado: backups/db_backup_$${TIMESTAMP}.sql.gz") && \
	$(call print_status, "Tamaño: $$(du -h backups/db_backup_$${TIMESTAMP}.sql.gz | cut -f1)")

restore: ## Restaura backup de la base de datos
	$(call print_status, "Backups disponibles:")
	@ls -la backups/ 2>/dev/null || $(call print_warning, "No hay backups disponibles")
	@echo ""
	@read -p "Ingresa el nombre del archivo de backup (sin .sql.gz): " BACKUP_NAME; \
	if [ ! -f "backups/$${BACKUP_NAME}.sql.gz" ]; then \
		$(call print_error, "Archivo no encontrado: backups/$${BACKUP_NAME}.sql.gz"); \
		exit 1; \
	fi; \
	$(call print_warning, "Esto reemplazará la base de datos actual. ¿Estás seguro? [y/N]"); \
	read -p "" -n 1 -r; echo ""; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		$(call print_status, "Restaurando backup..."); \
		$(DOCKER_COMPOSE) down; \
		$(DOCKER_COMPOSE) up -d postgres; \
		sleep 10; \
		gunzip -c "backups/$${BACKUP_NAME}.sql.gz" | \
		$(DOCKER_COMPOSE) exec -T postgres psql -U dtic_user -d dtic_bitacoras && \
		$(DOCKER_COMPOSE) up -d && \
		$(call print_success, "Backup restaurado exitosamente"); \
	else \
		$(call print_status, "Operación cancelada"); \
	fi

# Desarrollo
dev-frontend: ## Ejecuta el frontend en modo desarrollo
	$(call print_status, "Iniciando frontend en modo desarrollo...")
	@cd frontend && npm run dev

dev-backend: ## Ejecuta el backend en modo desarrollo
	$(call print_status, "Iniciando backend en modo desarrollo...")
	@cd backend && npm run dev

dev-db: ## Accede a la base de datos
	$(call print_status, "Conectando a la base de datos...")
	@$(DOCKER_COMPOSE) exec postgres psql -U dtic_user -d dtic_bitacoras

# Testing
test: ## Ejecuta tests
	$(call print_status, "Ejecutando tests...")
	@cd backend && npm test
	@cd frontend && npm test

test-backend: ## Ejecuta tests del backend
	$(call print_status, "Ejecutando tests del backend...")
	@cd backend && npm test

test-frontend: ## Ejecuta tests del frontend
	$(call print_status, "Ejecutando tests del frontend...")
	@cd frontend && npm test

# Utilidades
shell-api: ## Accede al shell del contenedor API
	$(call print_status, "Accediendo al shell del API...")
	@$(DOCKER_COMPOSE) exec api sh

shell-frontend: ## Accede al shell del contenedor frontend
	$(call print_status, "Accediendo al shell del frontend...")
	@$(DOCKER_COMPOSE) exec frontend sh

shell-db: ## Accede al shell del contenedor de base de datos
	$(call print_status, "Accediendo al shell de PostgreSQL...")
	@$(DOCKER_COMPOSE) exec postgres bash

update: ## Actualiza las imágenes Docker
	$(call print_status, "Actualizando imágenes Docker...")
	@$(DOCKER_COMPOSE) pull
	$(call print_success, "Imágenes actualizadas")

# Información del proyecto
info: ## Muestra información del proyecto
	@echo "=== DTIC Bitácoras ==="
	@echo "Proyecto: $(PROJECT_NAME)"
	@echo "Docker Compose: $(DOCKER_COMPOSE)"
	@echo ""
	@echo "Contenedores:"
	@$(DOCKER_COMPOSE) ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"
	@echo ""
	@echo "Volúmenes:"
	@docker volume ls | grep $(PROJECT_NAME) || echo "No se encontraron volúmenes del proyecto"
	@echo ""
	@echo "Redes:"
	@docker network ls | grep $(PROJECT_NAME) || echo "No se encontraron redes del proyecto"