#!/bin/bash

# =============================================================================
# DTIC Bitácoras - Script Mejorado de Ejecución de Aplicación
# =============================================================================
#
# Script unificado para gestión de base de datos y operaciones de aplicación
# Incluye sistema de menú interactivo para gestión amigable
#
# Características Principales:
#   - Interfaz de menú interactivo
#   - Monitoreo del estado de la aplicación web
#   - Operaciones de respaldo y restauración de base de datos
#   - Gestión de contenedores Docker
#   - Logging y manejo de errores completo
#   - Mejores prácticas de seguridad con variables de entorno
#
# Uso:
#   ./app_run.sh menu          # Menú interactivo (recomendado)
#   ./app_run.sh <comando>     # Ejecución directa de comandos
#
# Diseñado para ejecutarse dentro del contenedor Docker (docker compose exec app)
# o directamente en el sistema host con acceso Docker apropiado
#
# Autor: Equipo de Desarrollo DTIC
# Versión: 2.0 - Mejorado con Menú Interactivo
# =============================================================================

# set -e  # Exit on any error - REMOVED to prevent menu exit on errors

# Configuración
# Usar variables de entorno para datos sensibles (con valores por defecto)
BACKUP_DIR="_www-app/database/backups"
CONTAINER_NAME="dtic-bitacoras"
APP_CONTAINER="dtic-bitacoras"
DB_TYPE="${DB_TYPE:-sqlite}"
DB_SQLITE_PATH="${DB_SQLITE_PATH:-_www-app/database/dtic_bitacoras.db}"
DB_HOST="${DB_HOST:-db}"
DB_NAME="${DB_NAME:-dtic_bitacoras_php}"
DB_USER="${DB_USER:-dtic_user}"
DB_PASS="${DB_PASS:-dtic_password}"
BACKUP_SCRIPT="/var/www/html/_www-app/backup.php"
RESTORE_SCRIPT="/var/www/html/_www-app/restore.php"
STATUS_SCRIPT="/var/www/html/_www-app/status.php"
APP_PORT="${APP_PORT:-8080}"
TEST_USER="${TEST_USER:-rmonla@frlr.utn.edu.ar}"
TEST_PASS="${TEST_PASS:-password}"

# Colores para salida
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
BOLD='\033[1m'
NC='\033[0m' # Sin Color

# Función para limpiar pantalla
clear_screen() {
    clear
}

# =============================================================================
# FUNCIONES AUXILIARES REUTILIZABLES
# =============================================================================

# Función auxiliar para mostrar encabezados de menú con formato consistente
# Parámetros: $1 = título del menú
show_menu_header() {
    local title="$1"
    clear_screen
    echo -e "${CYAN}${BOLD}"
    echo "╔══════════════════════════════════════════╗"
    printf "║ %-40s ║\n" "$title"
    echo "╚══════════════════════════════════════════╝"
    echo -e "${NC}"
    echo ""
}

# Función auxiliar para mostrar opciones de menú con colores consistentes
# Parámetros: $1 = número, $2 = texto, $3 = color (opcional, default GREEN)
show_menu_option() {
    local number="$1"
    local text="$2"
    local color="${3:-$GREEN}"
    echo -e "${color}${number})${NC} $text"
}

# Función auxiliar para mostrar separador de menú
show_menu_separator() {
    echo ""
}

# Función auxiliar para mostrar prompt de selección
# Parámetros: $1 = rango de opciones (ej: "0-4")
show_selection_prompt() {
    local range="$1"
    echo -e "${YELLOW}Seleccione una opción ($range):${NC} "
}

# Función auxiliar para mostrar mensaje de continuación
show_continue_prompt() {
    echo ""
    read -p "Presione Enter para continuar..."
}

# Función auxiliar para validar entrada de menú
# Parámetros: $1 = entrada del usuario, $2 = rango mínimo, $3 = rango máximo
# Retorna: 0 si válido, 1 si inválido
validate_menu_input() {
    local input="$1"
    local min="$2"
    local max="$3"

    # Verificar si es un número
    if ! [[ "$input" =~ ^[0-9]+$ ]]; then
        return 1
    fi

    # Verificar si está en rango
    if [ "$input" -ge "$min" ] && [ "$input" -le "$max" ]; then
        return 0
    else
        return 1
    fi
}

# Función auxiliar para manejar errores de menú de forma consistente
# Parámetros: $1 = mensaje de error, $2 = tiempo de pausa (opcional, default 2)
show_menu_error() {
    local message="$1"
    local pause_time="${2:-2}"
    error "$message"
    sleep "$pause_time"
}

# Función auxiliar para verificar estado de contenedores (reutilizable)
# Retorna: true/false
is_containers_running() {
    check_containers_running >/dev/null 2>&1 && echo "true" || echo "false"
}

# Función auxiliar para ejecutar comandos Docker de forma segura
# Parámetros: $@ = comando docker a ejecutar
# Retorna: código de salida del comando
run_docker_command() {
    if "$@"; then
        return 0
    else
        return 1
    fi
}

# Función auxiliar para mostrar lista de respaldos disponibles
# Retorna: array de archivos de respaldo ordenados por fecha (más reciente primero)
get_backup_files() {
    local backup_files=()
    if [ -d "$BACKUP_DIR" ]; then
        # Obtener archivos ordenados por fecha de modificación (más reciente primero)
        while IFS= read -r -d '' file; do
            backup_files+=("$file")
        done < <(find "$BACKUP_DIR" -name "db_backup_*.sql.gz" -type f -printf '%T@ %p\0' 2>/dev/null | sort -znr | cut -z -d' ' -f2-)
    fi
    echo "${backup_files[@]}"
}

# Función auxiliar para mostrar menú de selección de respaldo
# Parámetros: $1 = array de archivos de respaldo
show_backup_selection_menu() {
    local backup_files=("$@")
    local count=${#backup_files[@]}

    if [ $count -eq 0 ]; then
        echo ""
        echo -e "${RED}❌ No hay archivos de respaldo disponibles${NC}"
        echo ""
        return 1
    fi

    show_menu_header "💾 Seleccionar Archivo de Respaldo"
    echo -e "${WHITE}Archivos disponibles (ordenados por fecha - más reciente primero):${NC}"
    show_menu_separator

    local i=1
    for backup_file in "${backup_files[@]}"; do
        local filename=$(basename "$backup_file")
        local file_size=$(du -h "$backup_file" | cut -f1)
        local mod_date=$(date -r "$backup_file" '+%Y-%m-%d %H:%M:%S')

        echo -e "${GREEN}$i)${NC} 📁 $filename"
        echo -e "   📊 Tamaño: $file_size | 🕒 Fecha: $mod_date"
        ((i++))
    done

    show_menu_separator
    show_menu_option "0" "↩️  Cancelar y volver al menú anterior" "$BLUE"
    show_menu_separator
    show_selection_prompt "0-$count"

    return 0
}

# Función auxiliar para obtener confirmación del usuario
# Parámetros: $1 = mensaje de confirmación
# Retorna: 0 = sí, 1 = no/cancelar
get_user_confirmation() {
    local message="$1"
    local choice

    echo ""
    echo -e "${YELLOW}⚠️  $message${NC}"
    echo ""
    echo -e "${GREEN}s)${NC} ✅ Sí, proceder"
    echo -e "${RED}n)${NC} ❌ No, cancelar"
    echo ""
    echo -n "Seleccione (s/n): "

    read -r choice
    case "$choice" in
        [Ss]|[Ss][Ii])
            return 0
            ;;
        [Nn]|[Nn][Oo])
            echo -e "${BLUE}ℹ️  Operación cancelada por el usuario${NC}"
            return 1
            ;;
        *)
            echo -e "${RED}❌ Selección inválida. Operación cancelada.${NC}"
            return 1
            ;;
    esac
}

# =============================================================================
# FUNCIONES DE LOGGING
# =============================================================================

# Función de logging estándar con marca de tiempo
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

# Función de logging de errores (salida a stderr)
error() {
    echo -e "${RED}[ERROR] $1${NC}" >&2
}

# Función de logging de éxito
success() {
    echo -e "${GREEN}[ÉXITO] $1${NC}"
}

# Función de logging de advertencias
warning() {
    echo -e "${YELLOW}[ADVERTENCIA] $1${NC}"
}

# Función de logging de información para acciones del menú
info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

# =============================================================================
# FUNCIONES DE BASE DE DATOS
# =============================================================================

# Función para verificar si la base de datos es accesible
# Retorna: 0 en éxito, 1 en fallo
check_db_connection() {
    if [ "$DB_TYPE" = "sqlite" ]; then
        if [ -f "$DB_SQLITE_PATH" ] && sqlite3 "$DB_SQLITE_PATH" "SELECT 1;" >/dev/null 2>&1; then
            return 0
        else
            return 1
        fi
    else
        if docker compose exec -T db mysql -u "$DB_USER" -p"$DB_PASS" -e "SELECT 1;" "$DB_NAME" >/dev/null 2>&1; then
            return 0
        else
            return 1
        fi
    fi
}

# Función para crear respaldo de base de datos (simplificada)
create_backup() {
    local timestamp=$(date +"%Y%m%d_%H%M%S")
    local backup_file="$BACKUP_DIR/db_backup_${timestamp}.sql.gz"

    log "Creando respaldo de base de datos..."
    mkdir -p "$BACKUP_DIR"

    if docker exec -i "$APP_CONTAINER" php "$BACKUP_SCRIPT" | gzip > "$backup_file" && gzip -t "$backup_file"; then
        local backup_size=$(du -h "$backup_file" | cut -f1)
        success "Respaldo creado: $backup_file ($backup_size)"
        return 0
    else
        error "Fallo al crear respaldo"
        rm -f "$backup_file"
        return 1
    fi
}

# Función para restaurar base de datos desde respaldo (simplificada)
restore_backup() {
    local backup_file="$1"

    if [ -z "$backup_file" ] || [ ! -f "$backup_file" ] || ! gzip -t "$backup_file"; then
        error "Archivo de respaldo inválido o no encontrado"
        return 1
    fi

    log "Restaurando base de datos desde $backup_file..."
    warning "⚠️  ADVERTENCIA: Esto reemplazará la base de datos actual!"

    if gunzip -c "$backup_file" | docker exec -i "$APP_CONTAINER" php "$RESTORE_SCRIPT"; then
        success "Restauración completada"
        return 0
    else
        error "Restauración fallida"
        return 1
    fi
}

# Función para mostrar estado de base de datos (eliminada - duplicada)

# Función para mostrar estado de base de datos
show_db_status() {
    if check_db_connection; then
        if [ "$DB_TYPE" = "sqlite" ]; then
            local tables=$(sqlite3 "$DB_SQLITE_PATH" "SELECT COUNT(*) FROM sqlite_master WHERE type='table';" 2>/dev/null)
            local users=$(sqlite3 "$DB_SQLITE_PATH" "SELECT COUNT(*) FROM tecnicos;" 2>/dev/null)
            local sessions=$(sqlite3 "$DB_SQLITE_PATH" "SELECT COUNT(*) FROM sesiones;" 2>/dev/null)
            local db_size=$(du -h "$DB_SQLITE_PATH" | cut -f1)

            echo ""
            echo "📊 Estado de Base de Datos SQLite:"
            echo "   🏗️  Base de Datos: $DB_SQLITE_PATH"
            echo "   📏 Tamaño: $db_size"
            echo "   📋 Tablas: ${tables:-0}"
            echo "   👥 Usuarios: ${users:-0}"
            echo "   🔐 Sesiones: ${sessions:-0}"
        else
            local tables=$(docker compose exec -T db mysql -u "$DB_USER" -p"$DB_PASS" -e "USE $DB_NAME; SHOW TABLES;" 2>/dev/null | wc -l)
            local tables_count=$((tables - 1))
            local users=$(docker compose exec -T db mysql -u "$DB_USER" -p"$DB_PASS" -e "USE $DB_NAME; SELECT COUNT(*) as count FROM tecnicos;" 2>/dev/null | tail -n1)
            local sessions=$(docker compose exec -T db mysql -u "$DB_USER" -p"$DB_PASS" -e "USE $DB_NAME; SELECT COUNT(*) as count FROM sesiones;" 2>/dev/null | tail -n1)

            echo ""
            echo "📊 Estado de Base de Datos MySQL:"
            echo "   🏗️  Base de Datos: $DB_NAME"
            echo "   📋 Tablas: $tables_count"
            echo "   👥 Usuarios: ${users:-0}"
            echo "   🔐 Sesiones: ${sessions:-0}"
        fi

        if [ -d "$BACKUP_DIR" ]; then
            local backup_count=$(ls -1 "$BACKUP_DIR"/db_backup_*.sql.gz 2>/dev/null | wc -l)
            [ "$backup_count" -gt 0 ] && echo "   💾 Respaldos: $backup_count disponibles"
        fi
        echo ""
    else
        echo ""
        echo -e "${RED}❌ Base de datos no accesible${NC}"
        echo ""
    fi
}

# Función para listar respaldos (simplificada)
list_backups() {
    log "Listando respaldos disponibles..."

    if [ -d "$BACKUP_DIR" ]; then
        local count=$(ls -1 "$BACKUP_DIR"/db_backup_*.sql.gz 2>/dev/null | wc -l)
        if [ "$count" -gt 0 ]; then
            echo ""
            echo "💾 Respaldos disponibles ($count encontrados):"
            ls -la "$BACKUP_DIR"/db_backup_*.sql.gz | tail -n 5
            echo ""
        else
            warning "No hay respaldos disponibles"
        fi
    else
        warning "Directorio de respaldos no existe"
    fi
}

# Función para verificar si los contenedores están ejecutándose
check_containers_running() {
    docker ps | grep -q "dtic-bitacoras"
}

# =============================================================================
# FUNCIONES DE APLICACIÓN
# =============================================================================

# Función para verificar estado de aplicación web
# Verifica estado de ejecución del contenedor, accesibilidad HTTP y endpoint de salud
# Retorna: 0 en éxito, 1 en fallo
check_app_status() {
    # Verificar si el contenedor de la app está ejecutándose
    if docker ps | grep -q "$APP_CONTAINER"; then
        local container_status="Ejecutándose"

        # Verificar si la app es accesible via HTTP
        if curl -s --max-time 5 "http://localhost:$APP_PORT" >/dev/null 2>&1; then
            local http_status="Accesible"
        else
            local http_status="No Accesible"
        fi

        # Verificar endpoint de salud si está disponible
        if docker exec "$APP_CONTAINER" php "$STATUS_SCRIPT" >/dev/null 2>&1; then
            local health_status="Saludable"
        else
            local health_status="No Saludable"
        fi

        echo ""
        echo "🌐 Estado de Aplicación:"
        echo "   🐳 Contenedor: $container_status"
        echo "   🌍 Acceso HTTP: $http_status (puerto $APP_PORT)"
        echo "   ❤️  Salud: $health_status"
        echo ""

        return 0
    else
        echo ""
        echo -e "${RED}❌ Contenedor de aplicación no está ejecutándose${NC}"
        echo ""
        return 1
    fi
}

# Función para iniciar aplicación (actualizada para host)
start_containers() {
    log "🚀 Iniciando aplicación web..."

    # Verificar si ya está ejecutándose
    if docker ps | grep -q "$APP_CONTAINER"; then
        warning "La aplicación ya está ejecutándose"
        return 0
    fi

    # Iniciar contenedor con configuración actualizada
    if docker run --rm -d -p "$APP_PORT:80" -v "$(pwd)/_www-app:/var/www/html" --name "$APP_CONTAINER" php:8.1-apache bash -c "a2enmod rewrite && apache2-foreground"; then
        success "Aplicación iniciada en puerto $APP_PORT"

        # Esperar a que esté listo
        local attempt=1
        while [ $attempt -le 10 ]; do
            if curl -s --max-time 5 "http://localhost:$APP_PORT" >/dev/null 2>&1; then
                success "Aplicación lista y accesible"
                return 0
            fi
            sleep 2
            ((attempt++))
        done

        warning "Aplicación iniciada pero no responde aún"
        return 0
    else
        error "Fallo al iniciar aplicación"
        return 1
    fi
}

# Función para detener aplicación
stop_containers() {
    log "🛑 Deteniendo aplicación..."

    if docker ps | grep -q "$APP_CONTAINER"; then
        if docker stop "$APP_CONTAINER"; then
            success "Aplicación detenida"
            return 0
        else
            error "Fallo al detener aplicación"
            return 1
        fi
    else
        warning "La aplicación no está ejecutándose"
        return 0
    fi
}

# Función para probar aplicación (login y funcionalidad)
test_app_functionality() {
    log "🧪 Probando funcionalidad de la aplicación..."

    # Verificar que la aplicación esté ejecutándose
    if ! docker ps | grep -q "$APP_CONTAINER"; then
        error "La aplicación no está ejecutándose"
        return 1
    fi

    # Esperar a que esté lista
    local attempt=1
    while [ $attempt -le 10 ]; do
        if curl -s --max-time 5 "http://localhost:$APP_PORT/pages/login.php" >/dev/null 2>&1; then
            break
        fi
        sleep 2
        ((attempt++))
    done

    if [ $attempt -gt 10 ]; then
        error "Aplicación no responde"
        return 1
    fi

    # Probar página de login
    if curl -s "http://localhost:$APP_PORT/pages/login.php" | grep -q "login\|Login"; then
        success "Página de login accesible"
    else
        error "Página de login no funciona correctamente"
        return 1
    fi

    # Probar API de login
    local login_response=$(curl -s -X POST "http://localhost:$APP_PORT/api/login.php" \
        -H "Content-Type: application/json" \
        -d "{\"username\":\"$TEST_USER\",\"password\":\"$TEST_PASS\"}")

    if echo "$login_response" | grep -q '"success":true'; then
        success "Login exitoso con usuario de prueba"
    else
        error "Login fallido"
        echo "Respuesta: $login_response"
        return 1
    fi

    success "Todas las pruebas pasaron exitosamente"
    return 0
}

# Función para mostrar información de uso (actualizada)
usage() {
    echo "DTIC Bitácoras - Script Mejorado v3.0 (Host + SQLite)"
    echo ""
    echo "Uso: $0 {menu|app-status|bd-status|docker-status|app-test}"
    echo ""
    echo "Comandos:"
    echo "  menu         - Menú interactivo de gestión"
    echo "  app-status   - Estado de la aplicación web"
    echo "  bd-status    - Estado de la base de datos SQLite"
    echo "  docker-status- Estado de los contenedores Docker"
    echo "  app-test     - Probar funcionalidad completa de la aplicación"
}

# =============================================================================
# FUNCIONES DE MENÚ
# =============================================================================

# Función para mostrar menú principal
show_main_menu() {
    show_menu_header "🏥 DTIC Bitácoras - Consola de Gestión"
    echo -e "${WHITE}Seleccione una opción del menú:${NC}"
    show_menu_separator
    show_menu_option "1" "🌐 Gestión de Aplicación Web"
    show_menu_option "2" "💾 Operaciones de Base de Datos"
    show_menu_option "3" "🐳 Control de Contenedores"
    show_menu_option "4" "📊 Estado del Sistema"
    show_menu_option "5" "❓ Ayuda e Información"
    show_menu_option "0" "🚪 Salir" "$RED"
    show_menu_separator
    show_selection_prompt "0-5"
}

# Función para mostrar submenú de gestión de aplicación
show_app_menu() {
    show_menu_header "🌐 Gestión de Aplicación Web"

    # Verificar estado actual para mostrar opciones relevantes
    local containers_up=$(is_containers_running)

    echo -e "${WHITE}Seleccione una acción:${NC}"
    show_menu_separator
    show_menu_option "1" "🔍 Verificar Estado de Aplicación"
    show_menu_option "5" "🧪 Probar Funcionalidad de Aplicación"

    if [ "$containers_up" = "true" ]; then
        show_menu_option "2" "🛑 ✅ Detener Aplicación"
        show_menu_option "3" "🔄 🔄 Reiniciar Aplicación"
        show_menu_option "4" "▶️  🚫 Iniciar Aplicación (ya ejecutándose)" "$RED"
    else
        show_menu_option "2" "🛑 🚫 Detener Aplicación (no ejecutándose)" "$RED"
        show_menu_option "3" "🔄 🚫 Reiniciar Aplicación (no ejecutándose)" "$RED"
        show_menu_option "4" "▶️  ✅ Iniciar Aplicación"
    fi

    show_menu_option "0" "↩️  Volver al Menú Principal" "$BLUE"
    show_menu_separator
    show_selection_prompt "0-5"
}

# Función para mostrar submenú de operaciones de base de datos
show_db_menu() {
    show_menu_header "💾 Operaciones de Base de Datos"
    echo -e "${WHITE}Seleccione una operación:${NC}"
    show_menu_separator
    show_menu_option "1" "💾 📤 Crear Respaldo de Base de Datos"
    show_menu_option "2" "💾 📥 Restaurar Base de Datos desde Respaldo"
    show_menu_option "3" "📋 📂 Listar Respaldos Disponibles"
    show_menu_option "4" "📊 🔍 Mostrar Estado de Base de Datos"
    show_menu_option "0" "↩️  Volver al Menú Principal" "$BLUE"
    show_menu_separator
    show_selection_prompt "0-4"
}

# Función para mostrar submenú de control de contenedores
show_container_menu() {
    show_menu_header "🐳 Control de Contenedores"
    echo -e "${WHITE}Seleccione una acción:${NC}"
    show_menu_separator

    # Verificar estado actual para mostrar opciones relevantes
    local containers_up=$(is_containers_running)

    if [ "$containers_up" = "true" ]; then
        show_menu_option "1" "▶️  🚫 Iniciar Contenedores (ya ejecutándose)" "$RED"
        show_menu_option "2" "🛑 ✅ Detener Contenedores"
        show_menu_option "3" "🔄 🔄 Reiniciar Contenedores"
    else
        show_menu_option "1" "▶️  ✅ Iniciar Contenedores"
        show_menu_option "2" "🛑 🚫 Detener Contenedores (no ejecutándose)" "$RED"
        show_menu_option "3" "🔄 🚫 Reiniciar Contenedores (no ejecutándose)" "$RED"
    fi

    show_menu_option "4" "📜 📋 Mostrar Logs de Contenedores"
    show_menu_option "0" "↩️  Volver al Menú Principal" "$BLUE"
    show_menu_separator
    show_selection_prompt "0-4"
}

# Función para mostrar submenú de estado del sistema
show_status_menu() {
    show_menu_header "📊 Estado del Sistema"
    echo -e "${WHITE}Seleccione qué estado desea ver:${NC}"
    show_menu_separator
    show_menu_option "1" "🌐 📊 Estado Completo del Sistema"
    show_menu_option "2" "💾 📊 Solo Estado de Base de Datos"
    show_menu_option "3" "🌐 📊 Solo Estado de Aplicación"
    show_menu_option "4" "🐳 📊 Solo Estado de Contenedores"
    show_menu_option "5" "🧪 📊 Ejecutar Pruebas de Funcionalidad"
    show_menu_option "0" "↩️  Volver al Menú Principal" "$BLUE"
    show_menu_separator
    show_selection_prompt "0-5"
}

# Función para mostrar submenú de ayuda
show_help_menu() {
    show_menu_header "❓ Ayuda e Información"
    echo -e "${WHITE}Seleccione una opción de ayuda:${NC}"
    show_menu_separator
    show_menu_option "1" "📖 ℹ️  Acerca de Este Script"
    show_menu_option "2" "📋 📚 Referencia de Comandos"
    show_menu_option "3" "🔧 🛠️  Solución de Problemas"
    show_menu_option "4" "💾 📖 Guía de Respaldo y Restauración"
    show_menu_option "0" "↩️  Volver al Menú Principal" "$BLUE"
    show_menu_separator
    show_selection_prompt "0-4"
}

# =============================================================================
# MANEJADORES DE MENÚ
# =============================================================================

# Función para manejar selección del menú principal
# Bucle principal para navegación de menú con validación de entrada
handle_main_menu() {
    local choice
    while true; do
        show_main_menu
        read -r choice

        if validate_menu_input "$choice" 0 5; then
            case $choice in
                1) handle_app_menu ;;
                2) handle_db_menu ;;
                3) handle_container_menu ;;
                4) handle_status_menu ;;
                5) handle_help_menu ;;
                0)
                    log "Saliendo de la Consola de Gestión de DTIC Bitácoras"
                    exit 0
                    ;;
            esac
        else
            show_menu_error "Opción inválida. Por favor seleccione 0-5."
        fi
    done
}

# Función para manejar selección del menú de aplicación
handle_app_menu() {
    local choice
    while true; do
        show_app_menu
        read -r choice

        # Verificar estado actual para determinar acción apropiada
        local containers_up=$(is_containers_running)

        if validate_menu_input "$choice" 0 5; then
            case $choice in
                1)
                    check_app_status
                    show_continue_prompt
                    ;;
                2)
                    if [ "$containers_up" = "true" ]; then
                        log "Deteniendo aplicación..."
                        stop_containers
                    else
                        show_menu_error "La aplicación no está ejecutándose. Use la opción 4 para iniciarla."
                        continue
                    fi
                    show_continue_prompt
                    ;;
                3)
                    if [ "$containers_up" = "true" ]; then
                        log "Reiniciando aplicación..."
                        stop_containers
                        start_containers
                    else
                        show_menu_error "La aplicación no está ejecutándose. Use la opción 4 para iniciarla."
                        continue
                    fi
                    show_continue_prompt
                    ;;
                4)
                    if [ "$containers_up" = "false" ]; then
                        log "Iniciando aplicación..."
                        start_containers
                    else
                        show_menu_error "La aplicación ya está ejecutándose. Use las opciones 2 o 3 para detener/reiniciar."
                        continue
                    fi
                    show_continue_prompt
                    ;;
                5)
                    test_app_functionality
                    show_continue_prompt
                    ;;
                0) return ;;
            esac
        else
            show_menu_error "Opción inválida. Por favor seleccione 0-5."
        fi
    done
}

# Función para manejar selección del menú de base de datos
handle_db_menu() {
    local choice
    while true; do
        show_db_menu
        read -r choice

        if validate_menu_input "$choice" 0 4; then
            case $choice in
                1)
                    create_backup
                    show_continue_prompt
                    ;;
                2)
                    handle_backup_restore_menu
                    ;;
                3)
                    list_backups
                    show_continue_prompt
                    ;;
                4)
                    show_db_status
                    show_continue_prompt
                    ;;
                0) return ;;
            esac
        else
            show_menu_error "Opción inválida. Por favor seleccione 0-4."
        fi
    done
}

# Función para manejar el submenú de restauración de respaldo
handle_backup_restore_menu() {
    local choice
    while true; do
        # Obtener lista de archivos de respaldo
        local backup_files=($(get_backup_files))
        local backup_count=${#backup_files[@]}

        # Mostrar menú de selección si hay respaldos disponibles
        if ! show_backup_selection_menu "${backup_files[@]}"; then
            show_continue_prompt
            return
        fi

        read -r choice

        if validate_menu_input "$choice" 0 "$backup_count"; then
            if [ "$choice" -eq 0 ]; then
                return
            elif [ "$choice" -ge 1 ] && [ "$choice" -le "$backup_count" ]; then
                local selected_file="${backup_files[$((choice - 1))]}"
                local filename=$(basename "$selected_file")

                echo ""
                echo -e "${BLUE}📁 Archivo seleccionado: ${WHITE}$filename${NC}"
                echo ""

                # Mostrar información del archivo seleccionado
                echo "📊 Información del respaldo:"
                echo "   📁 Nombre: $filename"
                echo "   📏 Tamaño: $(du -h "$selected_file" | cut -f1)"
                echo "   🕒 Fecha: $(date -r "$selected_file" '+%Y-%m-%d %H:%M:%S')"
                echo ""

                # Confirmación antes de proceder
                if get_user_confirmation "¿Está seguro de que desea restaurar la base de datos desde este respaldo? Esta acción reemplazará todos los datos actuales."; then
                    echo ""
                    if restore_backup "$selected_file"; then
                        echo ""
                        echo -e "${GREEN}✅ Restauración completada exitosamente${NC}"
                    else
                        echo ""
                        echo -e "${RED}❌ La restauración falló${NC}"
                    fi
                fi

                show_continue_prompt
                return
            fi
        else
            show_menu_error "Selección inválida. Por favor seleccione 0-$backup_count."
        fi
    done
}

# Función para manejar selección del menú de contenedores
handle_container_menu() {
    local choice
    while true; do
        show_container_menu
        read -r choice

        # Verificar estado actual para determinar acción apropiada
        local containers_up=$(is_containers_running)

        if validate_menu_input "$choice" 0 4; then
            case $choice in
                1)
                    if [ "$containers_up" = "false" ]; then
                        log "Iniciando contenedores..."
                        start_containers
                    else
                        show_menu_error "Los contenedores ya están ejecutándose. Use las opciones 2 o 3 para detener/reiniciar."
                        continue
                    fi
                    show_continue_prompt
                    ;;
                2)
                    if [ "$containers_up" = "true" ]; then
                        log "Deteniendo contenedores..."
                        stop_containers
                    else
                        show_menu_error "Los contenedores no están ejecutándose. Use la opción 1 para iniciarlos."
                        continue
                    fi
                    show_continue_prompt
                    ;;
                3)
                    if [ "$containers_up" = "true" ]; then
                        log "Reiniciando contenedores..."
                        stop_containers
                        start_containers
                    else
                        show_menu_error "Los contenedores no están ejecutándose. Use la opción 1 para iniciarlos."
                        continue
                    fi
                    show_continue_prompt
                    ;;
                4)
                    log "Mostrando logs de contenedores..."
                    run_docker_command docker compose logs --tail=50
                    show_continue_prompt
                    ;;
                0) return ;;
            esac
        else
            show_menu_error "Opción inválida. Por favor seleccione 0-4."
        fi
    done
}

# Función para manejar selección del menú de estado
handle_status_menu() {
    local choice
    while true; do
        show_status_menu
        read -r choice

        if validate_menu_input "$choice" 0 5; then
            case $choice in
                1)
                    log "Estado completo del sistema..."
                    check_app_status
                    show_db_status
                    echo ""
                    echo "🐳 Estado de Contenedores:"
                    run_docker_command docker ps | grep "dtic-bitacoras" || echo "No hay contenedores ejecutándose"
                    echo ""
                    show_continue_prompt
                    ;;
                2)
                    show_db_status
                    show_continue_prompt
                    ;;
                3)
                    check_app_status
                    show_continue_prompt
                    ;;
                4)
                    echo ""
                    echo "🐳 Estado de Contenedores:"
                    run_docker_command docker ps | grep "$APP_CONTAINER" || echo "No hay contenedores ejecutándose"
                    echo ""
                    show_continue_prompt
                    ;;
                5)
                    test_app_functionality
                    show_continue_prompt
                    ;;
                0) return ;;
            esac
        else
            show_menu_error "Opción inválida. Por favor seleccione 0-5."
        fi
    done
}

# Función para manejar selección del menú de ayuda
handle_help_menu() {
    local choice
    while true; do
        show_help_menu
        read -r choice

        if validate_menu_input "$choice" 0 4; then
            case $choice in
                1)
                    echo ""
                    echo "📖 Acerca del Script de Gestión de DTIC Bitácoras"
                    echo "================================================"
                    echo ""
                    echo "Este script proporciona una interfaz unificada para gestionar la aplicación web"
                    echo "DTIC Bitácoras y sus operaciones de base de datos asociadas."
                    echo ""
                    echo "Características:"
                    echo "  • Sistema de menú interactivo para navegación fácil"
                    echo "  • Monitoreo del estado de la aplicación web"
                    echo "  • Operaciones de respaldo y restauración de base de datos"
                    echo "  • Gestión de contenedores Docker"
                    echo "  • Logging y manejo de errores completo"
                    echo ""
                    show_continue_prompt
                    ;;
                2)
                    usage
                    show_continue_prompt
                    ;;
                3)
                    echo ""
                    echo "🔧 Guía de Solución de Problemas"
                    echo "================================"
                    echo ""
                    echo "Problemas Comunes:"
                    echo "  • Fallo de conexión a base de datos: Verifique si los contenedores están ejecutándose"
                    echo "  • Fallo en creación de respaldo: Verifique permisos de escritura en directorio de respaldos"
                    echo "  • Aplicación no accesible: Verifique salud del contenedor y logs"
                    echo "  • Fallo en restauración: Asegure integridad del archivo con 'gzip -t'"
                    echo ""
                    echo "Comandos de Depuración:"
                    echo "  • Verificar estado de contenedores: docker ps"
                    echo "  • Ver logs: docker compose logs"
                    echo "  • Probar base de datos: docker compose exec db mysqladmin ping"
                    echo ""
                    show_continue_prompt
                    ;;
                4)
                    echo ""
                    echo "💾 Guía de Respaldo y Restauración"
                    echo "==================================="
                    echo ""
                    echo "Creando Respaldos:"
                    echo "  • Los respaldos se almacenan en _www-app/database/backups/"
                    echo "  • Los archivos se comprimen con gzip (.sql.gz)"
                    echo "  • Verificación automática de integridad"
                    echo ""
                    echo "Restaurando Respaldos:"
                    echo "  • ADVERTENCIA: La restauración REEMPLAZARÁ la base de datos actual"
                    echo "  • Siempre respalde datos actuales antes de restaurar"
                    echo "  • Verifique integridad del respaldo antes de restaurar"
                    echo "  • Use rutas absolutas o relativas a la ubicación del script"
                    echo ""
                    show_continue_prompt
                    ;;
                0) return ;;
            esac
        else
            show_menu_error "Opción inválida. Por favor seleccione 0-4."
        fi
    done
}

# =============================================================================
# PUNTO DE ENTRADA DEL MENÚ PRINCIPAL
# =============================================================================

# Función para iniciar menú interactivo
# Punto de entrada para la consola de gestión interactiva
start_menu() {
    clear_screen
    echo -e "${MAGENTA}${BOLD}"
    echo "╔══════════════════════════════════════════╗"
    echo "║   🚀 Iniciando DTIC Bitácoras Console    ║"
    echo "╚══════════════════════════════════════════╝"
    echo -e "${NC}"

    log "Iniciando Consola de Gestión Interactiva de DTIC Bitácoras"

    echo -e "${CYAN}🔍 Verificando estado del sistema...${NC}"
    echo ""

    # Verificación inteligente del estado del sistema al inicio
    local containers_running=false
    if check_containers_running >/dev/null 2>&1; then
        containers_running=true
        echo -e "${GREEN}✅ Contenedores están ejecutándose${NC}"
    else
        echo -e "${RED}❌ Contenedores no están ejecutándose${NC}"
    fi

    # Verificar estado de aplicación si contenedores están arriba
    local app_healthy=false
    if $containers_running; then
        if check_app_status >/dev/null 2>&1; then
            app_healthy=true
            echo -e "${GREEN}✅ Aplicación está saludable${NC}"
        else
            echo -e "${YELLOW}⚠️  Aplicación no está completamente saludable${NC}"
        fi
    fi

    # Verificar estado de base de datos si contenedores están arriba
    local db_connected=false
    if $containers_running; then
        if check_db_connection >/dev/null 2>&1; then
            db_connected=true
            echo -e "${GREEN}✅ Base de datos está conectada${NC}"
        else
            echo -e "${RED}❌ Base de datos no está accesible${NC}"
        fi
    fi

    echo ""
    echo -e "${BOLD}📊 Resumen del Estado del Sistema:${NC}"
    echo -e "   🐳 Contenedores: $(if $containers_running; then echo -e "${GREEN}✅ Ejecutándose${NC}"; else echo -e "${RED}❌ Detenidos${NC}"; fi)"
    echo -e "   🌐 Aplicación: $(if $containers_running && $app_healthy; then echo -e "${GREEN}✅ Saludable${NC}"; elif $containers_running; then echo -e "${YELLOW}⚠️  Con problemas${NC}"; else echo -e "${BLUE}❓ No verificable${NC}"; fi)"
    echo -e "   💾 Base de Datos: $(if $containers_running && $db_connected; then echo -e "${GREEN}✅ Conectada${NC}"; elif $containers_running; then echo -e "${RED}❌ No accesible${NC}"; else echo -e "${BLUE}❓ No verificable${NC}"; fi)"
    echo ""

    echo -e "${CYAN}${BOLD}¡Bienvenido a la Consola de Gestión de DTIC Bitácoras!${NC}"
    echo -e "${WHITE}Use los menús para gestionar su aplicación web y base de datos.${NC}"
    echo ""
    echo -e "${YELLOW}Presione Enter para continuar...${NC}"
    read -r
    handle_main_menu
}

# =============================================================================
# LÓGICA PRINCIPAL
# =============================================================================

# Lógica principal del script - despachador de comandos
# Comandos actualizados para host + SQLite
case "${1:-}" in
    "menu")
        start_menu
        ;;
    "app-status")
        check_app_status
        ;;
    "bd-status")
        show_db_status
        ;;
    "docker-status")
        echo ""
        echo "🐳 Estado de Contenedores Docker:"
        docker ps | grep "dtic-bitacoras" || echo "No hay contenedores ejecutándose"
        echo ""
        ;;
    "app-test")
        test_app_functionality
        ;;
    *)
        echo "Uso: $0 {menu|app-status|bd-status|docker-status|app-test}"
        echo ""
        echo "Comandos disponibles:"
        echo "  menu         - Menú interactivo de gestión"
        echo "  app-status   - Mostrar estado de la aplicación web"
        echo "  bd-status    - Mostrar estado de la base de datos SQLite"
        echo "  docker-status- Mostrar estado de los contenedores Docker"
        echo "  app-test     - Probar funcionalidad completa de la aplicación"
        echo ""
        exit 1
        ;;
esac