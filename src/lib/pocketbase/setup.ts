import { verifyCollections } from './utils/verifyCollections';
import { createCollections } from './utils/createCollections';

export const setupPocketbase = async () => {
  try {
    // Verificar colecciones existentes
    const existingCollections = await verifyCollections();
    
    // Si no hay colecciones, crearlas
    if (existingCollections.length === 0) {
      console.log('No se encontraron colecciones, creando...');
      await createCollections();
    } else {
      console.log('Colecciones existentes:', existingCollections.map(c => c.name));
    }
  } catch (error) {
    console.error('Error en setup:', error);
    throw error;
  }
};