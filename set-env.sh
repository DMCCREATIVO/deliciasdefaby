#!/bin/bash

# Script para cambiar entre entornos de desarrollo y producción

echo "🔄 Configurando entorno..."

case "$1" in
    "prod"|"production")
        echo "🚀 Configurando para PRODUCCIÓN"
        cp .env.prod .env
        echo "✅ Entorno de producción configurado"
        echo "📍 Base de datos: https://bd.deliciasdefaby.cl"
        ;;
    "dev"|"development")
        echo "🛠️ Configurando para DESARROLLO"
        cp .env.dev .env
        echo "✅ Entorno de desarrollo configurado"
        echo "📍 Base de datos: http://localhost:8090"
        ;;
    *)
        echo "❌ Entorno no reconocido"
        echo "Uso: ./set-env.sh [dev|prod]"
        echo ""
        echo "Entornos disponibles:"
        echo "  dev, development  - Desarrollo local"
        echo "  prod, production  - Producción"
        exit 1
        ;;
esac

echo ""
echo "📋 Configuración actual:"
cat .env | grep -E "(VITE_|NODE_)" | sort
