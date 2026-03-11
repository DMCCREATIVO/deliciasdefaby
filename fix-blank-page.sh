#!/bin/bash

# ===================================================================
# SCRIPT PARA DIAGNOSTICAR Y RESOLVER PÁGINA EN BLANCO
# ===================================================================

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() { echo -e "${GREEN}[$(date +'%H:%M:%S')] $1${NC}"; }
error() { echo -e "${RED}[ERROR] $1${NC}"; }
warning() { echo -e "${YELLOW}[WARNING] $1${NC}"; }
info() { echo -e "${BLUE}[INFO] $1${NC}"; }

# Función para verificar variables de entorno
check_env_vars() {
    log "🔍 Verificando variables de entorno..."
    
    if [ ! -f .env ]; then
        warning "Archivo .env no encontrado. Creando uno..."
        cp env.production.example .env
        info "✅ Archivo .env creado. Editando..."
        nano .env || vi .env
    fi
    
    source .env
    
    # Verificar variables críticas
    if [ -z "$VITE_SUPABASE_URL" ] || [ "$VITE_SUPABASE_URL" = "https://your-project.supabase.co" ]; then
        error "❌ VITE_SUPABASE_URL no configurada correctamente"
        return 1
    fi
    
    if [ -z "$VITE_SUPABASE_ANON_KEY" ] || [ "$VITE_SUPABASE_ANON_KEY" = "your-supabase-anon-key" ]; then
        error "❌ VITE_SUPABASE_ANON_KEY no configurada correctamente"
        return 1
    fi
    
    log "✅ Variables de entorno OK"
    return 0
}

# Función para probar conexión a Supabase
test_supabase_connection() {
    log "🔗 Probando conexión a Supabase..."
    
    source .env
    
    # Probar endpoint de Supabase
    if curl -s -f -H "apikey: $VITE_SUPABASE_ANON_KEY" "$VITE_SUPABASE_URL/rest/v1/" > /dev/null; then
        log "✅ Conexión a Supabase OK"
        return 0
    else
        error "❌ No se puede conectar a Supabase"
        error "   URL: $VITE_SUPABASE_URL"
        error "   Verifica que la URL y la clave sean correctas"
        return 1
    fi
}

# Función para verificar el build
check_build() {
    log "🔨 Verificando build de la aplicación..."
    
    # Limpiar build anterior
    rm -rf dist/
    
    # Instalar dependencias si es necesario
    if [ ! -d node_modules ]; then
        log "📦 Instalando dependencias..."
        npm install
    fi
    
    # Construir aplicación
    log "🏗️ Construyendo aplicación..."
    if npm run build; then
        log "✅ Build completado exitosamente"
        
        # Verificar archivos generados
        if [ -f dist/index.html ]; then
            log "✅ index.html generado correctamente"
            
            # Verificar que el HTML no esté vacío
            if [ -s dist/index.html ]; then
                log "✅ index.html tiene contenido"
                return 0
            else
                error "❌ index.html está vacío"
                return 1
            fi
        else
            error "❌ index.html no fue generado"
            return 1
        fi
    else
        error "❌ Error en el build"
        return 1
    fi
}

# Función para crear un servidor de prueba local
test_local_server() {
    log "🌐 Iniciando servidor local de prueba..."
    
    # Verificar que existe el build
    if [ ! -f dist/index.html ]; then
        error "❌ No existe build. Ejecuta primero el build."
        return 1
    fi
    
    # Iniciar servidor simple con Python
    cd dist
    
    info "🚀 Servidor iniciado en http://localhost:8000"
    info "   Presiona Ctrl+C para detener"
    info "   Abre tu navegador y verifica que la página carga correctamente"
    
    # Usar Python 3 si está disponible, sino Python 2
    if command -v python3 &> /dev/null; then
        python3 -m http.server 8000
    elif command -v python &> /dev/null; then
        python -m SimpleHTTPServer 8000
    else
        error "❌ Python no está instalado. No se puede iniciar servidor de prueba."
        return 1
    fi
}

# Función para generar un build optimizado
create_optimized_build() {
    log "⚡ Creando build optimizado..."
    
    # Limpiar completamente
    rm -rf dist/ node_modules/.cache/
    
    # Variables de optimización
    export NODE_OPTIONS="--max-old-space-size=4096"
    export GENERATE_SOURCEMAP=false
    export VITE_BUILD_SOURCEMAP=false
    
    # Build optimizado
    if npm run build; then
        log "✅ Build optimizado completado"
        
        # Mostrar estadísticas del build
        info "📊 Estadísticas del build:"
        du -sh dist/
        ls -la dist/
        
        return 0
    else
        error "❌ Error en build optimizado"
        return 1
    fi
}

# Función para crear imagen Docker de prueba
test_docker_build() {
    log "🐳 Probando build con Docker..."
    
    # Verificar Docker
    if ! command -v docker &> /dev/null; then
        warning "Docker no está instalado. Saltando prueba Docker."
        return 0
    fi
    
    # Construir imagen de prueba
    if docker build -t dmc-test . --no-cache; then
        log "✅ Imagen Docker construida exitosamente"
        
        # Ejecutar contenedor de prueba
        log "🚀 Iniciando contenedor de prueba..."
        docker run -d --name dmc-test -p 8080:80 dmc-test
        
        # Esperar un momento
        sleep 5
        
        # Probar conexión
        if curl -f http://localhost:8080/health &>/dev/null; then
            log "✅ Contenedor Docker funcionando correctamente"
            info "🌐 Prueba en: http://localhost:8080"
            
            # Limpiar
            docker stop dmc-test
            docker rm dmc-test
            
            return 0
        else
            error "❌ Contenedor Docker no responde"
            
            # Mostrar logs para debug
            docker logs dmc-test
            
            # Limpiar
            docker stop dmc-test
            docker rm dmc-test
            
            return 1
        fi
    else
        error "❌ Error al construir imagen Docker"
        return 1
    fi
}

# Función para mostrar diagnóstico completo
show_diagnostic() {
    log "📋 Diagnóstico completo del sistema:"
    echo ""
    
    info "🖥️  Sistema:"
    echo "   OS: $(uname -s)"
    echo "   Arquitectura: $(uname -m)"
    
    info "📦 Node.js:"
    if command -v node &> /dev/null; then
        echo "   Versión: $(node --version)"
    else
        echo "   ❌ No instalado"
    fi
    
    info "📦 NPM:"
    if command -v npm &> /dev/null; then
        echo "   Versión: $(npm --version)"
    else
        echo "   ❌ No instalado"
    fi
    
    info "🐳 Docker:"
    if command -v docker &> /dev/null; then
        echo "   Versión: $(docker --version)"
        if docker info &> /dev/null; then
            echo "   Estado: ✅ Funcionando"
        else
            echo "   Estado: ❌ No ejecutándose"
        fi
    else
        echo "   ❌ No instalado"
    fi
    
    info "📁 Proyecto:"
    echo "   Directorio: $(pwd)"
    echo "   .env existe: $([ -f .env ] && echo "✅ Sí" || echo "❌ No")"
    echo "   node_modules existe: $([ -d node_modules ] && echo "✅ Sí" || echo "❌ No")"
    echo "   dist existe: $([ -d dist ] && echo "✅ Sí" || echo "❌ No")"
    
    if [ -f package.json ]; then
        info "📋 Scripts disponibles:"
        npm run | grep -E "^  [a-z]" | head -10
    fi
}

# Función principal
main() {
    log "🚀 Iniciando diagnóstico de página en blanco..."
    echo ""
    
    # Mostrar diagnóstico del sistema
    show_diagnostic
    echo ""
    
    # Verificar variables de entorno
    if ! check_env_vars; then
        error "❌ Problema con variables de entorno. Configúralas y vuelve a intentar."
        exit 1
    fi
    
    # Probar conexión a Supabase
    if ! test_supabase_connection; then
        error "❌ Problema con conexión a Supabase. Verifica las credenciales."
        exit 1
    fi
    
    # Verificar build
    if ! check_build; then
        error "❌ Problema con el build. Revisa los errores anteriores."
        exit 1
    fi
    
    log "🎉 ¡Diagnóstico completado! Todo parece estar bien."
    echo ""
    info "🔧 Opciones disponibles:"
    echo "   1. ./fix-blank-page.sh test-local    # Probar servidor local"
    echo "   2. ./fix-blank-page.sh test-docker   # Probar con Docker"
    echo "   3. ./fix-blank-page.sh optimize      # Build optimizado"
    echo "   4. ./fix-blank-page.sh diagnostic    # Solo diagnóstico"
}

# Manejo de argumentos
case "${1:-}" in
    "test-local")
        test_local_server
        ;;
    "test-docker")
        test_docker_build
        ;;
    "optimize")
        create_optimized_build
        ;;
    "diagnostic")
        show_diagnostic
        ;;
    "env")
        check_env_vars
        ;;
    "supabase")
        test_supabase_connection
        ;;
    *)
        main
        ;;
esac 