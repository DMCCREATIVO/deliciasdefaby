import { pb } from '../client';

export const createCollections = async () => {
  try {
    // Autenticar como admin primero
    await pb.admins.authWithPassword('admin@admin.com', 'admin12345');

    // Crear colección users si no existe
    const usersCollection = {
      name: 'users',
      type: 'auth',
      schema: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'role',
          type: 'select',
          required: true,
          options: {
            maxSelect: 1,
            values: ['admin', 'customer']
          }
        },
        {
          name: 'phone',
          type: 'text',
        },
        {
          name: 'address',
          type: 'json',
        }
      ],
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "",
      updateRule: "@request.auth.id = id || @request.auth.role = 'admin'",
      deleteRule: "@request.auth.role = 'admin'"
    };

    await pb.collections.create(usersCollection);
    console.log('Colección users creada');

    // Crear colección products si no existe
    const productsCollection = {
      name: 'products',
      type: 'base',
      schema: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'text',
        },
        {
          name: 'price',
          type: 'number',
          required: true,
          min: 0,
        },
        {
          name: 'weight',
          type: 'text',
        },
        {
          name: 'category',
          type: 'text',
          required: true,
        },
        {
          name: 'stock',
          type: 'number',
          min: 0,
        },
        {
          name: 'imageUrl',
          type: 'file',
        },
        {
          name: 'isActive',
          type: 'bool',
          default: true,
        },
        {
          name: 'availableDays',
          type: 'json',
        }
      ],
      listRule: "",
      viewRule: "",
      createRule: "@request.auth.role = 'admin'",
      updateRule: "@request.auth.role = 'admin'",
      deleteRule: "@request.auth.role = 'admin'"
    };

    await pb.collections.create(productsCollection);
    console.log('Colección products creada');

  } catch (error) {
    console.error('Error creando colecciones:', error);
    throw error;
  }
};