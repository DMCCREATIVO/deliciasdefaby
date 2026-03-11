#!/bin/bash

echo "🔍 Diagnóstico del Sistema"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Verificar Node.js
echo "1️⃣ Verificando Node.js..."
if command -v node &> /dev/null; then
    echo "   ✅ Node.js encontrado: $(node --version)"
    NODE_PATH=$(which node)
    echo "   📍 Ubicación: $NODE_PATH"
else
    echo "   ❌ Node.js NO encontrado"
    echo ""
    echo "   🔧 SOLUCIÓN: Instala Node.js"
    echo "   👉 Ve a: https://nodejs.org/"
    echo "   👉 Descarga la versión LTS"
    echo "   👉 Instala y reinicia la terminal"
    exit 1
fi

echo ""

# Verificar npm
echo "2️⃣ Verificando npm..."
if command -v npm &> /dev/null; then
    echo "   ✅ npm encontrado: $(npm --version)"
    NPM_PATH=$(which npm)
    echo "   📍 Ubicación: $NPM_PATH"
else
    echo "   ❌ npm NO encontrado"
    exit 1
fi

echo ""

# Verificar directorio
echo "3️⃣ Verificando directorio del proyecto..."
if [ -f "package.json" ]; then
    echo "   ✅ package.json encontrado"
else
    echo "   ❌ package.json NO encontrado"
    echo "   📍 Directorio actual: $(pwd)"
    exit 1
fi

echo ""

# Verificar node_modules
echo "4️⃣ Verificando dependencias..."
if [ -d "node_modules" ]; then
    echo "   ✅ node_modules existe"
else
    echo "   ⚠️  node_modules NO existe"
    echo "   📦 Instalando dependencias..."
    npm install
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ DIAGNÓSTICO COMPLETO"
echo ""
echo "🚀 Iniciando servidor..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Iniciar servidor
npm run dev
