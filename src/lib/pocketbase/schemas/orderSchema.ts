export const orderSchema = [
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
      values: ['pending', 'processing', 'completed', 'cancelled']
    }
  },
  {
    name: 'customerName',
    type: 'text',
    required: true,
  },
  {
    name: 'customerEmail',
    type: 'email',
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
  },
  {
    name: 'deliveryDate',
    type: 'date',
  }
];