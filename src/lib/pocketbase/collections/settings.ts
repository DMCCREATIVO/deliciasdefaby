import { pb } from '../client';

export const createSettingsCollection = async () => {
  try {
    await pb.collections.create({
      name: 'settings',
      type: 'base',
      schema: [
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
      ],
      listRule: "",  // Público
      viewRule: "",  // Público
      createRule: "@request.auth.role = 'admin'",
      updateRule: "@request.auth.role = 'admin'",
      deleteRule: "@request.auth.role = 'admin'"
    });

    // Crear configuración inicial
    await pb.collection('settings').create({
      currency: 'CLP',
      language: 'es',
      businessName: 'Mi Catálogo',
      whatsappNumber: '',
      enableOnlinePayments: false,
      mercadoPagoPublicKey: '',
      mercadoPagoAccessToken: '',
      translations: {
        es: {
          businessName: 'Mi Catálogo'
        },
        en: {
          businessName: 'My Catalog'
        },
        pt: {
          businessName: 'Meu Catálogo'
        }
      }
    });

    console.log('Settings collection and initial config created');
  } catch (error) {
    console.error('Error creating settings collection:', error);
  }
};