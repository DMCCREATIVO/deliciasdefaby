import { pb } from './client';
import { initializeAdmin } from './auth';
import { checkCollection } from './utils/checkCollection';
import { createUsersCollection } from './collections/users';
import { createProductsCollection } from './collections/products';
import { createOrdersCollection } from './collections/orders';
import { createSettingsCollection } from './collections/settings';
import { createCategoriesCollection } from './collections/categories';
import { createOrderMessagesCollection } from './collections/order_messages';

const COLLECTION_DELAY = 3000; // 3 segundos entre colecciones

export const initializeDatabase = async () => {
  try {
    console.log('Iniciando configuración de la base de datos...');
    
    // Autenticar como admin
    await initializeAdmin();
    
    if (!pb.authStore.isValid) {
      throw new Error('La autenticación no es válida');
    }
    
    // Array de funciones para crear colecciones
    const collections = [
      { name: 'users', fn: createUsersCollection },
      { name: 'categories', fn: createCategoriesCollection },
      { name: 'products', fn: createProductsCollection },
      { name: 'orders', fn: createOrdersCollection },
      { name: 'order_messages', fn: createOrderMessagesCollection },
      { name: 'settings', fn: createSettingsCollection }
    ];

    // Crear colecciones secuencialmente
    for (const collection of collections) {
      try {
        const exists = await checkCollection(collection.name);
        if (!exists) {
          console.log(`Creando colección ${collection.name}...`);
          await collection.fn();
          console.log(`Colección ${collection.name} creada exitosamente`);
        } else {
          console.log(`La colección ${collection.name} ya existe`);
        }
        await new Promise(resolve => setTimeout(resolve, COLLECTION_DELAY));
      } catch (error: any) {
        if (error.status === 403) {
          console.log(`Reintentando autenticación para ${collection.name}...`);
          await initializeAdmin();
          await collection.fn();
        } else {
          console.error(`Error en ${collection.name}:`, error);
          continue;
        }
      }
    }
    
    console.log('Base de datos inicializada exitosamente');
    return true;
  } catch (error) {
    console.error('Error durante la inicialización:', error);
    return false;
  }
};