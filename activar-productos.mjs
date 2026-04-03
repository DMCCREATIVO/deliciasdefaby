#!/usr/bin/env node

/**
 * Script para activar todos los productos en PocketBase
 * Este script actualiza is_active=true para todos los productos
 */

import PocketBase from 'pocketbase';

const POCKETBASE_URL = 'https://bd.deliciasdefaby.cl';

async function main() {
    const pb = new PocketBase(POCKETBASE_URL);

    console.log('🔗 Conectando a PocketBase:', POCKETBASE_URL);
    console.log('');

    try {
        // Obtener todos los productos
        console.log('📦 Obteniendo productos...');
        const productos = await pb.collection('products').getFullList({
            sort: '-created',
        });

        console.log(`✅ Se encontraron ${productos.length} productos\n`);

        // Estadísticas
        const stats = {
            total: productos.length,
            activos: productos.filter(p => p.is_active).length,
            inactivos: productos.filter(p => !p.is_active).length,
            destacados: productos.filter(p => p.is_featured).length,
        };

        console.log('📊 Estado actual:');
        console.log(`   Total: ${stats.total}`);
        console.log(`   Activos: ${stats.activos}`);
        console.log(`   Inactivos: ${stats.inactivos}`);
        console.log(`   Destacados: ${stats.destacados}`);
        console.log('');

        // Mostrar algunos productos de ejemplo
        console.log('📝 Productos encontrados:');
        productos.slice(0, 5).forEach((p, i) => {
            console.log(`   ${i + 1}. ${p.title} - $${p.price} - ${p.is_active ? '✅ Activo' : '❌ Inactivo'}`);
        });
        if (productos.length > 5) {
            console.log(`   ... y ${productos.length - 5} más`);
        }
        console.log('');

        // Activar productos inactivos
        if (stats.inactivos > 0) {
            console.log(`🔄 Activando ${stats.inactivos} productos...`);

            let activados = 0;
            let errores = 0;

            for (const producto of productos) {
                if (!producto.is_active) {
                    try {
                        // Intentar actualizar sin autenticación (API pública)
                        await pb.collection('products').update(producto.id, {
                            is_active: true,
                        }, {
                            // Sin headers de autenticación
                            $autoCancel: false,
                        });
                        console.log(`   ✅ ${producto.title}`);
                        activados++;
                    } catch (error) {
                        console.log(`   ❌ ${producto.title}: ${error.message}`);
                        errores++;
                    }
                }
            }

            console.log('');
            console.log('📊 Resultado:');
            console.log(`   Activados exitosamente: ${activados}`);
            console.log(`   Errores: ${errores}`);

            if (errores > 0) {
                console.log('');
                console.log('⚠️  Algunos productos no pudieron activarse.');
                console.log('   Esto puede deberse a permisos de la colección en PocketBase.');
                console.log('   Solución: Activar los productos manualmente desde el panel de admin.');
            }
        } else {
            console.log('✨ Todos los productos ya están activos!');
        }

    } catch (error) {
        console.error('');
        console.error('❌ Error:', error.message);
        console.error('');
        console.error('💡 Posibles soluciones:');
        console.error('   1. Verificar que PocketBase esté en línea');
        console.error('   2. Verificar la URL de PocketBase en .env');
        console.error('   3. Activar productos manualmente desde el admin de PocketBase');
        console.error('');
        process.exit(1);
    }
}

main();
