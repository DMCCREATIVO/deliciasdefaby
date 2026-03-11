import { pb } from '../client';

export const updateCollection = async (collectionName: string, schema: any) => {
  try {
    console.log(`Intentando actualizar la colección ${collectionName}...`);
    
    // Obtener la colección existente
    const collection = await pb.collections.getOne(collectionName);
    console.log(`Colección ${collectionName} encontrada:`, collection);
    
    // Actualizar el esquema de la colección
    const result = await pb.collections.update(collection.id, {
      schema: schema
    });
    
    console.log(`Colección ${collectionName} actualizada exitosamente:`, result);
    return result;
  } catch (error) {
    console.error(`Error actualizando la colección ${collectionName}:`, error);
    throw error;
  }
};