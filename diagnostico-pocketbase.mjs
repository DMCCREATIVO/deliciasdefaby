#!/usr/bin/env node

// Script de diagnóstico de conexión a PocketBase
import PocketBase from 'pocketbase';

const POCKETBASE_URL = 'https://clientes-pocketbasedeliciasdefaby.4dgggl.easypanel.host';

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🔍 DIAGNÓSTICO DE CONEXIÓN A POCKETBASE');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('');

const pb = new PocketBase(POCKETBASE_URL);

async function diagnosticar() {
    try {
        // 1. Verificar salud del servidor
        console.log('1️⃣  Verificando salud del servidor...');
        const health = await pb.health.check();
        console.log('   ✅ Servidor PocketBase está activo');
        console.log('   📊 Respuesta:', JSON.stringify(health, null, 2));
        console.log('');

        // 2. Listar colecciones
        console.log('2️⃣  Verificando colecciones...');
        try {
            const collections = await pb.collections.getFullList();
            console.log(`   ✅ Total de colecciones: ${collections.length}`);
            collections.forEach(col => {
                console.log(`   📁 ${col.name} (${col.type})`);
            });
        } catch (error) {
            console.log('   ⚠️  No se pudo listar colecciones (requiere auth admin)');
        }
        console.log('');

        // 3. Verificar productos
        console.log('3️⃣  Verificando productos...');
        try {
            const products = await pb.collection('products').getList(1, 5);
            console.log(`   ✅ Total de productos: ${products.totalItems}`);
            console.log(`   📦 Mostrando primeros 5 productos:`);
            console.log('');

            products.items.forEach((product, index) => {
                console.log(`   ${index + 1}. ${product.title}`);
                console.log(`      ID: ${product.id}`);
                console.log(`      Precio: $${product.price}`);
                console.log(`      Activo: ${product.is_active}`);
                console.log(`      Categoría ID: ${product.category_id || '(vacío)'}`);
                console.log('');
            });
        } catch (error) {
            console.log('   ❌ Error al obtener productos:', error.message);
        }

        // 4. Verificar categorías
        console.log('4️⃣  Verificando categorías...');
        try {
            const categories = await pb.collection('categories').getList(1, 10);
            console.log(`   ✅ Total de categorías: ${categories.totalItems}`);
            categories.items.forEach(cat => {
                console.log(`   🏷️  ${cat.name} (ID: ${cat.id})`);
            });
        } catch (error) {
            console.log('   ❌ Error al obtener categorías:', error.message);
        }
        console.log('');

        // 5. Verificar estructura de un producto
        console.log('5️⃣  Verificando estructura de producto...');
        try {
            const product = await pb.collection('products').getFirstListItem('');
            console.log('   📋 Campos disponibles en producto:');
            Object.keys(product).forEach(key => {
                const value = product[key];
                const type = typeof value;
                console.log(`      • ${key}: ${type} = ${JSON.stringify(value).substring(0, 50)}`);
            });
        } catch (error) {
            console.log('   ❌ Error:', error.message);
        }
        console.log('');

        // 6. Resumen
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📊 RESUMEN');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('');
        console.log('URL de PocketBase:', POCKETBASE_URL);
        console.log('Estado: ✅ Conectado');
        console.log('');
        console.log('🎯 PRÓXIMOS PASOS:');
        console.log('');
        console.log('Si los productos tienen is_active = false:');
        console.log('  → Necesitas activarlos desde el admin de PocketBase');
        console.log('  → URL: ' + POCKETBASE_URL + '/_/');
        console.log('');
        console.log('Si category_id está vacío:');
        console.log('  → Necesitas asignar categorías a los productos');
        console.log('  → Ver archivo: ACTIVAR_PRODUCTOS.md');
        console.log('');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    } catch (error) {
        console.error('');
        console.error('❌ ERROR CRÍTICO:', error.message);
        console.error('');
        console.error('Detalles:', error);
        console.error('');
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }
}

diagnosticar();
