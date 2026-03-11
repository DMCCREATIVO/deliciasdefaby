# 🎯 GUÍA RÁPIDA: Activar y Mostrar Productos

## ✅ Estado Actual

- ✅ **Base de datos:** Conectada correctamente a PocketBase
- ✅ **Productos:** 25 productos encontrados en la base de datos
- ✅ **Servidor web:** Corriendo en http://localhost:5173
- ❌ **Problema:** Productos inactivos (no se muestran en el sitio)

---

## 🚀 Solución en 3 Pasos

### Paso 1: Abrir la Herramienta de Activación
Ya debería estar abierta en tu navegador: **activar-productos.html**

Si no está abierta, haz doble clic en el archivo `activar-productos.html`

### Paso 2: Activar los Productos
En la herramienta web que se abrió:

1. Haz clic en el botón **"📋 Listar Productos"**
   - Verás los 25 productos y su estado actual
   - Todos deberían mostrar ❌ (inactivos)

2. Haz clic en el botón **"✅ Activar Todos"**
   - Esto activará todos los productos
   - Verás mensajes de confirmación para cada producto

3. (Opcional) Haz clic en **"⭐ Destacar Algunos"**
   - Esto marcará los primeros 5 productos como destacados
   - Los destacados aparecen primero en la página principal

### Paso 3: Ver los Productos en el Sitio
1. Abre tu navegador en: **http://localhost:5173**
2. Desplázate hacia abajo hasta la sección "Productos Destacados"
3. ¡Deberías ver todos los productos!

---

## 📸 Qué Esperar

### Antes de activar:
```
Página principal → Sección de productos → "No se encontraron productos"
```

### Después de activar:
```
Página principal → Sección de productos → 25 productos visibles
- Pan Amasado Tradicional - $1,500
- Hallulla Casera - $800
- Marraqueta Artesanal - $1,000
- Pan Integral con Semillas - $2,500
- ... y 21 más
```

---

## 🔍 Verificación

### En la herramienta HTML:
Después de hacer clic en "Activar Todos", deberías ver:
```
📊 Resumen:
   Productos activados: 25
   Ya estaban activos: 0
   Errores: 0
✨ ¡Proceso completado!
```

### En el sitio web:
1. Ve a http://localhost:5173
2. Busca la sección "Productos Destacados"
3. Deberías ver tarjetas de productos con:
   - Título del producto
   - Precio
   - Botón "Agregar al carrito"

---

## ⚠️ Si algo no funciona

### Los productos no se activan:
1. Verifica que PocketBase esté en línea
2. Abre la consola del navegador (F12) y busca errores
3. Intenta activar productos manualmente desde el admin

### Los productos no aparecen en el sitio:
1. Recarga la página con Cmd+Shift+R (Mac) o Ctrl+Shift+R (Windows)
2. Verifica la consola del navegador para errores
3. Asegúrate de que el servidor esté corriendo: `npm run dev`

### Errores de permisos en PocketBase:
1. Ve al panel de admin de PocketBase
2. Colección "products" → Configuración → API Rules
3. Asegúrate de que "Update" permita acceso público o autenticado

---

## 📱 Accesos Rápidos

- **Sitio web:** http://localhost:5173
- **Admin de productos:** http://localhost:5173/admin/productos
- **PocketBase admin:** https://clientes-pocketbasedeliciasdefaby.4dgggl.easypanel.host/_/
- **Herramienta de activación:** activar-productos.html (en esta carpeta)

---

## 💡 Próximos Pasos Recomendados

1. ✅ Activar productos (estás aquí)
2. 📸 Agregar imágenes a los productos
3. 🏷️ Asignar categorías
4. ⭐ Marcar productos destacados
5. 📝 Mejorar descripciones

---

**¿Necesitas ayuda?** Revisa el archivo `CONEXION_BASE_DATOS.md` para más detalles técnicos.
