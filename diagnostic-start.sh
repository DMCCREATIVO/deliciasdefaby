#!/bin/bash

# Archivo de log
LOG="/tmp/server-diagnostic.log"
echo "=== Diagnóstico del Servidor - $(date) ===" > "$LOG"
echo "" >> "$LOG"

# Verificar Node y npm
echo "1. Verificando Node.js..." >> "$LOG"
node --version >> "$LOG" 2>&1
echo "" >> "$LOG"

echo "2. Verificando npm..." >> "$LOG"
npm --version >> "$LOG" 2>&1
echo "" >> "$LOG"

# Verificar directorio
echo "3. Directorio actual:" >> "$LOG"
pwd >> "$LOG" 2>&1
echo "" >> "$LOG"

# Verificar package.json
echo "4. Verificando package.json..." >> "$LOG"
if [ -f "package.json" ]; then
    echo "✓ package.json existe" >> "$LOG"
else
    echo "✗ package.json NO existe" >> "$LOG"
fi
echo "" >> "$LOG"

# Verificar node_modules
echo "5. Verificando node_modules..." >> "$LOG"
if [ -d "node_modules" ]; then
    echo "✓ node_modules existe" >> "$LOG"
    echo "   Verificando vite..." >> "$LOG"
    if [ -d "node_modules/vite" ]; then
        echo "   ✓ vite instalado" >> "$LOG"
    else
        echo "   ✗ vite NO instalado" >> "$LOG"
    fi
else
    echo "✗ node_modules NO existe" >> "$LOG"
    echo "   Instalando dependencias..." >> "$LOG"
    npm install >> "$LOG" 2>&1
fi
echo "" >> "$LOG"

# Verificar puerto 3000
echo "6. Verificando puerto 3000..." >> "$LOG"
lsof -i :3000 >> "$LOG" 2>&1
if [ $? -eq 0 ]; then
    echo "⚠ Puerto 3000 está en uso" >> "$LOG"
else
    echo "✓ Puerto 3000 disponible" >> "$LOG"
fi
echo "" >> "$LOG"

# Limpiar puerto si está ocupado
echo "7. Limpiando puerto 3000..." >> "$LOG"
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
sleep 1
echo "✓ Puerto limpiado" >> "$LOG"
echo "" >> "$LOG"

# Intentar iniciar el servidor
echo "8. Iniciando servidor..." >> "$LOG"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" >> "$LOG"
echo "" >> "$LOG"

# Mostrar el log
cat "$LOG"

# Iniciar el servidor
cd /Users/oscar/Desktop/deliciasdefaby
exec npm run dev 2>&1 | tee -a "$LOG"
