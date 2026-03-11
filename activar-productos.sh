#!/bin/bash

# Script para activar todos los productos y asignar categorías
# Usa la API de PocketBase directamente

POCKETBASE_URL="https://clientes-pocketbasedeliciasdefaby.4dgggl.easypanel.host"

echo "🔧 Actualizando productos en PocketBase..."
echo ""

# Función para actualizar un producto
update_product() {
    local product_id=$1
    local category_id=$2
    local title=$3
    
    echo "  📦 $title"
    
    # Intentar actualizar con diferentes nombres de campos
    response=$(curl -s -w "\n%{http_code}" -X PATCH \
        "$POCKETBASE_URL/api/collections/products/records/$product_id" \
        -H "Content-Type: application/json" \
        -d "{\"is_active\": true, \"category_id\": \"$category_id\"}")
    
    http_code=$(echo "$response" | tail -n1)
    
    if [ "$http_code" = "200" ]; then
        echo "     ✅ Actualizado correctamente"
    else
        echo "     ⚠️  HTTP $http_code - Intentando con nombres alternativos..."
        # Intentar con nombres en camelCase
        response2=$(curl -s -w "\n%{http_code}" -X PATCH \
            "$POCKETBASE_URL/api/collections/products/records/$product_id" \
            -H "Content-Type: application/json" \
            -d "{\"isActive\": true, \"category\": \"$category_id\"}")
        
        http_code2=$(echo "$response2" | tail -n1)
        if [ "$http_code2" = "200" ]; then
            echo "     ✅ Actualizado con nombres alternativos"
        else
            echo "     ❌ Error: $http_code2"
        fi
    fi
}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🍞 PANES (categoria: g732gvnwzy5sm7h)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
update_product "2d8ys0w70s0w5rm" "g732gvnwzy5sm7h" "Pan Amasado Tradicional"
update_product "8m211ue388qagth" "g732gvnwzy5sm7h" "Hallulla Casera"
update_product "n97danejg1l7ke2" "g732gvnwzy5sm7h" "Marraqueta Artesanal"
update_product "54v320l0b46xc9c" "g732gvnwzy5sm7h" "Pan Integral con Semillas"
update_product "kn799705128ez35" "g732gvnwzy5sm7h" "Pan de Molde Blanco"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎂 PASTELES (categoria: bazpvk0610fc5w3)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
update_product "qx6ij1ok9kl39wg" "bazpvk0610fc5w3" "Torta de Chocolate Triple"
update_product "d1i86lgh2q1k731" "bazpvk0610fc5w3" "Torta de Zanahoria"
update_product "k84pwg22nle63z2" "bazpvk0610fc5w3" "Torta Mil Hojas"
update_product "o4c4wa375vu5nc2" "bazpvk0610fc5w3" "Torta de Frutas Frescas"
update_product "0436wd4mfz25gk5" "bazpvk0610fc5w3" "Cheesecake de Frutos Rojos"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🍪 GALLETAS (categoria: 905a0uc6t743rdt)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
update_product "opmxc4436pl61dj" "905a0uc6t743rdt" "Galletas de Avena con Chocolate"
update_product "9ktp949f5n4w4ux" "905a0uc6t743rdt" "Galletas de Mantequilla"
update_product "26xdv966d690zj8" "905a0uc6t743rdt" "Alfajores Caseros"
update_product "3f69r790crnv9m7" "905a0uc6t743rdt" "Galletas de Jengibre"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🍰 POSTRES (categoria: q213978ljy1h852)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
update_product "e0rr74c69cxqt55" "q213978ljy1h852" "Flan de Vainilla"
update_product "qg29hvg4r5rs1bu" "q213978ljy1h852" "Mousse de Chocolate"
update_product "j0nrn6f5ox6e9fn" "q213978ljy1h852" "Tiramisú Italiano"
update_product "73b5i0ogi0a15vl" "q213978ljy1h852" "Panna Cotta"
update_product "liv2716870774r1" "q213978ljy1h852" "Brownie con Helado"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "☕ BEBIDAS (categoria: 4l98hq9mc662g9j)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
update_product "vs7qd2a72q0fe2g" "4l98hq9mc662g9j" "Café Espresso"
update_product "cz8u99ki1d58v00" "4l98hq9mc662g9j" "Cappuccino"
update_product "y1p74gnko2e2ccw" "4l98hq9mc662g9j" "Chocolate Caliente"
update_product "d2wro8bbe8659k0" "4l98hq9mc662g9j" "Té Verde con Menta"
update_product "tq1419j7jf07856" "4l98hq9mc662g9j" "Jugo de Naranja Natural"
update_product "iqtey6f462i400z" "4l98hq9mc662g9j" "Batido de Frutilla"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Actualización completa"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Verificando productos actualizados..."
echo ""

# Verificar algunos productos
curl -s "$POCKETBASE_URL/api/collections/products/records/2d8ys0w70s0w5rm" | python3 -m json.tool 2>/dev/null | grep -E "(title|is_active|category)" || echo "No se pudo verificar"

echo ""
echo "✨ Recarga la página para ver los cambios"
