import PocketBase from 'pocketbase';
const pb = new PocketBase('https://clientes-pocketbasedeliciasdefaby.4dgggl.easypanel.host');
async function main() {
    try {
        const records = await pb.collection('delivery_schedules').getFullList();
        if (records.length === 0) return console.log('NO RECORDS TO UPDATE');
        const r = records[0];
        await pb.collection('delivery_schedules').update(r.id, { ...r, is_active: !r.is_active });
        console.log('UPDATE SUCCESS');
    } catch (e) {
        if (e.status === 403) {
            console.log('UPDATE 403: Forbidden - Authentication or Rules rejecting the update.');
        } else {
            console.log('UPDATE ERROR:', e.status, e.response);
        }
    }
}
main();
