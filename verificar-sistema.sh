#!/bin/bash

echo "🔍 Verificando estado del sistema..."
echo ""

# Verificar PocketBase
echo "📦 PocketBase:"
POCKETBASE_URL="https://bd.deliciasdefaby.cl"
if curl -s -f "$POCKETBASE_URL/api/health" > /dev/null 2>&1; then
    echo "  ✅ PocketBase está funcionando: $POCKETBASE_URL"
else
    echo "  ⚠️  No se puede conectar a PocketBase"
fi
echo ""

# Verificar productos
echo "📊 Verificando datos en PocketBase..."
PRODUCTS_COUNT=$(curl -s "$POCKETBASE_URL/api/collections/products/records" | grep -o '"totalItems":[0-9]*' | grep -o '[0-9]*' || echo "0")
CATEGORIES_COUNT=$(curl -s "$POCKETBASE_URL/api/collections/categories/records" | grep -o '"totalItems":[0-9]*' | grep -o '[0-9]*' || echo "0")

echo "  📦 Productos: $PRODUCTS_COUNT"
echo "  📁 Categorías: $CATEGORIES_COUNT"
echo ""

# Verificar servidor de desarrollo
echo "🌐 Servidor de desarrollo:"
if lsof -ti:3000 > /dev/null 2>&1; then
    PID=$(lsof -ti:3000)
    echo "  ✅ Servidor corriendo en puerto 3000 (PID: $PID)"
    echo "  🌐 URL: http://localhost:3000"
else
    echo "  ⚠️  Servidor no está corriendo"
    echo ""
    echo "  Para iniciar el servidor, ejecuta:"
    echo "  npm run dev"
fi
echo ""

# Verificar archivos de configuración
echo "⚙️  Configuración:"
if [ -f ".env" ]; then
    echo "  ✅ .env existe"
    if grep -q "VITE_POCKETBASE_URL" .env; then
        POCKETBASE_URL_ENV=$(grep "VITE_POCKETBASE_URL" .env | cut -d'=' -f2)
        echo "  📍 PocketBase URL: $POCKETBASE_URL_ENV"
    fi
else
    echo "  ⚠️  .env no encontrado"
fi
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Verificación completa"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
