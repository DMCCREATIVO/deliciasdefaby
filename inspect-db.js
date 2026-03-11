import PocketBase from 'pocketbase';
import fetch from 'node-fetch';

// global.fetch is needed for older Node versions or simply use built-in fetch if Node >= 18
const pb = new PocketBase('https://clientes-pocketbasedeliciasdefaby.4dgggl.easypanel.host');
pb.autoCancellation(false);

async function inspect() {
    console.log("=== Auth Admin ===");
    try {
        await pb.admins.authWithPassword('contacto@sistemasestela.cl', 'SistemasEstela1');
        console.log("Auth success!");
    } catch (err) {
        console.error("Auth failed:", err.message);
        // try alternative admin auth if we don't know it, wait... we don't know the admin password for sure,
        // but let's try reading records without auth first.
    }

    try {
        console.log("\n=== Products ===");
        const products = await pb.collection('products').getFullList({ expand: 'category_id' });
        products.forEach(p => console.log(`- ${p.id}: ${p.title} (${p.expand?.category_id?.name || 'No Category'}) [Activo: ${p.is_active}]`));

        console.log("\n=== Categories ===");
        const categories = await pb.collection('categories').getFullList();
        categories.forEach(c => console.log(`- ${c.id}: ${c.name}`));

        console.log("\n=== Users ===");
        const users = await pb.collection('users').getFullList();
        users.forEach(u => console.log(`- ${u.id}: ${u.email} | ${u.name} | ${u.role}`));

    } catch (err) {
        console.error("Error fetching:", err.message);
    }
}

inspect();
