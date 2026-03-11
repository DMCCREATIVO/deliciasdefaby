# Guía MCP PocketBase - Delicias de Faby

## Herramientas MCP disponibles

El servidor MCP de PocketBase está conectado y permite:

### Lectura (funcionando)
- **`pb_get_health`** – Estado del servidor (ONLINE)
- **`pb_list_collections`** – Colecciones: products, categories, orders, etc.
- **`pb_list_records`** – Listar registros de cualquier colección

### Escritura
- **`pb_create_record`** – Crear registros
- **`pb_update_record`** – Actualizar registros (requiere formato correcto)
- **`pb_delete_record`** – Eliminar registros

### Otras
- **`pb_sync_schema`** – Sincronizar esquema de colecciones
- **`pb_archive_now`** – Crear backup local
- **`pb_list_archives`** – Listar backups

## Estado actual (verificado)

- ✅ Servidor: ONLINE
- ✅ Colecciones: 19 (products, categories, orders, etc.)
- ✅ Productos: 25 en base de datos (todos inactivos antes de activar)
- ✅ Categorías: 5 (Panes, Pasteles, Galletas, Postres, Bebidas)

## Activación de productos

Si `pb_update_record` no está disponible o falla:

1. **Opción A – Página admin:**  
   http://localhost:5173/admin/activar-productos

2. **Opción B – Script MCP alternativo:**
   ```bash
   node activar-productos-mcp.mjs
   ```

3. **Opción C – Script original:**
   ```bash
   node activar-productos.mjs
   ```
   (Puede requerir reglas de API que permitan PATCH sin auth)

## Ejemplo de uso del MCP

```
Listar productos:
  pb_list_records(collection: "products", perPage: 50)

Listar categorías:
  pb_list_records(collection: "categories")
```

## Última verificación

- Fecha: 2026-02-26
- Productos: 25
- Categorías: 5
