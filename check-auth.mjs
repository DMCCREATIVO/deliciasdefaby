import fetch from 'node-fetch'; // or just use global fetch if node 18+

const BASE_URL = 'https://clientes-pocketbasedeliciasdefaby.4dgggl.easypanel.host';
const email = 'dmccreativo@gmail.com';
const password = 'Dayn2614@#@';

async function main() {
    const authResp = await fetch(`${BASE_URL}/api/collections/_superusers/auth-with-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identity: email, password })
    });
    const authData = await authResp.json();
    console.log('Auth data:', authData);

    if (authData.token) {
        const collResp = await fetch(`${BASE_URL}/api/collections?perPage=100`, {
            headers: { Authorization: authData.token }
        });
        const colls = await collResp.json();

        const ensureField = async (collName, field) => {
            const coll = colls.items.find(c => c.name === collName);
            if (!coll) return;
            if (!coll.fields.find(f => f.name === field.name)) {
                console.log(`Adding ${field.name} to ${collName}...`);
                coll.fields.push(field);
                const updateResp = await fetch(`${BASE_URL}/api/collections/${coll.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json', Authorization: authData.token },
                    body: JSON.stringify(coll)
                });
                console.log(`Update ${collName}:`, updateResp.status);
            }
        };

        await ensureField('categories', { name: 'slug', type: 'text' });
        await ensureField('products', { name: 'slug', type: 'text' });
        await ensureField('blog_posts', { name: 'slug', type: 'text' });
        await ensureField('blog_posts', { name: 'featured', type: 'bool' });
        const showSchema = (name) => {
            const coll = colls.items.find(c => c.name === name);
            if (coll) {
                console.log(`\n--- Schema for ${name} ---`);
                console.log(coll.fields.map(f => `${f.name} (${f.type})`).join(', '));
            }
        };

        showSchema('blog_posts');
        showSchema('categories');
        showSchema('products');
        showSchema('orders');
        showSchema('settings');
    }
}
main().catch(console.error);
