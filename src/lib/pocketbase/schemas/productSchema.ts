export const productSchema = [
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
];