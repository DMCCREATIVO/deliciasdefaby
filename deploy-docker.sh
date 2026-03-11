#!/bin/bash

# ===================================================================
# SCRIPT DE DESPLIEGUE DOCKER MEJORADO
# Para resolver problemas de página en blanco y despliegue
# ===================================================================

set -e  # Salir si hay algún error

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

error() {
    echo -e "${RED}[ERROR] $1${NC}"
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

# Verificar si Docker está instalado
check_docker() {
    if ! command -v docker &> /dev/null; then
        error "Docker no está instalado. Por favor instala Docker primero."
        exit 1
    fi
    
    if ! docker info &> /dev/null; then
        error "Docker no está ejecutándose. Por favor inicia Docker."
        exit 1
    fi
    
    log "✅ Docker está disponible"
}

# Crear archivo .env si no existe
create_env_file() {
    if [ ! -f .env ]; then
        warning "Archivo .env no encontrado. Creando uno con valores por defecto..."
        cp env.example .env
        log "✅ Archivo .env creado. Por favor configura tus variables antes de continuar."
        info "Editando .env con nano..."
        nano .env || vi .env || echo "Por favor edita manualmente el archivo .env"
    else
        log "✅ Archivo .env encontrado"
    fi
}

# Verificar variables de entorno críticas
check_env_vars() {
    if [ -f .env ]; then
        source .env
        
        if [ -z "$VITE_SUPABASE_URL" ] || [ "$VITE_SUPABASE_URL" = "https://your-project.supabase.co" ]; then
            error "VITE_SUPABASE_URL no está configurada correctamente en .env"
            exit 1
        fi
        
        if [ -z "$VITE_SUPABASE_ANON_KEY" ] || [ "$VITE_SUPABASE_ANON_KEY" = "your-supabase-anon-key" ]; then
            error "VITE_SUPABASE_ANON_KEY no está configurada correctamente en .env"
            exit 1
        fi
        
        log "✅ Variables de entorno configuradas correctamente"
    fi
}

# Limpiar contenedores y imágenes anteriores
cleanup_docker() {
    log "🧹 Limpiando contenedores anteriores..."
    
    # Detener contenedores existentes
    docker stop dmc-catalogo 2>/dev/null || true
    docker rm dmc-catalogo 2>/dev/null || true
    
    # Eliminar imagen anterior si existe
    docker rmi dmc-catalogo:latest 2>/dev/null || true
    
    log "✅ Limpieza completada"
}

# Construir imagen Docker
build_image() {
    log "🔨 Construyendo imagen Docker..."
    
    # Construir imagen con cache busting
    docker build \
        --no-cache \
        --tag dmc-catalogo:latest \
        --build-arg BUILDKIT_INLINE_CACHE=1 \
        .
    
    if [ $? -eq 0 ]; then
        log "✅ Imagen construida exitosamente"
    else
        error "❌ Error al construir la imagen"
        exit 1
    fi
}

# Ejecutar contenedor
run_container() {
    log "🚀 Iniciando contenedor..."
    
    # Ejecutar contenedor con configuración optimizada
    docker run -d \
        --name dmc-catalogo \
        --restart unless-stopped \
        -p 80:80 \
        -p 443:443 \
        --env-file .env \
        --memory="512m" \
        --cpus="1.0" \
        dmc-catalogo:latest
    
    if [ $? -eq 0 ]; then
        log "✅ Contenedor iniciado exitosamente"
    else
        error "❌ Error al iniciar el contenedor"
        exit 1
    fi
}

# Verificar que la aplicación esté funcionando
health_check() {
    log "🔍 Verificando estado de la aplicación..."
    
    # Esperar un momento para que el contenedor inicie
    sleep 10
    
    # Verificar health check
    for i in {1..30}; do
        if curl -f http://localhost/health &>/dev/null; then
            log "✅ Aplicación está funcionando correctamente"
            return 0
        fi
        
        info "Esperando que la aplicación inicie... ($i/30)"
        sleep 2
    done
    
    error "❌ La aplicación no responde después de 60 segundos"
    
    # Mostrar logs para debug
    warning "Mostrando logs del contenedor:"
    docker logs dmc-catalogo --tail 50
    
    return 1
}

# Mostrar información de acceso
show_access_info() {
    log "🎉 ¡Despliegue completado exitosamente!"
    echo ""
    echo "📱 Acceso a la aplicación:"
    echo "   🌐 Local: http://localhost"
    echo "   🌐 Red local: http://$(hostname -I | awk '{print $1}')"
    echo ""
    echo "🔧 Comandos útiles:"
    echo "   📊 Ver logs: docker logs dmc-catalogo -f"
    echo "   🔄 Reiniciar: docker restart dmc-catalogo"
    echo "   🛑 Detener: docker stop dmc-catalogo"
    echo "   🗑️  Eliminar: docker rm -f dmc-catalogo"
    echo ""
    echo "🐛 Si ves una página en blanco:"
    echo "   1. Verifica las variables de entorno en .env"
    echo "   2. Revisa los logs: docker logs dmc-catalogo"
    echo "   3. Verifica la conexión a Supabase"
}

# Función principal
main() {
    log "🚀 Iniciando despliegue de DMC Catálogo con Docker"
    echo ""
    
    # Verificaciones previas
    check_docker
    create_env_file
    check_env_vars
    
    # Proceso de despliegue
    cleanup_docker
    build_image
    run_container
    
    # Verificación post-despliegue
    if health_check; then
        show_access_info
    else
        error "El despliegue falló. Revisa los logs para más información."
        exit 1
    fi
}

# Manejo de argumentos
case "${1:-}" in
    "cleanup")
        log "🧹 Solo limpiando contenedores..."
        cleanup_docker
        ;;
    "build")
        log "🔨 Solo construyendo imagen..."
        check_docker
        build_image
        ;;
    "logs")
        log "📊 Mostrando logs..."
        docker logs dmc-catalogo -f
        ;;
    "restart")
        log "🔄 Reiniciando contenedor..."
        docker restart dmc-catalogo
        ;;
    "stop")
        log "🛑 Deteniendo contenedor..."
        docker stop dmc-catalogo
        ;;
    *)
        main
        ;;
esac 