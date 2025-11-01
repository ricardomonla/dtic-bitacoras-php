#!/bin/bash

# Script de instalación y despliegue para DTIC Bitácoras
# Versión: 2.0 - Simplificada
# Fecha: 2025-11-01

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Funciones de utilidad
log() { echo -e "${BLUE}[INFO]${NC} $1"; }
success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; }
warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }

# Detectar Docker Compose
if docker compose version >/dev/null 2>&1; then
    DC="docker compose"
else
    DC="docker-compose"
fi

# Función principal de despliegue
deploy() {
    local build=$1

    log "Iniciando despliegue..."

    # Verificar puertos
    if lsof -Pi :5432 -sTCP:LISTEN -t >/dev/null 2>&1 || \
       lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null 2>&1 || \
       lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null 2>&1; then
        warning "Algunos puertos están en uso. Verificando si son de esta aplicación..."
        if $DC ps | grep -q "dtic_bitacoras"; then
            log "Continuando - puertos usados por esta aplicación"
        else
            error "Puertos ocupados por otras aplicaciones"
            exit 1
        fi
    fi

    # Desplegar
    $DC down 2>/dev/null || true

    if [ "$build" = "build" ]; then
        log "Construyendo imágenes..."
        $DC up --build -d
    else
        $DC up -d
    fi

    # Verificar servicios
    log "Verificando servicios..."
    sleep 5

    # Verificar API
    local attempts=0
    while [ $attempts -lt 20 ]; do
        if $DC exec -T api wget -q -O - http://localhost:3001/health >/dev/null 2>&1; then
            success "API funcionando correctamente"
            break
        fi
        sleep 3
        ((attempts++))
    done

    if [ $attempts -eq 20 ]; then
        error "API no responde"
        exit 1
    fi

    success "Aplicación desplegada exitosamente!"
    echo ""
    echo "URLs de acceso:"
    echo "  Frontend: http://localhost:5173"
    echo "  API:      http://localhost:3001"
    echo "  DB:       localhost:5432"
}

# Función para detener
stop() {
    log "Deteniendo aplicación..."
    $DC down
    success "Aplicación detenida"
}

# Función para logs
logs() {
    log "Mostrando logs (Ctrl+C para salir)..."
    $DC logs -f
}

# Función para estado
status() {
    echo "Estado de contenedores:"
    echo "======================"
    $DC ps
}

# Función para limpiar
clean() {
    warning "Esto eliminará contenedores, redes y volúmenes. ¿Estás seguro? (y/N): "
    read -p "" -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        log "Limpiando contenedores y volúmenes..."
        $DC down -v --remove-orphans
        success "Contenedores y volúmenes eliminados"
    fi
}

# Función para backup
backup() {
    log "Creando backup de base de datos..."
    mkdir -p backups
    local timestamp=$(date +"%Y%m%d_%H%M%S")
    local backup_file="backups/db_backup_$timestamp.sql.gz"

    if $DC exec -T postgres pg_dump -U dtic_user dtic_bitacoras | gzip > "$backup_file"; then
        success "Backup creado: $backup_file"
        log "Tamaño: $(du -h "$backup_file" | cut -f1)"
    else
        error "Error al crear backup"
    fi
}

# Menú simplificado
show_menu() {
    echo ""
    echo "========================================"
    echo "   DTIC Bitácoras - Despliegue"
    echo "========================================"
    echo ""
    echo "Opciones:"
    echo "1) Desplegar con build"
    echo "2) Desplegar rápido"
    echo "3) Detener"
    echo "4) Logs"
    echo "5) Estado"
    echo "6) Limpiar"
    echo "7) Backup DB"
    echo "0) Salir"
    echo ""
}

# Loop principal
while true; do
    show_menu
    read -p "Opción: " choice

    case $choice in
        1) deploy "build" ;;
        2) deploy ;;
        3) stop ;;
        4) logs ;;
        5) status ;;
        6) clean ;;
        7) backup ;;
        0) log "¡Hasta luego!"; exit 0 ;;
        *) error "Opción inválida (0-7)" ;;
    esac

    echo ""
    read -p "Presiona Enter para continuar..."
done