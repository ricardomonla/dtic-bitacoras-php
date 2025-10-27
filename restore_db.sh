#!/bin/bash

# DTIC Bitácoras - Database Restore Script
# Restores a compressed MySQL database backup

set -e  # Exit on any error

# Configuration
CONTAINER_NAME="dtic-bitacoras-php-db-1"
DB_NAME="dtic_bitacoras_php"
DB_USER="dtic_user"
DB_PASS="dtic_password"

# Function to display usage
usage() {
    echo "Usage: $0 <backup_file>"
    echo "Example: $0 ./backups/db_backup_20231027_143000.sql.gz"
    exit 1
}

# Check if backup file is provided
if [ $# -ne 1 ]; then
    echo "❌ Error: Backup file not specified"
    usage
fi

BACKUP_FILE="$1"

echo "🚀 Starting database restore process..."
echo "📁 Backup file: $BACKUP_FILE"

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Error: Backup file '$BACKUP_FILE' does not exist"
    exit 1
fi

# Verify backup file integrity
echo "🔍 Verifying backup file integrity..."
if ! gzip -t "$BACKUP_FILE"; then
    echo "❌ Error: Backup file is corrupted or not a valid gzip file"
    exit 1
fi

echo "✅ Backup file integrity verified"

# Check if container is running
if ! docker ps | grep -q "$CONTAINER_NAME"; then
    echo "❌ Error: Database container '$CONTAINER_NAME' is not running"
    echo "   Please start the containers first with: docker compose up -d"
    exit 1
fi

echo "⚠️  WARNING: This will REPLACE the current database with the backup!"
echo "   All current data will be lost."
read -p "   Are you sure you want to continue? (yes/no): " -r
if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    echo "❌ Restore cancelled by user"
    exit 1
fi

echo "📊 Stopping database container..."
docker compose stop db

echo "🗑️  Cleaning existing database data..."
# Remove existing database files (but keep the directory structure)
sudo rm -rf data/mysql/dtic_bitacoras_php/*
sudo rm -rf data/mysql/ibdata1
sudo rm -rf data/mysql/ibtmp1

echo "🔄 Restarting database container to recreate base structure..."
docker compose start db

echo "⏳ Waiting for database to initialize..."
sleep 15

echo "📥 Restoring database from backup..."
# Restore from compressed backup
gunzip -c "$BACKUP_FILE" | docker exec -i "$CONTAINER_NAME" mysql -u "$DB_USER" -p"$DB_PASS" "$DB_NAME"

echo "🔍 Verifying restore..."
# Quick verification - check if tables exist
TABLE_COUNT=$(docker exec "$CONTAINER_NAME" mysql -u "$DB_USER" -p"$DB_PASS" -e "USE $DB_NAME; SHOW TABLES;" | wc -l)
if [ "$TABLE_COUNT" -gt 1 ]; then  # More than header line
    echo "✅ Database restore completed successfully"
    echo "📊 Tables restored: $((TABLE_COUNT - 1))"
else
    echo "❌ Error: Database restore may have failed - no tables found"
    exit 1
fi

echo ""
echo "🎉 Database restore process completed successfully!"
echo "💾 Database has been restored from: $BACKUP_FILE"
echo ""
echo "💡 You can now start using the application with the restored data."