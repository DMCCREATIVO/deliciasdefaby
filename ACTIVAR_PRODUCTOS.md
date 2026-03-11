# 🔧 Instrucciones para Activar Productos en PocketBase

## ⚠️ Problema Actual

Los productos están creados en PocketBase pero tienen dos problemas:
1. **`is_active: false`** - No se mostrarán en la página
2. **`category_id: ""`** - No tienen categoría asignada

## ✅ Solución: Actualizar desde el Admin de PocketBase

### Paso 1: Acceder al Admin de PocketBase

1. Abre tu navegador
2. Ve a: https://clientes-pocketbasedeliciasdefaby.4dgggl.easypanel.host/_/
3. Inicia sesión con tus credenciales de admin

### Paso 2: Ir a la Colección de Productos

1. En el menú lateral, haz clic en **"Collections"**
2. Busca y haz clic en **"products"**
3. Verás la lista de 25 productos

### Paso 3: Actualizar Productos (Opción A - Individual)

Para cada producto:

1. Haz clic en el botón de **editar** (ícono de lápiz)
2. Marca el checkbox **"is_active"** como `true`
3. En el campo **"category_id"**, selecciona la categoría correspondiente:
   - **Panes**: `g732gvnwzy5sm7h`
   - **Pasteles**: `bazpvk0610fc5w3`
   - **Galletas**: `905a0uc6t743rdt`
   - **Postres**: `q213978ljy1h852`
   - **Bebidas**: `4l98hq9mc662g9j`
4. Haz clic en **"Save"**

### Paso 4: Actualizar Productos (Opción B - Masiva con Script SQL)

Si PocketBase tiene una consola SQL:

```sql
-- Activar todos los productos de Panes
UPDATE products SET is_active = true, category_id = 'g732gvnwzy5sm7h' 
WHERE id IN ('2d8ys0w70s0w5rm', '8m211ue388qagth', 'n97danejg1l7ke2', '54v320l0b46xc9c', 'kn799705128ez35');

-- Activar todos los productos de Pasteles
UPDATE products SET is_active = true, category_id = 'bazpvk0610fc5w3' 
WHERE id IN ('qx6ij1ok9kl39wg', 'd1i86lgh2q1k731', 'k84pwg22nle63z2', 'o4c4wa375vu5nc2', '0436wd4mfz25gk5');

-- Activar todos los productos de Galletas
UPDATE products SET is_active = true, category_id = '905a0uc6t743rdt' 
WHERE id IN ('opmxc4436pl61dj', '9ktp949f5n4w4ux', '26xdv966d690zj8', '3f69r790crnv9m7');

-- Activar todos los productos de Postres
UPDATE products SET is_active = true, category_id = 'q213978ljy1h852' 
WHERE id IN ('e0rr74c69cxqt55', 'qg29hvg4r5rs1bu', 'j0nrn6f5ox6e9fn', '73b5i0ogi0a15vl', 'liv2716870774r1');

-- Activar todos los productos de Bebidas
UPDATE products SET is_active = true, category_id = '4l98hq9mc662g9j' 
WHERE id IN ('vs7qd2a72q0fe2g', 'cz8u99ki1d58v00', 'y1p74gnko2e2ccw', 'd2wro8bbe8659k0', 'tq1419j7jf07856', 'iqtey6f462i400z');
```

## 📋 Lista de Productos por Categoría

### 🍞 Panes (g732gvnwzy5sm7h)
- `2d8ys0w70s0w5rm` - Pan Amasado Tradicional
- `8m211ue388qagth` - Hallulla Casera
- `n97danejg1l7ke2` - Marraqueta Artesanal
- `54v320l0b46xc9c` - Pan Integral con Semillas
- `kn799705128ez35` - Pan de Molde Blanco

### 🎂 Pasteles (bazpvk0610fc5w3)
- `qx6ij1ok9kl39wg` - Torta de Chocolate Triple
- `d1i86lgh2q1k731` - Torta de Zanahoria
- `k84pwg22nle63z2` - Torta Mil Hojas
- `o4c4wa375vu5nc2` - Torta de Frutas Frescas
- `0436wd4mfz25gk5` - Cheesecake de Frutos Rojos

### 🍪 Galletas (905a0uc6t743rdt)
- `opmxc4436pl61dj` - Galletas de Avena con Chocolate
- `9ktp949f5n4w4ux` - Galletas de Mantequilla
- `26xdv966d690zj8` - Alfajores Caseros
- `3f69r790crnv9m7` - Galletas de Jengibre

### 🍰 Postres (q213978ljy1h852)
- `e0rr74c69cxqt55` - Flan de Vainilla
- `qg29hvg4r5rs1bu` - Mousse de Chocolate
- `j0nrn6f5ox6e9fn` - Tiramisú Italiano
- `73b5i0ogi0a15vl` - Panna Cotta
- `liv2716870774r1` - Brownie con Helado

### ☕ Bebidas (4l98hq9mc662g9j)
- `vs7qd2a72q0fe2g` - Café Espresso
- `cz8u99ki1d58v00` - Cappuccino
- `y1p74gnko2e2ccw` - Chocolate Caliente
- `d2wro8bbe8659k0` - Té Verde con Menta
- `tq1419j7jf07856` - Jugo de Naranja Natural
- `iqtey6f462i400z` - Batido de Frutilla

## 🎯 Verificación

Después de actualizar los productos:

1. Recarga la página web: http://localhost:3000/productos
2. Deberías ver los 25 productos organizados por categorías
3. Todos deberían estar activos y visibles

## 💡 Alternativa: Crear Productos Nuevos

Si prefieres empezar de cero, puedes:

1. Eliminar los productos actuales
2. Crear nuevos productos directamente desde el admin de PocketBase
3. Asegurarte de marcar `is_active = true` y asignar la categoría correcta

---

**Nota:** El código de la aplicación ya está correctamente configurado para leer los productos de PocketBase. Solo necesitas activarlos y asignarles categorías.
