export const settingSchema = [
  {
    name: 'currency',
    type: 'select',
    required: true,
    options: {
      maxSelect: 1,
      values: ['CLP', 'USD', 'EUR', 'BRL', 'ARS', 'MXN', 'COP', 'PEN']
    }
  },
  {
    name: 'language',
    type: 'select',
    required: true,
    options: {
      maxSelect: 1,
      values: ['es', 'en', 'pt']
    }
  },
  {
    name: 'businessName',
    type: 'text',
    required: true,
  },
  {
    name: 'logo',
    type: 'file',
    options: {
      maxSelect: 1,
      maxSize: 5242880,
      mimeTypes: ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'],
    }
  },
  {
    name: 'whatsappNumber',
    type: 'text',
  },
  {
    name: 'enableOnlinePayments',
    type: 'bool',
    default: false,
  },
  {
    name: 'mercadoPagoPublicKey',
    type: 'text',
  },
  {
    name: 'mercadoPagoAccessToken',
    type: 'text',
  },
  {
    name: 'translations',
    type: 'json',
  }
];