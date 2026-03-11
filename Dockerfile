# ── Etapa 1: Build ──────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar dependencias
COPY package.json package-lock.json* ./
RUN npm ci --prefer-offline

# Copiar código fuente
COPY . .

# Variables de entorno para el build (se inyectan en build time)
ARG VITE_POCKETBASE_URL
ARG VITE_APP_NAME
ARG VITE_APP_URL
ARG VITE_BACKEND=pocketbase

ENV VITE_POCKETBASE_URL=$VITE_POCKETBASE_URL
ENV VITE_APP_NAME=$VITE_APP_NAME
ENV VITE_APP_URL=$VITE_APP_URL
ENV VITE_BACKEND=$VITE_BACKEND

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