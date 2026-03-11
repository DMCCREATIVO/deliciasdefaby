#!/bin/bash

echo "🚀 Iniciando Delicias de Faby en puerto 3000..."
echo ""

# Limpiar puerto 3000
echo "🧹 Limpiando puerto 3000..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
sleep 1

# Ir al directorio
cd /Users/oscar/Desktop/deliciasdefaby

# Iniciar servidor
echo "✅ Iniciando servidor..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
npm run dev
