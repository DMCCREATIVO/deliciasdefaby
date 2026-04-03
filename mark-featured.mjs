/**
 * Script para marcar productos como DESTACADOS (is_featured = true)
 */
const BASE_URL = 'https://bd.deliciasdefaby.cl';
const email = 'dmccreativo@gmail.com';
const password = 'Dayn2614@#@';

async function main() {
    console.log('🔐 Autenticando...');

    let token = null;
    try {
        const resp = await fetch(`${BASE_URL}/api/collections/_superusers/auth-with-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identity: email, password }),
        });
        const data = await resp.json();
        if (data.token) {
            token = data.token;
            console.log('✅ Autenticado como superusuario');
        } else {
            console.log('❌ Error de autenticación:', data.message);
            process.exit(1);
        }
    } catch (e) {
        console.error('❌ Error conexión:', e.message);
        process.exit(1);
    }

    // Obtener algunos productos
    console.log('\n📦 Obteniendo productos para destacar...');
    const listResp = await fetch(`${BASE_URL}/api/collections/products/records?page=1&perPage=4`, {
        headers: { Authorization: token }
    });
    const { items: products } = await listResp.json();

    if (!products || products.length === 0) {
        console.log('❌ No hay productos para marcar.');
        return;
    }

    console.log(`\n✨ Marcando ${products.length} productos como DESTACADOS...`);
    for (const product of products) {
        try {
            const resp = await fetch(`${BASE_URL}/api/collections/products/records/${product.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token
                },
                body: JSON.stringify({
                    is_featured: true,
                    is_active: true // Aseguramos que también esté activo
                }),
            });
            const data = await resp.json();
            if (data.is_featured) {
                console.log(`  ✅ Producto: ${product.title}`);
            } else {
                console.log(`  ❌ Error en ${product.title}: ${JSON.stringify(data)}`);
            }
        } catch (e) {
            console.log(`  ❌ Error en ${product.title}: ${e.message}`);
        }
    }

    console.log('\n🚀 ¡Listo! Los productos ahora deberían aparecer en "Destacados" de la Home.');
}

main().catch(console.error);
