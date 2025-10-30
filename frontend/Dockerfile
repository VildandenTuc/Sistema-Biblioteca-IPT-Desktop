# Dockerfile Multi-Stage para Frontend React + Vite

# ===========================
# Stage 1: Build
# ===========================
FROM node:18-alpine AS build

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci --silent

# Copiar código fuente
COPY . .

# Variables de entorno para build
ENV VITE_API_URL=http://localhost:8080

# Compilar aplicación para producción
RUN npm run build

# ===========================
# Stage 2: Runtime con Nginx
# ===========================
FROM nginx:1.25-alpine

WORKDIR /usr/share/nginx/html

# Remover archivos por defecto de nginx
RUN rm -rf ./*

# Copiar build desde stage anterior
COPY --from=build /app/dist .

# Copiar configuración personalizada de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

# Nginx se ejecuta en foreground por defecto
CMD ["nginx", "-g", "daemon off;"]
