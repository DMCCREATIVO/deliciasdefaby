import { pb } from '../client';

export const createCategoriesCollection = async () => {
  try {
    await pb.collections.create({
      name: 'categories',
      type: 'base',
      schema: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'text',
        },
        {
          name: 'isActive',
          type: 'bool',
          default: true,
        },
        {
          name: 'translations',
          type: 'json',
        }
      ],
      listRule: "",  // Público
      viewRule: "",  // Público
      createRule: "@request.auth.role = 'admin'",
      updateRule: "@request.auth.role = 'admin'",
      deleteRule: "@request.auth.role = 'admin'"
    });
    
    console.log('Categories collection created');
  } catch (error) {
    console.error('Error creating categories collection:', error);
  }
};