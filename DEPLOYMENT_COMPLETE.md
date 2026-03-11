# 🚀 Guía Completa de Despliegue - Delicias de Faby

## 📋 Resumen del Estado del Proyecto

✅ **LISTO PARA DESPLIEGUE** - El proyecto tiene todo lo necesario para ser desplegado en producción.

## 🛠️ Opciones de Despliegue Disponibles

### 1. 🐳 **Despliegue con Docker (RECOMENDADO)**

#### Requisitos:
- Docker y Docker Compose instalados
- Servidor con al menos 1GB RAM
- Puerto 80 y 443 disponibles

#### Pasos:
```bash
# 1. Clonar el repositorio
git clone https://github.com/DMCCREATIVO/DmcFaby.git
cd DmcFaby

# 2. Configurar variables de entorno
cp env.example .env
# Editar .env con tus configuraciones

# 3. Desplegar automáticamente
./deploy.sh production
```

### 2. 🌐 **Despliegue en aPanel (Hosting Tradicional)**

#### Pasos:
```bash
# 1. Build local
npm install
npm run build

# 2. Subir carpeta dist/ al servidor
# 3. Configurar Nginx según DEPLOYMENT.md
```

### 3. ☁️ **Despliegue en Vercel/Netlify (Jamstack)**

#### Vercel:
```bash
npm install -g vercel
vercel --prod
```

#### Netlify:
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

## 🔧 Configuración Requerida

### Variables de Entorno (.env)
```env
# OBLIGATORIAS
VITE_SUPABASE_URL=https://czqclqgwpcvdevhxntie.supabase.co
VITE_SUPABASE_ANON_KEY=tu-supabase-anon-key

# OPCIONALES
VITE_MERCADOPAGO_PUBLIC_KEY=tu-mercadopago-key
VITE_WHATSAPP_NUMBER=+56912345678
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

### Configuración de Supabase
1. **Base de datos**: Ya configurada con todas las tablas
2. **RLS**: Políticas de seguridad implementadas
3. **Storage**: Bucket 'products' configurado
4. **Edge Functions**: Funciones RPC implementadas

## 📁 Archivos de Despliegue Incluidos

- ✅ `Dockerfile` - Imagen Docker optimizada
- ✅ `docker-compose.yml` - Orquestación de contenedores
- ✅ `nginx.conf` - Configuración de servidor web
- ✅ `deploy.sh` - Script de despliegue automatizado
- ✅ `.dockerignore` - Optimización de build
- ✅ `DEPLOYMENT.md` - Instrucciones detalladas
- ✅ `env.example` - Plantilla de variables

## 🚀 Despliegue Rápido (1 Comando)

```bash
# Despliegue completo automatizado
./deploy.sh production
```

Este script:
1. ✅ Verifica dependencias
2. ✅ Instala paquetes
3. ✅ Construye la aplicación
4. ✅ Crea imagen Docker
5. ✅ Inicia contenedores
6. ✅ Verifica funcionamiento

## 🔍 Verificación Post-Despliegue

### Checklist de Funcionamiento:
- [ ] Página principal carga correctamente
- [ ] Navegación entre secciones funciona
- [ ] Blog muestra posts dinámicamente
- [ ] Productos se cargan desde Supabase
- [ ] Dashboard admin accesible
- [ ] Formularios de contacto funcionan
- [ ] Imágenes se cargan correctamente
- [ ] Responsive design en móviles

### Comandos de Monitoreo:
```bash
# Ver logs en tiempo real
docker-compose logs -f

# Estado de contenedores
docker-compose ps

# Uso de recursos
docker stats

# Reiniciar servicios
docker-compose restart
```

## 🛡️ Seguridad y SSL

### Para Producción:
1. **SSL Certificate**: Usar Let's Encrypt o certificado propio
2. **Firewall**: Configurar puertos 80, 443, 22
3. **Updates**: Mantener Docker y sistema actualizados
4. **Backups**: Configurar respaldos automáticos

### Nginx Proxy Manager (Incluido):
```bash
# Activar proxy con SSL automático
docker-compose --profile proxy up -d
# Acceder a: http://tu-servidor:81
```

## 📊 Monitoreo y Mantenimiento

### Logs Importantes:
- **Aplicación**: `docker-compose logs web`
- **Nginx**: `docker-compose logs nginx-proxy`
- **Sistema**: `journalctl -u docker`

### Actualizaciones:
```bash
# Actualizar código
git pull origin main
./deploy.sh production

# Actualizar dependencias
npm update
npm run build
docker-compose up -d --build
```

## 🆘 Solución de Problemas

### Problemas Comunes:

1. **Puerto ocupado**:
   ```bash
   sudo lsof -i :80
   sudo systemctl stop apache2  # Si existe
   ```

2. **Memoria insuficiente**:
   ```bash
   # Aumentar swap
   sudo fallocate -l 2G /swapfile
   sudo chmod 600 /swapfile
   sudo mkswap /swapfile
   sudo swapon /swapfile
   ```

3. **Permisos Docker**:
   ```bash
   sudo usermod -aG docker $USER
   newgrp docker
   ```

## 🎯 Rendimiento Optimizado

### Características Incluidas:
- ✅ **Gzip compression** habilitado
- ✅ **Cache headers** configurados
- ✅ **Static assets** optimizados
- ✅ **Image optimization** implementado
- ✅ **Bundle splitting** automático
- ✅ **Lazy loading** en componentes

## 📞 Soporte

Para problemas de despliegue:
1. Revisar logs: `docker-compose logs`
2. Verificar configuración: `cat .env`
3. Comprobar puertos: `netstat -tlnp`
4. Reiniciar servicios: `./deploy.sh production`

---

## ✨ Resumen Final

**El proyecto está 100% listo para producción** con:
- 🐳 Docker containerizado
- 🔒 Configuración de seguridad
- 📱 Diseño responsive
- ⚡ Optimización de rendimiento
- 🛠️ Scripts de automatización
- 📊 Monitoreo incluido

**¡Solo necesitas configurar las variables de entorno y ejecutar `./deploy.sh production`!** 