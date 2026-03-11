#!/bin/bash

echo "🚀 Iniciando servidor de Delicias de Faby..."
echo ""

# Ir al directorio del proyecto
cd /Users/oscar/Desktop/deliciasdefaby || exit 1

# Matar procesos previos en puerto 3000
echo "🧹 Limpiando puerto 3000..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

# Esperar un momento
sleep 2

# Iniciar el servidor
echo "✅ Iniciando Vite..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📍 Directorio: $(pwd)"
echo "🔌 Backend: PocketBase"
echo "🌐 URL PocketBase: https://clientes-pocketbasedeliciasdefaby.4dgggl.easypanel.host"
echo ""
echo "⏳ Iniciando servidor..."
echo ""

# Ejecutar npm run dev
exec npm run dev
