# Mi Catálogo - Sistema de Panadería Online

## Descripción del Sistema

Sistema de catálogo online para panadería con gestión de productos, pedidos, favoritos y configuraciones.

### Tecnologías Principales

- **Frontend:**
  - React + TypeScript
  - Tailwind CSS
  - Shadcn/ui (Componentes)
  - React Query (Manejo de estado)
  - React Router (Navegación)
  - Sonner (Notificaciones)

- **Backend:**
  - Supabase (Base de datos y autenticación)
  - Edge Functions (Lógica de servidor)
  - Storage (Almacenamiento de archivos)
  - RLS (Políticas de seguridad)

- **Pagos:**
  - Mercado Pago SDK
  - WhatsApp Business API

## Configuración del Proyecto

### Requisitos Previos

- Node.js 18 o superior
- npm o bun
- Cuenta de Supabase
- Cuenta de Mercado Pago (opcional)

### Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/your-username/dmc-catalogo-what.git
cd dmc-catalogo-what
```

2. Instalar dependencias:
```bash
npm install
# o
bun install
```

3. Configurar variables de entorno:
Copiar el archivo `.env.example` a `.env` y configurar las variables necesarias:
```bash
cp .env.example .env
```

4. Iniciar el servidor de desarrollo:
```bash
npm run dev
# o
bun dev
```

### Rutas de la Aplicación

1. **Públicas**
   - `/` - Inicio
   - `/productos` - Catálogo de productos
   - `/producto/:id` - Detalle de producto
   - `/blog` - Blog
   - `/blog/:id` - Post individual
   - `/contacto` - Formulario de contacto
   - `/quienes-somos` - Información sobre la empresa

2. **Autenticación**
   - `/login` - Inicio de sesión
   - `/register` - Registro de usuario

3. **Panel de Cliente**
   - `/perfil` - Perfil de usuario
   - `/pedidos` - Historial de pedidos
   - `/favoritos` - Productos favoritos

4. **Panel de Administración**
   - `/admin/dashboard` - Panel principal
   - `/admin/productos` - Gestión de productos
   - `/admin/pedidos` - Gestión de pedidos
   - `/admin/categorias` - Gestión de categorías
   - `/admin/blog` - Gestión del blog
   - `/admin/clientes` - Gestión de clientes
   - `/admin/estadisticas` - Estadísticas y reportes
   - `/admin/horarios` - Configuración de horarios
   - `/admin/apariencia` - Personalización del sitio
   - `/admin/configuracion` - Configuración general

## Despliegue

### Construcción para Producción

```bash
npm run build
# o
bun run build
```

Los archivos de producción se generarán en el directorio `dist/`.

### Despliegue con Docker

1. Construir la imagen:
```bash
docker build -t dmc-catalogo .
```

2. Ejecutar el contenedor:
```bash
docker run -p 80:80 dmc-catalogo
```

## Contribución

1. Fork el repositorio
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## Licencia

Distribuido bajo la Licencia MIT. Ver `LICENSE` para más información.