import PocketBase from 'pocketbase';
const pb = new PocketBase('https://clientes-pocketbasedeliciasdefaby.4dgggl.easypanel.host');
async function main() {
    try {
        const list = await pb.collection('delivery_schedules').getFullList();
        console.log('SUCCESS: Collection exists and returned ' + list.length + ' records');
        console.log(JSON.stringify(list, null, 2));
    } catch (err) {
        if (err.status === 404) {
            console.log('MISSING');
        } else if (err.status === 403) {
            console.log('FORBIDDEN');
        } else {
            console.log('ERROR:', err.status, err.message, err.response);
        }
    }
}
main();
