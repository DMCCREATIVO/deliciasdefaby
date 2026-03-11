import { pb } from './client';

export const initializeAdmin = async () => {
  try {
    console.log('Iniciando autenticación de admin...');
    
    // Limpiar cualquier sesión existente
    pb.authStore.clear();
    
    // Esperar 3 segundos antes de intentar autenticar
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const authData = await pb.admins.authWithPassword(
      'admin@admin.com',
      'admin12345'
    );
    
    if (!authData) {
      throw new Error('No se pudo autenticar como admin');
    }
    
    console.log('Token de autenticación:', pb.authStore.token);
    console.log('Autenticación de admin exitosa');
    
    // Esperar 2 segundos después de la autenticación
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return authData;
  } catch (error) {
    console.error('Error en la autenticación de admin:', error);
    throw error;
  }
};