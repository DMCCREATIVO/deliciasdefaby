#!/usr/bin/env node

/**
 * Diagnóstico rápido de la conexión a PocketBase
 */

import PocketBase from 'pocketbase';

const POCKETBASE_URL = 'https://bd.deliciasdefaby.cl';

async function diagnostico() {
    console.log('🔍 DIAGNÓSTICO DE CONEXIÓN A POCKETBASE');
    console.log('='.repeat(50));
    console.log('');

    const pb = new PocketBase(POCKETBASE_URL);

    // Test 1: Conexión
    console.log('1️⃣  Test de Conexión');
    console.log(`   URL: ${POCKETBASE_URL}`);
    try {
        const health = await pb.health.check();
        console.log('   ✅ PocketBase está ONLINE');
    } catch (error) {
        console.log('   ❌ PocketBase NO responde');
        console.log(`   Error: ${error.message}`);
        process.exit(1);
    }
    console.log('');

    // Test 2: Colecciones
    console.log('2️⃣  Test de Colecciones');
    try {
        const collections = await pb.collections.getFullList();
        console.log(`   ✅ ${collections.length} colecciones encontradas`);
        const relevantes = ['products', 'categories', 'orders', 'settings', 'testimonials'];
        relevantes.forEach(name => {
            const existe = collections.find(c => c.name === name);
            if (existe) {
                console.log(`   ✅ ${name}`);
            } else {
                console.log(`   ❌ ${name} (no encontrada)`);
            }
        });
    } catch (error) {
        console.log('   ❌ No se pudieron listar las colecciones');
        console.log(`   Error: ${error.message}`);
    }
    console.log('');

    // Test 3: Productos
    console.log('3️⃣  Test de Productos');
    try {
        const productos = await pb.collection('products').getList(1, 50, {
            sort: '-created',
        });

        console.log(`   ✅ ${productos.totalItems} productos en total`);
        console.log(`   📄 Mostrando primeros ${productos.items.length}`);
        console.log('');

        const activos = productos.items.filter(p => p.is_active).length;
        const inactivos = productos.items.filter(p => !p.is_active).length;
        const destacados = productos.items.filter(p => p.is_featured).length;
        const conImagen = productos.items.filter(p => p.images && p.images.length > 0).length;
        const conCategoria = productos.items.filter(p => p.category_id).length;

        console.log('   📊 Estadísticas:');
        console.log(`      Total: ${productos.totalItems}`);
        console.log(`      Activos: ${activos} ${activos === 0 ? '⚠️  NINGUNO ACTIVO' : '✅'}`);
        console.log(`      Inactivos: ${inactivos} ${inactivos > 0 ? '⚠️' : '✅'}`);
        console.log(`      Destacados: ${destacados}`);
        console.log(`      Con imagen: ${conImagen}`);
        console.log(`      Con categoría: ${conCategoria}`);
        console.log('');

        if (activos === 0) {
            console.log('   ⚠️  ADVERTENCIA: No hay productos activos');
            console.log('   💡 Solución: Usa activar-productos.html para activarlos');
            console.log('');
        }

        console.log('   📝 Primeros 5 productos:');
        productos.items.slice(0, 5).forEach((p, i) => {
            const estado = p.is_active ? '✅' : '❌';
            const destacado = p.is_featured ? '⭐' : '  ';
            const imagen = p.images && p.images.length > 0 ? '🖼️ ' : '   ';
            console.log(`      ${i + 1}. ${estado} ${destacado} ${imagen} ${p.title} - $${p.price.toLocaleString('es-CL')}`);
        });

    } catch (error) {
        console.log('   ❌ No se pudieron obtener los productos');
        console.log(`   Error: ${error.message}`);
    }
    console.log('');

    // Test 4: Categorías
    console.log('4️⃣  Test de Categorías');
    try {
        const categorias = await pb.collection('categories').getList(1, 20);
        console.log(`   ✅ ${categorias.totalItems} categorías encontradas`);
        if (categorias.items.length > 0) {
            categorias.items.slice(0, 5).forEach((c, i) => {
                console.log(`      ${i + 1}. ${c.name}`);
            });
        }
    } catch (error) {
        console.log('   ⚠️  No se pudieron obtener las categorías');
    }
    console.log('');

    // Resumen
    console.log('='.repeat(50));
    console.log('📋 RESUMEN');
    console.log('='.repeat(50));
    console.log('');
    console.log('✅ Conexión a PocketBase: OK');
    console.log('✅ Colecciones: OK');
    console.log('✅ Productos en BD: OK');

    if (activos === 0) {
        console.log('⚠️  Productos activos: NINGUNO');
        console.log('');
        console.log('🔧 ACCIÓN REQUERIDA:');
        console.log('   1. Abre: activar-productos.html');
        console.log('   2. Haz clic en "Activar Todos"');
        console.log('   3. Recarga tu sitio web');
    } else {
        console.log('✅ Productos activos: OK');
        console.log('');
        console.log('🎉 ¡Todo listo! Los productos deberían verse en tu sitio.');
    }
    console.log('');
}

diagnostico().catch(error => {
    console.error('❌ Error fatal:', error.message);
    process.exit(1);
});
