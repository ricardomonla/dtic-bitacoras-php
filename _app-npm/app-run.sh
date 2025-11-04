#!/bin/bash

# =============================================================================
# DTIC Bitácoras - Script Optimizado de Gestión de Aplicación
# =============================================================================
#
# Script optimizado para gestión completa de la aplicación DTIC Bitácoras
# Soporta modos interactivo y no interactivo con parámetros
#
# Características:
#   - Modo interactivo (sin parámetros) con menús inteligentes
#   - Modo no interactivo con parámetros: start, stop, restart, status
#   - Verificación robusta de dependencias (Docker, docker-compose)
#   - Validación completa de PostgreSQL y servicios
#   - Cleanup automático de recursos huérfanos
#   - Timeouts configurables vía variables de entorno
#
# Uso:
#   ./app-run.sh              # Modo interactivo
#   ./app-run.sh start        # Iniciar aplicación (no interactivo)
#   ./app-run.sh stop         # Detener aplicación (no interactivo)
#   ./app-run.sh restart      # Reiniciar aplicación (no interactivo)
#   ./app-run.sh status       # Mostrar estado detallado (no interactivo)
#
# Variables de entorno:
#   APP_TIMEOUT_CHECK=30      # Timeout para verificar servicios (segundos)
#   APP_MAX_ATTEMPTS=20       # Máximo número de intentos de verificación
#
# Versión: 2.0 - Optimizado
# Fecha: 2025-11-04
# =============================================================================

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuración
API_PORT=3001
FRONTEND_PORT=5173
DB_PORT=5432
API_URL="http://localhost:$API_PORT"
FRONTEND_URL="http://localhost:$FRONTEND_PORT"
DB_URL="localhost:$DB_PORT"

# Configuración de timeouts (configurables vía entorno)
TIMEOUT_CHECK=${APP_TIMEOUT_CHECK:-30}
MAX_ATTEMPTS=${APP_MAX_ATTEMPTS:-20}

# Modo de operación
INTERACTIVE_MODE=true
COMMAND=""

# Funciones de utilidad
log() { echo -e "${BLUE}[INFO]${NC} $1"; }
success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; }
warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }

# Función para verificar dependencias
check_dependencies() {
    local missing_deps=()

    if ! command -v docker &> /dev/null; then
        missing_deps+=("docker")
    fi

    if ! command -v docker &> /dev/null || ! docker compose version &> /dev/null; then
        missing_deps+=("docker-compose")
    fi

    if [ ${#missing_deps[@]} -ne 0 ]; then
        error "Dependencias faltantes: ${missing_deps[*]}"
        error "Por favor instala las dependencias requeridas antes de continuar"
        return 1
    fi

    return 0
}

# Función para verificar si la aplicación está ejecutándose
check_app_running() {
    # Verificar contenedores Docker
    if docker compose ps 2>/dev/null | grep -q "dtic_bitacoras"; then
        return 0
    else
        return 1
    fi
}

# Función para verificar conectividad a PostgreSQL
check_db_connection() {
    if command -v psql &> /dev/null; then
        if PGPASSWORD=dtic_password psql -h localhost -p $DB_PORT -U dtic_user -d dtic_bitacoras -c "SELECT 1;" &> /dev/null; then
            return 0
        fi
    fi
    return 1
}

# Función para verificar si la API está accesible
check_api_accessible() {
    if curl -s --max-time 5 "$API_URL/health" >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Función para verificar si el frontend está accesible
check_frontend_accessible() {
    if curl -s --max-time 5 "$FRONTEND_URL" >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Función para mostrar estado actual
show_status() {
    echo ""
    echo "📊 Estado Actual de DTIC Bitácoras:"
    echo "=================================="

    if check_app_running; then
        echo -e "🐳 Contenedores: ${GREEN}✅ Ejecutándose${NC}"

        if check_api_accessible; then
            echo -e "🔧 API: ${GREEN}✅ Accesible${NC} (puerto $API_PORT)"
        else
            echo -e "🔧 API: ${RED}❌ No accesible${NC} (puerto $API_PORT)"
        fi

        if check_frontend_accessible; then
            echo -e "🌐 Frontend: ${GREEN}✅ Accesible${NC} (puerto $FRONTEND_PORT)"
        else
            echo -e "🌐 Frontend: ${RED}❌ No accesible${NC} (puerto $FRONTEND_PORT)"
        fi

        if check_db_connection; then
            echo -e "🗄️  Base de Datos: ${GREEN}✅ Conectada${NC} (puerto $DB_PORT)"
        else
            echo -e "🗄️  Base de Datos: ${RED}❌ No conectada${NC} (puerto $DB_PORT)"
        fi
    else
        echo -e "� Contenedores: ${RED}❌ Detenidos${NC}"
        echo -e "🔧 API: ${YELLOW}❓ No verificable${NC}"
        echo -e "🌐 Frontend: ${YELLOW}❓ No verificable${NC}"
        echo -e "🗄️  Base de Datos: ${YELLOW}❓ No verificable${NC}"
    fi
    echo ""
}

# Función para mostrar menú de opciones
show_menu() {
    echo "Opciones disponibles:"
    echo "==================="

    local option_num=1

    if check_app_running; then
        echo -e "${GREEN}${option_num})${NC} 🛑 Detener aplicación"
        ((option_num++))
        echo -e "${GREEN}${option_num})${NC} 🔄 Reiniciar aplicación"
        ((option_num++))
    else
        echo -e "${GREEN}${option_num})${NC} ▶️  Iniciar aplicación"
        ((option_num++))
    fi

    echo -e "${BLUE}${option_num})${NC} 📊 Ver estado detallado"
    ((option_num++))
    echo -e "${BLUE}${option_num})${NC} 🚪 Salir"
    echo ""
}

# Función para iniciar aplicación
start_app() {
    log "🚀 Iniciando aplicación DTIC Bitácoras..."

    if check_app_running; then
        warning "La aplicación ya está ejecutándose"
        return 0
    fi

    # Cleanup automático antes de iniciar
    cleanup_resources

    if docker compose up --build -d; then
        success "Aplicación iniciada"

        # Esperar a que esté lista
        log "⏳ Esperando que los servicios estén listos..."
        sleep 5

        local attempts=0
        while [ $attempts -lt $MAX_ATTEMPTS ]; do
            if check_api_accessible && check_frontend_accessible && check_db_connection; then
                success "✅ Todos los servicios están listos"
                if [ "$INTERACTIVE_MODE" = false ]; then
                    show_access_urls
                fi
                break
            fi
            sleep 3
            ((attempts++))
        done

        if [ $attempts -eq $MAX_ATTEMPTS ]; then
            warning "⚠️  Algunos servicios pueden no estar completamente listos aún"
        fi
    else
        error "❌ Fallo al iniciar la aplicación"
        return 1
    fi
}

# Función para detener aplicación
stop_app() {
    log "🛑 Deteniendo aplicación DTIC Bitácoras..."

    if ! check_app_running; then
        warning "La aplicación no está ejecutándose"
        return 0
    fi

    if docker compose down; then
        success "Aplicación detenida"
        # Cleanup automático después de detener
        cleanup_resources
    else
        error "❌ Fallo al detener la aplicación"
        return 1
    fi
}

# Función para cleanup de recursos
cleanup_resources() {
    log "🧹 Realizando limpieza automática de recursos..."

    # Limpiar contenedores detenidos
    if docker container prune -f >/dev/null 2>&1; then
        log "Contenedores huérfanos limpiados"
    fi

    # Limpiar imágenes no utilizadas (opcional, solo si hay muchas)
    # docker image prune -f >/dev/null 2>&1

    # Limpiar volúmenes huérfanos (con cuidado)
    if docker volume prune -f >/dev/null 2>&1; then
        log "Volúmenes huérfanos limpiados"
    fi
}

# Función para reiniciar aplicación
restart_app() {
    log "🔄 Reiniciando aplicación DTIC Bitácoras..."

    if ! check_app_running; then
        warning "La aplicación no está ejecutándose. Iniciándola..."
        start_app
        return $?
    fi

    if docker compose restart; then
        success "Aplicación reiniciada"

        # Verificar que esté funcionando después del reinicio
        sleep 3
        if check_api_accessible && check_frontend_accessible; then
            success "✅ Servicios verificados después del reinicio"
        else
            warning "⚠️  Algunos servicios pueden tardar en estar listos"
        fi
    else
        error "❌ Fallo al reiniciar la aplicación"
        return 1
    fi
}

# Función para mostrar estado detallado
show_detailed_status() {
    echo ""
    echo "📊 Estado Detallado del Sistema:"
    echo "==============================="

    echo "🐳 Contenedores Docker:"
    docker compose ps
    echo ""

    if check_app_running; then
        echo "🔧 API Health Check:"
        if check_api_accessible; then
            curl -s "$API_URL/health" | jq . 2>/dev/null || curl -s "$API_URL/health"
        else
            echo -e "${RED}❌ API no accesible${NC}"
        fi
        echo ""

        echo "🌐 Frontend Status:"
        if check_frontend_accessible; then
            echo -e "${GREEN}✅ Frontend accesible${NC}"
        else
            echo -e "${RED}❌ Frontend no accesible${NC}"
        fi
        echo ""

        echo "🗄️ Base de Datos:"
        if check_db_connection; then
            echo -e "${GREEN}✅ Conexión exitosa a PostgreSQL${NC}"
            # Mostrar información básica de la BD
            if command -v psql &> /dev/null; then
                echo "Tablas en la base de datos:"
                PGPASSWORD=dtic_password psql -h localhost -p $DB_PORT -U dtic_user -d dtic_bitacoras -c "\dt" 2>/dev/null | head -10
            fi
        else
            echo -e "${RED}❌ No se puede conectar a PostgreSQL${NC}"
        fi
        echo ""
    fi
}

# Función para mostrar URLs de acceso
show_access_urls() {
    echo ""
    echo "🌐 URLs de Acceso:"
    echo "================="

    if check_api_accessible; then
        echo -e "🔧 API: ${GREEN}$API_URL${NC}"
        echo -e "   Health Check: ${GREEN}$API_URL/health${NC}"
    else
        echo -e "🔧 API: ${RED}$API_URL${NC} (no accesible)"
    fi

    if check_frontend_accessible; then
        echo -e "🌐 Frontend: ${GREEN}$FRONTEND_URL${NC}"
    else
        echo -e "🌐 Frontend: ${RED}$FRONTEND_URL${NC} (no accesible)"
    fi

    echo ""
    echo -e "${BLUE}💡 Para acceder a la aplicación, use la URL del Frontend en su navegador${NC}"
}

# Función para procesar parámetros de línea de comandos
parse_command() {
    case "$1" in
        start)
            INTERACTIVE_MODE=false
            COMMAND="start"
            ;;
        stop)
            INTERACTIVE_MODE=false
            COMMAND="stop"
            ;;
        restart)
            INTERACTIVE_MODE=false
            COMMAND="restart"
            ;;
        status)
            INTERACTIVE_MODE=false
            COMMAND="status"
            ;;
        *)
            INTERACTIVE_MODE=true
            ;;
    esac
}

# Función principal
main() {
    # Procesar parámetros de línea de comandos
    parse_command "$1"

    if [ "$INTERACTIVE_MODE" = false ]; then
        # Modo no interactivo
        case "$COMMAND" in
            start)
                check_dependencies || exit 1
                start_app
                ;;
            stop)
                check_dependencies || exit 1
                stop_app
                ;;
            restart)
                check_dependencies || exit 1
                restart_app
                ;;
            status)
                check_dependencies || exit 1
                show_status
                show_access_urls
                ;;
        esac
    else
        # Modo interactivo (comportamiento original)
        echo ""
        echo "🚀 DTIC Bitácoras - Gestor Inteligente"
        echo "====================================="
        echo ""

        # Mostrar estado inicial
        show_status

        # Bucle principal
        while true; do
            show_menu

            # Determinar rango de opciones válido
            local max_option
            if check_app_running; then
                max_option=4  # 1:detener, 2:reiniciar, 3:estado, 4:salir
                read -p "Seleccione una opción (1-4): " choice
            else
                max_option=3  # 1:iniciar, 2:estado, 3:salir
                read -p "Seleccione una opción (1-3): " choice
            fi

            case $choice in
                1)
                    if check_app_running; then
                        stop_app
                    else
                        start_app
                    fi
                    echo ""
                    read -p "Presione Enter para continuar..."
                    ;;
                2)
                    if check_app_running; then
                        restart_app
                    else
                        show_detailed_status
                    fi
                    echo ""
                    read -p "Presione Enter para continuar..."
                    ;;
                3)
                    if check_app_running; then
                        show_detailed_status
                    else
                        echo ""
                        log "¡Hasta luego!"
                        break
                    fi
                    echo ""
                    read -p "Presione Enter para continuar..."
                    ;;
                4)
                    if check_app_running; then
                        echo ""
                        log "¡Hasta luego!"
                        break
                    else
                        error "Opción inválida."
                        sleep 2
                    fi
                    ;;
                *)
                    error "Opción inválida."
                    sleep 2
                    ;;
            esac

            # Mostrar estado actualizado y URLs después de cada acción
            show_status
            show_access_urls
        done
    fi
}

# Verificar dependencias antes de continuar
check_dependencies || exit 1

# Verificar que estamos en el directorio correcto
if [ ! -f "docker-compose.yml" ]; then
    error "No se encuentra docker-compose.yml. Asegúrese de ejecutar este script desde el directorio _app-npm"
    exit 1
fi

# Ejecutar función principal con parámetros
main "$@"