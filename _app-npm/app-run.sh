#!/bin/bash

# =============================================================================
# DTIC Bitácoras - Script Inteligente de Ejecución de Aplicación
# =============================================================================
#
# Script inteligente para gestión de la aplicación DTIC Bitácoras
# Detecta automáticamente el estado y ofrece opciones apropiadas
#
# Características:
#   - Detección automática del estado de la aplicación
#   - Opciones contextuales basadas en el estado actual
#   - Verificación con curl para servicios web
#   - Mostrar URLs de acceso al final
#
# Uso:
#   ./app-run.sh
#
# Versión: 1.0 - Inteligente
# Fecha: 2025-11-01
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
API_URL="http://localhost:$API_PORT"
FRONTEND_URL="http://localhost:$FRONTEND_PORT"

# Funciones de utilidad
log() { echo -e "${BLUE}[INFO]${NC} $1"; }
success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; }
warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }

# Función para verificar si la aplicación está ejecutándose
check_app_running() {
    # Verificar contenedores Docker
    if docker compose ps 2>/dev/null | grep -q "dtic_bitacoras"; then
        return 0
    else
        return 1
    fi
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
    else
        echo -e "🐳 Contenedores: ${RED}❌ Detenidos${NC}"
        echo -e "🔧 API: ${YELLOW}❓ No verificable${NC}"
        echo -e "🌐 Frontend: ${YELLOW}❓ No verificable${NC}"
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

    if docker compose up --build -d; then
        success "Aplicación iniciada"

        # Esperar a que esté lista
        log "⏳ Esperando que los servicios estén listos..."
        sleep 5

        local attempts=0
        while [ $attempts -lt 20 ]; do
            if check_api_accessible && check_frontend_accessible; then
                success "✅ Todos los servicios están listos"
                break
            fi
            sleep 3
            ((attempts++))
        done

        if [ $attempts -eq 20 ]; then
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
    else
        error "❌ Fallo al detener la aplicación"
        return 1
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

# Función principal
main() {
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
}

# Verificar que estamos en el directorio correcto
if [ ! -f "docker-compose.yml" ]; then
    error "No se encuentra docker-compose.yml. Asegúrese de ejecutar este script desde el directorio _app-npm"
    exit 1
fi

# Ejecutar función principal
main