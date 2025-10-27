#!/bin/bash

# DTIC Bitácoras - Application Runner Script
# Unified script for database management and application operations
# Designed to run from within Docker container (docker compose exec app)

set -e  # Exit on any error

# Configuration
BACKUP_DIR="./backups"
CONTAINER_NAME="dtic-bitacoras-php-db-1"
DB_HOST="db"
DB_NAME="dtic_bitacoras_php"
DB_USER="dtic_user"
DB_PASS="dtic_password"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

# Error logging function
error() {
    echo -e "${RED}[ERROR] $1${NC}" >&2
}

# Success logging function
success() {
    echo -e "${GREEN}[SUCCESS] $1${NC}"
}

# Warning logging function
warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

# Function to check if database is accessible
check_db_connection() {
    log "Checking database connection via Docker..."
    if docker compose exec -T db mysql -u "$DB_USER" -p"$DB_PASS" -e "SELECT 1;" "$DB_NAME" >/dev/null 2>&1; then
        success "Database connection successful"
        return 0
    else
        error "Database connection failed"
        return 1
    fi
}

# Function to create database backup
create_backup() {
    local timestamp=$(date +"%Y%m%d_%H%M%S")
    local backup_file="$BACKUP_DIR/db_backup_${timestamp}.sql.gz"

    log "Creating database backup..."

    # Create backups directory if it doesn't exist
    mkdir -p "$BACKUP_DIR"

    # Execute backup via Docker container
    log "Executing mysqldump via Docker..."
    if docker compose exec -T db mysqldump --no-tablespaces -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" | gzip > "$backup_file"; then
        # Verify backup integrity
        if gzip -t "$backup_file"; then
            local backup_size=$(du -h "$backup_file" | cut -f1)
            success "Backup created successfully: $backup_file (Size: $backup_size)"

            # Display backup info
            echo ""
            echo "📁 Backup file: $backup_file"
            echo "📊 Size: $backup_size"
            echo "🕒 Timestamp: $timestamp"
            echo ""
            echo "💡 Next steps:"
            echo "   - Backup is saved locally in ./backups/"
            echo "   - Copy to container: docker cp $backup_file dtic-bitacoras-php-app-1:/var/www/html/backups/"
            return 0
        else
            error "Backup file verification failed - file may be corrupted"
            rm -f "$backup_file"
            return 1
        fi
    else
        error "Backup creation failed"
        return 1
    fi
}

# Function to restore database from backup
restore_backup() {
    local backup_file="$1"

    if [ -z "$backup_file" ]; then
        error "Backup file not specified"
        echo "Usage: $0 restore <backup_file>"
        return 1
    fi

    # Convert relative path to absolute if needed
    if [[ "$backup_file" != /* ]]; then
        backup_file="./$backup_file"
    fi

    log "Starting database restore process..."
    echo "📁 Backup file: $backup_file"

    # Check if backup file exists
    if [ ! -f "$backup_file" ]; then
        error "Backup file '$backup_file' does not exist"
        return 1
    fi

    # Verify backup file integrity
    log "Verifying backup file integrity..."
    if ! gzip -t "$backup_file"; then
        error "Backup file is corrupted or not a valid gzip file"
        return 1
    fi

    success "Backup file integrity verified"

    # Verify database connection
    if ! check_db_connection; then
        error "Cannot restore backup - database not accessible"
        return 1
    fi

    warning "WARNING: This will REPLACE the current database with the backup!"
    echo "   All current data will be lost."
    echo "   Backup file: $backup_file"
    echo ""
    echo "⚠️  This operation cannot be undone!"
    echo ""

    # In container environment, assume confirmation (or add confirmation logic if needed)
    log "Proceeding with database restore..."

    # Create temporary SQL file for restore
    local temp_sql="/tmp/restore_temp.sql"

    # Extract and prepare backup for restore
    log "Extracting backup file..."
    if ! gunzip -c "$backup_file" > "$temp_sql"; then
        error "Failed to extract backup file"
        return 1
    fi

    # Get current database structure info before restore
    local current_tables=$(docker compose exec -T db mysql -u "$DB_USER" -p"$DB_PASS" -e "USE $DB_NAME; SHOW TABLES;" 2>/dev/null | wc -l)
    local current_tables_count=$((current_tables - 1))  # Subtract header line

    log "Current database has approximately $current_tables_count tables"

    # Perform the restore
    log "Restoring database from backup..."
    if docker compose exec -T db mysql -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" < "$temp_sql"; then
        # Clean up temp file
        rm -f "$temp_sql"

        # Verify restore by checking tables
        local new_tables=$(docker compose exec -T db mysql -u "$DB_USER" -p"$DB_PASS" -e "USE $DB_NAME; SHOW TABLES;" 2>/dev/null | wc -l)
        local new_tables_count=$((new_tables - 1))  # Subtract header line

        if [ "$new_tables_count" -gt 0 ]; then
            success "Database restore completed successfully"
            echo "📊 Tables restored: $new_tables_count"
            echo "📁 Backup source: $backup_file"
            return 0
        else
            error "Database restore verification failed - no tables found after restore"
            return 1
        fi
    else
        # Clean up temp file
        rm -f "$temp_sql"
        error "Database restore failed during import"
        return 1
    fi
}

# Function to show database status
show_status() {
    log "Checking database status..."

    if check_db_connection; then
        # Get database information via Docker
        local tables=$(docker compose exec -T db mysql -u "$DB_USER" -p"$DB_PASS" -e "USE $DB_NAME; SHOW TABLES;" 2>/dev/null | wc -l)
        local tables_count=$((tables - 1))

        local users=$(docker compose exec -T db mysql -u "$DB_USER" -p"$DB_PASS" -e "USE $DB_NAME; SELECT COUNT(*) as count FROM tecnicos;" 2>/dev/null | tail -n1)

        local sessions=$(docker compose exec -T db mysql -u "$DB_USER" -p"$DB_PASS" -e "USE $DB_NAME; SELECT COUNT(*) as count FROM sesiones;" 2>/dev/null | tail -n1)

        echo ""
        echo "📊 Database Status:"
        echo "   🏗️  Database: $DB_NAME"
        echo "   📋 Tables: $tables_count"
        echo "   👥 Users (tecnicos): ${users:-0}"
        echo "   🔐 Active Sessions: ${sessions:-0}"
        echo ""

        # Show recent backups
        if [ -d "$BACKUP_DIR" ]; then
            local backup_count=$(ls -1 "$BACKUP_DIR"/db_backup_*.sql.gz 2>/dev/null | wc -l)
            if [ "$backup_count" -gt 0 ]; then
                echo "💾 Recent Backups:"
                ls -la "$BACKUP_DIR"/db_backup_*.sql.gz | tail -n 3 | while read line; do
                    echo "   $line"
                done
                echo ""
            fi
        fi

        success "Database status check completed"
    else
        error "Cannot check status - database not accessible"
        return 1
    fi
}

# Function to check if containers are running
check_containers_running() {
    docker ps | grep -q "dtic-bitacoras-php"
}

# Function to bring up containers and restore latest backup
bring_up_containers() {
    log "🚀 Bringing up DTIC Bitácoras containers..."

    # Check if containers are already running
    if check_containers_running; then
        warning "Containers are already running"
        # Still proceed with restore if requested
    else
        # Start containers
        if docker compose up -d; then
            success "Containers started successfully"
        else
            error "Failed to start containers"
            return 1
        fi

        # Wait for database to be ready
        log "Waiting for database to be ready..."
        local max_attempts=30
        local attempt=1

        while [ $attempt -le $max_attempts ]; do
            if docker compose exec -T db mysqladmin ping -h localhost -u "$DB_USER" -p"$DB_PASS" --silent 2>/dev/null; then
                success "Database is ready!"
                break
            fi

            log "Attempt $attempt/$max_attempts - Database not ready yet..."
            sleep 2
            ((attempt++))
        done

        if [ $attempt -gt $max_attempts ]; then
            error "Database failed to start after $max_attempts attempts"
            return 1
        fi
    fi

    # Always try to restore latest backup (this is the main purpose of 'up')
    local latest_backup=$(ls -t "$BACKUP_DIR"/db_backup_*.sql.gz 2>/dev/null | head -n1)
    if [ -n "$latest_backup" ]; then
        warning "Found latest backup: $latest_backup"
        echo "This will restore the database from this backup."

        # Check if running interactively
        if [ -t 0 ]; then
            # Interactive mode - ask for confirmation
            read -p "Do you want to proceed with restore? (yes/no): " -r
            if [[ $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
                should_restore=true
            else
                should_restore=false
            fi
        else
            # Non-interactive mode - check for environment variable or default to yes for 'up' command
            if [[ "${AUTO_RESTORE:-yes}" =~ ^[Yy][Ee][Ss]$ ]]; then
                should_restore=true
            else
                warning "Non-interactive mode - skipping restore (set AUTO_RESTORE=yes to enable)"
                should_restore=false
            fi
        fi

        if [ "$should_restore" = true ]; then
            if restore_backup "$latest_backup"; then
                success "Containers up and database restored successfully!"
                return 0
            else
                error "Database restore failed"
                return 1
            fi
        else
            warning "Restore cancelled - containers up without database restore"
            success "Containers are up and running!"
            return 0
        fi
    else
        warning "No backup files found - containers up without database restore"
        success "Containers are up and running!"
        return 0
    fi
}

# Function to start containers and restore latest backup
start_containers() {
    log "🚀 Starting DTIC Bitácoras containers..."

    # Start containers
    if docker compose up -d; then
        success "Containers started successfully"
    else
        error "Failed to start containers"
        return 1
    fi

    # Wait for database to be ready
    log "Waiting for database to be ready..."
    local max_attempts=30
    local attempt=1

    while [ $attempt -le $max_attempts ]; do
        if docker compose exec -T db mysqladmin ping -h localhost -u "$DB_USER" -p"$DB_PASS" --silent 2>/dev/null; then
            success "Database is ready!"
            break
        fi

        log "Attempt $attempt/$max_attempts - Database not ready yet..."
        sleep 2
        ((attempt++))
    done

    if [ $attempt -gt $max_attempts ]; then
        error "Database failed to start after $max_attempts attempts"
        return 1
    fi

    # Find and restore latest backup
    local latest_backup=$(ls -t "$BACKUP_DIR"/db_backup_*.sql.gz 2>/dev/null | head -n1)
    if [ -n "$latest_backup" ]; then
        warning "Found latest backup: $latest_backup"
        echo "This will restore the database from this backup."

        # Check if running interactively
        if [ -t 0 ]; then
            # Interactive mode - ask for confirmation
            read -p "Do you want to proceed with restore? (yes/no): " -r
            if [[ $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
                should_restore=true
            else
                should_restore=false
            fi
        else
            # Non-interactive mode - check for environment variable or default to no
            if [[ "${AUTO_RESTORE:-no}" =~ ^[Yy][Ee][Ss]$ ]]; then
                should_restore=true
            else
                warning "Non-interactive mode - skipping restore (set AUTO_RESTORE=yes to enable)"
                should_restore=false
            fi
        fi

        if [ "$should_restore" = true ]; then
            if restore_backup "$latest_backup"; then
                success "Containers started and database restored successfully!"
                return 0
            else
                error "Database restore failed"
                return 1
            fi
        else
            warning "Restore cancelled - containers started without database restore"
            success "Containers started successfully!"
            return 0
        fi
    else
        warning "No backup files found - containers started without restore"
        success "Containers started successfully!"
        return 0
    fi
}

# Function to stop containers with backup
stop_containers() {
    log "🛑 Stopping DTIC Bitácoras containers with backup..."

    # Create backup first
    if create_backup; then
        # Stop containers
        log "Stopping all containers..."
        if docker compose down; then
            success "Containers stopped successfully!"
            return 0
        else
            error "Failed to stop containers"
            return 1
        fi
    else
        error "Backup creation failed - containers not stopped"
        return 1
    fi
}

# Function to display usage
usage() {
    echo "DTIC Bitácoras - Application Runner Script"
    echo "Unified database management and container control script"
    echo ""
    echo "Usage: $0 <command> [options]"
    echo ""
    echo "Commands:"
    echo "  up              - Bring up containers and restore latest backup (main command)"
    echo "  start           - Start Docker containers and optionally restore latest backup"
    echo "  stop            - Create backup and stop Docker containers"
    echo "  backup          - Create a new database backup"
    echo "  restore <file>  - Restore database from backup file"
    echo "  status          - Show database status and information"
    echo ""
    echo "Examples:"
    echo "  $0 start                            # Start containers with optional restore"
    echo "  $0 stop                             # Backup and stop containers"
    echo "  $0 backup                           # Create new backup"
    echo "  $0 restore backups/db_backup_20231027_143000.sql.gz"
    echo "  $0 status                           # Show database info"
    echo ""
    echo "Notes:"
    echo "  - Backup files are stored locally in ./backups/"
    echo "  - Database credentials are pre-configured (dtic_user/dtic_password)"
    echo "  - All operations include proper error handling"
}

# Main script logic
case "${1:-}" in
    "up")
        bring_up_containers
        ;;
    "start")
        start_containers
        ;;
    "stop")
        stop_containers
        ;;
    "backup")
        create_backup
        ;;
    "restore")
        restore_backup "$2"
        ;;
    "status")
        show_status
        ;;
    *)
        usage
        exit 1
        ;;
esac