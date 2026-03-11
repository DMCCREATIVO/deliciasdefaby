import { pb } from '../client';

export const verifyCollections = async () => {
  try {
    console.log('Verificando colecciones existentes...');
    
    // Verificar autenticación
    if (!pb.authStore.isValid) {
      throw new Error('No hay una sesión de autenticación válida');
    }
    
    console.log('Token actual:', pb.authStore.token);
    
    const collections = await pb.collections.getFullList({
      sort: 'created',
    });
    
    console.log('Colecciones encontradas:', collections.map(c => c.name));
    return collections;
  } catch (error) {
    console.error('Error verificando colecciones:', error);
    throw error;
  }
};