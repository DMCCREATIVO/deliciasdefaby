import PocketBase from 'pocketbase';

const BASE_URL = 'https://clientes-pocketbasedeliciasdefaby.4dgggl.easypanel.host';
const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
    console.log('❌ Uso: node setup-horarios.mjs <email> <password>');
    process.exit(1);
}

const pb = new PocketBase(BASE_URL);

async function main() {
    console.log('🔐 Autenticando como superusuario...');
    try {
        await pb.admins.authWithPassword(email, password);
        console.log('✅ Autenticado correctamente');
    } catch (e) {
        console.log('❌ Error de autenticación:', e.message);
        process.exit(1);
    }

    try {
        console.log('📦 Verificando colección delivery_schedules...');
        let collection;
        try {
            collection = await pb.collections.getOne('delivery_schedules');
        } catch (e) {
            console.log('⚠️ La colección no existe. Creándola...');
            collection = await pb.collections.create({
                name: 'delivery_schedules',
                type: 'base',
                listRule: '',
                viewRule: '',
                createRule: '',
                updateRule: '',
                deleteRule: '',
                schema: [
                    { name: 'day_of_week', type: 'text', required: true },
                    { name: 'is_active', type: 'bool' },
                    { name: 'start_time', type: 'text' },
                    { name: 'end_time', type: 'text' },
                ]
            });
            console.log('✅ Colección creada');
        }

        if (collection) {
            const schemaFields = collection.schema;
            let needsUpdate = false;

            const requiredFields = [
                { name: 'day_of_week', type: 'text', required: true },
                { name: 'is_active', type: 'bool' },
                { name: 'start_time', type: 'text' },
                { name: 'end_time', type: 'text' }
            ];

            for (const rf of requiredFields) {
                if (!schemaFields.find(f => f.name === rf.name)) {
                    schemaFields.push(rf);
                    needsUpdate = true;
                    console.log(`➕ Agregando campo faltante: ${rf.name}`);
                }
            }

            if (needsUpdate) {
                await pb.collections.update('delivery_schedules', {
                    schema: schemaFields,
                    listRule: '',
                    viewRule: '',
                    createRule: '',
                    updateRule: ''
                });
                console.log('✅ Esquema actualizado');

                const records = await pb.collection('delivery_schedules').getFullList();
                let deletedEmpty = 0;
                for (const r of records) {
                    if (!r.day_of_week) {
                        try {
                            await pb.collection('delivery_schedules').delete(r.id);
                            deletedEmpty++;
                        } catch (e) { }
                    }
                }
                console.log(`🗑️ Se borraron ${deletedEmpty} registros inválidos (sin day_of_week).`);
            }
        }

        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        const existing = await pb.collection('delivery_schedules').getFullList();

        for (const day of days) {
            const isCreated = existing.find(r => r.day_of_week === day);
            if (!isCreated) {
                await pb.collection('delivery_schedules').create({
                    day_of_week: day,
                    is_active: true,
                    start_time: '09:00',
                    end_time: '18:00'
                });
                console.log(`✅ Creado horario por defecto para ${day}`);
            }
        }

        console.log('🚀 ¡Todo listo! El módulo de Horarios de Entrega ahora debe funcionar correctamente.');

    } catch (err) {
        console.error('❌ Error en el proceso:', err.status, err.message, JSON.stringify(err.response, null, 2));
    }
}
main();
