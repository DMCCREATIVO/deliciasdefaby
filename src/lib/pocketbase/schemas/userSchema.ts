export const userSchema = [
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
  },
  {
    name: 'avatar',
    type: 'file',
    options: {
      maxSelect: 1,
      maxSize: 5242880,
      mimeTypes: ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'],
    }
  },
  {
    name: 'preferences',
    type: 'json',
  }
];