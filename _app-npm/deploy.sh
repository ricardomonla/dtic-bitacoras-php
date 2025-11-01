#!/bin/bash

# Script de despliegue para DTIC Bitácoras
# Versión: 1.0
# Fecha: 2025-11-01

set -e  # Salir en caso de error

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir con color
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Función para verificar si un comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Verificar Docker
if ! command_exists docker; then
    print_error "Docker no está instalado. Por favor instala Docker primero."
    exit 1
fi

# Verificar Docker Compose (nueva sintaxis)
if docker compose version >/dev/null 2>&1; then
    DOCKER_COMPOSE_CMD="docker compose"
elif command_exists docker-compose; then
    DOCKER_COMPOSE_CMD="docker-compose"
else
    print_error "Docker Compose no está instalado. Por favor instala Docker Compose primero."
    exit 1
fi

print_status "Usando comando Docker Compose: $DOCKER_COMPOSE_CMD"

# Función para verificar puerto
check_port() {
    local port=$1
    local service=$2
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        print_warning "Puerto $port ($service) está en uso"
        return 1
    else
        print_success "Puerto $port ($service) está disponible"
        return 0
    fi
}

# Verificar puertos antes de desplegar
print_status "Verificando disponibilidad de puertos..."
PORTS_AVAILABLE=true

check_port 5432 "PostgreSQL" || PORTS_AVAILABLE=false
check_port 3001 "API Backend" || PORTS_AVAILABLE=false
check_port 5173 "Frontend" || PORTS_AVAILABLE=false

if [ "$PORTS_AVAILABLE" = false ]; then
    print_warning "Algunos puertos están ocupados. Verificando si son de esta aplicación..."
    if $DOCKER_COMPOSE_CMD ps | grep -q "dtic_bitacoras"; then
        print_status "Los puertos están siendo usados por esta aplicación. Continuando con el despliegue..."
    else
        print_error "Puertos ocupados por otras aplicaciones. Deteniendo despliegue."
        print_status "Puedes cambiar los puertos en docker-compose.yml o liberar los puertos existentes."
        exit 1
    fi
fi

# Función para esperar a que un servicio esté listo
wait_for_service() {
    local service=$1
    local port=$2
    local max_attempts=30
    local attempt=1

    print_status "Esperando a que $service esté listo en puerto $port..."

    while [ $attempt -le $max_attempts ]; do
        if $DOCKER_COMPOSE_CMD exec -T $service echo "Service is ready" >/dev/null 2>&1; then
            print_success "$service está listo"
            return 0
        fi

        print_status "Intento $attempt/$max_attempts - $service no está listo aún..."
        sleep 2
        ((attempt++))
    done

    print_error "$service no pudo iniciarse después de $max_attempts intentos"
    return 1
}

# Función para verificar conectividad de la API
check_api_health() {
    local max_attempts=20
    local attempt=1

    print_status "Verificando conectividad de la API..."

    while [ $attempt -le $max_attempts ]; do
        if $DOCKER_COMPOSE_CMD exec -T api wget -q -O - http://localhost:3001/health >/dev/null 2>&1; then
            print_success "API está respondiendo correctamente"
            return 0
        fi

        print_status "Intento $attempt/$max_attempts - API no responde aún..."
        sleep 3
        ((attempt++))
    done

    print_error "API no responde después de $max_attempts intentos"
    return 1
}

# Menú de opciones
show_menu() {
    echo ""
    echo "========================================"
    echo "   DTIC Bitácoras - Script de Despliegue"
    echo "========================================"
    echo ""
    echo "Selecciona una opción:"
    echo "1) Desplegar aplicación completa (con build)"
    echo "2) Desplegar aplicación (sin build)"
    echo "3) Detener aplicación"
    echo "4) Reiniciar aplicación"
    echo "5) Ver logs"
    echo "6) Ver estado de contenedores"
    echo "7) Limpiar contenedores y volúmenes"
    echo "8) Backup de base de datos"
    echo "9) Restaurar backup de base de datos"
    echo "0) Salir"
    echo ""
}

# Función para backup de base de datos
backup_database() {
    print_status "Creando backup de la base de datos..."

    local timestamp=$(date +"%Y%m%d_%H%M%S")
    local backup_file="backups/db_backup_$timestamp.sql.gz"

    mkdir -p backups

    if $DOCKER_COMPOSE_CMD exec -T postgres pg_dump -U dtic_user dtic_bitacoras | gzip > "$backup_file"; then
        print_success "Backup creado: $backup_file"
        print_status "Tamaño del backup: $(du -h "$backup_file" | cut -f1)"
    else
        print_error "Error al crear el backup"
        return 1
    fi
}

# Función para restaurar backup
restore_database() {
    print_status "Archivos de backup disponibles:"
    ls -la backups/ 2>/dev/null || print_warning "No hay backups disponibles"

    echo ""
    read -p "Ingresa el nombre del archivo de backup (sin extensión .sql.gz): " backup_name

    if [ ! -f "backups/${backup_name}.sql.gz" ]; then
        print_error "Archivo de backup no encontrado: backups/${backup_name}.sql.gz"
        return 1
    fi

    print_warning "⚠️  Esto reemplazará la base de datos actual. ¿Estás seguro? (y/N): "
    read -p "" -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_status "Operación cancelada"
        return 0
    fi

    print_status "Restaurando backup..."

    # Detener la aplicación primero
    $DOCKER_COMPOSE_CMD down

    # Recrear la base de datos
    $DOCKER_COMPOSE_CMD up -d postgres

    # Esperar a que PostgreSQL esté listo
    sleep 10

    # Restaurar el backup
    if gunzip -c "backups/${backup_name}.sql.gz" | $DOCKER_COMPOSE_CMD exec -T postgres psql -U dtic_user -d dtic_bitacoras; then
        print_success "Backup restaurado exitosamente"

        # Reiniciar la aplicación completa
        $DOCKER_COMPOSE_CMD up -d
        wait_for_service "postgres" "5432"
        check_api_health
    else
        print_error "Error al restaurar el backup"
        return 1
    fi
}

# Loop principal del menú
while true; do
    show_menu
    read -p "Opción: " choice

    case $choice in
        1)
            print_status "Desplegando aplicación completa con build..."
            $DOCKER_COMPOSE_CMD down 2>/dev/null || true
            $DOCKER_COMPOSE_CMD up --build -d

            print_status "Esperando a que los servicios estén listos..."
            wait_for_service "postgres" "5432"
            wait_for_service "api" "3001"
            check_api_health

            print_success "Aplicación desplegada exitosamente!"
            print_status "URLs de acceso:"
            print_status "  Frontend: http://localhost:5173"
            print_status "  API: http://localhost:3001"
            print_status "  Base de datos: localhost:5432"
            ;;
        2)
            print_status "Desplegando aplicación..."
            $DOCKER_COMPOSE_CMD up -d

            print_status "Verificando servicios..."
            check_api_health

            print_success "Aplicación desplegada!"
            ;;
        3)
            print_status "Deteniendo aplicación..."
            $DOCKER_COMPOSE_CMD down
            print_success "Aplicación detenida"
            ;;
        4)
            print_status "Reiniciando aplicación..."
            $DOCKER_COMPOSE_CMD restart
            check_api_health
            print_success "Aplicación reiniciada"
            ;;
        5)
            print_status "Mostrando logs (Ctrl+C para salir)..."
            $DOCKER_COMPOSE_CMD logs -f
            ;;
        6)
            print_status "Estado de los contenedores:"
            $DOCKER_COMPOSE_CMD ps
            ;;
        7)
            print_warning "Esto eliminará contenedores, redes y volúmenes. ¿Estás seguro? (y/N): "
            read -p "" -n 1 -r
            echo ""
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                print_status "Limpiando contenedores y volúmenes..."
                $DOCKER_COMPOSE_CMD down -v --remove-orphans
                print_success "Contenedores y volúmenes eliminados"
            else
                print_status "Operación cancelada"
            fi
            ;;
        8)
            backup_database
            ;;
        9)
            restore_database
            ;;
        0)
            print_status "¡Hasta luego!"
            exit 0
            ;;
        *)
            print_error "Opción inválida. Por favor selecciona una opción del 0 al 9."
            ;;
    esac

    echo ""
    read -p "Presiona Enter para continuar..."
done