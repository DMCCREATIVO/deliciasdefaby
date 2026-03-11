# 🚀 Guía de Solución para Problemas de Despliegue

## 🔍 **Problemas Identificados y Soluciones**

### **1. Página en Blanco en Dokplay**
**Causas comunes:**
- Variables de entorno mal configuradas
- Problemas con React Router
- Errores de build
- Conexión fallida con Supabase

### **2. Problemas con aPanel**
**Causas comunes:**
- Restricciones del hosting compartido
- Falta de permisos para Git
- Limitaciones de memoria/CPU

## 🐳 **Solución Recomendada: Docker Mejorado**

### **Paso 1: Preparar el Entorno**

```bash
# 1. Verificar que tienes Docker instalado
docker --version

# 2. Si no tienes Docker, instálalo:
# En Ubuntu/Debian:
sudo apt update && sudo apt install docker.io docker-compose

# En CentOS/RHEL:
sudo yum install docker docker-compose

# En macOS:
# Descargar Docker Desktop desde https://docker.com
```

### **Paso 2: Configurar Variables de Entorno**

```bash
# 1. Crear archivo .env con tus datos reales
cp env.example .env

# 2. Editar .env con tus credenciales de Supabase
nano .env
```

**Contenido mínimo del .env:**
```env
# OBLIGATORIAS - Reemplaza con tus datos reales
VITE_SUPABASE_URL=https://czqclqgwpcvdevhxntie.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anon-real-de-supabase

# OPCIONALES
VITE_APP_NAME=Delicias de Faby
VITE_APP_URL=https://tu-dominio.com
VITE_WHATSAPP_NUMBER=+56912345678
```

### **Paso 3: Desplegar con Docker**

```bash
# Usar el script mejorado
./deploy-docker.sh

# O paso a paso:
./deploy-docker.sh cleanup    # Limpiar contenedores anteriores
./deploy-docker.sh build     # Solo construir imagen
./deploy-docker.sh           # Despliegue completo
```

### **Paso 4: Verificar el Despliegue**

```bash
# Ver logs en tiempo real
./deploy-docker.sh logs

# Verificar estado del contenedor
docker ps

# Probar la aplicación
curl http://localhost/health
```

## 🌐 **Alternativa: Despliegue en Hosting Tradicional**

Si prefieres no usar Docker, aquí está la solución para hosting tradicional:

### **Opción A: Build Local + Upload**

```bash
# 1. Instalar dependencias
npm install

# 2. Crear .env con tus datos
cp env.example .env
# Editar .env con tus credenciales

# 3. Construir la aplicación
npm run build

# 4. Subir la carpeta 'dist' a tu hosting
# Usar FTP, SFTP, o panel de control del hosting
```

### **Opción B: Usar GitHub Actions (Automático)**

Crear `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Hosting

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      env:
        VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
        VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
        
    - name: Deploy to hosting
      uses: SamKirkland/FTP-Deploy-Action@4.3.3
      with:
        server: tu-servidor-ftp.com
        username: ${{ secrets.FTP_USERNAME }}
        password: ${{ secrets.FTP_PASSWORD }}
        local-dir: ./dist/
```

## 🔧 **Configuración de Nginx para Hosting**

Si usas hosting con Nginx, crea/edita `.htaccess` o configuración:

```nginx
# Para Apache (.htaccess)
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Para Nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

## 🐛 **Solución de Problemas Específicos**

### **Página en Blanco**

1. **Verificar variables de entorno:**
```bash
# En el contenedor Docker
docker exec -it dmc-catalogo env | grep VITE

# En build local
cat .env
```

2. **Verificar logs del navegador:**
- Abrir DevTools (F12)
- Ir a Console
- Buscar errores en rojo

3. **Verificar conexión a Supabase:**
```bash
# Probar conexión
curl -H "apikey: tu-anon-key" https://czqclqgwpcvdevhxntie.supabase.co/rest/v1/
```

### **Problemas de Rutas (404)**

1. **Verificar configuración de servidor:**
- Asegurar que todas las rutas apunten a `index.html`
- Configurar correctamente el servidor web

2. **Verificar build:**
```bash
# Verificar que el build se completó
ls -la dist/
cat dist/index.html
```

### **Problemas de Memoria/Performance**

1. **Optimizar Docker:**
```bash
# Usar menos memoria
docker run -d --memory="256m" --cpus="0.5" ...
```

2. **Optimizar build:**
```bash
# Build con menos memoria
NODE_OPTIONS="--max-old-space-size=2048" npm run build
```

## 📱 **Despliegue en Plataformas Cloud**

### **Vercel (Recomendado para React)**

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Configurar variables de entorno en Vercel dashboard
# 3. Desplegar
vercel --prod
```

### **Netlify**

```bash
# 1. Instalar Netlify CLI
npm i -g netlify-cli

# 2. Build y deploy
npm run build
netlify deploy --prod --dir=dist
```

### **Railway**

```bash
# 1. Conectar repositorio en railway.app
# 2. Configurar variables de entorno
# 3. Deploy automático desde Git
```

## 🆘 **Comandos de Emergencia**

```bash
# Ver todos los logs
./deploy-docker.sh logs

# Reiniciar completamente
./deploy-docker.sh cleanup
./deploy-docker.sh

# Acceder al contenedor
docker exec -it dmc-catalogo sh

# Ver uso de recursos
docker stats dmc-catalogo

# Backup de la imagen
docker save dmc-catalogo:latest > backup.tar
```

## 📞 **Soporte Adicional**

Si sigues teniendo problemas:

1. **Ejecuta el diagnóstico:**
```bash
./deploy-docker.sh logs > debug.log
```

2. **Verifica la configuración:**
```bash
docker inspect dmc-catalogo
```

3. **Prueba en local primero:**
```bash
npm run dev
```

## ✅ **Checklist de Verificación**

- [ ] Docker instalado y funcionando
- [ ] Archivo .env configurado correctamente
- [ ] Variables de Supabase válidas
- [ ] Puerto 80 disponible
- [ ] Suficiente memoria (mínimo 512MB)
- [ ] Conexión a internet estable
- [ ] Permisos de ejecución en scripts

---

**¿Necesitas ayuda específica?** Ejecuta `./deploy-docker.sh logs` y comparte el output para diagnóstico detallado. 