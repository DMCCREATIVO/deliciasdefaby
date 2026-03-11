#!/bin/bash

# Script de despliegue automatizado para Delicias de Faby
# Uso: ./deploy.sh [production|staging]

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para logging
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

# Verificar argumentos
ENVIRONMENT=${1:-production}
if [[ "$ENVIRONMENT" != "production" && "$ENVIRONMENT" != "staging" ]]; then
    error "Ambiente inválido. Usa: production o staging"
fi

log "🚀 Iniciando despliegue para ambiente: $ENVIRONMENT"

# Verificar dependencias
command -v docker >/dev/null 2>&1 || error "Docker no está instalado"
command -v docker-compose >/dev/null 2>&1 || error "Docker Compose no está instalado"

# Verificar archivo .env
if [[ ! -f ".env" ]]; then
    warn "Archivo .env no encontrado. Copiando desde env.example..."
    cp env.example .env
    warn "⚠️  IMPORTANTE: Configura las variables en .env antes de continuar"
    read -p "¿Has configurado el archivo .env? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        error "Configura el archivo .env y ejecuta el script nuevamente"
    fi
fi

# Limpiar builds anteriores
log "🧹 Limpiando builds anteriores..."
rm -rf dist/
docker system prune -f

# Instalar dependencias
log "📦 Instalando dependencias..."
npm ci

# Ejecutar tests (si existen)
if [[ -f "package.json" ]] && grep -q '"test"' package.json; then
    log "🧪 Ejecutando tests..."
    npm run test || warn "Tests fallaron, continuando..."
fi

# Build de la aplicación
log "🔨 Construyendo aplicación..."
npm run build

# Verificar que el build fue exitoso
if [[ ! -d "dist" ]]; then
    error "Build falló - directorio dist no encontrado"
fi

log "✅ Build completado exitosamente"

# Construir imagen Docker
log "🐳 Construyendo imagen Docker..."
docker build -t deliciasdefaby:$ENVIRONMENT .

# Detener contenedores existentes
log "🛑 Deteniendo contenedores existentes..."
docker-compose down || true

# Iniciar nuevos contenedores
log "🚀 Iniciando contenedores..."
if [[ "$ENVIRONMENT" == "production" ]]; then
    docker-compose up -d
else
    docker-compose -f docker-compose.yml -f docker-compose.staging.yml up -d
fi

# Verificar que los contenedores están corriendo
log "🔍 Verificando estado de contenedores..."
sleep 10
if docker-compose ps | grep -q "Up"; then
    log "✅ Contenedores iniciados correctamente"
else
    error "❌ Error al iniciar contenedores"
fi

# Mostrar logs
log "📋 Últimos logs:"
docker-compose logs --tail=20

# Información final
log "🎉 Despliegue completado exitosamente!"
log "🌐 La aplicación está disponible en:"
if [[ "$ENVIRONMENT" == "production" ]]; then
    log "   - http://localhost"
    log "   - https://deliciasdefaby.cl (si está configurado)"
else
    log "   - http://localhost:8080"
fi

log "📊 Para ver logs en tiempo real: docker-compose logs -f"
log "🛑 Para detener: docker-compose down" 