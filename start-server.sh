#!/bin/bash

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🚀 Iniciando Servidor Delicias de Faby${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Directorio del proyecto
PROJECT_DIR="/Users/oscar/Desktop/deliciasdefaby"
LOG_FILE="$PROJECT_DIR/server.log"
PID_FILE="$PROJECT_DIR/server.pid"

# Ir al directorio del proyecto
cd "$PROJECT_DIR" || exit 1

# Función para limpiar procesos anteriores
cleanup() {
    echo -e "${YELLOW}🧹 Limpiando procesos anteriores...${NC}"
    
    # Matar por PID file si existe
    if [ -f "$PID_FILE" ]; then
        OLD_PID=$(cat "$PID_FILE")
        if ps -p "$OLD_PID" > /dev/null 2>&1; then
            echo -e "   Matando proceso $OLD_PID..."
            kill -9 "$OLD_PID" 2>/dev/null || true
        fi
        rm -f "$PID_FILE"
    fi
    
    # Limpiar puerto 3000
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
    
    # Limpiar procesos de vite
    pkill -f "vite" 2>/dev/null || true
    
    sleep 1
    echo -e "${GREEN}   ✓ Limpieza completada${NC}"
}

# Verificar dependencias
check_dependencies() {
    echo -e "${YELLOW}📦 Verificando dependencias...${NC}"
    
    if [ ! -d "node_modules" ]; then
        echo -e "${RED}   ✗ node_modules no encontrado${NC}"
        echo -e "${YELLOW}   Instalando dependencias...${NC}"
        npm install
    else
        echo -e "${GREEN}   ✓ node_modules existe${NC}"
    fi
    
    if [ ! -d "node_modules/vite" ]; then
        echo -e "${RED}   ✗ Vite no encontrado${NC}"
        echo -e "${YELLOW}   Instalando dependencias...${NC}"
        npm install
    else
        echo -e "${GREEN}   ✓ Vite instalado${NC}"
    fi
}

# Limpiar procesos anteriores
cleanup

# Verificar dependencias
check_dependencies

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}📍 Información del Servidor${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "   📂 Directorio: $PROJECT_DIR"
echo -e "   🚪 Puerto: ${GREEN}3000${NC}"
echo -e "   🌐 URL Local: ${GREEN}http://localhost:3000${NC}"
echo -e "   🔌 Backend: PocketBase"
echo -e "   📝 Log: $LOG_FILE"
echo ""

# Iniciar el servidor en background
echo -e "${YELLOW}⏳ Iniciando servidor...${NC}"
echo ""

# Limpiar log anterior
> "$LOG_FILE"

# Iniciar npm run dev en background
nohup npm run dev > "$LOG_FILE" 2>&1 &
SERVER_PID=$!

# Guardar PID
echo "$SERVER_PID" > "$PID_FILE"

echo -e "${GREEN}✓ Servidor iniciado con PID: $SERVER_PID${NC}"
echo ""

# Esperar un momento para que el servidor inicie
echo -e "${YELLOW}⏳ Esperando que el servidor inicie...${NC}"
sleep 3

# Verificar si el proceso sigue corriendo
if ps -p "$SERVER_PID" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Proceso del servidor está corriendo${NC}"
    
    # Mostrar las primeras líneas del log
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}📋 Primeras líneas del log:${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    sleep 2
    head -20 "$LOG_FILE" 2>/dev/null || echo "Log aún no disponible..."
    echo ""
    
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}✅ SERVIDOR INICIADO EXITOSAMENTE${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "   🌐 Abre tu navegador en: ${GREEN}http://localhost:3000${NC}"
    echo ""
    echo -e "   📝 Para ver el log en tiempo real:"
    echo -e "      ${YELLOW}tail -f $LOG_FILE${NC}"
    echo ""
    echo -e "   🛑 Para detener el servidor:"
    echo -e "      ${YELLOW}kill $SERVER_PID${NC}"
    echo -e "      o ejecuta: ${YELLOW}lsof -ti:3000 | xargs kill -9${NC}"
    echo ""
else
    echo -e "${RED}✗ El proceso del servidor se detuvo inesperadamente${NC}"
    echo ""
    echo -e "${YELLOW}Mostrando log de errores:${NC}"
    cat "$LOG_FILE"
    exit 1
fi
