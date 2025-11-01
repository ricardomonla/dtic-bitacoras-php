#!/bin/bash

# Script de instalación y despliegue para DTIC Bitácoras
# Versión: 1.0
# Fecha: 2025-11-01

set -e  # Salir en caso de error

echo "🚀 Iniciando instalación de DTIC Bitácoras..."

# Verificar requisitos previos
echo "📋 Verificando requisitos previos..."

# Verificar Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado. Por favor instala Docker primero."
    exit 1
fi

# Verificar Docker Compose
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose no está instalado. Por favor instala Docker Compose primero."
    exit 1
fi

echo "✅ Docker y Docker Compose están disponibles"

# Verificar puertos disponibles
echo "🔍 Verificando disponibilidad de puertos..."

# Función para verificar puerto
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  Puerto $port está en uso. Verificando si es de esta aplicación..."
        # Si es un contenedor de esta aplicación, podemos continuar
        if docker ps --format "table {{.Names}}" | grep -q "dtic_bitacoras"; then
            echo "✅ Puerto $port está siendo usado por esta aplicación, continuando..."
        else
            echo "❌ Puerto $port está ocupado por otra aplicación. Por favor libera el puerto o cambia la configuración."
            exit 1
        fi
    else
        echo "✅ Puerto $port está disponible"
    fi
}

check_port 5432
check_port 3001
check_port 5173

# Crear directorios necesarios
echo "📁 Creando directorios necesarios..."
mkdir -p logs
mkdir -p backups

# Configurar permisos
echo "🔐 Configurando permisos..."
chmod +x setup.sh
chmod +x deploy.sh 2>/dev/null || true

# Verificar archivos de configuración
echo "⚙️  Verificando configuración..."

if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Archivo docker-compose.yml no encontrado"
    exit 1
fi

if [ ! -f "docker/init.sql" ]; then
    echo "❌ Archivo docker/init.sql no encontrado"
    exit 1
fi

echo "✅ Archivos de configuración encontrados"

# Crear archivo .env si no existe
if [ ! -f ".env" ]; then
    echo "📝 Creando archivo .env con configuración por defecto..."
    cat > .env << EOF
# Configuración de DTIC Bitácoras
NODE_ENV=development
POSTGRES_DB=dtic_bitacoras
POSTGRES_USER=dtic_user
POSTGRES_PASSWORD=dtic_password
DATABASE_URL=postgresql://dtic_user:dtic_password@postgres:5432/dtic_bitacoras
JWT_SECRET=your-super-secret-jwt-key-change-in-production
PORT=3001
EOF
    echo "✅ Archivo .env creado"
else
    echo "✅ Archivo .env ya existe"
fi

# Crear archivo .env para frontend si no existe
if [ ! -f "frontend/.env" ]; then
    echo "📝 Creando archivo frontend/.env..."
    cat > frontend/.env << EOF
VITE_API_URL=http://localhost:3001/api
EOF
    echo "✅ Archivo frontend/.env creado"
else
    echo "✅ Archivo frontend/.env ya existe"
fi

echo ""
echo "🎉 Instalación completada exitosamente!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Revisar la configuración en los archivos .env si es necesario"
echo "2. Ejecutar: docker-compose up --build"
echo "3. Acceder a la aplicación:"
echo "   - Frontend: http://localhost:5173"
echo "   - API: http://localhost:3001"
echo "   - Base de datos: localhost:5432"
echo ""
echo "🔧 Comandos útiles:"
echo "  - Ver logs: docker-compose logs -f"
echo "  - Reiniciar: docker-compose restart"
echo "  - Detener: docker-compose down"
echo "  - Limpiar: docker-compose down -v"
echo ""