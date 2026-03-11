#!/bin/bash

LOG_FILE="/tmp/deliciasdefaby-server.log"

echo "🚀 Iniciando servidor de Delicias de Faby en puerto 3000..." | tee "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

# Ir al directorio del proyecto
cd /Users/oscar/Desktop/deliciasdefaby || exit 1

# Matar procesos previos en puerto 3000
echo "🧹 Limpiando puerto 3000..." | tee -a "$LOG_FILE"
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

# Esperar un momento
sleep 2

# Información del sistema
echo "✅ Iniciando Vite..." | tee -a "$LOG_FILE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"
echo "📍 Directorio: $(pwd)" | tee -a "$LOG_FILE"
echo "🔌 Backend: PocketBase" | tee -a "$LOG_FILE"
echo "🌐 URL PocketBase: https://clientes-pocketbasedeliciasdefaby.4dgggl.easypanel.host" | tee -a "$LOG_FILE"
echo "🚪 Puerto: 3000" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"
echo "⏳ Iniciando servidor..." | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"
echo "📝 Log guardado en: $LOG_FILE" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

# Ejecutar npm run dev y guardar salida
npm run dev 2>&1 | tee -a "$LOG_FILE"
