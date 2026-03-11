# 🚀 Configurar Base de Datos PocketBase

## Estado Actual
✅ **La aplicación está funcionando** con productos de ejemplo  
❌ **PocketBase necesita configuración** para productos reales

## 📋 Pasos para Configurar PocketBase

### 1. Acceder al Panel de Administración
Ve a: https://clientes-pocketbasedeliciasdefaby.4dgggl.easypanel.host/_/

### 2. Iniciar Sesión
Usa las credenciales de administrador que te proporcionaron

### 3. Crear Colección `products`
1. Ve a **Settings** → **Collections**
2. Haz clic en **New Collection**
3. Configura así:

#### Configuración Básica
- **Name**: `products`
- **Type**: `Base`

#### Esquema (Schema)
Agrega estos campos:

| Campo | Tipo | Requerido | Opciones |
|-------|------|------------|----------|
| title | Text | ✅ | Max: 200 |
| description | Text | ❌ | - |
| short_description | Text | ❌ | - |
| price | Number | ✅ | Min: 0 |
| compare_at_price | Number | ❌ | Min: 0 |
| weight | Number | ❌ | Min: 0 |
| stock | Number | ✅ | Min: 0 |
| category_id | Relation | ❌ | Max select: 1, Collection: categories |
| images | File | ❌ | Max select: 10, Max size: 5MB |
| is_active | Bool | ❌ | Default: true |
| is_featured | Bool | ❌ | Default: false |
| available_days | Text | ❌ | - |

#### Reglas de Acceso (API Rules)
- **List rule**: `id != "" && is_active = true`
- **View rule**: `id != "" && is_active = true`
- **Create rule**: `@request.auth.role = "admin"`
- **Update rule**: `@request.auth.role = "admin"`
- **Delete rule**: `@request.auth.role = "admin"`

### 4. Crear Colección `categories` (opcional)
Si quieres categorías:

#### Configuración Básica
- **Name**: `categories`
- **Type**: `Base`

#### Esquema
| Campo | Tipo | Requerido |
|-------|------|------------|
| name | Text | ✅ |
| description | Text | ❌ |
| image | File | ❌ |
| is_active | Bool | ❌ |
| sort_order | Number | ❌ |

### 5. Agregar Productos de Ejemplo
Una vez creada la colección, agrega estos productos:

#### Productos Destacados
1. **Pastel de Chocolate** - $8.500
   - Descripción: Delicioso pastel de chocolate con tres leches
   - Stock: 10
   - Destacado: ✅

2. **Cheesecake de Frutos Rojos** - $9.200
   - Descripción: Clásico cheesecake con salsa de frutos rojos
   - Stock: 6
   - Destacado: ✅

3. **Tiramisú Clásico** - $6.800
   - Descripción: Auténtico tiramisú italiano con café y mascarpone
   - Stock: 12
   - Destacado: ✅

#### Productos Regulares
4. **Torta de Merengue** - $7.200
   - Descripción: Ligera torta de merengue con frutas frescas
   - Stock: 8
   - Destacado: ❌

5. **Brownie con Nueces** - $4.500
   - Descripción: Húmedo brownie de chocolate con nueces
   - Stock: 15
   - Destacado: ❌

## 🔄 Verificar Configuración

Una vez configurado, la aplicación automáticamente detectará los productos reales y dejará de mostrar los de ejemplo.

### Para verificar:
1. Inicia la aplicación: `npm run dev`
2. Ve a la página de productos
3. Deberías ver los productos reales en lugar de los de ejemplo

## 🆘 Problemas Comunes

### Error 400: "Failed to create record"
- **Causa**: La colección no existe o los campos no coinciden
- **Solución**: Verifica que la colección `products` exista con todos los campos requeridos

### Error 401: "Requires valid record authorization token"
- **Causa**: Las reglas de acceso son muy restrictivas
- **Solución**: Ajusta las reglas según la tabla anterior

### No aparecen los productos
- **Causa**: Los productos están marcados como `is_active = false`
- **Solución**: Verifica que los productos estén activos

## 📞 Soporte

Si tienes problemas:
1. Verifica los logs en la consola del navegador
2. Revisa que la URL de PocketBase sea correcta
3. Confirma que las credenciales de admin funcionen

---

**✅ Una vez completados estos pasos, tu tienda estará funcionando con productos reales!**
