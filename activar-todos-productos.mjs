/**
 * Script para activar TODOS los productos en PocketBase
 * 
 * Uso:
 *   node activar-todos-productos.mjs [email] [password]
 * 
 * Ejemplo:
 *   node activar-todos-productos.mjs admin@deliciasdefaby.cl MiPassword123
 */

const BASE_URL = 'https://clientes-pocketbasedeliciasdefaby.4dgggl.easypanel.host';

const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
    console.log('❌ Uso: node activar-todos-productos.mjs <email> <password>');
    console.log('   El email y password deben ser los del panel de PocketBase (superusuario)');
    process.exit(1);
}

async function main() {
    console.log('🔐 Autenticando...');

    // Intentar autenticarse como superusuario
    let token = null;

    const endpoints = [
        `${BASE_URL}/api/collections/_superusers/auth-with-password`,
        `${BASE_URL}/api/collections/users/auth-with-password`,
    ];

    for (const endpoint of endpoints) {
        try {
            const resp = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identity: email, password }),
            });
            const data = await resp.json();
            if (data.token) {
                token = data.token;
                console.log(`✅ Autenticado correctamente vía ${endpoint.split('/').pop()}`);
                break;
            } else {
                console.log(`⚠️  ${endpoint.split('/').slice(-3).join('/')}: ${data.message}`);
            }
        } catch (e) {
            console.log(`⚠️  Error en ${endpoint}: ${e.message}`);
        }
    }

    if (!token) {
        console.error('❌ No se pudo autenticar. Verifica email y password del superusuario de PocketBase.');
        process.exit(1);
    }

    // Obtener todos los productos
    console.log('\n📦 Obteniendo todos los productos...');
    const listResp = await fetch(`${BASE_URL}/api/collections/products/records?page=1&perPage=200`, {
        headers: { Authorization: token }
    });
    const listData = await listResp.json();
    const products = listData.items || [];

    console.log(`   Total: ${listData.totalItems} productos`);

    const inactive = products.filter(p => !p.is_active);
    console.log(`   Inactivos: ${inactive.length}`);
    console.log(`   Ya activos: ${products.filter(p => p.is_active).length}`);

    if (inactive.length === 0) {
        console.log('\n✅ ¡Todos los productos ya están activos!');
        return;
    }

    // Activar todos los inactivos
    console.log(`\n🔄 Activando ${inactive.length} productos...`);
    let success = 0;
    let fail = 0;

    for (const product of inactive) {
        try {
            const resp = await fetch(`${BASE_URL}/api/collections/products/records/${product.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token
                },
                body: JSON.stringify({ is_active: true }),
            });
            const data = await resp.json();
            if (data.is_active) {
                console.log(`  ✅ ${product.title}`);
                success++;
            } else {
                console.log(`  ❌ ${product.title}: ${JSON.stringify(data)}`);
                fail++;
            }
        } catch (e) {
            console.log(`  ❌ ${product.title}: ${e.message}`);
            fail++;
        }
    }

    console.log(`\n=============================`);
    console.log(`✅ Activados: ${success}`);
    console.log(`❌ Fallidos:  ${fail}`);
    console.log(`=============================`);

    if (success > 0) {
        console.log('\n🎉 ¡Productos activados! Recarga el sitio web para verlos.');
    }
}

main().catch(console.error);
