#!/bin/bash

# Matar cualquier proceso node existente
echo "Matando procesos node existentes..."
killall -9 node || true

# Matar cualquier proceso en los puertos 3000-3010
echo "Liberando puertos 3000-3010..."
for port in {3000..3010}; do
  pid=$(lsof -t -i:$port) || true
  if [ ! -z "$pid" ]; then
    echo "Matando proceso en puerto $port (PID: $pid)..."
    kill -9 $pid || true
  fi
done

# Limpiar caché
echo "Limpiando caché de npm..."
npm cache clean --force

# Limpiar node_modules/.vite
echo "Limpiando caché de vite..."
rm -rf node_modules/.vite

# Ejecutar el servidor con más memoria y límites de CPU
echo "Iniciando servidor de desarrollo con más recursos..."
NODE_OPTIONS="--max-old-space-size=8192" npm run dev 