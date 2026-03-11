import { pb } from '../client';
import { checkCollection } from './checkCollection';

export const createSettingsCollection = async () => {
  const exists = await checkCollection('settings');
  if (exists) {
    console.log('Settings collection already exists');
    return;
  }

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
        name: 'whatsappNumber',
        type: 'text',
      },
      {
        name: 'enableOnlinePayments',
        type: 'bool',
        default: false,
      }
    ],
    listRule: "",
    viewRule: "",
    createRule: "@request.auth.role = 'admin'",
    updateRule: "@request.auth.role = 'admin'",
    deleteRule: "@request.auth.role = 'admin'"
  });

  // Create initial settings
  await pb.collection('settings').create({
    currency: 'CLP',
    language: 'es',
    businessName: 'Mi Catálogo',
    whatsappNumber: '',
    enableOnlinePayments: false
  });
};