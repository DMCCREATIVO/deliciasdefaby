import { pb } from './client';

// Variable para controlar si ya estamos autenticados como admin
let isAdminAuthenticated = false;

// Función para autenticar como administrador
export async function authenticateAsAdmin(): Promise<boolean> {
  // Si ya estamos autenticados como admin, no volver a autenticar
  if (isAdminAuthenticated && pb.authStore.isValid && pb.authStore.isAdmin) {
    console.log('✅ Ya estamos autenticados como administrador');
    return true;
  }
  
  try {
    // Autenticar como administrador de PocketBase con las credenciales reales
    await pb.admins.authWithPassword('dmccreativo@gmail.com', 'Dayn2614@#@');
    console.log('✅ Autenticación como administrador de PocketBase exitosa');
    isAdminAuthenticated = true;
    return true;
  } catch (error: any) {
    console.error('❌ Error en autenticación de administrador:', error.message);
    isAdminAuthenticated = false;
    return false;
  }
}

// Función para verificar si tenemos permisos de administrador
export function hasAdminPermissions(): boolean {
  return isAdminAuthenticated && pb.authStore.isValid && pb.authStore.isAdmin;
}

// Función para limpiar la autenticación (si es necesario)
export function clearAdminAuth() {
  isAdminAuthenticated = false;
  pb.authStore.clear();
  console.log('🧹 Autenticación de administrador limpiada');
}

// Wrapper para operaciones administrativas
export async function withAdminAuth<T>(
  operation: () => Promise<T>
): Promise<T> {
  const isAuthenticated = await authenticateAsAdmin();
  
  if (!isAuthenticated) {
    throw new Error('No se tienen permisos de administrador. Verifica las credenciales del administrador de PocketBase.');
  }
  
  try {
    return await operation();
  } catch {
    // Si hay un error, no limpiamos la autenticación para mantener la sesión
    console.log('⚠️ Error en operación, manteniendo sesión de administrador');
  }
}
