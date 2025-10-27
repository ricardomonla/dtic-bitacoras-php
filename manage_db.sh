#!/bin/bash

# DTIC Bitácoras - Database Management Script
# Unified script for starting/stopping containers with backup/restore functionality

set -e  # Exit on any error

# Configuration
BACKUP_DIR="./backups"
CONTAINER_NAME="dtic-bitacoras-php-db-1"
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

# Function to check if container is running
is_container_running() {
    docker ps | grep -q "$CONTAINER_NAME"
}

# Function to wait for database to be ready
wait_for_db() {
    local max_attempts=30
    local attempt=1

    log "Waiting for database to be ready..."

    while [ $attempt -le $max_attempts ]; do
        if docker exec "$CONTAINER_NAME" mysqladmin ping -h localhost -u "$DB_USER" -p"$DB_PASS" --silent 2>/dev/null; then
            success "Database is ready!"
            return 0
        fi

        log "Attempt $attempt/$max_attempts - Database not ready yet..."
        sleep 2
        ((attempt++))
    done

    error "Database failed to start after $max_attempts attempts"
    return 1
}

# Function to find latest backup file
find_latest_backup() {
    local latest_backup=$(ls -t "$BACKUP_DIR"/db_backup_*.sql.gz 2>/dev/null | head -n1)
    if [ -z "$latest_backup" ]; then
        error "No backup files found in $BACKUP_DIR"
        return 1
    fi
    echo "$latest_backup"
}

# Function to restore database from backup
restore_backup() {
    local backup_file="$1"

    if [ ! -f "$backup_file" ]; then
        error "Backup file '$backup_file' does not exist"
        return 1
    fi

    # Verify backup file integrity
    log "Verifying backup file integrity..."
    if ! gzip -t "$backup_file"; then
        error "Backup file is corrupted"
        return 1
    fi

    success "Backup file integrity verified"

    log "Restoring database from backup: $backup_file"

    # Drop and recreate database to ensure clean restore
    log "Preparing database for restore..."
    docker exec "$CONTAINER_NAME" mysql -u "$DB_USER" -p"$DB_PASS" -e "DROP DATABASE IF EXISTS $DB_NAME; CREATE DATABASE $DB_NAME;"

    # Restore from backup
    gunzip -c "$backup_file" | docker exec -i "$CONTAINER_NAME" mysql -u "$DB_USER" -p"$DB_PASS" "$DB_NAME"

    # Verify restore
    local table_count=$(docker exec "$CONTAINER_NAME" mysql -u "$DB_USER" -p"$DB_PASS" -e "USE $DB_NAME; SHOW TABLES;" | wc -l)

    if [ "$table_count" -gt 1 ]; then
        success "Database restored successfully - $((table_count - 1)) tables found"
        return 0
    else
        error "Database restore verification failed - no tables found"
        return 1
    fi
}

# Function to create backup
create_backup() {
    local timestamp=$(date +"%Y%m%d_%H%M%S")
    local backup_file="$BACKUP_DIR/db_backup_${timestamp}.sql.gz"

    # Create backups directory if it doesn't exist
    mkdir -p "$BACKUP_DIR"

    log "Creating database backup..."

    # Stop container for consistency
    log "Stopping database container for consistent backup..."
    docker compose stop db

    # Create compressed backup
    docker exec "$CONTAINER_NAME" mysqldump --no-tablespaces -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" | gzip > "$backup_file"

    # Restart container
    log "Restarting database container..."
    docker compose start db

    # Wait for DB to be ready again
    wait_for_db

    # Verify backup integrity
    if gzip -t "$backup_file"; then
        local backup_size=$(du -h "$backup_file" | cut -f1)
        success "Backup created successfully: $backup_file (Size: $backup_size)"
        echo ""
        echo "💡 Next steps:"
        echo "   git add $backup_file"
        echo "   git commit -m 'Database backup $timestamp'"
        echo "   git push"
        return 0
    else
        error "Backup file verification failed"
        return 1
    fi
}

# Function to start containers and restore latest backup
start_containers() {
    log "🚀 Starting DTIC Bitácoras containers..."

    # Start containers
    docker compose up -d

    # Wait for database to be ready
    if ! wait_for_db; then
        error "Failed to start containers - database not ready"
        return 1
    fi

    # Find and restore latest backup
    local latest_backup=$(find_latest_backup)
    if [ $? -eq 0 ]; then
        warning "Found latest backup: $latest_backup"
        echo "This will restore the database from this backup."
        read -p "Do you want to proceed with restore? (yes/no): " -r
        if [[ $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
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
        docker compose down
        success "Containers stopped successfully!"
        return 0
    else
        error "Backup creation failed - containers not stopped"
        return 1
    fi
}

# Main script logic
case "${1:-}" in
    "start")
        start_containers
        ;;
    "stop")
        stop_containers
        ;;
    *)
        echo "Usage: $0 {start|stop}"
        echo ""
        echo "Commands:"
        echo "  start  - Start Docker containers and restore latest backup"
        echo "  stop   - Create backup and stop Docker containers"
        echo ""
        echo "Examples:"
        echo "  $0 start    # Deploy containers and restore database"
        echo "  $0 stop     # Backup database and shutdown containers"
        exit 1
        ;;
esac