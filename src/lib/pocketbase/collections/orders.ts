import { pb } from '../client';

export const createOrdersCollection = async () => {
  try {
    await pb.collections.create({
      name: 'orders',
      type: 'base',
      schema: [
        {
          name: 'user',
          type: 'relation',
          required: true,
          options: {
            collectionId: 'users',
            cascadeDelete: false,
          }
        },
        {
          name: 'items',
          type: 'json',
          required: true,
        },
        {
          name: 'total',
          type: 'number',
          required: true,
          min: 0,
        },
        {
          name: 'status',
          type: 'select',
          required: true,
          options: {
            maxSelect: 1,
            values: ['pending', 'completed', 'cancelled']
          }
        },
        {
          name: 'customerName',
          type: 'text',
          required: true,
        },
        {
          name: 'customerEmail',
          type: 'text',
          required: true,
        },
        {
          name: 'customerPhone',
          type: 'text',
        },
        {
          name: 'notes',
          type: 'text',
        },
        {
          name: 'paymentMethod',
          type: 'select',
          required: true,
          options: {
            maxSelect: 1,
            values: ['cash', 'mercadopago']
          }
        },
        {
          name: 'paymentStatus',
          type: 'select',
          required: true,
          options: {
            maxSelect: 1,
            values: ['pending', 'paid', 'failed']
          }
        }
      ],
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.role = 'admin'",
      deleteRule: "@request.auth.role = 'admin'"
    });
    
    console.log('Orders collection created');
  } catch (error) {
    console.error('Error creating orders collection:', error);
  }
};