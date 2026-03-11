import { pb } from '../client';

export const createProductsCollection = async () => {
  try {
    await pb.collections.create({
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
          type: 'relation',
          required: true,
          options: {
            collectionId: 'categories',
            cascadeDelete: false,
          }
        },
        {
          name: 'stock',
          type: 'number',
          min: 0,
          default: 0,
        },
        {
          name: 'images',
          type: 'file',
          required: false,
          options: {
            maxSelect: 5,
            maxSize: 5242880,
            mimeTypes: ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'],
          }
        },
        {
          name: 'isActive',
          type: 'bool',
          default: true,
        },
        {
          name: 'availableDays',
          type: 'json',
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
    console.log('Products collection created');
  } catch (error) {
    console.error('Error creating products collection:', error);
  }
};