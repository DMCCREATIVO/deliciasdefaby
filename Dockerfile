# ── Etapa 1: Build ──────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar dependencias
COPY package.json package-lock.json* ./
RUN npm ci --prefer-offline

# Copiar código fuente
COPY . .

# Variables de entorno para el build (hardcoded para producción)
ENV VITE_POCKETBASE_URL=https://clientes-pocketbasedeliciasdefaby.4dgggl.easypanel.host
ENV VITE_APP_NAME="Delicias de Faby"
ENV VITE_APP_URL=https://faby-web.4dgggl.easypanel.host
ENV VITE_BACKEND=pocketbase

# Construir la app
RUN npm run build

# ── Etapa 2: Servidor Nginx ──────────────────────────────────────
FROM nginx:alpine AS production

# Copiar la build al directorio de Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración de Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Puerto expuesto
EXPOSE 80

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -qO- http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]