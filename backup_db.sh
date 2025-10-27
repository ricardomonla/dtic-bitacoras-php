#!/bin/bash

# DTIC Bitácoras - Database Backup Script
# Creates a compressed backup of the MySQL database for sharing between machines

set -e  # Exit on any error

# Configuration
BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="db_backup_${TIMESTAMP}.sql.gz"
CONTAINER_NAME="dtic-bitacoras-php-db-1"
DB_NAME="dtic_bitacoras_php"
DB_USER="dtic_user"
DB_PASS="dtic_password"

echo "🚀 Starting database backup process..."

# Create backups directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Check if container is running
if ! docker ps | grep -q "$CONTAINER_NAME"; then
    echo "❌ Error: Database container '$CONTAINER_NAME' is not running"
    echo "   Please start the containers first with: docker compose up -d"
    exit 1
fi

echo "📊 Stopping database container to ensure data consistency..."
docker compose stop db

echo "💾 Creating database backup..."
# Create compressed backup using mysqldump through docker exec
docker exec "$CONTAINER_NAME" mysqldump \
    --no-tablespaces \
    -u "$DB_USER" \
    -p"$DB_PASS" \
    "$DB_NAME" | gzip > "$BACKUP_DIR/$BACKUP_FILE"

echo "✅ Backup created successfully: $BACKUP_DIR/$BACKUP_FILE"

# Calculate and display backup size
BACKUP_SIZE=$(du -h "$BACKUP_DIR/$BACKUP_FILE" | cut -f1)
echo "📏 Backup size: $BACKUP_SIZE"

echo "🔄 Restarting database container..."
docker compose start db

echo "⏳ Waiting for database to be ready..."
sleep 10

# Verify backup integrity by checking if it's a valid gzip file
if gzip -t "$BACKUP_DIR/$BACKUP_FILE"; then
    echo "✅ Backup integrity verified"
else
    echo "❌ Error: Backup file is corrupted"
    exit 1
fi

echo ""
echo "🎉 Backup process completed successfully!"
echo "📁 Backup file: $BACKUP_DIR/$BACKUP_FILE"
echo ""
echo "💡 Next steps:"
echo "   1. Commit the backup to Git: git add $BACKUP_DIR/$BACKUP_FILE && git commit -m 'Database backup $TIMESTAMP'"
echo "   2. Push to repository: git push"
echo "   3. On another machine: git pull && ./restore_db.sh $BACKUP_DIR/$BACKUP_FILE"